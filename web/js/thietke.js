// Tiến độ thiết kế (bước D): vòng gửi phương án → khách duyệt hoặc yêu cầu sửa, đếm lần sửa, phí sửa thêm,
// và các buổi giám sát tác giả (GSTG).
import { addDays, diffDays } from './schedule.js';
import { day, taoMa, lichHienTai } from './store.js';
import { themPhuLuc, phiSua, SO_LAN_SUA } from './hopdong.js';

export const HANG_MUC_TK = ['Mặt bằng công năng', 'Phương án 3D', 'Hồ sơ kỹ thuật', 'Dự toán', 'Khác'];
// Gửi khách quá 3 ngày chưa phản hồi thì nhắc (Thầy chốt 12/11).
export const CHO_KHACH = 3;
export const TT_PA = { CHO: 'Chờ khách duyệt', SUA: 'Khách yêu cầu sửa', DUYET: 'Khách đã duyệt' };
export const QUA = { LINK: 'bấm Đồng ý trên link', ZALO: 'qua Zalo', GAP: 'gặp trực tiếp' };

function ghiPA(db, pa) {
  pa.capNhatLuc = new Date().toISOString();
  day(db, { loai: 'PA', pa });
}

function nhatKy(db, ct, nguoi, ghiChu, them = {}) {
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: ct.ma, viec: them.viec || '', tenViec: them.tenViec || 'Thiết kế', nguoi, loai: 'TK_PA', ghiChu, congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

export const paCuaCongTrinh = (db, maCt) => (db.phuongAn || []).filter((p) => p.maCongTrinh === maCt).sort((a, b) => (a.ngayGui + a.lan).localeCompare(b.ngayGui + b.lan));

// HĐ đang áp số lần sửa cho công trình: HĐ thiết kế hoặc trọn gói đang thực hiện.
export const hdThietKe = (db, maCt) => (db.hopDong || []).find((h) => h.maCongTrinh === maCt && (h.dang === 'TK' || h.dang === 'TG') && h.trangThai !== 'DUNG') || null;
export const soLanSuaChoPhep = (db, maCt) => { const hd = hdThietKe(db, maCt); return hd ? Number(hd.soLanSua) : SO_LAN_SUA; };

// Gửi phương án cho khách. Lần 0 = phương án đầu; mỗi lần gửi lại cùng hạng mục là 1 lần sửa.
export function guiPhuongAn(db, ct, { hangMuc, viec, link, ghiChu }, nguoi, homNay) {
  db.phuongAn = db.phuongAn || [];
  const lan = db.phuongAn.filter((p) => p.maCongTrinh === ct.ma && p.hangMuc === hangMuc).length;
  const pa = { id: 'PA-' + taoMa(), maCongTrinh: ct.ma, hangMuc, lan, viec: viec || '', ngayGui: homNay, link: link || '', ghiChu: ghiChu || '',
    trangThai: 'CHO', ngayPhanHoi: '', yKien: '', duyetQua: '', duyetLuc: '', phi: '', nguoiGui: nguoi };
  db.phuongAn.push(pa);
  ghiPA(db, pa);
  nhatKy(db, ct, nguoi, `Gửi khách ${hangMuc} ${tenLan(lan)}`, { viec: pa.viec });
  return pa;
}

export const tenLan = (lan) => (lan ? `sửa lần ${lan}` : 'phương án đầu');
export const soNgayCho = (pa, homNay) => diffDays(pa.ngayGui, pa.ngayPhanHoi || homNay);

// Khách sửa vượt số lần trong HĐ: lần sửa tiếp theo cần Thầy chọn thu phí hay không.
export const vuotSoLan = (db, pa) => pa.trangThai === 'SUA' && pa.lan + 1 > soLanSuaChoPhep(db, pa.maCongTrinh);

// Ghi phản hồi của khách. Trả về số ngày chờ để màn hình gợi ý lùi lịch (nguyên nhân Chủ nhà).
export function phanHoi(db, ct, pa, { ketQua, yKien, qua, ngay }, nguoi) {
  pa.trangThai = ketQua;
  pa.ngayPhanHoi = ngay;
  pa.yKien = yKien || '';
  pa.duyetQua = qua || 'ZALO';
  pa.duyetLuc = new Date().toISOString();
  ghiPA(db, pa);
  nhatKy(db, ct, nguoi, `${pa.hangMuc} ${tenLan(pa.lan)}: ${TT_PA[ketQua]} (${QUA[pa.duyetQua] || pa.duyetQua})${yKien ? ': ' + yKien : ''}`, { viec: pa.viec });
  return soNgayCho(pa, ngay);
}

export function quyetPhi(db, ct, pa, thu, nguoi, homNay) {
  pa.phi = thu ? 'THU' : 'KHONG';
  ghiPA(db, pa);
  const hd = hdThietKe(db, ct.ma);
  if (thu && hd) themPhuLuc(db, hd, { ngay: homNay, noiDung: `Phí sửa ${pa.hangMuc} lần ${pa.lan + 1} (5%)`, giaTri: phiSua(hd), loai: 'PHI_SUA' }, nguoi);
  nhatKy(db, ct, nguoi, `Sửa ${pa.hangMuc} lần ${pa.lan + 1} vượt HĐ: ${thu ? 'thu phí 5%' : 'không thu phí'}`);
}

// ---------- Giám sát tác giả ----------
const ghiGS = (db, gs) => { gs.capNhatLuc = new Date().toISOString(); day(db, { loai: 'GSTG', gs }); };
export const gsCuaCongTrinh = (db, maCt) => (db.gstg || []).filter((g) => g.maCongTrinh === maCt).sort((a, b) => a.lan - b.lan);

// Ngày buổi GSTG: ngày đặt tay, không thì ngày xong của việc có mốc GSTG trong kế hoạch.
export function ngayGS(ct, gs) {
  if (gs.ngay) return gs.ngay;
  if (ct && gs.viec) { const t = lichHienTai(ct).get(gs.viec); if (t) return t.ketThuc; }
  return '';
}

// Tạo danh sách buổi từ các mốc "GSTG" trong kế hoạch; thiếu so với HĐ thì thêm buổi trống để đặt ngày.
export function taoBuoiGSTG(db, ct, soBuoi) {
  db.gstg = db.gstg || [];
  const daCo = gsCuaCongTrinh(db, ct.ma);
  if (daCo.length) return daCo;
  const moc = ct.viec.filter((v) => /^GSTG/i.test(v.moc || ''));
  // HĐ ghi số buổi thì theo HĐ (lấy các mốc đầu tiên); HĐ chưa ghi thì theo số mốc trong kế hoạch.
  const n = Number(soBuoi) || moc.length;
  for (let i = 0; i < n; i++) {
    const v = moc[i];
    const gs = { id: 'GS-' + taoMa(), maCongTrinh: ct.ma, lan: i + 1, ten: v ? v.moc.replace(/^GSTG\s*\d*:?\s*/i, '') : '', viec: v ? v.id : '', ngay: '', xong: '', ghiChu: '', nhacGiamSat: true };
    db.gstg.push(gs); ghiGS(db, gs);
  }
  return gsCuaCongTrinh(db, ct.ma);
}

export function themBuoiGSTG(db, ct, { ten, ngay, nhacGiamSat = true }) {
  db.gstg = db.gstg || [];
  const gs = { id: 'GS-' + taoMa(), maCongTrinh: ct.ma, lan: gsCuaCongTrinh(db, ct.ma).length + 1, ten: ten || '', viec: '', ngay: ngay || '', xong: '', ghiChu: '', nhacGiamSat };
  db.gstg.push(gs); ghiGS(db, gs);
  return gs;
}

export function suaBuoiGSTG(db, gs, thayDoi) { Object.assign(gs, thayDoi); ghiGS(db, gs); }

export function xongBuoiGSTG(db, ct, gs, { ngay, ghiChu }, nguoi) {
  gs.xong = ngay; gs.ghiChu = ghiChu || '';
  ghiGS(db, gs);
  nhatKy(db, ct, nguoi, `Giám sát tác giả buổi ${gs.lan}${gs.ten ? ' (' + gs.ten + ')' : ''}${ghiChu ? ': ' + ghiChu : ''}`);
}

/**
 * Việc thiết kế hôm nay.
 * - choLau: gửi khách quá 3 ngày chưa phản hồi → nhắc khách.
 * - canSua: khách yêu cầu sửa, chưa gửi lại bản mới.
 * - quyetPhi: sửa vượt số lần HĐ, Thầy chưa chọn thu hay không.
 * - gstg: buổi GSTG trong 3 ngày tới chưa làm (giám sát cũng thấy nếu bật nhắc).
 */
export function viecThietKeHomNay(db, homNay, chiGSTG = false) {
  const sap = addDays(homNay, 3);
  const gstg = [];
  for (const gs of db.gstg || []) {
    if (gs.xong || (chiGSTG && !gs.nhacGiamSat)) continue;
    const ct = (db.congTrinh || []).find((c) => c.ma === gs.maCongTrinh);
    if (!ct) continue;
    const ngay = ngayGS(ct, gs);
    if (ngay && ngay <= sap) gstg.push({ ct, gs, ngay });
  }
  gstg.sort((a, b) => a.ngay.localeCompare(b.ngay));
  if (chiGSTG) return { choLau: [], canSua: [], quyetPhi: [], gstg };
  const ds = db.phuongAn || [];
  const choLau = ds.filter((p) => p.trangThai === 'CHO' && soNgayCho(p, homNay) >= CHO_KHACH);
  const canSua = ds.filter((p) => p.trangThai === 'SUA' && !ds.some((q) => q.maCongTrinh === p.maCongTrinh && q.hangMuc === p.hangMuc && q.lan > p.lan));
  const quyetPhi = ds.filter((p) => vuotSoLan(db, p) && !p.phi);
  return { choLau, canSua, quyetPhi, gstg };
}
