// Nghiệm thu: thầu làm xong 1 hạng mục → nhắc giám sát nghiệm thu theo checklist, có ảnh.
// Mục lỗi thành "tồn tại" có hạn sửa, theo dõi đến khi sửa xong.
// Và nhắc đo sản xuất nội thất khi đủ điều kiện (quy tắc Thầy chốt 13/11).
import { addDays } from './schedule.js';
import { day, taoMa } from './store.js';

// Nội dung kiểm tra theo nhóm hạng mục.
// Nguồn: tab "Nghiệm thu" file Hồ sơ thi công MẪU (GSTG 1–4, lấy theo Điều 1.5 HĐ thiết kế mẫu KAS).
// Mục em đề xuất thêm (deXuat: true) hiện dấu * để Thầy duyệt lại; khi nghiệm thu thêm mục được.
// Mỗi nhóm: [mẫu nhóm, mục lấy từ file Hồ sơ thi công, mục em đề xuất thêm].
const CL = [
  [/^Chuẩn bị/, ['Mặt bằng, cột chịu lực, tường bao', 'Trần, sàn hiện trạng', 'Nguồn điện, nguồn cấp – thoát nước hiện trạng'], ['Dọn phế thải sau phá dỡ']],
  [/^Xây trát/, ['Tường xây, vị trí tường', 'Chi tiết chờ liên kết kết cấu kế cận'], ['Trát phẳng, thẳng góc, không nứt']],
  [/^(Điện nước|Lắp thiết bị)/, ['Chủng loại vật tư điện nước', 'Vị trí đường điện, cấp thoát nước', 'Nguồn chờ, đầu chờ'], []],
  [/^Ốp lát/, ['Cao độ', 'Độ phẳng', 'Độ chắc ốp lát'], ['Đúng mẫu gạch/đá khách đã chốt']],
  [/^Nội thất/, ['Vật tư, vật liệu, mã màu', 'Hình thức', 'Điểm liên kết', 'Độ hoàn thiện'], []],
  [/^Chống thấm/, [], ['Đúng vật liệu, đủ số lớp', 'Ngâm thử nước, không thấm', 'Cổ ống, góc tường xử lý kỹ']],
  [/^Thạch cao/, [], ['Đúng cao độ, phẳng, không võng', 'Mối nối không nứt', 'Sơn đều màu, đúng mã màu đã chốt']],
  [/^Điều hòa/, [], ['Ống đồng, ống nước xả đúng tuyến, đủ độ dốc', 'Bảo ôn kín, không đọng nước', 'Chạy thử lạnh, không chảy nước']],
  [/^Cửa/, [], ['Đúng kích thước, mẫu, màu', 'Đóng mở êm, khoá chắc', 'Khe hở đều, chèn kín']],
];
const CHUNG = ['Đúng bản vẽ, đúng vị trí', 'Đúng vật tư, mẫu đã chốt', 'Hoàn thiện, không lỗi nhìn thấy', 'Vệ sinh mặt bằng sau thi công'];
export const HAN_SUA_MAC_DINH = 3;
// Chỉ nhắc với việc xong trong 14 ngày gần đây (không nhắc lại việc đã xong từ trước khi có app).
export const CUA_SO = 14;

/** [{ noiDung, deXuat }]: deXuat = true là mục em đề xuất, chưa có trong hồ sơ của Thầy. */
export function checklistMacDinh(nhom) {
  const r = CL.find(([re]) => re.test(String(nhom || '')));
  const [hs, dx] = r && (r[1].length || r[2].length) ? [r[1], r[2]] : [[], CHUNG];
  return [...hs.map((noiDung) => ({ noiDung, deXuat: false })), ...dx.map((noiDung) => ({ noiDung, deXuat: true }))];
}

