// Theo dõi hợp đồng (bước C và E): số HĐ, đợt thu, phụ lục, khấu trừ phí thiết kế, dừng/hoàn thành.
// Chỉ văn phòng (Thầy, Đức) thấy. Giám sát không thấy tiền.
import { addDays, diffDays } from './schedule.js';
import { day, taoMa } from './store.js';

export const DANG_HD = { TK: 'Thiết kế', XD: 'Thi công xây dựng', NT: 'Thi công nội thất', TG: 'Trọn gói' };
export const TT_HD = { HIEU_LUC: 'Đang thực hiện', DUNG: 'Dừng / huỷ', XONG: 'Hoàn thành' };
// Thầy chốt 12-13/11: PA đầu + 2 lần sửa. Sửa thêm: Thầy chọn thu 5% giá trị HĐ/lần hoặc không thu.
export const SO_LAN_SUA = 2;
export const PHI_SUA = 0.05;
// Nhắc trước hạn khấu trừ phí thiết kế bao nhiêu ngày (cơ hội chốt thi công).
export const NHAC_KHAU_TRU = 30;
// HĐ thiết kế: phạm vi kiến trúc, nội thất hoặc cả hai (trọn gói thiết kế, tách giá trị từng phần).
export const PHAM_VI_TK = { KT: 'Kiến trúc', NT: 'Nội thất', KTNT: 'Kiến trúc + nội thất' };
// Thầy chốt 13/11: ký thi công thì khấu trừ 50% phần thiết kế tương ứng.
// Thi công xây dựng → phần kiến trúc; thi công nội thất → phần nội thất; trọn gói → cả hai.
export const TY_LE_KHAU_TRU = 50;
const PHAN_TRU = { XD: ['KT'], NT: ['NT'], TG: ['KT', 'NT'] };

const boDau = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
const NAM = new Set(['anh', 'chu', 'ong', 'bac', 'a', 'mr']);
const NU = new Set(['chi', 'co', 'ba', 'c', 'mrs', 'ms']);

// "Anh Nam Cầu Giấy" → MrNam, "Chị Lan" → MrsLan. Không rõ xưng hô thì để Mr, Thầy sửa tay.
export function goiYTenHD(tenKhach) {
  const tu = boDau(String(tenKhach || '').replace(/^[^:]*:\s*/, '')).split(/[^A-Za-z0-9]+/).filter(Boolean);
  let xh = 'Mr';
  if (tu.length && (NAM.has(tu[0].toLowerCase()) || NU.has(tu[0].toLowerCase()))) xh = NU.has(tu.shift().toLowerCase()) ? 'Mrs' : 'Mr';
  const ten = tu[0] ? tu[0][0].toUpperCase() + tu[0].slice(1).toLowerCase() : '';
  return xh + ten;
}

// Số HĐ: YYMM31/TÊN-KAS/dạng HĐ. "31" là số đuôi cố định (Thầy chốt 13/11).
export function soHopDong(ngayKy, tenHD, dang) {
  const yymm = String(ngayKy || '').slice(2, 4) + String(ngayKy || '').slice(5, 7);
  return `${yymm}31/${tenHD}-KAS/${dang}`;
}

// Đợt thu mặc định. HĐ thiết kế <100tr: 70/30, ≥100tr: 50/30/20. Thi công: 50/30/20. Sửa được theo thương lượng.
export function dotMacDinh(dang, giaTri) {
  const tk = dang === 'TK';
  if (tk && Number(giaTri) < 100e6) return [[70, 'Ký hợp đồng'], [30, 'Bàn giao hồ sơ thiết kế']];
  if (tk) return [[50, 'Ký hợp đồng'], [30, 'Khách duyệt 3D'], [20, 'Bàn giao hồ sơ thiết kế']];
  return [[50, 'Ký hợp đồng / khởi công'], [30, 'Xong phần thô'], [20, 'Bàn giao']];
}

