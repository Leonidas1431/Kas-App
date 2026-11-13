import { LICH, KIEU_NOI, leCanHoi, diffDays, addDays, xepLich } from './schedule.js';
import { suaViec, themViec, xoaViec, suaCongTrinh, chotKeHoachGoc, xemTruoc, dsNhaThau } from './kehoach.js';
import {
  doc, ghi, taoCongTrinh, lichHienTai, capNhatTienDo, baoCham, ghiChu, tongHop, viecHomNay, datCongKhai,
  NGUYEN_NHAN, LOAI_HINH, VAI_TRO, VAN_PHONG, rong, datCaiDat,
} from './store.js';
import {
  TRANG_THAI, DANG_THEO, NGUON, LY_DO_MAT, NHU_CAU_LOAI, O_NHU_CAU, taoKhach, timTheoSdt, suaKhach, doiTrangThai, daGoi,
  ghiChuKhach, themBaoGia, chotBaoGia, ganCongTrinh, banGiao, xongChamSoc, viecKhachHomNay, thongKe,
} from './khach.js';
import {
  DANG_HD, TT_HD, goiYTenHD, soHopDong, dotMacDinh, taoHopDong, suaHopDong, tinhDot, ghiThu, dongDot, moLaiDot, suaDot, themDot,
  themPhuLuc, phiSua, hdThietKeDuocTru, apKhauTru, PHAM_VI_TK, TY_LE_KHAU_TRU, giaTriPhan, phanChoTru, doiTrangThaiHD, hdCuaCongTrinh, hdCuaKhach, congTrinhDaXong, viecHopDongHomNay, tongHopTien,
} from './hopdong.js';
import {
  HANG_MUC_TK, HM_DEM_SUA, TT_PA, QUA, CHO_KHACH, paCuaCongTrinh, hdThietKe, soLanSuaChoPhep, guiPhuongAn, tenLan, soNgayCho, vuotSoLan, phanHoi,
  quyetPhi, gsCuaCongTrinh, ngayGS, taoBuoiGSTG, themBuoiGSTG, suaBuoiGSTG, xongBuoiGSTG, viecThietKeHomNay,
} from './thietke.js';
import { ketNoi, luuKetNoi, goi, dongBo, xemChuNha, maApi, chuNhaPhanHoi } from './api.js';
import { xepAnh, demCho, guiAnhCho } from './anh.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const homNay = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const addDaysUI = (s, n) => new Date(Date.parse(s) + n * 86400000).toISOString().slice(0, 10);
const ddmm = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : '');
const fmtNgay = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : '……/……/……');
const tenNguoi = (n) => VAI_TRO[n] || (n === 'CHU_NHA' ? 'Chủ nhà' : n);

let db = doc();
let thuVien = [];
let vaiTro = (() => { try { return localStorage.getItem('kas-role') || 'THAY'; } catch { return 'THAY'; } })();
const laVanPhong = () => VAN_PHONG.includes(vaiTro);
const daKetNoi = () => !!ketNoi();
const goc = () => `${location.origin}${location.pathname}`;
const daChonDemo = () => { try { return !!window.KAS_DEMO || localStorage.getItem('kas-demo') === '1'; } catch { return !!window.KAS_DEMO; } };

// Lưu vào máy ngay, rồi hẹn gửi lên máy chủ (gom các thao tác liền nhau thành 1 lần gửi).
let henGui = null;
let mayChuCu = false; // máy chủ Apps Script chưa cập nhật bản có hợp đồng, thiết kế
function luu() { ghi(db); clearTimeout(henGui); henGui = setTimeout(chayDongBo, 800); }

async function chayDongBo() {
  if (!daKetNoi()) return;
  const r = await dongBo(db, () => ghi(db));
  if (r.biTuChoi && r.biTuChoi.length) bao('Máy chủ từ chối: ' + r.biTuChoi[0]);
  if (r.mayChuCu && !mayChuCu) bao('Máy chủ cần cập nhật bản mới để lưu hợp đồng, thiết kế. Dữ liệu vẫn giữ trên máy.');
  if (r.trangThai === 'xong') mayChuCu = !!r.mayChuCu;
  if (r.trangThai === 'loi') bao('Chưa gửi được: ' + r.loi);
  if (r.trangThai === 'xong' && db.toi) vaiTro = db.toi.vaiTro;
  if (navigator.onLine) await guiAnhCho(goi).catch((e) => bao('Ảnh chưa gửi được: ' + e.message));
  await capNhatTrangThai(r.trangThai);
  // Vẽ lại màn đang xem bằng dữ liệu mới, trừ khi đang mở hộp nhập liệu.
  if (r.trangThai === 'xong' && !$('#sheet').open) route();
}

async function capNhatTrangThai(tt) {
  const el = $('#sync');
  if (!el) return;
  if (!daKetNoi()) { el.textContent = 'Bản thử'; el.className = 'sync demo'; return; }
  const anh = await demCho();
  const cho = db.outbox.length + anh;
  const matMang = tt === 'mat-mang' || !navigator.onLine;
  el.textContent = matMang ? `Mất mạng${cho ? ' · chờ gửi ' + cho : ''}` : mayChuCu ? 'Cần cập nhật máy chủ' : cho ? `Đang gửi ${cho}` : 'Đã lưu';
  el.className = 'sync ' + (matMang || mayChuCu ? 'off' : cho ? 'cho' : 'ok');
}
function bao(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 2200); }

// ---------- Khung ----------
function khoiDongVaiTro() {
  const kn = ketNoi();
  if (kn) {
    vaiTro = (db.toi && db.toi.vaiTro) || kn.vaiTro;
    $('.topbar .role').innerHTML = `<span class="ten-nguoi">${esc(kn.ten || VAI_TRO[vaiTro])}</span>`;
    return;
  }
  const sel = $('#role');
  sel.innerHTML = Object.entries(VAI_TRO).map(([k, v]) => `<option value="${k}" ${k === vaiTro ? 'selected' : ''}>${v}</option>`).join('');
  sel.onchange = () => { vaiTro = sel.value; try { localStorage.setItem('kas-role', vaiTro); } catch {} route(); };
}

function datTab(tab, title) {
  document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === tab));
  document.querySelectorAll('.chi-van-phong').forEach((el) => { el.hidden = !laVanPhong(); });
  document.querySelectorAll('.chi-thay').forEach((el) => { el.hidden = !(daKetNoi() && laVanPhong()); });
  $('#title').textContent = title || '';
}

function route() {
  // #cong-trinh, #tao, #nguoi-dung, #ct-<mã DA>, #chu-nha-<mã link>[&api=<mã>], #k=<khoá>&api=<mã>
  const [h, ...thamSo] = location.hash.slice(1).split('&');
  const ts = Object.fromEntries(thamSo.map((x) => x.split('=')));
  if (h.startsWith('k=')) return nhanLinhDangNhap(h.slice(2), ts.api);
  const chuNha = h.startsWith('chu-nha-');
  $('#tabs').hidden = chuNha;
  $('.topbar .role').hidden = chuNha;
  $('#sync').hidden = chuNha;
  if (chuNha) return manChuNha(h.slice(8), ts.api);
  if (!daKetNoi() && !daChonDemo()) return manKetNoi();
  if (h === 'ket-noi') return manKetNoi();
  if (h.startsWith('ct-')) return manCongTrinh(h.slice(3));
  if (h.startsWith('sua-kh-')) return laVanPhong() ? manSuaKeHoach(h.slice(7)) : manHomNay();
  if (h === 'cong-trinh') return manDanhSach();
  if (h === 'tao') return laVanPhong() ? manTao() : manHomNay();
  if (h === 'khach') return laVanPhong() ? manKhach() : manHomNay();
  if (h.startsWith('kh-')) return laVanPhong() ? manMotKhach(h.slice(3)) : manHomNay();
  if (h === 'hop-dong') return laVanPhong() ? manHopDong() : manHomNay();
  if (h === 'tao-hd') return laVanPhong() ? manTaoHD() : manHomNay();
  if (h.startsWith('HD-')) return laVanPhong() ? manMotHD(h) : manHomNay();
  if (h.startsWith('xac-nhan-')) return laVanPhong() ? manXacNhan(h.slice(9)) : manHomNay();
  if (h === 'nguoi-dung') return laVanPhong() && daKetNoi() ? manNguoiDung() : manHomNay();
  return manHomNay();
}

// ---------- Hôm nay (điện thoại) ----------
function manHomNay() {
  datTab('hom-nay', 'Hôm nay ' + ddmm(homNay()));
  const v = $('#view');
  const hn = homNay();
  const khoiKhach = (laVanPhong() ? khachHomNay(hn) + tienHomNay(hn) : '') + thietKeHomNay(hn);
  const dangLam = db.congTrinh.filter((ct) => !congTrinhDaXong(db, ct.ma));
  if (!dangLam.length) {
    v.innerHTML = `${khoiKhach}<h2>Chưa có công trình nào</h2><p class="muted">${laVanPhong() ? 'Vào <b>Công trình</b> → <b>Tạo công trình</b>, hoặc tạo từ hồ sơ khách đã ký.' : 'Văn phòng chưa tạo công trình.'}</p>`;
    return;
  }
  v.innerHTML = khoiKhach + dangLam.map((ct) => {
    const ds = viecHomNay(ct, hn);
    const th = tongHop(ct, hn);
    return `<div class="dau-ct"><h3>${esc(ct.ma)} · ${esc(ct.ten)}</h3><a href="#ct-${esc(ct.ma)}" class="nho">Xem Gantt</a></div>
      <p class="muted">Thực tế ${th.pctThucTe}% · kế hoạch ${th.pctKeHoach}%${th.viecTre ? ` · <span class="tre">${th.viecTre} việc trễ</span>` : ''}</p>
      ${ds.length ? ds.map(({ v: x, t, nhan }) => theViec(ct, x, t, nhan)).join('') : '<p class="muted">Không có việc nào trong 3 ngày tới.</p>'}`;
  }).join('');
  v.querySelectorAll('[data-viec]').forEach((b) => { b.onclick = () => moViec(b.dataset.ct, b.dataset.viec); });
}

function theViec(ct, x, t, nhan) {
  const nhanChu = { TRE: `Trễ ${diffDays(t.ketThuc, homNay())} ngày`, DANG: 'Đang làm', SAP: `Bắt đầu ${ddmm(t.batDau)}` }[nhan];
  return `<button class="card" data-ct="${esc(ct.ma)}" data-viec="${esc(x.id)}">
    <div class="row"><span class="name">${esc(x.hangMuc)}</span><span class="tag ${nhan}">${nhanChu}</span></div>
    <div class="muted">${esc(x.nhom)} · ${ddmm(t.batDau)}–${ddmm(t.ketThuc)}${x.moc ? ` · Mốc: ${esc(x.moc)}` : ''}</div>
    <div class="bar"><i style="width:${x.phanTram}%"></i></div>
  </button>`;
}

// ---------- Chạm vào 1 việc ----------
function moViec(maCt, id) {
  const ct = db.congTrinh.find((c) => c.ma === maCt);
  const x = ct.viec.find((v) => v.id === id);
  const t = lichHienTai(ct).get(id);
  const d = $('#sheet');
  const lsu = db.lichSu.filter((e) => e.ma === maCt && e.viec === id).slice(-5).reverse();
  d.innerHTML = `<h2>${esc(x.hangMuc)}</h2>
    <p class="muted">${esc(x.nhom)}${x.dauViec ? ' · ' + esc(x.dauViec) : ''}<br>
      Kế hoạch gốc ${ddmm(x.goc.batDau)}–${ddmm(x.goc.ketThuc)} · hiện tại ${ddmm(t.batDau)}–${ddmm(t.ketThuc)} · ${x.soNgay} ngày công${x.khoiLuong != null && x.khoiLuong !== '' ? ` · ${esc(x.khoiLuong)} ${esc(x.dvt || '')}` : ''}${x.nhaThau ? ` · thầu ${esc(x.nhaThau)}` : ''}</p>
    <label class="f">Tiến độ</label>
    <div class="grid-btn">${[0, 25, 50, 75, 100].map((p) => `<button data-pct="${p}" class="${x.phanTram === p ? 'on' : ''}">${p === 100 ? 'Xong' : p + '%'}</button>`).join('')}</div>
    <label class="f">Ghi chú / phát sinh (bấm micro trên bàn phím để nói)</label>
    <div class="mic"><textarea id="ghiChu" placeholder="Vd: chủ nhà muốn thêm 2 ổ cắm bếp"></textarea><button id="noi" title="Nói">🎤</button></div>
    <div class="actions">
      <button id="luuGhiChu">Lưu ghi chú</button>
      <button id="luuPhatSinh">Báo phát sinh</button>
    </div>
    <div class="actions">
      <label class="btn" style="text-align:center">📷 Chụp ảnh<input id="anh" type="file" accept="image/*" capture="environment" multiple hidden></label>
      <button id="zalo">Gửi Zalo</button>
      <button id="cham" class="btn-do">Báo chậm</button>
    </div>
    ${laVanPhong() ? '<div class="actions"><button id="suaViec">✏️ Sửa việc: số ngày, khối lượng, thầu, việc đi trước</button></div>' : ''}
    ${lsu.length ? `<h3>Gần đây</h3>${lsu.map((e) => `<p class="muted">${ddmm(String(e.luc).slice(0, 10))} · ${esc(tenNguoi(e.nguoi))}: ${moTa(e)}</p>`).join('')}` : ''}
    <div class="actions"><button id="dong">Đóng</button></div>`;
  d.showModal();
  d.querySelectorAll('[data-pct]').forEach((b) => {
    b.onclick = () => { capNhatTienDo(db, ct, id, +b.dataset.pct, vaiTro, homNay()); luu(); d.close(); bao('Đã lưu tiến độ'); route(); };
  });
  $('#noi', d).onclick = () => noiThanhChu($('#ghiChu', d));
  $('#luuGhiChu', d).onclick = () => luuGhi(false);
  $('#luuPhatSinh', d).onclick = () => luuGhi(true);
  function luuGhi(ps) {
    const nd = $('#ghiChu', d).value.trim();
    if (!nd) return bao('Chưa có nội dung');
    ghiChu(db, ct, id, nd, vaiTro, ps); luu(); d.close(); bao(ps ? 'Đã báo phát sinh' : 'Đã lưu ghi chú');
  }
  $('#anh', d).onchange = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    if (!daKetNoi()) return bao(`${files.length} ảnh: bản thử chưa gửi lên Drive`);
    try {
      const n = await xepAnh(files, ct.ma, id);
      bao(`Đã lưu ${n} ảnh trên máy, đang gửi lên Drive`);
      chayDongBo();
    } catch (err) {
      bao('Không đọc được ảnh: ' + err.message);
    }
  };
  $('#zalo', d).onclick = () => chiaSe(`[${ct.ma}] ${x.hangMuc}\nLịch: ${ddmm(t.batDau)} – ${ddmm(t.ketThuc)}\nTiến độ: ${x.phanTram}%`);
  $('#cham', d).onclick = () => moBaoCham(ct, x);
  if ($('#suaViec', d)) $('#suaViec', d).onclick = () => moSuaViec(ct, id);
  $('#dong', d).onclick = () => d.close();
}

function moTa(e) {
  if (e.loai === 'TIEN_DO') return `tiến độ ${e.cu}% → ${e.moi}%`;
  if (e.loai === 'CHAM') return `chậm thêm ${e.moi - e.cu} ngày (${esc(e.nguyenNhan)})${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  if (e.loai === 'PHAT_SINH') return `phát sinh: ${esc(e.ghiChu)}`;
  if (e.loai === 'KH_TT') return `${esc(TRANG_THAI[e.cu] || e.cu)} → <b>${esc(TRANG_THAI[e.moi] || e.moi)}</b>${e.nguyenNhan ? ' (' + esc(e.nguyenNhan) + ')' : ''}${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  if (e.loai === 'KH_GOI') return `đã gọi, ${e.moi === 'CO' ? 'có tiến triển' : 'chưa được'}${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  if (e.loai === 'KH_CS') return `chăm sóc tháng ${esc(e.moi)}${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  return esc(e.ghiChu);
}

function moBaoCham(ct, x) {
  const d = $('#sheet');
  d.innerHTML = `<h2>Báo chậm: ${esc(x.hangMuc)}</h2>
    <label class="f">Chậm thêm bao nhiêu ngày công?</label>
    <div class="grid-btn">${[1, 2, 3, 5, 7].map((n) => `<button data-n="${n}">${n}</button>`).join('')}</div>
    <label class="f">Do đâu?</label>
    <select id="nn">${NGUYEN_NHAN.map((n) => `<option>${n}</option>`).join('')}</select>
    <label class="f">Ghi chú</label>
    <div class="mic"><textarea id="gc" placeholder="Vd: chủ nhà chưa chốt mẫu gạch"></textarea><button id="noi">🎤</button></div>
    <p id="anhHuong" class="note" hidden></p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh" disabled>Lưu</button></div>`;
  let n = 0;
  d.querySelectorAll('[data-n]').forEach((b) => {
    b.onclick = () => {
      n = +b.dataset.n;
      d.querySelectorAll('[data-n]').forEach((o) => o.classList.toggle('on', o === b));
      // Xem trước: các việc sau bị lùi bao nhiêu
      const truoc = lichHienTai(ct);
      const thu = { ...ct, viec: ct.viec.map((v) => (v.id === x.id ? { ...v, soNgay: v.soNgay + n } : v)) };
      const sau = lichHienTai(thu);
      const bi = ct.viec.filter((v) => v.id !== x.id && sau.get(v.id).ketThuc !== truoc.get(v.id).ketThuc);
      const kt = (m) => [...m.values()].reduce((a, b) => (b.ketThuc > a ? b.ketThuc : a), '');
      const p = $('#anhHuong', d);
      p.hidden = false;
      p.innerHTML = `${bi.length} việc sau sẽ lùi theo. Ngày xong công trình: ${ddmm(kt(truoc))} → <b>${ddmm(kt(sau))}</b>.`;
      $('#ok', d).disabled = false;
    };
  });
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    baoCham(db, ct, x.id, { soNgay: n, nguyenNhan: $('#nn', d).value, ghiChu: $('#gc', d).value.trim() }, vaiTro);
    luu(); d.close(); bao('Đã lưu, lịch đã lùi'); route();
  };
}

function noiThanhChu(o) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { o.focus(); return bao('Máy này chưa hỗ trợ, bấm micro trên bàn phím'); }
  const r = new SR();
  r.lang = 'vi-VN'; r.interimResults = false;
  r.onresult = (e) => { o.value = (o.value + ' ' + e.results[0][0].transcript).trim(); };
  r.onerror = () => bao('Không nghe được, thử lại hoặc dùng micro bàn phím');
  r.start(); bao('Đang nghe…');
}

async function chiaSe(text) {
  if (navigator.share) { try { await navigator.share({ text }); return; } catch { return; } }
  try { await navigator.clipboard.writeText(text); bao('Đã chép, dán vào Zalo'); } catch { bao('Không chia sẻ được'); }
}

