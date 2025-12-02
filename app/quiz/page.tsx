'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    question: 'What is your face shape?',
    options: [
      { text: 'Round', value: 'round' },
      { text: 'Square', value: 'square' },
      { text: 'Oval', value: 'oval' },
      { text: 'Heart', value: 'heart' },
    ],
  },
  {
    id: 2,
    question: 'What is your preferred style?',
    options: [
      { text: 'Classic', value: 'classic' },
      { text: 'Modern', value: 'modern' },
      { text: 'Trendy', value: 'trendy' },
      { text: 'Bold', value: 'bold' },
    ],
  },
  {
    id: 3,
    question: 'What frame material do you prefer?',
    options: [
      { text: 'Metal', value: 'metal' },
      { text: 'Acetate', value: 'acetate' },
      { text: 'Titanium', value: 'titanium' },
      { text: 'No preference', value: 'none' },
    ],
  },
  {
    id: 4,
    question: 'What is your budget?',
    options: [
      { text: 'Under $100', value: 'budget' },
      { text: '$100-$300', value: 'midrange' },
      { text: '$300+', value: 'premium' },
      { text: 'No limit', value: 'luxury' },
    ],
  },
  {
    id: 5,
    question: 'What is your lifestyle?',
    options: [
      { text: 'Professional', value: 'professional' },
      { text: 'Casual', value: 'casual' },
      { text: 'Active/Sports', value: 'active' },
      { text: 'Mix of all', value: 'mix' },
    ],
  },
];

export default function StyleQuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestion].id]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length === quizQuestions.length) {
      setShowResults(true);
    } else {
      alert('Please answer all questions');
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const isAnswered = currentQ.id in answers;
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={20} className="text-gray-600" />
              <span className="text-gray-600 hover:text-gray-900">Back</span>
            </Link>
            <h1 className="text-xl font-light">Your Style Profile</h1>
            <div className="w-16"></div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-light mb-4">Your Perfect Style Match Found!</h2>
            <p className="text-gray-600 mb-8">
              Based on your answers, we've created a personalized recommendation just for you.
            </p>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 mb-8 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
              <div className="grid grid-cols-2 gap-4 text-left">
                {quizQuestions.map(q => (
                  <div key={q.id} className="text-sm">
                    <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">
                      {q.question}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {q.options.find(o => o.value === answers[q.id])?.text || 'Not answered'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/collections/men"
                className="block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-light"
              >
                Browse Recommendations
              </Link>
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResults(false);
                }}
                className="block w-full px-8 py-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-light"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/20 to-white">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={20} className="text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900">Back</span>
          </Link>
          <h1 className="text-xl font-light">Style Quiz</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-light text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm font-light text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-12">
          <h2 className="text-3xl font-light mb-8 text-center text-gray-900">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentQ.options.map(option => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  answers[currentQ.id] === option.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-light text-gray-900">{option.text}</span>
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className={`flex-1 py-3 px-4 rounded-lg border-2 border-gray-900 font-light transition-colors ${
                currentQuestion === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-50'
              }`}
            >
              <ArrowLeft size={16} className="mx-auto" />
            </button>

            {currentQuestion < quizQuestions.length - 1 ? (
              <button
                onClick={nextQuestion}
                disabled={!isAnswered}
                className={`flex-1 py-3 px-4 rounded-lg font-light transition-colors ${
                  isAnswered
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ArrowRight size={16} className="mx-auto" />
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                disabled={!isAnswered}
                className={`flex-1 py-3 px-4 rounded-lg font-light transition-colors ${
                  isAnswered
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Get Results
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