const taoDot = ([tyLe, ten], i) => ({ id: taoMa(), so: i + 1, ten, tyLe, moc: '', han: '', thu: [], dong: '', chot: null });

function ghiHD(db, hd) {
  hd.capNhatLuc = new Date().toISOString();
  day(db, { loai: 'HD', hd });
}

function nhatKy(db, hd, nguoi, ghiChu, them = {}) {
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: hd.ma, viec: '', tenViec: hd.soHD, nguoi, loai: 'HD_GHI', ghiChu, congKhai: false, ...them };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

export function taoHopDong(db, du, nguoi) {
  db.hopDong = db.hopDong || [];
  const giaTri = Number(du.giaTri) || 0;
  const tenHD = du.tenHD || goiYTenHD(du.tenKhach);
  const hd = {
    ma: 'HD-' + taoMa(),
    soHD: du.soHD || soHopDong(du.ngayKy, tenHD, du.dang),
    dang: du.dang,
    nguyenTac: !!du.nguyenTac,
    tenHD,
    maKhach: du.maKhach || '',
    maCongTrinh: du.maCongTrinh || '',
    ngayKy: du.ngayKy,
    giaTri,
    dot: (du.dot || dotMacDinh(du.dang, giaTri)).map(taoDot),
    phuLuc: [],
    soLanSua: du.soLanSua ?? (du.dang === 'TK' || du.dang === 'TG' ? SO_LAN_SUA : 0),
    soBuoiGSTG: Number(du.soBuoiGSTG) || 0,
    phamVi: du.dang === 'TK' ? du.phamVi || 'KTNT' : '',
    giaTriKT: du.dang === 'TK' ? Number(du.giaTriKT) || 0 : 0,
    khauTru: { han: du.hanKhauTru || '', tyLe: du.tyLeKhauTru ?? (du.dang === 'TK' ? TY_LE_KHAU_TRU : 0) },
    truTK: { maHD: '', phan: [], soTien: 0 },
    linkFile: du.linkFile || '',
    trangThai: 'HIEU_LUC',
    lyDo: '',
    ngayDung: '',
    nguoiTao: nguoi,
    taoLuc: new Date().toISOString(),
  };
  db.hopDong.push(hd);
  ghiHD(db, hd);
  nhatKy(db, hd, nguoi, `Ký ${hd.soHD}, giá trị ${giaTri.toLocaleString('vi-VN')} đ`);
  return hd;
}

export function suaHopDong(db, hd, thayDoi) {
  Object.assign(hd, thayDoi);
  ghiHD(db, hd);
}

// Giá trị HĐ = giá trị ký + các phụ lục (kể cả phí sửa phương án).
export const tongGiaTri = (hd) => (Number(hd.giaTri) || 0) + (hd.phuLuc || []).reduce((s, p) => s + (Number(p.giaTri) || 0), 0);
const daThuDot = (d) => (d.thu || []).reduce((s, t) => s + (Number(t.soTien) || 0), 0);

/**
 * Số phải thu từng đợt.
 * - Đợt đã đóng giữ nguyên số "chốt" lúc đóng.
 * - Phần còn lại (giá trị HĐ − khấu trừ phí TK − các đợt đã đóng) chia cho các đợt chưa đóng theo tỷ lệ.
 *   Khấu trừ phí thiết kế nằm ở đợt cuối HĐ thi công (Thầy chốt).
 * - Đợt đóng mà thu thiếu (hoặc thừa) thì phần chênh dồn sang đợt chưa đóng kế tiếp.
 */
