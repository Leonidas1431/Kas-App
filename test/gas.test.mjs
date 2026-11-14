import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { taoTuThuVien, xepLich } from '../web/js/schedule.js';
const { taoMoiTruong } = createRequire(import.meta.url)('./gas-mock.cjs');

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const lich = { kieu: 'NGHI_CN', nghi: [], daHoi: [] };
function congTrinhMau(ma, thuMucDrive = '') {
  const viec = taoTuThuVien(thuVien, 'NTCT');
  const g = xepLich(viec, '2026-11-02', lich);
  viec.forEach((v) => { v.goc = g.get(v.id); });
  return { ma, ten: 'Căn hộ thử', loai: 'NTCT', khoiCong: '2026-11-02', lich, chuNha: '', thuMucDrive, maLinkChuNha: '0123456789', viec, taoLuc: '2026-11-01T00:00:00Z' };
}
const op = (o) => ({ idGui: Math.random().toString(36).slice(2), luc: '2026-11-05T01:00:00Z', ...o });

function khoiDong() {
  const m = taoMoiTruong();
  m.ctx.setup();
  const khoaThay = m.logs.find((l) => l.startsWith('KHOÁ')).split(': ')[1];
  return { ...m, khoaThay };
}

test('setup tạo bảng và khoá cho Thầy; chạy lại không tạo thêm', () => {
  const m = khoiDong();
  assert.ok(m.khoaThay.length > 30);
  m.ctx.setup();
  const r = m.post(m.khoaThay, 'toiLaAi');
  assert.equal(r.ok, true);
  assert.equal(r.data.vaiTro, 'THAY');
  assert.equal(m.post(m.khoaThay, 'dsNguoiDung').data.length, 1);
});

test('khoá sai bị từ chối', () => {
  const m = khoiDong();
  const r = m.post('sai', 'toiLaAi');
  assert.equal(r.ok, false);
  assert.match(r.loi, /Khoá/);
});

test('tạo công trình, cập nhật tiến độ, kéo về đúng dữ liệu; gửi lại không bị trùng', () => {
  const m = khoiDong();
  const ct = congTrinhMau('NT-2611-A');
  const o1 = op({ loai: 'TAO_CT', ct });
  const v = { ...ct.viec[0], phanTram: 50, trangThai: 'DANG', thucTe: { batDau: '2026-11-02' } };
  const o2 = op({ loai: 'VIEC', ma: ct.ma, viec: v });
  const o3 = op({ loai: 'LICH_SU', e: { id: 'ls1', luc: '2026-11-05T01:00:00Z', ma: ct.ma, viec: v.id, tenViec: v.hangMuc, nguoi: 'gia-mao', loai: 'TIEN_DO', cu: 0, moi: 50 } });
  let r = m.post(m.khoaThay, 'dayLen', { ops: [o1, o2, o3] });
  assert.deepEqual(r.data.map((x) => x.ok), [true, true, true]);
  r = m.post(m.khoaThay, 'dayLen', { ops: [o1, o2, o3] }); // mất sóng, gửi lại
  assert.deepEqual(r.data.map((x) => x.ok), [true, true, true]);
  const kv = m.post(m.khoaThay, 'keoVe').data;
  assert.equal(kv.congTrinh.length, 1);
  const c = kv.congTrinh[0];
  assert.equal(c.khoiCong, '2026-11-02');
  assert.equal(c.maLinkChuNha, '0123456789'); // không bị Sheets đổi thành số
  assert.deepEqual(c.lich, lich);
  assert.equal(c.viec.length, ct.viec.length);
  assert.equal(c.viec[0].phanTram, 50);
  assert.deepEqual(c.viec[0].thucTe, { batDau: '2026-11-02' });
  assert.deepEqual(c.viec[1].diSau, ct.viec[1].diSau);
  assert.deepEqual(c.viec[0].goc, ct.viec[0].goc);
  assert.equal(kv.lichSu.length, 1);
  assert.equal(kv.lichSu[0].nguoi, 'THAY'); // lấy theo khoá, không theo máy gửi
});

test('Kha chỉ thấy công trình được giao, không tạo được công trình, không sửa được tên việc', () => {
  const m = khoiDong();
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A') }), op({ loai: 'TAO_CT', ct: congTrinhMau('NT-B') })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const kv = m.post(khoaKha, 'keoVe').data;
  assert.deepEqual(kv.congTrinh.map((c) => c.ma), ['NT-A']);
  assert.deepEqual(kv.nguoiDung, []);
  let r = m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-C') })] });
  assert.equal(r.data[0].ok, false);
  const v = { ...kv.congTrinh[0].viec[0], hangMuc: 'Đổi tên', phanTram: 100 };
  r = m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'VIEC', ma: 'NT-A', viec: v }), op({ loai: 'VIEC', ma: 'NT-B', viec: v })] });
  assert.deepEqual(r.data.map((x) => x.ok), [true, false]);
  const sau = m.post(m.khoaThay, 'keoVe').data.congTrinh.find((c) => c.ma === 'NT-A').viec[0];
  assert.equal(sau.phanTram, 100);
  assert.notEqual(sau.hangMuc, 'Đổi tên');
  assert.equal(m.post(khoaKha, 'dsNguoiDung').ok, false);
});

test('cấp lại khoá thu hồi khoá cũ; thu hồi chặn đăng nhập', () => {
  const m = khoiDong();
  const k1 = m.post(m.khoaThay, 'capKhoa', { email: 'duc@example.com', vaiTro: 'DUC' }).data.khoa;
  const k2 = m.post(m.khoaThay, 'capKhoa', { email: 'duc@example.com', vaiTro: 'DUC' }).data.khoa;
  assert.equal(m.post(k1, 'toiLaAi').ok, false);
  assert.equal(m.post(k2, 'toiLaAi').ok, true);
  m.post(m.khoaThay, 'thuHoi', { khoa: k2 });
  assert.equal(m.post(k2, 'toiLaAi').ok, false);
  assert.equal(m.post(m.khoaThay, 'thuHoi', { khoa: m.khoaThay }).ok, false);
});

test('link chủ nhà chỉ thấy lý do chậm đã công khai, không có tên thầu', () => {
  const m = khoiDong();
  const ct = congTrinhMau('NT-A');
  const e = { id: 'c1', luc: '2026-11-05T01:00:00Z', ma: 'NT-A', viec: ct.viec[3].id, tenViec: 'x', loai: 'CHAM', cu: 2, moi: 5, nguyenNhan: 'Chủ nhà', ghiChu: 'nội bộ' };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct }), op({ loai: 'LICH_SU', e })] });
  let g = m.get({ xem: '0123456789' });
  assert.equal(g.ok, true);
  assert.equal(g.data.lichSu.length, 0);
  assert.equal(g.data.ct.viec.length, ct.viec.length);
  assert.equal('nhaThau' in g.data.ct.viec[0], false);
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'CONG_KHAI', id: 'c1', congKhai: true })] });
  g = m.get({ xem: '0123456789' });
  assert.equal(g.data.lichSu.length, 1);
  assert.equal('ghiChu' in g.data.lichSu[0], false);
  assert.equal(m.get({ xem: 'sai' }).ok, false);
});

test('ảnh vào thư mục "Ảnh tiến độ" của công trình; gửi lại không tạo file thứ hai', () => {
  const m = khoiDong();
  const thuMucCt = m.root.createFolder('XaLa');
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A', 'https://drive.google.com/drive/folders/' + thuMucCt.getId()) }), op({ loai: 'TAO_CT', ct: congTrinhMau('NT-B') })] });
  const anh = { id: 'a1', ma: 'NT-A', viec: 'XT01', tenFile: 'NT-A_20261105_0830_XT01_01.jpg', base64: Buffer.from('jpg').toString('base64') };
  assert.equal(m.post(m.khoaThay, 'guiAnh', anh).ok, true);
  assert.equal(m.post(m.khoaThay, 'guiAnh', anh).ok, true);
  const tienDo = thuMucCt.con.find((c) => c.ten === 'Ảnh tiến độ');
  assert.equal(tienDo.files.length, 1);
  assert.equal(tienDo.files[0].ten, 'NT-A_20261105_0830_XT01_01.jpg');
  // Công trình chưa gắn thư mục: tự tạo trong Drive của Thầy
  assert.equal(m.post(m.khoaThay, 'guiAnh', { ...anh, id: 'a2', ma: 'NT-B' }).ok, true);
  const chung = m.root.con.find((c) => c.ten === 'KAS App – Ảnh');
  assert.ok(chung.con.find((c) => c.ten === 'NT-B'));
});

