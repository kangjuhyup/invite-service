# 📩 강주협 모노레포

개인적으로 개발하고 있는 서비스 모노레포입니다.

---

## 🛠️ 기술 스택
| **기술**         | **버전**    |
|-------------------|------------|
| **TypeScript**    | v5.6.3     |
| **Node.js**       | v20        |
| **Yarn**          | v4.5.0     |
| **Database**      | MySQL      |
| **Cache & Session** | Redis    |
| **Message & Event** | Kafka    |
---

## 📁 프로젝트 구조

```plaintext
packages
├── server         # 서버 관련 모듈
│   
├── page           # 프론트엔드 페이지
│    
├── app            # 모바일 앱
│
└── lib [TODO]     # 공통 라이브러리
     ├── util    # 공통 유틸리티
     ├── ui     # 프론트엔드 관련 모듈
     └── module      # 백엔드 관련 모듈
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
## 📄 서비스 정보

| 서비스        | API 문서                                                                        | 페이지                                                | 앱 다운로드 |
|---------------|---------------------------------------------------------------------------------|-------------------------------------------------------|--------------|
| 📩 **초대장 서비스** | [invite.jhkang.xyz/api/docs](https://invite.jhkang.xyz/api/docs)         | [invite.jhkang.xyz/page](https://invite.jhkang.page)  | **[TODO]**   |
| 🏢 **팀 현장 서비스** |                                                              **[TODO]** | **[TODO]**                                            | **[TODO]**   |


## 🏗 Infra

| 구성 요소       | 사용 기술  |
|---------------|-----------|
| ☁ **Cloud**  | Oracle Cloud |
| 💻 **Instance** | Oracle A1 |
| 🔄 **CI/CD**   | GitHub Actions |
| 📊 **Monitoring** | Prometheus & Grafana |
| 📜 **Logging**   | Elasticsearch + Filebeat + Kibana |
| 🐳 **Docker 관리** | Portainer |
| 📂 **파일 저장소** | Wasabi Storage |



