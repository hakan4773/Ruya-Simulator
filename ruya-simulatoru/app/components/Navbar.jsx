import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black/30 backdrop-blur-sm fixed w-full z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white text-xl font-bold">
            Rüya Simülatörü
          </Link>
          
          <div className="flex space-x-4">
            <Link href="/arsiv" className="text-white hover:text-purple-300">
              Rüya Arşivim
            </Link>
            <Link href="/topluluk" className="text-white hover:text-purple-300">
              Topluluk Rüyaları
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 