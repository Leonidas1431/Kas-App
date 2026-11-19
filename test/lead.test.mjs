import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { rong } from '../web/js/store.js';
import { taoKhach, daGoi, doiTrangThai } from '../web/js/khach.js';
import {
  hanGoiLead, leadCanGoi, choGoiDau, goiYNhietDo, nhietDo, buocXong, tichBuoc, BUOC, dsMauTin, dienMau, khoaMau, taoLinkDK, linkGTCuaKhach, urlForm,
  demTheoLink, HM_HH, capNhatHoaHong, docNgaySinh, docDoSo, tachSdt, conLai,
} from '../web/js/lead.js';
const { taoMoiTruong } = createRequire(import.meta.url)('./gas-mock.cjs');

const HN = '2026-11-19';
// Giờ Việt Nam → ISO UTC
const vn = (ngay, gio) => new Date(Date.parse(`${ngay}T${gio}:00+07:00`)).toISOString();

test('hạn gọi lead: 2 giờ làm việc trong 8h–20h, lead đêm hạn 10h sáng', () => {
  assert.equal(hanGoiLead(vn(HN, '09:15')), vn(HN, '11:15'));
  assert.equal(hanGoiLead(vn(HN, '18:00')), vn(HN, '20:00'));
  assert.equal(hanGoiLead(vn(HN, '19:00')), vn('2026-11-20', '09:00'));
  assert.equal(hanGoiLead(vn(HN, '22:30')), vn('2026-11-20', '10:00'));
  assert.equal(hanGoiLead(vn(HN, '00:53')), vn(HN, '10:00'));
  assert.equal(conLai(vn(HN, '11:00'), vn(HN, '09:40')), 'còn 1 giờ 20 phút');
  assert.equal(conLai(vn(HN, '11:00'), vn(HN, '11:35')), 'quá 35 phút');
});

test('lead form chưa gọi: hiện trong danh sách cần gọi, gọi lần đầu (kể cả không nghe máy) là hết', () => {
  const db = rong();
  const k = taoKhach(db, { ten: 'Anh Nam', sdt: '0912000111' }, 'THAY', HN);
  Object.assign(k, { leadLuc: vn(HN, '09:00'), hanGoi: vn(HN, '11:00') });
  const k2 = taoKhach(db, { ten: 'Chị Hà', sdt: '0912000222' }, 'THAY', HN);
  assert.ok(choGoiDau(k) && !choGoiDau(k2));
  const ds = leadCanGoi(db, vn(HN, '11:30'));
  assert.equal(ds.length, 1);
  assert.equal(ds[0].quaHan, true);
  daGoi(db, k, false, 'Không nghe máy', 'THAY', HN);
  assert.ok(k.goiDauLuc);
  assert.equal(leadCanGoi(db).length, 0);
  const k3 = taoKhach(db, { ten: 'Anh Long' }, 'THAY', HN);
  k3.leadLuc = vn(HN, '10:00');
  doiTrangThai(db, k3, 'LIEN_HE', 'THAY', HN);
  assert.ok(k3.goiDauLuc);
});

test('nóng / ấm / lạnh: app gợi ý, Thầy chọn tay thì lấy của Thầy', () => {
  const k = { nhuCau: {} };
  assert.equal(goiYNhietDo(k), '');
  k.nhuCau = { thoiDiem: '3T', matBang: 'CO' };
  assert.equal(goiYNhietDo(k), 'NONG');
  k.nhuCau = { thoiDiem: '3T', matBang: 'CO', phanKhuc: 'KHONG' };
  assert.equal(goiYNhietDo(k), 'LANH');
  k.nhuCau = { thoiDiem: '6T' };
  assert.equal(goiYNhietDo(k), 'AM');
  k.nhietDo = 'NONG';
  assert.equal(nhietDo(k), 'NONG');
});

