import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rong } from '../web/js/store.js';
import { taoKhach, doiTrangThai, suaKhach } from '../web/js/khach.js';
import { ghiKhoan, CTY } from '../web/js/thuchi.js';
import { baoCaoNguon, dsNguoiGioiThieu, khoangKy, KENH_MKT, CHUA_GAN, ngayVao } from '../web/js/marketing.js';

test('kênh quảng cáo không gồm nguồn giới thiệu; kỳ báo cáo', () => {
  assert.ok(KENH_MKT.includes('TikTok') && KENH_MKT.includes('Google Maps') && !KENH_MKT.some((k) => /giới thiệu/.test(k)));
  assert.deepEqual(khoangKy('THANG', '2026-11-13'), ['2026-11-01', '2026-11-13']);
  assert.deepEqual(khoangKy('QUY', '2026-02-10'), ['2025-12-01', '2026-02-10']);
  assert.deepEqual(khoangKy('NAM', '2026-11-13'), ['2026-01-01', '2026-11-13']);
});

test('báo cáo nguồn: khách vào trong kỳ, tỉ lệ ký, giá trị HĐ, chi quảng cáo theo kênh', () => {
  const db = rong();
  const fb1 = taoKhach(db, { ten: 'A', nguon: 'Facebook / Zalo' }, 'THAY', '2026-11-02');
  const fb2 = taoKhach(db, { ten: 'B', nguon: 'Facebook / Zalo' }, 'THAY', '2026-11-05');
  taoKhach(db, { ten: 'C', nguon: 'Facebook / Zalo', ngayVao: '2026-10-20' }, 'THAY', '2026-11-05'); // vào tháng trước
  const gt = taoKhach(db, { ten: 'D', nguon: 'Khách cũ giới thiệu', nguoiGioiThieu: 'Chị Xuân', sdtGioiThieu: '0912 000 111' }, 'THAY', '2026-11-06');
  assert.equal(ngayVao(fb1), '2026-11-02');
  doiTrangThai(db, fb1, 'KY', 'THAY', '2026-11-10');
  doiTrangThai(db, fb2, 'MAT', 'THAY', '2026-11-10', { lyDo: 'Giá cao' });
  db.hopDong.push({ ma: 'HD-1', maKhach: gt.ma, giaTri: 500000000, trangThai: 'DANG', phuLuc: [{ giaTri: 20000000 }] });
  db.hopDong.push({ ma: 'HD-2', maKhach: fb1.ma, giaTri: 80000000, trangThai: 'DANG', phuLuc: [] });
  ghiKhoan(db, { ngay: '2026-11-03', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Marketing', doiTuong: 'Facebook / Zalo', soTien: 3000000 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-11-04', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Marketing', doiTuong: 'in tờ rơi', soTien: 500000 }, 'THAY');
  ghiKhoan(db, { ngay: '2026-10-04', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Marketing', doiTuong: 'Facebook / Zalo', soTien: 9000000 }, 'THAY'); // ngoài kỳ
  const bc = baoCaoNguon(db, '2026-11-01', '2026-11-13');
  const fb = bc.ds.find((r) => r.nguon === 'Facebook / Zalo');
  assert.deepEqual([fb.moi, fb.ky, fb.mat, fb.tyLe, fb.giaTri, fb.chi, fb.chiMoiKhach, fb.chiMoiKy], [2, 1, 1, 50, 80000000, 3000000, 1500000, 3000000]);
  assert.equal(bc.ds.find((r) => r.nguon === CHUA_GAN).chi, 500000);
  assert.equal(bc.ds.find((r) => r.nguon === 'Khách cũ giới thiệu').giaTri, 520000000);
  assert.deepEqual([bc.tong.moi, bc.tong.ky, bc.tong.chi], [3, 2, 3500000]);
  assert.deepEqual(bc.lyDoMat, { 'Giá cao': 1 });
  assert.equal(baoCaoNguon(db, '', '').tong.moi, 4); // tất cả
  // Người giới thiệu: gộp theo SĐT dù ghi tên khác nhau; ký mà chưa trả hoa hồng thì nhắc
  taoKhach(db, { ten: 'E', nguon: 'Khách cũ giới thiệu', nguoiGioiThieu: 'chị Xuân (Hà Đông)', sdtGioiThieu: '0912000111' }, 'THAY', '2026-11-07');
  suaKhach(db, gt, { hoaHong: { soTien: 10000000, daTra: false } }, '2026-11-08');
  const ds = dsNguoiGioiThieu(db);
  assert.equal(ds.length, 1);
  assert.deepEqual([ds[0].khach.length, ds[0].ky, ds[0].hoaHong, ds[0].daTra, ds[0].chuaTra.map((k) => k.ma)], [2, 1, 10000000, 0, [gt.ma]]);
  suaKhach(db, gt, { hoaHong: { soTien: 10000000, daTra: true } }, '2026-11-09');
  assert.deepEqual([dsNguoiGioiThieu(db)[0].daTra, dsNguoiGioiThieu(db)[0].chuaTra.length], [10000000, 0]);
});

test('mục tiêu tháng, ngân sách, hoa hồng mặc định 5% thiết kế / 2% thi công', async () => {
  const { caiDatMkt, goiYHoaHong, tienDoThang, MAC_DINH } = await import('../web/js/marketing.js');
  assert.deepEqual(caiDatMkt({}), MAC_DINH);
  assert.equal(caiDatMkt({ hhTK: '7', mktNganSach: '' }).hhTK, 7);
  assert.equal(caiDatMkt({ mktNganSach: '' }).mktNganSach, 30000000);
  const db = rong();
  const k = taoKhach(db, { ten: 'A', nguon: 'Google Ads' }, 'THAY', '2026-11-03');
  taoKhach(db, { ten: 'B', nguon: 'TikTok' }, 'THAY', '2026-11-04');
  taoKhach(db, { ten: 'C', nguon: 'TikTok', ngayVao: '2026-10-28' }, 'THAY', '2026-11-04');
  db.hopDong.push({ ma: 'HD-1', soHD: '261131/MrA-KAS/TK', dang: 'TK', maKhach: k.ma, ngayKy: '2026-11-08', giaTri: 60000000, trangThai: 'DANG', phuLuc: [] });
  db.hopDong.push({ ma: 'HD-2', soHD: '261131/MrA-KAS/NT', dang: 'NT', maKhach: k.ma, ngayKy: '2026-11-10', giaTri: 500000000, trangThai: 'DANG', phuLuc: [{ giaTri: 50000000 }] });
  db.hopDong.push({ ma: 'HD-3', dang: 'XD', maKhach: k.ma, ngayKy: '2026-11-10', giaTri: 900000000, trangThai: 'DUNG', phuLuc: [] }); // HĐ dừng không tính
  const g = goiYHoaHong(db, k);
  assert.equal(g.soTien, 3000000 + 11000000); // 5% × 60tr + 2% × 550tr
  assert.equal(goiYHoaHong(db, k, caiDatMkt({ hhTC: 3 })).soTien, 3000000 + 16500000);
  ghiKhoan(db, { ngay: '2026-11-05', ma: CTY, loai: 'CHI', hangMuc: 'CTY - Marketing', doiTuong: 'Google Ads', soTien: 12000000 }, 'THAY');
  const t = tienDoThang(db, '2026-11-15');
  assert.deepEqual([t.lead, t.ky, t.kyTC, t.tyLe, t.tyLeTC, t.chi, t.chiMoiLead, t.chiMoiKy], [2, 1, 1, 50, 50, 12000000, 6000000, 12000000]);
  assert.deepEqual([t.soNgay, t.chiTheoNhip, t.leadTheoNhip], [30, 15000000, 25]);
  // Người giới thiệu: đã ký, chưa ghi số hoa hồng → dự kiến theo %
  suaKhach(db, k, { nguoiGioiThieu: 'Anh Tú', sdtGioiThieu: '0900' }, '2026-11-15');
  assert.equal(dsNguoiGioiThieu(db)[0].duKien, 14000000);
});
