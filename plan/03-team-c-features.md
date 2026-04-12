# 🅲 Team C - 고급기능/배포팀 (양념 역할)

> **담당**: 사운드, 저장소, TOP3, 신기록 알림, README, GitHub Pages 배포  
> **파일**: `js/sound.js`, `js/storage.js`, `README.md`, 배포 설정  
> **목표**: Day 1-2 모든 고급기능 + 배포 완성

---

## 📋 Team C의 책임

```
🔊 사운드 시스템
   ├─ 효과음 4종 (점프/통과/충돌/게임오버)
   ├─ 음소거 기능
   └─ 모바일 자동재생 정책 대응

💾 저장소
   ├─ 최고 기록 저장/로드
   ├─ TOP3 점수 관리
   ├─ 음소거 상태 저장
   └─ localStorage 구현

🎉 고급기능
   ├─ 신기록 알림 (배지)
   ├─ 격려 메시지 (B팀과 협력)
   ├─ 낮/밤 모드 배경 (선택)
   └─ 컨페티 효과 (선택)

📦 배포
   ├─ GitHub Pages 설정
   ├─ README.md 작성
   ├─ 라이브 URL 관리
   └─ 배포 테스트
```

---

## 🔧 Phase 1: 기본 시스템 (09:30 ~ 12:00)

### 목표
- storage.js에 localStorage 래퍼 완성
- sound.js에 Audio 초기화
- Phase 1 통합 가능 상태

### 파일: `js/storage.js`

```javascript
const Storage = (() => {
  // ============ Private 상수 ============
  const PREFIX = 'flappyBird_';
  const SCORES_LIMIT = 10;  // 저장할 최대 점수 개수

  // ============ Private 함수 ============

  /**
   * localStorage key 생성
   */
  function getKey(name) {
    return PREFIX + name;
  }

  /**
   * 점수 리스트 관리
   */
  function getScoresArray() {
    const key = getKey('scores');
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  function setScoresArray(scores) {
    const key = getKey('scores');
    localStorage.setItem(key, JSON.stringify(scores));
  }

  // ============ Public API ============

  return {
    /**
     * 최고 기록 저장
     * @param {number} score
     * @return {boolean} 신기록 여부
     */
    saveBestScore(score) {
      const current = this.getBestScore();
      
      if (score > current) {
        localStorage.setItem(getKey('best'), String(score));
        
        // 점수 배열에도 추가
        const scores = getScoresArray();
        scores.push({
          score,
          timestamp: Date.now(),
          date: new Date().toLocaleDateString('ko-KR')
        });
        
        // 내림차순 정렬 후 상위 N개만 저장
        scores.sort((a, b) => b.score - a.score);
        scores.splice(SCORES_LIMIT);
        
        setScoresArray(scores);
        
        return true;  // 신기록
      }
      
      return false;
    },

    /**
     * 최고 기록 조회
     * @return {number}
     */
    getBestScore() {
      const stored = localStorage.getItem(getKey('best'));
      return stored ? parseInt(stored, 10) : 0;
    },

    /**
     * 모든 점수 조회 (상위 N개)
     * @return {Array<{score, timestamp, date}>}
     */
    getAllScores() {
      return getScoresArray();
    },

    /**
     * TOP 3 점수 조회  ✅ 이름 통일
     * @return {Array<number>}
     */
    getTop3() {
      const scores = getScoresArray();
      return scores.slice(0, 3).map(s => s.score);
    },

    /**
     * TOP 1 점수 조회
     * @return {number}
     */
    getTopScore() {
      const top3 = this.getTop3Scores();
      return top3.length > 0 ? top3[0] : 0;
    },

    /**
     * 음소거 상태 저장
     * @param {boolean} muted
     */
    setMuted(muted) {
      localStorage.setItem(getKey('muted'), String(muted));
    },

    /**
     * 음소거 상태 조회
     * @return {boolean}
     */
    isMuted() {
      const stored = localStorage.getItem(getKey('muted'));
      return stored === 'true';
    },

    /**
     * 게임 설정 저장
     * @param {Object} settings
     */
    saveSettings(settings) {
      localStorage.setItem(getKey('settings'), JSON.stringify(settings));
    },

    /**
     * 게임 설정 조회
     * @return {Object}
     */
    getSettings() {
      const stored = localStorage.getItem(getKey('settings'));
      return stored ? JSON.parse(stored) : {};
    },

    /**
     * 모든 데이터 초기화 (테스트용)
     */
    clear() {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    },

    /**
     * 데이터 내보내기 (JSON)
     * @return {Object}
     */
    export() {
      return {
        bestScore: this.getBestScore(),
        allScores: this.getAllScores(),
        isMuted: this.isMuted(),
        settings: this.getSettings()
      };
    }
  };
})();
```

