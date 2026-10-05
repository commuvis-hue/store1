import { useMemo, useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter } from '../store/router';
import { ProductCard, Empty } from '../components/UI';
import { IBack, IClose } from '../components/Icons';
import { CATEGORIES } from '../data/mock';

const SORTS = { recent: '최신순', low: '낮은 가격순', high: '높은 가격순', popular: '인기순' };

export default function Search() {
  const { state, dispatch, showToast } = useStore();
  const { query, navigate } = useRouter();
  const [q, setQ] = useState(query.get('q') || '');
  const [done, setDone] = useState(query.get('q') || '');
  const [sort, setSort] = useState('recent');
  const [cat, setCat] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [onlySelling, setOnlySelling] = useState(true);

  const submit = (term) => {
    const t = (term ?? q).trim();
    if (!t) return;
    setQ(t); setDone(t);
    dispatch({ type: 'SEARCHED', q: t });
    navigate(`/search?q=${encodeURIComponent(t)}`, { replace: true });
  };

  const results = useMemo(() => {
    if (!done) return [];
    const t = done.toLowerCase();
    let r = state.products.filter((p) => !state.hidden.includes(p.id) && (p.title.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t)));
    if (cat) r = r.filter((p) => p.category === cat);
    if (onlySelling) r = r.filter((p) => p.status !== 'sold');
    if (min) r = r.filter((p) => p.price >= +min);
    if (max) r = r.filter((p) => p.price <= +max);
    const by = { recent: (a, b) => b.createdAt - a.createdAt, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, popular: (a, b) => b.baseLikes + b.chatCount - (a.baseLikes + a.chatCount) };
    return [...r].sort(by[sort]);
  }, [done, state.products, state.hidden, cat, onlySelling, min, max, sort]);

  return (
    <div className="page">
      <header className="topbar search-top">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="뒤로가기"><IBack /></button>
        <form className="search-field" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`${state.me.region} 근처에서 검색`} aria-label="검색어" />
          {q && <button type="button" className="icon-btn sm" onClick={() => { setQ(''); setDone(''); }} aria-label="지우기"><IClose size={18} /></button>}
        </form>
      </header>

      {!done ? (
        <section className="pad">
          <div className="row-between"><h2 className="section-title">최근 검색</h2>
            {state.recentSearches.length > 0 && <button className="text-btn" onClick={() => dispatch({ type: 'CLEAR_SEARCHES' })}>전체 삭제</button>}</div>
          {state.recentSearches.length === 0 ? <p className="meta">최근 검색어가 없어요.</p> :
            <div className="tag-wrap">{state.recentSearches.map((s) => <button key={s} className="tag" onClick={() => submit(s)}>{s}</button>)}</div>}
          <h2 className="section-title mt">인기 검색어</h2>
          <div className="tag-wrap">{['아이폰', '자전거', '소파', '나눔', '모니터', '캠핑'].map((s) => <button key={s} className="tag" onClick={() => submit(s)}>{s}</button>)}</div>
        </section>
      ) : (
        <>
          <div className="filters">
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="정렬">{Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="카테고리"><option value="">전체 카테고리</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <input inputMode="numeric" placeholder="최소 가격" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ''))} aria-label="최소 가격" />
            <input inputMode="numeric" placeholder="최대 가격" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ''))} aria-label="최대 가격" />
            <label className="check"><input type="checkbox" checked={onlySelling} onChange={(e) => setOnlySelling(e.target.checked)} />거래가능만</label>
          </div>
          <div className="keyword-cta">
            <span>"{done}" 새 글이 올라오면 알려드릴까요?</span>
            <button className="text-btn strong" onClick={() => { dispatch({ type: 'ADD_KEYWORD', k: done }); showToast(`키워드 "${done}" 알림을 받아요`); }}>
              {state.keywords.includes(done) ? '알림 받는 중' : '알림 받기'}
            </button>
          </div>
          {results.length === 0
            ? <Empty icon="🔍" title={`"${done}" 검색 결과가 없어요`} desc="필터를 풀거나 다른 단어로 검색해 보세요." />
            : <div className="plist">{results.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
        </>
      )}
    </div>
  );
}
