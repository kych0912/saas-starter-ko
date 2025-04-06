# 기여 가이드

saas-starter-ko는 적극적으로 기여를 장려합니다. 버그가 있거나 새로운 기능에 대한 아이디어가 있으시면 이슈에 게시해 주세요.
  
## 비전
saas-starter-ko는 개발자가 소프트웨어 서비스(SaaS) 애플리케이션을 빠르고 효율적으로 구축할 수 있도록 설계된 오픈 소스 템플릿입니다. 우리는 다음과 같은 원칙을 중요시해요:
- **개발 속도**: 반복적인 작업을 최소화하고 더 빠른 개발 주기 지원
- **확장성**: 소규모 프로젝트부터 대규모 애플리케이션까지 확장 가능한 아키텍처 제공
- **모듈성**: 필요한 기능만 선택적으로 사용할 수 있는 모듈식 설계 지향
- **접근성**: 초보자부터 전문가까지 모든 수준의 개발자가 접근할 수 있도록 함

## 우리가 추구하는 것
- **코드베이스 구조를 단순하게 유지합니다**. SaaS 개발자가 쉽게 기능을 추가하고 수정할 수 있어야 해요.
- **모듈성을 목표로 합니다**. 아직 구현되지 않았지만 'packages' 폴더에 모듈(예: MFA, Email 공지, 에디터 등)을 추가해야해요.
- **필요한 의존성만 추가합니다**. 이는 프로젝트가 과도하게 복잡해지는 것을 방지해요.
- **과도한 추상화를 피합니다**. 불필요한 복잡성을 증가시키는 패턴을 피해요.

## 기여 프로세스

이 오픈 소스 프로젝트에 기여하려면 다음 단계를 따라주세요.

### 1. 설정

- 저장소를 [포크](https://github.com/kych0912/saas-starter-ko/fork)하세요
- 다음 명령을 사용하여 저장소를 복제해 주세요:

```bash
git clone https://github.com/<your_github_username>/saas-starter-ko.git
```

### 2. 프로젝트 폴더로 이동

```bash
cd saas-starter-ko
```

### 3. 업스트림 원격 저장소 구성
```bash
git remote add upstream git@github.com:kych0912/saas-starter-ko.git

# 원격 저장소 확인
git remote -v
```

### 4. 포크 업데이트 유지
- 새 기능 브랜치를 만들기 전에 포크의 메인 브랜치가 최신 상태인지 확인해 주세요:
```bash
# 메인 브랜치로 전환
git checkout main

# 업스트림 변경사항 가져오기
git fetch upstream

# 업스트림 메인 위에 로컬 메인 브랜치 리베이스
git rebase upstream/main

# GitHub의 포크 업데이트
git push origin main
```

### 5. 기능 브랜치 생성
- 다음 구조로 브랜치를 만들어주세요:
```bash
# 새 브랜치 생성 및 전환
git checkout -b feature/your-feature-name
```

### 6. 변경사항 커밋
- 다음과 같이 커밋해 주세요:
```bash
# 명확한 메시지로 커밋
git commit -m "feat: X 새 기능 추가"
```

### 7. 기능 브랜치 업데이트
- PR을 제출하기 전에 기능 브랜치를 업데이트해 주세요:
```bash
# 업스트림 변경사항 가져오기
git fetch upstream

# 기능 브랜치 리베이스
git checkout feature/your-feature-name
git rebase upstream/main
```

### 8. 포크에 푸시
```bash
# 기능 브랜치를 포크에 푸시
git push origin feature/your-feature-name
```

### 9. 풀 리퀘스트 생성
- PR 템플릿을 다음과 같이 작성해 주세요:
  - 변경사항에 대한 명확한 설명
  - 관련 이슈
  - 해당되는 경우 테스트 단계

### 10. 검토 프로세스
1. 메인테이너가 PR을 검토합니다
2. 다음과 같이 피드백을 처리해 주세요:
   - 요청된 변경사항 적용
   - 기능 브랜치에 새 커밋 푸시
   - PR이 자동으로 업데이트됩니다
3. 승인되면 메인테이너가 PR을 병합합니다