test('sổ khách: văn phòng ghi và kéo về được; giám sát không thấy và không ghi được', () => {
  const m = khoiDong();
  const khoaDuc = m.post(m.khoaThay, 'capKhoa', { email: 'duc@example.com', ten: 'Đức', vaiTro: 'DUC' }).data.khoa;
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const kh = { ma: 'KH-2611-XUAN', ten: 'Chị Xuân', sdt: '0912345678', nguon: 'Người quen giới thiệu', nguoiGioiThieu: 'Anh Tú',
    hoaHong: { soTien: 5000000, daTra: false }, nhuCau: { loai: 'NTCT', dienTich: '90' }, trangThai: 'MOI', nhacGoi: '2026-11-13', soLanNhac: 0,
    baoGia: [{ id: 'b1', phienBan: 1, ngay: '2026-11-13', giaTri: 25000000, link: '', khachChot: false }], chamSoc: [], thuMucDrive: 'gia-mao' };
  let r = m.post(khoaDuc, 'dayLen', { ops: [op({ loai: 'KHACH', khach: kh })] });
  assert.equal(r.data[0].ok, true);
  r = m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'KHACH', khach: { ...kh, trangThai: 'BAO_GIA', soLanNhac: 1 } })] });
  assert.equal(r.data[0].ok, true);
  const kv = m.post(m.khoaThay, 'keoVe').data;
  assert.equal(kv.khach.length, 1); // cập nhật, không thêm dòng
  const k = kv.khach[0];
  assert.equal(k.sdt, '0912345678'); // giữ số 0 đầu
  assert.equal(k.trangThai, 'BAO_GIA');
  assert.equal(k.soLanNhac, 1);
  assert.equal(k.nhacGoi, '2026-11-13');
  assert.deepEqual(k.hoaHong, { soTien: 5000000, daTra: false });
  assert.equal(k.baoGia[0].giaTri, 25000000);
  assert.equal(k.thuMucDrive, ''); // máy gửi lên không được tự đặt thư mục
  // Giám sát: không thấy khách, không ghi được, không thấy nhật ký khách
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'LICH_SU', e: { id: 'g1', luc: '2026-11-13T01:00:00Z', ma: 'KH-2611-XUAN', loai: 'KH_GHI', ghiChu: 'Khách muốn tủ bếp chữ L' } })] });
  const kvKha = m.post(khoaKha, 'keoVe').data;
  assert.deepEqual(kvKha.khach, []);
  assert.equal(kvKha.lichSu.length, 0);
  r = m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'KHACH', khach: { ...kh, ma: 'KH-2611-KHAC' } })] });
  assert.equal(r.data[0].ok, false);
  assert.equal(m.post(khoaKha, 'guiAnh', { id: 'a9', ma: 'KH-2611-XUAN', viec: 'KS', tenFile: 'x.jpg', base64: 'eA==' }).ok, false);
});

test('ảnh khảo sát vào thư mục khách; ký xong công trình dùng luôn thư mục đó', () => {
  const m = khoiDong();
  const kh = { ma: 'KH-2611-XUAN', ten: 'Chị Xuân', sdt: '0912345678', trangThai: 'KHAO_SAT', baoGia: [], chamSoc: [] };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'KHACH', khach: kh })] });
  assert.equal(m.post(m.khoaThay, 'guiAnh', { id: 'k1', ma: 'KH-2611-XUAN', viec: 'KS', tenFile: 'KH-2611-XUAN_20261113_0900_KS_01.jpg', base64: 'eA==' }).ok, true);
  const goc = m.root.con.find((c) => c.ten === 'KAS App – Khách').con.find((c) => c.ten === 'KH-2611-XUAN');
  assert.equal(goc.con.find((c) => c.ten === 'Ảnh khảo sát').files.length, 1);
  const ct = { ...congTrinhMau('NT-2611-XUAN'), maKhach: 'KH-2611-XUAN' };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct })] });
  m.post(m.khoaThay, 'guiAnh', { id: 'k2', ma: 'NT-2611-XUAN', viec: 'XT01', tenFile: 'a.jpg', base64: 'eA==' });
  assert.ok(goc.con.find((c) => c.ten === 'Ảnh tiến độ'));
  // Ghi thư mục vào dòng khách không làm mất số 0 đầu của số điện thoại
  assert.equal(m.post(m.khoaThay, 'keoVe').data.khach[0].sdt, '0912345678');
});

test('Đức toàn quyền như Thầy nhưng không thu hồi được khoá Thầy; quyền tạm hết hạn thì bị chặn', () => {
  const m = khoiDong();
  const khoaDuc = m.post(m.khoaThay, 'capKhoa', { email: 'duc@example.com', ten: 'Đức', vaiTro: 'DUC' }).data.khoa;
  assert.equal(m.post(khoaDuc, 'dsNguoiDung').ok, true);
  assert.equal(m.post(khoaDuc, 'thuHoi', { khoa: m.khoaThay }).ok, false);
  assert.equal(m.post(m.khoaThay, 'capKhoa', { email: 'tho@example.com', vaiTro: 'TAM' }).ok, false); // thiếu hạn
  const conHan = m.post(khoaDuc, 'capKhoa', { email: 'tho@example.com', vaiTro: 'TAM', congTrinh: 'NT-A', hetHan: '2999-01-01' }).data.khoa;
  assert.equal(m.post(conHan, 'toiLaAi').data.vaiTro, 'TAM');
  assert.deepEqual(m.post(conHan, 'keoVe').data.khach, []);
  const hetHan = m.post(khoaDuc, 'capKhoa', { email: 'tho2@example.com', vaiTro: 'TAM', congTrinh: 'NT-A', hetHan: '2020-01-01' }).data.khoa;
  const r = m.post(hetHan, 'toiLaAi');
  assert.equal(r.ok, false);
  assert.match(r.loi, /hết hạn/);
  assert.equal(m.post(m.khoaThay, 'capKhoa', { email: 'x@example.com', vaiTro: 'TRUNG' }).ok, false);
});

test('hợp đồng: văn phòng ghi, giám sát không thấy tiền và nhật ký HĐ; máy chủ cũ tự thêm tab mới', () => {
  const m = khoiDong();
  // Giả lập máy chủ cài từ bản trước: chưa có tab HopDong
  m.ss.ds = m.ss.ds.filter((s) => s.ten !== 'HopDong');
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const hd = { ma: 'HD-abc', soHD: '261131/MrNam-KAS/NT', dang: 'NT', nguyenTac: false, tenHD: 'MrNam', maCongTrinh: 'NT-A', ngayKy: '2026-11-13', giaTri: 500000000,
    dot: [{ id: 'd1', so: 1, ten: 'Ký', tyLe: 50, thu: [{ id: 't1', ngay: '2026-11-13', soTien: 250000000 }], dong: '2026-11-13', chot: 250000000 }], phuLuc: [],
    soLanSua: 0, soBuoiGSTG: 2, khauTru: { han: '', soTien: 0 }, truTK: { maHD: '', soTien: 0 }, trangThai: 'HIEU_LUC' };
  let r = m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A') }), op({ loai: 'HD', hd }),
    op({ loai: 'LICH_SU', e: { id: 'h1', luc: '2026-11-13T01:00:00Z', ma: 'HD-abc', loai: 'HD_GHI', ghiChu: 'Thu đợt 1: 250.000.000 đ' } })] });
  assert.deepEqual(r.data.map((x) => x.ok), [true, true, true]);
  r = m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'HD', hd: { ...hd, trangThai: 'XONG' } })] });
  const kv = m.post(m.khoaThay, 'keoVe').data;
  assert.equal(kv.hopDong.length, 1);
  assert.equal(kv.hopDong[0].trangThai, 'XONG');
  assert.equal(kv.hopDong[0].giaTri, 500000000);
  assert.equal(kv.hopDong[0].ngayKy, '2026-11-13');
  assert.equal(kv.hopDong[0].soHD, '261131/MrNam-KAS/NT');
  assert.equal(kv.hopDong[0].dot[0].thu[0].soTien, 250000000);
  const kvKha = m.post(khoaKha, 'keoVe').data;
  assert.deepEqual(kvKha.hopDong, []);
  assert.deepEqual(kvKha.phuongAn, []);
  assert.equal(kvKha.lichSu.some((e) => e.ma === 'HD-abc'), false);
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'HD', hd: { ...hd, ma: 'HD-x' } })] }).data[0].ok, false);
  assert.equal(m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'HD', hd: { ...hd, ma: 'NT-A' } })] }).data[0].ok, false);
  // Cài đặt tài khoản nhận tiền: văn phòng ghi và đọc, giám sát không thấy, ghi lại không tạo dòng mới
  const tk = 'Số TK: 0123\nNgân hàng X';
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'CAI_DAT', khoa: 'taiKhoan', giaTri: 'cũ' }), op({ loai: 'CAI_DAT', khoa: 'taiKhoan', giaTri: tk })] });
  assert.deepEqual(m.post(m.khoaThay, 'keoVe').data.caiDat, { taiKhoan: tk });
  assert.deepEqual(m.post(khoaKha, 'keoVe').data.caiDat, {});
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'CAI_DAT', khoa: 'taiKhoan', giaTri: 'x' })] }).data[0].ok, false);
});

test('chủ nhà duyệt phương án trên link; văn phòng gửi bản cũ không ghi đè câu trả lời', () => {
  const m = khoiDong();
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('TK-A') })] });
  const pa = { id: 'PA-1', maCongTrinh: 'TK-A', hangMuc: 'Phương án 3D', lan: 0, viec: 'TK03', ngayGui: '2026-11-10', link: 'https://drive/x', ghiChu: 'nội bộ: khách khó tính', trangThai: 'CHO', phi: '' };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'PA', pa })] });
  let g = m.get({ xem: '0123456789' });
  assert.equal(g.data.phuongAn.length, 1);
  assert.equal(g.data.phuongAn[0].ghiChu, undefined); // không lộ ghi chú nội bộ
  // Link sai hoặc phương án của công trình khác: từ chối
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: 'sai', id: 'PA-1', ketQua: 'DUYET' }).ok, false);
  const r = m.post(undefined, 'chuNhaPhanHoi', { maLink: '0123456789', id: 'PA-1', ketQua: 'DUYET', yKien: 'Ok em' });
  assert.equal(r.ok, true);
  assert.equal(r.data.trangThai, 'DUYET');
  // Trả lời lần nữa không đổi được
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: '0123456789', id: 'PA-1', ketQua: 'SUA' }).data.trangThai, 'DUYET');
  // Máy văn phòng chưa kéo về, sửa link file và gửi lên với trạng thái cũ
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'PA', pa: { ...pa, link: 'https://drive/y' } })] });
  const p = m.post(m.khoaThay, 'keoVe').data.phuongAn[0];
  assert.equal(p.trangThai, 'DUYET');
  assert.equal(p.duyetQua, 'LINK');
  assert.equal(p.link, 'https://drive/y');
  assert.ok(m.post(m.khoaThay, 'keoVe').data.lichSu.some((e) => e.nguoi === 'CHU_NHA'));
});

