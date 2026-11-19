// Lead: khách tự đăng ký qua form (link theo nguồn, link giới thiệu), hạn gọi lead mới, nóng/ấm/lạnh,
// các bước A→C theo QUY TRÌNH TỔNG, mẫu tin Zalo, hoa hồng tự cập nhật theo khoản chi, thông tin phong thủy (chỉ lưu).
// Thầy chốt 19/11/2026. Phần nào không có trong tài liệu của Thầy thì ghi "đề xuất" bên cạnh.
import { day, taoMa } from './store.js';
import { suaKhach, NGUON } from './khach.js';

// ---------- Hạn gọi lead mới ----------
// Lead đến từ form (website, fanpage, sự kiện…) phải gọi trong 2 giờ làm việc, giờ làm việc 8h–20h (giờ Việt Nam).
// Lead vào đêm: nhắc 8h sáng, hạn 10h. Quá hạn chỉ báo Thầy. Ngày nào cũng tính (em giả định Thầy nhận khách cả cuối tuần).
export const GIO_GOI = 2;
export const GIO_MO = 8;
export const GIO_DONG = 20;
const VN = 7 * 3600e3;

/** Hạn gọi (ISO, giờ UTC) cho lead vào lúc `luc` (ISO). Máy chủ tính giống hệt khi nhận form. */
export function hanGoiLead(luc) {
  const t = new Date(Date.parse(luc) + VN);
  const gio = t.getUTCHours() + t.getUTCMinutes() / 60 + t.getUTCSeconds() / 3600;
  const ngay = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate());
  let han;
  if (gio < GIO_MO) han = ngay + (GIO_MO + GIO_GOI) * 3600e3;
  else if (gio >= GIO_DONG) han = ngay + 864e5 + (GIO_MO + GIO_GOI) * 3600e3;
  else if (gio + GIO_GOI <= GIO_DONG) han = t.getTime() + GIO_GOI * 3600e3;
  else han = ngay + 864e5 + (GIO_MO + gio + GIO_GOI - GIO_DONG) * 3600e3;
  return new Date(han - VN).toISOString();
}

/** Lead từ form chưa ai gọi (chưa có lần "Đã gọi" nào và còn ở trạng thái Mới). */
export const choGoiDau = (k) => !!k.leadLuc && !k.goiDauLuc && k.trangThai === 'MOI';

/** Lead mới cần gọi, sắp theo hạn. `luc` = thời điểm hiện tại (ISO). quaHan: đã qua hạn 2 giờ. */
export function leadCanGoi(db, luc = new Date().toISOString()) {
  return (db.khach || []).filter(choGoiDau)
    .map((k) => ({ k, han: k.hanGoi || hanGoiLead(k.leadLuc), quaHan: (k.hanGoi || hanGoiLead(k.leadLuc)) < luc }))
    .sort((a, b) => a.han.localeCompare(b.han));
}

/** Ghi lần gọi đầu tiên cho lead form (gọi khi bấm "Đã gọi" hoặc đổi trạng thái khỏi Mới). */
export function daGoiDau(db, kh, homNay) {
  if (!kh.leadLuc || kh.goiDauLuc) return;
  suaKhach(db, kh, { goiDauLuc: new Date().toISOString() }, homNay);
}

/** "trong 1 giờ 20 phút" / "quá 35 phút" cho hạn gọi. */
export function conLai(han, luc = new Date().toISOString()) {
  const phut = Math.round((Date.parse(han) - Date.parse(luc)) / 60000);
  const p = Math.abs(phut);
  const chu = p >= 60 ? `${Math.floor(p / 60)} giờ${p % 60 ? ' ' + (p % 60) + ' phút' : ''}` : `${p} phút`;
  return phut >= 0 ? `còn ${chu}` : `quá ${chu}`;
}

