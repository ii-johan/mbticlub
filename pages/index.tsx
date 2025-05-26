// pages/index.tsx
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // useRouter import

const Home: React.FC = () => {
  const router = useRouter(); // useRouter 훅 초기화

  // 테스트 시작 버튼 클릭 핸들러
  const startTest = (testType: 'fast' | 'full') => {
    // query 파라미터를 통해 어떤 테스트인지 test.tsx로 전달할 수 있습니다.
    router.push(`/test?type=${testType}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // 상단에 더 가깝게 배치
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#121212', // 어두운 검정색 배경
        padding: '10px 10px',
        paddingTop: '10px',
        boxSizing: 'border-box',
        color: '#FFFFFF',
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
          paddingTop: '5px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          maxWidth: '520px',
          width: '95%',
          textAlign: 'center',
          flexShrink: 0,
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
            marginBottom: '30px',
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
              background: 'linear-gradient(45deg,rgb(131, 214, 229),rgb(25, 29, 152))',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease, transform 0.2s ease',
              boxShadow: '0 5px 15px rgba(0, 123, 255, 0.7)',
            }}
            // ✨ 클릭 시 테스트 페이지로 이동하도록 수정 ✨
            onClick={() => startTest('fast')}
          >
            Fast Test (40)
          </button>

          {/* Full Test 버튼 */}
          <button
            style={{
              width: '100%',
              padding: '16px 22px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: '#FFFFFF',
              background: 'linear-gradient(45deg,rgb(144, 228, 164),rgb(21, 74, 13))',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'opacity 0.3s ease, transform 0.2s ease',
              boxShadow: '0 5px 15px rgba(40, 167, 69, 0.7)',
            }}
            // ✨ 클릭 시 테스트 페이지로 이동하도록 수정 ✨
            onClick={() => startTest('full')}
          >
            Full Test (80)
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;