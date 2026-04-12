# 🔍 팀 환경 가이드 리뷰 보고서

**작성일**: 2026-04-12  
**리뷰 대상**: TEAM_A_ENV.md, TEAM_B_ENV.md, TEAM_C_ENV.md  
**상태**: 🔴 수정 필요 (총 3개 문제)

---

## 📋 리뷰 결과 요약

| 팀 | 파일명 | 상태 | 문제 수 | 심각도 |
|---|---|---|---|---|
| **A** | TEAM_A_ENV.md | ⚠️ 부분 수정 필요 | 3개 | 🟡 중간 |
| **B** | TEAM_B_ENV.md | ⚠️ 부분 수정 필요 | 2개 | 🟡 중간 |
| **C** | TEAM_C_ENV.md | ⚠️ 부분 수정 필요 | 2개 | 🟡 중간 |

---

## 🅰️ Team A 리뷰 (TEAM_A_ENV.md)

### 문제 1️⃣: Script 태그 순서 구식 (심각도: 🟡 중간)

**위치**: Line 106-109  
**현재 내용**:
```html
<script src="js/renderer.js"></script>
<script src="js/ui.js"></script>
<script src="js/game.js"></script>
```

**문제**: 
- storage.js와 sound.js가 누락되어 있음
- 로드 순서가 COMPLETE_PLAN.md의 수정사항과 맞지 않음
- sound.js는 초기화 시 Storage.isMuted()를 호출하므로 반드시 storage.js 이후에 로드되어야 함

**수정 필요**:
```html
<script src="js/storage.js"></script>    ← 추가 (sound.js보다 먼저!)
<script src="js/sound.js"></script>      ← 추가
<script src="js/renderer.js"></script>
<script src="js/ui.js"></script>
<script src="js/game.js"></script>
<script src="js/confetti.js"></script>   ← 추가
```

---

### 문제 2️⃣: game:playing 이벤트 미언급 (심각도: 🟡 중간)

**위치**: Line 30-39 (Phase 1 game.js 체크리스트)  
**현재 내용**:
```javascript
✅ bird:jumped
✅ pipe:passed
✅ game:over
// game:playing 없음
```

**문제**: 
- COMPLETE_PLAN.md에서 game:playing 이벤트가 추가되었음
- B팀이 이 이벤트를 수신하여 UI 업데이트를 할 수 있음
- 체크리스트에 누락되어 있음

**수정 필요**:
```javascript
✅ game:playing 발행 (매 프레임, detail: { score })
```

---

### 문제 3️⃣: Test 명령어 - game:over 이벤트 데이터 오류 (심각도: 🟡 중간)

**위치**: Line 177-180  
**현재 내용**:
```javascript
document.dispatchEvent(new CustomEvent('game:over', {
  detail: { score: 10, bestScore: 10, character: 0 }
}))
```

**문제**: 
- COMPLETE_PLAN.md에서 bestScore는 game:over 이벤트에 포함되지 않음
- ui.js가 Storage.getBestScore()를 직접 호출하도록 변경됨
- 테스트 코드가 구식 인터페이스를 사용함

**수정 필요**:
```javascript
document.dispatchEvent(new CustomEvent('game:over', {
  detail: { score: 10, character: 0 }  // bestScore 제거
}))
```

---

## 🅱️ Team B 리뷰 (TEAM_B_ENV.md)

### 문제 1️⃣: 최고 기록 DOM ID 불명확 (심각도: 🟡 중간)

**위치**: Line 38  
**현재 내용**:
```
✅ 최고 기록 표시 (id="best-score-*")
```

**문제**: 
- 실제 HTML ID는 #best-score-start와 #best-score-gameover
- 공유규약 00-work-methodology.md에서도 업데이트됨
- 체크리스트가 불명확함

**수정 필요**:
```
✅ 최고 기록 표시
  ✅ #best-score-start (시작 화면)
  ✅ #best-score-gameover (게임오버 화면)
```

---

### 문제 2️⃣: Script 태그 추가 안내 누락 (심각도: 🟡 중간)

**위치**: Step 4 (Line 101-109)  
**현재 내용**:
```
Step 4: index.html에 스크립트 추가
<!-- 마지막에 추가 (다른 팀과 함께) -->
<script src="js/renderer.js"></script>
<script src="js/ui.js"></script>
<script src="js/game.js"></script>
```

**문제**: 
- 불완전한 스크립트 목록
- storage.js, sound.js, confetti.js가 누락됨
- 순서가 중요한데 설명이 부족함