// ---------- Người phụ trách, nóng / ấm / lạnh ----------
// Thầy phụ trách lead (CSKH). Đức chỉ tham gia khi khách cần tư vấn chuyên môn: Thầy bấm "Báo Đức tham gia".
export const PHU_TRACH = { THAY: 'Thầy', DUC: 'Đức' };
export const NHIET_DO = { NONG: 'Nóng', AM: 'Ấm', LANH: 'Lạnh' };
// 3 câu hỏi khi gọi điện, để app gợi ý nhiệt độ (đề xuất của em, Thầy duyệt "theo app gợi ý" 19/11).
export const THOI_DIEM = { '3T': 'Trong 3 tháng', '6T': '3–6 tháng', XA: 'Trên 6 tháng / chưa rõ' };
export const MAT_BANG = { CO: 'Đã có nhà / mặt bằng', CHUA: 'Chưa có' };
export const PHAN_KHUC = { CO: 'Hợp phân khúc trung – cao cấp', KHONG: 'Ngoài phân khúc', CHUA: 'Chưa rõ' };

/** Nóng: có mặt bằng + làm trong 3 tháng + không ngoài phân khúc. Lạnh: trên 6 tháng hoặc ngoài phân khúc. Còn lại Ấm. Chưa hỏi gì: trống. */
export function goiYNhietDo(kh) {
  const n = kh.nhuCau || {};
  if (!n.thoiDiem && !n.matBang && !n.phanKhuc) return '';
  if (n.thoiDiem === 'XA' || n.phanKhuc === 'KHONG') return 'LANH';
  if (n.thoiDiem === '3T' && n.matBang === 'CO') return 'NONG';
  return 'AM';
}
/** Thầy chọn tay thì lấy của Thầy, không thì lấy gợi ý. */
export const nhietDo = (kh) => kh.nhietDo || goiYNhietDo(kh);

export function baoDuc(kh, nguoi) {
  const n = kh.nhuCau || {};
  return `Đức ơi, khách ${kh.ten}${kh.sdt ? ' (' + kh.sdt + ')' : ''} cần tư vấn chuyên môn, em tham gia giúp anh nhé.`
    + `${n.loai ? '\nNhu cầu: ' + n.loai : ''}${n.dienTich ? '\nDiện tích: ' + n.dienTich : ''}${n.diaDiem ? '\nĐịa điểm: ' + n.diaDiem : ''}${n.tomTat ? '\nGhi chú: ' + n.tomTat : ''}`
    + `\nHồ sơ trong app: Khách → ${kh.ma}`;
}

// ---------- Các bước A → C (QUY TRÌNH TỔNG KAS HOUZING) ----------
// Tên bước lấy từ file QUY TRÌNH TỔNG Thầy gửi 28/10. File chỉ đánh số A1, A2, B1, B2, C1, C2; các bước khác em giữ đúng tên, không tự đánh số.
// `tu`: trạng thái khách mà tới đó app tự đánh dấu bước này là xong.
export const BUOC = [
  { id: 'A1', nhom: 'A', ten: 'Liên hệ ban đầu', tu: 'LIEN_HE' },
  { id: 'A2', nhom: 'A', ten: 'Thu thập thông tin (Bảng yêu cầu thông tin)' },
  { id: 'A_QT', nhom: 'A', ten: 'Giới thiệu quy trình làm việc' },
  { id: 'A_SB', nhom: 'A', ten: 'Tư vấn sơ bộ, báo giá sơ bộ' },
  { id: 'A_HEN', nhom: 'A', ten: 'Đặt lịch hẹn tư vấn chi tiết', tu: 'HEN_GAP' },
  { id: 'B1', nhom: 'B', ten: 'Khảo sát hiện trạng (KTS đi cùng)', tu: 'KHAO_SAT' },
  { id: 'B2', nhom: 'B', ten: 'Tư vấn thiết kế, giới thiệu phương án (2D công năng)' },
  { id: 'B_DC', nhom: 'B', ten: 'Thảo luận và điều chỉnh' },
  { id: 'B_CN', nhom: 'B', ten: 'Thống nhất công năng, gửi báo giá chi tiết', tu: 'BAO_GIA' },
  { id: 'C1', nhom: 'C', ten: 'Thảo luận các điều khoản hợp đồng' },
  { id: 'C2', nhom: 'C', ten: 'Ký hợp đồng', tu: 'KY' },
];
export const NHOM_BUOC = { A: 'A. Tiếp cận, thu thập thông tin', B: 'B. Tư vấn chuyên môn', C: 'C. Ký hợp đồng' };
const THU_TU = ['MOI', 'LIEN_HE', 'HEN_GAP', 'KHAO_SAT', 'BAO_GIA', 'KY'];

