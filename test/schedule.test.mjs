import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { sucLam, ngayKetThuc, congNgayLam, xepLich, leCanHoi, taoTuThuVien } from '../web/js/schedule.js';

const CN = { kieu: 'NGHI_CN' };
// 2026-11-02 là thứ Hai, 2026-11-07 thứ Bảy, 2026-11-08 Chủ nhật.

test('sức làm theo từng lịch', () => {
  assert.equal(sucLam('2026-11-08', CN), 0);
  assert.equal(sucLam('2026-11-07', CN), 1);
  assert.equal(sucLam('2026-11-07', { kieu: 'NGHI_T7_CN' }), 0);
  assert.equal(sucLam('2026-11-07', { kieu: 'NGHI_CHIEU_T7_CN' }), 0.5);
  assert.equal(sucLam('2026-11-08', { kieu: 'LAM_XUYEN' }), 1);
  assert.equal(sucLam('2026-11-03', { kieu: 'LAM_XUYEN', nghi: ['2026-11-03'] }), 0);
});

test('ngày kết thúc bỏ qua Chủ nhật', () => {
  assert.equal(ngayKetThuc('2026-11-02', 1, CN), '2026-11-02');
  assert.equal(ngayKetThuc('2026-11-02', 6, CN), '2026-11-07');
  assert.equal(ngayKetThuc('2026-11-02', 7, CN), '2026-11-09');
  assert.equal(ngayKetThuc('2026-11-08', 1, CN), '2026-11-09'); // bắt đầu CN → dời sang T2
});

test('nghỉ chiều thứ Bảy tính nửa ngày', () => {
  const L = { kieu: 'NGHI_CHIEU_T7_CN' };
  assert.equal(ngayKetThuc('2026-11-02', 5.5, L), '2026-11-07');
  assert.equal(ngayKetThuc('2026-11-02', 6, L), '2026-11-09');
});

test('cộng ngày làm việc', () => {
  assert.equal(congNgayLam('2026-11-06', 1, CN), '2026-11-07');
  assert.equal(congNgayLam('2026-11-07', 1, CN), '2026-11-09');
});

test('xong mới làm, gối đầu, việc thực tế đẩy lịch', () => {
  const viec = [
    { id: 'A', soNgay: 3, diSau: [] },
    { id: 'B', soNgay: 2, diSau: [{ id: 'A', kieu: 'XS', goi: 0 }] },
    { id: 'C', soNgay: 2, diSau: [{ id: 'A', kieu: 'GD', goi: 1 }] },
  ];
  let r = xepLich(viec, '2026-11-02', CN);
  assert.deepEqual(r.get('A'), { batDau: '2026-11-02', ketThuc: '2026-11-04' });
  assert.deepEqual(r.get('B'), { batDau: '2026-11-05', ketThuc: '2026-11-06' });
  assert.deepEqual(r.get('C'), { batDau: '2026-11-03', ketThuc: '2026-11-04' });
  viec[0].thucTe = { batDau: '2026-11-02', ketThuc: '2026-11-07' }; // A chậm 3 ngày
  r = xepLich(viec, '2026-11-02', CN);
  assert.deepEqual(r.get('B'), { batDau: '2026-11-09', ketThuc: '2026-11-10' });
});

test('phát hiện ràng buộc vòng tròn', () => {
  const viec = [
    { id: 'A', soNgay: 1, diSau: [{ id: 'B', kieu: 'XS' }] },
    { id: 'B', soNgay: 1, diSau: [{ id: 'A', kieu: 'XS' }] },
  ];
  assert.throws(() => xepLich(viec, '2026-11-02', CN), /vòng tròn/);
});

test('hỏi ngày lễ chưa xác nhận', () => {
  assert.deepEqual(leCanHoi('2026-04-01', '2026-05-10', CN), ['2026-04-30', '2026-05-01']);
  assert.deepEqual(leCanHoi('2026-04-01', '2026-05-10', { ...CN, daHoi: ['2026-04-30', '2026-05-01'] }), []);
});

test('thư viện tạo được kế hoạch cho cả 5 loại hình, không vòng tròn', () => {
  const tv = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
  for (const loai of ['TK', 'XM', 'CT', 'NTCT', 'NT']) {
    const viec = taoTuThuVien(tv, loai);
    assert.ok(viec.length > 5, loai);
    const r = xepLich(viec, '2026-11-02', CN);
    assert.equal(r.size, viec.length);
  }
});
