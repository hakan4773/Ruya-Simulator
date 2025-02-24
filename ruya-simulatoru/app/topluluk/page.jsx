import Image from "next/image";
import Link from "next/link";

export default function Topluluk() {
  return (
    <div className="container mx-auto py-24 px-4">
      <h1 className="text-4xl font-bold text-white mb-12">Topluluk Rüyaları</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bu kısım API'den gelen verilerle doldurulacak */}
        {[1, 2, 3].map((id) => (
          <Link 
            key={id}
            href={`/ruya/${id}`}
            className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/20 transition-colors"
          >
            <div className="relative w-full h-48">
              <Image
                src="/placeholder-dream.jpg"
                alt="Rüya Önizleme"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl text-white font-semibold mb-2">
                Rüya Başlığı
              </h3>
              <p className="text-white/80">
                Kısa rüya açıklaması...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 