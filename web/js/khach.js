// Sổ khách hàng: bước A (tiếp cận), B (tư vấn, báo giá), C (ký) và chăm sóc sau bán.
// Chỉ văn phòng (Thầy, Đức) thấy. Mọi thay đổi vào hàng chờ như công trình.
import { addDays } from './schedule.js';
import { day, taoMa } from './store.js';

// Thứ tự = hàng trạng thái khách đi qua. KY, MAT, TAM_HOAN là điểm dừng.
export const TRANG_THAI = {
  MOI: 'Mới',
  LIEN_HE: 'Đã liên hệ',
  HEN_GAP: 'Hẹn gặp',
  KHAO_SAT: 'Đã khảo sát',
  BAO_GIA: 'Đã báo giá',
  KY: 'Đã ký',
  TAM_HOAN: 'Tạm hoãn',
  MAT: 'Mất khách',
};
export const DANG_THEO = ['MOI', 'LIEN_HE', 'HEN_GAP', 'KHAO_SAT', 'BAO_GIA'];
// Kênh Thầy chốt 13/11: Facebook, TikTok, Google Ads, Website, SEO, AI SEO, Offline; cộng các nguồn giới thiệu và Sổ cái.
// Khách cũ ghi "Facebook / Zalo" vẫn giữ nguyên, báo cáo hiện đúng tên đó.
export const NGUON = ['Người quen giới thiệu', 'Khách cũ giới thiệu', 'Đối tác giới thiệu', 'Khách cũ quay lại', 'Facebook', 'TikTok', 'Google Ads', 'Website', 'SEO',
  'AI SEO', 'Offline', 'Zalo', 'Google Maps', 'Đi ngang công trình', 'Khác'];
export const LY_DO_MAT = ['Giá cao', 'Chọn đơn vị khác', 'Chưa có tiền / hoãn dự án', 'Ngoài phân khúc', 'Ở xa', 'Không liên lạc được', 'Khác'];
export const NHU_CAU_LOAI = { TK: 'Chỉ thiết kế', XM: 'Xây mới', CT: 'Cải tạo', NTCT: 'Nội thất có cải tạo thô', NT: 'Nội thất riêng', CHI_TC: 'Chỉ thi công (đã có bản vẽ)' };
// "Bảng yêu cầu thông tin" (bước A2 trong QUY TRÌNH TỔNG)
export const O_NHU_CAU = [
  ['diaDiem', 'Địa điểm công trình'],
  ['dienTich', 'Diện tích (m²), số tầng, số phòng'],
  ['hienTrang', 'Hiện trạng'],
  ['phongCach', 'Phong cách, sở thích'],
  ['nganSach', 'Ngân sách dự kiến'],
  ['thoiGian', 'Thời gian mong muốn'],
  ['dacBiet', 'Yếu tố đặc biệt (hướng, tuổi, người già, trẻ nhỏ…)'],
];

// Nhắc gọi lại (Thầy chốt 12/11): lần 1 sau 2 ngày, lần 2 sau 1 tuần, rồi chuyển Tạm hoãn.
export const NHAC_LAN_1 = 2;
export const NHAC_LAN_2 = 7;
// Tạm hoãn vẫn nhắc lại sau 30 ngày để không trôi mất khách (Thầy sửa được ngày).
export const NHAC_TAM_HOAN = 30;
// Chăm sóc sau bán: 1, 3, 6, 12 tháng sau bàn giao. Bảo hành thi công mặc định 12 tháng.
export const MOC_CHAM_SOC = [1, 3, 6, 12];
export const BAO_HANH_THANG = 12;

const boDau = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
const XUNG_HO = new Set(['ANH', 'CHI', 'CO', 'CHU', 'BAC', 'ONG', 'BA', 'EM', 'A', 'C']);

// Mã khách: KH-YYMM-TÊN (không dấu, tối đa 10 ký tự). Trùng thì thêm -2, -3…
export function taoMaKhach(ds, ten, homNay) {
  const chu = boDau(ten).toUpperCase().split(/[^A-Z0-9]+/).filter((w) => w && !XUNG_HO.has(w));
  const ngan = (chu.join('') || 'KHACH').slice(0, 10);
  const goc = `KH-${homNay.slice(2, 4)}${homNay.slice(5, 7)}-${ngan}`;
  let ma = goc;
  for (let i = 2; ds.some((k) => k.ma === ma); i++) ma = `${goc}-${i}`;
  return ma;
}

