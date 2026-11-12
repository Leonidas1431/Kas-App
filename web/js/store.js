// Kho dữ liệu phía máy. Mọi thay đổi vừa ghi vào máy vừa vào hàng chờ `outbox`;
// api.js gửi hàng chờ lên Apps Script khi có mạng. Mỗi mục có id nên gửi lại không bị trùng.
import { xepLich, taoTuThuVien, ngayLamTiepTheo, sucLam, addDays } from './schedule.js';

const KEY = 'kas-app-v1';

export const NGUYEN_NHAN = ['Chủ nhà', 'Thầu phụ', 'Vật tư', 'Thiết kế', 'Thời tiết', 'Phát sinh', 'Nội bộ KAS', 'Khác'];
export const LOAI_HINH = { TK: 'Thiết kế', XM: 'Xây mới', CT: 'Cải tạo', NTCT: 'Nội thất có cải tạo thô', NT: 'Nội thất riêng' };
export const VAI_TRO = { THAY: 'Thầy', DUC: 'Đức', KHA: 'Giám sát', TAM: 'Quyền tạm' };
// Văn phòng: toàn quyền, thấy tiền và sổ khách. Giám sát, quyền tạm: chỉ công trình được giao.
export const VAN_PHONG = ['THAY', 'DUC'];

export const rong = () => ({ congTrinh: [], lichSu: [], outbox: [], nguoiDung: [], khach: [], hopDong: [], phuongAn: [], gstg: [] });

