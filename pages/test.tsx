// pages/test.tsx
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// MBTI Club 테스트를 위한 8가지 지표 초기 점수 (모두 0점에서 시작)
const initialScores = {
  E: 0, I: 0,
  N: 0, S: 0,
  T: 0, F: 0,
  J: 0, P: 0,
  C: 0, H: 0,
  L: 0, D: 0,
  U: 0, O: 0,
  B: 0, M: 0,
};

// 예시 질문 데이터 (실제 테스트를 위해서는 질문 수를 늘리고 지표별로 정확히 할당해야 합니다)
const questions = [
  {
    id: 1,
    text: "새로운 사람들과 만나는 자리에서 먼저 대화를 시작하는 편이다.",
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
    text: "일이 계획대로 진행되지 않을 때 스트레스를 많이 받는다.",
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
    text: "논쟁이 생겼을 때, 감정적인 호소보다 객관적인 사실을 중요하게 생각한다.",
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
    text: "새로운 아이디어를 떠올릴 때, 구체적인 현실성보다 상상력을 발휘하는 것을 좋아하다.",
    dimension: "NS",
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
    text: "의견 차이가 있을 때도 항상 부드럽고 차분한 어조를 유지하려고 노력한다.",
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
    text: "다른 사람의 고민을 들을 때, 공감하며 경청하는 것이 중요하다고 생각한다.",
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
    text: "갑작스러운 비판이나 공격적인 말에도 크게 동요하지 않고 능청스럽게 넘기는 편이다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 8,
    text: "자신감이 넘치고 어떤 상황에서도 당당하게 자신의 의견을 피력하는 편이다.",
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

  {
    id: 9,
    text: "혼자 있는 시간보다 사람들과 함께 있을 때 에너지가 충전된다.",
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
    id: 10,
    text: "정해진 규칙과 절차를 따르는 것을 선호한다.",
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
    id: 11,
    text: "사람과의 협력보다는 일의 효율성과 체계성을 중시한다.",
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
    id: 12,
    text: "손재주보다는 독특한 발상에 뛰어나다는 소리를 많이 듣는다.",
    dimension: "NS",
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
    id: 13,
    text: "나는 흥분하거나 격앙되어 말하지 않는 편이다.",
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
    id: 14,
    text: "되도록 상대방의 말을 끊지 않고 들으려고 신경쓴다.",
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
    id: 15,
    text: "상대방이 화를 내도 능청스럽게 상대의 화를 누그러뜨리는데 능숙하다",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 16,
    text: "대화할 때 상대방의 눈을 잘 쳐다볼 수 있다.",
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
  {
    id: 17,
    text: "모임이나 파티가 다가오면 마음이 들뜨고 신이 난다.",
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
    id: 18,
    text: "마감일을 칼같이 지킨다.",
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
    id: 19,
    text: "감정적 위로보다 논리적 설득에 능하다.",
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
    id: 20,
    text: "꿈에 대한 해석에 푹 빠져 지낼 때가 많다.",
    dimension: "NS",
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
    id: 21,
    text: "대화 중 감정이 격해지면 잠시 멈추고 진정하려고 애쓰는 편이다.",
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
    id: 22,
    text: "상대가 말하면 반응해주는 리액션의 말을 많이 하는 편이다.",
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
    id: 23,
    text: "장난스럽게 유머를 던져서 분위기를 새롭게 하는데 아주 능하다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 24,
    text: "내가 무언가를 주장할 때 깊게 몰입하여 주변 사람들의 움직임과 반응이 거의 보이지 않는다.",
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
  {
    id: 25,
    text: "집에서 조용히 개인 시간을 보내는 것보다 다양한 활동을 할 때 생기가 넘친다.",
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
    id: 26,
    text: "나는 약속 시간에 거의 늦지 않는다.",
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
    id: 27,
    text: "감정보다는 이성을 우선시한다.",
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
    id: 28,
    text: "객관적인 정보보다 주관적인 느낌을 잘 믿는다",
    dimension: "NS",
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
    id: 29,
    text: "설교조나 자기 주장을 강하게 하지 않는다.",
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
    id: 30,
    text: "대화 중 상대방의 말을 요약하여 나의 이해 상태를 점검한다.",
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
    id: 31,
    text: "상대가 무슨 말을 해도 나에게는 별로 타격감이 오지 않는다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 32,
    text: "대화할 때 상대의 기분을 상하게 할까봐 단어 선택에 조심하는 편이다.",
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
  {
    id: 33,
    text: "주변 사람들과 자주 연락을 주고 받는다.",
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
    id: 34,
    text: "일의 진행 상황을 계속 체크하는게 마음이 편하다.",
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
    id: 35,
    text: "'이해가 되어야 공감을 하든 말든 하지' 이게 곧 나다.",
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
    id: 36,
    text: "과거의 데이타보다 미래에 대한 나의 예측을 신뢰한다.",
    dimension: "NS",
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
    id: 37,
    text: "대화하다 상대를 공격하는 말이 툭 튀어나오지 않는다.",
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
    id: 38,
    text: "대화 중 상대방의 눈빛이나 동작같은 비언어적 신호에 신경쓴다.",
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
    id: 39,
    text: "사람들에게 허당끼가 많다는 말을 듣는다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 40,
    text: "대인관계시 표정이 말투가 연극적이라는 말을 듣지 않는다.",
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
  {
    id: 41, // Fast Test의 시작점
    text: "팀 프로젝트에서 주도적인 역할을 맡는 것에 익숙하다.",
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
    id: 42,
    text: "여행을 떠날 때 치밀하게 계획을 짠다.",
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
    id: 43,
    text: "사람들과 대화할 때 다정하기보다 무뚝뚝하다는 말을 듣는다.",
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
    id: 44,
    text: "나는 독특하고 엉뚱하다는 말을 종종 듣는다.",
    dimension: "NS",
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
    id: 45,
    text: "대화할 때 말투가 세지 않고 부드러운 편이다.",
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
    id: 46,
    text: "다른 사람의 고민을 듣고 해결책을 제시하기보다 감정을 위로해주는 편이다.",
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
    id: 47,
    text: "토론 중 사람들이 격앙될 때도 나는 차분함을 잃지 않는다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 48,
    text: "상대와 대화할 때 억지공감보다는 무심하게 바라보는 편이다.",
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
  {
    id: 49,
    text: "사람들 앞에서 발표할 때 긴장보다는 신바람이 난다.",
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
    id: 50,
    text: "내 방은 지저분하지 않고 깨끗하다.",
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
    id: 51,
    text: "대화 중에 내 말에 지나치게 공감을 표현하는 사람이 불편하다.",
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
    id: 52,
    text: "자연과 우주에 대한 다큐멘터리를 보면 흥미가 생긴다.",
    dimension: "NS",
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
    id: 53,
    text: "상대가 흥분되어 있으면 차분하라고 물 한잔 건네는 편이다.",
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
    id: 54,
    text: "상대의 주장에 동의하지 않아도 즉각 반박하지 않는다.",
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
    id: 55,
    text: "카톡단체방을 뛰쳐나간 친구에게 능청스럽게 전화할 수 있다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 56,
    text: "모임에서 사람들에게 둘러싸여 있는 편이다.",
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
  {
    id: 57,
    text: "혼자 하는 작업보다 함께 하는 작업이 더 편하다.",
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
    id: 58,
    text: "옷장 안에 옷 하나가 튀어나와 있으면 엄청 신경이 거슬린다.",
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
    id: 59,
    text: "사람들을 위로해주는 말이 영 어색하고 불편하다.",
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
    id: 60,
    text: "세부사항보다는 전체적인 흐름을 중시하는 편이다.",
    dimension: "NS",
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
    id: 61,
    text: "상대의 말이 터무니 없어도 핀잔하지 않는다.",
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
    id: 62,
    text: "상대의 어려움을 들으면 부담이 되더라도 피하지 않고 돕고싶다.",
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
    id:63,
    text: "먼저 화해를 청하는게 싫지만 그래도 내가 먼저 하는 편이다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 64,
    text: "사람들이 나를 싫어할까 걱정되어 내 의견을 숨기진 않는다.",
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
  {
    id: 65,
    text: "생각을 정리하고 말하기보다 그냥 말하는 편이다.",
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
    id: 66,
    text: "일을 펼쳐놓기보다 한가지 일에 집중해서 끝내는 편이다.",
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
    id: 67,
    text: "아부하는 말투를 들으면 엄청 느끼하다.",
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
    id: 68,
    text: "나에게는 직감적으로 떠오르는 상상과 아이디어가 많다.",
    dimension: "NS",
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
    id: 69,
    text: "내가 열심히 설명하고 사람들은 모두 경청하는 분위기가 자연스럽다.",
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
    id: 70,
    text: "나는 티키타카 대화를 잘하는 편이다.",
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
    id: 71,
    text: "내 실수에 대해 넉살스럽게 인정하는 것이 어렵지 않다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 72,
    text: "외국에 나가서 말이 통하지 않아도 주눅들지 않고 당당하게 소통할 수 있다.",
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
  {
    id: 73,
    text: "노래 순서가 다가오면 점점 초조해지기보다 기대가 넘친다.",
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
    id: 74,
    text: "안전을 위해 꼼꼼하게 대비하는 편이다.",
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
    id: 75,
    text: "말투를 꾸미고 다정하게 행동하는 사람이 연극적으로 보인다.",
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
    id: 76,
    text: "어떤 일의 의미와 상징을 잘 파악한다.",
    dimension: "NS",
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
    id: 77,
    text: "한심한 인생을 살고있는 사람이 한심해 보이지 않는다.",
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
    id: 78,
    text: "상대가 한 말을 되받아 적절한 말로 반사해 주는데 능숙하다.",
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
    id: 79,
    text: "사람들이 나를 과소평가해도 그다지 신경쓰지 않는다.",
    dimension: "UO",
    points: {
      'Yes++': { U: 3, O: -3 },
      'Yes+': { U: 2, O: -2 },
      'Yes': { U: 1, O: -1 },
      'Mid': { U: 0, O: 0 },
      'No': { U: -1, O: 1 },
      'No+': { U: -2, O: 2 },
      'No++': { U: -3, O: 3 },
    }
  },
  {
    id: 80, // Fast Test의 끝점
    text: "문제가 생기면 우울해지기보다 부딪쳐 해결하려는 편이다.",
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
        // 여기! 150번째 줄 오류 수정: '=' 대신 'of'를 사용합니다.
        // 불필요한 '@ts-ignore' 주석도 제거했습니다.
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
          width: '85%', // 질문 박스 width 변경
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
            width: '85%', // 답변 버튼 박스 width 변경
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
              buttonBackground = 'linear-gradient(150deg, #4CAF50, #2E8B57)'; // 초록색 그라데이션
            } else if (label.startsWith('No')) {
              buttonBackground = 'linear-gradient(150deg, #FF9800, #E65100)'; // 오렌지색 그라데이션
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