// ---------- Danh sách / bảng tổng ----------
function manDanhSach() {
  datTab('cong-trinh', 'Công trình');
  const hn = homNay();
  const v = $('#view');
  const nutTao = laVanPhong() ? '<div class="actions"><a class="btn btn-chinh" href="#tao" style="text-align:center">+ Tạo công trình</a></div>' : '';
  if (!db.congTrinh.length) { v.innerHTML = '<p class="muted">Chưa có công trình.</p>' + nutTao; return; }
  const dangLam = db.congTrinh.filter((ct) => !congTrinhDaXong(db, ct.ma));
  const daXong = db.congTrinh.filter((ct) => congTrinhDaXong(db, ct.ma));
  v.innerHTML = `<h2>Bảng tổng ${dangLam.length} công trình</h2>
    <div class="wrap"><table>
      <tr><th>Công trình</th><th class="an-dt">Loại</th><th>Thực tế / KH</th><th>Việc trễ</th><th>Xong dự kiến</th></tr>
      ${dangLam.map((ct) => {
        const th = tongHop(ct, hn);
        const lech = diffDays(th.ketThucGoc, th.ketThuc);
        const dung = hdCuaCongTrinh(db, ct.ma).some((h) => h.trangThai === 'DUNG');
        return `<tr><td><a href="#ct-${esc(ct.ma)}"><b>${esc(ct.ma)}</b></a>${dung ? ' <span class="tag TRE">HĐ dừng</span>' : ''}<br><span class="muted">${esc(ct.ten)}</span></td>
          <td class="an-dt">${LOAI_HINH[ct.loai]}</td>
          <td class="so">${th.pctThucTe}% / ${th.pctKeHoach}%</td>
          <td class="so ${th.viecTre ? 'tre' : ''}">${th.viecTre}</td>
          <td class="so">${ddmm(th.ketThuc)}${lech > 0 ? `<br><span class="tre">+${lech} ngày</span>` : ''}</td></tr>`;
      }).join('')}
    </table></div>
    ${daXong.length ? `<details class="cham-ds"><summary>Đã hoàn thành (${daXong.length})</summary>${daXong.map((ct) => `<p><a href="#ct-${esc(ct.ma)}"><b>${esc(ct.ma)}</b></a> · ${esc(ct.ten)}</p>`).join('')}</details>` : ''}${nutTao}`;
}

// ---------- 1 công trình: Gantt ----------
function manCongTrinh(ma) {
  const ct = db.congTrinh.find((c) => c.ma === ma);
  if (!ct) return manDanhSach();
  datTab('cong-trinh', ct.ma);
  const hn = homNay();
  const th = tongHop(ct, hn);
  const lich = th.lich;
  const tu = ct.viec.reduce((m, v) => (v.goc.batDau < m ? v.goc.batDau : m), ct.khoiCong);
  const den = [th.ketThuc, th.ketThucGoc].sort().pop();
  const tong = Math.max(1, diffDays(tu, den) + 1);
  const pos = (a, b) => `left:${(diffDays(tu, a) / tong) * 100}%;width:${Math.max(0.6, ((diffDays(a, b) + 1) / tong) * 100)}%`;
  const lsCham = db.lichSu.filter((e) => e.ma === ma && e.loai === 'CHAM');
  const theoNN = NGUYEN_NHAN.map((n) => [n, lsCham.filter((e) => e.nguyenNhan === n).reduce((s, e) => s + e.moi - e.cu, 0)]).filter(([, s]) => s);
  let nhom = '';
  const rows = ct.viec.map((x) => {
    const t = lich.get(x.id);
    const g = x.nhom !== nhom ? `<div class="g-group">${esc((nhom = x.nhom))}</div>` : '';
    const cls = x.phanTram >= 100 ? 'xong' : t.ketThuc < hn ? 'tre' : '';
    return `${g}<div class="g-row" data-viec="${esc(x.id)}" data-ct="${esc(ct.ma)}" role="button" tabindex="0">
      <div class="g-name" title="${esc(x.hangMuc)}">${esc(x.hangMuc)}</div>
      <div class="g-track"><span class="g-goc" style="${pos(x.goc.batDau, x.goc.ketThuc)}"></span><span class="g-hien ${cls}" style="${pos(t.batDau, t.ketThuc)}"></span></div>
    </div>`;
  }).join('');
  const kn = ketNoi();
  const linkChuNha = linkChuNhaCua(ct);
  $('#view').innerHTML = `<h2>${esc(ct.ten)}</h2>
    <p class="muted">${LOAI_HINH[ct.loai]} · ${LICH[ct.lich.kieu]} · khởi công ${ddmm(ct.khoiCong)} · xong dự kiến <b>${ddmm(th.ketThuc)}</b> (gốc ${ddmm(th.ketThucGoc)})</p>
    <p>Thực tế <b>${th.pctThucTe}%</b> · kế hoạch ${th.pctKeHoach}% · ${th.viecTre ? `<span class="tre">${th.viecTre} việc trễ</span>` : 'không có việc trễ'}</p>
    ${theoNN.length ? `<p class="muted">Ngày chậm theo nguyên nhân: ${theoNN.map(([n, s]) => `${n} ${s}`).join(' · ')}</p>` : ''}
    ${lsCham.length && laVanPhong() ? `<details class="cham-ds"><summary>Các lần báo chậm (${lsCham.length}) · chọn lần nào cho chủ nhà xem</summary>
      ${lsCham.map((e) => `<label class="cham-dong"><input type="checkbox" data-cong-khai="${esc(e.id)}" ${e.congKhai ? 'checked' : ''}>
        <span>${ddmm(String(e.luc).slice(0, 10))} · ${esc(e.tenViec)}: +${e.moi - e.cu} ngày (${esc(e.nguyenNhan)})${e.ghiChu ? ' · ' + esc(e.ghiChu) : ''}</span></label>`).join('')}
    </details>` : ''}
    <div class="legend"><span><i style="background:var(--chinh)"></i>Hiện tại</span><span><i style="background:var(--goc)"></i>Kế hoạch gốc</span><span><i style="background:var(--tre)"></i>Trễ</span><span><i style="background:var(--dang)"></i>Xong</span><span><i style="background:var(--sap)"></i>Hôm nay</span></div>
    <div class="gantt">${rows}<span class="g-today" style="left:calc(34% + (66% - 10px) * ${Math.min(1, Math.max(0, diffDays(tu, hn) / tong))})"></span></div>
    <div class="actions">
      ${laVanPhong() ? `<a class="btn" href="#sua-kh-${esc(ct.ma)}" style="text-align:center">Sửa kế hoạch</a><button id="linkCN">Gửi link cho chủ nhà</button>` : ''}
      <a class="btn" href="#chu-nha-${ct.maLinkChuNha}${kn ? '&api=' + maApi(kn.api) : ''}" style="text-align:center">Xem như chủ nhà</a>
    </div>
    ${laVanPhong() ? khoiHDCongTrinh(ct) : ''}
    ${khoiThietKe(ct)}`;
  $('#view').querySelectorAll('[data-viec]').forEach((r) => { r.onclick = () => moViec(r.dataset.ct, r.dataset.viec); });
  $('#view').querySelectorAll('[data-cong-khai]').forEach((c) => {
    c.onchange = () => { datCongKhai(db, c.dataset.congKhai, c.checked); luu(); bao(c.checked ? 'Chủ nhà sẽ thấy lần chậm này' : 'Đã ẩn với chủ nhà'); };
  });
  const b = $('#linkCN');
  if (b) b.onclick = () => chiaSe(`KAS gửi anh/chị link theo dõi tiến độ công trình ${ct.ten}:\n${linkChuNha}`);
  ganNutThietKe(ct);
}

// ---------- Sửa kế hoạch (văn phòng, tiện nhất trên máy tính) ----------
const ketThucCuoi = (m) => [...m.values()].reduce((a, b) => (b.ketThuc > a ? b.ketThuc : a), '');
const tenViecTruoc = (ct, v) => {
  const ten = new Map(ct.viec.map((x, i) => [x.id, `${i + 1}. ${x.hangMuc}`]));
  return (v.diSau || []).filter((p) => ten.has(p.id))
    .map((p) => `${ten.get(p.id)}${p.kieu !== 'XS' ? ` (${KIEU_NOI[p.kieu].toLowerCase()})` : ''}${Number(p.goi) ? ` +${p.goi}n` : ''}`).join('; ');
};
const soHoacRong = (s) => (String(s).trim() === '' ? null : Number(String(s).replace(',', '.')));

function manSuaKeHoach(ma) {
  const ct = db.congTrinh.find((c) => c.ma === ma);
  if (!ct) return manDanhSach();
  datTab('cong-trinh', 'Sửa kế hoạch ' + ct.ma);
  const lich = lichHienTai(ct);
  const gocCuoi = ct.viec.reduce((m, v) => (v.goc && v.goc.ketThuc > m ? v.goc.ketThuc : m), ct.khoiCong);
  let nhom = '';
  const o = (v, f, cls = '', them = '') => `<input data-f="${f}" class="${cls}" value="${esc(v[f] ?? '')}" ${them}>`;
  const rows = ct.viec.map((v, i) => {
    const g = v.nhom !== nhom ? `<tr class="kh-nhom"><td colspan="9">${esc((nhom = v.nhom))}</td></tr>` : '';
    return `${g}<tr data-id="${esc(v.id)}">
      <td class="so muted">${i + 1}</td>
      <td class="kh-ten">${o(v, 'hangMuc')}</td>
      <td>${o(v, 'soNgay', 'o-so', 'type="number" min="0.5" step="0.5" inputmode="decimal"')}</td>
      <td><div class="kh-kl">${o(v, 'khoiLuong', 'o-so', 'inputmode="decimal"')}${o(v, 'dvt', 'o-dvt', 'placeholder="đv"')}</div></td>
      <td>${o(v, 'nhaThau', '', 'list="dsThau"')}</td>
      <td><button class="o-nut" data-chi-tiet>${esc(tenViecTruoc(ct, v)) || '<span class="muted">—</span>'}</button></td>
      <td class="so kh-ngay"></td>
      <td>${o(v, 'moc')}</td>
      <td class="kh-nut"><button data-chi-tiet title="Sửa chi tiết">✏️</button><button data-them-sau title="Thêm việc ngay sau">＋</button></td>
    </tr>`;
  }).join('');
  $('#view').innerHTML = `<h2>${esc(ct.ten)}</h2>
    <p class="muted">Khởi công ${fmtNgay(ct.khoiCong)} · ${LICH[ct.lich.kieu]}${(ct.lich.nghi || []).length ? ` · ${ct.lich.nghi.length} ngày nghỉ lễ` : ''}</p>
    <p id="khTong"></p>
    <p class="note">Sửa ô nào, bấm ra ngoài là lưu, các việc sau tự lùi hoặc tiến theo. Kế hoạch gốc (để so chậm) giữ nguyên, chỉ đổi khi bấm "Chốt kế hoạch gốc". Đổi việc đi trước, ngày cố định, nhóm: bấm ✏️.</p>
    <div class="actions khong-in">
      <button id="suaCT">Thông tin công trình, lịch nghỉ</button>
      <button id="chotGoc">Chốt kế hoạch gốc</button>
      <a class="btn" href="#ct-${esc(ct.ma)}" style="text-align:center">Xem Gantt</a>
    </div>
    <div class="wrap"><table class="kh">
      <tr><th>#</th><th>Hạng mục</th><th>Số ngày</th><th>Khối lượng</th><th>Nhà thầu</th><th>Đi sau</th><th>Lịch hiện tại</th><th>Mốc</th><th></th></tr>
      ${rows}
    </table></div>
    <div class="actions"><button id="themCuoi">＋ Thêm việc cuối</button></div>
    <datalist id="dsThau">${dsNhaThau(db).map((t) => `<option value="${esc(t)}">`).join('')}</datalist>`;
  const capNhatNgay = () => {
    const l = lichHienTai(ct);
    $('#view').querySelectorAll('tr[data-id]').forEach((tr) => {
      const v = ct.viec.find((x) => x.id === tr.dataset.id);
      const t = l.get(v.id);
      const lech = v.goc ? diffDays(v.goc.ketThuc, t.ketThuc) : 0;
      $('.kh-ngay', tr).innerHTML = `${ddmm(t.batDau)}–${ddmm(t.ketThuc)}${lech ? `<br><span class="${lech > 0 ? 'tre' : 'muted'}">${lech > 0 ? '+' : ''}${lech} ngày</span>` : ''}`;
    });
    const kt = ketThucCuoi(l);
    const lech = diffDays(gocCuoi, kt);
    $('#khTong').innerHTML = `Xong dự kiến <b>${fmtNgay(kt)}</b> · kế hoạch gốc ${fmtNgay(gocCuoi)}${lech ? ` (<span class="${lech > 0 ? 'tre' : ''}">${lech > 0 ? 'chậm' : 'sớm'} ${Math.abs(lech)} ngày</span>)` : ''}`;
  };
  capNhatNgay();
  $('#view').querySelectorAll('tr[data-id] input[data-f]').forEach((inp) => {
    inp.onchange = () => {
      const id = inp.closest('tr').dataset.id, f = inp.dataset.f;
      let val = inp.value.trim();
      if (f === 'soNgay') { val = soHoacRong(val); if (!(val > 0)) { bao('Số ngày phải lớn hơn 0'); inp.value = ct.viec.find((x) => x.id === id).soNgay; return; } }
      if (f === 'khoiLuong') val = soHoacRong(val);
      if (f === 'hangMuc' && !val) { bao('Hạng mục không được trống'); inp.value = ct.viec.find((x) => x.id === id).hangMuc; return; }
      if (suaViec(db, ct, id, { [f]: val }, vaiTro).length) { luu(); capNhatNgay(); bao('Đã lưu'); }
    };
  });
  $('#view').querySelectorAll('[data-chi-tiet]').forEach((b) => { b.onclick = () => moSuaViec(ct, b.closest('tr').dataset.id); });
  $('#view').querySelectorAll('[data-them-sau]').forEach((b) => { b.onclick = () => moThemViec(ct, b.closest('tr').dataset.id); });
  $('#themCuoi').onclick = () => moThemViec(ct, ct.viec.length ? ct.viec[ct.viec.length - 1].id : '');
  $('#suaCT').onclick = () => moSuaCT(ct);
  $('#chotGoc').onclick = () => moChotGoc(ct);
}

// Sửa đầy đủ 1 việc (cả trên điện thoại): tên, số ngày, việc đi trước, ngày cố định, xoá.
function moSuaViec(ct, id) {
  const x = ct.viec.find((v) => v.id === id);
  const d = $('#sheet');
  if (d.open) d.close();
  const khac = ct.viec.map((v, i) => [v, i]).filter(([v]) => v.id !== id);
  const nhoms = [...new Set(ct.viec.map((v) => v.nhom))];
  let sau = (x.diSau || []).map((p) => ({ ...p }));
  const dongSau = (p, k) => `<div class="kh-sau" data-k="${k}">
      <select data-p="id">${khac.map(([v, i]) => `<option value="${esc(v.id)}" ${v.id === p.id ? 'selected' : ''}>${i + 1}. ${esc(v.hangMuc)}</option>`).join('')}</select>
      <select data-p="kieu">${Object.entries(KIEU_NOI).map(([k2, t]) => `<option value="${k2}" ${k2 === p.kieu ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <input data-p="goi" type="number" step="1" inputmode="numeric" value="${Number(p.goi) || 0}" title="Cách bao nhiêu ngày công">
      <button data-bo="${k}" title="Bỏ">✕</button></div>`;
  d.innerHTML = `<h2>Sửa việc</h2>
    <label class="f">Hạng mục</label><input id="hm" value="${esc(x.hangMuc)}">
    <label class="f">Nhóm</label><input id="nhom" value="${esc(x.nhom)}" list="dsNhom"><datalist id="dsNhom">${nhoms.map((n) => `<option value="${esc(n)}">`).join('')}</datalist>
    <label class="f">Đầu việc / ghi chú kỹ thuật</label><input id="dv" value="${esc(x.dauViec || '')}">
    <div class="hai-cot">
      <div><label class="f">Số ngày công</label><input id="sn" type="number" min="0.5" step="0.5" inputmode="decimal" value="${x.soNgay}"></div>
      <div><label class="f">Khối lượng · đơn vị</label><div class="kh-kl"><input id="kl" inputmode="decimal" value="${x.khoiLuong ?? ''}"><input id="dvt" value="${esc(x.dvt || '')}" placeholder="m2"></div></div>
    </div>
    <label class="f">Nhà thầu</label><input id="thau" value="${esc(x.nhaThau || '')}" list="dsThau2"><datalist id="dsThau2">${dsNhaThau(db).map((t) => `<option value="${esc(t)}">`).join('')}</datalist>
    <label class="f">Mốc (vd: Nghiệm thu, Thu tiền đợt 2, GSTG)</label><input id="moc" value="${esc(x.moc || '')}">
    <label class="f">Làm sau việc nào</label>
    <p class="muted">Xong mới làm: bắt đầu sau khi việc trước xong. Gối đầu, cuốn chiếu: bắt đầu sau khi việc trước bắt đầu. Ô số: cách thêm bao nhiêu ngày công.</p>
    <div id="dsSau"></div>
    <button id="themSau" class="nho-nut">＋ Thêm việc đi trước</button>
    <label class="f">Ngày bắt đầu cố định (bỏ trống = theo việc đi trước)</label><input id="cd" type="date" value="${esc(x.batDauCoDinh || '')}">
    <label class="f">Lý do sửa (không bắt buộc)</label><input id="ld" placeholder="Vd: chủ nhà đổi vật liệu sàn">
    <p id="xem" class="note"></p>
    <div class="actions"><button id="xoa" class="btn-do">Xoá việc</button><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  const veSau = () => {
    $('#dsSau', d).innerHTML = sau.map(dongSau).join('') || '<p class="muted">Không đi sau việc nào (bắt đầu từ ngày khởi công).</p>';
    d.querySelectorAll('.kh-sau').forEach((r) => {
      r.querySelectorAll('[data-p]').forEach((s) => { s.onchange = () => { const p = sau[+r.dataset.k]; p[s.dataset.p] = s.dataset.p === 'goi' ? Number(s.value) || 0 : s.value; xem(); }; });
    });
    d.querySelectorAll('[data-bo]').forEach((b) => { b.onclick = () => { sau.splice(+b.dataset.bo, 1); veSau(); xem(); }; });
  };
  const layForm = () => ({
    hangMuc: $('#hm', d).value.trim(), nhom: $('#nhom', d).value.trim() || x.nhom, dauViec: $('#dv', d).value.trim(),
    soNgay: soHoacRong($('#sn', d).value), khoiLuong: soHoacRong($('#kl', d).value), dvt: $('#dvt', d).value.trim(),
    nhaThau: $('#thau', d).value.trim(), moc: $('#moc', d).value.trim(), batDauCoDinh: $('#cd', d).value,
    diSau: sau.filter((p, i) => p.id && sau.findIndex((q) => q.id === p.id) === i),
  });
  const xem = () => {
    const p = $('#xem', d);
    try {
      const td = layForm();
      if (!(td.soNgay > 0)) throw new Error('Số ngày phải lớn hơn 0');
      const r = xemTruoc(ct, id, td);
      const t = xepLich(ct.viec.map((v) => (v.id === id ? { ...v, ...td } : v)), ct.khoiCong, ct.lich).get(id);
      p.innerHTML = `Việc này: ${ddmm(t.batDau)}–${ddmm(t.ketThuc)}. Xong công trình: ${ddmm(r.truoc)}${r.sau !== r.truoc ? ` → <b>${ddmm(r.sau)}</b>` : ' (không đổi)'}.`;
      $('#ok', d).disabled = false;
    } catch (e) {
      p.innerHTML = `<span class="tre">${esc(/vòng tròn/.test(e.message) ? 'Không lưu được: các việc đang đi sau nhau thành vòng tròn. Bỏ bớt 1 việc đi trước.' : e.message)}</span>`;
      $('#ok', d).disabled = true;
    }
  };
  veSau(); xem();
  d.querySelectorAll('input').forEach((i) => { if (!i.closest('.kh-sau')) i.oninput = xem; });
  $('#themSau', d).onclick = () => {
    if (!khac.length) return;
    const i = ct.viec.findIndex((v) => v.id === id);
    sau.push({ id: (ct.viec[i - 1] || khac[0][0]).id, kieu: 'XS', goi: 0 }); veSau(); xem();
  };
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const td = layForm();
    if (!td.hangMuc) return bao('Hạng mục không được trống');
    try {
      const doi = suaViec(db, ct, id, td, vaiTro, $('#ld', d).value.trim());
      d.close();
      if (doi.length) { luu(); bao('Đã lưu, lịch đã tính lại'); } else bao('Không có gì thay đổi');
      route();
    } catch (e) { bao(e.message); }
  };
  let bamXoa = false;
  $('#xoa', d).onclick = () => {
    const sauNo = ct.viec.filter((v) => (v.diSau || []).some((p) => p.id === id)).length;
    if (!bamXoa) {
      bamXoa = true;
      $('#xoa', d).textContent = 'Bấm lần nữa để xoá';
      $('#xem', d).innerHTML = `${x.phanTram ? `<b class="tre">Việc đã làm ${x.phanTram}%.</b> ` : ''}Xoá "${esc(x.hangMuc)}"${sauNo ? `: ${sauNo} việc đi sau nó sẽ nối thẳng vào việc trước nó` : ''}. Nhật ký cũ vẫn giữ.`;
      return;
    }
    xoaViec(db, ct, id, vaiTro, $('#ld', d).value.trim());
    luu(); d.close(); bao('Đã xoá việc'); route();
  };
}

