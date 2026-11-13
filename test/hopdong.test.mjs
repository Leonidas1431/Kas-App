import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, capNhatTienDo } from '../web/js/store.js';
import {
  goiYTenHD, soHopDong, dotMacDinh, taoHopDong, tinhDot, ghiThu, dongDot, themPhuLuc, phiSua, hdThietKeDuocTru, apKhauTru,
  viecHopDongHomNay, doiTrangThaiHD, congTrinhDaXong, suaDot, tongHopTien,
} from '../web/js/hopdong.js';
import { guiPhuongAn, phanHoi, vuotSoLan, quyetPhi, viecThietKeHomNay, taoBuoiGSTG, xongBuoiGSTG, ngayGS } from '../web/js/thietke.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const HN = '2026-11-13';
const lich = { kieu: 'NGHI_CN', nghi: [], daHoi: [] };

test('tên trong số HĐ có Mr/Mrs, số HĐ theo mẫu YYMM31/TÊN-KAS/dạng', () => {
  assert.equal(goiYTenHD('Anh Nam Cầu Giấy'), 'MrNam');
  assert.equal(goiYTenHD('Chị Lan Mỹ Đình'), 'MrsLan');
  assert.equal(goiYTenHD('Mẫu: Cô Hoa'), 'MrsHoa');
  assert.equal(goiYTenHD('Đức'), 'MrDuc');
  assert.equal(soHopDong('2026-11-13', 'MrNam', 'TK'), '261131/MrNam-KAS/TK');
});

test('đợt thu mặc định: TK <100tr 70/30, ≥100tr 50/30/20, thi công 50/30/20', () => {
  assert.deepEqual(dotMacDinh('TK', 80e6).map((d) => d[0]), [70, 30]);
  assert.deepEqual(dotMacDinh('TK', 100e6).map((d) => d[0]), [50, 30, 20]);
  assert.deepEqual(dotMacDinh('XD', 2e9).map((d) => d[0]), [50, 30, 20]);
});

test('thu thiếu rồi đóng đợt: phần thiếu sang đợt sau; đủ tiền tự đóng', () => {
  const db = rong();
  const hd = taoHopDong(db, { dang: 'TK', tenKhach: 'Anh Nam', ngayKy: HN, giaTri: 120e6 }, 'THAY');
  assert.equal(hd.soHD, '261131/MrNam-KAS/TK');
  let t = tinhDot(hd);
  assert.deepEqual(t.dot.map((d) => d.phaiThu), [60e6, 36e6, 24e6]);
  assert.equal(ghiThu(db, hd, hd.dot[0].id, { ngay: HN, soTien: 50e6 }, 'THAY'), false);
  dongDot(db, hd, hd.dot[0].id, HN, 'THAY');
  t = tinhDot(hd);
  assert.deepEqual(t.dot.map((d) => d.phaiThu), [60e6, 46e6, 24e6]); // thiếu 10tr dồn sang đợt 2
  assert.equal(ghiThu(db, hd, hd.dot[1].id, { ngay: HN, soTien: 46e6 }, 'THAY'), true);
  assert.equal(tinhDot(hd).daThu, 96e6);
  assert.ok(db.outbox.some((o) => o.loai === 'HD'));
  assert.ok(db.lichSu.every((e) => e.ma === hd.ma));
});

test('phụ lục cộng vào các đợt chưa thu; phí sửa 5% không tính trên phí sửa trước', () => {
  const db = rong();
  const hd = taoHopDong(db, { dang: 'TK', tenKhach: 'Chị Lan', ngayKy: HN, giaTri: 80e6 }, 'THAY');
  ghiThu(db, hd, hd.dot[0].id, { ngay: HN, soTien: 56e6 }, 'THAY'); // đủ 70% → đóng
  themPhuLuc(db, hd, { ngay: HN, noiDung: 'Thêm tầng tum', giaTri: 10e6 }, 'THAY');
  assert.deepEqual(tinhDot(hd).dot.map((d) => d.phaiThu), [56e6, 34e6]);
  assert.equal(phiSua(hd), 4.5e6);
  themPhuLuc(db, hd, { ngay: HN, noiDung: 'Phí sửa lần 3', giaTri: phiSua(hd), loai: 'PHI_SUA' }, 'THAY');
  assert.equal(phiSua(hd), 4.5e6);
});

