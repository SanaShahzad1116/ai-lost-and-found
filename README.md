# AI-Powered Lost & Found

A full-stack MERN application with an AI-powered matching microservice
that connects lost items with found items using semantic similarity.

## Architecture
[React Frontend] → [Node/Express Backend] → [MongoDB Atlas]
                                ↓
                    [Python FastAPI AI Service] → [Hugging Face API]

## Tech Stack
- Frontend: React (Vite), Axios, React Router
- Backend: Node.js, Express, MongoDB (Mongoose), JWT Auth
- AI Service: Python, FastAPI, Hugging Face Sentence-Similarity API
- DevOps: Docker, Docker Compose, GitHub Actions (CI), Render, Vercel

## Features
- User authentication (JWT)
- Post lost/found items with image upload (Cloudinary)
- Browse and filter items
- AI-powered semantic matching between lost and found items
- Fully containerized with Docker Compose
- CI pipeline via GitHub Actions

## Running Locally
See setup instructions in /backend, /frontend, /ai-service, or run
`docker compose up --build` from the root (requires a .env file — see .env.example).