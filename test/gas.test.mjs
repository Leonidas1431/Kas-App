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
  const kh = { ma: 'KH-2611-XUAN', ten: 'Chị Xuân', trangThai: 'KHAO_SAT', baoGia: [], chamSoc: [] };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'KHACH', khach: kh })] });
  assert.equal(m.post(m.khoaThay, 'guiAnh', { id: 'k1', ma: 'KH-2611-XUAN', viec: 'KS', tenFile: 'KH-2611-XUAN_20261113_0900_KS_01.jpg', base64: 'eA==' }).ok, true);
  const goc = m.root.con.find((c) => c.ten === 'KAS App – Khách').con.find((c) => c.ten === 'KH-2611-XUAN');
  assert.equal(goc.con.find((c) => c.ten === 'Ảnh khảo sát').files.length, 1);
  const ct = { ...congTrinhMau('NT-2611-XUAN'), maKhach: 'KH-2611-XUAN' };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'TAO_CT', ct })] });
  m.post(m.khoaThay, 'guiAnh', { id: 'k2', ma: 'NT-2611-XUAN', viec: 'XT01', tenFile: 'a.jpg', base64: 'eA==' });
  assert.ok(goc.con.find((c) => c.ten === 'Ảnh tiến độ'));
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
