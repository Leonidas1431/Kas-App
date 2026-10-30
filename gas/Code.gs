/**
 * KAS App – máy chủ Apps Script (bản khung).
 * App gửi POST dạng text/plain (tránh CORS preflight) với { idToken, action, data }.
 * Mỗi người đăng nhập bằng Gmail; quyền lấy từ tab NguoiDung.
 * Link chủ nhà / thầu: GET ?xem=<mã link>, không cần đăng nhập, chỉ trả dữ liệu đã lọc.
 */

const TAB = {
  NguoiDung: ['email', 'ten', 'vaiTro', 'congTrinh'],
  CongTrinh: ['ma', 'ten', 'loai', 'khoiCong', 'lich', 'chuNha', 'maLinkChuNha', 'thuMucDrive', 'taoLuc'],
  KeHoach: ['ma', 'id', 'thuTu', 'nhom', 'hangMuc', 'dauViec', 'dvt', 'khoiLuong', 'soNgay', 'diSau', 'moc',
    'phanTram', 'trangThai', 'gocBatDau', 'gocKetThuc', 'ttBatDau', 'ttKetThuc', 'nhaThau'],
  LichSu: ['id', 'luc', 'ma', 'viec', 'nguoi', 'loai', 'cu', 'moi', 'nguyenNhan', 'ghiChu', 'congKhai'],
  NhaThau: ['id', 'ten', 'chuyenMon', 'sdt', 'khuVuc', 'ghiChu'],
  DanhGiaThau: ['id', 'nhaThau', 'ma', 'nguoi', 'luc', 'tienDo', 'chatLuong', 'veSinhAnToan', 'phoiHop', 'nhanXet'],
  Anh: ['id', 'ma', 'viec', 'ngay', 'tenFile', 'fileId', 'nguoi'],
};
const VAN_PHONG = ['THAY', 'DUC', 'TRUNG'];

// Chạy 1 lần từ trình soạn thảo Apps Script: tạo file Sheets dữ liệu và các tab.
function setup() {
  const props = PropertiesService.getScriptProperties();
  let ss = props.getProperty('SHEET_ID') && SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
  if (!ss) {
    ss = SpreadsheetApp.create('KAS App – Dữ liệu');
    props.setProperty('SHEET_ID', ss.getId());
  }
  Object.keys(TAB).forEach((ten) => {
    const sh = ss.getSheetByName(ten) || ss.insertSheet(ten);
    sh.getRange(1, 1, 1, TAB[ten].length).setValues([TAB[ten]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });
  const mac = ss.getSheetByName('Sheet1') || ss.getSheetByName('Trang tính1');
  if (mac && ss.getSheets().length > 1) ss.deleteSheet(mac);
  Logger.log('Sheets dữ liệu: ' + ss.getUrl());
}

function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const nguoi = xacThuc(req.idToken);
    const fn = HANH_DONG[req.action];
    if (!fn) throw new Error('Không có thao tác ' + req.action);
    return json({ ok: true, data: fn(nguoi, req.data || {}) });
  } catch (err) {
    return json({ ok: false, loi: String(err.message || err) });
  }
}

function doGet(e) {
  const ma = e && e.parameter && e.parameter.xem;
  if (!ma) return json({ ok: false, loi: 'Thiếu mã link' });
  const ct = docBang('CongTrinh').find((r) => r.maLinkChuNha === ma);
  if (!ct) return json({ ok: false, loi: 'Link không đúng' });
  const viec = docBang('KeHoach').filter((r) => r.ma === ct.ma).map((v) => ({
    id: v.id, nhom: v.nhom, hangMuc: v.hangMuc, soNgay: v.soNgay, moc: v.moc, phanTram: v.phanTram,
    gocBatDau: v.gocBatDau, gocKetThuc: v.gocKetThuc, ttBatDau: v.ttBatDau, ttKetThuc: v.ttKetThuc,
  }));
  const cham = docBang('LichSu').filter((r) => r.ma === ct.ma && r.loai === 'CHAM' && r.congKhai === true);
  // Không trả tên thầu, ghi chú nội bộ, số tiền.
  return json({ ok: true, data: { ten: ct.ten, khoiCong: ct.khoiCong, lich: ct.lich, viec, cham } });
}