export function doc() {
  try { return { ...rong(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return rong(); }
}

export function ghi(db) {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* bộ nhớ đầy hoặc bị chặn: vẫn chạy trong phiên */ }
}

export const taoMa = () => Math.random().toString(36).slice(2, 10);

export function taoCongTrinh(db, thuVien, { ma, ten, loai, khoiCong, lich, chuNha, thuMucDrive, maKhach }) {
  const viec = taoTuThuVien(thuVien, loai);
  const ct = { ma, ten, loai, khoiCong, lich, chuNha: chuNha || '', thuMucDrive: thuMucDrive || '', maKhach: maKhach || '', maLinkChuNha: taoMa() + taoMa(), viec, taoLuc: new Date().toISOString() };
  const lichGoc = xepLich(viec, khoiCong, lich);
  for (const v of viec) v.goc = lichGoc.get(v.id);
  db.congTrinh.push(ct);
  day(db, { loai: 'TAO_CT', ct });
  return ct;
}

// Ngày hiện tại của từng việc, tính lại từ số ngày, ràng buộc và ngày thực tế.
export function lichHienTai(ct) {
  return xepLich(ct.viec, ct.khoiCong, ct.lich);
}

export function capNhatTienDo(db, ct, viecId, phanTram, nguoi, homNay) {
  const v = ct.viec.find((x) => x.id === viecId);
  const cu = v.phanTram;
  v.phanTram = phanTram;
  v.thucTe = v.thucTe || {};
  if (phanTram > 0 && !v.thucTe.batDau) {
    // Chưa bấm "bắt đầu" mà báo luôn %: lấy ngày bắt đầu theo lịch nếu đã qua, không thì hôm nay.
    const kh = lichHienTai(ct).get(viecId).batDau;
    v.thucTe.batDau = kh < homNay ? kh : homNay;
  }
  if (phanTram >= 100) { v.thucTe.ketThuc = homNay; v.trangThai = 'XONG'; }
  else { delete v.thucTe.ketThuc; v.trangThai = phanTram > 0 ? 'DANG' : 'CHUA'; }
  day(db, { loai: 'VIEC', ma: ct.ma, viec: v });
  ghiLichSu(db, ct, v, nguoi, { loai: 'TIEN_DO', cu, moi: phanTram });
}

// Báo chậm: kéo dài việc thêm `soNgay`, các việc sau tự lùi. Giữ nguyên ngày gốc để so.
export function baoCham(db, ct, viecId, { soNgay, nguyenNhan, ghiChu }, nguoi) {
  const v = ct.viec.find((x) => x.id === viecId);
  const cu = v.soNgay;
  v.soNgay = cu + Number(soNgay);
  day(db, { loai: 'VIEC', ma: ct.ma, viec: v });
  ghiLichSu(db, ct, v, nguoi, { loai: 'CHAM', cu, moi: v.soNgay, nguyenNhan, ghiChu, congKhai: false });
}

export function ghiChu(db, ct, viecId, noiDung, nguoi, phatSinh) {
  const v = ct.viec.find((x) => x.id === viecId);
  ghiLichSu(db, ct, v, nguoi, { loai: phatSinh ? 'PHAT_SINH' : 'GHI_CHU', ghiChu: noiDung, congKhai: false });
}

function ghiLichSu(db, ct, v, nguoi, chiTiet) {
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: ct.ma, viec: v.id, tenViec: v.hangMuc, nguoi, ...chiTiet };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

// Thầy bật/tắt cho chủ nhà thấy một lần báo chậm.
export function datCongKhai(db, idLichSu, congKhai) {
  const e = db.lichSu.find((x) => x.id === idLichSu);
  if (!e) return;
  e.congKhai = congKhai;
  day(db, { loai: 'CONG_KHAI', id: idLichSu, congKhai });
}

export function day(db, thayDoi) {
  // Gửi bản sao để sửa tiếp trên máy không làm đổi mục đang chờ gửi.
  db.outbox.push(JSON.parse(JSON.stringify({ ...thayDoi, idGui: taoMa() + taoMa(), luc: new Date().toISOString() })));
}

// Đã làm được bao nhiêu % (theo ngày công) so với kế hoạch tính đến hôm nay.
export function tongHop(ct, homNay) {
  const lich = lichHienTai(ct);
  let tong = 0, thucTe = 0, keHoach = 0, tre = 0;
  for (const v of ct.viec) {
    const w = v.soNgay;
    tong += w;
    thucTe += (w * v.phanTram) / 100;
    keHoach += w * tyLeKeHoach(v.goc, homNay, ct.lich);
    const hien = lich.get(v.id);
    if (v.phanTram < 100 && hien.ketThuc < homNay) tre++;
  }
  const ketThuc = [...lich.values()].reduce((m, x) => (x.ketThuc > m ? x.ketThuc : m), ct.khoiCong);
  const ketThucGoc = ct.viec.reduce((m, v) => (v.goc.ketThuc > m ? v.goc.ketThuc : m), ct.khoiCong);
  return {
    pctThucTe: tong ? Math.round((thucTe / tong) * 100) : 0,
    pctKeHoach: tong ? Math.round((keHoach / tong) * 100) : 0,
    viecTre: tre,
    ketThuc,
    ketThucGoc,
    lich,
  };
}

function tyLeKeHoach(goc, homNay, lichNghi) {
  if (homNay < goc.batDau) return 0;
  if (homNay >= goc.ketThuc) return 1;
  let da = 0, tong = 0;
  for (let d = goc.batDau; d <= goc.ketThuc; d = addDays(d, 1)) {
    const s = sucLam(d, lichNghi);
    tong += s;
    if (d <= homNay) da += s;
  }
  return tong ? da / tong : 0;
}

// Việc cần quan tâm hôm nay: đang chạy, sắp bắt đầu trong 3 ngày, hoặc đã trễ.
export function viecHomNay(ct, homNay) {
  const lich = lichHienTai(ct);
  const sap = addDays(homNay, 3);
  const out = [];
  for (const v of ct.viec) {
    if (v.phanTram >= 100) continue;
    const t = lich.get(v.id);
    const tre = t.ketThuc < homNay;
    const dang = t.batDau <= homNay && !tre;
    const sapToi = t.batDau > homNay && t.batDau <= sap;
    if (tre || dang || sapToi) out.push({ v, t, nhan: tre ? 'TRE' : dang ? 'DANG' : 'SAP' });
  }
  const thuTu = { TRE: 0, DANG: 1, SAP: 2 };
  return out.sort((a, b) => thuTu[a.nhan] - thuTu[b.nhan] || a.t.batDau.localeCompare(b.t.batDau));
}

export { ngayLamTiepTheo };
