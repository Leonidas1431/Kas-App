// Báo cáo công trường (Thầy chốt 17/11/2026):
// - Phiếu ngày: thầu/tổ đội nào làm, hoàn thành gì (bấm % thẳng vào kế hoạch), thiếu/phát sinh gì,
//   việc nào ảnh hưởng hạng mục khác, ngày mai có đổi so với kế hoạch không; tối thiểu 6 ảnh.
//   Giám sát làm chính, vắng thì người khác làm thay. Nộp rồi vẫn sửa được trong ngày.
// - Nhắc: chỉ báo đỏ trong app lúc 16h, 17h, 17h30. Không email.
// - Thầu "công nhật": chấm số công mỗi ngày làm theo lịch, quên thì nhắc.
// - Báo chậm từ văn phòng = đề xuất, giám sát xác nhận mới lùi.
// - Tổng hợp tuần cho chủ nhà: gom trưa thứ 7, Thầy duyệt rồi mới hiện trên link chủ nhà.
import { addDays, diffDays, sucLam, ngayLamTiepTheo, toDate } from './schedule.js';
import { day, taoMa, lichHienTai, viecHomNay, baoCham, tongHop } from './store.js';

export const ANH_TOI_THIEU = 6;
export const ANH_TUAN_TOI_DA = 9;
// Mốc nhắc trong ngày (giờ, phút). Lần 3 = gấp.
export const MOC_NHAC = [[16, 0], [17, 0], [17, 30]];
export const MOC_TUAN = { thu: 6, gio: 12 }; // trưa thứ 7

const bayGio = () => new Date().toISOString();
const ten = (x) => String(x || '').trim().toLowerCase();

// ---------- Phiếu ngày ----------
export const idBaoCao = (ma, ngay) => `BC-${ma}-${ngay}`;
export const bcCua = (db, ma, ngay) => (db.baoCao || []).find((b) => b.maCongTrinh === ma && b.ngay === ngay && !b.xoa);
export const daNop = (b) => !!(b && b.nopLuc);
export const bcCuaCongTrinh = (db, ma) => (db.baoCao || []).filter((b) => b.maCongTrinh === ma && !b.xoa && b.nopLuc).sort((a, b) => b.ngay.localeCompare(a.ngay));

const ghiBC = (db, b) => { b.capNhatLuc = bayGio(); day(db, { loai: 'BC', b }); };

function layHoacTao(db, ct, ngay, nguoi) {
  db.baoCao = db.baoCao || [];
  let b = bcCua(db, ct.ma, ngay);
  if (!b) {
    b = { id: idBaoCao(ct.ma, ngay), maCongTrinh: ct.ma, ngay, nguoi, thauLam: [], thieu: '', anhHuong: '', viecAnhHuong: [], ngayMai: '', doiKeHoach: '', soAnh: 0, nopLuc: '', xoa: '' };
    db.baoCao.push(b);
  }
  return b;
}

/** Thầu dự kiến có mặt hôm nay: thầu của việc đang làm, đang trễ, hoặc bắt đầu hôm nay. */
export function thauDuKien(ct, ngay) {
  const nhom = new Map();
  for (const { v, t, nhan } of viecHomNay(ct, ngay)) {
    if (!(nhan === 'DANG' || nhan === 'TRE' || (nhan === 'SAP' && t.batDau === ngay))) continue;
    const tt = String(v.nhaThau || '').trim();
    if (!tt) continue;
    if (!nhom.has(ten(tt))) nhom.set(ten(tt), { ten: tt, viec: [] });
    nhom.get(ten(tt)).viec.push(v);
  }
  return [...nhom.values()];
}

/** Việc chưa xong của 1 thầu ở công trình (để bấm % trong phiếu). */
export const viecConCuaThau = (ct, tenThau) => ct.viec.filter((v) => ten(v.nhaThau) === ten(tenThau) && v.phanTram < 100);

