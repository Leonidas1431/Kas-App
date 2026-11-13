// Duyệt mẫu vật liệu: kể cả công trình chỉ thi công vẫn phải duyệt mẫu thực tế (Thầy chốt).
// Mỗi mẫu ghi người bán; khách đồng ý trên link chủ nhà hoặc qua Zalo / gặp trực tiếp.
// Gắn với việc dùng mẫu đó: chưa chốt trước ngày bắt đầu việc (trừ thời gian đặt hàng) thì nhắc.
import { addDays } from './schedule.js';
import { day, taoMa, lichHienTai } from './store.js';

export const TT_MAU = { CHO_KHACH: 'Chờ khách chốt', DUYET: 'Khách đã chốt', DOI: 'Khách muốn đổi' };
// Chốt mẫu trước ngày bắt đầu việc bao nhiêu ngày để kịp đặt hàng. Em tạm để 5 ngày, Thầy sửa được từng mẫu.
export const NGAY_DAT_HANG = 5;

const ghi = (db, m) => { m.capNhatLuc = new Date().toISOString(); day(db, { loai: 'MAU', m }); };
function nhatKy(db, m, nguoi, ghiChu) {
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: m.maCongTrinh, viec: m.viec || '', tenViec: `Mẫu ${m.hangMuc}`, nguoi, loai: 'MAU_VL', ghiChu, congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

export const mauCuaCongTrinh = (db, maCt) => (db.mauVL || []).filter((m) => m.maCongTrinh === maCt && !m.xoa);

// Hạn chốt mặc định: ngày bắt đầu việc dùng mẫu − 5 ngày. Việc đã sát ngày (hạn rơi vào quá khứ) thì cho khách 2 ngày.
export function hanChotMacDinh(ct, viecId, homNay) {
  const t = viecId && lichHienTai(ct).get(viecId);
  if (!t) return '';
  const h = addDays(t.batDau, -NGAY_DAT_HANG);
  return homNay && h < homNay ? addDays(homNay, 2) : h;
}

export function themMau(db, ct, du, nguoi, homNay) {
  db.mauVL = db.mauVL || [];
  const m = { id: 'MAU-' + taoMa(), maCongTrinh: ct.ma, hangMuc: du.hangMuc, tenMau: du.tenMau || '', nguoiBan: du.nguoiBan || '', sdtNguoiBan: du.sdtNguoiBan || '',
    link: du.link || '', viec: du.viec || '', hanChot: du.hanChot || hanChotMacDinh(ct, du.viec, homNay), ngayGui: homNay, trangThai: 'CHO_KHACH',
    ngayKhach: '', quaKhach: '', yKien: '', xoa: '' };
  db.mauVL.push(m);
  ghi(db, m);
  nhatKy(db, m, nguoi, `Gửi khách mẫu ${m.tenMau || m.hangMuc}${m.nguoiBan ? ' (người bán: ' + m.nguoiBan + ')' : ''}`);
  return m;
}

export function suaMau(db, m, thayDoi) { Object.assign(m, thayDoi); ghi(db, m); }
export function xoaMau(db, m) { m.xoa = new Date().toISOString().slice(0, 10); ghi(db, m); }

// Khách muốn đổi: gửi mẫu khác thì sửa tên mẫu / người bán rồi gửi lại (về Chờ khách chốt).
export function khachChotMau(db, m, { dongY, qua, ngay, yKien }, nguoi) {
  Object.assign(m, { trangThai: dongY ? 'DUYET' : 'DOI', quaKhach: qua || 'ZALO', ngayKhach: ngay, yKien: yKien || '' });
  ghi(db, m);
  nhatKy(db, m, nguoi, dongY ? `Khách chốt mẫu ${m.tenMau}` : `Khách muốn đổi mẫu ${m.tenMau}${yKien ? ': ' + yKien : ''}`);
}

export function guiLaiMau(db, m, { tenMau, nguoiBan, sdtNguoiBan, link }, nguoi, homNay) {
  Object.assign(m, { tenMau, nguoiBan, sdtNguoiBan, link, ngayGui: homNay, trangThai: 'CHO_KHACH', ngayKhach: '', quaKhach: '', yKien: '' });
  ghi(db, m);
  nhatKy(db, m, nguoi, `Gửi lại mẫu ${tenMau}${nguoiBan ? ' (người bán: ' + nguoiBan + ')' : ''}`);
}

/** Mẫu chưa chốt mà sắp tới hạn (trong 3 ngày) hoặc đã quá hạn. */
export function mauCanChot(db, homNay) {
  const sap = addDays(homNay, 3);
  return (db.mauVL || []).filter((m) => !m.xoa && m.trangThai !== 'DUYET' && m.hanChot && m.hanChot <= sap && (db.congTrinh || []).some((c) => c.ma === m.maCongTrinh))
    .sort((a, b) => a.hanChot.localeCompare(b.hanChot));
}

export const tinGuiMau = (m, link) => `Dạ anh/chị, bên em gửi mẫu ${m.hangMuc}: ${m.tenMau}${m.link ? `\nẢnh/catalog: ${m.link}` : ''}.${m.hanChot ? `\nAnh/chị chốt giúp em trước ${m.hanChot.slice(8, 10)}/${m.hanChot.slice(5, 7)} để kịp đặt hàng.` : ''}\n${link ? `Anh/chị bấm "Chốt mẫu này" trong link theo dõi công trình: ${link}` : 'Anh/chị nhắn "Chốt mẫu" giúp em ạ.'}`;