export function addMonths(ngay, n) {
  const [y, m, d] = ngay.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1 + n, 1));
  const cuoi = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  t.setUTCDate(Math.min(d, cuoi));
  return t.toISOString().slice(0, 10);
}

function ghiKhach(db, kh, homNay) {
  kh.capNhatLuc = new Date().toISOString();
  day(db, { loai: 'KHACH', khach: kh });
}

function nhatKy(db, kh, nguoi, loai, ghiChu, them = {}) {
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: kh.ma, viec: '', tenViec: kh.ten, nguoi, loai, ghiChu: ghiChu || '', congKhai: false, ...them };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

export function taoKhach(db, du, nguoi, homNay) {
  db.khach = db.khach || [];
  const kh = {
    ma: taoMaKhach(db.khach, du.ten, homNay),
    ten: du.ten.trim(),
    sdt: (du.sdt || '').replace(/\s+/g, ''),
    diaChi: du.diaChi || '',
    nguon: du.nguon || NGUON[0],
    nguoiGioiThieu: du.nguoiGioiThieu || '',
    sdtGioiThieu: (du.sdtGioiThieu || '').replace(/\s+/g, ''),
    hoaHong: { soTien: 0, daTra: false, ghiChu: '' },
    nhuCau: { loai: du.loai || '', tomTat: du.tomTat || '' },
    trangThai: 'MOI',
    lyDo: '',
    nhacGoi: homNay,
    soLanNhac: 0,
    baoGia: [],
    maCongTrinh: '',
    banGiao: '',
    chamSoc: [],
    baoHanhDen: '',
    nguoiTao: nguoi,
    taoLuc: new Date().toISOString(),
    ngayVao: du.ngayVao || homNay,
  };
  db.khach.push(kh);
  ghiKhach(db, kh, homNay);
  if (du.tomTat) nhatKy(db, kh, nguoi, 'KH_GHI', du.tomTat);
  return kh;
}

export function timTheoSdt(db, sdt) {
  const s = String(sdt || '').replace(/\D/g, '');
  if (s.length < 8) return null;
  return (db.khach || []).find((k) => String(k.sdt).replace(/\D/g, '').endsWith(s.slice(-9))) || null;
}

export function suaKhach(db, kh, thayDoi, homNay) {
  Object.assign(kh, thayDoi);
  ghiKhach(db, kh, homNay);
}

// Chuyển trạng thái. Đặt lịch nhắc theo quy tắc.
export function doiTrangThai(db, kh, tt, nguoi, homNay, { lyDo = '', henLai = '', ghiChu = '' } = {}) {
  const cu = kh.trangThai;
  kh.trangThai = tt;
  kh.soLanNhac = 0;
  kh.lyDo = tt === 'MAT' || tt === 'TAM_HOAN' ? lyDo : '';
  if (tt === 'KY' || tt === 'MAT') kh.nhacGoi = '';
  else if (tt === 'HEN_GAP') kh.nhacGoi = henLai || homNay;
  else if (tt === 'TAM_HOAN') kh.nhacGoi = henLai || addDays(homNay, NHAC_TAM_HOAN);
  else kh.nhacGoi = henLai || addDays(homNay, NHAC_LAN_1);
  ghiKhach(db, kh, homNay);
  nhatKy(db, kh, nguoi, 'KH_TT', ghiChu, { cu, moi: tt, nguyenNhan: kh.lyDo });
}

// Đã gọi/nhắn khách. Có tiến triển: đổi trạng thái riêng. Chưa: nhắc lần 2 sau 1 tuần, lần nữa thì Tạm hoãn.
export function daGoi(db, kh, coTienTrien, ghiChu, nguoi, homNay) {
  nhatKy(db, kh, nguoi, 'KH_GOI', ghiChu, { moi: coTienTrien ? 'CO' : 'CHUA' });
  if (coTienTrien) {
    kh.soLanNhac = 0;
    kh.nhacGoi = addDays(homNay, NHAC_LAN_1);
    ghiKhach(db, kh, homNay);
    return 'NHAC';
  }
  kh.soLanNhac = (Number(kh.soLanNhac) || 0) + 1;
  if (kh.soLanNhac >= 2) {
    doiTrangThai(db, kh, 'TAM_HOAN', nguoi, homNay, { lyDo: 'Không phản hồi sau 2 lần nhắc' });
    return 'TAM_HOAN';
  }
  kh.nhacGoi = addDays(homNay, NHAC_LAN_2);
  ghiKhach(db, kh, homNay);
  return 'NHAC';
}

