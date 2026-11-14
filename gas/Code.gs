/**
 * KAS App – máy chủ Apps Script.
 * Dữ liệu nằm trong file Sheets "KAS App – Dữ liệu"; ảnh vào thư mục Drive của từng công trình.
 *
 * Đăng nhập: mỗi người có 1 "khoá" riêng, Thầy tạo trong app (màn Người dùng) và gửi link qua Zalo.
 * Mở link 1 lần là điện thoại nhớ. Thầy thu hồi khoá bất cứ lúc nào.
 *
 * App gửi POST dạng text/plain (tránh CORS preflight): { khoa, action, data }.
 * Link chủ nhà: GET ?xem=<mã link>, không cần khoá, chỉ trả phần chủ nhà được xem.
 */

const TAB = {
  NguoiDung: ['email', 'ten', 'vaiTro', 'congTrinh', 'khoa', 'hoatDong', 'taoLuc', 'hetHan'],
  CongTrinh: ['ma', 'ten', 'loai', 'khoiCong', 'lich', 'chuNha', 'maLinkChuNha', 'thuMucDrive', 'taoLuc', 'maKhach', 'choDangAnh'],
  Khach: ['ma', 'ten', 'sdt', 'diaChi', 'nguon', 'nguoiGioiThieu', 'sdtGioiThieu', 'hoaHong', 'nhuCau', 'trangThai', 'lyDo',
    'nhacGoi', 'soLanNhac', 'baoGia', 'maCongTrinh', 'banGiao', 'chamSoc', 'baoHanhDen', 'thuMucDrive', 'nguoiTao', 'taoLuc', 'capNhatLuc', 'ngayVao'],
  KeHoach: ['ma', 'id', 'thuTu', 'nhom', 'hangMuc', 'dauViec', 'dvt', 'khoiLuong', 'soNgay', 'diSau', 'moc',
    'phanTram', 'trangThai', 'goc', 'thucTe', 'nhaThau', 'capNhatLuc', 'batDauCoDinh'],
  LichSu: ['id', 'luc', 'ma', 'viec', 'tenViec', 'nguoi', 'loai', 'cu', 'moi', 'nguyenNhan', 'ghiChu', 'congKhai'],
  Anh: ['id', 'ma', 'viec', 'luc', 'tenFile', 'fileId', 'nguoi', 'loai'],
  HopDong: ['ma', 'soHD', 'dang', 'nguyenTac', 'tenHD', 'maKhach', 'maCongTrinh', 'ngayKy', 'giaTri', 'dot', 'phuLuc', 'soLanSua',
    'soBuoiGSTG', 'khauTru', 'truTK', 'linkFile', 'trangThai', 'lyDo', 'ngayDung', 'nguoiTao', 'taoLuc', 'capNhatLuc', 'phamVi', 'giaTriKT', 'chiDuKien'],
  PhuongAn: ['id', 'maCongTrinh', 'hangMuc', 'lan', 'viec', 'ngayGui', 'link', 'ghiChu', 'trangThai', 'ngayPhanHoi', 'yKien',
    'duyetQua', 'duyetLuc', 'phi', 'nguoiGui', 'capNhatLuc'],
  GSTG: ['id', 'maCongTrinh', 'lan', 'ten', 'viec', 'ngay', 'xong', 'ghiChu', 'nhacGiamSat', 'capNhatLuc'],
  // Sổ thu chi (chi công trình, chi công ty, thu ngoài HĐ). Thu theo HĐ nằm trong HopDong.dot. Xoá = ghi ngày vào cột xoa.
  ThuChi: ['id', 'ngay', 'ma', 'loai', 'hangMuc', 'thamChieu', 'doiTuong', 'soTien', 'noiDung', 'hinhThuc', 'soAnh', 'nguoi', 'xoa', 'taoLuc', 'capNhatLuc'],
  // Đợt trả thầu. Giám sát chỉ thấy phần không có tiền và chỉ ghi được klXacNhan.
  TraThau: ['id', 'maCongTrinh', 'thau', 'hangMuc', 'dot', 'soTien', 'dieuKien', 'viecMoc', 'hanTra', 'klXacNhan', 'ghiChu', 'xoa', 'taoLuc', 'capNhatLuc'],
  // Phát sinh 4 bước. Giám sát thấy phiếu nhưng không thấy giá; chủ nhà thấy giá bán (không thấy chi gốc).
  PhatSinh: ['id', 'ma', 'maCongTrinh', 'viec', 'ngayBao', 'nguoiBao', 'moTa', 'viTri', 'giaBan', 'chiGoc', 'ngayBaoGia', 'trangThai', 'ngayKhach',
    'quaKhach', 'bangChung', 'yKien', 'daLam', 'xoa', 'capNhatLuc'],
  // Mẫu vật liệu khách cần chốt, kèm người bán. Không có tiền: giám sát và chủ nhà cùng xem được.
  MauVL: ['id', 'maCongTrinh', 'hangMuc', 'tenMau', 'nguoiBan', 'sdtNguoiBan', 'link', 'viec', 'hanChot', 'ngayGui', 'trangThai', 'ngayKhach', 'quaKhach',
    'yKien', 'xoa', 'capNhatLuc'],
  // Cài đặt chung của văn phòng (vd tài khoản nhận tiền in vào đề nghị thanh toán). Không để trong mã nguồn.
  // Danh bạ nhà thầu. maLink = link riêng cho thầu xem lịch việc của mình (không cần đăng nhập), chỉ văn phòng thấy.
  NhaThau: ['id', 'ten', 'linhVuc', 'sdt', 'ghiChu', 'maLink', 'hoatDong', 'taoLuc', 'capNhatLuc'],
  // Đánh giá thầu sau mỗi công trình, điểm 1–5. Mỗi người 1 phiếu cho 1 thầu ở 1 công trình.
  DanhGia: ['id', 'maThau', 'maCongTrinh', 'ngay', 'chatLuong', 'tienDo', 'phoiHop', 'ghiChu', 'nguoi', 'capNhatLuc'],
  // Phiếu nghiệm thu từng việc: checklist, tồn tại cần sửa (hạn, ngày sửa). Không có tiền: giám sát ghi được.
  NghiemThu: ['id', 'maCongTrinh', 'viec', 'ngay', 'nguoi', 'checklist', 'tonTai', 'ghiChu', 'soAnh', 'xoa', 'capNhatLuc'],
  // Bài đăng mạng xã hội, website. AI viết, Thầy duyệt, máy chủ đăng. ketQua, nguoiDuyet, duyetLuc, lanViet chỉ máy chủ ghi.
  BaiDang: ['id', 'loai', 'chuDe', 'ghiChu', 'maCongTrinh', 'nguonTL', 'trichDan', 'kenh', 'ngayDang', 'gioDang', 'baiViet', 'dsAnh', 'anhBia',
    'mauBia', 'tieuDeBia', 'phuDeBia', 'trangThai', 'yKien', 'lanViet', 'nguoiDuyet', 'duyetLuc', 'ketQua', 'nguoiTao', 'xoa', 'taoLuc', 'capNhatLuc', 'canva'],
  // Mỗi lần gọi Claude API: số token để Thầy theo dõi chi phí AI.
  ChiAI: ['luc', 'viec', 'model', 'vao', 'ra', 'timWeb', 'usd'],
  CaiDat: ['khoa', 'giaTri', 'capNhatLuc'],
  DaNhan: ['idGui', 'luc'],
};
// Cột lưu dạng JSON trong 1 ô
const JSON_COT = ['lich', 'diSau', 'goc', 'thucTe', 'hoaHong', 'nhuCau', 'baoGia', 'chamSoc', 'dot', 'phuLuc', 'khauTru', 'truTK', 'klXacNhan', 'checklist', 'tonTai', 'kenh', 'baiViet', 'dsAnh', 'ketQua', 'canva'];
// Thầy và Đức toàn quyền. KHA (giám sát) và TAM (quyền tạm, có hạn ngày) chỉ thấy công trình được giao, không thấy tiền, không thấy sổ khách.
const VAN_PHONG = ['THAY', 'DUC'];
const VAI_TRO = ['THAY', 'DUC', 'KHA', 'TAM'];
const laKhach = (ma) => /^KH-/.test(String(ma));
// Sổ khách (KH-), hợp đồng (HD-), thu chi (TC-, TT-) và chi công ty (CTY) chỉ văn phòng thấy, kể cả nhật ký của chúng.
const laRieng = (ma) => /^(KH|HD|TC|TT|BD)-/.test(String(ma)) || String(ma) === 'CTY';