test('GSTG: giám sát được giao thấy buổi giám sát tác giả, không sửa được', () => {
  const m = khoiDong();
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const gs = { id: 'GS-1', maCongTrinh: 'NT-A', lan: 1, ten: 'sau phá dỡ', viec: 'CB08', ngay: '', xong: '', nhacGiamSat: true };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'GSTG', gs }), op({ loai: 'GSTG', gs: { ...gs, id: 'GS-2', maCongTrinh: 'NT-B' } })] });
  const ds = m.post(khoaKha, 'keoVe').data.gstg;
  assert.deepEqual(ds.map((g) => g.id), ['GS-1']);
  assert.equal(ds[0].nhacGiamSat, true);
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'GSTG', gs: { ...gs, xong: '2026-11-13' } })] }).data[0].ok, false);
});

test('sửa kế hoạch: thêm, xoá việc, sửa công trình; giám sát không làm được', () => {
  const m = khoiDong();
  const ct = congTrinhMau('NT-A', '');
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const v = { id: 'VMOI1', thuTu: 2, nhom: 'Thô', hangMuc: 'Chống thấm', soNgay: 2, diSau: [{ id: ct.viec[1].id, kieu: 'XS', goi: 0 }], phanTram: 0, trangThai: 'CHUA', goc: { batDau: '2026-11-04', ketThuc: '2026-11-05' }, batDauCoDinh: '2026-11-20' };
  const them = op({ loai: 'THEM_VIEC', ma: 'NT-A', viec: v });
  let r = m.post(m.khoaThay, 'dayLen', { ops: [them, op({ loai: 'XOA_VIEC', ma: 'NT-A', id: ct.viec[0].id }),
    op({ loai: 'CT_SUA', ma: 'NT-A', sua: { khoiCong: '2026-11-09', lich: { ...lich, nghi: ['2026-11-10'] }, thuMucDrive: 'https://drive.google.com/drive/folders/' + 'a'.repeat(30), maLinkChuNha: 'doi' } })] });
  assert.deepEqual(r.data.map((x) => x.ok), [true, true, true]);
  m.post(m.khoaThay, 'dayLen', { ops: [{ ...them, idGui: 'khac' }] }); // gửi lại không trùng
  let c = m.post(m.khoaThay, 'keoVe').data.congTrinh[0];
  assert.equal(c.viec.length, ct.viec.length);
  assert.equal(c.viec.filter((x) => x.id === 'VMOI1').length, 1);
  assert.ok(!c.viec.some((x) => x.id === ct.viec[0].id));
  assert.equal(c.viec.find((x) => x.id === 'VMOI1').batDauCoDinh, '2026-11-20');
  assert.equal(c.khoiCong, '2026-11-09');
  assert.deepEqual(c.lich.nghi, ['2026-11-10']);
  assert.equal(c.thuMucDrive, 'a'.repeat(30));
  assert.equal(c.maLinkChuNha, '0123456789'); // không cho đổi link chủ nhà qua đây
  assert.equal(m.get({ xem: '0123456789' }).data.ct.viec.find((x) => x.id === 'VMOI1').batDauCoDinh, '2026-11-20');
  // Giám sát: không thêm, xoá, sửa công trình
  r = m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'THEM_VIEC', ma: 'NT-A', viec: { ...v, id: 'VMOI2' } }), op({ loai: 'XOA_VIEC', ma: 'NT-A', id: 'VMOI1' }), op({ loai: 'CT_SUA', ma: 'NT-A', sua: { ten: 'x' } })] });
  assert.deepEqual(r.data.map((x) => x.ok), [false, false, false]);
  c = m.post(m.khoaThay, 'keoVe').data.congTrinh[0];
  assert.ok(c.viec.some((x) => x.id === 'VMOI1'));
  assert.equal(c.ten, 'Căn hộ thử');
});

test('thu chi: văn phòng ghi; giám sát chỉ thấy đợt trả thầu không có tiền, chỉ xác nhận được khối lượng', () => {
  const m = khoiDong();
  const ct = congTrinhMau('NT-A', '');
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const t = { id: 'TT-1', maCongTrinh: 'NT-A', thau: 'Thầu Tâm', hangMuc: 'Điện nước', dot: 'DN1', soTien: 12000000, dieuKien: 'Đi ống xong', viecMoc: '', hanTra: '2026-12-01', klXacNhan: null, ghiChu: 'giữ 5% bảo hành', xoa: '' };
  const e = { id: 'TC-1', ngay: '2026-11-13', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi thầu phụ', thamChieu: 'TT-1', doiTuong: 'Thầu Tâm', soTien: 5000000, noiDung: '', hinhThuc: 'CK', soAnh: 1, xoa: '' };
  const ls = { id: 'ls-tc', luc: '2026-11-13T01:00:00Z', ma: 'TC-1', viec: '', tenViec: 'Thu chi', nguoi: 'THAY', loai: 'THU_CHI', ghiChu: 'Xoá khoản 5.000.000 đ' };
  let r = m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TT', t }), op({ loai: 'TC', e }), op({ loai: 'LICH_SU', e: ls })] });
  assert.deepEqual(r.data.map((x) => x.ok), [true, true, true]);
  // Giám sát: không thấy tiền, ghi chú, sổ thu chi, nhật ký tiền
  let kv = m.post(khoaKha, 'keoVe').data;
  assert.equal(kv.traThau.length, 1);
  assert.equal(kv.traThau[0].soTien, undefined);
  assert.equal(kv.traThau[0].ghiChu, undefined);
  assert.equal(kv.traThau[0].dieuKien, 'Đi ống xong');
  assert.deepEqual(kv.thuChi, []);
  assert.ok(!kv.lichSu.some((x) => x.id === 'ls-tc'));
  assert.ok(!JSON.stringify(kv).includes('12000000'));
  // Giám sát không ghi được thu chi hay sửa đợt; xác nhận KL được, 1 lần
  r = m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'TC', e: { ...e, soTien: 1 } }), op({ loai: 'TT', t: { ...t, soTien: 1 } }), op({ loai: 'XAC_NHAN_KL', id: 'TT-1', ngay: '2026-11-13', ghiChu: 'đủ' })] });
  assert.deepEqual(r.data.map((x) => x.ok), [false, false, true]);
  // Văn phòng gửi bản đợt cũ (chưa có xác nhận) không xoá mất xác nhận của giám sát
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TT', t: { ...t, hanTra: '2026-12-05' } })] });
  kv = m.post(m.khoaThay, 'keoVe').data;
  assert.deepEqual(kv.traThau[0].klXacNhan, { ngay: '2026-11-13', nguoi: 'KHA', ghiChu: 'đủ' });
  assert.equal(kv.traThau[0].hanTra, '2026-12-05');
  assert.equal(kv.traThau[0].soTien, 12000000);
  assert.equal(kv.thuChi[0].soTien, 5000000);
  assert.equal(kv.thuChi[0].soAnh, 1);
  assert.ok(kv.lichSu.some((x) => x.id === 'ls-tc'));
  // Công trình không được giao: không xác nhận được
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TT', t: { ...t, id: 'TT-2', maCongTrinh: 'NT-B' } })] });
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'XAC_NHAN_KL', id: 'TT-2', ngay: '2026-11-13' })] }).data[0].ok, false);
  // Ảnh chứng từ: chỉ văn phòng, để riêng thư mục "KAS App – Chứng từ"
  assert.equal(m.post(khoaKha, 'guiAnh', { id: 'a1', ma: 'NT-A', viec: 'TC-1', tenFile: 'x.jpg', base64: 'eA==', loai: 'CHUNG_TU' }).ok, false);
  assert.equal(m.post(m.khoaThay, 'guiAnh', { id: 'a2', ma: 'CTY', viec: 'TC-9', tenFile: 'ck.jpg', base64: 'eA==', loai: 'CHUNG_TU' }).ok, true);
  assert.equal(m.root.con.find((c) => c.ten === 'KAS App – Chứng từ').con.find((c) => c.ten === 'CTY').files.length, 1);
  assert.deepEqual(m.post(m.khoaThay, 'keoVe').data.chungTu.map((a) => a.viec), ['TC-9']);
  assert.deepEqual(m.post(khoaKha, 'keoVe').data.chungTu, []);
});

