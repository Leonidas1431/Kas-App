// Thu chi công trình (theo Sổ cái KAS): sổ chi + thu ngoài hợp đồng, đợt trả thầu, chi dự kiến và lãi gộp.
// Thu theo hợp đồng nằm ở hopdong.js (đợt thu); ở đây chỉ cộng vào để ra lãi gộp và tổng tháng.
// Giám sát (Kha) chỉ thấy đợt trả thầu không có tiền, và chỉ được bấm "Xác nhận khối lượng".
import { addDays, diffDays } from './schedule.js';
import { day, taoMa, lichHienTai, VAN_PHONG } from './store.js';
import { tinhDot, hdCuaCongTrinh } from './hopdong.js';
import { tongPS, NGUONG_MAC_DINH } from './phatsinh.js';

export const CTY = 'CTY';
// Hạng mục giữ đúng tên trong Sổ cái (tab Danh mục). Thu HĐ thiết kế / thi công ghi ở màn Hợp đồng.
export const HM_CHI = ['Chi thầu phụ', 'Chi vật tư', 'Chi nhân công lẻ', 'Chi vận chuyển', 'Chi khác dự án'];
export const HM_CTY = ['CTY - Văn phòng', 'CTY - Lương, thù lao', 'CTY - Marketing', 'CTY - Thuế, phí', 'CTY - Khác'];
export const HM_THU = ['Thu phát sinh', 'Thu dịch vụ phong thủy', 'Thu khác'];
export const HINH_THUC = { CK: 'Chuyển khoản', TM: 'Tiền mặt' };
export const TT_TRA = { DU: 'Đã trả đủ', DEN_HAN: 'Đến hạn trả', QUA: 'Quá ngày, chưa nghiệm thu KL', CHUA: 'Chưa nghiệm thu KL', QUA_HAN: 'Quá hạn trả', CHUA_DEN: 'Chưa đến hạn' };
// Thầy chốt 17/11: tài khoản cá nhân dùng cho việc chung đánh dấu "tiền mặt", tài khoản doanh nghiệp đánh dấu "công ty".
export const LOAI_TK = { CONG_TY: 'Tài khoản công ty', TIEN_MAT: 'Tài khoản tiền mặt' };
// Công nợ phải trả: thầu phụ (trả theo khối lượng, giám sát xác nhận) và nhà cung cấp vật tư (mua chịu, trả theo hạn).
export const LOAI_NO = { THAU: 'Thầu phụ', NCC: 'Nhà cung cấp' };
export const loaiNo = (t) => (t.loaiNo === 'NCC' ? 'NCC' : 'THAU');
// Nhắc trước hạn trả / hạn thu bao nhiêu ngày.
export const SAP_HAN = 3;
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
    id: 'TC-' + taoMa(), ngay: du.ngay, ma: du.ma || CTY, loai: ['THU', 'CHUYEN'].includes(du.loai) ? du.loai : 'CHI', hangMuc: du.hangMuc || '',
    thamChieu: du.thamChieu || '', doiTuong: du.doiTuong || '', soTien: Number(du.soTien) || 0, noiDung: du.noiDung || '',
    hinhThuc: du.hinhThuc || 'CK', nguoi, xoa: '', taoLuc: new Date().toISOString(),
    taiKhoan: du.taiKhoan || '', toiTK: du.loai === 'CHUYEN' ? du.toiTK || '' : '',
    // Văn phòng ghi thì coi như đã kiểm; giám sát ghi thì chờ văn phòng kiểm.
    duyet: VAN_PHONG.includes(nguoi) ? 'VP' : '',
  };
  if (e.loai === 'CHUYEN') { e.ma = CTY; e.hangMuc = 'Chuyển tiền'; }
  db.thuChi.push(e);
  ghiTC(db, e);
  return e;
}

export function suaKhoan(db, e, thayDoi) { Object.assign(e, thayDoi); ghiTC(db, e); }

// Văn phòng kiểm khoản giám sát ghi. Đã kiểm thì giám sát không sửa, xoá được nữa.
export function duyetKhoan(db, e) { e.duyet = new Date().toISOString().slice(0, 10); ghiTC(db, e); }
export const choKiem = (db) => soConLai(db).filter((e) => !e.duyet && !VAN_PHONG.includes(e.nguoi));

