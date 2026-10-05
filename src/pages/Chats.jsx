import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/Store';
import { Link, useRouter } from '../store/router';
import { Img, Avatar, Empty, TopBar, MannerTemp, Sheet, Modal, StatusBadge } from '../components/UI';
import { ISend, IPlus, IMore } from '../components/Icons';
import { ago, clock, priceLabel, won, fileToDataUrl } from '../utils';

export default function Chats() {
  const { state, user } = useStore();
  const [filter, setFilter] = useState('all');
  const chats = state.chats.filter((c) => {
    const p = state.products.find((x) => x.id === c.productId);
    if (filter === 'sell') return p?.sellerId === 'me';
    if (filter === 'buy') return p?.sellerId !== 'me';
    if (filter === 'unread') return c.unread > 0;
    return true;
  });
  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">채팅</h1></header>
      <div className="chips">
        {[['all', '전체'], ['sell', '판매'], ['buy', '구매'], ['unread', '안 읽은 채팅']].map(([k, v]) =>
          <button key={k} className={`chip ${filter === k ? 'is-on' : ''}`} onClick={() => setFilter(k)}>{v}</button>)}
      </div>
      {chats.length === 0 ? <Empty icon="💬" title="채팅이 없어요" desc="관심 있는 물건을 찾아 채팅을 시작해 보세요." action={<Link to="/" className="btn mt">중고거래 둘러보기</Link>} /> :
        <ul className="chat-list">{chats.map((c) => {
          const u = user(c.partnerId); const p = state.products.find((x) => x.id === c.productId); const last = c.messages[c.messages.length - 1];
          return (
            <li key={c.id}><Link to={`/chats/${c.id}`} className="chat-row">
              <Avatar user={u} size={48} />
              <div className="chat-mid">
                <p><strong>{u.nickname}</strong> <span className="meta">{u.region} · {ago(c.updatedAt)}</span></p>
                <p className="chat-last">{last ? (last.image ? '사진을 보냈어요' : last.text) : '대화를 시작해 보세요'}</p>
              </div>
              {c.unread > 0 && <span className="unread">{c.unread}</span>}
              {p && <div className="chat-thumb"><Img src={p.images[0]} alt="" seed={p.id} /></div>}
            </Link></li>);
        })}</ul>}
    </div>
  );
}

