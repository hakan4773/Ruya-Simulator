"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Home() {
const router=useRouter();
const handleNewDream=async()=>{
  router.push('/ruya/rastgele');
}
  
  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-12">
        <h1 className="text-5xl font-bold text-white mb-8">Rüya Simülatörü</h1>
        
        <div className="space-y-6 flex flex-col justify-center items-center">
          <Link 
            href="/ruya-tasarla" 
            className="block w-64 p-4 text-xl bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Kendi Rüyamı Tasarla
          </Link>
          
          <button 
           onClick={handleNewDream}
            className="block w-64 p-4 text-xl bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Beni Şaşırt (Rastgele Rüya)
          </button>
        </div>
      </div>
    </div>
  );
} 