// Xoá mềm: giữ dòng trong Sheets để còn dấu vết.
export function xoaKhoan(db, e, nguoi, lyDo = '') {
  e.xoa = new Date().toISOString().slice(0, 10);
  ghiTC(db, e);
  // Nhật ký tiền chỉ văn phòng ghi được (máy chủ chặn giám sát ghi nhật ký mã TC-).
  if (!VAN_PHONG.includes(nguoi)) return;
  nhatKy(db, e.id, nguoi, `Xoá khoản ${e.loai === 'THU' ? 'thu' : 'chi'} ${e.ma} ${e.hangMuc} ${e.soTien.toLocaleString('vi-VN')} đ ngày ${e.ngay}${lyDo ? '. Lý do: ' + lyDo : ''}`);
}

// ---------- Đợt trả thầu ----------
export const dsTraThau = (db, maCt, loai) => (db.traThau || []).filter((t) => !t.xoa && (!maCt || t.maCongTrinh === maCt) && (!loai || loaiNo(t) === loai));
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
    klXacNhan: null, ghiChu: du.ghiChu || '', xoa: '', taoLuc: new Date().toISOString(), loaiNo: du.loaiNo === 'NCC' ? 'NCC' : '',
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
  if (loaiNo(t) === 'NCC') {
    // Nhà cung cấp: không cần nghiệm thu, đến hạn theo ngày hẹn trả (không hẹn ngày thì coi như đến hạn).
    const tt = con <= 0 && t.soTien > 0 ? 'DU' : t.hanTra && t.hanTra < homNay ? 'QUA_HAN' : !t.hanTra || t.hanTra <= addDays(homNay, SAP_HAN) ? 'DEN_HAN' : 'CHUA_DEN';
    return { tra, con, tt };
  }
  const tt = con <= 0 && t.soTien > 0 ? 'DU' : t.klXacNhan ? 'DEN_HAN' : t.hanTra && t.hanTra < homNay ? 'QUA' : 'CHUA';
  return { tra, con, tt };
}

