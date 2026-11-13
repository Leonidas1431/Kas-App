// Lead, marketing: khách đến từ đâu, chốt được bao nhiêu, tốn bao nhiêu tiền quảng cáo cho mỗi khách; người giới thiệu và hoa hồng.
// Chi marketing lấy từ sổ thu chi: hạng mục "CTY - Marketing", ô Đối tượng ghi đúng tên kênh (vd "Facebook / Zalo").
import { NGUON } from './khach.js';
import { hdCuaKhach } from './hopdong.js';

export const HM_MKT = 'CTY - Marketing';
// Kênh có thể tốn tiền quảng cáo (không tính các nguồn giới thiệu, khách quay lại, đi ngang).
export const KENH_MKT = NGUON.filter((n) => !/giới thiệu|quay lại|Đi ngang/i.test(n));
export const CHUA_GAN = 'Chưa ghi kênh';

/** Ngày khách vào (ngày liên hệ đầu tiên). Khách cũ chưa có thì lấy ngày tạo. */
export const ngayVao = (k) => k.ngayVao || String(k.taoLuc || '').slice(0, 10);

/** Giá trị HĐ đã ký của khách (không tính HĐ dừng), gồm phụ lục. */
export function giaTriKy(db, k) {
  return hdCuaKhach(db, k.ma).filter((h) => h.trangThai !== 'DUNG')
    .reduce((s, h) => s + (Number(h.giaTri) || 0) + (h.phuLuc || []).reduce((a, p) => a + (Number(p.giaTri) || 0), 0), 0);
}
const daKy = (db, k) => k.trangThai === 'KY' || hdCuaKhach(db, k.ma).length > 0;
const trongKy = (ngay, tu, den) => (!tu || ngay >= tu) && (!den || ngay <= den);

/** Kỳ báo cáo: THANG (tháng này), QUY (3 tháng gần nhất), NAM (năm nay), TAT (tất cả). */
export function khoangKy(ky, homNay) {
  const [y, m] = homNay.split('-').map(Number);
  if (ky === 'THANG') return [`${homNay.slice(0, 7)}-01`, homNay];
  if (ky === 'QUY') { const d = new Date(Date.UTC(y, m - 3, 1)); return [d.toISOString().slice(0, 10), homNay]; }
  if (ky === 'NAM') return [`${y}-01-01`, homNay];
  return ['', ''];
}

/**
 * Báo cáo theo nguồn cho khách VÀO trong kỳ: số khách, đã ký, tỉ lệ, giá trị HĐ;
 * chi marketing ghi trong kỳ theo kênh, chi phí trên mỗi khách và mỗi khách ký.
 */
export function baoCaoNguon(db, tu, den) {
  const khach = (db.khach || []).filter((k) => trongKy(ngayVao(k), tu, den));
  const chi = (db.thuChi || []).filter((e) => !e.xoa && e.loai === 'CHI' && e.hangMuc === HM_MKT && trongKy(e.ngay, tu, den));
  const theo = new Map();
  const lay = (n) => { if (!theo.has(n)) theo.set(n, { nguon: n, moi: 0, ky: 0, mat: 0, giaTri: 0, chi: 0 }); return theo.get(n); };
  for (const k of khach) {
    const r = lay(k.nguon || 'Khác');
    r.moi++;
    if (daKy(db, k)) { r.ky++; r.giaTri += giaTriKy(db, k); }
    if (k.trangThai === 'MAT') r.mat++;
  }
  for (const e of chi) lay(NGUON.includes(String(e.doiTuong || '').trim()) ? e.doiTuong.trim() : CHUA_GAN).chi += Number(e.soTien) || 0;
  const ds = [...theo.values()].map((r) => ({
    ...r,
    tyLe: r.moi ? Math.round((r.ky / r.moi) * 100) : null,
    chiMoiKhach: r.chi && r.moi ? Math.round(r.chi / r.moi) : null,
    chiMoiKy: r.chi && r.ky ? Math.round(r.chi / r.ky) : null,
  })).sort((a, b) => b.moi - a.moi || b.chi - a.chi);
  const tong = ds.reduce((t, r) => ({ moi: t.moi + r.moi, ky: t.ky + r.ky, mat: t.mat + r.mat, giaTri: t.giaTri + r.giaTri, chi: t.chi + r.chi }), { moi: 0, ky: 0, mat: 0, giaTri: 0, chi: 0 });
  tong.tyLe = tong.moi ? Math.round((tong.ky / tong.moi) * 100) : null;
  tong.chiMoiKhach = tong.chi && tong.moi ? Math.round(tong.chi / tong.moi) : null;
  // Phễu và lý do mất của khách vào trong kỳ.
  const pheu = {};
  khach.forEach((k) => { pheu[k.trangThai] = (pheu[k.trangThai] || 0) + 1; });
  const lyDoMat = {};
  khach.filter((k) => k.trangThai === 'MAT').forEach((k) => { const l = k.lyDo || 'Không ghi'; lyDoMat[l] = (lyDoMat[l] || 0) + 1; });
  return { ds, tong, pheu, lyDoMat };
}

/** Người giới thiệu: số khách giới thiệu, đã ký, giá trị HĐ, hoa hồng phải trả / đã trả. Gộp theo SĐT, không có thì theo tên. */
export function dsNguoiGioiThieu(db) {
  const theo = new Map();
  for (const k of db.khach || []) {
    const ten = String(k.nguoiGioiThieu || '').trim();
    if (!ten) continue;
    const khoa = String(k.sdtGioiThieu || '').replace(/\D/g, '') || ten.toLowerCase();
    if (!theo.has(khoa)) theo.set(khoa, { ten, sdt: k.sdtGioiThieu || '', khach: [], ky: 0, giaTri: 0, hoaHong: 0, daTra: 0, chuaTra: [] });
    const r = theo.get(khoa);
    r.khach.push(k);
    if (daKy(db, k)) { r.ky++; r.giaTri += giaTriKy(db, k); }
    const hh = Number((k.hoaHong || {}).soTien) || 0;
    r.hoaHong += hh;
    if (k.hoaHong && k.hoaHong.daTra) r.daTra += hh;
    else if (daKy(db, k)) r.chuaTra.push(k);
  }
  return [...theo.values()].sort((a, b) => b.ky - a.ky || b.khach.length - a.khach.length);
}
