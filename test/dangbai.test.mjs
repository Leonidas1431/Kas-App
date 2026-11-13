import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rong } from '../web/js/store.js';
import { taoBai, suaBai, xoaBai, nhanBai, boChoGui, dauTuan, lichTuan, choDuyet, choDangTay, loiDang, goiYCongTrinh, chiAIThang, chuDeChep, nhomViet,
  kiemTruocKhiViet, caiDatBD, kenhXong } from '../web/js/dangbai.js';

test('mặc định Thầy chốt: FB 3, TikTok 1, web 1 bài/tuần, Sonnet 5.5, web lưu nháp', () => {
  const cd = caiDatBD({});
  assert.deepEqual([cd.bdFB, cd.bdTT, cd.bdWEB, cd.bdModel, cd.bdWebTrangThai], [3, 1, 1, 'claude-sonnet-5-5', 'draft']);
  assert.equal(caiDatBD({ bdFB: '5', bdModel: 'la' }).bdFB, 5);
  assert.equal(caiDatBD({ bdModel: 'la' }).bdModel, 'claude-sonnet-5-5');
  assert.equal(cd.bdGemini, 'gemini-3.1-flash-image');
  assert.equal(caiDatBD({ bdGemini: 'gemini-3-pro-image' }).bdGemini, 'gemini-3-pro-image');
  assert.equal(caiDatBD({ bdGemini: 'la' }).bdGemini, 'gemini-3.1-flash-image');
});

test('tạo bài: kênh mặc định theo loại; sửa chữ sau khi duyệt thì về chờ duyệt; bài đã đăng chỉ ghi ý kiến', () => {
  const db = rong();
  const b = taoBai(db, { loai: 'PHONG_THUY' }, 'DUC');
  assert.deepEqual(b.kenh, ['FB', 'IG', 'WEB']);
  assert.equal(db.outbox.at(-1).loai, 'BD');
  suaBai(db, b, { baiViet: { fb: 'x' } });
  assert.equal(b.trangThai, 'CHO_DUYET');
  Object.assign(b, { trangThai: 'DUYET', nguoiDuyet: 'THAY' });
  suaBai(db, b, { gioDang: '08:00' });
  assert.equal(b.trangThai, 'DUYET');
  suaBai(db, b, { baiViet: { fb: 'y' } });
  assert.equal(b.trangThai, 'CHO_DUYET');
  assert.equal(b.nguoiDuyet, '');
  b.trangThai = 'DA_DANG';
  suaBai(db, b, { baiViet: { fb: 'z' }, yKien: 'ok' });
  assert.equal(b.baiViet.fb, 'y');
  assert.equal(b.yKien, 'ok');
});

test('bài máy chủ trả về thay bản trên máy và bỏ thay đổi cũ đang chờ gửi của bài đó', () => {
  const db = rong();
  const a = taoBai(db, {}, 'THAY');
  const c = taoBai(db, {}, 'THAY');
  suaBai(db, a, { chuDe: 'cũ' });
  nhanBai(db, { ...a, chuDe: 'mới', baiViet: { fb: 'AI' } });
  assert.equal(db.baiDang.find((x) => x.id === a.id).chuDe, 'mới');
  assert.ok(!db.outbox.some((o) => o.b && o.b.id === a.id));
  assert.ok(db.outbox.some((o) => o.b && o.b.id === c.id));
  boChoGui(db, c.id);
  assert.equal(db.outbox.length, 0);
});

test('lịch tuần: đếm bài từng kênh so với mục tiêu; hàng chờ duyệt, đăng tay, lỗi', () => {
  const db = rong();
  assert.equal(dauTuan('2026-11-13'), '2026-11-09'); // thứ 6 → thứ 2
  assert.equal(dauTuan('2026-11-15'), '2026-11-09'); // chủ nhật
  const b1 = taoBai(db, { loai: 'DU_AN', ngayDang: '2026-11-10' }, 'THAY');
  taoBai(db, { loai: 'KINH_NGHIEM', ngayDang: '2026-11-12' }, 'THAY');
  taoBai(db, { loai: 'DU_AN', ngayDang: '2026-11-17' }, 'THAY'); // tuần sau
  const lt = lichTuan(db, '2026-11-09');
  assert.deepEqual(lt.kenh.map((x) => [x.k, x.co, x.thieu]), [['FB', 2, 1], ['TT', 1, 0], ['WEB', 1, 0]]);
  assert.equal(lt.ngay[1].bai.length, 1);
  suaBai(db, b1, { baiViet: { fb: 'a', ig: 'b', tt: { tieuDe: 't' } } });
  assert.equal(choDuyet(db).length, 1);
  Object.assign(b1, { trangThai: 'DUYET', ketQua: { FB: { id: '1' }, IG: { loi: 'Meta: token hết hạn' } } });
  assert.deepEqual(choDangTay(db, '2026-11-10').map((x) => x.id), [b1.id]);
  assert.deepEqual(choDangTay(db, '2026-11-09'), []);
  assert.equal(loiDang(db).length, 1);
  assert.ok(kenhXong(b1, 'FB') && !kenhXong(b1, 'IG'));
  xoaBai(db, b1);
  assert.equal(choDuyet(db).length + loiDang(db).length, 0);
});

test('gợi ý công trình cho đăng ảnh chưa có bài; chi AI tháng; chữ để chép; chia nhóm gọi AI; kiểm trước khi viết', () => {
  const db = rong();
  db.congTrinh = [{ ma: 'A', choDangAnh: true, viec: [] }, { ma: 'B', choDangAnh: false, viec: [] }, { ma: 'C', choDangAnh: true, viec: [] }];
  taoBai(db, { maCongTrinh: 'C' }, 'THAY');
  assert.deepEqual(goiYCongTrinh(db).map((c) => c.ma), ['A']);
  db.chiAI = [{ luc: '2026-11-02T01:00:00Z', usd: 0.06 }, { luc: '2026-11-12T01:00:00Z', usd: 0.125 }, { luc: '2026-10-30T01:00:00Z', usd: 1 }];
  assert.deepEqual(chiAIThang(db, '2026-11-13'), { lan: 2, usd: 0.19 });
  const b = { baiViet: { fb: 'F', tt: { tieuDe: 'T', chuThich: 'C', kichBan: 'K' }, web: { tieuDe: 'W', moTa: 'M', noiDung: 'N' } } };
  assert.equal(chuDeChep(b, 'IG'), 'F');
  assert.equal(chuDeChep(b, 'TT'), 'T\n\nC');
  assert.equal(chuDeChep(b, 'WEB'), 'W\n\nM\n\nN');
  assert.deepEqual(nhomViet(['WEB', 'TT', 'IG', 'FB']), [['IG', 'FB'], ['TT'], ['WEB']]);
  assert.match(kiemTruocKhiViet({ loai: 'PHONG_THUY', kenh: ['FB'], chuDe: 'Cửa chính', trichDan: 'x' }), /nguồn/);
  assert.match(kiemTruocKhiViet({ loai: 'DU_AN', kenh: ['FB'] }), /chủ đề/);
  assert.equal(kiemTruocKhiViet({ loai: 'DU_AN', kenh: ['FB'], maCongTrinh: 'A' }), '');
});
