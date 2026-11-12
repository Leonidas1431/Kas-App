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
  CongTrinh: ['ma', 'ten', 'loai', 'khoiCong', 'lich', 'chuNha', 'maLinkChuNha', 'thuMucDrive', 'taoLuc', 'maKhach'],
  Khach: ['ma', 'ten', 'sdt', 'diaChi', 'nguon', 'nguoiGioiThieu', 'sdtGioiThieu', 'hoaHong', 'nhuCau', 'trangThai', 'lyDo',
    'nhacGoi', 'soLanNhac', 'baoGia', 'maCongTrinh', 'banGiao', 'chamSoc', 'baoHanhDen', 'thuMucDrive', 'nguoiTao', 'taoLuc', 'capNhatLuc'],
  KeHoach: ['ma', 'id', 'thuTu', 'nhom', 'hangMuc', 'dauViec', 'dvt', 'khoiLuong', 'soNgay', 'diSau', 'moc',
    'phanTram', 'trangThai', 'goc', 'thucTe', 'nhaThau', 'capNhatLuc'],
  LichSu: ['id', 'luc', 'ma', 'viec', 'tenViec', 'nguoi', 'loai', 'cu', 'moi', 'nguyenNhan', 'ghiChu', 'congKhai'],
  Anh: ['id', 'ma', 'viec', 'luc', 'tenFile', 'fileId', 'nguoi'],
  HopDong: ['ma', 'soHD', 'dang', 'nguyenTac', 'tenHD', 'maKhach', 'maCongTrinh', 'ngayKy', 'giaTri', 'dot', 'phuLuc', 'soLanSua',
    'soBuoiGSTG', 'khauTru', 'truTK', 'linkFile', 'trangThai', 'lyDo', 'ngayDung', 'nguoiTao', 'taoLuc', 'capNhatLuc'],
  PhuongAn: ['id', 'maCongTrinh', 'hangMuc', 'lan', 'viec', 'ngayGui', 'link', 'ghiChu', 'trangThai', 'ngayPhanHoi', 'yKien',
    'duyetQua', 'duyetLuc', 'phi', 'nguoiGui', 'capNhatLuc'],
  GSTG: ['id', 'maCongTrinh', 'lan', 'ten', 'viec', 'ngay', 'xong', 'ghiChu', 'nhacGiamSat', 'capNhatLuc'],
  DaNhan: ['idGui', 'luc'],
};
// Cột lưu dạng JSON trong 1 ô
const JSON_COT = ['lich', 'diSau', 'goc', 'thucTe', 'hoaHong', 'nhuCau', 'baoGia', 'chamSoc', 'dot', 'phuLuc', 'khauTru', 'truTK'];
// Thầy và Đức toàn quyền. KHA (giám sát) và TAM (quyền tạm, có hạn ngày) chỉ thấy công trình được giao, không thấy tiền, không thấy sổ khách.
const VAN_PHONG = ['THAY', 'DUC'];
const VAI_TRO = ['THAY', 'DUC', 'KHA', 'TAM'];
const laKhach = (ma) => /^KH-/.test(String(ma));
// Sổ khách (KH-) và hợp đồng (HD-) chỉ văn phòng thấy, kể cả nhật ký của chúng.
const laRieng = (ma) => /^(KH|HD)-/.test(String(ma));

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
  const ma = e && e.parameter && e.parameter.xem;
  if (!ma) return json({ ok: true, data: { app: 'KAS App', chay: true } });
  const ct = docBang('CongTrinh').find((r) => r.maLinkChuNha === ma);
  if (!ct) return json({ ok: false, loi: 'Link không đúng hoặc đã hết hạn' });
  // Chỉ trả phần chủ nhà được xem: không tên thầu, không ghi chú nội bộ, không tiền.
  const viec = docBang('KeHoach').filter((r) => r.ma === ct.ma).map((v) => ({
    id: v.id, thuTu: v.thuTu, nhom: v.nhom, hangMuc: v.hangMuc, soNgay: Number(v.soNgay), diSau: v.diSau,
    moc: v.moc, phanTram: Number(v.phanTram) || 0, goc: v.goc, thucTe: v.thucTe,
  })).sort((a, b) => a.thuTu - b.thuTu);
  const lichSu = docBang('LichSu').filter((r) => r.ma === ct.ma && r.loai === 'CHAM' && r.congKhai === true)
    .map((r) => ({ id: r.id, luc: r.luc, ma: r.ma, tenViec: r.tenViec, loai: r.loai, cu: r.cu, moi: r.moi, nguyenNhan: r.nguyenNhan, congKhai: true }));
  const phuongAn = docBang('PhuongAn').filter((p) => p.maCongTrinh === ct.ma).map(paChoChuNha);
  return json({ ok: true, data: { ct: { ma: ct.ma, ten: ct.ten, loai: ct.loai, khoiCong: ct.khoiCong, lich: ct.lich, maLinkChuNha: ct.maLinkChuNha, viec }, lichSu, phuongAn } });
}