function moThemViec(ct, sauId) {
  const d = $('#sheet');
  if (d.open) d.close();
  const nhoms = [...new Set(ct.viec.map((v) => v.nhom))];
  const truocDo = ct.viec.find((v) => v.id === sauId);
  d.innerHTML = `<h2>Thêm việc</h2>
    <label class="f">Hạng mục</label><input id="hm" placeholder="Vd: Chống thấm WC tầng 2">
    <label class="f">Làm ngay sau việc</label>
    <select id="sau">${ct.viec.map((v, i) => `<option value="${esc(v.id)}" ${v.id === sauId ? 'selected' : ''}>${i + 1}. ${esc(v.hangMuc)}</option>`).join('')}</select>
    <label class="f">Nhóm</label><input id="nhom" value="${esc(truocDo ? truocDo.nhom : '')}" list="dsNhom"><datalist id="dsNhom">${nhoms.map((n) => `<option value="${esc(n)}">`).join('')}</datalist>
    <div class="hai-cot">
      <div><label class="f">Số ngày công</label><input id="sn" type="number" min="0.5" step="0.5" inputmode="decimal" value="1"></div>
      <div><label class="f">Nhà thầu</label><input id="thau" list="dsThau3"><datalist id="dsThau3">${dsNhaThau(db).map((t) => `<option value="${esc(t)}">`).join('')}</datalist></div>
    </div>
    <label class="f">Mốc (không bắt buộc)</label><input id="moc">
    <p class="muted">Việc mới tính là xong mới làm sau việc đã chọn. Muốn gối đầu hay đổi việc đi trước: lưu xong bấm ✏️. Việc thêm sau lấy luôn lịch hiện tại làm kế hoạch gốc.</p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Thêm</button></div>`;
  d.showModal();
  $('#sau', d).onchange = () => { const v = ct.viec.find((y) => y.id === $('#sau', d).value); if (v) $('#nhom', d).value = v.nhom; };
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const hangMuc = $('#hm', d).value.trim(), soNgay = soHoacRong($('#sn', d).value);
    if (!hangMuc) return bao('Cần tên hạng mục');
    if (!(soNgay > 0)) return bao('Số ngày phải lớn hơn 0');
    themViec(db, ct, { hangMuc, soNgay, sauId: $('#sau', d).value, nhom: $('#nhom', d).value.trim(), nhaThau: $('#thau', d).value.trim(), moc: $('#moc', d).value.trim() }, vaiTro);
    luu(); d.close(); bao('Đã thêm việc'); route();
  };
}

// Danh sách ngày từ a đến b (tối đa 60 ngày, đủ cho Tết).
const khoangNgay = (a, b) => { const ds = []; for (let x = a; x <= (b || a) && ds.length < 60; x = addDays(x, 1)) ds.push(x); return ds; };

function moSuaCT(ct) {
  const d = $('#sheet');
  if (d.open) d.close();
  let nghi = [...(ct.lich.nghi || [])].sort();
  const daLam = ct.viec.some((v) => v.phanTram > 0);
  d.innerHTML = `<h2>Thông tin công trình</h2>
    <label class="f">Tên công trình</label><input id="ten" value="${esc(ct.ten)}">
    <label class="f">Chủ nhà</label><input id="cn" value="${esc(ct.chuNha || '')}">
    <div class="hai-cot">
      <div><label class="f">Ngày khởi công</label><input id="kc" type="date" value="${esc(ct.khoiCong)}"></div>
      <div><label class="f">Lịch làm việc</label><select id="lich">${Object.entries(LICH).map(([k, v]) => `<option value="${k}" ${k === ct.lich.kieu ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
    </div>
    <label class="f">Ngày nghỉ (lễ, Tết, chủ nhà yêu cầu nghỉ)</label>
    <div id="dsNghi" class="nghi"></div>
    <div class="hai-cot kh-them-nghi">
      <div><span class="muted">Từ ngày</span><input id="tu" type="date"></div><div><span class="muted">Đến ngày (nghỉ 1 ngày thì bỏ trống)</span><input id="den" type="date"></div>
    </div>
    <button id="themNghi" class="nho-nut">＋ Thêm ngày nghỉ (từ – đến)</button>
    <label class="f">Link thư mục Drive</label><input id="drive" value="${esc(ct.thuMucDrive || '')}" placeholder="Dán link thư mục">
    <label class="cham-dong"><input type="checkbox" id="chot" ${daLam ? '' : 'checked'}><span>Chốt luôn kế hoạch gốc theo lịch mới${daLam ? ' (công trình đã có việc làm, thường không nên)' : ' (chưa làm việc nào)'}</span></label>
    <p id="xem" class="note"></p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  const lichMoi = () => ({ ...ct.lich, kieu: $('#lich', d).value, nghi });
  const xem = () => {
    const a = ketThucCuoi(lichHienTai(ct));
    const b = ketThucCuoi(xepLich(ct.viec, $('#kc', d).value || ct.khoiCong, lichMoi()));
    $('#xem', d).innerHTML = `Xong công trình: ${ddmm(a)}${a !== b ? ` → <b>${ddmm(b)}</b>` : ' (không đổi)'}.`;
  };
  const veNghi = () => {
    $('#dsNghi', d).innerHTML = nghi.length ? nghi.map((n) => `<span class="chip">${ddmm(n)}/${n.slice(2, 4)}<button data-bo="${n}" title="Bỏ">✕</button></span>`).join('') : '<span class="muted">Chưa có ngày nghỉ nào.</span>';
    d.querySelectorAll('[data-bo]').forEach((b) => { b.onclick = () => { nghi = nghi.filter((n) => n !== b.dataset.bo); veNghi(); xem(); }; });
  };
  veNghi(); xem();
  ['kc', 'lich'].forEach((k) => { $('#' + k, d).onchange = xem; });
  $('#themNghi', d).onclick = () => {
    const tu = $('#tu', d).value, den = $('#den', d).value;
    if (!tu) return bao('Chọn ngày bắt đầu nghỉ');
    if (den && den < tu) return bao('Ngày kết thúc trước ngày bắt đầu');
    nghi = [...new Set([...nghi, ...khoangNgay(tu, den)])].sort();
    $('#tu', d).value = ''; $('#den', d).value = '';
    veNghi(); xem();
  };
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const ten = $('#ten', d).value.trim(), khoiCong = $('#kc', d).value;
    if (!ten || !khoiCong) return bao('Cần tên và ngày khởi công');
    const lich = lichMoi(), chot = $('#chot', d).checked;
    const thayDoi = { ten, khoiCong, lich, chuNha: $('#cn', d).value.trim(), thuMucDrive: $('#drive', d).value.trim() };
    d.close();
    // Lịch mới có thể rơi vào ngày lễ chưa hỏi: hỏi như lúc tạo công trình.
    const den = ketThucCuoi(xepLich(ct.viec, khoiCong, lich));
    hoiNgayLe(leCanHoi(khoiCong, den, lich), (nghiLe, daHoi) => {
      lich.nghi = [...new Set([...lich.nghi, ...nghiLe])].sort();
      lich.daHoi = [...new Set([...(lich.daHoi || []), ...daHoi])];
      const doi = suaCongTrinh(db, ct, thayDoi, vaiTro);
      if (chot && doi.some((k) => k === 'khoiCong' || k === 'lich')) chotKeHoachGoc(db, ct, vaiTro, 'Đổi khởi công / lịch trước khi làm');
      if (doi.length) { luu(); bao('Đã lưu thông tin công trình'); } else bao('Không có gì thay đổi');
      route();
    });
  };
}

function moChotGoc(ct) {
  const d = $('#sheet');
  if (d.open) d.close();
  const hien = ketThucCuoi(lichHienTai(ct));
  const gocCuoi = ct.viec.reduce((m, v) => (v.goc && v.goc.ketThuc > m ? v.goc.ketThuc : m), ct.khoiCong);
  d.innerHTML = `<h2>Chốt kế hoạch gốc</h2>
    <p>Lịch hiện tại (xong <b>${fmtNgay(hien)}</b>) sẽ thành kế hoạch gốc mới, thay cho gốc cũ (xong ${fmtNgay(gocCuoi)}).</p>
    <p class="muted">Dùng khi sửa xong kế hoạch trước khởi công, hoặc khi ký phụ lục đổi tiến độ với chủ nhà. Sau khi chốt, các việc đang chậm sẽ không còn hiện là chậm so với gốc. Các lần báo chậm và nhật ký cũ vẫn giữ nguyên.</p>
    <label class="f">Lý do</label><input id="ld" placeholder="Vd: phụ lục 01 đổi tiến độ">
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Chốt</button></div>`;
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => { chotKeHoachGoc(db, ct, vaiTro, $('#ld', d).value.trim()); luu(); d.close(); bao('Đã chốt kế hoạch gốc mới'); route(); };
}

function linkChuNhaCua(ct) {
  const kn = ketNoi();
  return `${goc()}#chu-nha-${ct.maLinkChuNha}${kn ? '&api=' + maApi(kn.api) : ''}`;
}

// ---------- Link chủ nhà (không đăng nhập) ----------
async function manChuNha(maLink, api) {
  $('#title').textContent = 'Tiến độ công trình';
  let ct = db.congTrinh.find((c) => c.maLinkChuNha === maLink);
  let lichSu = db.lichSu;
  let phuongAn = ct ? paCuaCongTrinh(db, ct.ma) : [];
  if (api) {
    // Máy chủ nhà: lấy thẳng từ máy chủ, chỉ phần chủ nhà được xem.
    $('#view').innerHTML = '<p class="muted">Đang tải…</p>';
    try { ({ ct, lichSu, phuongAn = [] } = await xemChuNha(api, maLink)); } catch (e) { ct = null; }
  }
  if (!ct) { $('#view').innerHTML = '<p>Link không đúng hoặc đã hết hạn. Anh/chị liên hệ KAS để nhận link mới.</p>'; return; }
  const hn = homNay();
  const th = tongHop(ct, hn);
  const tenNhom = (n) => n.replace(/\s*\(.*\)$/, '');
  const nhomDs = [...new Set(ct.viec.map((v) => tenNhom(v.nhom)))].filter((n) => n !== 'Thiết kế');
  const chamCongKhai = lichSu.filter((e) => e.ma === ct.ma && e.loai === 'CHAM' && e.congKhai);
  $('#view').innerHTML = `<h2>${esc(ct.ten)}</h2>
    <p>Đã hoàn thành <b>${th.pctThucTe}%</b> · dự kiến bàn giao <b>${ddmm(th.ketThuc)}</b></p>
    <div class="bar"><i style="width:${th.pctThucTe}%"></i></div>
    <h3>Theo hạng mục</h3>
    ${nhomDs.map((n) => {
      const vs = ct.viec.filter((v) => tenNhom(v.nhom) === n);
      const w = vs.reduce((s, v) => s + v.soNgay, 0);
      const p = Math.round(vs.reduce((s, v) => s + (v.soNgay * v.phanTram) / 100, 0) / w * 100);
      return `<div class="card"><div class="row"><span class="name">${esc(n)}</span><span>${p}%</span></div><div class="bar"><i style="width:${p}%"></i></div></div>`;
    }).join('')}
    <h3>Các mốc</h3>
    ${ct.viec.filter((v) => v.moc).map((v) => `<p>${ddmm(th.lich.get(v.id).ketThuc)} · ${esc(v.moc)} ${v.phanTram >= 100 ? '<span class="tag XONG">Đã xong</span>' : ''}</p>`).join('')}
    ${chamCongKhai.length ? `<h3>Điều chỉnh tiến độ</h3>${chamCongKhai.map((e) => `<p class="muted">${ddmm(String(e.luc).slice(0, 10))} · ${esc(e.tenViec)}: +${e.moi - e.cu} ngày (${esc(e.nguyenNhan)})</p>`).join('')}` : ''}
    ${phuongAn.length ? `<h3>Phương án thiết kế</h3>${phuongAn.slice().reverse().map((p) => `<div class="card">
      <div class="row"><span class="name">${esc(p.hangMuc)} · ${tenLan(p.lan)}</span><span class="tag ${{ CHO: 'SAP', SUA: 'TRE', DUYET: 'DANG' }[p.trangThai]}">${p.trangThai === 'CHO' ? 'Chờ anh/chị duyệt' : p.trangThai === 'DUYET' ? 'Đã đồng ý' : 'Đã yêu cầu sửa'}</span></div>
      <div class="muted">KAS gửi ${ddmm(p.ngayGui)}${p.ngayPhanHoi ? ` · anh/chị trả lời ${ddmm(p.ngayPhanHoi)}` : ''}${p.link ? ` · <a href="${esc(p.link)}" target="_blank" rel="noopener">Xem hồ sơ</a>` : ''}</div>
      ${p.yKien ? `<p class="muted">Ý kiến: ${esc(p.yKien)}</p>` : ''}
      ${p.trangThai === 'CHO' ? `<div class="actions"><button data-pa-sua="${esc(p.id)}">Cần sửa</button><button data-pa-ok="${esc(p.id)}" class="btn-chinh">Đồng ý phương án này</button></div>` : ''}
    </div>`).join('')}` : ''}
    <p class="muted">Cập nhật bởi KAS Houzing.</p>`;
  // Chủ nhà trả lời phương án: có máy chủ thì gửi thẳng, bản thử thì ghi trên máy.
  const traLoi = async (id, ketQua, yKien) => {
    try {
      if (api) await chuNhaPhanHoi(api, { maLink, id, ketQua, yKien });
      else { const p = (db.phuongAn || []).find((x) => x.id === id); phanHoi(db, ct, p, { ketQua, yKien, qua: 'LINK', ngay: homNay() }, 'CHU_NHA'); luu(); }
      bao(ketQua === 'DUYET' ? 'Cảm ơn anh/chị. KAS đã nhận xác nhận.' : 'KAS đã nhận ý kiến, sẽ chỉnh và gửi lại.');
      manChuNha(maLink, api);
    } catch (e) { bao('Chưa gửi được: ' + e.message); }
  };
  $('#view').querySelectorAll('[data-pa-ok]').forEach((b) => {
    b.onclick = () => {
      if (b.dataset.chac !== '1') { b.dataset.chac = '1'; b.textContent = 'Bấm lần nữa để xác nhận đồng ý'; return; }
      b.disabled = true; traLoi(b.dataset.paOk, 'DUYET', '');
    };
  });
  $('#view').querySelectorAll('[data-pa-sua]').forEach((b) => {
    b.onclick = () => {
      const d = $('#sheet');
      d.innerHTML = `<h2>Anh/chị muốn sửa gì?</h2>
        <div class="mic"><textarea id="yk" placeholder="Vd: đổi màu tủ bếp sang trắng, bỏ vách kính phòng ngủ"></textarea><button id="noi">🎤</button></div>
        <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Gửi KAS</button></div>`;
      d.showModal();
      $('#noi', d).onclick = () => noiThanhChu($('#yk', d));
      $('#huy', d).onclick = () => d.close();
      $('#ok', d).onclick = () => { const yk = $('#yk', d).value.trim(); if (!yk) return bao('Anh/chị ghi giúp nội dung cần sửa'); d.close(); traLoi(b.dataset.paSua, 'SUA', yk); };
    };
  });
}

// ---------- Tạo công trình (văn phòng) ----------
// Mã dự án: TK / NT / XD / TG-TÊN-YYMM. TG = trọn gói (thiết kế + thi công, hoặc thi công cả kiến trúc + nội thất).
const DAU_MA = { TK: 'TK', XM: 'XD', CT: 'XD', NTCT: 'NT', NT: 'NT' };
const LOAI_HD = { TK: 'TK · thiết kế', NT: 'NT · nội thất', XD: 'XD · xây dựng', TG: 'TG · trọn gói' };
let tuKhach = null; // hồ sơ khách đang chuyển thành công trình

function goiYMa(loai, tenNgan) {
  const yymm = homNay().slice(2, 4) + homNay().slice(5, 7);
  return `${DAU_MA[loai] || 'NT'}-${tenNgan || ''}-${yymm}`;
}

