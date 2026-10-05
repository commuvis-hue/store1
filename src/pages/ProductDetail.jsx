import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter, Link } from '../store/router';
import { CATEGORIES } from '../data/mock';
import { Img, Avatar, MannerTemp, TopBar, LikeButton, Sheet, Modal, ProductCard, Empty, StatusBadge } from '../components/UI';
import { IMore, IShare, IHome } from '../components/Icons';
import { ago, priceLabel, won, STATUS } from '../utils';

export default function ProductDetail({ id }) {
  const store = useStore();
  const { state, dispatch, user, showToast, likeCount, openChat, send } = store;
  const { navigate } = useRouter();
  const p = state.products.find((x) => x.id === id);
  const [idx, setIdx] = useState(0);
  const [menu, setMenu] = useState(false);
  const [offer, setOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [soldPick, setSoldPick] = useState(false);
  const [report, setReport] = useState(false);
  const viewed = useRef(false);

  useEffect(() => { if (p && !viewed.current) { viewed.current = true; dispatch({ type: 'VIEW_PRODUCT', id }); } }, [p, id, dispatch]);

  if (!p) return <div className="page"><TopBar back title="" /><Empty icon="🫥" title="삭제되었거나 없는 게시글이에요" action={<Link to="/" className="btn">홈으로</Link>} /></div>;

  const seller = user(p.sellerId);
  const mine = p.sellerId === 'me';
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const others = state.products.filter((x) => x.sellerId === p.sellerId && x.id !== p.id).slice(0, 4);
  const similar = state.products.filter((x) => x.category === p.category && x.id !== p.id && x.sellerId !== p.sellerId).slice(0, 4);
  const buyers = state.chats.filter((c) => c.productId === p.id);

  const share = async () => {
    const url = window.location.href;
    try { if (navigator.share) await navigator.share({ title: p.title, url }); else { await navigator.clipboard.writeText(url); showToast('링크를 복사했어요'); } } catch {}
  };

  const setStatus = (status) => {
    if (status === 'sold') { setSoldPick(true); return; }
    dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status } });
    showToast(`${STATUS[status]}(으)로 변경했어요`);
  };

  const chat = () => {
    if (!state.me.verified) { showToast('동네 인증 후 채팅할 수 있어요'); navigate('/my/region'); return; }
    navigate(`/chats/${openChat(p)}`);
  };

  const sendOffer = () => {
    const n = +offerPrice;
    if (!n) return;
    const cid = openChat(p);
    send(cid, `${won(n)}에 구매 가능할까요?`, { kind: 'offer', amount: n });
    setOffer(false);
    navigate(`/chats/${cid}`);
  };

  const myMenu = [
    { label: '게시글 수정', onClick: () => navigate(`/products/${p.id}/edit`) },
    { label: '끌어올리기', onClick: () => { dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { bumpedAt: Date.now() } }); showToast('끌어올렸어요. 목록 맨 위에 보여요'); } },
    { label: '숨기기', onClick: () => { dispatch({ type: 'HIDE', id: p.id }); showToast('게시글을 숨겼어요'); } },
    { label: '삭제', danger: true, onClick: () => { if (confirm('게시글을 삭제할까요?')) { dispatch({ type: 'DELETE_PRODUCT', id: p.id }); showToast('삭제했어요'); navigate('/', { replace: true }); } } },
  ];
  const otherMenu = [
    { label: '이 글 숨기기', onClick: () => { dispatch({ type: 'HIDE', id: p.id }); showToast('이 글은 홈에서 보이지 않아요'); navigate(-1); } },
    { label: '신고하기', danger: true, onClick: () => setReport(true) },
    { label: `${seller.nickname}님 차단하기`, danger: true, onClick: () => { dispatch({ type: 'BLOCK', userId: seller.id }); showToast('차단했어요. 이 사용자의 글이 보이지 않아요'); navigate('/'); } },
  ];

  return (
    <div className="page has-actionbar">
      <TopBar back transparent right={<>
        <Link to="/" className="icon-btn" aria-label="홈"><IHome /></Link>
        <button className="icon-btn" onClick={share} aria-label="공유"><IShare /></button>
        <button className="icon-btn" onClick={() => setMenu(true)} aria-label="더보기"><IMore /></button>
      </>} />

      <div className="gallery">
        <div className="gallery-track" onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          {p.images.map((src, i) => <div className="gallery-slide" key={i}><Img src={src} alt={`${p.title} 사진 ${i + 1}`} seed={`${p.id}-${i}`} /></div>)}
        </div>
        {p.images.length > 1 && <div className="dots">{p.images.map((_, i) => <i key={i} className={i === idx ? 'is-on' : ''} />)}</div>}
      </div>

      <Link to={`/users/${seller.id}`} className="seller">
        <Avatar user={seller} size={44} />
        <div className="seller-info"><strong>{seller.nickname}</strong><span className="meta">{p.region}</span></div>
        <MannerTemp temp={seller.temp} />
      </Link>

      <article className="pad detail">
        {mine && (
          <select className="status-select" value={p.status} onChange={(e) => setStatus(e.target.value)} aria-label="판매 상태">
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        )}
        <h2 className="detail-title"><StatusBadge status={p.status} />{p.title}</h2>
        <p className="meta"><Link to={`/?cat=${p.category}`} className="underline">{cat?.name}</Link> · {p.bumpedAt ? `끌올 ${ago(p.bumpedAt)}` : ago(p.createdAt)}</p>
        <p className="detail-desc">{p.desc}</p>
        {p.place && <p className="place">📍 거래 희망 장소 · {p.place}</p>}
        <p className="meta">채팅 {p.chatCount} · 관심 {likeCount(p)} · 조회 {p.views}</p>
        {!mine && <button className="text-btn mt" onClick={() => setReport(true)}>이 게시글 신고하기</button>}
      </article>

      {others.length > 0 && (
        <section className="pad section">
          <div className="row-between"><h3 className="section-title">{seller.nickname}님의 판매 상품</h3><Link to={`/users/${seller.id}`} className="text-btn">모두 보기</Link></div>
          <div className="grid2">{others.map((x) => <MiniCard key={x.id} p={x} />)}</div>
        </section>
      )}
      {similar.length > 0 && (
        <section className="pad section">
          <h3 className="section-title">이 글과 함께 봤어요</h3>
          <div className="grid2">{similar.map((x) => <MiniCard key={x.id} p={x} />)}</div>
        </section>
      )}

      <div className="actionbar">
        <LikeButton id={p.id} />
        <div className="actionbar-price">
          <strong>{priceLabel(p)}</strong>
          {!mine && !p.nanum && (p.offerable
            ? <button className="text-btn strong" onClick={() => setOffer(true)}>가격 제안하기</button>
            : <span className="meta">가격 제안 불가</span>)}
        </div>
        {mine
          ? <Link to="/chats" className="btn">대화 중인 채팅 {buyers.length}</Link>
          : <button className="btn" onClick={chat} disabled={p.status === 'sold'}>{p.status === 'sold' ? '거래완료' : '채팅하기'}</button>}
      </div>

      <Sheet open={menu} onClose={() => setMenu(false)} items={mine ? myMenu : otherMenu} />

      <Modal open={offer} onClose={() => setOffer(false)} title="가격 제안하기">
        <p className="meta">판매가 {won(p.price)}</p>
        <input className="input" inputMode="numeric" placeholder="제안할 가격(원)" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value.replace(/\D/g, ''))} autoFocus />
        {offerPrice && <p className="meta">{won(offerPrice)}</p>}
        <button className="btn block mt" onClick={sendOffer} disabled={!offerPrice}>제안 보내기</button>
      </Modal>

      <Modal open={soldPick} onClose={() => setSoldPick(false)} title="누구와 거래하셨나요?">
        {buyers.length === 0 && <p className="meta">채팅한 이웃이 없어요. 거래완료로만 표시할게요.</p>}
        <div className="pick-list">
          {buyers.map((c) => { const u = user(c.partnerId); return (
            <button key={c.id} className="pick" onClick={() => {
              dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'sold', buyerId: u.id } });
              setSoldPick(false); navigate(`/review/${u.id}?product=${p.id}`);
            }}><Avatar user={u} size={32} />{u.nickname}</button>); })}
        </div>
        <button className="btn ghost block mt" onClick={() => { dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'sold' } }); setSoldPick(false); showToast('거래완료로 변경했어요'); }}>
          다른 곳에서 거래했어요
        </button>
      </Modal>

      <Modal open={report} onClose={() => setReport(false)} title="신고 사유를 선택해 주세요">
        <div className="pick-list">
          {['판매금지 물품이에요', '허위 매물이에요', '전문 판매업자 같아요', '사기 글이에요', '욕설·비하 표현이 있어요'].map((r) => (
            <button key={r} className="pick" onClick={() => { setReport(false); dispatch({ type: 'HIDE', id: p.id }); showToast('신고를 접수했어요. 검토 후 조치할게요'); }}>{r}</button>
          ))}
        </div>
      </Modal>
    </div>
  );
}

function MiniCard({ p }) {
  return (
    <Link to={`/products/${p.id}`} className="mini">
      <div className="mini-img"><Img src={p.images[0]} alt={p.title} seed={p.id} /></div>
      <p className="mini-title">{p.title}</p>
      <strong>{priceLabel(p)}</strong>
    </Link>
  );
}
export { MiniCard };
