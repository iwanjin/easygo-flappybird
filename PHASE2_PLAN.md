# 📋 Phase 2 계획서

**시작일**: 2026-04-12  
**상태**: 📝 계획 중

---

## 🎯 Phase 2 목표

Phase 1에서 완성된 기본 게임 기능을 바탕으로 다음 항목들을 추가합니다:

1. ✨ **축하 애니메이션** (신기록 달성 시)
2. 🏆 **배지 및 도전과제 시스템**
3. 📊 **점수 통계 및 분석**
4. 🎨 **테마 및 커스터마이징**
5. 📱 **모바일 최적화**

---

## 📊 Phase 2 기능 명세

### 1️⃣ Confetti 모듈 (축하 애니메이션)

**담당**: Team C (기능)  
**파일**: `js/confetti.js` (신규)  
**의존성**: Storage (record:new 이벤트)

**기능**:
- 신기록 달성 시 confetti 애니메이션 발생
- Canvas 또는 DOM 기반 파티클 시스템
- 사용자 정의 색상 (난이도별)

**API**:
```javascript
const Confetti = (() => {
  return {
    init(),           // 초기화
    celebrate(score), // 축하 애니메이션
    destroy()         // 정리
  };
})();
```

**이벤트 구독**:
```javascript
document.addEventListener('record:new', (e) => {
  Confetti.celebrate(e.detail.score);
});
```

### 2️⃣ 배지 시스템

**담당**: Team B (UI)  
**파일**: `js/ui.js` 확장  
**배지 종류**:
- 🥇 첫 점수 (score > 0)
- 🥇 10점 달성 (score >= 10)
- 🥈 신기록 달성 (new record)
- 🏆 50점 달성 (score >= 50)
- 💯 100점 달성 (score >= 100)

**구현**:
```javascript
function showAchievementBadge(badge) {
  const badgeHtml = `
    <div class="achievement-badge">
      <span>${badge.emoji}</span>
      <p>${badge.title}</p>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', badgeHtml);
  setTimeout(() => { /* fade out */ }, 3000);
}
```

### 3️⃣ 점수 통계

**담당**: Team C (Storage)  
**파일**: `js/storage.js` 확장  
**함수 추가**:

```javascript
// 평균 점수
function getAverageScore() {
  const scores = getAllScores();
  if (scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b.score, 0);
  return Math.round(sum / scores.length);
}

// 최고점 달성 횟수
function getBestScoreAchievedCount() {
  const best = getBestScore();
  return getAllScores().filter(s => s.score === best).length;
}

// 게임 횟수
function getPlayCount() {
  return getAllScores().length;
}

// 총 점수
function getTotalScore() {
  return getAllScores().reduce((a, b) => a + b.score, 0);
}
```

**UI 표시** (Game Over 화면 확장):
```
최종 점수: 150
최고 기록: 200
TOP 3: 200, 150, 120
─────────────────────
평균 점수: 95
게임 횟수: 15회
총 점수: 1425
```

### 4️⃣ 테마 시스템

**담당**: Team B (UI/CSS)  
**파일**: `css/style.css` 확장, `js/theme.js` (신규)

**테마 종류**:
- 🌞 밝은 테마 (기본)
- 🌙 어두운 테마
- 🌊 바다 테마
- 🔥 불 테마

**구현**:
```javascript
const Theme = (() => {
  const themes = {
    light: { bg: '#fff', text: '#000', accent: '#FF6B6B' },
    dark:  { bg: '#1a1a1a', text: '#fff', accent: '#FFD700' },
    ocean: { bg: '#0077BE', text: '#fff', accent: '#FFD60A' },
    fire:  { bg: '#2d1b1b', text: '#fff', accent: '#FF6B35' }
  };

  return {
    set(themeName),    // 테마 설정
    get(),             // 현재 테마 조회
    getAll()           // 모든 테마 조회
  };
})();
```

### 5️⃣ 모바일 최적화

**담당**: Team B (UI/CSS)  
**수정사항**:
- 터치 이벤트 추가 (click 대신 touch)
- 반응형 레이아웃 개선
- 화면 방향 변경 지원
- 가상 조이스틱 추가 (선택)

**구현**:
```javascript
// 터치 이벤트
document.addEventListener('touchstart', (e) => {
  Game.jump();
});

// 모바일 감지
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
```

---

## 📅 개발 일정

| Phase | 기능 | 담당팀 | 예상 | 상태 |
|---|---|---|---|---|
| 2-1 | Confetti | Team C | 1시간 | 대기 |
| 2-2 | 배지 시스템 | Team B | 1시간 | 대기 |
| 2-3 | 점수 통계 | Team C | 1시간 | 대기 |
| 2-4 | 테마 시스템 | Team B | 2시간 | 대기 |
| 2-5 | 모바일 최적화 | Team B | 2시간 | 대기 |
| 2-6 | 통합 테스트 | 마스터 | 1시간 | 대기 |

---

## 🔄 팀별 작업 분담

### Team A (게임 로직)
- ✅ Phase 1 완료
- Phase 2: 대기 (필요시 물리 엔진 개선)

### Team B (UI/렌더링)
- ✅ Phase 1 완료
- Phase 2:
  - 배지 시스템 구현
  - 테마 시스템 구현
  - 모바일 최적화

### Team C (기능/저장소)
- ✅ Phase 1 완료
- Phase 2:
  - Confetti 모듈 구현
  - 점수 통계 함수 추가

---

## 📦 신규 파일 목록

| 파일 | 크기 | 담당팀 | 상태 |
|---|---|---|---|
| js/confetti.js | ~200줄 | Team C | ⏳ |
| js/theme.js | ~150줄 | Team B | ⏳ |
| css/theme.css | ~300줄 | Team B | ⏳ |
| css/mobile.css | ~200줄 | Team B | ⏳ |

---

## 🔗 의존성 맵

```
Phase 2 의존성:

confetti.js
  ├─ Storage (record:new 이벤트 구독)
  └─ Canvas (렌더링)

ui.js (확장)
  ├─ Theme (테마 적용)
  ├─ Storage (통계 데이터)
  └─ Confetti (이벤트 발행)

storage.js (확장)
  └─ 통계 함수 추가

theme.js
  ├─ CSS (테마 스타일)
  └─ localStorage (테마 저장)
```

---

## ✅ Phase 2 완료 조건

1. ✅ Confetti 애니메이션 정상 작동
2. ✅ 배지 시스템 정상 표시
3. ✅ 점수 통계 정확히 계산됨
4. ✅ 모든 테마 정상 적용됨
5. ✅ 모바일에서 터치 이벤트 작동
6. ✅ localStorage에 설정값 저장됨
7. ✅ 모든 파일 통합 테스트 통과

---

## 🚀 다음 단계

1. **즉시**: Phase 2 개발 시작 (Team B, C)
2. **1시간 후**: Phase 2-1, 2-2 완료 검증
3. **2시간 후**: Phase 2-3, 2-4 완료 검증
4. **3시간 후**: Phase 2-5 완료 검증
5. **4시간 후**: 통합 테스트 및 최종 검증

---

## 📝 노트

- Phase 2는 Phase 1에 완전히 의존 (Phase 1 완료 필수)
- 팀 간 병렬 작업 가능 (Team B와 C)
- 각 기능은 독립적으로 테스트 가능
- 기존 코드 수정 최소화 (기능 추가 위주)

---

**생성일**: 2026-04-12  
**상태**: 📋 계획 완료 - 개발 준비 완료  
**다음**: Phase 2 개발 시작

