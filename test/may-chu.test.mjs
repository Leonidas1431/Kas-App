import { test } from 'node:test';
import assert from 'node:assert/strict';

const kho = new Map();
globalThis.localStorage = { getItem: (k) => (kho.has(k) ? kho.get(k) : null), setItem: (k, v) => kho.set(k, String(v)), removeItem: (k) => kho.delete(k) };
const { apiDaBiet, nhoApi, MAY_CHU_MAC_DINH, apiUrl } = await import('../web/js/api.js');

test('máy mới mở app: dùng sẵn máy chủ chính, không phải dán link', () => {
  kho.clear();
  assert.ok(MAY_CHU_MAC_DINH.length > 20);
  assert.equal(apiDaBiet(), MAY_CHU_MAC_DINH);
  assert.match(apiUrl(apiDaBiet()), /^https:\/\/script\.google\.com\/macros\/s\/[-\w]+\/exec$/);
});

test('máy đã lỡ nhớ chữ mẫu hoặc link sai: bỏ qua, quay về máy chủ chính', () => {
  kho.clear();
  nhoApi('https://script.google.com/macros/s/…/exec');
  assert.equal(apiDaBiet(), MAY_CHU_MAC_DINH);
  nhoApi('https://script.google.com/home/projects/abc/edit');
  assert.equal(apiDaBiet(), MAY_CHU_MAC_DINH);
});

test('đã chọn máy chủ khác đúng dạng thì giữ máy chủ đó', () => {
  kho.clear();
  nhoApi('https://script.google.com/macros/u/0/s/AKfycbzKHAC_abcdefghijklmnop123/exec');
  assert.equal(apiDaBiet(), 'AKfycbzKHAC_abcdefghijklmnop123');
});