function manTao() {
  datTab('cong-trinh', 'Tạo công trình');
  const kh = tuKhach && (db.khach || []).find((k) => k.ma === tuKhach);
  const loaiDau = kh && LOAI_HINH[kh.nhuCau && kh.nhuCau.loai] ? kh.nhuCau.loai : 'NTCT';
  const tenNgan = kh ? kh.ma.split('-')[2] : '';
  $('#view').innerHTML = `<h2>Tạo công trình từ thư viện</h2>
    ${kh ? `<p class="note">Từ hồ sơ khách <b>${esc(kh.ten)}</b> (${esc(kh.ma)}). Ảnh khảo sát và ghi chú vẫn giữ trong hồ sơ khách.</p>` : ''}
    <label class="f">Loại hình</label>
    <select id="loai">${Object.entries(LOAI_HINH).map(([k, v]) => `<option value="${k}" ${k === loaiDau ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <label class="f">Loại hợp đồng</label>
    <select id="dauMa">${Object.entries(LOAI_HD).map(([k, v]) => `<option value="${k}" ${k === (DAU_MA[loaiDau] || 'NT') ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <label class="f">Mã dự án</label><input id="ma" value="${esc(goiYMa(loaiDau, tenNgan))}">
    <label class="f">Tên công trình</label><input id="ten" value="${esc(kh ? kh.ten : '')}" placeholder="Vd: Căn hộ chị Xuân, Xa La">
    <label class="f">Ngày khởi công</label><input id="kc" type="date" value="${homNay()}">
    <label class="f">Lịch làm việc</label>
    <select id="lich">${Object.entries(LICH).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
    <label class="f">Link thư mục Drive của công trình</label><input id="drive" placeholder="Dán link thư mục, để trống thì app tự tạo">
    <p id="xemTruoc" class="muted"></p>
    <div class="actions"><button id="tao" class="btn-chinh">Tạo công trình</button></div>`;
  const xem = () => {
    const n = thuVien.filter((r) => r.loai.split(/\s+/).includes($('#loai').value)).length;
    $('#xemTruoc').textContent = `${n} việc sẽ được tạo sẵn. Sau khi tạo, chạm vào từng việc để sửa.`;
  };
  // Đổi loại thì đổi đầu mã, giữ phần tên Thầy đã gõ. Trọn gói (TG) Thầy chọn tay.
  const datDau = (dau) => { const m = $('#ma').value.split('-'); m[0] = dau; $('#ma').value = m.join('-'); };
  $('#loai').onchange = () => {
    xem();
    if ($('#dauMa').value !== 'TG') { $('#dauMa').value = DAU_MA[$('#loai').value] || 'NT'; datDau($('#dauMa').value); }
  };
  $('#dauMa').onchange = () => datDau($('#dauMa').value);
  xem();
  $('#tao').onclick = () => {
    const ma = $('#ma').value.trim().toUpperCase(), ten = $('#ten').value.trim();
    if (!ma || !ten) return bao('Cần mã và tên công trình');
    if (!/^[A-Z0-9-]+$/.test(ma)) return bao('Mã chỉ gồm chữ không dấu, số và gạch ngang');
    if (/^KH-/.test(ma)) return bao('Mã KH- dành cho khách hàng, chọn mã khác');
    if (db.congTrinh.some((c) => c.ma === ma)) return bao('Mã này đã có');
    const lich = { kieu: $('#lich').value, nghi: [], daHoi: [] };
    const loai = $('#loai').value, khoiCong = $('#kc').value;
    // Tạo thử để biết khoảng thời gian, rồi hỏi các ngày lễ nằm trong đó.
    const thu = { db: { congTrinh: [], lichSu: [], outbox: [] } };
    const tam = taoCongTrinh(thu.db, thuVien, { ma, ten, loai, khoiCong, lich });
    const den = tam.viec.reduce((m, v) => (v.goc.ketThuc > m ? v.goc.ketThuc : m), khoiCong);
    hoiNgayLe(leCanHoi(khoiCong, den, lich), (nghi, daHoi) => {
      lich.nghi = nghi; lich.daHoi = daHoi;
      const ct = taoCongTrinh(db, thuVien, { ma, ten, loai, khoiCong, lich, thuMucDrive: $('#drive').value.trim(), maKhach: kh ? kh.ma : '', chuNha: kh ? kh.ten : '' });
      if (kh) ganCongTrinh(db, kh, ct.ma, vaiTro, homNay());
      tuKhach = null;
      luu(); bao('Đã tạo ' + ct.ma + (kh ? '. Nhập hợp đồng' : ''));
      if (kh) { taoHDTu = { maKhach: kh.ma, maCongTrinh: ct.ma }; location.hash = '#tao-hd'; } else location.hash = '#ct-' + ct.ma;
    });
  };
}

function hoiNgayLe(ds, xong) {
  if (!ds.length) return xong([], []);
  const d = $('#sheet');
  d.innerHTML = `<h2>Công trình vướng ngày lễ</h2>
    <p class="muted">Tick những ngày công trình nghỉ thực tế. Ngày không tick sẽ tính là ngày làm.</p>
    ${ds.map((n) => `<label class="card" style="display:flex;gap:10px;align-items:center"><input type="checkbox" value="${n}" checked style="width:auto"> ${ddmm(n)}/${n.slice(0, 4)}</label>`).join('')}
    <p class="muted">Tết âm lịch, Giỗ Tổ: thêm sau trong Sửa kế hoạch → Thông tin công trình, lịch nghỉ.</p>
    <div class="actions"><button id="ok" class="btn-chinh">Xếp lịch</button></div>`;
  d.showModal();
  $('#ok', d).onclick = () => {
    const nghi = [...d.querySelectorAll('input:checked')].map((i) => i.value);
    d.close(); xong(nghi, ds);
  };
}

// ---------- Kết nối máy chủ ----------
async function nhanLinhDangNhap(khoa, api) {
  $('#view').innerHTML = '<p class="muted">Đang đăng nhập…</p>';
  try {
    await ketNoiVoi(api, khoa);
    history.replaceState(null, '', goc() + '#hom-nay');
    route();
  } catch (e) {
    $('#view').innerHTML = `<h2>Không đăng nhập được</h2><p>${esc(e.message)}</p><p class="muted">Xin Thầy gửi lại link mới qua Zalo.</p>`;
  }
}

async function ketNoiVoi(api, khoa) {
  const kn = { api: maApi(api), khoa };
  const toi = await goi('toiLaAi', {}, kn);
  const cu = ketNoi();
  // Đổi tài khoản hoặc chuyển từ bản thử: xoá dữ liệu cũ trên máy, lấy lại từ máy chủ.
  if (!cu || cu.khoa !== khoa) { db = rong(); ghi(db); }
  luuKetNoi({ ...kn, ten: toi.ten, vaiTro: toi.vaiTro });
  vaiTro = toi.vaiTro;
  khoiDongVaiTro();
  bao('Xin chào ' + toi.ten);
  await chayDongBo();
}

function manKetNoi() {
  datTab('', 'Kết nối');
  const kn = ketNoi();
  $('#view').innerHTML = `<h2>Kết nối máy chủ KAS</h2>
    <p class="muted">Anh em hiện trường chỉ cần mở link Thầy gửi qua Zalo, không cần màn này. Màn này để Thầy kết nối lần đầu.</p>
    <label class="f">Link máy chủ (Web app URL trong Apps Script)</label>
    <input id="api" value="${esc(kn ? kn.api : '')}" placeholder="https://script.google.com/macros/s/…/exec">
    <label class="f">Khoá của Thầy (trong nhật ký khi chạy setup)</label>
    <input id="khoa" value="" autocomplete="off">
    <div class="actions"><button id="kn" class="btn-chinh">Kết nối</button></div>
    ${kn ? '<div class="actions"><button id="thoat" class="btn-do">Đăng xuất khỏi máy này</button></div>' : '<div class="actions"><button id="demo">Dùng thử không kết nối</button></div>'}`;
  $('#kn').onclick = async () => {
    const api = $('#api').value.trim(), khoa = $('#khoa').value.trim();
    if (!api || !khoa) return bao('Cần cả link máy chủ và khoá');
    $('#kn').disabled = true;
    try { await ketNoiVoi(api, khoa); location.hash = '#hom-nay'; } catch (e) { bao(e.message); $('#kn').disabled = false; }
  };
  const t = $('#thoat');
  if (t) t.onclick = () => { luuKetNoi(null); db = rong(); ghi(db); location.reload(); };
  const dm = $('#demo');
  if (dm) dm.onclick = () => { try { localStorage.setItem('kas-demo', '1'); } catch {} if (thuVien.length && !db.congTrinh.length) taoMau(); location.hash = '#hom-nay'; route(); };
}

// ---------- Người dùng (chỉ Thầy) ----------
function manNguoiDung() {
  datTab('nguoi-dung', 'Người dùng');
  const kn = ketNoi();
  const ds = (db.nguoiDung || []).filter((u) => u.hoatDong === true);
  const linkCua = (khoa) => `${goc()}#k=${khoa}&api=${maApi(kn.api)}`;
  $('#view').innerHTML = `<h2>Người dùng app</h2>
    <p class="muted">Mỗi người 1 link riêng. Gửi qua Zalo, người đó mở 1 lần là điện thoại nhớ. Mất máy hoặc nghỉ việc thì bấm Thu hồi.</p>
    ${ds.map((u) => `<div class="card"><div class="row"><span class="name">${esc(u.ten)}</span><span class="tag ${u.vaiTro === 'TAM' ? 'SAP' : 'XONG'}">${esc(VAI_TRO[u.vaiTro] || u.vaiTro)}</span></div>
      <div class="muted">${esc(u.email)}${u.congTrinh ? ' · ' + esc(u.congTrinh) : ''}${u.hetHan ? ` · ${u.hetHan < homNay() ? '<span class="tre">đã hết hạn</span>' : 'đến ' + ddmm(u.hetHan)}` : ''}</div>
      ${u.khoa === kn.khoa ? '<p class="muted">Đây là bạn</p>'
        : u.vaiTro === 'THAY' && vaiTro !== 'THAY' ? ''
        : `<div class="actions"><button data-gui="${esc(u.khoa)}" data-ten="${esc(u.ten)}">Gửi lại link</button><button class="btn-do" data-thu-hoi="${esc(u.khoa)}">Thu hồi</button></div>`}</div>`).join('')}
    <h3>Thêm người</h3>
    <label class="f">Tên</label><input id="ten" placeholder="Vd: Kha">
    <label class="f">Gmail</label><input id="email" type="email" placeholder="kha@gmail.com">
    <label class="f">Vai trò</label>
    <select id="vt">${Object.entries(VAI_TRO).filter(([k]) => k !== 'THAY').map(([k, v]) => `<option value="${k}" ${k === 'KHA' ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <p class="muted" id="vtGiaiThich"></p>
    <div id="hanChon" hidden><label class="f">Hết hạn ngày</label><input id="hetHan" type="date" value="${new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)}"></div>
    <div id="ctChon"><label class="f">Công trình được giao (chỉ thấy các công trình này, không thấy tiền và sổ khách)</label>
    ${db.congTrinh.map((c) => `<label class="cham-dong"><input type="checkbox" value="${esc(c.ma)}"> <span>${esc(c.ma)} · ${esc(c.ten)}</span></label>`).join('') || '<p class="muted">Chưa có công trình.</p>'}</div>
    <div class="actions"><button id="them" class="btn-chinh">Tạo link</button></div>`;
  const ctChon = $('#ctChon');
  const GIAI_THICH = { DUC: 'Toàn quyền như Thầy: sổ khách, tiền, người dùng.', KHA: 'Giám sát: cập nhật tiến độ, ảnh, báo chậm ở công trình được giao.', TAM: 'Cho người làm việc lẻ (thợ, cộng tác viên). Như giám sát nhưng tự khoá khi hết hạn.' };
  const doiVt = () => { const vt = $('#vt').value; ctChon.hidden = vt === 'DUC'; $('#hanChon').hidden = vt !== 'TAM'; $('#vtGiaiThich').textContent = GIAI_THICH[vt] || ''; };
  $('#vt').onchange = doiVt; doiVt();
  $('#view').querySelectorAll('[data-gui]').forEach((b) => {
    b.onclick = () => chiaSe(`${b.dataset.ten} ơi, đây là link app KAS của em. Mở 1 lần bằng Chrome, rồi bấm "Thêm vào màn hình chính":\n${linkCua(b.dataset.gui)}`);
  });
  $('#view').querySelectorAll('[data-thu-hoi]').forEach((b) => {
    b.onclick = async () => {
      if (b.dataset.chac !== '1') { b.dataset.chac = '1'; b.textContent = 'Bấm lần nữa để thu hồi'; return; }
      try { await goi('thuHoi', { khoa: b.dataset.thuHoi }); bao('Đã thu hồi'); await chayDongBo(); manNguoiDung(); } catch (e) { bao(e.message); }
    };
  });
  $('#them').onclick = async () => {
    const ten = $('#ten').value.trim(), email = $('#email').value.trim(), vt = $('#vt').value;
    if (!ten || !email) return bao('Cần tên và Gmail');
    const congTrinh = vt !== 'DUC' ? [...ctChon.querySelectorAll('input:checked')].map((i) => i.value).join(',') : '';
    const hetHan = vt === 'TAM' ? $('#hetHan').value : '';
    if (vt === 'TAM' && !hetHan) return bao('Chọn ngày hết hạn');
    $('#them').disabled = true;
    try {
      const { khoa } = await goi('capKhoa', { ten, email, vaiTro: vt, congTrinh, hetHan });
      await chayDongBo();
      manNguoiDung();
      chiaSe(`${ten} ơi, đây là link app KAS của em. Mở 1 lần bằng Chrome, rồi bấm "Thêm vào màn hình chính":\n${linkCua(khoa)}`);
    } catch (e) { bao(e.message); $('#them').disabled = false; }
  };
}

// ---------- Khách hàng (văn phòng): bước A, B, C và chăm sóc sau bán ----------
const tien = (n) => (Number(n) || 0).toLocaleString('vi-VN') + ' đ';
// Số gọn cho ô tổng: 650 tr, 1,25 tỷ.
const tienGon = (n) => {
  const x = Number(n) || 0, a = Math.abs(x);
  if (a >= 1e9) return (x / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ';
  if (a >= 1e6) return (x / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' tr';
  return tien(x);
};
const tagTT = { MOI: 'SAP', LIEN_HE: 'SAP', HEN_GAP: 'DANG', KHAO_SAT: 'DANG', BAO_GIA: 'DANG', KY: 'XONG', TAM_HOAN: 'TRE', MAT: 'TRE' };
let locKhach = 'DANG';

function theKhach(k, phu) {
  return `<a class="card" href="#kh-${esc(k.ma)}" style="text-decoration:none">
    <div class="row"><span class="name">${esc(k.ten)}</span><span class="tag ${tagTT[k.trangThai]}">${esc(TRANG_THAI[k.trangThai])}</span></div>
    <div class="muted">${phu}</div></a>`;
}

function khachHomNay(hn) {
  const { goi, chamSoc, hoaHong } = viecKhachHomNay(db, hn);
  if (!goi.length && !chamSoc.length && !hoaHong.length) return '';
  return `<h3>Khách hàng hôm nay</h3>
    ${goi.map((k) => theKhach(k, `Gọi lại${k.nhacGoi < hn ? ` <span class="tre">(hẹn ${ddmm(k.nhacGoi)})</span>` : ''} · ${esc(k.sdt || 'chưa có SĐT')}${k.soLanNhac ? ` · đã nhắc ${k.soLanNhac} lần` : ''}`)).join('')}
    ${chamSoc.map(({ k, c }) => theKhach(k, `Chăm sóc sau bán tháng ${c.thang} · hạn ${ddmm(c.han)}`)).join('')}
    ${hoaHong.map((k) => theKhach(k, `Chưa trả hoa hồng cho ${esc(k.nguoiGioiThieu)}${k.hoaHong && k.hoaHong.soTien ? ' · ' + tien(k.hoaHong.soTien) : ''}`)).join('')}`;
}

function manKhach() {
  datTab('khach', 'Khách hàng');
  const hn = homNay();
  const ds = db.khach || [];
  const LOC = { DANG: ['Đang theo', (k) => DANG_THEO.includes(k.trangThai)], KY: ['Đã ký', (k) => k.trangThai === 'KY'], TAM_HOAN: ['Tạm hoãn', (k) => k.trangThai === 'TAM_HOAN'], MAT: ['Mất', (k) => k.trangThai === 'MAT'], TAT: ['Tất cả', () => true] };
  const loc = ds.filter(LOC[locKhach][1]).sort((a, b) => (a.nhacGoi || '9').localeCompare(b.nhacGoi || '9'));
  const tk = thongKe(db);
  $('#view').innerHTML = `<h2>Khách hàng</h2>
    <div class="actions"><button id="themKh" class="btn-chinh">+ Thêm khách</button></div>
    ${khachHomNay(hn)}
    <div class="loc">${Object.entries(LOC).map(([k, [ten, f]]) => `<button data-loc="${k}" class="${k === locKhach ? 'on' : ''}">${ten} ${ds.filter(f).length}</button>`).join('')}</div>
    ${loc.length ? loc.map((k) => {
      const bg = k.baoGia && k.baoGia.length ? k.baoGia[k.baoGia.length - 1] : null;
      return theKhach(k, `${esc(k.ma)} · ${esc(k.nguon)}${k.nguoiGioiThieu ? ' (' + esc(k.nguoiGioiThieu) + ')' : ''}${bg ? ' · báo giá v' + bg.phienBan + ' ' + tien(bg.giaTri) : ''}${k.nhacGoi && k.trangThai !== 'KY' ? ' · gọi ' + ddmm(k.nhacGoi) : ''}${k.maCongTrinh ? ' · ' + esc(k.maCongTrinh) : ''}`);
    }).join('') : '<p class="muted">Chưa có khách nào ở mục này.</p>'}
    ${ds.length ? `<details class="cham-ds"><summary>Khách đến từ đâu</summary>
      ${Object.entries(tk.theoNguon).map(([n, x]) => `<p class="muted">${esc(n)}: ${x.tong} khách, ký ${x.ky}</p>`).join('')}
      ${tk.theoTT.MAT ? `<p class="muted">Mất ${tk.theoTT.MAT} khách. Lý do: ${[...new Set(ds.filter((k) => k.trangThai === 'MAT').map((k) => k.lyDo))].map(esc).join(', ')}</p>` : ''}
    </details>` : ''}`;
  $('#themKh').onclick = moThemKhach;
  $('#view').querySelectorAll('[data-loc]').forEach((b) => { b.onclick = () => { locKhach = b.dataset.loc; manKhach(); }; });
}

function moThemKhach() {
  const d = $('#sheet');
  d.innerHTML = `<h2>Thêm khách</h2>
    <label class="f">Tên khách *</label><input id="kTen" placeholder="Vd: Chị Xuân">
    <label class="f">Số điện thoại</label><input id="kSdt" type="tel" inputmode="tel" placeholder="09…">
    <p id="trung" class="note" hidden></p>
    <label class="f">Khách đến từ đâu</label><select id="kNguon">${NGUON.map((n) => `<option>${esc(n)}</option>`).join('')}</select>
    <div id="gt"><label class="f">Người giới thiệu (để cảm ơn và trả hoa hồng)</label><input id="kGt" placeholder="Tên người giới thiệu">
      <input id="kSdtGt" type="tel" inputmode="tel" placeholder="SĐT người giới thiệu" style="margin-top:6px"></div>
    <label class="f">Khách cần làm gì</label><select id="kLoai"><option value="">Chưa rõ</option>${Object.entries(NHU_CAU_LOAI).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('')}</select>
    <label class="f">Nhu cầu (bấm 🎤 nói, bấm lại để nói tiếp)</label>
    <div class="mic"><textarea id="kTom" placeholder="Vd: căn hộ 90m2 ở Xa La, muốn làm nội thất trước Tết, ngân sách khoảng 600 triệu"></textarea><button id="noi">🎤</button></div>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu khách</button></div>`;
  d.showModal();
  const gt = $('#gt', d);
  const doiNguon = () => { gt.hidden = !/giới thiệu/i.test($('#kNguon', d).value); };
  $('#kNguon', d).onchange = doiNguon; doiNguon();
  $('#kSdt', d).oninput = () => {
    const k = timTheoSdt(db, $('#kSdt', d).value);
    const p = $('#trung', d);
    p.hidden = !k;
    if (k) p.innerHTML = `Số này đã có: <a href="#kh-${esc(k.ma)}">${esc(k.ten)}</a> (${esc(TRANG_THAI[k.trangThai])}). Mở hồ sơ cũ thay vì thêm mới.`;
  };
  $('#trung', d).onclick = (e) => { if (e.target.tagName === 'A') d.close(); };
  $('#noi', d).onclick = () => noiThanhChu($('#kTom', d));
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const ten = $('#kTen', d).value.trim();
    if (!ten) return bao('Cần tên khách');
    const laGt = !gt.hidden;
    const kh = taoKhach(db, { ten, sdt: $('#kSdt', d).value, nguon: $('#kNguon', d).value, nguoiGioiThieu: laGt ? $('#kGt', d).value.trim() : '', sdtGioiThieu: laGt ? $('#kSdtGt', d).value : '', loai: $('#kLoai', d).value, tomTat: $('#kTom', d).value.trim() }, vaiTro, homNay());
    luu(); d.close(); bao('Đã thêm ' + kh.ten); location.hash = '#kh-' + kh.ma;
  };
}

function manMotKhach(ma) {
  const kh = (db.khach || []).find((k) => k.ma === ma);
  if (!kh) return manKhach();
  datTab('khach', kh.ten);
  const hn = homNay();
  const lsu = db.lichSu.filter((e) => e.ma === ma).slice().reverse();
  const nc = kh.nhuCau || {};
  const sdt = String(kh.sdt || '');
  const dangTheo = DANG_THEO.includes(kh.trangThai) || kh.trangThai === 'TAM_HOAN';
  const bgChot = (kh.baoGia || []).find((b) => b.khachChot);
  $('#view').innerHTML = `<h2>${esc(kh.ten)}</h2>
    <p class="muted">${esc(kh.ma)} · <span class="tag ${tagTT[kh.trangThai]}">${esc(TRANG_THAI[kh.trangThai])}</span>${kh.lyDo ? ' · ' + esc(kh.lyDo) : ''} · ${esc(kh.nguon)}</p>
    ${sdt ? `<div class="actions"><a class="btn" href="tel:${esc(sdt)}" style="text-align:center">Gọi ${esc(sdt)}</a><a class="btn" href="https://zalo.me/${esc(sdt)}" target="_blank" rel="noopener" style="text-align:center">Nhắn Zalo</a></div>` : ''}
    ${dangTheo ? `<div class="note">${kh.nhacGoi ? `Hẹn gọi lại <b>${ddmm(kh.nhacGoi)}</b>${kh.nhacGoi < hn ? ' <span class="tre">(quá hạn)</span>' : ''}${kh.soLanNhac ? ` · đã nhắc ${kh.soLanNhac} lần không được` : ''}` : 'Chưa hẹn gọi lại'}
      <div class="actions"><button id="daGoi" class="btn-chinh">Đã gọi / nhắn</button></div></div>` : ''}

    <h3>Bước tiếp theo</h3>
    <div class="grid-btn">${[...DANG_THEO, 'TAM_HOAN', 'MAT'].map((t) => `<button data-tt="${t}" class="${t === kh.trangThai ? 'on' : ''}">${esc(TRANG_THAI[t])}</button>`).join('')}</div>
    ${kh.maCongTrinh ? `<p>Công trình: <a href="#ct-${esc(kh.maCongTrinh)}"><b>${esc(kh.maCongTrinh)}</b></a></p>`
      : `<div class="actions"><button id="ky" class="btn-chinh">Khách đã ký → tạo công trình</button></div>`}
    ${kh.trangThai === 'KY' || hdCuaKhach(db, kh.ma).length ? `<h3>Hợp đồng</h3>${hdCuaKhach(db, kh.ma).map((hd) => { const t = tinhDot(hd); return theHD(hd, `${tien(t.daThu)} / ${tien(t.phaiThu)}`); }).join('')}
      <div class="actions"><button id="themHdKh">+ Thêm hợp đồng</button></div>` : ''}

    <h3>Ghi chú</h3>
    <div class="mic"><textarea id="gc" placeholder="Bấm 🎤 để nói. Bấm lại để nói tiếp, các đoạn tự nối vào nhau."></textarea><button id="noi">🎤</button></div>
    <div class="actions">
      <button id="luuGc">Lưu ghi chú</button>
      <label class="btn" style="text-align:center">📷 Ảnh khảo sát<input id="anhKs" type="file" accept="image/*" capture="environment" multiple hidden></label>
    </div>

    <details class="cham-ds" ${!nc.dienTich && !nc.hienTrang ? '' : ''}><summary>Bảng yêu cầu thông tin</summary>
      <label class="f">Khách cần làm gì</label><select id="nLoai"><option value="">Chưa rõ</option>${Object.entries(NHU_CAU_LOAI).map(([k, v]) => `<option value="${k}" ${nc.loai === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>
      ${O_NHU_CAU.map(([k, nhan]) => `<label class="f">${esc(nhan)}</label><div class="mic"><textarea data-nc="${k}" rows="2" style="min-height:48px">${esc(nc[k] || '')}</textarea><button data-noi-nc="${k}">🎤</button></div>`).join('')}
      <div class="actions"><button id="luuNc">Lưu bảng yêu cầu</button></div>
    </details>

    <details class="cham-ds" ${kh.trangThai === 'BAO_GIA' || kh.trangThai === 'KHAO_SAT' ? 'open' : ''}><summary>Báo giá thiết kế (${(kh.baoGia || []).length} bản${bgChot ? ', khách chốt v' + bgChot.phienBan : ''})</summary>
      ${(kh.baoGia || []).map((b) => `<div class="cham-dong" style="justify-content:space-between"><span>v${b.phienBan} · ${ddmm(b.ngay)} · <b>${tien(b.giaTri)}</b>${b.link ? ` · <a href="${esc(b.link)}" target="_blank" rel="noopener">file</a>` : ''}${b.ghiChu ? ' · ' + esc(b.ghiChu) : ''}</span>
        ${b.khachChot ? '<span class="tag XONG">Khách chốt</span>' : `<button data-chot="${esc(b.id)}" style="min-height:36px;padding:6px 10px">Khách chốt bản này</button>`}</div>`).join('')}
      <label class="f">Thêm bản báo giá</label>
      <input id="bgGia" type="number" inputmode="numeric" placeholder="Giá trị (đồng)">
      <input id="bgLink" placeholder="Link file báo giá trên Drive" style="margin-top:6px">
      <input id="bgGc" placeholder="Ghi chú (vd: giá đối tác, bớt 1 phòng)" style="margin-top:6px">
      <div class="actions"><button id="luuBg">Lưu báo giá</button></div>
    </details>

    <details class="cham-ds"><summary>Người giới thiệu, hoa hồng</summary>
      <label class="f">Nguồn</label><select id="hNguon">${NGUON.map((n) => `<option ${n === kh.nguon ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>
      <label class="f">Người giới thiệu</label><input id="hTen" value="${esc(kh.nguoiGioiThieu)}">
      <input id="hSdt" type="tel" value="${esc(kh.sdtGioiThieu)}" placeholder="SĐT người giới thiệu" style="margin-top:6px">
      <label class="f">Hoa hồng (đồng)</label><input id="hTien" type="number" inputmode="numeric" value="${esc((kh.hoaHong && kh.hoaHong.soTien) || '')}">
      <label class="cham-dong"><input type="checkbox" id="hDaTra" ${kh.hoaHong && kh.hoaHong.daTra ? 'checked' : ''}> <span>Đã trả hoa hồng / đã cảm ơn</span></label>
      <div class="actions"><button id="luuH">Lưu</button></div>
    </details>

    ${kh.maCongTrinh ? `<details class="cham-ds" ${kh.banGiao ? 'open' : ''}><summary>Bàn giao, chăm sóc sau bán</summary>
      ${kh.banGiao ? `<p>Bàn giao ${ddmm(kh.banGiao)}/${kh.banGiao.slice(0, 4)} · bảo hành thi công đến <b>${ddmm(kh.baoHanhDen)}/${String(kh.baoHanhDen).slice(0, 4)}</b>. Thiết bị bảo hành theo nhà sản xuất.</p>
        ${(kh.chamSoc || []).map((c) => `<div class="cham-dong" style="justify-content:space-between"><span>Tháng ${c.thang} · hạn ${ddmm(c.han)}${c.xong ? ` · <b>đã làm ${ddmm(c.xong)}</b>${c.ghiChu ? ': ' + esc(c.ghiChu) : ''}` : c.han < hn ? ' · <span class="tre">quá hạn</span>' : ''}</span>
          ${c.xong ? '' : `<button data-cs="${c.thang}" style="min-height:36px;padding:6px 10px">Đã chăm sóc</button>`}</div>`).join('')}`
        : `<label class="f">Ngày bàn giao</label><input id="bgNgay" type="date" value="${hn}"><div class="actions"><button id="luuBanGiao">Đã bàn giao: bắt đầu lịch chăm sóc</button></div>`}
    </details>` : ''}

    <details class="cham-ds"><summary>Sửa tên, SĐT, địa chỉ</summary>
      <label class="f">Tên</label><input id="sTen" value="${esc(kh.ten)}">
      <label class="f">SĐT</label><input id="sSdt" type="tel" value="${esc(sdt)}">
      <label class="f">Địa chỉ</label><input id="sDc" value="${esc(kh.diaChi)}">
      <div class="actions"><button id="luuS">Lưu</button></div>
    </details>

    ${lsu.length ? `<h3>Lịch sử</h3>${lsu.map((e) => `<p class="muted">${ddmm(String(e.luc).slice(0, 10))} · ${esc(tenNguoi(e.nguoi))}: ${moTa(e)}</p>`).join('')}` : ''}`;

  const v = $('#view');
  const ve = () => { luu(); manMotKhach(ma); };
  const nutGoi = $('#daGoi');
  if (nutGoi) nutGoi.onclick = () => moDaGoi(kh);
  v.querySelectorAll('[data-tt]').forEach((b) => { b.onclick = () => moDoiTrangThai(kh, b.dataset.tt); });
  const ky = $('#ky');
  if (ky) ky.onclick = () => { tuKhach = kh.ma; location.hash = '#tao'; };
  const thd = $('#themHdKh');
  if (thd) thd.onclick = () => { taoHDTu = { maKhach: kh.ma, maCongTrinh: kh.maCongTrinh || '' }; location.hash = '#tao-hd'; };
  $('#noi').onclick = () => noiThanhChu($('#gc'));
  $('#luuGc').onclick = () => { const t = $('#gc').value.trim(); if (!t) return bao('Chưa có nội dung'); ghiChuKhach(db, kh, t, vaiTro); bao('Đã lưu ghi chú'); ve(); };
  $('#anhKs').onchange = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    if (!daKetNoi()) return bao(`${files.length} ảnh: bản thử chưa gửi lên Drive`);
    try { const n = await xepAnh(files, kh.ma, 'KS'); bao(`Đã lưu ${n} ảnh, đang gửi vào thư mục khách`); chayDongBo(); } catch (err) { bao('Không đọc được ảnh: ' + err.message); }
  };
  v.querySelectorAll('[data-noi-nc]').forEach((b) => { b.onclick = () => noiThanhChu(v.querySelector(`[data-nc="${b.dataset.noiNc}"]`)); });
  $('#luuNc').onclick = () => {
    const moi = { ...nc, loai: $('#nLoai').value };
    v.querySelectorAll('[data-nc]').forEach((t) => { moi[t.dataset.nc] = t.value.trim(); });
    suaKhach(db, kh, { nhuCau: moi }, hn); bao('Đã lưu bảng yêu cầu'); ve();
  };
  v.querySelectorAll('[data-chot]').forEach((b) => { b.onclick = () => { chotBaoGia(db, kh, b.dataset.chot, hn); bao('Đã đánh dấu bản khách chốt'); ve(); }; });
  $('#luuBg').onclick = () => {
    const gia = Number($('#bgGia').value);
    if (!gia) return bao('Nhập giá trị báo giá');
    themBaoGia(db, kh, { giaTri: gia, link: $('#bgLink').value.trim(), ghiChu: $('#bgGc').value.trim() }, vaiTro, hn);
    bao('Đã lưu báo giá'); ve();
  };
  $('#luuH').onclick = () => {
    suaKhach(db, kh, { nguon: $('#hNguon').value, nguoiGioiThieu: $('#hTen').value.trim(), sdtGioiThieu: $('#hSdt').value.replace(/\s+/g, ''), hoaHong: { ...(kh.hoaHong || {}), soTien: Number($('#hTien').value) || 0, daTra: $('#hDaTra').checked } }, hn);
    bao('Đã lưu'); ve();
  };
  const nutBg = $('#luuBanGiao');
  if (nutBg) nutBg.onclick = () => { banGiao(db, kh, $('#bgNgay').value, vaiTro, hn); bao('Đã tạo lịch chăm sóc 1, 3, 6, 12 tháng'); ve(); };
  v.querySelectorAll('[data-cs]').forEach((b) => { b.onclick = () => moChamSoc(kh, Number(b.dataset.cs)); });
  $('#luuS').onclick = () => {
    const ten = $('#sTen').value.trim();
    if (!ten) return bao('Cần tên');
    suaKhach(db, kh, { ten, sdt: $('#sSdt').value.replace(/\s+/g, ''), diaChi: $('#sDc').value.trim() }, hn); bao('Đã lưu'); ve();
  };
}

function moDaGoi(kh) {
  const d = $('#sheet');
  d.innerHTML = `<h2>Đã gọi ${esc(kh.ten)}</h2>
    <label class="f">Nội dung (bấm 🎤 nói)</label>
    <div class="mic"><textarea id="gc" placeholder="Vd: khách hẹn thứ 7 qua xem nhà"></textarea><button id="noi">🎤</button></div>
    <p class="muted">Chưa được: app nhắc lại sau 1 tuần. Lần thứ hai vẫn chưa được thì chuyển Tạm hoãn.</p>
    <div class="actions"><button id="chua">Chưa được</button><button id="co" class="btn-chinh">Có tiến triển</button></div>
    <div class="actions"><button id="huy">Huỷ</button></div>`;
  d.showModal();
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  $('#huy', d).onclick = () => d.close();
  const xong = (co) => {
    const kq = daGoi(db, kh, co, $('#gc', d).value.trim(), vaiTro, homNay());
    luu(); d.close();
    bao(kq === 'TAM_HOAN' ? 'Đã chuyển Tạm hoãn, nhắc lại sau 30 ngày' : co ? 'Đã lưu. Chọn bước tiếp theo nếu có' : `Sẽ nhắc lại ${ddmm(kh.nhacGoi)}`);
    manMotKhach(kh.ma);
  };
  $('#chua', d).onclick = () => xong(false);
  $('#co', d).onclick = () => xong(true);
}

function moDoiTrangThai(kh, tt) {
  if (tt === kh.trangThai) return;
  const hn = homNay();
  const canNgay = tt === 'HEN_GAP' || tt === 'TAM_HOAN';
  const d = $('#sheet');
  d.innerHTML = `<h2>${esc(kh.ten)}: ${esc(TRANG_THAI[tt])}</h2>
    ${tt === 'MAT' ? `<label class="f">Lý do mất khách</label><select id="ly">${LY_DO_MAT.map((l) => `<option>${esc(l)}</option>`).join('')}</select>` : ''}
    ${tt === 'TAM_HOAN' ? `<label class="f">Lý do</label><input id="ly" placeholder="Vd: khách chờ nhận nhà tháng 3">` : ''}
    ${canNgay ? `<label class="f">${tt === 'HEN_GAP' ? 'Ngày hẹn gặp' : 'Nhắc lại ngày'}</label><input id="ngay" type="date" value="${tt === 'HEN_GAP' ? hn : new Date(Date.parse(hn) + 30 * 864e5).toISOString().slice(0, 10)}">` : ''}
    <label class="f">Ghi chú</label>
    <div class="mic"><textarea id="gc"></textarea><button id="noi">🎤</button></div>
    ${!canNgay && tt !== 'MAT' ? '<p class="muted">App nhắc gọi lại sau 2 ngày.</p>' : ''}
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  d.showModal();
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const ly = $('#ly', d);
    const ngay = $('#ngay', d);
    doiTrangThai(db, kh, tt, vaiTro, hn, { lyDo: ly ? ly.value.trim() : '', henLai: ngay ? ngay.value : '', ghiChu: $('#gc', d).value.trim() });
    luu(); d.close(); bao('Đã chuyển ' + TRANG_THAI[tt]); manMotKhach(kh.ma);
  };
}

function moChamSoc(kh, thang) {
  const d = $('#sheet');
  d.innerHTML = `<h2>Chăm sóc ${esc(kh.ten)}, tháng ${thang}</h2>
    <label class="f">Khách nói gì (bấm 🎤 nói)</label>
    <div class="mic"><textarea id="gc" placeholder="Vd: tủ bếp ổn, cửa phòng ngủ hơi kẹt, giới thiệu chị Hoa cùng toà"></textarea><button id="noi">🎤</button></div>
    <p class="muted">Có lỗi cần sửa thì ghi vào đây. Khách giới thiệu người mới thì vào Khách hàng → Thêm khách, nguồn "Khách cũ giới thiệu".</p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  d.showModal();
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => { xongChamSoc(db, kh, thang, $('#gc', d).value.trim(), vaiTro, homNay()); luu(); d.close(); bao('Đã lưu'); manMotKhach(kh.ma); };
}

// ---------- Hợp đồng (văn phòng): bước C và E ----------
const tagHD = { HIEU_LUC: 'DANG', DUNG: 'TRE', XONG: 'XONG' };
let locHD = 'HIEU_LUC';
let taoHDTu = null; // { maKhach, maCongTrinh } khi thêm HĐ từ hồ sơ khách hoặc công trình

function tenCuaHD(hd) {
  const ct = db.congTrinh.find((c) => c.ma === hd.maCongTrinh);
  const kh = (db.khach || []).find((k) => k.ma === hd.maKhach);
  return (ct && ct.ten) || (kh && kh.ten) || hd.tenHD;
}

function theHD(hd, phu) {
  return `<a class="card" href="#${esc(hd.ma)}">
    <div class="row"><span class="name">${esc(hd.soHD)}</span><span class="tag ${tagHD[hd.trangThai]}">${esc(TT_HD[hd.trangThai])}</span></div>
    <div class="muted">${esc(tenCuaHD(hd))} · ${phu}</div></a>`;
}

function tienHomNay(hn) {
  const { thu, khauTru, dung } = viecHopDongHomNay(db, hn);
  if (!thu.length && !khauTru.length && !dung.length) return '';
  return `<h3>Hợp đồng, thu tiền</h3>
    ${thu.map(({ hd, d, lyDo }) => theHD(hd, `Đề nghị thanh toán đợt ${d.so}: còn <b>${tien(d.conLai)}</b> · ${esc(lyDo)}`)).join('')}
    ${khauTru.map(({ hd, conNgay, phan }) => theHD(hd, `Hạn khấu trừ phí thiết kế còn <b>${conNgay} ngày</b>, khách chưa ký thi công ${phan.map((p) => PHAM_VI_TK[p].toLowerCase()).join(', ')}`)).join('')}
    ${dung.map((hd) => theHD(hd, 'Đã dừng: hoàn thiện thủ tục rồi bấm Hoàn thành')).join('')}`;
}

function thietKeHomNay(hn) {
  const { choLau, canSua, quyetPhi: phi, gstg } = viecThietKeHomNay(db, hn, !laVanPhong());
  if (!choLau.length && !canSua.length && !phi.length && !gstg.length) return '';
  const tenCt = (ma) => { const c = db.congTrinh.find((x) => x.ma === ma); return c ? c.ten : ma; };
  const the = (ma, phu) => `<a class="card" href="#ct-${esc(ma)}"><div class="row"><span class="name">${esc(tenCt(ma))}</span></div><div class="muted">${phu}</div></a>`;
  return `<h3>${laVanPhong() ? 'Thiết kế, giám sát tác giả' : 'Giám sát tác giả'}</h3>
    ${phi.map((p) => the(p.maCongTrinh, `<span class="tre">Sửa ${esc(p.hangMuc)} lần ${p.lan + 1} vượt HĐ</span>: chọn thu phí hay không`)).join('')}
    ${choLau.map((p) => the(p.maCongTrinh, `${esc(p.hangMuc)} ${tenLan(p.lan)}: khách chưa trả lời <b>${soNgayCho(p, hn)} ngày</b>, nhắc khách`)).join('')}
    ${canSua.map((p) => the(p.maCongTrinh, `${esc(p.hangMuc)}: khách yêu cầu sửa${p.yKien ? ` (${esc(p.yKien)})` : ''}, chưa gửi lại`)).join('')}
    ${gstg.map(({ ct, gs, ngay }) => the(ct.ma, `Giám sát tác giả buổi ${gs.lan}${gs.ten ? ' · ' + esc(gs.ten) : ''} · ${ngay < hn ? `<span class="tre">hẹn ${ddmm(ngay)}, chưa làm</span>` : ddmm(ngay)}`)).join('')}`;
}

function manHopDong() {
  datTab('hop-dong', 'Hợp đồng');
  const ds = db.hopDong || [];
  const LOC = { HIEU_LUC: 'Đang thực hiện', DUNG: 'Dừng', XONG: 'Hoàn thành', TAT: 'Tất cả' };
  const dem = (k) => ds.filter((h) => k === 'TAT' || h.trangThai === k).length;
  const loc = ds.filter((h) => locHD === 'TAT' || h.trangThai === locHD).sort((a, b) => String(b.ngayKy).localeCompare(String(a.ngayKy)));
  const t = tongHopTien(db);
  $('#view').innerHTML = `<h2>Hợp đồng</h2>
    <div class="so-lieu"><div><span>Giá trị HĐ</span><b>${tienGon(t.giaTri)}</b></div><div><span>Đã thu</span><b>${tienGon(t.daThu)}</b></div><div><span>Còn phải thu</span><b>${tienGon(t.conLai)}</b></div></div>
    <div class="actions"><button id="taoHd" class="btn-chinh">+ Thêm hợp đồng</button></div>
    ${tienHomNay(homNay())}
    <div class="loc">${Object.entries(LOC).map(([k, ten]) => `<button data-loc="${k}" class="${k === locHD ? 'on' : ''}">${ten} ${dem(k)}</button>`).join('')}</div>
    ${loc.map((hd) => {
      const th = tinhDot(hd);
      const tiep = th.dot.find((d) => !d.dong);
      return theHD(hd, `đã thu ${tien(th.daThu)} / ${tien(th.phaiThu)}${tiep && hd.trangThai === 'HIEU_LUC' ? ` · tiếp: đợt ${tiep.so} ${tien(tiep.conLai)}` : ''}`);
    }).join('') || '<p class="muted">Chưa có hợp đồng nào ở mục này.</p>'}
    <details class="cham-ds" ${(db.caiDat || {}).taiKhoan ? '' : 'open'}><summary>Tài khoản nhận tiền (in vào đề nghị thanh toán)</summary>
      <textarea id="taiKhoan" rows="3" placeholder="Số TK, chủ TK, ngân hàng">${esc((db.caiDat || {}).taiKhoan || '')}</textarea>
      <div class="actions"><button id="luuTk">Lưu</button></div>
    </details>`;
  $('#luuTk').onclick = () => { datCaiDat(db, 'taiKhoan', $('#taiKhoan').value.trim()); luu(); bao('Đã lưu tài khoản'); };
  $('#taoHd').onclick = () => { taoHDTu = null; location.hash = '#tao-hd'; };
  $('#view').querySelectorAll('[data-loc]').forEach((b) => { b.onclick = () => { locHD = b.dataset.loc; manHopDong(); }; });
}

function manTaoHD() {
  datTab('hop-dong', 'Thêm hợp đồng');
  const hn = homNay();
  const tu = taoHDTu || {};
  const ct0 = tu.maCongTrinh ? db.congTrinh.find((c) => c.ma === tu.maCongTrinh) : null;
  const maKh0 = tu.maKhach || (ct0 && ct0.maKhach) || '';
  const dau = ct0 ? ct0.ma.split('-')[0] : '';
  const dang0 = DANG_HD[dau] ? dau : 'TK';
  const khs = (db.khach || []).slice().sort((a, b) => (a.trangThai === 'KY' ? -1 : 0) - (b.trangThai === 'KY' ? -1 : 0));
  $('#view').innerHTML = `<h2>Thêm hợp đồng</h2>
    <label class="f">Khách hàng</label>
    <select id="kh"><option value="">Chưa chọn</option>${khs.map((k) => `<option value="${esc(k.ma)}" ${k.ma === maKh0 ? 'selected' : ''}>${esc(k.ten)}</option>`).join('')}</select>
    <label class="f">Công trình</label>
    <select id="ct"><option value="">Chưa tạo công trình</option>${db.congTrinh.map((c) => `<option value="${esc(c.ma)}" ${ct0 && c.ma === ct0.ma ? 'selected' : ''}>${esc(c.ma)} · ${esc(c.ten)}</option>`).join('')}</select>
    <label class="f">Dạng hợp đồng</label>
    <select id="dang">${Object.entries(DANG_HD).map(([k, v]) => `<option value="${k}" ${k === dang0 ? 'selected' : ''}>${k} · ${esc(v)}</option>`).join('')}</select>
    <label class="cham-dong"><input type="checkbox" id="nguyenTac"> <span>Hợp đồng nguyên tắc, các giai đoạn ký phụ lục</span></label>
    <label class="f">Ngày ký</label><input id="ngay" type="date" value="${hn}">
    <label class="f">Giá trị hợp đồng (đồng)</label><input id="gia" type="number" inputmode="numeric" placeholder="Vd: 120000000">
    <p class="muted" id="giaChu"></p>
    <label class="f">Tên trong số HĐ (có Mr/Mrs)</label><input id="tenHd" placeholder="Vd: MrNam">
    <label class="f">Số hợp đồng</label><input id="soHd">
    <p class="muted">Mẫu YYMM31/TÊN-KAS/dạng, app tự điền. Thầy sửa tay được.</p>
    <label class="f">Các đợt thu (% · điều kiện)</label>
    <div id="dots"></div>
    <div class="actions"><button id="themDong" type="button">+ Thêm đợt</button></div>
    <p class="muted" id="tongPct"></p>
    <div id="tkBox">
      <div id="ktBox">
        <label class="f">Phạm vi thiết kế</label>
        <select id="phamVi">${Object.entries(PHAM_VI_TK).map(([k, ten]) => `<option value="${k}" ${k === 'KTNT' ? 'selected' : ''}>${esc(ten)}</option>`).join('')}</select>
        <div id="kntBox"><label class="f">Trong đó phần kiến trúc (đồng)</label><input id="giaKT" type="number" inputmode="numeric">
          <p class="muted" id="giaKTChu"></p></div>
        <label class="f">Khấu trừ khi ký thi công (% phần thiết kế tương ứng)</label><input id="tyleKt" type="number" inputmode="numeric" value="${TY_LE_KHAU_TRU}">
        <label class="f">Hạn khấu trừ (để trống nếu không giới hạn)</label><input id="hanKt" type="date">
        <p class="muted">Ký thi công xây dựng thì trừ phần kiến trúc, thi công nội thất thì trừ phần nội thất, vào đợt cuối HĐ thi công.</p>
      </div>
      <label class="f">Số lần sửa phương án 3D (ngoài phương án đầu)</label><input id="sua" type="number" inputmode="numeric" value="2">
      <label class="f">Số buổi giám sát tác giả</label><input id="gstg" type="number" inputmode="numeric" value="0">
    </div>
    <label class="f">Link file hợp đồng trên Drive</label><input id="link" placeholder="https://drive.google.com/…">
    <label class="cham-dong" id="truBox" hidden><input type="checkbox" id="tru" checked> <span id="truTxt"></span></label>
    <div class="actions"><button id="luu" class="btn-chinh">Lưu hợp đồng</button></div>`;
  const v = $('#view');
  let dotTay = false, tenTay = false, soTay = false;
  const veDot = (ds) => {
    $('#dots').innerHTML = ds.map(([p, dk]) => `<div class="dot-dong"><input class="pct" type="number" inputmode="numeric" value="${p}" aria-label="Phần trăm"><input class="dk" value="${esc(dk)}" aria-label="Điều kiện"><button class="xoa" type="button" aria-label="Xoá đợt">✕</button></div>`).join('');
    $('#dots').querySelectorAll('.xoa').forEach((b) => { b.onclick = () => { dotTay = true; b.parentElement.remove(); tinhPct(); }; });
    $('#dots').querySelectorAll('input').forEach((i) => { i.oninput = () => { dotTay = true; tinhPct(); }; });
    tinhPct();
  };
  const docDot = () => [...$('#dots').querySelectorAll('.dot-dong')].map((r) => [Number($('.pct', r).value) || 0, $('.dk', r).value.trim()]);
  const tinhPct = () => { const t = docDot().reduce((s, [p]) => s + p, 0); $('#tongPct').innerHTML = t === 100 ? 'Tổng 100%' : `<span class="tre">Tổng ${t}%, cần đủ 100%</span>`; };
  const khChon = () => (db.khach || []).find((k) => k.ma === $('#kh').value);
  const capNhat = () => {
    const dang = $('#dang').value, gia = Number($('#gia').value) || 0;
    $('#giaChu').textContent = gia ? tien(gia) : '';
    if (!dotTay) veDot(dotMacDinh(dang, gia));
    $('#tkBox').hidden = !(dang === 'TK' || dang === 'TG');
    $('#ktBox').hidden = dang !== 'TK';
    $('#kntBox').hidden = $('#phamVi').value !== 'KTNT';
    const kt = Number($('#giaKT').value) || 0;
    $('#giaKTChu').textContent = kt ? `Kiến trúc ${tien(kt)} · nội thất ${tien(Math.max(0, gia - kt))}` : 'Để trống thì app coi cả HĐ là nội thất. Nên nhập để trừ đúng.';
    const kh = khChon(), ct = db.congTrinh.find((c) => c.ma === $('#ct').value);
    if (!tenTay) $('#tenHd').value = goiYTenHD(kh ? kh.ten : ct ? ct.chuNha || ct.ten : '');
    if (!soTay) $('#soHd').value = soHopDong($('#ngay').value, $('#tenHd').value.trim(), dang);
    const ung = dang !== 'TK' ? hdThietKeDuocTru(db, { dang, maKhach: $('#kh').value, maCongTrinh: $('#ct').value, ngayKy: $('#ngay').value }) : null;
    $('#truBox').hidden = !ung;
    if (ung) $('#truTxt').textContent = `Khấu trừ ${tien(ung.soTien)} phí thiết kế ${ung.phan.map((p) => PHAM_VI_TK[p].toLowerCase()).join(' + ')} (HĐ ${ung.hd.soHD}) vào đợt cuối`;
  };
  ['#dang', '#gia', '#kh', '#ct', '#ngay', '#phamVi', '#giaKT'].forEach((id) => { $(id).addEventListener('input', capNhat); $(id).addEventListener('change', capNhat); });
  $('#ct').addEventListener('change', () => { const c = db.congTrinh.find((x) => x.ma === $('#ct').value); if (c && c.maKhach && !$('#kh').value) { $('#kh').value = c.maKhach; capNhat(); } });
  $('#tenHd').oninput = () => { tenTay = true; if (!soTay) $('#soHd').value = soHopDong($('#ngay').value, $('#tenHd').value.trim(), $('#dang').value); };
  $('#soHd').oninput = () => { soTay = true; };
  $('#themDong').onclick = () => { dotTay = true; veDot([...docDot(), [0, 'Đợt thêm']]); };
  capNhat();
  $('#luu').onclick = () => {
    const dang = $('#dang').value, giaTri = Number($('#gia').value) || 0, dot = docDot();
    if (!giaTri) return bao('Nhập giá trị hợp đồng');
    if (dot.reduce((s, [p]) => s + p, 0) !== 100) return bao('Các đợt cần cộng đủ 100%');
    if (!/^.+\/.+-KAS\/.+$/.test($('#soHd').value.trim())) bao('Lưu ý: số HĐ khác mẫu YYMM31/TÊN-KAS/dạng');
    const kh = khChon();
    const hd = taoHopDong(db, {
      dang, nguyenTac: $('#nguyenTac').checked, tenHD: $('#tenHd').value.trim(), soHD: $('#soHd').value.trim(), maKhach: $('#kh').value, maCongTrinh: $('#ct').value,
      ngayKy: $('#ngay').value, giaTri, dot, tenKhach: kh ? kh.ten : '', linkFile: $('#link').value.trim(),
      soLanSua: dang === 'TK' || dang === 'TG' ? Number($('#sua').value) || 0 : 0, soBuoiGSTG: dang === 'TK' || dang === 'TG' ? Number($('#gstg').value) || 0 : 0,
      phamVi: $('#phamVi').value, giaTriKT: $('#phamVi').value === 'KTNT' ? Number($('#giaKT').value) || 0 : 0,
      hanKhauTru: dang === 'TK' ? $('#hanKt').value : '', tyLeKhauTru: dang === 'TK' ? Number($('#tyleKt').value) || 0 : 0,
    }, vaiTro);
    const ung = !$('#truBox').hidden && $('#tru').checked ? hdThietKeDuocTru(db, hd) : null;
    if (ung) apKhauTru(db, hd, ung, vaiTro);
    taoHDTu = null;
    luu(); bao('Đã lưu ' + hd.soHD); location.hash = '#' + hd.ma;
  };
  void v;
}

function theDot(hd, d, ct) {
  const v = d.moc && ct ? ct.viec.find((x) => x.id === d.moc) : null;
  const tt = d.dong ? `<span class="tag XONG">Đã đóng ${ddmm(d.dong)}</span>` : d.daThu ? '<span class="tag SAP">Thu một phần</span>' : '<span class="tag SAP">Chờ thu</span>';
  const mo = hd.trangThai === 'HIEU_LUC';
  return `<div class="card">
    <div class="row"><span class="name">Đợt ${d.so} · ${d.tyLe}% · ${esc(d.ten)}</span>${tt}</div>
    <div class="muted">Phải thu <b>${tien(d.phaiThu)}</b>${d.nhanChuyen ? ` (gồm ${d.nhanChuyen > 0 ? 'phần thiếu' : 'phần thừa'} ${tien(Math.abs(d.nhanChuyen))} đợt trước)` : ''} · đã thu ${tien(d.daThu)}${!d.dong && d.conLai > 0 ? ` · còn <b>${tien(d.conLai)}</b>` : ''}${d.dong && d.chuyenSang ? ` · ${d.chuyenSang > 0 ? 'thiếu' : 'thừa'} ${tien(Math.abs(d.chuyenSang))} sang đợt sau` : ''}</div>
    ${v || d.han ? `<div class="muted">${v ? `Mốc: ${esc(v.hangMuc)} ${v.phanTram >= 100 ? '<b>(đã xong)</b>' : `(${v.phanTram}%)`}` : ''}${d.han ? `${v ? ' · ' : ''}Hạn ${ddmm(d.han)}` : ''}</div>` : ''}
    ${(d.thu || []).map((t) => `<p class="muted">· ${ddmm(t.ngay)}: ${tien(t.soTien)}${t.ghiChu ? ' · ' + esc(t.ghiChu) : ''}</p>`).join('')}
    ${mo ? `<div class="actions">${d.dong ? `<button data-mo-dot="${esc(d.id)}">Mở lại đợt</button>`
      : `<button data-thu="${esc(d.id)}" class="btn-chinh">Ghi thu tiền</button><button data-dn="${esc(d.id)}">Gửi đề nghị TT</button>${d.daThu ? `<button data-dong="${esc(d.id)}">Đóng đợt</button>` : ''}`}<button data-sua-dot="${esc(d.id)}">Sửa</button></div>` : ''}
  </div>`;
}

function manMotHD(ma) {
  const hd = (db.hopDong || []).find((h) => h.ma === ma);
  if (!hd) return manHopDong();
  datTab('hop-dong', hd.soHD);
  const hn = homNay();
  const th = tinhDot(hd);
  const kh = (db.khach || []).find((k) => k.ma === hd.maKhach);
  const ct = db.congTrinh.find((c) => c.ma === hd.maCongTrinh);
  const pl = hd.phuLuc || [];
  const ung = hd.dang !== 'TK' && !(hd.truTK && hd.truTK.soTien) && hd.trangThai === 'HIEU_LUC' ? hdThietKeDuocTru(db, hd) : null;
  const daTruVao = hd.dang === 'TK' ? (db.hopDong || []).filter((x) => x.truTK && x.truTK.maHD === hd.ma) : [];
  const tenPhan = (ds) => ds.map((p) => PHAM_VI_TK[p].toLowerCase()).join(' + ');
  const lsu = db.lichSu.filter((e) => e.ma === hd.ma).slice().reverse();
  const pct = th.phaiThu ? Math.min(100, Math.round((th.daThu / th.phaiThu) * 100)) : 0;
  const coTK = hd.dang === 'TK' || hd.dang === 'TG';
  $('#view').innerHTML = `<h2>${esc(hd.soHD)}</h2>
    <p class="muted">${esc(DANG_HD[hd.dang])}${hd.nguyenTac ? ' · HĐ nguyên tắc' : ''} · ký ${fmtNgay(hd.ngayKy)} · <span class="tag ${tagHD[hd.trangThai]}">${esc(TT_HD[hd.trangThai])}</span></p>
    <p>${kh ? `Khách: <a href="#kh-${esc(kh.ma)}">${esc(kh.ten)}</a>` : ''}${kh && ct ? ' · ' : ''}${ct ? `Công trình: <a href="#ct-${esc(ct.ma)}">${esc(ct.ma)}</a>` : ''}${hd.linkFile ? ` · <a href="${esc(hd.linkFile)}" target="_blank" rel="noopener">File HĐ</a>` : ''}</p>
    ${hd.trangThai === 'DUNG' ? `<div class="note">Dừng ngày ${fmtNgay(hd.ngayDung)}: ${esc(hd.lyDo)}. Đã thu ${tien(th.daThu)}. Hoàn thiện thủ tục (thanh lý, đối chiếu công nợ) rồi bấm Hoàn thành.</div>` : ''}
    <div class="so-lieu">
      <div><span>Giá trị ký</span><b>${tienGon(hd.giaTri)}</b></div>
      ${pl.length ? `<div><span>Phụ lục, phí sửa</span><b>${th.tong - hd.giaTri >= 0 ? '+' : ''}${tienGon(th.tong - hd.giaTri)}</b></div>` : ''}
      ${th.tru ? `<div><span>Khấu trừ phí TK</span><b>−${tienGon(th.tru)}</b></div>` : ''}
      <div><span>Phải thu</span><b>${tienGon(th.phaiThu)}</b></div>
      <div><span>Đã thu</span><b>${tienGon(th.daThu)}</b></div>
      <div><span>Còn lại</span><b>${tienGon(th.phaiThu - th.daThu)}</b></div>
    </div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    ${ung ? `<div class="note">HĐ thiết kế ${esc(ung.hd.soHD)} còn khấu trừ ${tien(ung.soTien)} (phần ${tenPhan(ung.phan)}).<div class="actions"><button id="apTru">Trừ vào đợt cuối HĐ này</button></div></div>` : ''}
    <h3>Các đợt thu</h3>
    ${th.dot.map((d) => theDot(hd, d, ct)).join('')}
    ${th.chuaXep ? `<p class="note">Còn ${tien(th.chuaXep)} chưa nằm trong đợt nào. Bấm Thêm đợt để thu.</p>` : ''}
    ${hd.trangThai === 'HIEU_LUC' ? '<div class="actions"><button id="themDot">+ Thêm đợt</button></div>' : ''}
    <h3>Phụ lục</h3>
    ${pl.map((p) => `<p class="muted">${ddmm(p.ngay)} · ${esc(p.noiDung)} · <b>${p.giaTri >= 0 ? '+' : ''}${tien(p.giaTri)}</b>${p.link ? ` · <a href="${esc(p.link)}" target="_blank" rel="noopener">file</a>` : ''}</p>`).join('') || '<p class="muted">Chưa có phụ lục.</p>'}
    ${hd.trangThai === 'HIEU_LUC' ? '<div class="actions"><button id="themPl">+ Thêm phụ lục</button></div>' : ''}
    ${coTK ? `<h3>Điều khoản thiết kế</h3>
      ${hd.dang === 'TK' ? `<p class="muted">Phạm vi: ${esc(PHAM_VI_TK[hd.phamVi] || '')}${hd.phamVi === 'KTNT' ? ` (kiến trúc ${tien(giaTriPhan(hd, 'KT'))}, nội thất ${tien(giaTriPhan(hd, 'NT'))})` : ''}</p>` : ''}
      <p class="muted">Sửa phương án 3D: ${hd.soLanSua} lần ngoài phương án đầu. Vượt thì Thầy chọn thu ${tien(phiSua(hd))}/lần (5%) hoặc không thu.${hd.soBuoiGSTG ? ` Giám sát tác giả: ${hd.soBuoiGSTG} buổi.` : ''}</p>
      ${hd.dang === 'TK' ? `<p class="muted">${Number(hd.khauTru && hd.khauTru.tyLe) ? `Ký thi công${hd.khauTru.han ? ' trước ' + fmtNgay(hd.khauTru.han) : ''} thì trừ ${hd.khauTru.tyLe}% phần thiết kế tương ứng.${daTruVao.map((x) => ` <b>Đã trừ ${tien(x.truTK.soTien)} (${tenPhan(x.truTK.phan || [])}) vào ${esc(x.soHD)}.</b>`).join('')}${phanChoTru(db, hd).length ? ` Còn chờ: ${tenPhan(phanChoTru(db, hd))}.` : ''}` : 'Không có điều khoản khấu trừ phí thiết kế.'}</p>` : ''}` : ''}
    <details class="cham-ds"><summary>Sửa thông tin hợp đồng</summary>
      <label class="f">Số hợp đồng</label><input id="sSo" value="${esc(hd.soHD)}">
      <label class="f">Ngày ký</label><input id="sNgay" type="date" value="${esc(hd.ngayKy)}">
      <label class="f">Giá trị ký (đồng)</label><input id="sGia" type="number" inputmode="numeric" value="${esc(hd.giaTri)}">
      <label class="f">Công trình</label><select id="sCt"><option value="">Chưa gắn</option>${db.congTrinh.map((c) => `<option value="${esc(c.ma)}" ${c.ma === hd.maCongTrinh ? 'selected' : ''}>${esc(c.ma)} · ${esc(c.ten)}</option>`).join('')}</select>
      <label class="f">Link file HĐ</label><input id="sLink" value="${esc(hd.linkFile)}">
      ${coTK ? `<label class="f">Số lần sửa phương án</label><input id="sSua" type="number" inputmode="numeric" value="${esc(hd.soLanSua)}">
        <label class="f">Số buổi giám sát tác giả</label><input id="sGs" type="number" inputmode="numeric" value="${esc(hd.soBuoiGSTG)}">` : ''}
      ${hd.dang === 'TK' ? `<label class="f">Phạm vi thiết kế</label><select id="sPv">${Object.entries(PHAM_VI_TK).map(([k, ten]) => `<option value="${k}" ${k === hd.phamVi ? 'selected' : ''}>${esc(ten)}</option>`).join('')}</select>
        <label class="f">Phần kiến trúc (khi thiết kế cả kiến trúc + nội thất)</label><input id="sKT" type="number" inputmode="numeric" value="${esc(hd.giaTriKT || '')}">
        <label class="f">Khấu trừ khi ký thi công (%)</label><input id="sTyLe" type="number" inputmode="numeric" value="${esc(hd.khauTru ? hd.khauTru.tyLe : 0)}">
        <label class="f">Hạn khấu trừ</label><input id="sHan" type="date" value="${esc(hd.khauTru && hd.khauTru.han)}">` : ''}
      <div class="actions"><button id="luuSua">Lưu</button></div>
    </details>
    <div class="actions">${hd.trangThai === 'HIEU_LUC' ? '<button id="dungHd" class="btn-do">Dừng / huỷ HĐ</button>' : ''}${hd.trangThai !== 'XONG' ? '<button id="xongHd">Đánh dấu hoàn thành</button>' : '<button id="moLaiHd">Mở lại hợp đồng</button>'}</div>
    ${lsu.length ? `<h3>Lịch sử</h3>${lsu.map((e) => `<p class="muted">${ddmm(String(e.luc).slice(0, 10))} · ${esc(tenNguoi(e.nguoi))}: ${moTa(e)}</p>`).join('')}` : ''}`;
  const v = $('#view');
  const ve = () => { luu(); manMotHD(ma); };
  const timDot = (id) => tinhDot(hd).dot.find((d) => d.id === id);
  v.querySelectorAll('[data-thu]').forEach((b) => { b.onclick = () => moGhiThu(hd, timDot(b.dataset.thu)); });
  v.querySelectorAll('[data-dn]').forEach((b) => {
    b.onclick = () => {
      const d = timDot(b.dataset.dn);
      const tk = (db.caiDat && db.caiDat.taiKhoan) || '';
      chiaSe(`KAS Houzing kính gửi anh/chị ${kh ? kh.ten : ''}\nĐề nghị thanh toán đợt ${d.so} (${d.tyLe}%) theo hợp đồng số ${hd.soHD}.\nNội dung: ${d.ten}\nSố tiền: ${tien(d.conLai)}\n${tk ? `Thông tin chuyển khoản:\n${tk}\nNội dung chuyển khoản: ${hd.soHD} dot ${d.so}\n` : ''}Trân trọng cảm ơn anh/chị.`);
    };
  });
  v.querySelectorAll('[data-dong]').forEach((b) => {
    b.onclick = () => {
      const d = timDot(b.dataset.dong);
      if (b.dataset.chac !== '1') { b.dataset.chac = '1'; b.textContent = `Bấm lần nữa: thiếu ${tien(d.conLai)} sang đợt sau`; return; }
      dongDot(db, hd, d.id, hn, vaiTro); bao('Đã đóng đợt ' + d.so); ve();
    };
  });
  v.querySelectorAll('[data-mo-dot]').forEach((b) => { b.onclick = () => { moLaiDot(db, hd, b.dataset.moDot); bao('Đã mở lại đợt'); ve(); }; });
  v.querySelectorAll('[data-sua-dot]').forEach((b) => { b.onclick = () => moSuaDot(hd, hd.dot.find((d) => d.id === b.dataset.suaDot), ct); });
  const nut = (id, f) => { const x = $(id); if (x) x.onclick = f; };
  nut('#apTru', () => { apKhauTru(db, hd, ung, vaiTro); bao('Đã trừ phí thiết kế vào đợt cuối'); ve(); });
  nut('#themDot', () => moThemDot(hd));
  nut('#themPl', () => moThemPhuLuc(hd));
  nut('#dungHd', () => moDungHD(hd));
  nut('#xongHd', () => { doiTrangThaiHD(db, hd, 'XONG', { ngay: hn }, vaiTro); bao('Hợp đồng đã hoàn thành'); ve(); });
  nut('#moLaiHd', () => { doiTrangThaiHD(db, hd, 'HIEU_LUC', { ngay: hn }, vaiTro); ve(); });
  nut('#luuSua', () => {
    const doi = { soHD: $('#sSo').value.trim() || hd.soHD, ngayKy: $('#sNgay').value || hd.ngayKy, giaTri: Number($('#sGia').value) || hd.giaTri, maCongTrinh: $('#sCt').value, linkFile: $('#sLink').value.trim() };
    if ($('#sSua')) { doi.soLanSua = Number($('#sSua').value) || 0; doi.soBuoiGSTG = Number($('#sGs').value) || 0; }
    if ($('#sHan')) { doi.khauTru = { han: $('#sHan').value, tyLe: Number($('#sTyLe').value) || 0 }; doi.phamVi = $('#sPv').value; doi.giaTriKT = Number($('#sKT').value) || 0; }
    suaHopDong(db, hd, doi); bao('Đã lưu'); ve();
  });
}

function moGhiThu(hd, d) {
  const dl = $('#sheet');
  dl.innerHTML = `<h2>Thu đợt ${d.so}: ${esc(d.ten)}</h2>
    <p class="muted">Phải thu ${tien(d.phaiThu)} · đã thu ${tien(d.daThu)} · còn ${tien(d.conLai)}</p>
    <label class="f">Số tiền khách chuyển (đồng)</label><input id="st" type="number" inputmode="numeric" value="${Math.max(0, d.conLai)}">
    <p class="muted" id="stChu"></p>
    <label class="f">Ngày</label><input id="ng" type="date" value="${homNay()}">
    <label class="f">Ghi chú</label><input id="gc" placeholder="Vd: chuyển khoản Vietcombank">
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  dl.showModal();
  const chu = () => { $('#stChu', dl).textContent = tien($('#st', dl).value); };
  $('#st', dl).oninput = chu; chu();
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    const st = Number($('#st', dl).value);
    if (!st) return bao('Nhập số tiền');
    const dong = ghiThu(db, hd, d.id, { ngay: $('#ng', dl).value, soTien: st, ghiChu: $('#gc', dl).value.trim() }, vaiTro);
    luu(); dl.close();
    bao(dong ? 'Đủ tiền, đã đóng đợt' : 'Đã ghi. Thu thiếu thì bấm Đóng đợt để chuyển phần thiếu sang đợt sau');
    manMotHD(hd.ma);
  };
}

function moSuaDot(hd, d, ct) {
  const dl = $('#sheet');
  const viec = ct ? ct.viec : [];
  dl.innerHTML = `<h2>Sửa đợt ${d.so}</h2>
    <label class="f">Điều kiện / nội dung</label><input id="ten" value="${esc(d.ten)}">
    <label class="f">Tỷ lệ (%)</label><input id="tl" type="number" inputmode="numeric" value="${esc(d.tyLe)}">
    <label class="f">Gắn mốc trong kế hoạch (xong mốc thì app nhắc thu)</label>
    <select id="moc"><option value="">Không gắn</option>${viec.map((x) => `<option value="${esc(x.id)}" ${x.id === d.moc ? 'selected' : ''}>${esc(x.hangMuc)}${x.moc ? ' · ' + esc(x.moc) : ''}</option>`).join('')}</select>
    ${ct ? '' : '<p class="muted">HĐ chưa gắn công trình nên chưa chọn được mốc.</p>'}
    <label class="f">Hoặc hạn thu theo ngày</label><input id="han" type="date" value="${esc(d.han)}">
    <p class="muted">Đổi tỷ lệ chỉ ảnh hưởng các đợt chưa đóng.</p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  dl.showModal();
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    suaDot(db, hd, d.id, { ten: $('#ten', dl).value.trim() || d.ten, tyLe: Number($('#tl', dl).value) || 0, moc: $('#moc', dl).value, han: $('#han', dl).value });
    luu(); dl.close(); bao('Đã lưu đợt ' + d.so); manMotHD(hd.ma);
  };
}

function moThemDot(hd) {
  const dl = $('#sheet');
  dl.innerHTML = `<h2>Thêm đợt thu</h2>
    <label class="f">Nội dung</label><input id="ten" placeholder="Vd: Thu phần phụ lục tầng tum">
    <label class="f">Tỷ lệ (%) so với các đợt chưa đóng</label><input id="tl" type="number" inputmode="numeric" value="0">
    <p class="muted">Các đợt chưa đóng chia phần còn phải thu theo tỷ lệ. Tất cả đợt đã đóng thì đợt mới nhận toàn bộ phần còn lại.</p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Thêm</button></div>`;
  dl.showModal();
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => { themDot(db, hd, { ten: $('#ten', dl).value.trim(), tyLe: $('#tl', dl).value }); luu(); dl.close(); manMotHD(hd.ma); };
}

function moThemPhuLuc(hd) {
  const dl = $('#sheet');
  dl.innerHTML = `<h2>Thêm phụ lục</h2>
    <label class="f">Nội dung (bấm 🎤 nói)</label><div class="mic"><textarea id="nd" placeholder="Vd: bổ sung thiết kế tầng tum 40m2"></textarea><button id="noi">🎤</button></div>
    <label class="f">Giá trị tăng (giảm thì ghi số âm)</label><input id="gt" type="number" inputmode="numeric">
    <p class="muted" id="gtChu"></p>
    <label class="f">Ngày ký</label><input id="ng" type="date" value="${homNay()}">
    <label class="f">Link file phụ lục</label><input id="lk">
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  dl.showModal();
  $('#noi', dl).onclick = () => noiThanhChu($('#nd', dl));
  $('#gt', dl).oninput = () => { $('#gtChu', dl).textContent = tien($('#gt', dl).value); };
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    const nd = $('#nd', dl).value.trim();
    if (!nd) return bao('Nhập nội dung phụ lục');
    themPhuLuc(db, hd, { ngay: $('#ng', dl).value, noiDung: nd, giaTri: $('#gt', dl).value, link: $('#lk', dl).value.trim() }, vaiTro);
    luu(); dl.close(); bao('Đã thêm phụ lục, các đợt chưa thu đã tính lại'); manMotHD(hd.ma);
  };
}

function moDungHD(hd) {
  const dl = $('#sheet');
  dl.innerHTML = `<h2>Dừng / huỷ ${esc(hd.soHD)}</h2>
    <label class="f">Lý do (bấm 🎤 nói)</label><div class="mic"><textarea id="ly"></textarea><button id="noi">🎤</button></div>
    <p class="muted">HĐ dừng vẫn nằm ở bảng tổng và được nhắc cho tới khi Thầy bấm Hoàn thành (sau khi xong thủ tục).</p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-do">Dừng hợp đồng</button></div>`;
  dl.showModal();
  $('#noi', dl).onclick = () => noiThanhChu($('#ly', dl));
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    const ly = $('#ly', dl).value.trim();
    if (!ly) return bao('Ghi lý do dừng');
    doiTrangThaiHD(db, hd, 'DUNG', { lyDo: ly, ngay: homNay() }, vaiTro); luu(); dl.close(); manMotHD(hd.ma);
  };
}

// ---------- Thiết kế trong trang công trình: phương án gửi khách, giám sát tác giả ----------
function khoiHDCongTrinh(ct) {
  const ds = hdCuaCongTrinh(db, ct.ma);
  return `<h3>Hợp đồng</h3>
    ${ds.map((hd) => { const t = tinhDot(hd); return theHD(hd, `đã thu ${tien(t.daThu)} / ${tien(t.phaiThu)}`); }).join('') || '<p class="muted">Chưa gắn hợp đồng.</p>'}
    <div class="actions"><button id="themHdCt">+ Thêm hợp đồng</button></div>`;
}

function khoiThietKe(ct) {
  const hn = homNay();
  const gs = gsCuaCongTrinh(db, ct.ma);
  let html = '';
  if (laVanPhong()) {
    const ds = paCuaCongTrinh(db, ct.ma).slice().reverse();
    const cho = soLanSuaChoPhep(db, ct.ma);
    const n3d = ds.filter((p) => p.hangMuc === HM_DEM_SUA).length;
    const dem = n3d > 1 ? [`${HM_DEM_SUA}: đã sửa ${n3d - 1}/${cho} lần theo HĐ`] : [];
    html += `<h3>Thiết kế: phương án gửi khách</h3>
      ${dem.length ? `<p class="muted">${dem.map(esc).join(' · ')}</p>` : ''}
      ${ds.map((p) => thePA(ct, p, hn)).join('') || '<p class="muted">Chưa gửi phương án nào.</p>'}
      <div class="actions"><button id="guiPA" class="btn-chinh">+ Gửi phương án cho khách</button></div>`;
  }
  if (laVanPhong() || gs.length) {
    html += `<h3>Giám sát tác giả</h3>
      ${gs.map((g) => theGS(ct, g, hn)).join('') || '<p class="muted">Chưa lập danh sách buổi.</p>'}
      ${laVanPhong() ? `<div class="actions">${gs.length ? '' : '<button id="lapGS">Lập từ kế hoạch và HĐ</button>'}<button id="themGS">+ Thêm buổi</button></div>` : ''}`;
  }
  return html;
}

function thePA(ct, p, hn) {
  const cho = soNgayCho(p, hn);
  const vuot = vuotSoLan(db, p);
  const hd = hdThietKe(db, ct.ma);
  return `<div class="card">
    <div class="row"><span class="name">${esc(p.hangMuc)} · ${tenLan(p.lan)}</span><span class="tag ${{ CHO: 'SAP', SUA: 'TRE', DUYET: 'DANG' }[p.trangThai]}">${esc(TT_PA[p.trangThai])}</span></div>
    <div class="muted">Gửi ${ddmm(p.ngayGui)}${p.trangThai === 'CHO' ? ` · chờ ${cho >= CHO_KHACH ? `<span class="tre">${cho} ngày</span>` : cho + ' ngày'}` : ` · trả lời ${ddmm(p.ngayPhanHoi)}, ${esc(QUA[p.duyetQua] || p.duyetQua)}, sau ${cho} ngày`}${p.link ? ` · <a href="${esc(p.link)}" target="_blank" rel="noopener">file</a>` : ''}</div>
    ${p.yKien ? `<p class="muted">Ý kiến khách: ${esc(p.yKien)}</p>` : ''}
    ${p.ghiChu ? `<p class="muted">Ghi chú nội bộ: ${esc(p.ghiChu)}</p>` : ''}
    ${vuot && !p.phi ? `<div class="note">Khách muốn sửa lần ${p.lan + 1}, HĐ cho ${soLanSuaChoPhep(db, ct.ma)} lần.${hd ? '' : ' Chưa có HĐ thiết kế để ghi phí.'}
      <div class="actions"><button data-phi="${esc(p.id)}" data-co="1">Thu phí 5%${hd ? ' · ' + tien(phiSua(hd)) : ''}</button><button data-phi="${esc(p.id)}" data-co="0">Không thu</button></div></div>` : ''}
    ${vuot && p.phi ? `<p class="muted">Sửa vượt HĐ: ${p.phi === 'THU' ? 'đã ghi phí 5% vào phụ lục' : 'không thu phí'}</p>` : ''}
    ${p.trangThai === 'CHO' ? `<div class="actions"><button data-tra-loi="${esc(p.id)}">Khách trả lời</button><button data-nhac-pa="${esc(p.id)}">Nhắc qua Zalo</button></div>` : ''}
    ${p.trangThai === 'DUYET' ? `<div class="actions"><a class="btn" href="#xac-nhan-${esc(p.id)}" style="text-align:center">File xác nhận để ký</a></div>` : ''}
  </div>`;
}

function theGS(ct, g, hn) {
  const ngay = ngayGS(ct, g);
  const tag = g.xong ? `<span class="tag XONG">Đã làm ${ddmm(g.xong)}</span>` : ngay ? `<span class="tag ${ngay < hn ? 'TRE' : 'SAP'}">${ddmm(ngay)}</span>` : '<span class="tag SAP">Chưa hẹn</span>';
  return `<div class="card">
    <div class="row"><span class="name">Buổi ${g.lan}${g.ten ? ' · ' + esc(g.ten) : ''}</span>${tag}</div>
    <div class="muted">${g.ngay ? 'Ngày đã hẹn' : g.viec ? 'Theo kế hoạch thi công' : 'Chưa có ngày'}${g.nhacGiamSat ? ' · nhắc cả giám sát' : ''}${g.ghiChu ? ' · ' + esc(g.ghiChu) : ''}</div>
    ${laVanPhong() && !g.xong ? `<div class="actions"><button data-gs-xong="${esc(g.id)}">Đã giám sát</button><button data-gs-sua="${esc(g.id)}">Hẹn ngày</button></div>` : ''}
  </div>`;
}

function ganNutThietKe(ct) {
  const v = $('#view');
  const hn = homNay();
  const nut = (id, f) => { const x = $(id); if (x) x.onclick = f; };
  const timPA = (id) => (db.phuongAn || []).find((p) => p.id === id);
  const timGS = (id) => (db.gstg || []).find((g) => g.id === id);
  nut('#themHdCt', () => { taoHDTu = { maKhach: ct.maKhach || '', maCongTrinh: ct.ma }; location.hash = '#tao-hd'; });
  nut('#guiPA', () => moGuiPA(ct));
  nut('#lapGS', () => {
    const hd = hdCuaCongTrinh(db, ct.ma).find((h) => h.soBuoiGSTG);
    const ds = taoBuoiGSTG(db, ct, hd ? hd.soBuoiGSTG : 0);
    if (!ds.length) return bao('Kế hoạch chưa có mốc GSTG và HĐ chưa ghi số buổi. Bấm Thêm buổi.');
    luu(); bao(`Đã lập ${ds.length} buổi`); route();
  });
  nut('#themGS', () => moSuaGS(ct, null));
  v.querySelectorAll('[data-tra-loi]').forEach((b) => { b.onclick = () => moTraLoiPA(ct, timPA(b.dataset.traLoi)); });
  v.querySelectorAll('[data-nhac-pa]').forEach((b) => {
    b.onclick = () => { const p = timPA(b.dataset.nhacPa); chiaSe(`KAS Houzing gửi anh/chị ${p.hangMuc} (${tenLan(p.lan)}) công trình ${ct.ten}.\n${p.link ? 'Hồ sơ: ' + p.link + '\n' : ''}Anh/chị xem và bấm "Đồng ý" hoặc "Cần sửa" giúp KAS tại:\n${linkChuNhaCua(ct)}`); };
  });
  v.querySelectorAll('[data-phi]').forEach((b) => { b.onclick = () => { quyetPhi(db, ct, timPA(b.dataset.phi), b.dataset.co === '1', vaiTro, hn); luu(); bao(b.dataset.co === '1' ? 'Đã ghi phí sửa vào phụ lục HĐ' : 'Đã ghi: không thu phí'); route(); }; });
  v.querySelectorAll('[data-gs-xong]').forEach((b) => { b.onclick = () => moXongGS(ct, timGS(b.dataset.gsXong)); });
  v.querySelectorAll('[data-gs-sua]').forEach((b) => { b.onclick = () => moSuaGS(ct, timGS(b.dataset.gsSua)); });
}

// Việc trong kế hoạch ứng với hạng mục gửi khách (theo thư viện v1).
const VIEC_THEO_HM = { 'Mặt bằng công năng': ['TK02'], 'Phương án 3D': ['TK03', 'TK04'], 'Hồ sơ kỹ thuật': ['TK05'], 'Dự toán': ['TK06'] };

function moGuiPA(ct) {
  const dl = $('#sheet');
  const viecTK = ct.viec.filter((x) => /^Thiết kế/.test(x.nhom));
  dl.innerHTML = `<h2>Gửi phương án cho khách</h2>
    <label class="f">Hạng mục</label><select id="hm">${HANG_MUC_TK.map((h) => `<option>${esc(h)}</option>`).join('')}</select>
    <p class="muted" id="lanMoi"></p>
    <label class="f">Gắn với việc trong kế hoạch</label><select id="vc"><option value="">Không gắn</option>${viecTK.map((x) => `<option value="${esc(x.id)}">${esc(x.hangMuc)}</option>`).join('')}</select>
    <label class="f">Link hồ sơ / ảnh trên Drive</label><input id="lk" placeholder="https://drive.google.com/…">
    <label class="f">Ghi chú nội bộ (khách không thấy)</label><div class="mic"><textarea id="gc"></textarea><button id="noi">🎤</button></div>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu và gửi Zalo</button></div>`;
  dl.showModal();
  const doiHm = () => {
    const hm = $('#hm', dl).value;
    const n = paCuaCongTrinh(db, ct.ma).filter((p) => p.hangMuc === hm).length;
    const cho = soLanSuaChoPhep(db, ct.ma);
    $('#lanMoi', dl).innerHTML = !n ? 'Phương án đầu.' : hm === HM_DEM_SUA ? `Lần sửa thứ ${n}, HĐ cho ${cho} lần${n > cho ? ' <span class="tre">(vượt HĐ)</span>' : ''}.` : `Lần sửa thứ ${n} (không tính vào số lần sửa HĐ).`;
    const ung = (VIEC_THEO_HM[hm] || []).filter((id) => viecTK.some((x) => x.id === id));
    $('#vc', dl).value = ung[n && ung.length > 1 ? 1 : 0] || '';
  };
  $('#hm', dl).onchange = doiHm; doiHm();
  $('#noi', dl).onclick = () => noiThanhChu($('#gc', dl));
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    const pa = guiPhuongAn(db, ct, { hangMuc: $('#hm', dl).value, viec: $('#vc', dl).value, link: $('#lk', dl).value.trim(), ghiChu: $('#gc', dl).value.trim() }, vaiTro, homNay());
    luu(); dl.close(); route();
    chiaSe(`KAS Houzing gửi anh/chị ${pa.hangMuc} (${tenLan(pa.lan)}) công trình ${ct.ten}.\n${pa.link ? 'Hồ sơ: ' + pa.link + '\n' : ''}Anh/chị xem và bấm "Đồng ý" hoặc "Cần sửa" giúp KAS tại:\n${linkChuNhaCua(ct)}`);
  };
}

function moTraLoiPA(ct, pa) {
  const dl = $('#sheet');
  const hn = homNay();
  const v = pa.viec ? ct.viec.find((x) => x.id === pa.viec) : null;
  dl.innerHTML = `<h2>Khách trả lời: ${esc(pa.hangMuc)}, ${tenLan(pa.lan)}</h2>
    <div class="grid-btn"><button data-kq="DUYET">Đồng ý</button><button data-kq="SUA">Cần sửa</button></div>
    <label class="f">Khách trả lời qua</label><select id="qua"><option value="ZALO">Zalo</option><option value="GAP">Gặp trực tiếp</option></select>
    <label class="f">Ngày trả lời</label><input id="ng" type="date" value="${hn}">
    <label class="f">Ý kiến khách (bấm 🎤 nói)</label><div class="mic"><textarea id="yk"></textarea><button id="noi">🎤</button></div>
    <label class="cham-dong" id="luiBox" hidden><input type="checkbox" id="lui" checked> <span id="luiTxt"></span></label>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh" disabled>Lưu</button></div>`;
  dl.showModal();
  let kq = '';
  const tinhLui = () => {
    const cho = soNgayCho({ ...pa, ngayPhanHoi: $('#ng', dl).value }, hn);
    const n = cho - CHO_KHACH;
    $('#luiBox', dl).hidden = !(v && v.phanTram < 100 && n > 0);
    if (v) $('#luiTxt', dl).textContent = `Khách trả lời sau ${cho} ngày. Lùi "${v.hangMuc}" thêm ${n} ngày, nguyên nhân Chủ nhà (không tính KAS chậm)`;
    return n;
  };
  $('#ng', dl).onchange = tinhLui; tinhLui();
  dl.querySelectorAll('[data-kq]').forEach((b) => {
    b.onclick = () => { kq = b.dataset.kq; dl.querySelectorAll('[data-kq]').forEach((o) => o.classList.toggle('on', o === b)); $('#ok', dl).disabled = false; };
  });
  $('#noi', dl).onclick = () => noiThanhChu($('#yk', dl));
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    const n = tinhLui();
    const cho = phanHoi(db, ct, pa, { ketQua: kq, yKien: $('#yk', dl).value.trim(), qua: $('#qua', dl).value, ngay: $('#ng', dl).value }, vaiTro);
    if (!$('#luiBox', dl).hidden && $('#lui', dl).checked) baoCham(db, ct, v.id, { soNgay: n, nguyenNhan: 'Chủ nhà', ghiChu: `Chờ khách duyệt ${pa.hangMuc} ${cho} ngày` }, vaiTro);
    luu(); dl.close();
    bao(kq === 'DUYET' ? 'Đã ghi khách đồng ý. Có file xác nhận để ký' : vuotSoLan(db, pa) ? 'Đã ghi. Lần sửa này vượt HĐ, chọn thu phí hay không' : 'Đã ghi khách yêu cầu sửa');
    route();
  };
}

function moXongGS(ct, gs) {
  const dl = $('#sheet');
  dl.innerHTML = `<h2>Giám sát tác giả buổi ${gs.lan}</h2>
    <label class="f">Ngày</label><input id="ng" type="date" value="${homNay()}">
    <label class="f">Nội dung, lỗi cần sửa (bấm 🎤 nói)</label><div class="mic"><textarea id="gc"></textarea><button id="noi">🎤</button></div>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  dl.showModal();
  $('#noi', dl).onclick = () => noiThanhChu($('#gc', dl));
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => { xongBuoiGSTG(db, ct, gs, { ngay: $('#ng', dl).value, ghiChu: $('#gc', dl).value.trim() }, vaiTro); luu(); dl.close(); bao('Đã lưu buổi ' + gs.lan); route(); };
}

function moSuaGS(ct, gs) {
  const dl = $('#sheet');
  dl.innerHTML = `<h2>${gs ? 'Hẹn buổi ' + gs.lan : 'Thêm buổi giám sát tác giả'}</h2>
    <label class="f">Nội dung buổi</label><input id="ten" value="${esc(gs ? gs.ten : '')}" placeholder="Vd: sau xây trát">
    <label class="f">Ngày hẹn${gs && gs.viec ? ' (để trống = theo kế hoạch thi công)' : ''}</label><input id="ng" type="date" value="${esc(gs ? gs.ngay : '')}">
    <label class="cham-dong"><input type="checkbox" id="nhac" ${!gs || gs.nhacGiamSat ? 'checked' : ''}> <span>Nhắc cả giám sát công trình</span></label>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  dl.showModal();
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    const du = { ten: $('#ten', dl).value.trim(), ngay: $('#ng', dl).value, nhacGiamSat: $('#nhac', dl).checked };
    if (gs) suaBuoiGSTG(db, gs, du); else themBuoiGSTG(db, ct, du);
    luu(); dl.close(); route();
  };
}