/** Ngày làm việc kế tiếp của công trình và các việc theo kế hoạch hiện tại rơi vào ngày đó. */
export function viecNgayMai(ct, ngay) {
  const mai = ngayLamTiepTheo(addDays(ngay, 1), ct.lich);
  const lich = lichHienTai(ct, ngay);
  return { mai, viec: ct.viec.filter((v) => v.phanTram < 100 && lich.get(v.id).batDau <= mai && lich.get(v.id).ketThuc >= mai) };
}

/**
 * Lưu phiếu ngày. du: { thau: [{ ten, lam, cong }], thieu, anhHuong, viecAnhHuong, ngayMai, doiKeHoach, soAnh }
 * nop = true: bấm Nộp (giữ giờ nộp lần đầu). Chấm công lưu trước cũng nằm trong phiếu này.
 */
export function luuBaoCao(db, ct, ngay, du, nguoi, nop = true) {
  const b = layHoacTao(db, ct, ngay, nguoi);
  const congCu = new Map((b.thauLam || []).map((x) => [ten(x.ten), x.cong]));
  Object.assign(b, {
    thauLam: (du.thau || []).filter((x) => String(x.ten || '').trim()).map((x) => ({ ten: String(x.ten).trim(), lam: String(x.lam || '').trim(),
      cong: x.cong === '' || x.cong == null ? (congCu.get(ten(x.ten)) ?? null) : Number(x.cong) })),
    thieu: String(du.thieu || '').trim(),
    anhHuong: String(du.anhHuong || '').trim(),
    viecAnhHuong: [...new Set(du.viecAnhHuong || [])],
    ngayMai: String(du.ngayMai || '').trim(),
    doiKeHoach: du.doiKeHoach === 'CO' ? 'CO' : 'KHONG',
    soAnh: Number(du.soAnh) || 0,
  });
  if (!b.nguoi) b.nguoi = nguoi;
  if (nop && !b.nopLuc) b.nopLuc = bayGio();
  ghiBC(db, b);
  return b;
}

/** Thiếu gì để nộp được: chưa đủ ảnh, chưa chọn thầu/ghi gì. Trả danh sách lỗi (rỗng = nộp được). */
export function kiemTraNop(du, soAnh) {
  const loi = [];
  if (soAnh < ANH_TOI_THIEU) loi.push(`Cần ít nhất ${ANH_TOI_THIEU} ảnh (mới có ${soAnh})`);
  if (!(du.thau || []).length && !String(du.thieu || '').trim() && !String(du.anhHuong || '').trim()) loi.push('Chưa chọn thầu nào làm hôm nay, cũng chưa ghi gì');
  if (du.doiKeHoach === 'CO' && !String(du.ngayMai || '').trim()) loi.push('Ngày mai có đổi kế hoạch: ghi đổi gì');
  return loi;
}

/** Nhắc nộp phiếu: lan = 0 (chưa tới 16h) … 3 (sau 17h30, gấp). ds = công trình cần phiếu mà chưa nộp. */
export function nhacBaoCao(dsCanBC, db, ngay, gio, phut) {
  const ph = gio * 60 + phut;
  const lan = MOC_NHAC.filter(([g, p]) => ph >= g * 60 + p).length;
  return { lan, ds: dsCanBC.filter((ct) => !daNop(bcCua(db, ct.ma, ngay))) };
}

