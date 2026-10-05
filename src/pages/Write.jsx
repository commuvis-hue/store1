import { useState } from 'react';
import { useStore } from '../store/Store';
import { useRouter } from '../store/router';
import { CATEGORIES, u } from '../data/mock';
import { TopBar, Img, Empty } from '../components/UI';
import { ICamera, IClose } from '../components/Icons';
import { fileToDataUrl } from '../utils';

const SAMPLES = ['1583394838336-acd977736f90', '1549298916-b41d501d3772', '1527864550417-7fd91fc51a46', '1595950653106-6c9ebd614d3a', '1519710164239-da123dc03ef4', '1556228453-efd6c1ff04f6'].map((id) => u(id));

export default function Write({ editId }) {
  const { state, dispatch, addProduct, showToast } = useStore();
  const { navigate } = useRouter();
  const editing = editId ? state.products.find((p) => p.id === editId) : null;
  const [f, setF] = useState(() => editing ? {
    images: editing.images, title: editing.title, category: editing.category, nanum: editing.nanum,
    price: editing.price ? String(editing.price) : '', offerable: editing.offerable, desc: editing.desc, place: editing.place || '',
  } : { images: [], title: '', category: '', nanum: false, price: '', offerable: true, desc: '', place: '' });
  const [showSamples, setShowSamples] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  if (editId && (!editing || editing.sellerId !== 'me')) return <div className="page"><TopBar back title="글 수정" /><Empty title="수정할 수 없는 게시글이에요" /></div>;

  const onFiles = async (e) => {
    const files = [...e.target.files].slice(0, 10 - f.images.length);
    const urls = await Promise.all(files.map((x) => fileToDataUrl(x)));
    set('images', [...f.images, ...urls]);
    e.target.value = '';
  };

  const errors = [];
  if (!f.title.trim()) errors.push('제목');
  if (!f.category) errors.push('카테고리');
  if (!f.nanum && !f.price) errors.push('가격');
  if (!f.desc.trim()) errors.push('자세한 설명');

  const submit = () => {
    if (errors.length) { showToast(`${errors.join(', ')}을(를) 입력해 주세요`); return; }
    const data = {
      title: f.title.trim(), category: f.category, nanum: f.nanum, price: f.nanum ? 0 : +f.price,
      offerable: f.nanum ? false : f.offerable, desc: f.desc.trim(), place: f.place.trim(),
      images: f.images.length ? f.images : [SAMPLES[Math.floor(Math.random() * SAMPLES.length)]],
    };
    if (editing) {
      dispatch({ type: 'UPDATE_PRODUCT', id: editing.id, patch: data });
      showToast('수정했어요');
      navigate(`/products/${editing.id}`, { replace: true });
    } else {
      const p = addProduct(data);
      showToast('게시글을 올렸어요');
      navigate(`/products/${p.id}`, { replace: true });
    }
  };

  return (
    <div className="page has-actionbar">
      <TopBar back title={editing ? '중고거래 글 수정' : '내 물건 팔기'} />
      <div className="pad form">
        <div className="photo-row">
          <label className="photo-add">
            <ICamera /><span>{f.images.length}/10</span>
            <input type="file" accept="image/*" multiple hidden onChange={onFiles} disabled={f.images.length >= 10} />
          </label>
          {f.images.map((src, i) => (
            <div className="photo-thumb" key={i}>
              <Img src={src} alt={`첨부 사진 ${i + 1}`} seed={`w${i}`} />
              {i === 0 && <span className="photo-main">대표 사진</span>}
              <button className="photo-del" onClick={() => set('images', f.images.filter((_, j) => j !== i))} aria-label="사진 삭제"><IClose size={14} /></button>
            </div>
          ))}
        </div>
        <button className="text-btn" onClick={() => setShowSamples((v) => !v)}>{showSamples ? '샘플 사진 닫기' : '테스트용 샘플 사진에서 고르기'}</button>
        {showSamples && (
          <div className="sample-row">
            {SAMPLES.map((s) => <button key={s} className="sample" onClick={() => f.images.length < 10 && set('images', [...f.images, s])}><Img src={s} alt="샘플 사진" seed={s} /></button>)}
          </div>
        )}

        <label className="field"><span>제목</span>
          <input className="input" value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="제목" maxLength={60} /></label>

        <label className="field"><span>카테고리</span>
          <select className="input" value={f.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">카테고리 선택</option>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select></label>

        <div className="field"><span>거래 방식</span>
          <div className="seg">
            <button className={!f.nanum ? 'is-on' : ''} onClick={() => set('nanum', false)}>판매하기</button>
            <button className={f.nanum ? 'is-on' : ''} onClick={() => set('nanum', true)}>나눔하기</button>
          </div>
        </div>

        {!f.nanum && <>
          <label className="field"><span>가격</span>
            <div className="input-wrap"><span>₩</span><input className="input" inputMode="numeric" value={f.price ? Number(f.price).toLocaleString() : ''} onChange={(e) => set('price', e.target.value.replace(/\D/g, ''))} placeholder="가격을 입력해 주세요" /></div></label>
          <label className="check"><input type="checkbox" checked={f.offerable} onChange={(e) => set('offerable', e.target.checked)} />가격 제안 받기</label>
        </>}

        <label className="field"><span>자세한 설명</span>
          <textarea className="input" rows={7} value={f.desc} onChange={(e) => set('desc', e.target.value)}
            placeholder={`${state.me.region}에 올릴 게시글 내용을 작성해 주세요. (판매 금지 물품은 게시가 제한될 수 있어요.)\n\n신뢰할 수 있는 거래를 위해 자세히 적어주세요.`} /></label>

        <label className="field"><span>거래 희망 장소</span>
          <input className="input" value={f.place} onChange={(e) => set('place', e.target.value)} placeholder="예) 망원역 2번 출구" /></label>
      </div>
      <div className="actionbar"><button className="btn block" onClick={submit}>{editing ? '수정 완료' : '작성 완료'}</button></div>
    </div>
  );
}
