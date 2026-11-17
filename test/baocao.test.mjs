import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, capNhatTienDo, lichHienTai } from '../web/js/store.js';
import { addDays } from '../web/js/schedule.js';
import {
  ANH_TOI_THIEU, thauDuKien, luuBaoCao, bcCua, daNop, kiemTraNop, nhacBaoCao, tinZaloBC, chamCong, congDaCham, canChamCong, bangCong, laCongNhat,
  soNgayDenNgay, apBaoCham, deXuatCham, deXuatCho, xuLyDeXuat, xemTruocCham, dauTuan, gomTuan, luuTuan, tuanCua, canGuiTuan, daToiGioTuan, viecNgayMai, tinZaloTuan,
} from '../web/js/baocao.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const lich = { kieu: 'NGHI_CN', nghi: [], daHoi: [] };
function moi() {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich });
  ct.viec.forEach((v, i) => { v.nhaThau = i % 2 ? 'Điện nước Hùng' : 'Thô Nam'; });
  return { db, ct };
}

test('thầu dự kiến hôm nay lấy từ việc đang chạy, gộp theo tên thầu', () => {
  const { ct } = moi();
  const ds = thauDuKien(ct, '2026-11-03');
  assert.ok(ds.length >= 1);
  assert.ok(ds.every((t) => t.viec.every((v) => v.nhaThau === t.ten)));
});

test('phiếu ngày: cần đủ 6 ảnh; nộp giữ giờ nộp đầu, sửa trong ngày không đổi giờ nộp', () => {
  const { db, ct } = moi();
  const du = { thau: [{ ten: 'Thô Nam', lam: 'xây tường WC' }], thieu: '', anhHuong: '', doiKeHoach: 'KHONG' };
  assert.match(kiemTraNop(du, 3)[0], /6 ảnh/);
  assert.deepEqual(kiemTraNop(du, ANH_TOI_THIEU), []);
  assert.match(kiemTraNop({ thau: [], doiKeHoach: 'KHONG' }, 6)[0], /Chưa chọn thầu/);
  assert.match(kiemTraNop({ ...du, doiKeHoach: 'CO', ngayMai: '' }, 6)[0], /đổi gì/);
  const b = luuBaoCao(db, ct, '2026-11-03', { ...du, soAnh: 7 }, 'KHA');
  assert.equal(b.id, 'BC-NT-A-2026-11-03');
  const gio = b.nopLuc;
  luuBaoCao(db, ct, '2026-11-03', { ...du, thieu: 'thiếu gạch', soAnh: 8 }, 'THAY');
  const b2 = bcCua(db, 'NT-A', '2026-11-03');
  assert.equal(db.baoCao.length, 1);
  assert.deepEqual([b2.nopLuc, b2.thieu, b2.nguoi, b2.soAnh], [gio, 'thiếu gạch', 'KHA', 8]);
  assert.equal(db.outbox.filter((o) => o.loai === 'BC').length, 2);
  // Lưu nháp: chưa tính là nộp
  luuBaoCao(db, ct, '2026-11-04', du, 'KHA', false);
  assert.equal(daNop(bcCua(db, 'NT-A', '2026-11-04')), false);
});

test('nhắc nộp: 16h lần 1, 17h lần 2, 17h30 lần 3; đã nộp thì thôi', () => {
  const { db, ct } = moi();
  assert.equal(nhacBaoCao([ct], db, '2026-11-03', 15, 59).lan, 0);
  assert.equal(nhacBaoCao([ct], db, '2026-11-03', 16, 0).lan, 1);
  assert.equal(nhacBaoCao([ct], db, '2026-11-03', 17, 10).lan, 2);
  assert.equal(nhacBaoCao([ct], db, '2026-11-03', 17, 30).lan, 3);
  assert.equal(nhacBaoCao([ct], db, '2026-11-03', 17, 30).ds.length, 1);
  luuBaoCao(db, ct, '2026-11-03', { thau: [{ ten: 'Thô Nam' }], soAnh: 6 }, 'KHA');
  assert.equal(nhacBaoCao([ct], db, '2026-11-03', 17, 30).ds.length, 0);
});

