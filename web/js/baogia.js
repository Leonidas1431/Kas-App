// Báo giá thiết kế theo m² sàn (bảng giá KAS 2026, sheet "BG Thiết kế Chung").
// Tách phần kiến trúc (gồm kết cấu, điện, nước), nội thất, cảnh quan. Giá chưa VAT, không có dòng VAT.
// Thầy chốt 21/11: hiệu lực 30 ngày, hết hạn nhắc trong app; giảm giá do Thầy hoặc Đức duyệt; đơn giá tối thiểu 250k/m².
import { addDays, diffDays } from './schedule.js';

export const HIEU_LUC = 30;
export const DON_GIA_TOI_THIEU = 250000;
// Tối thiểu chỉ áp cho kiến trúc và nội thất (cảnh quan trong bảng giá vốn dưới 250k).
const AP_TOI_THIEU = ['KT', 'NT'];

export const PHAN_BG = { KT: 'Thiết kế kiến trúc', NT: 'Thiết kế nội thất', CQ: 'Thiết kế cảnh quan' };
export const MO_TA_PHAN = {
  KT: 'Khảo sát hiện trạng, bố trí công năng, 3D không gian, hồ sơ kiến trúc, kết cấu, điện, cấp thoát nước',
  NT: 'Khảo sát hiện trạng, bố trí công năng, 3D không gian, hồ sơ chi tiết kỹ thuật nội thất (chiếu sáng, đồ nội thất, trang trí)',
  CQ: 'Thiết kế cảnh quan sân vườn',
};
export const PHONG_CACH = { HD: 'Hiện đại', CD: 'Cổ điển hoặc sang trọng' };
export const LOAI_CT = {
  CC: 'Chung cư / Penthouse', NP: 'Nhà phố / Liền kề', BT: 'Biệt thự / Villa / Nhà vườn',
  VP: 'Văn phòng, toà nhà dịch vụ, TTTM', KS: 'Khách sạn / Homestay / lưu trú', CF: 'Cafe / Nhà hàng / Bar / Cửa hàng', TH: 'Trường học / Trung tâm đào tạo',
};

// Đơn giá đ/m² theo [loại][phong cách][phần]. null = bảng giá chưa có (Thầy nhập tay).
// Biệt thự cổ điển/sang trọng trong file đang để trống. Chung cư không có thiết kế kiến trúc.
export const BANG_GIA_MAC_DINH = {
  CC: { HD: { KT: null, NT: 280000, CQ: 120000 }, CD: { KT: null, NT: 350000, CQ: 160000 } },
  NP: { HD: { KT: 300000, NT: 300000, CQ: 120000 }, CD: { KT: 400000, NT: 350000, CQ: 160000 } },
  BT: { HD: { KT: 400000, NT: 450000, CQ: 200000 }, CD: { KT: null, NT: null, CQ: null } },
  VP: { HD: { KT: 280000, NT: 220000, CQ: 100000 }, CD: { KT: 350000, NT: 320000, CQ: 160000 } },
  KS: { HD: { KT: 280000, NT: 300000, CQ: 160000 }, CD: { KT: 350000, NT: 350000, CQ: 200000 } },
  CF: { HD: { KT: 280000, NT: 300000, CQ: 160000 }, CD: { KT: 350000, NT: 350000, CQ: 200000 } },
  TH: { HD: { KT: 280000, NT: 300000, CQ: 160000 }, CD: { KT: 350000, NT: 350000, CQ: 200000 } },
};

// Bảng giá đang dùng: bản Thầy sửa trong Cài đặt (caiDat.bangGiaTK, JSON) đè lên bản mặc định.
export function bangGia(db) {
  let rieng = {};
  try { rieng = JSON.parse((db.caiDat || {}).bangGiaTK || '{}') || {}; } catch (e) { rieng = {}; }
  const kq = JSON.parse(JSON.stringify(BANG_GIA_MAC_DINH));
  for (const [l, pc] of Object.entries(rieng)) for (const [p, ph] of Object.entries(pc || {})) for (const [m, g] of Object.entries(ph || {})) {
    if (kq[l] && kq[l][p]) kq[l][p][m] = g === null || g === '' ? null : Number(g);
  }
  return kq;
}

export function donGiaGoiY(db, loaiCT, phongCach, phan) {
  const b = bangGia(db);
  return (b[loaiCT] && b[loaiCT][phongCach] && b[loaiCT][phongCach][phan]) ?? null;
}

export const toiThieu = (db) => Number((db.caiDat || {}).donGiaToiThieu) || DON_GIA_TOI_THIEU;

const tongDT = (ph) => Math.round((ph.dong || []).reduce((s, d) => s + (Number(d.dt) || 0), 0) * 100) / 100;

/**
 * Tính báo giá. ct = { loaiCT, phongCach, phan: [{ ma, donGia, dong: [{ ten, dt }] }], giam: { kieu: 'PT'|'TIEN', giaTri, lyDo, nguoi } }.
 * Giảm giá chia theo tỷ lệ cho từng phần, để biết giá trị phần kiến trúc khi lập HĐ (khấu trừ đúng phần).
 */
