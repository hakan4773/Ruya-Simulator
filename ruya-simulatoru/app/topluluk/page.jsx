"use client"
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Topluluk() {
const [stories,setStories]=useState([]);

useEffect(()=>{
async function fetchStory() {
try {
    const response =await fetch("/api/ruya-olustur");
    if (!response.ok) {
      throw new Error("Veri çekme başarısız.");
    }
    const data=await response.json();
    setStories(data)

  } catch (error) {
  console.error("Hata oluştu",error)

}


}
fetchStory();

},[])

  return (
     <div className="container mx-auto py-24 px-4">
      <h1 className="text-4xl font-bold text-white mb-12">Topluluk Rüyaları</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.length > 0 ? (
          stories.map((story) => (
            <Link
              key={story._id}
              href={`/ruya/${story._id}`}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/20 transition-colors"
            >
              <div className="relative w-full ">
                <Image
             src={`data:image/png;base64,${story.image}`}
             alt={"Rüya"}
                  className="object-cover"
                  width={500}
                  height={100}  
                />
              </div>
              <div className="p-4">
                <p className="text-white/80">
                  {story.story ? story.story.substring(0, 80) + "..." : "Kısa rüya açıklaması..."} <span className="text-white/50 underline">Devamını oku</span> 
                </p>
              </div>


            </Link>
          ))
        ) : (
          <p className="text-white">Henüz rüya paylaşılmamış.</p>
        )}
      </div>
    </div>
  );
}