export function tinhDot(hd) {
  const dot = hd.dot || [];
  const tru = Number(hd.truTK && hd.truTK.soTien) || 0;
  const tong = tongGiaTri(hd);
  const daDong = dot.filter((d) => d.dong);
  const mo = dot.filter((d) => !d.dong);
  const conChia = tong - daDong.reduce((s, d) => s + (Number(d.chot) || 0), 0);
  const tyLeMo = mo.reduce((s, d) => s + (Number(d.tyLe) || 0), 0) || 1;
  const goc = new Map();
  let daChia = 0;
  mo.forEach((d, i) => {
    const t = i === mo.length - 1 ? conChia - daChia : Math.round((conChia * (Number(d.tyLe) || 0)) / tyLeMo);
    goc.set(d.id, t); daChia += t;
  });
  // Khấu trừ trừ vào đợt cuối còn mở (nếu đợt cuối đã đóng thì đợt mở cuối cùng).
  if (tru && mo.length) { const cuoi = mo[mo.length - 1]; goc.set(cuoi.id, goc.get(cuoi.id) - tru); }
  let chuyen = 0;
  const kq = dot.map((d) => {
    const daThu = daThuDot(d);
    if (d.dong) {
      const r = { ...d, phaiThu: Number(d.chot) || 0, daThu, conLai: 0, chuyenSang: (Number(d.chot) || 0) - daThu, nhanChuyen: 0 };
      chuyen += r.chuyenSang;
      return r;
    }
    const nhan = chuyen; chuyen = 0;
    const phaiThu = goc.get(d.id) + nhan;
    return { ...d, phaiThu, daThu, conLai: phaiThu - daThu, chuyenSang: 0, nhanChuyen: nhan };
  });
  return { dot: kq, tong, tru, phaiThu: tong - tru, daThu: dot.reduce((s, d) => s + daThuDot(d), 0), chuaXep: mo.length ? 0 : tong - tru - daDong.reduce((s, d) => s + (Number(d.chot) || 0), 0) + chuyen };
}

// Ghi 1 lần khách chuyển tiền. Đủ tiền thì đợt tự đóng; thiếu thì Thầy chọn đóng tay (phần thiếu sang đợt sau).
export function ghiThu(db, hd, idDot, { ngay, soTien, ghiChu }, nguoi) {
  const d = hd.dot.find((x) => x.id === idDot);
  d.thu.push({ id: taoMa(), ngay, soTien: Number(soTien) || 0, ghiChu: ghiChu || '' });
  const t = tinhDot(hd).dot.find((x) => x.id === idDot);
  if (t.daThu >= t.phaiThu) { d.dong = ngay; d.chot = t.phaiThu; }
  ghiHD(db, hd);
  nhatKy(db, hd, nguoi, `Thu đợt ${d.so}: ${(Number(soTien) || 0).toLocaleString('vi-VN')} đ${ghiChu ? ' · ' + ghiChu : ''}${d.dong ? ' · đủ, đóng đợt' : ''}`);
  return !!d.dong;
}

export function dongDot(db, hd, idDot, ngay, nguoi) {
  const d = hd.dot.find((x) => x.id === idDot);
  const t = tinhDot(hd).dot.find((x) => x.id === idDot);
  d.dong = ngay; d.chot = t.phaiThu;
  ghiHD(db, hd);
  const thieu = t.phaiThu - t.daThu;
  nhatKy(db, hd, nguoi, `Đóng đợt ${d.so}${thieu ? `, ${thieu > 0 ? 'thiếu' : 'thừa'} ${Math.abs(thieu).toLocaleString('vi-VN')} đ chuyển sang đợt sau` : ''}`);
}

export function moLaiDot(db, hd, idDot) {
  const d = hd.dot.find((x) => x.id === idDot);
  d.dong = ''; d.chot = null;
  ghiHD(db, hd);
}

export function suaDot(db, hd, idDot, thayDoi) {
  Object.assign(hd.dot.find((x) => x.id === idDot), thayDoi);
  ghiHD(db, hd);
}

export function themDot(db, hd, { ten, tyLe }) {
  hd.dot.push(taoDot([Number(tyLe) || 0, ten || 'Đợt thêm'], hd.dot.length));
  ghiHD(db, hd);
}