// ---------- Cài đặt: chạy 1 lần trong trình soạn thảo Apps Script ----------
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss = null;
  if (props.getProperty('SHEET_ID')) ss = SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
  if (!ss) {
    ss = SpreadsheetApp.create('KAS App – Dữ liệu');
    props.setProperty('SHEET_ID', ss.getId());
  }
  Object.keys(TAB).forEach((ten) => {
    const sh = ss.getSheetByName(ten) || ss.insertSheet(ten);
    sh.getRange(1, 1, 1, TAB[ten].length).setValues([TAB[ten]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  ['Sheet1', 'Trang tính1'].forEach((t) => {
    const mac = ss.getSheetByName(t);
    if (mac && ss.getSheets().length > 1) ss.deleteSheet(mac);
  });
  let thay = docBang('NguoiDung').find((u) => u.vaiTro === 'THAY' && u.hoatDong === true);
  if (!thay) {
    let email = '';
    try { email = Session.getEffectiveUser().getEmail(); } catch (e) { /* không có quyền đọc email: bỏ trống */ }
    thay = { email: email, ten: 'Thầy', vaiTro: 'THAY', congTrinh: '', khoa: taoKhoa(), hoatDong: true, taoLuc: new Date().toISOString() };
    themDong('NguoiDung', thay);
  }
  Logger.log('File dữ liệu: ' + ss.getUrl());
  Logger.log('KHOÁ CỦA THẦY (dán vào app lần đầu): ' + thay.khoa);
}

// ---------- Cổng vào ----------
function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    if (req.action === 'chuNhaPhanHoi') return json({ ok: true, data: chuNhaPhanHoi(req.data || {}) });
    const nguoi = xacThuc(req.khoa);
    const fn = HANH_DONG[req.action];
    if (!fn) throw new Error('Không có thao tác ' + req.action);
    return json({ ok: true, data: fn(nguoi, req.data || {}) });
  } catch (err) {
    return json({ ok: false, loi: String((err && err.message) || err) });
  }
}

function doGet(e) {
  // Canva chuyển về sau khi Thầy bấm Cho phép.
  if (e && e.parameter && e.parameter.code && e.parameter.state) {
    let tb;
    try { tb = canvaNhanMa(e); } catch (x) { tb = x.message; }
    return HtmlService.createHtmlOutput('<meta name="viewport" content="width=device-width"><p style="font:18px sans-serif;padding:24px">' + String(tb).replace(/</g, '&lt;') + '</p>');
  }
  const maThau = e && e.parameter && e.parameter.thau;
  if (maThau) return json(xemChoThau(maThau));
  const ma = e && e.parameter && e.parameter.xem;
  if (!ma) return json({ ok: true, data: { app: 'KAS App', chay: true } });
  const ct = docBang('CongTrinh').find((r) => r.maLinkChuNha === ma);
  if (!ct) return json({ ok: false, loi: 'Link không đúng hoặc đã hết hạn' });
  // Chỉ trả phần chủ nhà được xem: không tên thầu, không ghi chú nội bộ, không tiền.
  const viec = docBang('KeHoach').filter((r) => r.ma === ct.ma).map((v) => ({
    id: v.id, thuTu: v.thuTu, nhom: v.nhom, hangMuc: v.hangMuc, soNgay: Number(v.soNgay), diSau: v.diSau,
    moc: v.moc, phanTram: Number(v.phanTram) || 0, goc: v.goc, thucTe: v.thucTe, batDauCoDinh: v.batDauCoDinh || '',
  })).sort((a, b) => a.thuTu - b.thuTu);
  const lichSu = docBang('LichSu').filter((r) => r.ma === ct.ma && r.loai === 'CHAM' && r.congKhai === true)
    .map((r) => ({ id: r.id, luc: r.luc, ma: r.ma, tenViec: r.tenViec, loai: r.loai, cu: r.cu, moi: r.moi, nguyenNhan: r.nguyenNhan, congKhai: true }));
  const phuongAn = docBang('PhuongAn').filter((p) => p.maCongTrinh === ct.ma).map(paChoChuNha);
  const phatSinh = docBang('PhatSinh').filter((p) => p.maCongTrinh === ct.ma && !p.xoa && p.trangThai !== 'CHO_BAO_GIA').map(psChoChuNha);
  const mauVL = docBang('MauVL').filter((m) => m.maCongTrinh === ct.ma && !m.xoa).map(mauChoChuNha);
  return json({ ok: true, data: { ct: { ma: ct.ma, ten: ct.ten, loai: ct.loai, khoiCong: ct.khoiCong, lich: ct.lich, maLinkChuNha: ct.maLinkChuNha, viec }, lichSu, phuongAn, phatSinh, mauVL } });
}

// Link thầu: việc của thầu ở các công trình chưa xong, kèm mẫu đã chốt cho các việc đó. Không tiền, không tên chủ nhà, không việc của thầu khác.
function xemChoThau(maLink) {
  const t = docBang('NhaThau').find((r) => r.maLink && r.maLink === maLink && r.hoatDong !== false);
  if (!t) return { ok: false, loi: 'Link không đúng hoặc đã hết hạn' };
  const ten = String(t.ten).trim().toLowerCase();
  const keHoach = docBang('KeHoach');
  const mau = docBang('MauVL').filter((m) => !m.xoa && m.trangThai === 'DUYET');
  const congTrinh = [];
  docBang('CongTrinh').forEach((c) => {
    const vs = keHoach.filter((v) => v.ma === c.ma);
    const cua = vs.filter((v) => String(v.nhaThau || '').trim().toLowerCase() === ten);
    if (!cua.length || cua.every((v) => Number(v.phanTram) >= 100)) return;
    const ids = cua.map((v) => v.id);
    // Gửi đủ việc (không tên, không thầu) để máy thầu tự xếp lịch; chỉ việc của thầu có tên và khối lượng.
    const viec = vs.map((v) => {
      const o = { id: v.id, thuTu: Number(v.thuTu), soNgay: Number(v.soNgay), diSau: v.diSau, phanTram: Number(v.phanTram) || 0, thucTe: v.thucTe, batDauCoDinh: v.batDauCoDinh || '', nhom: v.nhom };
      if (ids.indexOf(v.id) >= 0) Object.assign(o, { cuaThau: true, hangMuc: v.hangMuc, dauViec: v.dauViec, dvt: v.dvt, khoiLuong: v.khoiLuong === '' ? null : v.khoiLuong });
      return o;
    }).sort((a, b) => a.thuTu - b.thuTu);
    congTrinh.push({ ma: c.ma, ten: c.ten, khoiCong: c.khoiCong, lich: c.lich, viec,
      mau: mau.filter((m) => m.maCongTrinh === c.ma && ids.indexOf(m.viec) >= 0).map((m) => ({ viec: m.viec, hangMuc: m.hangMuc, tenMau: m.tenMau, link: m.link })) });
  });
  return { ok: true, data: { thau: { ten: t.ten, linhVuc: t.linhVuc }, congTrinh } };
}

// Số ảnh hiện trường theo công trình và ngày (giờ Việt Nam), 14 ngày gần nhất, không tính chứng từ. Dùng cho nhắc ảnh 16h.
function demAnh(n) {
  const tu = Utilities.formatDate(new Date(Date.now() - 14 * 864e5), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const dem = {};
  docBang('Anh').forEach((a) => {
    if (a.loai === 'CHUNG_TU' || a.loai === 'BAI_DANG' || !duocXem(n, a.ma)) return;
    const d = a.luc instanceof Date ? a.luc : new Date(a.luc);
    if (isNaN(d)) return;
    const ngay = Utilities.formatDate(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    if (ngay < tu) return;
    const k = a.ma + '|' + ngay;
    dem[k] = (dem[k] || 0) + 1;
  });
  return Object.keys(dem).map((k) => ({ ma: k.split('|')[0], ngay: k.split('|')[1], so: dem[k] }));
}

// Phần phương án chủ nhà được xem: không ghi chú nội bộ, không phí.
function paChoChuNha(p) {
  return { id: p.id, hangMuc: p.hangMuc, lan: Number(p.lan) || 0, ngayGui: p.ngayGui, link: p.link, trangThai: p.trangThai,
    ngayPhanHoi: p.ngayPhanHoi, yKien: p.yKien, duyetQua: p.duyetQua, duyetLuc: p.duyetLuc };
}

// Phần phát sinh chủ nhà được xem: giá bán, không có chi phí gốc, không có ghi chú nội bộ.
function psChoChuNha(p) {
  return { id: p.id, ma: p.ma, moTa: p.moTa, viTri: p.viTri, giaBan: Number(p.giaBan) || 0, ngayBaoGia: p.ngayBaoGia, trangThai: p.trangThai,
    ngayKhach: p.ngayKhach, quaKhach: p.quaKhach, yKien: p.yKien };
}

function mauChoChuNha(m) {
  return { id: m.id, hangMuc: m.hangMuc, tenMau: m.tenMau, nguoiBan: m.nguoiBan, link: m.link, hanChot: m.hanChot, ngayGui: m.ngayGui, trangThai: m.trangThai,
    ngayKhach: m.ngayKhach, quaKhach: m.quaKhach, yKien: m.yKien };
}

// Chủ nhà bấm "Đồng ý" hoặc "Cần sửa" trên link. Không cần khoá; chỉ được trả lời phương án đang chờ của đúng công trình.
function chuNhaPhanHoi(data) {
  const ct = docBang('CongTrinh').find((r) => r.maLinkChuNha && r.maLinkChuNha === data.maLink);
  if (!ct) throw new Error('Link không đúng hoặc đã hết hạn');
  if (data.ketQua !== 'DUYET' && data.ketQua !== 'SUA' && data.ketQua !== 'TU_CHOI') throw new Error('Phản hồi không hợp lệ');
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    if (data.loai === 'PS') {
      const ps = docBang('PhatSinh').find((p) => p.id === data.id && p.maCongTrinh === ct.ma && !p.xoa);
      if (!ps) throw new Error('Không tìm thấy phát sinh');
      if (ps.trangThai !== 'CHO_KHACH') return psChoChuNha(ps);
      const kq = data.ketQua === 'DUYET' ? 'DUYET' : 'TU_CHOI';
      const moiPs = { trangThai: kq, ngayKhach: homNay(), quaKhach: 'LINK', yKien: String(data.yKien || '').slice(0, 2000), capNhatLuc: new Date().toISOString() };
      capNhatDong('PhatSinh', (r) => r.id === ps.id, moiPs, true);
      themDong('LichSu', { id: Utilities.getUuid(), luc: moiPs.capNhatLuc, ma: ct.ma, viec: ps.viec, tenViec: 'Phát sinh ' + ps.ma, nguoi: 'CHU_NHA', loai: 'PHAT_SINH',
        ghiChu: kq === 'DUYET' ? 'Chủ nhà đồng ý trên link → được làm' : 'Chủ nhà không làm' + (moiPs.yKien ? ': ' + moiPs.yKien : ''), congKhai: false });
      return psChoChuNha(Object.assign(ps, moiPs));
    }
    if (data.loai === 'MAU') {
      const m = docBang('MauVL').find((r) => r.id === data.id && r.maCongTrinh === ct.ma && !r.xoa);
      if (!m) throw new Error('Không tìm thấy mẫu');
      if (m.trangThai !== 'CHO_KHACH') return mauChoChuNha(m);
      const moiM = { trangThai: data.ketQua === 'DUYET' ? 'DUYET' : 'DOI', ngayKhach: homNay(), quaKhach: 'LINK', yKien: String(data.yKien || '').slice(0, 2000), capNhatLuc: new Date().toISOString() };
      capNhatDong('MauVL', (r) => r.id === m.id, moiM, true);
      themDong('LichSu', { id: Utilities.getUuid(), luc: moiM.capNhatLuc, ma: ct.ma, viec: m.viec, tenViec: 'Mẫu ' + m.hangMuc, nguoi: 'CHU_NHA', loai: 'MAU_VL',
        ghiChu: moiM.trangThai === 'DUYET' ? 'Chủ nhà chốt mẫu ' + m.tenMau + ' trên link' : 'Chủ nhà muốn đổi mẫu' + (moiM.yKien ? ': ' + moiM.yKien : ''), congKhai: false });
      return mauChoChuNha(Object.assign(m, moiM));
    }
    if (data.ketQua === 'TU_CHOI') throw new Error('Phản hồi không hợp lệ');
    const pa = docBang('PhuongAn').find((p) => p.id === data.id && p.maCongTrinh === ct.ma);
    if (!pa) throw new Error('Không tìm thấy phương án');
    if (pa.trangThai !== 'CHO') return paChoChuNha(pa);
    const moi = { trangThai: data.ketQua, ngayPhanHoi: homNay(), yKien: String(data.yKien || '').slice(0, 2000), duyetQua: 'LINK', duyetLuc: new Date().toISOString(), capNhatLuc: new Date().toISOString() };
    capNhatDong('PhuongAn', (r) => r.id === pa.id, moi, true);
    themDong('LichSu', { id: Utilities.getUuid(), luc: moi.duyetLuc, ma: ct.ma, viec: pa.viec, tenViec: 'Thiết kế', nguoi: 'CHU_NHA', loai: 'TK_PA',
      ghiChu: pa.hangMuc + (Number(pa.lan) ? ' sửa lần ' + pa.lan : ' phương án đầu') + ': chủ nhà ' + (data.ketQua === 'DUYET' ? 'đồng ý trên link' : 'yêu cầu sửa') + (moi.yKien ? ': ' + moi.yKien : ''), congKhai: false });
    return paChoChuNha(Object.assign(pa, moi));
  } finally {
    lock.releaseLock();
  }
}

function xacThuc(khoa) {
  if (!khoa) throw new Error('Chưa đăng nhập');
  const u = docBang('NguoiDung').find((x) => x.khoa === khoa);
  if (!u || u.hoatDong !== true) throw new Error('Khoá không đúng hoặc đã bị thu hồi. Xin Thầy link mới.');
  if (u.hetHan && String(u.hetHan) < homNay()) throw new Error('Quyền tạm đã hết hạn ngày ' + u.hetHan + '. Xin Thầy cấp lại nếu cần.');
  return { email: u.email, ten: u.ten, vaiTro: u.vaiTro, congTrinh: String(u.congTrinh || '').split(/[,\s]+/).filter(String) };
}

const laVanPhong = (n) => VAN_PHONG.includes(n.vaiTro);
// Sổ khách chỉ văn phòng thấy; công trình thì người được giao cũng thấy.
const duocXem = (n, ma) => laVanPhong(n) || (!laRieng(ma) && n.congTrinh.includes(ma));
function canVanPhong(n) { if (!laVanPhong(n)) throw new Error('Chỉ Thầy và Đức được làm việc này'); }
const canThay = canVanPhong;
function homNay() { return Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'); }

// ---------- Thao tác ----------
const HANH_DONG = {
  toiLaAi: (n) => n,

  // Toàn bộ dữ liệu người này được xem, đã ghép thành từng công trình.
  keoVe: (n) => {
    const keHoach = docBang('KeHoach');
    const congTrinh = docBang('CongTrinh').filter((c) => duocXem(n, c.ma)).map((c) => ({
      ...c,
      viec: keHoach.filter((v) => v.ma === c.ma).map((v) => ({
        ...v, soNgay: Number(v.soNgay), phanTram: Number(v.phanTram) || 0, thuTu: Number(v.thuTu),
        khoiLuong: v.khoiLuong === '' ? null : v.khoiLuong,
      })).sort((a, b) => a.thuTu - b.thuTu),
    }));
    const lichSu = docBang('LichSu').filter((r) => duocXem(n, r.ma));
    const khach = laVanPhong(n) ? docBang('Khach').map((k) => ({ ...k, soLanNhac: Number(k.soLanNhac) || 0, baoGia: k.baoGia || [], chamSoc: k.chamSoc || [] })) : [];
    const vp = laVanPhong(n);
    const hopDong = vp ? docBang('HopDong').map((h) => ({ ...h, giaTri: Number(h.giaTri) || 0, soLanSua: Number(h.soLanSua) || 0, soBuoiGSTG: Number(h.soBuoiGSTG) || 0,
      nguyenTac: h.nguyenTac === true, dot: h.dot || [], phuLuc: h.phuLuc || [], giaTriKT: Number(h.giaTriKT) || 0,
      chiDuKien: Number(h.chiDuKien) || 0, khauTru: h.khauTru || { han: '', tyLe: 0 }, truTK: h.truTK || { maHD: '', phan: [], soTien: 0 } })) : [];
    const caiDat = vp ? Object.fromEntries(docBang('CaiDat').map((r) => [r.khoa, String(r.giaTri)])) : {};
    const phuongAn = vp ? docBang('PhuongAn').map((p) => ({ ...p, lan: Number(p.lan) || 0 })) : [];
    const thuChi = vp ? docBang('ThuChi').map((e) => ({ ...e, soTien: Number(e.soTien) || 0, soAnh: Number(e.soAnh) || 0 })) : [];
    // Giám sát: chỉ đợt của công trình được giao, bỏ tiền và ghi chú nội bộ.
    const traThau = docBang('TraThau').filter((t) => duocXem(n, t.maCongTrinh)).map((t) => (vp ? { ...t, soTien: Number(t.soTien) || 0 }
      : { id: t.id, maCongTrinh: t.maCongTrinh, thau: t.thau, hangMuc: t.hangMuc, dot: t.dot, dieuKien: t.dieuKien, viecMoc: t.viecMoc, hanTra: t.hanTra, klXacNhan: t.klXacNhan, xoa: t.xoa }));
    const chungTu = vp ? docBang('Anh').filter((a) => a.loai === 'CHUNG_TU').map((a) => ({ id: a.id, viec: a.viec, fileId: a.fileId, tenFile: a.tenFile })) : [];
    const phatSinh = docBang('PhatSinh').filter((p) => duocXem(n, p.maCongTrinh)).map((p) => {
      const o = { ...p, giaBan: Number(p.giaBan) || 0, chiGoc: Number(p.chiGoc) || 0 };
      if (!vp) { delete o.giaBan; delete o.chiGoc; delete o.bangChung; }
      return o;
    });
    const mauVL = docBang('MauVL').filter((m) => duocXem(n, m.maCongTrinh));
    const gstg = docBang('GSTG').filter((g) => duocXem(n, g.maCongTrinh)).map((g) => ({ ...g, lan: Number(g.lan) || 0, nhacGiamSat: g.nhacGiamSat === true }));
    // Danh bạ thầu: ai cũng thấy tên, lĩnh vực, số điện thoại; link riêng và ghi chú nội bộ chỉ văn phòng.
    const nhaThau = docBang('NhaThau').map((t) => (vp ? { ...t, hoatDong: t.hoatDong !== false }
      : { id: t.id, ten: t.ten, linhVuc: t.linhVuc, sdt: t.sdt, hoatDong: t.hoatDong !== false }));
    const danhGia = docBang('DanhGia').filter((d) => duocXem(n, d.maCongTrinh))
      .map((d) => ({ ...d, chatLuong: Number(d.chatLuong) || 0, tienDo: Number(d.tienDo) || 0, phoiHop: Number(d.phoiHop) || 0 }));
    const anh = demAnh(n);
    const nghiemThu = docBang('NghiemThu').filter((x) => duocXem(n, x.maCongTrinh))
      .map((x) => ({ ...x, checklist: x.checklist || [], tonTai: x.tonTai || [], soAnh: Number(x.soAnh) || 0 }));
    const baiDang = vp ? docBang('BaiDang').map((b) => ({ ...b, kenh: b.kenh || [], dsAnh: b.dsAnh || [], baiViet: b.baiViet || {}, ketQua: b.ketQua || {}, lanViet: Number(b.lanViet) || 0 })) : [];
    const chiAI = vp ? docBang('ChiAI').map((r) => ({ luc: r.luc, viec: r.viec, model: r.model, usd: Number(r.usd) || 0 })) : [];
    return { toi: n, congTrinh, lichSu, khach, hopDong, phuongAn, gstg, caiDat, thuChi, traThau, chungTu, phatSinh, mauVL, nhaThau, danhGia, anh, nghiemThu, baiDang, chiAI,
      nguoiDung: vp ? HANH_DONG.dsNguoiDung(n) : [] };
  },

  // Nhận hàng chờ từ máy, áp theo thứ tự. Mục đã nhận (theo idGui) thì bỏ qua.
  dayLen: (n, data) => {
    const lock = LockService.getScriptLock();
    lock.waitLock(25000);
    try {
      const daNhan = new Set(docBang('DaNhan').map((r) => r.idGui));
      const ketQua = [];
      (data.ops || []).forEach((op) => {
        if (daNhan.has(op.idGui)) { ketQua.push({ idGui: op.idGui, ok: true }); return; }
        try {
          apDung(n, op);
          themDong('DaNhan', { idGui: op.idGui, luc: new Date().toISOString() });
          ketQua.push({ idGui: op.idGui, ok: true });
        } catch (err) {
          // Lỗi quyền hoặc dữ liệu hỏng: báo lại để máy bỏ mục này, không chặn cả hàng chờ.
          ketQua.push({ idGui: op.idGui, ok: false, loi: String(err.message || err) });
        }
      });
      return ketQua;
    } finally {
      lock.releaseLock();
    }
  },

  // Ảnh đã nén trên máy, gửi base64. Lưu vào thư mục "Ảnh tiến độ" trong thư mục công trình.
  guiAnh: (n, data) => {
    const chungTu = data.loai === 'CHUNG_TU';
    const baiDang = data.loai === 'BAI_DANG';
    if (chungTu || baiDang) canVanPhong(n);
    else if (!duocXem(n, data.ma)) throw new Error('Không có quyền với công trình ' + data.ma);
    if (baiDang && !/^BD-/.test(String(data.ma))) throw new Error('Ảnh bài đăng cần mã bài BD-');
    const daCo = docBang('Anh').find((r) => r.id === data.id);
    if (daCo) return { fileId: daCo.fileId };
    // Chứng từ (ảnh chuyển khoản, hoá đơn) để riêng ngoài thư mục công trình, vì thư mục công trình có thể đã chia sẻ cho giám sát.
    const sach = String(data.ma).replace(/[^\w-]/g, '');
    const thuMuc = chungTu ? timHoacTao(timHoacTao(DriveApp.getRootFolder(), 'KAS App – Chứng từ'), sach)
      : baiDang ? timHoacTao(timHoacTao(DriveApp.getRootFolder(), 'KAS App – Bài đăng'), sach) : thuMucAnh(data.ma);
    const blob = Utilities.newBlob(Utilities.base64Decode(data.base64), 'image/jpeg', data.tenFile);
    const f = thuMuc.createFile(blob);
    themDong('Anh', { id: data.id, ma: data.ma, viec: data.viec, luc: new Date().toISOString(), tenFile: data.tenFile, fileId: f.getId(), nguoi: n.email, loai: chungTu ? 'CHUNG_TU' : baiDang ? 'BAI_DANG' : '' });
    return { fileId: f.getId() };
  },

  dsNguoiDung: (n) => {
    canThay(n);
    return docBang('NguoiDung').map((u) => ({ email: u.email, ten: u.ten, vaiTro: u.vaiTro, congTrinh: u.congTrinh, khoa: u.khoa, hoatDong: u.hoatDong, hetHan: u.hetHan || '' }));
  },

  // Thêm người hoặc cấp lại khoá mới (khoá cũ bị thu hồi).
  capKhoa: (n, data) => {
    canThay(n);
    if (!VAI_TRO.includes(data.vaiTro)) throw new Error('Vai trò không hợp lệ');
    const email = String(data.email || '').trim().toLowerCase();
    if (!email) throw new Error('Cần Gmail');
    if (data.vaiTro === 'TAM' && !data.hetHan) throw new Error('Quyền tạm cần ngày hết hạn');
    const khoa = taoKhoa();
    const cu = docBang('NguoiDung').filter((u) => String(u.email).toLowerCase() === email && u.hoatDong === true);
    cu.forEach((u) => capNhatDong('NguoiDung', (r) => r.khoa === u.khoa, { hoatDong: false }));
    themDong('NguoiDung', { email, ten: data.ten || email, vaiTro: data.vaiTro, congTrinh: data.congTrinh || '', khoa, hoatDong: true, taoLuc: new Date().toISOString(), hetHan: data.vaiTro === 'TAM' ? data.hetHan : '' });
    return { khoa };
  },

  thuHoi: (n, data) => {
    canThay(n);
    const ds = docBang('NguoiDung');
    if (data.khoa === ds.find((u) => u.email === n.email && u.hoatDong === true).khoa) throw new Error('Không tự thu hồi khoá của mình');
    const ai = ds.find((u) => u.khoa === data.khoa);
    if (ai && ai.vaiTro === 'THAY' && n.vaiTro !== 'THAY') throw new Error('Chỉ Thầy thu hồi được khoá của Thầy');
    capNhatDong('NguoiDung', (r) => r.khoa === data.khoa, { hoatDong: false });
    return { ok: true };
  },
};

function apDung(n, op) {
  if (op.loai === 'TAO_CT') {
    canVanPhong(n);
    const ct = op.ct;
    if (docBang('CongTrinh').some((r) => r.ma === ct.ma)) throw new Error('Mã ' + ct.ma + ' đã có');
    let thuMuc = layIdThuMuc(ct.thuMucDrive);
    // Công trình từ sổ khách, chưa dán thư mục: dùng luôn thư mục của khách (đã có ảnh khảo sát).
    if (!thuMuc && ct.maKhach) {
      const kh = docBang('Khach').find((k) => k.ma === ct.maKhach);
      if (kh && kh.thuMucDrive) thuMuc = kh.thuMucDrive;
    }
    themDong('CongTrinh', { ...ct, thuMucDrive: thuMuc });
    themNhieuDong('KeHoach', ct.viec.map((v) => ({ ...v, ma: ct.ma, capNhatLuc: op.luc })));
    return;
  }
  if (op.loai === 'VIEC') {
    if (!duocXem(n, op.ma)) throw new Error('Không có quyền với công trình ' + op.ma);
    const v = op.viec;
    // Hiện trường chỉ được đổi tiến độ và số ngày (báo chậm); văn phòng sửa được mọi trường.
    const doi = laVanPhong(n) ? { ...v, ma: op.ma } : { phanTram: v.phanTram, trangThai: v.trangThai, thucTe: v.thucTe, soNgay: v.soNgay };
    doi.capNhatLuc = op.luc;
    const timThay = capNhatDong('KeHoach', (r) => r.ma === op.ma && r.id === v.id, doi, true);
    if (!timThay) throw new Error('Không tìm thấy việc ' + v.id);
    return;
  }
  if (op.loai === 'THEM_VIEC') {
    canVanPhong(n);
    if (!docBang('CongTrinh').some((r) => r.ma === op.ma)) throw new Error('Không có công trình ' + op.ma);
    // Gửi lại (mất sóng) thì ghi đè đúng dòng, không thêm trùng.
    capNhatDong('KeHoach', (r) => r.ma === op.ma && r.id === op.viec.id, { ...op.viec, ma: op.ma, capNhatLuc: op.luc });
    return;
  }
  if (op.loai === 'XOA_VIEC') {
    canVanPhong(n);
    xoaDong('KeHoach', (r) => r.ma === op.ma && r.id === op.id); // đã xoá rồi thì thôi
    return;
  }
  if (op.loai === 'CT_SUA') {
    canVanPhong(n);
    const sua = {};
    ['ten', 'khoiCong', 'lich', 'chuNha', 'thuMucDrive', 'choDangAnh'].forEach((k) => { if (op.sua && k in op.sua) sua[k] = op.sua[k]; });
    if ('thuMucDrive' in sua) sua.thuMucDrive = layIdThuMuc(sua.thuMucDrive);
    if (!capNhatDong('CongTrinh', (r) => r.ma === op.ma, sua, true)) throw new Error('Không có công trình ' + op.ma);
    return;
  }
  if (op.loai === 'LICH_SU') {
    if (!duocXem(n, op.e.ma)) throw new Error('Không có quyền với công trình ' + op.e.ma);
    // Người ghi lấy theo khoá đăng nhập, không tin giá trị máy gửi lên. Mới ghi luôn ẩn với chủ nhà.
    themDong('LichSu', { ...op.e, nguoi: n.vaiTro, congKhai: false });
    return;
  }
  if (op.loai === 'KHACH') {
    canVanPhong(n);
    const k = Object.assign({}, op.khach);
    if (!laKhach(k.ma)) throw new Error('Mã khách phải bắt đầu bằng KH-');
    delete k.thuMucDrive; // máy chủ tự quản lý thư mục
    k.capNhatLuc = op.luc;
    capNhatDong('Khach', (r) => r.ma === k.ma, k);
    return;
  }
  if (op.loai === 'HD') {
    canVanPhong(n);
    const h = Object.assign({}, op.hd);
    if (!/^HD-/.test(String(h.ma))) throw new Error('Mã hợp đồng phải bắt đầu bằng HD-');
    h.capNhatLuc = op.luc;
    capNhatDong('HopDong', (r) => r.ma === h.ma, h);
    return;
  }
  if (op.loai === 'PA') {
    canVanPhong(n);
    const p = Object.assign({}, op.pa);
    if (!/^PA-/.test(String(p.id))) throw new Error('Mã phương án phải bắt đầu bằng PA-');
    const cu = docBang('PhuongAn').find((r) => r.id === p.id);
    // Chủ nhà đã trả lời trên link mà máy văn phòng chưa kịp kéo về: giữ câu trả lời của chủ nhà.
    if (cu && cu.duyetQua === 'LINK' && cu.trangThai !== 'CHO' && p.trangThai === 'CHO') {
      ['trangThai', 'ngayPhanHoi', 'yKien', 'duyetQua', 'duyetLuc'].forEach((k) => { p[k] = cu[k]; });
    }
    p.capNhatLuc = op.luc;
    capNhatDong('PhuongAn', (r) => r.id === p.id, p);
    return;
  }
  if (op.loai === 'GSTG') {
    canVanPhong(n);
    const g = Object.assign({}, op.gs);
    if (!/^GS-/.test(String(g.id))) throw new Error('Mã buổi GSTG phải bắt đầu bằng GS-');
    g.capNhatLuc = op.luc;
    capNhatDong('GSTG', (r) => r.id === g.id, g);
    return;
  }
  if (op.loai === 'TC') {
    canVanPhong(n);
    const e = Object.assign({}, op.e);
    if (!/^TC-/.test(String(e.id))) throw new Error('Mã thu chi phải bắt đầu bằng TC-');
    if (e.loai !== 'THU' && e.loai !== 'CHI') throw new Error('Thu hay chi?');
    e.nguoi = e.nguoi || n.vaiTro;
    e.capNhatLuc = op.luc;
    capNhatDong('ThuChi', (r) => r.id === e.id, e);
    return;
  }
  if (op.loai === 'TT') {
    canVanPhong(n);
    const t = Object.assign({}, op.t);
    if (!/^TT-/.test(String(t.id))) throw new Error('Mã đợt trả thầu phải bắt đầu bằng TT-');
    // Xác nhận khối lượng do giám sát ghi trên máy chủ: máy văn phòng gửi bản cũ không xoá mất.
    const cu = docBang('TraThau').find((r) => r.id === t.id);
    if (cu && cu.klXacNhan && !t.klXacNhan) t.klXacNhan = cu.klXacNhan;
    t.capNhatLuc = op.luc;
    capNhatDong('TraThau', (r) => r.id === t.id, t);
    return;
  }
  if (op.loai === 'XAC_NHAN_KL') {
    const t = docBang('TraThau').find((r) => r.id === op.id);
    if (!t || !duocXem(n, t.maCongTrinh)) throw new Error('Không có quyền với đợt trả thầu này');
    if (t.klXacNhan) return; // đã có người xác nhận trước
    capNhatDong('TraThau', (r) => r.id === op.id, { klXacNhan: { ngay: op.ngay, nguoi: n.vaiTro, ghiChu: String(op.ghiChu || '').slice(0, 1000) }, capNhatLuc: op.luc }, true);
    return;
  }
  if (op.loai === 'PS') {
    canVanPhong(n);
    const p = Object.assign({}, op.ps);
    if (!/^PS-/.test(String(p.id))) throw new Error('Mã phát sinh phải bắt đầu bằng PS-');
    const cu = docBang('PhatSinh').find((r) => r.id === p.id);
    // Chủ nhà đã trả lời trên link mà máy văn phòng chưa kéo về: giữ câu trả lời của chủ nhà.
    if (cu && cu.quaKhach === 'LINK' && (cu.trangThai === 'DUYET' || cu.trangThai === 'TU_CHOI') && p.trangThai === 'CHO_KHACH') {
      ['trangThai', 'ngayKhach', 'quaKhach', 'yKien'].forEach((k) => { p[k] = cu[k]; });
    }
    if (cu && cu.daLam && !p.daLam) p.daLam = cu.daLam;
    p.capNhatLuc = op.luc;
    capNhatDong('PhatSinh', (r) => r.id === p.id, p);
    return;
  }
  if (op.loai === 'MAU') {
    canVanPhong(n);
    const m = Object.assign({}, op.m);
    if (!/^MAU-/.test(String(m.id))) throw new Error('Mã mẫu phải bắt đầu bằng MAU-');
    const cu = docBang('MauVL').find((r) => r.id === m.id);
    // Chủ nhà đã chốt trên link mà máy văn phòng gửi bản cũ: giữ câu trả lời của chủ nhà (trừ khi văn phòng gửi mẫu khác).
    if (cu && cu.quaKhach === 'LINK' && cu.trangThai !== 'CHO_KHACH' && m.trangThai === 'CHO_KHACH' && m.ngayGui === cu.ngayGui) {
      ['trangThai', 'ngayKhach', 'quaKhach', 'yKien'].forEach((k) => { m[k] = cu[k]; });
    }
    m.capNhatLuc = op.luc;
    capNhatDong('MauVL', (r) => r.id === m.id, m);
    return;
  }
  if (op.loai === 'PS_BAO') {
    // Giám sát báo phát sinh: chỉ nhận mô tả; giá và trạng thái do văn phòng.
    const p = op.ps || {};
    if (!duocXem(n, p.maCongTrinh)) throw new Error('Không có quyền với công trình ' + p.maCongTrinh);
    if (!/^PS-/.test(String(p.id))) throw new Error('Mã phát sinh phải bắt đầu bằng PS-');
    const ds = docBang('PhatSinh');
    if (ds.some((r) => r.id === p.id)) return;
    let ma = String(p.ma || '');
    // Hai người báo cùng lúc trùng số: lấy số tiếp theo.
    if (!/^PS\d+$/.test(ma) || ds.some((r) => r.maCongTrinh === p.maCongTrinh && r.ma === ma)) {
      const so = ds.filter((r) => r.maCongTrinh === p.maCongTrinh).map((r) => Number(String(r.ma).replace(/\D/g, '')) || 0);
      ma = 'PS' + String((so.length ? Math.max.apply(null, so) : 0) + 1).padStart(2, '0');
    }
    themDong('PhatSinh', { id: p.id, ma, maCongTrinh: p.maCongTrinh, viec: p.viec || '', ngayBao: p.ngayBao, nguoiBao: n.vaiTro, moTa: String(p.moTa || '').slice(0, 2000),
      viTri: String(p.viTri || '').slice(0, 200), giaBan: 0, chiGoc: 0, trangThai: 'CHO_BAO_GIA', capNhatLuc: op.luc });
    return;
  }
  if (op.loai === 'PS_XONG') {
    const p = docBang('PhatSinh').find((r) => r.id === op.id);
    if (!p || !duocXem(n, p.maCongTrinh)) throw new Error('Không có quyền với phiếu phát sinh này');
    if (p.trangThai !== 'DUYET') throw new Error('Phát sinh chưa được duyệt, chưa làm');
    capNhatDong('PhatSinh', (r) => r.id === op.id, { daLam: op.ngay, capNhatLuc: op.luc }, true);
    return;
  }
  if (op.loai === 'NT') {
    canVanPhong(n);
    const t = Object.assign({}, op.t);
    if (!/^NT-/.test(String(t.id))) throw new Error('Mã thầu phải bắt đầu bằng NT-');
    if (!String(t.ten || '').trim()) throw new Error('Thầu cần tên');
    const cu = docBang('NhaThau').find((r) => r.id === t.id);
    if (cu && cu.maLink) t.maLink = cu.maLink; // link đã gửi thầu thì giữ, không đổi
    t.capNhatLuc = op.luc;
    capNhatDong('NhaThau', (r) => r.id === t.id, t);
    return;
  }
  if (op.loai === 'DG') {
    const d = Object.assign({}, op.d);
    if (!duocXem(n, d.maCongTrinh)) throw new Error('Không có quyền với công trình ' + d.maCongTrinh);
    if (!/^DG-/.test(String(d.id))) throw new Error('Mã đánh giá phải bắt đầu bằng DG-');
    const diem = (x) => Math.max(0, Math.min(5, Math.round(Number(x) || 0)));
    const cu = docBang('DanhGia').find((r) => r.id === d.id);
    if (cu && cu.nguoi !== n.vaiTro) throw new Error('Chỉ người đánh giá được sửa phiếu này');
    capNhatDong('DanhGia', (r) => r.id === d.id, { id: d.id, maThau: d.maThau, maCongTrinh: d.maCongTrinh, ngay: d.ngay, chatLuong: diem(d.chatLuong),
      tienDo: diem(d.tienDo), phoiHop: diem(d.phoiHop), ghiChu: String(d.ghiChu || '').slice(0, 1000), nguoi: n.vaiTro, capNhatLuc: op.luc });
    return;
  }
  if (op.loai === 'NGHIEM_THU') {
    const x = Object.assign({}, op.n);
    if (!duocXem(n, x.maCongTrinh)) throw new Error('Không có quyền với công trình ' + x.maCongTrinh);
    if (!/^NTH-/.test(String(x.id))) throw new Error('Mã nghiệm thu phải bắt đầu bằng NTH-');
    const cu = docBang('NghiemThu').find((r) => r.id === x.id);
    // Hai máy cùng sửa: tồn tại đã đánh dấu sửa xong ở máy khác thì giữ.
    const daSua = {};
    ((cu && cu.tonTai) || []).forEach((t) => { if (t.daSua) daSua[t.id] = t; });
    const tonTai = (x.tonTai || []).map((t) => (daSua[t.id] && !t.daSua ? Object.assign({}, t, { daSua: daSua[t.id].daSua, nguoiSua: daSua[t.id].nguoiSua }) : t));
    capNhatDong('NghiemThu', (r) => r.id === x.id, { id: x.id, maCongTrinh: x.maCongTrinh, viec: x.viec, ngay: x.ngay, nguoi: cu ? cu.nguoi : n.vaiTro,
      checklist: x.checklist || [], tonTai, ghiChu: String(x.ghiChu || '').slice(0, 2000), soAnh: Number(x.soAnh) || 0, xoa: x.xoa || '', capNhatLuc: op.luc });
    return;
  }
  if (op.loai === 'BD') {
    canVanPhong(n);
    apBai(n, op.b, op.luc);
    return;
  }
  if (op.loai === 'CAI_DAT') {
    canVanPhong(n);
    if (!/^[a-zA-Z]{1,40}$/.test(String(op.khoa))) throw new Error('Tên cài đặt không hợp lệ');
    capNhatDong('CaiDat', (r) => r.khoa === op.khoa, { khoa: op.khoa, giaTri: String(op.giaTri || '').slice(0, 2000), capNhatLuc: op.luc });
    return;
  }
  if (op.loai === 'CONG_KHAI') {
    canThay(n);
    capNhatDong('LichSu', (r) => r.id === op.id, { congKhai: op.congKhai === true }, true);
    return;
  }
  throw new Error('Loại thay đổi lạ: ' + op.loai);
}

// ---------- Đăng bài: AI viết, Thầy duyệt, máy chủ đăng ----------
// Khoá bí mật để trong Cài đặt dự án → Thuộc tính tập lệnh (Script properties), KHÔNG để trong mã hay bảng CaiDat:
//   ANTHROPIC_API_KEY · FB_PAGE_ID, FB_PAGE_TOKEN · IG_TOKEN (hoặc IG_USER_ID nếu Instagram nối Fanpage) · WP_URL, WP_USER, WP_APP_PASSWORD
//   GEMINI_API_KEY · CANVA_CLIENT_ID, CANVA_CLIENT_SECRET (máy chủ tự lưu CANVA_REFRESH khi Thầy bấm Nối Canva) · PT_FOLDER_ID (nếu thư viện phong thủy để chỗ khác)
// Không bài nào lên mạng khi Thầy chưa bấm Duyệt (máy chủ tự kiểm, kể cả bài hẹn giờ).
const KENH_BD = ['FB', 'IG', 'TT', 'WEB'];
const LOAI_BD = { DU_AN: 'Dự án đã làm', CAM_HUNG: 'Cảm hứng, động lực', PHONG_THUY: 'Phong thủy', KINH_NGHIEM: 'Kinh nghiệm làm nhà' };
const TEN_LOAI_CT = { TK: 'Thiết kế', XM: 'Xây mới', CT: 'Cải tạo', NTCT: 'Nội thất có cải tạo thô', NT: 'Nội thất' };
// Giá Claude API (USD / 1 triệu token vào, ra), tra trang giá chính thức ngày 13/11/2026. Tìm web 10 USD / 1.000 lượt.
const GIA_AI = { 'claude-opus-5-5': [4, 20], 'claude-sonnet-5-5': [2, 10] };
// Thầy chọn Sonnet 5.5 ngày 13/11/2026 (rẻ bằng nửa Opus). Đổi được trong Cài đặt đăng bài.
const MODEL_MAC_DINH = 'claude-sonnet-5-5';
const GRAPH = 'https://graph.facebook.com/v25.0';
// Instagram không cần nối Fanpage, tra tài liệu Meta 14/11/2026. Có 2 loại mã:
//  - Mã "Instagram login" (bắt đầu bằng IG): gọi graph.instagram.com. App Meta mới không tạo được loại này nữa.
//  - Mã "Unified login" (app KAS App đang dùng): gọi graph.facebook.com kèm ID tài khoản Instagram.
const GRAPH_IG = 'https://graph.instagram.com/v26.0';
const GRAPH_IG_FB = 'https://graph.facebook.com/v26.0';
const laMaIGLogin = (ma) => /^IG/.test(String(ma || ''));
// Máy gửi lên không được tự đặt các trường này.
const TRUONG_MAY_CHU = ['trangThai', 'ketQua', 'nguoiDuyet', 'duyetLuc', 'lanViet', 'canva'];
const TRUONG_NOI_DUNG = ['baiViet', 'dsAnh', 'anhBia'];

const bi = (k) => PropertiesService.getScriptProperties().getProperty(k) || '';
const caiDatMay = () => Object.fromEntries(docBang('CaiDat').map((r) => [r.khoa, String(r.giaTri)]));
const giong = (a, b) => JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);

// Ghi bài từ máy gửi lên. Sửa nội dung sau khi đã duyệt thì phải duyệt lại; bài đã đăng chỉ sửa được ý kiến, xoá.
function apBai(n, b, luc) {
  if (!/^BD-/.test(String(b && b.id))) throw new Error('Mã bài phải bắt đầu bằng BD-');
  const cu = docBang('BaiDang').find((r) => r.id === b.id);
  const moi = Object.assign({}, b);
  TRUONG_MAY_CHU.forEach((k) => { delete moi[k]; });
  if ('kenh' in moi) moi.kenh = (moi.kenh || []).filter((k) => KENH_BD.indexOf(k) >= 0);
  if (moi.loai && !LOAI_BD[moi.loai]) throw new Error('Loại bài không hợp lệ');
  if (cu && cu.trangThai === 'DA_DANG') {
    const giu = { yKien: moi.yKien, xoa: moi.xoa };
    Object.keys(moi).forEach((k) => { if (!(k in giu)) delete moi[k]; });
    Object.keys(giu).forEach((k) => { if (giu[k] === undefined) delete moi[k]; });
  }
  if (!cu) {
    moi.trangThai = moi.baiViet && Object.keys(moi.baiViet).length ? 'CHO_DUYET' : 'NHAP';
    moi.nguoiTao = n.vaiTro;
    moi.taoLuc = moi.taoLuc || luc;
    moi.ketQua = {}; moi.lanViet = 0;
  } else if (cu.trangThai === 'DUYET' && TRUONG_NOI_DUNG.some((k) => k in moi && !giong(moi[k], cu[k]))) {
    Object.assign(moi, { trangThai: 'CHO_DUYET', nguoiDuyet: '', duyetLuc: '' });
  } else if (cu.trangThai === 'NHAP' && moi.baiViet && Object.keys(moi.baiViet).length) {
    moi.trangThai = 'CHO_DUYET';
  }
  moi.capNhatLuc = luc;
  capNhatDong('BaiDang', (r) => r.id === b.id, moi);
  return docBang('BaiDang').find((r) => r.id === b.id);
}

function timBai(id) {
  const b = docBang('BaiDang').find((r) => r.id === id && !r.xoa);
  if (!b) throw new Error('Không tìm thấy bài ' + id);
  b.kenh = b.kenh || []; b.dsAnh = b.dsAnh || []; b.baiViet = b.baiViet || {}; b.ketQua = b.ketQua || {};
  return b;
}
const traBai = (b) => Object.assign({}, b, { lanViet: Number(b.lanViet) || 0 });

// Dữ kiện công trình gửi cho AI: loại hình, hạng mục, thời gian. Không tên công trình (hay có tên chủ nhà), không địa chỉ, không tiền.
function duKienCongTrinh(ma) {
  if (!ma) return '';
  const ct = docBang('CongTrinh').find((c) => c.ma === ma);
  if (!ct) return '';
  const vs = docBang('KeHoach').filter((v) => v.ma === ma);
  const nhom = [];
  vs.forEach((v) => { const g = String(v.nhom || '').replace(/\s*\(.*\)\s*$/, ''); if (g && nhom.indexOf(g) < 0) nhom.push(g); });
  const xong = vs.filter((v) => Number(v.phanTram) >= 100).length;
  const bd = vs.map((v) => (v.thucTe || {}).batDau).filter(Boolean).sort()[0];
  const kt = vs.map((v) => (v.thucTe || {}).ketThuc).filter(Boolean).sort().pop();
  const dong = ['Loại hình: ' + (TEN_LOAI_CT[ct.loai] || ct.loai), 'Các nhóm hạng mục: ' + nhom.join(', ')];
  if (vs.length && xong === vs.length && bd && kt) dong.push('Đã hoàn thành. Thi công thực tế từ ' + bd + ' đến ' + kt + ' (' + (Math.round((Date.parse(kt) - Date.parse(bd)) / 864e5) + 1) + ' ngày lịch).');
  else dong.push('Đang thi công: xong ' + xong + '/' + vs.length + ' đầu việc.');
  return dong.join('\n');
}

const HE_THONG_VIET = [
  'Bạn viết nội dung cho KAS Houzing (Công ty TNHH KAS Việt Nam): tư vấn thiết kế, thi công trọn gói kiến trúc, xây dựng và nội thất nhà ở, phân khúc trung–cao cấp, ở Hà Nội và các tỉnh lân cận; KAS có tư vấn phong thủy nhà ở.',
  'Giọng văn: chuyên nghiệp, gần gũi, rõ ràng, tiếng Việt tự nhiên. Không sáo rỗng, không phóng đại, không dùng lời quảng cáo kiểu "số 1", "rẻ nhất", "cam kết 100%".',
  'Quy tắc bắt buộc:',
  '1. Chỉ dùng dữ kiện có trong tin nhắn. Không bịa số liệu (giá, diện tích, thời gian, số công trình, số năm kinh nghiệm), không bịa tên người, địa danh, chứng nhận, giải thưởng. Cần một con số mà dữ kiện không có thì viết [Thầy điền: nội dung cần điền].',
  '2. Không nêu tên, số điện thoại, địa chỉ, số nhà của chủ nhà; không nêu giá trị hợp đồng.',
  '3. Phong thủy: chỉ diễn giải đúng đoạn TÀI LIỆU PHONG THỦY được đưa, ghi tên nguồn ở cuối bài; không thêm kiến thức ngoài đoạn đó, không trộn trường phái khác. Không hứa hẹn kết quả (giàu có, sức khỏe, may mắn, thăng tiến); dùng cách nói tư vấn như "theo [nguồn]...", "gia chủ có thể cân nhắc...".',
  '4. Ảnh đính kèm là ảnh thật công trình KAS. Chỉ tả những gì thấy rõ trong ảnh; không chắc vật liệu, thương hiệu thì không nêu.',
  '5. Kết bài mời liên hệ nhẹ nhàng (nhắn Fanpage hoặc để lại số điện thoại), không gây áp lực.',
  'Từng kênh:',
  '- fb (Facebook Fanpage): 120–250 chữ, câu mở đầu gây chú ý, đoạn ngắn dễ đọc trên điện thoại, tối đa 3 biểu tượng cảm xúc, 3–5 hashtag cuối bài, có #KASHouzing.',
  '- ig (Instagram): bản ngắn của bài Facebook, 60–120 chữ, 5–10 hashtag cuối bài.',
  '- tt (TikTok): tieuDe dưới 60 ký tự; chuThich 40–100 chữ kèm 3–5 hashtag; kichBan 5–8 cảnh cho video 30–45 giây, mỗi cảnh một dòng: ảnh hoặc cảnh quay | chữ trên màn hình | lời đọc.',
  '- web (bài website, mục Chia sẻ): tieuDe dưới 65 ký tự có từ khóa chính; moTa 140–160 ký tự; noiDung 800–1200 chữ, chia mục bằng dòng bắt đầu "## ", đoạn ngắn, trả lời thẳng câu khách hay hỏi, cuối bài có mục "## Hỏi đáp" 2–3 câu; tuKhoa gồm từ khóa chính và 3–5 từ khóa phụ.',
  '- tieuDeBia: tiêu đề in lên ảnh bìa, tối đa 8 chữ; phuDeBia: dòng phụ tối đa 10 chữ.',
].join('\n');

function luocDo(kenh, coBia) {
  const chu = { type: 'string' };
  const p = {}; const r = [];
  if (kenh.indexOf('FB') >= 0) { p.fb = chu; r.push('fb'); }
  if (kenh.indexOf('IG') >= 0) { p.ig = chu; r.push('ig'); }
  if (kenh.indexOf('TT') >= 0) {
    p.tt = { type: 'object', properties: { tieuDe: chu, chuThich: chu, kichBan: chu }, required: ['tieuDe', 'chuThich', 'kichBan'], additionalProperties: false }; r.push('tt');
  }
  if (kenh.indexOf('WEB') >= 0) {
    p.web = { type: 'object', properties: { tieuDe: chu, moTa: chu, noiDung: chu, tuKhoa: { type: 'array', items: chu } }, required: ['tieuDe', 'moTa', 'noiDung', 'tuKhoa'], additionalProperties: false };
    r.push('web');
  }
  if (coBia) { p.tieuDeBia = chu; p.phuDeBia = chu; r.push('tieuDeBia', 'phuDeBia'); }
  return { type: 'object', properties: p, required: r, additionalProperties: false };
}

// Lời nhắn cho AI: dữ kiện, tài liệu, bài mẫu giọng văn (bài Thầy đã duyệt), chủ đề đã đăng để tránh lặp, ý kiến sửa.
function loiNhanViet(b, kenh, tatCa) {
  const d = ['LOẠI BÀI: ' + LOAI_BD[b.loai], 'CHỦ ĐỀ: ' + (b.chuDe || '(chưa có, tự chọn theo loại bài)')];
  if (b.ghiChu) d.push('GHI CHÚ CỦA THẦY:\n' + b.ghiChu);
  const dk = duKienCongTrinh(b.maCongTrinh);
  if (dk) d.push('DỮ KIỆN CÔNG TRÌNH:\n' + dk);
  if (b.loai === 'PHONG_THUY') d.push('TÀI LIỆU PHONG THỦY (nguồn: ' + b.nguonTL + '):\n"""\n' + b.trichDan + '\n"""');
  const khac = tatCa.filter((x) => x.id !== b.id && !x.xoa);
  const daDang = khac.filter((x) => x.chuDe).sort((a, c) => String(c.taoLuc).localeCompare(String(a.taoLuc))).slice(0, 15).map((x) => '- ' + x.chuDe);
  if (daDang.length) d.push('CHỦ ĐỀ ĐÃ CÓ GẦN ĐÂY (tránh lặp ý, lặp câu mở đầu):\n' + daDang.join('\n'));
  const mau = khac.filter((x) => (x.trangThai === 'DUYET' || x.trangThai === 'DA_DANG') && x.baiViet && x.baiViet.fb)
    .sort((a, c) => String(c.duyetLuc).localeCompare(String(a.duyetLuc))).slice(0, 2).map((x) => '"""\n' + x.baiViet.fb + '\n"""');
  if (mau.length && kenh.indexOf('WEB') < 0) d.push('BÀI MẪU GIỌNG VĂN (Thầy đã duyệt, học giọng, không chép ý):\n' + mau.join('\n'));
  const cu = b.baiViet || {};
  const banCu = {};
  if (kenh.indexOf('FB') >= 0 && cu.fb) banCu.fb = cu.fb;
  if (kenh.indexOf('IG') >= 0 && cu.ig) banCu.ig = cu.ig;
  if (kenh.indexOf('TT') >= 0 && cu.tt) banCu.tt = cu.tt;
  if (kenh.indexOf('WEB') >= 0 && cu.web) banCu.web = cu.web;
  if (b.yKien && Object.keys(banCu).length) d.push('BẢN TRƯỚC:\n' + JSON.stringify(banCu) + '\nÝ KIẾN SỬA CỦA THẦY (làm đúng theo ý kiến này):\n' + b.yKien);
  d.push('Viết cho: ' + kenh.map((k) => ({ FB: 'fb', IG: 'ig', TT: 'tt', WEB: 'web' }[k])).join(', ') + '.');
  return d.join('\n\n');
}

function ghiChiAI(viec, model, usage) {
  const u = usage || {};
  const vao = (Number(u.input_tokens) || 0) + (Number(u.cache_creation_input_tokens) || 0) + (Number(u.cache_read_input_tokens) || 0);
  const ra = Number(u.output_tokens) || 0;
  const tim = Number((u.server_tool_use || {}).web_search_requests) || 0;
  const g = GIA_AI[model] || GIA_AI[MODEL_MAC_DINH];
  const usd = Math.round(((vao * g[0] + ra * g[1]) / 1e6 + tim * 0.01) * 10000) / 10000;
  themDong('ChiAI', { luc: new Date().toISOString(), viec, model, vao, ra, timWeb: tim, usd });
}

// Gọi Claude API (Messages). UrlFetchApp tối đa khoảng 60 giây mỗi lần gọi, nên mỗi lần chỉ viết 1 nhóm kênh.
function goiClaude(viec, body) {
  const key = bi('ANTHROPIC_API_KEY');
  if (!key) throw new Error('Chưa có khoá Claude API. Thầy dán khoá vào Thuộc tính tập lệnh ANTHROPIC_API_KEY (xem hướng dẫn cài).');
  const r = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'x-api-key': key, 'anthropic-version': '2026-10-21', 'anthropic-beta': 'server-side-fallback-2026-07-01' },
    payload: JSON.stringify(Object.assign({ fallbacks: 'default' }, body)),
  });
  const ma = r.getResponseCode();
  let j = {};
  try { j = JSON.parse(r.getContentText()); } catch (e) { /* trả về không phải JSON */ }
  if (ma !== 200) throw new Error('Claude API lỗi ' + ma + ': ' + ((j.error && j.error.message) || r.getContentText().slice(0, 200)));
  ghiChiAI(viec, j.model || body.model, j.usage);
  if (j.stop_reason === 'refusal') throw new Error('AI không viết bài này. Thầy đổi cách diễn đạt chủ đề hoặc ghi chú rồi thử lại.');
  if (j.stop_reason === 'max_tokens') throw new Error('Bài dài quá giới hạn, AI chưa viết xong. Thử lại.');
  return j;
}
const chuCua = (j) => (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');

function anhChoAI(ids) {
  const anh = docBang('Anh');
  return ids.slice(0, 3).map((id) => anh.find((a) => a.id === id)).filter(Boolean).map((a) => {
    try {
      const blob = DriveApp.getFileById(a.fileId).getBlob();
      return { type: 'image', source: { type: 'base64', media_type: blob.getContentType() || 'image/jpeg', data: Utilities.base64Encode(blob.getBytes()) } };
    } catch (e) { return null; }
  }).filter(Boolean);
}

Object.assign(HANH_DONG, {
  // Lưu bài rồi để AI viết các kênh được hỏi (mỗi lần 1 nhóm: FB+IG, TT hoặc WEB). Trả bài mới.
  vietBai: (n, data) => {
    canVanPhong(n);
    if (data.bai) apBai(n, data.bai, new Date().toISOString());
    const b = timBai(data.id || (data.bai && data.bai.id));
    if (b.trangThai === 'DA_DANG') throw new Error('Bài đã đăng, không viết lại');
    if (b.loai === 'PHONG_THUY' && (!String(b.trichDan || '').trim() || !String(b.nguonTL || '').trim())) throw new Error('Bài phong thủy cần đoạn tài liệu và tên nguồn');
    const kenh = (data.kenh || b.kenh).filter((k) => b.kenh.indexOf(k) >= 0);
    if (!kenh.length) throw new Error('Bài chưa chọn kênh');
    const cd = caiDatMay();
    const model = GIA_AI[cd.bdModel] ? cd.bdModel : MODEL_MAC_DINH;
    const coBia = kenh.indexOf('FB') >= 0 || kenh.indexOf('IG') >= 0 || (kenh.indexOf('TT') >= 0 && b.kenh.indexOf('FB') < 0 && b.kenh.indexOf('IG') < 0);
    const j = goiClaude('Viết bài ' + kenh.join('+'), {
      model, max_tokens: kenh.indexOf('WEB') >= 0 ? 12000 : 6000, system: HE_THONG_VIET,
      output_config: { effort: cd.bdEffort === 'medium' ? 'medium' : 'low', format: { type: 'json_schema', schema: luocDo(kenh, coBia) } },
      messages: [{ role: 'user', content: anhChoAI(b.dsAnh).concat([{ type: 'text', text: loiNhanViet(b, kenh, docBang('BaiDang')) }]) }],
    });
    let ra;
    try { ra = JSON.parse(chuCua(j)); } catch (e) { throw new Error('AI trả lời sai dạng, thử lại'); }
    const bv = Object.assign({}, b.baiViet);
    ['fb', 'ig', 'tt', 'web'].forEach((k) => { if (ra[k] !== undefined) bv[k] = ra[k]; });
    const sua = { baiViet: bv, lanViet: (Number(b.lanViet) || 0) + 1, trangThai: 'CHO_DUYET', nguoiDuyet: '', duyetLuc: '', capNhatLuc: new Date().toISOString() };
    if (coBia && ra.tieuDeBia && !b.tieuDeBia) { sua.tieuDeBia = ra.tieuDeBia; sua.phuDeBia = ra.phuDeBia || ''; }
    capNhatDong('BaiDang', (r) => r.id === b.id, sua, true);
    return traBai(timBai(b.id));
  },

  // AI tìm chủ đề: tìm web (tối đa 3 lượt) + công trình đã xong + chủ đề đã đăng. Không lưu, máy hiện để Thầy chọn.
  timChuDe: (n, data) => {
    canVanPhong(n);
    const cd = caiDatMay();
    const model = GIA_AI[cd.bdModel] ? cd.bdModel : MODEL_MAC_DINH;
    const daCo = docBang('BaiDang').filter((x) => !x.xoa && x.chuDe).slice(-20).map((x) => '- ' + x.chuDe).join('\n');
    const ct = docBang('CongTrinh').filter((c) => c.choDangAnh === true).map((c) => '- ' + c.ma + ': ' + duKienCongTrinh(c.ma).replace(/\n/g, '; ')).join('\n');
    const loi = ['Gợi ý ' + (Number(data.soLuong) || 8) + ' chủ đề bài đăng cho KAS Houzing tuần này, ưu tiên: dự án đã làm, cảm hứng/động lực khi làm nhà, phong thủy nhà ở.',
      'Tìm trên web xem khách làm nhà, làm nội thất ở Hà Nội đang quan tâm gì (mùa, xu hướng, câu hỏi hay gặp), chỉ dùng nguồn tìm được, không bịa số liệu.',
      'Chủ đề phong thủy chỉ nêu tên vấn đề, ghi rõ "cần tài liệu Thầy", không tự luận giải.',
      ct ? 'Công trình chủ nhà đã cho đăng ảnh:\n' + ct : 'Chưa có công trình nào cho đăng ảnh.',
      daCo ? 'Chủ đề đã có (tránh lặp):\n' + daCo : '',
      'Trả lời DUY NHẤT một khối JSON: {"chuDe":[{"tieuDe":"...","loai":"DU_AN|CAM_HUNG|PHONG_THUY|KINH_NGHIEM","viSao":"1 câu","kenh":["FB","IG","TT","WEB"],"maCongTrinh":"mã hoặc rỗng","nguon":"link nguồn hoặc rỗng"}]}'].filter(Boolean).join('\n\n');
    let msgs = [{ role: 'user', content: loi }];
    let j; let chu = '';
    for (let lan = 0; lan < 3; lan++) {
      j = goiClaude('Tìm chủ đề', { model, max_tokens: 8000, system: HE_THONG_VIET, output_config: { effort: 'low' },
        tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 3 }], messages: msgs });
      chu += chuCua(j);
      if (j.stop_reason !== 'pause_turn') break;
      msgs = msgs.concat([{ role: 'assistant', content: j.content }]);
    }
    const a = chu.indexOf('{'); const z = chu.lastIndexOf('}');
    try { return (JSON.parse(chu.slice(a, z + 1)).chuDe || []).filter((x) => x && x.tieuDe).map((x) => ({ ...x, loai: LOAI_BD[x.loai] ? x.loai : 'KINH_NGHIEM' })); }
    catch (e) { throw new Error('AI trả lời sai dạng, thử lại'); }
  },

  // Chỉ Thầy duyệt. Duyệt xong bài đăng theo ngày giờ đã hẹn (hoặc bấm Đăng ngay).
  duyetBai: (n, data) => {
    if (n.vaiTro !== 'THAY') throw new Error('Chỉ Thầy duyệt bài');
    if (data.bai) apBai(n, data.bai, new Date().toISOString());
    const b = timBai(data.id || data.bai.id);
    if (b.trangThai === 'DA_DANG') return traBai(b);
    const bv = b.baiViet;
    const thieu = b.kenh.filter((k) => (k === 'FB' && !bv.fb) || (k === 'IG' && !bv.ig && !bv.fb) || (k === 'TT' && !bv.tt) || (k === 'WEB' && !(bv.web && bv.web.noiDung)));
    if (!b.kenh.length) throw new Error('Bài chưa chọn kênh');
    if (thieu.length) throw new Error('Chưa có nội dung cho ' + thieu.join(', '));
    if (b.kenh.indexOf('IG') >= 0 && !b.anhBia && !b.dsAnh.length) throw new Error('Instagram cần ít nhất 1 ảnh');
    capNhatDong('BaiDang', (r) => r.id === b.id, { trangThai: 'DUYET', nguoiDuyet: n.vaiTro, duyetLuc: new Date().toISOString(), capNhatLuc: new Date().toISOString() }, true);
    return traBai(timBai(b.id));
  },

  boDuyet: (n, data) => {
    if (n.vaiTro !== 'THAY') throw new Error('Chỉ Thầy bỏ duyệt');
    const b = timBai(data.id);
    if (b.trangThai === 'DUYET') capNhatDong('BaiDang', (r) => r.id === b.id, { trangThai: 'CHO_DUYET', nguoiDuyet: '', duyetLuc: '', capNhatLuc: new Date().toISOString() }, true);
    return traBai(timBai(b.id));
  },

  // Đăng ngay các kênh tự đăng được (Facebook, Instagram, website) của bài đã duyệt.
  dangBai: (n, data) => {
    canVanPhong(n);
    return traBai(dangMotBai(timBai(data.id)));
  },

  // TikTok (và kênh nào đăng tay): đánh dấu đã đăng, kèm link nếu có.
  daDangTay: (n, data) => {
    canVanPhong(n);
    const b = timBai(data.id);
    if (b.trangThai !== 'DUYET' && b.trangThai !== 'DA_DANG') throw new Error('Bài chưa được Thầy duyệt');
    if (b.kenh.indexOf(data.kenh) < 0) throw new Error('Bài không có kênh ' + data.kenh);
    b.ketQua[data.kenh] = { tay: true, luc: new Date().toISOString(), link: String(data.link || '').slice(0, 500), nguoi: n.vaiTro };
    luuKetQua(b);
    return traBai(timBai(b.id));
  },

  // Ảnh nhỏ để chọn: theo công trình / bài (ma) hoặc theo danh sách mã ảnh (ids). Không trả chứng từ.
  anhThu: (n, data) => {
    canVanPhong(n);
    const ds = docBang('Anh').filter((a) => a.loai !== 'CHUNG_TU' && (data.ma ? a.ma === data.ma : (data.ids || []).indexOf(a.id) >= 0))
      .sort((a, b) => String(b.luc).localeCompare(String(a.luc))).slice(0, 80);
    return ds.map((a) => {
      let thu = '';
      try { const t = DriveApp.getFileById(a.fileId).getThumbnail(); if (t) thu = Utilities.base64Encode(t.getBytes()); } catch (e) { /* file đã xoá */ }
      return { id: a.id, ma: a.ma, viec: a.viec, luc: a.luc, thu };
    });
  },

  // Ảnh đầy đủ (để dựng ảnh bìa, chia sẻ sang TikTok). Chỉ ảnh có trong bảng Anh, không phải chứng từ.
  layAnh: (n, data) => {
    canVanPhong(n);
    const a = docBang('Anh').find((x) => x.id === data.id && x.loai !== 'CHUNG_TU');
    if (!a) throw new Error('Không có ảnh này');
    const blob = DriveApp.getFileById(a.fileId).getBlob();
    return { id: a.id, loai: blob.getContentType() || 'image/jpeg', base64: Utilities.base64Encode(blob.getBytes()) };
  },
});

