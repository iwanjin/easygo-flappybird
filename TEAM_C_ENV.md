# 🅲 Team C 환경 설정 & 개발 가이드

**역할**: 고급기능/배포팀 (사운드, 저장, 배포)  
**담당 파일**: `js/sound.js`, `js/storage.js`, `js/confetti.js`, `README.md`  
**개발 기간**: Day 1-2 (약 3시간)

---

## 🎯 Team C의 최종 목표

```
✅ 사운드 시스템 (4가지 효과음)
✅ localStorage 저장소 (점수, TOP3)
✅ 신기록 알림 + 컨페티 효과
✅ 음소거 기능
✅ GitHub Pages 배포
✅ README.md 작성
✅ 모든 기능 통합 완료
```

---

## 📝 구현 체크리스트

### Phase 1 (09:30 ~ 12:00)

#### storage.js
```
✅ Storage 모듈 생성
✅ saveScore(score) - 모든 점수 저장 (항상 호출)
✅ saveBestScore(score) - 신기록 판정 (saveScore 호출 후 최고점 비교)
✅ getBestScore() - 최고점 조회
✅ getTop3() - TOP3 반환 (⚠️ API 이름 통일: getTop3Scores 아님!)
✅ getAllScores() - 모든 점수
✅ setMuted(bool) - 음소거 저장
✅ isMuted() - 음소거 상태
✅ export() - 데이터 내보내기
```

#### sound.js
```
✅ Sound 모듈 생성
✅ soundConfig 정의 (4가지)
✅ Sound.init() - Audio 초기화
✅ Sound.play(type) - 재생
✅ Sound.toggleMute() - 음소거 토글
✅ Sound.isMuted() - 상태 확인
```

### Phase 2 (13:00 ~ 16:00)

#### sound.js - 이벤트 통합
```
✅ bird:jumped → Sound.play('jump')
✅ pipe:passed → Sound.play('point')
✅ bird:died → Sound.play('collision')
✅ game:over → Sound.play('gameover')
✅ 첫 상호작용 후 사운드 초기화
```

#### storage.js - 이벤트 통합
```
✅ game:over → Storage.saveBestScore()
✅ 신기록 이벤트 발행
✅ localStorage에 JSON 저장
```

### Phase 3 (Day 2 09:00 ~ 12:00)

#### confetti.js
```
✅ Confetti.celebrate() - 축하 효과
✅ record:new 이벤트 수신
✅ 100개 입자 애니메이션
✅ 2초 duration
```

#### README.md
```
✅ 게임 소개
✅ 규칙 설명
✅ 특징 나열
✅ 플레이 링크
✅ 기술 스택
✅ 폴더 구조
✅ 라이선스
```

---

## 🔧 구현 단계별 가이드

### Step 1: 파일 구조 준비
```bash
# 폴더 생성
mkdir -p assets/sounds

# 파일 목록
js/storage.js      (생성 필요)
js/sound.js        (생성 필요)
js/confetti.js     (생성 필요)
README.md          (생성 필요)
assets/sounds/     (이 안에 mp3 파일)
```

### Step 2: storage.js 생성
```javascript
const Storage = (() => {
  // 03-team-c-features.md에서 전체 코드 복사
})();
```

### Step 3: sound.js 생성
```javascript
const Sound = (() => {
  // 03-team-c-features.md에서 전체 코드 복사
})();
```

### Step 4: 테스트
```bash
# 마스터 터미널에서
python -m http.server 8000

# 브라우저: http://localhost:8000
# F12 Console에서
localStorage.setItem('test', 'value')
localStorage.getItem('test')
// "value" 반환해야 함
```

---

## 🚀 에이전트를 위한 명령어

### 초기화 (Phase 1)
```
"Team C 개발 시작.
03-team-c-features.md의 storage.js, sound.js 코드를
js/ 폴더에 생성해줘.
localStorage 동작 테스트도 함께."
```

### Phase 1 검증
```
"storage.js와 sound.js가 완성되었는지 확인.
마스터의 F12 Console에서:
- Storage.saveBestScore(42) 실행
- localStorage.getItem('flappyBird_best') 확인
- '42'가 반환되어야 함"
```

### Phase 2 구현
```
"sound.js에 이벤트 리스너 추가:
- bird:jumped → Sound.play('jump')
- pipe:passed → Sound.play('point')
- game:over → Sound.play('gameover')

storage.js에도:
- game:over 이벤트 수신
- Storage.saveBestScore() 호출 (내부적으로 saveScore() 호출)
- 신기록이면 record:new 이벤트 발행"
```

### Phase 3 구현 (Day 2)
```
"confetti.js 생성 (축하 효과).
record:new 이벤트 수신하면
100개 입자가 위에서 떨어지는 애니메이션.
2초 지속."
```

### 배포 준비
```
"README.md 작성.
게임 소개, 규칙, 기술 스택, 폴더 구조 포함.
GitHub Pages 배포 정보도."
```

---

## 📊 자체 테스트 명령어

### 저장소 테스트
```javascript
// localStorage 활성화 확인
typeof localStorage  // "object"

// 점수 저장 테스트
Storage.saveScore(42)       // 모든 점수 저장
Storage.getBestScore()      // 42

// TOP3 조회 (API 이름: getTop3로 통일됨)
Storage.getTop3()  // [{score: 42, date: '2026-04-12', ...}, ...]

// 모든 데이터 조회
Storage.export()

// 음소거 상태
Sound.setMuted(true)
Sound.isMuted()  // true
```

