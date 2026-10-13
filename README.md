# AI 챗봇 웹앱

HTML/CSS/JavaScript + Node.js(Express)로 만든 간단한 AI 챗봇입니다.
OpenAI의 `gpt-4o-mini` 모델을 사용하며, 대화 기록은 데이터베이스 없이 브라우저(sessionStorage)에 보관되어 매 요청마다 서버로 전송됩니다.

## 구조

```
.
├── api/index.js      # Vercel 서버리스 함수 엔트리 (Express 앱 재노출)
├── server.js          # 로컬 개발용 Express 서버 엔트리
├── src/app.js         # Express 앱 정의 (라우트, /api/chat)
├── public/            # 정적 프론트엔드 (HTML/CSS/JS)
├── vercel.json        # Vercel 배포 설정
└── .env.example       # 환경 변수 예시
```

## 로컬 실행

```bash
npm install
cp .env.example .env   # .env 파일에 OPENAI_API_KEY 입력
npm start
```

브라우저에서 http://localhost:3000 접속

## Vercel 배포

1. GitHub 저장소에 push
2. Vercel에서 이 저장소를 Import
3. Vercel 프로젝트 설정의 Environment Variables에 `OPENAI_API_KEY` 추가
4. Deploy

`vercel.json`이 모든 요청을 `api/index.js`(Express 앱)로 라우팅하므로 별도 설정 없이 정적 파일과 `/api/chat` 엔드포인트가 함께 동작합니다.
