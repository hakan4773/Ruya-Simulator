"use client"
import React, { useEffect, useState } from 'react'

function page({params}) {
  const paramsData=React.use(params);
  const {id}=paramsData;
const [randomStories, setRandomStories] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
 

useEffect(() => {
  async function fetchRandomStories() {
    setLoading(true);

    try{
const response=await fetch(`/api/random-ruya`);
if(!response.ok){
  throw new Error('API hatası');  
}
const data=await response.json();
setRandomStories(data);
setLoading(false);

    }
    catch(error){
      console.error(error);
      setError(error);
    }
  }

fetchRandomStories();
}, []);

const handleSpeak = () => {
if(randomStories && randomStories.story){
const utterance =new SpeechSynthesisUtterance(randomStories.story);
//utterance.lang='en-US';
utterance.lang='tr-TR';
window.speechSynthesis.speak(utterance);
}
};

if(loading){
  return(
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="loader"></div>
      <p className="mt-4 text-lg text-gray-700">Oluşturuluyor...</p>
    </div>
  );
}

  return (

    <div className='container mx-auto  flex flex-col items-center justify-center min-h-screen '>
 <div className="bg-black/30 backdrop-blur-md rounded-xl p-8 w-full max-w-4xl">
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
