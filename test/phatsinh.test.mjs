import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh } from '../web/js/store.js';
import { taoHopDong } from '../web/js/hopdong.js';
import { ghiKhoan, laiGop } from '../web/js/thuchi.js';
import { baoPhatSinh, baoGia, khachTraLoi, daLamPS, tongPS, viecPSHomNay, daThuPS, tinBaoGia } from '../web/js/phatsinh.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const HN = '2026-11-13';
const moi = () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich: { kieu: 'NGHI_CN', nghi: [], daHoi: [] } });
  db.outbox = [];
  return { db, ct };
};

test('4 bước: giám sát báo (không gửi giá) → báo giá → khách đồng ý → giám sát thấy được làm', () => {
  const { db, ct } = moi();
  const ps = baoPhatSinh(db, ct, { moTa: 'Thêm 2 ổ cắm bếp', viTri: 'Bếp', ngay: '2026-11-10' }, 'KHA', false);
  assert.equal(ps.ma, 'PS01');
  assert.deepEqual(db.outbox.map((o) => o.loai), ['PS_BAO', 'LICH_SU']);
  assert.equal(db.outbox[0].ps.giaBan, undefined);
  assert.equal(baoPhatSinh(db, ct, { moTa: 'x', ngay: HN }, 'KHA', false).ma, 'PS02');
  // quá 2 ngày chưa báo giá → văn phòng thấy trễ
  assert.equal(viecPSHomNay(db, HN, true).choBaoGia.find((x) => x.p === ps).ngay, 3);
  assert.equal(viecPSHomNay(db, HN, false).duocLam.length, 0);
  baoGia(db, ps, { giaBan: 3.5e6, chiGoc: 2.2e6, ngay: '2026-11-11' }, 'DUC');
  assert.equal(ps.trangThai, 'CHO_KHACH');
  assert.equal(viecPSHomNay(db, HN, true).choKhach[0].p, ps);
  assert.match(tinBaoGia(ps, 'https://app/#chu-nha-x'), /3\.500\.000 đ.*\n.*link.*\n.*Đồng ý PS01/s);
  khachTraLoi(db, ps, { dongY: true, qua: 'ZALO', ngay: HN, bangChung: 'https://drive/x' }, 'THAY');
  assert.deepEqual(viecPSHomNay(db, HN, false).duocLam, [ps]);
  daLamPS(db, ps, HN, 'KHA', false);
  assert.equal(db.outbox.filter((o) => o.loai === 'PS_XONG').length, 1);
  assert.equal(viecPSHomNay(db, HN, false).duocLam.length, 0);
});

test('tiền phát sinh: cộng vào doanh thu và chi dự kiến, thu theo mã PS, cảnh báo vượt ngưỡng', () => {
  const { db, ct } = moi();
  taoHopDong(db, { dang: 'NT', tenKhach: 'Chị A', maCongTrinh: 'NT-A', ngayKy: '2026-11-01', giaTri: 100e6, chiDuKien: 70e6 }, 'THAY');
  const ps = baoPhatSinh(db, ct, { moTa: 'Đổi gạch', ngay: HN }, 'THAY', true);
  baoGia(db, ps, { giaBan: 20e6, chiGoc: 15e6, ngay: HN }, 'THAY');
  assert.equal(tongPS(db, 'NT-A').giaBan, 0); // chưa duyệt chưa tính
  khachTraLoi(db, ps, { dongY: true, ngay: HN }, 'THAY');
  let lg = laiGop(db, 'NT-A', 0, 15);
  assert.equal(lg.doanhThu, 120e6);
  assert.equal(lg.chiDuKien, 85e6);
  assert.deepEqual(lg.canhBao, ['Phát sinh 20% HĐ thi công, vượt ngưỡng 15%']);
  ghiKhoan(db, { ngay: HN, ma: 'NT-A', loai: 'THU', hangMuc: 'Thu phát sinh', thamChieu: ps.id, soTien: 5e6 }, 'THAY');
  assert.equal(daThuPS(db, ps), 5e6);
  assert.equal(tongPS(db, 'NT-A').conThu, 15e6);
  lg = laiGop(db, 'NT-A', 0, 25);
  assert.equal(lg.doanhThu, 120e6); // thu phát sinh không cộng hai lần
  assert.equal(lg.daThu, 5e6);
  assert.deepEqual(lg.canhBao, []);
});
