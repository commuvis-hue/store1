import { useState } from 'react';
import { useStore } from '../store/Store';
import { Link, useRouter } from '../store/router';
import { REGIONS, MANNER_TAGS } from '../data/mock';
import { Avatar, MannerTemp, TopBar, ProductCard, Empty, Sheet } from '../components/UI';
import { IChevron, IReceipt, IBag, IHeart, ITag, IMap, IShield, ISettings, IBell, IStar } from '../components/Icons';
import { ago, STATUS } from '../utils';

export default function My() {
  const { state, user, dispatch, showToast } = useStore();
  const me = user('me');
  const reviews = state.reviews.filter((r) => r.toId === 'me');
  const menu = [
    { to: '/my/sales', Icon: IReceipt, label: '판매내역', n: state.products.filter((p) => p.sellerId === 'me').length },
    { to: '/my/purchases', Icon: IBag, label: '구매내역', n: state.purchases.length },
    { to: '/my/likes', Icon: IHeart, label: '관심목록', n: state.likes.length },
  ];
  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">나의 옆집</h1><div className="topbar-right"><Link to="/my/settings" className="icon-btn" aria-label="설정"><ISettings /></Link></div></header>
      <Link to="/users/me" className="profile-card">
        <Avatar user={me} size={60} />
        <div className="profile-name"><strong>{me.nickname}</strong><span className="meta">{me.region} {state.me.verified ? '· 동네인증 완료 ✓' : '· 동네인증 필요'}</span></div>
        <IChevron />
      </Link>
      <div className="pad"><MannerTemp temp={me.temp} /></div>
      <div className="my-tiles">{menu.map(({ to, Icon, label, n }) => (
        <Link key={to} to={to} className="my-tile"><span className="my-tile-icon"><Icon /></span>{label}<small>{n}</small></Link>))}</div>
      <ul className="menu-list">
        <li><Link to="/my/region"><IMap />내 동네 설정 · 동네 인증</Link></li>
        <li><Link to="/my/keywords"><ITag />키워드 알림 <span className="meta">{state.keywords.length}개</span></Link></li>
        <li><Link to="/my/reviews"><IStar />받은 거래 후기 <span className="meta">{reviews.length}개</span></Link></li>
        <li><Link to="/notifications"><IBell />알림</Link></li>
        <li><Link to="/my/blocked"><IShield />차단 · 숨긴 글 관리</Link></li>
        <li><Link to="/my/settings"><ISettings />프로필 수정 · 앱 설정</Link></li>
      </ul>
    </div>
  );
}

export function MySales() {
  const { state, dispatch, showToast } = useStore();
  const [tab, setTab] = useState('selling');
  const mine = state.products.filter((p) => p.sellerId === 'me');
  const list = tab === 'hidden' ? mine.filter((p) => state.hidden.includes(p.id))
    : mine.filter((p) => !state.hidden.includes(p.id) && (tab === 'sold' ? p.status === 'sold' : p.status !== 'sold'));
  return (
    <div className="page">
      <TopBar back title="판매내역" />
      <div className="tabs">{[['selling', '판매중'], ['sold', '거래완료'], ['hidden', '숨김']].map(([k, v]) =>
        <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {list.length === 0 ? <Empty icon="📦" title={`${tab === 'hidden' ? '숨긴' : tab === 'sold' ? '거래완료된' : '판매 중인'} 게시글이 없어요`} action={tab === 'selling' && <Link to="/write" className="btn mt">내 물건 팔기</Link>} /> :
        list.map((p) => (
          <div key={p.id} className="sale-item">
            <ProductCard p={p} />
            <div className="sale-actions">
              {tab === 'hidden' ? <button onClick={() => { dispatch({ type: 'UNHIDE', id: p.id }); showToast('숨김을 해제했어요'); }}>숨김 해제</button> : <>
                {p.status !== 'sold' && <button onClick={() => dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: p.status === 'reserved' ? 'selling' : 'reserved' } })}>{p.status === 'reserved' ? '판매중으로 변경' : '예약중으로 변경'}</button>}
                <button onClick={() => dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: p.status === 'sold' ? 'selling' : 'sold' } })}>{p.status === 'sold' ? '판매중으로 변경' : '거래완료로 변경'}</button>
                {p.status !== 'sold' && <button onClick={() => { dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { bumpedAt: Date.now() } }); showToast('끌어올렸어요'); }}>끌어올리기</button>}
              </>}
            </div>
          </div>))}
    </div>
  );
}

