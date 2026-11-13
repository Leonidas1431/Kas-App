import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, lichHienTai } from '../web/js/store.js';
import { addDays } from '../web/js/schedule.js';
import { themMau, khachChotMau, guiLaiMau, mauCanChot, hanChotMacDinh, NGAY_DAT_HANG, tinGuiMau } from '../web/js/mauvl.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));

test('mẫu vật liệu: hạn chốt theo việc, nhắc khi sắp tới hạn, đổi mẫu rồi gửi lại', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich: { kieu: 'NGHI_CN', nghi: [], daHoi: [] } });
  const v = ct.viec[10];
  const han = addDays(lichHienTai(ct).get(v.id).batDau, -NGAY_DAT_HANG);
  assert.equal(hanChotMacDinh(ct, v.id), han);
  const m = themMau(db, ct, { hangMuc: 'Gạch ốp WC', tenMau: '30x60 trắng', nguoiBan: 'Đại lý A', viec: v.id }, 'DUC', '2026-11-02');
  assert.equal(m.hanChot, han);
  assert.equal(mauCanChot(db, addDays(han, -4)).length, 0);
  assert.equal(mauCanChot(db, addDays(han, -3))[0], m);
  assert.match(tinGuiMau(m, 'https://app'), /Gạch ốp WC: 30x60 trắng[^]*chốt giúp em trước[^]*Chốt mẫu này/);
  khachChotMau(db, m, { dongY: false, ngay: han, yKien: 'sáng hơn' }, 'THAY');
  assert.equal(m.trangThai, 'DOI');
  assert.equal(mauCanChot(db, han).length, 1); // muốn đổi vẫn là chưa chốt
  guiLaiMau(db, m, { tenMau: '30x60 kem', nguoiBan: 'Đại lý B' }, 'DUC', han);
  assert.deepEqual([m.trangThai, m.tenMau, m.nguoiBan, m.yKien], ['CHO_KHACH', '30x60 kem', 'Đại lý B', '']);
  khachChotMau(db, m, { dongY: true, ngay: han }, 'THAY');
  assert.equal(mauCanChot(db, han).length, 0);
  assert.ok(db.outbox.filter((o) => o.loai === 'MAU').length >= 4);
});

test('việc đã sát ngày: hạn chốt không rơi vào quá khứ', () => {
  const db = rong();
  const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich: { kieu: 'NGHI_CN', nghi: [], daHoi: [] } });
  assert.equal(hanChotMacDinh(ct, ct.viec[0].id, '2026-11-13'), '2026-11-15');
});
