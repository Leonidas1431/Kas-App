// Bàn giao – bảo hành (Thầy chốt 18/11/2026):
// 1. Biên bản bàn giao: hạng mục bàn giao (theo kế hoạch), tồn tại còn lại + hạn sửa, thiết bị (hãng, model, BH nhà sản xuất),
//    chìa khoá – giấy tờ – sách hướng dẫn đã giao, ảnh, chữ ký 2 bên. Không có tiền: giám sát lập được.
// 2. Bảo hành mặc định 12 tháng; từng hạng mục chính sửa riêng được (vd chống thấm 60 tháng).
// 3. Chủ nhà bấm "Đồng ý bàn giao" trên link, có thêm bản in để ký giấy.
// 4. Báo lỗi bảo hành: chủ nhà tự gửi trên link (kèm ảnh) hoặc Thầy/Đức nhập khi khách gọi.
// 5. Lỗi: báo Thầy + Đức, giao giám sát hoặc thầu đã làm hạng mục đó; hạn 3 ngày, khẩn (rò nước, chập điện) 24 giờ; xong phải có ảnh.
// 6. Trong hạn bảo hành không tính tiền; có phát sinh thì tuỳ chọn tính phí. Giám sát không thấy số tiền.
// 7. Báo trước 30 ngày khi hết bảo hành để gọi khách, gộp với lần chăm sóc tháng 12.
// 8. Bàn giao xong: tổng kết nghiệm thu + phát sinh → thanh toán thực tế cuối cùng → thanh lý hợp đồng.
import { addDays, diffDays } from './schedule.js';
import { day, taoMa } from './store.js';
import { addMonths, banGiao as banGiaoKhach, xongChamSoc } from './khach.js';
import { canNghiemThu, ketQuaViec, tonTaiMo } from './nghiemthu.js';
import { psCuaCongTrinh, daThuPS } from './phatsinh.js';
import { hdCuaCongTrinh, tinhDot, doiTrangThaiHD, DANG_HD } from './hopdong.js';

export const BH_MAC_DINH = 12;
export const HAN_XU_LY = 3;
export const HAN_KHAN = 1;
export const NHAC_HET_BH = 30;
// Chủ nhà chưa xác nhận biên bản sau bao nhiêu ngày thì nhắc văn phòng.
export const NHAC_CHO_KHACH = 2;
export const TT_BG = { NHAP: 'Đang soạn', CHO_KHACH: 'Chờ chủ nhà xác nhận', DONG_Y: 'Chủ nhà đã xác nhận' };
export const QUA_BG = { LINK: 'bấm Đồng ý trên link', GIAY: 'ký biên bản giấy' };
export const TT_BH = { MOI: 'Mới báo', DANG: 'Đang xử lý', XONG: 'Đã xong', KHONG: 'Không xử lý' };
export const GIAM_SAT = 'Giám sát';
// Danh mục giao nhận em đề xuất (Thầy chưa có mẫu biên bản). Sửa, thêm dòng được khi lập biên bản.
export const GIAO_NHAN_MAU = ['Chìa khoá cửa chính', 'Thẻ từ / remote cửa cuốn', 'Remote điều hòa, quạt, rèm', 'Sách hướng dẫn sử dụng thiết bị',
  'Phiếu bảo hành thiết bị (nhà sản xuất)', 'Bản vẽ hoàn công, sơ đồ điện nước'];
// Từ khoá lỗi khẩn: tự tick "khẩn" (Thầy vẫn bỏ tick được).
const KHAN = /rò|rỉ|thấm|tràn|ngập|vỡ ống|chập|cháy|giật|mất điện|nổ|sập|nứt kết cấu/i;
export const laKhan = (moTa) => KHAN.test(String(moTa || ''));

const tenNhom = (n) => String(n || '').replace(/\s*\(.*\)$/, '');
const sau = (a, b) => (a > b ? a : b);

/** Hạng mục chính để đặt thời hạn bảo hành: nhóm việc của kế hoạch, bỏ thiết kế và chuẩn bị mặt bằng. */
export function nhomChinh(ct) {
  return [...new Set((ct.viec || []).map((v) => tenNhom(v.nhom)))].filter((n) => n && !/^(Thiết kế|Chuẩn bị)/.test(n));
}

