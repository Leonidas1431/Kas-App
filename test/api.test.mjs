import { test } from 'node:test';
import assert from 'node:assert/strict';

// Giả lập trình duyệt tối thiểu cho api.js
const kho = { 'kas-ket-noi': JSON.stringify({ api: 'X', khoa: 'k' }) };
globalThis.localStorage = { getItem: (k) => kho[k] ?? null, setItem: (k, v) => { kho[k] = v; }, removeItem: (k) => { delete kho[k]; } };
Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, configurable: true });
const { dongBo } = await import('../web/js/api.js');

test('máy chủ bản cũ không biết thao tác mới: giữ lại trên máy, không làm mất hợp đồng', async () => {
  const daNhan = [];
  globalThis.fetch = async (url, o) => {
    const req = JSON.parse(o.body);
    let data;
    if (req.action === 'dayLen') data = req.data.ops.map((op) => (op.loai === 'HD' ? { idGui: op.idGui, ok: false, loi: 'Loại thay đổi lạ: HD' } : (daNhan.push(op), { idGui: op.idGui, ok: true })));
    else data = { toi: { vaiTro: 'THAY' }, congTrinh: [], lichSu: [{ id: 'x' }], nguoiDung: [], khach: [] }; // bản cũ: không có hopDong
    return { json: async () => ({ ok: true, data }) };
  };
  const hd = { ma: 'HD-1' };
  const db = { congTrinh: [], lichSu: [], khach: [], hopDong: [hd], outbox: [{ idGui: 'a', loai: 'HD', hd }, { idGui: 'b', loai: 'LICH_SU', e: {} }] };
  const r = await dongBo(db, () => {});
  assert.equal(r.trangThai, 'xong');
  assert.equal(r.mayChuCu, true);
  assert.deepEqual(db.outbox.map((o) => o.idGui), ['a']);
  assert.deepEqual(daNhan.map((o) => o.idGui), ['b']);
  assert.deepEqual(db.hopDong, [hd]);
  assert.deepEqual(db.lichSu, [{ id: 'x' }]); // phần khác vẫn kéo về
});
