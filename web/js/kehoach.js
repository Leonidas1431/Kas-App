// Sửa kế hoạch công trình (văn phòng): sửa việc, thêm/xoá việc, sửa thông tin công trình, chốt lại kế hoạch gốc.
// Kế hoạch gốc (v.goc) giữ nguyên khi sửa, để so chậm bao nhiêu; chỉ đổi khi Thầy bấm "Chốt kế hoạch gốc".
import { xepLich } from './schedule.js';
import { day, taoMa, lichHienTai } from './store.js';

export const TRUONG_VIEC = { nhom: 'Nhóm', hangMuc: 'Hạng mục', dauViec: 'Đầu việc', soNgay: 'Số ngày', khoiLuong: 'Khối lượng', dvt: 'Đơn vị', nhaThau: 'Nhà thầu', diSau: 'Đi sau', moc: 'Mốc', batDauCoDinh: 'Bắt đầu cố định' };

const giongNhau = (a, b) => JSON.stringify(a ?? '') === JSON.stringify(b ?? '');
const ketThucCT = (ct, viec = ct.viec) => [...xepLich(viec, ct.khoiCong, ct.lich).values()].reduce((m, x) => (x.ketThuc > m ? x.ketThuc : m), ct.khoiCong);

function nhatKy(db, ct, v, nguoi, ghiChu, them = {}) {
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: ct.ma, viec: v ? v.id : '', tenViec: v ? v.hangMuc : ct.ten, nguoi, loai: 'SUA_KH', ghiChu, congKhai: false, ...them };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
}

// Thử áp thay đổi: báo lỗi nếu ràng buộc vòng tròn; trả về ngày xong công trình trước/sau để xem trước.
export function xemTruoc(ct, id, thayDoi) {
  const viec = ct.viec.map((v) => (v.id === id ? { ...v, ...thayDoi } : v));
  return { truoc: ketThucCT(ct), sau: ketThucCT(ct, viec) };
}

export function suaViec(db, ct, id, thayDoi, nguoi, lyDo = '') {
  const v = ct.viec.find((x) => x.id === id);
  const doi = Object.keys(thayDoi).filter((k) => k in TRUONG_VIEC && !giongNhau(v[k], thayDoi[k]));
  if (!doi.length) return [];
  xemTruoc(ct, id, thayDoi); // ném lỗi nếu vòng tròn
  const truoc = ketThucCT(ct);
  const moTa = doi.map((k) => (k === 'diSau' ? 'đổi việc đi trước' : `${TRUONG_VIEC[k].toLowerCase()} ${v[k] ?? '—'} → ${thayDoi[k] ?? '—'}`));
  doi.forEach((k) => { v[k] = thayDoi[k]; });
  day(db, { loai: 'VIEC', ma: ct.ma, viec: v });
  const sau = ketThucCT(ct);
  nhatKy(db, ct, v, nguoi, `Sửa kế hoạch: ${moTa.join('; ')}${sau !== truoc ? ` (xong công trình ${truoc} → ${sau})` : ''}${lyDo ? '. Lý do: ' + lyDo : ''}`);
  return doi;
}

// Thêm việc ngay sau việc `sauId` (theo thứ tự hiển thị), mặc định đi sau việc đó.
export function themViec(db, ct, { nhom, hangMuc, soNgay, sauId, nhaThau = '', moc = '' }, nguoi) {
  const i = sauId ? ct.viec.findIndex((x) => x.id === sauId) : ct.viec.length - 1;
  const truocDo = ct.viec[i];
  const v = {
    id: 'V' + taoMa().slice(0, 6).toUpperCase(), thuTu: 0, nhom: nhom || (truocDo ? truocDo.nhom : 'Khác'), hangMuc, dauViec: '', dvt: '', khoiLuong: null,
    soNgay: Number(soNgay) || 1, diSau: truocDo ? [{ id: truocDo.id, kieu: 'XS', goi: 0 }] : [], moc, phanTram: 0, trangThai: 'CHUA', nhaThau,
  };
  ct.viec.splice(i + 1, 0, v);
  // Việc thêm sau: kế hoạch gốc = lịch lúc thêm, để không tính là chậm.
  v.goc = lichHienTai(ct).get(v.id);
  ct.viec.forEach((x, k) => {
    if (x.thuTu === k && x !== v) return;
    x.thuTu = k;
    if (x !== v) day(db, { loai: 'VIEC', ma: ct.ma, viec: x });
  });
  day(db, { loai: 'THEM_VIEC', ma: ct.ma, viec: v });
  nhatKy(db, ct, v, nguoi, `Thêm việc "${hangMuc}" (${v.soNgay} ngày)`);
  return v;
}