/** Bước đã xong: ngày Thầy tích, hoặc 'tu' nếu trạng thái khách đã tới bước đó. */
export function buocXong(kh, b) {
  const da = (kh.buoc || {})[b.id];
  if (da) return da;
  if (b.tu && THU_TU.indexOf(kh.trangThai) >= THU_TU.indexOf(b.tu) && THU_TU.includes(kh.trangThai)) return 'tu';
  return '';
}
export function tichBuoc(db, kh, id, xong, homNay) {
  const buoc = { ...(kh.buoc || {}) };
  if (xong) buoc[id] = homNay; else delete buoc[id];
  suaKhach(db, kh, { buoc }, homNay);
}
/** Bước tiếp theo chưa xong (để hiện ngay dưới tên khách). */
export const buocTiep = (kh) => BUOC.find((b) => !buocXong(kh, b)) || null;

// ---------- Mẫu tin Zalo ----------
// Thầy chưa có mẫu (19/11): em soạn 5 mẫu ngắn, Thầy duyệt và sửa ở Khách → Form, mẫu tin. Chỉ gửi tay.
// Chỗ trong {ngoặc} app tự điền: {ten} tên khách, {nguoi} người gửi, {hoSo} link hồ sơ năng lực, {ngay} ngày, {diaChi} địa chỉ,
// {linkGT} link giới thiệu riêng của khách, {baoGia} ngày gửi báo giá gần nhất.
export const MAU_TIN = [
  { id: 'CHAO', ten: 'Chào lead mới',
    chu: 'Dạ em chào {ten}, em là {nguoi} bên KAS Houzing (thiết kế, thi công nhà ở trọn gói). Cảm ơn anh/chị đã để lại thông tin. Anh/chị tiện nghe máy lúc nào để em gọi trao đổi nhu cầu ạ?' },
  { id: 'HO_SO', ten: 'Gửi hồ sơ năng lực',
    chu: 'Dạ em gửi {ten} hồ sơ năng lực và một số công trình KAS đã làm: {hoSo}\nAnh/chị xem qua, thích phong cách nào hoặc cần hỏi gì cứ nhắn em ạ.' },
  { id: 'HEN', ten: 'Xác nhận lịch khảo sát',
    chu: 'Dạ em xác nhận lịch khảo sát {ngay} tại {diaChi}. Bên em có kiến trúc sư đi cùng. Anh/chị chuẩn bị giúp em bản vẽ hoặc sổ đỏ nếu có ạ. Có thay đổi gì anh/chị nhắn em nhé.' },
  { id: 'SAU_BG', ten: 'Hỏi lại sau báo giá',
    chu: 'Dạ em chào {ten}, báo giá em gửi hôm {baoGia} anh/chị xem có chỗ nào cần trao đổi hoặc điều chỉnh không ạ? Em sẵn sàng gặp để giải thích chi tiết.' },
  { id: 'GIOI_THIEU', ten: 'Cảm ơn, xin giới thiệu',
    chu: 'Dạ KAS cảm ơn {ten} đã tin tưởng. Nếu người thân, bạn bè anh/chị cần thiết kế hay thi công nhà, anh/chị gửi giúp em link này để KAS liên hệ: {linkGT}\nKAS luôn có phần cảm ơn cho người giới thiệu ạ.' },
];

