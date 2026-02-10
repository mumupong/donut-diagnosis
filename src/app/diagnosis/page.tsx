"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "../../constants/questions";

export default function DiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showReview, setShowReview] = useState(false); // 確認画面の表示管理
  const [isEditMode, setIsEditMode] = useState(false); // 修正モードのフラグ

  const handleAnswer = (typeId: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const newAnswers = [...answers];
    newAnswers[currentStep] = typeId;
    setAnswers(newAnswers);

    setTimeout(() => {
      setIsTransitioning(false);
      // 修正モードなら確認画面へ戻る、そうでなければ次へ
      if (isEditMode) {
        setIsEditMode(false);
        setShowReview(true);
      } else {
        if (currentStep < QUESTIONS.length - 1) {
          setCurrentStep(currentStep + 1);
          window.scrollTo(0, 0);
        } else {
          setShowReview(false); // デフォルトは結果ボタンへ
          setCurrentStep(QUESTIONS.length);
        }
      }
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const startEdit = (index: number) => {
    setIsEditMode(true);
    setShowReview(false);
    setCurrentStep(index);
  };

  const goToResult = () => {
    const counts = answers.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const resultId = Object.keys(counts).reduce((a, b) =>
      counts[a] > counts[b] ? a : b
    );

    router.push(`/result?type=${resultId}`);
  };

  const progress = Math.min(((currentStep + 1) / QUESTIONS.length) * 100, 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 p-6 text-gray-800 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border-2 border-orange-100 relative overflow-hidden min-h-[500px] flex flex-col">

        {/* プログレスバー */}
        <div className="w-full bg-orange-100 h-2 rounded-full mb-8 overflow-hidden">
          <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex-grow">
          {!showReview && currentStep < QUESTIONS.length ? (
            <div key={currentStep} className="animate-in fade-in duration-500">
              <p className="text-orange-500 font-bold mb-2 text-sm text-center">質問 {currentStep + 1} / {QUESTIONS.length}</p>
              <h2 className="text-xl font-bold text-gray-800 mb-8 leading-snug text-center">{QUESTIONS[currentStep].text}</h2>
              <div className="space-y-4">
                {QUESTIONS[currentStep].options.map((option, index) => (
                  <button
                    key={`${currentStep}-${index}`}
                    onClick={() => handleAnswer(option.typeId)}
                    disabled={isTransitioning}
                    className="w-full p-4 text-left border-2 border-orange-100 rounded-2xl hover:border-orange-400 hover:bg-orange-50 transition-all text-gray-700 bg-white shadow-sm"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          ) : showReview ? (
            /* 確認画面（オプション） */
            <div className="animate-in zoom-in duration-500">
              <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">回答の確認</h2>
              <div className="space-y-3 mb-8">
                {QUESTIONS.map((q, i) => (
                  <div key={i} className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex justify-between items-center gap-4">
                    <div className="flex-grow">
                      <p className="text-[10px] text-orange-400 font-bold">Q{i + 1}</p>
                      <p className="text-sm font-bold text-orange-900 leading-tight">
                        {q.options.find(o => o.typeId === answers[i])?.text}
                      </p>
                    </div>
                    <button
                      onClick={() => startEdit(i)}
                      className="shrink-0 py-2 px-4 border border-orange-300 rounded-xl text-xs text-orange-600 bg-white font-bold hover:bg-orange-500 hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      修正する ✎
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={goToResult} className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-700 transition-all mb-4">
                この内容で診断結果を見る 🍩
              </button>
            </div>
          ) : (
            /* 3問終了後のメイン選択 */
            <div className="text-center py-8 animate-in zoom-in duration-500">
              <div className="text-6xl mb-6">🍩</div>
              <h2 className="text-2xl font-bold mb-8 text-gray-800 font-black">準備が整いました！</h2>
              <button
                onClick={goToResult}
                className="w-full py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-700 transition-all animate-bounce mb-6"
              >
                診断結果を見る 🍩
              </button>
              <button onClick={() => setShowReview(true)} className="text-gray-400 text-sm font-bold hover:text-orange-500 transition-colors underline">
                回答の内容を確認・修正する
              </button>
            </div>
          )}
        </div>

        {/* 左下の控えめな戻るボタン（回答中、かつ1問目以外のみ表示） */}
        {!showReview && currentStep > 0 && currentStep < QUESTIONS.length && (
          <div className="mt-8">
            <button
              onClick={handleBack}
              className="text-gray-300 text-sm font-bold hover:text-gray-500 transition-colors"
            >
              ← 戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}