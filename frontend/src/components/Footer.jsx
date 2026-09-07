const Footer = () => (
  <footer className="mt-16 border-t border-slate-100 bg-white">
    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
      <p>© {new Date().getFullYear()} LostFound. Built with the MERN stack + AI matching.</p>
      <div className="flex gap-4">
        <a href="https://github.com/SanaShahzad1116/ai-lost-and-found" target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition">
          GitHub
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;