// ---------- Thư viện phong thủy (tài liệu Thầy đã nghiên cứu) ----------
// Thư mục mặc định: My Drive/LeonidasProject/_shared/phong-thuy-core/_private. Đặt PT_FOLDER_ID trong Thuộc tính tập lệnh nếu để chỗ khác.
// Đọc được: Google Docs, .md, .txt; Word và PDF thì Drive chuyển tạm sang Google Docs để đọc rồi xoá bản tạm.
const DUONG_TV_PT = ['LeonidasProject', '_shared', 'phong-thuy-core', '_private'];
const MIME_DOC = 'application/vnd.google-apps.document';
const MIME_DOI = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

function thuMucTV() {
  const id = bi('PT_FOLDER_ID');
  if (id) return DriveApp.getFolderById(id);
  let f = DriveApp.getRootFolder();
  for (let i = 0; i < DUONG_TV_PT.length; i++) {
    const it = f.getFoldersByName(DUONG_TV_PT[i]);
    if (!it.hasNext()) throw new Error('Không thấy thư mục thư viện phong thủy (' + DUONG_TV_PT.slice(0, i + 1).join('/') + '). Thầy đặt PT_FOLDER_ID trong Thuộc tính tập lệnh.');
    f = it.next();
  }
  return f;
}

const docDuoc = (mime, ten) => mime === MIME_DOC || MIME_DOI.indexOf(mime) >= 0 || /^text\//.test(mime) || /\.(md|txt)$/i.test(ten);