export const bgCua = (db, maCt) => (db.banGiao || []).find((b) => b.maCongTrinh === maCt && !b.xoa) || null;

function ghiBG(db, bg) {
  bg.capNhatLuc = new Date().toISOString();
  day(db, { loai: 'BG', bg });
}

function nhatKy(db, maCt, nguoi, tenViec, ghiChu, viec = '') {
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: maCt, viec, tenViec, nguoi, loai: 'BAN_GIAO', ghiChu, congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

/** Lập biên bản: hạng mục lấy theo kế hoạch (bảo hành 12 tháng), danh mục giao nhận mẫu. */
export function taoBienBan(db, ct, ngay, nguoi) {
  db.banGiao = db.banGiao || [];
  const daCo = bgCua(db, ct.ma);
  if (daCo) return daCo;
  const bg = {
    id: 'BG-' + ct.ma, maCongTrinh: ct.ma, ngay, nguoi,
    hangMucBH: nhomChinh(ct).map((nhom) => ({ nhom, thang: BH_MAC_DINH })),
    thietBi: [],
    giaoNhan: GIAO_NHAN_MAU.map((ten) => ({ ten, soLuong: '', da: false })),
    tonTai: [], ghiChu: '', soAnh: 0,
    trangThai: 'NHAP', guiLuc: '', khachLuc: '', khachQua: '', khachYKien: '', nhacHet: [], thanhLy: '', xoa: '',
  };
  db.banGiao.push(bg);
  ghiBG(db, bg);
  nhatKy(db, ct.ma, nguoi, 'Bàn giao', `Lập biên bản bàn giao ngày ${ngay}`);
  return bg;
}

export function suaBienBan(db, bg, thayDoi) {
  Object.assign(bg, thayDoi);
  ghiBG(db, bg);
}

/** Hạn bảo hành của 1 hạng mục (tháng = 0 là không bảo hành). Không có trong biên bản: mặc định 12 tháng. */
export function hanBaoHanh(bg, nhom) {
  const h = (bg.hangMucBH || []).find((x) => x.nhom === nhom);
  const thang = h ? Number(h.thang) || 0 : BH_MAC_DINH;
  return thang > 0 ? addMonths(bg.ngay, thang) : '';
}
export const hanThietBi = (bg, tb) => (Number(tb.thang) > 0 ? addMonths(bg.ngay, Number(tb.thang)) : '');
/** Ngày hết bảo hành thi công muộn nhất (để biết công trình còn trong bảo hành không). */
export const hetBaoHanh = (bg) => (bg.hangMucBH || []).reduce((m, h) => sau(m, hanBaoHanh(bg, h.nhom)), addMonths(bg.ngay, BH_MAC_DINH));

/** Các mốc hết bảo hành, gộp hạng mục cùng ngày: [{ den, nhom: [...] }]. */
export function mocHetHan(bg) {
  const m = new Map();
  for (const h of bg.hangMucBH || []) {
    const den = hanBaoHanh(bg, h.nhom);
    if (!den) continue;
    if (!m.has(den)) m.set(den, []);
    m.get(den).push(h.nhom);
  }
  return [...m.entries()].map(([den, nhom]) => ({ den, nhom })).sort((a, b) => a.den.localeCompare(b.den));
}

/** Gửi chủ nhà xác nhận: chụp lại danh sách tồn tại còn mở để in vào biên bản. */
export function guiChuNha(db, ct, bg, homNay, nguoi) {
  bg.tonTai = tonTaiMo(db, homNay, ct.ma).map(({ v, t }) => ({ noiDung: t.noiDung, hangMuc: v ? v.hangMuc : '', hanSua: t.hanSua }));
  bg.trangThai = 'CHO_KHACH';
  bg.guiLuc = new Date().toISOString();
  bg.khachLuc = ''; bg.khachQua = ''; bg.khachYKien = '';
  ghiBG(db, bg);
  nhatKy(db, ct.ma, nguoi, 'Bàn giao', 'Gửi biên bản bàn giao cho chủ nhà xác nhận');
}

/** Chủ nhà xác nhận (ký giấy, hoặc bấm trên link ở bản chạy thử). dongY = false: chủ nhà cần trao đổi thêm → về Đang soạn. */
export function khachXacNhan(db, bg, { dongY, qua, yKien = '' }, nguoi) {
  Object.assign(bg, { trangThai: dongY ? 'DONG_Y' : 'NHAP', khachLuc: new Date().toISOString(), khachQua: qua || 'GIAY', khachYKien: yKien });
  ghiBG(db, bg);
  nhatKy(db, bg.maCongTrinh, nguoi, 'Bàn giao', dongY ? `Chủ nhà xác nhận bàn giao (${QUA_BG[bg.khachQua] || bg.khachQua})` : `Chủ nhà cần trao đổi thêm${yKien ? ': ' + yKien : ''}`);
}

/**
 * Sau khi bàn giao: hồ sơ khách bắt đầu lịch chăm sóc 1/3/6/12 tháng (nếu chưa có), hạn bảo hành = mốc muộn nhất.
 * Chỉ văn phòng (sổ khách). Trả true khi vừa tạo lịch.
 */
export function batDauChamSoc(db, ct, bg, nguoi, homNay) {
  const kh = (db.khach || []).find((k) => k.ma === ct.maKhach);
  if (!kh || kh.banGiao) return false;
  banGiaoKhach(db, kh, bg.ngay, nguoi, homNay);
  return true;
}

// ---------- Phiếu bảo hành ----------
export const bhCuaCongTrinh = (db, maCt) => (db.baoHanh || []).filter((p) => p.maCongTrinh === maCt && !p.xoa)
  .sort((a, b) => String(b.ngayBao).localeCompare(String(a.ngayBao)) || String(b.ma).localeCompare(String(a.ma)));

const maTiep = (db, maCt) => {
  const so = (db.baoHanh || []).filter((p) => p.maCongTrinh === maCt).map((p) => Number(String(p.ma).replace(/\D/g, '')) || 0);
  return 'BH' + String((so.length ? Math.max(...so) : 0) + 1).padStart(2, '0');
};

/** Còn trong hạn bảo hành không, theo hạng mục khách báo (không chọn hạng mục: theo hạn mặc định). */
export function trongHan(bg, nhom, ngay) {
  if (!bg || !bg.ngay) return false;
  const den = nhom && (bg.hangMucBH || []).some((h) => h.nhom === nhom) ? hanBaoHanh(bg, nhom) : addMonths(bg.ngay, BH_MAC_DINH);
  return !!den && ngay <= den;
}

/** Thầu đã làm hạng mục đó (thầu làm nhiều việc nhất trong nhóm). Không có thì giao giám sát. */
export function goiYGiao(ct, nhom) {
  const dem = new Map();
  for (const v of ct.viec || []) if (tenNhom(v.nhom) === nhom && v.nhaThau) dem.set(v.nhaThau, (dem.get(v.nhaThau) || 0) + 1);
  return [...dem.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || GIAM_SAT;
}

export const hanXuLy = (ngay, khan) => addDays(ngay, khan ? HAN_KHAN : HAN_XU_LY);

const ghiBH = (db, p) => { p.capNhatLuc = new Date().toISOString(); day(db, { loai: 'BH', p }); };

/** Ghi 1 lỗi bảo hành (Thầy/Đức nhập khi khách gọi, hoặc giám sát ghi khi thấy). */
export function baoLoi(db, ct, { moTa, viTri = '', nhom = '', khan, ngay, giaoCho, soAnh = 0 }, nguoi) {
  db.baoHanh = db.baoHanh || [];
  const bg = bgCua(db, ct.ma);
  const k = khan === undefined ? laKhan(moTa) : !!khan;
  const th = trongHan(bg, nhom, ngay);
  const p = { id: 'BH-' + taoMa(), ma: maTiep(db, ct.ma), maCongTrinh: ct.ma, ngayBao: ngay, nguoiBao: nguoi, moTa, viTri, nhom, khan: k,
    han: hanXuLy(ngay, k), giaoCho: giaoCho || goiYGiao(ct, nhom), trangThai: 'MOI', trongHan: th, coPhi: !th, phi: 0,
    ketQua: '', ngayXong: '', soAnh: Number(soAnh) || 0, soAnhXong: 0, xoa: '' };
  db.baoHanh.push(p);
  ghiBH(db, p);
  nhatKy(db, ct.ma, nguoi, `Bảo hành ${p.ma}`, `Báo lỗi${k ? ' KHẨN' : ''}: ${moTa}${viTri ? ' (' + viTri + ')' : ''} · giao ${p.giaoCho}, hạn ${p.han}`, p.id);
  return p;
}

export function suaBH(db, p, thayDoi) {
  // Đổi khẩn mà không sửa hạn: hạn tính lại theo khẩn / thường.
  if ('khan' in thayDoi && !('han' in thayDoi) && !!thayDoi.khan !== !!p.khan) thayDoi = { ...thayDoi, han: hanXuLy(p.ngayBao, thayDoi.khan) };
  Object.assign(p, thayDoi);
  ghiBH(db, p);
}

export function nhanXuLy(db, p, nguoi) {
  p.trangThai = 'DANG';
  ghiBH(db, p);
  nhatKy(db, p.maCongTrinh, nguoi, `Bảo hành ${p.ma}`, `Đã nhận xử lý (${p.giaoCho})`, p.id);
}

/** Xong phải có ảnh (máy kiểm trước khi gọi). */
export function xongBH(db, p, { ngay, ketQua, soAnh }, nguoi) {
  Object.assign(p, { trangThai: 'XONG', ngayXong: ngay, ketQua: ketQua || '', soAnhXong: (Number(p.soAnhXong) || 0) + (Number(soAnh) || 0) });
  ghiBH(db, p);
  nhatKy(db, p.maCongTrinh, nguoi, `Bảo hành ${p.ma}`, `Đã xử lý xong${ketQua ? ': ' + ketQua : ''}`, p.id);
}

export function khongXuLy(db, p, lyDo, nguoi) {
  Object.assign(p, { trangThai: 'KHONG', ketQua: lyDo || '' });
  ghiBH(db, p);
  nhatKy(db, p.maCongTrinh, nguoi, `Bảo hành ${p.ma}`, `Không xử lý${lyDo ? ': ' + lyDo : ''}`, p.id);
}

export const daThuBH = (db, p) => (db.thuChi || []).filter((e) => !e.xoa && e.loai === 'THU' && e.thamChieu === p.id).reduce((s, e) => s + (Number(e.soTien) || 0), 0);
export const conThuBH = (db, p) => (p.coPhi ? Math.max(0, (Number(p.phi) || 0) - daThuBH(db, p)) : 0);
export const quaHanBH = (p, homNay) => (p.trangThai === 'MOI' || p.trangThai === 'DANG') && p.han < homNay;

/**
 * Việc bảo hành hôm nay.
 * - mo: phiếu chưa xong (quá hạn, khẩn lên trước). Giám sát thấy phiếu của công trình được giao.
 * - sapHet: mốc hết bảo hành trong 30 ngày tới, chưa gọi khách (văn phòng).
 * - choKhach: biên bản gửi chủ nhà quá 2 ngày chưa xác nhận (văn phòng).
 * - thuPhi: phiếu tính phí đã xong mà chưa thu đủ (văn phòng).
 * - thanhLy: đã bàn giao, hợp đồng chưa thanh lý (văn phòng).
 */
export function viecBHHomNay(db, homNay, vanPhong) {
  const coCT = (ma) => (db.congTrinh || []).find((c) => c.ma === ma);
  const mo = (db.baoHanh || []).filter((p) => !p.xoa && (p.trangThai === 'MOI' || p.trangThai === 'DANG') && coCT(p.maCongTrinh))
    .sort((a, b) => Number(quaHanBH(b, homNay)) - Number(quaHanBH(a, homNay)) || Number(!!b.khan) - Number(!!a.khan) || a.han.localeCompare(b.han));
  if (!vanPhong) return { mo, sapHet: [], choKhach: [], thuPhi: [], thanhLy: [] };
  const dsBG = (db.banGiao || []).filter((b) => !b.xoa && b.ngay && coCT(b.maCongTrinh));
  const sapHet = [];
  for (const bg of dsBG) {
    for (const m of mocHetHan(bg)) {
      const con = diffDays(homNay, m.den);
      if (con >= 0 && con <= NHAC_HET_BH && !(bg.nhacHet || []).includes(m.den)) sapHet.push({ ct: coCT(bg.maCongTrinh), bg, ...m, con });
    }
  }
  sapHet.sort((a, b) => a.den.localeCompare(b.den));
  const choKhach = dsBG.filter((b) => b.trangThai === 'CHO_KHACH' && b.guiLuc && diffDays(String(b.guiLuc).slice(0, 10), homNay) >= NHAC_CHO_KHACH);
  const thuPhi = (db.baoHanh || []).filter((p) => !p.xoa && p.trangThai === 'XONG' && conThuBH(db, p) > 0 && coCT(p.maCongTrinh));
  const thanhLy = dsBG.filter((b) => b.trangThai === 'DONG_Y' && hdCuaCongTrinh(db, b.maCongTrinh).some((h) => h.trangThai === 'HIEU_LUC'));
  return { mo, sapHet, choKhach, thuPhi, thanhLy };
}

/** Đã gọi khách trước khi hết bảo hành; gộp luôn lần chăm sóc tháng 12 nếu còn chưa làm. */
export function daNhacHetHan(db, ct, bg, den, ghiChu, nguoi, homNay) {
  bg.nhacHet = [...new Set([...(bg.nhacHet || []), den])];
  ghiBG(db, bg);
  nhatKy(db, ct.ma, nguoi, 'Bảo hành', `Đã gọi khách trước khi hết bảo hành ${den}${ghiChu ? ': ' + ghiChu : ''}`);
  const kh = (db.khach || []).find((k) => k.ma === ct.maKhach);
  const cs = kh && (kh.chamSoc || []).find((c) => !c.xong && c.thang === 12);
  if (cs && diffDays(homNay, cs.han) <= NHAC_HET_BH + 31) xongChamSoc(db, kh, 12, ['Gộp với nhắc hết bảo hành', ghiChu].filter(Boolean).join('. '), nguoi, homNay);
}

// ---------- Tổng kết, thanh toán cuối cùng, thanh lý hợp đồng (văn phòng) ----------
/**
 * Tổng kết cho thanh toán thực tế cuối cùng:
 * - nghiệm thu: việc thầu đã xong, đạt, còn tồn tại, chưa nghiệm thu;
 * - phát sinh: được làm (cộng vào quyết toán), không làm, còn treo chưa chốt;
 * - hợp đồng: giá trị ký + phụ lục − khấu trừ phí thiết kế; đã thu; còn phải thu.
 */
export function tongKet(db, ct, homNay) {
  const viecNT = (ct.viec || []).filter((v) => v.phanTram >= 100 && canNghiemThu(v)).map((v) => ({ v, r: ketQuaViec(db, ct, v) }));
  const dem = (k) => viecNT.filter((x) => x.r.tt === k).length;
  const chuaXong = (ct.viec || []).filter((v) => v.phanTram < 100 && !/^Thiết kế/.test(String(v.nhom || '')));
  const ps = psCuaCongTrinh(db, ct.ma);
  const duyet = ps.filter((p) => p.trangThai === 'DUYET');
  const psGia = duyet.reduce((s, p) => s + (Number(p.giaBan) || 0), 0);
  const psThu = duyet.reduce((s, p) => s + daThuPS(db, p), 0);
  const hd = hdCuaCongTrinh(db, ct.ma).filter((h) => h.trangThai !== 'DUNG').map((h) => {
    const th = tinhDot(h);
    const phuLuc = (h.phuLuc || []).reduce((s, p) => s + (Number(p.giaTri) || 0), 0);
    return { hd: h, ten: DANG_HD[h.dang] || h.dang, giaTriKy: Number(h.giaTri) || 0, phuLuc, truTK: th.tru, phaiThu: th.phaiThu, daThu: th.daThu, conLai: th.phaiThu - th.daThu };
  });
  const tongHD = hd.reduce((s, x) => s + x.phaiThu, 0);
  const daThuHD = hd.reduce((s, x) => s + x.daThu, 0);
  const phaiThu = tongHD + psGia;
  const daThu = daThuHD + psThu;
  const tonTai = tonTaiMo(db, homNay, ct.ma);
  const canhBao = [];
  if (chuaXong.length) canhBao.push(`${chuaXong.length} việc trong kế hoạch chưa báo 100%`);
  if (dem('CHUA')) canhBao.push(`${dem('CHUA')} việc thầu chưa nghiệm thu`);
  if (tonTai.length) canhBao.push(`${tonTai.length} tồn tại chưa sửa xong`);
  const treo = ps.filter((p) => p.trangThai === 'CHO_BAO_GIA' || p.trangThai === 'CHO_KHACH');
  if (treo.length) canhBao.push(`${treo.length} phát sinh chưa chốt (chưa báo giá hoặc khách chưa trả lời)`);
  const chuaLam = duyet.filter((p) => !p.daLam);
  if (chuaLam.length) canhBao.push(`${chuaLam.length} phát sinh được duyệt nhưng giám sát chưa báo làm xong`);
  return {
    nghiemThu: { tong: viecNT.length, dat: dem('DAT'), tonTai: dem('TON_TAI'), chua: dem('CHUA'), dsTonTai: tonTai, chuaXong },
    phatSinh: { duyet, khong: ps.filter((p) => p.trangThai === 'TU_CHOI'), treo, giaBan: psGia, daThu: psThu },
    hd, tong: { hd: tongHD, ps: psGia, phaiThu, daThu, conLai: phaiThu - daThu }, canhBao,
  };
}

/** Thanh lý xong: các hợp đồng đang thực hiện → Hoàn thành; công trình rời bảng tổng (bảo hành vẫn theo dõi). */
export function thanhLy(db, ct, bg, ngay, nguoi) {
  for (const h of hdCuaCongTrinh(db, ct.ma)) if (h.trangThai === 'HIEU_LUC') doiTrangThaiHD(db, h, 'XONG', { ngay }, nguoi);
  if (bg) { bg.thanhLy = ngay; ghiBG(db, bg); }
  nhatKy(db, ct.ma, nguoi, 'Thanh lý', `Quyết toán, thanh lý hợp đồng ngày ${ngay}`);
}

// ---------- Tin nhắn Zalo ----------
export const tinGuiBienBan = (ct, link) => `KAS Houzing gửi anh/chị biên bản bàn giao công trình ${ct.ten}.\nAnh/chị xem hạn bảo hành từng hạng mục, thiết bị và giấy tờ đã nhận, rồi bấm "Đồng ý bàn giao" ở mục Bàn giao trong link: ${link}\nSau này có lỗi cần bảo hành, anh/chị bấm "Báo lỗi bảo hành" ngay trong link này, kèm ảnh giúp bên em ạ.`;
export const tinGiaoBH = (p, ct) => `KAS nhờ xử lý bảo hành ${p.ma} công trình ${ct.ten}${ct.diaChi ? ' (' + ct.diaChi + ')' : ''}:\n${p.moTa}${p.viTri ? '\nVị trí: ' + p.viTri : ''}\n${p.khan ? 'KHẨN, ' : ''}hạn xử lý ${p.han.slice(8, 10)}/${p.han.slice(5, 7)}. Xong chụp ảnh gửi KAS giúp.`;
export function tinThanhToanCuoi(ct, kq, soTK) {
  const t = (n) => (Number(n) || 0).toLocaleString('vi-VN') + ' đ';
  return `KAS Houzing kính gửi anh/chị quyết toán công trình ${ct.ten}:\n${kq.hd.map((x) => `- HĐ ${x.hd.soHD}: ${t(x.phaiThu)}`).join('\n')}${kq.tong.ps ? `\n- Phát sinh đã duyệt: ${t(kq.tong.ps)}` : ''}\nTổng quyết toán: ${t(kq.tong.phaiThu)}\nĐã thanh toán: ${t(kq.tong.daThu)}\nCòn lại: ${t(kq.tong.conLai)}${soTK && kq.tong.conLai > 0 ? `\nThông tin chuyển khoản:\n${soTK}\nNội dung chuyển khoản: ${ct.ma} quyet toan` : ''}\nTrân trọng cảm ơn anh/chị.`;
}