test('phát sinh: giám sát báo không kèm giá, không thấy giá; chủ nhà đồng ý trên link; văn phòng gửi bản cũ không ghi đè', () => {
  const m = khoiDong();
  const ct = congTrinhMau('NT-A', '');
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  // Giám sát báo, cố gửi kèm giá và trạng thái: máy chủ bỏ qua
  let r = m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'PS_BAO', ps: { id: 'PS-1', ma: 'PS01', maCongTrinh: 'NT-A', ngayBao: '2026-11-10', moTa: 'Thêm ổ cắm', giaBan: 1, trangThai: 'DUYET' } }),
    op({ loai: 'PS_BAO', ps: { id: 'PS-2', ma: 'PS01', maCongTrinh: 'NT-A', ngayBao: '2026-11-10', moTa: 'Trùng số' } }),
    op({ loai: 'PS', ps: { id: 'PS-1', trangThai: 'DUYET' } })] });
  assert.deepEqual(r.data.map((x) => x.ok), [true, true, false]);
  let ds = m.post(m.khoaThay, 'keoVe').data.phatSinh;
  assert.deepEqual(ds.map((p) => [p.ma, p.trangThai, p.giaBan, p.nguoiBao]), [['PS01', 'CHO_BAO_GIA', 0, 'KHA'], ['PS02', 'CHO_BAO_GIA', 0, 'KHA']]);
  // Chưa báo giá: chủ nhà chưa thấy
  assert.equal(m.get({ xem: '0123456789' }).data.phatSinh.length, 0);
  const ps = { ...ds[0], giaBan: 3500000, chiGoc: 2200000, ngayBaoGia: '2026-11-11', trangThai: 'CHO_KHACH' };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'PS', ps })] });
  const g = m.get({ xem: '0123456789' }).data.phatSinh;
  assert.equal(g.length, 1);
  assert.equal(g[0].giaBan, 3500000);
  assert.equal(g[0].chiGoc, undefined); // không lộ chi phí gốc
  // Giám sát không thấy giá; chưa duyệt thì chưa báo làm xong được
  const kv = m.post(khoaKha, 'keoVe').data.phatSinh;
  assert.equal(kv[0].giaBan, undefined);
  assert.equal(kv[0].chiGoc, undefined);
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'PS_XONG', id: 'PS-1', ngay: '2026-11-12' })] }).data[0].ok, false);
  // Chủ nhà đồng ý trên link; gửi lại không đổi
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: '0123456789', loai: 'PS', id: 'PS-1', ketQua: 'DUYET' }).data.trangThai, 'DUYET');
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: 'sai', loai: 'PS', id: 'PS-1', ketQua: 'TU_CHOI' }).ok, false);
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: '0123456789', loai: 'PS', id: 'PS-1', ketQua: 'TU_CHOI' }).data.trangThai, 'DUYET');
  // Văn phòng chưa kéo về, sửa nội dung với trạng thái cũ: giữ câu trả lời của chủ nhà
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'PS', ps: { ...ps, viTri: 'Bếp' } })] });
  ds = m.post(m.khoaThay, 'keoVe').data.phatSinh;
  assert.deepEqual([ds[0].trangThai, ds[0].quaKhach, ds[0].viTri], ['DUYET', 'LINK', 'Bếp']);
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'PS_XONG', id: 'PS-1', ngay: '2026-11-13' })] }).data[0].ok, true);
  assert.equal(m.post(m.khoaThay, 'keoVe').data.phatSinh[0].daLam, '2026-11-13');
  // Phương án thiết kế không nhận "TU_CHOI"
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: '0123456789', id: 'PA-x', ketQua: 'TU_CHOI' }).ok, false);
});

test('mẫu vật liệu: văn phòng gửi, chủ nhà chốt hoặc đổi trên link, giám sát xem được nhưng không sửa', () => {
  const m = khoiDong();
  const ct = congTrinhMau('NT-A', '');
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const mau = { id: 'MAU-1', maCongTrinh: 'NT-A', hangMuc: 'Gạch ốp WC', tenMau: '30x60', nguoiBan: 'Đại lý A', sdtNguoiBan: '0912345678', link: '', viec: '', hanChot: '2026-11-20', ngayGui: '2026-11-13', trangThai: 'CHO_KHACH' };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'MAU', m: mau })] });
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'MAU', m: { ...mau, trangThai: 'DUYET' } })] }).data[0].ok, false);
  assert.equal(m.post(khoaKha, 'keoVe').data.mauVL[0].sdtNguoiBan, '0912345678');
  const g = m.get({ xem: '0123456789' }).data.mauVL;
  assert.deepEqual([g.length, g[0].nguoiBan, g[0].sdtNguoiBan], [1, 'Đại lý A', undefined]);
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: '0123456789', loai: 'MAU', id: 'MAU-1', ketQua: 'SUA', yKien: 'sáng hơn' }).data.trangThai, 'DOI');
  // Văn phòng gửi bản cũ cùng lần gửi: giữ câu trả lời; gửi mẫu khác (ngày gửi mới): về chờ khách
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'MAU', m: { ...mau, link: 'https://x' } })] });
  assert.equal(m.post(m.khoaThay, 'keoVe').data.mauVL[0].trangThai, 'DOI');
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'MAU', m: { ...mau, tenMau: '30x60 kem', ngayGui: '2026-11-14' } })] });
  assert.equal(m.post(m.khoaThay, 'keoVe').data.mauVL[0].trangThai, 'CHO_KHACH');
  assert.equal(m.post(undefined, 'chuNhaPhanHoi', { maLink: '0123456789', loai: 'MAU', id: 'MAU-1', ketQua: 'DUYET' }).data.trangThai, 'DUYET');
});

test('nhà thầu: văn phòng ghi danh bạ; giám sát thấy tên, số nhưng không thấy link, ghi chú; đánh giá theo công trình; link thầu không có tiền, không việc thầu khác', () => {
  const m = khoiDong();
  const ct = congTrinhMau('NT-A');
  const dn = ct.viec.filter((v) => v.nhom.startsWith('Điện nước'));
  dn.forEach((v) => { v.nhaThau = 'Điện nước Tâm'; });
  ct.viec.find((v) => v.nhom.startsWith('Xây')).nhaThau = 'Thô Hưng';
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct }), op({ loai: 'TAO_CT', ct: { ...congTrinhMau('NT-B'), maLinkChuNha: '999' } })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const t = { id: 'NT-1', ten: 'Điện nước Tâm', linhVuc: 'Điện nước', sdt: '0912000111', ghiChu: 'hay chậm', maLink: 'linkthau1', hoatDong: true };
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'NT', t })] }).data[0].ok, false);
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'NT', t })] });
  // Văn phòng gửi lại với link khác: giữ link đã gửi thầu
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'NT', t: { ...t, maLink: 'khac', sdt: '0912000222' } })] });
  const vp = m.post(m.khoaThay, 'keoVe').data;
  assert.deepEqual([vp.nhaThau.length, vp.nhaThau[0].maLink, vp.nhaThau[0].sdt], [1, 'linkthau1', '0912000222']);
  const kha = m.post(khoaKha, 'keoVe').data;
  assert.deepEqual([kha.nhaThau[0].sdt, 'maLink' in kha.nhaThau[0], 'ghiChu' in kha.nhaThau[0]], ['0912000222', false, false]);
  // Đánh giá: Kha chấm công trình được giao, không chấm được công trình khác; máy chủ ghi người chấm
  const dg = { id: 'DG-1', maThau: 'NT-1', maCongTrinh: 'NT-A', ngay: '2026-12-01', chatLuong: 9, tienDo: 3, phoiHop: 4, nguoi: 'THAY' };
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'DG', d: { ...dg, maCongTrinh: 'NT-B', id: 'DG-2' } })] }).data[0].ok, false);
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'DG', d: dg })] }).data[0].ok, true);
  const p = m.post(m.khoaThay, 'keoVe').data.danhGia[0];
  assert.deepEqual([p.nguoi, p.chatLuong], ['KHA', 5]);
  assert.equal(m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'DG', d: dg })] }).data[0].ok, false); // phiếu của người khác
  // Mẫu đã chốt cho việc của thầu thì thầu thấy; mẫu chưa chốt thì không
  m.post(m.khoaThay, 'dayLen', { ops: [
    op({ loai: 'MAU', m: { id: 'MAU-1', maCongTrinh: 'NT-A', hangMuc: 'Ổ cắm', tenMau: 'Panasonic trắng', nguoiBan: 'A', sdtNguoiBan: '0900', viec: dn[0].id, trangThai: 'DUYET', ngayGui: '2026-11-10' } }),
    op({ loai: 'MAU', m: { id: 'MAU-2', maCongTrinh: 'NT-A', hangMuc: 'Đèn', tenMau: 'X', viec: dn[0].id, trangThai: 'CHO_KHACH', ngayGui: '2026-11-10' } }),
  ] });
  const g = m.get({ thau: 'linkthau1' });
  assert.equal(g.ok, true);
  assert.equal(g.data.thau.ten, 'Điện nước Tâm');
  assert.equal('sdt' in g.data.thau, false);
  assert.equal(g.data.congTrinh.length, 1); // NT-B không có việc của Tâm
  const c = g.data.congTrinh[0];
  assert.equal(c.viec.length, ct.viec.length); // đủ việc để tự xếp lịch
  assert.equal(c.viec.filter((v) => v.cuaThau).length, dn.length);
  assert.ok(c.viec.every((v) => !('nhaThau' in v)));
  assert.ok(c.viec.filter((v) => !v.cuaThau).every((v) => !('hangMuc' in v)));
  assert.deepEqual(c.mau.map((x) => [x.tenMau, x.sdtNguoiBan]), [['Panasonic trắng', undefined]]);
  assert.equal('chuNha' in c || 'maLinkChuNha' in c, false);
  assert.equal(m.get({ thau: 'sai' }).ok, false);
  // Ngừng dùng thì link không mở
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'NT', t: { ...t, hoatDong: false } })] });
  assert.equal(m.get({ thau: 'linkthau1' }).ok, false);
});

