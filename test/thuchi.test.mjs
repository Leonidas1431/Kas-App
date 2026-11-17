import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, capNhatTienDo } from '../web/js/store.js';
import { taoHopDong, ghiThu } from '../web/js/hopdong.js';
import {
  CTY, docTien, ghiKhoan, xoaKhoan, themDotTra, xacNhanKL, trangThaiTra, canXacNhanKL, tongThang, congNoThau, laiGop, goiYMaDot, daTra,
  themTaiKhoan, soDu, congNoKhach, noTheoDoiTuong, dongTien, chiCtyTuan, choKiem, duyetKhoan, dsTraThau,
} from '../web/js/thuchi.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const HN = '2026-11-13';
const moi = () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich: { kieu: 'NGHI_CN', nghi: [], daHoi: [] } });
  db.outbox = [];
  return { db, ct };
};

test('đọc số tiền gõ nhanh: 12tr, 1,5tr, 500k, 12.000.000, 1.2 tỷ', () => {
  assert.equal(docTien('12tr'), 12e6);
  assert.equal(docTien('1,5tr'), 1.5e6);
  assert.equal(docTien('1.5 tr'), 1.5e6);
  assert.equal(docTien('500k'), 5e5);
  assert.equal(docTien('12.000.000'), 12e6);
  assert.equal(docTien('12,000,000đ'), 12e6);
  assert.equal(docTien('1.2 tỷ'), 1.2e9);
  assert.ok(Number.isNaN(docTien('mười triệu')));
});

