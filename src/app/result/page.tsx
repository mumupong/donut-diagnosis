"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { DONUT_TYPES } from "../../constants/questions";
import { Suspense } from "react";
import Image from "next/image";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const typeId = searchParams.get("type");
  const result = typeId ? DONUT_TYPES[typeId] : null;

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50 font-sans">
        <button onClick={() => router.push("/diagnosis")} className="text-orange-600 underline">診断をやり直す</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-orange-50 p-6 text-gray-800 font-sans">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border-2 border-orange-100">

        {/* ヘッダーエリア */}
        <div className="bg-orange-500 p-6 text-white text-center">
          <p className="text-sm font-bold opacity-90 mb-1">あなたの「生地」の資質診断</p>
          <h1 className="text-2xl font-black">診断結果</h1>
        </div>

        <div className="p-8 space-y-8">
          {/* 画像表示エリア */}
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <Image
                src={result.image}
                alt={result.donutName}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-black text-gray-800 mb-2">{result.donutName}</h2>
            <div className="inline-block px-6 py-2 bg-orange-100 rounded-full text-orange-800 font-bold text-lg">
              「{result.name}」を大切にする人
            </div>
          </div>

          {/* 解説セクション */}
          <div className="space-y-6">
            <div className="bg-white border-l-4 border-orange-400 pl-4 py-2">
              <h3 className="font-bold text-orange-600 mb-1 italic">本来の資質</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{result.essence}</p>
            </div>

            <div className="bg-orange-50 rounded-3xl p-6">
              <h3 className="font-bold text-orange-800 mb-2 text-center text-sm">🍩 大切にしていること</h3>
              <p className="text-sm text-gray-700 leading-relaxed text-center">{result.values}</p>
            </div>
          </div>

          {/* ボタン */}
          <button
            onClick={() => router.push("/diagnosis")}
            className="w-full py-4 border-2 border-orange-200 text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-all active:scale-95"
          >
            もう一度診断する
          </button>

          <p className="text-center text-[10px] text-gray-400">
            ドーナツ・メソッド：あなたの「ある」に光をあてる
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-orange-50 flex items-center justify-center">診断結果を準備中...</div>}>
      <ResultContent />
    </Suspense>
  );
}