test('các bước A→C: tự xong theo trạng thái, tích tay lưu ngày', () => {
  const db = rong();
  const k = taoKhach(db, { ten: 'Chị Mai' }, 'THAY', HN);
  const b = (id) => BUOC.find((x) => x.id === id);
  assert.equal(buocXong(k, b('A1')), '');
  doiTrangThai(db, k, 'KHAO_SAT', 'THAY', HN);
  assert.equal(buocXong(k, b('A1')), 'tu');
  assert.equal(buocXong(k, b('B1')), 'tu');
  assert.equal(buocXong(k, b('B2')), '');
  tichBuoc(db, k, 'B2', true, HN);
  assert.equal(buocXong(k, b('B2')), HN);
  tichBuoc(db, k, 'B2', false, HN);
  assert.equal(buocXong(k, b('B2')), '');
  doiTrangThai(db, k, 'TAM_HOAN', 'THAY', HN);
  assert.equal(buocXong(k, b('A1')), '');
});

test('mẫu tin: bản sửa trong cài đặt đè mẫu gốc, chỗ chưa có dữ liệu giữ {ngoặc}', () => {
  const ds = dsMauTin({ [khoaMau('HO_SO')]: 'Gửi {ten}: {hoSo}' });
  assert.equal(ds.length, 5);
  assert.equal(ds.find((m) => m.id === 'HO_SO').daSua, true);
  const k = { ten: 'Chị Lan', baoGia: [{ ngay: '2026-11-10' }], nhuCau: {} };
  assert.equal(dienMau('Gửi {ten}: {hoSo}', k, {}), 'Gửi Chị Lan: {hoSo}');
  assert.match(dienMau(ds.find((m) => m.id === 'SAU_BG').chu, k), /10\/11\/2026/);
});

test('link đăng ký: link giới thiệu của khách cũ dùng lại, đếm lead theo link, url cùng thư mục app', () => {
  const db = rong();
  const k = taoKhach(db, { ten: 'Anh Bình', sdt: '0900000005' }, 'THAY', HN);
  const l1 = linkGTCuaKhach(db, k);
  assert.equal(linkGTCuaKhach(db, k).ma, l1.ma);
  assert.equal(l1.nguoiGioiThieu, 'Anh Bình');
  assert.ok(db.outbox.some((o) => o.loai === 'LINK_DK'));
  const l2 = taoLinkDK(db, { ten: 'Website', nguon: 'Website' });
  assert.match(l2.ma, /^L[a-z0-9]{4,20}$/);
  const k2 = taoKhach(db, { ten: 'Chị Hoa', linkDK: l1.ma }, 'THAY', HN);
  assert.equal(demTheoLink(db)[l1.ma].lead, 1);
  assert.equal(k2.linkDK, l1.ma);
  assert.equal(urlForm('https://leonidas1431.github.io/Kas-App/', 'Labc12', 'AKfy'), 'https://leonidas1431.github.io/Kas-App/dang-ky.html?l=Labc12&api=AKfy');
  assert.equal(urlForm('https://x.io/Kas-App/index.html', 'Labc12', ''), 'https://x.io/Kas-App/dang-ky.html?l=Labc12');
});

test('hoa hồng tự chuyển Đã trả khi có khoản chi, xoá khoản chi thì quay lại', () => {
  const db = rong();
  const k = taoKhach(db, { ten: 'Chị Hoa', nguoiGioiThieu: 'Anh Bình' }, 'THAY', HN);
  k.hoaHong = { soTien: 10000000, daTra: false };
  const chi = { id: 'TC-1', loai: 'CHI', hangMuc: HM_HH, thamChieu: k.ma, soTien: 4000000, xoa: '' };
  db.thuChi.push(chi);
  capNhatHoaHong(db, k.ma, HN);
  assert.equal(k.hoaHong.daTra, false);
  assert.equal(k.hoaHong.daTraTien, 4000000);
  db.thuChi.push({ ...chi, id: 'TC-2', soTien: 6000000 });
  capNhatHoaHong(db, k.ma, HN);
  assert.equal(k.hoaHong.daTra, true);
  db.thuChi.forEach((e) => { e.xoa = HN; });
  capNhatHoaHong(db, k.ma, HN);
  assert.equal(k.hoaHong.daTra, false);
  // Chưa ghi số hoa hồng: lấy số đã chi
  const k2 = taoKhach(db, { ten: 'Anh Tú', nguoiGioiThieu: 'Chị Xuân' }, 'THAY', HN);
  db.thuChi.push({ ...chi, id: 'TC-3', thamChieu: k2.ma, xoa: '' });
  capNhatHoaHong(db, k2.ma, HN);
  assert.equal(k2.hoaHong.soTien, 4000000);
  assert.equal(k2.hoaHong.daTra, true);
  // Tích tay, chưa có khoản chi: giữ nguyên
  const k3 = taoKhach(db, { ten: 'Chị Yến', nguoiGioiThieu: 'Anh Long' }, 'THAY', HN);
  k3.hoaHong.daTra = true;
  capNhatHoaHong(db, k3.ma, HN);
  assert.equal(k3.hoaHong.daTra, true);
});

