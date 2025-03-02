"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Ruyalar from "../data/RuyaTonlari.json"
import { set } from "mongoose";


export default function RuyaTasarla() {
  const router = useRouter();
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    mekan: "",
    eylem: "",
    karakter: "",
    ton: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

try {

  const response=await fetch("/api/ruya-olustur",{
method:"POST",
headers: {
  "Content-Type": "application/json",
},
body: JSON.stringify(formData),
  })
  if (!response.ok) {
    throw new Error("Rüya oluşturulamadı");
  }

  const data=await response.json()
 const ruya_id=data.id;
 router.push(`/ruya/${ruya_id}`);
 setLoading(false);

} catch (error) {
  console.error("Hata:", error);
      alert("Rüya oluştururken bir hata oluştu. Lütfen tekrar deneyin.");
}
   
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300 ">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700"> Oluşturuluyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
 <form 
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md rounded-xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-white mb-8">Rüyanı Tasarla</h2>
        
        <div className="space-y-2">
          <label className="block text-white">Mekan:</label>
          <select
          required
            value={formData.mekan || ""} // undefined ise boş string döndür
            onChange={(e) => setFormData({
              ...formData,
              mekan: e.target.value
            })}
            className="w-full p-3 rounded-lg bg-white/20  placeholder-white/50"
          >
          <option value="" className="text-black">Mekan seçin...</option>
          {Ruyalar.mekanlar.map((mekan,index)=>(
          <option className="text-black" key={index} value={mekan}>{mekan}</option>
          ))}
        </select>
        </div>

        <div className="space-y-2">
          <label className="block text-white">Eylem:</label>
          <select
          required
            value={formData.eylem || ""}
            onChange={(e) => setFormData({
              ...formData,
              eylem: e.target.value
            }
          
          )}
          className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50"
            >
         <option value="" className="text-black">Eylem seçin...</option> 
    {Ruyalar.eylemler.map((eylem, index) => (
      <option className="text-black" key={index} value={eylem}>{eylem}</option>
    ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-white">Karakter:</label>
          <select
          required
            value={formData.karakter || ""}
            onChange={(e) => setFormData({
              ...formData,
              karakter: e.target.value
            })}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50"
          >
            
            <option value="" className="text-black">Karakter seçin...</option> 
    {Ruyalar.karakterler.map((karakter, index) => (
      <option className="text-black" key={index} value={karakter}>{karakter}</option>
    ))}</select>
        </div>

        <div className="space-y-2">
          <label className="block text-white">Ton:</label>
          <select
          required
            value={formData.ton || ""} 
            onChange={(e) => setFormData({
              ...formData,
              ton: e.target.value
            })}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50"
           
          >
    <option value="" className="text-black">Ton seçin...</option> 
    {Object.keys(Ruyalar.tonlar).map((ton, index) => (
      <option className="text-black" key={index} value={ton}>{ton.charAt(0).toUpperCase() + ton.slice(1)}</option> // Tonları büyük harf ile göster
    ))}


          </select>
        </div>

        <button
          type="submit"
    
          className="w-full p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          Rüyamı Gör
        </button>
      </form>
    </div>
  );
} 