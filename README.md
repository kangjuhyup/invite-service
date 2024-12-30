# 📩 초대장 프로젝트

---

## 🛠️ 기술 스택
| **기술**         | **버전**    |
|-------------------|------------|
| **TypeScript**    | v5.6.3     |
| **Node.js**       | v20        |
| **Yarn**          | v4.5.0     |
| **Database**      | MySQL      |
| **Cache & Session** | Redis    |

---

## 📁 프로젝트 구조

```plaintext
packages
├── server         # 서버 관련 모듈
│    ├── auth      # 인증 모듈
│    ├── letter    # 초대장 기능
│    └── image     # 이미지 처리
├── page           # 프론트엔드 페이지
│    
├── app (TODO)     # 애플리케이션 메인 진입점
│
└── lib (TODO)     # 공통 라이브러리
     ├── common    # 공통 유틸리티
     ├── front     # 프론트엔드 관련 라이브러리
     └── back      # 백엔드 관련 라이브러리
```
## 🚀 초기 세팅

초기 환경을 설정하려면 아래 명령어를 실행하세요:

```bash
코드 복사
# 1. 레포지토리 클론
git clone https://github.com/kangjuhyup/invite-service.git

# 2. 프로젝트 디렉토리로 이동
cd ./invite-service

# 3. Node.js 버전 설정
nvm use 20

# 4. 의존성 설치
yarn install
```