// ---------- Xác thực ----------
function xacThuc(idToken) {
  if (!idToken) throw new Error('Chưa đăng nhập');
  const r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('Phiên đăng nhập hết hạn');
  const t = JSON.parse(r.getContentText());
  const clientId = PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID');
  if (t.aud !== clientId || t.email_verified !== 'true') throw new Error('Đăng nhập không hợp lệ');
  const u = docBang('NguoiDung').find((x) => String(x.email).toLowerCase() === t.email.toLowerCase());
  if (!u) throw new Error('Gmail ' + t.email + ' chưa được Thầy cấp quyền');
  return { email: t.email, ten: u.ten, vaiTro: u.vaiTro, congTrinh: String(u.congTrinh || '').split(/[,\s]+/).filter(String) };
}

// ---------- Thao tác ----------
const HANH_DONG = {
  toiLaAi: (nguoi) => nguoi,

  // Kéo dữ liệu về máy. Kha chỉ thấy công trình được giao.
  keoVe: (nguoi) => {
    const duocXem = (ma) => VAN_PHONG.includes(nguoi.vaiTro) || nguoi.congTrinh.includes(ma);
    return {
      congTrinh: docBang('CongTrinh').filter((r) => duocXem(r.ma)),
      keHoach: docBang('KeHoach').filter((r) => duocXem(r.ma)),
      lichSu: docBang('LichSu').filter((r) => duocXem(r.ma)),
      nhaThau: docBang('NhaThau'),
    };
  },

  // Nhận hàng chờ từ máy (ghi khi mất sóng). Mỗi mục có id nên gửi lại không bị trùng.
  dayLen: (nguoi, data) => {
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const daCo = new Set(docBang('LichSu').map((r) => r.id));
      (data.lichSu || []).forEach((e) => {
        if (daCo.has(e.id)) return;
        themDong('LichSu', { ...e, nguoi: nguoi.email, congKhai: false });
      });
      (data.keHoach || []).forEach((v) => capNhatDong('KeHoach', (r) => r.ma === v.ma && r.id === v.id, v));
      return { ok: true };
    } finally {
      lock.releaseLock();
    }
  },

  // Ảnh: app nén trước, gửi base64. Lưu vào thư mục Drive của công trình, đặt tên chuẩn.
  guiAnh: (nguoi, data) => {
    const ct = docBang('CongTrinh').find((r) => r.ma === data.ma);
    if (!ct || !ct.thuMucDrive) throw new Error('Công trình chưa gắn thư mục Drive');
    const blob = Utilities.newBlob(Utilities.base64Decode(data.base64), 'image/jpeg', data.tenFile);
    const f = DriveApp.getFolderById(ct.thuMucDrive).createFile(blob);
    themDong('Anh', { id: Utilities.getUuid(), ma: data.ma, viec: data.viec, ngay: data.ngay, tenFile: data.tenFile, fileId: f.getId(), nguoi: nguoi.email });
    return { fileId: f.getId() };
  },
};

// ---------- Tiện ích Sheets ----------
function bang(ten) {
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID')).getSheetByName(ten);
}

function docBang(ten) {
  const v = bang(ten).getDataRange().getValues();
  const h = v.shift();
  return v.map((row) => Object.fromEntries(h.map((k, i) => [k, row[i] instanceof Date ? Utilities.formatDate(row[i], 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd') : row[i]])));
}

function themDong(ten, obj) {
  bang(ten).appendRow(TAB[ten].map((k) => (typeof obj[k] === 'object' && obj[k] !== null ? JSON.stringify(obj[k]) : obj[k] ?? '')));
}

function capNhatDong(ten, khop, obj) {
  const sh = bang(ten);
  const v = sh.getDataRange().getValues();
  const h = v[0];
  for (let i = 1; i < v.length; i++) {
    const r = Object.fromEntries(h.map((k, j) => [k, v[i][j]]));
    if (khop(r)) {
      sh.getRange(i + 1, 1, 1, h.length).setValues([h.map((k) => (k in obj ? obj[k] : v[i][h.indexOf(k)]))]);
      return;
    }
  }
  themDong(ten, obj);
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
