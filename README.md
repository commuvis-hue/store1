# 옆집마켓 — 동네 기반 중고거래 웹앱 (React + Vite)

당근형 하이퍼로컬 마켓의 주요 기능을 구현한 개발용 프로젝트입니다. 백엔드 없이 브라우저 localStorage에 데이터를 저장합니다.

## 실행
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ 생성
```

## Vercel 배포
1. 이 폴더를 GitHub 저장소에 push
2. vercel.com → Add New → Project → 저장소 Import
3. Framework Preset: **Vite** (자동 인식) → Deploy
   - CLI: `npm i -g vercel && vercel --prod`
- `vercel.json`의 rewrite 설정으로 `/products/p1` 같은 주소를 새로고침해도 404가 나지 않습니다.

## 구현 기능
- **중고거래**: 피드(최신·끌올순), 카테고리, 검색(정렬·가격·카테고리 필터, 최근/인기 검색어), 상품 상세(사진 슬라이드, 조회/관심/채팅 수), 관심상품, 공유
- **글쓰기/관리**: 사진 업로드(최대 10장, 자동 리사이즈), 판매/나눔, 가격 제안 허용, 거래 희망 장소, 수정·삭제·숨기기·끌어올리기, 판매중/예약중/거래완료 변경 및 구매자 선택
- **채팅**: 채팅 목록(전체/판매/구매/안읽음), 대화방, 가격 제안, 사진 전송, 약속 잡기(자동 예약중 전환), 장소 공유, 구매 확정, 차단·신고·나가기, 데모용 자동 응답
- **신뢰/안전**: 매너온도, 거래 후기·매너 칭찬(온도 반영), 동네 인증(위치 권한), 신고, 사용자 차단, 게시글 숨기기
- **동네생활**: 주제별 게시판, 검색, 글쓰기(사진), 공감, 댓글
- **내 근처**: 동네가게(쿠폰·단골), 알바, 부동산, 중고차
- **나의 옆집**: 프로필·닉네임 수정, 판매/구매/관심 내역, 내 동네 설정(최대 2개·범위), 키워드 알림, 알림함, 차단/숨김 관리, 데이터 초기화

## 구조
```
src/
  data/mock.js        목업 데이터 (상품 사진: Unsplash 실사)
  store/Store.jsx     전역 상태 + localStorage 저장
  store/router.jsx    경량 라우터 (History API)
  components/         공통 UI, 아이콘
  pages/              화면별 컴포넌트
```

## 실서비스로 확장할 때
- 인증/DB: Supabase, Firebase 등으로 `Store.jsx`의 dispatch를 API 호출로 교체
- 실시간 채팅: Supabase Realtime, Firebase Firestore, Socket.io
- 이미지: Vercel Blob, S3, Cloudinary 업로드
- 지도/위치 인증: 카카오맵 또는 네이버 지도 API
