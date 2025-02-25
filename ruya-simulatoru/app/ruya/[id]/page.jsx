"use client"
import React, { useEffect, useState } from "react";

export default function RuyaGoster({params}) {
  const paramsData = React.use(params); 
  const { id } = paramsData;
  const [myDream,setMydream]=useState(null);
  const [loading, setLoading] = useState(true);
  const [isShared, setIsShared] = useState(false);
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
      const utterance = new SpeechSynthesisUtterance(myDream.story);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };




  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div>
        <p className="mt-4 text-lg text-gray-700">Oluşturuluyor...</p>
      </div>
    );
  }

  //paylaşma
const handleShare=async(isShared)=> {
try {
  const response =await fetch(`/api/ruya-olustur/${id}`,  
    { method: "PUT",body: JSON.stringify({ isShare: !isShared })
    ,headers: { "Content-Type": "application/json" },}); 
 
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
          {myDream?.story || "Rüya yüklenemedi."}
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
          <button className="flex-1 p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          onClick={()=>handleShare(!isShared)}
          
          >
            Paylaş
          </button>
        </div>
      </div>
    </div>
  );
} 