// Danh sách file đọc được trong thư viện (đi sâu 3 cấp thư mục, tối đa 300 file).
function dsTaiLieu() {
  const ra = [];
  const di = (f, duong, sau) => {
    const fs = f.getFiles();
    while (fs.hasNext() && ra.length < 300) {
      const x = fs.next();
      if (docDuoc(x.getMimeType(), x.getName())) ra.push({ id: x.getId(), ten: x.getName(), thuMuc: duong, loai: x.getMimeType(), sua: x.getLastUpdated().toISOString().slice(0, 10) });
    }
    if (sau >= 3) return;
    const ds = f.getFolders();
    while (ds.hasNext() && ra.length < 300) { const c = ds.next(); di(c, duong ? duong + '/' + c.getName() : c.getName(), sau + 1); }
  };
  di(thuMucTV(), '', 0);
  return ra.sort((a, b) => (a.thuMuc + '/' + a.ten).localeCompare(b.thuMuc + '/' + b.ten));
}

// Chữ trong 1 tài liệu. Chỉ đọc file nằm trong thư viện.
function chuTaiLieu(id) {
  const tl = dsTaiLieu().find((x) => x.id === id);
  if (!tl) throw new Error('Tài liệu không nằm trong thư viện phong thủy');
  const tk = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
  const xuat = (fid) => {
    const r = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + fid + '/export?mimeType=text/plain', { headers: tk, muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) throw new Error('Không đọc được ' + tl.ten + ' (' + r.getResponseCode() + ')');
    return r.getContentText('UTF-8');
  };
  let chu;
  if (tl.loai === MIME_DOC) chu = xuat(id);
  else if (MIME_DOI.indexOf(tl.loai) >= 0) {
    const r = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + id + '/copy', {
      method: 'post', contentType: 'application/json', headers: tk, muteHttpExceptions: true,
      payload: JSON.stringify({ name: '[tạm KAS App] ' + tl.ten, mimeType: MIME_DOC }),
    });
    if (r.getResponseCode() !== 200) throw new Error('Drive không chuyển được ' + tl.ten + ' sang chữ (' + r.getResponseCode() + ')');
    const tam = JSON.parse(r.getContentText()).id;
    try { chu = xuat(tam); } finally { try { DriveApp.getFileById(tam).setTrashed(true); } catch (e) { /* đã xoá */ } }
  } else chu = DriveApp.getFileById(id).getBlob().getDataAsString('UTF-8');
  return { id, ten: tl.ten, thuMuc: tl.thuMuc, chu: String(chu || '').replace(/\r\n/g, '\n').replace(/^﻿/, '') };
}

