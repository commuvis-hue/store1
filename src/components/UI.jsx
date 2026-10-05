import { useState } from 'react';
import { useRouter, Link } from '../store/router';
import { useStore } from '../store/Store';
import { tempColor, tempFace, priceLabel, ago, STATUS } from '../utils';
import { IBack, IHeart, IChat, IHome, ICommunity, IMap, IUser, IPlus } from './Icons';

const placeholder = (label = '') =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#EEF1EF"/><path d="M110 170l30-36 26 30 18-20 36 46H80z" fill="#C7D0CB"/><circle cx="190" cy="115" r="14" fill="#C7D0CB"/><text x="150" y="250" font-family="sans-serif" font-size="16" fill="#8A958F" text-anchor="middle">${label}</text></svg>`);

// 실사 이미지 로더: Unsplash → picsum(대체 실사) → SVG 플레이스홀더 순으로 폴백
export function Img({ src, alt = '', seed, className, ...rest }) {
  const [stage, setStage] = useState(0);
  const sources = [src, `https://picsum.photos/seed/${encodeURIComponent(seed || alt || 'x')}/800/800`, placeholder()];
  return <img src={sources[stage] || placeholder()} alt={alt} loading="lazy" className={className}
    onError={() => setStage((s) => Math.min(s + 1, 2))} {...rest} />;
}

export function Avatar({ user, size = 40 }) {
  if (!user) return null;
  return <span className="avatar" style={{ width: size, height: size, background: user.color, fontSize: size * 0.42 }} aria-hidden="true">
    {user.nickname.slice(0, 1)}
  </span>;
}

export function MannerTemp({ temp, compact }) {
  const c = tempColor(temp);
  if (compact) return <span className="temp-chip" style={{ color: c }}>{temp.toFixed(1)}°C {tempFace(temp)}</span>;
  return (
    <div className="temp">
      <div className="temp-row">
        <strong style={{ color: c }}>{temp.toFixed(1)}°C</strong><span className="temp-face">{tempFace(temp)}</span>
      </div>
      <div className="temp-bar"><span style={{ width: `${Math.min(100, temp)}%`, background: c }} /></div>
      <small>매너온도</small>
    </div>
  );
}

export function TopBar({ title, back, right, transparent }) {
  const { navigate } = useRouter();
  return (
    <header className={`topbar ${transparent ? 'is-clear' : ''}`}>
      {back && <button className="icon-btn" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label="뒤로가기"><IBack /></button>}
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-right">{right}</div>
    </header>
  );
}

export function StatusBadge({ status }) {
  if (status === 'selling') return null;
  return <span className={`badge badge-${status}`}>{STATUS[status]}</span>;
}

export function ProductCard({ p }) {
  const { likeCount } = useStore();
  const likes = likeCount(p);
  return (
    <Link to={`/products/${p.id}`} className={`pcard ${p.status === 'sold' ? 'is-sold' : ''}`}>
      <div className="pcard-img"><Img src={p.images[0]} alt={p.title} seed={p.id} /></div>
      <div className="pcard-body">
        <h3 className="pcard-title">{p.title}</h3>
        <p className="meta">{p.region} · {p.bumpedAt ? `끌올 ${ago(p.bumpedAt)}` : ago(p.createdAt)}</p>
        <p className="pcard-price"><StatusBadge status={p.status} />{priceLabel(p)}</p>
        <div className="pcard-counts">
          {p.chatCount > 0 && <span><IChat size={15} />{p.chatCount}</span>}
          {likes > 0 && <span><IHeart size={15} />{likes}</span>}
        </div>
      </div>
    </Link>
  );
}

export function Empty({ icon = '🌱', title, desc, action }) {
  return <div className="empty"><div className="empty-icon">{icon}</div><p className="empty-title">{title}</p>{desc && <p className="meta">{desc}</p>}{action}</div>;
}

export function Sheet({ open, onClose, items, title }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {title && <p className="sheet-title">{title}</p>}
        <div className="sheet-group">
          {items.map((it) => (
            <button key={it.label} className={`sheet-item ${it.danger ? 'is-danger' : ''}`} onClick={() => { onClose(); it.onClick(); }}>{it.label}</button>
          ))}
        </div>
        <button className="sheet-item sheet-cancel" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="sheet-wrap" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return <div className="toast" key={toast.k} role="status">{toast.msg}</div>;
}

const NAV = [
  { to: '/', label: '홈', Icon: IHome, match: (p) => p === '/' },
  { to: '/community', label: '동네생활', Icon: ICommunity, match: (p) => p.startsWith('/community') },
  { to: '/nearby', label: '내 근처', Icon: IMap, match: (p) => p.startsWith('/nearby') },
  { to: '/chats', label: '채팅', Icon: IChat, match: (p) => p.startsWith('/chats') },
  { to: '/my', label: '나의 옆집', Icon: IUser, match: (p) => p.startsWith('/my') },
];

export function BottomNav() {
  const { pathname } = useRouter();
  const { state } = useStore();
  const unread = state.chats.reduce((n, c) => n + c.unread, 0);
  return (
    <nav className="bottomnav" aria-label="주요 메뉴">
      {NAV.map(({ to, label, Icon, match }) => (
        <Link key={to} to={to} className={`nav-item ${match(pathname) ? 'is-active' : ''}`} aria-current={match(pathname) ? 'page' : undefined}>
          <span className="nav-icon"><Icon size={24} />{to === '/chats' && unread > 0 && <i className="dot">{unread}</i>}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function Fab({ to, label = '글쓰기' }) {
  return <Link to={to} className="fab"><IPlus size={22} /><span>{label}</span></Link>;
}

export function LikeButton({ id }) {
  const { isLiked, dispatch, showToast } = useStore();
  const on = isLiked(id);
  return (
    <button className={`like-btn ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label="관심상품"
      onClick={() => { dispatch({ type: 'TOGGLE_LIKE', id }); showToast(on ? '관심목록에서 삭제했어요' : '관심목록에 추가했어요'); }}>
      <IHeart filled={on} size={26} />
    </button>
  );
}