/** Tin gửi nhóm Zalo nội bộ. lsHomNay: các lần báo chậm/đề xuất trong ngày (gộp thông báo điều chỉnh). */
export function tinZaloBC(ct, b, lsHomNay = []) {
  const dd = (s) => `${s.slice(8, 10)}/${s.slice(5, 7)}`;
  const dong = [`📋 [${ct.ma}] Báo cáo ${dd(b.ngay)} · ${ct.ten}`];
  if ((b.thauLam || []).length) {
    dong.push('', 'Thầu/tổ đội làm hôm nay:');
    b.thauLam.forEach((x) => dong.push(`• ${x.ten}${x.cong != null && x.cong !== '' ? ` (${x.cong} công)` : ''}${x.lam ? ': ' + x.lam : ''}`));
  }
  const tienDo = lsHomNay.filter((e) => e.loai === 'TIEN_DO');
  if (tienDo.length) {
    dong.push('', 'Tiến độ cập nhật:');
    const cuoi = new Map();
    tienDo.forEach((e) => { const c = cuoi.get(e.viec); cuoi.set(e.viec, { ten: e.tenViec, cu: c ? c.cu : e.cu, moi: e.moi }); });
    cuoi.forEach((x) => dong.push(`• ${x.ten}: ${x.cu}% → ${x.moi === 100 ? 'xong' : x.moi + '%'}`));
  }
  if (b.thieu) dong.push('', 'Thiếu / phát sinh: ' + b.thieu);
  if (b.anhHuong) dong.push('', 'Ảnh hưởng hạng mục khác: ' + b.anhHuong);
  const cham = lsHomNay.filter((e) => e.loai === 'CHAM' || e.loai === 'DE_XUAT_CHAM');
  if (cham.length) {
    dong.push('', 'Điều chỉnh kế hoạch:');
    cham.forEach((e) => dong.push(`• ${e.tenViec}: ${e.loai === 'CHAM' ? `lùi ${e.moi - e.cu} ngày` : `đề xuất lùi ${e.cu} ngày, chờ giám sát xác nhận`} (${e.nguyenNhan})`));
  }
  dong.push('', 'Ngày mai: ' + (b.doiKeHoach === 'CO' ? 'CÓ thay đổi. ' + b.ngayMai : 'theo kế hoạch' + (b.ngayMai ? '. ' + b.ngayMai : '')));
  dong.push(`Ảnh: ${b.soAnh} ảnh trong thư mục Drive công trình.`);
  return dong.join('\n');
}

// ---------- Thầu công nhật: chấm công ----------
export const laCongNhat = (db, tenThau) => (db.nhaThau || []).some((t) => ten(t.ten) === ten(tenThau) && t.congNhat === true && t.hoatDong !== false);

/** Công đã chấm của 1 thầu ở 1 công trình 1 ngày (null = chưa chấm). */
export function congDaCham(db, ma, ngay, tenThau) {
  const b = bcCua(db, ma, ngay);
  const x = b && (b.thauLam || []).find((t) => ten(t.ten) === ten(tenThau));
  return x && x.cong != null && x.cong !== '' ? Number(x.cong) : null;
}

/** Cần chấm công hôm nay: thầu công nhật có việc chạy theo lịch ở công trình đang thi công. */
export function canChamCong(db, dsCongTrinh, ngay) {
  const kq = [];
  for (const ct of dsCongTrinh) {
    if (sucLam(ngay, ct.lich) === 0) continue;
    for (const t of thauDuKien(ct, ngay)) {
      if (!laCongNhat(db, t.ten)) continue;
      kq.push({ ct, ten: t.ten, cong: congDaCham(db, ct.ma, ngay, t.ten) });
    }
  }
  return kq;
}

/** Chấm công 1 thầu (ghi vào phiếu ngày, chưa tính là nộp phiếu). cong = 0 nghĩa là hôm nay không đến. */
export function chamCong(db, ct, ngay, tenThau, cong, nguoi) {
  const b = layHoacTao(db, ct, ngay, nguoi);
  b.thauLam = b.thauLam || [];
  let x = b.thauLam.find((t) => ten(t.ten) === ten(tenThau));
  if (!x) { x = { ten: String(tenThau).trim(), lam: '', cong: null }; b.thauLam.push(x); }
  x.cong = Number(cong) || 0;
  ghiBC(db, b);
  return b;
}