test('khấu trừ 50% phần thiết kế tương ứng vào đợt cuối HĐ thi công: XD trừ phần KT, NT trừ phần NT', () => {
  const db = rong();
  const tk = taoHopDong(db, { dang: 'TK', tenKhach: 'Anh Nam', maKhach: 'KH-2611-NAM', ngayKy: '2026-10-01', giaTri: 100e6, phamVi: 'KTNT', giaTriKT: 60e6, hanKhauTru: '2026-12-01' }, 'THAY');
  assert.equal(tk.khauTru.tyLe, 50);
  assert.deepEqual(viecHopDongHomNay(db, HN).khauTru.map((x) => x.phan), [['KT', 'NT']]);
  const xd = taoHopDong(db, { dang: 'XD', tenKhach: 'Anh Nam', maKhach: 'KH-2611-NAM', ngayKy: HN, giaTri: 2e9 }, 'THAY');
  const u1 = hdThietKeDuocTru(db, xd);
  assert.equal(u1.hd, tk);
  assert.deepEqual(u1.phan, ['KT']);
  assert.equal(u1.soTien, 30e6);
  apKhauTru(db, xd, u1, 'THAY');
  assert.deepEqual(tinhDot(xd).dot.map((d) => d.phaiThu), [1e9, 6e8, 4e8 - 30e6]);
  assert.deepEqual(viecHopDongHomNay(db, HN).khauTru.map((x) => x.phan), [['NT']]); // còn chờ phần nội thất
  const nt = taoHopDong(db, { dang: 'NT', maKhach: 'KH-2611-NAM', ngayKy: HN, giaTri: 5e8 }, 'THAY');
  const u2 = hdThietKeDuocTru(db, nt);
  assert.deepEqual([u2.phan, u2.soTien], [['NT'], 20e6]);
  apKhauTru(db, nt, u2, 'THAY');
  assert.equal(viecHopDongHomNay(db, HN).khauTru.length, 0);
  assert.equal(hdThietKeDuocTru(db, taoHopDong(db, { dang: 'NT', maKhach: 'KH-2611-NAM', ngayKy: HN, giaTri: 1e8 }, 'THAY')), null); // mỗi phần trừ 1 lần
  // Quá hạn khấu trừ thì không trừ; HĐ thiết kế chỉ nội thất không trừ cho HĐ xây dựng
  const tk2 = taoHopDong(db, { dang: 'TK', maKhach: 'KH-B', ngayKy: '2026-01-01', giaTri: 50e6, phamVi: 'NT', hanKhauTru: '2026-06-01' }, 'THAY');
  assert.equal(hdThietKeDuocTru(db, { dang: 'NT', maKhach: 'KH-B', ngayKy: HN }), null);
  tk2.khauTru.han = '';
  assert.equal(hdThietKeDuocTru(db, { dang: 'XD', maKhach: 'KH-B', ngayKy: HN }), null);
  assert.equal(hdThietKeDuocTru(db, { dang: 'NT', maKhach: 'KH-B', ngayKy: HN }).soTien, 25e6);
});

test('nhắc thu: đợt 1 sau ký, đợt gắn mốc khi mốc xong; HĐ dừng nhắc tới khi hoàn thành', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'TK-NAM-2611', ten: 'Nhà anh Nam', loai: 'TK', khoiCong: '2026-11-02', lich });
  const hd = taoHopDong(db, { dang: 'TK', maCongTrinh: ct.ma, tenKhach: 'Anh Nam', ngayKy: HN, giaTri: 120e6 }, 'THAY');
  suaDot(db, hd, hd.dot[1].id, { moc: 'TK03' });
  let v = viecHopDongHomNay(db, HN);
  assert.deepEqual(v.thu.map((x) => x.d.so), [1]);
  ghiThu(db, hd, hd.dot[0].id, { ngay: HN, soTien: 60e6 }, 'THAY');
  capNhatTienDo(db, ct, 'TK03', 100, 'DUC', HN);
  v = viecHopDongHomNay(db, HN);
  assert.deepEqual(v.thu.map((x) => [x.d.so, x.lyDo]), [[2, 'Xong mốc: Diễn họa 3D']]);
  doiTrangThaiHD(db, hd, 'DUNG', { lyDo: 'Khách dừng dự án', ngay: HN }, 'THAY');
  v = viecHopDongHomNay(db, HN);
  assert.equal(v.thu.length, 0);
  assert.equal(v.dung.length, 1);
  assert.equal(congTrinhDaXong(db, ct.ma), false);
  doiTrangThaiHD(db, hd, 'XONG', { ngay: HN }, 'THAY');
  assert.equal(congTrinhDaXong(db, ct.ma), true);
  assert.equal(viecHopDongHomNay(db, HN).dung.length, 0);
  assert.equal(tongHopTien(db).daThu, 60e6);
});

