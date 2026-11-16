import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { xepLich, taoTuThuVien } from '../web/js/schedule.js';
import { rong, taoCongTrinh, capNhatTienDo, tongHop, viecHomNay, lichHienTai } from '../web/js/store.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const lich = { kieu: 'LAM_XUYEN', nghi: [] };

test('cuốn chiếu: không xong trước việc đi trước', () => {
  const viec = [
    { id: 'A', soNgay: 5, diSau: [] },
    { id: 'B', soNgay: 2, diSau: [{ id: 'A', kieu: 'CC', goi: 0 }] },
    { id: 'C', soNgay: 2, diSau: [{ id: 'A', kieu: 'CC', goi: 1 }] },
    { id: 'D', soNgay: 2, diSau: [{ id: 'A', kieu: 'GD', goi: 0 }] },
  ];
  const r = xepLich(viec, '2026-12-01', lich);
  assert.deepEqual(r.get('B'), { batDau: '2026-12-01', ketThuc: '2026-12-05' });
  assert.deepEqual(r.get('C'), { batDau: '2026-12-02', ketThuc: '2026-12-06' });
  assert.deepEqual(r.get('D'), { batDau: '2026-12-01', ketThuc: '2026-12-02' }); // gối đầu giữ như cũ
});

test('dự báo theo hôm nay: việc quá hạn đẩy việc sau, không có hôm nay thì như cũ', () => {
  const viec = [
    { id: 'A', soNgay: 3, diSau: [], phanTram: 50, thucTe: { batDau: '2026-12-01' } },
    { id: 'B', soNgay: 2, diSau: [{ id: 'A', kieu: 'XS', goi: 0 }], phanTram: 0 },
    { id: 'X', soNgay: 1, diSau: [], phanTram: 100, thucTe: { batDau: '2026-12-01', ketThuc: '2026-12-01' } },
  ];
  assert.deepEqual(xepLich(viec, '2026-12-01', lich).get('B'), { batDau: '2026-12-04', ketThuc: '2026-12-05' });
  const d = xepLich(viec, '2026-12-01', lich, '2026-12-10');
  assert.deepEqual(d.get('A'), { batDau: '2026-12-01', ketThuc: '2026-12-10' });
  assert.deepEqual(d.get('B'), { batDau: '2026-12-11', ketThuc: '2026-12-12' });
  assert.deepEqual(d.get('X'), { batDau: '2026-12-01', ketThuc: '2026-12-01' }); // việc đã xong giữ ngày thực tế
});

test('việc chờ việc trước đang làm dở: không tính trễ, ngày xong công trình lùi theo', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NT', khoiCong: '2026-11-02', lich: { kieu: 'NGHI_CN', nghi: [], daHoi: [] } });
  const kh = lichHienTai(ct);
  const [a, b] = ct.viec.filter((v) => v.diSau.length && v.diSau[0].kieu === 'XS').map((v) => [ct.viec.find((x) => x.id === v.diSau[0].id), v])[0];
  capNhatTienDo(db, ct, a.id, 50, 'KHA', kh.get(a.id).batDau);
  const homNay = '2027-06-01'; // A quá hạn rất lâu
  const ds = viecHomNay(ct, homNay);
  assert.equal(ds.find((x) => x.v.id === a.id).nhan, 'TRE');
  const vb = ds.find((x) => x.v.id === b.id);
  assert.ok(vb && vb.nhan === 'CHO');
  assert.ok(vb.t.batDau > homNay);
  const th = tongHop(ct, homNay);
  assert.ok(th.ketThuc > homNay);
  assert.ok(th.ketThuc > th.ketThucGoc);
});

test('số tầng: phần thân lặp theo từng tầng, nối tầng trên sau tầng dưới', () => {
  const mot = taoTuThuVien(thuVien, 'XM');
  const bon = taoTuThuVien(thuVien, 'XM', 4);
  const lap = thuVien.filter((r) => r.loai.split(/\s+/).includes('XM') && /lặp theo số tầng/.test(r.hang_muc)).length;
  assert.equal(bon.length, mot.length + 3 * lap);
  assert.ok(mot.some((v) => v.hangMuc === 'Tầng 1: Cốt thép + bê tông cột'));
  const t = (id) => bon.find((v) => v.id === id);
  assert.equal(t('TH01-T2').diSau[0].id, 'TH03');
  assert.equal(t('TH02-T4').diSau[0].id, 'TH01-T4');
  assert.equal(t('TH04').diSau[0].id, 'TH03-T4');
  assert.equal(t('TH01').diSau[0].id, 'MO07');
  const r = xepLich(bon, '2026-12-01', lich);
  assert.ok(r.get('TH01-T4').batDau > r.get('TH03-T3').ketThuc);
  assert.ok(r.get('XT01').batDau > r.get('TH03-T4').ketThuc);
  // Loại hình khác không đổi
  assert.equal(taoTuThuVien(thuVien, 'NTCT', 4).length, taoTuThuVien(thuVien, 'NTCT').length);
});
