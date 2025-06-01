// pages/result.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// MBTI 유형별 간략 설명 (창작)
const mbtiDescriptions: { [key: string]: string } = {
  // 예시: EISTFCHLUBM 유형에 대한 설명 (실제 MBTI와는 다른 새로운 8지표 조합입니다.)
  // 이 부분은 여러분의 8개 지표 조합에 맞게 설명을 추가하거나 수정해주세요.
  'EISTFCHLUBM': '당신은 넘치는 활력과 섬세한 감각, 명확한 사고로 주변을 이끄는 카리스마 넘치는 리더입니다. 늘 새로운 관계 속에서 에너지를 얻고, 동시에 깊이 있는 통찰력으로 문제를 해결해나갑니다.',
  'INFP': '당신은 상상력과 감성이 풍부한 이상주의자입니다. 내면의 세계를 탐구하며 독창적인 아이디어와 따뜻한 마음으로 세상을 아름답게 만듭니다.',
  'ESTJ': '당신은 현실적이고 논리적인 실용주의자입니다. 체계적인 계획과 단호한 실행력으로 목표를 달성하며, 타고난 리더십으로 조직을 이끌어갑니다.',
  'ENFJ': '당신은 사람에 대한 깊은 이해와 뛰어난 공감 능력을 지닌 따뜻한 영웅입니다. 타인의 성장을 돕고 긍정적인 영향을 주며, 함께하는 가치를 중요하게 생각합니다.',
  // 나머지 8지표 조합에 대한 설명을 여기에 추가해주세요.
  // 예: CD, OU, LM, KB 지표의 조합에 대한 설명도 필요합니다.
  // 모든 2^8 = 256가지 조합을 다 넣기는 어렵지만, 대표적인 조합이나 주요 지표별 설명을 조합할 수 있습니다.
  // 여기서는 예시로 몇 가지만 남겨두었습니다. 실제 테스트 결과를 반영하려면 더 많은 조합을 추가해야 합니다.
  'default': 'MBTI는 선천적성향으로 자신을 잘 알수있는 지표이며, COLK는 후천적습성으로 자신을 바꿀수있는 지표이다.'
};

