import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, capNhatTienDo, baoCham, lichHienTai } from '../web/js/store.js';
import { themThau, suaThau, viecCuaThau, danhGia, tongHopThau, canDanhGia, thieuAnh, ghiDaChupAnh, congTrinhCanAnh, timThauTheoTen } from '../web/js/nhathau.js';
import { dsNhaThau } from '../web/js/kehoach.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const lich = { kieu: 'NGHI_CN', nghi: [], daHoi: [] };

test('nhà thầu: gắn việc theo tên, đổi tên thì đổi trong kế hoạch, ngày chậm do thầu, điểm trung bình, nhắc đánh giá', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich });
  const dn = ct.viec.filter((v) => v.nhom.startsWith('Điện nước'));
  dn.forEach((v) => { v.nhaThau = 'Điện nước Tâm '; });
  const t = themThau(db, { ten: 'điện nước tâm', linhVuc: 'Điện nước', sdt: '0912000111' });
  assert.equal(timThauTheoTen(db, 'ĐIỆN NƯỚC TÂM'), t);
  assert.ok(dsNhaThau(db).includes('điện nước tâm'));
  assert.equal(viecCuaThau(db, t).length, dn.length); // không phân biệt hoa thường, khoảng trắng
  suaThau(db, t, { ten: 'Đội điện nước Tâm' });
  assert.ok(dn.every((v) => v.nhaThau === 'Đội điện nước Tâm'));
  assert.ok(db.outbox.some((o) => o.loai === 'VIEC' && o.viec.nhaThau === 'Đội điện nước Tâm'));
  // Chỉ báo chậm "Thầu phụ" trên việc của thầu mới tính
  baoCham(db, ct, dn[0].id, { soNgay: 2, nguyenNhan: 'Thầu phụ' }, 'KHA');
  baoCham(db, ct, dn[0].id, { soNgay: 3, nguyenNhan: 'Chủ nhà' }, 'KHA');
  baoCham(db, ct, ct.viec[2].id, { soNgay: 4, nguyenNhan: 'Thầu phụ' }, 'KHA');
  assert.equal(tongHopThau(db, t).ngayCham, 2);
  // Chưa xong hết việc thì chưa nhắc đánh giá
  assert.equal(canDanhGia(db, 'THAY').length, 0);
  dn.forEach((v) => capNhatTienDo(db, ct, v.id, 100, 'KHA', '2026-12-01'));
  assert.deepEqual(canDanhGia(db, 'THAY').map((x) => x.ma), ['NT-A']);
  danhGia(db, t, { maCongTrinh: 'NT-A', ngay: '2026-12-02', chatLuong: 4, tienDo: 2, phoiHop: 5 }, 'THAY');
  danhGia(db, t, { maCongTrinh: 'NT-A', ngay: '2026-12-02', chatLuong: 5, tienDo: 3, phoiHop: 4 }, 'KHA');
  // Chấm lại thì sửa phiếu cũ, không thêm phiếu
  danhGia(db, t, { maCongTrinh: 'NT-A', ngay: '2026-12-03', chatLuong: 4, tienDo: 3, phoiHop: 5 }, 'THAY');
  const th = tongHopThau(db, t);
  assert.equal(th.soDanhGia, 2);
  assert.deepEqual(th.diem, { chatLuong: 4.5, tienDo: 3, phoiHop: 4.5 });
  assert.equal(th.chung, 4);
  assert.equal(canDanhGia(db, 'THAY').length, 0);
  assert.equal(canDanhGia(db, 'DUC').length, 1); // mỗi người 1 phiếu
});

test('nhắc ảnh 16h: chỉ sau 16h, chỉ ngày làm, công trình đang thi công chưa có ảnh hôm nay', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich });
  const ngay = lichHienTai(ct).get(ct.viec.find((v) => v.nhom.startsWith('Chuẩn bị')).id).batDau; // việc thi công đầu tiên đang chạy
  assert.equal(congTrinhCanAnh(db, ngay).length, 1);
  assert.equal(thieuAnh(db, ngay, 15).length, 0);
  assert.equal(thieuAnh(db, ngay, 16).length, 1);
  // Chưa khởi công, Chủ nhật, công trình thiết kế: không nhắc
  assert.equal(thieuAnh(db, '2026-10-30', 17).length, 0);
  assert.equal(thieuAnh(db, '2026-11-08', 17).length, 0);
  // Ảnh trên máy chủ hôm nay, hoặc vừa chụp trên máy này: hết nhắc
  db.anh = [{ ma: 'NT-A', ngay, so: 3 }];
  assert.equal(thieuAnh(db, ngay, 17).length, 0);
  db.anh = [];
  ghiDaChupAnh(db, 'NT-A', ngay);
  assert.equal(thieuAnh(db, ngay, 17).length, 0);
  assert.equal(thieuAnh(db, ngay, 17, () => true).length, 0); // công trình đã xong
});
