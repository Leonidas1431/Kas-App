// Đăng bài: lịch theo tuần, hàng chờ Thầy duyệt, kết quả đăng từng kênh.
// AI viết và đăng chạy trên máy chủ (gas/Code.gs); ở đây chỉ giữ bài, lịch và các phép tính.
import { day, taoMa } from './store.js';
import { addDays } from './schedule.js';

export const KENH = { FB: 'Facebook', IG: 'Instagram', TT: 'TikTok', WEB: 'Website' };
// Kênh máy chủ tự đăng được. TikTok giai đoạn 1 đăng tay (TikTok chưa duyệt ứng dụng thì bài chỉ ở chế độ riêng tư).
export const KENH_TU_DONG = ['FB', 'IG', 'WEB'];
export const LOAI_BAI = { DU_AN: 'Dự án đã làm', CAM_HUNG: 'Cảm hứng, động lực', PHONG_THUY: 'Phong thủy', KINH_NGHIEM: 'Kinh nghiệm làm nhà' };
export const TT_BAI = { NHAP: 'Nháp', CHO_DUYET: 'Chờ Thầy duyệt', DUYET: 'Đã duyệt, chờ đăng', DA_DANG: 'Đã đăng' };
const KENH_MAC_DINH = { DU_AN: ['FB', 'IG', 'TT'], CAM_HUNG: ['FB', 'IG', 'TT'], PHONG_THUY: ['FB', 'IG', 'WEB'], KINH_NGHIEM: ['WEB', 'FB'] };

// Thầy chốt 13/11: Facebook 3–5 bài/tuần (kèm Instagram), TikTok 1–3, website 1. Mục tiêu tính theo mức thấp.
// Giờ đăng 19:30 là em đặt tạm, Thầy đổi trong Cài đặt đăng bài.
export const MAC_DINH_BD = { bdFB: 3, bdTT: 1, bdWEB: 1, bdGio: '19:30' };
// Thầy chọn Sonnet 5.5 ngày 13/11/2026.
export const MODEL = { 'claude-sonnet-5-5': 'Claude Sonnet 5.5 (Thầy chọn, rẻ bằng nửa)', 'claude-opus-5-5': 'Claude Opus 5.5 (viết tự nhiên hơn)' };
// Gemini làm ảnh bìa: giá 1 ảnh khổ 1K, tra trang giá Google ngày 13/11/2026.
export const MODEL_ANH = { 'gemini-3.1-flash-image': 'Gemini 3.1 Flash Image (khoảng 0,067 USD/ảnh)', 'gemini-3-pro-image': 'Gemini 3 Pro Image (chữ trên ảnh đẹp hơn, khoảng 0,134 USD/ảnh)' };
export function caiDatBD(caiDat = {}) {
  const o = {};
  for (const [k, v] of Object.entries(MAC_DINH_BD)) {
    const x = caiDat[k];
    o[k] = x === undefined || x === '' ? v : typeof v === 'number' ? (Number.isFinite(Number(x)) ? Number(x) : v) : String(x);
  }
  o.bdModel = MODEL[caiDat.bdModel] ? caiDat.bdModel : 'claude-sonnet-5-5';
  o.bdWebTrangThai = caiDat.bdWebTrangThai === 'publish' ? 'publish' : 'draft';
  o.bdGemini = MODEL_ANH[caiDat.bdGemini] ? caiDat.bdGemini : 'gemini-3.1-flash-image';
  return o;
}

const ghiBai = (db, b) => { b.capNhatLuc = new Date().toISOString(); day(db, { loai: 'BD', b }); };
export const dsBai = (db) => (db.baiDang || []).filter((b) => !b.xoa);
export const timBai = (db, id) => (db.baiDang || []).find((b) => b.id === id);