test('phong thủy: đọc ngày sinh thiếu phần và độ số', () => {
  assert.equal(docNgaySinh('5/3/1980'), '05/03/1980');
  assert.equal(docNgaySinh('3/1980'), '03/1980');
  assert.equal(docNgaySinh('1980'), '1980');
  assert.equal(docNgaySinh(''), '');
  assert.equal(docNgaySinh('13/1980'), null);
  assert.equal(docNgaySinh('abc'), null);
  assert.equal(docDoSo('187,5'), 187.5);
  assert.equal(docDoSo('360'), null);
  assert.equal(docDoSo(''), '');
});

test('tách SĐT trong đoạn chat khi không có mạng', () => {
  assert.equal(tachSdt('Em là Lan, sđt 0912.345.678 nhé'), '0912345678');
  assert.equal(tachSdt('zalo +84 912 345 678'), '0912345678');
  assert.equal(tachSdt('không có số'), '');
});

// ---------- Máy chủ ----------
function khoiDong() {
  const m = taoMoiTruong();
  m.ctx.setup();
  return { ...m, khoaThay: m.logs.find((l) => l.startsWith('KHOÁ')).split(': ')[1] };
}
const op = (o) => ({ idGui: Math.random().toString(36).slice(2), luc: '2026-11-19T01:00:00Z', ...o });

test('máy chủ: form đăng ký tạo khách mới đúng nguồn theo link, có hạn gọi; bấm 2 lần không trùng', () => {
  const m = khoiDong();
  const l = { ma: 'Lweb12345', ten: 'Website noithatkas.com', nguon: 'Website', loai: 'KENH', hoatDong: true };
  const gt = { ma: 'Lgt123456', ten: 'Giới thiệu của Anh Bình', nguon: 'Khách cũ giới thiệu', loai: 'GIOI_THIEU', nguoiGioiThieu: 'Anh Bình', sdtGioiThieu: '0900000005', maKhachGT: 'KH-2611-BINH', hoatDong: true };
  let r = m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'LINK_DK', l }), op({ loai: 'LINK_DK', l: gt })] });
  assert.deepEqual(r.data.map((x) => x.ok), [true, true]);
  r = m.post(undefined, 'dangKyTuVan', { l: l.ma, ten: '  Chị Lan  Mỹ Đình ', sdt: '+84 912 345 678' });
  assert.equal(r.ok, true);
  assert.equal(m.post(undefined, 'dangKyTuVan', { l: l.ma, ten: 'Chị Lan', sdt: '0912345678' }).ok, true);
  r = m.post(undefined, 'dangKyTuVan', { l: gt.ma, ten: 'Anh Tú', sdt: '0987654321' });
  const d = m.post(m.khoaThay, 'keoVe').data;
  assert.equal(d.khach.length, 2);
  const lan = d.khach.find((k) => k.ten === 'Chị Lan Mỹ Đình');
  assert.equal(lan.sdt, '0912345678');
  assert.equal(lan.nguon, 'Website');
  assert.equal(lan.linkDK, l.ma);
  assert.equal(lan.trangThai, 'MOI');
  assert.equal(lan.phuTrach, 'THAY');
  assert.equal(lan.nguoiTao, 'FORM');
  assert.match(lan.ma, /^KH-\d{4}-LANMYDINH$/);
  assert.ok(lan.leadLuc && lan.hanGoi > lan.leadLuc);
  const tu = d.khach.find((k) => k.ten === 'Anh Tú');
  assert.equal(tu.nguoiGioiThieu, 'Anh Bình');
  assert.equal(tu.nguon, 'Khách cũ giới thiệu');
  assert.ok(d.lichSu.some((e) => e.ma === lan.ma && e.nguoi === 'FORM' && /Website noithatkas.com/.test(e.ghiChu)));
  assert.equal(d.linkDK.length, 2);
});