// Phần phương án chủ nhà được xem: không ghi chú nội bộ, không phí.
function paChoChuNha(p) {
  return { id: p.id, hangMuc: p.hangMuc, lan: Number(p.lan) || 0, ngayGui: p.ngayGui, link: p.link, trangThai: p.trangThai,
    ngayPhanHoi: p.ngayPhanHoi, yKien: p.yKien, duyetQua: p.duyetQua, duyetLuc: p.duyetLuc };
}

// Chủ nhà bấm "Đồng ý" hoặc "Cần sửa" trên link. Không cần khoá; chỉ được trả lời phương án đang chờ của đúng công trình.
function chuNhaPhanHoi(data) {
  const ct = docBang('CongTrinh').find((r) => r.maLinkChuNha && r.maLinkChuNha === data.maLink);
  if (!ct) throw new Error('Link không đúng hoặc đã hết hạn');
  if (data.ketQua !== 'DUYET' && data.ketQua !== 'SUA') throw new Error('Phản hồi không hợp lệ');
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
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
      nguyenTac: h.nguyenTac === true, dot: h.dot || [], phuLuc: h.phuLuc || [], khauTru: h.khauTru || { han: '', soTien: 0 }, truTK: h.truTK || { maHD: '', soTien: 0 } })) : [];
    const phuongAn = vp ? docBang('PhuongAn').map((p) => ({ ...p, lan: Number(p.lan) || 0 })) : [];
    const gstg = docBang('GSTG').filter((g) => duocXem(n, g.maCongTrinh)).map((g) => ({ ...g, lan: Number(g.lan) || 0, nhacGiamSat: g.nhacGiamSat === true }));
    return { toi: n, congTrinh, lichSu, khach, hopDong, phuongAn, gstg, nguoiDung: vp ? HANH_DONG.dsNguoiDung(n) : [] };
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
    if (!duocXem(n, data.ma)) throw new Error('Không có quyền với công trình ' + data.ma);
    const daCo = docBang('Anh').find((r) => r.id === data.id);
    if (daCo) return { fileId: daCo.fileId };
    const thuMuc = thuMucAnh(data.ma);
    const blob = Utilities.newBlob(Utilities.base64Decode(data.base64), 'image/jpeg', data.tenFile);
    const f = thuMuc.createFile(blob);
    themDong('Anh', { id: data.id, ma: data.ma, viec: data.viec, luc: new Date().toISOString(), tenFile: data.tenFile, fileId: f.getId(), nguoi: n.email });
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
  if (op.loai === 'CONG_KHAI') {
    canThay(n);
    capNhatDong('LichSu', (r) => r.id === op.id, { congKhai: op.congKhai === true }, true);
    return;
  }
  throw new Error('Loại thay đổi lạ: ' + op.loai);
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
      const moi = h.map((k, j) => (k in obj ? giaTriVao(k, obj[k]) : v[i][j]));
      sh.getRange(i + 1, 1, 1, h.length).setValues([moi]);
      return true;
    }
  }
  if (!chiSua) themDong(ten, obj);
  return false;
}

function taoKhoa() {
  return Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