**수정 필요**:
```
Step 4: index.html에 스크립트 추가 (완전한 순서)

<!-- ⚠️ 순서 중요! storage.js가 가장 먼저! -->
<script src="js/storage.js"></script>    <!-- A팀: 필요 -->
<script src="js/sound.js"></script>      <!-- C팀: 필요 -->
<script src="js/renderer.js"></script>   <!-- A팀: 작성 -->
<script src="js/ui.js"></script>         <!-- B팀: 작성 -->
<script src="js/game.js"></script>       <!-- A팀: 작성 -->
<script src="js/confetti.js"></script>   <!-- C팀: 필요 -->
```

---

## 🅲 Team C 리뷰 (TEAM_C_ENV.md)

### 문제 1️⃣: API 이름 구식 - getTop3Scores vs getTop3 (심각도: 🔴 높음)

**위치**: Line 32, 194  
**현재 내용**:
```javascript
// Line 32
✅ getTop3Scores() - TOP3 반환

// Line 194
Storage.getTop3Scores()  // [42, 0, 0] 또는 유사
```

**문제**: 
- COMPLETE_PLAN.md에서 API 이름이 getTop3()로 통일됨
- 공유규약 00-work-methodology.md도 수정됨
- 팀 가이드가 구식 이름을 사용함

**수정 필요**:
```javascript
// Line 32
✅ getTop3() - TOP3 반환

// Line 194
Storage.getTop3()  // [{score: 42, date: '...'}, ...]
```

---

### 문제 2️⃣: saveScore() 함수 미언급 (심각도: 🟡 중간)

**위치**: Phase 1 체크리스트 (Line 27-37)  
**현재 내용**:
```javascript
✅ saveBestScore(score) - 신기록 판정
```

**문제**: 
- COMPLETE_PLAN.md에서 saveScore() 함수가 추가됨
- 모든 점수를 저장하고, saveBestScore()는 신기록 판정만 함
- 이 분리가 TOP3가 정확히 작동하는 핵심
- 체크리스트에 누락됨

**수정 필요**:
```javascript
✅ saveScore(score) - 모든 점수 저장 (항상 호출)
✅ saveBestScore(score) - 신기록 판정 (saveScore 호출 후 최고점 비교)
```

---

## ✅ 수정할 파일 목록

| 파일 | 수정 라인 | 변경 사항 | 우선도 |
|---|---|---|---|
| TEAM_A_ENV.md | 106-109 | Script 태그 순서 전체 교체 | 🔴 높음 |
| TEAM_A_ENV.md | 30-39 | game:playing 이벤트 추가 | 🟡 중간 |
| TEAM_A_ENV.md | 177-180 | game:over 이벤트에서 bestScore 제거 | 🟡 중간 |
| TEAM_B_ENV.md | 38 | DOM ID 명확화 (#best-score-start/gameover) | 🟡 중간 |
| TEAM_B_ENV.md | 101-109 | Script 태그 완전 목록으로 교체 | 🔴 높음 |
| TEAM_C_ENV.md | 32, 194 | getTop3Scores → getTop3 | 🔴 높음 |
| TEAM_C_ENV.md | 27-37 | saveScore() 함수 추가 | 🟡 중간 |

---

## 🎯 전체 평가

### 강점 ✅
- 각 팀의 역할과 목표가 명확함
- 단계별 구현 가이드가 상세함
- 테스트 명령어가 풍부함
- 주의사항(pitfalls)이 잘 문서화됨

### 약점 ⚠️
- COMPLETE_PLAN.md의 수정사항이 완전히 반영되지 않음
- Script 태그 순서가 여러 파일에서 구식임
- 새 API 이름(getTop3, saveScore)이 반영되지 않음
- game:playing 이벤트가 누락됨

### 결론
**지금 수정하면 3팀 병렬 개발 완전히 준비 완료 가능**

현재 상태로 개발을 시작하면 다음 문제가 발생할 수 있음:
1. 스크립트 로드 순서 오류 → ReferenceError (즉시)
2. API 이름 불일치 → TypeError (통합 시)
3. game:playing 미발행 → UI 업데이트 지연

---

## 📝 수정 우선순위

1. **🔴 P1 (즉시 수정)**: Script 태그 순서 (TEAM_A/B)
2. **🔴 P1 (즉시 수정)**: API 이름 getTop3 (TEAM_C)
3. **🟡 P2**: game:over 이벤트 데이터, saveScore 언급
4. **🟡 P2**: DOM ID 명확화, game:playing 언급

---

**생성일**: 2026-04-12  
**검토자**: Claude Code  
**상태**: 리뷰 완료, 수정 대기