### 파일: `js/sound.js`

```javascript
const Sound = (() => {
  // ============ Private 상태 ============
  let muted = Storage.isMuted();
  const sounds = {};

  // 효과음 파일 (경로는 필요에 따라 조정)
  const soundConfig = {
    jump: {
      file: 'assets/sounds/jump.mp3',
      volume: 0.8,
      preload: true
    },
    point: {
      file: 'assets/sounds/point.mp3',
      volume: 0.7,
      preload: true
    },
    collision: {
      file: 'assets/sounds/collision.mp3',
      volume: 0.6,
      preload: true
    },
    gameover: {
      file: 'assets/sounds/gameover.mp3',
      volume: 0.5,
      preload: true
    }
  };

  // ============ Private 함수 ============

  /**
   * 음성 객체 생성 (지연 로딩)
   */
  function createAudio(type) {
    const config = soundConfig[type];
    if (!config) return null;

    const audio = new Audio(config.file);
    audio.volume = config.volume;
    audio.preload = config.preload ? 'auto' : 'none';
    
    return audio;
  }

  /**
   * 음성 로드 (필요할 때만)
   */
  function loadSound(type) {
    if (!sounds[type]) {
      sounds[type] = createAudio(type);
    }
    return sounds[type];
  }

  // ============ Public API ============

  return {
    /**
     * 초기화 (선택: 미리 로드)
     */
    init() {
      // 사용자 상호작용 후 호출 권장
      // 모바일 autoplay 정책 때문에
      Object.keys(soundConfig).forEach(type => {
        loadSound(type);
      });
    },

    /**
     * 효과음 재생
     * @param {string} type - 'jump'|'point'|'collision'|'gameover'
     */
    play(type) {
      if (muted) return;

      const audio = loadSound(type);
      if (!audio) return;

      try {
        // 이전 재생 중지
        audio.currentTime = 0;
        
        // 재생 시도 (모바일 autoplay 제약 무시)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // autoplay 정책에 의해 재생 실패 가능
            console.debug('Sound play failed:', error.message);
          });
        }
      } catch (e) {
        console.debug('Sound play exception:', e.message);
      }
    },

    /**
     * 음소거 토글
     * @return {boolean} 새로운 음소거 상태
     */
    toggleMute() {
      muted = !muted;
      Storage.setMuted(muted);
      return muted;
    },

    /**
     * 음소거 상태 확인
     * @return {boolean}
     */
    isMuted() {
      return muted;
    },

    /**
     * 음소거 설정
     * @param {boolean} shouldMute
     */
    setMuted(shouldMute) {
      muted = shouldMute;
      Storage.setMuted(muted);
    },

    /**
     * 음량 조절 (선택)
     * @param {string} type
     * @param {number} volume - 0.0~1.0
     */
    setVolume(type, volume) {
      const audio = loadSound(type);
      if (audio) {
        audio.volume = Math.max(0, Math.min(1, volume));
      }
    }
  };
})();

// 첫 사용자 상호작용 후 사운드 초기화
document.addEventListener('click', () => {
  Sound.init();
}, { once: true });

document.addEventListener('touchstart', () => {
  Sound.init();
}, { once: true });
```

---

## 🔧 Phase 2: 이벤트 통합 (13:00 ~ 16:00)

### 목표
- A팀 이벤트와 Sound 연결
- A팀 이벤트와 Storage 연결
- 통합 테스트 가능 상태

