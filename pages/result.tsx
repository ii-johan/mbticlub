// pages/result.tsx
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// 결과 유형을 판별하는 함수
const determineType = (scores: Record<string, number>) => {
  const result: string[] = [];

  // MBTI 전통 4개 지표
  result.push(scores.E >= scores.I ? 'E' : 'I');
  result.push(scores.S >= scores.N ? 'S' : 'N');
  result.push(scores.T >= scores.F ? 'T' : 'F');
  result.push(scores.J >= scores.P ? 'J' : 'P');

  // MBTI Club 4개 지표
  result.push(scores.C >= scores.H ? 'C' : 'H');
  result.push(scores.L >= scores.D ? 'L' : 'D');
  result.push(scores.U >= scores.R ? 'U' : 'R');
  result.push(scores.B >= scores.M ? 'B' : 'M');

  return result.join(''); // 예: 'ENTJCLUR' 형태로 반환
};

const ResultPage: React.FC = () => {
  const router = useRouter();
  const [finalScores, setFinalScores] = useState<Record<string, number> | null>(null);
  const [mbtiClubType, setMbtiClubType] = useState<string>('');

  useEffect(() => {
    if (router.query) {
      // router.query는 문자열 배열 형태로 오므로, 숫자로 변환 필요
      const receivedScores: Record<string, number> = {};
      for (const key in router.query) {
        if (typeof router.query[key] === 'string') {
          receivedScores[key] = parseFloat(router.query[key] as string);
        }
      }
      setFinalScores(receivedScores);
    }
  }, [router.query]);

  useEffect(() => {
    if (finalScores) {
      const type = determineType(finalScores);
      setMbtiClubType(type);
    }
  }, [finalScores]);

  // 점수가 로드되지 않았을 때
  if (!finalScores || !mbtiClubType) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',
        backgroundColor: '#121212', color: '#FFFFFF', fontSize: '1.5rem'
      }}>
        결과를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212',
        padding: '20px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
        textAlign: 'center',
      }}
    >
      <Head>
        <title>MBTI Club Result</title>
        <meta name="description" content="Your MBTI Club personality result" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          maxWidth: '500px',
          width: '90%',
        }}
      >
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px', color: '#FFFFFF' }}>
          My MBTI-Club Type?
        </h1>
        <div
          style={{
            fontSize: '4rem', // 결과 유형 글자 크기
            fontWeight: 'extrabold',
            color: '#FFD700', // 황금색
            textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
            marginBottom: '40px',
            letterSpacing: '2px',
          }}
        >
          {mbtiClubType}
        </div>

        {/* 여기에 각 유형에 대한 설명 추가 (예시) */}
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#CCCCCC' }}>
          **{mbtiClubType}** 유형은 다음과 같은 특징을 가질 수 있습니다.
          {/* 실제로는 각 유형에 대한 상세 설명을 여기에 동적으로 로드해야 합니다. */}
          현재는 예시 문구입니다.
        </p>

        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '40px',
            padding: '15px 30px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: '#FFFFFF',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 123, 255, 0.5)',
          }}
        >
          처음으로 돌아가기
        </button>
      </main>
    </div>
  );
};

export default ResultPage;