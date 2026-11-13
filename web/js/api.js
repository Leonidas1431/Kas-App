// Nối với máy chủ Apps Script. Không có kết nối thì app chạy bản thử, dữ liệu chỉ ở trên máy.
const KN = 'kas-ket-noi';

export function ketNoi() {
  try { return JSON.parse(localStorage.getItem(KN)) || null; } catch { return null; }
}

export function luuKetNoi(k) {
  try { k ? localStorage.setItem(KN, JSON.stringify(k)) : localStorage.removeItem(KN); } catch { /* bị chặn bộ nhớ */ }
}

// Nhận cả link đầy đủ lẫn mã triển khai (phần giữa /s/ và /exec).
export function apiUrl(api) {
  if (!api) return '';
  if (/^https:\/\//.test(api)) return api;
  return `https://script.google.com/macros/s/${api}/exec`;
}

export function maApi(api) {
  const m = String(api || '').match(/\/s\/([-\w]+)\/exec/);
  return m ? m[1] : String(api || '').trim();
}

export async function goi(action, data, kn = ketNoi()) {
  if (!kn) throw new Error('Chưa kết nối máy chủ');
  const r = await fetch(apiUrl(kn.api), {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ khoa: kn.khoa, action, data }),
  });
  const j = await r.json();
  if (!j.ok) throw new Error(j.loi || 'Máy chủ báo lỗi');
  return j.data;
}

export async function xemChuNha(api, maLink) {
  const r = await fetch(`${apiUrl(api)}?xem=${encodeURIComponent(maLink)}`);
  const j = await r.json();
  if (!j.ok) throw new Error(j.loi);
  return j.data;
}

// Chủ nhà trả lời phương án thiết kế trên link (không cần khoá).
export async function chuNhaPhanHoi(api, data) {
  const r = await fetch(apiUrl(api), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'chuNhaPhanHoi', data }) });
  const j = await r.json();
  if (!j.ok) throw new Error(j.loi || 'Máy chủ báo lỗi');
  return j.data;
}

let dangChay = null;

/**
 * Gửi hàng chờ lên, rồi kéo dữ liệu mới về (chỉ khi đã gửi hết, để không ghi đè việc chưa gửi).
 * Trả về { trangThai: 'demo'|'mat-mang'|'xong'|'loi', loi?, biTuChoi? }.
 */
export function dongBo(db, luu) {
  if (!ketNoi()) return Promise.resolve({ trangThai: 'demo' });
  if (!navigator.onLine) return Promise.resolve({ trangThai: 'mat-mang' });
  if (dangChay) return dangChay;
  dangChay = (async () => {
    const biTuChoi = [];
    // Máy chủ bản cũ chưa biết loại thay đổi mới (vd hợp đồng): giữ lại trên máy, không bỏ, chờ Thầy cập nhật máy chủ.
    const giu = new Set();
    const chuaGui = () => db.outbox.filter((o) => !giu.has(o.idGui));
    try {
      while (chuaGui().length) {
        const lo = chuaGui().slice(0, 25);
        const kq = await goi('dayLen', { ops: lo });
        kq.forEach((x) => { if (!x.ok && /^Loại thay đổi lạ/.test(x.loi || '')) giu.add(x.idGui); else if (!x.ok) biTuChoi.push(x.loi); });
        const daXuLy = new Set(kq.filter((x) => !giu.has(x.idGui)).map((x) => x.idGui));
        db.outbox = db.outbox.filter((o) => !daXuLy.has(o.idGui));
        luu();
      }
      const d = await goi('keoVe');
      if (!chuaGui().length) {
        db.congTrinh = d.congTrinh;
        db.lichSu = d.lichSu;
        db.nguoiDung = d.nguoiDung;
        db.khach = d.khach || [];
        // Máy chủ cũ không trả các bảng mới: giữ bản trên máy.
        if (d.hopDong) db.hopDong = d.hopDong;
        if (d.phuongAn) db.phuongAn = d.phuongAn;
        if (d.gstg) db.gstg = d.gstg;
        if (d.caiDat) db.caiDat = d.caiDat;
        if (d.thuChi) db.thuChi = d.thuChi;
        if (d.traThau) db.traThau = d.traThau;
        if (d.chungTu) db.chungTu = d.chungTu;
        if (d.phatSinh) db.phatSinh = d.phatSinh;
        if (d.mauVL) db.mauVL = d.mauVL;
        db.toi = d.toi;
        luu();
      }
      return { trangThai: 'xong', biTuChoi, mayChuCu: giu.size > 0 };
    } catch (e) {
      return { trangThai: navigator.onLine ? 'loi' : 'mat-mang', loi: e.message, biTuChoi };
    } finally {
      dangChay = null;
    }
  })();
  return dangChay;
}