### 파일: `js/sound.js` - 이벤트 리스너 추가

```javascript
// ... (위의 Sound 정의 후)

// ===== 게임 이벤트 리스너 =====

// A팀: bird:jumped 이벤트
document.addEventListener('bird:jumped', () => {
  Sound.play('jump');
});

// A팀: pipe:passed 이벤트
document.addEventListener('pipe:passed', () => {
  Sound.play('point');
});

// A팀: game:over 이벤트
document.addEventListener('game:over', (e) => {
  Sound.play('collision');
  Sound.play('gameover');
});

// A팀: sound:play 이벤트 (직접 요청)
document.addEventListener('sound:play', (e) => {
  const { type } = e.detail;
  Sound.play(type);
});
```

### 파일: `js/storage.js` - 게임 이벤트 통합

```javascript
// ... (위의 Storage 정의 후)

// ===== 게임 이벤트 리스너 =====

// A팀: game:over 이벤트 수신
document.addEventListener('game:over', (e) => {
  const { score } = e.detail;
  
  // 최고 기록 저장 (신기록 여부 반환)
  const isNewRecord = Storage.saveBestScore(score);
  
  if (isNewRecord) {
    // 신기록! 이벤트 발행 (C팀에서 처리 가능)
    document.dispatchEvent(new CustomEvent('record:new', {
      detail: { 
        score,
        top3: Storage.getTop3Scores()
      }
    }));
  }
});

// A팀: game:init 이벤트 수신
document.addEventListener('game:init', (e) => {
  // 게임 설정 저장 (선택)
  Storage.saveSettings({
    lastDifficulty: e.detail.difficulty,
    lastCharacter: e.detail.character
  });
});
```

---

## 🔧 Phase 3: 고급 기능 (Day 2 09:00 ~ 12:00)

### 파일: `js/confetti.js` (신기록 축하 효과)

```javascript
const Confetti = (() => {
  // ============ Private ============
  let isAnimating = false;

  /**
   * 컨페티 입자
   */
  function createParticle(canvas) {
    const colors = [
      '#D8889F', '#F5A9C1', '#9BBE8F', '#87CEEB'
    ];

    return {
      x: Math.random() * canvas.width,
      y: -20,
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 4,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: -0.1 + Math.random() * 0.2
    };
  }

  // ============ Public API ============

  return {
    /**
     * 신기록 축하 효과 발동
     */
    celebrate() {
      if (isAnimating) return;
      isAnimating = true;

      // 임시 canvas 생성
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      const particles = Array.from({ length: 100 }, () => 
        createParticle(canvas)
      );

      let frame = 0;
      const maxFrames = 120;  // 2초

      function animate() {
        // 배경 지우기
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 입자 업데이트 및 그리기
        particles.forEach(p => {
          // 물리
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1;  // 중력
          p.rotation += p.rotationSpeed;
          p.size *= 0.99;  // 크기 감소

          // 투명도
          const alpha = Math.max(0, 1 - frame / maxFrames);

          // 그리기
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        });

        frame++;

        if (frame < maxFrames) {
          requestAnimationFrame(animate);
        } else {
          // 애니메이션 종료
          document.body.removeChild(canvas);
          isAnimating = false;
        }
      }

      animate();
    }
  };
})();

// 신기록 이벤트 수신
document.addEventListener('record:new', (e) => {
  Confetti.celebrate();
});
```

### HTML에 confetti.js 추가

```html
<!-- index.html의 <script> 부분에 추가 -->
<script src="js/confetti.js"></script>
```

---

## 📦 Phase 4: 배포 (Day 2 13:00 ~ 15:00)

### 파일: `README.md`