test('chấm công thầu công nhật: lưu trong phiếu ngày, giữ khi nộp phiếu, cộng theo tháng', () => {
  const { db, ct } = moi();
  db.nhaThau = [{ id: 'NT-1', ten: 'Thô Nam', congNhat: true, hoatDong: true }, { id: 'NT-2', ten: 'Điện nước Hùng', hoatDong: true }];
  assert.equal(laCongNhat(db, 'thô nam'), true);
  assert.equal(laCongNhat(db, 'Điện nước Hùng'), false);
  const ngay = '2026-11-03';
  const can = canChamCong(db, [ct], ngay);
  assert.ok(can.length >= 1 && can.every((x) => x.ten === 'Thô Nam' && x.cong === null));
  chamCong(db, ct, ngay, 'Thô Nam', 3, 'KHA');
  assert.equal(congDaCham(db, 'NT-A', ngay, 'Thô Nam'), 3);
  assert.equal(daNop(bcCua(db, 'NT-A', ngay)), false);
  // Nộp phiếu không ghi số công: giữ số đã chấm
  luuBaoCao(db, ct, ngay, { thau: [{ ten: 'Thô Nam', lam: 'xây' }], soAnh: 6 }, 'KHA');
  assert.equal(congDaCham(db, 'NT-A', ngay, 'Thô Nam'), 3);
  chamCong(db, ct, '2026-11-04', 'Thô Nam', 2.5, 'KHA');
  chamCong(db, ct, '2026-11-05', 'Thô Nam', 0, 'KHA');
  const bc = bangCong(db, 'Thô Nam', '2026-11-01', '2026-11-30');
  assert.equal(bc.tong, 5.5);
  assert.equal(bc.dong.length, 3);
});

test('báo chậm chọn ngày: đổi ra số ngày công, bỏ qua Chủ nhật', () => {
  // 2026-11-07 là thứ 7, 08 là CN
  assert.equal(soNgayDenNgay('2026-11-06', '2026-11-09', lich), 2);
  assert.equal(soNgayDenNgay('2026-11-06', '2026-11-06', lich), 0);
});

test('chỉ lùi việc này: việc sau giữ ngày bắt đầu; lùi tự động thì việc sau lùi theo', () => {
  const a = moi();
  const v = a.ct.viec.find((x) => x.diSau.length === 0 && a.ct.viec.some((y) => y.diSau.some((p) => p.id === x.id && p.kieu === 'XS')));
  const sau = a.ct.viec.find((y) => y.diSau.some((p) => p.id === v.id && p.kieu === 'XS'));
  const bd0 = lichHienTai(a.ct).get(sau.id).batDau;
  const xt = xemTruocCham(a.ct, v.id, 3, true);
  apBaoCham(a.db, a.ct, v.id, { soNgay: 3, cach: 'CHI_VIEC', nguyenNhan: 'Vật tư', ghiChu: '' }, 'KHA');
  assert.equal(lichHienTai(a.ct).get(sau.id).batDau, bd0);
  assert.equal(sau.batDauCoDinh, bd0);
  assert.equal(xt.ketThucViec, lichHienTai(a.ct).get(v.id).ketThuc);
  assert.match(a.db.lichSu.at(-1).ghiChu, /việc sau giữ lịch/);
  const b = moi();
  const v2 = b.ct.viec.find((x) => x.id === v.id);
  apBaoCham(b.db, b.ct, v2.id, { soNgay: 3, cach: 'TU_DONG', nguyenNhan: 'Vật tư' }, 'KHA');
  assert.ok(lichHienTai(b.ct).get(sau.id).batDau > bd0);
});

