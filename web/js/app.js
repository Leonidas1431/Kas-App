import { LICH, leCanHoi, diffDays } from './schedule.js';
import {
  doc, ghi, taoCongTrinh, lichHienTai, capNhatTienDo, baoCham, ghiChu, tongHop, viecHomNay, datCongKhai,
  NGUYEN_NHAN, LOAI_HINH, VAI_TRO, VAN_PHONG, rong,
} from './store.js';
import {
  TRANG_THAI, DANG_THEO, NGUON, LY_DO_MAT, NHU_CAU_LOAI, O_NHU_CAU, taoKhach, timTheoSdt, suaKhach, doiTrangThai, daGoi,
  ghiChuKhach, themBaoGia, chotBaoGia, ganCongTrinh, banGiao, xongChamSoc, viecKhachHomNay, thongKe,
} from './khach.js';
import { ketNoi, luuKetNoi, goi, dongBo, xemChuNha, maApi } from './api.js';
import { xepAnh, demCho, guiAnhCho } from './anh.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const homNay = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const addDaysUI = (s, n) => new Date(Date.parse(s) + n * 86400000).toISOString().slice(0, 10);
const ddmm = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : '');

let db = doc();
let thuVien = [];
let vaiTro = (() => { try { return localStorage.getItem('kas-role') || 'THAY'; } catch { return 'THAY'; } })();
const laVanPhong = () => VAN_PHONG.includes(vaiTro);
const daKetNoi = () => !!ketNoi();
const goc = () => `${location.origin}${location.pathname}`;
const daChonDemo = () => { try { return !!window.KAS_DEMO || localStorage.getItem('kas-demo') === '1'; } catch { return !!window.KAS_DEMO; } };

// Lưu vào máy ngay, rồi hẹn gửi lên máy chủ (gom các thao tác liền nhau thành 1 lần gửi).
let henGui = null;
function luu() { ghi(db); clearTimeout(henGui); henGui = setTimeout(chayDongBo, 800); }

async function chayDongBo() {
  if (!daKetNoi()) return;
  const r = await dongBo(db, () => ghi(db));
  if (r.biTuChoi && r.biTuChoi.length) bao('Máy chủ từ chối: ' + r.biTuChoi[0]);
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
  el.textContent = matMang ? `Mất mạng${cho ? ' · chờ gửi ' + cho : ''}` : cho ? `Đang gửi ${cho}` : 'Đã lưu';
  el.className = 'sync ' + (matMang ? 'off' : cho ? 'cho' : 'ok');
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
  if (h === 'cong-trinh') return manDanhSach();
  if (h === 'tao') return laVanPhong() ? manTao() : manHomNay();
  if (h === 'khach') return laVanPhong() ? manKhach() : manHomNay();
  if (h.startsWith('kh-')) return laVanPhong() ? manMotKhach(h.slice(3)) : manHomNay();
  if (h === 'nguoi-dung') return laVanPhong() && daKetNoi() ? manNguoiDung() : manHomNay();
  return manHomNay();
}

