export const won = (n) => `${Number(n).toLocaleString('ko-KR')}원`;
export const priceLabel = (p) => (p.nanum ? '나눔 🧡' : won(p.price));

export function ago(t) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return '방금 전';
  const m = Math.floor(s / 60); if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24); if (d < 7) return `${d}일 전`;
  if (d < 30) return `${Math.floor(d / 7)}주 전`;
  return new Date(t).toLocaleDateString('ko-KR');
}

export const clock = (t) => new Date(t).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });

export function tempColor(t) {
  if (t < 30) return '#5C7CFA';
  if (t < 36.5) return '#4DABF7';
  if (t < 40) return '#12B886';
  if (t < 50) return '#FAB005';
  return '#F76707';
}
export function tempFace(t) {
  if (t < 30) return '😟'; if (t < 36.5) return '🙂'; if (t < 40) return '😊'; if (t < 50) return '😄'; return '😆';
}

export const STATUS = { selling: '판매중', reserved: '예약중', sold: '거래완료' };

export const fileToDataUrl = (file, max = 900) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onerror = rej;
  r.onload = () => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = img.width * scale; c.height = img.height * scale;
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = rej;
    img.src = r.result;
  };
  r.readAsDataURL(file);
});
