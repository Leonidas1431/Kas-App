// Thu chi công trình (theo Sổ cái KAS): sổ chi + thu ngoài hợp đồng, đợt trả thầu, chi dự kiến và lãi gộp.
// Thu theo hợp đồng nằm ở hopdong.js (đợt thu); ở đây chỉ cộng vào để ra lãi gộp và tổng tháng.
// Giám sát (Kha) chỉ thấy đợt trả thầu không có tiền, và chỉ được bấm "Xác nhận khối lượng".
import { addDays } from './schedule.js';
import { day, taoMa } from './store.js';
import { tinhDot, hdCuaCongTrinh } from './hopdong.js';

export const CTY = 'CTY';
// Hạng mục giữ đúng tên trong Sổ cái (tab Danh mục). Thu HĐ thiết kế / thi công ghi ở màn Hợp đồng.
export const HM_CHI = ['Chi thầu phụ', 'Chi vật tư', 'Chi nhân công lẻ', 'Chi vận chuyển', 'Chi khác dự án'];
export const HM_CTY = ['CTY - Văn phòng', 'CTY - Lương, thù lao', 'CTY - Marketing', 'CTY - Thuế, phí', 'CTY - Khác'];
export const HM_THU = ['Thu phát sinh', 'Thu dịch vụ phong thủy', 'Thu khác'];
export const HINH_THUC = { CK: 'Chuyển khoản', TM: 'Tiền mặt' };
export const TT_TRA = { DU: 'Đã trả đủ', DEN_HAN: 'Đến hạn trả', QUA: 'Quá ngày, chưa nghiệm thu KL', CHUA: 'Chưa nghiệm thu KL' };
// Lãi gộp tối thiểu mặc định khi Thầy chưa nhập (%). Sổ cái để Thầy tự nhập, chưa có số chốt.
export const LAI_GOP_MAC_DINH = 0;

/** "12tr", "1,5tr", "500k", "12.000.000", "1.2 tỷ" → số đồng. Không đọc được thì NaN. */
export function docTien(s) {
  const t = String(s ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/đ$|vnd$/, '');
  if (!t) return NaN;
  const m = t.match(/^([\d.,]+)(tr|triệu|trieu|k|nghìn|nghin|ngàn|ty|tỷ)?$/);
  if (!m) return NaN;
  const heSo = { tr: 1e6, triệu: 1e6, trieu: 1e6, k: 1e3, nghìn: 1e3, nghin: 1e3, ngàn: 1e3, ty: 1e9, tỷ: 1e9 }[m[2]] || 1;
  let so = m[1];
  // Có đơn vị: dấu , hoặc . là phần thập phân (1,5tr). Không đơn vị: . , là phân cách nghìn (12.000.000).
  so = heSo > 1 ? so.replace(',', '.') : so.replace(/[.,]/g, '');
  const n = Number(so);
  return Number.isFinite(n) ? Math.round(n * heSo) : NaN;
}

const ghiTC = (db, e) => { e.capNhatLuc = new Date().toISOString(); day(db, { loai: 'TC', e }); };
const ghiTT = (db, t) => { t.capNhatLuc = new Date().toISOString(); day(db, { loai: 'TT', t }); };