export function taoBai(db, du, nguoi) {
  db.baiDang = db.baiDang || [];
  const loai = LOAI_BAI[du.loai] ? du.loai : 'DU_AN';
  const b = { id: 'BD-' + taoMa(), loai, chuDe: du.chuDe || '', ghiChu: du.ghiChu || '', maCongTrinh: du.maCongTrinh || '', nguonTL: '', trichDan: '',
    kenh: du.kenh || KENH_MAC_DINH[loai], ngayDang: du.ngayDang || '', gioDang: '', baiViet: {}, dsAnh: [], anhBia: '', mauBia: 'TRAN', tieuDeBia: '', phuDeBia: '',
    trangThai: 'NHAP', yKien: '', lanViet: 0, nguoiDuyet: '', duyetLuc: '', ketQua: {}, nguoiTao: nguoi, xoa: '', taoLuc: new Date().toISOString() };
  db.baiDang.push(b);
  ghiBai(db, b);
  return b;
}

// Sửa bài trên máy. Đổi nội dung, ảnh sau khi đã duyệt thì về chờ duyệt (máy chủ cũng kiểm như vậy). Bài đã đăng chỉ ghi ý kiến.
export function suaBai(db, b, thayDoi) {
  if (b.trangThai === 'DA_DANG') thayDoi = Object.fromEntries(Object.entries(thayDoi).filter(([k]) => k === 'yKien' || k === 'xoa'));
  const doiNoiDung = ['baiViet', 'dsAnh', 'anhBia'].some((k) => k in thayDoi && JSON.stringify(thayDoi[k]) !== JSON.stringify(b[k]));
  Object.assign(b, thayDoi);
  if (b.trangThai === 'DUYET' && doiNoiDung) Object.assign(b, { trangThai: 'CHO_DUYET', nguoiDuyet: '', duyetLuc: '' });
  if (b.trangThai === 'NHAP' && Object.keys(b.baiViet || {}).length) b.trangThai = 'CHO_DUYET';
  ghiBai(db, b);
}

export const xoaBai = (db, b) => suaBai(db, b, { xoa: new Date().toISOString().slice(0, 10) });

// Bài máy chủ trả về (sau khi AI viết, duyệt, đăng) thay bản trên máy. Bỏ các thay đổi đang chờ gửi của bài đó, vì máy chủ đã có bản mới nhất.
export function nhanBai(db, b) {
  db.baiDang = (db.baiDang || []).filter((x) => x.id !== b.id).concat([b]);
  db.outbox = (db.outbox || []).filter((o) => !(o.loai === 'BD' && o.b && o.b.id === b.id));
}
// Trước khi gọi máy chủ với bản đầy đủ của bài: bỏ các thay đổi cũ của bài đó trong hàng chờ, để không ghi đè kết quả AI.
export const boChoGui = (db, id) => { db.outbox = (db.outbox || []).filter((o) => !(o.loai === 'BD' && o.b && o.b.id === id)); };

export const kenhXong = (b, k) => !!(b.ketQua && b.ketQua[k] && (b.ketQua[k].id || b.ketQua[k].tay));
export const kenhLoi = (b, k) => (b.ketQua && b.ketQua[k] && !kenhXong(b, k) && b.ketQua[k].loi) || '';
export const coLoi = (b) => (b.kenh || []).some((k) => kenhLoi(b, k));

/** Thứ 2 của tuần chứa ngày. */
export function dauTuan(ngay) {
  const d = new Date(ngay + 'T00:00:00Z').getUTCDay();
  return addDays(ngay, -((d + 6) % 7));
}

/** Lịch 1 tuần: 7 ngày kèm bài hẹn ngày đó; số bài mỗi kênh so với mục tiêu. */
export function lichTuan(db, thu2, cd = caiDatBD(db.caiDat)) {
  const ngay = Array.from({ length: 7 }, (_, i) => addDays(thu2, i));
  const bai = dsBai(db).filter((b) => b.ngayDang >= ngay[0] && b.ngayDang <= ngay[6]);
  const dem = (k) => bai.filter((b) => (b.kenh || []).includes(k)).length;
  const mucTieu = { FB: cd.bdFB, TT: cd.bdTT, WEB: cd.bdWEB };
  return {
    ngay: ngay.map((n) => ({ ngay: n, bai: bai.filter((b) => b.ngayDang === n).sort((a, c) => String(a.gioDang).localeCompare(String(c.gioDang))) })),
    kenh: Object.entries(mucTieu).map(([k, can]) => ({ k, ten: KENH[k], co: dem(k), can, thieu: Math.max(0, can - dem(k)) })),
  };
}