/** Bảng công của 1 thầu: [{ ma, ngay, cong }] trong khoảng ngày, kèm tổng. */
export function bangCong(db, tenThau, tu = '', den = '9999') {
  const dong = [];
  for (const b of db.baoCao || []) {
    if (b.xoa || b.ngay < tu || b.ngay > den) continue;
    const x = (b.thauLam || []).find((t) => ten(t.ten) === ten(tenThau));
    if (x && x.cong != null && x.cong !== '') dong.push({ ma: b.maCongTrinh, ngay: b.ngay, cong: Number(x.cong) || 0 });
  }
  dong.sort((a, b) => a.ngay.localeCompare(b.ngay) || a.ma.localeCompare(b.ma));
  return { dong, tong: Math.round(dong.reduce((s, x) => s + x.cong, 0) * 10) / 10 };
}

// ---------- Báo chậm: chọn cách lùi, văn phòng đề xuất ----------
export const CACH_LUI = { TU_DONG: 'Lùi tự động các việc sau', CHON_NGAY: 'Chọn ngày xong mới', CHI_VIEC: 'Chỉ lùi việc này, việc sau giữ nguyên' };

/** Số ngày công từ sau ngày xong hiện tại đến ngày xong mới (≤ 0 nghĩa là ngày chọn không lùi được). */
export function soNgayDenNgay(ketThuc, ngayMoi, lich) {
  if (!ngayMoi || ngayMoi <= ketThuc) return 0;
  let n = 0;
  for (let d = addDays(ketThuc, 1); d <= ngayMoi; d = addDays(d, 1)) n += sucLam(d, lich);
  return n;
}

/** Áp báo chậm theo cách đã chọn (giám sát, hoặc văn phòng đã thống nhất). */
export function apBaoCham(db, ct, viecId, { soNgay, cach, nguyenNhan, ghiChu }, nguoi) {
  baoCham(db, ct, viecId, { soNgay, nguyenNhan, ghiChu, chiViecNay: cach === 'CHI_VIEC' }, nguoi);
}

/** Xem trước khi lùi: bao nhiêu việc sau đổi ngày, ngày xong công trình trước/sau, ngày xong mới của việc này. */
export function xemTruocCham(ct, viecId, soNgay, chiViec = false) {
  const truoc = lichHienTai(ct);
  const viec = ct.viec.map((v) => (v.id === viecId ? { ...v, soNgay: v.soNgay + Number(soNgay) } : v));
  let thu = { ...ct, viec };
  if (chiViec) {
    const tam = lichHienTai(thu);
    thu = { ...ct, viec: viec.map((v) => (v.id !== viecId && v.phanTram < 100 && !(v.thucTe && v.thucTe.batDau) && tam.get(v.id).batDau !== truoc.get(v.id).batDau
      ? { ...v, batDauCoDinh: truoc.get(v.id).batDau } : v)) };
  }
  const sau = lichHienTai(thu);
  const kt = (m) => [...m.values()].reduce((a, b) => (b.ketThuc > a ? b.ketThuc : a), '');
  return { soViecLui: ct.viec.filter((v) => v.id !== viecId && sau.get(v.id).ketThuc !== truoc.get(v.id).ketThuc).length,
    xongTruoc: kt(truoc), xongSau: kt(sau), ketThucViec: sau.get(viecId).ketThuc };
}

