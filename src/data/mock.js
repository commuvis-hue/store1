// 실사 이미지: Unsplash (무료 사용 라이선스). 로드 실패 시 Img 컴포넌트가 대체 이미지로 전환합니다.
export const u = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const REGIONS = ['망원동', '연남동', '성수동', '역삼동', '잠실동', '상도동', '목동', '합정동'];

export const CATEGORIES = [
  { id: 'digital', name: '디지털기기', icon: '📱' },
  { id: 'appliance', name: '생활가전', icon: '🔌' },
  { id: 'furniture', name: '가구/인테리어', icon: '🛋️' },
  { id: 'kitchen', name: '생활/주방', icon: '🍳' },
  { id: 'kids', name: '유아동', icon: '🧸' },
  { id: 'fashion', name: '의류/잡화', icon: '👟' },
  { id: 'beauty', name: '뷰티/미용', icon: '💄' },
  { id: 'sports', name: '스포츠/레저', icon: '🚲' },
  { id: 'hobby', name: '취미/게임/음반', icon: '🎮' },
  { id: 'books', name: '도서', icon: '📚' },
  { id: 'plants', name: '식물', icon: '🪴' },
  { id: 'etc', name: '기타 중고물품', icon: '📦' },
];

export const USERS = {
  me: { id: 'me', nickname: '새싹이웃', temp: 36.5, region: '망원동', joined: '2026-03-02', color: '#0E7C66' },
  u1: { id: 'u1', nickname: '망원동고양이', temp: 42.3, region: '망원동', joined: '2023-05-11', color: '#E8590C', responseRate: 98 },
  u2: { id: 'u2', nickname: '자전거타는곰', temp: 38.9, region: '연남동', joined: '2024-01-20', color: '#1971C2', responseRate: 91 },
  u3: { id: 'u3', nickname: '미니멀라이프', temp: 51.2, region: '성수동', joined: '2021-09-03', color: '#9C36B5', responseRate: 100 },
  u4: { id: 'u4', nickname: '커피는아아', temp: 36.8, region: '망원동', joined: '2025-07-15', color: '#2F9E44', responseRate: 85 },
  u5: { id: 'u5', nickname: '이사가요', temp: 40.1, region: '합정동', joined: '2022-02-28', color: '#C2255C', responseRate: 95 },
  u6: { id: 'u6', nickname: '육아맘', temp: 45.6, region: '망원동', joined: '2022-11-08', color: '#F08C00', responseRate: 97 },
  u7: { id: 'u7', nickname: '게임덕후', temp: 37.4, region: '연남동', joined: '2024-06-30', color: '#3B5BDB', responseRate: 88 },
};

const H = 3600 * 1000;
const D = 24 * H;
const now = Date.now();

const P = (id, o) => ({
  id,
  status: 'selling',
  views: 20 + ((id.length * 37) % 180),
  baseLikes: (id.charCodeAt(1) * 7) % 25,
  chatCount: (id.charCodeAt(1) * 3) % 9,
  offerable: true,
  nanum: false,
  ...o,
});

