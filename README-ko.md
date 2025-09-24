[English](https://github.com/kych0912/saas-starter-ko/blob/main/README.md) | 한국어

# Next.js SaaS Starter

이 프로젝트는 인증 지원, 결제를 위한 StepPay 통합, 로그인한 사용자를 위한 대시보드를 포함한 Next.js를 사용하여 SaaS 애플리케이션을 구축하기 위한 원본 [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) 템플릿을 기반으로 합니다.

**데모: [https://saas-starter-ko.vercel.app/ko](https://saas-starter-ko.vercel.app/ko)**

## 새로운 기능 및 수정사항

1. 결제 방식 변경 (Stripe -> StepPay)
2. StepPay 웹훅 기반 구독 결제 지원
3. 다크 모드
4. 한국어/영어 다국어 지원
5. i18next를 위한 Excel 번역 파일을 JSON 형식으로 변환하는 파싱 스크립트
6. 구글 & 페이스북 로그인

## 기능

- 애니메이션 터미널 요소가 있는 마케팅 랜딩 페이지 (`/`)
- StepPay Checkout과 연결되는 가격 책정 페이지 (`/pricing`)
- 사용자/팀에 대한 CRUD 작업이 가능한 대시보드 페이지
- 소유자 및 구성원 역할이 있는 기본 RBAC
- StepPay 고객 포털을 통한 구독 관리
- 쿠키에 저장된 JWT를 사용한 이메일/비밀번호 인증
- 로그인된 경로를 보호하는 전역 미들웨어
- 서버 액션을 보호하거나 Zod 스키마를 검증하는 로컬 미들웨어
- 모든 사용자 이벤트에 대한 활동 로깅 시스템

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/)
- **데이터베이스**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **결제**: [StepPay](https://steppay.kr/)
- **UI 라이브러리**: [shadcn/ui](https://ui.shadcn.com/)

## 시작하기

```bash
git clone https://github.com/kych0912/saas-starter-ko
cd saas-starter-ko
pnpm install
```

## 로컬에서 실행하기

포함된 설정 스크립트를 사용하여 `.env` 파일을 생성하세요:

```bash
pnpm db:setup
```

그런 다음, 데이터베이스 마이그레이션을 실행하고 기본 사용자 및 팀으로 데이터베이스를 시드하세요:

```bash
pnpm db:migrate
pnpm db:seed
```

이렇게 하면 다음과 같은 사용자와 팀이 생성됩니다:

- 사용자: `test@test.com`
- 비밀번호: `admin123`

물론, `/sign-up`을 통해 새 사용자를 생성할 수도 있습니다.

마지막으로, Next.js 개발 서버를 실행하세요:

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)을 브라우저에서 열어 앱이 작동하는 것을 확인하세요.

## Resend(이메일) 사용 방법

팀 초대 메일 등 트랜잭션 메일 발송에 Resend를 사용합니다. 현재는 대시보드 팀 초대 액션에서 초대 링크를 포함한 이메일을 발송합니다.

템플릿은

```
apps/client/components/email/invite-team.tsx
```

에서 React Email을 사용합니다.

### 도메인 발신(SPF/DKIM) 권장

보다 안정적인 수신을 위해 Resend에서 커스텀 도메인을 연결하고 DNS(SPF/DKIM) 인증을 완료하세요. 도메인 연결 없이도 테스트는 가능하지만, 프로덕션에서는 스팸 필터링 가능성이 높습니다

## Excel에서 i18n JSON 변환 가이드

이 가이드는 Next.js SaaS Starter 프로젝트에서 번역 스크립트를 사용하여 Excel 파일을 i18n JSON 형식으로 변환하는 방법을 설명합니다.

### Excel 파일 형식

번역용 Excel 파일은 다음과 같은 형식으로 구성되어야 합니다:

```
namespace.key English Korean
```

예시:

```
signup.title Create your account 계정 생성
signup.email email 이메일
```

### Excel을 JSON으로 변환하기

Excel 번역 파일을 i18n JSON 형식으로 변환하려면 다음 단계를 따르세요:

1. 위에서 설명한 형식으로 키, 영어 번역, 한국어 번역이 포함된 Excel 파일을 준비합니다.

2. Excel 파일을 프로젝트의 지정된 디렉토리에 저장합니다.
   (일반적으로 `/data` 폴더에 위치)

3. 터미널에서 다음 명령어를 실행합니다:

```bash
pnpm prebuild
```

4. 이 명령어는 Excel 파일을 자동으로 파싱하여 i18n과 호환되는 JSON 형식으로 변환합니다.

### 생성된 JSON 구조

변환 후, 스크립트는 프로젝트의 로케일 디렉토리에 각 언어와 네임스페이스에 대한 JSON 파일을 생성합니다. 다음은 생성된 파일의 예시입니다:

#### `/i18n/locales/en/activity.json`

```json
{
  "title": "Activity Log",
  "card_title": "Recent Activity",
  "sign_up": "You signed up",
  "sign_in": "You signed in",
  "sign_out": "You signed out",
  "update_password": "You changed your password",
  "delete_account": "You deleted your account",
  "update_account": "You updated your account",
  "create_team": "You created a new team",
  "remove_team_member": "You removed a team member",
  "invite_team_member": "You invited a team member",
  "accept_invitation": "You accepted an invitation",
  "unknown": "Unknown action occurred",
  "no_activity": "No activity yet",
  "when_you_perform_actions": "When you perform actions like signing in or updating your account, they'll appear here.",
  "just_now": "just now",
  "minutes_ago": "{{count}} minutes ago",
  "hours_ago": "{{count}} hours ago",
  "days_ago": "{{count}} days ago"
}
```

#### `/i18n/locales/ko/activity.json`

```json
{
  "title": "활동 로그",
  "card_title": "최근 활동",
  "sign_up": "회원가입 완료",
  "sign_in": "로그인 완료",
  "sign_out": "로그아웃 완료",
  "update_password": "비밀번호 변경 완료",
  "delete_account": "계정 삭제 완료",
  "update_account": "계정 정보 업데이트 완료",
  "create_team": "새 팀 생성 완료",
  "remove_team_member": "팀 멤버 제거 완료",
  "invite_team_member": "팀 멤버 초대 완료",
  "accept_invitation": "초대 수락 완료",
  "unknown": "알 수 없는 작업이 발생했습니다",
  "no_activity": "아직 활동이 없습니다.",
  "when_you_perform_actions": "로그인 또는 업데이트 시, 이곳에 표시됩니다.",
  "just_now": "방금",
  "minutes_ago": "{{count}}분 전",
  "hours_ago": "{{count}}시간 전",
  "days_ago": "{{count}}일 전"
}
```

이러한 JSON 파일은 i18n 시스템에서 사용할 수 있는 각 언어(영어 및 한국어)에 대한 객체 구조로 생성됩니다.

애플리케이션에서는 다음과 같이 키를 사용하여 이러한 번역을 사용용할 수 있습니다:

```typescript
// 클라이언트 컴포넌트에서 언어, 네임스페이스 및 옵션과 함께 번역 훅 임포트
const { t } = useTranslation(lng, 'setting', {})

// 서버 컴포넌트에서는 /useTranslation에서 useTranslation 임포트
const { t } = useTranslation(lng, 'setting')

<div>
    {t('title')}
    {t('card_title')}
</div>
```

## 결제 테스트하기

StepPay 결제를 테스트하려면 다음이 필요합니다:
테스트를 위해 실제 카드 번호를 사용해야 하지만, 올바른 테스트 기능을 위해 로컬에서 테스트하세요. 좋은 소식은 로컬과 데모에서 테스트할 때는 실제로 카드에 요금이 청구되지 않는다는 것입니다.

테스트 목적으로 실제 신용/직불 카드 또는 카카오페이를 사용할 수 있습니다.

카드 번호: 실제 카드 번호를 사용해야 합니다
만료일: 미래의 날짜라면 어떤 날짜든 괜찮습니다

## 프로덕션으로 전환하기

SaaS 애플리케이션을 프로덕션에 배포할 준비가 되면 다음 단계를 따르세요:

### 프로덕션 StepPay 웹훅 설정하기

1. StepPay 대시보드로 이동하여 프로덕션 환경을 위한 새 웹훅을 생성합니다.
2. 엔드포인트 URL을 프로덕션 API 경로로 설정합니다(예: `https://yourdomain.com/api/steppay/webhook`).
3. 수신하려는 이벤트를 선택합니다.

### Vercel에 배포하기

1. 코드를 GitHub 저장소에 푸시합니다.
2. 저장소를 [Vercel](https://vercel.com/)에 연결하고 배포합니다.
3. 해당 프로젝트로 이동해서 Settings 탭에서 Build and Deployment 섹션으로 이동해주세요
4. Root Directory 설정에서 apps/client를 입력해주세요.
5. Vercel 배포 프로세스를 따르면 프로젝트 설정을 안내받을 수 있습니다.

### 환경 변수 추가하기

Vercel 프로젝트 설정(또는 배포 중)에서 필요한 모든 환경 변수를 추가합니다. 프로덕션 환경의 값을 업데이트해야 합니다:

1. `BASE_URL`: 프로덕션 도메인으로 설정합니다.
2. `STEPPAY_SECRET_KEY`: 프로덕션 환경용 StepPay 비밀 키를 사용합니다.
3. `STEPPAY_WEBHOOK_SECRET`: 1단계에서 생성한 프로덕션 웹훅의 웹훅 비밀을 사용합니다.
4. `POSTGRES_URL, NEXTAUTH_SECRET`: 프로덕션 데이터베이스 URL로 설정합니다.
5. `AUTH_SECRET`: 무작위 문자열로 설정합니다. `openssl rand -base64 32`로 생성할 수 있습니다.
6. `GOOGLE_ID, NAVER_ID`: Google 및 NAVER OAuth 클라이언트 ID로 설정합니다.
7. `GOOGLE_SECRET, NAVER_SECRET`: Google 및 NAVER OAuth 클라이언트 비밀로 설정합니다.
8. `RESEND_API_KEY`: Resend에서 발급받은 API Key로 설정합니다.
9. `RESEND_FROM`: Resend를 통해 보낼 이메일 주소입니다. 설정하지 않을 경우 onboarding@resend.dev로 발송됩니다.