// So khớp đoạn trích với tài liệu, bỏ qua khác biệt khoảng trắng.
const gonChu = (s) => String(s || '').replace(/\s+/g, ' ').trim();

Object.assign(HANH_DONG, {
  thuVienPT: (n) => { canVanPhong(n); return dsTaiLieu(); },

  // Đọc 1 tài liệu (Thầy tự chọn đoạn). Trả tối đa 300.000 ký tự.
  docTaiLieu: (n, data) => {
    canVanPhong(n);
    const t = chuTaiLieu(data.id);
    return Object.assign(t, { chu: t.chu.slice(0, 300000), cat: t.chu.length > 300000 });
  },

  // AI tìm trong tài liệu các đoạn liên quan chủ đề. AI chỉ được chép nguyên văn; đoạn nào không có trong tài liệu thì máy chủ bỏ.
  timDoanPT: (n, data) => {
    canVanPhong(n);
    const t = chuTaiLieu(data.id);
    const chuDe = String(data.chuDe || '').trim();
    if (!chuDe) throw new Error('Ghi chủ đề bài trước để AI tìm đoạn liên quan');
    const cd = caiDatMay();
    const model = GIA_AI[cd.bdModel] ? cd.bdModel : MODEL_MAC_DINH;
    const chu = t.chu.slice(0, 400000);
    const j = goiClaude('Tìm đoạn phong thủy', {
      model, max_tokens: 6000,
      system: 'Bạn là trợ lý tra cứu tài liệu. Chỉ CHÉP NGUYÊN VĂN các đoạn có trong tài liệu, không sửa chữ, không tóm tắt, không thêm kiến thức ngoài. Không có đoạn nào liên quan thì trả danh sách rỗng.',
      output_config: { effort: 'low', format: { type: 'json_schema', schema: { type: 'object', additionalProperties: false, required: ['doan'], properties: {
        doan: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['trich', 'viTri', 'viSao'], properties: { trich: { type: 'string' }, viTri: { type: 'string' }, viSao: { type: 'string' } } } } } } } },
      messages: [{ role: 'user', content: 'TÀI LIỆU: ' + t.ten + '\n"""\n' + chu + '\n"""\n\nTìm tối đa 4 đoạn (mỗi đoạn 1–3 đoạn văn liền nhau) liên quan nhất tới chủ đề: ' + chuDe + '\nviTri: tên chương/mục chứa đoạn đó nếu tài liệu có ghi, không có thì để rỗng. viSao: 1 câu vì sao liên quan.' }],
    });
    let ra;
    try { ra = JSON.parse(chuCua(j)); } catch (e) { throw new Error('AI trả lời sai dạng, thử lại'); }
    const goc = gonChu(chu);
    const doan = (ra.doan || []).filter((d) => d && gonChu(d.trich).length >= 20);
    return { ten: t.ten, doan: doan.map((d) => Object.assign(d, { dung: goc.indexOf(gonChu(d.trich)) >= 0 })).filter((d) => d.dung), boQua: doan.filter((d) => !d.dung).length };
  },
});