export const PRODUCTS = [
  P('p1', { title: '아이폰 15 프로 256GB 내추럴 티타늄', price: 1050000, category: 'digital', sellerId: 'u1', region: '망원동', createdAt: now - 12 * 60000,
    images: [u('1511707171634-5f897ff02aa9'), u('1512499617640-c74ae3a79d37')],
    desc: '작년 10월 구매, 케이스+필름 끼고 사용해서 기스 없습니다.\n배터리 성능 93%\n박스, 충전케이블 모두 있어요.\n망원역 근처 직거래 선호합니다.' }),
  P('p2', { title: '맥북 에어 M2 13인치 미드나이트', price: 890000, category: 'digital', sellerId: 'u3', region: '성수동', createdAt: now - 2 * H,
    images: [u('1517336714731-489689fd1ca8'), u('1496181133206-80ce9b88a853')],
    desc: '사이클 120회. 외관 깨끗합니다.\n회사에서 노트북 지급받아서 판매해요.\n충전기 포함, 파우치 서비스로 드립니다.' }),
  P('p3', { title: '소니 노이즈캔슬링 헤드폰', price: 220000, category: 'digital', sellerId: 'u4', region: '망원동', createdAt: now - 5 * H, status: 'reserved',
    images: [u('1505740420928-5e560c06d30e'), u('1583394838336-acd977736f90')],
    desc: '출퇴근용으로 6개월 사용했습니다. 이어패드 상태 좋아요.' }),
  P('p4', { title: '3인용 패브릭 소파 (그레이)', price: 150000, category: 'furniture', sellerId: 'u5', region: '합정동', createdAt: now - 1 * D,
    images: [u('1555041469-a586c61ea9bc'), u('1586023492125-27b2c045efd7')],
    desc: '이사 때문에 급하게 정리합니다.\n직접 가져가셔야 해요 (엘리베이터 있음).\n반려동물 없는 집입니다.' }),
  P('p5', { title: '로드 자전거 입문용 팝니다', price: 280000, category: 'sports', sellerId: 'u2', region: '연남동', createdAt: now - 3 * H,
    images: [u('1485965120184-e220f721d03e')],
    desc: '한강 몇 번 타고 보관만 했어요. 타이어 공기 넣으면 바로 타실 수 있습니다.\n키 165~180 적당합니다.' }),
  P('p6', { title: '미러리스 카메라 + 단렌즈', price: 470000, category: 'digital', sellerId: 'u3', region: '성수동', createdAt: now - 9 * H,
    images: [u('1526170375885-4d8ecf77b99f')],
    desc: '셔터 수 8천 정도입니다. 여분 배터리 1개 포함.' }),
  P('p7', { title: '게임 패드 새상품급', price: 55000, category: 'hobby', sellerId: 'u7', region: '연남동', createdAt: now - 40 * 60000,
    images: [u('1606813907291-d86efa9b94db')],
    desc: '선물 받았는데 이미 있어서 판매해요. 몇 번 연결만 해봤습니다.' }),
  P('p8', { title: '원목 스툴 2개 일괄', price: 0, nanum: true, offerable: false, category: 'furniture', sellerId: 'u6', region: '망원동', createdAt: now - 25 * 60000,
    images: [u('1503602642458-232111445657')],
    desc: '나눔합니다! 문 앞에 두면 가져가실 분만 연락주세요 🙂' }),
  P('p9', { title: '아이패드 10세대 와이파이 64GB', price: 380000, category: 'digital', sellerId: 'u1', region: '망원동', createdAt: now - 2 * D,
    images: [u('1544244015-0df4b3ffc6b0')],
    desc: '인강용으로 사용. 펜슬 미포함입니다.' }),
  P('p10', { title: '나이키 운동화 270mm', price: 65000, category: 'fashion', sellerId: 'u2', region: '연남동', createdAt: now - 6 * H,
    images: [u('1542291026-7eec264c27ff'), u('1600185365483-26d7a4cc7519')],
    desc: '사이즈 미스로 실내에서 2번 신어봤습니다.' }),
  P('p11', { title: '클래식 손목시계 가죽밴드', price: 120000, category: 'fashion', sellerId: 'u5', region: '합정동', createdAt: now - 3 * D, status: 'sold',
    images: [u('1523275335684-37898b6baf30')],
    desc: '배터리 교체 완료했어요.' }),
  P('p12', { title: '도서 일괄 (소설 12권)', price: 30000, category: 'books', sellerId: 'u4', region: '망원동', createdAt: now - 4 * H,
    images: [u('1544947950-fa07a98d237f')],
    desc: '한 번씩 읽은 책들입니다. 밑줄 없어요. 낱권 구매는 어렵습니다.' }),
  P('p13', { title: '스마트워치 44mm 블랙', price: 160000, category: 'digital', sellerId: 'u7', region: '연남동', createdAt: now - 7 * H,
    images: [u('1546868871-7041f2a55e12')],
    desc: '운동할 때만 착용했습니다. 충전독 포함.' }),
  P('p14', { title: '43인치 스마트 TV', price: 210000, category: 'appliance', sellerId: 'u5', region: '합정동', createdAt: now - 20 * H,
    images: [u('1593359677879-a4bb92f829d1')],
    desc: '벽걸이 브라켓 같이 드려요. 리모컨 있습니다.' }),
  P('p15', { title: '선글라스 정품', price: 85000, category: 'fashion', sellerId: 'u3', region: '성수동', createdAt: now - 30 * H,
    images: [u('1572635196237-14b3f281503f')],
    desc: '케이스, 보증서 있습니다.' }),
  P('p16', { title: '디자인 의자 1개', price: 45000, category: 'furniture', sellerId: 'u6', region: '망원동', createdAt: now - 50 * H,
    images: [u('1592078615290-033ee584e267')],
    desc: '식탁 의자로 사용하던 거예요. 흔들림 없음.' }),
  P('p17', { title: '기계식 키보드 갈축', price: 70000, category: 'digital', sellerId: 'u7', region: '연남동', createdAt: now - 15 * H,
    images: [u('1587829741301-dc798b83add3')],
    desc: '키캡 교체했고 원래 키캡도 같이 드려요.' }),
  P('p18', { title: '향수 50ml (90% 남음)', price: 60000, category: 'beauty', sellerId: 'u1', region: '망원동', createdAt: now - 4 * D,
    images: [u('1585386959984-a4155224a1ad')],
    desc: '시향용으로 몇 번 뿌렸어요.' }),
  P('p19', { title: '27인치 모니터 QHD', price: 140000, category: 'digital', sellerId: 'u3', region: '성수동', createdAt: now - 11 * H,
    images: [u('1527443224154-c4a3942d3acf')],
    desc: '불량화소 없습니다. 직거래만 가능해요.' }),
  P('p20', { title: '스탠드 조명', price: 0, nanum: true, offerable: false, category: 'appliance', sellerId: 'u4', region: '망원동', createdAt: now - 90 * 60000,
    images: [u('1507473885765-e6ed057f782c')],
    desc: '전구 포함 나눔이에요. 저녁 7시 이후 가능합니다.' }),
];

