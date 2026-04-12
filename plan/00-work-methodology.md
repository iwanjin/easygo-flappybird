# 🔧 플래피버드 개발 작업 방식

## 📌 병렬 개발 구조 (3개팀)

```
🅰️ Team A          🅱️ Team B          🅲 Team C
(로직)             (UI/렌더링)         (고급기능/배포)
   ↓                  ↓                  ↓
game.js           renderer.js        sound.js
(물리/상태)       ui.js              storage.js
                 index.html          README.md
                 style.css           배포 설정
```

---

## 🤖 서브에이전트 활용 전략

각 팀의 대규모 작업은 **병렬 에이전트**로 처리합니다.

### Explore Agent 사용 시기
- 레퍼런스 코드 분석
- 외부 라이브러리 조사
- Canvas API 문서 확인

### General-Purpose Agent 사용 시기
- 코드 작성 (파일이 많거나 복잡할 때)
- 테스트 및 디버깅
- 통합 작업

### 실행 방식
```
메인 어시스턴트
├─ Team A 작업 시작 (일반 에이전트)
├─ Team B 작업 시작 (일반 에이전트) ← 병렬 실행
├─ Team C 작업 시작 (일반 에이전트) ← 병렬 실행
├─ 통합 테스트 (메인)
└─ 배포 (메인)
```

---

## 📋 팀 간 공유 규약 (⚠️ 필독)

### 1. 파일명/ID 규칙
```javascript
// 화면 ID (B팀이 정의 → A/C팀이 참조)
#start-screen      // 시작 화면
#game-screen       // 게임 화면
#gameover-screen   // 게임오버 화면

// Canvas ID
#gameCanvas        // 게임판

// 버튼 ID
#start-btn         // 시작 버튼
#restart-btn       // 다시하기 버튼
#play-again-btn    // 한번 더 버튼

// 점수/정보 ID
#score             // 현재 점수
#final-score       // 최종 점수
#best-score-display // 최고 기록
#top3-list         // TOP3 목록
```

### 2. 게임 상태 객체 (A팀이 관리)
```javascript
const gameState = {
  state: 'idle|playing|gameover',  // 게임 상태
  score: 0,                        // 현재 점수
  bestScore: 0,                    // 최고 기록
  difficulty: 'easy|medium|hard',  // 난이도
  character: 0,                    // 캐릭터 인덱스
  timestamp: Date.now()            // 게임 시작 시간
};
```

### 3. 커스텀 이벤트 (팀 간 통신)
```javascript
// A팀이 발행 → B/C팀이 수신
document.dispatchEvent(new CustomEvent('game:start', {
  detail: { difficulty, character }
}));

document.dispatchEvent(new CustomEvent('game:playing', {
  detail: { score }
}));

document.dispatchEvent(new CustomEvent('bird:jumped'));

document.dispatchEvent(new CustomEvent('pipe:passed'));

document.dispatchEvent(new CustomEvent('game:over', {
  detail: { score, bestScore, character }
}));
```

### 4. 공개 함수 (다른 팀이 호출 가능)
```javascript
// A팀 제공
Game.init(difficulty, character);
Game.start();
Game.reset();
Game.getState();

// B팀 제공
UI.showScreen(screenName);  // 'start|game|gameover'
UI.updateScore(score);
UI.updateBestScore(score);   // 이름 통일
UI.showMessage(text);

// C팀 제공
Sound.play(type);  // 'jump|point|collision|gameover'
Sound.toggleMute();
Storage.saveBestScore(score);
Storage.getBestScore();
Storage.getTop3();          // 이름 통일 (getTop3Scores 제거)
```

### 5. 커밋 메시지 규칙
```
[Team A] 물리 엔진 구현
[Team B] HTML/CSS 초안
[Team C] 사운드 시스템 통합
```

---

## ⏱️ 단계별 개발 타임라인

### 📅 **Day 1 (팀 병렬 개발) - 약 6시간**

#### 09:00-09:30 (킥오프 회의)
- 모든 팀: 플랜 리뷰
- 공유 규약 확인
- 에이전트 할당

#### 09:30-12:00 (Phase 1: 기본 구조)
```
🅰️ Team A              🅱️ Team B              🅲 Team C
(병렬 진행)             (병렬 진행)             (병렬 진행)

└─ game.js 틀       └─ index.html        └─ storage.js
  (상태머신)          (3개 화면)           (localStorage)
  
└─ renderer.js      └─ style.css         └─ sound.js
  (Canvas 초기화)     (기본 스타일)        (Audio 초기화)
```

**산출물:**
- A팀: game.js에 상태머신, renderer.js에 Canvas 초기화
- B팀: index.html에 3개 화면, style.css 기본 완성
- C팀: storage.js, sound.js 골격 완성

#### 12:00-13:00 (점심)

#### 13:00-16:00 (Phase 2: 게임 로직)
```
🅰️ Team A              🅱️ Team B              🅲 Team C
└─ 물리 계산        └─ 애니메이션         └─ 통합 준비
└─ 충돌 감지        └─ UI 이벤트          └─ 효과음 추가
└─ 점수 계산        └─ 화면 전환          └─ 최고점 저장
```

**산출물:**
- A팀: 기본 게임 플레이 가능
- B팀: UI와 로직 연결
- C팀: 게임 이벤트와 사운드 연결

