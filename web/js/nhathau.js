// Danh bạ nhà thầu, đánh giá sau mỗi công trình, link riêng cho thầu xem lịch việc của mình (không cần đăng nhập),
// và nhắc ảnh hiện trường lúc 16h (Thầy chốt 16h, không phải 17h).
import { sucLam } from './schedule.js';
import { day, taoMa, viecHomNay } from './store.js';

export const LINH_VUC = ['Thầu thô', 'Điện nước', 'Điều hòa', 'Chống thấm', 'Thạch cao, sơn bả', 'Ốp lát', 'Cửa', 'Nhôm kính', 'Gỗ nội thất', 'Đá', 'Rèm', 'Thiết bị', 'Khác'];
export const TIEU_CHI = { chatLuong: 'Chất lượng', tienDo: 'Tiến độ', phoiHop: 'Phối hợp, vệ sinh' };
export const GIO_NHAC_ANH = 16;

const ghiNT = (db, t) => { t.capNhatLuc = new Date().toISOString(); day(db, { loai: 'NT', t }); };

export const dsThau = (db) => (db.nhaThau || []).filter((t) => t.hoatDong !== false).sort((a, b) => a.ten.localeCompare(b.ten, 'vi'));
export const timThauTheoTen = (db, ten) => (db.nhaThau || []).find((t) => t.ten.trim().toLowerCase() === String(ten || '').trim().toLowerCase());

export function themThau(db, du) {
  db.nhaThau = db.nhaThau || [];
  const t = { id: 'NT-' + taoMa(), ten: du.ten.trim(), linhVuc: du.linhVuc || '', sdt: du.sdt || '', ghiChu: du.ghiChu || '', maLink: taoMa() + taoMa(), hoatDong: true, taoLuc: new Date().toISOString() };
  db.nhaThau.push(t);
  ghiNT(db, t);
  return t;
}

// Đổi tên thầu thì đổi luôn tên trong kế hoạch các công trình, để việc vẫn gắn đúng thầu.
export function suaThau(db, t, thayDoi) {
  const tenCu = t.ten;
  Object.assign(t, thayDoi);
  ghiNT(db, t);
  const cu = String(tenCu).trim().toLowerCase();
  if (thayDoi.ten && thayDoi.ten !== tenCu) {
    for (const ct of db.congTrinh || []) for (const v of ct.viec) {
      if (String(v.nhaThau || '').trim().toLowerCase() === cu) { v.nhaThau = t.ten; day(db, { loai: 'VIEC', ma: ct.ma, viec: v }); }
    }
  }
}

// Việc của thầu trên mọi công trình (theo tên thầu ghi trong kế hoạch).
export function viecCuaThau(db, t) {
  const ten = t.ten.trim().toLowerCase();
  return (db.congTrinh || []).flatMap((ct) => ct.viec.filter((v) => String(v.nhaThau || '').trim().toLowerCase() === ten).map((v) => ({ ct, v })));
}

// Ngày chậm do thầu: các lần báo chậm có nguyên nhân "Thầu phụ" trên việc của thầu.
export function ngayChamDoThau(db, t) {
  const ids = new Set(viecCuaThau(db, t).map(({ ct, v }) => ct.ma + '|' + v.id));
  return (db.lichSu || []).filter((e) => e.loai === 'CHAM' && e.nguyenNhan === 'Thầu phụ' && ids.has(e.ma + '|' + e.viec)).reduce((s, e) => s + (e.moi - e.cu), 0);
}

export function danhGia(db, t, { maCongTrinh, ngay, chatLuong, tienDo, phoiHop, ghiChu }, nguoi) {
  db.danhGia = db.danhGia || [];
  const cu = db.danhGia.find((d) => d.maThau === t.id && d.maCongTrinh === maCongTrinh && d.nguoi === nguoi);
  const d = cu || { id: 'DG-' + taoMa(), maThau: t.id, maCongTrinh, nguoi };
  Object.assign(d, { ngay, chatLuong: Number(chatLuong) || 0, tienDo: Number(tienDo) || 0, phoiHop: Number(phoiHop) || 0, ghiChu: ghiChu || '' });
  if (!cu) db.danhGia.push(d);
  d.capNhatLuc = new Date().toISOString();
  day(db, { loai: 'DG', d });
  return d;
}