export const COMMUNITY_TOPICS = ['전체', '동네질문', '동네맛집', '일상', '분실/실종', '동네사건사고', '취미생활', '고양이/강아지'];

export const POSTS = [
  { id: 'c1', topic: '동네맛집', authorId: 'u4', region: '망원동', createdAt: now - 2 * H, title: '망원시장 근처 칼국수 맛집 추천해주세요',
    body: '주말에 부모님 오시는데 줄 너무 길지 않은 곳 있을까요?', image: u('1568901346375-23c9450c58cd'), likes: 12,
    comments: [{ id: 'cm1', authorId: 'u1', text: '시장 입구 쪽 2층집 추천해요! 평일 점심엔 줄 거의 없어요.', createdAt: now - 90 * 60000 }] },
  { id: 'c2', topic: '분실/실종', authorId: 'u6', region: '망원동', createdAt: now - 5 * H, title: '노란 우산 잃어버렸어요',
    body: '망원 한강공원 입구 벤치에 두고 왔어요. 보신 분 계시면 연락 부탁드려요.', likes: 3, comments: [] },
  { id: 'c3', topic: '일상', authorId: 'u3', region: '성수동', createdAt: now - 1 * D, title: '오늘 하늘 너무 예쁘네요',
    body: '퇴근길에 찍은 사진 공유합니다 ☁️', image: u('1495474472287-4d71bcdd2085'), likes: 41,
    comments: [{ id: 'cm2', authorId: 'u2', text: '와 사진 잘 찍으시네요', createdAt: now - 20 * H }] },
  { id: 'c4', topic: '동네질문', authorId: 'u2', region: '연남동', createdAt: now - 7 * H, title: '자전거 수리점 있을까요?',
    body: '체인이 자꾸 빠지는데 근처에 잘 봐주시는 곳 아시나요?', likes: 5, comments: [] },
  { id: 'c5', topic: '고양이/강아지', authorId: 'u1', region: '망원동', createdAt: now - 30 * H, title: '산책 메이트 구해요 🐶',
    body: '저녁 8시쯤 망원 유수지 쪽 산책하시는 분 같이 걸어요!', likes: 18, comments: [] },
];

