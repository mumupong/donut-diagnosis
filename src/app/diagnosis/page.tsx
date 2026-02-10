"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "../../constants/questions";

export default function DiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (typeId: string) => {
    const newAnswers = [...answers, typeId];
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
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

        {/* プログレスバー */}
        <div className="w-full bg-orange-100 h-2 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-orange-500 h-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 質問回答中の表示 */}
        {answers.length < QUESTIONS.length ? (
          <>
            <p className="text-orange-500 font-bold mb-2 text-sm text-center">
              質問 {currentStep + 1} / {QUESTIONS.length}
            </p>
            <h2 className="text-xl font-bold text-gray-800 mb-8 leading-snug text-center">
              {QUESTIONS[currentStep].text}
            </h2>

            <div className="space-y-4">
              {QUESTIONS[currentStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option.typeId)}
                  className="w-full p-4 text-left border-2 border-orange-100 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-all active:scale-95 text-gray-700 bg-white"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </>
        ) : (
          /* 全問回答後のスッキリした表示 */
          <div className="text-center py-8">
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