/** Điểm trung bình từng tiêu chí và chung (1–5), số công trình đã làm, ngày chậm do thầu. */
export function tongHopThau(db, t) {
  const ds = (db.danhGia || []).filter((d) => d.maThau === t.id);
  const tb = (k) => { const x = ds.map((d) => Number(d[k])).filter((n) => n > 0); return x.length ? Math.round((x.reduce((a, b) => a + b, 0) / x.length) * 10) / 10 : null; };
  const diem = Object.fromEntries(Object.keys(TIEU_CHI).map((k) => [k, tb(k)]));
  const co = Object.values(diem).filter((x) => x !== null);
  const chung = co.length ? Math.round((co.reduce((a, b) => a + b, 0) / co.length) * 10) / 10 : null;
  const cts = new Set(viecCuaThau(db, t).map(({ ct }) => ct.ma));
  return { diem, chung, soDanhGia: ds.length, soCongTrinh: cts.size, ngayCham: ngayChamDoThau(db, t), ds };
}

/** Thầu đã xong hết việc ở 1 công trình mà người này chưa đánh giá → nhắc đánh giá. */
export function canDanhGia(db, nguoi) {
  const kq = [];
  for (const t of dsThau(db)) {
    const theoCt = new Map();
    for (const { ct, v } of viecCuaThau(db, t)) { if (!theoCt.has(ct.ma)) theoCt.set(ct.ma, []); theoCt.get(ct.ma).push(v); }
    for (const [ma, vs] of theoCt) {
      if (!vs.every((v) => v.phanTram >= 100)) continue;
      if ((db.danhGia || []).some((d) => d.maThau === t.id && d.maCongTrinh === ma && d.nguoi === nguoi)) continue;
      kq.push({ t, ma });
    }
  }
  return kq;
}

// ---------- Nhắc ảnh 16h ----------
// Công trình cần ảnh hôm nay: chưa xong, hôm nay là ngày làm theo lịch công trình,
// và có việc thi công (không tính việc thiết kế) đang chạy hoặc đang trễ theo lịch.
const laThietKe = (v) => /^Thiết kế/.test(String(v.nhom || ''));
export function congTrinhCanAnh(db, homNay, daXong = () => false) {
  return (db.congTrinh || []).filter((ct) => ct.loai !== 'TK' && !daXong(ct.ma) && ct.khoiCong <= homNay && sucLam(homNay, ct.lich) > 0
    && viecHomNay(ct, homNay).some(({ v, nhan }) => nhan !== 'SAP' && !laThietKe(v)));
}

// Đã có ảnh hôm nay chưa: theo máy chủ (bảng Anh) hoặc ảnh chụp trên máy này hôm nay.
export const coAnhHomNay = (db, ma, homNay) => (db.anh || []).some((a) => a.ma === ma && a.ngay === homNay && a.so > 0) || (db.anhMay || {})[ma] === homNay;

export function thieuAnh(db, homNay, gio, daXong) {
  if (gio < GIO_NHAC_ANH) return [];
  return congTrinhCanAnh(db, homNay, daXong).filter((ct) => !coAnhHomNay(db, ct.ma, homNay));
}

export function ghiDaChupAnh(db, ma, homNay) { db.anhMay = { ...(db.anhMay || {}), [ma]: homNay }; }

// Tin gửi thầu: link xem lịch việc của mình, không cần đăng nhập.
export const tinLinkThau = (t, link) => `KAS gửi anh ${t.ten} link xem lịch việc của anh ở các công trình KAS (mở bằng điện thoại, không cần đăng nhập):\n${link}`;