// ---------- Ảnh bìa: Gemini dựng, Canva sửa ----------
// Lưu 1 ảnh của bài vào Drive (thư mục "KAS App – Bài đăng/<mã bài>") và bảng Anh. Trả mã ảnh.
function luuAnhBai(n, maBai, blob, viec) {
  const id = Utilities.getUuid();
  const duoi = /png/.test(blob.getContentType()) ? 'png' : 'jpg';
  const ten = maBai + '_' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyyMMdd_HHmm') + '_' + viec + '.' + duoi;
  const f = timHoacTao(timHoacTao(DriveApp.getRootFolder(), 'KAS App – Bài đăng'), maBai.replace(/[^\w-]/g, '')).createFile(blob.setName(ten));
  themDong('Anh', { id, ma: maBai, viec, luc: new Date().toISOString(), tenFile: ten, fileId: f.getId(), nguoi: n.email, loai: 'BAI_DANG' });
  return id;
}

// Ảnh gốc để dựng bìa: ảnh được chọn, không thì ảnh bìa hiện tại, không thì ảnh đầu của bài. Không lấy chứng từ.
function anhGoc(b, id) {
  const ma = id || b.anhBia || b.dsAnh[0];
  const a = docBang('Anh').find((x) => x.id === ma && x.loai !== 'CHUNG_TU');
  if (!a) throw new Error('Bài chưa có ảnh. Thêm ảnh công trình trước.');
  return DriveApp.getFileById(a.fileId).getBlob();
}

// Đổi ảnh bìa: bài đã duyệt thì về chờ duyệt (ảnh là nội dung).
function datAnhBia(b, id) {
  const sua = { anhBia: id, capNhatLuc: new Date().toISOString() };
  if (b.trangThai === 'DUYET') Object.assign(sua, { trangThai: 'CHO_DUYET', nguoiDuyet: '', duyetLuc: '' });
  if (b.trangThai === 'NHAP' && Object.keys(b.baiViet).length) sua.trangThai = 'CHO_DUYET';
  capNhatDong('BaiDang', (r) => r.id === b.id, sua, true);
}

// Giá Gemini (USD / ảnh 1K), tra trang giá chính thức ngày 13/11/2026. Gói Gemini Pro của Thầy không gồm tiền API: cần bật thanh toán trong Google AI Studio.
const GIA_GEMINI = { 'gemini-3.1-flash-image': 0.067, 'gemini-3-pro-image': 0.134 };
const LOI_GEMINI = {
  SANG: 'Edit this REAL photo of a finished home project by KAS Houzing into a portrait social-media cover. '
    + 'Keep the space exactly as built: do not add, remove, move or restyle any wall, furniture, material, color, light fixture or decor. Do not invent objects. '
    + 'Only improve exposure, white balance, contrast and sharpness, straighten vertical lines, and crop to portrait. '
    + 'Keep a calm, uncluttered area in the lower third for a headline that will be added later. No text, no logo, no watermark.',
  CHU: 'Turn this REAL photo of a finished home project by KAS Houzing into a clean, premium portrait social-media cover. '
    + 'Keep the space exactly as built: do not add, remove, move or restyle any wall, furniture, material, color, light fixture or decor. Do not invent objects. '
    + 'You may improve exposure, white balance and sharpness, and add a soft dark gradient at the bottom for legibility. '
    + 'Add this Vietnamese headline EXACTLY as written, with correct diacritics, in a modern bold sans-serif, white, lower third: "{T}". '
    + '{P}Add a small "KAS HOUZING" wordmark near the bottom. No other text.',
};

function goiGemini(model, anh, loi) {
  const key = bi('GEMINI_API_KEY');
  if (!key) throw new Error('Chưa có khoá Gemini API. Thầy dán khoá vào Thuộc tính tập lệnh GEMINI_API_KEY (xem hướng dẫn cài).');
  const thu = (tl) => UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true, headers: { 'x-goog-api-key': key },
    payload: JSON.stringify({ model, input: [{ type: 'text', text: loi }, { type: 'image', mime_type: anh.getContentType() || 'image/jpeg', data: Utilities.base64Encode(anh.getBytes()) }],
      response_format: Object.assign({ type: 'image', mime_type: 'image/jpeg', image_size: '1K' }, tl ? { aspect_ratio: tl } : {}) }),
  });
  // Tài liệu chưa ghi rõ model này nhận tỉ lệ 4:5 không: thử 4:5, rồi 3:4, rồi để model tự chọn.
  let r; let j = {};
  for (const tl of ['4:5', '3:4', '']) {
    r = thu(tl);
    try { j = JSON.parse(r.getContentText()); } catch (e) { j = {}; }
    if (!(r.getResponseCode() === 400 && /aspect/i.test(r.getContentText()))) break;
  }
  if (r.getResponseCode() !== 200) throw new Error('Gemini lỗi ' + r.getResponseCode() + ': ' + ((j.error && j.error.message) || r.getContentText().slice(0, 200)));
  themDong('ChiAI', { luc: new Date().toISOString(), viec: 'Gemini ảnh bìa', model, vao: 0, ra: 0, timWeb: 0, usd: GIA_GEMINI[model] || 0 });
  const khoi = [];
  (j.steps || []).forEach((s) => (s.content || []).forEach((c) => khoi.push(c)));
  if (j.output_image) khoi.push(Object.assign({ type: 'image' }, j.output_image));
  const img = khoi.filter((c) => c && c.type === 'image' && c.data).pop();
  if (!img) {
    const chu = khoi.filter((c) => c && c.type === 'text').map((c) => c.text).join(' ').slice(0, 200);
    throw new Error('Gemini không trả ảnh' + (chu ? ': ' + chu : '. Thử lại hoặc đổi ảnh gốc.'));
  }
  return Utilities.newBlob(Utilities.base64Decode(img.data), img.mime_type || 'image/jpeg');
}

// ---------- Canva Connect (gói Canva Teams: dùng tích hợp "Public" của chính Thầy, chưa cần gửi Canva duyệt — em chưa thử thật) ----------
const CANVA = 'https://api.canva.com/rest/v1';
const CANVA_SCOPE = 'asset:read asset:write design:content:read design:content:write design:meta:read';
const urlMayChu = () => bi('CANVA_REDIRECT') || ScriptApp.getService().getUrl();
const b64url = (bytes) => Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');

function canvaBatDau() {
  const id = bi('CANVA_CLIENT_ID');
  if (!id || !bi('CANVA_CLIENT_SECRET')) throw new Error('Chưa có CANVA_CLIENT_ID, CANVA_CLIENT_SECRET trong Thuộc tính tập lệnh (xem hướng dẫn cài)');
  const verifier = b64url(Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid()).slice(0, 96);
  const state = Utilities.getUuid().replace(/-/g, '');
  const challenge = b64url(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, verifier, Utilities.Charset.US_ASCII));
  PropertiesService.getScriptProperties().setProperty('CANVA_PKCE', JSON.stringify({ state, verifier, han: Date.now() + 15 * 60000 }));
  const q = { code_challenge: challenge, code_challenge_method: 'S256', scope: CANVA_SCOPE, response_type: 'code', client_id: id, state, redirect_uri: urlMayChu() };
  return { url: 'https://www.canva.com/api/oauth/authorize?' + Object.keys(q).map((k) => k + '=' + encodeURIComponent(q[k])).join('&'), redirect: urlMayChu() };
}

function canvaLayToken(form) {
  const r = UrlFetchApp.fetch(CANVA + '/oauth/token', {
    method: 'post', muteHttpExceptions: true, payload: form,
    headers: { Authorization: 'Basic ' + Utilities.base64Encode(bi('CANVA_CLIENT_ID') + ':' + bi('CANVA_CLIENT_SECRET')) },
  });
  let j = {};
  try { j = JSON.parse(r.getContentText()); } catch (e) { /* không phải JSON */ }
  if (r.getResponseCode() !== 200 || !j.access_token) throw new Error('Canva từ chối: ' + (j.error_description || j.message || j.error || r.getResponseCode()) + '. Thầy bấm Nối Canva lại.');
  const p = PropertiesService.getScriptProperties();
  // Mỗi refresh token chỉ dùng được 1 lần: lưu ngay cái mới.
  if (j.refresh_token) p.setProperty('CANVA_REFRESH', j.refresh_token);
  CacheService.getScriptCache().put('CANVA_AT', j.access_token, Math.max(60, Math.min(21600, (Number(j.expires_in) || 14400) - 300)));
  return j.access_token;
}

