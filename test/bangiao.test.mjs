import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, capNhatTienDo } from '../web/js/store.js';
import { taoKhach } from '../web/js/khach.js';
import { taoHopDong, ghiThu } from '../web/js/hopdong.js';
import { baoPhatSinh, baoGia, khachTraLoi } from '../web/js/phatsinh.js';
import { nghiemThu } from '../web/js/nghiemthu.js';
import { ghiKhoan } from '../web/js/thuchi.js';
import {
  BH_MAC_DINH, nhomChinh, taoBienBan, suaBienBan, bgCua, hanBaoHanh, hetBaoHanh, mocHetHan, guiChuNha, khachXacNhan, batDauChamSoc,
  baoLoi, trongHan, goiYGiao, laKhan, suaBH, xongBH, conThuBH, viecBHHomNay, daNhacHetHan, tongKet, thanhLy, tinThanhToanCuoi, GIAM_SAT,
} from '../web/js/bangiao.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const lich = { kieu: 'NGHI_CN', nghi: [], daHoi: [] };
function moi() {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Căn hộ thử', loai: 'NTCT', khoiCong: '2026-01-05', lich });
  ct.viec.forEach((v) => { if (/^Chống thấm/.test(v.nhom)) v.nhaThau = 'Chống thấm Tùng'; });
  return { db, ct };
}

