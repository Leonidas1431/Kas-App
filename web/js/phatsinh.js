// Phát sinh 4 bước (quy trình trong Sổ cái KAS):
// 1. Giám sát báo phát sinh (mô tả + ảnh), không báo giá với khách tại công trình.
// 2. Đức/Thầy báo giá trong 24–48 giờ → "Chờ khách duyệt".
// 3. Khách đồng ý (bấm trên link chủ nhà, hoặc nhắn Zalo → văn phòng ghi ngày + bằng chứng) → "Đã duyệt".
// 4. Chỉ khi đã duyệt, giám sát mới thấy "Được làm".
// Tiền phát sinh thu cùng đợt quyết toán: phải thu = giá bán − các khoản "Thu phát sinh" ghi theo mã PS.
import { addDays, diffDays } from './schedule.js';
import { day, taoMa } from './store.js';

export const TT_PS = { CHO_BAO_GIA: 'Chờ báo giá', CHO_KHACH: 'Chờ khách duyệt', DUYET: 'Được làm', TU_CHOI: 'Không làm' };
export const QUA_PS = { LINK: 'bấm Đồng ý trên link', ZALO: 'qua Zalo', GAP: 'gặp trực tiếp' };
// Báo giá trong 24–48 giờ (Sổ cái): quá 2 ngày chưa chốt thì cảnh báo.
export const HAN_CHOT = 2;
// Ngưỡng cảnh báo tổng phát sinh / HĐ thi công. Lấy theo tham số trong Sổ cái (15%), Thầy đổi được.
export const NGUONG_MAC_DINH = 15;

const ghi = (db, ps) => { ps.capNhatLuc = new Date().toISOString(); day(db, { loai: 'PS', ps }); };