export function ChatRoom({ id }) {
  const { state, dispatch, user, send, showToast } = useStore();
  const { navigate } = useRouter();
  const [text, setText] = useState('');
  const [menu, setMenu] = useState(false);
  const [plus, setPlus] = useState(false);
  const [appt, setAppt] = useState(false);
  const [when, setWhen] = useState('');
  const [where, setWhere] = useState('');
  const endRef = useRef(null);
  const chat = state.chats.find((c) => c.id === id);

  useEffect(() => { if (chat?.unread) dispatch({ type: 'READ_CHAT', id }); }, [chat?.unread, id, dispatch]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat?.messages.length]);

  if (!chat) return <div className="page"><TopBar back /><Empty icon="💬" title="채팅방이 없어요" /></div>;
  const u = user(chat.partnerId);
  const p = state.products.find((x) => x.id === chat.productId);
  const iAmSeller = p?.sellerId === 'me';
  const blocked = state.blocked.includes(u.id);
  const reviewed = state.reviews.some((r) => r.fromId === 'me' && r.toId === u.id && r.productId === p?.id);

  const submit = (e) => { e.preventDefault(); if (!text.trim()) return; send(id, text.trim()); setText(''); };

  return (
    <div className="page chat-page">
      <TopBar back title={<span className="chat-title">{u.nickname} <MannerTemp temp={u.temp} compact /></span>} right={<button className="icon-btn" onClick={() => setMenu(true)} aria-label="채팅방 메뉴"><IMore /></button>} />
      {p && (
        <div className="chat-product">
          <Link to={`/products/${p.id}`} className="chat-product-link">
            <div className="chat-thumb"><Img src={p.images[0]} alt="" seed={p.id} /></div>
            <div><p className="chat-product-title"><StatusBadge status={p.status} />{p.title}</p><strong>{priceLabel(p)}</strong></div>
          </Link>
          <div className="chat-product-actions">
            <button className="btn sm ghost" onClick={() => setAppt(true)}>📅 약속 잡기</button>
            {!iAmSeller && p.status !== 'sold' && <button className="btn sm ghost" onClick={() => {
              dispatch({ type: 'PURCHASE', id: p.id }); dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'sold', buyerId: 'me' } }); showToast('구매 확정했어요');
            }}>구매 확정</button>}
            {p.status === 'sold' && !reviewed && <button className="btn sm" onClick={() => navigate(`/review/${u.id}?product=${p.id}`)}>후기 보내기</button>}
          </div>
        </div>
      )}

      <div className="messages">
        <p className="safety">🛡️ 거래 전 판매자의 매너온도와 후기를 확인하세요. 외부 메신저나 선입금 요구는 사기일 수 있어요.</p>
        {chat.messages.map((m, i) => {
          const mine = m.from === 'me';
          const showDate = i === 0 || new Date(m.at).toDateString() !== new Date(chat.messages[i - 1].at).toDateString();
          return (
            <div key={m.id}>
              {showDate && <p className="msg-date">{new Date(m.at).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}</p>}
              <div className={`msg ${mine ? 'is-mine' : ''}`}>
                {!mine && <Avatar user={u} size={32} />}
                {m.kind === 'appt'
                  ? <div className="bubble appt"><strong>📅 약속을 만들었어요</strong><p>{m.when}</p><p>{m.where}</p></div>
                  : m.image ? <div className="bubble img"><img src={m.image} alt="보낸 사진" /></div>
                    : <div className={`bubble ${m.kind === 'offer' ? 'offer' : ''}`}>{m.kind === 'offer' && <small>가격 제안 {won(m.amount)}</small>}{m.text}</div>}
                <time className="msg-time">{clock(m.at)}</time>
              </div>
            </div>);
        })}
        <div ref={endRef} />
      </div>

      {blocked ? <div className="actionbar"><p className="meta">차단한 사용자예요. <button className="text-btn strong" onClick={() => dispatch({ type: 'UNBLOCK', userId: u.id })}>차단 해제</button></p></div> :
        <form className="actionbar composer" onSubmit={submit}>
          <button type="button" className="icon-btn" onClick={() => setPlus(true)} aria-label="더보기"><IPlus /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="메시지 보내기" aria-label="메시지" />
          <button className="icon-btn send" disabled={!text.trim()} aria-label="보내기"><ISend /></button>
        </form>}

      <Sheet open={plus} onClose={() => setPlus(false)} items={[
        { label: '📷 사진 보내기', onClick: () => document.getElementById('chat-photo').click() },
        { label: '📅 약속 잡기', onClick: () => setAppt(true) },
        { label: '📍 장소 공유', onClick: () => send(id, `📍 ${p?.place || `${state.me.region} 주민센터 앞`}에서 만나요`) },
        { label: '자주 쓰는 문구: 아직 판매하시나요?', onClick: () => send(id, '안녕하세요, 아직 판매하시나요?') },
      ]} />
      <input id="chat-photo" type="file" accept="image/*" hidden onChange={async (e) => { if (e.target.files[0]) send(id, '', { image: await fileToDataUrl(e.target.files[0], 600) }); e.target.value = ''; }} />

      <Sheet open={menu} onClose={() => setMenu(false)} items={[
        { label: `${u.nickname}님 프로필 보기`, onClick: () => navigate(`/users/${u.id}`) },
        { label: blocked ? '차단 해제' : '차단하기', danger: !blocked, onClick: () => { dispatch({ type: blocked ? 'UNBLOCK' : 'BLOCK', userId: u.id }); showToast(blocked ? '차단을 해제했어요' : '차단했어요'); } },
        { label: '신고하기', danger: true, onClick: () => showToast('신고를 접수했어요') },
        { label: '채팅방 나가기', danger: true, onClick: () => { if (confirm('채팅방을 나가면 대화 내용이 모두 삭제돼요.')) { dispatch({ type: 'LEAVE_CHAT', id }); navigate('/chats', { replace: true }); } } },
      ]} />

      <Modal open={appt} onClose={() => setAppt(false)} title="약속 잡기">
        <label className="field"><span>날짜와 시간</span><input type="datetime-local" className="input" value={when} onChange={(e) => setWhen(e.target.value)} /></label>
        <label className="field"><span>장소</span><input className="input" value={where} onChange={(e) => setWhere(e.target.value)} placeholder="예) 망원역 2번 출구" /></label>
        <button className="btn block mt" disabled={!when || !where} onClick={() => {
          const label = new Date(when).toLocaleString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short', hour: 'numeric', minute: '2-digit' });
          send(id, '약속', { kind: 'appt', when: label, where });
          if (p && iAmSeller && p.status === 'selling') dispatch({ type: 'UPDATE_PRODUCT', id: p.id, patch: { status: 'reserved' } });
          setAppt(false); setWhen(''); setWhere('');
        }}>약속 만들기</button>
      </Modal>
    </div>
  );
}
