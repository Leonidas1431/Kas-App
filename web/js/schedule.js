// Bộ xếp lịch: ngày làm việc theo lịch nghỉ của từng công trình + ràng buộc trước–sau.
// Ngày luôn là chuỗi 'YYYY-MM-DD', tính theo UTC để không lệch múi giờ.

export const LICH = {
  NGHI_CN: 'Nghỉ Chủ nhật',
  NGHI_T7_CN: 'Nghỉ T7 + CN',
  NGHI_CHIEU_T7_CN: 'Nghỉ chiều T7 + CN',
  LAM_XUYEN: 'Làm xuyên',
};

export const KIEU_NOI = { XS: 'Xong mới làm', GD: 'Gối đầu', CC: 'Cuốn chiếu' };

// Ngày lễ dương lịch cố định. Lễ âm lịch (Tết, Giỗ Tổ) Thầy nhập theo từng năm trong cài đặt.
export const LE_DUONG_LICH = ['01-01', '04-30', '05-01', '09-02'];

const MS = 86400000;
export const toDate = (s) => new Date(s + 'T00:00:00Z');
export const fmt = (d) => d.toISOString().slice(0, 10);
export const addDays = (s, n) => fmt(new Date(toDate(s).getTime() + n * MS));
export const diffDays = (a, b) => Math.round((toDate(b) - toDate(a)) / MS);

// Sức làm của 1 ngày: 1 = cả ngày, 0.5 = nửa ngày, 0 = nghỉ.
export function sucLam(ngay, lich) {
  if (lich.nghi && lich.nghi.includes(ngay)) return 0;
  const thu = toDate(ngay).getUTCDay(); // 0 = CN, 6 = T7
  switch (lich.kieu) {
    case 'LAM_XUYEN': return 1;
    case 'NGHI_T7_CN': return thu === 0 || thu === 6 ? 0 : 1;
    case 'NGHI_CHIEU_T7_CN': return thu === 0 ? 0 : thu === 6 ? 0.5 : 1;
    case 'NGHI_CN':
    default: return thu === 0 ? 0 : 1;
  }
}

// Ngày làm việc đầu tiên từ `ngay` trở đi.
export function ngayLamTiepTheo(ngay, lich) {
  let d = ngay;
  for (let i = 0; i < 400 && sucLam(d, lich) === 0; i++) d = addDays(d, 1);
  return d;
}

// Bắt đầu `batDau`, làm đủ `soNgay` ngày công → trả về ngày kết thúc (tính cả ngày đó).
export function ngayKetThuc(batDau, soNgay, lich) {
  let d = ngayLamTiepTheo(batDau, lich);
  if (soNgay <= 0) return d;
  let con = soNgay - sucLam(d, lich);
  while (con > 1e-9) {
    d = addDays(d, 1);
    con -= sucLam(d, lich);
  }
  return d;
}

// Lùi/tiến `soNgay` ngày công tính từ `ngay` (0 = chính ngày làm việc đó).
export function congNgayLam(ngay, soNgay, lich) {
  let d = ngayLamTiepTheo(ngay, lich);
  let con = soNgay;
  while (con > 1e-9) {
    d = addDays(d, 1);
    con -= sucLam(d, lich);
  }
  return ngayLamTiepTheo(d, lich);
}

/**
 * Xếp lịch cho danh sách việc.
 * viec: { id, soNgay, diSau: [{ id, kieu: 'XS'|'GD'|'CC', goi }], batDauCoDinh?, thucTe?: { batDau?, ketThuc? } }
 * Việc đã có ngày thực tế thì dùng ngày thực tế để đẩy các việc sau.
 * Trả về Map id → { batDau, ketThuc }.
 */
export function xepLich(viec, khoiCong, lich) {
  const theoId = new Map(viec.map((v) => [v.id, v]));
  const kq = new Map();
  const dangXet = new Set();

  const tinh = (id) => {
    if (kq.has(id)) return kq.get(id);
    if (dangXet.has(id)) throw new Error(`Ràng buộc vòng tròn tại việc ${id}`);
    dangXet.add(id);
    const v = theoId.get(id);
    let bd = v.batDauCoDinh || khoiCong;
    for (const p of v.diSau || []) {
      if (!theoId.has(p.id)) continue;
      const t = tinh(p.id);
      const goi = Number(p.goi) || 0;
      const moc = p.kieu === 'XS' ? congNgayLam(t.ketThuc, 1, lich) : t.batDau;
      const bdTheoP = goi ? congNgayLam(moc, goi, lich) : moc;
      if (!v.batDauCoDinh && bdTheoP > bd) bd = bdTheoP;
    }
    const thucTe = v.thucTe || {};
    const batDau = thucTe.batDau || ngayLamTiepTheo(bd, lich);
    const ketThuc = thucTe.ketThuc || ngayKetThuc(batDau, v.soNgay, lich);
    const r = { batDau, ketThuc };
    dangXet.delete(id);
    kq.set(id, r);
    return r;
  };

  for (const v of viec) tinh(v.id);
  return kq;
}

// Các ngày lễ dương lịch rơi vào khoảng [tu, den] mà chưa có trong danh sách nghỉ → cần hỏi Thầy.
export function leCanHoi(tu, den, lich) {
  const out = [];
  for (let y = +tu.slice(0, 4); y <= +den.slice(0, 4); y++) {
    for (const md of [...LE_DUONG_LICH, ...(lich.leThem || [])]) {
      const d = md.length === 5 ? `${y}-${md}` : md;
      if (d >= tu && d <= den && !(lich.nghi || []).includes(d) && !(lich.daHoi || []).includes(d)) out.push(d);
    }
  }
  return [...new Set(out)].sort();
}

/**
 * Tạo kế hoạch công trình từ thư viện hạng mục.
 * `loai` là một trong TK, XM, CT, NTCT, NT. `diSau` dạng "A|B": lấy A nếu có, không thì B.
 */
export function taoTuThuVien(thuVien, loai) {
  const chon = thuVien.filter((r) => r.loai.split(/\s+/).includes(loai));
  const co = new Set(chon.map((r) => r.ma));
  return chon.map((r, i) => {
    const pred = (r.di_sau || '').split('|').find((m) => co.has(m));
    return {
      id: r.ma,
      thuTu: i,
      nhom: r.nhom,
      hangMuc: r.hang_muc,
      dauViec: r.dau_viec,
      dvt: r.dvt,
      khoiLuong: null,
      soNgay: Number(r.so_ngay) || 1,
      diSau: pred ? [{ id: pred, kieu: r.kieu || 'XS', goi: Number(r.goi) || 0 }] : [],
      moc: r.moc || '',
      phanTram: 0,
      trangThai: 'CHUA',
    };
  });
}
