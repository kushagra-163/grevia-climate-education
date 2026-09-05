import React, { useState } from 'react';
import { quizApi } from '../api/quizApi';
import { aiApi } from '../api/aiApi';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BrainCircuit, CheckCircle, XCircle, Sparkles, ArrowRight, RotateCcw, Clock } from 'lucide-react';

export const Quiz: React.FC = () => {
  const { updateUserPoints } = useAuthStore();

  const [topic, setTopic] = useState('energy');
  const [quiz, setQuiz] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  // AI explanation state
  const [aiExplanation, setAiExplanation] = useState<{ [index: number]: string }>({});
  const [loadingAi, setLoadingAi] = useState<{ [index: number]: boolean }>({});

  const topics = [
    { id: 'climate_science', label: 'Climate Science' },
    { id: 'energy', label: 'Energy & Transition' },
    { id: 'renewable_energy', label: 'Renewable Energy' },
    { id: 'waste', label: 'Waste & Circular Economy' },
    { id: 'water', label: 'Water Conservation' },
    { id: 'biodiversity', label: 'Biodiversity' },
    { id: 'transportation', label: 'Eco-Transportation' },
    { id: 'sustainable_living', label: 'Sustainable Living' },
  ];

  const handleStartQuiz = async () => {
    setLoading(true);
    setResult(null);
    setSelectedAnswers([]);
    setResponseTimes([]);
    setCurrentIndex(0);

    try {
      const res = await quizApi.generate({ topic });
      setQuiz(res.quiz);
      setQuestionStartTime(Date.now());
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionLetter: string) => {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    const newAnswers = [...selectedAnswers, optionLetter];
    const newTimes = [...responseTimes, elapsedSeconds];

    setSelectedAnswers(newAnswers);
    setResponseTimes(newTimes);

    if (currentIndex + 1 < quiz.questions.length) {
      setCurrentIndex(currentIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      handleSubmitQuiz(newAnswers, newTimes);
    }
  };

  const handleSubmitQuiz = async (answers: string[], times: number[]) => {
    setSubmitting(true);
    try {
      const res = await quizApi.submit(quiz._id, answers, times);
      setResult(res);
      updateUserPoints(res.pointsEarned);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Quiz submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFetchAiExplanation = async (qIndex: number, detail: any) => {
    setLoadingAi((prev) => ({ ...prev, [qIndex]: true }));
    try {
      const res = await aiApi.quizExplanation(
        detail.questionText,
        detail.userAnswer,
        detail.correctAnswer
      );
      setAiExplanation((prev) => ({ ...prev, [qIndex]: res.explanation }));
    } catch (err) {
      setAiExplanation((prev) => ({ ...prev, [qIndex]: 'Could not generate explanation.' }));
    } finally {
      setLoadingAi((prev) => ({ ...prev, [qIndex]: false }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center mx-auto text-earth-primary-light">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-black text-earth-text">Adaptive Climate Quiz Engine</h1>
        <p className="text-sm text-earth-muted">
          Test your knowledge. Higher accuracy and faster speed unlock advanced difficulty levels!
        </p>
      </div>

      {/* State 1: Topic Selection */}
      {!quiz && !result && (
        <Card className="p-8 space-y-6">
          <h3 className="font-bold text-earth-text text-lg">Select Climate Topic</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  topic === t.id
                    ? 'bg-earth-primary-soft border-earth-primary text-earth-primary-light font-bold shadow-sm'
                    : 'bg-earth-surface border-earth-border text-earth-muted hover:border-earth-border-strong hover:text-earth-text'
                }`}
              >
                <div className="text-sm font-semibold">{t.label}</div>
              </button>
            ))}
          </div>

          <Button onClick={handleStartQuiz} isLoading={loading} className="w-full space-x-2">
            <span>Generate Adaptive Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      )}

      {/* State 2: Active Quiz Runner */}
      {quiz && !result && (
        <Card className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="cyan">Topic: {quiz.topic}</Badge>
            <div className="flex items-center space-x-2 text-xs text-earth-muted font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Question {currentIndex + 1} of {quiz.questions.length}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-earth-secondary h-2 rounded-full overflow-hidden border border-earth-border">
            <div
              className="bg-earth-primary h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="py-4">
            <h2 className="text-xl font-extrabold text-earth-text leading-relaxed">
              {quiz.questions[currentIndex].question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {quiz.questions[currentIndex].options.map((opt: string, idx: number) => {
              const letter = String.fromCharCode(65 + idx); // "A", "B", "C", "D"
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(letter)}
                  className="w-full p-4 rounded-xl bg-earth-surface hover:bg-earth-primary-soft border border-earth-border hover:border-earth-primary/50 text-left transition-all flex items-center space-x-3 text-earth-text font-medium"
                >
                  <span className="w-7 h-7 rounded-lg bg-earth-secondary flex items-center justify-center text-xs font-bold text-earth-primary-light border border-earth-border shrink-0">
                    {letter}
                  </span>
                  <span className="text-sm">{opt}</span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* State 3: Quiz Score Summary & AI Explanations */}
      {result && (
        <div className="space-y-6">
          <Card className="p-8 text-center space-y-4 bg-earth-surface border-earth-primary/40">
            <div className="w-16 h-16 rounded-full bg-earth-primary-soft border border-earth-primary/40 flex items-center justify-center mx-auto text-earth-primary-light">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-black text-earth-text">Quiz Completed!</h2>
            <div className="text-4xl font-extrabold text-earth-primary-light">{result.percentage}% Score</div>

            <p className="text-sm text-earth-muted">
              Correct Answers: <span className="font-bold text-earth-text">{result.score} / {result.totalQuestions}</span> • Points Earned:{' '}
              <span className="font-bold text-earth-amber">+{result.pointsEarned} Pts</span>
            </p>

            <div className="inline-block pt-2">
              <Badge variant="emerald">Adaptive Skill Level: {result.newSkillLevel.toUpperCase()}</Badge>
            </div>

            <div className="pt-4 flex justify-center">
              <Button onClick={() => { setQuiz(null); setResult(null); }} className="space-x-2">
                <RotateCcw className="w-4 h-4" />
                <span>Take Another Quiz</span>
              </Button>
            </div>
          </Card>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-earth-text">Question Review & AI Explanations</h3>

            {result.detailedResults.map((detail: any, idx: number) => (
              <Card key={idx} className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {detail.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-earth-primary-light shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <h4 className="font-bold text-earth-text text-sm">Q{idx + 1}: {detail.questionText}</h4>
                  </div>
                  <Badge variant={detail.isCorrect ? 'emerald' : 'rose'}>
                    {detail.isCorrect ? 'Correct' : 'Incorrect'}
                  </Badge>
                </div>

                <div className="text-xs text-earth-muted space-y-1 pl-7">
                  <p>Your Answer: <span className="font-semibold text-earth-text">{detail.userAnswer}</span></p>
                  <p>Correct Answer: <span className="font-semibold text-earth-primary-light">{detail.correctAnswer}</span></p>
                  <p className="text-earth-subtle pt-1">Default Explanation: {detail.explanation}</p>
                </div>

                {/* AI Explanation Request */}
                <div className="pt-2 pl-7">
                  {aiExplanation[idx] ? (
                    <div className="p-3 rounded-xl bg-earth-secondary border border-earth-primary/30 text-xs text-earth-text leading-relaxed space-y-1">
                      <div className="font-bold text-earth-primary-light flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Eco-Coach Deep Explanation</span>
                      </div>
                      <p>{aiExplanation[idx]}</p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={loadingAi[idx]}
                      onClick={() => handleFetchAiExplanation(idx, detail)}
                      className="text-xs space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI Eco-Coach to Explain</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