test('đếm ảnh hiện trường theo ngày cho nhắc 16h: không tính chứng từ, giám sát chỉ thấy công trình được giao', () => {
  const m = khoiDong();
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A') }), op({ loai: 'TAO_CT', ct: { ...congTrinhMau('NT-B'), maLinkChuNha: '999' } })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const b64 = Buffer.from('jpg').toString('base64');
  m.post(khoaKha, 'guiAnh', { id: 'a1', ma: 'NT-A', viec: 'XT01', tenFile: '1.jpg', base64: b64 });
  m.post(khoaKha, 'guiAnh', { id: 'a2', ma: 'NT-A', viec: '', tenFile: '2.jpg', base64: b64 });
  m.post(m.khoaThay, 'guiAnh', { id: 'a3', ma: 'NT-B', viec: '', tenFile: '3.jpg', base64: b64 });
  m.post(m.khoaThay, 'guiAnh', { id: 'a4', ma: 'TC-1', viec: '', tenFile: '4.jpg', base64: b64, loai: 'CHUNG_TU' });
  const hn = new Date().toISOString().slice(0, 10);
  const vp = m.post(m.khoaThay, 'keoVe').data.anh;
  assert.deepEqual(vp.map((a) => [a.ma, a.ngay, a.so]).sort(), [['NT-A', hn, 2], ['NT-B', hn, 1]]);
  assert.deepEqual(m.post(khoaKha, 'keoVe').data.anh.map((a) => a.ma), ['NT-A']);
});

test('nghiệm thu: giám sát ghi được ở công trình được giao; đánh dấu đã sửa ở máy khác không bị bản cũ ghi đè', () => {
  const m = khoiDong();
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A') }), op({ loai: 'TAO_CT', ct: { ...congTrinhMau('NT-B'), maLinkChuNha: '999' } })] });
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  const n = { id: 'NTH-1', maCongTrinh: 'NT-A', viec: 'XT01', ngay: '2026-11-11', checklist: [{ noiDung: 'Trát phẳng', dat: false }],
    tonTai: [{ id: 't1', noiDung: 'Trát phẳng', hanSua: '2026-11-14', daSua: '', nguoiSua: '' }], soAnh: 2 };
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'NGHIEM_THU', n: { ...n, maCongTrinh: 'NT-B', id: 'NTH-2' } })] }).data[0].ok, false);
  assert.equal(m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'NGHIEM_THU', n })] }).data[0].ok, true);
  // Kha báo đã sửa; Thầy gửi bản cũ (đổi hạn) sau đó: vẫn giữ đã sửa
  m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'NGHIEM_THU', n: { ...n, tonTai: [{ ...n.tonTai[0], daSua: '2026-11-13', nguoiSua: 'KHA' }] } })] });
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'NGHIEM_THU', n: { ...n, tonTai: [{ ...n.tonTai[0], hanSua: '2026-11-20' }] } })] });
  const x = m.post(m.khoaThay, 'keoVe').data.nghiemThu[0];
  assert.deepEqual([x.nguoi, x.tonTai[0].daSua, x.tonTai[0].hanSua, x.checklist.length], ['KHA', '2026-11-13', '2026-11-20', 1]);
  assert.equal(m.post(khoaKha, 'keoVe').data.nghiemThu.length, 1);
});

// ---------- Đăng bài ----------
function baiMau(o = {}) {
  return { id: 'BD-1', loai: 'DU_AN', chuDe: 'Căn hộ 90m2 bàn giao', ghiChu: 'Tông gỗ sáng', maCongTrinh: 'NT-A', nguonTL: '', trichDan: '', kenh: ['FB', 'IG', 'TT'],
    ngayDang: '2026-11-14', gioDang: '19:30', baiViet: {}, dsAnh: [], anhBia: '', mauBia: 'TRAN', tieuDeBia: '', phuDeBia: '', yKien: '', xoa: '', ...o };
}
// Claude trả JSON theo lược đồ được hỏi.
function claudeTraLoi(m, ra = {}) {
  m.traLoi.fn = (url, opt) => {
    if (!url.includes('anthropic')) return null;
    const body = JSON.parse(opt.payload);
    const p = body.output_config.format ? Object.keys(body.output_config.format.schema.properties) : [];
    const o = {};
    p.forEach((k) => { o[k] = k === 'tt' ? { tieuDe: 'TT tiêu đề', chuThich: 'TT chú thích', kichBan: 'Cảnh 1' } : k === 'web' ? { tieuDe: 'Web', moTa: 'Mô tả', noiDung: '## Mục 1\nĐoạn 1\n- ý a\nĐoạn 2', tuKhoa: ['nội thất'] } : 'Bài ' + k; });
    return { ma: 200, body: { model: body.model, stop_reason: 'end_turn', usage: { input_tokens: 10000, output_tokens: 4000 }, content: [{ type: 'text', text: JSON.stringify({ ...o, ...ra }) }] } };
  };
}

test('đăng bài: văn phòng ghi bài; giám sát không thấy, không ghi; máy gửi lên không tự duyệt được', () => {
  const m = khoiDong();
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  let r = m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'BD', b: { ...baiMau(), trangThai: 'DUYET', nguoiDuyet: 'THAY', ketQua: { FB: { id: 'gia' } } } })] });
  assert.equal(r.data[0].ok, true);
  const b = m.post(m.khoaThay, 'keoVe').data.baiDang[0];
  assert.equal(b.trangThai, 'NHAP');
  assert.equal(b.nguoiDuyet, '');
  assert.deepEqual(b.ketQua, {});
  assert.deepEqual(b.kenh, ['FB', 'IG', 'TT']);
  assert.deepEqual(m.post(khoaKha, 'keoVe').data.baiDang, []);
  r = m.post(khoaKha, 'dayLen', { ops: [op({ loai: 'BD', b: baiMau({ id: 'BD-2' }) })] });
  assert.equal(r.data[0].ok, false);
  assert.equal(m.post(khoaKha, 'guiAnh', { id: 'x1', ma: 'BD-1', viec: 'BAI', tenFile: 'x.jpg', base64: 'eA==', loai: 'BAI_DANG' }).ok, false);
});

test('AI viết bài: gửi dữ kiện công trình không có tên, chủ nhà; dùng model trong cài đặt; ghi chi phí; phong thủy bắt buộc có tài liệu', () => {
  const m = khoiDong();
  m.props.ANTHROPIC_API_KEY = 'sk-test';
  const ct = { ...congTrinhMau('NT-A'), ten: 'Nhà anh Tuấn Long Biên', chuNha: 'Anh Tuấn 0912000111' };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct }), op({ loai: 'CAI_DAT', khoa: 'bdModel', giaTri: 'claude-opus-5-5' })] });
  claudeTraLoi(m, { tieuDeBia: 'Bìa', phuDeBia: 'Phụ' });
  let r = m.post(m.khoaThay, 'vietBai', { bai: baiMau(), kenh: ['FB', 'IG'] });
  assert.equal(r.ok, true, r.loi);
  assert.equal(r.data.trangThai, 'CHO_DUYET');
  assert.equal(r.data.baiViet.fb, 'Bài fb');
  assert.equal(r.data.baiViet.ig, 'Bài ig');
  assert.equal(r.data.tieuDeBia, 'Bìa');
  const goi = m.goiRa.find((g) => g.url.includes('anthropic'));
  const body = JSON.parse(goi.opt.payload);
  assert.equal(goi.opt.headers['x-api-key'], 'sk-test');
  assert.equal(goi.opt.headers['anthropic-version'], '2026-10-21');
  assert.equal(body.model, 'claude-opus-5-5');
  assert.equal(body.fallbacks, 'default');
  assert.deepEqual(body.output_config.format.schema.required, ['fb', 'ig', 'tieuDeBia', 'phuDeBia']);
  const chu = JSON.stringify(body.messages);
  assert.ok(!chu.includes('Tuấn') && !chu.includes('0912000111') && !chu.includes('Long Biên'));
  assert.match(chu, /Nội thất có cải tạo thô/);
  // Nhóm TikTok viết sau, giữ bài Facebook
  r = m.post(m.khoaThay, 'vietBai', { id: 'BD-1', kenh: ['TT'] });
  assert.equal(r.data.baiViet.fb, 'Bài fb');
  assert.equal(r.data.baiViet.tt.tieuDe, 'TT tiêu đề');
  assert.equal(r.data.lanViet, 2);
  const chi = m.ss.getSheetByName('ChiAI').rows.slice(1);
  assert.equal(chi.length, 2);
  assert.equal(chi[0][6], 0.12); // Opus 5.5: 10.000 × 4 + 4.000 × 20 USD / 1 triệu
  // Phong thủy thiếu tài liệu: không gọi AI
  const truoc = m.goiRa.length;
  r = m.post(m.khoaThay, 'vietBai', { bai: baiMau({ id: 'BD-PT', loai: 'PHONG_THUY', maCongTrinh: '' }) });
  assert.equal(r.ok, false);
  assert.match(r.loi, /tài liệu/);
  assert.equal(m.goiRa.length, truoc);
  r = m.post(m.khoaThay, 'vietBai', { bai: baiMau({ id: 'BD-PT', loai: 'PHONG_THUY', maCongTrinh: '', nguonTL: 'Giáo trình X, chương 2', trichDan: 'Cửa chính nên...' }), kenh: ['FB'] });
  assert.equal(r.ok, true);
  assert.match(m.goiRa.at(-1).opt.payload, /Giáo trình X, chương 2/);
  // Chưa có khoá API: báo rõ
  delete m.props.ANTHROPIC_API_KEY;
  assert.match(m.post(m.khoaThay, 'vietBai', { id: 'BD-1', kenh: ['FB'] }).loi, /ANTHROPIC_API_KEY/);
  // AI từ chối: báo, không ghi đè bài
  m.props.ANTHROPIC_API_KEY = 'sk-test';
  m.traLoi.fn = () => ({ ma: 200, body: { model: 'claude-sonnet-5-5', stop_reason: 'refusal', usage: {}, content: [] } });
  assert.equal(m.post(m.khoaThay, 'vietBai', { id: 'BD-1', kenh: ['FB'] }).ok, false);
  assert.equal(m.post(m.khoaThay, 'keoVe').data.baiDang.find((b) => b.id === 'BD-1').baiViet.fb, 'Bài fb');
});

