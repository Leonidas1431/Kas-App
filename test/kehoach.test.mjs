import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, lichHienTai, capNhatTienDo } from '../web/js/store.js';
import { suaViec, themViec, xoaViec, suaCongTrinh, chotKeHoachGoc, xemTruoc, dsNhaThau } from '../web/js/kehoach.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const lich = { kieu: 'NGHI_CN', nghi: [], daHoi: [] };
const moi = () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich: { ...lich } });
  db.outbox = [];
  return { db, ct };
};
const xongCT = (ct) => [...lichHienTai(ct).values()].reduce((m, x) => (x.ketThuc > m ? x.ketThuc : m), '');
const xongGoc = (ct) => ct.viec.reduce((m, v) => (v.goc.ketThuc > m ? v.goc.ketThuc : m), '');

test('sửa số ngày: lịch sau lùi theo, kế hoạch gốc giữ nguyên, có nhật ký', () => {
  const { db, ct } = moi();
  const v = ct.viec[0];
  const goc = xongGoc(ct), truoc = xongCT(ct);
  const doi = suaViec(db, ct, v.id, { soNgay: v.soNgay + 3, nhaThau: 'Thầu A', khoiLuong: 12, dvt: 'm2' }, 'THAY', 'chủ nhà đổi');
  assert.deepEqual(doi.sort(), ['dvt', 'khoiLuong', 'nhaThau', 'soNgay']);
  assert.ok(xongCT(ct) > truoc);
  assert.equal(xongGoc(ct), goc);
  assert.deepEqual(db.outbox.map((o) => o.loai), ['VIEC', 'LICH_SU']);
  const e = db.lichSu.at(-1);
  assert.equal(e.loai, 'SUA_KH');
  assert.match(e.ghiChu, /số ngày .* → .*Lý do: chủ nhà đổi/);
  // Không đổi gì thì không gửi
  assert.deepEqual(suaViec(db, ct, v.id, { nhaThau: 'Thầu A', dauViec: v.dauViec }, 'THAY'), []);
  assert.deepEqual(dsNhaThau(db), ['Thầu A']);
});

test('đổi việc đi trước thành vòng tròn thì báo lỗi, không sửa', () => {
  const { db, ct } = moi();
  const [a, b] = ct.viec.filter((v) => v.diSau.length).slice(0, 2);
  const p = b.diSau[0].id === a.id ? b : ct.viec.find((v) => v.diSau.some((q) => q.id === a.id));
  assert.throws(() => suaViec(db, ct, a.id, { diSau: [{ id: p.id, kieu: 'XS', goi: 0 }] }, 'THAY'), /vòng tròn/);
  assert.notEqual(a.diSau[0].id, p.id);
  assert.equal(db.outbox.length, 0);
  assert.throws(() => xemTruoc(ct, a.id, { diSau: [{ id: a.id, kieu: 'XS', goi: 0 }] }), /vòng tròn/);
});

test('thêm việc sau 1 việc: đi sau việc đó, đẩy việc sau nếu được nối, không tính là chậm', () => {
  const { db, ct } = moi();
  const i = 3, sau = ct.viec[i];
  const v = themViec(db, ct, { hangMuc: 'Chống thấm WC', soNgay: 2, sauId: sau.id }, 'DUC');
  assert.equal(ct.viec[i + 1], v);
  assert.deepEqual(v.diSau, [{ id: sau.id, kieu: 'XS', goi: 0 }]);
  assert.equal(v.nhom, sau.nhom);
  assert.deepEqual(v.goc, lichHienTai(ct).get(v.id));
  assert.deepEqual(ct.viec.map((x) => x.thuTu), ct.viec.map((_, k) => k));
  assert.ok(db.outbox.some((o) => o.loai === 'THEM_VIEC' && o.viec.id === v.id));
  // Nối việc tiếp theo vào việc mới thì công trình lùi
  const tiep = ct.viec[i + 2];
  const truoc = xongCT(ct);
  suaViec(db, ct, tiep.id, { diSau: [{ id: v.id, kieu: 'XS', goi: 0 }] }, 'DUC');
  assert.ok(xongCT(ct) >= truoc);
});

test('xoá việc: việc đi sau nối sang việc trước của nó, chuỗi không đứt', () => {
  const { db, ct } = moi();
  const giua = ct.viec.find((v) => v.diSau.length && ct.viec.some((x) => x.diSau.some((p) => p.id === v.id)));
  const truocNo = giua.diSau.map((p) => p.id);
  const sauNo = ct.viec.filter((x) => x.diSau.some((p) => p.id === giua.id));
  xoaViec(db, ct, giua.id, 'THAY', 'không làm');
  assert.ok(!ct.viec.includes(giua));
  for (const x of sauNo) for (const id of truocNo) assert.ok(x.diSau.some((p) => p.id === id));
  assert.ok(db.outbox.some((o) => o.loai === 'XOA_VIEC' && o.id === giua.id));
  assert.match(db.lichSu.at(-1).ghiChu, /Xoá việc .*Lý do: không làm/);
  lichHienTai(ct); // vẫn xếp được lịch
});

test('đổi khởi công + ngày nghỉ, rồi chốt lại kế hoạch gốc', () => {
  const { db, ct } = moi();
  const goc = xongGoc(ct);
  const doi = suaCongTrinh(db, ct, { khoiCong: '2026-11-09', lich: { ...ct.lich, nghi: ['2026-11-10', '2026-11-11'] }, ten: 'Thử' }, 'THAY');
  assert.deepEqual(doi, ['khoiCong', 'lich']);
  assert.deepEqual(db.outbox[0], { ...db.outbox[0], loai: 'CT_SUA', ma: 'NT-A', sua: { khoiCong: '2026-11-09', lich: { kieu: 'NGHI_CN', nghi: ['2026-11-10', '2026-11-11'], daHoi: [] } } });
  assert.ok(xongCT(ct) > goc);
  assert.equal(xongGoc(ct), goc);
  chotKeHoachGoc(db, ct, 'THAY', 'lùi khởi công');
  assert.equal(xongGoc(ct), xongCT(ct));
  assert.equal(db.lichSu.at(-1).loai, 'CHOT_GOC');
});

test('việc đã làm giữ ngày thực tế khi sửa việc khác', () => {
  const { db, ct } = moi();
  capNhatTienDo(db, ct, ct.viec[0].id, 100, 'KHA', '2026-11-03');
  const kt = lichHienTai(ct).get(ct.viec[0].id).ketThuc;
  suaViec(db, ct, ct.viec[0].id, { soNgay: 9 }, 'THAY');
  assert.equal(lichHienTai(ct).get(ct.viec[0].id).ketThuc, kt);
});
