import { useMemo, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter, Link } from '../store/router';
import { CATEGORIES } from '../data/mock';
import { ProductCard, Fab, Empty, Sheet } from '../components/UI';
import { ISearch, IBell, IDown, IMenu } from '../components/Icons';

export default function Home() {
  const { state, dispatch, showToast } = useStore();
  const { query, navigate } = useRouter();
  const cat = query.get('cat');
  const [hideSold, setHideSold] = useState(false);
  const [regionSheet, setRegionSheet] = useState(false);
  const unreadNoti = state.notifications.filter((n) => !n.read).length;

  const list = useMemo(() => state.products
    .filter((p) => !state.hidden.includes(p.id) && !state.blocked.includes(p.sellerId))
    .filter((p) => !cat || p.category === cat)
    .filter((p) => !hideSold || p.status !== 'sold')
    .sort((a, b) => (b.bumpedAt || b.createdAt) - (a.bumpedAt || a.createdAt)),
  [state.products, state.hidden, state.blocked, cat, hideSold]);

  const catName = CATEGORIES.find((c) => c.id === cat)?.name;

  return (
    <div className="page">
      <header className="topbar home-top">
        <button className="region-btn" onClick={() => setRegionSheet(true)}>{state.me.region}<IDown size={18} /></button>
        <div className="topbar-right">
          <Link to="/search" className="icon-btn" aria-label="검색"><ISearch /></Link>
          <Link to="/categories" className="icon-btn" aria-label="카테고리"><IMenu /></Link>
          <Link to="/notifications" className="icon-btn has-dot" aria-label="알림"><IBell />{unreadNoti > 0 && <i className="pip" />}</Link>
        </div>
      </header>

      <div className="chips" role="toolbar" aria-label="카테고리 필터">
        <button className={`chip ${!cat ? 'is-on' : ''}`} onClick={() => navigate('/')}>전체</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? 'is-on' : ''}`} onClick={() => navigate(`/?cat=${c.id}`)}>{c.icon} {c.name}</button>
        ))}
      </div>

      <div className="list-tools">
        <span className="meta">{catName ? `${catName} · ` : ''}{list.length}개의 상품</span>
        <label className="check"><input type="checkbox" checked={hideSold} onChange={(e) => setHideSold(e.target.checked)} />거래가능만 보기</label>
      </div>

      {list.length === 0
        ? <Empty title="이 카테고리엔 아직 상품이 없어요" desc="첫 번째로 물건을 올려보세요." />
        : <div className="plist">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}

      <Fab to="/write" />

      <Sheet open={regionSheet} onClose={() => setRegionSheet(false)} title="동네 선택"
        items={[
          ...state.me.regions.map((r) => ({ label: `${r === state.me.region ? '✓ ' : ''}${r}`, onClick: () => { dispatch({ type: 'ME', patch: { region: r } }); showToast(`${r}으로 변경했어요`); } })),
          { label: '내 동네 설정하기', onClick: () => navigate('/my/region') },
        ]} />
    </div>
  );
}
