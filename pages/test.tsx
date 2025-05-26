// pages/test.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// MBTI Club 테스트를 위한 8가지 지표 초기 점수 (모두 0점에서 시작)
const initialScores = {
  E: 0, I: 0,
  S: 0, N: 0,
  T: 0, F: 0,
  J: 0, P: 0,
  C: 0, H: 0,
  L: 0, D: 0,
  U: 0, R: 0,
  B: 0, M: 0,
};

// 예시 질문 데이터 (실제 테스트를 위해서는 질문 수를 늘리고 지표별로 정확히 할당해야 합니다)
const questions = [
  {
    id: 1,
    text: "새로운 사람들과 만나는 자리에서 먼저 대화를 시작하는 편인가요?",
    dimension: "EI",
    points: {
      'Yes++': { E: 3, I: -3 }, // E에 +3점, I에 -3점 (서로 상쇄)
      'Yes+': { E: 2, I: -2 },
      'Yes': { E: 1, I: -1 },
      'Mid': { E: 0, I: 0 },   // 중간은 0점
      'No': { E: -1, I: 1 },
      'No+': { E: -2, I: 2 },
      'No++': { E: -3, I: 3 },
    }
  },
  {
    id: 2,
    text: "일이 계획대로 진행되지 않을 때 스트레스를 많이 받으시나요?",
    dimension: "JP",
    points: {
      'Yes++': { J: 3, P: -3 },
      'Yes+': { J: 2, P: -2 },
      'Yes': { J: 1, P: -1 },
      'Mid': { J: 0, P: 0 },
      'No': { J: -1, P: 1 },
      'No+': { J: -2, P: 2 },
      'No++': { J: -3, P: 3 },
    }
  },
  {
    id: 3,
    text: "논쟁이 생겼을 때, 감정적인 호소보다 객관적인 사실을 중요하게 생각하나요?",
    dimension: "TF",
    points: {
      'Yes++': { T: 3, F: -3 },
      'Yes+': { T: 2, F: -2 },
      'Yes': { T: 1, F: -1 },
      'Mid': { T: 0, F: 0 },
      'No': { T: -1, F: 1 },
      'No+': { T: -2, F: 2 },
      'No++': { T: -3, F: 3 },
    }
  },
  {
    id: 4,
    text: "새로운 아이디어를 떠올릴 때, 구체적인 현실성보다 상상력을 발휘하는 것을 좋아하나요?",
    dimension: "SN",
    points: {
      'Yes++': { N: 3, S: -3 },
      'Yes+': { N: 2, S: -2 },
      'Yes': { N: 1, S: -1 },
      'Mid': { N: 0, S: 0 },
      'No': { N: -1, S: 1 },
      'No+': { N: -2, S: 2 },
      'No++': { N: -3, S: 3 },
    }
  },
  {
    id: 5,
    text: "의견 차이가 있을 때도 항상 부드럽고 차분한 어조를 유지하려고 노력하시나요?",
    dimension: "CH",
    points: {
      'Yes++': { C: 3, H: -3 },
      'Yes+': { C: 2, H: -2 },
      'Yes': { C: 1, H: -1 },
      'Mid': { C: 0, H: 0 },
      'No': { C: -1, H: 1 },
      'No+': { C: -2, H: 2 },
      'No++': { C: -3, H: 3 },
    }
  },
  {
    id: 6,
    text: "다른 사람의 고민을 들을 때, 공감하며 경청하는 것이 중요하다고 생각하나요?",
    dimension: "LD",
    points: {
      'Yes++': { L: 3, D: -3 },
      'Yes+': { L: 2, D: -2 },
      'Yes': { L: 1, D: -1 },
      'Mid': { L: 0, D: 0 },
      'No': { L: -1, D: 1 },
      'No+': { L: -2, D: 2 },
      'No++': { L: -3, D: 3 },
    }
  },
  {
    id: 7,
    text: "갑작스러운 비판이나 공격적인 말에도 크게 동요하지 않고 능청스럽게 넘기는 편인가요?",
    dimension: "UR",
    points: {
      'Yes++': { U: 3, R: -3 },
      'Yes+': { U: 2, R: -2 },
      'Yes': { U: 1, R: -1 },
      'Mid': { U: 0, R: 0 },
      'No': { U: -1, R: 1 },
      'No+': { U: -2, R: 2 },
      'No++': { U: -3, R: 3 },
    }
  },
  {
    id: 8,
    text: "자신감이 넘치고 어떤 상황에서도 당당하게 자신의 의견을 피력하는 편인가요?",
    dimension: "BM",
    points: {
      'Yes++': { B: 3, M: -3 },
      'Yes+': { B: 2, M: -2 },
      'Yes': { B: 1, M: -1 },
      'Mid': { B: 0, M: 0 },
      'No': { B: -1, M: 1 },
      'No+': { B: -2, M: 2 },
      'No++': { B: -3, M: 3 },
    }
  },
];