export function tinhBaoGia(ct, toiThieuM2 = DON_GIA_TOI_THIEU) {
  const phan = (ct.phan || []).filter((p) => tongDT(p) > 0).map((p) => {
    const dt = tongDT(p), donGia = Number(p.donGia) || 0;
    return { ma: p.ma, ten: PHAN_BG[p.ma], dong: p.dong.filter((d) => Number(d.dt) > 0), dienTich: dt, donGia, thanhTien: Math.round(dt * donGia) };
  });
  const tongTruoc = phan.reduce((s, p) => s + p.thanhTien, 0);
  const g = ct.giam || {};
  let giam = g.kieu === 'PT' ? Math.round((tongTruoc * (Number(g.giaTri) || 0)) / 100) : Number(g.giaTri) || 0;
  giam = Math.max(0, Math.min(giam, tongTruoc));
  const tong = tongTruoc - giam;
  const heSo = tongTruoc ? tong / tongTruoc : 1;
  const canhBao = [];
  phan.forEach((p) => {
    p.sauGiam = Math.round(p.thanhTien * heSo);
    p.donGiaSauGiam = p.dienTich ? Math.round(p.sauGiam / p.dienTich) : 0;
    if (!p.donGia) canhBao.push(`${p.ten}: chưa có đơn giá`);
    else if (AP_TOI_THIEU.includes(p.ma) && p.donGiaSauGiam < toiThieuM2) {
      canhBao.push(`${p.ten}: đơn giá ${giam ? 'sau giảm ' : ''}${p.donGiaSauGiam.toLocaleString('vi-VN')} đ/m², dưới mức tối thiểu ${toiThieuM2.toLocaleString('vi-VN')} đ/m²`);
    }
  });
  // Làm tròn: phần cuối nhận phần lẻ để tổng các phần đúng bằng tổng.
  if (phan.length) phan[phan.length - 1].sauGiam += tong - phan.reduce((s, p) => s + p.sauGiam, 0);
  // Cảnh quan đi cùng phần ngoài nhà nên gộp vào phần kiến trúc khi khấu trừ (ký thi công xây dựng thì trừ).
  const giaTriKT = phan.filter((p) => p.ma === 'KT' || p.ma === 'CQ').reduce((s, p) => s + p.sauGiam, 0);
  return { phan, tongTruoc, giam, tong, giaTriKT, canhBao };
}

// Phạm vi HĐ thiết kế suy ra từ các phần có trong báo giá.
export function phamViTuBaoGia(kq) {
  const co = new Set(kq.phan.map((p) => p.ma));
  const kt = co.has('KT') || co.has('CQ');
  if (kt && co.has('NT')) return 'KTNT';
  if (kt) return 'KT';
  return 'NT';
}

export const hetHanBG = (bg) => bg.hetHan || (bg.ngay ? addDays(bg.ngay, HIEU_LUC) : '');

/**
 * Báo giá sắp hết hạn (còn ≤3 ngày) hoặc đã hết hạn, khách chưa ký, chưa chốt bản nào, là bản mới nhất.
 * Hết hạn quá 30 ngày thì thôi nhắc (khách đã nguội, đã có nhắc gọi lại riêng).
 */
export function viecBaoGiaHomNay(db, homNay) {
  const ra = [];
  for (const k of db.khach || []) {
    if (['KY', 'MAT', 'TAM_HOAN'].includes(k.trangThai)) continue;
    const ds = k.baoGia || [];
    if (!ds.length || ds.some((b) => b.khachChot)) continue;
    const bg = ds[ds.length - 1];
    const han = hetHanBG(bg);
    if (!han) continue;
    const con = diffDays(homNay, han);
    if (con <= 3 && con >= -30) ra.push({ k, bg, han, con });
  }
  return ra.sort((a, b) => a.con - b.con);
}

// Ghi chú thanh toán in trên báo giá: theo quy tắc HĐ thiết kế (<100tr 70/30, ≥100tr 50/30/20).
export function ghiChuThanhToan(tong) {
  return Number(tong) < 100e6
    ? 'Thanh toán: đợt 1 thanh toán 70% ngay sau khi ký hợp đồng, 30% sau khi bàn giao đầy đủ hồ sơ thi công'
    : 'Thanh toán: đợt 1 thanh toán 50% ngay sau khi ký hợp đồng, 30% sau khi thống nhất 3D và 20% sau khi bàn giao đầy đủ hồ sơ thi công';
}

// Đọc số tiền thành chữ (để in vào HĐ: "Bằng chữ: ..."). Chỉ số nguyên không âm.
const CS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
function docBa(n, du) {
  const tr = Math.floor(n / 100), ch = Math.floor((n % 100) / 10), dv = n % 10;
  const r = [];
  if (du || tr) r.push(CS[tr] + ' trăm');
  if (ch === 0 && dv && (du || tr)) r.push('lẻ');
  if (ch === 1) r.push('mười');
  else if (ch > 1) r.push(CS[ch] + ' mươi');
  if (dv) r.push(dv === 1 && ch > 1 ? 'mốt' : dv === 5 && ch > 0 ? 'lăm' : dv === 4 && ch > 1 ? 'tư' : CS[dv]);
  return r.join(' ');
}
export function docSoTien(so) {
  const n = Math.round(Math.abs(Number(so) || 0));
  if (!n) return 'Không đồng';
  const chu = docNguyen(n, false).replace(/\s+/g, ' ').trim();
  return chu[0].toUpperCase() + chu.slice(1) + ' đồng' + (n % 1000000 === 0 ? ' chẵn' : '');
}
// du = có nhóm đứng trước (để đọc "không trăm", "lẻ").
function docNguyen(n, du) {
  if (n >= 1e9) {
    const ty = Math.floor(n / 1e9), con = n % 1e9;
    return docNguyen(ty, du) + ' tỷ' + (con ? ' ' + docNguyen(con, true) : '');
  }
  const nhom = [Math.floor(n / 1e6), Math.floor((n % 1e6) / 1000), n % 1000];
  const ten = [' triệu', ' nghìn', ''];
  const r = [];
  let truoc = du;
  nhom.forEach((g, i) => { if (g) { r.push(docBa(g, truoc) + ten[i]); } if (g || truoc) truoc = true; });
  return r.join(' ');
}
