import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { rong, taoCongTrinh, capNhatTienDo } from '../web/js/store.js';
import { addDays } from '../web/js/schedule.js';
import { checklistMacDinh, canNghiemThu, nghiemThu, daSuaTonTai, ketQuaViec, choNghiemThu, tonTaiMo, dieuKienDo, canDoNoiThat } from '../web/js/nghiemthu.js';

const thuVien = JSON.parse(readFileSync(new URL('../web/data/thu-vien-v1.json', import.meta.url)));
const lich = { kieu: 'NGHI_CN', nghi: [], daHoi: [] };
const moi = () => { const db = rong(); const ct = taoCongTrinh(db, thuVien, { ma: 'NT-A', ten: 'Thử', loai: 'NTCT', khoiCong: '2026-11-02', lich }); return { db, ct }; };

test('checklist: nhóm có trong hồ sơ lấy từ hồ sơ, nhóm chưa có là em đề xuất', () => {
  assert.ok(checklistMacDinh('Ốp lát - Đá (thầu ốp lát)').some((m) => m.noiDung === 'Độ chắc ốp lát' && !m.deXuat));
  assert.ok(checklistMacDinh('Chống thấm (thầu thô)').every((m) => m.deXuat));
  assert.ok(checklistMacDinh('Nhóm lạ').every((m) => m.deXuat));
});

test('việc cần nghiệm thu: việc thầu, không tính đo, đặt hàng, việc KAS tự làm', () => {
  const { ct } = moi();
  const theo = (ma) => ct.viec.find((v) => v.id === ma);
  assert.equal(canNghiemThu(theo('XT01')), true);
  assert.equal(canNghiemThu(theo('NT01')), false); // Đo sản xuất
  assert.equal(canNghiemThu(theo('NT04')), false); // Đặt hàng đồ rời
  assert.equal(canNghiemThu(theo('HT02')), false); // Nghiệm thu nội bộ (KAS)
  assert.equal(canNghiemThu({ ...theo('HT01'), nhaThau: 'Đội sửa' }), true); // KAS thuê thầu thì vẫn nghiệm thu
});

test('nghiệm thu: xong việc thì nhắc; mục lỗi thành tồn tại có hạn; sửa xong thì đạt', () => {
  const { db, ct } = moi();
  const v = ct.viec.find((x) => x.id === 'XT01');
  capNhatTienDo(db, ct, v.id, 100, 'KHA', '2026-11-10');
  assert.deepEqual(choNghiemThu(db, '2026-11-11').map((x) => x.v.id), ['XT01']);
  assert.equal(choNghiemThu(db, addDays('2026-11-10', 15)).length, 0); // quá 14 ngày không nhắc nữa
  assert.equal(ketQuaViec(db, ct, v).tt, 'CHUA');
  const n = nghiemThu(db, ct, v.id, { ngay: '2026-11-11', soAnh: 2, muc: [{ noiDung: 'Tường xây, vị trí tường', dat: true }, { noiDung: 'Trát phẳng', dat: false, ghiChu: 'WC2 lệch' }],
    tonTaiThem: ['Dọn gạch vỡ ban công'] }, 'KHA');
  assert.equal(n.tonTai.length, 2);
  assert.equal(n.tonTai[0].noiDung, 'Trát phẳng: WC2 lệch');
  assert.equal(n.tonTai[0].hanSua, '2026-11-14'); // mặc định 3 ngày
  assert.equal(choNghiemThu(db, '2026-11-11').length, 0);
  assert.equal(ketQuaViec(db, ct, v).tt, 'TON_TAI');
  assert.deepEqual(tonTaiMo(db, '2026-11-15').map((x) => x.qua), [true, true]);
  daSuaTonTai(db, n, n.tonTai[0].id, '2026-11-13', 'KHA');
  daSuaTonTai(db, n, n.tonTai[1].id, '2026-11-13', 'KHA');
  assert.equal(ketQuaViec(db, ct, v).tt, 'DAT');
  assert.equal(tonTaiMo(db, '2026-11-15').length, 0);
  assert.ok(db.outbox.filter((o) => o.loai === 'NGHIEM_THU').length === 3);
  assert.ok(db.lichSu.some((e) => e.loai === 'NGHIEM_THU' && /còn 2 tồn tại/.test(e.ghiChu)));
});

test('đo nội thất: đủ khi xong thạch cao, sơn bả trong nhà + cán nền hoặc lát sàn; không có thạch cao thì theo trát tường', () => {
  const { db, ct } = moi();
  const xong = (re) => ct.viec.filter((v) => re.test(v.hangMuc) || re.test(v.nhom)).forEach((v) => capNhatTienDo(db, ct, v.id, 100, 'KHA', '2026-12-01'));
  let dk = dieuKienDo(ct);
  assert.equal(dk.du, false);
  xong(/^Thạch cao/);
  assert.ok(dieuKienDo(ct).thieu.some((t) => /Cán nền|Lát sàn/.test(t)));
  xong(/Cán nền/);
  dk = dieuKienDo(ct);
  assert.equal(dk.du, true);
  assert.deepEqual(canDoNoiThat(db).map((x) => x.ct.ma), ['NT-A']);
  capNhatTienDo(db, ct, dk.vDo.id, 50, 'KHA', '2026-12-02');
  assert.equal(canDoNoiThat(db).length, 0); // đã bắt đầu đo thì thôi nhắc
  // Không có thạch cao – sơn bả: theo trát tường
  const b = moi();
  b.ct.viec = b.ct.viec.filter((v) => !/^Thạch cao/.test(v.nhom));
  b.ct.viec.filter((v) => /Cán nền/.test(v.hangMuc)).forEach((v) => { v.phanTram = 100; });
  assert.deepEqual(dieuKienDo(b.ct).thieu, ['Trát tường, trát cầm cạnh má cửa']);
  // Nhà xây mới: sơn ngoài nhà chưa xong không chặn đo
  const c = rong();
  const xm = taoCongTrinh(c, thuVien, { ma: 'XD-A', ten: 'Nhà', loai: 'XM', khoiCong: '2026-11-02', lich });
  xm.viec.filter((v) => (/^Thạch cao/.test(v.nhom) && !/ngoài nhà/.test(v.hangMuc)) || /Cán nền/.test(v.hangMuc)).forEach((v) => { v.phanTram = 100; });
  assert.equal(dieuKienDo(xm).du, true);
});