test('duyệt bài: chỉ Thầy; sửa nội dung sau duyệt phải duyệt lại; chưa duyệt thì không đăng được', () => {
  const m = khoiDong();
  const khoaDuc = m.post(m.khoaThay, 'capKhoa', { email: 'duc@example.com', ten: 'Đức', vaiTro: 'DUC' }).data.khoa;
  const bai = baiMau({ kenh: ['FB'], baiViet: { fb: 'Nội dung' } });
  m.post(khoaDuc, 'dayLen', { ops: [op({ loai: 'BD', b: bai })] });
  assert.equal(m.post(khoaDuc, 'keoVe').data.baiDang[0].trangThai, 'CHO_DUYET');
  assert.equal(m.post(khoaDuc, 'dangBai', { id: 'BD-1' }).ok, false);
  assert.match(m.post(khoaDuc, 'duyetBai', { id: 'BD-1' }).loi, /Chỉ Thầy/);
  let r = m.post(m.khoaThay, 'duyetBai', { id: 'BD-1' });
  assert.equal(r.data.trangThai, 'DUYET');
  assert.equal(r.data.nguoiDuyet, 'THAY');
  // Đổi giờ đăng: vẫn giữ duyệt; đổi chữ: về chờ duyệt
  m.post(khoaDuc, 'dayLen', { ops: [op({ loai: 'BD', b: { ...bai, gioDang: '08:00' } })] });
  assert.equal(m.post(khoaDuc, 'keoVe').data.baiDang[0].trangThai, 'DUYET');
  m.post(khoaDuc, 'dayLen', { ops: [op({ loai: 'BD', b: { ...bai, gioDang: '08:00', baiViet: { fb: 'Sửa chữ' } } })] });
  const b = m.post(khoaDuc, 'keoVe').data.baiDang[0];
  assert.equal(b.trangThai, 'CHO_DUYET');
  assert.equal(b.nguoiDuyet, '');
  // Instagram cần ảnh; thiếu nội dung kênh thì không duyệt
  assert.match(m.post(m.khoaThay, 'duyetBai', { bai: { ...bai, kenh: ['FB', 'IG'] } }).loi, /ít nhất 1 ảnh/);
  assert.match(m.post(m.khoaThay, 'duyetBai', { bai: { ...bai, kenh: ['FB', 'TT'] } }).loi, /TT/);
});

test('đăng bài: Facebook nhiều ảnh, Instagram dùng ảnh đã lên Facebook, website lưu nháp; kênh lỗi ghi lỗi, bấm lại chỉ đăng kênh thiếu; TikTok đăng tay', () => {
  const m = khoiDong();
  Object.assign(m.props, { FB_PAGE_ID: 'PAGE', FB_PAGE_TOKEN: 'tok', IG_USER_ID: 'IG', WP_URL: 'https://noithatkas.com/', WP_USER: 'thay', WP_APP_PASSWORD: 'abcd efgh' });
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A') })] });
  ['a1', 'a2'].forEach((id) => m.post(m.khoaThay, 'guiAnh', { id, ma: 'BD-1', viec: 'BAI', tenFile: id + '.jpg', base64: 'eA==', loai: 'BAI_DANG' }));
  assert.ok(m.root.con.find((c) => c.ten === 'KAS App – Bài đăng').con.find((c) => c.ten === 'BD-1').files.length === 2);
  const bai = baiMau({ kenh: ['FB', 'IG', 'WEB', 'TT'], dsAnh: ['a1', 'a2'], baiViet: { fb: 'FB chữ', ig: 'IG chữ', tt: { tieuDe: 't', chuThich: 'c', kichBan: 'k' }, web: { tieuDe: 'Tiêu đề web', moTa: 'Mô tả', noiDung: '## Mục\nĐoạn <b>1</b>\n- ý', tuKhoa: [] } } });
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'BD', b: bai })] });
  m.post(m.khoaThay, 'duyetBai', { id: 'BD-1' });
  let anhSo = 0; let wpLoi = true;
  m.traLoi.fn = (url, opt) => {
    if (url.endsWith('/PAGE/photos')) return { ma: 200, body: { id: 'P' + ++anhSo } };
    if (url.endsWith('/PAGE/feed')) return { ma: 200, body: { id: 'PAGE_123' } };
    if (url.includes('fields=images')) return { ma: 200, body: { images: [{ source: 'https://cdn.fb/' + url.split('/')[4].split('?')[0] + '.jpg' }] } };
    if (url.endsWith('/IG/media')) return { ma: 200, body: { id: 'C' + (opt.payload.image_url || 'CAR') } };
    if (url.includes('fields=status_code')) return { ma: 200, body: { status_code: 'FINISHED' } };
    if (url.endsWith('/IG/media_publish')) return { ma: 200, body: { id: 'IGM1' } };
    if (url.includes('fields=permalink')) return { ma: 200, body: { permalink: 'https://instagram.com/p/x' } };
    if (url.includes('/wp-json/wp/v2/media')) return wpLoi ? { ma: 401, body: { message: 'Sai mật khẩu ứng dụng' } } : { ma: 201, body: { id: 77, source_url: 'https://noithatkas.com/a.jpg' } };
    if (url.includes('/wp-json/wp/v2/posts')) return { ma: 201, body: { id: 99, link: 'https://noithatkas.com/?p=99' } };
    return null;
  };
  let r = m.post(m.khoaThay, 'dangBai', { id: 'BD-1' });
  assert.equal(r.ok, true, r.loi);
  const kq = r.data.ketQua;
  assert.equal(kq.FB.id, 'PAGE_123');
  const feed = m.goiRa.find((g) => g.url.endsWith('/PAGE/feed')).opt.payload;
  assert.equal(feed.message, 'FB chữ');
  assert.equal(feed['attached_media[1]'], JSON.stringify({ media_fbid: 'P2' }));
  assert.equal(m.goiRa.filter((g) => g.url.endsWith('/PAGE/photos')).length, 2); // Instagram không tải lại ảnh
  const car = m.goiRa.find((g) => g.url.endsWith('/IG/media') && g.opt.payload.media_type === 'CAROUSEL').opt.payload;
  assert.equal(car.children, 'Chttps://cdn.fb/P1.jpg,Chttps://cdn.fb/P2.jpg');
  assert.equal(car.caption, 'IG chữ');
  assert.equal(kq.IG.id, 'IGM1');
  assert.match(kq.WEB.loi, /Sai mật khẩu/);
  assert.equal(r.data.trangThai, 'DUYET');
  // Bấm lại: chỉ đăng website
  wpLoi = false;
  const truoc = m.goiRa.length;
  r = m.post(m.khoaThay, 'dangBai', { id: 'BD-1' });
  const moi = m.goiRa.slice(truoc).map((g) => g.url);
  assert.ok(moi.every((u) => u.includes('noithatkas.com/wp-json')), moi.join(' '));
  const post = JSON.parse(m.goiRa.find((g) => g.url.endsWith('/wp-json/wp/v2/posts')).opt.payload);
  assert.equal(post.status, 'draft');
  assert.equal(post.featured_media, 77);
  assert.match(post.content, /<h2>Mục<\/h2>/);
  assert.match(post.content, /Đoạn &lt;b&gt;1&lt;\/b&gt;/);
  assert.match(m.goiRa.find((g) => g.url.includes('/wp-json/wp/v2/media')).opt.headers.Authorization, /^Basic /);
  assert.equal(r.data.ketQua.WEB.id, 99);
  assert.equal(r.data.trangThai, 'DUYET'); // còn TikTok đăng tay
  r = m.post(m.khoaThay, 'daDangTay', { id: 'BD-1', kenh: 'TT', link: 'https://tiktok.com/@kas/1' });
  assert.equal(r.data.trangThai, 'DA_DANG');
  // Bài đã đăng: máy gửi bản cũ không sửa được nội dung
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'BD', b: { ...bai, baiViet: { fb: 'đổi' } } })] });
  assert.equal(m.post(m.khoaThay, 'keoVe').data.baiDang[0].baiViet.fb, 'FB chữ');
});