export const choDuyet = (db) => dsBai(db).filter((b) => b.trangThai === 'CHO_DUYET').sort((a, b) => String(a.ngayDang || '9').localeCompare(String(b.ngayDang || '9')));
export const chuaHen = (db) => dsBai(db).filter((b) => b.trangThai !== 'DA_DANG' && !b.ngayDang);
export const loiDang = (db) => dsBai(db).filter((b) => b.trangThai !== 'DA_DANG' && coLoi(b));
// Bài đã duyệt có kênh đăng tay (TikTok) chưa đăng: nhắc khi đến ngày.
export const choDangTay = (db, homNay) => dsBai(db).filter((b) => (b.trangThai === 'DUYET' || b.trangThai === 'DA_DANG') && b.ngayDang && b.ngayDang <= homNay
  && (b.kenh || []).some((k) => !KENH_TU_DONG.includes(k) && !kenhXong(b, k)));
export const daDangGanDay = (db, n = 10) => dsBai(db).filter((b) => b.trangThai === 'DA_DANG').sort((a, b) => String(b.ngayDang).localeCompare(String(a.ngayDang))).slice(0, n);

// Gợi ý từ dữ liệu app: công trình chủ nhà đã cho đăng ảnh mà chưa có bài nào.
export function goiYCongTrinh(db) {
  const coBai = new Set(dsBai(db).map((b) => b.maCongTrinh).filter(Boolean));
  return (db.congTrinh || []).filter((ct) => ct.choDangAnh === true && !coBai.has(ct.ma));
}

/** Chi AI tháng này (USD), lấy từ nhật ký gọi Claude trên máy chủ. */
export function chiAIThang(db, homNay) {
  const thang = homNay.slice(0, 7);
  const ds = (db.chiAI || []).filter((r) => String(r.luc).slice(0, 7) === thang);
  return { lan: ds.length, usd: Math.round(ds.reduce((s, r) => s + (Number(r.usd) || 0), 0) * 100) / 100 };
}

// Chữ để chép khi đăng tay.
export function chuDeChep(b, k) {
  const v = b.baiViet || {};
  if (k === 'FB') return v.fb || '';
  if (k === 'IG') return v.ig || v.fb || '';
  if (k === 'TT') return v.tt ? [v.tt.tieuDe, v.tt.chuThich].filter(Boolean).join('\n\n') : '';
  if (k === 'WEB') return v.web ? [v.web.tieuDe, v.web.moTa, v.web.noiDung].filter(Boolean).join('\n\n') : '';
  return '';
}

// Nhóm kênh cho mỗi lần gọi AI (máy chủ chờ tối đa khoảng 60 giây mỗi lần): Facebook + Instagram, TikTok, website.
export function nhomViet(kenh) {
  const g = [];
  const fi = kenh.filter((k) => k === 'FB' || k === 'IG');
  if (fi.length) g.push(fi);
  if (kenh.includes('TT')) g.push(['TT']);
  if (kenh.includes('WEB')) g.push(['WEB']);
  return g;
}

/** Kiểm trước khi gọi AI. Trả câu báo lỗi hoặc ''. */
export function kiemTruocKhiViet(b) {
  if (!(b.kenh || []).length) return 'Chọn ít nhất 1 kênh';
  if (b.loai === 'PHONG_THUY' && (!String(b.trichDan || '').trim() || !String(b.nguonTL || '').trim())) return 'Bài phong thủy cần dán đoạn tài liệu và ghi tên nguồn';
  if (!String(b.chuDe || '').trim() && !String(b.ghiChu || '').trim() && !b.maCongTrinh) return 'Ghi chủ đề, ghi chú hoặc chọn công trình để AI có cái viết';
  return '';
}