const ResultPage: React.FC = () => {
  const router = useRouter();
  const [finalMbti, setFinalMbti] = useState<string>('');
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [calculatedPercentages, setCalculatedPercentages] = useState<{ [key: string]: number }>({});
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (router.isReady) {
      const { mbti, ...rawScores } = router.query;

      if (typeof mbti === 'string') {
        // MBTI 4개 유형 - COLKLUB 4개 유형 형태로 포맷
        setFinalMbti(formatMbtiColkString(mbti));
      }

      // 점수 객체로 변환
      const parsedScores: { [key: string]: number } = {};
      for (const key in rawScores) {
        if (typeof rawScores[key] === 'string') {
          parsedScores[key] = parseInt(rawScores[key] as string, 10);
        }
      }
      setScores(parsedScores);

      // 백분율 계산
      const percentages: { [key: string]: number } = calculatePercentages(parsedScores);
      setCalculatedPercentages(percentages);

      // 설명 설정
      setDescription(mbtiDescriptions[mbti as string] || mbtiDescriptions['default']);
    }
  }, [router.isReady, router.query]);

  // MBTI 4개 유형 - COLK 4개 유형 형태로 포맷하는 함수
  const formatMbtiColkString = (mbti: string): string => {
    if (mbti.length !== 8) return mbti; // 8글자가 아니면 그대로 반환 (오류 방지)
    const mbtiPart = mbti.substring(0, 4); // 앞 4글자
    const colkPart = mbti.substring(4, 8); // 뒤 4글자
    return `${mbtiPart}-${colkPart}`;
  };

  // 각 지표별 백분율 계산 함수
  const calculatePercentages = (currentScores: { [key: string]: number }): { [key: string]: number } => {
    const calculated: { [key: string]: number } = {};

    const maxPossibleScorePerDimension = 80 * 3; // 80문제 * 3점 = 240점 (한 쪽 지표의 최대치)
    const totalRangePerDimension = maxPossibleScorePerDimension * 2; // -240 ~ +240 = 480점

    // E vs I
    const eScore = currentScores['E'] || 0;
    const iScore = currentScores['I'] || 0;
    const eiDiff = eScore - iScore; // 양수면 E, 음수면 I
    calculated['E'] = Math.round(((eiDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['I'] = 100 - calculated['E'];

    // S vs N
    const sScore = currentScores['S'] || 0;
    const nScore = currentScores['N'] || 0;
    const snDiff = sScore - nScore;
    calculated['S'] = Math.round(((snDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['N'] = 100 - calculated['S'];

    // T vs F
    const tScore = currentScores['T'] || 0;
    const fScore = currentScores['F'] || 0;
    const tfDiff = tScore - fScore;
    calculated['T'] = Math.round(((tfDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['F'] = 100 - calculated['T'];

    // J vs P
    const jScore = currentScores['J'] || 0;
    const pScore = currentScores['P'] || 0;
    const jpDiff = jScore - pScore;
    calculated['J'] = Math.round(((jpDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['P'] = 100 - calculated['J'];

    // C vs H
    const cScore = currentScores['C'] || 0;
    const hScore = currentScores['D'] || 0;
    const chDiff = cScore - hScore;
    calculated['C'] = Math.round(((chDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['D'] = 100 - calculated['C'];

    // L vs D
    const lScore = currentScores['O'] || 0;
    const dScore = currentScores['U'] || 0;
    const ldDiff = lScore - dScore;
    calculated['O'] = Math.round(((ldDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['U'] = 100 - calculated['O'];

    // U vs O (R 대신 O 사용)
    const uScore = currentScores['L'] || 0;
    const oScore = currentScores['M'] || 0; // 'R' 대신 'O' 점수를 사용
    const uoDiff = uScore - oScore;
    calculated['L'] = Math.round(((uoDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['M'] = 100 - calculated['L']; // 'R' 대신 'O' 백분율 계산

    // B vs M
    const bScore = currentScores['K'] || 0;
    const mScore = currentScores['B'] || 0;
    const bmDiff = bScore - mScore;
    calculated['K'] = Math.round(((bmDiff + maxPossibleScorePerDimension) / totalRangePerDimension) * 100);
    calculated['B'] = 100 - calculated['K'];

    return calculated;
  };

  if (!router.isReady || !finalMbti) {
    return (
      <div style={{ color: '#FFFFFF', textAlign: 'center', marginTop: '50px' }}>
        결과를 불러오는 중입니다...
      </div>
    );
  }

  // 지표별 결과 표시 순서 (UI에 표시될 순서) 및 한글 라벨
  const dimensionPairs = [
    { primary: 'E', secondary: 'I', primaryLabel: '외향형', secondaryLabel: '내향형' },
    { primary: 'S', secondary: 'N', primaryLabel: '감각형', secondaryLabel: '직관형' },
    { primary: 'T', secondary: 'F', primaryLabel: '사고형', secondaryLabel: '감정형' },
    { primary: 'J', secondary: 'P', primaryLabel: '계획형', secondaryLabel: '융통형' },
    { primary: 'C', secondary: 'D', primaryLabel: '주도적 태도', secondaryLabel: '순응적 태도' },
    { primary: 'O', secondary: 'U', primaryLabel: '여유적 반응', secondaryLabel: '과민적 반응' },
    { primary: 'L', secondary: 'M', primaryLabel: '공감적 대화', secondaryLabel: '일방적 대화' }, 
    { primary: 'K', secondary: 'B', primaryLabel: '순화적 말투', secondaryLabel: '공격적 말투' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#000000',
        padding: '20px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
      }}
    >
      <Head>
        <title>MBTI COLK Test Result</title>
        <meta name="description" content="MBTI Colk personality test result" />
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
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          maxWidth: '420px',
          width: '95%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#FFFACD', textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}>
          MBTI-CLUB Type
        </h1>
        {/* MBTI 결과 표시 (연한 노란색 박스에 초록색 글씨) */}
        <div
          style={{
            backgroundColor: '#FFECB3', // 연한 노란색
            color: '#2E8B57', // 초록색 글씨
            fontSize: '2.2rem',
            fontWeight: 'bold',
            letterSpacing: '2px',
            marginBottom: '30px',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            border: '2px solid #FFD700', // 연한 골드 테두리
          }}
        >
          {finalMbti}
        </div>

        {/* 간략한 설명 박스 */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
            width: '100%',
            fontSize: '1rem',
            lineHeight: '1.6',
            color: '#E0E0E0',
            fontStyle: 'italic',
            boxShadow: '0 5px 10px rgba(26, 75, 66, 0.2)',
          }}
        >
          <p>{description}</p>
        </div>

        <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#FFFACD' }}>
          세부 분석 결과
        </h2>
        <div style={{ width: '100%', marginBottom: '30px' }}>
          {dimensionPairs.map(pair => {
            const primaryValue = calculatedPercentages[pair.primary] || 0;
            const secondaryValue = calculatedPercentages[pair.secondary] || 0;

            return (
              <div key={pair.primary} style={{ marginBottom: '15px' }}>
                {/* 지표별 한글 라벨 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginBottom: '5px', color: '#BBBBBB' }}>
                  <span>{pair.primary} - {pair.primaryLabel}</span>
                  <span>{pair.secondary} - {pair.secondaryLabel}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '25px',
                    backgroundColor: '#333333',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {/* Primary Bar (연한 초록) */}
                  <div
                    style={{
                      width: `${primaryValue}%`,
                      backgroundColor: '#A5D6A7', // 연한 초록색
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      paddingLeft: '8px',
                      boxSizing: 'border-box',
                      transition: 'width 0.5s ease-in-out',
                      borderRadius: primaryValue === 100 ? '5px' : (primaryValue === 0 ? '0' : '5px 0 0 5px'),
                    }}
                  >
                    <span style={{ color: '#000000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {primaryValue}%
                    </span>
                  </div>
                  {/* Secondary Bar (연한 노란색) */}
                  <div
                    style={{
                      width: `${secondaryValue}%`,
                      backgroundColor: '#FFF59D', // 연한 노란색
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '8px',
                      boxSizing: 'border-box',
                      transition: 'width 0.5s ease-in-out',
                      borderRadius: secondaryValue === 100 ? '5px' : (secondaryValue === 0 ? '0' : '0 5px 5px 0'),
                    }}
                  >
                    <span style={{ color: '#000000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {secondaryValue}%
                    </span>
                  </div>
                  {/* 중앙 라인 (50% 지점 표시) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      backgroundColor: '#BBBBBB',
                      zIndex: 1,
                      transform: 'translateX(-50%)',
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => router.push('/')}
          style={{
            backgroundColor: '#FFD700', // 이 버튼은 기존 골드 유지
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#FFC107')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FFD700')}
        >
          다시 테스트하기
        </button>
      </main>
    </div>
  );
};

export default ResultPage;