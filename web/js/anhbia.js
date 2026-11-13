// Ảnh bìa bài đăng: dựng trên máy từ ảnh công trình thật + tiêu đề + tên KAS. Claude API không vẽ ảnh, nên không tốn tiền.
// Khổ 1080×1350 (dọc 4:5): Facebook và Instagram đều hiện trọn; Instagram cắt các ảnh sau theo tỉ lệ ảnh đầu.
export const KHO = { w: 1080, h: 1350 };
export const MAU_BIA = { TRAN: 'Ảnh tràn, chữ dưới', DAI: 'Dải trắng dưới', KHUNG: 'Khung giữa' };
const THUONG_HIEU = 'KAS HOUZING';
const FONT = '"Be Vietnam Pro", "Segoe UI", Roboto, Arial, sans-serif';

/** Ngắt dòng theo bề rộng; tối đa `toiDa` dòng, dòng cuối thừa thì thêm "…". */
export function ngatDong(ctx, chu, rong, toiDa = 3) {
  const tu = String(chu || '').trim().split(/\s+/).filter(Boolean);
  const dong = [];
  let hien = '';
  for (const t of tu) {
    const thu = hien ? hien + ' ' + t : t;
    if (ctx.measureText(thu).width <= rong || !hien) hien = thu;
    else { dong.push(hien); hien = t; }
  }
  if (hien) dong.push(hien);
  if (dong.length > toiDa) {
    const cat = dong.slice(0, toiDa);
    let cuoi = cat[toiDa - 1];
    while (cuoi.length > 1 && ctx.measureText(cuoi + '…').width > rong) cuoi = cuoi.slice(0, -1);
    cat[toiDa - 1] = cuoi + '…';
    return cat;
  }
  return dong;
}

// Vẽ ảnh phủ kín khung (cắt phần thừa, giữ giữa).
function phuKin(ctx, img, x, y, w, h) {
  const tl = Math.max(w / img.width, h / img.height);
  const sw = w / tl, sh = h / tl;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

function viet(ctx, dong, x, y, coChu, cach, canh = 'left') {
  ctx.textAlign = canh;
  dong.forEach((d, i) => ctx.fillText(d, x, y + i * coChu * cach));
  return y + dong.length * coChu * cach;
}

/** Vẽ ảnh bìa lên canvas. img: ảnh đã tải (Image / ImageBitmap). Trả canvas. */
export function veBia(canvas, img, { mau = 'TRAN', tieuDe = '', phuDe = '' } = {}) {
  const { w, h } = KHO;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
  const le = 72;
  if (mau === 'DAI') {
    const cao = Math.round(h * 0.68);
    if (img) phuKin(ctx, img, 0, 0, w, cao);
    ctx.fillStyle = '#1d1b18';
    ctx.font = `700 76px ${FONT}`;
    const dong = ngatDong(ctx, tieuDe, w - le * 2, 2);
    let y = viet(ctx, dong, le, cao + 120, 76, 1.18);
    if (phuDe) { ctx.fillStyle = '#6b655c'; ctx.font = `400 40px ${FONT}`; y = viet(ctx, ngatDong(ctx, phuDe, w - le * 2, 1), le, y + 12, 40, 1.2); }
    ctx.fillStyle = '#b08d57'; ctx.fillRect(le, h - 96, 64, 6);
    ctx.fillStyle = '#1d1b18'; ctx.font = `700 34px ${FONT}`; ctx.textAlign = 'left'; ctx.fillText(THUONG_HIEU, le + 84, h - 82);
    return canvas;
  }
  if (img) phuKin(ctx, img, 0, 0, w, h);
  if (mau === 'KHUNG') {
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 6; ctx.strokeRect(40, 40, w - 80, h - 80);
    ctx.font = `700 70px ${FONT}`;
    const dong = ngatDong(ctx, tieuDe, w - 260, 3);
    ctx.font = `400 38px ${FONT}`;
    const dongPhu = phuDe ? ngatDong(ctx, phuDe, w - 260, 2) : [];
    const caoHop = 90 + dong.length * 70 * 1.18 + (dongPhu.length ? 20 + dongPhu.length * 38 * 1.25 : 0) + 70;
    const y0 = (h - caoHop) / 2;
    ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillRect(100, y0, w - 200, caoHop);
    ctx.fillStyle = '#1d1b18'; ctx.font = `700 70px ${FONT}`;
    let y = viet(ctx, dong, w / 2, y0 + 110, 70, 1.18, 'center');
    if (dongPhu.length) { ctx.fillStyle = '#6b655c'; ctx.font = `400 38px ${FONT}`; viet(ctx, dongPhu, w / 2, y + 10, 38, 1.25, 'center'); }
    ctx.fillStyle = '#fff'; ctx.font = `700 32px ${FONT}`; ctx.textAlign = 'center'; ctx.fillText(THUONG_HIEU, w / 2, h - 80);
    return canvas;
  }
  // TRAN: ảnh tràn, nền tối dần ở dưới cho chữ trắng dễ đọc.
  const g = ctx.createLinearGradient(0, h * 0.45, 0, h);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.78)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.font = `700 80px ${FONT}`;
  const dong = ngatDong(ctx, tieuDe, w - le * 2, 3);
  ctx.font = `400 40px ${FONT}`;
  const dongPhu = phuDe ? ngatDong(ctx, phuDe, w - le * 2, 2) : [];
  const caoChu = dong.length * 80 * 1.15 + (dongPhu.length ? 16 + dongPhu.length * 40 * 1.25 : 0);
  let y = h - 150 - caoChu + 80;
  ctx.fillStyle = '#fff'; ctx.font = `700 80px ${FONT}`;
  y = viet(ctx, dong, le, y, 80, 1.15);
  if (dongPhu.length) { ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = `400 40px ${FONT}`; viet(ctx, dongPhu, le, y + 16 - 40 * 0.25 + 10, 40, 1.25); }
  ctx.fillStyle = '#d8b878'; ctx.fillRect(le, h - 88, 64, 6);
  ctx.fillStyle = '#fff'; ctx.font = `700 32px ${FONT}`; ctx.textAlign = 'left'; ctx.fillText(THUONG_HIEU, le + 84, h - 74);
  return canvas;
}

/** base64 JPEG → ảnh để vẽ. */
export function taiAnh(base64, loai = 'image/jpeg') {
  return new Promise((ok, loi) => {
    const im = new Image();
    im.onload = () => ok(im);
    im.onerror = () => loi(new Error('Không mở được ảnh'));
    im.src = `data:${loai};base64,${base64}`;
  });
}
