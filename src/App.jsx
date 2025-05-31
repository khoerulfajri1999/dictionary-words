import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const Dictionary = () => {
  const [input, setInput] = useState("");
  const [words, setWords] = useState([]);

  const fetchWords = async () => {
    const q = query(collection(db, "dictionaryWords"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const loadedWords = [];
    querySnapshot.forEach((doc) => {
      loadedWords.push({ id: doc.id, ...doc.data() });
    });
    setWords(loadedWords);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const matches = input.match(/\(([^)]+)\)/g);
  
    if (!matches) {
      alert("Format input salah. Gunakan format (kata=arti)(kata=arti)...");
      return;
    }
  
    const newWords = matches
      .map((entry) => {
        const cleanEntry = entry.slice(1, -1);
        const [english, meaning] = cleanEntry.split("=");
        if (english && meaning) {
          return { english: english.trim(), meaning: meaning.trim(), createdAt: new Date() };
        }
        return null;
      })
      .filter(Boolean);
  
    for (const word of newWords) {
      await addDoc(collection(db, "dictionaryWords"), word);
    }
  
    setInput("");
    fetchWords();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "dictionaryWords", id));
    fetchWords();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6 font-sans">
      <div className="mt-5 container mx-auto bg-white rounded-3xl shadow-xl p-8 transition duration-300">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">📘 Kamus Bahasa Inggris</h1>

        <div className="mb-6 text-center">
          <Link to="/preview" className="text-indigo-600 hover:underline font-semibold">
            Lihat Preview Kamus
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            className="w-full border border-indigo-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none rounded-lg p-3 text-lg transition"
            placeholder="Masukkan kata seperti: (fun=menyenangkan)(girl=perempuan)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <span className="text-white text-xl">➕</span> Tambah Kata
          </button>
        </form>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {words.map((word) => (
            <li
              key={word.id}
              className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 hover:bg-indigo-100 transition flex justify-between items-start"
            >
              <div>
                <span className="text-indigo-700 font-semibold">{word.english}</span>
                <span className="text-gray-600"> = {word.meaning}</span>
              </div>
              <button
                onClick={() => handleDelete(word.id)}
                className="text-red-500 hover:text-red-700 text-sm font-semibold"
                title="Hapus kata"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Preview = () => {
  const [words, setWords] = useState([]);

  const fetchWords = async () => {
    const querySnapshot = await getDocs(collection(db, "dictionaryWords"));
    const loadedWords = [];
    querySnapshot.forEach((doc) => {
      loadedWords.push({ id: doc.id, ...doc.data() });
    });
    loadedWords.sort((a, b) =>
      a.english.toLowerCase().localeCompare(b.english.toLowerCase())
    );
    setWords(loadedWords);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6 font-sans">
      <div className="mt-5 container mx-auto bg-white rounded-3xl shadow-xl p-8 transition duration-300">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">📖 Preview Kamus</h1>

        <div className="mb-6 text-center">
          <Link to="/" className="text-indigo-600 hover:underline font-semibold">
            Kembali ke Halaman Utama
          </Link>
        </div>

        <div className="mb-4 text-indigo-700 font-semibold text-center">
          Total kata: {words.length}
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {words.map((word) => (
            <li
              key={word.id}
              className="bg-indigo-50 border border-indigo-200 rounded-lg p-3"
            >
              <div>
                <span className="text-indigo-700 font-semibold">{word.english}</span>
                <span className="text-gray-600"> = {word.meaning}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dictionary />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </Router>
  );
};

export default App;