// File xác nhận phương án để in hoặc lưu PDF rồi ký giấy.
function manXacNhan(id) {
  const pa = (db.phuongAn || []).find((p) => p.id === id);
  const ct = pa && db.congTrinh.find((c) => c.ma === pa.maCongTrinh);
  if (!pa || !ct) return manHomNay();
  const kh = (db.khach || []).find((k) => k.ma === ct.maKhach);
  const hd = hdThietKe(db, ct.ma);
  const gio = pa.duyetLuc ? new Date(pa.duyetLuc).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
  datTab('cong-trinh', 'Xác nhận phương án');
  $('#view').innerHTML = `<div class="giay">
    <p class="giay-dau"><b>CÔNG TY TNHH KAS VIỆT NAM · KAS HOUZING</b></p>
    <h2>BIÊN BẢN XÁC NHẬN PHƯƠNG ÁN THIẾT KẾ</h2>
    <p>Công trình: <b>${esc(ct.ten)}</b> (mã ${esc(ct.ma)})</p>
    ${hd ? `<p>Theo hợp đồng số: <b>${esc(hd.soHD)}</b>, ký ngày ${fmtNgay(hd.ngayKy)}</p>` : ''}
    <p>Chủ nhà: ${esc(kh ? kh.ten : ct.chuNha || '………………………………')}</p>
    <p>Hạng mục: <b>${esc(pa.hangMuc)}</b>, ${tenLan(pa.lan)}</p>
    <p>KAS gửi ngày: ${fmtNgay(pa.ngayGui)}${pa.link ? `<br>Hồ sơ: ${esc(pa.link)}` : ''}</p>
    <p>Chủ nhà đồng ý ngày ${fmtNgay(pa.ngayPhanHoi)}, ${esc(QUA[pa.duyetQua] || '')}${pa.duyetQua === 'LINK' && gio ? ' lúc ' + gio : ''}.</p>
    ${pa.yKien ? `<p>Ý kiến kèm theo: ${esc(pa.yKien)}</p>` : ''}
    <p>Hai bên thống nhất phương án trên làm cơ sở triển khai các bước thiết kế tiếp theo.</p>
    <div class="ky"><div><b>ĐẠI DIỆN CHỦ NHÀ</b><br><i>(Ký, ghi rõ họ tên)</i></div><div><b>ĐẠI DIỆN KAS HOUZING</b><br><i>(Ký, ghi rõ họ tên)</i></div></div>
  </div>
  <div class="actions khong-in"><button id="in" class="btn-chinh">In / lưu PDF</button><a class="btn" href="#ct-${esc(ct.ma)}" style="text-align:center">Quay lại</a></div>`;
  $('#in').onclick = () => window.print();
}