// ---------- Hôm nay (điện thoại) ----------
function manHomNay() {
  datTab('hom-nay', 'Hôm nay ' + ddmm(homNay()));
  const v = $('#view');
  const hn = homNay();
  const khoiKhach = laVanPhong() ? khachHomNay(hn) : '';
  if (!db.congTrinh.length) {
    v.innerHTML = `${khoiKhach}<h2>Chưa có công trình nào</h2><p class="muted">${laVanPhong() ? 'Vào <b>Công trình</b> → <b>Tạo công trình</b>, hoặc tạo từ hồ sơ khách đã ký.' : 'Văn phòng chưa tạo công trình.'}</p>`;
    return;
  }
  v.innerHTML = khoiKhach + db.congTrinh.map((ct) => {
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
      Kế hoạch gốc ${ddmm(x.goc.batDau)}–${ddmm(x.goc.ketThuc)} · hiện tại ${ddmm(t.batDau)}–${ddmm(t.ketThuc)} · ${x.soNgay} ngày công</p>
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
    ${lsu.length ? `<h3>Gần đây</h3>${lsu.map((e) => `<p class="muted">${ddmm(String(e.luc).slice(0, 10))} · ${esc(VAI_TRO[e.nguoi] || e.nguoi)}: ${moTa(e)}</p>`).join('')}` : ''}
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
  v.innerHTML = `<h2>Bảng tổng ${db.congTrinh.length} công trình</h2>
    <div class="wrap"><table>
      <tr><th>Công trình</th><th class="an-dt">Loại</th><th>Thực tế / KH</th><th>Việc trễ</th><th>Xong dự kiến</th></tr>
      ${db.congTrinh.map((ct) => {
        const th = tongHop(ct, hn);
        const lech = diffDays(th.ketThucGoc, th.ketThuc);
        return `<tr><td><a href="#ct-${esc(ct.ma)}"><b>${esc(ct.ma)}</b></a><br><span class="muted">${esc(ct.ten)}</span></td>
          <td class="an-dt">${LOAI_HINH[ct.loai]}</td>
          <td class="so">${th.pctThucTe}% / ${th.pctKeHoach}%</td>
          <td class="so ${th.viecTre ? 'tre' : ''}">${th.viecTre}</td>
          <td class="so">${ddmm(th.ketThuc)}${lech > 0 ? `<br><span class="tre">+${lech} ngày</span>` : ''}</td></tr>`;
      }).join('')}
    </table></div>${nutTao}`;
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
  const linkChuNha = `${goc()}#chu-nha-${ct.maLinkChuNha}${kn ? '&api=' + maApi(kn.api) : ''}`;
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
      ${laVanPhong() ? `<button id="linkCN">Gửi link cho chủ nhà</button>` : ''}
      <a class="btn" href="#chu-nha-${ct.maLinkChuNha}${kn ? '&api=' + maApi(kn.api) : ''}" style="text-align:center">Xem như chủ nhà</a>
    </div>`;
  $('#view').querySelectorAll('[data-viec]').forEach((r) => { r.onclick = () => moViec(r.dataset.ct, r.dataset.viec); });
  $('#view').querySelectorAll('[data-cong-khai]').forEach((c) => {
    c.onchange = () => { datCongKhai(db, c.dataset.congKhai, c.checked); luu(); bao(c.checked ? 'Chủ nhà sẽ thấy lần chậm này' : 'Đã ẩn với chủ nhà'); };
  });
  const b = $('#linkCN');
  if (b) b.onclick = () => chiaSe(`KAS gửi anh/chị link theo dõi tiến độ công trình ${ct.ten}:\n${linkChuNha}`);
}

// ---------- Link chủ nhà (không đăng nhập) ----------
async function manChuNha(maLink, api) {
  $('#title').textContent = 'Tiến độ công trình';
  let ct = db.congTrinh.find((c) => c.maLinkChuNha === maLink);
  let lichSu = db.lichSu;
  if (api) {
    // Máy chủ nhà: lấy thẳng từ máy chủ, chỉ phần chủ nhà được xem.
    $('#view').innerHTML = '<p class="muted">Đang tải…</p>';
    try { ({ ct, lichSu } = await xemChuNha(api, maLink)); } catch (e) { ct = null; }
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
    <p class="muted">Cập nhật bởi KAS Houzing.</p>`;
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
      luu(); bao('Đã tạo ' + ct.ma); location.hash = '#ct-' + ct.ma;
    });
  };
}

function hoiNgayLe(ds, xong) {
  if (!ds.length) return xong([], []);
  const d = $('#sheet');
  d.innerHTML = `<h2>Công trình vướng ngày lễ</h2>
    <p class="muted">Tick những ngày công trình nghỉ thực tế. Ngày không tick sẽ tính là ngày làm.</p>
    ${ds.map((n) => `<label class="card" style="display:flex;gap:10px;align-items:center"><input type="checkbox" value="${n}" checked style="width:auto"> ${ddmm(n)}/${n.slice(0, 4)}</label>`).join('')}
    <p class="muted">Tết âm lịch, Giỗ Tổ: thêm sau trong phần sửa lịch (bản thử chưa có).</p>
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

    ${lsu.length ? `<h3>Lịch sử</h3>${lsu.map((e) => `<p class="muted">${ddmm(String(e.luc).slice(0, 10))} · ${esc(VAI_TRO[e.nguoi] || e.nguoi)}: ${moTa(e)}</p>`).join('')}` : ''}`;

  const v = $('#view');
  const ve = () => { luu(); manMotKhach(ma); };
  const nutGoi = $('#daGoi');
  if (nutGoi) nutGoi.onclick = () => moDaGoi(kh);
  v.querySelectorAll('[data-tt]').forEach((b) => { b.onclick = () => moDoiTrangThai(kh, b.dataset.tt); });
  const ky = $('#ky');
  if (ky) ky.onclick = () => { tuKhach = kh.ma; location.hash = '#tao'; };
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