```markdown
# 🐦 플래피버드

초등학생 대상 플래피버드 웹게임입니다.

## 🎮 게임 소개

- **장르**: 아케이드 게임
- **타겟**: 초등학생 (7~13세)
- **플레이 시간**: 한 판 1~3분

### 게임 규칙

1. 화면을 클릭하거나 스페이스바를 눌러 새를 위로 올립니다
2. 파이프를 피해서 날아올라야 합니다
3. 파이프를 통과하면 1점을 얻습니다
4. 파이프나 화면 경계에 충돌하면 게임이 끝납니다

### 난이도

- **🟢 쉬움**: 파이프가 천천히 움직이고 통로가 넓습니다
- **🟡 보통**: 기본 난이도입니다
- **🔴 어려움**: 파이프가 빠르고 통로가 좁습니다

## 🌟 특징

- 📱 모바일 완벽 지원 (터치 반응성)
- 🎨 초등학생 친화적 디자인
- 🎵 효과음 및 시각 피드백
- 💾 최고 기록 자동 저장
- 🏆 TOP3 점수 표시
- 🎉 신기록 달성 시 축하 효과

## 🚀 플레이하기

**온라인**: [플래피버드 플레이하기](https://iwanjin.github.io/test5-flappy-bird/)

또는 로컬에서:

1. 저장소를 클론합니다
   ```bash
   git clone https://github.com/iwanjin/test5-flappy-bird.git
   cd test5-flappy-bird
   ```

2. 웹 서버로 실행합니다
   ```bash
   python -m http.server 8000
   # 또는
   npx http-server
   ```

3. 브라우저에서 `http://localhost:8000` 접속

## 🛠️ 기술 스택

- **HTML5**: 구조
- **CSS3**: 반응형 디자인
- **Vanilla JavaScript**: 게임 로직 (프레임워크 없음)
- **Canvas API**: 게임 렌더링
- **LocalStorage**: 점수 저장

## 📁 폴더 구조

```
test5-flappy-bird/
├── index.html              # 게임 화면
├── css/
│   └── style.css           # 스타일
├── js/
│   ├── game.js             # 게임 로직
│   ├── renderer.js         # 렌더링
│   ├── ui.js               # UI 제어
│   ├── sound.js            # 효과음
│   ├── storage.js          # 데이터 저장
│   └── confetti.js         # 축하 효과
├── assets/
│   └── sounds/             # 효과음 파일
├── plan/                   # 개발 계획 문서
└── README.md               # 이 파일
```

## 🎯 개발 팀

- **Team A**: 게임 로직 (물리 엔진, 충돌 감지)
- **Team B**: UI/렌더링 (HTML, CSS, 화면 전환)
- **Team C**: 고급기능/배포 (사운드, 저장, 배포)

## 📝 라이선스

MIT License - 자유롭게 사용하세요!

## 🐛 버그 리포트