// Bản chạy thử: tạo sẵn 1 công trình mẫu đang thi công dở để có cái mà xem.
function taoMau() {
  const hn = homNay();
  const kc = new Date(Date.parse(hn) - 40 * 86400000).toISOString().slice(0, 10);
  const ct = taoCongTrinh(db, thuVien, { ma: 'MAU-XALA', ten: 'Mẫu: Căn hộ Xa La', loai: 'NTCT', khoiCong: kc, lich: { kieu: 'NGHI_CN', nghi: [], daHoi: [] } });
  const lich = lichHienTai(ct);
  for (const v of ct.viec) {
    const t = lich.get(v.id);
    if (t.ketThuc < hn && !['XT02', 'DH01'].includes(v.id)) capNhatTienDo(db, ct, v.id, 100, 'KHA', t.ketThuc);
    else if (t.batDau <= hn) capNhatTienDo(db, ct, v.id, 50, 'KHA', t.batDau);
  }
  baoCham(db, ct, 'XT05', { soNgay: 3, nguyenNhan: 'Chủ nhà', ghiChu: 'Chủ nhà đổi vị trí tường bếp, chờ chốt' }, 'KHA');
  // Sổ khách mẫu: mỗi trạng thái một người để thấy app nhắc gì.
  const truoc = (n) => new Date(Date.parse(hn) - n * 86400000).toISOString().slice(0, 10);
  const k1 = taoKhach(db, { ten: 'Mẫu: Chị Lan Mỹ Đình', sdt: '0900000001', loai: 'NT', tomTat: 'Căn hộ 110m2, muốn làm nội thất trước Tết' }, 'THAY', hn);
  const k2 = taoKhach(db, { ten: 'Mẫu: Anh Hùng Long Biên', sdt: '0900000002', nguon: 'Facebook / Zalo', loai: 'XM' }, 'DUC', truoc(12));
  doiTrangThai(db, k2, 'KHAO_SAT', 'DUC', truoc(9));
  themBaoGia(db, k2, { giaTri: 96000000, ghiChu: 'Nhà 4 tầng 320m2' }, 'THAY', truoc(7));
  daGoi(db, k2, false, 'Không nghe máy', 'THAY', truoc(5));
  k2.nhacGoi = truoc(1);
  const k3 = taoKhach(db, { ten: 'Mẫu: Chị Hoa', sdt: '0900000003', nguon: 'Khách cũ giới thiệu', nguoiGioiThieu: 'Mẫu: Anh Bình', loai: 'NTCT' }, 'THAY', truoc(3));
  doiTrangThai(db, k3, 'HEN_GAP', 'THAY', truoc(3), { henLai: addDaysUI(hn, 2), ghiChu: 'Hẹn xem nhà thứ 7' });
  const k4 = taoKhach(db, { ten: 'Mẫu: Căn hộ Xa La', sdt: '0900000004', nguoiGioiThieu: 'Mẫu: Anh Tú', loai: 'NTCT' }, 'THAY', truoc(60));
  k4.hoaHong = { soTien: 10000000, daTra: false };
  themBaoGia(db, k4, { giaTri: 25000000 }, 'THAY', truoc(55));
  chotBaoGia(db, k4, k4.baoGia[0].id, truoc(50));
  ganCongTrinh(db, k4, ct.ma, 'THAY', truoc(45));
  ct.maKhach = k4.ma;
  const k5 = taoKhach(db, { ten: 'Mẫu: Anh Bình', sdt: '0900000005', loai: 'NT' }, 'THAY', truoc(200));
  ganCongTrinh(db, k5, 'NT-BINH-2604', 'THAY', truoc(150));
  banGiao(db, k5, truoc(33), 'THAY', truoc(33));
  void k1;
  // Hợp đồng mẫu: HĐ thiết kế đã thu đủ, HĐ nội thất trừ phí thiết kế, đợt 2 gắn mốc đã xong → app nhắc thu.
  const tk = taoHopDong(db, { dang: 'TK', tenKhach: 'Chị Xa La', maKhach: k4.ma, maCongTrinh: ct.ma, ngayKy: truoc(50), giaTri: 25000000, phamVi: 'NT', hanKhauTru: addDaysUI(truoc(50), 180), soBuoiGSTG: 4 }, 'THAY');
  ghiThu(db, tk, tk.dot[0].id, { ngay: truoc(50), soTien: 17500000, ghiChu: 'Chuyển khoản' }, 'THAY');
  ghiThu(db, tk, tk.dot[1].id, { ngay: truoc(43), soTien: 7500000 }, 'THAY');
  const nt = taoHopDong(db, { dang: 'NT', tenKhach: 'Chị Xa La', maKhach: k4.ma, maCongTrinh: ct.ma, ngayKy: truoc(42), giaTri: 650000000 }, 'THAY');
  apKhauTru(db, nt, hdThietKeDuocTru(db, nt), 'THAY');
  ghiThu(db, nt, nt.dot[0].id, { ngay: truoc(41), soTien: 300000000 }, 'THAY');
  dongDot(db, nt, nt.dot[0].id, truoc(41), 'THAY');
  const mocXong = ct.viec.find((v) => v.phanTram >= 100 && v.nhom.startsWith('Xây'));
  suaDot(db, nt, nt.dot[1].id, { ten: 'Xong xây trát', moc: mocXong ? mocXong.id : '' });
  // Phương án: 3D sửa 1 lần rồi khách đồng ý trên link; hồ sơ kỹ thuật gửi 4 ngày chưa trả lời.
  const pa0 = guiPhuongAn(db, ct, { hangMuc: 'Phương án 3D' }, 'DUC', truoc(48));
  phanHoi(db, ct, pa0, { ketQua: 'SUA', yKien: 'Đổi tủ bếp chữ L, bỏ vách kính', qua: 'ZALO', ngay: truoc(46) }, 'THAY');
  const pa1 = guiPhuongAn(db, ct, { hangMuc: 'Phương án 3D' }, 'DUC', truoc(45));
  phanHoi(db, ct, pa1, { ketQua: 'DUYET', qua: 'LINK', ngay: truoc(44) }, 'CHU_NHA');
  guiPhuongAn(db, ct, { hangMuc: 'Hồ sơ kỹ thuật' }, 'DUC', truoc(4));
  taoBuoiGSTG(db, ct, 4);
  luu();
}

// ---------- Khởi động ----------
async function main() {
  const sync = document.createElement('span');
  sync.id = 'sync'; sync.className = 'sync';
  $('.topbar .role').before(sync);
  khoiDongVaiTro();
  try { thuVien = await (await fetch('data/thu-vien-v1.json')).json(); } catch { bao('Không tải được thư viện'); }
  if (!db.congTrinh.length && !daKetNoi() && window.KAS_DEMO && thuVien.length) taoMau();
  window.addEventListener('hashchange', route);
  window.addEventListener('online', chayDongBo);
  window.addEventListener('offline', () => capNhatTrangThai('mat-mang'));
  setInterval(chayDongBo, 60000);
  route();
  capNhatTrangThai();
  chayDongBo();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
main();