test('Instagram nối bằng IG_TOKEN (không cần Fanpage): gọi graph.instagram.com, tự điền IG_USER_ID, gia hạn mã mỗi 7 ngày', () => {
  const m = khoiDong();
  Object.assign(m.props, { FB_PAGE_ID: 'PAGE', FB_PAGE_TOKEN: 'tok', IG_TOKEN: 'IGtok' });
  ['a1'].forEach((id) => m.post(m.khoaThay, 'guiAnh', { id, ma: 'BD-1', viec: 'BAI', tenFile: id + '.jpg', base64: 'eA==', loai: 'BAI_DANG' }));
  const bai = baiMau({ kenh: ['FB', 'IG'], dsAnh: ['a1'], baiViet: { fb: 'FB chữ', ig: 'IG chữ' } });
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'BD', b: bai })] });
  m.post(m.khoaThay, 'duyetBai', { id: 'BD-1' });
  m.traLoi.fn = (url, opt) => {
    if (url.endsWith('/PAGE/photos')) return { ma: 200, body: { id: 'P1' } };
    if (url.endsWith('/PAGE/feed')) return { ma: 200, body: { id: 'PAGE_1' } };
    if (url.includes('fields=images')) return { ma: 200, body: { images: [{ source: 'https://cdn.fb/P1.jpg' }] } };
    if (url.includes('graph.instagram.com/v26.0/me?fields=user_id')) return { ma: 200, body: { user_id: '1789' } };
    if (url.endsWith('graph.instagram.com/v26.0/1789/media')) return { ma: 200, body: { id: 'C1' } };
    if (url.includes('fields=status_code')) return { ma: 200, body: { status_code: 'FINISHED' } };
    if (url.endsWith('graph.instagram.com/v26.0/1789/media_publish')) return { ma: 200, body: { id: 'IGM9' } };
    if (url.includes('fields=permalink')) return { ma: 200, body: { permalink: 'https://instagram.com/p/y' } };
    if (url.includes('refresh_access_token')) return { ma: 200, body: { access_token: 'IGtok2', expires_in: 5184000 } };
    return null;
  };
  const r = m.post(m.khoaThay, 'dangBai', { id: 'BD-1' });
  assert.equal(r.data.ketQua.IG.id, 'IGM9', JSON.stringify(r.data.ketQua));
  assert.equal(m.props.IG_USER_ID, '1789');
  const media = m.goiRa.find((g) => g.url.endsWith('/1789/media'));
  assert.equal(media.opt.payload.access_token, 'IGtok');
  assert.equal(media.opt.payload.image_url, 'https://cdn.fb/P1.jpg');
  assert.equal(media.opt.payload.caption, 'IG chữ');
  assert.ok(!m.goiRa.some((g) => g.url.includes('graph.facebook.com') && g.url.includes('1789')));
  // Gia hạn: lần đầu chỉ đánh dấu giờ; quá 7 ngày mới gọi Meta; không ghi mã ra nhật ký
  m.ctx.lamMoiMaIG();
  assert.ok(!m.goiRa.some((g) => g.url.includes('refresh_access_token')));
  m.props.IG_TOKEN_GIA_HAN = String(Date.now() - 8 * 864e5);
  m.ctx.lamMoiMaIG();
  assert.equal(m.props.IG_TOKEN, 'IGtok2');
  assert.ok(m.logs.every((l) => !String(l).includes('IGtok')));
});

test('Instagram mã Unified login: gọi graph.facebook.com v26, lấy ID từ assigned_instagram_accounts, không gia hạn', () => {
  const m = khoiDong();
  Object.assign(m.props, { FB_PAGE_ID: 'PAGE', FB_PAGE_TOKEN: 'tok', IG_TOKEN: 'EAAuni' });
  m.post(m.khoaThay, 'guiAnh', { id: 'a1', ma: 'BD-1', viec: 'BAI', tenFile: 'a1.jpg', base64: 'eA==', loai: 'BAI_DANG' });
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'BD', b: baiMau({ kenh: ['IG'], dsAnh: ['a1'], baiViet: { ig: 'IG chữ' } }) })] });
  m.post(m.khoaThay, 'duyetBai', { id: 'BD-1' });
  m.traLoi.fn = (url) => {
    if (url.endsWith('/PAGE/photos')) return { ma: 200, body: { id: 'P1' } };
    if (url.includes('fields=images')) return { ma: 200, body: { images: [{ source: 'https://cdn.fb/P1.jpg' }] } };
    if (url.startsWith('https://graph.facebook.com/v26.0/me/assigned_instagram_accounts')) return { ma: 200, body: { data: [{ id: '1784', username: 'kashouzing' }] } };
    if (url === 'https://graph.facebook.com/v26.0/1784/media') return { ma: 200, body: { id: 'C1' } };
    if (url.includes('fields=status_code')) return { ma: 200, body: { status_code: 'FINISHED' } };
    if (url === 'https://graph.facebook.com/v26.0/1784/media_publish') return { ma: 200, body: { id: 'IGM5' } };
    return null;
  };
  const r = m.post(m.khoaThay, 'dangBai', { id: 'BD-1' });
  assert.equal(r.data.ketQua.IG.id, 'IGM5', JSON.stringify(r.data.ketQua));
  assert.equal(m.props.IG_USER_ID, '1784');
  assert.ok(!m.goiRa.some((g) => g.url.includes('graph.instagram.com')));
  m.props.IG_TOKEN_GIA_HAN = String(Date.now() - 30 * 864e5);
  m.ctx.lamMoiMaIG();
  assert.ok(!m.goiRa.some((g) => g.url.includes('refresh_access_token')));
});

test('hẹn giờ: chỉ đăng bài đã duyệt và đã đến giờ; ảnh chọn bài không lấy chứng từ', () => {
  const m = khoiDong();
  Object.assign(m.props, { FB_PAGE_ID: 'PAGE', FB_PAGE_TOKEN: 'tok' });
  m.traLoi.fn = (url) => (url.endsWith('/PAGE/feed') ? { ma: 200, body: { id: 'PAGE_9' } } : null);
  const qua = '2020-01-01', toi = '2099-01-01';
  m.post(m.khoaThay, 'dayLen', { ops: [
    op({ loai: 'BD', b: baiMau({ id: 'BD-A', kenh: ['FB'], ngayDang: qua, baiViet: { fb: 'a' } }) }),
    op({ loai: 'BD', b: baiMau({ id: 'BD-B', kenh: ['FB'], ngayDang: toi, baiViet: { fb: 'b' } }) }),
    op({ loai: 'BD', b: baiMau({ id: 'BD-C', kenh: ['FB'], ngayDang: qua, baiViet: { fb: 'c' } }) })] });
  m.post(m.khoaThay, 'duyetBai', { id: 'BD-A' });
  m.post(m.khoaThay, 'duyetBai', { id: 'BD-B' });
  m.ctx.dangBaiHenGio();
  const ds = m.post(m.khoaThay, 'keoVe').data.baiDang;
  assert.equal(ds.find((b) => b.id === 'BD-A').trangThai, 'DA_DANG');
  assert.equal(ds.find((b) => b.id === 'BD-B').trangThai, 'DUYET');
  assert.equal(ds.find((b) => b.id === 'BD-C').trangThai, 'CHO_DUYET'); // chưa duyệt: không đăng
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A') })] });
  m.post(m.khoaThay, 'guiAnh', { id: 'h1', ma: 'NT-A', viec: 'XT01', tenFile: 'h1.jpg', base64: 'eA==' });
  m.post(m.khoaThay, 'guiAnh', { id: 'ct1', ma: 'NT-A', viec: 'TT1', tenFile: 'ck.jpg', base64: 'eA==', loai: 'CHUNG_TU' });
  const thu = m.post(m.khoaThay, 'anhThu', { ma: 'NT-A' }).data;
  assert.deepEqual(thu.map((x) => x.id), ['h1']);
  assert.ok(thu[0].thu);
  assert.equal(m.post(m.khoaThay, 'layAnh', { id: 'ct1' }).ok, false);
  assert.equal(m.post(m.khoaThay, 'layAnh', { id: 'h1' }).data.base64, Buffer.from('jpg').toString('base64') === 'anBn' ? m.post(m.khoaThay, 'layAnh', { id: 'h1' }).data.base64 : 'eA==');
});

test('AI mặc định dùng Sonnet 5.5 (Thầy chọn 13/11)', () => {
  const m = khoiDong();
  m.props.ANTHROPIC_API_KEY = 'sk';
  claudeTraLoi(m);
  m.post(m.khoaThay, 'vietBai', { bai: baiMau({ maCongTrinh: '' }), kenh: ['FB'] });
  assert.equal(JSON.parse(m.goiRa.at(-1).opt.payload).model, 'claude-sonnet-5-5');
});

// ---------- Thư viện phong thủy ----------
function thuVienMau(m) {
  let f = m.root;
  for (const t of ['LeonidasProject', '_shared', 'phong-thuy-core', '_private']) f = f.createFolder(t);
  const md = f.createFile({ ten: 'Bat trach.md', bytes: Buffer.from('# Chương 3\nCửa chính nên tránh đối thẳng cầu thang, theo sách mẫu.\n\nĐoạn khác về bếp.'), type: 'text/markdown' });
  const doc = f.createFolder('Giao trinh').createFile({ ten: 'Giáo trình A', bytes: Buffer.from(''), type: 'application/vnd.google-apps.document' });
  m.root.createFile({ ten: 'Ngoai.md', bytes: Buffer.from('x'), type: 'text/markdown' });
  return { md: md.getId(), doc: doc.getId(), ngoai: m.root.files.at(-1).id };
}