export function themPhuLuc(db, hd, { ngay, noiDung, giaTri, link, loai = 'PL' }, nguoi) {
  const pl = { id: taoMa(), ngay, noiDung, giaTri: Number(giaTri) || 0, link: link || '', loai };
  hd.phuLuc.push(pl);
  ghiHD(db, hd);
  nhatKy(db, hd, nguoi, `${loai === 'PHI_SUA' ? 'Phí sửa phương án' : 'Phụ lục'}: ${noiDung} (${pl.giaTri >= 0 ? '+' : ''}${pl.giaTri.toLocaleString('vi-VN')} đ)`);
  return pl;
}

// Phí sửa thêm = 5% giá trị HĐ (giá trị ký + phụ lục, không tính các lần phí sửa trước).
export function phiSua(hd) {
  const goc = (Number(hd.giaTri) || 0) + (hd.phuLuc || []).filter((p) => p.loai !== 'PHI_SUA').reduce((s, p) => s + (Number(p.giaTri) || 0), 0);
  return Math.round(goc * PHI_SUA);
}

// Giá trị từng phần của HĐ thiết kế. Trọn gói thiết kế: phần KT nhập tay, phần NT = phần còn lại.
export function giaTriPhan(tk, phan) {
  const g = Number(tk.giaTri) || 0;
  if (tk.phamVi === 'KT') return phan === 'KT' ? g : 0;
  if (tk.phamVi === 'NT') return phan === 'NT' ? g : 0;
  const kt = Math.min(Number(tk.giaTriKT) || 0, g);
  return phan === 'KT' ? kt : g - kt;
}

// Phần của HĐ thiết kế đã trừ vào HĐ thi công nào đó.
const phanDaTru = (db, tk, tru) => (db.hopDong || []).filter((x) => x !== tru && x.truTK && x.truTK.maHD === tk.ma).flatMap((x) => x.truTK.phan || []);

/**
 * HĐ thi công ký sau HĐ thiết kế, còn trong hạn khấu trừ: trừ 50% phần thiết kế tương ứng vào đợt cuối HĐ thi công.
 * Trả về { hd, phan, soTien } hoặc null.
 */
export function hdThietKeDuocTru(db, hdTC) {
  const can = PHAN_TRU[hdTC.dang] || [];
  for (const tk of db.hopDong || []) {
    if (tk.dang !== 'TK' || tk === hdTC || tk.trangThai === 'DUNG') continue;
    if (!((hdTC.maKhach && tk.maKhach === hdTC.maKhach) || (hdTC.maCongTrinh && tk.maCongTrinh === hdTC.maCongTrinh))) continue;
    const tyLe = Number(tk.khauTru && tk.khauTru.tyLe) || 0;
    if (!tyLe || (tk.khauTru.han && hdTC.ngayKy > tk.khauTru.han)) continue;
    const daTru = phanDaTru(db, tk, hdTC);
    const phan = can.filter((p) => !daTru.includes(p) && giaTriPhan(tk, p) > 0);
    if (!phan.length) continue;
    return { hd: tk, phan, soTien: Math.round((phan.reduce((s, p) => s + giaTriPhan(tk, p), 0) * tyLe) / 100) };
  }
  return null;
}

export function apKhauTru(db, hdTC, ung, nguoi) {
  hdTC.truTK = { maHD: ung.hd.ma, phan: ung.phan, soTien: ung.soTien };
  ghiHD(db, hdTC);
  nhatKy(db, hdTC, nguoi, `Khấu trừ phí thiết kế ${ung.phan.map((p) => PHAM_VI_TK[p].toLowerCase()).join(' + ')} (${ung.hd.soHD}): ${ung.soTien.toLocaleString('vi-VN')} đ vào đợt cuối`);
}