export function ghiChuKhach(db, kh, noiDung, nguoi) {
  nhatKy(db, kh, nguoi, 'KH_GHI', noiDung);
}

// Mỗi lần báo giá là 1 bản mới, giữ bản cũ. Báo giá xong thì chuyển "Đã báo giá" nếu chưa tới.
export function themBaoGia(db, kh, { giaTri, link, ghiChu }, nguoi, homNay) {
  const bg = { id: taoMa(), phienBan: kh.baoGia.length + 1, ngay: homNay, giaTri: Number(giaTri) || 0, link: link || '', ghiChu: ghiChu || '', khachChot: false };
  kh.baoGia.push(bg);
  if (DANG_THEO.indexOf(kh.trangThai) < DANG_THEO.indexOf('BAO_GIA') && DANG_THEO.includes(kh.trangThai)) {
    doiTrangThai(db, kh, 'BAO_GIA', nguoi, homNay, { ghiChu: `Báo giá v${bg.phienBan}` });
  } else {
    ghiKhach(db, kh, homNay);
  }
  return bg;
}

export function chotBaoGia(db, kh, idBg, homNay) {
  kh.baoGia.forEach((b) => { b.khachChot = b.id === idBg; });
  ghiKhach(db, kh, homNay);
}

// Ký xong và đã tạo công trình: gắn mã công trình vào hồ sơ khách.
export function ganCongTrinh(db, kh, maCt, nguoi, homNay) {
  kh.maCongTrinh = maCt;
  if (kh.trangThai !== 'KY') doiTrangThai(db, kh, 'KY', nguoi, homNay, { ghiChu: 'Tạo công trình ' + maCt });
  else ghiKhach(db, kh, homNay);
}

// Bàn giao: tạo lịch chăm sóc 1/3/6/12 tháng và hạn bảo hành thi công.
export function banGiao(db, kh, ngay, nguoi, homNay) {
  kh.banGiao = ngay;
  kh.baoHanhDen = addMonths(ngay, BAO_HANH_THANG);
  kh.chamSoc = MOC_CHAM_SOC.map((t) => ({ thang: t, han: addMonths(ngay, t), xong: '', ghiChu: '' }));
  ghiKhach(db, kh, homNay);
  nhatKy(db, kh, nguoi, 'KH_GHI', `Bàn giao ${ngay}. Bảo hành thi công đến ${kh.baoHanhDen}.`);
}

export function xongChamSoc(db, kh, thang, ghiChu, nguoi, homNay) {
  const m = kh.chamSoc.find((c) => c.thang === thang);
  if (!m) return;
  m.xong = homNay;
  m.ghiChu = ghiChu || '';
  ghiKhach(db, kh, homNay);
  nhatKy(db, kh, nguoi, 'KH_CS', ghiChu, { moi: thang });
}

// Việc với khách cần làm hôm nay: gọi lại đến hạn, chăm sóc sau bán đến hạn (trước 3 ngày), hoa hồng chưa trả.
export function viecKhachHomNay(db, homNay) {
  const ds = db.khach || [];
  const goi = ds.filter((k) => k.nhacGoi && k.nhacGoi <= homNay && k.trangThai !== 'KY' && k.trangThai !== 'MAT')
    .sort((a, b) => a.nhacGoi.localeCompare(b.nhacGoi));
  const sap = addDays(homNay, 3);
  const chamSoc = [];
  for (const k of ds) for (const c of k.chamSoc || []) if (!c.xong && c.han <= sap) chamSoc.push({ k, c });
  chamSoc.sort((a, b) => a.c.han.localeCompare(b.c.han));
  const hoaHong = ds.filter((k) => k.trangThai === 'KY' && k.nguoiGioiThieu && !(k.hoaHong && k.hoaHong.daTra));
  return { goi, chamSoc, hoaHong };
}

// Đếm theo trạng thái và theo nguồn, để biết khách đến từ đâu và rơi ở bước nào.
export function thongKe(db) {
  const ds = db.khach || [];
  const theoTT = Object.fromEntries(Object.keys(TRANG_THAI).map((t) => [t, 0]));
  ds.forEach((k) => { theoTT[k.trangThai] = (theoTT[k.trangThai] || 0) + 1; });
  const theoNguon = {};
  ds.forEach((k) => {
    const n = theoNguon[k.nguon] || (theoNguon[k.nguon] = { tong: 0, ky: 0 });
    n.tong++;
    if (k.trangThai === 'KY') n.ky++;
  });
  return { theoTT, theoNguon };
}