/** Văn phòng đề xuất lùi: chưa đổi lịch, chờ giám sát xác nhận. */
export function deXuatCham(db, ct, viecId, { soNgay, cach, nguyenNhan, ghiChu }, nguoi) {
  const v = ct.viec.find((x) => x.id === viecId);
  const e = { id: 'DX-' + taoMa(), luc: bayGio(), ma: ct.ma, viec: viecId, tenViec: v ? v.hangMuc : '', nguoi, loai: 'DE_XUAT_CHAM',
    cu: Number(soNgay), moi: cach === 'CHI_VIEC' ? 'CHI_VIEC' : 'TU_DONG', nguyenNhan, ghiChu: ghiChu || '', congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
  return e;
}

/** Đề xuất lùi còn chờ giám sát (chưa có dòng DX_XONG trỏ tới). */
export function deXuatCho(db, ma = '') {
  const xong = new Set((db.lichSu || []).filter((e) => e.loai === 'DX_XONG').map((e) => String(e.cu)));
  return (db.lichSu || []).filter((e) => e.loai === 'DE_XUAT_CHAM' && !xong.has(e.id) && (!ma || e.ma === ma));
}

/**
 * Giám sát xử lý đề xuất: DONG_Y (lùi đúng như đề xuất), SUA (lùi theo số ngày/cách giám sát sửa), BO (không lùi).
 * Văn phòng rút đề xuất: RUT.
 * sua: { soNgay, cach, nguyenNhan, ghiChu } khi SUA.
 */
export function xuLyDeXuat(db, ct, dx, ketQua, nguoi, sua = null) {
  if (ketQua === 'DONG_Y') apBaoCham(db, ct, dx.viec, { soNgay: dx.cu, cach: dx.moi, nguyenNhan: dx.nguyenNhan, ghiChu: (dx.ghiChu ? dx.ghiChu + '. ' : '') + 'Văn phòng đề xuất, giám sát xác nhận' }, nguoi);
  if (ketQua === 'SUA' && sua) apBaoCham(db, ct, dx.viec, { ...sua, ghiChu: (sua.ghiChu ? sua.ghiChu + '. ' : '') + `Sửa từ đề xuất văn phòng (+${dx.cu} ngày)` }, nguoi);
  const e = { id: taoMa(), luc: bayGio(), ma: ct.ma, viec: dx.viec, tenViec: dx.tenViec, nguoi, loai: 'DX_XONG', cu: dx.id, moi: ketQua,
    ghiChu: ketQua === 'RUT' ? 'Văn phòng rút đề xuất' : ketQua === 'BO' ? 'Giám sát không lùi đề xuất' : ketQua === 'SUA' ? 'Giám sát sửa rồi lùi' : 'Giám sát xác nhận lùi', congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

// ---------- Tổng hợp tuần cho chủ nhà ----------
/** Thứ 2 của tuần chứa `ngay`. */
export const dauTuan = (ngay) => addDays(ngay, -((toDate(ngay).getUTCDay() + 6) % 7));
export const idTuan = (ma, tu) => `BCT-${ma}-${tu}`;
export const tuanCua = (db, ma, tu) => (db.baoCaoTuan || []).find((x) => x.maCongTrinh === ma && x.tuNgay === tu && !x.xoa);
export const daToiGioTuan = (ngay, gio) => { const thu = toDate(ngay).getUTCDay(); return (thu === MOC_TUAN.thu && gio >= MOC_TUAN.gio) || thu === 0; };

/**
 * Nội dung tự gom cho tuần kết thúc `den` (thường là thứ 7): % thực tế/kế hoạch, việc xong trong tuần,
 * việc tuần sau, vướng mắc cần chủ nhà (phát sinh, mẫu, phương án chờ). Không có nhân công, không có vấn đề nội bộ.
 */
export function gomTuan(db, ct, den) {
  const tu = dauTuan(den);
  const th = tongHop(ct, den);
  const xong = ct.viec.filter((v) => v.phanTram >= 100 && v.thucTe && v.thucTe.ketThuc >= tu && v.thucTe.ketThuc <= den).map((v) => v.hangMuc);
  const tuanSauTu = addDays(tu, 7);
  const tuanSauDen = addDays(tu, 13);
  const tuanSau = ct.viec.filter((v) => v.phanTram < 100).map((v) => ({ v, t: th.lich.get(v.id) }))
    .filter(({ t }) => t.batDau <= tuanSauDen && t.ketThuc >= tuanSauTu)
    .sort((a, b) => a.t.batDau.localeCompare(b.t.batDau))
    .map(({ v, t }) => ({ hangMuc: v.hangMuc, batDau: t.batDau, ketThuc: t.ketThuc }));
  const vuong = [];
  (db.phatSinh || []).filter((p) => p.maCongTrinh === ct.ma && !p.xoa && p.trangThai === 'CHO_KHACH').forEach((p) => vuong.push(`Phát sinh ${p.ma}: ${p.moTa}, chờ anh/chị duyệt trên link`));
  (db.mauVL || []).filter((m) => m.maCongTrinh === ct.ma && !m.xoa && m.trangThai === 'CHO_KHACH').forEach((m) => vuong.push(`Mẫu ${m.hangMuc} (${m.tenMau}) chờ anh/chị chốt${m.hanChot ? ', hạn ' + m.hanChot.slice(8, 10) + '/' + m.hanChot.slice(5, 7) : ''}`));
  (db.phuongAn || []).filter((p) => p.maCongTrinh === ct.ma && p.trangThai === 'CHO').forEach((p) => vuong.push(`Phương án ${p.hangMuc} chờ anh/chị góp ý`));
  return { tuNgay: tu, denNgay: den, pctThucTe: th.pctThucTe, pctKeHoach: th.pctKeHoach, ketThuc: th.ketThuc, xong, tuanSau, vuongMac: vuong.join('\n') };
}

/** Vấn đề nội bộ trong tuần (từ phiếu ngày), để Thầy tham khảo khi viết vướng mắc. Chủ nhà không thấy. */
export function noiBoTuan(db, ma, tu, den) {
  return (db.baoCao || []).filter((b) => b.maCongTrinh === ma && !b.xoa && b.ngay >= tu && b.ngay <= den && (b.thieu || b.anhHuong))
    .sort((a, b) => a.ngay.localeCompare(b.ngay)).map((b) => ({ ngay: b.ngay, thieu: b.thieu, anhHuong: b.anhHuong }));
}

/** Lưu (và gửi = hiện trên link chủ nhà) bản tổng hợp tuần. */
export function luuTuan(db, ct, noiDung, dsAnh, nguoi, gui) {
  db.baoCaoTuan = db.baoCaoTuan || [];
  let x = tuanCua(db, ct.ma, noiDung.tuNgay);
  if (!x) { x = { id: idTuan(ct.ma, noiDung.tuNgay), maCongTrinh: ct.ma, tuNgay: noiDung.tuNgay, guiLuc: '', xoa: '' }; db.baoCaoTuan.push(x); }
  Object.assign(x, { denNgay: noiDung.denNgay, tomTat: noiDung, dsAnh: (dsAnh || []).slice(0, ANH_TUAN_TOI_DA), nguoi });
  if (gui && !x.guiLuc) x.guiLuc = bayGio();
  x.capNhatLuc = bayGio();
  day(db, { loai: 'BCT', x });
  return x;
}

/** Công trình cần gửi tổng hợp tuần: đang thi công, đã tới trưa thứ 7, tuần này chưa gửi. */
export function canGuiTuan(db, dsCongTrinh, ngay, gio) {
  if (!daToiGioTuan(ngay, gio)) return [];
  const tu = dauTuan(ngay);
  return dsCongTrinh.filter((ct) => ct.loai !== 'TK' && ct.khoiCong <= ngay && !(tuanCua(db, ct.ma, tu) || {}).guiLuc);
}

export function tinZaloTuan(ct, nd, link) {
  const dd = (s) => `${s.slice(8, 10)}/${s.slice(5, 7)}`;
  const dong = [`KAS Houzing gửi anh/chị báo cáo tuần ${dd(nd.tuNgay)}–${dd(nd.denNgay)} công trình ${ct.ten}:`,
    `• Tiến độ thực tế ${nd.pctThucTe}% (kế hoạch ${nd.pctKeHoach}%), dự kiến xong ${dd(nd.ketThuc)}`];
  if (nd.xong.length) dong.push(`• Xong trong tuần: ${nd.xong.join(', ')}`);
  if (nd.tuanSau.length) dong.push(`• Tuần sau: ${nd.tuanSau.map((x) => x.hangMuc).join(', ')}`);
  if (nd.vuongMac) dong.push('• Cần anh/chị: ' + nd.vuongMac.split('\n').filter(Boolean).join('; '));
  dong.push('', `Xem ảnh và chi tiết: ${link}`);
  return dong.join('\n');
}

export { diffDays };