function nhatKy(db, ma, nguoi, ghiChu, tenViec = 'Thu chi') {
  // Nhật ký tiền chỉ văn phòng thấy: mã TC-… (máy chủ coi là riêng tư như KH-, HD-), giám sát không kéo về được.
  const e = { id: taoMa(), luc: new Date().toISOString(), ma, viec: '', tenViec, nguoi, loai: 'THU_CHI', ghiChu, congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

export const soConLai = (db) => (db.thuChi || []).filter((e) => !e.xoa);

// Ghi 1 khoản thu/chi. `thamChieu` = id đợt trả thầu (khi chi thầu phụ) để tự trừ công nợ thầu.
export function ghiKhoan(db, du, nguoi) {
  db.thuChi = db.thuChi || [];
  const e = {
    id: 'TC-' + taoMa(), ngay: du.ngay, ma: du.ma || CTY, loai: du.loai === 'THU' ? 'THU' : 'CHI', hangMuc: du.hangMuc,
    thamChieu: du.thamChieu || '', doiTuong: du.doiTuong || '', soTien: Number(du.soTien) || 0, noiDung: du.noiDung || '',
    hinhThuc: du.hinhThuc || 'CK', nguoi, xoa: '', taoLuc: new Date().toISOString(),
  };
  db.thuChi.push(e);
  ghiTC(db, e);
  return e;
}

export function suaKhoan(db, e, thayDoi) { Object.assign(e, thayDoi); ghiTC(db, e); }

// Xoá mềm: giữ dòng trong Sheets để còn dấu vết.
export function xoaKhoan(db, e, nguoi, lyDo = '') {
  e.xoa = new Date().toISOString().slice(0, 10);
  ghiTC(db, e);
  nhatKy(db, e.id, nguoi, `Xoá khoản ${e.loai === 'THU' ? 'thu' : 'chi'} ${e.ma} ${e.hangMuc} ${e.soTien.toLocaleString('vi-VN')} đ ngày ${e.ngay}${lyDo ? '. Lý do: ' + lyDo : ''}`);
}

// ---------- Đợt trả thầu ----------
export const dsTraThau = (db, maCt) => (db.traThau || []).filter((t) => !t.xoa && (!maCt || t.maCongTrinh === maCt));
export const daTra = (db, idDot) => soConLai(db).filter((e) => e.loai === 'CHI' && e.thamChieu === idDot).reduce((s, e) => s + e.soTien, 0);

// Mã đợt gợi ý: chữ đầu của hạng mục + số thứ tự, vd "Điện nước" → DN1 (theo quy ước Sổ cái).
export function goiYMaDot(db, maCt, hangMuc) {
  const bo = String(hangMuc || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').toUpperCase();
  const dau = (bo.match(/\b[A-Z]/g) || ['T']).slice(0, 2).join('') || 'T';
  const n = dsTraThau(db, maCt).filter((t) => String(t.dot).replace(/\d+$/, '') === dau).length + 1;
  return dau + n;
}

export function themDotTra(db, du, nguoi) {
  db.traThau = db.traThau || [];
  const t = {
    id: 'TT-' + taoMa(), maCongTrinh: du.maCongTrinh, thau: du.thau || '', hangMuc: du.hangMuc || '', dot: du.dot || '',
    soTien: Number(du.soTien) || 0, dieuKien: du.dieuKien || '', viecMoc: du.viecMoc || '', hanTra: du.hanTra || '',
    klXacNhan: null, ghiChu: du.ghiChu || '', xoa: '', taoLuc: new Date().toISOString(),
  };
  db.traThau.push(t);
  ghiTT(db, t);
  return t;
}

export function suaDotTra(db, t, thayDoi) { Object.assign(t, thayDoi); ghiTT(db, t); }
export function xoaDotTra(db, t) { t.xoa = new Date().toISOString().slice(0, 10); ghiTT(db, t); }

// Giám sát (hoặc văn phòng) xác nhận thầu đã làm đủ khối lượng của đợt. Không đụng tới tiền.
export function xacNhanKL(db, t, { ngay, ghiChu }, nguoi) {
  t.klXacNhan = { ngay, nguoi, ghiChu: ghiChu || '' };
  day(db, { loai: 'XAC_NHAN_KL', id: t.id, ngay, ghiChu: ghiChu || '' });
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: t.maCongTrinh, viec: t.viecMoc || '', tenViec: `${t.hangMuc || 'Thầu'} ${t.dot}`.trim(), nguoi,
    loai: 'KL', ghiChu: `Xác nhận khối lượng ${t.thau} đợt ${t.dot}${t.dieuKien ? ' (' + t.dieuKien + ')' : ''}${ghiChu ? ': ' + ghiChu : ''}`, congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

export function trangThaiTra(db, t, homNay) {
  const tra = daTra(db, t.id);
  const con = (Number(t.soTien) || 0) - tra;
  const tt = con <= 0 && t.soTien > 0 ? 'DU' : t.klXacNhan ? 'DEN_HAN' : t.hanTra && t.hanTra < homNay ? 'QUA' : 'CHUA';
  return { tra, con, tt };
}

// Đợt cần giám sát xác nhận: việc mốc đã xong, hoặc tới hạn trả (trong 3 ngày), mà chưa xác nhận.
export function canXacNhanKL(db, homNay) {
  const sap = addDays(homNay, 3);
  return dsTraThau(db).filter((t) => {
    if (t.klXacNhan) return false;
    const ct = (db.congTrinh || []).find((c) => c.ma === t.maCongTrinh);
    if (!ct) return false;
    const v = t.viecMoc && ct.viec.find((x) => x.id === t.viecMoc);
    return (v && v.phanTram >= 100) || (t.hanTra && t.hanTra <= sap);
  }).map((t) => ({ t, ct: db.congTrinh.find((c) => c.ma === t.maCongTrinh) }));
}

// ---------- Tổng hợp ----------
// Thu theo HĐ trong khoảng ngày (theo ngày ghi thu của từng lần khách chuyển).
function thuHD(db, tu, den, maCt) {
  let s = 0;
  for (const hd of db.hopDong || []) {
    if (maCt && hd.maCongTrinh !== maCt) continue;
    for (const d of hd.dot || []) for (const t of d.thu || []) if ((!tu || t.ngay >= tu) && (!den || t.ngay <= den)) s += Number(t.soTien) || 0;
  }
  return s;
}

/** Thu, chi trong 1 tháng ('YYYY-MM'); thu gồm cả tiền khách chuyển theo HĐ. */
export function tongThang(db, thang) {
  const tu = thang + '-01', den = thang + '-31';
  const trong = soConLai(db).filter((e) => e.ngay >= tu && e.ngay <= den);
  const thuNgoai = trong.filter((e) => e.loai === 'THU').reduce((s, e) => s + e.soTien, 0);
  const chi = trong.filter((e) => e.loai === 'CHI').reduce((s, e) => s + e.soTien, 0);
  const chiCty = trong.filter((e) => e.loai === 'CHI' && e.ma === CTY).reduce((s, e) => s + e.soTien, 0);
  const thu = thuHD(db, tu, den) + thuNgoai;
  return { thu, chi, chiCty, chenh: thu - chi };
}

/** Công nợ thầu toàn bộ: đến hạn trả (đã xác nhận KL) và tổng còn phải trả. */
export function congNoThau(db, homNay) {
  let denHan = 0, conPhaiTra = 0;
  const ds = [];
  for (const t of dsTraThau(db)) {
    const r = trangThaiTra(db, t, homNay);
    if (r.con > 0) conPhaiTra += r.con;
    if (r.tt === 'DEN_HAN' && r.con > 0) { denHan += r.con; ds.push({ t, ...r }); }
  }
  return { denHan, conPhaiTra, ds };
}

/**
 * Lãi gộp 1 công trình (giống tab Dự án của Sổ cái):
 * doanh thu = phải thu các HĐ không dừng (đã trừ khấu trừ phí TK, gồm phụ lục) + thu ngoài HĐ;
 * chi dự kiến = tổng "chi dự kiến" ghi ở các HĐ; chi thực tế = sổ chi của công trình.
 */
export function laiGop(db, maCt, laiToiThieu = LAI_GOP_MAC_DINH) {
  const hds = hdCuaCongTrinh(db, maCt).filter((h) => h.trangThai !== 'DUNG');
  const so = soConLai(db).filter((e) => e.ma === maCt);
  const thuNgoai = so.filter((e) => e.loai === 'THU').reduce((s, e) => s + e.soTien, 0);
  const doanhThu = hds.reduce((s, h) => s + tinhDot(h).phaiThu, 0) + thuNgoai;
  const daThu = thuHD(db, '', '', maCt) + thuNgoai;
  const chi = so.filter((e) => e.loai === 'CHI').reduce((s, e) => s + e.soTien, 0);
  const chiDuKien = hds.reduce((s, h) => s + (Number(h.chiDuKien) || 0), 0);
  const camKetThau = dsTraThau(db, maCt).reduce((s, t) => s + (Number(t.soTien) || 0), 0);
  const laiDuKien = chiDuKien ? doanhThu - chiDuKien : null;
  const pctDuKien = laiDuKien !== null && doanhThu ? Math.round((laiDuKien / doanhThu) * 1000) / 10 : null;
  const canhBao = [];
  if (chiDuKien && chi > chiDuKien) canhBao.push('Vượt chi dự kiến');
  if (chiDuKien && camKetThau > chiDuKien) canhBao.push('Đợt trả thầu vượt chi dự kiến');
  if (pctDuKien !== null && laiToiThieu && pctDuKien < laiToiThieu) canhBao.push(`Lãi gộp dự kiến dưới ${laiToiThieu}%`);
  return { doanhThu, daThu, chi, chiDuKien, camKetThau, laiDuKien, pctDuKien, laiThucTe: daThu - chi, canhBao };
}

// Gợi ý đối tượng khi gõ: nhà thầu trong kế hoạch, đợt trả thầu, và người đã ghi trước đó.
export const dsDoiTuong = (db) => [...new Set([
  ...(db.congTrinh || []).flatMap((c) => c.viec.map((v) => v.nhaThau)),
  ...(db.traThau || []).map((t) => t.thau),
  ...(db.thuChi || []).map((e) => e.doiTuong),
].filter(Boolean))].sort();