test('phương án: đếm lần sửa, vượt HĐ thì chọn thu phí 5% (thành phụ lục), nhắc khách chậm phản hồi', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'TK-LAN-2611', ten: 'Căn hộ chị Lan', loai: 'TK', khoiCong: '2026-11-02', lich });
  const hd = taoHopDong(db, { dang: 'TK', maCongTrinh: ct.ma, tenKhach: 'Chị Lan', ngayKy: '2026-11-01', giaTri: 80e6 }, 'THAY');
  // Hạng mục khác 3D không tính vào số lần sửa HĐ
  let mb = guiPhuongAn(db, ct, { hangMuc: 'Mặt bằng công năng' }, 'DUC', '2026-11-03');
  for (let i = 0; i < 3; i++) { phanHoi(db, ct, mb, { ketQua: 'SUA', ngay: '2026-11-04' }, 'THAY'); assert.equal(vuotSoLan(db, mb), false); mb = guiPhuongAn(db, ct, { hangMuc: 'Mặt bằng công năng' }, 'DUC', '2026-11-04'); }
  phanHoi(db, ct, mb, { ketQua: 'DUYET', ngay: '2026-11-04' }, 'THAY');
  let pa = guiPhuongAn(db, ct, { hangMuc: 'Phương án 3D', viec: 'TK03' }, 'DUC', '2026-11-05');
  assert.equal(pa.lan, 0);
  assert.deepEqual(viecThietKeHomNay(db, '2026-11-07').choLau, []);
  assert.deepEqual(viecThietKeHomNay(db, '2026-11-08').choLau.map((p) => p.id), [pa.id]);
  assert.equal(phanHoi(db, ct, pa, { ketQua: 'SUA', yKien: 'Đổi màu tủ', qua: 'ZALO', ngay: '2026-11-09' }, 'THAY'), 4);
  assert.deepEqual(viecThietKeHomNay(db, HN).canSua.map((p) => p.id), [pa.id]);
  for (let i = 1; i <= 2; i++) {
    assert.equal(vuotSoLan(db, pa), false);
    pa = guiPhuongAn(db, ct, { hangMuc: 'Phương án 3D' }, 'DUC', HN);
    assert.equal(pa.lan, i);
    phanHoi(db, ct, pa, { ketQua: 'SUA', ngay: HN }, 'THAY');
  }
  assert.equal(vuotSoLan(db, pa), true); // khách muốn sửa lần 3, HĐ cho 2 lần
  assert.deepEqual(viecThietKeHomNay(db, HN).quyetPhi.map((p) => p.id), [pa.id]);
  quyetPhi(db, ct, pa, true, 'THAY', HN);
  assert.equal(hd.phuLuc.length, 1);
  assert.equal(hd.phuLuc[0].giaTri, 4e6);
  assert.equal(viecThietKeHomNay(db, HN).quyetPhi.length, 0);
});

test('GSTG: lấy buổi từ mốc trong kế hoạch, giám sát thấy buổi sắp tới', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'XD-HUNG-2611', ten: 'Nhà anh Hùng', loai: 'XM', khoiCong: '2026-11-02', lich });
  const ds = taoBuoiGSTG(db, ct, 6);
  assert.equal(ds.length, 6);
  assert.ok(ds[0].viec && ds[0].ten.length);
  assert.equal(ds[4].viec, "NT05");
  assert.equal(ds[5].viec, "");
  const ngay1 = ngayGS(ct, ds[0]);
  assert.equal(viecThietKeHomNay(db, ngay1, true).gstg[0].gs.id, ds[0].id);
  xongBuoiGSTG(db, ct, ds[0], { ngay: ngay1 }, 'DUC');
  assert.equal(viecThietKeHomNay(db, ngay1, true).gstg.length, 0);
});