#### 16:00-17:00 (Phase 3: 통합 테스트)
- 모든 팀: 코드 합치기
- 메인 어시스턴트: 통합 테스트
- 버그 픽스 & 성능 최적화

**산출물:** 기본 플레이 가능 버전 완성 ✅

---

### 📅 **Day 2 (고급기능 & 배포) - 약 4시간**

#### 09:00-12:00 (Phase 4: 고급 기능)
```
🅰️ Team A              🅱️ Team B              🅲 Team C
└─ 캐릭터 선택      └─ 난이도 선택UI      └─ TOP3 표시
└─ 난이도별 파라미터  └─ 격려 메시지         └─ 신기록 알림
                    └─ 반응형 완성         └─ README 작성
```

#### 12:00-13:00 (점심)

#### 13:00-14:30 (Phase 5: 최종 통합 & QA)
- 메인: 모든 기능 테스트
- A/B/C팀: 버그 수정
- 모바일/브라우저 호환성 확인

#### 14:30-15:00 (배포)
- C팀: GitHub Pages 배포
- 메인: 라이브 URL 확인

**산출물:** 완전한 플래피버드 게임 🎉

---

## ⏰ 시간 비교: 순차 vs 병렬 개발

### 순차 개발 (1명)
```
Phase 1 (기본구조)     2시간
Phase 2 (게임로직)     2시간
Phase 3 (고급기능)     1시간
Phase 4 (테스트/배포)  1시간
─────────────────────────
총 소요 시간:         6시간
```

### 병렬 개발 (3팀 동시)
```
Phase 1 (기본구조)     2시간 (3팀 동시 진행 → 실제 2시간)
Phase 2 (게임로직)     2시간 (3팀 동시 진행 → 실제 2시간)
Phase 3 (고급기능)     1시간 (3팀 동시 진행 → 실제 1시간)
Phase 4 (통합/배포)    1시간 (메인 조정)
─────────────────────────
총 소요 시간:         6시간 (같음!)
```

### 🎯 병렬 개발의 진짜 이점

| 항목 | 순차 | 병렬 |
|:---|:---:|:---:|
| **개발 시간** | 6시간 | 6시간 |
| **각 팀 작업량** | 6시간 | 2시간 |
| **코드 리뷰 기회** | 1회 | 3회 (병렬 검증) |
| **버그 발견 능력** | ⭐ | ⭐⭐⭐ (다양한 관점) |
| **병목 지점** | 높음 | 낮음 |
| **팀원 피로도** | 높음 | 낮음 ⬇️ |
| **재사용 가능성** | 낮음 | 높음 (명확한 인터페이스) |

---

## 🔄 의존성 관리

### Phase 1: 독립적 작업
- A팀 ↔ B팀: 정보 공유만 (ID/이벤트 규칙)
- 실제 코드 의존성: 거의 없음

### Phase 2: 약한 의존성
```
A팀 (game.js) 
  ↓ (dispatchEvent)
B팀 (ui.js)
  ↓ (updateScore)
C팀 (sound.js)
```
→ **한 방향만** 의존 (순환 의존 없음)

### Phase 3: 최소 의존성
```
모든 팀이 game.js의 공개 함수만 사용
(내부 구현은 몰라도 됨)
```

---

## 🚀 에이전트 할당 방식

### Option 1: 팀당 1개 에이전트 (추천)
```
메인 어시스턴트
├─ Agent A (Team A 담당)
├─ Agent B (Team B 담당) ← 병렬 실행
└─ Agent C (Team C 담당) ← 병렬 실행

→ 3개 팀이 동시에 개발
→ 메인은 통합/배포만 담당
```

### Option 2: 팀당 2개 에이전트 (더 빠름)
```
각 Phase마다 에이전트 교체
Phase 1: 구조 설계 에이전트
Phase 2: 로직 구현 에이전트
Phase 3: 최적화 에이전트
```

---

## 📝 팀 간 커뮤니케이션

### 일일 체크포인트 (1일차 끝)
```
✅ A팀: "기본 물리, 점프/충돌 동작"
✅ B팀: "HTML 완성, CSS 반응형 확인"
✅ C팀: "Storage/Sound 통합 준비"
```

### 문제 발생 시
```
Q. B팀: "점수 ID는 뭐예요?"
A. A팀: "공유규약 보세요. #score입니다"

Q. C팀: "이벤트 이름이 뭐예요?"
A. A팀: "game:playing 입니다"
```

**규칙: 공유규약을 수정하지 말고, 규약을 따름**

---

## ✨ 최종 산출물

### Day 1 종료 (기본 게임)
```
✅ 게임 시작 가능
✅ 새 조종 (점프)
✅ 파이프 충돌 감지
✅ 점수 표시
✅ 모바일 반응형
```

### Day 2 종료 (완전한 게임)
```
✅ 캐릭터/난이도 선택
✅ 최고 기록 저장
✅ 사운드 재생
✅ TOP3 표시
✅ GitHub Pages 배포
✅ README 작성
```

---

## 🎯 성공 기준

| 항목 | 기준 |
|:---|:---|
| **기능 완성도** | 100% |
| **코드 품질** | 콘솔 에러 0개 |
| **성능** | 60fps 유지 |
| **반응형** | 모바일 완벽 지원 |
| **배포** | GitHub Pages 라이브 |

---

이제 3개의 팀별 상세 플랜 파일을 만들 준비가 되었습니다! 👇