function nhatKy(db, ps, nguoi, ghiChu) {
  // Nhật ký theo mã công trình để giám sát cũng thấy; không ghi tiền vào đây.
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: ps.maCongTrinh, viec: ps.viec || '', tenViec: `Phát sinh ${ps.ma}`, nguoi, loai: 'PHAT_SINH', ghiChu, congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

export const psCuaCongTrinh = (db, maCt) => (db.phatSinh || []).filter((p) => p.maCongTrinh === maCt && !p.xoa).sort((a, b) => a.ma.localeCompare(b.ma));
const maTiep = (db, maCt) => {
  const so = (db.phatSinh || []).filter((p) => p.maCongTrinh === maCt).map((p) => Number(String(p.ma).replace(/\D/g, '')) || 0);
  return 'PS' + String((so.length ? Math.max(...so) : 0) + 1).padStart(2, '0');
};

// Bước 1: ai ở công trình cũng báo được. Giám sát gửi thao tác riêng (máy chủ chỉ nhận mô tả, không nhận giá).
export function baoPhatSinh(db, ct, { moTa, viTri, viec, ngay }, nguoi, laVanPhong) {
  db.phatSinh = db.phatSinh || [];
  const ps = { id: 'PS-' + taoMa(), ma: maTiep(db, ct.ma), maCongTrinh: ct.ma, viec: viec || '', ngayBao: ngay, nguoiBao: nguoi, moTa, viTri: viTri || '',
    giaBan: 0, chiGoc: 0, ngayBaoGia: '', trangThai: 'CHO_BAO_GIA', ngayKhach: '', quaKhach: '', bangChung: '', yKien: '', daLam: '', xoa: '' };
  db.phatSinh.push(ps);
  if (laVanPhong) ghi(db, ps);
  else day(db, { loai: 'PS_BAO', ps: { id: ps.id, ma: ps.ma, maCongTrinh: ps.maCongTrinh, viec: ps.viec, ngayBao: ps.ngayBao, moTa: ps.moTa, viTri: ps.viTri } });
  nhatKy(db, ps, nguoi, `Báo phát sinh: ${moTa}${viTri ? ' (' + viTri + ')' : ''}`);
  return ps;
}

// Bước 2: văn phòng báo giá.
export function baoGia(db, ps, { giaBan, chiGoc, ngay }, nguoi) {
  Object.assign(ps, { giaBan: Number(giaBan) || 0, chiGoc: Number(chiGoc) || 0, ngayBaoGia: ngay, trangThai: 'CHO_KHACH' });
  ghi(db, ps);
  nhatKy(db, ps, nguoi, 'Đã báo giá cho khách, chờ khách duyệt');
}

// Bước 3: khách trả lời (văn phòng ghi khi khách nhắn Zalo / gặp). Trên link chủ nhà thì máy chủ ghi.
export function khachTraLoi(db, ps, { dongY, qua, ngay, bangChung, yKien }, nguoi) {
  Object.assign(ps, { trangThai: dongY ? 'DUYET' : 'TU_CHOI', quaKhach: qua || 'ZALO', ngayKhach: ngay, bangChung: bangChung || '', yKien: yKien || '' });
  ghi(db, ps);
  nhatKy(db, ps, nguoi, dongY ? `Khách đồng ý (${QUA_PS[ps.quaKhach] || ps.quaKhach}) → được làm` : `Khách không làm${yKien ? ': ' + yKien : ''}`);
}

export function suaPS(db, ps, thayDoi) { Object.assign(ps, thayDoi); ghi(db, ps); }
export function xoaPS(db, ps, nguoi) { ps.xoa = new Date().toISOString().slice(0, 10); ghi(db, ps); nhatKy(db, ps, nguoi, 'Huỷ phiếu phát sinh'); }

// Giám sát báo đã làm xong phần phát sinh.
export function daLamPS(db, ps, ngay, nguoi, laVanPhong) {
  ps.daLam = ngay;
  if (laVanPhong) ghi(db, ps); else day(db, { loai: 'PS_XONG', id: ps.id, ngay });
  nhatKy(db, ps, nguoi, 'Đã làm xong phần phát sinh');
}

export const daThuPS = (db, ps) => (db.thuChi || []).filter((e) => !e.xoa && e.loai === 'THU' && e.thamChieu === ps.id).reduce((s, e) => s + (Number(e.soTien) || 0), 0);

/** Tổng phát sinh của công trình: đã duyệt (giá bán, chi gốc), phải thu còn lại, % so với HĐ thi công. */
export function tongPS(db, maCt) {
  const ds = psCuaCongTrinh(db, maCt).filter((p) => p.trangThai === 'DUYET');
  const giaBan = ds.reduce((s, p) => s + (Number(p.giaBan) || 0), 0);
  const chiGoc = ds.reduce((s, p) => s + (Number(p.chiGoc) || 0), 0);
  const conThu = ds.reduce((s, p) => s + Math.max(0, (Number(p.giaBan) || 0) - daThuPS(db, p)), 0);
  const giaTriTC = (db.hopDong || []).filter((h) => h.maCongTrinh === maCt && h.dang !== 'TK' && h.trangThai !== 'DUNG').reduce((s, h) => s + (Number(h.giaTri) || 0), 0);
  const pct = giaTriTC ? Math.round((giaBan / giaTriTC) * 1000) / 10 : null;
  return { ds, giaBan, chiGoc, conThu, pct };
}

/**
 * Việc phát sinh hôm nay.
 * Văn phòng: chờ báo giá (quá 2 ngày là trễ), chờ khách quá 2 ngày → nhắc khách, khách vừa duyệt trên link.
 * Giám sát: phát sinh được làm mà chưa báo xong.
 */
export function viecPSHomNay(db, homNay, vanPhong) {
  const ds = (db.phatSinh || []).filter((p) => !p.xoa && (db.congTrinh || []).some((c) => c.ma === p.maCongTrinh));
  if (!vanPhong) return { duocLam: ds.filter((p) => p.trangThai === 'DUYET' && !p.daLam), choBaoGia: [], choKhach: [] };
  return {
    choBaoGia: ds.filter((p) => p.trangThai === 'CHO_BAO_GIA').map((p) => ({ p, ngay: diffDays(p.ngayBao, homNay) })),
    choKhach: ds.filter((p) => p.trangThai === 'CHO_KHACH' && diffDays(p.ngayBaoGia, homNay) >= HAN_CHOT).map((p) => ({ p, ngay: diffDays(p.ngayBaoGia, homNay) })),
    duocLam: ds.filter((p) => p.trangThai === 'DUYET' && p.quaKhach === 'LINK' && p.ngayKhach >= addDays(homNay, -2)),
  };
}

// Tin nhắn Zalo gửi khách (theo mẫu trong Sổ cái).
export const tinBaoGia = (ps, link) => `Dạ anh/chị, trong quá trình thi công phát sinh hạng mục: ${ps.moTa}${ps.viTri ? ' (' + ps.viTri + ')' : ''}.\nChi phí: ${(Number(ps.giaBan) || 0).toLocaleString('vi-VN')} đ (chưa VAT).\n${link ? `Anh/chị bấm "Đồng ý" ở mục Phát sinh trong link theo dõi công trình: ${link}\nhoặc nhắn` : 'Anh/chị nhắn'} "Đồng ý ${ps.ma}" để bên em triển khai ạ.`;
