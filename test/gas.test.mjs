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