export function MyPurchases() {
  const { state } = useStore();
  const list = state.products.filter((p) => state.purchases.includes(p.id));
  return <div className="page"><TopBar back title="구매내역" />
    {list.length === 0 ? <Empty icon="🛍️" title="구매내역이 없어요" desc="채팅방에서 구매 확정을 하면 여기에 모여요." /> : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
  </div>;
}

export function MyLikes() {
  const { state } = useStore();
  const list = state.products.filter((p) => state.likes.includes(p.id));
  return <div className="page"><TopBar back title="관심목록" />
    {list.length === 0 ? <Empty icon="🤍" title="관심 상품이 없어요" desc="하트를 눌러 관심 상품을 모아보세요." /> : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
  </div>;
}

export function Keywords() {
  const { state, dispatch, showToast } = useStore();
  const [k, setK] = useState('');
  const add = (e) => { e.preventDefault(); const t = k.trim(); if (!t) return; if (state.keywords.length >= 30) return showToast('키워드는 30개까지 등록할 수 있어요'); dispatch({ type: 'ADD_KEYWORD', k: t }); setK(''); };
  return (
    <div className="page"><TopBar back title="키워드 알림" />
      <form className="pad row" onSubmit={add}>
        <input className="input" value={k} onChange={(e) => setK(e.target.value)} placeholder="알림 받을 키워드를 입력해 주세요" />
        <button className="btn" disabled={!k.trim()}>등록</button>
      </form>
      <p className="pad-x meta">등록한 키워드가 들어간 새 글이 {state.me.region} 근처에 올라오면 알려드려요. ({state.keywords.length}/30)</p>
      <div className="pad tag-wrap">{state.keywords.map((x) => (
        <span key={x} className="tag is-on">{x}<button onClick={() => dispatch({ type: 'DEL_KEYWORD', k: x })} aria-label={`${x} 삭제`}>✕</button></span>))}</div>
    </div>
  );
}

export function RegionSettings() {
  const { state, dispatch, showToast } = useStore();
  const [checking, setChecking] = useState(false);
  const regions = state.me.regions;
  const toggle = (r) => {
    if (regions.includes(r)) { if (regions.length === 1) return showToast('동네는 최소 1개 설정해야 해요'); const next = regions.filter((x) => x !== r); dispatch({ type: 'ME', patch: { regions: next, region: next.includes(state.me.region) ? state.me.region : next[0] } }); }
    else { if (regions.length >= 2) return showToast('동네는 최대 2개까지 설정할 수 있어요'); dispatch({ type: 'ME', patch: { regions: [...regions, r] } }); }
  };
  const verify = () => {
    setChecking(true);
    const done = () => { setChecking(false); dispatch({ type: 'ME', patch: { verified: true } }); showToast(`${state.me.region} 동네 인증을 완료했어요`); };
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(done, done, { timeout: 5000 });
    else setTimeout(done, 800);
  };
  return (
    <div className="page"><TopBar back title="내 동네 설정" />
      <section className="pad">
        <h2 className="section-title">동네 선택 <span className="meta">최대 2개</span></h2>
        <div className="tag-wrap">{REGIONS.map((r) => <button key={r} className={`tag ${regions.includes(r) ? 'is-on' : ''}`} onClick={() => toggle(r)}>{r}</button>)}</div>
      </section>
      <section className="pad">
        <h2 className="section-title">근처 동네 범위</h2>
        <input type="range" min="1" max="4" value={state.me.radius} onChange={(e) => dispatch({ type: 'ME', patch: { radius: +e.target.value } })} className="range" aria-label="동네 범위" />
        <div className="row-between meta"><span>내 동네</span><span>가까운 동네</span><span>먼 동네</span></div>
        <p className="meta mt">선택한 범위 안의 이웃에게만 내 게시글이 보여요.</p>
      </section>
      <section className="pad verify-card">
        <h2 className="section-title">동네 인증</h2>
        <p className="meta">현재 위치가 {state.me.region}인지 확인해요. 인증하면 이웃과 채팅할 수 있어요.</p>
        <button className="btn block mt" onClick={verify} disabled={checking || state.me.verified}>{state.me.verified ? '인증 완료 ✓' : checking ? '위치 확인 중…' : '현재 위치로 동네 인증하기'}</button>
      </section>
    </div>
  );
}

export function Reviews({ userId = 'me' }) {
  const { state, user } = useStore();
  const list = state.reviews.filter((r) => r.toId === userId);
  return <div className="page"><TopBar back title="거래 후기" />
    {list.length === 0 ? <Empty icon="📝" title="아직 받은 후기가 없어요" /> : <ReviewList list={list} user={user} />}
  </div>;
}

function ReviewList({ list, user }) {
  return <ul className="review-list">{list.map((r) => { const f = user(r.fromId); return (
    <li key={r.id}><Avatar user={f} size={36} /><div><strong>{f?.nickname}</strong> <span className="meta">{ago(r.at)}</span><p>{r.text}</p>{r.tags.length > 0 && <div className="tag-wrap sm">{r.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>}</div></li>); })}</ul>;
}

export function UserProfile({ id }) {
  const { state, user, dispatch, showToast } = useStore();
  const { navigate } = useRouter();
  const [tab, setTab] = useState('products');
  const [menu, setMenu] = useState(false);
  const u = user(id);
  if (!u) return <div className="page"><TopBar back /><Empty title="없는 사용자예요" /></div>;
  const products = state.products.filter((p) => p.sellerId === id && !(id !== 'me' && state.hidden.includes(p.id)));
  const reviews = state.reviews.filter((r) => r.toId === id);
  const tagCounts = MANNER_TAGS.map((t) => [t, reviews.filter((r) => r.tags.includes(t)).length + (id === 'me' ? 0 : (u.temp > 40 ? 3 : 1))]).filter(([, n]) => n > 0);
  return (
    <div className="page"><TopBar back title="프로필" right={id !== 'me' && <button className="icon-btn" onClick={() => setMenu(true)} aria-label="더보기">⋯</button>} />
      <div className="profile-card static"><Avatar user={u} size={64} /><div className="profile-name"><strong>{u.nickname}</strong><span className="meta">{u.region} · {u.joined?.slice(0, 4)}년 가입</span></div></div>
      <div className="pad"><MannerTemp temp={u.temp} />{u.responseRate && <p className="meta mt">응답률 {u.responseRate}% · 보통 1시간 이내 응답</p>}</div>
      {id === 'me' && <div className="pad"><Link to="/my/settings" className="btn ghost block">프로필 수정</Link></div>}
      <div className="tabs">{[['products', `판매상품 ${products.length}`], ['manner', '받은 매너'], ['reviews', `거래후기 ${reviews.length}`]].map(([k, v]) =>
        <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {tab === 'products' && (products.length ? <div className="plist">{products.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <Empty icon="📦" title="판매 중인 상품이 없어요" />)}
      {tab === 'manner' && (tagCounts.length ? <ul className="manner-list">{tagCounts.map(([t, n]) => <li key={t}><span>👥 {n}</span>{t}</li>)}</ul> : <Empty icon="🤝" title="아직 받은 매너 칭찬이 없어요" />)}
      {tab === 'reviews' && (reviews.length ? <ReviewList list={reviews} user={user} /> : <Empty icon="📝" title="아직 거래 후기가 없어요" />)}
      <Sheet open={menu} onClose={() => setMenu(false)} items={[
        { label: state.blocked.includes(id) ? '차단 해제' : '차단하기', danger: true, onClick: () => { dispatch({ type: state.blocked.includes(id) ? 'UNBLOCK' : 'BLOCK', userId: id }); showToast('변경했어요'); } },
        { label: '신고하기', danger: true, onClick: () => showToast('신고를 접수했어요') },
      ]} />
    </div>
  );
}

export function WriteReview({ userId }) {
  const { state, dispatch, user, uid, showToast } = useStore();
  const { query, navigate } = useRouter();
  const productId = query.get('product');
  const p = state.products.find((x) => x.id === productId);
  const u = user(userId);
  const [rating, setRating] = useState('good');
  const [tags, setTags] = useState([]);
  const [text, setText] = useState('');
  if (!u) return <div className="page"><TopBar back /><Empty title="없는 사용자예요" /></div>;
  return (
    <div className="page has-actionbar"><TopBar back title="거래 후기 보내기" />
      <div className="pad">
        <p className="lead">{u.nickname}님과 {p ? `"${p.title}"` : ''} 거래가 어떠셨나요?</p>
        <div className="seg mt">{[['bad', '별로예요 😞'], ['good', '좋아요 🙂'], ['best', '최고예요 😍']].map(([k, v]) =>
          <button key={k} className={rating === k ? 'is-on' : ''} onClick={() => setRating(k)}>{v}</button>)}</div>
        {rating !== 'bad' && <>
          <h3 className="section-title mt">어떤 점이 좋았나요?</h3>
          <div className="check-list">{MANNER_TAGS.map((t) => (
            <label key={t} className="check"><input type="checkbox" checked={tags.includes(t)} onChange={() => setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))} />{t}</label>))}</div>
        </>}
        <textarea className="input mt" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="따뜻한 거래 경험을 알려주세요. 남겨주신 후기는 상대방 프로필에 공개돼요." />
      </div>
      <div className="actionbar"><button className="btn block" onClick={() => {
        dispatch({ type: 'ADD_REVIEW', review: { id: uid('r'), fromId: 'me', toId: userId, productId, text: text.trim() || (rating === 'bad' ? '아쉬운 거래였어요.' : '좋은 거래 감사합니다!'), tags: rating === 'bad' ? [] : tags, at: Date.now() } });
        showToast('후기를 보냈어요'); navigate(`/users/${userId}`, { replace: true });
      }}>후기 보내기</button></div>
    </div>
  );
}

export function Settings() {
  const { state, dispatch, showToast } = useStore();
  const [nick, setNick] = useState(state.me.nickname);
  return (
    <div className="page"><TopBar back title="프로필 수정 · 설정" />
      <div className="pad form">
        <label className="field"><span>닉네임</span><input className="input" value={nick} onChange={(e) => setNick(e.target.value)} maxLength={12} /></label>
        <button className="btn block" disabled={nick.trim().length < 2} onClick={() => { dispatch({ type: 'ME', patch: { nickname: nick.trim() } }); showToast('프로필을 저장했어요'); }}>저장</button>
        <hr className="hr" />
        <button className="btn ghost block" onClick={() => { if (confirm('모든 데이터를 처음 상태로 되돌릴까요?')) { dispatch({ type: 'RESET' }); showToast('초기화했어요'); } }}>데모 데이터 초기화</button>
        <p className="meta">이 사이트의 데이터는 브라우저(localStorage)에 저장돼요.</p>
      </div>
    </div>
  );
}

export function Blocked() {
  const { state, dispatch, user } = useStore();
  const hidden = state.products.filter((p) => state.hidden.includes(p.id) && p.sellerId !== 'me');
  return (
    <div className="page"><TopBar back title="차단 · 숨긴 글 관리" />
      <section className="pad"><h2 className="section-title">차단한 사용자</h2>
        {state.blocked.length === 0 ? <p className="meta">차단한 사용자가 없어요.</p> : state.blocked.map((id) => { const u = user(id); return (
          <div key={id} className="row-between line"><span className="row"><Avatar user={u} size={32} />{u?.nickname}</span><button className="btn sm ghost" onClick={() => dispatch({ type: 'UNBLOCK', userId: id })}>차단 해제</button></div>); })}
      </section>
      <section className="pad"><h2 className="section-title">숨긴 게시글</h2>
        {hidden.length === 0 ? <p className="meta">숨긴 게시글이 없어요.</p> : hidden.map((p) => (
          <div key={p.id} className="row-between line"><span>{p.title} <StatusText s={p.status} /></span><button className="btn sm ghost" onClick={() => dispatch({ type: 'UNHIDE', id: p.id })}>숨김 해제</button></div>))}
      </section>
    </div>
  );
}
const StatusText = ({ s }) => <span className="meta">{STATUS[s]}</span>;

export function Notifications() {
  const { state, dispatch } = useStore();
  const { navigate } = useRouter();
  const [tab, setTab] = useState('activity');
  const list = state.notifications.filter((n) => n.type === tab);
  return (
    <div className="page"><TopBar back title="알림" right={<button className="text-btn" onClick={() => dispatch({ type: 'READ_NOTI' })}>모두 읽음</button>} />
      <div className="tabs">{[['activity', '활동 알림'], ['keyword', '키워드 알림']].map(([k, v]) => <button key={k} className={`tab ${tab === k ? 'is-on' : ''}`} onClick={() => setTab(k)}>{v}</button>)}</div>
      {list.length === 0 ? <Empty icon="🔔" title="새로운 알림이 없어요" /> :
        <ul className="noti-list">{list.map((n) => (
          <li key={n.id} className={n.read ? '' : 'is-new'}>
            <button className="noti" onClick={() => n.link && navigate(n.link)}><span>{n.type === 'keyword' ? '🏷️' : '🔔'}</span><div><p>{n.text}</p><p className="meta">{ago(n.at)}</p></div></button>
            <button className="icon-btn sm" onClick={() => dispatch({ type: 'DELETE_NOTI', id: n.id })} aria-label="알림 삭제">✕</button>
          </li>))}</ul>}
    </div>
  );
}