// Việc cần nghiệm thu: thi công thật (có thầu), không phải việc giấy tờ/đo/đặt hàng/thiết kế/KAS tự làm.
export function canNghiemThu(v) {
  const nhom = String(v.nhom || '');
  if (/^Thiết kế|\(KAS\)/.test(nhom) && !v.nhaThau) return false;
  if (/^Đo |chỉnh file|Đặt hàng|sản xuất tại xưởng|Đăng ký thi công/i.test(v.hangMuc || '')) return false;
  return !!v.nhaThau || /\((thầu|xưởng|nhà cung cấp)/.test(nhom);
}

export const ntCuaCongTrinh = (db, maCt) => (db.nghiemThu || []).filter((n) => n.maCongTrinh === maCt && !n.xoa);
export const ntCuaViec = (db, maCt, viecId) => ntCuaCongTrinh(db, maCt).filter((n) => n.viec === viecId).sort((a, b) => String(a.ngay).localeCompare(String(b.ngay)));

const ghi = (db, n) => { n.capNhatLuc = new Date().toISOString(); day(db, { loai: 'NGHIEM_THU', n }); };

/** Lưu phiếu nghiệm thu. muc: [{ noiDung, dat }] ; mục không đạt thành tồn tại với hạn sửa. */
export function nghiemThu(db, ct, viecId, { ngay, muc, ghiChu, soAnh, hanSua, tonTaiThem = [] }, nguoi) {
  db.nghiemThu = db.nghiemThu || [];
  const han = hanSua || addDays(ngay, HAN_SUA_MAC_DINH);
  const tonTai = [...muc.filter((m) => !m.dat).map((m) => m.ghiChu ? `${m.noiDung}: ${m.ghiChu}` : m.noiDung), ...tonTaiThem.filter(Boolean)]
    .map((noiDung) => ({ id: taoMa(), noiDung, hanSua: han, daSua: '', nguoiSua: '' }));
  const n = { id: 'NTH-' + taoMa(), maCongTrinh: ct.ma, viec: viecId, ngay, nguoi, checklist: muc.map((m) => ({ noiDung: m.noiDung, dat: !!m.dat, ghiChu: m.ghiChu || '' })),
    tonTai, ghiChu: ghiChu || '', soAnh: Number(soAnh) || 0, xoa: '' };
  db.nghiemThu.push(n);
  ghi(db, n);
  const v = ct.viec.find((x) => x.id === viecId);
  const e = { id: taoMa(), luc: new Date().toISOString(), ma: ct.ma, viec: viecId, tenViec: v ? v.hangMuc : '', nguoi, loai: 'NGHIEM_THU',
    ghiChu: tonTai.length ? `Nghiệm thu: còn ${tonTai.length} tồn tại, hạn sửa ${han.slice(8, 10)}/${han.slice(5, 7)}` : 'Nghiệm thu: đạt', congKhai: false };
  db.lichSu.push(e);
  day(db, { loai: 'LICH_SU', e });
  return n;
}

export function daSuaTonTai(db, n, idTonTai, ngay, nguoi) {
  const t = n.tonTai.find((x) => x.id === idTonTai);
  if (!t) return;
  t.daSua = ngay; t.nguoiSua = nguoi;
  ghi(db, n);
}

export function doiHanSua(db, n, idTonTai, han) {
  const t = n.tonTai.find((x) => x.id === idTonTai);
  if (t) { t.hanSua = han; ghi(db, n); }
}

/** Kết quả của 1 việc: CHUA (chưa nghiệm thu), TON_TAI (còn lỗi chưa sửa), DAT. */
export function ketQuaViec(db, ct, v) {
  const ds = ntCuaViec(db, ct.ma, v.id);
  if (!ds.length) return { tt: 'CHUA', con: [] };
  const con = ds.flatMap((n) => n.tonTai.filter((t) => !t.daSua).map((t) => ({ n, t })));
  return { tt: con.length ? 'TON_TAI' : 'DAT', con, ds };
}

/** Việc vừa xong, cần nghiệm thu mà chưa có phiếu. */
export function choNghiemThu(db, homNay, daXong = () => false) {
  const tu = addDays(homNay, -CUA_SO);
  const kq = [];
  for (const ct of db.congTrinh || []) {
    if (daXong(ct.ma)) continue;
    for (const v of ct.viec) {
      const xong = v.thucTe && v.thucTe.ketThuc;
      if (v.phanTram < 100 || !xong || xong < tu || !canNghiemThu(v)) continue;
      if (ntCuaViec(db, ct.ma, v.id).length) continue;
      kq.push({ ct, v, ngay: xong });
    }
  }
  return kq.sort((a, b) => a.ngay.localeCompare(b.ngay));
}

/** Tồn tại chưa sửa, quá hạn trước. */
export function tonTaiMo(db, homNay, maCt) {
  const kq = [];
  for (const n of db.nghiemThu || []) {
    if (n.xoa || (maCt && n.maCongTrinh !== maCt)) continue;
    const ct = (db.congTrinh || []).find((c) => c.ma === n.maCongTrinh);
    if (!ct) continue;
    const v = ct.viec.find((x) => x.id === n.viec);
    for (const t of n.tonTai || []) if (!t.daSua) kq.push({ ct, v, n, t, qua: t.hanSua < homNay });
  }
  return kq.sort((a, b) => a.t.hanSua.localeCompare(b.t.hanSua));
}

// ---------- Đo sản xuất nội thất ----------
// Thầy chốt: đo khi xong thạch cao, sơn bả, cán nền hoặc lát sàn; không có thạch cao – sơn bả thì sau trát tường + cán nền/lát sàn.
const laTCSB = (v) => /^Thạch cao/.test(String(v.nhom || '')) && !/ngoài nhà/i.test(v.hangMuc || '');
const laSan = (v) => /cán nền|láng nền|lát .*sàn|lát sàn/i.test(v.hangMuc || '');
const laTrat = (v) => /trát tường/i.test(v.hangMuc || '');
export const laDoNoiThat = (v) => /^Nội thất/.test(String(v.nhom || '')) && /đo sản xuất/i.test(v.hangMuc || '');

/** Điều kiện đo của 1 công trình: { coDo, du, thieu: [tên việc chưa xong] }. */
export function dieuKienDo(ct) {
  const vDo = ct.viec.find(laDoNoiThat);
  if (!vDo) return { coDo: false };
  const truoc = ct.viec.some(laTCSB) ? ct.viec.filter(laTCSB) : ct.viec.filter(laTrat);
  const san = ct.viec.filter(laSan);
  const thieu = truoc.filter((v) => v.phanTram < 100).map((v) => v.hangMuc);
  if (san.length && !san.some((v) => v.phanTram >= 100)) thieu.push(san.map((v) => v.hangMuc).join(' hoặc '));
  return { coDo: true, vDo, du: !thieu.length, thieu };
}

/** Công trình đủ điều kiện đo mà việc đo chưa bắt đầu → nhắc. */
export function canDoNoiThat(db, daXong = () => false) {
  return (db.congTrinh || []).filter((ct) => !daXong(ct.ma)).map((ct) => ({ ct, ...dieuKienDo(ct) })).filter((x) => x.coDo && x.du && x.vDo.phanTram === 0);
}
