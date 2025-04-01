# Next.js SaaS Starter

이 프로젝트는 인증 지원, 결제를 위한 StepPay 통합, 로그인한 사용자를 위한 대시보드를 포함한 Next.js를 사용하여 SaaS 애플리케이션을 구축하기 위한 원본 [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) 템플릿을 기반으로 합니다.

**데모: [https://saas-starter-ko.vercel.app/](https://saas-starter-ko.vercel.app/)**

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
cd saas-starter
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
3. Vercel 배포 프로세스를 따르면 프로젝트 설정을 안내받을 수 있습니다.

### 환경 변수 추가하기

Vercel 프로젝트 설정(또는 배포 중)에서 필요한 모든 환경 변수를 추가합니다. 프로덕션 환경의 값을 업데이트해야 합니다:

1. `BASE_URL`: 프로덕션 도메인으로 설정합니다.
2. `STEPPAY_SECRET_KEY`: 프로덕션 환경용 StepPay 비밀 키를 사용합니다.
3. `STEPPAY_WEBHOOK_SECRET`: 1단계에서 생성한 프로덕션 웹훅의 웹훅 비밀을 사용합니다.
4. `POSTGRES_URL, NEXTAUTH_SECRET`: 프로덕션 데이터베이스 URL로 설정합니다.
5. `AUTH_SECRET`: 무작위 문자열로 설정합니다. `openssl rand -base64 32`로 생성할 수 있습니다.
6. `GOOGLE_ID, FACEBOOK_ID`: Google 및 Facebook OAuth 클라이언트 ID로 설정합니다.
7. `GOOGLE_SECRET, FACEBOOK_SECRET`: Google 및 Facebook OAuth 클라이언트 비밀로 설정합니다.
