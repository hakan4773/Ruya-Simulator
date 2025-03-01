"use client"
import React, { useEffect, useState } from "react";

export default function RuyaGoster({params}) {
  const paramsData = React.use(params);
  const { id } = paramsData;
  const [myDream,setMydream]=useState(null);
  const [loading, setLoading] = useState(true);
  const [isShared, setIsShared] = useState(null);
  const [translatedStory, setTranslatedStory] = useState(myDream?.story);
  const [selectedLang, setSelectedLang] = useState("en");
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
    useEffect(()=>{
  async function RuyaGetir() {
 try {
  const response=await fetch(`/api/ruya-olustur/${id}`);
  const data=await response.json();

  if(!response.ok){
    const errorText = await response.text();
    throw new Error(`Rüya yüklenemedi: ${errorText || response.statusText}`);

  }
  setMydream(data)
  setIsShared(data.isShare); 
  setLoading(false);
 } catch (error) {
  console.error("erorr: ",error)
 }
  }

RuyaGetir();

  },[])
  
  //seslendirme
  const handleSpeak = () => {
    if (myDream && myDream.story) {
      const utterance = new SpeechSynthesisUtterance(translatedStory || myDream.story);
      utterance.lang = selectedLang;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  //çeviri fonksiyonu
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
        <p className="mt-4 text-lg text-gray-700"> Oluşturuluyor...</p>
      </div>
    );
  }
  if (loadingTranslate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-200"> Çevriliyor...Lütfen bekleyin...</p>
      </div>
    );
  }
  //paylaşma
const handleShare=async()=> {
try {
  const currentIsShared = isShared; 
  
  const response =await fetch(`/api/ruya-olustur/${id}`,  
    { method: "PUT",body: JSON.stringify({ isShare:! currentIsShared })
    ,headers: { "Content-Type": "application/json" }}); 

    if (!response.ok) {
      const errorText = await response.text(); 
    throw new Error(`Rüya paylaşılamadı: ${errorText || response.statusText}`);
  }
  const data=await response.json();
setIsShared(data.isShare);
} catch (error) {
  console.error("Hata oluştu:", error);
 
}

}
  
  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
      <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 w-full max-w-4xl">
      <div className="relative w-full  mb-6">
      {myDream?.image && (
        <img
          src={`data:image/png;base64,${myDream.image}`}
          alt={myDream.story}
          style={{ maxWidth: '100%' }}
          className="w-[900px] h-[600px]"
        />
      )}
        </div>

        <p className="text-white text-lg mb-8">
          {/* Rüya metni API'den gelecek */}
          {translatedStory || myDream?.story}
                  </p>
          <div>
              <select className="text-black p-1" value={selectedLang}  onChange={(e)=>setSelectedLang(e.target.value)} >
              <option value="en">English</option>
              <option value="tr">Türkçe</option>
              <option value="es">Español</option>
          </select>
          <button onClick={handleTranslate} className="m-3 bg-red-500 p-1 rounded-md hover:bg-red-600"
          >Çevir</button>
          </div>   
        <div className="flex space-x-4">
        {isSpeaking ? ( 
    
  <button
onClick={() => {  window.speechSynthesis.cancel(); setIsSpeaking(false); }}
className="flex-1 p-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
Durdur
</button>
        ) :(

            <button
            onClick={handleSpeak}
            className="flex-1 p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
          Seslendir  
          </button> 
        )}
         
          <button className="flex-1 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Devam Et
          </button>
          <button className="flex-1 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Arşive Ekle
          </button>
          <button className="flex-1 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          onClick={handleShare}
          
          >
          {
            isShared ? "Paylaşıldı" : "Paylaş"
          }  
          </button>
        </div>
      </div>
    </div>
  );
} 