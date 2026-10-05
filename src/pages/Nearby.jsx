import { useState } from 'react';
import { useStore } from '../store/Store';
import { STORES, JOBS, HOMES, CARS } from '../data/mock';
import { Img, Modal } from '../components/UI';
import { IStar } from '../components/Icons';
import { ago, won } from '../utils';

const TABS = [
  { id: 'stores', label: '동네가게', icon: '🏪' },
  { id: 'jobs', label: '알바', icon: '💼' },
  { id: 'homes', label: '부동산', icon: '🏠' },
  { id: 'cars', label: '중고차', icon: '🚗' },
];

export default function Nearby() {
  const { state, showToast } = useStore();
  const [tab, setTab] = useState('stores');
  const [detail, setDetail] = useState(null);
  const [saved, setSaved] = useState([]);
  const toggleSave = (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">내 근처</h1><span className="meta">{state.me.region} 주변</span></header>

      <div className="map-card" aria-label="동네 지도">
        <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${state.me.region} 주변 지도`}>
          <rect width="400" height="160" fill="#E7EFEA" />
          <path d="M0 120 C80 100 140 140 220 115 S360 90 400 105 V160 H0z" fill="#CFE3F0" />
          <g stroke="#fff" strokeWidth="7" fill="none"><path d="M0 50 H400" /><path d="M120 0 V160" /><path d="M280 0 L250 160" /><path d="M0 90 L400 70" /></g>
          <g stroke="#fff" strokeWidth="3" fill="none"><path d="M40 0 V160" /><path d="M200 0 V100" /><path d="M340 0 V90" /><path d="M0 20 H400" /></g>
          {[[150, 42, '☕'], [230, 60, '🍔'], [310, 38, '🍚'], [95, 80, '💼'], [180, 88, '🏠']].map(([x, y, e], i) => (
            <g key={i} transform={`translate(${x} ${y})`}><circle r="13" fill="#fff" stroke="#0E7C66" strokeWidth="2" /><text textAnchor="middle" dy="5" fontSize="13">{e}</text></g>
          ))}
          <g transform="translate(200 64)"><circle r="9" fill="#0E7C66" opacity=".25" /><circle r="5" fill="#0E7C66" /></g>
        </svg>
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} className={`tab ${tab === t.id ? 'is-on' : ''}`} onClick={() => setTab(t.id)}>{t.icon} {t.label}</button>)}
      </div>

      {tab === 'stores' && <div className="rows">{STORES.map((s) => (
        <button key={s.id} className="row-card" onClick={() => setDetail({ kind: 'store', ...s })}>
          <div className="row-img"><Img src={s.image} alt={s.name} seed={s.id} /></div>
          <div className="row-body">
            <strong>{s.name}</strong>
            <p className="meta">{s.category} · {s.region} · {s.distance}</p>
            <p className="rating"><IStar size={14} /> {s.rating} <span className="meta">후기 {s.reviews}</span></p>
            {s.coupon && <span className="coupon">🎟️ {s.coupon}</span>}
          </div>
        </button>))}</div>}

      {tab === 'jobs' && <div className="rows">{JOBS.map((j) => (
        <button key={j.id} className="row-card" onClick={() => setDetail({ kind: 'job', ...j })}>
          <div className="row-body">
            <strong>{j.title}</strong>
            <p className="meta">{j.place} · {j.region} · {ago(j.createdAt)}</p>
            <p className="pay">{j.pay}</p><p className="meta">{j.schedule}</p>
          </div>
        </button>))}</div>}

      {tab === 'homes' && <div className="rows">{HOMES.map((h) => (
        <button key={h.id} className="row-card" onClick={() => setDetail({ kind: 'home', ...h })}>
          <div className="row-img"><Img src={h.image} alt={`${h.type} 사진`} seed={h.id} /></div>
          <div className="row-body">
            <strong>{h.deal} {h.price}</strong>
            <p>{h.type} · {h.size} · {h.floor}</p>
            <p className="meta">{h.region} · {ago(h.createdAt)}</p>
          </div>
        </button>))}</div>}

      {tab === 'cars' && <div className="rows">{CARS.map((c) => (
        <button key={c.id} className="row-card" onClick={() => setDetail({ kind: 'car', ...c })}>
          <div className="row-img"><Img src={c.image} alt={c.title} seed={c.id} /></div>
          <div className="row-body">
            <strong>{c.title}</strong>
            <p className="meta">{c.km} · {c.fuel} · {c.region}</p>
            <p className="pay">{won(c.price)}</p>
          </div>
        </button>))}</div>}

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name || detail?.title || `${detail?.type} ${detail?.deal}`}>
        {detail?.image && <div className="modal-img"><Img src={detail.image} alt="" seed={detail.id} /></div>}
        {detail?.kind === 'store' && <><p>{detail.desc}</p><p className="meta">{detail.distance} · 후기 {detail.reviews}개</p></>}
        {detail?.kind === 'job' && <><p className="pay">{detail.pay}</p><p>{detail.schedule}</p><p className="meta">{detail.place} · {detail.region}</p></>}
        {detail?.kind === 'home' && <><p className="pay">{detail.deal} {detail.price}</p><p>{detail.type} · {detail.size} · {detail.floor}</p></>}
        {detail?.kind === 'car' && <><p className="pay">{won(detail.price)}</p><p>{detail.km} · {detail.fuel}</p><p className="meta">직거래 · 성능점검 기록 확인 가능</p></>}
        <div className="modal-actions">
          <button className="btn ghost" onClick={() => { toggleSave(detail.id); showToast(saved.includes(detail.id) ? '저장을 취소했어요' : '저장했어요'); }}>
            {saved.includes(detail?.id) ? '저장됨' : '저장'}
          </button>
          <button className="btn" onClick={() => { showToast({ store: '단골로 등록했어요', job: '지원서를 보냈어요', home: '문의를 보냈어요', car: '판매자에게 문의를 보냈어요' }[detail.kind]); setDetail(null); }}>
            {{ store: '단골 맺기', job: '지원하기', home: '문의하기', car: '문의하기' }[detail?.kind]}
          </button>
        </div>
      </Modal>
    </div>
  );
}