// Xoá việc. Việc nào đi sau việc bị xoá thì nối sang các việc đi trước của nó, để chuỗi không đứt.
export function xoaViec(db, ct, id, nguoi, lyDo = '') {
  const v = ct.viec.find((x) => x.id === id);
  for (const x of ct.viec) {
    if (!(x.diSau || []).some((p) => p.id === id)) continue;
    const con = x.diSau.filter((p) => p.id !== id);
    for (const p of v.diSau || []) if (!con.some((q) => q.id === p.id)) con.push({ ...p });
    x.diSau = con;
    day(db, { loai: 'VIEC', ma: ct.ma, viec: x });
  }
  ct.viec = ct.viec.filter((x) => x.id !== id);
  day(db, { loai: 'XOA_VIEC', ma: ct.ma, id });
  nhatKy(db, ct, null, nguoi, `Xoá việc "${v.hangMuc}"${lyDo ? '. Lý do: ' + lyDo : ''}`);
}

export const TRUONG_CT = { ten: 'Tên', khoiCong: 'Khởi công', lich: 'Lịch làm việc', chuNha: 'Chủ nhà', thuMucDrive: 'Thư mục Drive', choDangAnh: 'Cho đăng ảnh' };

export function suaCongTrinh(db, ct, thayDoi, nguoi) {
  const doi = Object.keys(thayDoi).filter((k) => k in TRUONG_CT && !giongNhau(ct[k], thayDoi[k]));
  if (!doi.length) return [];
  const truoc = ketThucCT(ct);
  doi.forEach((k) => { ct[k] = thayDoi[k]; });
  const sua = Object.fromEntries(doi.map((k) => [k, ct[k]]));
  day(db, { loai: 'CT_SUA', ma: ct.ma, sua });
  const sau = ketThucCT(ct);
  nhatKy(db, ct, null, nguoi, `Sửa ${doi.map((k) => TRUONG_CT[k].toLowerCase()).join(', ')}${sau !== truoc ? ` (xong công trình ${truoc} → ${sau})` : ''}`);
  return doi;
}

// Chốt lịch hiện tại làm kế hoạch gốc mới (vd sau khi sửa xong kế hoạch trước khởi công). Lịch sử cũ vẫn giữ.
export function chotKeHoachGoc(db, ct, nguoi, lyDo = '') {
  const lich = lichHienTai(ct);
  const cu = ct.viec.reduce((m, v) => (v.goc && v.goc.ketThuc > m ? v.goc.ketThuc : m), ct.khoiCong);
  for (const v of ct.viec) {
    const t = lich.get(v.id);
    if (v.goc && v.goc.batDau === t.batDau && v.goc.ketThuc === t.ketThuc) continue;
    v.goc = { batDau: t.batDau, ketThuc: t.ketThuc };
    day(db, { loai: 'VIEC', ma: ct.ma, viec: v });
  }
  const moi = ketThucCT(ct);
  nhatKy(db, ct, null, nguoi, `Chốt lại kế hoạch gốc: xong ${cu} → ${moi}${lyDo ? '. Lý do: ' + lyDo : ''}`, { loai: 'CHOT_GOC' });
}

// Danh sách nhà thầu đã dùng ở mọi công trình (gợi ý khi gõ).
// Gợi ý tên thầu: danh bạ nhà thầu + tên đã gõ trong kế hoạch các công trình.
export const dsNhaThau = (db) => [...new Set([...(db.nhaThau || []).filter((t) => t.hoatDong !== false).map((t) => t.ten), ...(db.congTrinh || []).flatMap((c) => c.viec.map((v) => v.nhaThau))].filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