문제가 발견되면 [Issues](https://github.com/iwanjin/test5-flappy-bird/issues)에 보고해주세요.

## 💡 개선 아이디어

- [ ] 일일 과제 시스템
- [ ] 친구와 점수 비교
- [ ] 다양한 캐릭터 스킨
- [ ] 리더보드 (온라인)
- [ ] 오프라인 모드

---

**플래피버드와 함께 즐거운 게임 시간을 보내세요! 🎮✨**
```

### GitHub Pages 배포

```bash
# 1. gh-pages 브랜치 생성
git checkout --orphan gh-pages

# 2. 모든 파일 스테이징
git add -A

# 3. 커밋
git commit -m "Deploy flappy bird game to GitHub Pages"

# 4. push
git push -u origin gh-pages

# 5. GitHub Settings → Pages → Source: gh-pages 선택

# 6. 라이브 URL 확인
# https://iwanjin.github.io/test5-flappy-bird/
```

---

## 🔧 Phase 5: 최종 테스트 (Day 2)

### 체크리스트

#### 사운드
- [ ] 점프 소리 정상 재생
- [ ] 통과 소리 정상 재생
- [ ] 충돌 소리 정상 재생
- [ ] 게임오버 소리 정상 재생
- [ ] 음소거 기능 작동
- [ ] 모바일에서 소리 재생 (사용자 상호작용 후)

#### 저장소
- [ ] 최고 기록 저장
- [ ] 새로 게임할 때 최고 기록 표시
- [ ] 신기록 달성 시 업데이트
- [ ] TOP3 점수 관리
- [ ] localStorage에 올바르게 저장됨

#### 고급기능
- [ ] 신기록 배지 표시
- [ ] 신기록 달성 시 컨페티 효과
- [ ] 격려 메시지 점수별로 다름

#### 배포
- [ ] GitHub Pages 라이브
- [ ] 모든 파일 접근 가능
- [ ] 게임 완벽 작동
- [ ] README 내용 정확

---

## 🤖 Sub-Agent 활용

### Phase 2 중반 (14:00 경)
```
Agent 작업: 사운드 최적화
명령: "웹 게임 사운드 최적화. 
      모바일 autoplay 정책, 음량 정규화, 
      파일 포맷 (mp3 vs wav) 추천."
예상 결과: 사운드 구현 최적화
```

### Phase 3 중반 (10:00 경)
```
Agent 작업: 컨페티 효과 개선
명령: "입자 효과(particle effect) 
      best practice. 신기록 축하할 때 
      멋진 애니메이션 구현 방법."
예상 결과: 컨페티 애니메이션 개선
```

### Phase 4 (13:00 경)
```
Agent 작업: GitHub Pages 배포 검증
명령: "GitHub Pages 배포 후 
      성능 및 호환성 체크. 
      캐시 문제, CORS 등."
예상 결과: 배포 최적화
```

---

## ⚠️ 주의사항

### 1. 사운드 파일 준비
```
assets/sounds/
├── jump.mp3 (300-500ms)
├── point.mp3 (200-300ms)
├── collision.mp3 (400-600ms)
└── gameover.mp3 (800-1000ms)
```

옵션:
- Freesound.org에서 무료 SFX 다운로드
- Pixabay Music에서 로열티프리 음악
- 생성 AI (AIVA, Soundraw) 활용

### 2. localStorage 제약
```javascript
// 대부분 브라우저: 5-10MB
// 초과하지 않도록 주의
// (점수 10개만 저장)
```

### 3. CORS 이슈 (로컬 테스트)
```bash
# 파일:// 프로토콜로 열면 CORS 오류
# 반드시 http:// 서버로 실행
python -m http.server 8000
```

### 4. 신기록 배지 표시
```javascript
// 0점도 신기록일 수 있음 (첫 게임)
// 하지만 표시하지 않기
if (isNewRecord && score > 0) {
  badge.classList.remove('hidden');
}
```

---

## 📊 데이터 구조 (localStorage)

```json
{
  "flappyBird_best": "42",
  "flappyBird_scores": [
    {
      "score": 42,
      "timestamp": 1681234567890,
      "date": "2024-04-12"
    },
    {
      "score": 38,
      "timestamp": 1681233567890,
      "date": "2024-04-12"
    }
  ],
  "flappyBird_muted": "false",
  "flappyBird_settings": {
    "lastDifficulty": "medium",
    "lastCharacter": 0
  }
}
```

---

## 📝 체크포인트 (Phase별)

### Phase 1 종료 (12:00)
```
✅ storage.js 완성
✅ sound.js 기본 구현
❌ 아직 이벤트 통합 안 함 (OK)
```

### Phase 2 종료 (16:00)
```
✅ A팀 이벤트와 Sound 연결
✅ A팀 이벤트와 Storage 연결
✅ 점수 저장/로드 정상
✅ 사운드 재생 정상
```

### Phase 3 종료 (12:00)
```
✅ 신기록 알림 배지
✅ 컨페티 효과
✅ TOP3 점수 표시
✅ 격려 메시지 다양화
```

### Phase 4-5 종료 (15:00)
```
✅ README.md 완성
✅ GitHub Pages 라이브
✅ 모든 기능 테스트
✅ 배포 완료
```

---

## 🎯 최종 결과물

Day 2 15:00까지 다음이 완성되어야 함:

```
✅ 완전한 플래피버드 게임
✅ 모든 사운드 재생
✅ 점수 저장/복원
✅ TOP3 점수 표시
✅ 신기록 알림 + 축하 효과
✅ GitHub Pages 라이브 배포
✅ README 작성
✅ 모든 난이도 테스트 완료
✅ 모바일 완벽 지원
```

축하합니다! 이제 플래피버드가 세상에 나갈 준비가 됐습니다! 🚀🎉