/** Khoá cài đặt của 1 mẫu (mỗi mẫu 1 ô, vì máy chủ giới hạn 2000 ký tự mỗi ô). */
export const khoaMau = (id) => 'mauTin' + id.replace(/_/g, '');
/** Mẫu đang dùng: bản Thầy đã sửa trong cài đặt đè lên bản mặc định. */
export function dsMauTin(caiDat = {}) {
  return MAU_TIN.map((m) => { const sua = String(caiDat[khoaMau(m.id)] || '').trim(); return { ...m, chu: sua || m.chu, daSua: !!sua }; });
}

const ddmmyy = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : '');
/** Điền mẫu cho 1 khách. Chỗ chưa có dữ liệu để nguyên "{…}" cho Thầy tự sửa trước khi gửi. */
export function dienMau(chu, kh, { nguoi = '', hoSo = '', ngay = '', linkGT = '' } = {}) {
  const bg = (kh.baoGia || []).slice(-1)[0];
  const v = { ten: kh.ten, nguoi, hoSo, ngay, diaChi: (kh.nhuCau || {}).diaDiem || kh.diaChi || '', linkGT, baoGia: bg ? ddmmyy(bg.ngay) : '' };
  return chu.replace(/\{(\w+)\}/g, (m, k) => (v[k] ? v[k] : m));
}

// ---------- Link đăng ký (form) ----------
// Mỗi link 1 nguồn: Website, Fanpage, sự kiện…; khách đăng ký qua link nào thì nguồn ghi theo link đó.
// Link giới thiệu: gắn sẵn người giới thiệu (khách cũ hoặc đối tác), lead qua link tự ghi người giới thiệu để trả hoa hồng.
export const LOAI_LINK = { KENH: 'Link theo nguồn', GIOI_THIEU: 'Link giới thiệu' };
const ghiLink = (db, l) => { l.capNhatLuc = new Date().toISOString(); day(db, { loai: 'LINK_DK', l }); };

export function taoLinkDK(db, { ten, nguon, loai = 'KENH', nguoiGioiThieu = '', sdtGioiThieu = '', maKhachGT = '' }) {
  db.linkDK = db.linkDK || [];
  const l = { ma: 'L' + taoMa(), ten: String(ten || '').trim() || nguon, nguon: nguon || (loai === 'GIOI_THIEU' ? 'Người quen giới thiệu' : 'Website'), loai,
    nguoiGioiThieu, sdtGioiThieu: String(sdtGioiThieu || '').replace(/\s+/g, ''), maKhachGT, hoatDong: true, taoLuc: new Date().toISOString() };
  db.linkDK.push(l);
  ghiLink(db, l);
  return l;
}
export function suaLinkDK(db, l, thayDoi) { Object.assign(l, thayDoi); ghiLink(db, l); }

/** Link giới thiệu của 1 khách cũ: có rồi thì dùng lại, chưa có thì tạo. */
export function linkGTCuaKhach(db, kh) {
  const co = (db.linkDK || []).find((l) => l.loai === 'GIOI_THIEU' && l.maKhachGT === kh.ma && l.hoatDong !== false);
  return co || taoLinkDK(db, { ten: 'Giới thiệu của ' + kh.ten, nguon: 'Khách cũ giới thiệu', loai: 'GIOI_THIEU', nguoiGioiThieu: kh.ten, sdtGioiThieu: kh.sdt, maKhachGT: kh.ma });
}

/** Đường dẫn form: cùng thư mục với app (…/Kas-App/dang-ky.html?l=<mã>&api=<mã máy chủ>). */
export function urlForm(goc, maLink, api) {
  const thuMuc = String(goc).replace(/[^/]*$/, '');
  return `${thuMuc}dang-ky.html?l=${encodeURIComponent(maLink)}${api ? '&api=' + encodeURIComponent(api) : ''}`;
}

/** Số lead và số khách ký qua từng link. */
export function demTheoLink(db) {
  const dem = {};
  for (const k of db.khach || []) {
    if (!k.linkDK) continue;
    const d = dem[k.linkDK] || (dem[k.linkDK] = { lead: 0, ky: 0 });
    d.lead++;
    if (k.trangThai === 'KY') d.ky++;
  }
  return dem;
}