// Canva chuyển về máy chủ sau khi Thầy bấm Cho phép (doGet có ?code=&state=).
function canvaNhanMa(e) {
  const p = PropertiesService.getScriptProperties();
  let pk = {};
  try { pk = JSON.parse(p.getProperty('CANVA_PKCE') || '{}'); } catch (x) { /* hỏng */ }
  if (!pk.state || pk.state !== e.parameter.state || Date.now() > pk.han) return 'Link nối Canva đã hết hạn hoặc không đúng. Thầy bấm Nối Canva lại trong app.';
  p.deleteProperty('CANVA_PKCE');
  canvaLayToken({ grant_type: 'authorization_code', code: e.parameter.code, code_verifier: pk.verifier, redirect_uri: urlMayChu() });
  return 'Đã nối Canva. Thầy quay lại app KAS.';
}

function canvaToken() {
  const c = CacheService.getScriptCache().get('CANVA_AT');
  if (c) return c;
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const c2 = CacheService.getScriptCache().get('CANVA_AT');
    if (c2) return c2;
    const rt = bi('CANVA_REFRESH');
    if (!rt) throw new Error('Chưa nối Canva. Thầy vào Cài đặt đăng bài, bấm Nối Canva.');
    return canvaLayToken({ grant_type: 'refresh_token', refresh_token: rt });
  } finally { lock.releaseLock(); }
}

function goiCanva(phuongThuc, duong, opt) {
  const r = UrlFetchApp.fetch(CANVA + duong, Object.assign({ method: phuongThuc, muteHttpExceptions: true }, opt || {}, {
    headers: Object.assign({ Authorization: 'Bearer ' + canvaToken() }, (opt && opt.headers) || {}),
  }));
  let j = {};
  try { j = JSON.parse(r.getContentText()); } catch (e) { /* không phải JSON */ }
  if (r.getResponseCode() >= 300) throw new Error('Canva lỗi ' + r.getResponseCode() + ': ' + (j.message || j.code || r.getContentText().slice(0, 200)));
  return j;
}

// Chờ việc của Canva (tải ảnh lên, xuất ảnh) xong. Tối đa khoảng 40 giây.
function choCanva(duong) {
  for (let i = 0; i < 20; i++) {
    const j = goiCanva('get', duong).job || {};
    if (j.status === 'success') return j;
    if (j.status === 'failed') throw new Error('Canva báo lỗi: ' + ((j.error && (j.error.message || j.error.code)) || 'không rõ'));
    Utilities.sleep(2000);
  }
  throw new Error('Canva xử lý lâu quá, Thầy bấm lại sau ít phút');
}

Object.assign(HANH_DONG, {
  // Gemini dựng ảnh bìa từ ảnh thật. kieu SANG: chỉ chỉnh sáng, chừa chỗ chữ; CHU: in luôn tiêu đề lên ảnh.
  geminiBia: (n, data) => {
    canVanPhong(n);
    const b = timBai(data.id);
    if (b.trangThai === 'DA_DANG') throw new Error('Bài đã đăng');
    const cd = caiDatMay();
    const model = GIA_GEMINI[cd.bdGemini] ? cd.bdGemini : 'gemini-3.1-flash-image';
    const kieu = data.kieu === 'CHU' ? 'CHU' : 'SANG';
    const tieuDe = String(data.tieuDe || b.tieuDeBia || '').trim();
    if (kieu === 'CHU' && !tieuDe) throw new Error('Ghi chữ trên bìa trước');
    const phu = String(data.phuDe || b.phuDeBia || '').trim();
    const loi = LOI_GEMINI[kieu].replace('{T}', tieuDe.replace(/"/g, "'")).replace('{P}', phu ? 'Below it, a smaller line EXACTLY: "' + phu.replace(/"/g, "'") + '". ' : '');
    const anh = goiGemini(model, anhGoc(b, data.anhId), loi);
    const id = luuAnhBai(n, b.id, anh, 'GEMINI');
    datAnhBia(b, id);
    return { bai: traBai(timBai(b.id)), anhId: id, loai: anh.getContentType(), base64: Utilities.base64Encode(anh.getBytes()) };
  },

  // Thầy bấm Nối Canva: trả link đăng nhập Canva (chỉ Thầy).
  canvaNoi: (n) => {
    if (n.vaiTro !== 'THAY') throw new Error('Chỉ Thầy nối Canva');
    return canvaBatDau();
  },
  canvaTrangThai: (n) => { canVanPhong(n); return { daNoi: !!bi('CANVA_REFRESH'), coKhoa: !!bi('CANVA_CLIENT_ID'), coGemini: !!bi('GEMINI_API_KEY'), redirect: urlMayChu() }; },

  // Đưa ảnh bìa (hoặc ảnh chọn) sang Canva thành thiết kế 1080×1350, trả link mở Canva để Thầy sửa.
  canvaMo: (n, data) => {
    canVanPhong(n);
    const b = timBai(data.id);
    const anh = anhGoc(b, data.anhId);
    const up = goiCanva('post', '/asset-uploads', {
      contentType: 'application/octet-stream', payload: anh.getBytes(),
      headers: { 'Asset-Upload-Metadata': JSON.stringify({ name_base64: Utilities.base64Encode(('KAS ' + b.id).slice(0, 50), Utilities.Charset.UTF_8) }) },
    });
    const job = choCanva('/asset-uploads/' + up.job.id);
    const d = goiCanva('post', '/designs', { contentType: 'application/json', payload: JSON.stringify({
      type: 'type_and_asset', design_type: { type: 'custom', width: 1080, height: 1350 }, asset_id: job.asset.id, title: ('KAS – ' + (b.tieuDeBia || b.chuDe || b.id)).slice(0, 255) }) }).design;
    const canva = { id: d.id, sua: d.urls && d.urls.edit_url, luc: new Date().toISOString() };
    capNhatDong('BaiDang', (r) => r.id === b.id, { canva, capNhatLuc: new Date().toISOString() }, true);
    return { bai: traBai(timBai(b.id)), url: canva.sua };
  },

  // Thầy sửa xong trên Canva: xuất trang đầu ra JPG, làm ảnh bìa của bài.
  canvaLay: (n, data) => {
    canVanPhong(n);
    const b = timBai(data.id);
    if (!b.canva || !b.canva.id) throw new Error('Bài chưa mở bên Canva');
    if (b.trangThai === 'DA_DANG') throw new Error('Bài đã đăng');
    const ex = goiCanva('post', '/exports', { contentType: 'application/json', payload: JSON.stringify({ design_id: b.canva.id, format: { type: 'jpg', quality: 92 } }) });
    const job = choCanva('/exports/' + ex.job.id);
    const r = UrlFetchApp.fetch(job.urls[0], { muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) throw new Error('Không tải được ảnh từ Canva (' + r.getResponseCode() + ')');
    const anh = r.getBlob().setContentType('image/jpeg');
    const id = luuAnhBai(n, b.id, anh, 'CANVA');
    datAnhBia(b, id);
    return { bai: traBai(timBai(b.id)), anhId: id, loai: 'image/jpeg', base64: Utilities.base64Encode(anh.getBytes()) };
  },
});

function luuKetQua(b) {
  const xong = b.kenh.length && b.kenh.every((k) => b.ketQua[k] && (b.ketQua[k].id || b.ketQua[k].tay));
  capNhatDong('BaiDang', (r) => r.id === b.id, { ketQua: b.ketQua, trangThai: xong ? 'DA_DANG' : b.trangThai, capNhatLuc: new Date().toISOString() }, true);
}

// Ảnh của bài theo thứ tự: ảnh bìa trước, rồi các ảnh đã chọn. Trả blob JPEG.
function anhCuaBai(b) {
  const anh = docBang('Anh');
  const ids = [b.anhBia].concat(b.dsAnh).filter((x, i, a) => x && a.indexOf(x) === i);
  return ids.map((id) => anh.find((a) => a.id === id)).filter(Boolean).slice(0, 10).map((a) => DriveApp.getFileById(a.fileId).getBlob().setName(a.tenFile || a.id + '.jpg'));
}

function goiGraph(duongDan, tham, get) {
  const token = bi('FB_PAGE_TOKEN');
  if (!token) throw new Error('Chưa có mã truy cập Fanpage (FB_PAGE_TOKEN)');
  const url = GRAPH + duongDan;
  const r = get
    ? UrlFetchApp.fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 'access_token=' + encodeURIComponent(token), { muteHttpExceptions: true })
    : UrlFetchApp.fetch(url, { method: 'post', muteHttpExceptions: true, payload: Object.assign({ access_token: token }, tham) });
  let j = {};
  try { j = JSON.parse(r.getContentText()); } catch (e) { /* không phải JSON */ }
  if (r.getResponseCode() !== 200 || j.error) throw new Error('Meta: ' + ((j.error && j.error.message) || r.getResponseCode()));
  return j;
}

// Facebook: tải ảnh lên Trang ở dạng chưa đăng, rồi đăng 1 bài kèm tất cả ảnh (attached_media). Chưa thử với Trang thật.
function dangFacebook(b, blobs) {
  const page = bi('FB_PAGE_ID');
  if (!page) throw new Error('Chưa có FB_PAGE_ID');
  const anh = blobs.map((bl) => goiGraph('/' + page + '/photos', { source: bl, published: 'false' }).id);
  const tham = { message: b.baiViet.fb };
  anh.forEach((id, i) => { tham['attached_media[' + i + ']'] = JSON.stringify({ media_fbid: id }); });
  const p = goiGraph('/' + page + '/feed', tham);
  return { id: p.id, anh, link: 'https://www.facebook.com/' + p.id, luc: new Date().toISOString() };
}

// Instagram có 2 cách nối, máy chủ tự chọn:
//  1. IG_TOKEN: đăng thẳng bằng tài khoản Instagram, KHÔNG cần nối Fanpage (dùng khi Fanpage vướng Business cũ).
//     Mã "Instagram login" sống 60 ngày, máy chủ tự gia hạn mỗi 7 ngày (lamMoiMaIG). Mã "Unified login" hết hạn theo cấu hình.
//  2. IG_USER_ID + FB_PAGE_TOKEN có quyền Instagram: Instagram đã nối với Fanpage.
// Gọi Instagram theo cách đang dùng. Trả { goi, ig }.
function igKetNoi() {
  const ma = bi('IG_TOKEN');
  if (!ma) {
    const ig = bi('IG_USER_ID');
    if (!ig) throw new Error('Chưa nối Instagram (thiếu IG_TOKEN hoặc IG_USER_ID)');
    return { ig, goi: goiGraph };
  }
  const goi = (duongDan, tham, get) => {
    const url = (laMaIGLogin(ma) ? GRAPH_IG : GRAPH_IG_FB) + duongDan;
    const r = get
      ? UrlFetchApp.fetch(url + (url.indexOf('?') >= 0 ? '&' : '?') + 'access_token=' + encodeURIComponent(ma), { muteHttpExceptions: true })
      : UrlFetchApp.fetch(url, { method: 'post', muteHttpExceptions: true, payload: Object.assign({ access_token: ma }, tham) });
    let j = {};
    try { j = JSON.parse(r.getContentText()); } catch (e) { /* không phải JSON */ }
    if (r.getResponseCode() !== 200 || j.error) throw new Error('Instagram: ' + ((j.error && j.error.message) || r.getResponseCode()));
    return j;
  };
  let ig = bi('IG_USER_ID');
  if (!ig) {
    ig = laMaIGLogin(ma)
      ? String(goi('/me?fields=user_id', null, true).user_id || '')
      : String(((goi('/me/assigned_instagram_accounts?fields=id,username', null, true).data || [])[0] || {}).id || '');
    if (!ig) throw new Error('Không lấy được ID tài khoản Instagram từ IG_TOKEN');
    PropertiesService.getScriptProperties().setProperty('IG_USER_ID', ig);
  }
  return { ig, goi };
}

// Instagram cần ảnh JPEG ở địa chỉ công khai: lấy chính ảnh đã tải lên Facebook. Chưa thử với tài khoản thật.
function dangInstagram(b, blobs, anhFB) {
  const { ig, goi } = igKetNoi();
  const page = bi('FB_PAGE_ID');
  const ids = anhFB && anhFB.length ? anhFB : blobs.map((bl) => goiGraph('/' + page + '/photos', { source: bl, published: 'false' }).id);
  if (!ids.length) throw new Error('Instagram cần ít nhất 1 ảnh');
  const urls = ids.map((id) => { const im = goiGraph('/' + id + '?fields=images', null, true).images || []; return im.length ? im[0].source : ''; }).filter(Boolean);
  if (!urls.length) throw new Error('Không lấy được địa chỉ ảnh từ Facebook');
  const caption = b.baiViet.ig || b.baiViet.fb;
  let container;
  if (urls.length === 1) container = goi('/' + ig + '/media', { image_url: urls[0], caption }).id;
  else {
    const con = urls.slice(0, 10).map((u) => goi('/' + ig + '/media', { image_url: u, is_carousel_item: 'true' }).id);
    container = goi('/' + ig + '/media', { media_type: 'CAROUSEL', children: con.join(','), caption }).id;
  }
  for (let i = 0; i < 10; i++) {
    const st = goi('/' + container + '?fields=status_code', null, true).status_code;
    if (st === 'FINISHED') break;
    if (st === 'ERROR' || st === 'EXPIRED') throw new Error('Instagram không nhận ảnh (' + st + ')');
    Utilities.sleep(3000);
  }
  const m = goi('/' + ig + '/media_publish', { creation_id: container });
  let link = '';
  try { link = goi('/' + m.id + '?fields=permalink', null, true).permalink || ''; } catch (e) { /* không bắt buộc */ }
  return { id: m.id, link, luc: new Date().toISOString() };
}

