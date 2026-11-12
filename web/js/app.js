import { LICH, leCanHoi, diffDays } from './schedule.js';
import {
  doc, ghi, taoCongTrinh, lichHienTai, capNhatTienDo, baoCham, ghiChu, tongHop, viecHomNay, datCongKhai,
  NGUYEN_NHAN, LOAI_HINH, VAI_TRO,
} from './store.js';
import { ketNoi, luuKetNoi, goi, dongBo, xemChuNha, maApi } from './api.js';
import { xepAnh, demCho, guiAnhCho } from './anh.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const homNay = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const ddmm = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : '');
const VAN_PHONG = ['THAY', 'DUC', 'TRUNG'];

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
  document.querySelectorAll('.chi-thay').forEach((el) => { el.hidden = !(daKetNoi() && vaiTro === 'THAY'); });
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
  if (h === 'nguoi-dung') return vaiTro === 'THAY' && daKetNoi() ? manNguoiDung() : manHomNay();
  return manHomNay();
}

// ---------- Hôm nay (điện thoại) ----------
function manHomNay() {
  datTab('hom-nay', 'Hôm nay ' + ddmm(homNay()));
  const v = $('#view');
  if (!db.congTrinh.length) {
    v.innerHTML = `<h2>Chưa có công trình nào</h2><p class="muted">${laVanPhong() ? 'Bấm <b>Tạo mới</b> để tạo công trình từ thư viện hạng mục.' : 'Văn phòng chưa tạo công trình.'}</p>`;
    return;
  }
  const hn = homNay();
  v.innerHTML = db.congTrinh.map((ct) => {
    const ds = viecHomNay(ct, hn);
    const th = tongHop(ct, hn);
    return `<h3>${esc(ct.ma)} · ${esc(ct.ten)}</h3>
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
  if (!db.congTrinh.length) { v.innerHTML = '<p class="muted">Chưa có công trình.</p>'; return; }
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
    </table></div>`;
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
    ${lsCham.length && vaiTro === 'THAY' ? `<details class="cham-ds"><summary>Các lần báo chậm (${lsCham.length}) · chọn lần nào cho chủ nhà xem</summary>
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
function manTao() {
  datTab('tao', 'Tạo công trình');
  const yy = homNay().slice(2, 4) + homNay().slice(5, 7);
  $('#view').innerHTML = `<h2>Tạo công trình từ thư viện</h2>
    <label class="f">Loại hình</label>
    <select id="loai">${Object.entries(LOAI_HINH).map(([k, v]) => `<option value="${k}" ${k === 'NTCT' ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <label class="f">Mã dự án</label><input id="ma" value="NT-${yy}-">
    <label class="f">Tên công trình</label><input id="ten" placeholder="Vd: Căn hộ chị Xuân, Xa La">
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
  $('#loai').onchange = xem; xem();
  $('#tao').onclick = () => {
    const ma = $('#ma').value.trim().toUpperCase(), ten = $('#ten').value.trim();
    if (!ma || !ten) return bao('Cần mã và tên công trình');
    if (!/^[A-Z0-9-]+$/.test(ma)) return bao('Mã chỉ gồm chữ không dấu, số và gạch ngang');
    if (db.congTrinh.some((c) => c.ma === ma)) return bao('Mã này đã có');
    const lich = { kieu: $('#lich').value, nghi: [], daHoi: [] };
    const loai = $('#loai').value, khoiCong = $('#kc').value;
    // Tạo thử để biết khoảng thời gian, rồi hỏi các ngày lễ nằm trong đó.
    const thu = { db: { congTrinh: [], lichSu: [], outbox: [] } };
    const tam = taoCongTrinh(thu.db, thuVien, { ma, ten, loai, khoiCong, lich });
    const den = tam.viec.reduce((m, v) => (v.goc.ketThuc > m ? v.goc.ketThuc : m), khoiCong);
    hoiNgayLe(leCanHoi(khoiCong, den, lich), (nghi, daHoi) => {
      lich.nghi = nghi; lich.daHoi = daHoi;
      const ct = taoCongTrinh(db, thuVien, { ma, ten, loai, khoiCong, lich, thuMucDrive: $('#drive').value.trim() });
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
  if (!cu || cu.khoa !== khoa) { db = { congTrinh: [], lichSu: [], outbox: [], nguoiDung: [] }; ghi(db); }
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
  if (t) t.onclick = () => { luuKetNoi(null); db = { congTrinh: [], lichSu: [], outbox: [], nguoiDung: [] }; ghi(db); location.reload(); };
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
    ${ds.map((u) => `<div class="card"><div class="row"><span class="name">${esc(u.ten)}</span><span class="tag XONG">${esc(VAI_TRO[u.vaiTro] || u.vaiTro)}</span></div>
      <div class="muted">${esc(u.email)}${u.congTrinh ? ' · ' + esc(u.congTrinh) : ''}</div>
      ${u.khoa !== kn.khoa ? `<div class="actions"><button data-gui="${esc(u.khoa)}" data-ten="${esc(u.ten)}">Gửi lại link</button><button class="btn-do" data-thu-hoi="${esc(u.khoa)}">Thu hồi</button></div>` : '<p class="muted">Đây là Thầy</p>'}</div>`).join('')}
    <h3>Thêm người</h3>
    <label class="f">Tên</label><input id="ten" placeholder="Vd: Kha">
    <label class="f">Gmail</label><input id="email" type="email" placeholder="kha@gmail.com">
    <label class="f">Vai trò</label>
    <select id="vt">${Object.entries(VAI_TRO).filter(([k]) => k !== 'THAY').map(([k, v]) => `<option value="${k}" ${k === 'KHA' ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <div id="ctChon"><label class="f">Công trình được giao (giám sát chỉ thấy các công trình này)</label>
    ${db.congTrinh.map((c) => `<label class="cham-dong"><input type="checkbox" value="${esc(c.ma)}"> <span>${esc(c.ma)} · ${esc(c.ten)}</span></label>`).join('') || '<p class="muted">Chưa có công trình.</p>'}</div>
    <div class="actions"><button id="them" class="btn-chinh">Tạo link</button></div>`;
  const ctChon = $('#ctChon');
  $('#vt').onchange = () => { ctChon.hidden = $('#vt').value !== 'KHA'; };
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
    const congTrinh = vt === 'KHA' ? [...ctChon.querySelectorAll('input:checked')].map((i) => i.value).join(',') : '';
    $('#them').disabled = true;
    try {
      const { khoa } = await goi('capKhoa', { ten, email, vaiTro: vt, congTrinh });
      await chayDongBo();
      manNguoiDung();
      chiaSe(`${ten} ơi, đây là link app KAS của em. Mở 1 lần bằng Chrome, rồi bấm "Thêm vào màn hình chính":\n${linkCua(khoa)}`);
    } catch (e) { bao(e.message); $('#them').disabled = false; }
  };
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

