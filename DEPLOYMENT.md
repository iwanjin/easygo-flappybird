# 🚀 배포 가이드 (GitHub Pages)

> 냥냥 메모리 게임을 GitHub Pages를 통해 무료로 배포하는 방법

## 📋 배포 체크리스트

- [ ] GitHub 계정 준비
- [ ] 저장소 생성
- [ ] 코드 푸시
- [ ] GitHub Pages 활성화
- [ ] 배포 URL 확인
- [ ] 모바일 테스트

---

## 🔧 배포 단계

### 1단계: GitHub 저장소 생성

```bash
# GitHub.com에서 새 저장소 생성
# 저장소명: memo-cats
# 공개(Public)로 설정
```

### 2단계: 로컬 저장소 연결

```bash
# 기존 폴더에 원격 저장소 연결
git remote add origin https://github.com/[YOUR_USERNAME]/memo-cats.git
git branch -M main
git push -u origin main
```

### 3단계: GitHub Pages 활성화

#### 방법 1: GitHub 웹 UI (권장)
1. 저장소 → **Settings** → **Pages** 클릭
2. **Build and deployment** 섹션
3. **Source**: `Deploy from a branch` 선택
4. **Branch**: `main` / `/root` 선택
5. **Save** 클릭

#### 방법 2: GitHub CLI
```bash
# GitHub CLI 설치 후
gh repo edit --enable-issues --enable-projects --enable-wiki
```

### 4단계: 배포 확인

```
⏳ 배포 대기: 1~3분
✅ 완료: 다음 URL에서 접속 가능
https://[YOUR_USERNAME].github.io/memo-cats
```

---

## 📱 배포 후 확인 사항

### 1️⃣ 로드 테스트
```
확인 사항:
✅ 게임 화면이 정상 표시됨
✅ 카드 클릭으로 뒤집어짐
✅ 효과음 재생됨 (음소거 아님)
✅ 최고점이 저장됨
```

### 2️⃣ 모바일 테스트
```
기기: 아이폰, 안드로이드, 태블릿 테스트
✅ 터치 반응
✅ 화면 크기 조정 (반응형)
✅ 점수 표시 가시성
```

### 3️⃣ 브라우저 호환성 테스트
```
테스트 브라우저:
✅ Chrome / Chromium
✅ Firefox
✅ Safari (Mac/iOS)
✅ Edge
```

---

## 🔄 배포 후 수정 및 재배포

코드를 수정한 후 다시 배포하려면:

```bash
# 1. 코드 수정
# 2. 변경 사항 스테이징
git add .

# 3. 커밋
git commit -m "[팀C] 버그 수정: 음소거 기능"

# 4. 푸시 (자동 배포)
git push origin main
```

**배포 대기**: 1~3분 후 변경 사항이 반영됩니다.

---

## 📊 배포 상태 모니터링

### GitHub Actions로 배포 상태 확인

```
저장소 → Actions 탭
→ pages build and deployment
→ 최신 배포 결과 확인
```

| 상태 | 의미 | 조치 |
|:---|:---|:---|
| ✅ **Success** | 배포 완료 | 라이브 상태 |
| ⏳ **In Progress** | 배포 중 | 1~3분 대기 |
| ❌ **Failed** | 배포 실패 | 에러 로그 확인 후 수정 |

---

## 🆘 배포 문제 해결

### 문제 1: 404 에러 (페이지 없음)

**원인**: index.html이 없거나 경로 오류

**해결**:
```bash
# index.html 확인
ls -la index.html

# A팀에서 index.html 작성했는지 확인
# 아직 없으면 placeholder 생성
```

### 문제 2: 스타일이 적용 안 됨

**원인**: CSS 파일 경로 오류 또는 아직 생성 안 됨

**해결**:
```html
<!-- index.html에서 css 경로 확인 -->
<link rel="stylesheet" href="css/style.css">

<!-- css/style.css 파일이 존재하는지 확인 -->
```

### 문제 3: 효과음이 재생 안 됨

**원인**: assets/sounds/ 폴더 또는 음원 파일 없음

**해결**:
```bash
# 폴더 생성
mkdir -p assets/sounds

# MP3 파일 추가
# - assets/sounds/flip.mp3
# - assets/sounds/match.mp3
# - assets/sounds/mismatch.mp3
# - assets/sounds/win.mp3
```

### 문제 4: 최고점이 저장 안 됨

**원인**: LocalStorage가 비활성화되었거나 private 모드

**해결**:
1. 브라우저의 private/incognito 모드 종료
2. LocalStorage 허용 설정 확인
3. 브라우저 캐시 삭제 후 재시도

---

## 🔐 보안 참고사항

### GitHub Pages의 보안 특징

- **정적 호스팅만 가능** (서버 코드 불가)
- **HTTPS 자동 적용** (iwanjin.github.io 도메인)
- **서버 로그 불가능** (클라이언트만 가능)

### 개인정보 보호

✅ **안전함**:
- HTML/CSS/JavaScript 파일만 배포
- 서버에 데이터 전송 없음 (LocalStorage만 사용)
- 사용자 정보 수집 없음

---

## 📈 배포 후 모니터링

### 필요 데이터
```
- 누가 플레이했는가? → 확인 불가 (클라이언트 게임)
- 몇 명이 플레이했는가? → GitHub Pages 통계 사용 불가
- 버그 리포트는? → GitHub Issues 활용
```

### 개선 피드백 수집
```
GitHub Issues 활용:
1. https://github.com/[USERNAME]/memo-cats/issues
2. 사용자가 버그/개선사항 등록
3. 팀에서 수정 후 재배포
```

---

## 🎉 배포 완료!

**축하합니다! 🎊**

게임이 전 세계에 공개되었습니다.
다음을 확인하세요:

- 📱 링크 공유: `https://[USERNAME].github.io/memo-cats`
- 🔗 README.md에 배포 URL 포함
- 📧 피드백 수집: GitHub Issues 사용

---

**문제가 있으면 [GitHub Issues](https://github.com/iwanjin/memo-cats/issues)에 등록해주세요!**