test('đợt trả thầu: chưa nghiệm thu → giám sát xác nhận → đến hạn → trả đủ', () => {
  const { db, ct } = moi();
  const v = ct.viec[2];
  const t = themDotTra(db, { maCongTrinh: 'NT-A', thau: 'Thầu Tâm', hangMuc: 'Điện nước', dot: 'DN1', soTien: 12e6, dieuKien: 'Đi ống xong', viecMoc: v.id, hanTra: '2026-12-01' }, 'THAY');
  assert.equal(trangThaiTra(db, t, HN).tt, 'CHUA');
  assert.equal(canXacNhanKL(db, HN).length, 0);
  capNhatTienDo(db, ct, v.id, 100, 'KHA', HN);
  assert.equal(canXacNhanKL(db, HN)[0].t, t); // xong việc mốc → nhắc giám sát
  db.outbox = [];
  xacNhanKL(db, t, { ngay: HN, ghiChu: 'đủ' }, 'KHA');
  assert.deepEqual(db.outbox.map((o) => o.loai), ['XAC_NHAN_KL', 'LICH_SU']);
  assert.ok(!JSON.stringify(db.outbox).includes('12000000')); // giám sát gửi lên không có tiền
  assert.equal(canXacNhanKL(db, HN).length, 0);
  assert.deepEqual(congNoThau(db, HN).denHan, 12e6);
  ghiKhoan(db, { ngay: HN, ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi thầu phụ', thamChieu: t.id, doiTuong: 'Thầu Tâm', soTien: 5e6 }, 'THAY');
  assert.deepEqual([trangThaiTra(db, t, HN).tt, trangThaiTra(db, t, HN).con], ['DEN_HAN', 7e6]);
  const e = ghiKhoan(db, { ngay: HN, ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi thầu phụ', thamChieu: t.id, soTien: 7e6 }, 'THAY');
  assert.equal(trangThaiTra(db, t, HN).tt, 'DU');
  xoaKhoan(db, e, 'THAY', 'ghi nhầm');
  assert.equal(daTra(db, t.id), 5e6);
  assert.match(db.lichSu.at(-1).ma, /^TC-/); // nhật ký xoá khoản tiền: mã riêng tư
});

test('quá hạn chưa nghiệm thu; mã đợt gợi ý theo chữ đầu hạng mục', () => {
  const { db } = moi();
  const t = themDotTra(db, { maCongTrinh: 'NT-A', thau: 'X', hangMuc: 'Điện nước', dot: goiYMaDot(db, 'NT-A', 'Điện nước'), soTien: 1e6, hanTra: '2026-11-10' }, 'THAY');
  assert.equal(t.dot, 'DN1');
  assert.equal(goiYMaDot(db, 'NT-A', 'điện nước'), 'DN2');
  assert.equal(goiYMaDot(db, 'NT-A', 'Gỗ'), 'G1');
  assert.equal(trangThaiTra(db, t, HN).tt, 'QUA');
  assert.equal(canXacNhanKL(db, HN).length, 1); // quá hạn trả thì cũng nhắc giám sát
});

test('tổng tháng gồm thu HĐ + thu ngoài HĐ; chi công ty tách riêng; khoản xoá không tính', () => {
  const { db } = moi();
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[0].id, { ngay: '2026-11-02', soTien: 50e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[1].id, { ngay: '2026-10-30', soTien: 1e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-05', ma: '', loai: 'THU', hangMuc: 'Thu dịch vụ phong thủy', soTien: 3e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-06', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', soTien: 10e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-07', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Marketing', soTien: 2e6 }, 'THAY');
  const x = ghiKhoan(db, { ngay: '2026-11-08', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Khác', soTien: 9e6 }, 'THAY');
  xoaKhoan(db, x, 'THAY');
  assert.deepEqual(tongThang(db, '2026-11'), { thu: 53e6, chi: 12e6, chiCty: 2e6, chenh: 41e6 });
});

test('lãi gộp công trình: doanh thu − chi dự kiến, cảnh báo vượt chi và lãi thấp', () => {
  const { db } = moi();
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6, chiDuKien: 85e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[0].id, { ngay: '2026-11-02', soTien: 50e6 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-06', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', soTien: 30e6 }, 'THAY');
  let lg = laiGop(db, 'NT-A', 20);
  assert.equal(lg.doanhThu, 100e6);
  assert.equal(lg.laiDuKien, 15e6);
  assert.equal(lg.pctDuKien, 15);
  assert.equal(lg.laiThucTe, 20e6);
  assert.deepEqual(lg.canhBao, ['Lãi gộp dự kiến dưới 20%']);
  ghiKhoan(db, { ngay: '2026-11-07', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi thầu phụ', soTien: 60e6 }, 'THAY');
  lg = laiGop(db, 'NT-A', 0);
  assert.deepEqual(lg.canhBao, ['Vượt chi dự kiến']);
  assert.equal(laiGop(db, 'NT-B').chiDuKien, 0);
});

test('số dư từng tài khoản: số dư đầu + thu − chi ± chuyển tiền + tiền khách trả HĐ; khoản chưa gắn để riêng', () => {
  const { db } = moi();
  const mb = themTaiKhoan(db, { ten: 'MB công ty', loai: 'CONG_TY', soDuDau: 100e6, ngayDau: '2026-11-01' });
  const tm = themTaiKhoan(db, { ten: 'VCB Thầy', loai: 'TIEN_MAT', soDuDau: 5e6, ngayDau: '2026-11-01', choGiamSat: true });
  assert.equal(db.outbox.at(-1).loai, 'QUY');
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[0].id, { ngay: '2026-11-02', soTien: 50e6, taiKhoan: mb.id }, 'THAY');
  ghiKhoan(db, { ngay: '2026-10-20', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', soTien: 7e6, taiKhoan: mb.id }, 'THAY'); // trước ngày chốt: bỏ qua
  ghiKhoan(db, { ngay: '2026-11-03', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', soTien: 10e6, taiKhoan: mb.id }, 'THAY');
  const ck = ghiKhoan(db, { ngay: '2026-11-04', loai: 'CHUYEN', taiKhoan: mb.id, toiTK: tm.id, soTien: 20e6 }, 'THAY');
  assert.deepEqual([ck.ma, ck.hangMuc], [CTY, 'Chuyển tiền']);
  ghiKhoan(db, { ngay: '2026-11-05', ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi nhân công lẻ', soTien: 2e6, taiKhoan: tm.id }, 'KHA');
  ghiKhoan(db, { ngay: '2026-11-05', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Khác', soTien: 1e6 }, 'THAY');
  const sd = soDu(db);
  assert.deepEqual(sd.ds.map((r) => [r.q.ten, r.soDu]), [['MB công ty', 120e6], ['VCB Thầy', 23e6]]);
  assert.deepEqual([sd.congTy, sd.tienMat, sd.tong, sd.chuaGan, sd.soChuaGan], [120e6, 23e6, 143e6, -1e6, 1]);
  // Chuyển tiền không làm đổi thu chi tháng
  assert.equal(tongThang(db, '2026-11').chi, 13e6);
  // Giám sát ghi: chờ văn phòng kiểm; văn phòng ghi: coi như đã kiểm
  assert.equal(choKiem(db).length, 1);
  duyetKhoan(db, choKiem(db)[0]);
  assert.equal(choKiem(db).length, 0);
});

test('giám sát xoá khoản của mình: không ghi nhật ký tiền (máy chủ chặn)', () => {
  const { db } = moi();
  const e = ghiKhoan(db, { ngay: HN, ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', soTien: 1e6 }, 'KHA');
  db.outbox = [];
  xoaKhoan(db, e, 'KHA');
  assert.deepEqual(db.outbox.map((o) => o.loai), ['TC']);
});

test('nợ nhà cung cấp: đến hạn theo ngày hẹn, không cần nghiệm thu; tách khỏi công nợ thầu', () => {
  const { db } = moi();
  const n = themDotTra(db, { maCongTrinh: 'NT-A', thau: 'Gạch Hùng', hangMuc: 'Gạch ốp lát', dot: 'G1', soTien: 30e6, hanTra: '2026-11-20', loaiNo: 'NCC' }, 'THAY');
  themDotTra(db, { maCongTrinh: 'NT-A', thau: 'Thầu Tâm', hangMuc: 'Điện nước', dot: 'DN1', soTien: 12e6 }, 'THAY');
  assert.equal(trangThaiTra(db, n, HN).tt, 'CHUA_DEN');
  assert.equal(trangThaiTra(db, n, '2026-11-18').tt, 'DEN_HAN');
  assert.equal(trangThaiTra(db, n, '2026-11-21').tt, 'QUA_HAN');
  assert.equal(canXacNhanKL(db, '2026-11-21').length, 0); // nhà cung cấp không nhắc giám sát xác nhận
  assert.deepEqual([congNoThau(db, HN).conPhaiTra, congNoThau(db, HN, 'NCC').conPhaiTra], [12e6, 30e6]);
  assert.equal(congNoThau(db, '2026-11-21', 'NCC').denHan, 30e6);
  assert.equal(dsTraThau(db, 'NT-A', 'NCC').length, 1);
  ghiKhoan(db, { ngay: HN, ma: 'NT-A', loai: 'CHI', hangMuc: 'Chi vật tư', thamChieu: n.id, doiTuong: 'Gạch Hùng', soTien: 10e6 }, 'THAY');
  const g = noTheoDoiTuong(db, '2026-11-21', 'NCC');
  assert.deepEqual(g.map((x) => [x.ten, x.tong, x.tra, x.con, x.quaHan]), [['Gạch Hùng', 30e6, 10e6, 20e6, 20e6]]);
});

test('công nợ khách: quá hạn theo hạn đợt / ngày ký / xong mốc; đợt mốc chưa xong là dự kiến', () => {
  const { db, ct } = moi();
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6 }, 'THAY');
  hd.dot[1].moc = ct.viec[2].id;
  hd.dot[2].han = '2026-11-15';
  let r = congNoKhach(db, HN);
  assert.deepEqual(r.ds.map((x) => [x.d.so, x.tt, x.soNgayQua, x.duKien]), [[1, 'QUA_HAN', 12, false], [3, 'DEN_HAN', 0, false], [2, 'CHUA', 0, true]]);
  assert.equal(r.quaHan, 50e6);
  capNhatTienDo(db, ct, ct.viec[2].id, 100, 'KHA', '2026-11-10');
  ghiThu(db, hd, hd.dot[0].id, { ngay: HN, soTien: 50e6 }, 'THAY');
  r = congNoKhach(db, HN);
  assert.deepEqual(r.ds.map((x) => [x.d.so, x.tt, x.soNgayQua]), [[2, 'QUA_HAN', 3], [3, 'DEN_HAN', 0]]);
});

test('dòng tiền: số dư hiện tại + thu khách − trả thầu/NCC − chi công ty theo tuần; báo tuần âm', () => {
  const { db } = moi();
  themTaiKhoan(db, { ten: 'MB', loai: 'CONG_TY', soDuDau: 20e6, ngayDau: '2026-08-01' });
  // Chi công ty 3 tháng trọn trước (8, 9, 10): 92 ngày × 1tr/ngày ≈ 7tr/tuần
  ghiKhoan(db, { ngay: '2026-09-10', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Văn phòng', soTien: 92e6, taiKhoan: db.taiKhoan[0].id }, 'THAY');
  assert.equal(chiCtyTuan(db, HN), 7e6);
  db.taiKhoan[0].soDuDau = 112e6; // số dư hiện tại 20tr
  const hd = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6 }, 'THAY');
  hd.dot[1].han = '2026-11-25'; hd.dot[2].han = '2027-03-01';
  themDotTra(db, { maCongTrinh: 'NT-A', thau: 'Thầu Tâm', hangMuc: 'Điện nước', dot: 'DN1', soTien: 40e6, hanTra: '2026-11-17' }, 'THAY');
  themDotTra(db, { maCongTrinh: 'NT-A', thau: 'Không hẹn', hangMuc: 'Sơn', dot: 'S1', soTien: 5e6 }, 'THAY');
  const r = dongTien(db, HN, { soTuan: 4 });
  assert.equal(r.soDuDau, 20e6);
  assert.deepEqual(r.tuan.map((w) => [w.tu, w.vao, w.ra, w.cuoi]), [
    ['2026-11-09', 50e6, 0, 63e6], // đợt 1 quá hạn → tuần này
    ['2026-11-16', 0, 40e6, 16e6],
    ['2026-11-23', 30e6, 0, 39e6],
    ['2026-11-30', 0, 0, 32e6],
  ]);
  assert.deepEqual(r.khongNgayRa.map((x) => x.t.thau), ['Không hẹn']);
  assert.equal(r.tuanAm, null);
  assert.ok(dongTien(db, HN, { soTuan: 4, tinhChiCty: false }).tuan.every((w) => w.chiCty === 0));
});
