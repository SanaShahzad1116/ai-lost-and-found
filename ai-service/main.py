from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
import requests
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"

# MongoDB connect
client = MongoClient(MONGO_URI)
db = client.get_database("lostfound")
items_collection = db["items"]

app = FastAPI(title="Lost & Found AI Matching Service")

# Node backend (localhost:5000) is service ko call kar sake, isliye CORS allow karo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "OK", "service": "AI Matching Service"}


@app.get("/match/{item_id}")
def get_matches(item_id: str):
    # Item dhoondo jis ke matches chahiye
    try:
        item = items_collection.find_one({"_id": ObjectId(item_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid item ID")

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    # Agar item 'lost' hai to 'found' items mein dhoondo, aur vice versa
    opposite_type = "found" if item["type"] == "lost" else "lost"
    candidates = list(items_collection.find({"type": opposite_type, "status": "open"}))

    if not candidates:
        return {"matches": []}

    candidate_texts = [c["description"] for c in candidates]

    # Hugging Face Sentence Similarity API call
    response = requests.post(
        HF_MODEL_URL,
        headers={"Authorization": f"Bearer {HF_API_TOKEN}"},
        json={
            "inputs": {
                "source_sentence": item["description"],
                "sentences": candidate_texts,
            }
        },
        timeout=30,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"Hugging Face API error: {response.text}",
        )

    scores = response.json()

    # Candidates ko similarity score ke sath jorho
    results = []
    for candidate, score in zip(candidates, scores):
        results.append({
            "id": str(candidate["_id"]),
            "title": candidate["title"],
            "description": candidate["description"],
            "location": candidate["location"],
            "imageUrl": candidate.get("imageUrl", ""),
            "similarity": round(float(score), 3),
        })

    # Highest similarity pehle
    results.sort(key=lambda x: x["similarity"], reverse=True)

    return {"matches": results[:5]}