test('máy chủ: form từ chối sai SĐT, ô bẫy spam không tạo khách, khách cũ đăng ký lại không tạo trùng', () => {
  const m = khoiDong();
  assert.equal(m.post(undefined, 'dangKyTuVan', { ten: 'A', sdt: '0912345678' }).ok, false);
  assert.equal(m.post(undefined, 'dangKyTuVan', { ten: 'Anh An', sdt: '12345' }).ok, false);
  assert.equal(m.post(undefined, 'dangKyTuVan', { ten: 'Bot', sdt: '0911111111', web: 'http://spam' }).ok, true);
  assert.equal(m.post(m.khoaThay, 'keoVe').data.khach.length, 0);
  // Khách đã tạm hoãn đăng ký lại: mở lại thành Mới, có hạn gọi
  const k = { ma: 'KH-2611-HA', ten: 'Chị Hà', sdt: '0913000333', nguon: 'Facebook', trangThai: 'TAM_HOAN', lyDo: 'Chờ nhận nhà', nhacGoi: '2026-12-20', baoGia: [], chamSoc: [], hoaHong: {}, nhuCau: {} };
  m.post(m.khoaThay, 'dayLen', { ops: [op({ loai: 'KHACH', khach: k })] });
  assert.equal(m.post(undefined, 'dangKyTuVan', { ten: 'Hà', sdt: '0913 000 333' }).ok, true);
  const d = m.post(m.khoaThay, 'keoVe').data;
  assert.equal(d.khach.length, 1);
  assert.equal(d.khach[0].trangThai, 'MOI');
  assert.equal(d.khach[0].nguon, 'Facebook');
  assert.ok(d.khach[0].hanGoi);
  assert.ok(d.lichSu.some((e) => /đăng ký lại/.test(e.ghiChu)));
});

test('máy chủ: link đăng ký chỉ văn phòng sửa; tách tin nhắn gọi AI và trả đúng dạng', () => {
  const m = khoiDong();
  const kha = m.post(m.khoaThay, 'capKhoa', { email: 'kha@example.com', vaiTro: 'KHA', ten: 'Kha' }).data.khoa;
  const r = m.post(kha, 'dayLen', { ops: [op({ loai: 'LINK_DK', l: { ma: 'Labcdef', ten: 'x', loai: 'KENH' } })] });
  assert.equal(r.data[0].ok, false);
  assert.deepEqual(m.post(kha, 'keoVe').data.linkDK, []);
  m.props.ANTHROPIC_API_KEY = 'k';
  m.traLoi.fn = () => ({ ma: 200, body: { model: 'claude-sonnet-5-5', usage: { input_tokens: 100, output_tokens: 50 }, stop_reason: 'end_turn',
    content: [{ type: 'text', text: JSON.stringify({ ten: 'Chị Lan', sdt: '0912345678', loai: 'NT', diaDiem: 'Mỹ Đình', dienTich: '90m2', hienTrang: '', phongCach: '', nganSach: '600tr', thoiGian: 'trước Tết', dacBiet: '', tomTat: 'Nội thất căn hộ 90m2', thoiDiem: '3T', matBang: 'CO' }) }] } });
  const t = m.post(m.khoaThay, 'tachKhach', { chu: 'Chào em, chị Lan, căn hộ 90m2 Mỹ Đình, 0912345678' });
  assert.equal(t.ok, true);
  assert.equal(t.data.loai, 'NT');
  assert.equal(m.post(kha, 'tachKhach', { chu: 'x' }).ok, false);
});
