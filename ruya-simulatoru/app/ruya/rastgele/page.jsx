"use client"
import React, { useEffect, useState } from 'react'

function page() {
const [randomStories, setRandomStories] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
 
useEffect(() => {
  async function fetchRandomStories() {
    try {
      const response = await fetch("/api/random-ruya", {
        method: "GET",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Rastgele rüya oluşturulamadı: ${response.status} - ${errorText || response.statusText}`);
      }
      const data = await response.json();
      setRandomStories(data);
    } catch (error) {
      console.error("Rastgele rüya hatası:", error);
      setError(error.message);
    } finally {
      setLoading(false); // Yükleme durumunu her durumda kapat
    }
  }
  fetchRandomStories();
}, []);

const handleNewDream = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch("/api/random-ruya", {
      method: "GET",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Rastgele rüya oluşturulamadı: ${response.status} - ${errorText || response.statusText}`);
    }
    const data = await response.json();
    setRandomStories(data);
  } catch (error) {
    setError(error.message);
    console.error("Yeni rüya hatası:", error);
  } finally {
    setLoading(false);
  }
};
const handleSpeak = () => {
  if (randomStories && randomStories.story) {
    const utterance = new SpeechSynthesisUtterance(randomStories.story);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }
};

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300 ">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-700">Rastgele rüyanız Oluşturuluyor...</p>
    </div>
  );
}
if (error) {
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
      <div className="text-red-500 text-center mt-10">Hata: {error}</div>
    </div>
  );
}

  return (

    <div className='container mx-auto  flex flex-col items-center justify-center min-h-screen  py-8'>
 <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 w-full max-w-4xl">
        <button
          onClick={handleNewDream}
          className="mb-6 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Yeni Rüya Oluştur
        </button>



      <div className="relative w-full  mb-6">
      {randomStories?.image && (
        <img
          src={`data:image/png;base64,${randomStories.image}`}
          alt={randomStories.story}
          style={{ maxWidth: '100%' }}
          className="w-[900px] h-[600px]"
        />
      )}
        </div>

        <p className="text-white text-lg mb-8">
          {/* Rüya metni API'den gelecek */}
          {randomStories?.story || "Rüya yüklenemedi."}
                  </p>

        <div className="flex space-x-4">
        <button 
             onClick={handleSpeak}
            className="flex-1 p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            Seslendir
          </button>
          <button className="flex-1 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Devam Et
          </button>
          <button className="flex-1 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Arşive Ekle
          </button>
          <button className="flex-1 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">            
            Paylaş
          </button>
        </div>
      </div>
    </div>
  )
}

export default page
