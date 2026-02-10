import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border-4 border-orange-200">
        <div className="text-6xl mb-6">🍩</div>
        <h1 className="text-3xl font-extrabold text-orange-900 mb-4">
          ドーナツ診断
        </h1>
        <p className="text-orange-700 mb-8 leading-relaxed">
          自分に「ないもの（穴）」ではなく、<br />
          今「あるもの（生地）」を見つけよう。
        </p>
        
        <Link 
          href="/diagnosis" 
          className="inline-block w-full py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 text-lg"
        >
          診断をはじめる
        </Link>
      </div>
    </main>
  );
}