### 사운드 테스트
```javascript
// 음소거 해제
Sound.setMuted(false)

// 각각 재생 테스트
Sound.play('jump')      // 점프음
Sound.play('point')     // 통과음
Sound.play('collision') // 충돌음
Sound.play('gameover')  // 게임오버음

// 음소거
Sound.setMuted(true)
Sound.play('jump')  // 소리 안 남
```

### 이벤트 모니터링
```javascript
// 신기록 이벤트 감시
document.addEventListener('record:new', (e) => {
  console.log('신기록!', e.detail);
});

// game:over 시뮬레이션
document.dispatchEvent(new CustomEvent('game:over', {
  detail: { score: 100, bestScore: 100, character: 0 }
}));
```

---

## 🎵 사운드 파일 준비

### 필요한 파일
```
assets/sounds/
├── jump.mp3         (300-500ms) - 점프음
├── point.mp3        (200-300ms) - 통과음
├── collision.mp3    (400-600ms) - 충돌음
└── gameover.mp3     (800-1000ms) - 게임오버음
```

### 무료 리소스 출처
1. **Freesound.org** (가장 권장)
   - 가입 후 효과음 검색
   - Creative Commons 라이센스

2. **Pixabay**
   - 로열티프리 음악 & 효과음
   - 가입 불필요

3. **생성 AI**
   - AIVA (음악 생성)
   - Soundraw (효과음)
   - Jingle Bells (단순 음향 효과)

### 파일 형식
- **포맷**: MP3 (또는 WAV, OGG)
- **비트레이트**: 128kbps (품질 vs 파일 크기 트레이드오프)
- **길이**: 위의 시간 범위 내

---

## ⚠️ 주의사항 (함함)

### 1️⃣ localStorage 제약
```javascript
// 대부분 브라우저 5-10MB 제한
// 점수 10개만 저장 (충분함)
scores.splice(10);

// 가끔 localStorage 비활성화
// → try-catch로 처리
try {
  localStorage.setItem(key, value);
} catch (e) {
  console.log('localStorage full');
}
```

### 2️⃣ 음소거 상태 필수 확인
```javascript
// 반드시 재생 전 확인
if (muted) return;
audio.play();
```

### 3️⃣ autoplay 정책 (모바일)
```javascript
// 사용자 상호작용 전에는 재생 불가
// 첫 클릭 후 초기화
document.addEventListener('click', () => {
  Sound.init();
}, { once: true });
```

### 4️⃣ currentTime 리셋 필수
```javascript
// 같은 음향을 연속 재생
// 또는 음향이 이전에 끝나지 않았을 때
audio.currentTime = 0;  // 처음부터
audio.play();
```

### 5️⃣ 신기록 판정 (0점도 포함)
```javascript
// 첫 게임: 0점
if (score > currentBest) {
  // 신기록 (단, 0점 배지는 표시 안 함)
  if (score > 0) {
    showBadge();
  }
}
```

---

## 📞 질문 & 해결

### 문제: localStorage 저장 안 됨
```javascript
// 확인 1: localStorage 활성화?
typeof localStorage === 'object'

// 확인 2: 용량 초과?
try {
  localStorage.setItem('test', 'x');
  console.log('OK');
} catch (e) {
  console.log('localStorage full:', e.message);
}

// 확인 3: 파일:// 프로토콜?
// → 반드시 http:// 서버로 실행
```

### 문제: 사운드 재생 안 됨
```javascript
// 확인 1: 음소거 상태?
Sound.isMuted()  // false여야 함

// 확인 2: 파일 경로?
new Audio('assets/sounds/jump.mp3').src

// 확인 3: 모바일 autoplay?
// → 첫 클릭 후 호출
document.addEventListener('click', () => {
  Sound.init();
}, { once: true });
```

### 문제: TOP3이 정렬 안 됨
```javascript
// 점수 배열 정렬 필수
scores.sort((a, b) => b.score - a.score);
// 내림차순 (큰 것부터)

// 상위 3개만
scores.slice(0, 3)
```

---

## 🎯 완성 기준

### Phase 1 완료 체크
```
✅ storage.js 완성
  ✅ saveBestScore() 신기록 판정
  ✅ getBestScore() 반환
  ✅ localStorage 저장
  
✅ sound.js 완성
  ✅ Audio 객체 생성
  ✅ play() 재생
  ✅ toggleMute() 토글
```

### Phase 2 완료 체크
```
✅ bird:jumped → 사운드 재생
✅ pipe:passed → 사운드 재생
✅ game:over → 점수 저장 + 신기록 이벤트
✅ 점수 로드 (게임 시작 시)
✅ 신기록 배지 표시
```

### Phase 3 완료 체크
```
✅ confetti.js 완성
✅ record:new 이벤트 수신
✅ 축하 애니메이션 작동
✅ README.md 완성
```

### 배포 완료 체크
```
✅ GitHub Pages URL 라이브
✅ 모든 파일 접근 가능
✅ 게임 완벽 작동
✅ localStorage 저장 확인
✅ 사운드 모두 재생
✅ 모바일 테스트 완료
```

---

## 🔗 참고 자료

- **03-team-c-features.md**: 전체 코드
- **00-work-methodology.md**: 공유 규약
- **MASTER_TERMINAL.md**: 마스터 모니터링
- **MDN localStorage**: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **MDN Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

---

준비 완료! 고급기능 & 배포를 시작하세요! 🚀