// Đợt cần giám sát xác nhận: việc mốc đã xong, hoặc tới hạn trả (trong 3 ngày), mà chưa xác nhận.
export function canXacNhanKL(db, homNay) {
  const sap = addDays(homNay, 3);
  return dsTraThau(db, '', 'THAU').filter((t) => {
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

/** Công nợ phải trả (mặc định thầu phụ; 'NCC' = nhà cung cấp): đến hạn trả và tổng còn phải trả. */
export function congNoThau(db, homNay, loai = 'THAU') {
  let denHan = 0, conPhaiTra = 0;
  const ds = [];
  for (const t of dsTraThau(db, '', loai)) {
    const r = trangThaiTra(db, t, homNay);
    if (r.con > 0) conPhaiTra += r.con;
    if ((r.tt === 'DEN_HAN' || r.tt === 'QUA_HAN') && r.con > 0) { denHan += r.con; ds.push({ t, ...r }); }
  }
  return { denHan, conPhaiTra, ds };
}

/**
 * Lãi gộp 1 công trình (giống tab Dự án của Sổ cái):
 * doanh thu = phải thu các HĐ không dừng (đã trừ khấu trừ phí TK, gồm phụ lục) + thu ngoài HĐ;
 * chi dự kiến = tổng "chi dự kiến" ghi ở các HĐ; chi thực tế = sổ chi của công trình.
 */
export function laiGop(db, maCt, laiToiThieu = LAI_GOP_MAC_DINH, nguongPS = NGUONG_MAC_DINH) {
  const hds = hdCuaCongTrinh(db, maCt).filter((h) => h.trangThai !== 'DUNG');
  const so = soConLai(db).filter((e) => e.ma === maCt);
  const ps = tongPS(db, maCt);
  // Thu ngoài HĐ: tiền thu phát sinh đã nằm trong giá bán phát sinh, không cộng hai lần.
  const thuNgoai = so.filter((e) => e.loai === 'THU').reduce((s, e) => s + e.soTien, 0);
  const thuPS = so.filter((e) => e.loai === 'THU' && ps.ds.some((p) => p.id === e.thamChieu)).reduce((s, e) => s + e.soTien, 0);
  const doanhThu = hds.reduce((s, h) => s + tinhDot(h).phaiThu, 0) + ps.giaBan + thuNgoai - thuPS;
  const daThu = thuHD(db, '', '', maCt) + thuNgoai;
  const chi = so.filter((e) => e.loai === 'CHI').reduce((s, e) => s + e.soTien, 0);
  const chiHD = hds.reduce((s, h) => s + (Number(h.chiDuKien) || 0), 0);
  const chiDuKien = chiHD ? chiHD + ps.chiGoc : 0;
  const camKetThau = dsTraThau(db, maCt).reduce((s, t) => s + (Number(t.soTien) || 0), 0);
  const laiDuKien = chiDuKien ? doanhThu - chiDuKien : null;
  const pctDuKien = laiDuKien !== null && doanhThu ? Math.round((laiDuKien / doanhThu) * 1000) / 10 : null;
  const canhBao = [];
  if (chiDuKien && chi > chiDuKien) canhBao.push('Vượt chi dự kiến');
  if (chiDuKien && camKetThau > chiDuKien) canhBao.push('Đợt trả thầu vượt chi dự kiến');
  if (pctDuKien !== null && laiToiThieu && pctDuKien < laiToiThieu) canhBao.push(`Lãi gộp dự kiến dưới ${laiToiThieu}%`);
  if (ps.pct !== null && nguongPS && ps.pct > nguongPS) canhBao.push(`Phát sinh ${String(ps.pct).replace('.', ',')}% HĐ thi công, vượt ngưỡng ${nguongPS}%`);
  return { doanhThu, daThu, chi, chiDuKien, camKetThau, laiDuKien, pctDuKien, laiThucTe: daThu - chi, canhBao, phatSinh: ps };
}

// Gợi ý đối tượng khi gõ: nhà thầu trong kế hoạch, đợt trả thầu, và người đã ghi trước đó.
export const dsDoiTuong = (db) => [...new Set([
  ...(db.congTrinh || []).flatMap((c) => c.viec.map((v) => v.nhaThau)),
  ...(db.traThau || []).map((t) => t.thau),
  ...(db.nhaThau || []).map((t) => t.ten),
  ...(db.thuChi || []).map((e) => e.doiTuong),
].filter(Boolean))].sort();

// ---------- Tài khoản, số dư ----------
const ghiQuy = (db, q) => { q.capNhatLuc = new Date().toISOString(); day(db, { loai: 'QUY', q }); };
export const dsTaiKhoan = (db, caDaDong = false) => (db.taiKhoan || []).filter((q) => caDaDong || q.hoatDong !== false);
// Giám sát chỉ chọn được tài khoản văn phòng cho phép (vd tiền mặt tạm ứng anh em giữ).
export const tkChoGiamSat = (db) => dsTaiKhoan(db).filter((q) => q.choGiamSat);

export function themTaiKhoan(db, du) {
  db.taiKhoan = db.taiKhoan || [];
  const q = {
    id: 'QUY-' + taoMa(), ten: String(du.ten || '').trim(), loai: du.loai === 'TIEN_MAT' ? 'TIEN_MAT' : 'CONG_TY', nguoiGiu: du.nguoiGiu || '',
    soDuDau: Number(du.soDuDau) || 0, ngayDau: du.ngayDau || '', ghiChu: du.ghiChu || '', choGiamSat: !!du.choGiamSat, hoatDong: true, taoLuc: new Date().toISOString(),
  };
  db.taiKhoan.push(q);
  ghiQuy(db, q);
  return q;
}

export function suaTaiKhoan(db, q, thayDoi) { Object.assign(q, thayDoi); ghiQuy(db, q); }

// Mọi lần tiền vào/ra từng tài khoản: sổ thu chi, chuyển tiền giữa tài khoản, và tiền khách trả theo hợp đồng.
export function bienDong(db) {
  const ds = [];
  for (const e of soConLai(db)) {
    const st = Number(e.soTien) || 0;
    if (e.loai === 'THU') ds.push({ ngay: e.ngay, tk: e.taiKhoan || '', so: st, e });
    else if (e.loai === 'CHI') ds.push({ ngay: e.ngay, tk: e.taiKhoan || '', so: -st, e });
    else if (e.loai === 'CHUYEN') { ds.push({ ngay: e.ngay, tk: e.taiKhoan || '', so: -st, e }); ds.push({ ngay: e.ngay, tk: e.toiTK || '', so: st, e }); }
  }
  for (const hd of db.hopDong || []) for (const d of hd.dot || []) for (const t of d.thu || []) {
    ds.push({ ngay: t.ngay, tk: t.taiKhoan || '', so: Number(t.soTien) || 0, hd, thu: t });
  }
  return ds;
}

/**
 * Số dư từng tài khoản = số dư đầu (tại ngày bắt đầu theo dõi) + biến động từ ngày đó.
 * Khoản chưa gắn tài khoản gom riêng để Thầy gắn lại, không cộng vào số dư nào.
 */
export function soDu(db, denNgay = '') {
  const tks = dsTaiKhoan(db, true);
  const theo = new Map(tks.map((q) => [q.id, { q, soDu: Number(q.soDuDau) || 0, vao: 0, ra: 0 }]));
  let chuaGan = 0, soChuaGan = 0;
  for (const b of bienDong(db)) {
    if (denNgay && b.ngay > denNgay) continue;
    const r = theo.get(b.tk);
    if (!r) { if (b.e && b.e.loai === 'CHUYEN') continue; chuaGan += b.so; soChuaGan++; continue; }
    if (r.q.ngayDau && b.ngay < r.q.ngayDau) continue; // trước ngày chốt số dư đầu: đã nằm trong số dư đầu
    r.soDu += b.so;
    if (b.so > 0) r.vao += b.so; else r.ra -= b.so;
  }
  const ds = [...theo.values()];
  const conDung = ds.filter((r) => r.q.hoatDong !== false || r.soDu !== 0);
  const tong = (loai) => conDung.filter((r) => !loai || r.q.loai === loai).reduce((s, r) => s + r.soDu, 0);
  return { ds: conDung, congTy: tong('CONG_TY'), tienMat: tong('TIEN_MAT'), tong: tong(), chuaGan, soChuaGan };
}

// ---------- Công nợ phải thu khách ----------
/**
 * Mỗi đợt còn tiền chưa thu của HĐ đang thực hiện, kèm ngày đến hạn:
 * hạn ghi ở đợt; không có thì đợt 1 = ngày ký; đợt gắn mốc = ngày xong mốc (thực tế, hoặc dự báo theo kế hoạch).
 * tt: QUA_HAN (quá ngày đến hạn), DEN_HAN (đến hạn trong 3 ngày, xong mốc hôm nay, khách trả một phần), CHUA (chưa tới).
 */
export function congNoKhach(db, homNay) {
  const ds = [];
  for (const hd of db.hopDong || []) {
    if (hd.trangThai !== 'HIEU_LUC') continue;
    const ct = (db.congTrinh || []).find((c) => c.ma === hd.maCongTrinh);
    let lich = null;
    tinhDot(hd).dot.forEach((d, i) => {
      if (d.dong || d.conLai <= 0) return;
      const v = d.moc && ct ? ct.viec.find((x) => x.id === d.moc) : null;
      let ngayDen = '', duKien = false;
      if (d.han) ngayDen = d.han;
      else if (v && v.phanTram >= 100) ngayDen = (v.thucTe && v.thucTe.ketThuc) || homNay;
      else if (v) { lich = lich || lichHienTai(ct, homNay); ngayDen = (lich.get(v.id) || {}).ketThuc || ''; duKien = true; }
      else if (i === 0) ngayDen = hd.ngayKy || '';
      const quaHan = !duKien && ngayDen && ngayDen < homNay;
      const tt = quaHan ? 'QUA_HAN'
        : (!duKien && ngayDen && ngayDen <= addDays(homNay, SAP_HAN)) || d.daThu > 0 ? 'DEN_HAN' : 'CHUA';
      ds.push({ hd, d, ngayDen, duKien, tt, soNgayQua: quaHan ? diffDays(ngayDen, homNay) : 0, con: d.conLai });
    });
  }
  const tong = (tt) => ds.filter((x) => !tt || x.tt === tt).reduce((s, x) => s + x.con, 0);
  const thuTu = { QUA_HAN: 0, DEN_HAN: 1, CHUA: 2 };
  ds.sort((a, b) => thuTu[a.tt] - thuTu[b.tt] || b.soNgayQua - a.soNgayQua || String(a.ngayDen || '9').localeCompare(String(b.ngayDen || '9')));
  return { ds, quaHan: tong('QUA_HAN'), denHan: tong('DEN_HAN'), chuaDen: tong('CHUA'), tong: tong() };
}

/** Gộp phải trả theo từng thầu / nhà cung cấp, để đối chiếu công nợ. */
export function noTheoDoiTuong(db, homNay, loai) {
  const m = new Map();
  for (const t of dsTraThau(db, '', loai)) {
    const r = trangThaiTra(db, t, homNay);
    const k = t.thau || '(chưa ghi tên)';
    const x = m.get(k) || { ten: k, tong: 0, tra: 0, con: 0, denHan: 0, quaHan: 0, ds: [] };
    x.tong += Number(t.soTien) || 0; x.tra += r.tra; x.con += Math.max(0, r.con);
    if (r.con > 0 && (r.tt === 'DEN_HAN' || r.tt === 'QUA_HAN')) x.denHan += r.con;
    if (r.con > 0 && (r.tt === 'QUA_HAN' || (r.tt === 'DEN_HAN' && t.hanTra && t.hanTra < homNay))) x.quaHan += r.con;
    x.ds.push({ t, ...r });
    m.set(k, x);
  }
  return [...m.values()].filter((x) => x.con > 0).sort((a, b) => b.denHan - a.denHan || b.con - a.con);
}

// ---------- Dự báo dòng tiền ----------
const thuHai = (s) => addDays(s, -((new Date(s + 'T00:00:00Z').getUTCDay() + 6) % 7));

/** Chi chung công ty trung bình mỗi tuần, tính từ 3 tháng trọn gần nhất. */
export function chiCtyTuan(db, homNay) {
  const dauThang = homNay.slice(0, 7) + '-01';
  const tu = addDays(dauThang, -1).slice(0, 7);
  const thang = [tu];
  for (let i = 0; i < 2; i++) thang.push(addDays(thang[i] + '-01', -1).slice(0, 7));
  const tong = soConLai(db).filter((e) => e.loai === 'CHI' && e.ma === CTY && thang.includes(String(e.ngay).slice(0, 7))).reduce((s, e) => s + e.soTien, 0);
  const tuDau = thang[2] + '-01';
  return Math.round((tong / diffDays(tuDau, dauThang)) * 7);
}

/**
 * Dự báo theo tuần (thứ Hai → Chủ nhật), bắt đầu từ số dư hiện tại các tài khoản.
 * Vào: đợt thu khách còn nợ, theo ngày đến hạn (quá hạn tính vào tuần này).
 * Ra: đợt trả thầu, nợ nhà cung cấp còn phải trả, theo hạn trả hoặc ngày xong việc mốc; cộng chi công ty ước tính.
 * Khoản chưa có ngày nào: để riêng, không đưa vào tuần nào.
 */
export function dongTien(db, homNay, { soTuan = 8, tinhChiCty = true } = {}) {
  const dau = thuHai(homNay);
  const tuan = Array.from({ length: soTuan }, (_, i) => ({ tu: addDays(dau, i * 7), den: addDays(dau, i * 7 + 6), vao: 0, ra: 0, chiCty: 0, dsVao: [], dsRa: [] }));
  const cuoi = tuan[tuan.length - 1].den;
  const oTuan = (ngay) => tuan.find((w) => (ngay < homNay ? homNay : ngay) <= w.den);
  const khongNgayVao = [], khongNgayRa = [];
  for (const x of congNoKhach(db, homNay).ds) {
    if (!x.ngayDen) { khongNgayVao.push(x); continue; }
    if (x.ngayDen > cuoi) continue;
    const w = oTuan(x.ngayDen); w.vao += x.con; w.dsVao.push(x);
  }
  const lichCt = new Map();
  for (const t of dsTraThau(db)) {
    const r = trangThaiTra(db, t, homNay);
    if (r.con <= 0) continue;
    let ngay = t.hanTra;
    if (!ngay && t.viecMoc) {
      const ct = (db.congTrinh || []).find((c) => c.ma === t.maCongTrinh);
      const v = ct && ct.viec.find((x) => x.id === t.viecMoc);
      if (v && v.phanTram >= 100) ngay = homNay;
      else if (v) { if (!lichCt.has(ct.ma)) lichCt.set(ct.ma, lichHienTai(ct, homNay)); ngay = (lichCt.get(ct.ma).get(v.id) || {}).ketThuc || ''; }
    }
    const x = { t, ...r, ngay };
    if (!ngay) { khongNgayRa.push(x); continue; }
    if (ngay > cuoi) continue;
    const w = oTuan(ngay); w.ra += r.con; w.dsRa.push(x);
  }
  const cty = tinhChiCty ? chiCtyTuan(db, homNay) : 0;
  const sd = soDu(db);
  let conLai = sd.tong;
  for (const w of tuan) {
    w.chiCty = cty;
    conLai += w.vao - w.ra - w.chiCty;
    w.cuoi = conLai;
  }
  return { soDuDau: sd.tong, coTaiKhoan: sd.ds.length > 0, tuan, khongNgayVao, khongNgayRa, chiCtyTuan: cty, tuanAm: tuan.find((w) => w.cuoi < 0) || null };
}