export const NGUON_LINK = NGUON;

// ---------- Hoa hồng tự cập nhật theo khoản chi ----------
// Thầy chốt 19/11: ghi khoản chi hạng mục "CTY - Hoa hồng giới thiệu" gắn khách nào thì hoa hồng của khách đó tự chuyển "Đã trả".
export const HM_HH = 'CTY - Hoa hồng giới thiệu';
export const daTraHH = (db, maKh) => (db.thuChi || []).filter((e) => !e.xoa && e.loai === 'CHI' && e.hangMuc === HM_HH && e.thamChieu === maKh)
  .reduce((s, e) => s + (Number(e.soTien) || 0), 0);

/** Tính lại tình trạng hoa hồng của khách từ sổ chi. Chưa có khoản chi nào thì giữ tích tay của Thầy (trừ khi trước đó do khoản chi đánh dấu). */
export function capNhatHoaHong(db, maKh, homNay) {
  const kh = (db.khach || []).find((k) => k.ma === maKh);
  if (!kh) return null;
  const hh = { soTien: 0, daTra: false, ghiChu: '', ...(kh.hoaHong || {}) };
  const tra = daTraHH(db, maKh);
  if (tra > 0) {
    if (!(Number(hh.soTien) > 0)) hh.soTien = tra;
    Object.assign(hh, { daTra: tra >= Number(hh.soTien), daTraTien: tra, tuChi: true });
  } else if (hh.tuChi) {
    Object.assign(hh, { daTra: false, daTraTien: 0, tuChi: false });
  } else return kh;
  suaKhach(db, kh, { hoaHong: hh }, homNay);
  return kh;
}

// ---------- Phong thủy: chỉ lưu thông tin, app không luận ----------
// Thầy chốt 19/11: họ tên, ngày tháng năm sinh (nếu đủ), giới tính, khu vực (quận/huyện, tỉnh/thành), toạ hướng nhà, độ số.
export const GIOI_TINH = { NAM: 'Nam', NU: 'Nữ' };
export const LOAI_LICH = { DUONG: 'Dương lịch', AM: 'Âm lịch' };
export const VAI_NGUOI = ['Gia chủ', 'Vợ / chồng', 'Người đứng tên', 'Khác'];
export const ptRong = () => ({ nguoi: [], quanHuyen: '', tinhThanh: '', toaHuong: '', doSo: '', ghiChu: '' });

/** Ngày sinh nhập dạng "dd/mm/yyyy", "mm/yyyy" hoặc "yyyy" (thiếu thì để trống phần đó). Sai dạng thì trả null. */
export function docNgaySinh(s) {
  const t = String(s || '').trim();
  if (!t) return '';
  const m = t.match(/^(?:(\d{1,2})[/.-])?(?:(\d{1,2})[/.-])?(\d{4})$/);
  if (!m) return null;
  const [, a, b, y] = m;
  const ngay = b ? a : '';
  const thang = b || a || '';
  if ((thang && (+thang < 1 || +thang > 12)) || (ngay && (+ngay < 1 || +ngay > 31)) || +y < 1900 || +y > 2100) return null;
  return [ngay && ngay.padStart(2, '0'), thang && thang.padStart(2, '0'), y].filter(Boolean).join('/');
}
/** Độ số 0–360 (cho phép lẻ, vd 187.5). Trống thì ''. Sai thì null. */
export function docDoSo(s) {
  const t = String(s ?? '').trim().replace(',', '.').replace(/°$/, '');
  if (!t) return '';
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 && n < 360 ? n : null;
}

// ---------- Nhập nhanh: tách SĐT trong đoạn chat (dùng khi không có mạng / AI) ----------
export function tachSdt(chu) {
  const m = String(chu || '').replace(/[.\s-]/g, '').match(/(?:\+?84|0)(\d{9})(?!\d)/);
  return m ? '0' + m[1] : '';
}