// Gia hạn IG_TOKEN thêm 60 ngày. Meta chỉ cho gia hạn mã đã quá 24 giờ và còn hạn. Hẹn giờ đăng bài gọi mỗi 7 ngày.
// Không ghi giá trị mã ra nhật ký.
function lamMoiMaIG(epBuoc) {
  const ma = bi('IG_TOKEN');
  if (!ma || !laMaIGLogin(ma)) return ''; // mã Unified login không gia hạn kiểu này
  const props = PropertiesService.getScriptProperties();
  const truoc = Number(bi('IG_TOKEN_GIA_HAN') || 0);
  if (!epBuoc && truoc && Date.now() - truoc < 7 * 864e5) return '';
  if (!truoc && !epBuoc) { props.setProperty('IG_TOKEN_GIA_HAN', String(Date.now())); return ''; } // mã mới dán: chờ qua 24 giờ
  const r = UrlFetchApp.fetch('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' + encodeURIComponent(ma), { muteHttpExceptions: true });
  let j = {};
  try { j = JSON.parse(r.getContentText()); } catch (e) { /* không phải JSON */ }
  if (r.getResponseCode() !== 200 || !j.access_token) {
    const loi = 'Gia hạn mã Instagram lỗi: ' + ((j.error && j.error.message) || r.getResponseCode());
    Logger.log(loi);
    return loi;
  }
  props.setProperty('IG_TOKEN', j.access_token);
  props.setProperty('IG_TOKEN_GIA_HAN', String(Date.now()));
  const het = new Date(Date.now() + Number(j.expires_in || 0) * 1000);
  Logger.log('Đã gia hạn mã Instagram, hết hạn khoảng ' + Utilities.formatDate(het, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd'));
  return 'OK';
}

// Chạy 1 lần trong trình soạn thảo sau khi dán IG_TOKEN: ghi tên tài khoản, loại tài khoản, tự điền IG_USER_ID. Không ghi mã.
function kiemTraIG() {
  const { ig, goi } = igKetNoi();
  const me = laMaIGLogin(bi('IG_TOKEN')) ? goi('/me?fields=user_id,username,account_type', null, true) : goi('/' + ig + '?fields=username', null, true);
  Logger.log('Instagram OK: @' + (me.username || '?') + ', loại ' + (me.account_type || (bi('IG_TOKEN') ? 'Unified login' : 'nối qua Fanpage')) + ', IG_USER_ID ' + ig);
  return me;
}

// Làm mới FB_PAGE_TOKEN khi Meta báo mã hết hiệu lực (đổi mật khẩu, Meta đặt lại phiên...).
// Thầy dán 2 thuộc tính: FB_APP_SECRET (Khoá bí mật của app Meta, dán 1 lần) và FB_USER_TOKEN_TAM (mã người dùng
// lấy ở Graph API Explorer), rồi chạy hàm này. Máy chủ đổi sang mã dài hạn, lấy mã Trang (không hết hạn),
// lưu vào FB_PAGE_TOKEN và xoá FB_USER_TOKEN_TAM. Không ghi mã ra nhật ký.
function doiMaFacebook() {
  const props = PropertiesService.getScriptProperties();
  const tam = bi('FB_USER_TOKEN_TAM'), bm = bi('FB_APP_SECRET'), app = bi('FB_APP_ID') || '4120096391458758', page = bi('FB_PAGE_ID');
  if (!tam || !bm || !page) throw new Error('Thiếu FB_USER_TOKEN_TAM, FB_APP_SECRET hoặc FB_PAGE_ID');
  const lay = (url) => {
    const r = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    let j = {};
    try { j = JSON.parse(r.getContentText()); } catch (e) { /* không phải JSON */ }
    if (r.getResponseCode() !== 200 || j.error) throw new Error('Meta: ' + ((j.error && j.error.message) || r.getResponseCode()));
    return j;
  };
  const dai = lay(GRAPH + '/oauth/access_token?grant_type=fb_exchange_token&client_id=' + encodeURIComponent(app) +
    '&client_secret=' + encodeURIComponent(bm) + '&fb_exchange_token=' + encodeURIComponent(tam)).access_token;
  if (!dai) throw new Error('Meta không trả mã dài hạn');
  const trang = lay(GRAPH + '/' + page + '?fields=access_token,name&access_token=' + encodeURIComponent(dai));
  if (!trang.access_token) throw new Error('Tài khoản này không quản lý Trang ' + page + ' hoặc thiếu quyền pages_manage_posts');
  props.setProperty('FB_PAGE_TOKEN', trang.access_token);
  props.deleteProperty('FB_USER_TOKEN_TAM');
  Logger.log('Đã thay FB_PAGE_TOKEN cho Trang "' + (trang.name || page) + '"');
  return trang.name || page;
}

// Bài website: dòng "## " thành tiêu đề mục, dòng "- " thành gạch đầu dòng, còn lại là đoạn văn.
function htmlWeb(noiDung, anhUrl) {
  const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ra = []; let ds = [];
  const dongDs = () => { if (ds.length) { ra.push('<ul>' + ds.map((x) => '<li>' + e(x) + '</li>').join('') + '</ul>'); ds = []; } };
  let doan = 0;
  String(noiDung || '').split(/\n+/).map((x) => x.trim()).filter(Boolean).forEach((x) => {
    if (/^- /.test(x)) { ds.push(x.slice(2)); return; }
    dongDs();
    if (/^##+ /.test(x)) ra.push('<h2>' + e(x.replace(/^#+\s*/, '')) + '</h2>');
    else { ra.push('<p>' + e(x) + '</p>'); doan++; if (doan === 1 && anhUrl[1]) ra.push('<figure><img src="' + anhUrl[1] + '" alt=""></figure>'); }
  });
  dongDs();
  anhUrl.slice(2).forEach((u) => ra.push('<figure><img src="' + u + '" alt=""></figure>'));
  return ra.join('\n');
}

// WordPress: mật khẩu ứng dụng (Users → Profile → Application Passwords). Mặc định đăng nháp để Thầy xem trên web trước.
function dangWeb(b, blobs, cd) {
  const goc = bi('WP_URL').replace(/\/+$/, '');
  if (!goc || !bi('WP_USER') || !bi('WP_APP_PASSWORD')) throw new Error('Chưa có WP_URL, WP_USER, WP_APP_PASSWORD');
  const auth = { Authorization: 'Basic ' + Utilities.base64Encode(bi('WP_USER') + ':' + bi('WP_APP_PASSWORD').replace(/\s+/g, '')) };
  const goiWP = (duong, opt) => {
    const r = UrlFetchApp.fetch(goc + '/wp-json/wp/v2' + duong, Object.assign({ method: 'post', muteHttpExceptions: true, headers: auth }, opt));
    let j = {};
    try { j = JSON.parse(r.getContentText()); } catch (e) { /* không phải JSON */ }
    if (r.getResponseCode() >= 300) throw new Error('Website: ' + (j.message || r.getResponseCode()));
    return j;
  };
  const media = blobs.slice(0, 6).map((bl, i) => goiWP('/media', {
    contentType: 'image/jpeg', payload: bl.getBytes(),
    headers: Object.assign({ 'Content-Disposition': 'attachment; filename="' + b.id + '-' + (i + 1) + '.jpg"' }, auth) }));
  const w = b.baiViet.web;
  const trangThai = cd.bdWebTrangThai === 'publish' ? 'publish' : 'draft';
  const bai = { title: w.tieuDe, excerpt: w.moTa, content: htmlWeb(w.noiDung, media.map((m) => m.source_url)), status: trangThai };
  if (media.length) bai.featured_media = media[0].id;
  if (Number(cd.bdWebChuyenMuc)) bai.categories = [Number(cd.bdWebChuyenMuc)];
  const p = goiWP('/posts', { contentType: 'application/json', payload: JSON.stringify(bai) });
  return { id: p.id, link: p.link || '', trangThai, luc: new Date().toISOString() };
}

// Đăng các kênh tự động chưa đăng của 1 bài đã duyệt. Kênh nào lỗi ghi lỗi, kênh khác vẫn đăng; bấm lại chỉ đăng kênh còn thiếu.
function dangMotBai(b) {
  if (b.trangThai !== 'DUYET' || !b.nguoiDuyet) throw new Error('Bài chưa được Thầy duyệt');
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    b = timBai(b.id);
    if (b.trangThai !== 'DUYET') return b;
    const cd = caiDatMay();
    const can = (k) => b.kenh.indexOf(k) >= 0 && !(b.ketQua[k] && b.ketQua[k].id);
    if (!['FB', 'IG', 'WEB'].some(can)) return b;
    const blobs = anhCuaBai(b);
    const chay = (k, fn) => {
      if (!can(k)) return;
      try { b.ketQua[k] = fn(); } catch (e) { b.ketQua[k] = { loi: String(e.message || e), luc: new Date().toISOString(), lan: ((b.ketQua[k] || {}).lan || 0) + 1 }; }
    };
    chay('FB', () => dangFacebook(b, blobs));
    chay('IG', () => dangInstagram(b, blobs, b.ketQua.FB && b.ketQua.FB.anh));
    chay('WEB', () => dangWeb(b, blobs, cd));
    luuKetQua(b);
    return timBai(b.id);
  } finally {
    lock.releaseLock();
  }
}

// Chạy theo hẹn giờ (15 phút một lần): bài đã duyệt, đến giờ thì đăng. Kênh lỗi thử lại tối đa 3 lần.
function dangBaiHenGio() {
  const bay = Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd HH:mm');
  const gioMD = caiDatMay().bdGio || '19:30';
  try { lamMoiMaIG(); } catch (e) { Logger.log('Gia hạn mã Instagram lỗi: ' + e.message); }
  docBang('BaiDang').filter((b) => !b.xoa && b.trangThai === 'DUYET' && b.ngayDang && (b.ngayDang + ' ' + (b.gioDang || gioMD)) <= bay).forEach((b) => {
    const kq = b.ketQua || {};
    if (['FB', 'IG', 'WEB'].some((k) => (kq[k] || {}).lan >= 3)) return;
    try { dangMotBai(timBai(b.id)); } catch (e) { Logger.log('Đăng ' + b.id + ' lỗi: ' + e.message); }
  });
}

// Chạy 1 lần trong trình soạn thảo để bật hẹn giờ đăng bài.
function caiHenGio() {
  ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'dangBaiHenGio').forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dangBaiHenGio').timeBased().everyMinutes(15).create();
  Logger.log('Đã bật hẹn giờ đăng bài: 15 phút kiểm tra 1 lần.');
}

// ---------- Drive ----------
function layIdThuMuc(s) {
  const m = String(s || '').match(/[-\w]{25,}/);
  return m ? m[0] : '';
}

function thuMucAnh(ma) {
  if (laKhach(ma)) {
    // Ảnh khảo sát của khách chưa ký: "KAS App – Khách/<mã>/Ảnh khảo sát"
    const kh = docBang('Khach').find((r) => r.ma === ma);
    if (!kh) throw new Error('Không có khách ' + ma);
    let g;
    if (kh.thuMucDrive) g = DriveApp.getFolderById(kh.thuMucDrive);
    else {
      g = timHoacTao(timHoacTao(DriveApp.getRootFolder(), 'KAS App – Khách'), ma);
      capNhatDong('Khach', (r) => r.ma === ma, { thuMucDrive: g.getId() }, true);
    }
    return timHoacTao(g, 'Ảnh khảo sát');
  }
  const ct = docBang('CongTrinh').find((r) => r.ma === ma);
  if (!ct) throw new Error('Không có công trình ' + ma);
  let goc;
  if (ct.thuMucDrive) {
    goc = DriveApp.getFolderById(ct.thuMucDrive);
  } else {
    // Công trình chưa gắn thư mục: tạo "KAS App – Ảnh/<mã>" trong Drive của Thầy.
    const chung = timHoacTao(DriveApp.getRootFolder(), 'KAS App – Ảnh');
    goc = timHoacTao(chung, ma);
    capNhatDong('CongTrinh', (r) => r.ma === ma, { thuMucDrive: goc.getId() }, true);
  }
  return timHoacTao(goc, 'Ảnh tiến độ');
}

function timHoacTao(cha, ten) {
  const it = cha.getFoldersByName(ten);
  return it.hasNext() ? it.next() : cha.createFolder(ten);
}

// ---------- Sheets ----------
const _bang = {};
function bang(ten) {
  if (_bang[ten]) return _bang[ten];
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'));
  let sh = ss.getSheetByName(ten);
  // Bản cập nhật thêm tab hoặc cột mới: tự tạo, Thầy không phải chạy lại setup.
  if (!sh) { sh = ss.insertSheet(ten); sh.setFrozenRows(1); }
  const h = sh.getLastRow() ? sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0] : [];
  if (TAB[ten] && TAB[ten].some((k, i) => h[i] !== k)) sh.getRange(1, 1, 1, TAB[ten].length).setValues([TAB[ten]]).setFontWeight('bold');
  _bang[ten] = sh;
  return sh;
}

function giaTriRa(k, x) {
  if (x instanceof Date) return Utilities.formatDate(x, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  if (JSON_COT.includes(k)) {
    if (x === '' || x === null || x === undefined) return k === 'diSau' ? [] : null;
    try { return JSON.parse(x); } catch (e) { return null; }
  }
  return x;
}

function giaTriVao(k, x) {
  if (x === undefined || x === null) return '';
  if (JSON_COT.includes(k) || (typeof x === 'object')) return JSON.stringify(x);
  // Chuỗi trông như ngày, số (mã, khoá) hoặc công thức giữ nguyên dạng chữ, không để Sheets tự đổi.
  if (typeof x === 'string' && (/^\d{4}-\d{2}-\d{2}/.test(x) || /^[\d.,eE+-]+$/.test(x) || /^[=+\-@]/.test(x))) return "'" + x;
  return x;
}

function docBang(ten) {
  const v = bang(ten).getDataRange().getValues();
  const h = v.shift();
  return v.filter((row) => row.some((c) => c !== '')).map((row) => {
    const o = {};
    h.forEach((k, i) => { o[k] = giaTriRa(k, row[i]); });
    return o;
  });
}

function themDong(ten, obj) {
  bang(ten).appendRow(TAB[ten].map((k) => giaTriVao(k, obj[k])));
}

function themNhieuDong(ten, ds) {
  if (!ds.length) return;
  const sh = bang(ten);
  sh.getRange(sh.getLastRow() + 1, 1, ds.length, TAB[ten].length).setValues(ds.map((o) => TAB[ten].map((k) => giaTriVao(k, o[k]))));
}

// Sửa các cột có trong `obj` của dòng đầu tiên khớp. Trả về true nếu tìm thấy.
function capNhatDong(ten, khop, obj, chiSua) {
  const sh = bang(ten);
  const v = sh.getDataRange().getValues();
  const h = v[0];
  for (let i = 1; i < v.length; i++) {
    const r = {};
    h.forEach((k, j) => { r[k] = giaTriRa(k, v[i][j]); });
    if (khop(r)) {
      // Cột không sửa cũng ghi lại; chữ dạng số (sđt 09…, mã link) phải giữ dấu ' để Sheets không đổi thành số.
      const moi = h.map((k, j) => (k in obj ? giaTriVao(k, obj[k]) : typeof v[i][j] === 'string' && !JSON_COT.includes(k) ? giaTriVao(k, v[i][j]) : v[i][j]));
      sh.getRange(i + 1, 1, 1, h.length).setValues([moi]);
      return true;
    }
  }
  if (!chiSua) themDong(ten, obj);
  return false;
}

function xoaDong(ten, khop) {
  const sh = bang(ten);
  const v = sh.getDataRange().getValues();
  const h = v[0];
  for (let i = v.length - 1; i >= 1; i--) {
    const r = {};
    h.forEach((k, j) => { r[k] = giaTriRa(k, v[i][j]); });
    if (khop(r)) sh.deleteRow(i + 1);
  }
}

function taoKhoa() {
  return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