test('thư viện phong thủy: liệt kê, đọc trong thư viện; AI chỉ được chép nguyên văn; giám sát không xem được', () => {
  const m = khoiDong();
  const tv = thuVienMau(m);
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  assert.equal(m.post(khoaKha, 'thuVienPT').ok, false);
  const ds = m.post(m.khoaThay, 'thuVienPT').data;
  assert.deepEqual(ds.map((x) => x.ten).sort(), ['Bat trach.md', 'Giáo trình A']);
  assert.equal(ds.find((x) => x.ten === 'Giáo trình A').thuMuc, 'Giao trinh');
  assert.match(m.post(m.khoaThay, 'docTaiLieu', { id: tv.md }).data.chu, /Cửa chính nên tránh/);
  assert.equal(m.post(m.khoaThay, 'docTaiLieu', { id: tv.ngoai }).ok, false);
  m.traLoi.fn = (url) => (url.includes('/export?mimeType=text/plain') ? { ma: 200, body: 'Nội dung giáo trình' } : null);
  assert.equal(m.post(m.khoaThay, 'docTaiLieu', { id: tv.doc }).data.chu, 'Nội dung giáo trình');
  m.props.ANTHROPIC_API_KEY = 'sk';
  m.traLoi.fn = (url) => (url.includes('anthropic') ? { ma: 200, body: { model: 'claude-sonnet-5-5', stop_reason: 'end_turn', usage: {}, content: [{ type: 'text', text: JSON.stringify({ doan: [
    { trich: 'Cửa chính nên  tránh đối thẳng\ncầu thang, theo sách mẫu.', viTri: 'Chương 3', viSao: 'đúng chủ đề' },
    { trich: 'Cửa chính hướng Nam giúp gia chủ giàu có nhanh chóng.', viTri: '', viSao: 'bịa' }] }) }] } } : null);
  const r = m.post(m.khoaThay, 'timDoanPT', { id: tv.md, chuDe: 'cửa chính' }).data;
  assert.equal(r.doan.length, 1);
  assert.equal(r.boQua, 1);
  assert.equal(r.doan[0].viTri, 'Chương 3');
  assert.equal(m.post(m.khoaThay, 'timDoanPT', { id: tv.md, chuDe: '' }).ok, false);
});

// ---------- Gemini, Canva ----------
function baiCoAnh(m, o = {}) {
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct: congTrinhMau('NT-A') })] });
  m.post(m.khoaThay, 'guiAnh', { id: 'h1', ma: 'NT-A', viec: 'XT01', tenFile: 'h1.jpg', base64: 'eA==' });
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'BD', b: baiMau({ kenh: ['FB'], dsAnh: ['h1'], baiViet: { fb: 'a' }, tieuDeBia: 'Nhà xong đúng hẹn', ...o }) })] });
}

test('Gemini làm bìa: cần khoá; gửi ảnh thật + giữ nguyên công trình; thử tỉ lệ khác khi bị từ chối; ghi chi phí; bài đã duyệt về chờ duyệt', () => {
  const m = khoiDong();
  baiCoAnh(m);
  m.post(m.khoaThay, 'duyetBai', { id: 'BD-1' });
  assert.match(m.post(m.khoaThay, 'geminiBia', { id: 'BD-1' }).loi, /GEMINI_API_KEY/);
  m.props.GEMINI_API_KEY = 'g';
  const tl = [];
  m.traLoi.fn = (url, opt) => {
    if (!url.includes('generativelanguage')) return null;
    const b = JSON.parse(opt.payload);
    tl.push(b.response_format.aspect_ratio);
    if (b.response_format.aspect_ratio === '4:5') return { ma: 400, body: { error: { message: 'Unsupported aspect ratio' } } };
    return { ma: 200, body: { steps: [{ type: 'model_output', content: [{ type: 'text', text: 'ok' }, { type: 'image', mime_type: 'image/jpeg', data: 'QUJD' }] }] } };
  };
  const r = m.post(m.khoaThay, 'geminiBia', { id: 'BD-1', kieu: 'CHU' });
  assert.equal(r.ok, true, r.loi);
  assert.deepEqual(tl, ['4:5', '3:4']);
  const body = JSON.parse(m.goiRa.at(-1).opt.payload);
  assert.equal(body.model, 'gemini-3.1-flash-image');
  assert.equal(m.goiRa.at(-1).opt.headers['x-goog-api-key'], 'g');
  assert.equal(body.input[1].type, 'image');
  assert.match(body.input[0].text, /do not add, remove/);
  assert.match(body.input[0].text, /"Nhà xong đúng hẹn"/);
  assert.equal(r.data.bai.anhBia, r.data.anhId);
  assert.equal(r.data.bai.trangThai, 'CHO_DUYET');
  const d = m.post(m.khoaThay, 'keoVe').data;
  assert.equal(d.chiAI.at(-1).usd, 0.067);
  assert.equal(d.anh === undefined || !d.anh.some((a) => a.id === r.data.anhId), true); // ảnh bài đăng không lẫn vào ảnh công trình
  m.traLoi.fn = (url) => (url.includes('generativelanguage') ? { ma: 200, body: { steps: [{ type: 'model_output', content: [{ type: 'text', text: 'Không sửa được ảnh này' }] }] } } : null);
  assert.match(m.post(m.khoaThay, 'geminiBia', { id: 'BD-1' }).loi, /Không sửa được ảnh này/);
});

test('Canva: chỉ Thầy nối; PKCE + state; lưu refresh token mới mỗi lần; đưa ảnh sang Canva, lấy ảnh đã sửa về làm bìa', () => {
  const m = khoiDong();
  baiCoAnh(m);
  const khoaKha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', ten: 'Kha', vaiTro: 'KHA', congTrinh: 'NT-A' }).data.khoa;
  assert.match(m.post(m.khoaThay, 'canvaNoi').loi, /CANVA_CLIENT_ID/);
  Object.assign(m.props, { CANVA_CLIENT_ID: 'cid', CANVA_CLIENT_SECRET: 'sec' });
  assert.equal(m.post(khoaKha, 'canvaNoi').ok, false);
  const u = new URL(m.post(m.khoaThay, 'canvaNoi').data.url);
  assert.equal(u.origin + u.pathname, 'https://www.canva.com/api/oauth/authorize');
  assert.equal(u.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(u.searchParams.get('redirect_uri'), 'https://script.google.com/macros/s/ABC/exec');
  const pk = JSON.parse(m.props.CANVA_PKCE);
  const crypto = createRequire(import.meta.url)('crypto');
  assert.equal(u.searchParams.get('code_challenge'), crypto.createHash('sha256').update(pk.verifier).digest('base64url'));
  let refresh = 0; const form = [];
  m.traLoi.fn = (url, opt) => {
    if (url.endsWith('/oauth/token')) { form.push(opt.payload); return { ma: 200, body: { access_token: 'at' + refresh, refresh_token: 'rt' + ++refresh, expires_in: 14400 } }; }
    if (url.endsWith('/asset-uploads')) return { ma: 200, body: { job: { id: 'J1', status: 'in_progress' } } };
    if (url.endsWith('/asset-uploads/J1')) return { ma: 200, body: { job: { id: 'J1', status: 'success', asset: { id: 'A1' } } } };
    if (url.endsWith('/designs')) return { ma: 200, body: { design: { id: 'D1', urls: { edit_url: 'https://www.canva.com/design/D1/edit' } } } };
    if (url.endsWith('/exports')) return { ma: 200, body: { job: { id: 'E1', status: 'in_progress' } } };
    if (url.endsWith('/exports/E1')) return { ma: 200, body: { job: { id: 'E1', status: 'success', urls: ['https://export-download.canva.com/x.jpg'] } } };
    if (url.startsWith('https://export-download')) return { ma: 200, bytes: 'canva-jpg' };
    return null;
  };
  assert.match(m.get({ code: 'C', state: 'sai' }).html, /hết hạn hoặc không đúng/);
  assert.equal(form.length, 0);
  assert.match(m.get({ code: 'C', state: pk.state }).html, /Đã nối Canva/);
  assert.equal(form[0].grant_type, 'authorization_code');
  assert.equal(form[0].code_verifier, pk.verifier);
  assert.equal(m.props.CANVA_REFRESH, 'rt1');
  assert.equal(m.props.CANVA_PKCE, undefined);
  assert.match(m.get({ code: 'C', state: pk.state }).html, /hết hạn/); // link chỉ dùng 1 lần
  let r = m.post(m.khoaThay, 'canvaMo', { id: 'BD-1' });
  assert.equal(r.ok, true, r.loi);
  assert.equal(r.data.url, 'https://www.canva.com/design/D1/edit');
  const up = m.goiRa.find((g) => g.url.endsWith('/asset-uploads'));
  assert.equal(up.opt.headers.Authorization, 'Bearer at0');
  assert.ok(JSON.parse(up.opt.headers['Asset-Upload-Metadata']).name_base64);
  const tk = JSON.parse(m.goiRa.find((g) => g.url.endsWith('/designs')).opt.payload);
  assert.deepEqual([tk.asset_id, tk.design_type], ['A1', { type: 'custom', width: 1080, height: 1350 }]);
  // Hết hạn access token: dùng refresh token cũ 1 lần, lưu cái mới.
  delete m.cache.CANVA_AT;
  r = m.post(m.khoaThay, 'canvaLay', { id: 'BD-1' });
  assert.equal(r.ok, true, r.loi);
  assert.equal(form[1].grant_type, 'refresh_token');
  assert.equal(form[1].refresh_token, 'rt1');
  assert.equal(m.props.CANVA_REFRESH, 'rt2');
  assert.equal(r.data.bai.anhBia, r.data.anhId);
  assert.equal(Buffer.from(r.data.base64, 'base64').toString(), 'canva-jpg');
  assert.equal(JSON.parse(m.goiRa.find((g) => g.url.endsWith('/exports')).opt.payload).format.type, 'jpg');
  // Máy gửi lên không tự đặt được trường canva.
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'BD', b: { ...r.data.bai, canva: { id: 'GIA' } } })] });
  assert.equal(m.post(m.khoaThay, 'keoVe').data.baiDang[0].canva.id, 'D1');
  assert.equal(m.post(khoaKha, 'canvaMo', { id: 'BD-1' }).ok, false);
});