const TestPage: React.FC = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const totalQuestions = questions.length;

  useEffect(() => {
    const testType = router.query.type;
    console.log(`Test Type: ${testType}`);
  }, [router.query.type]);

  const handleAnswer = (answerLabel: keyof typeof questions[0]['points']) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && currentQuestion.points[answerLabel]) {
      setScores(prevScores => {
        const newScores = { ...prevScores };
        for (const [key, value] of Object.entries(currentQuestion.points[answerLabel])) {
          newScores[key as keyof typeof initialScores] += value;
        }
        console.log("Current Scores:", newScores);
        return newScores;
      });
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      console.log("Final Scores:", scores);
      // 최종 점수를 바탕으로 MBTI 결과 페이지로 이동 (예: E가 I보다 높으면 E, S가 N보다 높으면 S)
      const finalResult = calculateMbti(scores);
      router.push({ pathname: '/result', query: { ...scores, mbti: finalResult } as any });
    }
  };

  const calculateMbti = (finalScores: typeof initialScores): string => {
    let mbti = "";
    mbti += finalScores.E >= finalScores.I ? 'E' : 'I';
    mbti += finalScores.S >= finalScores.N ? 'S' : 'N';
    mbti += finalScores.T >= finalScores.F ? 'T' : 'F';
    mbti += finalScores.J >= finalScores.P ? 'J' : 'P';
    // 추가된 4개 지표 처리 (가정: C/H, L/D, U/R, B/M)
    mbti += finalScores.C >= finalScores.H ? 'C' : 'H';
    mbti += finalScores.L >= finalScores.D ? 'L' : 'D';
    mbti += finalScores.U >= finalScores.R ? 'U' : 'R';
    mbti += finalScores.B >= finalScores.M ? 'B' : 'M';
    return mbti;
  };

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '50px' }}>
        테스트 질문을 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#000000',
        padding: '10px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
      }}
    >
      <Head>
        <title>MBTI Test</title>
        <meta name="description" content="MBTI Club personality test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: '20px',
          paddingTop: '15px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          maxWidth: '420px',
          width: '95%', // 원래 크기로 되돌림
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        {/* 1. 상단에 번호/총번호수 */}
        <div
          style={{
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#BBBBBB',
            marginBottom: '15px',
          }}
        >
          {currentQuestionIndex + 1} / {totalQuestions}
        </div>

        {/* 2. 연노랑 박스에 질문 표시 */}
        <div
          style={{
            backgroundColor: '#FFFACD',
            color: '#333333',
            borderRadius: '15px',
            padding: '30px',
            marginBottom: '20px',
            width: '100%', // 내부 질문 텍스트 박스는 100% 유지
            minHeight: '364px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: '600',
            lineHeight: '1.5',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
            wordBreak: 'keep-all',
            border: '2px solid #FFD700',
          }}
        >
          {currentQuestion.text}
        </div>

        {/* 3. 박스 아래에 답변 버튼 7개 */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            gap: '1px',
            width: '95%', // 원래 크기로 되돌림
            alignItems: 'center',
            overflowX: 'auto',
            paddingBottom: '5px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {['Yes++', 'Yes+', 'Yes', 'Mid', 'No', 'No+', 'No++'].map((label) => {
            let buttonBackground = '';
            if (label.startsWith('Yes')) {
              buttonBackground = 'linear-gradient(150deg,rgb(104, 192, 107),rgb(18, 101, 54))'; // 초록색 그라데이션
            } else if (label.startsWith('No')) {
              buttonBackground = 'linear-gradient(150deg,rgb(215, 142, 32),rgb(131, 54, 12))'; // 오렌지색 그라데이션
            } else {
              buttonBackground = 'linear-gradient(150deg, #555555, #333333)'; // 진회색 그라데이션 (Mid)
            }

            return (
              <button
                key={label}
                onClick={() => handleAnswer(label as keyof typeof questions[0]['points'])}
                style={{
                  flexShrink: 0,
                  flexGrow: 0,
                  minWidth: '49.5px',
                  height: '49.5px',
                  padding: '0 1px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'background-color 0.3s ease, transform 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  textAlign: 'center',
                  lineHeight: '1.1',
                  background: buttonBackground, // 조건부 배경색 적용
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {label}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default TestPage;