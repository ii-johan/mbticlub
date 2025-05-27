// pages/index.tsx
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // useRouter import

const Home: React.FC = () => {
  const router = useRouter(); // useRouter 훅 초기화

  // 테스트 시작 버튼 클릭 핸들러
  const startTest = (testType: 'fast' | 'full') => {
    router.push(`/test?type=${testType}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // 수직 중앙 정렬
        alignItems: 'center',
        height: '100vh', // 뷰포트 전체 높이를 사용
        backgroundColor: '#121212', // 어두운 검정색 배경
        padding: '20px', // 전체 패딩 증가
        boxSizing: 'border-box',
        color: '#FFFFFF',
        overflow: 'hidden', // 스크롤바가 생기지 않도록 숨김
      }}
    >
      <Head>
        <title>MBTI Club Test</title>
        <meta name="description" content="MBTI Club personality test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)', // 카드 배경
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          maxWidth: '520px',
          width: '95%',
          textAlign: 'center',
          flexShrink: 0,
          maxHeight: '90vh', // 최대 높이 제한
          overflowY: 'auto', // 내용이 넘칠 경우 스크롤 가능하게
        }}
      >
        {/* 제목 */}
        <h1
          style={{
            fontSize: '3.8em',
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: '15px',
            textShadow: '2px 2px 5px rgba(0,0,0,0.6)',
            letterSpacing: '-1px',
          }}
        >
          MBTI Club
        </h1>

        {/* 이미지 컨테이너 */}
        <div
          style={{
            width: '100%',
            maxWidth: '384px',
            height: 'auto',
            position: 'relative',
            borderRadius: '15px',
            overflow: 'hidden',
            marginBottom: '25px', // 여백 조정
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
            backgroundColor: '#000000',
            aspectRatio: '4 / 3',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src="/mbti_main.png"
            alt="MBTI Club Main Image"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        {/* 버튼 컨테이너 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            width: '100%',
          }}
        >
          {/* Fast Test 버튼 */}
          <button
            style={{
              width: '100%',
              padding: '16px 22px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#FFFFFF',
              // 새로운 그라데이션 및 그림자
              background: 'linear-gradient(135deg, #6DD5FA 0%,rgb(26, 119, 181) 100%)', // 시원한 파란색 그라데이션
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease', // 모든 속성에 전환 효과 적용
              boxShadow: '0 8px 20px rgba(41, 128, 185, 0.6)', // 파란색 그림자
              transform: 'scale(1)', // 기본 크기
            }}
            onClick={() => startTest('fast')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'; // 호버 시 약간 확대
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(41, 128, 185, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'; // 원복
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(41, 128, 185, 0.6)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)'; // 클릭 시 약간 축소
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)'; // 클릭 후 원복 (호버 상태로)
            }}
          >
            Slow Test(80)
          </button>

          {/* Full Test 버튼 */}
          <button
            style={{
              width: '100%',
              padding: '16px 22px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#FFFFFF',
              // 새로운 그라데이션 및 그림자
              background: 'linear-gradient(135deg, #81F49E 0%,rgb(26, 166, 84) 100%)', // 상큼한 초록색 그라데이션
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 20px rgba(46, 204, 113, 0.6)', // 초록색 그림자
              transform: 'scale(1)',
            }}
            onClick={() => startTest('full')}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(46, 204, 113, 0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(46, 204, 113, 0.6)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
            }}
          >
            Slow Test(80)
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;