// Phần thiết kế còn chờ khấu trừ (để nhắc trước hạn).
export function phanChoTru(db, tk) {
  const daTru = phanDaTru(db, tk, null);
  return ['KT', 'NT'].filter((p) => giaTriPhan(tk, p) > 0 && !daTru.includes(p));
}

export function doiTrangThaiHD(db, hd, tt, { lyDo = '', ngay }, nguoi) {
  hd.trangThai = tt;
  if (tt === 'DUNG') { hd.lyDo = lyDo; hd.ngayDung = ngay; }
  ghiHD(db, hd);
  const th = tinhDot(hd);
  nhatKy(db, hd, nguoi, `${TT_HD[tt]}${lyDo ? ': ' + lyDo : ''}${tt === 'DUNG' ? ` · đã thu ${th.daThu.toLocaleString('vi-VN')} đ` : ''}`);
}

export const hdCuaCongTrinh = (db, maCt) => (db.hopDong || []).filter((h) => h.maCongTrinh === maCt);
export const hdCuaKhach = (db, maKh) => (db.hopDong || []).filter((h) => h.maKhach === maKh);

// Công trình đã xong hẳn: có HĐ và mọi HĐ đều Hoàn thành. Dừng mà chưa hoàn thiện thủ tục vẫn ở bảng tổng.
export function congTrinhDaXong(db, maCt) {
  const ds = hdCuaCongTrinh(db, maCt);
  return ds.length > 0 && ds.every((h) => h.trangThai === 'XONG');
}

/**
 * Việc tiền bạc hôm nay (văn phòng):
 * - thu: đợt đến lúc gửi đề nghị thanh toán (đợt 1 sau ký; mốc trong kế hoạch đã xong; hoặc hạn trong 3 ngày).
 * - khauTru: HĐ thiết kế sắp hết hạn khấu trừ mà chưa ký thi công.
 * - dung: HĐ đã dừng, chưa đánh dấu hoàn thành thủ tục.
 */
export function viecHopDongHomNay(db, homNay) {
  const sap = addDays(homNay, 3);
  const thu = [], khauTru = [], dung = [];
  for (const hd of db.hopDong || []) {
    if (hd.trangThai === 'DUNG') { dung.push(hd); continue; }
    if (hd.trangThai !== 'HIEU_LUC') continue;
    const ct = (db.congTrinh || []).find((c) => c.ma === hd.maCongTrinh);
    const th = tinhDot(hd);
    th.dot.forEach((d, i) => {
      if (d.dong || d.conLai <= 0) return;
      const v = d.moc && ct ? ct.viec.find((x) => x.id === d.moc) : null;
      const lyDo = i === 0 && !d.daThu ? 'Sau ký hợp đồng'
        : v && v.phanTram >= 100 ? `Xong mốc: ${v.hangMuc}`
        : d.han && d.han <= sap ? `Hạn ${d.han}`
        : d.daThu > 0 ? 'Khách mới chuyển một phần' : '';
      if (lyDo) thu.push({ hd, d, lyDo });
    });
    if (hd.dang === 'TK' && hd.khauTru && hd.khauTru.han && Number(hd.khauTru.tyLe) > 0) {
      const conNgay = diffDays(homNay, hd.khauTru.han);
      const phan = phanChoTru(db, hd);
      if (phan.length && conNgay >= 0 && conNgay <= NHAC_KHAU_TRU) khauTru.push({ hd, conNgay, phan });
    }
  }
  return { thu, khauTru, dung };
}

// Tổng tiền cho bảng hợp đồng.
export function tongHopTien(db) {
  let giaTri = 0, daThu = 0, conLai = 0;
  for (const hd of db.hopDong || []) {
    if (hd.trangThai === 'DUNG') continue;
    const th = tinhDot(hd);
    giaTri += th.phaiThu; daThu += th.daThu;
    if (hd.trangThai === 'HIEU_LUC') conLai += th.phaiThu - th.daThu;
  }
  return { giaTri, daThu, conLai };
}