test('biên bản: hạng mục theo kế hoạch (bỏ thiết kế, chuẩn bị), mặc định bảo hành 12 tháng, sửa riêng từng hạng mục', () => {
  const { db, ct } = moi();
  const ds = nhomChinh(ct);
  assert.ok(ds.length > 3);
  assert.ok(ds.every((n) => !/^(Thiết kế|Chuẩn bị)/.test(n) && !/\(/.test(n)));
  const bg = taoBienBan(db, ct, '2026-06-10', 'KHA');
  assert.equal(bg.id, 'BG-NT-A');
  assert.equal(taoBienBan(db, ct, '2026-06-11', 'KHA'), bg); // 1 công trình 1 biên bản
  assert.ok(bg.hangMucBH.every((h) => h.thang === BH_MAC_DINH));
  assert.ok(bg.giaoNhan.length >= 5);
  const ct2 = bg.hangMucBH.find((h) => /^Chống thấm/.test(h.nhom));
  suaBienBan(db, bg, { hangMucBH: bg.hangMucBH.map((h) => (h === ct2 ? { ...h, thang: 60 } : h)) });
  assert.equal(hanBaoHanh(bg, ct2.nhom), '2031-06-10');
  assert.equal(hanBaoHanh(bg, ds.find((n) => n !== ct2.nhom)), '2027-06-10');
  assert.equal(hetBaoHanh(bg), '2031-06-10');
  const moc = mocHetHan(bg);
  assert.deepEqual(moc.map((m) => m.den), ['2027-06-10', '2031-06-10']);
  assert.deepEqual(moc[1].nhom, [ct2.nhom]);
  assert.ok(db.outbox.some((o) => o.loai === 'BG' && o.bg.id === 'BG-NT-A'));
});

test('gửi chủ nhà: chụp tồn tại còn mở vào biên bản; chủ nhà ký giấy hoặc cần trao đổi', () => {
  const { db, ct } = moi();
  const v = ct.viec.find((x) => x.id === 'XT01');
  nghiemThu(db, ct, v.id, { ngay: '2026-06-01', muc: [{ noiDung: 'Độ phẳng', dat: false, ghiChu: 'tường WC lồi' }], soAnh: 1, hanSua: '2026-06-12' }, 'KHA');
  nghiemThu(db, ct, 'BAN_GIAO', { ngay: '2026-06-10', muc: [], tonTaiThem: ['Xước cánh tủ bếp'], soAnh: 1, hanSua: '2026-06-15' }, 'KHA');
  const bg = taoBienBan(db, ct, '2026-06-10', 'KHA');
  guiChuNha(db, ct, bg, '2026-06-10', 'THAY');
  assert.equal(bg.trangThai, 'CHO_KHACH');
  assert.deepEqual(bg.tonTai.map((t) => t.noiDung), ['Độ phẳng: tường WC lồi', 'Xước cánh tủ bếp']);
  khachXacNhan(db, bg, { dongY: false, qua: 'LINK', yKien: 'Sửa xước tủ trước' }, 'CHU_NHA');
  assert.equal(bg.trangThai, 'NHAP');
  guiChuNha(db, ct, bg, '2026-06-12', 'THAY');
  assert.equal(bg.khachYKien, '');
  khachXacNhan(db, bg, { dongY: true, qua: 'GIAY' }, 'THAY');
  assert.equal(bg.trangThai, 'DONG_Y');
});

test('bàn giao xong: hồ sơ khách bắt đầu lịch chăm sóc 1/3/6/12 tháng (chỉ 1 lần)', () => {
  const { db, ct } = moi();
  const kh = taoKhach(db, { ten: 'Anh Nam', sdt: '0912345678', nguon: 'GIOI_THIEU' }, 'THAY', '2026-01-01');
  ct.maKhach = kh.ma;
  const bg = taoBienBan(db, ct, '2026-06-10', 'THAY');
  assert.equal(batDauChamSoc(db, ct, bg, 'THAY', '2026-06-10'), true);
  assert.equal(kh.banGiao, '2026-06-10');
  assert.deepEqual(kh.chamSoc.map((c) => c.han), ['2026-07-10', '2026-09-10', '2026-12-10', '2027-06-10']);
  assert.equal(batDauChamSoc(db, ct, bg, 'THAY', '2026-06-11'), false);
});

test('lỗi bảo hành: khẩn hạn 24 giờ, thường 3 ngày; giao thầu đã làm hạng mục; trong hạn không tính phí, hết hạn mặc định tính phí', () => {
  const { db, ct } = moi();
  const bg = taoBienBan(db, ct, '2026-06-10', 'THAY');
  const nhomCT = bg.hangMucBH.find((h) => /^Chống thấm/.test(h.nhom)).nhom;
  assert.equal(laKhan('WC tầng 2 rò nước xuống trần'), true);
  assert.equal(laKhan('Cánh tủ lệch'), false);
  assert.equal(goiYGiao(ct, nhomCT), 'Chống thấm Tùng');
  assert.equal(goiYGiao(ct, 'Không có'), GIAM_SAT);
  const p1 = baoLoi(db, ct, { moTa: 'Thấm nước chân tường WC', nhom: nhomCT, ngay: '2026-09-01' }, 'THAY');
  assert.deepEqual([p1.ma, p1.khan, p1.han, p1.giaoCho, p1.trongHan, p1.coPhi], ['BH01', true, '2026-09-02', 'Chống thấm Tùng', true, false]);
  const p2 = baoLoi(db, ct, { moTa: 'Cánh tủ bếp lệch', ngay: '2027-07-01' }, 'THAY');
  assert.deepEqual([p2.ma, p2.khan, p2.han, p2.trongHan, p2.coPhi], ['BH02', false, '2027-07-04', false, true]);
  assert.equal(trongHan(bg, '', '2027-06-10'), true);
  suaBH(db, p2, { khan: true });
  assert.equal(p2.han, '2027-07-02');
  // Tính phí trong hạn: tuỳ chọn.
  suaBH(db, p1, { coPhi: true, phi: 1500000 });
  xongBH(db, p1, { ngay: '2026-09-02', ketQua: 'Chống thấm lại cổ ống', soAnh: 2 }, 'KHA');
  assert.equal(conThuBH(db, p1), 1500000);
  ghiKhoan(db, { ngay: '2026-09-03', ma: ct.ma, loai: 'THU', hangMuc: 'Thu bảo hành', thamChieu: p1.id, soTien: 1500000, noiDung: 'BH01' }, 'THAY');
  assert.equal(conThuBH(db, p1), 0);
});

test('hôm nay: phiếu quá hạn lên đầu; sắp hết bảo hành 30 ngày; gọi khách gộp chăm sóc tháng 12; chờ khách; thanh lý', () => {
  const { db, ct } = moi();
  const kh = taoKhach(db, { ten: 'Chị Lan', sdt: '0987654321', nguon: 'GIOI_THIEU' }, 'THAY', '2026-01-01');
  ct.maKhach = kh.ma;
  taoHopDong(db, { dang: 'NT', tenKhach: 'Chị Lan', maKhach: kh.ma, maCongTrinh: ct.ma, ngayKy: '2026-01-02', giaTri: 500e6 }, 'THAY');
  const bg = taoBienBan(db, ct, '2026-06-10', 'THAY');
  batDauChamSoc(db, ct, bg, 'THAY', '2026-06-10');
  guiChuNha(db, ct, bg, '2026-06-10', 'THAY');
  bg.guiLuc = '2026-06-10T03:00:00Z';
  let hn = viecBHHomNay(db, '2026-06-13', true);
  assert.equal(hn.choKhach.length, 1);
  khachXacNhan(db, bg, { dongY: true, qua: 'LINK' }, 'CHU_NHA');
  baoLoi(db, ct, { moTa: 'Ổ cắm bếp lỏng', ngay: '2026-06-20' }, 'THAY');
  baoLoi(db, ct, { moTa: 'Bản lề tủ kêu', ngay: '2026-06-24' }, 'THAY');
  hn = viecBHHomNay(db, '2026-06-24', true);
  assert.equal(hn.choKhach.length, 0);
  assert.equal(hn.thanhLy.length, 1);
  assert.deepEqual(hn.mo.map((p) => p.moTa), ['Ổ cắm bếp lỏng', 'Bản lề tủ kêu']); // quá hạn trước
  assert.equal(viecBHHomNay(db, '2026-06-24', false).sapHet.length, 0); // giám sát không thấy phần văn phòng
  assert.equal(viecBHHomNay(db, '2027-05-10', true).sapHet.length, 0);
  hn = viecBHHomNay(db, '2027-05-12', true);
  assert.equal(hn.sapHet.length, 1);
  assert.equal(hn.sapHet[0].den, '2027-06-10');
  daNhacHetHan(db, ct, bg, '2027-06-10', 'Khách hài lòng', 'THAY', '2027-05-12');
  assert.equal(viecBHHomNay(db, '2027-05-12', true).sapHet.length, 0);
  assert.equal(kh.chamSoc.find((c) => c.thang === 12).xong, '2027-05-12');
});

test('tổng kết: hợp đồng + phát sinh duyệt − đã thu; cảnh báo tồn tại, phát sinh treo; thanh lý chuyển HĐ hoàn thành', () => {
  const { db, ct } = moi();
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Anh Nam', maCongTrinh: ct.ma, ngayKy: '2026-01-02', giaTri: 400e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[0].id, { ngay: '2026-01-03', soTien: 200e6 }, 'THAY');
  const ps1 = baoPhatSinh(db, ct, { moTa: 'Thêm ổ cắm', ngay: '2026-03-01' }, 'THAY', true);
  baoGia(db, ps1, { giaBan: 5e6, chiGoc: 3e6, ngay: '2026-03-02' }, 'THAY');
  khachTraLoi(db, ps1, { dongY: true, qua: 'ZALO', ngay: '2026-03-03' }, 'THAY');
  const ps2 = baoPhatSinh(db, ct, { moTa: 'Đổi gạch', ngay: '2026-03-05' }, 'THAY', true);
  ghiKhoan(db, { ngay: '2026-03-10', ma: ct.ma, loai: 'THU', hangMuc: 'Thu phát sinh', thamChieu: ps1.id, soTien: 2e6 }, 'THAY');
  const v = ct.viec.find((x) => x.id === 'XT01');
  capNhatTienDo(db, ct, v.id, 100, 'KHA', '2026-02-01');
  nghiemThu(db, ct, v.id, { ngay: '2026-02-02', muc: [{ noiDung: 'Độ phẳng', dat: false }], soAnh: 1 }, 'KHA');
  const kq = tongKet(db, ct, '2026-06-10');
  assert.equal(kq.tong.hd, 400e6);
  assert.equal(kq.tong.ps, 5e6);
  assert.equal(kq.tong.phaiThu, 405e6);
  assert.equal(kq.tong.daThu, 202e6);
  assert.equal(kq.tong.conLai, 203e6);
  assert.equal(kq.nghiemThu.tonTai, 1);
  assert.deepEqual(kq.phatSinh.treo.map((p) => p.id), [ps2.id]);
  assert.ok(kq.canhBao.some((c) => /tồn tại/.test(c)));
  assert.ok(kq.canhBao.some((c) => /chưa chốt/.test(c)));
  assert.match(tinThanhToanCuoi(ct, kq, 'MB 123'), /Còn lại: 203\.000\.000 đ[\s\S]*MB 123/);
  const bg = taoBienBan(db, ct, '2026-06-10', 'THAY');
  thanhLy(db, ct, bg, '2026-06-20', 'THAY');
  assert.equal(hd.trangThai, 'XONG');
  assert.equal(bgCua(db, ct.ma).thanhLy, '2026-06-20');
});