export const STORES = [
  { id: 's1', name: '골목 로스터리', category: '카페', region: '망원동', distance: '320m', rating: 4.8, reviews: 214, image: u('1509042239860-f550ce710b93'), desc: '매일 아침 직접 볶는 원두. 드립커피 맛집', coupon: '아메리카노 500원 할인' },
  { id: 's2', name: '동네 버거집', category: '음식점', region: '망원동', distance: '540m', rating: 4.6, reviews: 98, image: u('1568901346375-23c9450c58cd'), desc: '수제 패티 버거와 감자튀김' },
  { id: 's3', name: '햇살 식당', category: '음식점', region: '합정동', distance: '1.1km', rating: 4.5, reviews: 156, image: u('1517248135467-4c7edcad34c4'), desc: '정갈한 가정식 백반', coupon: '첫 방문 음료 서비스' },
];

export const JOBS = [
  { id: 'j1', title: '주말 카페 바리스타 구해요', place: '골목 로스터리', region: '망원동', pay: '시급 11,000원', schedule: '토·일 10:00~16:00', createdAt: now - 3 * H },
  { id: 'j2', title: '이삿짐 정리 도와주실 분 (하루)', place: '개인', region: '합정동', pay: '일급 120,000원', schedule: '10/10(토) 하루', createdAt: now - 8 * H },
  { id: 'j3', title: '초등학생 하원 도우미', place: '개인', region: '망원동', pay: '시급 13,000원', schedule: '평일 15:00~18:00', createdAt: now - 1 * D },
];

export const HOMES = [
  { id: 'h1', type: '원룸', deal: '월세', price: '1000/55', size: '19.8㎡', floor: '3층', region: '망원동', image: u('1522708323590-d24dbb6b0267'), createdAt: now - 6 * H },
  { id: 'h2', type: '투룸', deal: '전세', price: '2억 3,000', size: '42.9㎡', floor: '2층', region: '합정동', image: u('1502672260266-1c1ef2d93688'), createdAt: now - 1 * D },
  { id: 'h3', type: '오피스텔', deal: '월세', price: '500/70', size: '26.4㎡', floor: '9층', region: '연남동', image: u('1493809842364-78817add7ffb'), createdAt: now - 2 * D },
];

export const CARS = [
  { id: 'v1', title: '2019년식 준중형 세단', km: '58,000km', fuel: '가솔린', price: 13500000, region: '망원동', image: u('1549317661-bd32c8ce0db2'), createdAt: now - 10 * H },
  { id: 'v2', title: '2017년식 스포츠 쿠페', km: '71,200km', fuel: '가솔린', price: 24000000, region: '성수동', image: u('1494976388531-d1058494cdd8'), createdAt: now - 2 * D },
  { id: 'v3', title: '2021년식 컨버터블', km: '22,400km', fuel: '가솔린', price: 68000000, region: '역삼동', image: u('1503376780353-7e6692767b70'), createdAt: now - 3 * D },
];

export const INITIAL_CHATS = [
  { id: 'ch1', productId: 'p3', partnerId: 'u4', unread: 1, updatedAt: now - 30 * 60000,
    messages: [
      { id: 'm1', from: 'me', text: '안녕하세요! 헤드폰 아직 구매 가능할까요?', at: now - 60 * 60000 },
      { id: 'm2', from: 'u4', text: '네 가능해요~ 내일 저녁 7시 망원역 어떠세요?', at: now - 30 * 60000 },
    ] },
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'activity', text: '망원동고양이님이 올린 "아이폰 15 프로"의 가격이 내려갔어요.', at: now - 50 * 60000, read: false, link: '/products/p1' },
  { id: 'n2', type: 'keyword', text: '키워드 "자전거" 관련 새 글: 로드 자전거 입문용 팝니다', at: now - 3 * H, read: false, link: '/products/p5' },
  { id: 'n3', type: 'activity', text: '옆집마켓에 오신 걸 환영해요! 동네 인증을 하면 이웃과 거래할 수 있어요.', at: now - 2 * D, read: true, link: '/my/region' },
];

export const AUTO_REPLIES = [
  '네 안녕하세요! 아직 판매 중이에요 🙂',
  '직거래 가능한 시간 알려주시면 맞춰볼게요.',
  '사진 더 필요하시면 말씀해 주세요.',
  '네고는 조금 어려울 것 같아요 ㅠㅠ',
  '좋아요! 그럼 그때 뵐게요.',
];

export const MANNER_TAGS = ['시간 약속을 잘 지켜요', '친절하고 매너가 좋아요', '응답이 빨라요', '상품 상태가 설명과 같아요', '좋은 상품을 저렴하게 판매해요'];
