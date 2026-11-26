import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rong, datCaiDat } from '../web/js/store.js';
import { taoKhach, themBaoGia } from '../web/js/khach.js';
import { bangGia, bangGiaPT, donGiaGoiY, tinhBaoGia, phamViTuBaoGia, viecBaoGiaHomNay, docSoTien, ghiChuThanhToan, hetHanBG } from '../web/js/baogia.js';

const HN = '2026-11-21';

test('đơn giá theo bảng giá KAS 2026, Thầy sửa được trong cài đặt', () => {
  const db = rong();
  assert.equal(donGiaGoiY(db, 'NP', 'HD', 'KT'), 300000);
  assert.equal(donGiaGoiY(db, 'NP', 'CD', 'NT'), 350000);
  assert.equal(donGiaGoiY(db, 'CC', 'HD', 'KT'), null); // chung cư không có kiến trúc
  assert.equal(donGiaGoiY(db, 'BT', 'CD', 'KT'), 350000); // Thầy chốt 21/11
  datCaiDat(db, 'bangGiaTK', JSON.stringify({ BT: { CD: { KT: 500000 } } }));
  assert.equal(bangGia(db).BT.CD.KT, 500000);
  datCaiDat(db, 'bangGiaPT', JSON.stringify({ TRACH_NHAT: [600000, 450000] }));
  assert.deepEqual(bangGiaPT(db).TRACH_NHAT.gia, [600000, 450000]);
  assert.deepEqual(bangGiaPT(db).KICH_HOAT.gia, [2000000, 1600000]);
  assert.equal(bangGia(db).BT.HD.KT, 400000);
});

test('tính theo m² từng phần, giảm giá chia theo tỷ lệ, cảnh báo dưới 250k/m²', () => {
  const ct = {
    phan: [
      { ma: 'KT', donGia: 400000, dong: [{ ten: 'Tầng 1', dt: 100 }, { ten: 'Tầng 2', dt: 100 }] },
      { ma: 'NT', donGia: 350000, dong: [{ ten: 'Tổng', dt: 150 }] },
    ],
    giam: { kieu: 'PT', giaTri: 10 },
  };
  const kq = tinhBaoGia(ct);
  assert.equal(kq.tongTruoc, 80e6 + 52.5e6);
  assert.equal(kq.giam, 13.25e6);
  assert.equal(kq.tong, 119.25e6);
  assert.equal(kq.giaTriKT, 72e6);
  assert.equal(kq.phan.reduce((s, p) => s + p.sauGiam, 0), kq.tong);
  assert.deepEqual(kq.canhBao, []);
  assert.equal(phamViTuBaoGia(kq), 'KTNT');
  const re = tinhBaoGia({ phan: [{ ma: 'NT', donGia: 280000, dong: [{ dt: 80 }] }], giam: { kieu: 'TIEN', giaTri: 4e6 } });
  assert.equal(re.tong, 18.4e6);
  assert.equal(re.canhBao.length, 1); // 230k/m² sau giảm
  // Phong thủy: mỗi dòng 1 giá, không áp mức tối thiểu m²
  const pt = tinhBaoGia({ phan: [{ ma: 'PT', dong: [{ ten: 'Trạch nhật', dt: 2, donGia: 500000 }, { ten: 'Thiết kế phong thủy', dt: 120, donGia: 30000 }] }] });
  assert.equal(pt.tong, 4.6e6);
  assert.deepEqual(pt.canhBao, []);
  assert.equal(pt.giaTriKT, 0);
  // Phần không còn dùng (cảnh quan cũ) bị bỏ qua
  assert.equal(tinhBaoGia({ phan: [{ ma: 'CQ', donGia: 120000, dong: [{ dt: 50 }] }] }).tong, 0);
});

test('báo giá hết hiệu lực sau 30 ngày, nhắc khi còn ≤3 ngày', () => {
  const db = rong();
  const kh = taoKhach(db, { ten: 'Anh Nam', sdt: '0901234567', nguon: 'Giới thiệu' }, 'THAY', '2026-10-20');
  const bg = themBaoGia(db, kh, { giaTri: 90e6 }, 'DUC', '2026-10-20');
  assert.equal(hetHanBG(bg), '2026-11-19');
  assert.equal(viecBaoGiaHomNay(db, '2026-11-10').length, 0);
  const [x] = viecBaoGiaHomNay(db, HN);
  assert.equal(x.con, -2);
  kh.baoGia[0].khachChot = true;
  assert.equal(viecBaoGiaHomNay(db, HN).length, 0);
});

test('đọc số tiền bằng chữ, ghi chú thanh toán theo giá trị', () => {
  assert.equal(docSoTien(90e6), 'Chín mươi triệu đồng chẵn');
  assert.equal(docSoTien(229e6), 'Hai trăm hai mươi chín triệu đồng chẵn');
  assert.equal(docSoTien(105e6), 'Một trăm lẻ năm triệu đồng chẵn');
  assert.equal(docSoTien(2005000000), 'Hai tỷ không trăm lẻ năm triệu đồng chẵn');
  assert.equal(docSoTien(21500), 'Hai mươi mốt nghìn năm trăm đồng');
  assert.match(ghiChuThanhToan(90e6), /70%/);
  assert.match(ghiChuThanhToan(120e6), /50%.*30%.*20%/);
});
