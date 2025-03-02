"use client"
import React, { useEffect, useState } from 'react'

function page() {
const [randomStories, setRandomStories] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

  const [isShared, setIsShared] = useState(null);
  const [translatedStory, setTranslatedStory] = useState(randomStories?.story);
  const [selectedLang, setSelectedLang] = useState("en");
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  //hikayeleyi getirme
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
      setLoading(false); 
    }
  }
  fetchRandomStories();
}, []);

//Yeni rüya oluşturma
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

//hikayeyi sesleştirme
const handleSpeak = () => {
  if (randomStories && randomStories.story) {
    const utterance = new SpeechSynthesisUtterance(randomStories.story);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  }
};
//hikayeyi çevirmek
const translateText = async (text, targetLang) => {
  setLoadingTranslate(true);
  try {
      const response = await fetch(`https://lingva.ml/api/v1/auto/${targetLang}/${encodeURIComponent(text)}`);
      const data = await response.json();
      setLoadingTranslate(false);  
      return data.translation;

  } catch (error) {
      console.error("Çeviri yapılamadı:", error);
  }

};
const handleTranslate=async()=> {
  if (myDream && myDream.story) {
    try {
      const translation = await translateText(myDream.story, selectedLang);
      setTranslatedStory(translation);
    } catch (error) {
      console.error("Çeviri yapılamadı:", error); 
  }

}}





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
if (loadingTranslate) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-200">
        {" "}
        Çevriliyor...Lütfen bekleyin...
      </p>
    </div>
  );
}

const handleShare = async () => {
  try {
    const currentIsShared = isShared;

    const response = await fetch(`/api/ruya-olustur/${id}`, {
      method: "PUT",
      body: JSON.stringify({ isShare: !currentIsShared }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Rüya paylaşılamadı: ${errorText || response.statusText}`
      );
    }
    const data = await response.json();
    setIsShared(data.isShare);
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
};


const handleFavorite = async () => {
  alert("Geliştirme aşamasında");
};


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
          {translatedStory?.story || "Rüya yüklenemedi."}
                  </p>
            
                    <h2 className="text-xl font-bold">Rüya Detayları</h2>
                    <div className="text-white mb-4 gap-3 flex flex-row flex-wrap ">
                      <div className="flex items-center space-x-2">
                        <span className=" font-bold">Mekan: </span> <p> {myDream?.mekan}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className=" font-bold">Eylem: </span> <p> {myDream?.eylem}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className=" font-bold">Karakter: </span>{" "}
                        <p> {myDream?.karakter}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className=" font-bold">Ton: </span> <p> {myDream?.ton}</p>
                      </div>
                    </div>
            
                    <div>
                      <select
                        className=" p-1  bg-transparent border-2 rounded-lg text-white"
                        value={selectedLang}
                        onChange={(e) => setSelectedLang(e.target.value)}
                      >
                        <option className="text-black" value="en">
                          English
                        </option>
                        <option className="text-black" value="tr">
                          Türkçe
                        </option>
                        <option className="text-black" value="es">
                          Español
                        </option>
                      </select>
                      <button
                        onClick={handleTranslate}
                        className="m-3 bg-red-500 p-1 w-20 rounded-md hover:bg-red-600"
                      >
                        Çevir
                      </button>
                    </div>
                    <div className="flex space-x-4">
                      {isSpeaking ? (
                        <button
                          onClick={() => {
                            window.speechSynthesis.cancel();
                            setIsSpeaking(false);
                          }}
                          className="flex-1 p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <div className="flex justify-center items-center">
                            <CiPause1 size={30} className=" text-white" />
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={handleSpeak}
                          className="flex-1 p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                        >
                          <div className="flex justify-center items-center">
                            <RiSpeakLine size={30} className=" text-white" />
                          </div>
                        </button>
                      )}
            
                      <button className="flex-1 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                        Devam Et
                      </button>
                      <button
                        onClick={handleFavorite}
                        className="flex-1 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Arşive Ekle
                      </button>
                      <button
                        className="flex-1 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        onClick={handleShare}
                      >
                        {isShared ? "Paylaşıldı" : "Paylaş"}
                      </button>
                    </div>
                  </div>
                </div>
  )
}

export default page