test('văn phòng đề xuất lùi: lịch chưa đổi; giám sát xác nhận mới lùi; không lùi thì hết chờ', () => {
  const { db, ct } = moi();
  const v = ct.viec[0];
  const so0 = v.soNgay;
  const dx = deXuatCham(db, ct, v.id, { soNgay: 2, cach: 'TU_DONG', nguyenNhan: 'Chủ nhà' }, 'THAY');
  assert.equal(v.soNgay, so0);
  assert.equal(deXuatCho(db).length, 1);
  xuLyDeXuat(db, ct, dx, 'DONG_Y', 'KHA');
  assert.equal(v.soNgay, so0 + 2);
  assert.equal(deXuatCho(db).length, 0);
  const dx2 = deXuatCham(db, ct, v.id, { soNgay: 5, cach: 'TU_DONG', nguyenNhan: 'Chủ nhà' }, 'THAY');
  xuLyDeXuat(db, ct, dx2, 'SUA', 'KHA', { soNgay: 1, cach: 'TU_DONG', nguyenNhan: 'Chủ nhà', ghiChu: '' });
  assert.equal(v.soNgay, so0 + 3);
  const dx3 = deXuatCham(db, ct, v.id, { soNgay: 5, cach: 'TU_DONG', nguyenNhan: 'Chủ nhà' }, 'THAY');
  xuLyDeXuat(db, ct, dx3, 'BO', 'KHA');
  assert.equal(v.soNgay, so0 + 3);
  assert.equal(deXuatCho(db).length, 0);
  // Ngày chậm chỉ tính các lần lùi thật (CHAM), không tính đề xuất
  assert.equal(db.lichSu.filter((e) => e.loai === 'CHAM').reduce((s, e) => s + e.moi - e.cu, 0), 3);
});

test('tin Zalo nội bộ gộp tiến độ và điều chỉnh trong ngày', () => {
  const { db, ct } = moi();
  capNhatTienDo(db, ct, ct.viec[0].id, 50, 'KHA', '2026-11-03');
  capNhatTienDo(db, ct, ct.viec[0].id, 100, 'KHA', '2026-11-03');
  const b = luuBaoCao(db, ct, '2026-11-03', { thau: [{ ten: 'Thô Nam', lam: 'xây', cong: 2 }], thieu: 'thiếu cát', doiKeHoach: 'CO', ngayMai: 'nghỉ mưa', soAnh: 6 }, 'KHA');
  const tin = tinZaloBC(ct, b, db.lichSu);
  assert.match(tin, /Thô Nam \(2 công\): xây/);
  assert.match(tin, /0% → xong/);
  assert.match(tin, /thiếu cát/);
  assert.match(tin, /CÓ thay đổi\. nghỉ mưa/);
});

test('ngày mai: lấy ngày làm việc kế tiếp (bỏ Chủ nhật)', () => {
  const { ct } = moi();
  assert.equal(viecNgayMai(ct, '2026-11-07').mai, '2026-11-09');
});

test('tổng hợp tuần: trưa thứ 7, việc xong trong tuần, việc tuần sau, vướng mắc cần chủ nhà; gửi rồi thì hết nhắc', () => {
  const { db, ct } = moi();
  assert.equal(dauTuan('2026-11-07'), '2026-11-02');
  assert.equal(dauTuan('2026-11-02'), '2026-11-02');
  assert.equal(daToiGioTuan('2026-11-07', 11), false);
  assert.equal(daToiGioTuan('2026-11-07', 12), true);
  assert.equal(daToiGioTuan('2026-11-06', 15), false);
  capNhatTienDo(db, ct, ct.viec[0].id, 100, 'KHA', '2026-11-04');
  db.phatSinh = [{ id: 'p', ma: 'PS-1', maCongTrinh: 'NT-A', moTa: 'thêm ổ cắm', trangThai: 'CHO_KHACH' }];
  const nd = gomTuan(db, ct, '2026-11-07');
  assert.deepEqual(nd.xong, [ct.viec[0].hangMuc]);
  assert.ok(nd.tuanSau.every((t) => t.ketThuc >= '2026-11-09' && t.batDau <= '2026-11-15'));
  assert.match(nd.vuongMac, /PS-1: thêm ổ cắm/);
  assert.deepEqual(canGuiTuan(db, [ct], '2026-11-07', 13).map((c) => c.ma), ['NT-A']);
  luuTuan(db, ct, nd, ['a1'], 'THAY', false);
  assert.equal(canGuiTuan(db, [ct], '2026-11-07', 13).length, 1);
  const x = luuTuan(db, ct, nd, ['a1', 'a2'], 'THAY', true);
  assert.equal(x.id, 'BCT-NT-A-2026-11-02');
  assert.ok(tuanCua(db, 'NT-A', '2026-11-02').guiLuc);
  assert.equal(canGuiTuan(db, [ct], '2026-11-07', 13).length, 0);
  assert.match(tinZaloTuan(ct, nd, 'https://x'), /Cần anh\/chị: Phát sinh PS-1/);
  assert.equal(addDays('2026-11-02', 5), '2026-11-07');
});
