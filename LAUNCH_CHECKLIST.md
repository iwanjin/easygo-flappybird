# 🚀 3팀 병렬 개발 - 런칭 체크리스트

**작성일**: 2026-04-12  
**상태**: ✅ 모든 준비 완료  
**다음 액션**: "3팀 모두 개발 시작" 명령 입력

---

## 📋 준비 완료 항목 (✅)

### 문서 & 플랜
- ✅ COMPLETE_PLAN.md (12개 문제 분석 & 수정 완료)
- ✅ plan/00-work-methodology.md (공유규약, API 이름 통일)
- ✅ plan/01-team-a-logic.md (game.js + renderer.js 상세 코드)
- ✅ plan/02-team-b-ui.md (HTML + CSS + ui.js 상세 코드)
- ✅ plan/03-team-c-features.md (storage.js + sound.js + confetti.js 상세 코드)

### 팀 환경 가이드 (✅ 모두 수정 완료)
- ✅ TEAM_A_ENV.md (script 순서 수정, game:playing 추가, game:over 데이터 수정)
- ✅ TEAM_B_ENV.md (DOM ID 명확화, script 태그 완전 목록)
- ✅ TEAM_C_ENV.md (API 이름 getTop3 통일, saveScore 함수 추가)

### 운영 시스템
- ✅ TEAM_REVIEW_REPORT.md (3개 팀 가이드 검증 완료)
- ✅ MONITORING_SYSTEM.md (1분마다 모니터링 체계 수립)
- ✅ MASTER_TERMINAL.md (마스터 제어 센터)
- ✅ START_HERE.md (빠른 시작 가이드)

### 기술 준비
- ✅ 모든 script 로드 순서 확정
- ✅ 공유 규약 (API 이름, DOM ID, 이벤트) 통일
- ✅ 팀 간 인터페이스 명확화
- ✅ 파일 담당 분리 (중복 0개)
- ✅ 순환 의존성 제거

---

## 🎯 각 팀의 첫 단계

### Team A (게임 로직팀)
**Phase 1 목표**: game.js + renderer.js 기본 구조

1. plan/01-team-a-logic.md에서 game.js 코드 전체 복사
2. js/game.js 파일 생성 후 붙여넣기
3. plan/01-team-a-logic.md에서 renderer.js 코드 전체 복사
4. js/renderer.js 파일 생성 후 붙여넣기
5. 마스터에서 `Game.init('medium', 0)` 테스트

**체크**: Console에서 `typeof Game === 'object'` 확인

---

### Team B (UI/렌더링팀)
**Phase 1 목표**: index.html + style.css 기본 구조

1. plan/02-team-b-ui.md에서 index.html 코드 전체 복사
2. index.html 파일 생성 후 붙여넣기
   - **⚠️ 중요**: script 태그 순서 확인 (TEAM_A_ENV.md 참고)
3. plan/02-team-b-ui.md에서 style.css 코드 전체 복사
4. css/style.css 파일 생성 후 붙여넣기
5. 브라우저에서 http://localhost:8000 열어서 시작 화면 확인

**체크**: Canvas 요소 + 3개 화면 섹션 보임

---

### Team C (고급기능/배포팀)
**Phase 1 목표**: storage.js + sound.js 기본 구조

1. plan/03-team-c-features.md에서 storage.js 코드 전체 복사
2. js/storage.js 파일 생성 후 붙여넣기
3. plan/03-team-c-features.md에서 sound.js 코드 전체 복사
4. js/sound.js 파일 생성 후 붙여넣기
5. 마스터에서 `Storage.getBestScore()` 테스트

**체크**: Console에서 `typeof Storage === 'object'` 확인

---

## ⚠️ 주의사항 (필독!)

### 1. Script 로드 순서 (반드시 지켜야 함)
```html
<script src="js/storage.js"></script>    <!-- C팀: 1번 -->
<script src="js/sound.js"></script>      <!-- C팀: 2번 (storage 이후) -->
<script src="js/renderer.js"></script>   <!-- A팀: 3번 -->
<script src="js/ui.js"></script>         <!-- B팀: 4번 -->
<script src="js/game.js"></script>       <!-- A팀: 5번 -->
<script src="js/confetti.js"></script>   <!-- C팀: 6번 -->
```
**이유**: sound.js는 초기화 시 Storage.isMuted()를 호출하므로, Storage가 반드시 먼저 로드되어야 함

### 2. API 이름 통일
- **Storage**: `getTop3()` (getTop3Scores 아님!)
- **UI**: `updateBestScore()` (updateBestScoreDisplay 아님!)
- **Storage**: `saveScore()` + `saveBestScore()` (두 개 다!)

### 3. 공유 규약 준수
- 모든 이벤트 이름은 공유규약에 정의된 대로만 사용
- 다른 팀의 내부 구현을 건드리지 말 것 (공개 함수 & 이벤트만 사용)
- 새로운 함수/이벤트를 추가하려면 마스터에 먼저 상의

