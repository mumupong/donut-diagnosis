"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "../../constants/questions";

export default function DiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (typeId: string) => {
    // 連打防止とスムーズな遷移のためのフラグ
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newAnswers = [...answers, typeId];
    setAnswers(newAnswers);

    // 少しだけ間を置いてから次へ（これで「選んだ」感覚を作ります）
    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
        // 画面の最上部へスクロール（スムーズな体験のため）
        window.scrollTo(0, 0);
      } else {
        setIsTransitioning(false);
      }
    }, 300);
  };

  const goToResult = () => {
    if (answers.length < QUESTIONS.length) return;

    const counts = answers.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resultId = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    router.push(`/result?type=${resultId}`);
  };

  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6 text-gray-800 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-2 border-orange-100">

        <div className="w-full bg-orange-100 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-orange-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {answers.length < QUESTIONS.length ? (
          /* key={currentStep} を入れることで、質問ごとにボタンの状態をリセットします */
          <div key={currentStep} className="animate-in fade-in duration-500">
            <p className="text-orange-500 font-bold mb-2 text-sm text-center">
              質問 {currentStep + 1} / {QUESTIONS.length}
            </p>
            <h2 className="text-xl font-bold text-gray-800 mb-8 leading-snug text-center">
              {QUESTIONS[currentStep].text}
            </h2>

            <div className="space-y-4">
              {QUESTIONS[currentStep].options.map((option, index) => (
                <button
                  key={`${currentStep}-${index}`}
                  onClick={() => handleAnswer(option.typeId)}
                  disabled={isTransitioning}
                  className="w-full p-4 text-left border-2 border-orange-100 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-all active:scale-95 text-gray-700 bg-white focus:outline-none"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 animate-in zoom-in duration-500">
            <div className="text-6xl mb-6">🍩</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">診断が完了しました！</h2>
            <p className="text-gray-500 mb-8">あなたの「生地」の資質を分析しました。</p>
            <button
              onClick={goToResult}
              className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-700 transition-all active:scale-95 animate-bounce"
            >
              診断結果を見る 🍩
            </button>
          </div>
        )}
      </div>
    </div>
  );
}