---

## 📊 모니터링 시작

### 자동 모니터링
```
마스터 터미널에서 실행:
python -m http.server 8000

그 후 각 팀이 개발 시작하면 자동으로 1분마다:
1. 파일 생성 확인
2. Script 로드 확인
3. Console 에러 확인
4. 기능 작동 확인
```

### 수동 모니터링 (F12 Console)
```javascript
// 1분마다 실행
typeof Game === 'object'      // true?
typeof Storage === 'object'   // true?
typeof Sound === 'object'     // true?
typeof UI === 'object'        // true?
```

---

## 🔍 즉시 테스트 (문제 발견 시)

### Script 로드 순서 문제
```
증상: "Storage is not defined" 에러
→ index.html의 <script> 태그 순서 확인
→ storage.js가 sound.js보다 먼저 로드되었나?
```

### API 이름 문제
```
증상: "undefined is not a function" 에러
→ 팀 가이드의 API 이름 다시 확인
→ 공유규약(00-work-methodology.md)과 일치하나?
```

### 파일 누락 문제
```
증상: "Cannot find module" 또는 빈 파일
→ plan 파일에서 코드를 제대로 복사했나?
→ 파일명이 정확한가? (game.JS가 아니라 game.js)
```

---

## 🚀 시작 명령어

모든 팀이 준비되었을 때:

```
마스터: "웹 서버 시작합니다"
python -m http.server 8000

마스터: "3팀 모두 개발 시작합니다"
(각 팀이 위의 "각 팀의 첫 단계" 시작)

마스터: "1분마다 모니터링 시작합니다"
MONITORING_SYSTEM.md의 체크리스트 시작
```

---

## 📈 예상 진행 일정

### Day 1
```
09:00-09:30  킥오프 회의 & 환경 설정
09:30-12:00  Phase 1 (3팀 병렬 개발)
12:00-13:00  점심
13:00-16:00  Phase 2 (게임 로직)
16:00-17:00  Phase 3 (통합 테스트)

예상 결과: 게임 기본 플레이 가능 ✅
```

### Day 2
```
09:00-12:00  Phase 4 (고급 기능)
12:00-13:00  점심
13:00-14:30  Phase 5 (최종 QA)
14:30-15:00  배포

예상 결과: GitHub Pages 라이브 배포 ✅
```

---

## ✨ 최종 체크

### 플랜 파일
- ✅ 모든 plan/*.md 파일이 최신 수정사항 반영?
- ✅ API 이름, DOM ID, 이벤트가 통일되어 있나?
- ✅ 예제 코드가 최신 상태인가?

### 팀 환경 가이드
- ✅ TEAM_A_ENV.md가 script 순서 포함?
- ✅ TEAM_B_ENV.md가 DOM ID 명확화?
- ✅ TEAM_C_ENV.md가 saveScore() + getTop3() 포함?

### 운영 시스템
- ✅ MONITORING_SYSTEM.md가 모든 체크 포함?
- ✅ MASTER_TERMINAL.md가 명령어 완전?
- ✅ 문제 대응 절차가 명확한가?

### 기술 준비
- ✅ 웹 서버 (python -m http.server 8000) 실행 가능?
- ✅ 브라우저 F12 콘솔 접근 가능?
- ✅ 모든 파일 디렉토리 생성되었나? (js/, css/, assets/)

---

## 🎯 성공 표시

### Phase 1 완료 (12:00)
```
✅ Canvas에 파란 배경 + 새 렌더링
✅ 클릭하면 새가 점프
✅ 점수 표시
✅ Console 에러 0개
```

### Phase 2 완료 (16:00)
```
✅ UI 화면 전환 (시작 → 게임 → 게임오버)
✅ 파이프 충돌 감지
✅ 신기록 저장
✅ 효과음 재생 (또는 음소거)
```

### Phase 3 완료 (17:00)
```
✅ 게임 완벽 작동
✅ 모바일 반응형 (375px)
✅ 모든 기능 통합
✅ README.md 작성
```

### 배포 완료 (15:00 Day 2)
```
✅ GitHub Pages URL 라이브
✅ 외부에서 접속 가능
✅ 게임 완벽 작동
```

---

## 📞 응급 핫라인

문제 발생 시:
1. **즉시**: F12 Console 에러 메시지 확인
2. **5분 내**: 해당 팀 문제 파악
3. **10분 내**: 수정 & 재테스트
4. **필요시**: 마스터가 다른 팀 지원

---

**준비 상태**: ✅ 100% 완료  
**시작 가능**: 즉시  
**예상 완료**: Day 2 15:00

**지금 바로 시작 가능합니다!** 🎉

3팀이 완전히 독립적으로 작동하며, 문제 발생 시 빠르게 감지하고 해결할 수 있는 체계가 완비되었습니다.

준비되셨으면 "3팀 모두 개발 시작" 명령을 내려주세요! 🚀
