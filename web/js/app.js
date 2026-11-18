import { LICH, KIEU_NOI, leCanHoi, diffDays, addDays, xepLich, taoTuThuVien } from './schedule.js';
import { suaViec, themViec, xoaViec, suaCongTrinh, chotKeHoachGoc, xemTruoc, dsNhaThau } from './kehoach.js';
import {
  doc, ghi, taoCongTrinh, lichHienTai, capNhatTienDo, baoCham, ghiChu, tongHop, viecHomNay, datCongKhai,
  NGUYEN_NHAN, LOAI_HINH, VAI_TRO, VAN_PHONG, rong, datCaiDat, laTre, taoMa,
} from './store.js';
import {
  TRANG_THAI, DANG_THEO, NGUON, LY_DO_MAT, NHU_CAU_LOAI, O_NHU_CAU, taoKhach, timTheoSdt, suaKhach, doiTrangThai, daGoi,
  ghiChuKhach, themBaoGia, chotBaoGia, ganCongTrinh, banGiao, xongChamSoc, viecKhachHomNay,
} from './khach.js';
import {
  leadCanGoi, conLai, choGoiDau, PHU_TRACH, NHIET_DO, THOI_DIEM, MAT_BANG, PHAN_KHUC, goiYNhietDo, nhietDo, baoDuc,
  BUOC, NHOM_BUOC, buocXong, tichBuoc, buocTiep, dsMauTin, dienMau, LOAI_LINK, taoLinkDK, suaLinkDK, linkGTCuaKhach, urlForm, demTheoLink,
  HM_HH, daTraHH, capNhatHoaHong, GIOI_TINH, LOAI_LICH, VAI_NGUOI, ptRong, docNgaySinh, docDoSo, tachSdt, MAU_TIN, khoaMau as khoaMauTin,
} from './lead.js';
import {
  DANG_HD, TT_HD, goiYTenHD, soHopDong, dotMacDinh, taoHopDong, suaHopDong, tinhDot, ghiThu, dongDot, moLaiDot, suaDot, themDot,
  themPhuLuc, phiSua, hdThietKeDuocTru, apKhauTru, PHAM_VI_TK, TY_LE_KHAU_TRU, giaTriPhan, phanChoTru, doiTrangThaiHD, hdCuaCongTrinh, hdCuaKhach, congTrinhDaXong, viecHopDongHomNay, tongHopTien,
} from './hopdong.js';
import {
  HANG_MUC_TK, HM_DEM_SUA, TT_PA, QUA, CHO_KHACH, paCuaCongTrinh, hdThietKe, soLanSuaChoPhep, guiPhuongAn, tenLan, soNgayCho, vuotSoLan, phanHoi,
  quyetPhi, gsCuaCongTrinh, ngayGS, taoBuoiGSTG, themBuoiGSTG, suaBuoiGSTG, xongBuoiGSTG, viecThietKeHomNay,
} from './thietke.js';
import {
  CTY, HM_CHI, HM_CTY, HM_THU, HINH_THUC, docTien, ghiKhoan, suaKhoan, xoaKhoan, soConLai, dsTraThau, daTra, goiYMaDot, themDotTra, suaDotTra, xoaDotTra,
  xacNhanKL, trangThaiTra, canXacNhanKL, tongThang, congNoThau, laiGop, dsDoiTuong,
  LOAI_TK, loaiNo, dsTaiKhoan, tkChoGiamSat, themTaiKhoan, suaTaiKhoan, soDu, congNoKhach, noTheoDoiTuong, dongTien, choKiem, duyetKhoan,
} from './thuchi.js';
import {
  TT_PS, QUA_PS, HAN_CHOT, NGUONG_MAC_DINH, psCuaCongTrinh, baoPhatSinh, baoGia, khachTraLoi, suaPS, xoaPS, daLamPS, daThuPS, tongPS, viecPSHomNay, tinBaoGia,
} from './phatsinh.js';
import { TT_MAU, NGAY_DAT_HANG, mauCuaCongTrinh, hanChotMacDinh, themMau, suaMau, xoaMau, khachChotMau, guiLaiMau, mauCanChot, tinGuiMau } from './mauvl.js';
import { LINH_VUC, TIEU_CHI, dsThau, timThauTheoTen, themThau, suaThau, viecCuaThau, danhGia, tongHopThau, canDanhGia, ghiDaChupAnh, tinLinkThau, congTrinhCanAnh, GIO_NHAC_ANH } from './nhathau.js';
import { HAN_SUA_MAC_DINH, checklistMacDinh, canNghiemThu, ntCuaViec, nghiemThu, daSuaTonTai, doiHanSua, ketQuaViec, choNghiemThu, tonTaiMo, dieuKienDo, canDoNoiThat } from './nghiemthu.js';
import { HM_MKT, KENH_MKT, CHUA_GAN, MAC_DINH, goiYHoaHong, tienDoThang, ngayVao, khoangKy, baoCaoNguon, dsNguoiGioiThieu } from './marketing.js';
import { ketNoi, luuKetNoi, goi, dongBo, xemChuNha, anhChuNha, xemChoThau, maApi, chuNhaPhanHoi, chuNhaBaoLoi, apiDaBiet, nhoApi, layCauHinh, dangNhapGoogle, veNutGoogle } from './api.js';
import { xepAnh, xepAnhLayMa, xepAnhSan, anhCho, demCho, guiAnhCho, nenAnh } from './anh.js';
import {
  KENH, KENH_TU_DONG, LOAI_BAI, TT_BAI, MAC_DINH_BD, MODEL, caiDatBD, timBai, taoBai, suaBai, xoaBai, nhanBai, boChoGui, kenhXong, kenhLoi, coLoi,
  MODEL_ANH, dauTuan, lichTuan, choDuyet, chuaHen, loiDang, choDangTay, daDangGanDay, goiYCongTrinh, chiAIThang, hanMucAI, soVoiHan, MAC_DINH_HAN, chuDeChep, nhomViet, kiemTruocKhiViet,
} from './dangbai.js';
import { MAU_BIA, veBia, taiAnh, catKho, KHO_BIA, dsDichBia } from './anhbia.js';
import {
  ANH_TOI_THIEU, ANH_TUAN_TOI_DA, MOC_NHAC, bcCua, daNop, bcCuaCongTrinh, thauDuKien, viecConCuaThau, viecNgayMai, luuBaoCao, kiemTraNop, nhacBaoCao, tinZaloBC,
  laCongNhat, canChamCong, chamCong, bangCong, CACH_LUI, soNgayDenNgay, apBaoCham, deXuatCham, deXuatCho, xuLyDeXuat, xemTruocCham,
  dauTuan as dauTuanBC, tuanCua, daToiGioTuan, gomTuan, noiBoTuan, luuTuan, canGuiTuan, tinZaloTuan,
} from './baocao.js';
import {
  BH_MAC_DINH, TT_BG, QUA_BG, TT_BH, GIAM_SAT, nhomChinh, bgCua, taoBienBan, suaBienBan, hanBaoHanh, hanThietBi, hetBaoHanh, mocHetHan, guiChuNha, khachXacNhan,
  batDauChamSoc, bhCuaCongTrinh, trongHan, goiYGiao, laKhan, hanXuLy, baoLoi, suaBH, nhanXuLy, xongBH, khongXuLy, conThuBH, quaHanBH, viecBHHomNay, daNhacHetHan,
  tongKet, thanhLy, tinGuiBienBan, tinGiaoBH, tinThanhToanCuoi,
} from './bangiao.js';

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const homNay = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const addDaysUI = (s, n) => new Date(Date.parse(s) + n * 86400000).toISOString().slice(0, 10);
const ddmm = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}` : '');
const fmtNgay = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : '……/……/……');
const tenNguoi = (n) => VAI_TRO[n] || (n === 'CHU_NHA' ? 'Chủ nhà' : n === 'FORM' ? 'Form đăng ký' : n);

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
  if (r.mayChuCu && !mayChuCu) bao('Máy chủ cần cập nhật bản mới để lưu tính năng mới. Dữ liệu vẫn giữ trên máy.');
  if (r.trangThai === 'xong') mayChuCu = !!r.mayChuCu;
  if (r.trangThai === 'loi') bao('Chưa gửi được: ' + r.loi);
  // Khoá hết hiệu lực (bị thu hồi, hoặc app đã chuyển sang chỉ Gmail): mở màn Đăng nhập, việc chưa gửi vẫn giữ trên máy.
  if (r.trangThai === 'loi' && /Đăng nhập|đăng nhập lại/.test(r.loi || '') && location.hash !== '#ket-noi') { location.hash = '#ket-noi'; return; }
  if (r.trangThai === 'xong' && db.toi) vaiTro = db.toi.vaiTro;
  if (navigator.onLine) await guiAnhCho(goi).catch((e) => bao('Ảnh chưa gửi được: ' + e.message));
  await capNhatTrangThai(r.trangThai);
  // Vẽ lại màn đang xem bằng dữ liệu mới, trừ khi đang mở hộp nhập liệu.
  if (r.trangThai === 'xong' && !$('#sheet').open && !dangGo()) route();
}

// Đang gõ trong ô nhập của màn hình, hoặc đang chờ AI: không vẽ lại, kẻo mất chữ đang gõ.
function dangGo() {
  if (dangGoiAI) return true;
  const a = document.activeElement;
  return !!(a && $('#view').contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName));
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
// Phiếu (dialog) mở thì đưa thông báo vào trong phiếu, không thì bị phiếu che mất.
function bao(msg, ms = 2200) {
  // Thông báo nằm trong phiếu mà phiếu bị vẽ lại (innerHTML) thì mất: tạo lại.
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); }
  const dlg = [...document.querySelectorAll('dialog[open]')].pop();
  const cha = dlg || document.body;
  if (t.parentElement !== cha) cha.appendChild(t);
  t.textContent = msg; t.classList.add('on');
  clearTimeout(bao.hen); bao.hen = setTimeout(() => t.classList.remove('on'), ms);
}

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
  // #cong-trinh, #tao, #nguoi-dung, #ct-<mã DA>, #chu-nha-<mã link>[&api=<mã>], #k=<khoá>&api=<mã>, #dang-nhap&api=<mã>
  const [h, ...thamSo] = location.hash.slice(1).split('&');
  const ts = Object.fromEntries(thamSo.map((x) => x.split('=')));
  if (h.startsWith('k=')) return nhanLinhDangNhap(h.slice(2), ts.api);
  if (h === 'dang-nhap') { if (ts.api) nhoApi(ts.api); history.replaceState(null, '', goc() + '#ket-noi'); return manKetNoi(); }
  const chuNha = h.startsWith('chu-nha-');
  const thau = h.startsWith('lich-thau-');
  $('#tabs').hidden = chuNha || thau;
  $('.topbar .role').hidden = chuNha || thau;
  $('#sync').hidden = chuNha || thau;
  if (chuNha) return manChuNha(h.slice(8), ts.api);
  if (thau) return manChoThau(h.slice(10), ts.api);
  if (!daKetNoi() && !daChonDemo()) return manKetNoi();
  if (h === 'ket-noi') return manKetNoi();
  if (h.startsWith('ct-')) return manCongTrinh(h.slice(3));
  if (h.startsWith('bg-in-')) return manInBienBan(decodeURIComponent(h.slice(6)));
  if (h.startsWith('bg-')) return manBanGiao(decodeURIComponent(h.slice(3)));
  if (h.startsWith('thanh-ly-')) return laVanPhong() ? manThanhLy(decodeURIComponent(h.slice(9))) : manHomNay();
  if (h.startsWith('bc-')) return manBaoCao(decodeURIComponent(h.slice(3)), ts.ngay);
  if (h.startsWith('tuan-')) return laVanPhong() ? manTuan(decodeURIComponent(h.slice(5)), ts.den) : manHomNay();
  if (h.startsWith('sua-kh-')) return laVanPhong() ? manSuaKeHoach(h.slice(7)) : manHomNay();
  if (h === 'cong-trinh') return manDanhSach();
  if (h === 'nha-thau') return manNhaThau();
  if (h.startsWith('nt-')) return manMotThau(h.slice(3));
  if (h === 'tao') return laVanPhong() ? manTao() : manHomNay();
  if (h === 'khach') return laVanPhong() ? manKhach() : manHomNay();
  if (h === 'marketing') return laVanPhong() ? manMarketing() : manHomNay();
  if (h === 'link-dk') return laVanPhong() ? manLinkDK() : manHomNay();
  if (h === 'dang-bai') return laVanPhong() ? manDangBai() : manHomNay();
  if (h.startsWith('BD-')) return laVanPhong() ? manMotBai(h) : manHomNay();
  if (h.startsWith('kh-')) return laVanPhong() ? manMotKhach(h.slice(3)) : manHomNay();
  if (h === 'hop-dong') return laVanPhong() ? manHopDong() : manHomNay();
  if (h === 'thu-chi') return laVanPhong() ? manThuChi(ts.ma !== undefined ? decodeURIComponent(ts.ma) : undefined, ts.tk !== undefined ? decodeURIComponent(ts.tk) : undefined) : manHomNay();
  if (h === 'tra-thau') return laVanPhong() ? manTraThau() : manHomNay();
  if (h === 'cong-no') return laVanPhong() ? manCongNo() : manHomNay();
  if (h === 'dong-tien') return laVanPhong() ? manDongTien() : manHomNay();
  if (h === 'tai-khoan') return laVanPhong() ? manTaiKhoan() : manHomNay();
  if (h === 'phat-sinh') return laVanPhong() ? manPhatSinh() : manHomNay();
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
  const nutChi = !laVanPhong() && db.congTrinh.length ? '<div class="actions"><button id="hnGhiChi">− Ghi chi công trình</button></div>' : '';
  const khoiKhach = nutChi + baoCaoHomNay(hn) + baoHanhHomNay(hn) + (laVanPhong() ? chiAIHomNay(hn) + khachHomNay(hn) + tienHomNay(hn) + noHomNay(hn) + baiHomNay(hn) : '') + phatSinhHomNay(hn) + mauHomNay(hn) + nghiemThuHomNay(hn) + thauHomNay(hn) + danhGiaHomNay() + thietKeHomNay(hn);
  const dangLam = db.congTrinh.filter((ct) => !congTrinhDaXong(db, ct.ma));
  if (!dangLam.length) {
    v.innerHTML = `${khoiKhach}<h2>Chưa có công trình nào</h2><p class="muted">${laVanPhong() ? 'Vào <b>Công trình</b> → <b>Tạo công trình</b>, hoặc tạo từ hồ sơ khách đã ký.' : 'Văn phòng chưa tạo công trình.'}</p>`;
    ganNutTraThau(v);
    ganNutBaoCao(v);
    ganNutBH(v);
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
  ganNutTraThau(v);
  const hnChi = $('#hnGhiChi');
  if (hnChi) hnChi.onclick = () => moGhiKhoan({ loai: 'CHI', ma: (dangLam[0] || {}).ma || '' });
  ganNutPS(v);
  ganNutMau(v);
  ganNutAnh(v);
  ganNutBaoCao(v);
  ganNutNghiemThu(v);
  ganNutBH(v);
}

function theViec(ct, x, t, nhan) {
  const nhanChu = { TRE: `Trễ ${diffDays(t.ketThuc, homNay())} ngày`, DANG: 'Đang làm', SAP: `Bắt đầu ${ddmm(t.batDau)}`, CHO: 'Chờ việc trước' }[nhan];
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
      Kế hoạch gốc ${ddmm(x.goc.batDau)}–${ddmm(x.goc.ketThuc)} · hiện tại ${ddmm(t.batDau)}–${ddmm(t.ketThuc)} · ${x.soNgay} ngày công${x.khoiLuong != null && x.khoiLuong !== '' ? ` · ${esc(x.khoiLuong)} ${esc(x.dvt || '')}` : ''}${x.nhaThau ? ` · thầu ${thauCuaViec(x.nhaThau)}` : ''}</p>
    ${mauCuaCongTrinh(db, maCt).filter((m) => m.viec === id).map((m) => `<p class="note">Mẫu ${esc(m.hangMuc)}: <b>${esc(m.tenMau)}</b> · ${m.trangThai === 'DUYET' ? 'khách đã chốt' : '<span class="tre">khách chưa chốt</span>'}${m.nguoiBan ? ' · người bán ' + esc(m.nguoiBan) : ''}</p>`).join('')}
    <label class="f">Tiến độ</label>
    <div class="grid-btn">${[0, 25, 50, 75, 100].map((p) => `<button data-pct="${p}" class="${x.phanTram === p ? 'on' : ''}">${p === 100 ? 'Xong' : p + '%'}</button>`).join('')}</div>
    <label class="f">Ghi chú / phát sinh (bấm 🎤 để nói)</label>
    <div class="mic"><textarea id="ghiChu" placeholder="Vd: chủ nhà muốn thêm 2 ổ cắm bếp"></textarea><button id="noi" title="Nói">🎤</button></div>
    <div class="actions">
      <button id="luuGhiChu">Lưu ghi chú</button>
      <button id="luuPhatSinh">Báo phát sinh</button>
    </div>
    <div class="actions">
      <label class="btn" style="text-align:center">📷 Chụp ảnh<input id="anh" type="file" accept="image/*" capture="environment" multiple hidden></label>
      <button id="zalo">Gửi Zalo</button>
      ${x.phanTram < 100 ? '<button id="cham" class="btn-do">Báo chậm</button>' : ''}
    </div>
    ${x.phanTram >= 100 && canNghiemThu(x) ? (() => { const r = ketQuaViec(db, ct, x); return `<div class="actions"><button id="nthu" class="${r.tt === 'CHUA' ? 'btn-chinh' : ''}">${r.tt === 'CHUA' ? '✅ Nghiệm thu việc này' : `Nghiệm thu lại · ${TAG_NTHU[r.tt][1].toLowerCase()}${r.con.length ? ' ' + r.con.length : ''}`}</button></div>`; })() : ''}
    ${laVanPhong() ? '<div class="actions"><button id="suaViec">✏️ Sửa việc: số ngày, khối lượng, thầu, việc đi trước</button></div>' : ''}
    ${lsu.length ? `<h3>Gần đây</h3>${lsu.map((e) => `<p class="muted">${ddmm(String(e.luc).slice(0, 10))} · ${esc(tenNguoi(e.nguoi))}: ${moTa(e)}</p>`).join('')}` : ''}
    <div class="actions"><button id="dong">Đóng</button></div>`;
  d.showModal();
  d.querySelectorAll('[data-pct]').forEach((b) => {
    b.onclick = () => {
      capNhatTienDo(db, ct, id, +b.dataset.pct, vaiTro, homNay()); luu(); d.close(); route();
      // Thầu xong hạng mục: mở luôn phiếu nghiệm thu (bấm Huỷ để làm sau, việc vẫn nằm ở "Cần nghiệm thu").
      if (+b.dataset.pct === 100 && canNghiemThu(x)) moNghiemThu(ct, x); else bao('Đã lưu tiến độ');
    };
  });
  $('#noi', d).onclick = () => noiThanhChu($('#ghiChu', d));
  $('#luuGhiChu', d).onclick = () => luuGhi(false);
  $('#luuPhatSinh', d).onclick = () => moBaoPS(ct, id, $('#ghiChu', d).value.trim());
  function luuGhi(ps) {
    const nd = $('#ghiChu', d).value.trim();
    if (!nd) return bao('Chưa có nội dung');
    ghiChu(db, ct, id, nd, vaiTro, ps); luu(); d.close(); bao(ps ? 'Đã báo phát sinh' : 'Đã lưu ghi chú');
  }
  $('#anh', d).onchange = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    await guiAnhHienTruong(files, ct.ma, id);
  };
  $('#zalo', d).onclick = () => chiaSe(`[${ct.ma}] ${x.hangMuc}\nLịch: ${ddmm(t.batDau)} – ${ddmm(t.ketThuc)}\nTiến độ: ${x.phanTram}%`);
  if ($('#cham', d)) $('#cham', d).onclick = () => moBaoCham(ct, x);
  if ($('#suaViec', d)) $('#suaViec', d).onclick = () => moSuaViec(ct, id);
  if ($('#nthu', d)) $('#nthu', d).onclick = () => moNghiemThu(ct, x);
  $('#dong', d).onclick = () => d.close();
}

function moTa(e) {
  if (e.loai === 'TIEN_DO') return `tiến độ ${e.cu}% → ${e.moi}%`;
  if (e.loai === 'CHAM') return `chậm thêm ${e.moi - e.cu} ngày (${esc(e.nguyenNhan)})${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  if (e.loai === 'PHAT_SINH') return `${/^Phát sinh PS/.test(e.tenViec || '') ? esc(e.tenViec) + ': ' : 'phát sinh: '}${esc(e.ghiChu)}`;
  if (e.loai === 'KH_TT') return `${esc(TRANG_THAI[e.cu] || e.cu)} → <b>${esc(TRANG_THAI[e.moi] || e.moi)}</b>${e.nguyenNhan ? ' (' + esc(e.nguyenNhan) + ')' : ''}${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  if (e.loai === 'KH_GOI') return `đã gọi, ${e.moi === 'CO' ? 'có tiến triển' : 'chưa được'}${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  if (e.loai === 'KH_CS') return `chăm sóc tháng ${esc(e.moi)}${e.ghiChu ? ': ' + esc(e.ghiChu) : ''}`;
  return esc(e.ghiChu);
}

// Báo chậm: chọn cách lùi (tự động / chọn ngày xong mới / chỉ lùi việc này).
// Văn phòng báo = đề xuất, giám sát xác nhận mới lùi (trừ khi tick "đã thống nhất với giám sát").
// dx: đề xuất của văn phòng mà giám sát đang sửa.
function moBaoCham(ct, x, dx = null) {
  const d = $('#sheet');
  if (d.open) d.close();
  const vp = laVanPhong();
  const t0 = lichHienTai(ct).get(x.id);
  let cach = dx ? dx.moi : 'TU_DONG';
  let n = dx ? Number(dx.cu) || 0 : 0;
  d.innerHTML = `<h2>${dx ? 'Sửa đề xuất' : 'Báo chậm'}: ${esc(x.hangMuc)}</h2>
    <p class="muted">Đang dự kiến xong ${ddmm(t0.ketThuc)}</p>
    <label class="f">Lùi thế nào?</label>
    <div class="grid-btn doc">${Object.entries(CACH_LUI).map(([k, ten]) => `<button data-cach="${k}">${ten}</button>`).join('')}</div>
    <div id="khoiSo"><label class="f">Chậm thêm bao nhiêu ngày công?</label>
      <div class="grid-btn">${[1, 2, 3, 5, 7].map((k) => `<button data-n="${k}">${k}</button>`).join('')}</div></div>
    <div id="khoiNgay" hidden><label class="f">Ngày xong mới của việc này</label><input id="ngayMoi" type="date" min="${addDays(t0.ketThuc, 1)}"></div>
    <label class="f">Do đâu?</label>
    <select id="nn">${NGUYEN_NHAN.map((k) => `<option ${dx && dx.nguyenNhan === k ? 'selected' : ''}>${k}</option>`).join('')}</select>
    <label class="f">Ghi chú</label>
    <div class="mic"><textarea id="gc" placeholder="Vd: chủ nhà chưa chốt mẫu gạch"></textarea><button id="noi">🎤</button></div>
    <p id="anhHuong" class="note" hidden></p>
    ${vp && !dx ? `<label class="chk"><input type="checkbox" id="luiNgay"> Đã thống nhất với giám sát, lùi lịch ngay</label>
      <p class="muted">Không tick: thành đề xuất, giám sát mở app bấm xác nhận mới lùi lịch.</p>` : ''}
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh" disabled>Lưu</button></div>`;
  const nhanNut = () => { const ok = $('#ok', d); ok.textContent = vp && !dx && !$('#luiNgay', d).checked ? 'Gửi đề xuất cho giám sát' : 'Lưu, lùi lịch'; };
  const xem = () => {
    d.querySelectorAll('[data-cach]').forEach((o) => o.classList.toggle('on', o.dataset.cach === cach));
    d.querySelectorAll('[data-n]').forEach((o) => o.classList.toggle('on', +o.dataset.n === n && cach !== 'CHON_NGAY'));
    $('#khoiSo', d).hidden = cach === 'CHON_NGAY';
    $('#khoiNgay', d).hidden = cach !== 'CHON_NGAY';
    if (cach === 'CHON_NGAY') n = soNgayDenNgay(t0.ketThuc, $('#ngayMoi', d).value, ct.lich);
    const p = $('#anhHuong', d);
    $('#ok', d).disabled = !(n > 0);
    if (!(n > 0)) { p.hidden = true; return; }
    const r = xemTruocCham(ct, x.id, n, cach === 'CHI_VIEC');
    p.hidden = false;
    p.innerHTML = `Chậm thêm <b>${n}</b> ngày công${r.ketThucViec >= homNay() ? `, việc này xong ${ddmm(r.ketThucViec)}` : ''}. ${cach === 'CHI_VIEC' ? 'Các việc sau giữ nguyên ngày bắt đầu.' : `${r.soViecLui} việc sau lùi theo.`} Ngày xong công trình: ${ddmm(r.xongTruoc)} → <b>${ddmm(r.xongSau)}</b>.`;
  };
  d.showModal();
  d.querySelectorAll('[data-cach]').forEach((b) => { b.onclick = () => { cach = b.dataset.cach; xem(); }; });
  d.querySelectorAll('[data-n]').forEach((b) => { b.onclick = () => { n = +b.dataset.n; xem(); }; });
  $('#ngayMoi', d).onchange = xem;
  if ($('#luiNgay', d)) $('#luiNgay', d).onchange = nhanNut;
  nhanNut(); xem();
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    if (!(n > 0)) return bao('Chọn số ngày hoặc ngày xong mới');
    const du = { soNgay: n, cach: cach === 'CHI_VIEC' ? 'CHI_VIEC' : 'TU_DONG', nguyenNhan: $('#nn', d).value, ghiChu: $('#gc', d).value.trim() };
    if (dx) { xuLyDeXuat(db, ct, dx, 'SUA', vaiTro, du); luu(); d.close(); bao('Đã lùi lịch'); return route(); }
    if (vp && !$('#luiNgay', d).checked) { deXuatCham(db, ct, x.id, du, vaiTro); luu(); d.close(); bao('Đã gửi đề xuất, chờ giám sát xác nhận'); return route(); }
    apBaoCham(db, ct, x.id, du, vaiTro);
    luu(); d.close(); bao('Đã lưu, lịch đã lùi'); route();
  };
}

// Nói thành chữ (vi-VN). Bấm 🎤: nút đỏ ⏹ = đang nghe; bấm lại để dừng. Mỗi lần nói nối thêm vào ô.
const LOI_MIC = {
  'not-allowed': 'Chưa cho phép micro. Bấm ổ khoá cạnh địa chỉ web → Quyền → Micro → Cho phép, rồi bấm 🎤 lại',
  'service-not-allowed': 'Trình duyệt này chặn nhận giọng nói. Mở app bằng Chrome, hoặc dùng micro trên bàn phím',
  'no-speech': 'Chưa nghe thấy gì, bấm 🎤 rồi nói luôn',
  'audio-capture': 'Không thấy micro trên máy',
  network: 'Nhận giọng nói cần mạng. Thử lại hoặc dùng micro trên bàn phím',
  'language-not-supported': 'Máy chưa có tiếng Việt cho nhận giọng nói, dùng micro trên bàn phím',
};
let micDang = null;
function noiThanhChu(o) {
  const nut = o.parentElement && o.parentElement.querySelector('button');
  if (micDang) { const r0 = micDang; micDang = null; try { r0.stop(); } catch {} return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { o.focus(); return bao('Máy này chưa hỗ trợ nói thành chữ. Bấm micro trên bàn phím điện thoại để nói', 4000); }
  const r = new SR();
  r.lang = 'vi-VN'; r.interimResults = true; r.continuous = false;
  const goc = o.value;
  let coChu = false;
  const tat = () => { if (nut) { nut.textContent = '🎤'; nut.classList.remove('dang-nghe'); } if (micDang === r) micDang = null; };
  r.onresult = (e) => {
    const chu = [...e.results].map((x) => x[0].transcript).join(' ').trim();
    if (chu) coChu = true;
    o.value = (goc + ' ' + chu).trim();
  };
  r.onerror = (e) => { tat(); if (e.error !== 'aborted') bao(LOI_MIC[e.error] || 'Không nghe được (' + e.error + '), thử lại hoặc dùng micro bàn phím', 5000); };
  r.onend = () => { tat(); if (coChu) bao('Đã ghi. Bấm 🎤 để nói tiếp'); };
  try { r.start(); } catch (err) { tat(); return bao('Không mở được micro: ' + err.message, 4000); }
  micDang = r;
  if (nut) { nut.textContent = '⏹'; nut.classList.add('dang-nghe'); }
  bao('Đang nghe… nói xong bấm ⏹');
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
  const dau = dauCongTrinh('cong-trinh');
  const nutTao = laVanPhong() ? '<div class="actions"><a class="btn btn-chinh" href="#tao" style="text-align:center">+ Tạo công trình</a></div>' : '';
  if (!db.congTrinh.length) { v.innerHTML = dau + '<p class="muted">Chưa có công trình.</p>' + nutTao; return; }
  const dangLam = db.congTrinh.filter((ct) => !congTrinhDaXong(db, ct.ma));
  const daXong = db.congTrinh.filter((ct) => congTrinhDaXong(db, ct.ma));
  v.innerHTML = `${dau}<h2>Bảng tổng ${dangLam.length} công trình</h2>
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
    const cls = x.phanTram >= 100 ? 'xong' : laTre(ct, x, th.keHoachHien, hn) ? 'tre' : '';
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
    ${khoiBaoCao(ct)}
    ${laVanPhong() ? khoiHDCongTrinh(ct) : ''}
    ${khoiTienCongTrinh(ct)}
    ${khoiPhatSinh(ct)}
    ${khoiMauVL(ct)}
    ${khoiNghiemThu(ct)}
    ${khoiBanGiao(ct)}
    ${khoiThietKe(ct)}`;
  $('#view').querySelectorAll('[data-viec]').forEach((r) => { r.onclick = () => moViec(r.dataset.ct, r.dataset.viec); });
  $('#view').querySelectorAll('[data-cong-khai]').forEach((c) => {
    c.onchange = () => { datCongKhai(db, c.dataset.congKhai, c.checked); luu(); bao(c.checked ? 'Chủ nhà sẽ thấy lần chậm này' : 'Đã ẩn với chủ nhà'); };
  });
  const b = $('#linkCN');
  if (b) b.onclick = () => chiaSe(`KAS gửi anh/chị link theo dõi tiến độ công trình ${ct.ten}:\n${linkChuNha}`);
  ganNutThietKe(ct);
  ganNutTienCongTrinh(ct);
  ganNutPS($('#view'));
  ganNutMau($('#view'));
  ganNutNghiemThu($('#view'));
  ganNutBH($('#view'));
  $('#baoPS').onclick = () => moBaoPS(ct);
  if ($('#themMau')) $('#themMau').onclick = () => moMau(ct);
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
    const db2 = ketThucCuoi(lichHienTai(ct, homNay()));
    $('#khTong').innerHTML = `Xong theo kế hoạch <b>${fmtNgay(kt)}</b> · kế hoạch gốc ${fmtNgay(gocCuoi)}${lech ? ` (<span class="${lech > 0 ? 'tre' : ''}">${lech > 0 ? 'chậm' : 'sớm'} ${Math.abs(lech)} ngày</span>)` : ''}${db2 > kt ? `<br><span class="tre">Theo tiến độ thực tế (có việc quá hạn chưa xong): dự báo xong ${fmtNgay(db2)}</span>` : ''}`;
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
    <label class="cham-dong"><input type="checkbox" id="choDang" ${ct.choDangAnh ? 'checked' : ''}><span>Chủ nhà đồng ý cho KAS dùng ảnh công trình để đăng bài (không ghi tên, địa chỉ chủ nhà)</span></label>
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
    if (!!ct.choDangAnh !== $('#choDang', d).checked) thayDoi.choDangAnh = $('#choDang', d).checked;
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
  // Bản thử: chỉ phần chủ nhà được xem (đã báo giá), giống máy chủ.
  let phatSinh = ct ? psCuaCongTrinh(db, ct.ma).filter((p) => p.trangThai !== 'CHO_BAO_GIA') : [];
  let mauVL = ct ? mauCuaCongTrinh(db, ct.ma) : [];
  let banGiao = ct ? bgCua(db, ct.ma) : null;
  if (banGiao && !banGiao.guiLuc) banGiao = null;
  let baoHanh = banGiao ? bhCuaCongTrinh(db, ct.ma) : [];
  let baoCaoTuan = ct ? (db.baoCaoTuan || []).filter((x) => x.maCongTrinh === ct.ma && !x.xoa && x.guiLuc).sort((a, b) => b.tuNgay.localeCompare(a.tuNgay)).slice(0, 8) : [];
  if (api) {
    // Máy chủ nhà: lấy thẳng từ máy chủ, chỉ phần chủ nhà được xem.
    $('#view').innerHTML = '<p class="muted">Đang tải…</p>';
    try { ({ ct, lichSu, phuongAn = [], phatSinh = [], mauVL = [], baoCaoTuan = [], banGiao = null, baoHanh = [] } = await xemChuNha(api, maLink)); } catch (e) { ct = null; }
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
    ${khoiBanGiaoChuNha(banGiao, baoHanh)}
    ${khoiTuanChuNha(baoCaoTuan)}
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
    ${phatSinh.length ? `<h3>Phát sinh</h3>${phatSinh.map((p) => `<div class="card">
      <div class="row"><span class="name">${esc(p.ma)} · ${esc(p.moTa)}</span><span class="tag ${{ CHO_KHACH: 'SAP', DUYET: 'DANG', TU_CHOI: 'TRE' }[p.trangThai]}">${p.trangThai === 'CHO_KHACH' ? 'Chờ anh/chị duyệt' : p.trangThai === 'DUYET' ? 'Đã đồng ý' : 'Không làm'}</span></div>
      <div class="muted">${p.viTri ? esc(p.viTri) + ' · ' : ''}Chi phí <b>${tien(p.giaBan)}</b> (chưa VAT) · KAS báo giá ${ddmm(p.ngayBaoGia)}${p.ngayKhach ? ` · anh/chị trả lời ${ddmm(p.ngayKhach)}` : ''}</div>
      ${p.trangThai === 'CHO_KHACH' ? `<div class="actions"><button data-ps-khong="${esc(p.id)}">Không làm</button><button data-ps-ok="${esc(p.id)}" class="btn-chinh">Đồng ý làm</button></div>` : ''}
    </div>`).join('')}<p class="muted">Phát sinh đồng ý sẽ thanh toán cùng đợt quyết toán.</p>` : ''}
    ${mauVL.length ? `<h3>Mẫu vật liệu</h3>${mauVL.map((m) => `<div class="card">
      <div class="row"><span class="name">${esc(m.hangMuc)}: ${esc(m.tenMau)}</span><span class="tag ${TAG_MAU[m.trangThai]}">${m.trangThai === 'CHO_KHACH' ? 'Chờ anh/chị chốt' : m.trangThai === 'DUYET' ? 'Đã chốt' : 'Đã yêu cầu đổi'}</span></div>
      <div class="muted">${m.nguoiBan ? 'Người bán: ' + esc(m.nguoiBan) + ' · ' : ''}${m.link ? `<a href="${esc(m.link)}" target="_blank" rel="noopener">Xem ảnh mẫu</a> · ` : ''}${m.trangThai === 'CHO_KHACH' && m.hanChot ? `anh/chị chốt giúp trước <b>${ddmm(m.hanChot)}</b> để kịp đặt hàng` : m.ngayKhach ? `anh/chị trả lời ${ddmm(m.ngayKhach)}` : ''}</div>
      ${m.trangThai === 'CHO_KHACH' ? `<div class="actions"><button data-mau-khac="${esc(m.id)}">Muốn đổi</button><button data-mau-ok="${esc(m.id)}" class="btn-chinh">Chốt mẫu này</button></div>` : ''}
    </div>`).join('')}` : ''}
    <p class="muted">Cập nhật bởi KAS Houzing.</p>`;
  taiAnhChuNha(maLink, api);
  // Bàn giao: chủ nhà đồng ý / cần trao đổi; báo lỗi bảo hành.
  const traLoiBG = async (dongY, yKien = '') => {
    try {
      if (api) await chuNhaPhanHoi(api, { maLink, id: banGiao.id, loai: 'BG', ketQua: dongY ? 'DUYET' : 'SUA', yKien });
      else { khachXacNhan(db, bgCua(db, ct.ma), { dongY, qua: 'LINK', yKien }, 'CHU_NHA'); luu(); }
      bao(dongY ? 'Cảm ơn anh/chị đã xác nhận bàn giao.' : 'KAS đã nhận ý kiến, sẽ liên hệ anh/chị.');
      manChuNha(maLink, api);
    } catch (e) { bao('Chưa gửi được: ' + e.message); }
  };
  const nutBG = $('[data-bg-ok]');
  if (nutBG) {
    nutBG.onclick = () => {
      if (nutBG.dataset.chac !== '1') { nutBG.dataset.chac = '1'; nutBG.textContent = 'Bấm lần nữa để xác nhận'; return; }
      nutBG.disabled = true; traLoiBG(true);
    };
  }
  const nutBGSua = $('[data-bg-sua]');
  if (nutBGSua) {
    nutBGSua.onclick = () => {
      const d = $('#sheet');
      d.innerHTML = `<h2>Anh/chị cần trao đổi gì?</h2>
        <div class="mic"><textarea id="yk" placeholder="Vd: thiếu 1 chìa khoá cửa ban công, tủ bếp còn xước"></textarea><button id="noi">🎤</button></div>
        <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Gửi KAS</button></div>`;
      d.showModal();
      $('#noi', d).onclick = () => noiThanhChu($('#yk', d));
      $('#huy', d).onclick = () => d.close();
      $('#ok', d).onclick = () => { const yk = $('#yk', d).value.trim(); if (!yk) return bao('Anh/chị ghi giúp nội dung'); d.close(); traLoiBG(false, yk); };
    };
  }
  if ($('#baoLoiBH')) $('#baoLoiBH').onclick = () => moBaoLoiChuNha(ct, banGiao, maLink, api);
  // Chủ nhà chốt mẫu vật liệu.
  const traLoiMau = async (id, dongY, yKien = '') => {
    try {
      if (api) await chuNhaPhanHoi(api, { maLink, id, loai: 'MAU', ketQua: dongY ? 'DUYET' : 'SUA', yKien });
      else { const m = (db.mauVL || []).find((x) => x.id === id); khachChotMau(db, m, { dongY, qua: 'LINK', ngay: homNay(), yKien }, 'CHU_NHA'); luu(); }
      bao(dongY ? 'Cảm ơn anh/chị, KAS sẽ đặt hàng mẫu này.' : 'KAS đã nhận, sẽ gửi mẫu khác.');
      manChuNha(maLink, api);
    } catch (e) { bao('Chưa gửi được: ' + e.message); }
  };
  $('#view').querySelectorAll('[data-mau-ok]').forEach((b) => {
    b.onclick = () => {
      if (b.dataset.chac !== '1') { b.dataset.chac = '1'; b.textContent = 'Bấm lần nữa để chốt'; return; }
      b.disabled = true; traLoiMau(b.dataset.mauOk, true);
    };
  });
  $('#view').querySelectorAll('[data-mau-khac]').forEach((b) => {
    b.onclick = () => {
      const d = $('#sheet');
      d.innerHTML = `<h2>Anh/chị muốn đổi thế nào?</h2>
        <div class="mic"><textarea id="yk" placeholder="Vd: màu sáng hơn, khổ nhỏ hơn"></textarea><button id="noi">🎤</button></div>
        <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Gửi KAS</button></div>`;
      d.showModal();
      $('#noi', d).onclick = () => noiThanhChu($('#yk', d));
      $('#huy', d).onclick = () => d.close();
      $('#ok', d).onclick = () => { d.close(); traLoiMau(b.dataset.mauKhac, false, $('#yk', d).value.trim()); };
    };
  });
  // Chủ nhà trả lời phát sinh.
  const traLoiPS = async (id, dongY) => {
    try {
      if (api) await chuNhaPhanHoi(api, { maLink, id, loai: 'PS', ketQua: dongY ? 'DUYET' : 'TU_CHOI' });
      else { const p = (db.phatSinh || []).find((x) => x.id === id); khachTraLoi(db, p, { dongY, qua: 'LINK', ngay: homNay() }, 'CHU_NHA'); luu(); }
      bao(dongY ? 'Cảm ơn anh/chị. KAS sẽ triển khai phần phát sinh.' : 'KAS đã nhận, phần này sẽ không làm.');
      manChuNha(maLink, api);
    } catch (e) { bao('Chưa gửi được: ' + e.message); }
  };
  $('#view').querySelectorAll('[data-ps-ok], [data-ps-khong]').forEach((b) => {
    b.onclick = () => {
      if (b.dataset.chac !== '1') { b.dataset.chac = '1'; b.textContent = 'Bấm lần nữa để xác nhận'; return; }
      b.disabled = true; traLoiPS(b.dataset.psOk || b.dataset.psKhong, !!b.dataset.psOk);
    };
  });
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
    <div id="oTang"><label class="f">Số tầng (phần thân lặp theo từng tầng)</label><input id="soTang" type="number" min="1" max="30" step="1" inputmode="numeric" value="1"></div>
    <label class="f">Mã dự án</label><input id="ma" value="${esc(goiYMa(loaiDau, tenNgan))}">
    <label class="f">Tên công trình</label><input id="ten" value="${esc(kh ? kh.ten : '')}" placeholder="Vd: Căn hộ chị Xuân, Xa La">
    <label class="f">Ngày khởi công</label><input id="kc" type="date" value="${homNay()}">
    <label class="f">Lịch làm việc</label>
    <select id="lich">${Object.entries(LICH).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
    <label class="f">Link thư mục Drive của công trình</label><input id="drive" placeholder="Dán link thư mục, để trống thì app tự tạo">
    <p id="xemTruoc" class="muted"></p>
    <div class="actions"><button id="tao" class="btn-chinh">Tạo công trình</button></div>`;
  const coTang = () => thuVien.some((r) => r.loai.split(/\s+/).includes($('#loai').value) && /lặp theo số tầng/i.test(r.hang_muc));
  const soTang = () => (coTang() ? Math.max(1, Math.min(30, parseInt($('#soTang').value, 10) || 1)) : 1);
  const xem = () => {
    $('#oTang').hidden = !coTang();
    const n = taoTuThuVien(thuVien, $('#loai').value, soTang()).length;
    $('#xemTruoc').textContent = `${n} việc sẽ được tạo sẵn. Sau khi tạo, chạm vào từng việc để sửa.`;
  };
  $('#soTang').oninput = xem;
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
    const tang = soTang();
    const tam = taoCongTrinh(thu.db, thuVien, { ma, ten, loai, khoiCong, lich, soTang: tang });
    const den = tam.viec.reduce((m, v) => (v.goc.ketThuc > m ? v.goc.ketThuc : m), khoiCong);
    hoiNgayLe(leCanHoi(khoiCong, den, lich), (nghi, daHoi) => {
      lich.nghi = nghi; lich.daHoi = daHoi;
      const ct = taoCongTrinh(db, thuVien, { ma, ten, loai, khoiCong, lich, soTang: tang, thuMucDrive: $('#drive').value.trim(), maKhach: kh ? kh.ma : '', chuNha: kh ? kh.ten : '' });
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
    $('#view').innerHTML = `<h2>Không đăng nhập được</h2><p>${esc(e.message)}</p><p class="muted">Đăng nhập bằng Gmail: <a href="#ket-noi">mở màn Đăng nhập</a>.</p>`;
  }
}

async function ketNoiVoi(api, khoa) {
  const kn = { api: maApi(api), khoa };
  const toi = await goi('toiLaAi', {}, kn);
  const cu = ketNoi();
  // Đổi tài khoản hoặc chuyển từ bản thử: xoá dữ liệu cũ trên máy, lấy lại từ máy chủ.
  // Cùng 1 người đổi từ link khoá sang Gmail thì giữ nguyên (còn việc chưa gửi).
  const cungNguoi = cu && (cu.email ? cu.email === toi.email : cu.ten === toi.ten && cu.vaiTro === toi.vaiTro);
  if (!cu || (cu.khoa !== khoa && !cungNguoi)) { db = rong(); ghi(db); }
  luuKetNoi({ ...kn, ten: toi.ten, vaiTro: toi.vaiTro, email: toi.email, cach: toi.cach || 'LINK' });
  nhoApi(kn.api);
  vaiTro = toi.vaiTro;
  khoiDongVaiTro();
  bao('Xin chào ' + toi.ten);
  await chayDongBo();
}

function manKetNoi() {
  datTab('', 'Đăng nhập');
  const kn = ketNoi();
  const api = apiDaBiet();
  $('#view').innerHTML = `<h2>Đăng nhập app KAS</h2>
    ${kn ? `<p>Đang dùng: <b>${esc(kn.ten || '')}</b>${kn.email ? ' · ' + esc(kn.email) : ''}${kn.cach === 'GMAIL' ? ' (Gmail)' : ' (link khoá)'}</p>` : ''}
    <div id="ggKhung"${api ? '' : ' hidden'}>
      <p class="muted">Bấm nút dưới, chọn đúng Gmail Thầy đã thêm cho mình.</p>
      <div id="ggNut" style="min-height:44px;margin:12px 0"></div>
      <p class="muted" id="ggTT">${api ? 'Đang tải nút Google…' : ''}</p>
    </div>
    <details class="cham-ds" ${api ? '' : 'open'}><summary>Link máy chủ${api ? ' (đã có)' : ''}</summary>
      <label class="f">Link máy chủ (Web app URL trong Apps Script)</label>
      <input id="api" value="${esc(api)}" placeholder="https://script.google.com/macros/s/…/exec">
      <div class="actions"><button id="luuApi">Dùng máy chủ này</button></div>
    </details>
    <details class="cham-ds" id="khoaKhung"><summary>Đăng nhập bằng khoá (dự phòng)</summary>
      <p class="muted">Chỉ dùng khi không đăng nhập Google được. Khoá Thầy gửi riêng, hoặc khoá trong nhật ký khi chạy setup.</p>
      <label class="f">Khoá</label><input id="khoa" value="" autocomplete="off">
      <div class="actions"><button id="kn">Đăng nhập bằng khoá</button></div>
    </details>
    ${kn ? '<div class="actions"><button id="thoat" class="btn-do">Đăng xuất khỏi máy này</button></div>' : '<div class="actions"><button id="demo">Dùng thử không kết nối</button></div>'}`;
  const apiDangNhap = () => $('#api').value.trim() || api;
  const veNut = async (a) => {
    const tt = $('#ggTT');
    if (!a) return;
    $('#ggKhung').hidden = false;
    tt.textContent = 'Đang tải nút Google…';
    try {
      const { googleClientId } = await layCauHinh(a);
      if (!googleClientId) { tt.textContent = 'Máy chủ chưa cài đăng nhập Google (Thầy dán Client ID ở màn Người dùng). Tạm dùng khoá dự phòng bên dưới.'; $('#khoaKhung').open = true; return; }
      await veNutGoogle($('#ggNut'), googleClientId, async (idToken) => {
        tt.textContent = 'Đang kiểm tra Gmail…';
        try {
          const { khoa } = await dangNhapGoogle(a, idToken);
          await ketNoiVoi(a, khoa);
          location.hash = '#hom-nay';
        } catch (e) { tt.textContent = e.message; bao(e.message); }
      });
      tt.textContent = '';
    } catch (e) { tt.textContent = (navigator.onLine ? 'Không mở được đăng nhập Google: ' + e.message : 'Mất mạng, cần mạng để đăng nhập lần đầu.'); }
  };
  veNut(api);
  $('#luuApi').onclick = () => { const a = $('#api').value.trim(); if (!a) return bao('Dán link máy chủ'); nhoApi(a); veNut(maApi(a)); };
  $('#kn').onclick = async () => {
    const a = apiDangNhap(), khoa = $('#khoa').value.trim();
    if (!a || !khoa) return bao('Cần cả link máy chủ và khoá');
    $('#kn').disabled = true;
    try { await ketNoiVoi(a, khoa); location.hash = '#hom-nay'; } catch (e) { bao(e.message); $('#kn').disabled = false; }
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
  const cd = db.caiDat || {};
  const toi = db.toi || {};
  const ds = (db.nguoiDung || []).filter((u) => u.hoatDong === true);
  const laToi = (u) => (toi.email ? String(u.email).toLowerCase() === String(toi.email).toLowerCase() : u.khoa === kn.khoa);
  const coGoogle = !!cd.googleClientId;
  const chiGmail = cd.chiGmail === '1';
  const linkKhoa = (khoa) => `${goc()}#k=${khoa}&api=${maApi(kn.api)}`;
  const linkGmail = `${goc()}#dang-nhap&api=${maApi(kn.api)}`;
  const loiMoi = (ten, email) => `${ten} ơi, đây là link app KAS. Mở bằng Chrome, bấm "Đăng nhập bằng Google", chọn đúng Gmail ${email}. Xong bấm "Thêm vào màn hình chính":\n${linkGmail}`;
  const loiMoiKhoa = (ten, khoa) => `${ten} ơi, đây là link app KAS của em. Mở 1 lần bằng Chrome, rồi bấm "Thêm vào màn hình chính":\n${linkKhoa(khoa)}`;
  const gioPhut = (s) => (s ? new Date(s).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '');
  $('#view').innerHTML = `<h2>Người dùng app</h2>
    <p class="muted">Mỗi người đăng nhập bằng Gmail của mình. Mọi thao tác ghi kèm Gmail vào tab NhatKy trong file Sheets dữ liệu. Nghỉ việc hoặc mất máy thì bấm Thu hồi.</p>
    <details class="cham-ds" ${coGoogle ? '' : 'open'}><summary>Cài đăng nhập Google ${coGoogle ? '(đã cài)' : '(chưa cài)'}</summary>
      <label class="f">Client ID Google (dạng …apps.googleusercontent.com)</label>
      <input id="ggId" value="${esc(cd.googleClientId || '')}" placeholder="123…-abc.apps.googleusercontent.com" autocomplete="off">
      <div class="actions"><button id="luuGg">Lưu Client ID</button></div>
      <label class="cham-dong"><input type="checkbox" id="chiGmail" ${chiGmail ? 'checked' : ''} style="width:auto"> <span>Chỉ cho đăng nhập bằng Gmail (tắt hết link khoá cũ)</span></label>
      <p class="muted">Bạn đang vào bằng ${toi.cach === 'GMAIL' ? 'Gmail' : 'link khoá'}. ${ds.filter((u) => !u.daDangNhapGmail).length ? 'Chưa đăng nhập Gmail: ' + ds.filter((u) => !u.daDangNhapGmail).map((u) => esc(u.ten)).join(', ') + '.' : ds.length ? 'Mọi người đã đăng nhập Gmail.' : ''}</p>
    </details>
    ${ds.map((u) => `<div class="card"><div class="row"><span class="name">${esc(u.ten)}</span><span class="tag ${u.vaiTro === 'TAM' ? 'SAP' : 'XONG'}">${esc(VAI_TRO[u.vaiTro] || u.vaiTro)}</span></div>
      <div class="muted">${esc(u.email) || '<span class="tre">chưa có Gmail</span>'}${u.congTrinh ? ' · ' + esc(u.congTrinh) : ''}${u.hetHan ? ` · ${u.hetHan < homNay() ? '<span class="tre">đã hết hạn</span>' : 'đến ' + ddmm(u.hetHan)}` : ''}</div>
      <div class="muted">${u.daDangNhapGmail ? 'Đã đăng nhập Gmail' + (u.lanCuoi ? ' · lần cuối ' + gioPhut(u.lanCuoi) : '') : 'Chưa đăng nhập Gmail'}</div>
      ${u.vaiTro === 'THAY' && vaiTro !== 'THAY' ? ''
        : `<div class="actions">${laToi(u) ? '<span class="muted">Đây là bạn</span>' : `<button data-moi="${esc(u.ten)}" data-email="${esc(u.email)}">Gửi link đăng nhập</button>`}
          <button data-sua-gmail="${esc(u.khoa)}" data-email="${esc(u.email)}">Sửa Gmail</button>
          ${!laToi(u) && !chiGmail ? `<button data-gui="${esc(u.khoa)}" data-ten="${esc(u.ten)}">Link khoá (dự phòng)</button>` : ''}
          ${laToi(u) ? '' : `<button class="btn-do" data-thu-hoi="${esc(u.khoa)}">Thu hồi</button>`}</div>`}</div>`).join('')}
    <h3>Thêm người</h3>
    <label class="f">Tên</label><input id="ten" placeholder="Vd: Kha">
    <label class="f">Gmail (người này đăng nhập bằng Gmail này)</label><input id="email" type="email" placeholder="kha@gmail.com">
    <label class="f">Vai trò</label>
    <select id="vt">${Object.entries(VAI_TRO).filter(([k]) => k !== 'THAY').map(([k, v]) => `<option value="${k}" ${k === 'KHA' ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <p class="muted" id="vtGiaiThich"></p>
    <div id="hanChon" hidden><label class="f">Hết hạn ngày</label><input id="hetHan" type="date" value="${new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10)}"></div>
    <div id="ctChon"><label class="f">Công trình được giao (chỉ thấy các công trình này, không thấy tiền và sổ khách)</label>
    ${db.congTrinh.map((c) => `<label class="cham-dong"><input type="checkbox" value="${esc(c.ma)}"> <span>${esc(c.ma)} · ${esc(c.ten)}</span></label>`).join('') || '<p class="muted">Chưa có công trình.</p>'}</div>
    <div class="actions"><button id="them" class="btn-chinh">Thêm và gửi link</button></div>`;
  const ctChon = $('#ctChon');
  const GIAI_THICH = { DUC: 'Toàn quyền như Thầy: sổ khách, tiền, người dùng.', KHA: 'Giám sát: cập nhật tiến độ, ảnh, báo chậm ở công trình được giao.', TAM: 'Cho người làm việc lẻ (thợ, cộng tác viên). Như giám sát nhưng tự khoá khi hết hạn.' };
  const doiVt = () => { const vt = $('#vt').value; ctChon.hidden = vt === 'DUC'; $('#hanChon').hidden = vt !== 'TAM'; $('#vtGiaiThich').textContent = GIAI_THICH[vt] || ''; };
  $('#vt').onchange = doiVt; doiVt();
  $('#luuGg').onclick = () => {
    const id = $('#ggId').value.trim();
    if (id && !/^[\w-]+\.apps\.googleusercontent\.com$/.test(id)) return bao('Client ID phải có đuôi .apps.googleusercontent.com');
    datCaiDat(db, 'googleClientId', id); luu(); bao('Đã lưu Client ID'); manNguoiDung();
  };
  $('#chiGmail').onchange = (e) => {
    if (e.target.checked && toi.cach !== 'GMAIL') { e.target.checked = false; return bao('Thầy đăng nhập bằng Gmail trước, rồi mới tắt link khoá'); }
    if (e.target.checked && !coGoogle) { e.target.checked = false; return bao('Cần lưu Client ID Google trước'); }
    datCaiDat(db, 'chiGmail', e.target.checked ? '1' : ''); luu(); bao(e.target.checked ? 'Đã tắt link khoá, chỉ đăng nhập Gmail' : 'Đã bật lại link khoá dự phòng'); manNguoiDung();
  };
  $('#view').querySelectorAll('[data-moi]').forEach((b) => {
    b.onclick = () => (coGoogle ? chiaSe(loiMoi(b.dataset.moi, b.dataset.email)) : bao('Cần lưu Client ID Google trước'));
  });
  $('#view').querySelectorAll('[data-gui]').forEach((b) => { b.onclick = () => chiaSe(loiMoiKhoa(b.dataset.ten, b.dataset.gui)); });
  $('#view').querySelectorAll('[data-sua-gmail]').forEach((b) => {
    b.onclick = async () => {
      const the = b.closest('.actions');
      if (the.querySelector('input')) return;
      the.insertAdjacentHTML('beforeend', `<input type="email" value="${esc(b.dataset.email)}" placeholder="ten@gmail.com"><button class="btn-chinh">Lưu Gmail</button>`);
      const [o, nut] = [the.querySelector('input'), the.querySelector('button:last-child')];
      o.focus();
      nut.onclick = async () => {
        nut.disabled = true;
        try { await goi('suaGmail', { khoa: b.dataset.suaGmail, email: o.value.trim() }); bao('Đã sửa Gmail'); await chayDongBo(); manNguoiDung(); } catch (err) { bao(err.message); nut.disabled = false; }
      };
    };
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
      chiaSe(coGoogle ? loiMoi(ten, email.toLowerCase()) : loiMoiKhoa(ten, khoa));
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

const TAG_ND = { NONG: 'TRE', AM: 'SAP', LANH: 'DANG' };
const tagNhiet = (k) => { const nd = DANG_THEO.includes(k.trangThai) ? nhietDo(k) : ''; return nd ? `<span class="tag ${TAG_ND[nd]}">${NHIET_DO[nd]}</span> ` : ''; };
function theKhach(k, phu) {
  return `<a class="card" href="#kh-${esc(k.ma)}" style="text-decoration:none">
    <div class="row"><span class="name">${esc(k.ten)}</span><span>${tagNhiet(k)}<span class="tag ${tagTT[k.trangThai]}">${esc(TRANG_THAI[k.trangThai])}</span></span></div>
    <div class="muted">${phu}</div></a>`;
}

function khachHomNay(hn) {
  const { goi: goi0, chamSoc, hoaHong } = viecKhachHomNay(db, hn);
  // Lead tự đăng ký qua form: Thầy phụ trách, gọi trong 2 giờ làm việc; quá hạn chỉ báo Thầy (Thầy chốt 19/11).
  const lead = vaiTro === 'THAY' ? leadCanGoi(db) : [];
  const goi = goi0.filter((k) => !choGoiDau(k));
  if (!lead.length && !goi.length && !chamSoc.length && !hoaHong.length) return '';
  return `<h3>Khách hàng hôm nay</h3>
    ${lead.map(({ k, han, quaHan }) => theKhach(k, `<span class="${quaHan ? 'tre' : ''}"><b>Lead mới, gọi trước ${gioNgay(han)}</b> (${conLai(han)})</span> · ${esc(k.sdt)} · ${esc(k.nguon)}`)).join('')}
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
  $('#view').innerHTML = `${dauKhach('khach')}
    <div class="actions"><button id="danTin">📋 Dán tin Zalo</button><button id="themKh" class="btn-chinh">+ Thêm khách</button></div>
    ${khachHomNay(hn)}
    <div class="loc">${Object.entries(LOC).map(([k, [ten, f]]) => `<button data-loc="${k}" class="${k === locKhach ? 'on' : ''}">${ten} ${ds.filter(f).length}</button>`).join('')}</div>
    ${loc.length ? loc.map((k) => {
      const bg = k.baoGia && k.baoGia.length ? k.baoGia[k.baoGia.length - 1] : null;
      const bt = DANG_THEO.includes(k.trangThai) ? buocTiep(k) : null;
      return theKhach(k, `${esc(k.ma)}${k.phuTrach === 'DUC' ? ' · Đức phụ trách' : ''} · ${esc(k.nguon)}${bt ? ' · tiếp: ' + esc(bt.ten) : ''}${k.nguoiGioiThieu ? ' (' + esc(k.nguoiGioiThieu) + ')' : ''}${bg ? ' · báo giá v' + bg.phienBan + ' ' + tien(bg.giaTri) : ''}${k.nhacGoi && k.trangThai !== 'KY' ? ' · gọi ' + ddmm(k.nhacGoi) : ''}${k.maCongTrinh ? ' · ' + esc(k.maCongTrinh) : ''}`);
    }).join('') : '<p class="muted">Chưa có khách nào ở mục này.</p>'}
    ${ds.length ? '<p class="muted">Khách đến từ đâu, tỉ lệ chốt, chi phí quảng cáo: xem mục <a href="#marketing">Marketing</a>.</p>' : ''}`;
  $('#themKh').onclick = () => moThemKhach();
  $('#danTin').onclick = moDanTin;
  $('#view').querySelectorAll('[data-loc]').forEach((b) => { b.onclick = () => { locKhach = b.dataset.loc; manKhach(); }; });
}

function moThemKhach(du = {}) {
  const d = $('#sheet');
  d.innerHTML = `<h2>Thêm khách</h2>
    <label class="f">Tên khách *</label><input id="kTen" placeholder="Vd: Chị Xuân" value="${esc(du.ten || '')}">
    <label class="f">Số điện thoại</label><input id="kSdt" type="tel" inputmode="tel" placeholder="09…" value="${esc(du.sdt || '')}">
    <p id="trung" class="note" hidden></p>
    <label class="f">Khách đến từ đâu</label><select id="kNguon">${NGUON.map((n) => `<option>${esc(n)}</option>`).join('')}</select>
    <div id="gt"><label class="f">Người giới thiệu (để cảm ơn và trả hoa hồng)</label><input id="kGt" placeholder="Tên người giới thiệu">
      <input id="kSdtGt" type="tel" inputmode="tel" placeholder="SĐT người giới thiệu" style="margin-top:6px"></div>
    <label class="f">Ngày khách liên hệ lần đầu</label><input id="kNgay" type="date" value="${homNay()}">
    <label class="f">Khách cần làm gì</label><select id="kLoai"><option value="">Chưa rõ</option>${Object.entries(NHU_CAU_LOAI).map(([k, v]) => `<option value="${k}" ${du.loai === k ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select>
    <label class="f">Nhu cầu (bấm 🎤 nói, bấm lại để nói tiếp)</label>
    <div class="mic"><textarea id="kTom" placeholder="Vd: căn hộ 90m2 ở Xa La, muốn làm nội thất trước Tết, ngân sách khoảng 600 triệu">${esc(du.tomTat || '')}</textarea><button id="noi">🎤</button></div>
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
    const kh = taoKhach(db, { ten, sdt: $('#kSdt', d).value, nguon: $('#kNguon', d).value, nguoiGioiThieu: laGt ? $('#kGt', d).value.trim() : '', sdtGioiThieu: laGt ? $('#kSdtGt', d).value : '', loai: $('#kLoai', d).value, tomTat: $('#kTom', d).value.trim(), ngayVao: $('#kNgay', d).value || homNay() }, vaiTro, homNay());
    // Thông tin AI tách được từ tin nhắn: điền sẵn vào Bảng yêu cầu thông tin.
    if (du.nhuCau) suaKhach(db, kh, { nhuCau: { ...kh.nhuCau, ...du.nhuCau, loai: kh.nhuCau.loai, tomTat: kh.nhuCau.tomTat } }, homNay());
    luu(); d.close(); bao('Đã thêm ' + kh.ten); location.hash = '#kh-' + kh.ma;
  };
  if (du.sdt) $('#kSdt', d).oninput();
}

// Dán đoạn chat Zalo / Messenger (hoặc nói): AI tách tên, SĐT, nhu cầu; Thầy xem lại trong form Thêm khách rồi mới lưu.
function moDanTin() {
  const d = $('#sheet');
  d.innerHTML = `<h2>Dán tin nhắn của khách</h2>
    <p class="muted">Chép đoạn chat Zalo, Messenger hoặc bấm 🎤 kể lại cuộc gọi. AI chỉ lấy thông tin có trong đoạn, Thầy xem lại trước khi lưu.</p>
    <div class="mic"><textarea id="tin" class="cao" placeholder="Dán tin nhắn vào đây"></textarea><button id="noi">🎤</button></div>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Tách thông tin</button></div>`;
  d.showModal();
  $('#noi', d).onclick = () => noiThanhChu($('#tin', d));
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = async () => {
    const chu = $('#tin', d).value.trim();
    if (!chu) return bao('Dán tin nhắn trước');
    const coBan = { sdt: tachSdt(chu), tomTat: chu.slice(0, 500) };
    if (!daKetNoi() || !navigator.onLine) { d.close(); bao('Chưa có mạng: em chỉ lấy được số điện thoại', 3500); return moThemKhach(coBan); }
    const nut = $('#ok', d);
    nut.disabled = true; nut.textContent = 'AI đang đọc…';
    try {
      const r = await goi('tachKhach', { chu });
      const nhuCau = {};
      ['diaDiem', 'dienTich', 'hienTrang', 'phongCach', 'nganSach', 'thoiGian', 'dacBiet', 'thoiDiem', 'matBang'].forEach((k) => { if (r[k]) nhuCau[k] = r[k]; });
      d.close();
      moThemKhach({ ten: r.ten, sdt: r.sdt || coBan.sdt, loai: r.loai, tomTat: r.tomTat || coBan.tomTat, nhuCau });
    } catch (e) {
      nut.disabled = false; nut.textContent = 'Tách thông tin';
      bao('AI chưa đọc được: ' + e.message, 4000);
    }
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
  const lk = kh.linkDK ? (db.linkDK || []).find((l) => l.ma === kh.linkDK) : null;
  const gy = goiYNhietDo(kh);
  const pt = { ...ptRong(), ...(kh.phongThuy || {}) };
  const ptNguoi = [...(pt.nguoi || [])];
  while (ptNguoi.length < 2) ptNguoi.push({ ten: '', vai: ptNguoi.length ? 'Vợ / chồng' : 'Gia chủ', ngaySinh: '', lich: 'DUONG', gioiTinh: '' });
  const daTraTC = daTraHH(db, kh.ma);
  $('#view').innerHTML = `<h2>${esc(kh.ten)}</h2>
    <p class="muted">${esc(kh.ma)} · <span class="tag ${tagTT[kh.trangThai]}">${esc(TRANG_THAI[kh.trangThai])}</span>${kh.lyDo ? ' · ' + esc(kh.lyDo) : ''} · ${esc(kh.nguon)}</p>
    ${sdt ? `<div class="actions"><a class="btn" href="tel:${esc(sdt)}" style="text-align:center">Gọi ${esc(sdt)}</a><a class="btn" href="https://zalo.me/${esc(sdt)}" target="_blank" rel="noopener" style="text-align:center">Nhắn Zalo</a></div>` : ''}
    ${dangTheo ? `<div class="note">${kh.nhacGoi ? `Hẹn gọi lại <b>${ddmm(kh.nhacGoi)}</b>${kh.nhacGoi < hn ? ' <span class="tre">(quá hạn)</span>' : ''}${kh.soLanNhac ? ` · đã nhắc ${kh.soLanNhac} lần không được` : ''}` : 'Chưa hẹn gọi lại'}
      <div class="actions"><button id="daGoi" class="btn-chinh">Đã gọi / nhắn</button></div></div>` : ''}
    ${kh.leadLuc ? `<p class="muted">Khách tự đăng ký${lk ? ' qua <b>' + esc(lk.ten) + '</b>' : ''} lúc ${gioNgay(kh.leadLuc)}${choGoiDau(kh) ? ` · <span class="${(kh.hanGoi || '') < new Date().toISOString() ? 'tre' : ''}">gọi trước ${gioNgay(kh.hanGoi)} (${conLai(kh.hanGoi)})</span>` : kh.goiDauLuc ? ' · gọi lần đầu ' + gioNgay(kh.goiDauLuc) : ''}</p>` : ''}
    <div class="actions"><button id="mauTin">💬 Mẫu tin Zalo</button><button id="baoDuc">Báo Đức tham gia</button></div>
    ${dangTheo ? `<label class="f">Nóng / ấm / lạnh${gy ? ` <span class="muted">(app gợi ý: ${NHIET_DO[gy]})</span>` : ''}</label>
      <div class="grid-btn ba">${Object.entries(NHIET_DO).map(([k, t]) => `<button data-nd="${k}" class="${nhietDo(kh) === k ? 'on' : ''}">${t}</button>`).join('')}</div>` : ''}
    <label class="f">Phụ trách</label>
    <div class="grid-btn">${Object.entries(PHU_TRACH).map(([k, t]) => `<button data-pt="${k}" class="${(kh.phuTrach || 'THAY') === k ? 'on' : ''}">${t}</button>`).join('')}</div>

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
      <label class="f">Khi nào muốn làm</label><select id="nThoi"><option value="">Chưa hỏi</option>${Object.entries(THOI_DIEM).map(([k, v]) => `<option value="${k}" ${nc.thoiDiem === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
      <label class="f">Nhà / mặt bằng</label><select id="nMb"><option value="">Chưa hỏi</option>${Object.entries(MAT_BANG).map(([k, v]) => `<option value="${k}" ${nc.matBang === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
      <label class="f">Ngân sách so với phân khúc</label><select id="nPk"><option value="">Chưa hỏi</option>${Object.entries(PHAN_KHUC).map(([k, v]) => `<option value="${k}" ${nc.phanKhuc === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
      <p class="muted">3 ô này để app gợi ý nóng / ấm / lạnh.</p>
      <div class="actions"><button id="luuNc">Lưu bảng yêu cầu</button></div>
    </details>

    <details class="cham-ds" ${dangTheo ? 'open' : ''}><summary>Các bước A → C (${BUOC.filter((b) => buocXong(kh, b)).length}/${BUOC.length})</summary>
      ${['A', 'B', 'C'].map((g) => `<p class="muted" style="margin:10px 0 2px"><b>${NHOM_BUOC[g]}</b></p>${BUOC.filter((b) => b.nhom === g).map((b) => { const x = buocXong(kh, b); return `<label class="cham-dong"><input type="checkbox" data-buoc="${b.id}" ${x ? 'checked' : ''} ${x === 'tu' ? 'disabled' : ''}> <span>${esc(b.ten)}${x && x !== 'tu' ? ' · ' + ddmm(x) : x === 'tu' ? ' <span class="muted">(theo trạng thái)</span>' : ''}</span></label>`; }).join('')}`).join('')}
    </details>

    <details class="cham-ds"><summary>Thông tin phong thủy (chỉ lưu)</summary>
      <p class="muted">App chỉ lưu để Thầy tự luận, không tính gì. Ngày sinh ghi dd/mm/yyyy, thiếu thì ghi mm/yyyy hoặc yyyy.</p>
      ${ptNguoi.map((x, i) => `<div class="card" data-pt-ng="${i}">
        <div class="hai-cot"><div><label class="f">Họ tên</label><input data-k="ten" value="${esc(x.ten)}"></div>
          <div><label class="f">Là</label><select data-k="vai">${VAI_NGUOI.map((v) => `<option ${v === x.vai ? 'selected' : ''}>${v}</option>`).join('')}</select></div></div>
        <div class="hai-cot"><div><label class="f">Ngày sinh</label><input data-k="ngaySinh" inputmode="numeric" placeholder="dd/mm/yyyy" value="${esc(x.ngaySinh)}"></div>
          <div><label class="f">Lịch</label><select data-k="lich">${Object.entries(LOAI_LICH).map(([k, v]) => `<option value="${k}" ${k === x.lich ? 'selected' : ''}>${v}</option>`).join('')}</select></div></div>
        <label class="f">Giới tính</label><select data-k="gioiTinh"><option value="">Chưa ghi</option>${Object.entries(GIOI_TINH).map(([k, v]) => `<option value="${k}" ${k === x.gioiTinh ? 'selected' : ''}>${v}</option>`).join('')}</select>
      </div>`).join('')}
      <div class="actions"><button id="ptThem">+ Thêm người</button></div>
      <div class="hai-cot"><div><label class="f">Quận / huyện</label><input id="ptQh" value="${esc(pt.quanHuyen)}"></div><div><label class="f">Tỉnh / thành</label><input id="ptTt" value="${esc(pt.tinhThanh)}"></div></div>
      <div class="hai-cot"><div><label class="f">Toạ hướng nhà</label><input id="ptTh" placeholder="Vd: toạ Tý hướng Ngọ" value="${esc(pt.toaHuong)}"></div><div><label class="f">Độ số (°)</label><input id="ptDo" inputmode="decimal" placeholder="0–359.9" value="${esc(pt.doSo)}"></div></div>
      <label class="f">Ghi chú</label><textarea id="ptGc" rows="2" style="min-height:48px">${esc(pt.ghiChu)}</textarea>
      <div class="actions"><button id="luuPt">Lưu thông tin phong thủy</button></div>
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
      <label class="f">Nguồn</label><select id="hNguon">${(NGUON.includes(kh.nguon) ? NGUON : [kh.nguon, ...NGUON]).map((n) => `<option ${n === kh.nguon ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>
      <label class="f">Ngày liên hệ lần đầu</label><input id="hNgay" type="date" value="${esc(ngayVao(kh))}">
      <label class="f">Người giới thiệu</label><input id="hTen" value="${esc(kh.nguoiGioiThieu)}">
      <input id="hSdt" type="tel" value="${esc(kh.sdtGioiThieu)}" placeholder="SĐT người giới thiệu" style="margin-top:6px">
      <label class="f">Hoa hồng (đồng)</label><input id="hTien" type="number" inputmode="numeric" value="${esc((kh.hoaHong && kh.hoaHong.soTien) || '')}">
      ${(() => { const g = goiYHoaHong(db, kh); return g.chiTiet.length ? `<p class="muted">Gợi ý theo % mặc định: ${g.chiTiet.map((x) => `${x.pct}% HĐ ${x.dang === 'TK' ? 'thiết kế' : 'thi công'} ${tienGon(x.giaTri)}`).join(' + ')} = <b>${tien(g.soTien)}</b> <button id="hGoiY" data-tien="${g.soTien}" class="nho">Dùng số này</button></p>` : ''; })()}
      <label class="cham-dong"><input type="checkbox" id="hDaTra" ${kh.hoaHong && kh.hoaHong.daTra ? 'checked' : ''}> <span>Đã trả hoa hồng / đã cảm ơn</span></label>
      ${daTraTC ? `<p class="muted">Sổ chi đã ghi trả ${tien(daTraTC)} (hạng mục "${HM_HH}").</p>` : ''}
      <div class="actions"><button id="luuH">Lưu</button>${kh.nguoiGioiThieu ? '<button id="traHH">Ghi chi trả hoa hồng</button>' : ''}</div>
      ${kh.trangThai === 'KY' || kh.maCongTrinh ? '<div class="actions"><button id="linkGT">Gửi link giới thiệu của khách này</button></div>' : ''}
    </details>

    ${kh.maCongTrinh ? `<details class="cham-ds" ${kh.banGiao ? 'open' : ''}><summary>Bàn giao, chăm sóc sau bán</summary>
      ${bgCua(db, kh.maCongTrinh) ? `<p><a href="#bg-${esc(kh.maCongTrinh)}">Biên bản bàn giao</a> · bảo hành từng hạng mục và phiếu lỗi ở <a href="#ct-${esc(kh.maCongTrinh)}">trang công trình</a></p>` : ''}
      ${kh.banGiao ? `<p>Bàn giao ${ddmm(kh.banGiao)}/${kh.banGiao.slice(0, 4)} · bảo hành thi công đến <b>${ddmm(kh.baoHanhDen)}/${String(kh.baoHanhDen).slice(0, 4)}</b>. Thiết bị bảo hành theo nhà sản xuất.</p>
        ${(kh.chamSoc || []).map((c) => `<div class="cham-dong" style="justify-content:space-between"><span>Tháng ${c.thang} · hạn ${ddmm(c.han)}${c.xong ? ` · <b>đã làm ${ddmm(c.xong)}</b>${c.ghiChu ? ': ' + esc(c.ghiChu) : ''}` : c.han < hn ? ' · <span class="tre">quá hạn</span>' : ''}</span>
          <span>${c.thang === 1 || c.thang === 6 ? `<button data-cs-gt="${c.thang}" style="min-height:36px;padding:6px 10px">Gửi link giới thiệu</button> ` : ''}${c.xong ? '' : `<button data-cs="${c.thang}" style="min-height:36px;padding:6px 10px">Đã chăm sóc</button>`}</span></div>`).join('')}`
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
  $('#mauTin').onclick = () => moMauTin(kh);
  $('#baoDuc').onclick = () => { ghiChuKhach(db, kh, 'Báo Đức tham gia tư vấn chuyên môn', vaiTro); luu(); chiaSe(baoDuc(kh)); };
  v.querySelectorAll('[data-nd]').forEach((b) => { b.onclick = () => { suaKhach(db, kh, { nhietDo: b.dataset.nd === nhietDo(kh) && kh.nhietDo ? '' : b.dataset.nd }, hn); ve(); }; });
  v.querySelectorAll('[data-pt]').forEach((b) => { b.onclick = () => { if ((kh.phuTrach || 'THAY') === b.dataset.pt) return; suaKhach(db, kh, { phuTrach: b.dataset.pt }, hn); ghiChuKhach(db, kh, 'Phụ trách: ' + PHU_TRACH[b.dataset.pt], vaiTro); ve(); }; });
  v.querySelectorAll('[data-buoc]').forEach((c) => { c.onchange = () => { tichBuoc(db, kh, c.dataset.buoc, c.checked, hn); ve(); }; });
  const docPT = () => {
    const nguoi = [...v.querySelectorAll('[data-pt-ng]')].map((el) => Object.fromEntries([...el.querySelectorAll('[data-k]')].map((x) => [x.dataset.k, x.value.trim()])));
    return { nguoi, quanHuyen: $('#ptQh').value.trim(), tinhThanh: $('#ptTt').value.trim(), toaHuong: $('#ptTh').value.trim(), doSo: $('#ptDo').value.trim(), ghiChu: $('#ptGc').value.trim() };
  };
  $('#ptThem').onclick = () => { const x = docPT(); x.nguoi.push({ ten: '', vai: 'Khác', ngaySinh: '', lich: 'DUONG', gioiTinh: '' }); suaKhach(db, kh, { phongThuy: x }, hn); ve(); };
  $('#luuPt').onclick = () => {
    const x = docPT();
    for (const ng of x.nguoi) { const ns = docNgaySinh(ng.ngaySinh); if (ns === null) return bao(`Ngày sinh "${ng.ngaySinh}" chưa đúng, ghi dd/mm/yyyy`); ng.ngaySinh = ns; }
    const doSo = docDoSo(x.doSo);
    if (doSo === null) return bao('Độ số từ 0 đến dưới 360');
    x.doSo = doSo;
    x.nguoi = x.nguoi.filter((ng) => ng.ten || ng.ngaySinh || ng.gioiTinh);
    suaKhach(db, kh, { phongThuy: x }, hn); bao('Đã lưu thông tin phong thủy'); ve();
  };
  if ($('#traHH')) $('#traHH').onclick = () => {
    const hh = Number((kh.hoaHong || {}).soTien) || goiYHoaHong(db, kh).soTien;
    moGhiKhoan({ loai: 'CHI', ma: CTY, hangMuc: HM_HH, thamChieu: kh.ma, doiTuong: kh.nguoiGioiThieu, soTien: hh > daTraTC ? hh - daTraTC : '', noiDung: `Hoa hồng giới thiệu khách ${kh.ten}` });
  };
  const guiGT = () => { const l = linkGTCuaKhach(db, kh); luu(); moMauTin(kh, 'GIOI_THIEU', l); };
  if ($('#linkGT')) $('#linkGT').onclick = guiGT;
  v.querySelectorAll('[data-cs-gt]').forEach((b) => { b.onclick = guiGT; });
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
    const moi = { ...nc, loai: $('#nLoai').value, thoiDiem: $('#nThoi').value, matBang: $('#nMb').value, phanKhuc: $('#nPk').value };
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
  if ($('#hGoiY')) $('#hGoiY').onclick = () => { $('#hTien').value = $('#hGoiY').dataset.tien; };
  $('#luuH').onclick = () => {
    suaKhach(db, kh, { nguon: $('#hNguon').value, ngayVao: $('#hNgay').value || ngayVao(kh), nguoiGioiThieu: $('#hTen').value.trim(), sdtGioiThieu: $('#hSdt').value.replace(/\s+/g, ''), hoaHong: { ...(kh.hoaHong || {}), soTien: Number($('#hTien').value) || 0, daTra: $('#hDaTra').checked } }, hn);
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

// ---------- Mẫu tin Zalo (chỉ gửi tay) ----------
const apiHienTai = () => { const kn = ketNoi(); return kn ? maApi(kn.api) : ''; };
const urlLink = (l) => urlForm(goc(), l.ma, apiHienTai());
function moMauTin(kh, chon = '', lGT = null) {
  const ds = dsMauTin(db.caiDat);
  const cd = db.caiDat || {};
  const lgt = lGT || (db.linkDK || []).find((l) => l.loai === 'GIOI_THIEU' && l.maKhachGT === kh.ma && l.hoatDong !== false);
  const ban = { nguoi: cd['tenGui' + vaiTro] || '', hoSo: cd.linkHoSo || '', linkGT: lgt ? urlLink(lgt) : '' };
  let id = chon || (kh.trangThai === 'MOI' ? 'CHAO' : kh.trangThai === 'BAO_GIA' ? 'SAU_BG' : kh.trangThai === 'HEN_GAP' ? 'HEN' : kh.trangThai === 'KY' ? 'GIOI_THIEU' : 'HO_SO');
  const d = $('#sheet');
  const ve = () => {
    const m = ds.find((x) => x.id === id);
    d.innerHTML = `<h2>Mẫu tin cho ${esc(kh.ten)}</h2>
      <div class="loc">${ds.map((x) => `<button data-mau="${x.id}" class="${x.id === id ? 'on' : ''}">${esc(x.ten)}</button>`).join('')}</div>
      ${id === 'HEN' ? `<label class="f">Giờ, ngày khảo sát</label><input id="ngayHen" placeholder="Vd: 9h sáng thứ Bảy 22/11" value="${esc(ban.ngay || '')}">` : ''}
      <label class="f">Nội dung (sửa được trước khi gửi)</label>
      <textarea id="tinGui" class="cao">${esc(dienMau(m.chu, kh, ban))}</textarea>
      <p class="muted">Chỗ còn {ngoặc} là app chưa có dữ liệu, Thầy sửa tay${!ban.nguoi || !ban.hoSo ? '. Tên người gửi và link hồ sơ năng lực đặt ở Khách → Form, mẫu tin' : ''}.</p>
      <div class="actions"><button id="huy">Đóng</button>${kh.sdt ? '<button id="zalo">Chép + mở Zalo khách</button>' : ''}<button id="chiaSe" class="btn-chinh">Chia sẻ</button></div>`;
    d.querySelectorAll('[data-mau]').forEach((b) => { b.onclick = () => { id = b.dataset.mau; ve(); }; });
    const nh = $('#ngayHen', d);
    if (nh) nh.onchange = () => { ban.ngay = nh.value.trim(); ve(); };
    $('#huy', d).onclick = () => d.close();
    const xong = () => { ghiChuKhach(db, kh, 'Gửi tin mẫu: ' + m.ten, vaiTro); luu(); };
    $('#chiaSe', d).onclick = () => { xong(); chiaSe($('#tinGui', d).value); };
    const z = $('#zalo', d);
    if (z) z.onclick = async () => {
      try { await navigator.clipboard.writeText($('#tinGui', d).value); bao('Đã chép, dán vào Zalo'); } catch { bao('Không chép được, bấm Chia sẻ'); }
      xong();
      window.open('https://zalo.me/' + String(kh.sdt).replace(/\D/g, ''), '_blank', 'noopener');
    };
  };
  ve();
  if (!d.open) d.showModal();
}

// ---------- Form đăng ký, link nguồn / giới thiệu, mẫu tin ----------
function manLinkDK() {
  datTab('khach', 'Form, mẫu tin');
  const api = apiHienTai();
  const ds = (db.linkDK || []).slice().sort((a, b) => (a.hoatDong === false) - (b.hoatDong === false) || (a.loai === 'GIOI_THIEU') - (b.loai === 'GIOI_THIEU'));
  const dem = demTheoLink(db);
  const cd = db.caiDat || {};
  const mau = dsMauTin(cd);
  $('#view').innerHTML = `${dauKhach('link-dk')}
    <h3>Form đăng ký tư vấn</h3>
    <p class="muted">Khách điền Tên + SĐT là vào thẳng Sổ khách, nguồn ghi theo link khách bấm. Lead mới hiện đầu màn Hôm nay của Thầy, gọi trong 2 giờ làm việc (8h–20h), quá hạn hiện đỏ.</p>
    ${api ? '' : '<p class="note">Bản thử chưa nối máy chủ: link tạo ra chưa nhận được đăng ký.</p>'}
    <div class="actions"><button id="taoLink" class="btn-chinh">+ Tạo link</button>${ds.some((l) => l.loai === 'KENH') ? '' : '<button id="taoNhanh">Tạo nhanh link Website, Fanpage</button>'}</div>
    ${ds.length ? ds.map((l) => { const n = dem[l.ma] || { lead: 0, ky: 0 }; return `<div class="card" ${l.hoatDong === false ? 'style="opacity:.6"' : ''}>
      <div class="row"><span class="name">${esc(l.ten)}</span><span class="tag ${l.loai === 'GIOI_THIEU' ? 'DANG' : 'XONG'}">${LOAI_LINK[l.loai] || l.loai}</span></div>
      <div class="muted">Nguồn: ${esc(l.nguon)}${l.nguoiGioiThieu ? ' · người giới thiệu: ' + esc(l.nguoiGioiThieu) : ''} · ${n.lead} lead · ${n.ky} ký${l.hoatDong === false ? ' · <b>đã tắt</b>' : ''}</div>
      <div class="actions"><button data-chep="${esc(l.ma)}">Chép link</button><button data-gui-l="${esc(l.ma)}">Gửi</button>${l.loai === 'KENH' ? `<button data-nhung="${esc(l.ma)}">Mã gắn website</button>` : ''}<button data-tat="${esc(l.ma)}">${l.hoatDong === false ? 'Bật lại' : 'Tắt'}</button></div>
    </div>`; }).join('') : '<p class="muted">Chưa có link nào.</p>'}
    <p class="muted">Fanpage: dán link vào nút "Đăng ký" của trang và cuối bài đăng. Sự kiện: mỗi sự kiện tạo 1 link riêng để biết khách đến từ đâu. Mã QR: dán link vào ứng dụng QR trong Canva.</p>

    <h3>Mẫu tin Zalo</h3>
    <p class="muted">5 mẫu em soạn sẵn, Thầy sửa rồi bấm Lưu. App chỉ điền sẵn, Thầy tự bấm gửi. Chỗ trong {ngoặc}: {ten} tên khách, {nguoi} người gửi, {hoSo} link hồ sơ năng lực, {ngay} giờ ngày hẹn, {diaChi} địa chỉ, {baoGia} ngày báo giá, {linkGT} link giới thiệu.</p>
    <div class="hai-cot"><div><label class="f">Tên Thầy trong tin</label><input id="tgTHAY" value="${esc(cd.tenGuiTHAY || '')}" placeholder="Tên ghi trong tin"></div><div><label class="f">Tên Đức trong tin</label><input id="tgDUC" value="${esc(cd.tenGuiDUC || '')}" placeholder="Vd: KTS Đức"></div></div>
    <label class="f">Link hồ sơ năng lực (Drive / PDF)</label><input id="hoSo" value="${esc(cd.linkHoSo || '')}" placeholder="https://drive.google.com/…">
    <div class="actions"><button id="luuGui">Lưu tên, link</button></div>
    ${mau.map((m) => `<label class="f">${esc(m.ten)}${m.daSua ? ' <span class="muted">(đã sửa)</span>' : ''}</label><textarea data-mau-sua="${m.id}" rows="4">${esc(m.chu)}</textarea>
      <div class="actions"><button data-luu-mau="${m.id}">Lưu mẫu</button>${m.daSua ? `<button data-goc-mau="${m.id}">Về mẫu gốc</button>` : ''}</div>`).join('')}`;
  const v = $('#view');
  const tim = (ma) => ds.find((l) => l.ma === ma);
  $('#taoLink').onclick = () => moTaoLink();
  const tn = $('#taoNhanh');
  if (tn) tn.onclick = () => { taoLinkDK(db, { ten: 'Website noithatkas.com', nguon: 'Website' }); taoLinkDK(db, { ten: 'Fanpage KAS Houzing', nguon: 'Facebook' }); luu(); bao('Đã tạo 2 link'); manLinkDK(); };
  v.querySelectorAll('[data-chep]').forEach((b) => { b.onclick = async () => { try { await navigator.clipboard.writeText(urlLink(tim(b.dataset.chep))); bao('Đã chép link'); } catch { bao(urlLink(tim(b.dataset.chep)), 6000); } }; });
  v.querySelectorAll('[data-gui-l]').forEach((b) => { b.onclick = () => { const l = tim(b.dataset.guiL); chiaSe(`KAS Houzing – đăng ký tư vấn thiết kế, thi công nhà ở:\n${urlLink(l)}`); }; });
  v.querySelectorAll('[data-nhung]').forEach((b) => { b.onclick = async () => {
    const u = urlLink(tim(b.dataset.nhung));
    const ma = `<a href="${u}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 22px;background:#1f3864;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Đăng ký tư vấn</a>\n\n<iframe src="${u}" title="Đăng ký tư vấn KAS" style="width:100%;max-width:440px;height:520px;border:0" loading="lazy"></iframe>`;
    try { await navigator.clipboard.writeText(ma); bao('Đã chép mã: 1 nút và 1 khung form, dán vào khối HTML tuỳ chỉnh trên WordPress', 5000); } catch { bao('Không chép được', 3000); }
  }; });
  v.querySelectorAll('[data-tat]').forEach((b) => { b.onclick = () => { const l = tim(b.dataset.tat); suaLinkDK(db, l, { hoatDong: l.hoatDong === false }); luu(); manLinkDK(); }; });
  $('#luuGui').onclick = () => { datCaiDat(db, 'tenGuiTHAY', $('#tgTHAY').value.trim()); datCaiDat(db, 'tenGuiDUC', $('#tgDUC').value.trim()); datCaiDat(db, 'linkHoSo', $('#hoSo').value.trim()); luu(); bao('Đã lưu'); };
  v.querySelectorAll('[data-luu-mau]').forEach((b) => { b.onclick = () => {
    const t = v.querySelector(`[data-mau-sua="${b.dataset.luuMau}"]`).value.trim();
    const goc0 = MAU_TIN.find((m) => m.id === b.dataset.luuMau).chu;
    if (t.length > 1900) return bao('Mẫu dài quá, tối đa khoảng 1.900 ký tự');
    datCaiDat(db, khoaMauTin(b.dataset.luuMau), t === goc0 ? '' : t); luu(); bao('Đã lưu mẫu'); manLinkDK();
  }; });
  v.querySelectorAll('[data-goc-mau]').forEach((b) => { b.onclick = () => { datCaiDat(db, khoaMauTin(b.dataset.gocMau), ''); luu(); bao('Đã về mẫu gốc'); manLinkDK(); }; });
}

function moTaoLink() {
  const d = $('#sheet');
  d.innerHTML = `<h2>Tạo link đăng ký</h2>
    <div class="grid-btn"><button data-lo="KENH" class="on">Theo nguồn</button><button data-lo="GIOI_THIEU">Giới thiệu</button></div>
    <label class="f">Tên link (để Thầy nhận ra)</label><input id="lTen" placeholder="Vd: Hội chợ nội thất 12/2026">
    <label class="f">Nguồn ghi cho khách</label><select id="lNguon">${NGUON.map((n) => `<option>${esc(n)}</option>`).join('')}</select>
    <div id="lGt" hidden><label class="f">Người giới thiệu</label><input id="lGtTen" placeholder="Tên đối tác / người giới thiệu"><input id="lGtSdt" type="tel" inputmode="tel" placeholder="SĐT" style="margin-top:6px">
      <p class="muted">Khách cũ thì tạo ở hồ sơ khách đó (nút "Gửi link giới thiệu").</p></div>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Tạo link</button></div>`;
  d.showModal();
  let lo = 'KENH';
  d.querySelectorAll('[data-lo]').forEach((b) => { b.onclick = () => {
    lo = b.dataset.lo;
    d.querySelectorAll('[data-lo]').forEach((x) => x.classList.toggle('on', x === b));
    $('#lGt', d).hidden = lo !== 'GIOI_THIEU';
    $('#lNguon', d).value = lo === 'GIOI_THIEU' ? 'Đối tác giới thiệu' : 'Website';
  }; });
  $('#lNguon', d).value = 'Website';
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const ten = $('#lTen', d).value.trim();
    const gt = lo === 'GIOI_THIEU' ? $('#lGtTen', d).value.trim() : '';
    if (lo === 'GIOI_THIEU' && !gt) return bao('Ghi tên người giới thiệu');
    if (!ten && !gt) return bao('Đặt tên cho link');
    taoLinkDK(db, { ten: ten || 'Giới thiệu của ' + gt, nguon: $('#lNguon', d).value, loai: lo, nguoiGioiThieu: gt, sdtGioiThieu: lo === 'GIOI_THIEU' ? $('#lGtSdt', d).value : '' });
    luu(); d.close(); bao('Đã tạo link'); manLinkDK();
  };
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
  $('#view').innerHTML = `${dauTien('hop-dong')}
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
    <label class="f">Chi dự kiến, giá gốc (đồng, không bắt buộc)</label><input id="chiDk" type="number" inputmode="numeric" placeholder="Tổng thầu + vật tư dự kiến, để tính lãi gộp">
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
      ngayKy: $('#ngay').value, giaTri, dot, tenKhach: kh ? kh.ten : '', linkFile: $('#link').value.trim(), chiDuKien: Number($('#chiDk').value) || 0,
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
      <label class="f">Chi dự kiến, giá gốc (đồng, để tính lãi gộp)</label><input id="sChiDk" type="number" inputmode="numeric" value="${esc(hd.chiDuKien || '')}">
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
      chiaSe(tinDeNghiTT(hd, timDot(b.dataset.dn)));
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
    const doi = { soHD: $('#sSo').value.trim() || hd.soHD, ngayKy: $('#sNgay').value || hd.ngayKy, giaTri: Number($('#sGia').value) || hd.giaTri, maCongTrinh: $('#sCt').value, linkFile: $('#sLink').value.trim(), chiDuKien: Number($('#sChiDk').value) || 0 };
    if ($('#sSua')) { doi.soLanSua = Number($('#sSua').value) || 0; doi.soBuoiGSTG = Number($('#sGs').value) || 0; }
    if ($('#sHan')) { doi.khauTru = { han: $('#sHan').value, tyLe: Number($('#sTyLe').value) || 0 }; doi.phamVi = $('#sPv').value; doi.giaTriKT = Number($('#sKT').value) || 0; }
    suaHopDong(db, hd, doi); bao('Đã lưu'); ve();
  });
}

function tinDeNghiTT(hd, d) {
  const kh = (db.khach || []).find((k) => k.ma === hd.maKhach);
  const tk = (db.caiDat && db.caiDat.taiKhoan) || '';
  return `KAS Houzing kính gửi anh/chị ${kh ? kh.ten : ''}\nĐề nghị thanh toán đợt ${d.so} (${d.tyLe}%) theo hợp đồng số ${hd.soHD}.\nNội dung: ${d.ten}\nSố tiền: ${tien(d.conLai)}\n${tk ? `Thông tin chuyển khoản:\n${tk}\nNội dung chuyển khoản: ${hd.soHD} dot ${d.so}\n` : ''}Trân trọng cảm ơn anh/chị.`;
}

// ---------- Tài khoản tiền (chọn khi ghi thu, chi) ----------
const KHOA_TK_CUOI = 'kas-tk-cuoi';
const tkCuoi = () => { try { return localStorage.getItem(KHOA_TK_CUOI) || ''; } catch { return ''; } };
const nhoTK = (id) => { try { if (id) localStorage.setItem(KHOA_TK_CUOI, id); } catch { /* bị chặn bộ nhớ */ } };
const tenTK = (id) => { const q = (db.taiKhoan || []).find((x) => x.id === id); return q ? q.ten : ''; };
// Ô chọn tài khoản, gom theo loại. Giám sát chỉ thấy tài khoản văn phòng cho phép.
function chonTK(chon, chu = 'Chưa chọn tài khoản') {
  const ds = laVanPhong() ? dsTaiKhoan(db) : tkChoGiamSat(db);
  const co = ds.some((q) => q.id === chon);
  const gia = !co && chon === undefined ? (ds.some((q) => q.id === tkCuoi()) ? tkCuoi() : '') : chon;
  return `<option value="">${esc(chu)}</option>${Object.entries(LOAI_TK).map(([k, ten]) => {
    const nhom = ds.filter((q) => q.loai === k);
    return nhom.length ? `<optgroup label="${ten}">${nhom.map((q) => `<option value="${esc(q.id)}" ${q.id === gia ? 'selected' : ''}>${esc(q.ten)}${q.nguoiGiu ? ' · ' + esc(q.nguoiGiu) : ''}</option>`).join('')}</optgroup>` : '';
  }).join('')}`;
}

// `sau`: chạy sau khi lưu (mặc định mở lại hợp đồng).
function moGhiThu(hd, d, sau) {
  const dl = $('#sheet');
  dl.innerHTML = `<h2>Thu đợt ${d.so}: ${esc(d.ten)}</h2>
    <p class="muted">Phải thu ${tien(d.phaiThu)} · đã thu ${tien(d.daThu)} · còn ${tien(d.conLai)}</p>
    <label class="f">Số tiền khách chuyển (đồng)</label><input id="st" type="number" inputmode="numeric" value="${Math.max(0, d.conLai)}">
    <p class="muted" id="stChu"></p>
    <label class="f">Ngày</label><input id="ng" type="date" value="${homNay()}">
    <label class="f">Tiền vào tài khoản nào</label><select id="tk">${chonTK()}</select>
    <label class="f">Ghi chú</label><input id="gc" placeholder="Vd: chuyển khoản Vietcombank">
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  dl.showModal();
  const chu = () => { $('#stChu', dl).textContent = tien($('#st', dl).value); };
  $('#st', dl).oninput = chu; chu();
  $('#huy', dl).onclick = () => dl.close();
  $('#ok', dl).onclick = () => {
    const st = Number($('#st', dl).value);
    if (!st) return bao('Nhập số tiền');
    const tk = $('#tk', dl).value;
    nhoTK(tk);
    const dong = ghiThu(db, hd, d.id, { ngay: $('#ng', dl).value, soTien: st, ghiChu: $('#gc', dl).value.trim(), taiKhoan: tk }, vaiTro);
    luu(); dl.close();
    bao(dong ? 'Đủ tiền, đã đóng đợt' : 'Đã ghi. Thu thiếu thì bấm Đóng đợt để chuyển phần thiếu sang đợt sau');
    if (sau) sau(); else manMotHD(hd.ma);
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
// ---------- Thu chi, trả thầu (văn phòng; giám sát chỉ xác nhận khối lượng) ----------
let locThang = '';
let locMaTC = '';
let locTK = ''; // '' = tất cả, 'CHUA' = chưa gắn tài khoản, còn lại = id tài khoản
const dauTien = (tab) => `<div class="loc doan nhieu khong-in">${[['hop-dong', 'Hợp đồng'], ['thu-chi', 'Thu chi'], ['cong-no', 'Công nợ'], ['dong-tien', 'Dòng tiền'],
  ['tai-khoan', 'Tài khoản'], ['tra-thau', 'Trả thầu'], ['phat-sinh', 'Phát sinh']]
  .map(([h, t]) => `<a class="btn ${h === tab ? 'on' : ''}" href="#${h}">${t}</a>`).join('')}</div>`;
const tenMa = (ma) => (ma === CTY ? 'Chi chung công ty' : ma || 'Chưa gắn công trình');
const laiToiThieu = () => Number((db.caiDat || {}).laiGopToiThieu) || 0;
const nguongPS = () => { const x = (db.caiDat || {}).nguongPhatSinh; return x === undefined || x === '' ? NGUONG_MAC_DINH : Number(x) || 0; };

// Thu theo HĐ trong tháng, để hiện chung danh sách (chỉ xem, sửa ở màn hợp đồng).
function thuHDTrongThang(thang, ma) {
  const ds = [];
  for (const hd of db.hopDong || []) {
    if (ma && hd.maCongTrinh !== ma) continue;
    for (const d of hd.dot || []) for (const x of d.thu || []) {
      if (!String(x.ngay).startsWith(thang)) continue;
      ds.push({ id: x.id, ngay: x.ngay, ma: hd.maCongTrinh, loai: 'THU', hangMuc: hd.dang === 'TK' ? 'Thu HĐ thiết kế' : 'Thu HĐ thi công', doiTuong: hd.tenHD,
        soTien: Number(x.soTien) || 0, noiDung: `Đợt ${d.so} · ${hd.soHD}`, hd: hd.ma, taoLuc: '', taiKhoan: x.taiKhoan || '', duyet: 'VP', nguoi: 'THAY' });
    }
  }
  return ds;
}

function theKhoan(e) {
  if (e.loai === 'CHUYEN') {
    return `<button class="card" data-tc="${esc(e.id)}"><div class="row"><span class="name">Chuyển tiền</span><b>⇄ ${tienGon(e.soTien)}</b></div>
      <div class="muted">${esc(tenTK(e.taiKhoan) || '?')} → ${esc(tenTK(e.toiTK) || '?')}${e.noiDung ? ' · ' + esc(e.noiDung) : ''}</div></button>`;
  }
  const dau = e.loai === 'THU' ? '+' : '−';
  const gs = !VAN_PHONG.includes(e.nguoi) && e.nguoi;
  const tagKiem = gs ? (e.duyet ? '<span class="tag XONG">Đã kiểm</span>' : `<span class="tag SAP">${laVanPhong() ? esc(tenNguoi(e.nguoi)) + ' ghi, chưa kiểm' : 'Chờ văn phòng kiểm'}</span>`) : '';
  const tk = e.taiKhoan ? tenTK(e.taiKhoan) : '';
  const inner = `<div class="row"><span class="name">${esc(e.hangMuc)} ${tagKiem}</span><b class="${e.loai === 'THU' ? 'tien-thu' : 'tien-chi'}">${dau}${tienGon(e.soTien)}</b></div>
    <div class="muted">${esc(tenMa(e.ma))}${e.doiTuong ? ' · ' + esc(e.doiTuong) : ''}${e.noiDung ? ' · ' + esc(e.noiDung) : ''}${e.soAnh ? ` · 📎 ${e.soAnh}` : ''}${e.hinhThuc === 'TM' ? ' · tiền mặt' : ''}${tk ? ' · 🏦 ' + esc(tk) : laVanPhong() ? ' · <span class="tre">chưa gắn tài khoản</span>' : ''}</div>`;
  return e.hd ? `<a class="card" href="#${esc(e.hd)}">${inner}</a>` : `<button class="card" data-tc="${esc(e.id)}">${inner}</button>`;
}

function manThuChi(ma, tk) {
  datTab('hop-dong', 'Thu chi');
  const hn = homNay();
  if (!locThang) locThang = hn.slice(0, 7);
  if (ma !== undefined) locMaTC = ma;
  if (tk !== undefined) locTK = tk;
  const t = tongThang(db, locThang);
  const no = congNoThau(db, hn);
  const hopTK = (e) => !locTK || (locTK === 'CHUA' ? !e.taiKhoan && e.loai !== 'CHUYEN' : e.taiKhoan === locTK || e.toiTK === locTK);
  const ds = [...soConLai(db).filter((e) => String(e.ngay).startsWith(locThang) && (!locMaTC || e.ma === locMaTC)), ...(locMaTC === CTY ? [] : thuHDTrongThang(locThang, locMaTC))]
    .filter(hopTK)
    .sort((a, b) => (b.ngay + b.taoLuc).localeCompare(a.ngay + a.taoLuc));
  const kiem = choKiem(db);
  let ngay = '';
  const dsHtml = ds.map((e) => `${e.ngay !== ngay ? `<p class="ngay-nhom">${fmtNgay((ngay = e.ngay))}</p>` : ''}${theKhoan(e)}`).join('');
  const lg = locMaTC && locMaTC !== CTY ? laiGop(db, locMaTC, laiToiThieu(), nguongPS()) : null;
  $('#view').innerHTML = `${dauTien('thu-chi')}
    <div class="so-lieu"><div><span>Thu tháng ${locThang.slice(5)}</span><b class="tien-thu">${tienGon(t.thu)}</b></div><div><span>Chi tháng ${locThang.slice(5)}</span><b class="tien-chi">${tienGon(t.chi)}</b></div>
      <div><span>Chênh lệch</span><b>${t.chenh < 0 ? '−' : ''}${tienGon(Math.abs(t.chenh))}</b></div><div><span>Trong đó chi công ty</span><b>${tienGon(t.chiCty)}</b></div></div>
    <div class="so-lieu"><a href="#tra-thau"><span>Đến hạn trả thầu</span><b class="${no.denHan ? 'tre' : ''}">${tienGon(no.denHan)}</b></a><a href="#tra-thau"><span>Còn phải trả thầu</span><b>${tienGon(no.conPhaiTra)}</b></a></div>
    <div class="actions"><button id="ghiChi" class="btn-chinh">− Ghi chi</button><button id="ghiThu">+ Ghi thu khác</button><button id="chuyenTien">⇄ Chuyển tiền</button></div>
    ${kiem.length ? `<h3>Giám sát ghi, chờ kiểm (${kiem.length})</h3><p class="muted">Bấm vào khoản, xem ảnh chứng từ trong Drive, đúng thì bấm "Đã kiểm".</p>${kiem.map(theKhoan).join('')}` : ''}
    <div class="hai-cot loc-tc">
      <div><span class="muted">Tháng</span><input id="thang" type="month" value="${esc(locThang)}"></div>
      <div><span class="muted">Công trình</span><select id="locMa"><option value="">Tất cả</option><option value="${CTY}" ${locMaTC === CTY ? 'selected' : ''}>Chi chung công ty</option>
        ${db.congTrinh.map((c) => `<option value="${esc(c.ma)}" ${c.ma === locMaTC ? 'selected' : ''}>${esc(c.ma)}</option>`).join('')}</select></div>
    </div>
    <div class="loc-tc"><span class="muted">Tài khoản</span><select id="locTk">${chonTK(locTK, 'Tất cả tài khoản').replace('</option>', `</option><option value="CHUA" ${locTK === 'CHUA' ? 'selected' : ''}>Chưa gắn tài khoản</option>`)}</select></div>
    ${lg ? khoiLaiGop(lg) : ''}
    ${dsHtml || '<p class="muted">Tháng này chưa ghi khoản nào.</p>'}
    <p class="muted">Thu theo hợp đồng ghi ở màn Hợp đồng (bấm vào để mở). Ở đây ghi chi và các khoản thu ngoài hợp đồng.</p>
    <details class="cham-ds"><summary>Ngưỡng cảnh báo: lãi gộp, phát sinh</summary>
      <label class="f">Lãi gộp tối thiểu mong muốn (%)</label>
      <input id="laiMin" type="number" inputmode="decimal" value="${esc((db.caiDat || {}).laiGopToiThieu || '')}" placeholder="Vd: 20 (để trống là không cảnh báo)">
      <label class="f">Tổng phát sinh / HĐ thi công vượt (%) thì cảnh báo</label>
      <input id="psMax" type="number" inputmode="decimal" value="${nguongPS()}">
      <div class="actions"><button id="luuLai">Lưu</button></div>
    </details>`;
  $('#thang').onchange = () => { locThang = $('#thang').value || hn.slice(0, 7); manThuChi(); };
  $('#locMa').onchange = () => { locMaTC = $('#locMa').value; manThuChi(); };
  $('#locTk').onchange = () => { locTK = $('#locTk').value; manThuChi(); };
  $('#chuyenTien').onclick = () => moGhiKhoan({ loai: 'CHUYEN' });
  $('#ghiChi').onclick = () => moGhiKhoan({ loai: 'CHI', ma: locMaTC });
  $('#ghiThu').onclick = () => moGhiKhoan({ loai: 'THU', ma: locMaTC === CTY ? '' : locMaTC });
  $('#luuLai').onclick = () => {
    datCaiDat(db, 'laiGopToiThieu', String(Number($('#laiMin').value) || 0));
    datCaiDat(db, 'nguongPhatSinh', String(Number($('#psMax').value) || 0));
    luu(); bao('Đã lưu'); manThuChi();
  };
  $('#view').querySelectorAll('[data-tc]').forEach((b) => { b.onclick = () => moGhiKhoan(null, (db.thuChi || []).find((e) => e.id === b.dataset.tc)); });
}

function khoiLaiGop(lg) {
  return `<div class="so-lieu">
      <div><span>Doanh thu HĐ</span><b>${tienGon(lg.doanhThu)}</b></div><div><span>Đã thu</span><b class="tien-thu">${tienGon(lg.daThu)}</b></div>
      <div><span>Đã chi</span><b class="tien-chi">${tienGon(lg.chi)}</b></div><div><span>Chi dự kiến</span><b>${lg.chiDuKien ? tienGon(lg.chiDuKien) : '—'}</b></div>
      <div><span>Lãi gộp dự kiến</span><b class="${lg.laiDuKien !== null && lg.laiDuKien < 0 ? 'tre' : ''}">${lg.laiDuKien === null ? '—' : `${lg.laiDuKien < 0 ? '−' : ''}${tienGon(Math.abs(lg.laiDuKien))}`}</b>${lg.pctDuKien !== null ? `<span>${String(lg.pctDuKien).replace('.', ',')}% doanh thu</span>` : ''}</div><div><span>Tiền đang có (thu − chi)</span><b>${lg.laiThucTe < 0 ? '−' : ''}${tienGon(Math.abs(lg.laiThucTe))}</b></div>
    </div>
    ${lg.chiDuKien ? '' : '<p class="muted">Chưa nhập chi dự kiến: mở hợp đồng → Sửa thông tin → Chi dự kiến.</p>'}
    ${lg.canhBao.map((c) => `<p class="note"><b class="tre">${esc(c)}</b></p>`).join('')}`;
}

// Ghi 1 khoản thu/chi/chuyển tiền (mới hoặc sửa). `du` điền sẵn: { loai, ma, hangMuc, thamChieu, doiTuong, soTien }.
// Giám sát: chỉ ghi chi ở công trình được giao, chọn tài khoản văn phòng cho phép; văn phòng kiểm rồi thì chỉ xem.
function moGhiKhoan(du, cu) {
  const d = $('#sheet');
  if (d.open) d.close();
  const vp = laVanPhong();
  const e0 = cu || { loai: 'CHI', ngay: homNay(), ma: '', hangMuc: '', thamChieu: '', doiTuong: '', soTien: '', noiDung: '', hinhThuc: 'CK', ...du };
  let loai = vp ? e0.loai : 'CHI';
  const khoa = !vp && cu && !!cu.duyet; // giám sát xem khoản đã kiểm
  const choKiemNay = vp && cu && !cu.duyet && !VAN_PHONG.includes(cu.nguoi);
  const tieuDe = () => (cu ? 'Sửa khoản' : loai === 'THU' ? 'Ghi thu ngoài hợp đồng' : loai === 'CHUYEN' ? 'Chuyển tiền giữa tài khoản' : 'Ghi chi');
  d.innerHTML = `<h2 id="tieuDe">${tieuDe()}</h2>
    ${vp ? '<div class="grid-btn ba"><button data-loai="CHI">Chi</button><button data-loai="THU">Thu</button><button data-loai="CHUYEN">Chuyển tiền</button></div>' : ''}
    ${choKiemNay ? `<p class="note">${esc(tenNguoi(cu.nguoi))} ghi, chưa kiểm. Xem ảnh chứng từ${cu.soAnh ? ` (${cu.soAnh} ảnh trong Drive, thư mục "KAS App – Chứng từ")` : ''}, đúng thì bấm "Đã kiểm".</p>` : ''}
    ${khoa ? '<p class="note">Văn phòng đã kiểm khoản này. Ghi nhầm thì báo văn phòng sửa.</p>' : ''}
    <div class="hai-cot">
      <div><label class="f">Ngày</label><input id="ngay" type="date" value="${esc(e0.ngay)}"></div>
      <div id="maBox"><label class="f">Công trình</label><select id="ma"></select></div>
    </div>
    <div id="hmBox"><label class="f">Hạng mục</label><select id="hm"></select></div>
    <div id="dotBox"><label class="f" id="dotNhan">Trả đợt nào</label><select id="dot"></select></div>
    <div id="dtBox"><label class="f" id="dtNhan">Đối tượng (thầu, nhà cung cấp, người nhận)</label><input id="dt" list="dsDt" value="${esc(e0.doiTuong)}"><datalist id="dsDt"></datalist></div>
    <label class="f" id="tkNhan">Tài khoản</label><select id="tk">${chonTK(cu ? e0.taiKhoan || '' : undefined)}</select>
    <div id="tk2Box"><label class="f">Sang tài khoản</label><select id="tk2">${chonTK(e0.toiTK || '', 'Chọn tài khoản nhận')}</select></div>
    ${!vp && !tkChoGiamSat(db).length ? '<p class="muted">Văn phòng chưa cho chọn tài khoản nào, cứ ghi, văn phòng gắn sau.</p>' : ''}
    <label class="f">Số tiền</label><input id="st" inputmode="decimal" value="${e0.soTien ? esc(e0.soTien) : ''}" placeholder="Vd: 12tr, 500k, 12000000"><p id="stChu" class="muted"></p>
    <label class="f">Nội dung</label><div class="mic"><textarea id="nd" placeholder="Vd: Thầu điện nước đợt 1">${esc(e0.noiDung)}</textarea><button id="noi">🎤</button></div>
    <div id="htBox"><label class="f">Hình thức</label><select id="ht">${Object.entries(HINH_THUC).map(([k, t]) => `<option value="${k}" ${k === e0.hinhThuc ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
    <label class="btn anh-ct" style="display:block;text-align:center;margin-top:12px">📎 Ảnh chuyển khoản / hoá đơn${e0.soAnh ? ` (đã có ${e0.soAnh})` : ''}<input id="anh" type="file" accept="image/*" multiple hidden></label>
    <p id="soAnh" class="muted"></p>
    <div class="actions">${cu && !khoa ? '<button id="xoa" class="btn-do">Xoá</button>' : ''}<button id="huy">${khoa ? 'Đóng' : 'Huỷ'}</button>${choKiemNay ? '<button id="kiem">✓ Đã kiểm</button>' : ''}${khoa ? '' : '<button id="ok" class="btn-chinh">Lưu</button>'}</div>`;
  const veLoai = (dau) => {
    d.querySelectorAll('[data-loai]').forEach((b) => b.classList.toggle('on', b.dataset.loai === loai));
    $('#tieuDe', d).textContent = tieuDe();
    const chuyen = loai === 'CHUYEN';
    ['#maBox', '#hmBox', '#dtBox', '#htBox'].forEach((id) => { $(id, d).hidden = chuyen; });
    $('#tk2Box', d).hidden = !chuyen;
    $('#tkNhan', d).textContent = chuyen ? 'Từ tài khoản' : loai === 'THU' ? 'Tiền vào tài khoản nào' : 'Chi từ tài khoản nào';
    const truoc = dau ? e0.ma : $('#ma', d).value;
    const sel = $('#ma', d);
    const dsCt = vp ? db.congTrinh : db.congTrinh.filter((c) => !congTrinhDaXong(db, c.ma));
    sel.innerHTML = `${!vp ? '' : loai === 'CHI' ? `<option value="${CTY}">Chi chung công ty</option>` : '<option value="">Không gắn công trình</option>'}${dsCt.map((c) => `<option value="${esc(c.ma)}">${esc(c.ma)}${vp ? '' : ' · ' + esc(c.ten)}</option>`).join('')}`;
    const co = (m) => [...sel.options].some((o) => o.value === m);
    // Chưa chọn: chi thì lấy công trình đang làm đầu tiên (đổi được), thu thì không gắn.
    const macDinh = loai === 'CHI' ? ((dsCt.find((c) => !congTrinhDaXong(db, c.ma)) || {}).ma || (vp ? CTY : (dsCt[0] || {}).ma || '')) : '';
    sel.value = truoc && co(truoc) ? truoc : macDinh;
    veHM();
  };
  const veHM = () => {
    const ma = $('#ma', d).value;
    const ds = loai === 'THU' ? HM_THU : ma === CTY ? HM_CTY : HM_CHI;
    const hm = ds.includes($('#hm', d).value) ? $('#hm', d).value : ds.includes(e0.hangMuc) ? e0.hangMuc : ds[0];
    $('#hm', d).innerHTML = ds.map((h) => `<option ${h === hm ? 'selected' : ''}>${esc(h)}</option>`).join('');
    veDot();
  };
  // Chi thầu phụ → chọn đợt trả thầu; Chi vật tư → nợ nhà cung cấp; Thu phát sinh → phiếu phát sinh đã duyệt. Để tự trừ công nợ.
  const veDot = () => {
    const ma = $('#ma', d).value, hm = $('#hm', d).value;
    // Chi quảng cáo: ô Đối tượng là kênh, để tính chi phí trên mỗi khách theo nguồn.
    const mkt = hm === HM_MKT;
    $('#dtNhan', d).textContent = mkt ? 'Kênh quảng cáo (chọn đúng tên để tính chi phí trên mỗi khách)' : 'Đối tượng (thầu, nhà cung cấp, người nhận)';
    $('#dsDt', d).innerHTML = (mkt ? KENH_MKT : dsDoiTuong(db)).map((x) => `<option value="${esc(x)}">`).join('');
    const no = (lo) => dsTraThau(db, ma, lo).map((t) => [t.id, `${t.thau} · ${t.dot} · còn ${tienGon(trangThaiTra(db, t, homNay()).con)}`]);
    const ds = !vp || loai === 'CHUYEN' ? []
      : loai === 'CHI' && hm === 'Chi thầu phụ' ? no('THAU')
        : loai === 'CHI' && hm === 'Chi vật tư' ? no('NCC')
          : loai === 'THU' && hm === 'Thu phát sinh'
            ? psCuaCongTrinh(db, ma).filter((p) => p.trangThai === 'DUYET').map((p) => [p.id, `${p.ma} · ${p.moTa} · còn ${tienGon((Number(p.giaBan) || 0) - daThuPS(db, p))}`])
            : loai === 'CHI' && hm === HM_HH
              ? (db.khach || []).filter((k) => k.nguoiGioiThieu && (k.trangThai === 'KY' || hdCuaKhach(db, k.ma).length || k.ma === e0.thamChieu))
                .map((k) => [k.ma, `${k.ten} · giới thiệu: ${k.nguoiGioiThieu}${(k.hoaHong || {}).soTien ? ' · ' + tienGon(k.hoaHong.soTien) : ''}`])
            : loai === 'THU' && hm === 'Thu bảo hành'
              ? bhCuaCongTrinh(db, ma).filter((p) => p.coPhi).map((p) => [p.id, `${p.ma} · ${p.moTa} · còn ${tienGon(conThuBH(db, p))}`])
              : [];
    $('#dotBox', d).hidden = !ds.length;
    $('#dotNhan', d).textContent = hm === HM_HH ? 'Hoa hồng của khách nào' : loai === 'THU' ? (hm === 'Thu bảo hành' ? 'Thu phiếu bảo hành nào' : 'Thu phát sinh nào') : hm === 'Chi vật tư' ? 'Trả nợ nhà cung cấp nào' : 'Trả đợt nào';
    $('#dot', d).innerHTML = `<option value="">${loai === 'THU' ? 'Không theo phiếu' : hm === 'Chi vật tư' ? 'Không phải trả nợ (mua trả ngay)' : 'Không theo đợt'}</option>${ds.map(([id, ten]) => `<option value="${esc(id)}" ${id === e0.thamChieu ? 'selected' : ''}>${esc(ten)}</option>`).join('')}`;
  };
  const xemTien = () => { const n = docTien($('#st', d).value); $('#stChu', d).textContent = Number.isFinite(n) ? `= ${tien(n)}` : $('#st', d).value ? 'Chưa đọc được số tiền' : ''; };
  veLoai(true); xemTien();
  d.querySelectorAll('[data-loai]').forEach((b) => { b.onclick = () => { loai = b.dataset.loai; veLoai(); }; });
  $('#ma', d).onchange = veHM;
  $('#hm', d).onchange = veDot;
  $('#dot', d).onchange = () => {
    const khHH = $('#hm', d).value === HM_HH && (db.khach || []).find((k) => k.ma === $('#dot', d).value);
    if (khHH) {
      $('#dt', d).value = khHH.nguoiGioiThieu;
      const con = (Number((khHH.hoaHong || {}).soTien) || goiYHoaHong(db, khHH).soTien) - daTraHH(db, khHH.ma);
      if (!$('#st', d).value && con > 0) { $('#st', d).value = String(con); xemTien(); }
      if (!$('#nd', d).value) $('#nd', d).value = `Hoa hồng giới thiệu khách ${khHH.ten}`;
      return;
    }
    const ps = (db.phatSinh || []).find((x) => x.id === $('#dot', d).value);
    if (ps) {
      if (!$('#st', d).value) { $('#st', d).value = String((Number(ps.giaBan) || 0) - daThuPS(db, ps)); xemTien(); }
      if (!$('#nd', d).value) $('#nd', d).value = `${ps.ma} ${ps.moTa}`;
      return;
    }
    const t = dsTraThau(db).find((x) => x.id === $('#dot', d).value);
    if (!t) return;
    $('#dt', d).value = t.thau;
    if (!$('#st', d).value) { $('#st', d).value = String(trangThaiTra(db, t, homNay()).con); xemTien(); }
    if (!$('#nd', d).value) $('#nd', d).value = `${t.hangMuc} đợt ${t.dot}`.trim();
  };
  $('#st', d).oninput = xemTien;
  $('#noi', d).onclick = () => noiThanhChu($('#nd', d));
  $('#anh', d).onchange = () => { const n = $('#anh', d).files.length; $('#soAnh', d).textContent = n ? `${n} ảnh sẽ gửi lên Drive (thư mục "KAS App – Chứng từ")` : ''; };
  if (khoa) d.querySelectorAll('input, select, textarea, #noi').forEach((x) => { x.disabled = true; });
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  if (choKiemNay) $('#kiem', d).onclick = () => { duyetKhoan(db, cu); luu(); d.close(); bao('Đã kiểm'); route(); };
  if (!khoa) $('#ok', d).onclick = async () => {
    const soTien = docTien($('#st', d).value);
    if (!(soTien > 0)) return bao('Nhập số tiền, vd 12tr');
    if (!$('#ngay', d).value) return bao('Chọn ngày');
    const tk = $('#tk', d).value, tk2 = $('#tk2', d).value;
    if (loai === 'CHUYEN' && (!tk || !tk2 || tk === tk2)) return bao('Chọn 2 tài khoản khác nhau');
    if (!vp && !$('#ma', d).value) return bao('Chọn công trình');
    nhoTK(tk);
    const tt = loai === 'CHUYEN'
      ? { loai, ngay: $('#ngay', d).value, ma: CTY, hangMuc: 'Chuyển tiền', thamChieu: '', doiTuong: '', soTien, noiDung: $('#nd', d).value.trim(), hinhThuc: 'CK', taiKhoan: tk, toiTK: tk2 }
      : { loai, ngay: $('#ngay', d).value, ma: $('#ma', d).value, hangMuc: $('#hm', d).value, thamChieu: $('#dotBox', d).hidden ? '' : $('#dot', d).value,
        doiTuong: $('#dt', d).value.trim(), soTien, noiDung: $('#nd', d).value.trim(), hinhThuc: $('#ht', d).value, taiKhoan: tk, toiTK: '' };
    const hhCu = cu && cu.hangMuc === HM_HH ? cu.thamChieu : '';
    const e = cu ? (suaKhoan(db, cu, tt), cu) : ghiKhoan(db, tt, vaiTro);
    // Chi hoa hồng gắn khách: hoa hồng của khách tự chuyển "Đã trả" (Thầy chốt 19/11).
    [hhCu, e.hangMuc === HM_HH ? e.thamChieu : ''].filter((m, i, a) => /^KH-/.test(m) && a.indexOf(m) === i).forEach((m) => capNhatHoaHong(db, m, homNay()));
    const files = [...$('#anh', d).files];
    d.close();
    if (files.length) {
      if (!daKetNoi()) bao('Bản thử: ảnh chưa gửi lên Drive');
      else {
        try { await xepAnh(files, e.ma || CTY, e.id, 'CHUNG_TU'); suaKhoan(db, e, { soAnh: (Number(e.soAnh) || 0) + files.length }); } catch (err) { bao('Không đọc được ảnh: ' + err.message); }
      }
    }
    luu(); bao(cu ? 'Đã sửa' : loai === 'CHUYEN' ? `Đã chuyển ${tien(soTien)}` : `Đã ghi ${loai === 'THU' ? 'thu' : 'chi'} ${tien(soTien)}`); route();
  };
  let bamXoa = false;
  if (cu && !khoa) $('#xoa', d).onclick = () => {
    if (!bamXoa) { bamXoa = true; $('#xoa', d).textContent = 'Bấm lần nữa để xoá'; return; }
    xoaKhoan(db, cu, vaiTro);
    if (cu.hangMuc === HM_HH && /^KH-/.test(cu.thamChieu)) capNhatHoaHong(db, cu.thamChieu, homNay());
    luu(); d.close(); bao('Đã xoá'); route();
  };
}

// ---------- Trả thầu ----------
let locMaTT = '';
function theDotTra(t, hn, coTien) {
  if (loaiNo(t) === 'NCC') return coTien ? theNoNCC(t, hn) : '';
  const ct = db.congTrinh.find((c) => c.ma === t.maCongTrinh);
  const v = t.viecMoc && ct ? ct.viec.find((x) => x.id === t.viecMoc) : null;
  const r = coTien ? trangThaiTra(db, t, hn) : null;
  const tag = t.klXacNhan ? (r && r.tt === 'DU' ? ['XONG', 'Đã trả đủ'] : coTien ? ['TRE', 'Đến hạn trả'] : ['XONG', 'Đã xác nhận']) : r && r.tt === 'QUA' ? ['TRE', 'Quá hạn, chưa nghiệm thu'] : ['SAP', 'Chưa nghiệm thu KL'];
  return `<div class="card">
    <div class="row"><span class="name">${esc(t.thau || 'Chưa ghi thầu')} · ${esc(t.dot)}</span><span class="tag ${tag[0]}">${tag[1]}</span></div>
    <div class="muted">${esc(t.hangMuc)}${t.dieuKien ? ' · Điều kiện: ' + esc(t.dieuKien) : ''}${v ? ` · việc ${esc(v.hangMuc)} ${v.phanTram >= 100 ? 'đã xong' : v.phanTram + '%'}` : ''}${t.hanTra ? ' · hạn ' + ddmm(t.hanTra) : ''}</div>
    ${t.klXacNhan ? `<div class="muted">✓ ${esc(tenNguoi(t.klXacNhan.nguoi))} xác nhận KL ${ddmm(t.klXacNhan.ngay)}${t.klXacNhan.ghiChu ? ': ' + esc(t.klXacNhan.ghiChu) : ''}</div>` : ''}
    ${r ? `<div>Đợt ${tien(t.soTien)} · đã trả ${tien(r.tra)}${r.con > 0 ? ` · còn <b>${tien(r.con)}</b>` : ''}</div>` : ''}
    <div class="actions">${!t.klXacNhan ? `<button data-kl="${esc(t.id)}">Xác nhận khối lượng</button>` : ''}${r && r.con > 0 ? `<button data-tra="${esc(t.id)}" ${t.klXacNhan ? 'class="btn-chinh"' : ''}>Ghi trả</button>` : ''}${coTien ? `<button data-sua-tt="${esc(t.id)}">Sửa</button>` : ''}</div>
  </div>`;
}

// Nợ nhà cung cấp (mua chịu): không cần nghiệm thu, đến hạn theo ngày hẹn trả.
function theNoNCC(t, hn) {
  const r = trangThaiTra(db, t, hn);
  const tag = { DU: ['XONG', 'Đã trả đủ'], QUA_HAN: ['TRE', `Quá hạn ${diffDays(t.hanTra, hn)} ngày`], DEN_HAN: ['SAP', 'Đến hạn trả'], CHUA_DEN: ['DANG', 'Hạn ' + ddmm(t.hanTra)] }[r.tt];
  return `<div class="card">
    <div class="row"><span class="name">${esc(t.thau || 'Chưa ghi tên')} · ${esc(t.dot)}</span><span class="tag ${tag[0]}">${tag[1]}</span></div>
    <div class="muted">${esc(t.maCongTrinh)}${t.hangMuc ? ' · ' + esc(t.hangMuc) : ''}${t.hanTra ? ' · hẹn trả ' + ddmm(t.hanTra) : ' · chưa hẹn ngày trả'}${t.ghiChu ? ' · ' + esc(t.ghiChu) : ''}</div>
    <div>Nợ ${tien(t.soTien)} · đã trả ${tien(r.tra)}${r.con > 0 ? ` · còn <b>${tien(r.con)}</b>` : ''}</div>
    <div class="actions">${r.con > 0 ? `<button data-tra="${esc(t.id)}" ${r.tt !== 'CHUA_DEN' ? 'class="btn-chinh"' : ''}>Ghi trả</button>` : ''}<button data-sua-tt="${esc(t.id)}">Sửa</button></div>
  </div>`;
}

function ganNutTraThau(el) {
  const tim = (id) => dsTraThau(db).find((t) => t.id === id);
  el.querySelectorAll('[data-kl]').forEach((b) => { b.onclick = () => moXacNhanKL(tim(b.dataset.kl)); });
  el.querySelectorAll('[data-tra]').forEach((b) => {
    b.onclick = () => {
      const t = tim(b.dataset.tra);
      const ncc = loaiNo(t) === 'NCC';
      if (!ncc && !t.klXacNhan) bao('Lưu ý: đợt này chưa xác nhận khối lượng');
      moGhiKhoan({ loai: 'CHI', ma: t.maCongTrinh, hangMuc: ncc ? 'Chi vật tư' : 'Chi thầu phụ', thamChieu: t.id, doiTuong: t.thau, soTien: trangThaiTra(db, t, homNay()).con, noiDung: `${t.hangMuc} đợt ${t.dot}`.trim() });
    };
  });
  el.querySelectorAll('[data-sua-tt]').forEach((b) => { const t = tim(b.dataset.suaTt); b.onclick = () => moDotTra(t.maCongTrinh, t); });
}

function manTraThau() {
  datTab('hop-dong', 'Trả thầu');
  const hn = homNay();
  const no = congNoThau(db, hn);
  const ds = dsTraThau(db, locMaTT, 'THAU');
  const theoCt = [...new Set(ds.map((t) => t.maCongTrinh))];
  $('#view').innerHTML = `${dauTien('tra-thau')}
    <div class="so-lieu"><div><span>Đến hạn trả</span><b class="${no.denHan ? 'tre' : ''}">${tienGon(no.denHan)}</b></div><div><span>Còn phải trả</span><b>${tienGon(no.conPhaiTra)}</b></div>
      <div><span>Chờ xác nhận KL</span><b>${canXacNhanKL(db, hn).length}</b></div></div>
    <p class="muted">Đợt trả thầu theo khối lượng. Giám sát bấm "Xác nhận khối lượng" (không thấy tiền), văn phòng thấy đến hạn trả rồi bấm "Ghi trả". Nợ nhà cung cấp vật tư xem ở <a href="#cong-no">Công nợ</a>.</p>
    <div class="actions"><button id="themTT" class="btn-chinh">+ Thêm đợt trả thầu</button></div>
    <div class="loc-tc"><span class="muted">Công trình</span><select id="locMa"><option value="">Tất cả</option>${db.congTrinh.map((c) => `<option value="${esc(c.ma)}" ${c.ma === locMaTT ? 'selected' : ''}>${esc(c.ma)}</option>`).join('')}</select></div>
    ${theoCt.map((ma) => `<div class="dau-ct"><h3>${esc(ma)}</h3><a class="nho" href="#ct-${esc(ma)}">Công trình</a></div>${ds.filter((t) => t.maCongTrinh === ma).map((t) => theDotTra(t, hn, true)).join('')}`).join('')
      || '<p class="muted">Chưa có đợt trả thầu nào.</p>'}`;
  $('#locMa').onchange = () => { locMaTT = $('#locMa').value; manTraThau(); };
  $('#themTT').onclick = () => moDotTra(locMaTT || (db.congTrinh[0] && db.congTrinh[0].ma) || '');
  ganNutTraThau($('#view'));
}

// ---------- Công nợ gộp: khách còn nợ, phải trả thầu, nợ nhà cung cấp ----------
function manCongNo() {
  datTab('hop-dong', 'Công nợ');
  const hn = homNay();
  const kh = congNoKhach(db, hn);
  const thau = noTheoDoiTuong(db, hn, 'THAU');
  const ncc = noTheoDoiTuong(db, hn, 'NCC');
  const nt = congNoThau(db, hn), nn = congNoThau(db, hn, 'NCC');
  const tagKh = (x) => (x.tt === 'QUA_HAN' ? `<span class="tag TRE">Quá hạn ${x.soNgayQua} ngày</span>`
    : x.tt === 'DEN_HAN' ? '<span class="tag SAP">Đến hạn</span>'
      : `<span class="tag DANG">${x.ngayDen ? (x.duKien ? 'Dự kiến ' : 'Hạn ') + ddmm(x.ngayDen) : 'Chưa có ngày'}</span>`);
  const nhomNo = (x, loai) => `<div class="card">
      <div class="row"><span class="name">${esc(x.ten)}</span><b>${tienGon(x.con)}</b></div>
      <div class="muted">Tổng ${tien(x.tong)} · đã trả ${tien(x.tra)}${x.denHan ? ` · <span class="${x.quaHan ? 'tre' : ''}">đến hạn ${tien(x.denHan)}${x.quaHan ? `, quá hạn ${tien(x.quaHan)}` : ''}</span>` : ''}</div>
      <details><summary>${x.ds.filter((r) => r.con > 0).length} ${loai === 'NCC' ? 'khoản nợ' : 'đợt'} còn phải trả</summary>${x.ds.filter((r) => r.con > 0).map((r) => theDotTra(r.t, hn, true)).join('')}</details>
      <div class="actions"><button data-doi-chieu="${esc(loai)}|${esc(x.ten)}">Gửi đối chiếu Zalo</button></div>
    </div>`;
  $('#view').innerHTML = `${dauTien('cong-no')}
    <h3>Khách còn nợ</h3>
    <div class="so-lieu"><div><span>Quá hạn</span><b class="${kh.quaHan ? 'tre' : ''}">${tienGon(kh.quaHan)}</b></div><div><span>Đến hạn</span><b>${tienGon(kh.denHan)}</b></div><div><span>Chưa đến hạn</span><b>${tienGon(kh.chuaDen)}</b></div></div>
    ${kh.ds.map((x, i) => `<div class="card">
      <div class="row"><span class="name">${esc(x.hd.tenHD || x.hd.soHD)} · đợt ${x.d.so}</span>${tagKh(x)}</div>
      <div class="muted">${esc(x.hd.soHD)} · ${esc(x.d.ten)}${x.d.daThu ? ` · đã trả ${tien(x.d.daThu)}` : ''}</div>
      <div>Còn <b>${tien(x.con)}</b></div>
      <div class="actions"><button data-nhac="${i}">Nhắc Zalo</button><button data-thu-no="${i}" ${x.tt !== 'CHUA' ? 'class="btn-chinh"' : ''}>Ghi thu</button><a class="btn" href="#${esc(x.hd.ma)}" style="text-align:center">Hợp đồng</a></div>
    </div>`).join('') || '<p class="muted">Không có khách nào còn nợ.</p>'}
    <h3>Phải trả thầu</h3>
    <div class="so-lieu"><a href="#tra-thau"><span>Đến hạn trả</span><b class="${nt.denHan ? 'tre' : ''}">${tienGon(nt.denHan)}</b></a><a href="#tra-thau"><span>Còn phải trả</span><b>${tienGon(nt.conPhaiTra)}</b></a></div>
    ${thau.map((x) => nhomNo(x, 'THAU')).join('') || '<p class="muted">Không còn nợ thầu.</p>'}
    <div class="dau-ct"><h3>Nợ nhà cung cấp</h3><button id="themNCC" class="nho">+ Ghi nợ</button></div>
    <div class="so-lieu"><div><span>Đến hạn / quá hạn</span><b class="${nn.denHan ? 'tre' : ''}">${tienGon(nn.denHan)}</b></div><div><span>Còn phải trả</span><b>${tienGon(nn.conPhaiTra)}</b></div></div>
    ${ncc.map((x) => nhomNo(x, 'NCC')).join('') || '<p class="muted">Không còn nợ nhà cung cấp. Mua chịu vật tư thì bấm "+ Ghi nợ", trả tiền thì bấm "Ghi trả".</p>'}`;
  const v = $('#view');
  v.querySelectorAll('[data-nhac]').forEach((b) => { const x = kh.ds[+b.dataset.nhac]; b.onclick = () => chiaSe(tinDeNghiTT(x.hd, x.d)); });
  v.querySelectorAll('[data-thu-no]').forEach((b) => { const x = kh.ds[+b.dataset.thuNo]; b.onclick = () => moGhiThu(x.hd, x.d, () => manCongNo()); });
  v.querySelectorAll('[data-doi-chieu]').forEach((b) => {
    b.onclick = () => {
      const [loai, ten] = b.dataset.doiChieu.split('|');
      const x = (loai === 'NCC' ? ncc : thau).find((g) => g.ten === ten);
      chiaSe(`KAS Houzing gửi ${ten} đối chiếu công nợ ngày ${fmtNgay(hn)}:\n${x.ds.map((r) => `- ${r.t.maCongTrinh} · ${r.t.hangMuc || ''} ${r.t.dot}: ${tien(r.t.soTien)}, đã trả ${tien(r.tra)}, còn ${tien(Math.max(0, r.con))}`).join('\n')}\nTổng còn phải trả: ${tien(x.con)}.\nAnh/chị kiểm tra giúp, có sai lệch thì báo lại KAS. Cảm ơn anh/chị.`);
    };
  });
  $('#themNCC').onclick = () => moDotTra((db.congTrinh.find((c) => !congTrinhDaXong(db, c.ma)) || {}).ma || '', null, 'NCC');
  ganNutTraThau(v);
}

// ---------- Dự báo dòng tiền theo tuần ----------
let soTuanDT = 8;
let tinhCtyDT = true;
function manDongTien() {
  datTab('hop-dong', 'Dòng tiền');
  const hn = homNay();
  const r = dongTien(db, hn, { soTuan: soTuanDT, tinhChiCty: tinhCtyDT });
  const thap = r.tuan.reduce((m, w) => (w.cuoi < m.cuoi ? w : m), r.tuan[0]);
  const am = (n) => `${n < 0 ? '−' : ''}${tienGon(Math.abs(n))}`;
  const dong = (x, vao) => (vao
    ? `<div class="muted">+ ${tienGon(x.con)} · ${esc(x.hd.tenHD || x.hd.soHD)} đợt ${x.d.so}${x.tt === 'QUA_HAN' ? ` <span class="tre">(quá hạn ${x.soNgayQua} ngày)</span>` : x.duKien ? ` (dự kiến ${ddmm(x.ngayDen)})` : ` (${ddmm(x.ngayDen)})`}</div>`
    : `<div class="muted">− ${tienGon(x.con)} · ${esc(x.t.thau)} ${esc(x.t.dot)}${loaiNo(x.t) === 'NCC' ? ' (nhà cung cấp)' : ''} · ${x.ngay < hn ? '<span class="tre">quá hạn</span>' : ddmm(x.ngay)}</div>`);
  $('#view').innerHTML = `${dauTien('dong-tien')}
    <div class="so-lieu"><div><span>Tiền đang có</span><b>${am(r.soDuDau)}</b></div><div><span>Thấp nhất (tuần ${ddmm(thap.tu)})</span><b class="${thap.cuoi < 0 ? 'tre' : ''}">${am(thap.cuoi)}</b></div>
      <div><span>Cuối tuần thứ ${soTuanDT}</span><b>${am(r.tuan[r.tuan.length - 1].cuoi)}</b></div></div>
    ${r.tuanAm ? `<p class="note"><b class="tre">Tuần ${ddmm(r.tuanAm.tu)}–${ddmm(r.tuanAm.den)} dự kiến thiếu tiền (${am(r.tuanAm.cuoi)}).</b> Đốc thu khách sớm hoặc lùi hẹn trả thầu, nhà cung cấp.</p>` : ''}
    ${r.coTaiKhoan ? '' : '<p class="note">Chưa khai tài khoản nên tiền đang có = 0. Vào <a href="#tai-khoan">Tài khoản</a> nhập số dư để dự báo đúng.</p>'}
    <div class="loc">${[4, 8].map((n) => `<button data-tuan="${n}" class="${n === soTuanDT ? 'on' : ''}">${n} tuần</button>`).join('')}
      <button id="boCty" class="${tinhCtyDT ? 'on' : ''}">Chi công ty ~${tienGon(r.chiCtyTuan)}/tuần</button></div>
    ${r.tuan.map((w, i) => `<details class="card" ${i === 0 ? 'open' : ''}>
      <summary class="row"><span class="name">${ddmm(w.tu)}–${ddmm(w.den)}</span><span><span class="tien-thu">+${tienGon(w.vao)}</span> <span class="tien-chi">−${tienGon(w.ra + w.chiCty)}</span> → <b class="${w.cuoi < 0 ? 'tre' : ''}">${am(w.cuoi)}</b></span></summary>
      ${w.dsVao.map((x) => dong(x, true)).join('')}${w.dsRa.map((x) => dong(x, false)).join('')}
      ${w.chiCty ? `<div class="muted">− ${tienGon(w.chiCty)} · chi chung công ty (ước, trung bình 3 tháng)</div>` : ''}
      ${!w.dsVao.length && !w.dsRa.length && !w.chiCty ? '<div class="muted">Không có khoản nào.</div>' : ''}
    </details>`).join('')}
    ${r.khongNgayVao.length || r.khongNgayRa.length ? `<h3>Chưa có ngày, chưa tính vào tuần nào</h3>
      ${r.khongNgayVao.map((x) => dong({ ...x, ngayDen: '', duKien: false }, true).replace(' ()', '')).join('')}
      ${r.khongNgayRa.map((x) => `<div class="muted">− ${tienGon(x.con)} · ${esc(x.t.thau)} ${esc(x.t.dot)} · chưa hẹn ngày trả</div>`).join('')}
      <p class="muted">Ghi hạn ở đợt thu hợp đồng, hạn trả ở đợt thầu / nợ nhà cung cấp để dự báo đủ.</p>` : ''}
    <p class="muted">Tiền vào: đợt thu khách còn nợ, theo hạn đợt hoặc ngày xong mốc (dự báo theo kế hoạch). Tiền ra: đợt trả thầu, nợ nhà cung cấp theo hạn trả hoặc ngày xong việc mốc. Khoản quá hạn tính vào tuần này. Chưa gồm phát sinh và chi lẻ chưa có kế hoạch.</p>`;
  $('#view').querySelectorAll('[data-tuan]').forEach((b) => { b.onclick = () => { soTuanDT = +b.dataset.tuan; manDongTien(); }; });
  $('#boCty').onclick = () => { tinhCtyDT = !tinhCtyDT; manDongTien(); };
}

// ---------- Tài khoản tiền: số dư từng tài khoản ----------
function manTaiKhoan() {
  datTab('hop-dong', 'Tài khoản');
  const sd = soDu(db);
  $('#view').innerHTML = `${dauTien('tai-khoan')}
    <div class="so-lieu"><div><span>Tổng tiền</span><b>${sd.tong < 0 ? '−' : ''}${tienGon(Math.abs(sd.tong))}</b></div><div><span>TK công ty</span><b>${tienGon(sd.congTy)}</b></div><div><span>TK tiền mặt</span><b>${tienGon(sd.tienMat)}</b></div></div>
    ${sd.soChuaGan ? `<p class="note">${sd.soChuaGan} khoản thu chi chưa gắn tài khoản (${sd.chuaGan < 0 ? '−' : '+'}${tienGon(Math.abs(sd.chuaGan))}), chưa tính vào số dư nào. <a href="#thu-chi&tk=CHUA">Mở để gắn</a></p>` : ''}
    <div class="actions"><button id="themTk" class="btn-chinh">+ Thêm tài khoản</button><button id="chuyen">⇄ Chuyển tiền</button></div>
    ${Object.entries(LOAI_TK).map(([k, ten]) => {
      const ds = sd.ds.filter((r) => r.q.loai === k);
      return `<h3>${ten}</h3>${ds.map(({ q, soDu: so, vao, ra }) => `<div class="card">
        <div class="row"><span class="name">${esc(q.ten)}${q.hoatDong === false ? ' <span class="tag CHO">Ngừng dùng</span>' : ''}</span><b class="${so < 0 ? 'tre' : ''}">${so < 0 ? '−' : ''}${tien(Math.abs(so))}</b></div>
        <div class="muted">${q.nguoiGiu ? 'Người giữ: ' + esc(q.nguoiGiu) + ' · ' : ''}Đầu ${tienGon(q.soDuDau)}${q.ngayDau ? ' ngày ' + ddmm(q.ngayDau) : ''} · vào ${tienGon(vao)} · ra ${tienGon(ra)}${q.choGiamSat ? ' · giám sát dùng được' : ''}</div>
        <div class="actions"><a class="btn" href="#thu-chi&tk=${esc(q.id)}" style="text-align:center">Sổ</a><button data-sua-tk="${esc(q.id)}">Sửa</button></div>
      </div>`).join('') || `<p class="muted">Chưa có ${ten.toLowerCase()}.</p>`}`;
    }).join('')}
    <p class="muted">Số dư đầu = tiền thực có trong tài khoản ở ngày bắt đầu theo dõi; app cộng trừ các khoản thu, chi, chuyển tiền từ ngày đó. Lệch với ngân hàng thì sửa số dư đầu hoặc ghi khoản còn thiếu. Tạm ứng cho giám sát = chuyển tiền từ tài khoản công ty sang tài khoản tiền mặt giám sát giữ.</p>`;
  $('#themTk').onclick = () => moTaiKhoan();
  $('#chuyen').onclick = () => moGhiKhoan({ loai: 'CHUYEN' });
  $('#view').querySelectorAll('[data-sua-tk]').forEach((b) => { b.onclick = () => moTaiKhoan((db.taiKhoan || []).find((q) => q.id === b.dataset.suaTk)); });
}

function moTaiKhoan(cu) {
  const d = $('#sheet');
  if (d.open) d.close();
  const q0 = cu || { ten: '', loai: 'CONG_TY', nguoiGiu: '', soDuDau: '', ngayDau: homNay(), ghiChu: '', choGiamSat: false, hoatDong: true };
  d.innerHTML = `<h2>${cu ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h2>
    <label class="f">Tên tài khoản</label><input id="ten" value="${esc(q0.ten)}" placeholder="Vd: MB công ty, VCB Thầy, Tiền mặt Kha giữ">
    <label class="f">Loại</label><div class="grid-btn hai">${Object.entries(LOAI_TK).map(([k, t]) => `<button data-loai-tk="${k}" class="${k === q0.loai ? 'on' : ''}">${t}</button>`).join('')}</div>
    <label class="f">Người giữ</label><input id="giu" value="${esc(q0.nguoiGiu)}" placeholder="Vd: Thầy, Kha">
    <div class="hai-cot">
      <div><label class="f">Số dư đầu</label><input id="sd" inputmode="decimal" value="${q0.soDuDau !== '' ? esc(q0.soDuDau) : ''}" placeholder="Vd: 150tr"></div>
      <div><label class="f">Tại ngày</label><input id="nd" type="date" value="${esc(q0.ngayDau)}"></div>
    </div>
    <p id="sdChu" class="muted"></p>
    <label class="f">Ghi chú (số tài khoản, ngân hàng…)</label><input id="gc" value="${esc(q0.ghiChu)}">
    <label class="cham-dong"><input id="gs" type="checkbox" ${q0.choGiamSat ? 'checked' : ''}><span>Giám sát được chọn tài khoản này khi ghi chi (chỉ thấy tên, không thấy số dư)</span></label>
    ${cu ? `<label class="cham-dong"><input id="ngung" type="checkbox" ${q0.hoatDong === false ? 'checked' : ''}><span>Ngừng dùng (vẫn giữ lịch sử)</span></label>` : ''}
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  let loai = q0.loai;
  d.querySelectorAll('[data-loai-tk]').forEach((b) => { b.onclick = () => { loai = b.dataset.loaiTk; d.querySelectorAll('[data-loai-tk]').forEach((x) => x.classList.toggle('on', x === b)); }; });
  const xem = () => { const v = $('#sd', d).value.trim(); const n = v.startsWith('-') ? -docTien(v.slice(1)) : docTien(v); $('#sdChu', d).textContent = v && Number.isFinite(n) ? `= ${tien(n)}` : v ? 'Chưa đọc được số tiền' : ''; return v ? n : 0; };
  $('#sd', d).oninput = xem; xem();
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const ten = $('#ten', d).value.trim();
    if (!ten) return bao('Nhập tên tài khoản');
    const soDuDau = xem();
    if (!Number.isFinite(soDuDau)) return bao('Số dư đầu chưa đọc được');
    const tt = { ten, loai, nguoiGiu: $('#giu', d).value.trim(), soDuDau, ngayDau: $('#nd', d).value, ghiChu: $('#gc', d).value.trim(), choGiamSat: $('#gs', d).checked };
    if (cu) suaTaiKhoan(db, cu, { ...tt, hoatDong: !$('#ngung', d).checked }); else themTaiKhoan(db, tt);
    luu(); d.close(); bao('Đã lưu tài khoản'); route();
  };
}

// Hôm nay (văn phòng): nợ nhà cung cấp đến hạn, khoản giám sát ghi chờ kiểm.
function noHomNay(hn) {
  const nn = congNoThau(db, hn, 'NCC');
  const kiem = choKiem(db);
  if (!nn.ds.length && !kiem.length) return '';
  return `<h3>Nhà cung cấp, chi công trường</h3>
    ${nn.ds.map(({ t, con, tt }) => `<button class="card" data-tra="${esc(t.id)}"><div class="row"><span class="name">Trả ${esc(t.thau)} · ${esc(t.dot)}</span><b>${tienGon(con)}</b></div>
      <div class="muted">${esc(t.maCongTrinh)} · ${tt === 'QUA_HAN' ? `<span class="tre">quá hạn ${diffDays(t.hanTra, hn)} ngày</span>` : t.hanTra ? 'hạn ' + ddmm(t.hanTra) : 'chưa hẹn ngày'}</div></button>`).join('')}
    ${kiem.length ? `<a class="card" href="#thu-chi"><div class="row"><span class="name">${kiem.length} khoản giám sát ghi chờ kiểm</span><b>${tienGon(kiem.reduce((s, e) => s + e.soTien, 0))}</b></div></a>` : ''}`;
}

// `loai` = 'NCC': nợ nhà cung cấp vật tư (mua chịu): không gắn việc mốc, không cần giám sát xác nhận.
function moDotTra(maCt, cu, loai = 'THAU') {
  const d = $('#sheet');
  if (d.open) d.close();
  if (!db.congTrinh.length) return bao('Chưa có công trình');
  const ncc = cu ? loaiNo(cu) === 'NCC' : loai === 'NCC';
  const t0 = cu || { maCongTrinh: maCt || db.congTrinh[0].ma, thau: '', hangMuc: '', dot: '', soTien: '', dieuKien: '', viecMoc: '', hanTra: '', ghiChu: '' };
  let suaMa = !!cu;
  d.innerHTML = `<h2>${ncc ? (cu ? 'Sửa nợ nhà cung cấp' : 'Ghi nợ nhà cung cấp (mua chịu)') : cu ? 'Sửa đợt trả thầu' : 'Thêm đợt trả thầu'}</h2>
    <label class="f">Công trình</label><select id="ct">${db.congTrinh.map((c) => `<option value="${esc(c.ma)}" ${c.ma === t0.maCongTrinh ? 'selected' : ''}>${esc(c.ma)} · ${esc(c.ten)}</option>`).join('')}</select>
    <label class="f">${ncc ? 'Nhà cung cấp' : 'Thầu / nhà cung cấp'}</label><input id="thau" list="dsThau4" value="${esc(t0.thau)}"><datalist id="dsThau4">${dsDoiTuong(db).map((x) => `<option value="${esc(x)}">`).join('')}</datalist>
    <div class="hai-cot">
      <div><label class="f">${ncc ? 'Vật tư' : 'Hạng mục khoán'}</label><input id="hm" value="${esc(t0.hangMuc)}" placeholder="${ncc ? 'Vd: Gạch ốp lát' : 'Vd: Điện nước'}"></div>
      <div><label class="f">${ncc ? 'Mã / số hoá đơn' : 'Mã đợt'}</label><input id="dot" value="${esc(t0.dot)}" placeholder="${ncc ? 'GOL1' : 'DN1'}"></div>
    </div>
    <label class="f">${ncc ? 'Số tiền còn nợ' : 'Số tiền đợt'}</label><input id="st" inputmode="decimal" value="${t0.soTien ? esc(t0.soTien) : ''}" placeholder="Vd: 12tr"><p id="stChu" class="muted"></p>
    <div ${ncc ? 'hidden' : ''}><label class="f">Xong việc nào thì nhắc giám sát xác nhận (không bắt buộc)</label><select id="moc"></select>
    <label class="f">Điều kiện trả (giám sát đọc để xác nhận)</label><input id="dk" value="${esc(t0.dieuKien)}" placeholder="Vd: Đi ống xong toàn nhà"></div>
    <label class="f">${ncc ? 'Hẹn trả ngày' : 'Hạn trả dự kiến'}</label><input id="han" type="date" value="${esc(t0.hanTra)}">
    ${ncc ? `<label class="f">Ghi chú (giám sát không thấy)</label><input id="gc" value="${esc(t0.ghiChu || '')}" placeholder="Vd: lấy hàng 3 lần, chiết khấu 5%">` : ''}
    <div class="actions">${cu ? `<button id="xoa" class="btn-do">${ncc ? 'Xoá' : 'Xoá đợt'}</button>` : ''}<button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  const veMoc = () => {
    const ct = db.congTrinh.find((c) => c.ma === $('#ct', d).value);
    $('#moc', d).innerHTML = `<option value="">Không gắn việc</option>${ct.viec.map((v, i) => `<option value="${esc(v.id)}" ${v.id === t0.viecMoc ? 'selected' : ''}>${i + 1}. ${esc(v.hangMuc)}${v.nhaThau ? ' · ' + esc(v.nhaThau) : ''}</option>`).join('')}`;
  };
  const goiY = () => { if (!suaMa) $('#dot', d).value = $('#hm', d).value.trim() ? goiYMaDot(db, $('#ct', d).value, $('#hm', d).value) : ''; };
  const xemTien = () => { const n = docTien($('#st', d).value); $('#stChu', d).textContent = Number.isFinite(n) ? `= ${tien(n)}` : ''; };
  veMoc(); xemTien();
  $('#ct', d).onchange = () => { veMoc(); goiY(); };
  $('#hm', d).oninput = goiY;
  $('#dot', d).oninput = () => { suaMa = true; };
  $('#st', d).oninput = xemTien;
  $('#moc', d).onchange = () => {
    const ct = db.congTrinh.find((c) => c.ma === $('#ct', d).value);
    const v = ct.viec.find((x) => x.id === $('#moc', d).value);
    if (!v) return;
    if (!$('#dk', d).value) $('#dk', d).value = 'Xong ' + v.hangMuc.toLowerCase();
    if (!$('#thau', d).value && v.nhaThau) $('#thau', d).value = v.nhaThau;
    if (!$('#han', d).value) $('#han', d).value = lichHienTai(ct).get(v.id).ketThuc;
  };
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const soTien = docTien($('#st', d).value);
    if (!$('#thau', d).value.trim()) return bao(ncc ? 'Nhập tên nhà cung cấp' : 'Nhập tên thầu');
    if (!(soTien > 0)) return bao('Nhập số tiền, vd 12tr');
    const tt = { maCongTrinh: $('#ct', d).value, thau: $('#thau', d).value.trim(), hangMuc: $('#hm', d).value.trim(), dot: $('#dot', d).value.trim() || goiYMaDot(db, $('#ct', d).value, $('#hm', d).value),
      soTien, dieuKien: ncc ? '' : $('#dk', d).value.trim(), viecMoc: ncc ? '' : $('#moc', d).value, hanTra: $('#han', d).value, loaiNo: ncc ? 'NCC' : '' };
    if (ncc) tt.ghiChu = $('#gc', d).value.trim();
    if (cu) suaDotTra(db, cu, tt); else themDotTra(db, tt, vaiTro);
    luu(); d.close(); bao(ncc ? 'Đã lưu nợ ' + tt.thau : 'Đã lưu đợt ' + tt.dot); route();
  };
  let bamXoa = false;
  if (cu) $('#xoa', d).onclick = () => {
    if (daTra(db, cu.id) > 0) return bao('Đợt đã có tiền trả, xoá các khoản chi trước');
    if (!bamXoa) { bamXoa = true; $('#xoa', d).textContent = 'Bấm lần nữa để xoá'; return; }
    xoaDotTra(db, cu); luu(); d.close(); bao('Đã xoá đợt'); route();
  };
}

// Giám sát hoặc văn phòng xác nhận thầu làm đủ khối lượng. Màn này không có tiền.
function moXacNhanKL(t) {
  const d = $('#sheet');
  if (d.open) d.close();
  const ct = db.congTrinh.find((c) => c.ma === t.maCongTrinh);
  d.innerHTML = `<h2>Xác nhận khối lượng</h2>
    <p><b>${esc(t.thau)}</b> · ${esc(t.hangMuc)} · đợt ${esc(t.dot)}<br><span class="muted">${esc(ct ? ct.ten : t.maCongTrinh)}</span></p>
    ${t.dieuKien ? `<p class="note">Điều kiện: ${esc(t.dieuKien)}</p>` : ''}
    <label class="f">Ngày xác nhận</label><input id="ngay" type="date" value="${homNay()}">
    <label class="f">Ghi chú (thiếu gì, sửa gì)</label><div class="mic"><textarea id="gc" placeholder="Vd: đủ, đã thử áp lực"></textarea><button id="noi">🎤</button></div>
    <label class="btn" style="display:block;text-align:center;margin-top:12px">📷 Ảnh nghiệm thu<input id="anh" type="file" accept="image/*" capture="environment" multiple hidden></label>
    <p class="muted">Bấm xác nhận nghĩa là thầu đã làm đủ khối lượng của đợt này. Văn phòng sẽ thấy đến hạn trả tiền.</p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Xác nhận đã làm đủ</button></div>`;
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = async () => {
    xacNhanKL(db, t, { ngay: $('#ngay', d).value || homNay(), ghiChu: $('#gc', d).value.trim() }, vaiTro);
    const files = [...$('#anh', d).files];
    d.close();
    if (files.length && daKetNoi()) { try { await xepAnh(files, t.maCongTrinh, t.viecMoc || 'KL-' + t.dot); } catch (err) { bao('Không đọc được ảnh: ' + err.message); } }
    luu(); bao('Đã xác nhận khối lượng'); route();
  };
}

// Khối trên trang công trình: văn phòng thấy lãi gộp + đợt trả thầu; giám sát chỉ thấy đợt cần xác nhận KL.
function khoiTienCongTrinh(ct) {
  const hn = homNay();
  const ds = dsTraThau(db, ct.ma, laVanPhong() ? '' : 'THAU');
  if (!laVanPhong()) {
    // Giám sát: ghi chi ở công trình, xem lại khoản mình ghi (không có tổng tiền).
    const cua = soConLai(db).filter((e) => e.ma === ct.ma && e.loai === 'CHI' && e.nguoi === vaiTro).sort((a, b) => (b.ngay + b.taoLuc).localeCompare(a.ngay + a.taoLuc)).slice(0, 15);
    return `${ds.length ? `<h3>Khối lượng thầu</h3>${ds.map((t) => theDotTra(t, hn, false)).join('')}` : ''}
      <h3>Chi ở công trình</h3><div class="actions"><button id="ctGhiChi" class="btn-chinh">− Ghi chi</button></div>
      ${cua.length ? `<p class="muted">Khoản đã ghi (sửa được khi văn phòng chưa kiểm):</p>${cua.map(theKhoan).join('')}` : '<p class="muted">Mua lặt vặt, trả công nhật… bấm Ghi chi, chụp hoá đơn kèm theo.</p>'}`;
  }
  const lg = laiGop(db, ct.ma, laiToiThieu(), nguongPS());
  return `<h3>Thu chi</h3>${khoiLaiGop(lg)}
    ${ds.map((t) => theDotTra(t, hn, true)).join('')}
    <div class="actions"><button id="ctGhiChi">− Ghi chi</button><button id="ctThemTT">+ Đợt trả thầu</button><button id="ctNoNCC">+ Nợ nhà cung cấp</button><a class="btn" href="#thu-chi&ma=${esc(ct.ma)}" style="text-align:center">Sổ thu chi</a></div>`;
}

function ganNutTienCongTrinh(ct) {
  ganNutTraThau($('#view'));
  $('#view').querySelectorAll('[data-tc]').forEach((b) => { b.onclick = () => moGhiKhoan(null, (db.thuChi || []).find((e) => e.id === b.dataset.tc)); });
  const a = $('#ctGhiChi'), b = $('#ctThemTT');
  if (a) a.onclick = () => moGhiKhoan({ loai: 'CHI', ma: ct.ma });
  if (b) b.onclick = () => moDotTra(ct.ma);
  const c = $('#ctNoNCC');
  if (c) c.onclick = () => moDotTra(ct.ma, null, 'NCC');
}

function thauHomNay(hn) {
  const kl = canXacNhanKL(db, hn);
  const no = laVanPhong() ? congNoThau(db, hn) : { ds: [] };
  if (!kl.length && !no.ds.length) return '';
  return `<h3>Thầu, khối lượng</h3>
    ${kl.map(({ t, ct }) => `<button class="card" data-kl="${esc(t.id)}"><div class="row"><span class="name">Xác nhận KL: ${esc(t.thau)} · ${esc(t.dot)}</span><span class="tag SAP">${esc(ct.ma)}</span></div>
      <div class="muted">${esc(t.hangMuc)}${t.dieuKien ? ' · ' + esc(t.dieuKien) : ''}</div></button>`).join('')}
    ${no.ds.map(({ t, con }) => { const tt = tonTaiCuaDot(t); return `<button class="card" data-tra="${esc(t.id)}"><div class="row"><span class="name">Trả ${esc(t.thau)} · ${esc(t.dot)}</span><b>${tienGon(con)}</b></div>
      <div class="muted">${esc(t.maCongTrinh)} · đã xác nhận KL ${ddmm(t.klXacNhan.ngay)}</div>${tt ? `<div class="tre">Việc mốc còn ${tt} tồn tại chưa sửa, cân nhắc giữ lại tiền</div>` : ''}</button>`; }).join('')}`;
}

// Đợt trả thầu gắn việc mốc: số tồn tại nghiệm thu chưa sửa của việc đó.
function tonTaiCuaDot(t) {
  const ct = db.congTrinh.find((c) => c.ma === t.maCongTrinh);
  const v = ct && t.viecMoc ? ct.viec.find((x) => x.id === t.viecMoc) : null;
  return v ? ketQuaViec(db, ct, v).con.length : 0;
}

// ---------- Phát sinh 4 bước ----------
const TAG_PS = { CHO_BAO_GIA: 'SAP', CHO_KHACH: 'SAP', DUYET: 'DANG', TU_CHOI: 'TRE' };
function thePS(p, hn) {
  const vp = laVanPhong();
  const ct = db.congTrinh.find((c) => c.ma === p.maCongTrinh);
  const v = p.viec && ct ? ct.viec.find((x) => x.id === p.viec) : null;
  const cho = p.trangThai === 'CHO_BAO_GIA' ? diffDays(p.ngayBao, hn) : p.trangThai === 'CHO_KHACH' ? diffDays(p.ngayBaoGia, hn) : 0;
  const tre = (p.trangThai === 'CHO_BAO_GIA' || p.trangThai === 'CHO_KHACH') && cho >= HAN_CHOT;
  const conThu = vp && p.trangThai === 'DUYET' ? (Number(p.giaBan) || 0) - daThuPS(db, p) : 0;
  const nut = [];
  if (vp && p.trangThai === 'CHO_BAO_GIA') nut.push(`<button data-ps-gia="${esc(p.id)}" class="btn-chinh">Báo giá</button>`);
  if (vp && p.trangThai === 'CHO_KHACH') nut.push(`<button data-ps-gui="${esc(p.id)}">Gửi khách Zalo</button>`, `<button data-ps-kq="${esc(p.id)}" class="btn-chinh">Khách trả lời</button>`);
  if (vp && conThu > 0) nut.push(`<button data-ps-thu="${esc(p.id)}">Ghi thu</button>`);
  if (p.trangThai === 'DUYET' && !p.daLam) nut.push(`<button data-ps-xong="${esc(p.id)}">Đã làm xong</button>`);
  if (vp) nut.push(`<button data-ps-sua="${esc(p.id)}">Sửa</button>`);
  return `<div class="card">
    <div class="row"><span class="name">${esc(p.ma)} · ${esc(p.moTa)}</span><span class="tag ${tre ? 'TRE' : TAG_PS[p.trangThai]}">${TT_PS[p.trangThai]}${tre ? ` ${cho} ngày` : ''}</span></div>
    <div class="muted">${esc(p.maCongTrinh)}${p.viTri ? ' · ' + esc(p.viTri) : ''}${v ? ' · ' + esc(v.hangMuc) : ''} · ${esc(tenNguoi(p.nguoiBao))} báo ${ddmm(p.ngayBao)}${p.daLam ? ` · đã làm xong ${ddmm(p.daLam)}` : ''}</div>
    ${vp && p.giaBan ? `<div>Giá bán ${tien(p.giaBan)} · chi gốc ${tien(p.chiGoc)}${p.trangThai === 'DUYET' ? ` · ${conThu > 0 ? `còn thu <b>${tien(conThu)}</b>` : 'đã thu đủ'}` : ''}</div>` : ''}
    ${p.ngayKhach ? `<div class="muted">Khách ${p.trangThai === 'DUYET' ? 'đồng ý' : 'không làm'} ${ddmm(p.ngayKhach)} (${esc(QUA_PS[p.quaKhach] || p.quaKhach)})${p.yKien ? ': ' + esc(p.yKien) : ''}${vp && p.bangChung ? ` · <a href="${esc(p.bangChung)}" target="_blank" rel="noopener">bằng chứng</a>` : ''}</div>` : ''}
    ${nut.length ? `<div class="actions">${nut.join('')}</div>` : ''}
  </div>`;
}

function ganNutPS(el) {
  const tim = (id) => (db.phatSinh || []).find((p) => p.id === id);
  const ctCua = (p) => db.congTrinh.find((c) => c.ma === p.maCongTrinh);
  el.querySelectorAll('[data-ps-gia]').forEach((b) => { b.onclick = () => moBaoGiaPS(tim(b.dataset.psGia)); });
  el.querySelectorAll('[data-ps-sua]').forEach((b) => { b.onclick = () => moBaoGiaPS(tim(b.dataset.psSua), true); });
  el.querySelectorAll('[data-ps-gui]').forEach((b) => { b.onclick = () => { const p = tim(b.dataset.psGui); chiaSe(tinBaoGia(p, linkChuNhaCua(ctCua(p)))); }; });
  el.querySelectorAll('[data-ps-kq]').forEach((b) => { b.onclick = () => moKhachTraLoiPS(tim(b.dataset.psKq)); });
  el.querySelectorAll('[data-ps-thu]').forEach((b) => {
    b.onclick = () => { const p = tim(b.dataset.psThu); moGhiKhoan({ loai: 'THU', ma: p.maCongTrinh, hangMuc: 'Thu phát sinh', thamChieu: p.id, soTien: (Number(p.giaBan) || 0) - daThuPS(db, p), noiDung: `${p.ma} ${p.moTa}` }); };
  });
  el.querySelectorAll('[data-ps-xong]').forEach((b) => {
    b.onclick = () => {
      if (b.dataset.chac !== '1') { b.dataset.chac = '1'; b.textContent = 'Bấm lần nữa nếu đã làm xong'; return; }
      daLamPS(db, tim(b.dataset.psXong), homNay(), vaiTro, laVanPhong()); luu(); bao('Đã báo làm xong phát sinh'); route();
    };
  });
}

// Bước 1: báo phát sinh (giám sát hoặc văn phòng). Không có ô giá: không báo giá với khách tại công trình.
function moBaoPS(ct, viecId = '', moTa = '') {
  const d = $('#sheet');
  if (d.open) d.close();
  d.innerHTML = `<h2>Báo phát sinh</h2>
    <p class="muted">Ghi rõ khách muốn thêm gì, ở đâu. Không báo giá với khách tại công trình, văn phòng sẽ báo giá trong 24–48 giờ.</p>
    <label class="f">Phát sinh gì</label><div class="mic"><textarea id="mt" placeholder="Vd: thêm 2 ổ cắm + 1 đường nước máy lọc bếp">${esc(moTa)}</textarea><button id="noi">🎤</button></div>
    <label class="f">Vị trí</label><input id="vt" placeholder="Vd: Bếp">
    <label class="f">Liên quan việc</label><select id="viec"><option value="">Không chọn</option>${ct.viec.map((v) => `<option value="${esc(v.id)}" ${v.id === viecId ? 'selected' : ''}>${esc(v.hangMuc)}</option>`).join('')}</select>
    <label class="btn" style="display:block;text-align:center;margin-top:12px">📷 Chụp ảnh hiện trạng<input id="anh" type="file" accept="image/*" capture="environment" multiple hidden></label>
    <p id="soAnh" class="muted"></p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Gửi văn phòng</button></div>`;
  $('#noi', d).onclick = () => noiThanhChu($('#mt', d));
  $('#anh', d).onchange = () => { $('#soAnh', d).textContent = $('#anh', d).files.length ? `${$('#anh', d).files.length} ảnh` : ''; };
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = async () => {
    const mt = $('#mt', d).value.trim();
    if (!mt) return bao('Ghi nội dung phát sinh');
    const ps = baoPhatSinh(db, ct, { moTa: mt, viTri: $('#vt', d).value.trim(), viec: $('#viec', d).value, ngay: homNay() }, vaiTro, laVanPhong());
    const files = [...$('#anh', d).files];
    d.close();
    if (files.length) ghiDaChupAnh(db, ct.ma, homNay());
    if (files.length && daKetNoi()) { try { await xepAnh(files, ct.ma, ps.ma); } catch (err) { bao('Không đọc được ảnh: ' + err.message); } }
    luu(); bao(`Đã báo ${ps.ma}, chờ văn phòng báo giá`); route();
  };
}

// Bước 2 (văn phòng): báo giá. Cũng dùng để sửa phiếu.
function moBaoGiaPS(p, sua = false) {
  const d = $('#sheet');
  if (d.open) d.close();
  const ct = db.congTrinh.find((c) => c.ma === p.maCongTrinh);
  d.innerHTML = `<h2>${sua ? 'Sửa' : 'Báo giá'} ${esc(p.ma)}</h2>
    <label class="f">Nội dung</label><textarea id="mt">${esc(p.moTa)}</textarea>
    <label class="f">Vị trí</label><input id="vt" value="${esc(p.viTri)}">
    <div class="hai-cot">
      <div><label class="f">Giá bán cho khách</label><input id="gb" inputmode="decimal" value="${p.giaBan || ''}" placeholder="Vd: 3,5tr"><p id="gbChu" class="muted"></p></div>
      <div><label class="f">Chi phí gốc</label><input id="cg" inputmode="decimal" value="${p.chiGoc || ''}" placeholder="Vd: 2,2tr"><p id="cgChu" class="muted"></p></div>
    </div>
    <p id="lai" class="muted"></p>
    <div class="actions">${sua ? '<button id="xoa" class="btn-do">Huỷ phiếu</button>' : ''}<button id="huy">Đóng</button><button id="ok" class="btn-chinh">${sua ? 'Lưu' : 'Lưu, chờ khách duyệt'}</button></div>
    ${sua ? '' : '<p class="muted">Lưu xong bấm "Gửi khách Zalo": tin nhắn có link để khách bấm Đồng ý.</p>'}`;
  const xem = () => {
    const gb = docTien($('#gb', d).value), cg = docTien($('#cg', d).value);
    $('#gbChu', d).textContent = Number.isFinite(gb) ? tien(gb) : '';
    $('#cgChu', d).textContent = Number.isFinite(cg) ? tien(cg) : '';
    $('#lai', d).textContent = gb > 0 && Number.isFinite(cg) ? `Lãi phát sinh ${tien(gb - cg)} (${Math.round(((gb - cg) / gb) * 100)}%)` : '';
  };
  xem();
  $('#gb', d).oninput = xem; $('#cg', d).oninput = xem;
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const gb = docTien($('#gb', d).value), cg = docTien($('#cg', d).value) || 0;
    const mt = $('#mt', d).value.trim();
    if (!mt) return bao('Nội dung không được trống');
    if (!sua || p.trangThai === 'CHO_BAO_GIA') {
      if (!(gb > 0)) return bao('Nhập giá bán, vd 3,5tr');
      suaPS(db, p, { moTa: mt, viTri: $('#vt', d).value.trim() });
      baoGia(db, p, { giaBan: gb, chiGoc: cg, ngay: homNay() }, vaiTro);
    } else suaPS(db, p, { moTa: mt, viTri: $('#vt', d).value.trim(), giaBan: Number.isFinite(gb) ? gb : p.giaBan, chiGoc: cg });
    luu(); d.close(); bao('Đã lưu ' + p.ma); route();
    void ct;
  };
  let bamXoa = false;
  if (sua) $('#xoa', d).onclick = () => {
    if (daThuPS(db, p) > 0) return bao('Phát sinh đã thu tiền, xoá khoản thu trước');
    if (!bamXoa) { bamXoa = true; $('#xoa', d).textContent = 'Bấm lần nữa để huỷ'; return; }
    xoaPS(db, p, vaiTro); luu(); d.close(); bao('Đã huỷ ' + p.ma); route();
  };
}

// Bước 3 (văn phòng): khách trả lời qua Zalo hoặc gặp trực tiếp.
function moKhachTraLoiPS(p) {
  const d = $('#sheet');
  if (d.open) d.close();
  let dongY = true;
  d.innerHTML = `<h2>Khách trả lời ${esc(p.ma)}</h2>
    <p class="muted">${esc(p.moTa)} · ${tien(p.giaBan)}</p>
    <div class="grid-btn hai"><button data-dy="1" class="on">Đồng ý làm</button><button data-dy="0">Không làm</button></div>
    <div class="hai-cot">
      <div><label class="f">Ngày</label><input id="ngay" type="date" value="${homNay()}"></div>
      <div><label class="f">Qua</label><select id="qua"><option value="ZALO">Zalo</option><option value="GAP">Gặp trực tiếp</option></select></div>
    </div>
    <label class="f">Link ảnh chụp tin nhắn (bằng chứng)</label><input id="bc" placeholder="Dán link ảnh trên Drive">
    <label class="f">Ý kiến khách</label><input id="yk">
    <p class="muted">Đồng ý thì giám sát thấy "Được làm" ngay. Tiền phát sinh thu cùng đợt quyết toán.</p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  d.querySelectorAll('[data-dy]').forEach((b) => { b.onclick = () => { dongY = b.dataset.dy === '1'; d.querySelectorAll('[data-dy]').forEach((o) => o.classList.toggle('on', o === b)); }; });
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    khachTraLoi(db, p, { dongY, qua: $('#qua', d).value, ngay: $('#ngay', d).value || homNay(), bangChung: $('#bc', d).value.trim(), yKien: $('#yk', d).value.trim() }, vaiTro);
    luu(); d.close(); bao(dongY ? `${p.ma}: được làm, đã báo giám sát` : `${p.ma}: không làm`); route();
  };
}

function khoiPhatSinh(ct) {
  const hn = homNay();
  const ds = psCuaCongTrinh(db, ct.ma);
  const t = laVanPhong() ? tongPS(db, ct.ma) : null;
  return `<h3>Phát sinh</h3>
    ${t && t.giaBan ? `<p class="muted">Đã duyệt ${tien(t.giaBan)}${t.pct !== null ? ` · ${String(t.pct).replace('.', ',')}% HĐ thi công` : ''}${t.conThu ? ` · còn thu ${tien(t.conThu)}` : ''}</p>` : ''}
    ${ds.map((p) => thePS(p, hn)).join('') || '<p class="muted">Chưa có phát sinh.</p>'}
    <div class="actions"><button id="baoPS">+ Báo phát sinh</button></div>`;
}

function manPhatSinh() {
  datTab('hop-dong', 'Phát sinh');
  const hn = homNay();
  const ds = (db.phatSinh || []).filter((p) => !p.xoa && db.congTrinh.some((c) => c.ma === p.maCongTrinh));
  const nhom = ['CHO_BAO_GIA', 'CHO_KHACH', 'DUYET', 'TU_CHOI'];
  const conThu = ds.filter((p) => p.trangThai === 'DUYET').reduce((s, p) => s + Math.max(0, (Number(p.giaBan) || 0) - daThuPS(db, p)), 0);
  $('#view').innerHTML = `${dauTien('phat-sinh')}
    <div class="so-lieu"><div><span>Chờ báo giá</span><b>${ds.filter((p) => p.trangThai === 'CHO_BAO_GIA').length}</b></div><div><span>Chờ khách duyệt</span><b>${ds.filter((p) => p.trangThai === 'CHO_KHACH').length}</b></div>
      <div><span>Phát sinh còn phải thu</span><b>${tienGon(conThu)}</b></div></div>
    <p class="muted">Quy trình 4 bước: giám sát báo → văn phòng báo giá trong 24–48 giờ → khách đồng ý (trên link hoặc Zalo) → giám sát thấy "Được làm".</p>
    ${nhom.map((k) => { const x = ds.filter((p) => p.trangThai === k); return x.length ? `<h3>${TT_PS[k]} (${x.length})</h3>${x.map((p) => thePS(p, hn)).join('')}` : ''; }).join('') || '<p class="muted">Chưa có phát sinh nào. Báo phát sinh ở trang công trình hoặc khi chạm vào 1 việc.</p>'}`;
  ganNutPS($('#view'));
}

function phatSinhHomNay(hn) {
  const { choBaoGia, choKhach, duocLam } = viecPSHomNay(db, hn, laVanPhong());
  if (!choBaoGia.length && !choKhach.length && !duocLam.length) return '';
  return `<h3>Phát sinh</h3>
    ${choBaoGia.map(({ p }) => thePS(p, hn)).join('')}
    ${choKhach.map(({ p }) => thePS(p, hn)).join('')}
    ${duocLam.map((p) => thePS(p, hn)).join('')}`;
}

// ---------- Mẫu vật liệu ----------
const HM_MAU = ['Gạch lát nền', 'Gạch ốp WC', 'Sàn gỗ', 'Sơn tường', 'Đá bếp, đá cầu thang', 'Thiết bị vệ sinh', 'Đèn', 'Cửa', 'Gỗ, laminate tủ', 'Rèm', 'Giấy dán tường'];
const TAG_MAU = { CHO_KHACH: 'SAP', DUYET: 'DANG', DOI: 'TRE' };
function theMau(m, hn) {
  const vp = laVanPhong();
  const ct = db.congTrinh.find((c) => c.ma === m.maCongTrinh);
  const v = m.viec && ct ? ct.viec.find((x) => x.id === m.viec) : null;
  const tre = m.trangThai !== 'DUYET' && m.hanChot && m.hanChot < hn;
  const nut = [];
  if (vp && m.trangThai === 'CHO_KHACH') nut.push(`<button data-mau-gui="${esc(m.id)}">Gửi khách Zalo</button>`, `<button data-mau-kq="${esc(m.id)}" class="btn-chinh">Khách trả lời</button>`);
  if (vp && m.trangThai === 'DOI') nut.push(`<button data-mau-doi="${esc(m.id)}" class="btn-chinh">Gửi mẫu khác</button>`);
  if (vp) nut.push(`<button data-mau-sua="${esc(m.id)}">Sửa</button>`);
  return `<div class="card">
    <div class="row"><span class="name">${esc(m.hangMuc)}: ${esc(m.tenMau)}</span><span class="tag ${tre ? 'TRE' : TAG_MAU[m.trangThai]}">${TT_MAU[m.trangThai]}${tre ? ', quá hạn' : ''}</span></div>
    <div class="muted">${m.nguoiBan ? `Người bán: ${esc(m.nguoiBan)}${m.sdtNguoiBan ? ` · <a href="tel:${esc(m.sdtNguoiBan)}">${esc(m.sdtNguoiBan)}</a>` : ''}` : 'Chưa ghi người bán'}${m.link ? ` · <a href="${esc(m.link)}" target="_blank" rel="noopener">Ảnh mẫu</a>` : ''}</div>
    <div class="muted">${v ? `Dùng cho: ${esc(v.hangMuc)} · ` : ''}${m.hanChot ? `chốt trước ${ddmm(m.hanChot)}` : ''}${m.ngayKhach ? ` · khách trả lời ${ddmm(m.ngayKhach)} (${esc(QUA_PS[m.quaKhach] || m.quaKhach)})` : ''}${m.yKien ? ': ' + esc(m.yKien) : ''}</div>
    ${nut.length ? `<div class="actions">${nut.join('')}</div>` : ''}
  </div>`;
}

function ganNutMau(el) {
  const tim = (id) => (db.mauVL || []).find((m) => m.id === id);
  const ctCua = (m) => db.congTrinh.find((c) => c.ma === m.maCongTrinh);
  el.querySelectorAll('[data-mau-gui]').forEach((b) => { b.onclick = () => { const m = tim(b.dataset.mauGui); chiaSe(tinGuiMau(m, linkChuNhaCua(ctCua(m)))); }; });
  el.querySelectorAll('[data-mau-kq]').forEach((b) => { b.onclick = () => moKhachChotMau(tim(b.dataset.mauKq)); });
  el.querySelectorAll('[data-mau-sua]').forEach((b) => { const m = tim(b.dataset.mauSua); b.onclick = () => moMau(ctCua(m), m); });
  el.querySelectorAll('[data-mau-doi]').forEach((b) => { const m = tim(b.dataset.mauDoi); b.onclick = () => moMau(ctCua(m), m, true); });
}

// Thêm mẫu, sửa mẫu, hoặc gửi mẫu khác khi khách muốn đổi.
function moMau(ct, cu, guiLai = false) {
  const d = $('#sheet');
  if (d.open) d.close();
  const m0 = cu || { hangMuc: '', tenMau: '', nguoiBan: '', sdtNguoiBan: '', link: '', viec: '', hanChot: '' };
  const nguoiBan = [...new Set((db.mauVL || []).map((m) => m.nguoiBan).filter(Boolean))].sort();
  d.innerHTML = `<h2>${guiLai ? 'Gửi mẫu khác' : cu ? 'Sửa mẫu' : 'Thêm mẫu vật liệu'}</h2>
    ${guiLai && cu.yKien ? `<p class="note">Khách muốn đổi: ${esc(cu.yKien)}</p>` : ''}
    <label class="f">Hạng mục</label><input id="hm" list="dsHmMau" value="${esc(m0.hangMuc)}" placeholder="Vd: Gạch ốp WC"><datalist id="dsHmMau">${HM_MAU.map((h) => `<option value="${esc(h)}">`).join('')}</datalist>
    <label class="f">Tên mẫu / mã</label><input id="ten" value="${esc(guiLai ? '' : m0.tenMau)}" placeholder="Vd: Viglacera 60x120 xám vân đá">
    <div class="hai-cot">
      <div><label class="f">Người bán</label><input id="nb" list="dsNb" value="${esc(m0.nguoiBan)}"><datalist id="dsNb">${nguoiBan.map((x) => `<option value="${esc(x)}">`).join('')}</datalist></div>
      <div><label class="f">SĐT người bán</label><input id="sdt" type="tel" value="${esc(m0.sdtNguoiBan)}"></div>
    </div>
    <label class="f">Link ảnh mẫu / catalog</label><input id="link" value="${esc(guiLai ? '' : m0.link)}" placeholder="Dán link ảnh trên Drive hoặc web">
    <label class="f">Dùng cho việc</label><select id="viec"><option value="">Không chọn</option>${ct.viec.map((v) => `<option value="${esc(v.id)}" ${v.id === m0.viec ? 'selected' : ''}>${esc(v.hangMuc)}</option>`).join('')}</select>
    <label class="f">Khách chốt trước ngày</label><input id="han" type="date" value="${esc(m0.hanChot)}">
    <p class="muted">Chọn việc thì app tự đặt hạn = ngày bắt đầu việc trừ ${NGAY_DAT_HANG} ngày đặt hàng (việc đã sát ngày thì cho khách 2 ngày).</p>
    <div class="actions">${cu && !guiLai ? '<button id="xoa" class="btn-do">Xoá</button>' : ''}<button id="huy">Huỷ</button><button id="ok" class="btn-chinh">${guiLai ? 'Gửi lại khách' : 'Lưu'}</button></div>`;
  $('#viec', d).onchange = () => { const h = hanChotMacDinh(ct, $('#viec', d).value, homNay()); if (h) $('#han', d).value = h; };
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const tt = { hangMuc: $('#hm', d).value.trim(), tenMau: $('#ten', d).value.trim(), nguoiBan: $('#nb', d).value.trim(), sdtNguoiBan: $('#sdt', d).value.trim(),
      link: $('#link', d).value.trim(), viec: $('#viec', d).value, hanChot: $('#han', d).value };
    if (!tt.hangMuc || !tt.tenMau) return bao('Cần hạng mục và tên mẫu');
    if (!tt.nguoiBan) bao('Lưu ý: chưa ghi người bán');
    if (guiLai) { suaMau(db, cu, { hangMuc: tt.hangMuc, viec: tt.viec, hanChot: tt.hanChot }); guiLaiMau(db, cu, tt, vaiTro, homNay()); }
    else if (cu) suaMau(db, cu, tt);
    else themMau(db, ct, tt, vaiTro, homNay());
    luu(); d.close(); bao(guiLai ? 'Đã lưu, bấm Gửi khách Zalo' : 'Đã lưu mẫu'); route();
  };
  let bamXoa = false;
  if (cu && !guiLai) $('#xoa', d).onclick = () => {
    if (!bamXoa) { bamXoa = true; $('#xoa', d).textContent = 'Bấm lần nữa để xoá'; return; }
    xoaMau(db, cu); luu(); d.close(); bao('Đã xoá mẫu'); route();
  };
}

function moKhachChotMau(m) {
  const d = $('#sheet');
  if (d.open) d.close();
  let dongY = true;
  d.innerHTML = `<h2>Khách trả lời mẫu</h2>
    <p class="muted">${esc(m.hangMuc)}: ${esc(m.tenMau)}</p>
    <div class="grid-btn hai"><button data-dy="1" class="on">Chốt mẫu này</button><button data-dy="0">Muốn đổi</button></div>
    <div class="hai-cot">
      <div><label class="f">Ngày</label><input id="ngay" type="date" value="${homNay()}"></div>
      <div><label class="f">Qua</label><select id="qua"><option value="ZALO">Zalo</option><option value="GAP">Gặp trực tiếp</option></select></div>
    </div>
    <label class="f">Ý kiến khách</label><input id="yk" placeholder="Vd: muốn màu sáng hơn">
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  d.querySelectorAll('[data-dy]').forEach((b) => { b.onclick = () => { dongY = b.dataset.dy === '1'; d.querySelectorAll('[data-dy]').forEach((o) => o.classList.toggle('on', o === b)); }; });
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    khachChotMau(db, m, { dongY, qua: $('#qua', d).value, ngay: $('#ngay', d).value || homNay(), yKien: $('#yk', d).value.trim() }, vaiTro);
    luu(); d.close(); bao(dongY ? 'Đã chốt mẫu' : 'Ghi nhận khách muốn đổi'); route();
  };
}

function khoiMauVL(ct) {
  const hn = homNay();
  const ds = mauCuaCongTrinh(db, ct.ma);
  if (!ds.length && !laVanPhong()) return '';
  return `<h3>Mẫu vật liệu</h3>
    ${ds.map((m) => theMau(m, hn)).join('') || '<p class="muted">Chưa có mẫu nào. Kể cả công trình chỉ thi công vẫn cần khách duyệt mẫu thực tế.</p>'}
    ${laVanPhong() ? '<div class="actions"><button id="themMau">+ Thêm mẫu vật liệu</button></div>' : ''}`;
}

function mauHomNay(hn) {
  if (!laVanPhong()) return '';
  const ds = mauCanChot(db, hn);
  return ds.length ? `<h3>Mẫu vật liệu cần khách chốt</h3>${ds.map((m) => theMau(m, hn)).join('')}` : '';
}

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
// ---------- Nhà thầu ----------
const dauCongTrinh = (tab) => `<div class="loc doan khong-in">${[['cong-trinh', 'Công trình'], ['nha-thau', 'Nhà thầu']]
  .map(([h, t]) => `<a class="btn ${h === tab ? 'on' : ''}" href="#${h}">${t}</a>`).join('')}</div>`;
const diemSao = (x) => (x === null || x === undefined ? '<span class="muted">chưa đánh giá</span>' : `<b class="sao">★ ${String(x).replace('.', ',')}</b>`);
const telLink = (sdt) => (sdt ? `<a href="tel:${esc(String(sdt).replace(/[^\d+]/g, ''))}">${esc(sdt)}</a>` : '');

function manNhaThau() {
  datTab('cong-trinh', 'Nhà thầu');
  const vp = laVanPhong();
  const ds = dsThau(db);
  // Tên thầu đã gõ trong kế hoạch mà chưa có trong danh bạ: gợi ý thêm cho đủ.
  const coTen = new Set((db.nhaThau || []).map((t) => t.ten.trim().toLowerCase()));
  const chuaCo = [...new Set(db.congTrinh.flatMap((c) => c.viec.map((v) => String(v.nhaThau || '').trim())).filter((x) => x && !coTen.has(x.toLowerCase())))].sort((a, b) => a.localeCompare(b, 'vi'));
  const nhom = [...new Set(ds.map((t) => t.linhVuc || 'Khác'))].sort((a, b) => LINH_VUC.indexOf(a) - LINH_VUC.indexOf(b));
  $('#view').innerHTML = `${dauCongTrinh('nha-thau')}
    ${vp ? '<div class="actions"><button id="themThau" class="btn-chinh">+ Thêm nhà thầu</button></div>' : ''}
    ${!ds.length ? `<p class="muted">Chưa có nhà thầu trong danh bạ.${vp ? ' Bấm "Thêm nhà thầu", hoặc thêm nhanh từ tên đã ghi trong kế hoạch bên dưới.' : ''}</p>` : ''}
    ${nhom.map((n) => `<h3>${esc(n)}</h3>${ds.filter((t) => (t.linhVuc || 'Khác') === n).map((t) => {
      const th = tongHopThau(db, t);
      return `<a class="card" href="#nt-${esc(t.id)}"><div class="row"><span class="name">${esc(t.ten)}</span>${diemSao(th.chung)}</div>
        <div class="muted">${t.sdt ? esc(t.sdt) + ' · ' : ''}${th.soCongTrinh} công trình${th.soDanhGia ? ` · ${th.soDanhGia} đánh giá` : ''}${th.ngayCham ? ` · <span class="tre">chậm ${th.ngayCham} ngày</span>` : ''}</div></a>`;
    }).join('')}`).join('')}
    ${vp && chuaCo.length ? `<h3>Tên trong kế hoạch, chưa có trong danh bạ</h3>${chuaCo.map((ten) => `<div class="card"><div class="row"><span class="name">${esc(ten)}</span><button data-them="${esc(ten)}">Thêm</button></div></div>`).join('')}` : ''}`;
  if ($('#themThau')) $('#themThau').onclick = () => moThau();
  document.querySelectorAll('[data-them]').forEach((b) => { b.onclick = () => moThau(null, b.dataset.them); });
}

function moThau(t = null, tenGoiY = '') {
  const d = $('#sheet');
  if (d.open) d.close();
  const v = t || { ten: tenGoiY, linhVuc: '', sdt: '', ghiChu: '' };
  d.innerHTML = `<h2>${t ? 'Sửa nhà thầu' : 'Thêm nhà thầu'}</h2>
    <label class="f">Tên (giống tên ghi ở cột Nhà thầu trong kế hoạch)</label><input id="ten" value="${esc(v.ten)}" placeholder="Vd: Điện nước Hùng">
    <label class="f">Lĩnh vực</label><select id="lv">${LINH_VUC.map((x) => `<option ${x === v.linhVuc ? 'selected' : ''}>${x}</option>`).join('')}</select>
    <label class="f">Số điện thoại / Zalo</label><input id="sdt" inputmode="tel" value="${esc(v.sdt)}">
    <label class="f">Ghi chú nội bộ (giám sát không thấy)</label><textarea id="gc" placeholder="Vd: làm kỹ, hay chậm khi nhiều việc">${esc(v.ghiChu)}</textarea>
    <label class="chk"><input type="checkbox" id="congNhat" ${v.congNhat ? 'checked' : ''}> Công nhật: trả theo ngày công thực tế (giám sát chấm công mỗi ngày)</label>
    ${t ? `<label class="chk"><input type="checkbox" id="ngung" ${t.hoatDong === false ? 'checked' : ''}> Ngừng dùng (ẩn khỏi danh bạ, link thầu không mở được)</label>` : ''}
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  d.showModal();
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    const ten = $('#ten', d).value.trim();
    if (!ten) return bao('Cần tên thầu');
    const trung = timThauTheoTen(db, ten);
    if (trung && trung !== t) return bao('Đã có thầu tên này');
    const du = { ten, linhVuc: $('#lv', d).value, sdt: $('#sdt', d).value.trim(), ghiChu: $('#gc', d).value.trim(), congNhat: $('#congNhat', d).checked };
    let x = t;
    if (t) suaThau(db, t, { ...du, hoatDong: !$('#ngung', d).checked });
    else x = themThau(db, du);
    luu(); d.close(); bao('Đã lưu');
    location.hash = 'nt-' + x.id;
    route();
  };
}

function linkThauCua(t) {
  const kn = ketNoi();
  return `${goc()}#lich-thau-${t.maLink}${kn ? '&api=' + maApi(kn.api) : ''}`;
}

function manMotThau(id) {
  const t = (db.nhaThau || []).find((x) => x.id === id);
  if (!t) return manNhaThau();
  datTab('cong-trinh', t.ten);
  const vp = laVanPhong();
  const th = tongHopThau(db, t);
  const theoCt = new Map();
  for (const { ct, v } of viecCuaThau(db, t)) { if (!theoCt.has(ct.ma)) theoCt.set(ct.ma, { ct, vs: [] }); theoCt.get(ct.ma).vs.push(v); }
  const dgCua = (ma) => th.ds.filter((d) => d.maCongTrinh === ma);
  $('#view').innerHTML = `${dauCongTrinh('nha-thau')}
    <h2>${esc(t.ten)}</h2>
    <p class="muted">${esc(t.linhVuc || '')}${t.sdt ? ' · ' + telLink(t.sdt) : ''}${t.hoatDong === false ? ' · <span class="tre">đã ngừng dùng</span>' : ''}</p>
    ${vp && t.ghiChu ? `<div class="note">${esc(t.ghiChu)}</div>` : ''}
    <div class="card"><div class="row"><span class="name">Điểm chung</span>${diemSao(th.chung)}</div>
      ${th.soDanhGia ? Object.entries(TIEU_CHI).map(([k, ten]) => `<div class="row"><span>${ten}</span>${diemSao(th.diem[k])}</div>`).join('') : ''}
      <div class="muted">${th.soCongTrinh} công trình · ${th.soDanhGia} phiếu đánh giá · chậm do thầu: ${th.ngayCham ? `<b class="tre">${th.ngayCham} ngày</b>` : '0 ngày'}</div></div>
    <div class="actions">
      ${t.sdt ? `<a class="btn" href="tel:${esc(String(t.sdt).replace(/[^\d+]/g, ''))}" style="text-align:center">📞 Gọi</a>` : ''}
      ${vp ? '<button id="suaThau">Sửa</button>' : ''}
    </div>
    ${vp && t.maLink ? `<div class="actions"><button id="guiLink" class="btn-chinh">Gửi thầu link xem lịch việc</button><a class="btn" href="#lich-thau-${esc(t.maLink)}${ketNoi() ? '&api=' + maApi(ketNoi().api) : ''}" style="text-align:center">Xem như thầu</a></div>
      <p class="muted">Thầu mở link thấy việc của mình ở các công trình đang làm, ngày bắt đầu/xong theo lịch mới nhất và mẫu vật liệu đã chốt. Không thấy tiền, không thấy việc thầu khác.</p>` : ''}
    ${t.congNhat ? khoiBangCong(t) : ''}
    <h3>Việc theo công trình</h3>
    ${!theoCt.size ? '<p class="muted">Chưa có việc nào ghi tên thầu này trong kế hoạch.</p>' : ''}
    ${[...theoCt.values()].map(({ ct, vs }) => {
      const lich = lichHienTai(ct, homNay());
      const xong = vs.every((v) => v.phanTram >= 100);
      const dgs = dgCua(ct.ma);
      const cuaToi = dgs.find((x) => x.nguoi === vaiTro);
      return `<div class="card"><div class="row"><a class="name" href="#ct-${esc(ct.ma)}">${esc(ct.ma)} · ${esc(ct.ten)}</a>${xong ? '<span class="tag XONG">Xong</span>' : ''}</div>
        ${vs.map((v) => { const l = lich.get(v.id); return `<div class="row"><span>${esc(v.hangMuc)}</span><span class="muted">${ddmm(l.batDau)}–${ddmm(l.ketThuc)} · ${v.phanTram}%</span></div>`; }).join('')}
        ${(() => { const con = vs.flatMap((v) => ketQuaViec(db, ct, v).con); return con.length ? `<div class="tre">Còn ${con.length} tồn tại chưa sửa: ${con.map(({ t }) => esc(t.noiDung)).join('; ')}</div>` : ''; })()}
        ${dgs.map((x) => `<div class="muted">${esc(tenNguoi(x.nguoi))} ${ddmm(x.ngay)}: ${Object.keys(TIEU_CHI).map((k) => `${TIEU_CHI[k].split(',')[0]} ${x[k] || '–'}`).join(' · ')}${x.ghiChu ? ' · ' + esc(x.ghiChu) : ''}</div>`).join('')}
        <div class="actions"><button data-dg="${esc(ct.ma)}" class="${xong && !cuaToi ? 'btn-chinh' : ''}">${cuaToi ? 'Sửa đánh giá' : 'Đánh giá'}</button></div></div>`;
    }).join('')}`;
  if ($('#suaThau')) $('#suaThau').onclick = () => moThau(t);
  if ($('#guiLink')) $('#guiLink').onclick = () => chiaSe(tinLinkThau(t, linkThauCua(t)));
  document.querySelectorAll('[data-dg]').forEach((b) => { b.onclick = () => moDanhGia(t, b.dataset.dg); });
}

// Bảng công thầu công nhật: tháng này theo từng công trình, kèm tổng tháng trước.
function khoiBangCong(t) {
  const hn = homNay();
  const dauThang = hn.slice(0, 8) + '01';
  const dauThangTruoc = addDays(dauThang, -1).slice(0, 8) + '01';
  const nay = bangCong(db, t.ten, dauThang, hn);
  const truoc = bangCong(db, t.ten, dauThangTruoc, addDays(dauThang, -1));
  const theoCt = new Map();
  nay.dong.forEach((x) => theoCt.set(x.ma, [...(theoCt.get(x.ma) || []), x]));
  return `<h3>Chấm công (công nhật)</h3><div class="card">
    <div class="row"><span class="name">Tháng ${hn.slice(5, 7)}</span><b>${nay.tong} công</b></div>
    ${[...theoCt].map(([ma, ds]) => `<div class="muted">${esc(ma)}: ${ds.map((x) => `${ddmm(x.ngay)} ${x.cong === 0 ? 'nghỉ' : x.cong}`).join(' · ')}</div>`).join('') || '<div class="muted">Chưa chấm ngày nào.</div>'}
    <div class="muted">Tháng ${dauThangTruoc.slice(5, 7)}: ${truoc.tong} công</div></div>`;
}

function moDanhGia(t, maCt) {
  const d = $('#sheet');
  if (d.open) d.close();
  const cu = (db.danhGia || []).find((x) => x.maThau === t.id && x.maCongTrinh === maCt && x.nguoi === vaiTro) || {};
  const chon = { chatLuong: cu.chatLuong || 0, tienDo: cu.tienDo || 0, phoiHop: cu.phoiHop || 0 };
  d.innerHTML = `<h2>Đánh giá ${esc(t.ten)}</h2>
    <p class="muted">Công trình ${esc(maCt)} · 1 = kém, 3 = đạt, 5 = rất tốt</p>
    ${Object.entries(TIEU_CHI).map(([k, ten]) => `<label class="f">${ten}</label><div class="grid-btn">${[1, 2, 3, 4, 5].map((n) => `<button data-k="${k}" data-n="${n}" class="${chon[k] === n ? 'on' : ''}">${n}</button>`).join('')}</div>`).join('')}
    <label class="f">Nhận xét</label><div class="mic"><textarea id="gc" placeholder="Vd: làm sạch, đúng hẹn; đi ống hơi ẩu ở WC2">${esc(cu.ghiChu || '')}</textarea><button id="noi">🎤</button></div>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  d.showModal();
  d.querySelectorAll('[data-k]').forEach((b) => {
    b.onclick = () => {
      chon[b.dataset.k] = +b.dataset.n;
      d.querySelectorAll(`[data-k="${b.dataset.k}"]`).forEach((x) => x.classList.toggle('on', x === b));
    };
  });
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => {
    if (!chon.chatLuong || !chon.tienDo || !chon.phoiHop) return bao('Chấm đủ 3 mục');
    danhGia(db, t, { maCongTrinh: maCt, ngay: homNay(), ...chon, ghiChu: $('#gc', d).value.trim() }, vaiTro);
    luu(); d.close(); bao('Đã lưu đánh giá'); route();
  };
}

// Tên thầu trong việc: có trong danh bạ thì bấm vào xem, kèm số gọi.
function thauCuaViec(ten) {
  const t = timThauTheoTen(db, ten);
  return t ? `<a href="#nt-${esc(t.id)}">${esc(t.ten)}</a>${t.sdt ? ' ' + telLink(t.sdt) : ''}` : esc(ten);
}

// Hôm nay: nhắc đánh giá thầu đã xong hết việc ở 1 công trình.
function danhGiaHomNay() {
  const ds = canDanhGia(db, vaiTro);
  if (!ds.length) return '';
  return `<h3>Đánh giá thầu</h3>${ds.slice(0, 5).map(({ t, ma }) => `<a class="card" href="#nt-${esc(t.id)}"><div class="row"><span class="name">${esc(t.ten)}</span><span class="tag SAP">${esc(ma)}</span></div>
    <div class="muted">Đã xong hết việc ở công trình này, chấm điểm giúp (1 phút)</div></a>`).join('')}`;
}

function ganNutAnh(el) {
  el.querySelectorAll('[data-anh-ct]').forEach((inp) => {
    inp.onchange = async (e) => {
      const files = [...e.target.files];
      if (!files.length) return;
      await guiAnhHienTruong(files, inp.dataset.anhCt, '');
      route();
    };
  });
}

// Dùng chung: lưu ảnh hiện trường vào máy, đánh dấu đã có ảnh hôm nay, rồi gửi lên Drive.
async function guiAnhHienTruong(files, ma, viec) {
  ghiDaChupAnh(db, ma, homNay());
  const kAnh = ma + '|' + homNay();
  db.anhDem = { ...(db.anhDem || {}), [kAnh]: (Number((db.anhDem || {})[kAnh]) || 0) + files.length };
  ghi(db);
  if (!daKetNoi()) { bao(`${files.length} ảnh: bản thử chưa gửi lên Drive`); return; }
  try {
    const n = await xepAnh(files, ma, viec);
    bao(`Đã lưu ${n} ảnh trên máy, đang gửi lên Drive`);
    chayDongBo();
  } catch (err) {
    bao('Không đọc được ảnh: ' + err.message);
  }
}

// ---------- Link thầu (không đăng nhập) ----------
async function manChoThau(maLink, api) {
  $('#title').textContent = 'Lịch việc KAS';
  let du = null;
  if (api) {
    $('#view').innerHTML = '<p class="muted">Đang tải…</p>';
    try { du = await xemChoThau(api, maLink); } catch { du = null; }
  } else {
    // Bản thử / văn phòng xem trước: dựng từ dữ liệu trên máy, giống máy chủ.
    const t = (db.nhaThau || []).find((x) => x.maLink === maLink && x.hoatDong !== false);
    if (t) {
      const ten = t.ten.trim().toLowerCase();
      du = { thau: { ten: t.ten, linhVuc: t.linhVuc }, congTrinh: db.congTrinh.map((c) => {
        const ids = c.viec.filter((v) => String(v.nhaThau || '').trim().toLowerCase() === ten).map((v) => v.id);
        if (!ids.length || c.viec.filter((v) => ids.includes(v.id)).every((v) => v.phanTram >= 100)) return null;
        return { ma: c.ma, ten: c.ten, khoiCong: c.khoiCong, lich: c.lich,
          viec: c.viec.map((v) => ({ ...v, cuaThau: ids.includes(v.id) })),
          mau: (db.mauVL || []).filter((m) => !m.xoa && m.trangThai === 'DUYET' && m.maCongTrinh === c.ma && ids.includes(m.viec)) };
      }).filter(Boolean) };
    }
  }
  if (!du) { $('#view').innerHTML = '<p>Link không đúng hoặc đã hết hạn. Anh liên hệ KAS để nhận link mới.</p>'; return; }
  const hn = homNay();
  const sap = addDays(hn, 14);
  $('#view').innerHTML = `<h2>${esc(du.thau.ten)}</h2><p class="muted">Lịch việc của anh ở các công trình KAS, cập nhật theo tiến độ mới nhất.</p>
    ${!du.congTrinh.length ? '<p>Hiện chưa có việc nào đang chờ anh.</p>' : ''}
    ${du.congTrinh.map((c) => {
      const lich = xepLich(c.viec, c.khoiCong, c.lich, hn);
      const cua = c.viec.filter((v) => v.cuaThau).sort((a, b) => lich.get(a.id).batDau.localeCompare(lich.get(b.id).batDau));
      const vs = cua.filter((v) => v.phanTram < 100);
      const daXong = cua.length - vs.length;
      return `<h3>${esc(c.ten)}</h3>${daXong ? `<p class="muted">Đã xong ${daXong} việc.</p>` : ''}${vs.map((v) => {
        const l = lich.get(v.id);
        const tt = l.batDau <= hn ? ['DANG', `Đang làm ${v.phanTram}%`] : l.batDau <= sap ? ['SAP', `Còn ${diffDays(hn, l.batDau)} ngày`] : ['', ''];
        const ms = (c.mau || []).filter((m) => m.viec === v.id);
        return `<div class="card"><div class="row"><span class="name">${esc(v.hangMuc)}</span>${tt[1] ? `<span class="tag ${tt[0]}">${tt[1]}</span>` : ''}</div>
          <div>Bắt đầu <b>${fmtNgay(l.batDau)}</b> · xong <b>${fmtNgay(l.ketThuc)}</b> (${v.soNgay} ngày)</div>
          ${v.dauViec ? `<div class="muted">${esc(v.dauViec)}</div>` : ''}
          ${v.khoiLuong ? `<div class="muted">Khối lượng: ${esc(v.khoiLuong)} ${esc(v.dvt || '')}</div>` : ''}
          ${ms.map((m) => `<div class="muted">Mẫu đã chốt: ${esc(m.hangMuc)} – ${esc(m.tenMau)}${m.link ? ` · <a href="${esc(m.link)}" target="_blank" rel="noopener">ảnh mẫu</a>` : ''}</div>`).join('')}</div>`;
      }).join('')}`;
    }).join('')}
    <p class="muted">Lịch có thể đổi khi việc trước làm nhanh/chậm. Anh mở lại link này để xem bản mới nhất.</p>`;
}

// ---------- Nghiệm thu ----------
const TAG_NTHU = { CHUA: ['SAP', 'Chưa nghiệm thu'], TON_TAI: ['TRE', 'Còn tồn tại'], DAT: ['XONG', 'Đã nghiệm thu'] };

function theTonTai({ ct, v, n, t, qua }, hn) {
  return `<div class="card"><div class="row"><span class="name">${esc(t.noiDung)}</span><span class="tag ${qua ? 'TRE' : 'SAP'}">${qua ? `Quá hạn ${diffDays(t.hanSua, hn)} ngày` : `Hạn ${ddmm(t.hanSua)}`}</span></div>
    <div class="muted">${esc(ct.ma)} · ${esc(v ? v.hangMuc : '')}${v && v.nhaThau ? ' · thầu ' + esc(v.nhaThau) : ''} · nghiệm thu ${ddmm(n.ngay)}</div>
    <div class="actions"><button data-tt-han="${esc(n.id)}|${esc(t.id)}">Đổi hạn</button><label class="btn btn-chinh">Đã sửa (chụp ảnh)<input type="file" accept="image/*" capture="environment" multiple hidden data-tt-sua="${esc(n.id)}|${esc(t.id)}"></label></div></div>`;
}

function ganNutNghiemThu(el) {
  const tim = (s) => { const [nid, tid] = s.split('|'); return { n: (db.nghiemThu || []).find((x) => x.id === nid), tid }; };
  el.querySelectorAll('[data-nthu]').forEach((b) => {
    b.onclick = () => { const [ma, id] = b.dataset.nthu.split('|'); const ct = db.congTrinh.find((c) => c.ma === ma); moNghiemThu(ct, ct.viec.find((v) => v.id === id)); };
  });
  el.querySelectorAll('[data-tt-sua]').forEach((inp) => {
    inp.onchange = async (e) => {
      const { n, tid } = tim(inp.dataset.ttSua);
      const files = [...e.target.files];
      daSuaTonTai(db, n, tid, homNay(), vaiTro);
      luu();
      if (files.length) await guiAnhHienTruong(files, n.maCongTrinh, n.viec);
      bao('Đã ghi sửa xong'); route();
    };
  });
  el.querySelectorAll('[data-tt-han]').forEach((b) => {
    b.onclick = () => {
      const { n, tid } = tim(b.dataset.ttHan);
      const t = n.tonTai.find((x) => x.id === tid);
      const d = $('#sheet');
      if (d.open) d.close();
      d.innerHTML = `<h2>Đổi hạn sửa</h2><p>${esc(t.noiDung)}</p><label class="f">Hạn mới</label><input id="han" type="date" value="${esc(t.hanSua)}">
        <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
      d.showModal();
      $('#huy', d).onclick = () => d.close();
      $('#ok', d).onclick = () => { doiHanSua(db, n, tid, $('#han', d).value); luu(); d.close(); route(); };
    };
  });
}

function moNghiemThu(ct, v) {
  const d = $('#sheet');
  if (d.open) d.close();
  const muc = checklistMacDinh(v.nhom).map((m) => ({ ...m, dat: null, ghiChu: '' }));
  const truoc = ntCuaViec(db, ct.ma, v.id);
  const coDeXuat = muc.some((m) => m.deXuat);
  const ve = () => {
    $('#ds', d).innerHTML = muc.map((m, i) => `<div class="nthu-muc">
      <div class="row"><span>${esc(m.noiDung)}${m.deXuat ? ' <span class="muted">*</span>' : ''}</span>
        <span class="nthu-nut"><button data-i="${i}" data-dat="1" class="${m.dat === true ? 'on' : ''}">Đạt</button><button data-i="${i}" data-dat="0" class="${m.dat === false ? 'on loi' : ''}">Lỗi</button></span></div>
      ${m.dat === false ? `<input data-gc="${i}" value="${esc(m.ghiChu)}" placeholder="Lỗi gì, ở đâu (vd: WC2 góc trái bộp 3 viên)">` : ''}</div>`).join('');
    d.querySelectorAll('[data-dat]').forEach((b) => { b.onclick = () => { muc[+b.dataset.i].dat = b.dataset.dat === '1'; ve(); }; });
    d.querySelectorAll('[data-gc]').forEach((inp) => { inp.oninput = () => { muc[+inp.dataset.gc].ghiChu = inp.value; }; });
    $('#hanO', d).hidden = !muc.some((m) => m.dat === false);
  };
  d.innerHTML = `<h2>Nghiệm thu: ${esc(v.hangMuc)}</h2>
    <p class="muted">${esc(ct.ma)}${v.nhaThau ? ' · thầu ' + esc(v.nhaThau) : ''}${v.thucTe && v.thucTe.ketThuc ? ' · xong ' + ddmm(v.thucTe.ketThuc) : ''}${truoc.length ? ` · đã nghiệm thu ${truoc.length} lần` : ''}</p>
    <div id="ds"></div>
    <div class="actions"><input id="mucMoi" placeholder="Thêm mục kiểm tra"><button id="themMuc">Thêm</button></div>
    <div id="hanO"><label class="f">Hạn sửa tồn tại</label><input id="han" type="date" value="${addDaysUI(homNay(), HAN_SUA_MAC_DINH)}"></div>
    <label class="f">Ghi chú</label><div class="mic"><textarea id="gc" placeholder="Vd: thầu hẹn thứ 7 sửa"></textarea><button id="noi">🎤</button></div>
    <label class="btn" style="display:block;text-align:center;margin-top:12px">📷 Chụp ảnh nghiệm thu (bắt buộc)<input id="anh" type="file" accept="image/*" capture="environment" multiple hidden></label>
    <p id="soAnh" class="muted"></p>
    ${coDeXuat ? '<p class="muted">* Mục em đề xuất, chưa có trong hồ sơ nghiệm thu của KAS. Thầy duyệt lại.</p>' : ''}
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu nghiệm thu</button></div>`;
  ve();
  d.showModal();
  $('#themMuc', d).onclick = () => { const t = $('#mucMoi', d).value.trim(); if (!t) return; muc.push({ noiDung: t, deXuat: false, dat: null, ghiChu: '' }); $('#mucMoi', d).value = ''; ve(); };
  $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
  $('#anh', d).onchange = () => { const k = $('#anh', d).files.length; $('#soAnh', d).textContent = k ? `${k} ảnh` : ''; };
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = async () => {
    if (muc.some((m) => m.dat === null)) return bao('Chấm hết các mục: Đạt hoặc Lỗi');
    const files = [...$('#anh', d).files];
    if (!files.length && daKetNoi()) return bao('Cần ít nhất 1 ảnh nghiệm thu');
    const n = nghiemThu(db, ct, v.id, { ngay: homNay(), muc, ghiChu: $('#gc', d).value.trim(), soAnh: files.length, hanSua: $('#han', d).value }, vaiTro);
    d.close();
    luu();
    if (files.length) await guiAnhHienTruong(files, ct.ma, v.id);
    bao(n.tonTai.length ? `Đã lưu, ${n.tonTai.length} tồn tại cần sửa` : 'Đã lưu: đạt'); route();
  };
}

// Hôm nay: việc chờ nghiệm thu, tồn tại cần sửa, công trình đủ điều kiện đo nội thất.
function nghiemThuHomNay(hn) {
  const xong = (ma) => congTrinhDaXong(db, ma);
  const cho = choNghiemThu(db, hn, xong);
  const tt = tonTaiMo(db, hn).filter((x) => !xong(x.ct.ma));
  const doNT = canDoNoiThat(db, xong);
  let h = '';
  if (cho.length) h += `<h3>Cần nghiệm thu (${cho.length})</h3>${cho.slice(0, 5).map(({ ct, v, ngay }) => `<button class="card" data-nthu="${esc(ct.ma)}|${esc(v.id)}"><div class="row"><span class="name">${esc(v.hangMuc)}</span><span class="tag ${diffDays(ngay, hn) >= 2 ? 'TRE' : 'SAP'}">Xong ${ddmm(ngay)}</span></div>
    <div class="muted">${esc(ct.ma)}${v.nhaThau ? ' · thầu ' + esc(v.nhaThau) : ''} · chấm checklist + chụp ảnh</div></button>`).join('')}${cho.length > 5 ? `<p class="muted">Còn ${cho.length - 5} việc nữa, xem ở mục Nghiệm thu trong trang từng công trình.</p>` : ''}`;
  if (tt.length) h += `<h3>Tồn tại cần sửa</h3>${tt.map((x) => theTonTai(x, hn)).join('')}`;
  if (doNT.length) h += `<h3>Đo sản xuất nội thất</h3>${doNT.map(({ ct, vDo }) => `<button class="card" data-ct="${esc(ct.ma)}" data-viec="${esc(vDo.id)}"><div class="row"><span class="name">${esc(ct.ma)}: đủ điều kiện đo</span><span class="tag DANG">Gọi xưởng</span></div>
    <div class="muted">Đã xong thạch cao, sơn bả / trát, sàn. Hẹn xưởng đo, bấm vào để cập nhật.</div></button>`).join('')}`;
  return h;
}

// Trang công trình: nghiệm thu, tồn tại, điều kiện đo nội thất.
function khoiNghiemThu(ct) {
  const hn = homNay();
  const dsViec = ct.viec.filter((v) => v.phanTram >= 100 && canNghiemThu(v));
  const dk = dieuKienDo(ct);
  const tt = tonTaiMo(db, hn, ct.ma);
  if (!dsViec.length && !dk.coDo) return '';
  const kq = dsViec.map((v) => ({ v, r: ketQuaViec(db, ct, v) }));
  const dem = (k) => kq.filter((x) => x.r.tt === k).length;
  return `<h3>Nghiệm thu</h3>
    ${dsViec.length ? `<p class="muted">${dsViec.length} việc thầu đã xong: ${dem('DAT')} đạt · ${dem('TON_TAI')} còn tồn tại · ${dem('CHUA')} chưa nghiệm thu</p>` : ''}
    ${tt.map((x) => theTonTai(x, hn)).join('')}
    ${kq.filter((x) => x.r.tt === 'CHUA').map(({ v }) => `<button class="card" data-nthu="${esc(ct.ma)}|${esc(v.id)}"><div class="row"><span class="name">${esc(v.hangMuc)}</span><span class="tag SAP">Chưa nghiệm thu</span></div>
      <div class="muted">${v.nhaThau ? 'thầu ' + esc(v.nhaThau) + ' · ' : ''}xong ${ddmm((v.thucTe || {}).ketThuc)}</div></button>`).join('')}
    ${dk.coDo ? `<p class="${dk.du ? '' : 'muted'}">Đo sản xuất nội thất: ${dk.vDo.phanTram > 0 ? 'đã bắt đầu' : dk.du ? '<b>đủ điều kiện, hẹn xưởng đo</b>' : 'chờ xong ' + dk.thieu.map(esc).join(', ')}</p>` : ''}`;
}

// ---------- Marketing, lead ----------
const dauKhach = (tab) => `<div class="loc doan khong-in">${[['khach', 'Sổ khách'], ['link-dk', 'Form, mẫu tin'], ['marketing', 'Marketing'], ['dang-bai', 'Đăng bài']]
  .map(([h, t]) => `<a class="btn ${h === tab ? 'on' : ''}" href="#${h}">${t}</a>`).join('')}</div>`;
let kyMkt = 'NAM';
const KY_MKT = { THANG: 'Tháng này', QUY: '3 tháng', NAM: 'Năm nay', TAT: 'Tất cả' };

// Tháng này so với mục tiêu Thầy đặt (lead, khách ký, tỉ lệ chốt, chi quảng cáo so với ngân sách).
function khoiMucTieuThang(hn) {
  const t = tienDoThang(db, hn);
  const c = t.cd;
  const thanh = (gt, mt) => `<div class="bar"><i style="width:${Math.min(100, mt ? Math.round((gt / mt) * 100) : 0)}%"></i></div>`;
  const ten = { mktNganSach: 'Ngân sách quảng cáo/tháng', mktMucTieuLead: 'Mục tiêu lead mới/tháng', mktMucTieuKy: 'Mục tiêu khách ký/tháng', mktTyLe: 'Tỉ lệ chốt mong muốn (%)', mktTyLeTC: 'Tỉ lệ chốt HĐ thi công (%)', hhTK: 'Hoa hồng giới thiệu HĐ thiết kế (%)', hhTC: 'Hoa hồng giới thiệu HĐ thi công (%)' };
  return `<h3>Tháng ${hn.slice(5, 7)} so với mục tiêu <span class="muted">(ngày ${t.ngay}/${t.soNgay})</span></h3>
    <div class="card">
      <div class="row"><span>Lead mới</span><b class="${t.lead < t.leadTheoNhip ? 'tre' : ''}">${t.lead} / ${c.mktMucTieuLead}</b></div>${thanh(t.lead, c.mktMucTieuLead)}
      <div class="muted">Theo nhịp đến hôm nay cần khoảng ${t.leadTheoNhip} lead</div>
      <div class="row"><span>Khách ký HĐ</span><b>${t.ky} / ${c.mktMucTieuKy}</b></div>${thanh(t.ky, c.mktMucTieuKy)}
      <div class="row"><span>Tỉ lệ chốt</span><b>${t.tyLe === null ? '—' : t.tyLe + '%'} <span class="muted">/ ${c.mktTyLe}%</span></b></div>
      <div class="row"><span>Tỉ lệ chốt thi công</span><b>${t.tyLeTC === null ? '—' : t.tyLeTC + '%'} <span class="muted">/ ${c.mktTyLeTC}%</span></b></div>
      <div class="row"><span>Chi quảng cáo</span><b class="${t.chi > c.mktNganSach ? 'tre' : ''}">${tienGon(t.chi)} / ${tienGon(c.mktNganSach)}</b></div>${thanh(t.chi, c.mktNganSach)}
      <div class="muted">${t.chi > t.chiTheoNhip * 1.2 ? '<span class="tre">Tiêu nhanh hơn nhịp tháng.</span> ' : ''}${t.chiMoiLead ? `${tienGon(t.chiMoiLead)}/lead · ` : ''}${t.chiMoiKy ? `${tienGon(t.chiMoiKy)}/khách ký · ` : ''}ngân sách ÷ mục tiêu = ${tienGon(Math.round(c.mktNganSach / Math.max(1, c.mktMucTieuLead)))}/lead</div>
    </div>
    <details class="cham-ds"><summary>Cài đặt mục tiêu, hoa hồng</summary>
      ${Object.keys(MAC_DINH).map((k) => `<label class="f">${ten[k]}</label><input id="cd-${k}" inputmode="decimal" value="${esc((db.caiDat || {})[k] ?? '')}" placeholder="Mặc định ${k === 'mktNganSach' ? tienGon(MAC_DINH[k]) : MAC_DINH[k]}">`).join('')}
      <p class="muted">Để trống là dùng mặc định Thầy chốt 13/11. Hoa hồng thực tế vẫn sửa tay trong hồ sơ từng khách.</p>
      <div class="actions"><button id="luuMkt" class="btn-chinh">Lưu</button></div>
    </details>`;
}

function manMarketing() {
  datTab('khach', 'Marketing');
  const hn = homNay();
  const [tu, den] = khoangKy(kyMkt, hn);
  const bc = baoCaoNguon(db, tu, den);
  const t = bc.tong;
  const gt = dsNguoiGioiThieu(db);
  const pct = (x) => (x === null ? '—' : x + '%');
  const thuTuTT = ['MOI', 'LIEN_HE', 'HEN_GAP', 'KHAO_SAT', 'BAO_GIA', 'KY', 'TAM_HOAN', 'MAT'];
  $('#view').innerHTML = `${dauKhach('marketing')}
    ${khoiMucTieuThang(hn)}
    <h3>Theo kỳ</h3>
    <div class="loc">${Object.entries(KY_MKT).map(([k, ten]) => `<button data-ky="${k}" class="${k === kyMkt ? 'on' : ''}">${ten}</button>`).join('')}</div>
    <div class="so-lieu bon"><div><span>Khách mới</span><b>${t.moi}</b></div><div><span>Đã ký</span><b>${t.ky}</b><span>${pct(t.tyLe)}</span></div>
      <div><span>Giá trị HĐ ký</span><b>${tienGon(t.giaTri)}</b></div><div><span>Chi quảng cáo</span><b class="tien-chi">${tienGon(t.chi)}</b>${t.chiMoiKhach ? `<span>${tienGon(t.chiMoiKhach)}/khách</span>` : ''}</div></div>
    <div class="actions"><button id="ghiMkt">+ Ghi chi quảng cáo</button></div>
    <h3>Theo nguồn khách</h3>
    ${bc.ds.length ? bc.ds.map((r) => `<div class="card"><div class="row"><span class="name">${esc(r.nguon)}</span><span>${r.moi} khách · ký ${r.ky}${r.tyLe !== null ? ` (${r.tyLe}%)` : ''}</span></div>
      <div class="muted">${r.giaTri ? 'HĐ ' + tienGon(r.giaTri) : 'Chưa có HĐ'}${r.chi ? ` · chi ${tienGon(r.chi)}${r.chiMoiKhach ? ` · ${tienGon(r.chiMoiKhach)}/khách` : ''}${r.chiMoiKy ? ` · ${tienGon(r.chiMoiKy)}/khách ký` : r.chi && !r.ky ? ' · <span class="tre">chưa ra khách ký</span>' : ''}` : ''}</div>
      ${r.nguon === CHUA_GAN ? '<div class="muted">Khoản "CTY - Marketing" chưa ghi kênh ở ô Đối tượng. Sửa khoản đó trong Tiền → Thu chi.</div>' : ''}</div>`).join('') : '<p class="muted">Chưa có khách nào trong kỳ này.</p>'}
    ${t.moi ? `<h3>Khách đang ở bước nào</h3><div class="card">${thuTuTT.filter((k) => bc.pheu[k]).map((k) => `<div class="row"><span>${TRANG_THAI[k]}</span><b>${bc.pheu[k]}</b></div>`).join('')}
      ${Object.keys(bc.lyDoMat).length ? `<div class="muted">Lý do mất: ${Object.entries(bc.lyDoMat).sort((a, b) => b[1] - a[1]).map(([l, n]) => `${esc(l)} ${n}`).join(' · ')}</div>` : ''}</div>` : ''}
    <h3>Người giới thiệu</h3>
    ${gt.length ? gt.map((r) => `<div class="card"><div class="row"><span class="name">${esc(r.ten)}</span><span>${r.khach.length} khách · ký ${r.ky}</span></div>
      <div class="muted">${r.sdt ? telLink(r.sdt) + ' · ' : ''}${[r.giaTri ? 'HĐ ' + tienGon(r.giaTri) : '', r.hoaHong ? `hoa hồng ${tienGon(r.hoaHong)}${r.daTra ? `, đã trả ${tienGon(r.daTra)}` : ''}` : ''].filter(Boolean).join(' · ')}</div>
      ${r.duKien ? `<div class="muted">Hoa hồng dự kiến theo % mặc định (chưa ghi số): ${tienGon(r.duKien)}</div>` : ''}
      ${r.chuaTra.length ? `<div class="tre">Chưa trả / chưa cảm ơn: ${r.chuaTra.map((k) => `<a href="#kh-${esc(k.ma)}">${esc(k.ten)}</a>`).join(', ')}</div>` : ''}
      <div class="muted">${r.khach.map((k) => `<a href="#kh-${esc(k.ma)}">${esc(k.ten)}</a> (${TRANG_THAI[k.trangThai] || k.trangThai})`).join(', ')}</div></div>`).join('') : '<p class="muted">Chưa có khách nào ghi người giới thiệu.</p>'}
    <p class="muted">Khách tính theo ngày khách liên hệ lần đầu. Chi quảng cáo lấy từ khoản "CTY - Marketing" ghi kênh ở ô Đối tượng.</p>`;
  $('#view').querySelectorAll('[data-ky]').forEach((b) => { b.onclick = () => { kyMkt = b.dataset.ky; manMarketing(); }; });
  $('#luuMkt').onclick = () => {
    for (const k of Object.keys(MAC_DINH)) {
      const v = $('#cd-' + k).value.trim();
      const so = k === 'mktNganSach' ? docTien(v) : Number(v.replace(',', '.'));
      datCaiDat(db, k, v === '' ? '' : String(Number.isFinite(so) ? so : MAC_DINH[k]));
    }
    luu(); bao('Đã lưu mục tiêu'); manMarketing();
  };
  $('#ghiMkt').onclick = () => moGhiKhoan({ loai: 'CHI', ma: CTY, hangMuc: HM_MKT });
}

// ---------- Đăng bài: AI viết, Thầy duyệt, máy chủ đăng ----------
let tuanBD = null;
let chuDeAI = [];
let dangGoiAI = false;
const thuAnhBD = new Map(); // mã ảnh → ảnh nhỏ base64
const anhDayDu = new Map(); // mã ảnh → { base64, loai }
const TAG_BD = { NHAP: 'SAP', CHO_DUYET: 'SAP', DUYET: 'DANG', DA_DANG: 'XONG' };
const dichBiaChon = {}; // mã bài → 'MXH' | 'WEB': đang làm ảnh bìa cho kênh nào
// Chuyên mục, thẻ website (lấy từ WordPress, giữ trên máy để mở nhanh lần sau).
let wpDM = (() => { try { return JSON.parse(localStorage.getItem('kas-wp-dm')) || null; } catch { return null; } })();
async function taiWpDM(ep = false) {
  if ((wpDM && !ep) || !daKetNoi() || !navigator.onLine) return wpDM;
  try { wpDM = await goi('wpDanhMuc'); try { localStorage.setItem('kas-wp-dm', JSON.stringify(wpDM)); } catch { /* bộ nhớ đầy */ } } catch { /* máy chủ cũ, mất mạng */ }
  return wpDM;
}
// Chuyên mục mặc định: Cài đặt đăng bài, chưa đặt thì mục "Chia sẻ" (Thầy chốt 13/11).
const chuyenMucMD = () => Number((db.caiDat || {}).bdWebChuyenMuc) || ((wpDM && wpDM.chuyenMuc.find((c) => /^chia s/i.test(c.ten))) || {}).id || '';
const ochonChuyenMuc = (id, chon) => (wpDM && wpDM.chuyenMuc.length
  ? `<select id="${id}"><option value="">Không chọn (WordPress tự để mục mặc định)</option>${wpDM.chuyenMuc.map((c) => `<option value="${c.id}" ${Number(chon) === c.id ? 'selected' : ''}>${esc(c.ten)}</option>`).join('')}</select>`
  : `<input id="${id}" inputmode="numeric" value="${esc(chon || '')}" placeholder="Mã số chuyên mục">`);
// Gửi ngay các thay đổi của bài còn chờ gửi, trước khi nhờ máy chủ làm (đăng, làm bìa…), để bản máy chủ trả về không thiếu chữ vừa gõ.
async function guiThayDoiBai(id) {
  const ops = (db.outbox || []).filter((o) => o.loai === 'BD' && o.b && o.b.id === id);
  if (!ops.length) return;
  const kq = await goi('dayLen', { ops });
  const xong = new Set(kq.filter((x) => x.ok || !/^Loại thay đổi lạ/.test(x.loi || '')).map((x) => x.idGui));
  db.outbox = db.outbox.filter((o) => !xong.has(o.idGui)); ghi(db);
  const loi = kq.find((x) => !x.ok);
  if (loi) throw new Error('Máy chủ từ chối: ' + loi.loi);
}

function kenhNho(b) {
  return (b.kenh || []).map((k) => `${KENH[k]}${kenhXong(b, k) ? ' ✓' : kenhLoi(b, k) ? ' ⚠' : ''}`).join(' · ');
}

function theBai(b) {
  return `<a class="card" href="#${esc(b.id)}"><div class="row"><span class="name">${esc(b.chuDe || '(chưa có chủ đề)')}</span><span class="tag ${coLoi(b) ? 'TRE' : TAG_BD[b.trangThai]}">${coLoi(b) ? 'Đăng lỗi' : TT_BAI[b.trangThai]}</span></div>
    <div class="muted">${LOAI_BAI[b.loai]} · ${kenhNho(b)}${b.ngayDang ? ` · ${ddmm(b.ngayDang)} ${esc(b.gioDang || caiDatBD(db.caiDat).bdGio)}` : ' · chưa hẹn ngày'}</div></a>`;
}

// Hôm nay (văn phòng): bài chờ Thầy duyệt, bài đến ngày phải đăng tay TikTok, bài đăng lỗi; từ thứ 5 nhắc tuần còn thiếu bài.
// Chi AI tháng này ngay đầu màn Hôm nay (chỉ văn phòng, máy chủ chỉ gửi bảng ChiAI cho văn phòng). Chạm để mở Đăng bài.
function chiAIHomNay(hn) {
  const ai = chiAIThang(db, hn), h = hanMucAI(db.caiDat);
  const usd = (x) => String(x).replace('.', ',') + ' USD';
  const o = (ten, x0, han) => {
    const x = soVoiHan(x0, han, h.aiTyGia);
    const canh = x.muc === 'VUOT' ? `<span class="tre">Vượt hạn mức ${x.pct}%</span>` : x.muc === 'GAN' ? `<span class="tre">Đã ${x.pct}% hạn mức</span>` : x.han ? `<span>${x.pct}% hạn mức ${tienGon(x.han)}</span>` : `<span>${x.lan} lần gọi</span>`;
    return `<a href="#dang-bai" class="${x.muc ? 'canh' : ''}"><span>${ten}</span><b>${usd(x.usd)}</b><span>≈ ${tienGon(x.dong)}</span>${canh}</a>`;
  };
  return `<div class="so-lieu chi-ai">${o('Claude tháng ' + hn.slice(5, 7), ai.claude, h.aiHanClaude)}${o('Gemini tháng ' + hn.slice(5, 7), ai.gemini, h.aiHanGemini)}</div>`;
}

function baiHomNay(hn) {
  if (!laVanPhong()) return '';
  const cho = choDuyet(db), tay = choDangTay(db, hn), loi = loiDang(db);
  const thieu = lichTuan(db, dauTuan(hn)).kenh.filter((x) => x.thieu);
  const thu = new Date(hn + 'T00:00:00Z').getUTCDay();
  const nhacThieu = thieu.length && (thu >= 4 || thu === 0);
  if (!cho.length && !tay.length && !loi.length && !nhacThieu) return '';
  return `<h3>Đăng bài</h3>
    ${cho.length ? `<a class="card" href="#dang-bai"><div class="row"><span class="name">${cho.length} bài chờ Thầy duyệt</span><span class="tag SAP">Duyệt</span></div><div class="muted">${cho.slice(0, 3).map((b) => esc(b.chuDe || 'Bài chưa có chủ đề')).join(' · ')}</div></a>` : ''}
    ${tay.map((b) => `<a class="card" href="#${esc(b.id)}"><div class="row"><span class="name">Đăng tay ${b.kenh.filter((k) => !KENH_TU_DONG.includes(k) && !kenhXong(b, k)).map((k) => KENH[k]).join(', ')}</span><span class="tag SAP">${ddmm(b.ngayDang)}</span></div><div class="muted">${esc(b.chuDe)}</div></a>`).join('')}
    ${loi.map(theBai).join('')}
    ${nhacThieu ? `<p class="muted">Tuần này còn thiếu: ${thieu.map((x) => `${x.ten} ${x.thieu} bài`).join(', ')}. <a href="#dang-bai">Lên lịch</a></p>` : ''}`;
}

function manDangBai() {
  datTab('khach', 'Đăng bài');
  const hn = homNay();
  tuanBD = tuanBD || dauTuan(hn);
  const cd = caiDatBD(db.caiDat);
  const lt = lichTuan(db, tuanBD, cd);
  const cho = choDuyet(db), loi = loiDang(db), chua = chuaHen(db), goiY = goiYCongTrinh(db), da = daDangGanDay(db);
  const ai = chiAIThang(db, hn);
  const THU = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  $('#view').innerHTML = `${dauKhach('dang-bai')}
    <div class="actions"><button id="baiMoi" class="btn-chinh">+ Bài mới</button><button id="timCD">AI tìm chủ đề</button></div>
    ${cho.length ? `<h3>Chờ Thầy duyệt</h3>${cho.map(theBai).join('')}` : ''}
    ${loi.length ? `<h3>Đăng lỗi</h3>${loi.map(theBai).join('')}` : ''}
    <div class="dau-ct"><h3>Tuần ${ddmm(tuanBD)} – ${ddmm(addDays(tuanBD, 6))}</h3><span><button id="tuanTruoc" class="nho-nut">‹</button> <button id="tuanSau" class="nho-nut">›</button></span></div>
    <div class="so-lieu">${lt.kenh.map((x) => `<div><span>${x.ten}</span><b class="${x.thieu ? 'tre' : ''}">${x.co}/${x.can}</b></div>`).join('')}</div>
    ${lt.ngay.map((d, i) => `<div class="bd-ngay ${d.ngay === hn ? 'hom-nay' : ''}"><div class="row"><b>${THU[i]} ${ddmm(d.ngay)}</b><button class="nho-nut" data-them-ngay="${d.ngay}">+ bài</button></div>
      ${d.bai.length ? d.bai.map(theBai).join('') : ''}</div>`).join('')}
    ${chua.length ? `<h3>Chưa hẹn ngày</h3>${chua.map(theBai).join('')}` : ''}
    ${goiY.length || chuDeAI.length ? '<h3>Gợi ý chủ đề</h3>' : ''}
    ${goiY.map((ct) => `<div class="card"><div class="row"><span class="name">Dự án ${esc(ct.ten)}</span><button class="nho-nut" data-goi-ct="${esc(ct.ma)}">Tạo bài</button></div><div class="muted">Chủ nhà đã cho đăng ảnh, chưa có bài nào.</div></div>`).join('')}
    ${chuDeAI.map((x, i) => `<div class="card"><div class="row"><span class="name">${esc(x.tieuDe)}</span><button class="nho-nut" data-goi-ai="${i}">Tạo bài</button></div>
      <div class="muted">${LOAI_BAI[x.loai] || ''}${x.viSao ? ' · ' + esc(x.viSao) : ''}${x.nguon ? ` · <a href="${esc(x.nguon)}" target="_blank" rel="noopener">nguồn</a>` : ''}</div></div>`).join('')}
    ${da.length ? `<h3>Đã đăng gần đây</h3>${da.map(theBai).join('')}` : ''}
    <details class="cham-ds"><summary>Cài đặt đăng bài</summary>
      <div class="hai-cot"><div><label class="f">Facebook bài/tuần</label><input id="bdFB" inputmode="numeric" value="${esc((db.caiDat || {}).bdFB ?? '')}" placeholder="${MAC_DINH_BD.bdFB}"></div>
        <div><label class="f">TikTok bài/tuần</label><input id="bdTT" inputmode="numeric" value="${esc((db.caiDat || {}).bdTT ?? '')}" placeholder="${MAC_DINH_BD.bdTT}"></div></div>
      <div class="hai-cot"><div><label class="f">Website bài/tuần</label><input id="bdWEB" inputmode="numeric" value="${esc((db.caiDat || {}).bdWEB ?? '')}" placeholder="${MAC_DINH_BD.bdWEB}"></div>
        <div><label class="f">Giờ đăng mặc định</label><input id="bdGio" type="time" value="${esc(cd.bdGio)}"></div></div>
      <label class="f">AI viết bài</label><select id="bdModel">${Object.entries(MODEL).map(([k, t]) => `<option value="${k}" ${k === cd.bdModel ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <label class="f">Gemini làm ảnh bìa</label><select id="bdGemini">${Object.entries(MODEL_ANH).map(([k, t]) => `<option value="${k}" ${k === cd.bdGemini ? 'selected' : ''}>${t}</option>`).join('')}</select>
      <label class="f">Bài website khi đăng</label><select id="bdWebTrangThai"><option value="draft" ${cd.bdWebTrangThai === 'draft' ? 'selected' : ''}>Lưu nháp trên web, Thầy xem rồi bấm đăng</option><option value="publish" ${cd.bdWebTrangThai === 'publish' ? 'selected' : ''}>Đăng luôn</option></select>
      <label class="f">Chuyên mục website mặc định</label><span id="oCM">${ochonChuyenMuc('bdWebChuyenMuc', chuyenMucMD())}</span>
      ${vaiTro === 'THAY' ? '<div class="actions"><button id="kiemWP">Kiểm tra kết nối website</button></div><p id="wpTT" class="muted"></p>' : ''}
      <p class="muted">Chi AI tháng này: Claude ${String(ai.claude.usd).replace('.', ',')} USD (${ai.claude.lan} lần), Gemini ${String(ai.gemini.usd).replace('.', ',')} USD (${ai.gemini.lan} ảnh). Màn Hôm nay cũng hiện số này.</p>
      <div class="hai-cot"><div><label class="f">Hạn mức Claude/tháng (đ)</label><input id="aiHanClaude" inputmode="numeric" value="${esc((db.caiDat || {}).aiHanClaude ?? '')}" placeholder="Không đặt"></div>
        <div><label class="f">Hạn mức Gemini/tháng (đ)</label><input id="aiHanGemini" inputmode="numeric" value="${esc((db.caiDat || {}).aiHanGemini ?? '')}" placeholder="${MAC_DINH_HAN.aiHanGemini}"></div></div>
      <label class="f">Tỷ giá quy đổi (đ/USD)</label><input id="aiTyGia" inputmode="numeric" value="${esc((db.caiDat || {}).aiTyGia ?? '')}" placeholder="${MAC_DINH_HAN.aiTyGia}">
      <p class="muted">Đạt 90% hạn mức thì ô chi AI ở màn Hôm nay chuyển đỏ.</p>
      <div class="actions"><button id="luuBD" class="btn-chinh">Lưu</button></div>
      <h4>Canva</h4><p id="canvaTT" class="muted">${daKetNoi() ? 'Đang kiểm tra…' : 'Bản thử: cần nối máy chủ.'}</p>
      ${vaiTro === 'THAY' ? '<div class="actions"><button id="noiCanva">Nối Canva</button></div>' : ''}
    </details>
    <p class="muted">Không bài nào lên mạng khi Thầy chưa duyệt. Facebook, Instagram, website tự đăng đúng ngày giờ hẹn; TikTok đến ngày thì đăng tay.</p>`;
  const v = $('#view');
  const moi = (du) => { const b = taoBai(db, du, vaiTro); luu(); location.hash = b.id; };
  $('#baiMoi').onclick = () => moi({});
  $('#tuanTruoc').onclick = () => { tuanBD = addDays(tuanBD, -7); manDangBai(); };
  $('#tuanSau').onclick = () => { tuanBD = addDays(tuanBD, 7); manDangBai(); };
  v.querySelectorAll('[data-them-ngay]').forEach((b) => { b.onclick = () => moi({ ngayDang: b.dataset.themNgay }); });
  v.querySelectorAll('[data-goi-ct]').forEach((b) => { b.onclick = () => moi({ loai: 'DU_AN', maCongTrinh: b.dataset.goiCt }); });
  v.querySelectorAll('[data-goi-ai]').forEach((b) => {
    b.onclick = () => {
      const x = chuDeAI[Number(b.dataset.goiAi)];
      chuDeAI = chuDeAI.filter((y) => y !== x);
      moi({ loai: x.loai, chuDe: x.tieuDe, ghiChu: [x.viSao, x.nguon ? 'Nguồn: ' + x.nguon : ''].filter(Boolean).join('\n'), kenh: (x.kenh || []).filter((k) => KENH[k]), maCongTrinh: x.maCongTrinh || '' });
    };
  });
  $('#timCD').onclick = async () => {
    if (!daKetNoi()) return bao('Bản thử: cần nối máy chủ để AI tìm chủ đề');
    if (!navigator.onLine) return bao('Cần mạng để AI tìm chủ đề');
    const nut = $('#timCD'); nut.disabled = true; nut.textContent = 'AI đang tìm…';
    try { chuDeAI = await goi('timChuDe', { soLuong: 8 }); bao(`AI gợi ý ${chuDeAI.length} chủ đề`); } catch (e) { bao(e.message); }
    chayDongBo();
    if (location.hash === '#dang-bai') manDangBai();
  };
  const caiDatChiTiet = v.querySelector('details.cham-ds');
  caiDatChiTiet.addEventListener('toggle', async () => {
    if (!caiDatChiTiet.open || !daKetNoi() || !navigator.onLine) return;
    const chon = $('#bdWebChuyenMuc') && $('#bdWebChuyenMuc').value;
    taiWpDM(true).then(() => { if ($('#oCM') && wpDM) $('#oCM').innerHTML = ochonChuyenMuc('bdWebChuyenMuc', Number(chon) || chuyenMucMD()); });
    try {
      const t = await goi('canvaTrangThai');
      $('#canvaTT').innerHTML = `${t.daNoi ? 'Đã nối Canva.' : t.coKhoa ? 'Chưa nối Canva: Thầy bấm Nối Canva, đăng nhập rồi bấm Cho phép.' : 'Chưa có khoá Canva trên máy chủ (xem hướng dẫn cài).'}
        ${t.coGemini ? ' Gemini: đã có khoá.' : ' Gemini: chưa có khoá.'}<br>Địa chỉ chuyển về (dán vào Canva khi tạo tích hợp): <code>${esc(t.redirect)}</code>`;
    } catch (e) { $('#canvaTT').textContent = e.message.includes('Không có thao tác') ? 'Máy chủ chưa cập nhật bản có Canva, Gemini.' : e.message; }
  });
  if ($('#noiCanva')) $('#noiCanva').onclick = async () => {
    if (!daKetNoi()) return bao('Bản thử: cần nối máy chủ');
    const w = window.open('', '_blank');
    try { const r = await goi('canvaNoi'); if (w) w.location = r.url; else location.href = r.url; } catch (e) { if (w) w.close(); bao(e.message); }
  };
  if ($('#kiemWP')) $('#kiemWP').onclick = async () => {
    if (!daKetNoi()) return bao('Bản thử: cần nối máy chủ');
    $('#wpTT').textContent = 'Đang hỏi website…';
    try {
      const r = await goi('kiemTraWP');
      $('#wpTT').textContent = `✓ Website nhận ra tài khoản ${r.ten} (vai trò: ${r.vaiTro.join(', ') || 'không rõ'}). ${r.dangDuoc ? 'Đăng bài, tải ảnh được.' : 'Tài khoản chưa đủ quyền đăng bài, tải ảnh: cần vai trò Biên tập viên hoặc Quản trị viên.'}`;
    } catch (e) { $('#wpTT').textContent = e.message.includes('Không có thao tác') ? 'Máy chủ chưa cập nhật bản mới.' : e.message; }
  };
  $('#luuBD').onclick = () => {
    ['bdFB', 'bdTT', 'bdWEB'].forEach((k) => { const x = $('#' + k).value.trim(); datCaiDat(db, k, x === '' ? '' : String(Math.max(0, Number(x) || 0))); });
    datCaiDat(db, 'bdGio', $('#bdGio').value || '');
    datCaiDat(db, 'bdModel', $('#bdModel').value);
    datCaiDat(db, 'bdGemini', $('#bdGemini').value);
    ['aiHanClaude', 'aiHanGemini', 'aiTyGia'].forEach((k) => datCaiDat(db, k, String($('#' + k).value).replace(/[^\d]/g, '')));
    datCaiDat(db, 'bdWebTrangThai', $('#bdWebTrangThai').value);
    datCaiDat(db, 'bdWebChuyenMuc', String(Number($('#bdWebChuyenMuc').value) || ''));
    luu(); bao('Đã lưu cài đặt đăng bài'); manDangBai();
  };
}

// Ảnh: mã ảnh → base64 (ảnh còn chờ gửi trên máy, hoặc lấy từ máy chủ). Ảnh nhỏ để xem, ảnh đủ để dựng bìa, chia sẻ.
async function layThuAnh(ids) {
  const thieu = [];
  for (const id of ids) {
    if (thuAnhBD.has(id)) continue;
    const a = await anhCho(id);
    if (a) thuAnhBD.set(id, a.base64); else thieu.push(id);
  }
  if (thieu.length && daKetNoi() && navigator.onLine) {
    try { (await goi('anhThu', { ids: thieu })).forEach((x) => thuAnhBD.set(x.id, x.thu)); } catch { /* chưa có mạng: hiện ô trống */ }
  }
}
async function layAnhDayDu(id) {
  if (anhDayDu.has(id)) return anhDayDu.get(id);
  const a = await anhCho(id);
  if (a) return { base64: a.base64, loai: 'image/jpeg' };
  const x = await goi('layAnh', { id });
  anhDayDu.set(id, x);
  return x;
}

async function anhChuaGui(b) {
  let n = 0;
  for (const id of [b.anhBia, b.anhBiaWeb, ...(b.dsAnh || [])].filter(Boolean)) if (await anhCho(id)) n++;
  return n;
}

// Ảnh bìa lấy từ đâu (hiện cạnh ảnh bìa).
const truongBia = (dich) => (dich === 'WEB' ? 'anhBiaWeb' : 'anhBia');
const truongCanva = (dich) => (dich === 'WEB' ? 'canvaWeb' : 'canva');
function nguonBia(b, dich = 'MXH') {
  const c = b[truongCanva(dich)];
  if (c && c.anhId && c.anhId === b[truongBia(dich)]) return ` (lấy từ Canva lúc ${gioNgay(c.layLuc)})`;
  return '';
}
const gioNgay = (iso) => { const d = new Date(iso); const p = (x) => String(x).padStart(2, '0'); return isNaN(d) ? '' : `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}`; };
function trangThaiCanva(b, dich = 'MXH') {
  const c = b[truongCanva(dich)] || {};
  if (!c.id) return 'Chưa đưa ảnh sang Canva.';
  if (c.anhId && c.anhId === b[truongBia(dich)]) return `✓ Đã lấy ảnh từ Canva lúc ${gioNgay(c.layLuc)}, ảnh bìa đã thay. Sửa tiếp: bấm "Mở lại thiết kế cũ", sửa xong lấy về lần nữa.`;
  return `Đã đưa sang Canva lúc ${gioNgay(c.luc)}. Sửa xong thì bấm bước 3.`;
}

function manMotBai(id) {
  const b = timBai(db, id);
  if (!b || b.xoa) { $('#view').innerHTML = '<p>Không tìm thấy bài này.</p><p><a href="#dang-bai">← Đăng bài</a></p>'; return; }
  datTab('khach', 'Bài đăng');
  const cd = caiDatBD(db.caiDat);
  const bv = b.baiViet || {};
  const coBai = Object.keys(bv).length > 0;
  const daDang = b.trangThai === 'DA_DANG';
  const ct = (db.congTrinh || []).find((c) => c.ma === b.maCongTrinh);
  const khoa = daDang ? 'disabled' : '';
  const kq = b.ketQua || {};
  const dsDich = dsDichBia(b.kenh || []);
  const dich = dsDich.includes(dichBiaChon[b.id]) ? dichBiaChon[b.id] : dsDich[0];
  const kho = KHO_BIA[dich] || KHO_BIA.MXH;
  const biaId = dich ? b[truongBia(dich)] : '';
  const cvB = (dich && b[truongCanva(dich)]) || {};
  const choKenh = dich === 'WEB' ? 'ảnh đại diện bài website' : 'ảnh đầu bài Facebook, Instagram';
  const theMD = Array.isArray(b.webThe) ? b.webThe : ((bv.web || {}).tuKhoa || []).slice(0, 5);
  const dongKenh = (k) => {
    const r = kq[k] || {};
    const trangThai = kenhXong(b, k) ? `<span class="tag XONG">${r.tay ? 'Đã đăng tay' : r.trangThai === 'draft' ? 'Đã lưu nháp trên web' : 'Đã đăng'}</span>${r.link ? ` <a href="${esc(r.link)}" target="_blank" rel="noopener">mở</a>` : ''}`
      : r.loi ? `<span class="tag TRE">Lỗi</span> <span class="muted">${esc(r.loi)}</span>` : '';
    const nut = [`<button class="nho-nut" data-chep="${k}">Chép chữ</button>`];
    if (!KENH_TU_DONG.includes(k) || r.loi) nut.push(`<button class="nho-nut" data-chia-se="${k}">Chia sẻ ảnh + chữ</button>`);
    if ((b.trangThai === 'DUYET' || daDang) && !kenhXong(b, k) && (!KENH_TU_DONG.includes(k) || r.loi)) nut.push(`<button class="nho-nut" data-tay="${k}">Đã đăng tay</button>`);
    return `<div class="row bd-kenh"><b>${KENH[k]}</b><span>${trangThai}</span></div><div class="actions">${nut.join('')}</div>`;
  };
  $('#view').innerHTML = `<p><a href="#dang-bai">← Đăng bài</a></p>
    <div class="row"><span class="tag ${coLoi(b) ? 'TRE' : TAG_BD[b.trangThai]}">${TT_BAI[b.trangThai]}</span>
      <span class="muted">${b.lanViet ? `AI đã viết ${b.lanViet} lần` : ''}${b.nguoiDuyet ? ` · ${tenNguoi(b.nguoiDuyet)} duyệt ${ddmm(String(b.duyetLuc).slice(0, 10))}` : ''}</span></div>
    <h3>Bài viết về gì</h3>
    <label class="f">Loại bài</label><select id="bLoai" ${khoa}>${Object.entries(LOAI_BAI).map(([k, t]) => `<option value="${k}" ${k === b.loai ? 'selected' : ''}>${t}</option>`).join('')}</select>
    <label class="f">Chủ đề</label><input id="bChuDe" value="${esc(b.chuDe)}" placeholder="Vd: Căn hộ 90m2 phong cách Indochine bàn giao tháng 11" ${khoa}>
    <label class="f">Ghi chú cho AI (điểm nhấn, chi tiết thật, điều cần tránh)</label><textarea id="bGhiChu" ${khoa}>${esc(b.ghiChu)}</textarea>
    <label class="f">Công trình</label><select id="bCT" ${khoa}><option value="">Không gắn công trình</option>${(db.congTrinh || []).map((c) => `<option value="${esc(c.ma)}" ${c.ma === b.maCongTrinh ? 'selected' : ''}>${esc(c.ma)} · ${esc(c.ten)}${c.choDangAnh ? '' : ' (chưa cho đăng ảnh)'}</option>`).join('')}</select>
    ${ct && !ct.choDangAnh ? '<p class="note">Chủ nhà chưa cho phép dùng ảnh công trình này. Hỏi chủ nhà rồi bật ở Công trình → Thông tin công trình.</p>' : ''}
    <div id="bPT" ${b.loai === 'PHONG_THUY' ? '' : 'hidden'}>
      <label class="f">Tên tài liệu phong thủy (sách, giáo trình, chương, trang)</label><input id="bNguon" value="${esc(b.nguonTL)}" ${khoa}>
      <label class="f">Đoạn tài liệu (AI chỉ viết theo đoạn này)</label><textarea id="bTrich" class="cao" ${khoa}>${esc(b.trichDan)}</textarea>
      ${daDang ? '' : '<div class="actions"><button id="ptThuVien">Lấy từ thư viện phong thủy</button></div>'}
    </div>
    <label class="f">Kênh</label><div class="bd-chon">${Object.entries(KENH).map(([k, t]) => `<label class="cham-dong"><input type="checkbox" data-kenh="${k}" ${(b.kenh || []).includes(k) ? 'checked' : ''} ${khoa}><span>${t}${KENH_TU_DONG.includes(k) ? '' : ' (đăng tay)'}</span></label>`).join('')}</div>
    <div class="hai-cot"><div><label class="f">Ngày đăng</label><input id="bNgay" type="date" value="${esc(b.ngayDang)}" ${khoa}></div>
      <div><label class="f">Giờ</label><input id="bGio" type="time" value="${esc(b.gioDang)}" placeholder="${esc(cd.bdGio)}" ${khoa}></div></div>
    <h3>Ảnh <span class="muted">(ảnh đầu dùng làm nền khi làm ảnh bìa)</span></h3>
    <div id="bAnh" class="bd-anh"></div>
    ${daDang ? '' : `<div class="actions">${b.maCongTrinh ? '<button id="chonAnhCT">Chọn ảnh công trình</button>' : ''}<label class="btn">Thêm ảnh từ máy<input id="themAnh" type="file" accept="image/*" multiple hidden></label></div>`}
    ${daDang ? '' : `<h3>AI viết</h3>
      ${coBai ? `<label class="f">Ý kiến sửa của Thầy</label><textarea id="bYKien" placeholder="Vd: mở đầu bằng câu hỏi, bớt hashtag, nhấn mạnh tiến độ đúng hẹn">${esc(b.yKien)}</textarea>` : ''}
      <div class="actions"><button id="vietAI" class="btn-chinh">${coBai ? 'AI viết lại theo ý kiến' : 'AI viết bài'}</button></div><p id="tienDoAI" class="muted"></p>`}
    ${coBai ? `<h3>Nội dung</h3>
      ${(b.kenh || []).includes('FB') ? `<label class="f">Facebook</label><textarea id="vFB" class="cao" ${khoa}>${esc(bv.fb || '')}</textarea>` : ''}
      ${(b.kenh || []).includes('IG') ? `<label class="f">Instagram</label><textarea id="vIG" class="cao" ${khoa}>${esc(bv.ig || '')}</textarea>` : ''}
      ${(b.kenh || []).includes('TT') ? `<label class="f">TikTok: tiêu đề</label><input id="vTTt" value="${esc((bv.tt || {}).tieuDe || '')}" ${khoa}>
        <label class="f">TikTok: chú thích</label><textarea id="vTTc" ${khoa}>${esc((bv.tt || {}).chuThich || '')}</textarea>
        <label class="f">TikTok: kịch bản video</label><textarea id="vTTk" class="cao" ${khoa}>${esc((bv.tt || {}).kichBan || '')}</textarea>` : ''}
      ${(b.kenh || []).includes('WEB') ? `<label class="f">Website: tiêu đề</label><input id="vWt" value="${esc((bv.web || {}).tieuDe || '')}" ${khoa}>
        <label class="f">Website: mô tả ngắn (hiện trên Google)</label><textarea id="vWm" ${khoa}>${esc((bv.web || {}).moTa || '')}</textarea>
        <label class="f">Website: bài viết (dòng "## " là tiêu đề mục)</label><textarea id="vWn" class="rat-cao" ${khoa}>${esc((bv.web || {}).noiDung || '')}</textarea>
        <label class="f">Website: từ khóa (cách nhau dấu phẩy)</label><input id="vWk" value="${esc(((bv.web || {}).tuKhoa || []).join(', '))}" ${khoa}>
        <label class="f">Website: chuyên mục</label><span id="oWcm">${ochonChuyenMuc('vWcm', b.webChuyenMuc || chuyenMucMD())}</span>
        <label class="f">Website: thẻ (tag), cách nhau dấu phẩy</label><input id="vWthe" value="${esc(theMD.join(', '))}" placeholder="Vd: nội thất chung cư, phong cách Indochine" ${khoa}>
        <div id="goiYThe" class="loc"></div>` : ''}
      <p class="muted">Chỗ AI ghi [Thầy điền: …] là số liệu AI không có, Thầy điền trước khi duyệt.</p>` : ''}
    ${dsDich.length ? `<h3>Ảnh bìa</h3>
      ${dsDich.length > 1 ? `<div class="loc">${dsDich.map((d) => `<button data-dich="${d}" class="${d === dich ? 'on' : ''}">${KHO_BIA[d].ten}</button>`).join('')}</div>` : ''}
      <p class="muted">Khổ tối ưu cho ${KHO_BIA[dich].ten}: <b>${kho.w}×${kho.h}</b> (${kho.tiLe}).${dsDich.length > 1 ? ' Mỗi kênh làm 1 ảnh bìa riêng, bấm nút trên để đổi kênh.' : ''}</p>
      <div class="bia-dung">${biaId ? '<img id="biaHienTai" class="bia" alt="Ảnh bìa đang dùng">' : ''}
        <p id="biaTT">${biaId ? `<b>Ảnh bìa đang dùng</b>${nguonBia(b, dich)}: ảnh này lên ${choKenh}.` : dich === 'WEB' && b.anhBia ? '<b>Chưa có ảnh website.</b> Web đang dùng tạm ảnh bìa Facebook (khổ dọc). Nên làm ảnh ngang riêng cho web.' : `<b>Chưa có ảnh bìa${dich === 'WEB' ? ' website' : ''}.</b> Chưa có thì ảnh đầu trong mục Ảnh được dùng làm ${choKenh}.`}</p></div>
      ${daDang ? '' : `<p class="muted">Làm ảnh bìa: chọn 1 trong 3 cách dưới. Cách nào xong cũng thay ảnh bìa ở trên.</p>
        <label class="f">Chữ trên bìa (dùng cho cách 2 và 3)</label><input id="bTieuDe" value="${esc(b.tieuDeBia)}" placeholder="Tối đa 8 chữ">
        <label class="f">Dòng phụ</label><input id="bPhuDe" value="${esc(b.phuDeBia)}">
        <details class="cham-ds" open><summary>Cách 1. Sửa trong Canva</summary>
          <ol class="buoc">
            <li><b>Đưa ảnh sang Canva.</b> App cắt ${biaId ? 'ảnh bìa đang dùng' : 'ảnh đầu của bài'} đúng khổ ${kho.w}×${kho.h} rồi mở Canva.
              <div class="actions"><button id="canvaMo"${cvB.id ? '' : ' class="btn-chinh"'}>${cvB.id ? 'Đưa ảnh mới sang Canva' : 'Đưa ảnh sang Canva'}</button>${cvB.sua ? `<a class="btn" href="${esc(cvB.sua)}" target="_blank" rel="noopener">Mở lại thiết kế cũ</a>` : ''}</div></li>
            <li><b>Sửa trên Canva</b> (thêm chữ, logo…). Canva tự lưu, không cần tải về. Sửa xong chờ 3–5 giây cho Canva lưu.</li>
            <li><b>Quay lại đây, lấy ảnh về.</b>
              <div class="actions"><button id="canvaLay"${cvB.id ? ' class="btn-chinh"' : ' disabled'}>Lấy ảnh từ Canva làm ảnh bìa</button></div></li>
          </ol>
          <p id="canvaKQ" class="muted">${trangThaiCanva(b, dich)}</p>
        </details>
        <details class="cham-ds"><summary>Cách 2. Gemini làm bìa từ ảnh đầu</summary>
          <select id="gmKieu"><option value="SANG">Giữ ảnh thật, chỉ chỉnh sáng</option><option value="CHU">In chữ trên bìa lên ảnh</option></select>
          <div class="actions"><button id="geminiBia">Gemini làm bìa ${kho.tiLe}</button></div>
          <p class="muted">Tốn khoảng 1.700đ/ảnh, cần bật thanh toán cho khoá Gemini.</p>
        </details>
        <details id="cach3" class="cham-ds"><summary>Cách 3. Dựng bìa ngay trên máy (miễn phí)</summary>
          <div class="loc">${Object.entries(MAU_BIA).map(([k, t]) => `<button data-mau="${k}" class="${k === (b.mauBia || 'TRAN') ? 'on' : ''}">${t}</button>`).join('')}</div>
          <p id="biaXem" class="muted">Xem trước (chưa phải ảnh bìa, bấm "Dùng ảnh này làm bìa" mới thay):</p>
          <canvas id="bia" class="bia"></canvas>
          <div class="actions"><button id="luuBia">Dùng ảnh này làm bìa</button><button id="guiCanva">Chia sẻ sang app Canva</button>
            <label class="btn">Thay bằng ảnh từ máy<input id="biaTuMay" type="file" accept="image/*" hidden></label></div>
        </details>`}` : ''}
    ${b.trangThai === 'DUYET' || daDang ? `<h3>Đăng</h3>${(b.kenh || []).map(dongKenh).join('')}` : coBai ? `<h3>Chép để đăng tay</h3>${(b.kenh || []).map((k) => `<div class="row bd-kenh"><b>${KENH[k]}</b><button class="nho-nut" data-chep="${k}">Chép chữ</button></div>`).join('')}` : ''}
    <div class="actions">
      ${vaiTro === 'THAY' && coBai && (b.trangThai === 'CHO_DUYET' || b.trangThai === 'NHAP') ? '<button id="duyet" class="btn-chinh">Duyệt bài</button>' : ''}
      ${vaiTro === 'THAY' && b.trangThai === 'DUYET' ? '<button id="boDuyet">Bỏ duyệt</button>' : ''}
      ${b.trangThai === 'DUYET' && (b.kenh || []).some((k) => KENH_TU_DONG.includes(k) && !kenhXong(b, k)) ? '<button id="dangNgay" class="btn-chinh">Đăng ngay</button>' : ''}
      ${daDang ? '' : '<button id="xoaBai" class="btn-do">Xoá bài</button>'}
    </div>
    ${b.trangThai === 'DUYET' ? `<p class="muted">${b.ngayDang ? `Facebook, Instagram, website tự đăng lúc ${esc(b.gioDang || cd.bdGio)} ngày ${ddmm(b.ngayDang)}.` : 'Chưa hẹn ngày: bấm Đăng ngay, hoặc chọn ngày đăng.'}</p>` : ''}`;
  ganMotBai(b);
}

function ganMotBai(b) {
  const v = $('#view');
  const daDang = b.trangThai === 'DA_DANG';
  const dsDich = dsDichBia(b.kenh || []);
  const dich = dsDich.includes(dichBiaChon[b.id]) ? dichBiaChon[b.id] : (dsDich[0] || 'MXH');
  const kho = KHO_BIA[dich];
  const truong = truongBia(dich);
  const doc = () => {
    const bv = JSON.parse(JSON.stringify(b.baiViet || {}));
    if ($('#vFB')) bv.fb = $('#vFB').value;
    if ($('#vIG')) bv.ig = $('#vIG').value;
    if ($('#vTTt')) bv.tt = { tieuDe: $('#vTTt').value, chuThich: $('#vTTc').value, kichBan: $('#vTTk').value };
    if ($('#vWt')) bv.web = { tieuDe: $('#vWt').value, moTa: $('#vWm').value, noiDung: $('#vWn').value, tuKhoa: $('#vWk').value.split(',').map((x) => x.trim()).filter(Boolean) };
    return {
      loai: $('#bLoai').value, chuDe: $('#bChuDe').value.trim(), ghiChu: $('#bGhiChu').value.trim(), maCongTrinh: $('#bCT').value,
      nguonTL: $('#bNguon').value.trim(), trichDan: $('#bTrich').value.trim(),
      kenh: [...v.querySelectorAll('[data-kenh]')].filter((x) => x.checked).map((x) => x.dataset.kenh),
      ngayDang: $('#bNgay').value, gioDang: $('#bGio').value, baiViet: bv,
      ...($('#bTieuDe') ? { tieuDeBia: $('#bTieuDe').value.trim(), phuDeBia: $('#bPhuDe').value.trim() } : {}),
      ...($('#bYKien') ? { yKien: $('#bYKien').value.trim() } : {}),
      ...($('#vWcm') ? { webChuyenMuc: Number($('#vWcm').value) || '', webThe: $('#vWthe').value.split(',').map((x) => x.trim()).filter(Boolean) } : {}),
    };
  };
  const ghiLai = (veLai = false) => { if (daDang) return; suaBai(db, b, doc()); luu(); if (veLai) manMotBai(b.id); };
  v.querySelectorAll('input:not([type=file]), textarea, select').forEach((el) => { el.addEventListener('change', () => ghiLai(['bLoai', 'bCT'].includes(el.id) || el.dataset.kenh !== undefined)); });
  // Ảnh trong bài
  const veAnh = async () => {
    const ids = b.dsAnh || [];
    const o = $('#bAnh');
    if (!o) return;
    if (!ids.length) { o.innerHTML = '<p class="muted">Chưa có ảnh.</p>'; return; }
    o.innerHTML = ids.map((id, i) => `<div class="bd-o"><img data-thu="${esc(id)}" alt="">${daDang ? '' : `<div class="bd-nut">${i ? `<button data-dau="${esc(id)}" title="Đưa lên đầu">↑</button>` : '<span class="muted">Đầu</span>'}<button data-bo="${esc(id)}" title="Bỏ">✕</button></div>`}</div>`).join('');
    o.querySelectorAll('[data-dau]').forEach((x) => { x.onclick = () => { suaBai(db, b, { dsAnh: [x.dataset.dau, ...b.dsAnh.filter((y) => y !== x.dataset.dau)] }); luu(); manMotBai(b.id); }; });
    o.querySelectorAll('[data-bo]').forEach((x) => { x.onclick = () => { suaBai(db, b, { dsAnh: b.dsAnh.filter((y) => y !== x.dataset.bo) }); luu(); manMotBai(b.id); }; });
    await layThuAnh(ids);
    o.querySelectorAll('[data-thu]').forEach((im) => { const t = thuAnhBD.get(im.dataset.thu); if (t) im.src = 'data:image/jpeg;base64,' + t; });
  };
  veAnh();
  if ($('#themAnh')) $('#themAnh').onchange = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    try {
      const ids = await xepAnhLayMa(files, b.id, 'BAI', 'BAI_DANG');
      suaBai(db, b, { ...doc(), dsAnh: [...(b.dsAnh || []), ...ids] }); luu();
      bao(`Đã thêm ${ids.length} ảnh${daKetNoi() ? ', đang gửi lên Drive' : ''}`);
      manMotBai(b.id);
    } catch (err) { bao('Không đọc được ảnh: ' + err.message); }
  };
  if ($('#chonAnhCT')) $('#chonAnhCT').onclick = () => moChonAnhCT(b);
  // Website: chuyên mục, thẻ lấy từ WordPress
  const veGoiYThe = () => {
    const o = $('#goiYThe');
    if (!o || !wpDM || daDang) return;
    o.innerHTML = wpDM.the.slice(0, 15).map((t) => `<button data-them-the="${esc(t.ten)}">+ ${esc(t.ten)}</button>`).join('');
    o.querySelectorAll('[data-them-the]').forEach((x) => {
      x.onclick = () => {
        const ds = $('#vWthe').value.split(',').map((y) => y.trim()).filter(Boolean);
        if (!ds.some((y) => y.toLowerCase() === x.dataset.themThe.toLowerCase())) ds.push(x.dataset.themThe);
        $('#vWthe').value = ds.join(', '); ghiLai();
      };
    });
  };
  if ($('#vWcm')) {
    veGoiYThe();
    taiWpDM(!wpDM).then(() => {
      if (!wpDM || !$('#oWcm') || location.hash !== '#' + b.id) return;
      const chon = $('#vWcm').value;
      $('#oWcm').innerHTML = ochonChuyenMuc('vWcm', Number(chon) || b.webChuyenMuc || chuyenMucMD());
      if (daDang) $('#vWcm').disabled = true; else $('#vWcm').addEventListener('change', () => ghiLai());
      veGoiYThe();
    });
  }
  v.querySelectorAll('[data-dich]').forEach((x) => { x.onclick = () => { ghiLai(); dichBiaChon[b.id] = x.dataset.dich; manMotBai(b.id); if ($('.bia-dung')) $('.bia-dung').scrollIntoView({ block: 'center' }); }; });
  // Ảnh bìa
  const canvas = $('#bia');
  let nen = null;
  const veLaiBia = () => { if (canvas) veBia(canvas, nen, { mau: b.mauBia || 'TRAN', tieuDe: $('#bTieuDe').value || b.chuDe, phuDe: $('#bPhuDe').value, kho }); };
  if (canvas) {
    veLaiBia();
    const dau = (b.dsAnh || [])[0];
    if (dau) layAnhDayDu(dau).then((a) => taiAnh(a.base64, a.loai)).then((im) => { nen = im; veLaiBia(); }).catch(() => { $('#biaXem').textContent = 'Chưa tải được ảnh nền để xem trước (cần mạng).'; });
    else $('#biaXem').textContent = 'Thêm ảnh ở mục Ảnh để làm nền.';
    ['bTieuDe', 'bPhuDe'].forEach((k) => { $('#' + k).addEventListener('input', veLaiBia); });
    v.querySelectorAll('[data-mau]').forEach((x) => { x.onclick = () => { suaBai(db, b, { ...doc(), mauBia: x.dataset.mau }); luu(); manMotBai(b.id); if ($('#cach3')) $('#cach3').open = true; }; });
    if ($('#luuBia')) $('#luuBia').onclick = async () => {
      if (!nen) return bao('Cần ảnh nền trước');
      const base64 = canvas.toDataURL('image/jpeg', 0.86).split(',')[1];
      const id = await xepAnhSan({ id: crypto.randomUUID(), ma: b.id, viec: 'BIA', tenFile: `${b.id}_${dich === 'WEB' ? 'biaweb' : 'bia'}_${Date.now()}.jpg`, base64, loai: 'BAI_DANG' });
      thuAnhBD.set(id, base64);
      suaBai(db, b, { ...doc(), [truong]: id }); luu();
      bao('Đã thay ảnh bìa' + (daKetNoi() ? ', đang gửi lên Drive' : ''));
      chayDongBo();
      manMotBai(b.id);
    };
    // Chia sẻ ảnh bìa sang app Canva (hoặc tải về) để Thầy sửa chi tiết.
    if ($('#guiCanva')) $('#guiCanva').onclick = async () => {
      const blob = await new Promise((ok) => canvas.toBlob(ok, 'image/jpeg', 0.9));
      const f = new File([blob], `${b.id}_bia.jpg`, { type: 'image/jpeg' });
      try {
        if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; }
      } catch (e) { if (e.name === 'AbortError') return; }
      const u = URL.createObjectURL(f); const el = document.createElement('a'); el.href = u; el.download = f.name; el.click(); setTimeout(() => URL.revokeObjectURL(u), 5000);
      bao('Đã tải ảnh bìa về máy, mở bằng Canva để sửa');
    };
    // Ảnh bìa đã sửa ở Canva (hoặc ảnh bìa có sẵn): tải lên thay ảnh bìa.
    if ($('#biaTuMay')) $('#biaTuMay').onchange = async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const [id] = await xepAnhLayMa([f], b.id, 'BIA', 'BAI_DANG');
        const a = await anhCho(id); if (a) thuAnhBD.set(id, a.base64);
        suaBai(db, b, { ...doc(), [truong]: id }); luu();
        bao('Đã thay ảnh bìa' + (daKetNoi() ? ', đang gửi lên Drive' : ''));
        chayDongBo();
        manMotBai(b.id);
      } catch (err) { bao('Không đọc được ảnh: ' + err.message); }
    };
  }
  if ($('#biaHienTai')) layAnhDayDu(b[truong]).then((a) => { $('#biaHienTai').src = `data:${a.loai || 'image/jpeg'};base64,${a.base64}`; }).catch(() => { $('#biaTT').textContent = 'Có ảnh bìa, chưa tải được để xem (cần mạng).'; });
  // Gemini, Canva: máy chủ trả { bai, anhId, base64 } hoặc { bai, url }.
  const goiAnhBia = async (nut, action, data, chu) => {
    if (!daKetNoi()) return bao('Bản thử: cần nối máy chủ');
    if (!navigator.onLine) return bao('Cần mạng');
    suaBai(db, b, doc()); luu();
    const n = await anhChuaGui(b);
    if (n) { chayDongBo(); return bao(`Còn ${n} ảnh đang gửi lên Drive, chờ gửi xong rồi làm`); }
    const cu = nut.textContent; nut.disabled = true; nut.textContent = chu;
    const cuaSo = action === 'canvaMo' ? window.open('', '_blank') : null;
    dangGoiAI = true;
    let x = null;
    try {
      await guiThayDoiBai(b.id);
      x = await goi(action, { id: b.id, dich, ...data });
      nhanBai(db, x.bai); luu();
      if (x.anhId && x.base64) { anhDayDu.set(x.anhId, { base64: x.base64, loai: x.loai }); bao(action === 'canvaLay' ? 'Đã lấy ảnh từ Canva, ảnh bìa đã thay. Thầy xem lại rồi duyệt' : 'Đã thay ảnh bìa, Thầy xem lại rồi duyệt'); }
      if (x.url) bao('Đã mở Canva. Sửa xong quay lại bấm bước 3');
      if (x.url) { if (cuaSo) cuaSo.location = x.url; else location.href = x.url; }
    } catch (e) { if (cuaSo) cuaSo.close(); bao(e.message); }
    dangGoiAI = false;
    nut.disabled = false; nut.textContent = cu;
    if (location.hash === '#' + b.id && !(x && x.url && !cuaSo)) {
      manMotBai(b.id);
      if (x && x.anhId && $('.bia-dung')) $('.bia-dung').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  if ($('#geminiBia')) $('#geminiBia').onclick = () => {
    if (!(b.dsAnh || []).length && !b.anhBia) return bao('Thêm ảnh công trình trước');
    const kieu = $('#gmKieu').value;
    if (kieu === 'CHU' && !$('#bTieuDe').value.trim()) return bao('Ghi chữ trên bìa trước');
    goiAnhBia($('#geminiBia'), 'geminiBia', { kieu, anhId: (b.dsAnh || [])[0] || b.anhBia, tieuDe: $('#bTieuDe').value.trim(), phuDe: $('#bPhuDe').value.trim() }, 'Gemini đang làm…');
  };
  if ($('#canvaMo')) $('#canvaMo').onclick = async () => {
    const goc = b[truong] || (b.dsAnh || [])[0] || b.anhBia;
    if (!goc) return bao('Chưa có ảnh để đưa sang Canva. Thêm ảnh ở mục Ảnh trước');
    // Cắt sẵn đúng khổ kênh để ảnh tràn khung Canva. Không cắt được (mất mạng) thì máy chủ tự lấy ảnh gốc.
    let base64 = '';
    try { const a = await layAnhDayDu(goc); base64 = catKho(document.createElement('canvas'), await taiAnh(a.base64, a.loai), kho).toDataURL('image/jpeg', 0.92).split(',')[1]; } catch { /* để máy chủ lấy */ }
    goiAnhBia($('#canvaMo'), 'canvaMo', base64 ? { base64 } : { anhId: goc }, 'Đang đưa sang Canva…');
  };
  if ($('#canvaLay')) $('#canvaLay').onclick = () => goiAnhBia($('#canvaLay'), 'canvaLay', {}, 'Đang lấy ảnh từ Canva…');
  if ($('#ptThuVien')) $('#ptThuVien').onclick = () => { suaBai(db, b, doc()); luu(); moThuVienPT(b); };
  // AI viết từng nhóm kênh (máy chủ chờ tối đa khoảng 60 giây mỗi lần).
  if ($('#vietAI')) $('#vietAI').onclick = async () => {
    suaBai(db, b, doc()); luu();
    const loi = kiemTruocKhiViet(b);
    if (loi) return bao(loi);
    if (!daKetNoi()) return bao('Bản thử: cần nối máy chủ để AI viết bài');
    if (!navigator.onLine) return bao('Cần mạng để AI viết bài');
    if (await anhChuaGui(b)) bao('Ảnh còn đang gửi lên Drive, AI viết không kèm ảnh chưa gửi');
    const nut = $('#vietAI'); nut.disabled = true;
    dangGoiAI = true;
    const nhom = nhomViet(b.kenh);
    let banMoi = b;
    try {
      for (let i = 0; i < nhom.length; i++) {
        if ($('#tienDoAI')) $('#tienDoAI').textContent = `AI đang viết ${nhom[i].map((k) => KENH[k]).join(' + ')} (${i + 1}/${nhom.length})…`;
        boChoGui(db, b.id);
        banMoi = await goi('vietBai', { bai: i === 0 ? banMoi : undefined, id: b.id, kenh: nhom[i] });
        nhanBai(db, banMoi); ghi(db);
      }
      bao('AI viết xong, Thầy xem và duyệt');
    } catch (e) { bao(e.message); if ($('#tienDoAI')) $('#tienDoAI').textContent = e.message; }
    dangGoiAI = false;
    luu();
    if (location.hash === '#' + b.id) manMotBai(b.id);
  };
  const goiVoiBai = async (action, data, thanhCong) => {
    if (!daKetNoi()) return bao('Bản thử: cần nối máy chủ');
    if (!navigator.onLine) return bao('Cần mạng');
    dangGoiAI = true;
    try { await guiThayDoiBai(b.id); const x = await goi(action, data); nhanBai(db, x); luu(); bao(thanhCong(x)); } catch (e) { bao(e.message); }
    dangGoiAI = false;
    if (location.hash === '#' + b.id) manMotBai(b.id);
  };
  if ($('#duyet')) $('#duyet').onclick = async () => {
    suaBai(db, b, doc()); luu();
    const n = await anhChuaGui(b);
    if (n) { chayDongBo(); return bao(`Còn ${n} ảnh đang gửi lên Drive, chờ gửi xong rồi duyệt`); }
    goiVoiBai('duyetBai', { bai: b }, () => 'Đã duyệt' + (b.ngayDang ? `, đăng ngày ${ddmm(b.ngayDang)}` : ''));
  };
  if ($('#boDuyet')) $('#boDuyet').onclick = () => goiVoiBai('boDuyet', { id: b.id }, () => 'Đã bỏ duyệt');
  if ($('#dangNgay')) $('#dangNgay').onclick = () => {
    $('#dangNgay').disabled = true; $('#dangNgay').textContent = 'Đang đăng…';
    goiVoiBai('dangBai', { id: b.id }, (x) => (coLoi(x) ? 'Có kênh đăng lỗi, xem chi tiết' : 'Đã đăng'));
  };
  v.querySelectorAll('[data-tay]').forEach((x) => {
    x.onclick = () => {
      const link = prompt('Dán link bài đã đăng (bỏ trống cũng được)') || '';
      goiVoiBai('daDangTay', { id: b.id, kenh: x.dataset.tay, link }, () => 'Đã ghi đăng tay');
    };
  });
  v.querySelectorAll('[data-chep]').forEach((x) => {
    x.onclick = async () => { try { await navigator.clipboard.writeText(chuDeChep(b, x.dataset.chep)); bao('Đã chép chữ'); } catch { bao('Không chép được'); } };
  });
  v.querySelectorAll('[data-chia-se]').forEach((x) => { x.onclick = () => chiaSeBai(b, x.dataset.chiaSe); });
  if ($('#xoaBai')) $('#xoaBai').onclick = () => {
    if (!confirm('Xoá bài này?')) return;
    xoaBai(db, b); luu(); bao('Đã xoá bài'); location.hash = 'dang-bai';
  };
}

// Đăng tay (TikTok): chia sẻ ảnh bìa + ảnh bài kèm chữ sang app TikTok, Zalo… Máy không chia sẻ được file thì tải ảnh về.
async function chiaSeBai(b, k) {
  const ids = [k === 'WEB' && b.anhBiaWeb ? b.anhBiaWeb : b.anhBia, ...(b.dsAnh || [])].filter((x, i, a) => x && a.indexOf(x) === i).slice(0, 10);
  const chu = chuDeChep(b, k);
  try { await navigator.clipboard.writeText(chu); } catch { /* không có quyền chép */ }
  try {
    bao('Đang lấy ảnh…');
    const files = [];
    for (const [i, id] of ids.entries()) {
      const a = await layAnhDayDu(id);
      const bytes = Uint8Array.from(atob(a.base64), (c) => c.charCodeAt(0));
      files.push(new File([bytes], `${b.id}-${i + 1}.jpg`, { type: a.loai || 'image/jpeg' }));
    }
    if (navigator.canShare && navigator.canShare({ files })) { await navigator.share({ files, text: chu }); return; }
    files.forEach((f) => { const u = URL.createObjectURL(f); const el = document.createElement('a'); el.href = u; el.download = f.name; el.click(); setTimeout(() => URL.revokeObjectURL(u), 5000); });
    bao('Đã tải ảnh về máy, chữ đã chép sẵn');
  } catch (e) { if (e.name !== 'AbortError') bao('Không lấy được ảnh: ' + e.message); }
}

const boDauTV = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
// Thư viện phong thủy trên Drive của Thầy: chọn tài liệu → AI tìm đoạn (chép nguyên văn, máy chủ đối chiếu) hoặc Thầy tự bôi đen đoạn.
async function moThuVienPT(b) {
  if (!daKetNoi()) return bao('Bản thử: thư viện nằm trên Drive, cần nối máy chủ');
  if (!navigator.onLine) return bao('Cần mạng để mở thư viện');
  const d = $('#sheet');
  if (d.open) d.close();
  const loi = (e) => { d.innerHTML = `<h2>Thư viện phong thủy</h2><p class="muted">${esc(e.message)}</p><div class="actions"><button id="dong">Đóng</button></div>`; $('#dong', d).onclick = () => d.close(); };
  d.innerHTML = '<h2>Thư viện phong thủy</h2><p class="muted">Đang mở thư viện…</p>';
  d.showModal();
  let ds;
  try { ds = await goi('thuVienPT'); } catch (e) { return loi(e); }
  const veDs = (loc = '') => {
    const k = boDauTV(loc);
    const hien = ds.filter((x) => !k || boDauTV(x.thuMuc + ' ' + x.ten).includes(k));
    d.innerHTML = `<h2>Thư viện phong thủy</h2><input id="tvLoc" placeholder="Tìm tên tài liệu" value="${esc(loc)}">
      ${hien.length ? hien.map((x) => `<button class="card tv-tl" data-tl="${esc(x.id)}"><span class="name">${esc(x.ten)}</span><span class="muted">${esc(x.thuMuc || 'Thư mục gốc')} · sửa ${ddmm(x.sua)}</span></button>`).join('') : '<p class="muted">Không có tài liệu đọc được (Google Docs, Word, PDF, .md, .txt).</p>'}
      <div class="actions"><button id="dong">Đóng</button></div>`;
    $('#tvLoc', d).oninput = (e) => { const v = e.target.value; veDs(v); const o = $('#tvLoc', d); o.focus(); o.setSelectionRange(v.length, v.length); };
    $('#dong', d).onclick = () => d.close();
    d.querySelectorAll('[data-tl]').forEach((x) => { x.onclick = () => moTL(ds.find((y) => y.id === x.dataset.tl)); });
  };
  const dung = (tl, doan) => {
    const viTri = [...new Set(doan.map((x) => x.viTri).filter(Boolean))].join('; ');
    // Đồng bộ trong lúc mở thư viện có thể đã thay bản bài trên máy: lấy bản mới nhất.
    suaBai(db, timBai(db, b.id) || b, { nguonTL: tl.ten + (viTri ? ' – ' + viTri : ''), trichDan: doan.map((x) => x.trich.trim()).join('\n\n') }); luu();
    d.close(); bao('Đã lấy đoạn tài liệu, Thầy ghi thêm chương/trang nếu cần'); manMotBai(b.id);
  };
  const moTL = (tl) => {
    d.innerHTML = `<h2>${esc(tl.ten)}</h2><p class="muted">${esc(tl.thuMuc || 'Thư mục gốc')}</p>
      <label class="f">Chủ đề cần tìm</label><input id="tvChuDe" value="${esc(b.chuDe)}" placeholder="Vd: cửa chính đối cầu thang">
      <div class="actions"><button id="tvAI" class="btn-chinh">AI tìm đoạn liên quan</button><button id="tvDoc">Xem toàn văn, tự chọn</button></div>
      <div id="tvKQ"></div><div class="actions"><button id="tvLai">← Tài liệu khác</button><button id="dong">Đóng</button></div>`;
    $('#dong', d).onclick = () => d.close();
    $('#tvLai', d).onclick = () => veDs();
    const kq = $('#tvKQ', d);
    $('#tvAI', d).onclick = async () => {
      const chuDe = $('#tvChuDe', d).value.trim();
      if (!chuDe) return bao('Ghi chủ đề cần tìm');
      kq.innerHTML = '<p class="muted">AI đang đọc tài liệu…</p>';
      dangGoiAI = true;
      try {
        const r = await goi('timDoanPT', { id: tl.id, chuDe });
        kq.innerHTML = `${r.doan.length ? r.doan.map((x, i) => `<label class="card cham-dong"><input type="checkbox" data-doan="${i}" ${i === 0 ? 'checked' : ''}><span>${x.viTri ? `<b>${esc(x.viTri)}</b><br>` : ''}${esc(x.trich).replace(/\n/g, '<br>')}<br><span class="muted">${esc(x.viSao)}</span></span></label>`).join('') : '<p class="muted">Tài liệu này không có đoạn nào nói về chủ đề đó.</p>'}
          ${r.boQua ? `<p class="note">Đã bỏ ${r.boQua} đoạn AI đưa ra nhưng không khớp nguyên văn tài liệu.</p>` : ''}
          ${r.doan.length ? '<div class="actions"><button id="tvDung" class="btn-chinh">Dùng đoạn đã chọn</button></div>' : ''}`;
        if ($('#tvDung', d)) $('#tvDung', d).onclick = () => {
          const chon = [...kq.querySelectorAll('[data-doan]')].filter((x) => x.checked).map((x) => r.doan[Number(x.dataset.doan)]);
          if (!chon.length) return bao('Chọn ít nhất 1 đoạn');
          dung(tl, chon);
        };
      } catch (e) { kq.innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
      dangGoiAI = false;
    };
    $('#tvDoc', d).onclick = async () => {
      kq.innerHTML = '<p class="muted">Đang mở tài liệu…</p>';
      try {
        const t = await goi('docTaiLieu', { id: tl.id });
        kq.innerHTML = `<p class="muted">Bôi đen đoạn cần dùng rồi bấm "Lấy đoạn đang bôi đen".${t.cat ? ' Tài liệu dài, chỉ hiện phần đầu.' : ''}</p>
          <div class="tv-chu" id="tvChu">${esc(t.chu)}</div>
          <div class="actions"><button id="tvBoiDen" class="btn-chinh">Lấy đoạn đang bôi đen</button></div>`;
        $('#tvBoiDen', d).onclick = () => {
          const sel = String(window.getSelection() || '').trim();
          if (sel.length < 20) return bao('Bôi đen đoạn dài hơn một chút');
          dung(tl, [{ trich: sel, viTri: '' }]);
        };
      } catch (e) { kq.innerHTML = `<p class="muted">${esc(e.message)}</p>`; }
    };
  };
  veDs();
}

async function moChonAnhCT(b) {
  if (!daKetNoi()) return bao('Bản thử: ảnh công trình nằm trên Drive, cần nối máy chủ');
  if (!navigator.onLine) return bao('Cần mạng để xem ảnh công trình');
  const d = $('#sheet');
  if (d.open) d.close();
  d.innerHTML = '<h2>Chọn ảnh công trình</h2><p class="muted">Đang tải ảnh…</p>';
  d.showModal();
  let ds = [];
  try { ds = await goi('anhThu', { ma: b.maCongTrinh }); } catch (e) { d.innerHTML = `<h2>Chọn ảnh công trình</h2><p class="muted">${esc(e.message)}</p><div class="actions"><button id="dong">Đóng</button></div>`; $('#dong', d).onclick = () => d.close(); return; }
  ds.forEach((x) => { if (x.thu) thuAnhBD.set(x.id, x.thu); });
  const chon = new Set(b.dsAnh || []);
  d.innerHTML = `<h2>Chọn ảnh công trình</h2><p class="muted">${ds.length ? 'Bấm ảnh để chọn hoặc bỏ. Ảnh chọn trước đứng trước.' : 'Công trình chưa có ảnh nào trên Drive.'}</p>
    <div class="bd-anh">${ds.map((x) => `<button class="bd-o ${chon.has(x.id) ? 'on' : ''}" data-id="${esc(x.id)}">${x.thu ? `<img src="data:image/jpeg;base64,${x.thu}" alt="">` : '<span class="muted">Không có ảnh nhỏ</span>'}<span class="muted">${ddmm(String(x.luc).slice(0, 10))}</span></button>`).join('')}</div>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Xong</button></div>`;
  const thuTu = [...(b.dsAnh || [])];
  d.querySelectorAll('[data-id]').forEach((x) => {
    x.onclick = () => {
      const id = x.dataset.id;
      const i = thuTu.indexOf(id);
      if (i >= 0) thuTu.splice(i, 1); else thuTu.push(id);
      x.classList.toggle('on', i < 0);
    };
  });
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = () => { d.close(); suaBai(db, timBai(db, b.id) || b, { dsAnh: thuTu }); luu(); manMotBai(b.id); };
}

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
  const k2 = taoKhach(db, { ten: 'Mẫu: Anh Hùng Long Biên', sdt: '0900000002', nguon: 'Facebook', loai: 'XM' }, 'DUC', truoc(12));
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
  // Thu chi mẫu: chi dự kiến, 3 đợt trả thầu (1 đã trả một phần, 1 chờ giám sát xác nhận, 1 chưa tới), vài khoản chi.
  suaHopDong(db, nt, { chiDuKien: 470000000 });
  // Tài khoản mẫu: 1 tài khoản công ty nhận tiền khách, 1 tài khoản tiền mặt Kha giữ (tạm ứng).
  const qMB = themTaiKhoan(db, { ten: 'Mẫu: MB công ty', loai: 'CONG_TY', soDuDau: 60000000, ngayDau: truoc(60) });
  const qKha = themTaiKhoan(db, { ten: 'Mẫu: Tiền mặt Kha giữ', loai: 'TIEN_MAT', nguoiGiu: 'Kha', soDuDau: 0, ngayDau: truoc(60), choGiamSat: true });
  for (const h of db.hopDong) for (const d of h.dot) for (const x of d.thu) x.taiKhoan = qMB.id;
  ghiKhoan(db, { ngay: truoc(10), loai: 'CHUYEN', taiKhoan: qMB.id, toiTK: qKha.id, soTien: 5000000, noiDung: 'Tạm ứng Kha chi lặt vặt' }, 'THAY');
  ghiKhoan(db, { ngay: truoc(2), ma: ct.ma, loai: 'CHI', hangMuc: 'Chi nhân công lẻ', doiTuong: 'Phụ hồ', soTien: 450000, noiDung: 'Công nhật dọn phế thải', taiKhoan: qKha.id, hinhThuc: 'TM' }, 'KHA');
  themDotTra(db, { maCongTrinh: ct.ma, thau: 'Mẫu: Gạch Hùng Phát', hangMuc: 'Gạch ốp lát', dot: 'HD1', soTien: 32000000, hanTra: truoc(-5), loaiNo: 'NCC' }, 'THAY');
  const vXay = ct.viec.find((v) => v.nhom.startsWith('Xây') && v.phanTram >= 100);
  const vDien = ct.viec.find((v) => v.nhom.startsWith('Điện nước'));
  const vPhaDo = ct.viec.find((v) => v.nhom.startsWith('Chuẩn bị') && v.phanTram >= 100 && v !== vXay);
  const t1 = themDotTra(db, { maCongTrinh: ct.ma, thau: 'Mẫu: Thầu thô Hưng', hangMuc: 'Phá dỡ', dot: 'PD1', soTien: 18000000, dieuKien: 'Phá dỡ, đục xong, dọn phế thải', viecMoc: vPhaDo ? vPhaDo.id : '', hanTra: truoc(30) }, 'THAY');
  xacNhanKL(db, t1, { ngay: truoc(30), ghiChu: 'Đủ' }, 'KHA');
  ghiKhoan(db, { ngay: truoc(29), ma: ct.ma, loai: 'CHI', hangMuc: 'Chi thầu phụ', thamChieu: t1.id, doiTuong: t1.thau, soTien: 10000000, noiDung: 'Phá dỡ đợt PD1', taiKhoan: qMB.id }, 'THAY');
  themDotTra(db, { maCongTrinh: ct.ma, thau: 'Mẫu: Thầu thô Hưng', hangMuc: 'Xây trát', dot: 'XT1', soTien: 45000000, dieuKien: 'Xây xong tường, trát xong', viecMoc: vXay ? vXay.id : '', hanTra: truoc(-2) }, 'THAY');
  themDotTra(db, { maCongTrinh: ct.ma, thau: 'Mẫu: Thầu điện nước Tâm', hangMuc: 'Điện nước', dot: 'DN1', soTien: 12000000, dieuKien: 'Đi ống xong toàn nhà', viecMoc: vDien ? vDien.id : '', hanTra: truoc(-15) }, 'THAY');
  ghiKhoan(db, { ngay: truoc(3), ma: ct.ma, loai: 'CHI', hangMuc: 'Chi vật tư', doiTuong: 'Mẫu: Cửa hàng VLXD', soTien: 8500000, noiDung: 'Xi măng, cát, gạch đợt 2', taiKhoan: qMB.id }, 'THAY');
  ghiKhoan(db, { ngay: truoc(1), ma: CTY, loai: 'CHI', hangMuc: 'CTY - Marketing', doiTuong: 'Facebook', soTien: 1500000, noiDung: 'Chạy quảng cáo tuần', taiKhoan: qMB.id }, 'THAY');
  // Phát sinh mẫu: 1 đã duyệt trên link (được làm), 1 chờ khách, 1 giám sát mới báo 3 ngày chưa báo giá.
  const ps1 = baoPhatSinh(db, ct, { moTa: 'Thêm 2 ổ cắm + 1 đường nước máy lọc bếp', viTri: 'Bếp', viec: vDien ? vDien.id : '', ngay: truoc(8) }, 'KHA', true);
  baoGia(db, ps1, { giaBan: 3500000, chiGoc: 2200000, ngay: truoc(7) }, 'DUC');
  khachTraLoi(db, ps1, { dongY: true, qua: 'LINK', ngay: truoc(1) }, 'CHU_NHA');
  const ps2 = baoPhatSinh(db, ct, { moTa: 'Đổi gạch WC sang 60x120', viTri: 'WC tầng 2', ngay: truoc(5) }, 'KHA', true);
  baoGia(db, ps2, { giaBan: 6800000, chiGoc: 5000000, ngay: truoc(4) }, 'DUC');
  baoPhatSinh(db, ct, { moTa: 'Làm thêm kệ hộp kỹ thuật phòng khách', viTri: 'Phòng khách', ngay: truoc(3) }, 'KHA', true);
  // Mẫu vật liệu: gạch WC đã chốt; sàn gỗ chờ khách, sắp tới hạn.
  const vOp = ct.viec.find((v) => /Ốp lát WC/.test(v.hangMuc));
  const vSan = ct.viec.find((v) => /sàn gỗ/i.test(v.hangMuc));
  const m1 = themMau(db, ct, { hangMuc: 'Gạch ốp WC', tenMau: 'Mẫu: 30x60 trắng mờ', nguoiBan: 'Mẫu: Đại lý gạch Hà Đông', sdtNguoiBan: '0900000009', viec: vOp ? vOp.id : '' }, 'DUC', truoc(20));
  khachChotMau(db, m1, { dongY: true, qua: 'ZALO', ngay: truoc(18) }, 'DUC');
  themMau(db, ct, { hangMuc: 'Sàn gỗ', tenMau: 'Mẫu: SPC 6mm vân sồi', nguoiBan: 'Mẫu: Cửa hàng sàn Tâm', viec: vSan ? vSan.id : '', hanChot: truoc(-2) }, 'DUC', truoc(4));
  // Danh bạ thầu mẫu: gắn tên thầu vào việc theo nhóm; thầu phá dỡ đã xong hết → app nhắc đánh giá; điện nước có 1 lần chậm do thầu.
  const thauMau = [['Chuẩn bị', 'Mẫu: Thầu phá dỡ Lực', 'Thầu thô'], ['Xây trát', 'Mẫu: Thầu thô Hưng', 'Thầu thô'], ['Chống thấm', 'Mẫu: Thầu thô Hưng', 'Thầu thô'],
    ['Điện nước', 'Mẫu: Thầu điện nước Tâm', 'Điện nước'], ['Lắp thiết bị', 'Mẫu: Thầu điện nước Tâm', 'Điện nước'], ['Ốp lát', 'Mẫu: Đội ốp lát Sơn', 'Ốp lát']];
  for (const [nhom, ten, lv] of thauMau) {
    if (!timThauTheoTen(db, ten)) themThau(db, { ten, linhVuc: lv, sdt: '09000000' + (10 + (db.nhaThau || []).length) });
    ct.viec.filter((v) => v.nhom.startsWith(nhom)).forEach((v) => { v.nhaThau = ten; });
  }
  const vDien1 = ct.viec.find((v) => v.nhom.startsWith('Điện nước') && v.phanTram > 0);
  if (vDien1) baoCham(db, ct, vDien1.id, { soNgay: 2, nguyenNhan: 'Thầu phụ', ghiChu: 'Thợ điện nước điều đi công trình khác 2 ngày' }, 'KHA');
  // Nghiệm thu mẫu: xây trát đạt nhưng còn 1 tồn tại quá hạn; các việc khác vừa xong tự hiện "Cần nghiệm thu".
  const vXT = ct.viec.find((v) => v.nhom.startsWith('Xây') && v.phanTram >= 100);
  if (vXT) nghiemThu(db, ct, vXT.id, { ngay: truoc(6), soAnh: 3, hanSua: truoc(2), muc: [
    { noiDung: 'Tường xây, vị trí tường', dat: true }, { noiDung: 'Chi tiết chờ liên kết kết cấu kế cận', dat: true },
    { noiDung: 'Trát phẳng, thẳng góc, không nứt', dat: false, ghiChu: 'Má cửa WC2 trát lệch 1cm' }] }, 'KHA');
  danhGia(db, timThauTheoTen(db, 'Mẫu: Thầu thô Hưng'), { maCongTrinh: 'MAU-CU', ngay: truoc(90), chatLuong: 4, tienDo: 3, phoiHop: 4, ghiChu: 'Công trình trước: làm chắc, hơi chậm' }, 'THAY');
  // Bài đăng mẫu: 1 bài AI đã viết chờ Thầy duyệt, 1 bài nháp chưa viết. Chữ mẫu, không phải bài thật.
  ct.choDangAnh = true;
  const bd1 = taoBai(db, { loai: 'CAM_HUNG', chuDe: 'Mẫu: Vì sao nên chốt mẫu vật liệu trước khi thi công', ngayDang: truoc(-1) }, 'DUC');
  suaBai(db, bd1, { tieuDeBia: 'Chốt mẫu trước, nhà lên đúng hẹn', phuDeBia: 'Kinh nghiệm từ công trình KAS', baiViet: {
    fb: 'Mẫu: Chọn gạch, sàn, đá khi thợ đã đến chân công trình là lúc dễ chậm tiến độ nhất.\n\nỞ KAS, mỗi mẫu vật liệu có hạn chốt trước ngày thi công [Thầy điền: số ngày]. Chủ nhà xem mẫu, đồng ý ngay trên link riêng, thợ đến là có vật tư.\n\nAnh chị đang chuẩn bị làm nhà? Nhắn Fanpage để KAS gửi danh sách mẫu cần chốt theo từng giai đoạn.\n\n#KASHouzing #LamNha #NoiThat',
    ig: 'Mẫu: Chốt mẫu vật liệu trước, nhà lên đúng hẹn. Nhắn KAS để nhận danh sách mẫu cần chốt.\n\n#KASHouzing #LamNha #NoiThat #HaNoi #ThietKeNoiThat',
    tt: { tieuDe: 'Mẫu: Chốt mẫu sớm, nhà xong sớm', chuThich: 'Mẫu: Kinh nghiệm chốt vật liệu trước khi thợ vào. #KASHouzing #LamNha #NoiThat', kichBan: 'Mẫu: Cảnh 1 | Thợ chờ vật tư | "Thợ đến mà chưa có gạch?" | Lời đọc mở đầu' } } });
  taoBai(db, { loai: 'DU_AN', maCongTrinh: ct.ma, chuDe: 'Mẫu: Căn hộ Xa La sau nội thất', ngayDang: truoc(-3) }, 'THAY');
  luu();
}

// ---------- Báo cáo công trường ----------
const gioPhut = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
const ngayDiaPhuong = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); };
const soAnhNgay = (ma, ngay) => Math.max(Number(((db.anh || []).find((a) => a.ma === ma && a.ngay === ngay) || {}).so) || 0, Number((db.anhDem || {})[ma + '|' + ngay]) || 0);
const congTrinhCanBC = (hn) => congTrinhCanAnh(db, hn, (ma) => congTrinhDaXong(db, ma));
const lichSuNgay = (ma, ngay) => (db.lichSu || []).filter((e) => e.ma === ma && ngayDiaPhuong(e.luc) === ngay);
// Mốc nhắc hiện tại, để màn Hôm nay tự vẽ lại khi tới 16h, 17h, 17h30, trưa thứ 7.
function mocNhacHienTai() {
  const d = new Date();
  const ph = d.getHours() * 60 + d.getMinutes();
  return MOC_NHAC.filter(([g, p]) => ph >= g * 60 + p).length + '|' + daToiGioTuan(homNay(), d.getHours());
}

// Hôm nay: phiếu ngày từng công trình, nhắc đỏ 16h/17h/17h30, chấm công thầu công nhật, đề xuất lùi, tổng hợp tuần.
function baoCaoHomNay(hn) {
  const now = new Date();
  const can = congTrinhCanBC(hn);
  const nh = nhacBaoCao(can, db, hn, now.getHours(), now.getMinutes());
  let html = '';
  if (can.length) {
    const doLen = nh.lan > 0 && nh.ds.length;
    const moc = ['', '16h', '17h', '17h30'][nh.lan];
    html += `<div class="${doLen ? 'canh-anh' : 'note'}"><b>${doLen ? `📋 ${moc} rồi, chưa nộp báo cáo ngày${nh.lan > 1 ? ` (nhắc lần ${nh.lan})` : ''}` : '📋 Báo cáo ngày'}</b>
      ${can.map((ct) => {
        const b = bcCua(db, ct.ma, hn);
        return daNop(b) ? `<a class="btn" href="#bc-${esc(ct.ma)}">✓ ${esc(ct.ma)}: đã nộp ${gioPhut(b.nopLuc)} · sửa</a>`
          : `<a class="btn ${doLen ? 'btn-do' : 'btn-chinh'}" href="#bc-${esc(ct.ma)}">${esc(ct.ma)} · ${esc(ct.ten)}: làm báo cáo (${soAnhNgay(ct.ma, hn)}/${ANH_TOI_THIEU} ảnh)</a>`;
      }).join('')}
      ${doLen ? '<p class="muted">Nhắc lại lúc 16h, 17h và 17h30 đến khi nộp.</p>' : ''}</div>`;
  }
  html += chamCongHomNay(hn, can) + deXuatHomNay();
  if (laVanPhong()) {
    const tuan = canGuiTuan(db, db.congTrinh.filter((ct) => !congTrinhDaXong(db, ct.ma)), hn, now.getHours());
    if (tuan.length) html += `<h3>Tổng hợp tuần gửi chủ nhà</h3>${tuan.map((ct) => `<a class="card" href="#tuan-${esc(ct.ma)}"><div class="row"><span class="name">${esc(ct.ma)} · ${esc(ct.ten)}</span><span class="tag SAP">Chưa gửi</span></div>
      <div class="muted">App đã gom sẵn tiến độ, việc xong, việc tuần sau, ảnh. Thầy xem lại rồi gửi.</div></a>`).join('')}`;
  }
  return html;
}

function chamCongHomNay(hn, can) {
  const ds = canChamCong(db, can, hn);
  if (!ds.length) return '';
  const muon = new Date().getHours() >= GIO_NHAC_ANH;
  return `<h3>Chấm công thầu công nhật</h3>${ds.map(({ ct, ten, cong }) => `<div class="card"><div class="row"><span class="name">${esc(ten)}</span>
      <span class="tag ${cong == null ? (muon ? 'TRE' : 'SAP') : 'DANG'}">${cong == null ? 'Chưa chấm' : cong === 0 ? 'Nghỉ' : cong + ' công'}</span></div>
    <div class="muted">${esc(ct.ma)} · ${esc(ct.ten)} · bấm số công hôm nay</div>
    <div class="grid-btn">${[0, 1, 2, 3].map((n) => `<button data-cc="${esc(ct.ma)}" data-cc-ten="${esc(ten)}" data-cc-so="${n}" class="${cong === n ? 'on' : ''}">${n === 0 ? 'Nghỉ' : n}</button>`).join('')}<button data-cc="${esc(ct.ma)}" data-cc-ten="${esc(ten)}" data-cc-so="khac">Khác</button></div></div>`).join('')}`;
}

function deXuatHomNay() {
  const ds = deXuatCho(db).filter((e) => db.congTrinh.some((c) => c.ma === e.ma));
  if (!ds.length) return '';
  const vp = laVanPhong();
  return `<h3>${vp ? 'Đề xuất lùi lịch, chờ giám sát xác nhận' : 'Văn phòng đề xuất lùi lịch'}</h3>${ds.map((e) => `<div class="card">
    <div class="row"><span class="name">${esc(e.tenViec)}</span><span class="tag SAP">+${esc(e.cu)} ngày</span></div>
    <div class="muted">${esc(e.ma)} · ${esc(e.nguyenNhan)} · ${e.moi === 'CHI_VIEC' ? 'chỉ lùi việc này' : 'các việc sau lùi theo'}${e.ghiChu ? ' · ' + esc(e.ghiChu) : ''} · ${esc(tenNguoi(e.nguoi))} ${ddmm(ngayDiaPhuong(e.luc))}</div>
    <div class="actions">${vp ? `<button data-dx-rut="${esc(e.id)}">Rút đề xuất</button>`
      : `<button data-dx-bo="${esc(e.id)}">Không lùi</button><button data-dx-sua="${esc(e.id)}">Sửa rồi lùi</button><button data-dx-ok="${esc(e.id)}" class="btn-chinh">Xác nhận lùi</button>`}</div></div>`).join('')}`;
}

function ganNutBaoCao(el) {
  el.querySelectorAll('[data-cc]').forEach((b) => {
    b.onclick = () => {
      const ct = db.congTrinh.find((c) => c.ma === b.dataset.cc);
      const ten = b.dataset.ccTen;
      const ghiCong = (n) => { chamCong(db, ct, homNay(), ten, n, vaiTro); luu(); bao(n ? `Đã chấm ${n} công cho ${ten}` : `Đã ghi ${ten} nghỉ hôm nay`); route(); };
      if (b.dataset.ccSo !== 'khac') return ghiCong(Number(b.dataset.ccSo));
      const d = $('#sheet');
      d.innerHTML = `<h2>Chấm công ${esc(ten)}</h2><p class="muted">${esc(ct.ma)} · hôm nay ${ddmm(homNay())}</p>
        <label class="f">Số công (vd 2.5)</label><input id="so" type="number" inputmode="decimal" step="0.5" min="0">
        <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
      d.showModal();
      $('#huy', d).onclick = () => d.close();
      $('#ok', d).onclick = () => { const n = Number($('#so', d).value); if (!(n >= 0)) return bao('Nhập số công'); d.close(); ghiCong(n); };
    };
  });
  const timDx = (id) => deXuatCho(db).find((e) => e.id === id);
  const xuLy = (id, kq) => {
    const dx = timDx(id); if (!dx) return;
    const ct = db.congTrinh.find((c) => c.ma === dx.ma); if (!ct) return;
    xuLyDeXuat(db, ct, dx, kq, vaiTro); luu();
    bao({ DONG_Y: 'Đã lùi lịch theo đề xuất', BO: 'Đã ghi: không lùi', RUT: 'Đã rút đề xuất' }[kq]); route();
  };
  el.querySelectorAll('[data-dx-ok]').forEach((b) => { b.onclick = () => xuLy(b.dataset.dxOk, 'DONG_Y'); });
  el.querySelectorAll('[data-dx-bo]').forEach((b) => { b.onclick = () => xuLy(b.dataset.dxBo, 'BO'); });
  el.querySelectorAll('[data-dx-rut]').forEach((b) => { b.onclick = () => xuLy(b.dataset.dxRut, 'RUT'); });
  el.querySelectorAll('[data-dx-sua]').forEach((b) => {
    b.onclick = () => {
      const dx = timDx(b.dataset.dxSua); if (!dx) return;
      const ct = db.congTrinh.find((c) => c.ma === dx.ma);
      const x = ct && ct.viec.find((v) => v.id === dx.viec);
      if (x) moBaoCham(ct, x, dx);
    };
  });
}

// Bản nháp phiếu đang làm (giữ khi mở phiếu con như báo chậm, phát sinh rồi quay lại).
const nhapBC = new Map();

function manBaoCao(ma, ngayTs) {
  const ct = db.congTrinh.find((c) => c.ma === ma);
  if (!ct) return manHomNay();
  const hn = homNay();
  const ngay = ngayTs || hn;
  const b = bcCua(db, ma, ngay);
  datTab('hom-nay', `Báo cáo ${ddmm(ngay)}`);
  if (ngay !== hn && !laVanPhong()) return xemBaoCao(ct, b, ngay);
  const k = ma + '|' + ngay;
  if (!nhapBC.has(k)) {
    nhapBC.set(k, b ? { chon: (b.thauLam || []).filter((x) => x.cong !== 0).map((x) => x.ten), lam: Object.fromEntries((b.thauLam || []).map((x) => [x.ten, x.lam])),
      cong: Object.fromEntries((b.thauLam || []).filter((x) => x.cong != null).map((x) => [x.ten, x.cong])), them: (b.thauLam || []).map((x) => x.ten),
      thieu: b.thieu, anhHuong: b.anhHuong, viecAnhHuong: b.viecAnhHuong || [], ngayMai: b.ngayMai, doiKeHoach: b.doiKeHoach || 'KHONG' }
      : { chon: [], lam: {}, cong: {}, them: [], thieu: '', anhHuong: '', viecAnhHuong: [], ngayMai: '', doiKeHoach: 'KHONG' });
  }
  const n = nhapBC.get(k);
  const duKien = thauDuKien(ct, ngay);
  const tenThap = (x) => String(x).trim().toLowerCase();
  const dsTen = [];
  [...duKien.map((t) => t.ten), ...n.them].forEach((t) => { if (!dsTen.some((x) => tenThap(x) === tenThap(t))) dsTen.push(t); });
  const dangChon = (t) => n.chon.some((x) => tenThap(x) === tenThap(t));
  const soAnh = soAnhNgay(ma, ngay);
  const { mai, viec: viecMai } = viecNgayMai(ct, ngay);
  const lichHien = lichHienTai(ct, ngay);
  const ganToi = ct.viec.filter((v) => v.phanTram < 100 && lichHien.get(v.id).batDau <= addDays(ngay, 14));
  const thauKhac = dsThau(db).filter((t) => !dsTen.some((x) => tenThap(x) === tenThap(t.ten)));
  const lsNgay = lichSuNgay(ma, ngay);
  $('#view').innerHTML = `<h2>${esc(ct.ma)} · ${esc(ct.ten)}</h2>
    <p class="muted">Báo cáo ngày ${ddmm(ngay)}${b && b.nopLuc ? ` · đã nộp ${gioPhut(b.nopLuc)} (${esc(tenNguoi(b.nguoi))}), sửa được trong ngày` : ' · chưa nộp'}</p>

    <h3>1. Ảnh hiện trường</h3>
    <div class="card"><div class="row"><span class="name">Ảnh hôm nay</span><span class="tag ${soAnh >= ANH_TOI_THIEU ? 'DANG' : 'TRE'}">${soAnh}/${ANH_TOI_THIEU}</span></div>
      <div class="muted">Tối thiểu ${ANH_TOI_THIEU} ảnh: tổng thể + chỗ từng thầu đang làm. Ảnh tự vào thư mục Drive công trình.</div>
      <div class="actions"><label class="btn btn-chinh" style="text-align:center">📷 Chụp<input id="bcChup" type="file" accept="image/*" capture="environment" multiple hidden></label>
      <label class="btn" style="text-align:center">🖼 Chọn ảnh có sẵn<input id="bcChon" type="file" accept="image/*" multiple hidden></label></div></div>

    <h3>2. Thầu, tổ đội làm hôm nay</h3>
    <p class="muted">Bấm tên thầu có mặt. Bấm % việc là cập nhật luôn vào kế hoạch.</p>
    ${!dsTen.length ? '<p class="muted">Hôm nay không có việc nào của thầu theo kế hoạch. Thầu khác đến làm thì thêm bên dưới.</p>' : ''}
    ${dsTen.map((t) => {
      const on = dangChon(t);
      const vs = viecConCuaThau(ct, t);
      const cn = laCongNhat(db, t);
      return `<div class="card"><button class="chon-thau ${on ? 'on' : ''}" data-chon="${esc(t)}">${on ? '✓ ' : ''}${esc(t)}${cn ? ' · công nhật' : ''}</button>
        ${on ? `${vs.map((v) => `<div class="muted" style="margin-top:8px">${esc(v.hangMuc)}</div><div class="grid-btn pct">${[0, 25, 50, 75, 100].map((p) => `<button data-bc-pct="${esc(v.id)}" data-p="${p}" class="${v.phanTram === p ? 'on' : ''}">${p === 100 ? 'Xong' : p + '%'}</button>`).join('')}</div>`).join('')}
          ${cn ? `<label class="f">Số công hôm nay</label><input data-cong="${esc(t)}" type="number" inputmode="decimal" step="0.5" min="0" value="${n.cong[t] ?? ''}" placeholder="Vd 3">` : ''}
          <label class="f">Làm được gì</label><div class="mic"><textarea data-lam="${esc(t)}" rows="2" placeholder="Vd: xong đi ống tầng 2, mai đi dây">${esc(n.lam[t] || '')}</textarea><button data-noi-lam="${esc(t)}">🎤</button></div>` : ''}</div>`;
    }).join('')}
    <div class="actions"><select id="themThau"><option value="">+ Thầu, tổ đội khác đến làm…</option>${thauKhac.map((t) => `<option>${esc(t.ten)}</option>`).join('')}<option value="__go">Gõ tên khác…</option></select></div>

    <h3>3. Thiếu / phát sinh</h3>
    <div class="mic"><textarea id="bcThieu" rows="3" placeholder="Vd: thiếu 20 viên gạch 60x60; chủ nhà muốn thêm 2 ổ cắm bếp">${esc(n.thieu)}</textarea><button id="noiThieu">🎤</button></div>
    <div class="actions"><button id="bcPS">Lập phiếu phát sinh</button></div>

    <h3>4. Ảnh hưởng hạng mục khác</h3>
    <div class="mic"><textarea id="bcAH" rows="2" placeholder="Vd: điện nước chưa xong tầng 2 nên thạch cao chưa vào được">${esc(n.anhHuong)}</textarea><button id="noiAH">🎤</button></div>
    ${ganToi.length ? `<p class="muted">Hạng mục bị ảnh hưởng (bấm chọn):</p><div class="chips-chon">${ganToi.map((v) => `<button data-ah="${esc(v.id)}" class="${n.viecAnhHuong.includes(v.id) ? 'on' : ''}">${esc(v.hangMuc)}</button>`).join('')}</div>` : ''}

    <h3>5. Ngày mai ${ddmm(mai)}</h3>
    ${viecMai.length ? viecMai.map((v) => `<div class="row"><span>${esc(v.hangMuc)}${v.nhaThau ? ` <span class="muted">· ${esc(v.nhaThau)}</span>` : ''}</span><button data-bc-cham="${esc(v.id)}" class="nho">Báo chậm</button></div>`).join('') : '<p class="muted">Không có việc theo kế hoạch.</p>'}
    <label class="f">So với kế hoạch</label>
    <div class="grid-btn"><button data-dkh="KHONG" class="${n.doiKeHoach !== 'CO' ? 'on' : ''}">Theo kế hoạch</button><button data-dkh="CO" class="${n.doiKeHoach === 'CO' ? 'on' : ''}">Có thay đổi</button></div>
    ${n.doiKeHoach === 'CO' ? `<div class="mic"><textarea id="bcMai" rows="2" placeholder="Vd: thầu sơn xin lùi sang thứ 5; mai đổ bê tông sàn tầng 3">${esc(n.ngayMai)}</textarea><button id="noiMai">🎤</button></div>
      <p class="muted">Cần lùi lịch thì bấm "Báo chậm" ở việc tương ứng. Thay đổi được gộp vào tin báo cáo.</p>` : ''}
    ${lsNgay.some((e) => e.loai === 'CHAM' || e.loai === 'DE_XUAT_CHAM') ? `<div class="note">Điều chỉnh hôm nay: ${lsNgay.filter((e) => e.loai === 'CHAM' || e.loai === 'DE_XUAT_CHAM').map((e) => `${esc(e.tenViec)} ${e.loai === 'CHAM' ? `lùi ${e.moi - e.cu} ngày` : `đề xuất lùi ${esc(e.cu)} ngày`}`).join('; ')}</div>` : ''}

    <div id="bcLoi" class="tre"></div>
    <div class="actions"><button id="bcNhap">Lưu nháp</button><button id="bcNop" class="btn-chinh">${b && b.nopLuc ? 'Lưu thay đổi' : 'Nộp báo cáo'}</button></div>
    ${b && b.nopLuc ? '<div class="actions"><button id="bcZalo">Gửi nhóm Zalo nội bộ</button></div>' : ''}
    <div class="actions"><a class="btn" href="#ct-${esc(ct.ma)}" style="text-align:center">Về công trình</a></div>`;
  const v = $('#view');
  const docO = () => {
    v.querySelectorAll('[data-lam]').forEach((o) => { n.lam[o.dataset.lam] = o.value; });
    v.querySelectorAll('[data-cong]').forEach((o) => { n.cong[o.dataset.cong] = o.value === '' ? null : Number(o.value); });
    n.thieu = $('#bcThieu').value; n.anhHuong = $('#bcAH').value;
    if ($('#bcMai')) n.ngayMai = $('#bcMai').value;
  };
  const veLai = () => { docO(); manBaoCao(ma, ngayTs); };
  v.oninput = docO;
  v.querySelectorAll('[data-chon]').forEach((x) => {
    x.onclick = () => { const t = x.dataset.chon; n.chon = dangChon(t) ? n.chon.filter((y) => tenThap(y) !== tenThap(t)) : [...n.chon, t]; veLai(); };
  });
  v.querySelectorAll('[data-bc-pct]').forEach((x) => {
    x.onclick = () => {
      docO();
      const id = x.dataset.bcPct; const p = +x.dataset.p;
      capNhatTienDo(db, ct, id, p, vaiTro, ngay); luu();
      const vv = ct.viec.find((y) => y.id === id);
      if (p === 100 && vv && canNghiemThu(vv)) moNghiemThu(ct, vv); else { bao('Đã cập nhật kế hoạch'); manBaoCao(ma, ngayTs); }
    };
  });
  v.querySelectorAll('[data-noi-lam]').forEach((x) => { x.onclick = () => noiThanhChu(v.querySelector(`[data-lam="${CSS.escape(x.dataset.noiLam)}"]`)); });
  $('#noiThieu').onclick = () => noiThanhChu($('#bcThieu'));
  $('#noiAH').onclick = () => noiThanhChu($('#bcAH'));
  if ($('#noiMai')) $('#noiMai').onclick = () => noiThanhChu($('#bcMai'));
  $('#themThau').onchange = (e) => {
    let t = e.target.value;
    if (!t) return;
    if (t !== '__go') { n.them.push(t); n.chon.push(t); return veLai(); }
    e.target.value = '';
    docO();
    const d = $('#sheet');
    d.innerHTML = `<h2>Thầu, tổ đội khác</h2><label class="f">Tên</label><input id="tenMoi" placeholder="Vd: Tổ đội KAS, thợ sửa khoá">
      <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Thêm</button></div>`;
    d.showModal();
    $('#huy', d).onclick = () => d.close();
    $('#ok', d).onclick = () => { const ten = $('#tenMoi', d).value.trim(); if (!ten) return bao('Cần tên'); d.close(); n.them.push(ten); n.chon.push(ten); manBaoCao(ma, ngayTs); };
  };
  v.querySelectorAll('[data-ah]').forEach((x) => { x.onclick = () => { const id = x.dataset.ah; n.viecAnhHuong = n.viecAnhHuong.includes(id) ? n.viecAnhHuong.filter((y) => y !== id) : [...n.viecAnhHuong, id]; veLai(); }; });
  v.querySelectorAll('[data-dkh]').forEach((x) => { x.onclick = () => { n.doiKeHoach = x.dataset.dkh; veLai(); }; });
  v.querySelectorAll('[data-bc-cham]').forEach((x) => { x.onclick = () => { docO(); moBaoCham(ct, ct.viec.find((y) => y.id === x.dataset.bcCham)); }; });
  $('#bcPS').onclick = () => { docO(); moBaoPS(ct, '', n.thieu.trim()); };
  const anh = async (e) => { const files = [...e.target.files]; if (!files.length) return; docO(); await guiAnhHienTruong(files, ma, ''); manBaoCao(ma, ngayTs); };
  $('#bcChup').onchange = anh; $('#bcChon').onchange = anh;
  const du = () => ({ thau: n.chon.map((t) => ({ ten: t, lam: n.lam[t] || '', cong: laCongNhat(db, t) ? n.cong[t] ?? null : null })),
    thieu: n.thieu, anhHuong: n.anhHuong, viecAnhHuong: n.viecAnhHuong, ngayMai: n.ngayMai, doiKeHoach: n.doiKeHoach, soAnh: soAnhNgay(ma, ngay) });
  $('#bcNhap').onclick = () => { docO(); luuBaoCao(db, ct, ngay, du(), vaiTro, false); luu(); bao('Đã lưu nháp'); };
  $('#bcNop').onclick = () => {
    docO();
    const d0 = du();
    const loi = kiemTraNop(d0, d0.soAnh);
    if (loi.length) { $('#bcLoi').innerHTML = loi.map(esc).join('<br>'); return bao(loi[0]); }
    const daCo = daNop(bcCua(db, ma, ngay));
    const bc = luuBaoCao(db, ct, ngay, d0, vaiTro, true); luu();
    nhapBC.delete(k);
    const d = $('#sheet');
    d.innerHTML = `<h2>${daCo ? 'Đã lưu báo cáo' : 'Đã nộp báo cáo'} ${ddmm(ngay)}</h2><p>Gửi tóm tắt vào nhóm Zalo nội bộ để anh em cùng nắm?</p>
      <div class="actions"><button id="xong">Để sau</button><button id="zalo" class="btn-chinh">Gửi nhóm Zalo nội bộ</button></div>`;
    d.showModal();
    $('#xong', d).onclick = () => { d.close(); location.hash = 'hom-nay'; };
    $('#zalo', d).onclick = () => { d.close(); chiaSe(tinZaloBC(ct, bc, lichSuNgay(ma, ngay))); };
  };
  if ($('#bcZalo')) $('#bcZalo').onclick = () => chiaSe(tinZaloBC(ct, bcCua(db, ma, ngay), lichSuNgay(ma, ngay)));
}

function xemBaoCao(ct, b, ngay) {
  const ten = (id) => (ct.viec.find((v) => v.id === id) || {}).hangMuc || id;
  $('#view').innerHTML = `<h2>${esc(ct.ma)} · ${esc(ct.ten)}</h2>
    ${!b || !b.nopLuc ? `<p>Ngày ${ddmm(ngay)} không có báo cáo.</p>` : `<p class="muted">Báo cáo ${ddmm(ngay)} · ${esc(tenNguoi(b.nguoi))} nộp ${gioPhut(b.nopLuc)} · ${b.soAnh} ảnh</p>
    <h3>Thầu, tổ đội</h3>${(b.thauLam || []).length ? b.thauLam.map((x) => `<p><b>${esc(x.ten)}</b>${x.cong != null && x.cong !== '' ? ` · ${x.cong} công` : ''}${x.lam ? ': ' + esc(x.lam) : ''}</p>`).join('') : '<p class="muted">Không ghi.</p>'}
    ${b.thieu ? `<h3>Thiếu / phát sinh</h3><p>${esc(b.thieu)}</p>` : ''}
    ${b.anhHuong || (b.viecAnhHuong || []).length ? `<h3>Ảnh hưởng hạng mục khác</h3><p>${esc(b.anhHuong)}</p>${(b.viecAnhHuong || []).length ? `<p class="muted">Hạng mục: ${b.viecAnhHuong.map((id) => esc(ten(id))).join(', ')}</p>` : ''}` : ''}
    <h3>Ngày mai</h3><p>${b.doiKeHoach === 'CO' ? '<b class="tre">Có thay đổi:</b> ' + esc(b.ngayMai) : 'Theo kế hoạch' + (b.ngayMai ? '. ' + esc(b.ngayMai) : '')}</p>
    <div class="actions"><button id="bcZalo">Gửi nhóm Zalo nội bộ</button></div>`}
    <div class="actions"><a class="btn" href="#ct-${esc(ct.ma)}" style="text-align:center">Về công trình</a></div>`;
  if ($('#bcZalo')) $('#bcZalo').onclick = () => chiaSe(tinZaloBC(ct, b, lichSuNgay(ct.ma, ngay)));
}

// Khối trong màn công trình: nút báo cáo hôm nay, 7 phiếu gần nhất, tổng hợp tuần (văn phòng).
function khoiBaoCao(ct) {
  const hn = homNay();
  const b = bcCua(db, ct.ma, hn);
  const ds = bcCuaCongTrinh(db, ct.ma).slice(0, 7);
  const tuan = (db.baoCaoTuan || []).filter((x) => x.maCongTrinh === ct.ma && !x.xoa && x.guiLuc).sort((a, c) => c.tuNgay.localeCompare(a.tuNgay))[0];
  return `<h3>Báo cáo công trường</h3>
    <div class="actions"><a class="btn btn-chinh" href="#bc-${esc(ct.ma)}" style="text-align:center">📋 Báo cáo hôm nay${daNop(b) ? ' ✓' : ''}</a>
    ${laVanPhong() ? `<a class="btn" href="#tuan-${esc(ct.ma)}" style="text-align:center">Tổng hợp tuần</a>` : ''}</div>
    ${laVanPhong() && tuan ? `<p class="muted">Tuần gần nhất đã gửi chủ nhà: ${ddmm(tuan.tuNgay)}–${ddmm(tuan.denNgay)}</p>` : ''}
    ${ds.map((x) => `<a class="card" href="#bc-${esc(ct.ma)}&ngay=${x.ngay}"><div class="row"><span class="name">${ddmm(x.ngay)} · ${(x.thauLam || []).filter((t) => t.cong !== 0).map((t) => esc(t.ten)).join(', ') || 'không ghi thầu'}</span>${x.doiKeHoach === 'CO' || x.anhHuong ? '<span class="tag TRE">Có vướng</span>' : ''}</div>
      <div class="muted">${x.soAnh} ảnh${x.thieu ? ' · thiếu/PS: ' + esc(x.thieu.slice(0, 60)) : ''}</div></a>`).join('')}
    ${deXuatCho(db, ct.ma).length ? `<p class="note">${deXuatCho(db, ct.ma).length} đề xuất lùi lịch đang chờ giám sát xác nhận (xem ở màn Hôm nay).</p>` : ''}`;
}

// ---------- Tổng hợp tuần cho chủ nhà ----------
const nhapTuan = new Map();
const thuAnhTuan = new Map(); // id ảnh → base64 ảnh nhỏ

async function manTuan(ma, denTs) {
  const ct = db.congTrinh.find((c) => c.ma === ma);
  if (!ct) return manHomNay();
  const hn = homNay();
  const thu7 = addDays(dauTuanBC(hn), 5);
  const den = denTs || (hn < thu7 ? hn : thu7);
  const tu = dauTuanBC(den);
  datTab('cong-trinh', `Tuần ${ddmm(tu)}–${ddmm(den)}`);
  const x = tuanCua(db, ma, tu);
  const k = ma + '|' + tu;
  if (!nhapTuan.has(k)) {
    const tuDong = gomTuan(db, ct, den);
    nhapTuan.set(k, { nd: x ? { ...tuDong, vuongMac: x.tomTat.vuongMac } : tuDong, anh: x ? [...(x.dsAnh || [])] : null });
  }
  const n = nhapTuan.get(k);
  const nd = n.nd;
  const noiBo = noiBoTuan(db, ma, tu, den);
  const ve = (dsAnh) => {
    $('#view').innerHTML = `<h2>${esc(ct.ma)} · ${esc(ct.ten)}</h2>
      <p class="muted">Tổng hợp tuần ${ddmm(tu)}–${ddmm(den)}${x && x.guiLuc ? ` · đã gửi chủ nhà ${ddmm(ngayDiaPhuong(x.guiLuc))}` : ' · chưa gửi chủ nhà'}</p>
      <div class="card"><div class="row"><span class="name">Tiến độ</span><span>thực tế <b>${nd.pctThucTe}%</b> · kế hoạch ${nd.pctKeHoach}%</span></div><div class="muted">Dự kiến xong ${ddmm(nd.ketThuc)}</div></div>
      <h3>Xong trong tuần</h3>${nd.xong.length ? `<p>${nd.xong.map(esc).join(', ')}</p>` : '<p class="muted">Chưa có việc xong trong tuần.</p>'}
      <h3>Tuần sau</h3>${nd.tuanSau.length ? nd.tuanSau.map((t) => `<p>${esc(t.hangMuc)} <span class="muted">${ddmm(t.batDau)}–${ddmm(t.ketThuc)}</span></p>`).join('') : '<p class="muted">Không có việc.</p>'}
      <h3>Cần chủ nhà (vướng mắc, phát sinh)</h3>
      <p class="muted">Mỗi dòng một ý. Chỉ ghi việc cần chủ nhà quyết hoặc can thiệp.</p>
      <div class="mic"><textarea id="tvm" rows="4">${esc(nd.vuongMac)}</textarea><button id="noiTvm">🎤</button></div>
      ${noiBo.length ? `<details class="cham-ds"><summary>Vấn đề nội bộ trong tuần (${noiBo.length}) · chủ nhà không thấy</summary>${noiBo.map((r) => `<p class="muted">${ddmm(r.ngay)}: ${esc([r.thieu, r.anhHuong].filter(Boolean).join(' · '))}</p>`).join('')}</details>` : ''}
      <h3>Ảnh (${(n.anh || []).length}/${ANH_TUAN_TOI_DA}, nên 6–9)</h3>
      <div id="tAnh">${dsAnh}</div>
      <div class="actions"><button id="tLuu">Lưu</button><button id="tGui" class="btn-chinh">${x && x.guiLuc ? 'Cập nhật và gửi lại Zalo' : 'Gửi chủ nhà'}</button></div>
      <p class="muted">Gửi chủ nhà: bản này hiện trên link chủ nhà (cả ảnh đã chọn) và mở Zalo để gửi tin kèm link. Không có nhân công và vấn đề nội bộ.</p>`;
    $('#tvm').oninput = (e) => { nd.vuongMac = e.target.value; };
    $('#noiTvm').onclick = () => noiThanhChu($('#tvm'));
    $('#view').querySelectorAll('[data-tanh]').forEach((im) => {
      im.onclick = () => {
        const id = im.dataset.tanh;
        if (n.anh.includes(id)) n.anh = n.anh.filter((y) => y !== id);
        else if (n.anh.length >= ANH_TUAN_TOI_DA) return bao(`Tối đa ${ANH_TUAN_TOI_DA} ảnh`);
        else n.anh.push(id);
        ve(luoiAnh());
      };
    });
    const luuT = (gui) => {
      nd.vuongMac = $('#tvm').value.trim();
      const kq = luuTuan(db, ct, nd, n.anh || [], vaiTro, gui); luu();
      if (gui) { nhapTuan.delete(k); chiaSe(tinZaloTuan(ct, kq.tomTat, linkChuNhaCua(ct))); route(); } else bao('Đã lưu');
    };
    $('#tLuu').onclick = () => luuT(false);
    $('#tGui').onclick = (e) => {
      const nut = e.currentTarget;
      if ((n.anh || []).length < 6 && daKetNoi() && nut.dataset.chac !== '1') { nut.dataset.chac = '1'; nut.textContent = `Mới ${(n.anh || []).length} ảnh, bấm lần nữa để vẫn gửi`; return; }
      luuT(true);
    };
  };
  let anhTuan = [];
  const luoiAnh = () => !daKetNoi() ? '<p class="muted">Bản thử: chọn ảnh khi đã kết nối máy chủ.</p>'
    : !anhTuan.length ? '<p class="muted">Tuần này chưa có ảnh trên Drive.</p>'
      : `<div class="luoi-anh">${anhTuan.map((a) => `<img data-tanh="${esc(a.id)}" class="${n.anh.includes(a.id) ? 'on' : ''}" src="${a.thu ? 'data:image/jpeg;base64,' + a.thu : ''}" alt="">`).join('')}</div>`;
  if (n.anh === null) n.anh = [];
  ve(daKetNoi() ? '<p class="muted">Đang tải ảnh tuần này…</p>' : luoiAnh());
  if (!daKetNoi()) return;
  try {
    const ds = await goi('anhThu', { ma });
    anhTuan = ds.filter((a) => ngayDiaPhuong(a.luc) >= tu && ngayDiaPhuong(a.luc) <= addDays(den, 1));
    anhTuan.forEach((a) => thuAnhTuan.set(a.id, a.thu));
    // Chưa chọn lần nào: lấy sẵn các ảnh gần nhất (Thầy chốt ưu tiên ảnh mới).
    if (!x && !n.daGoiY) { n.anh = anhTuan.slice(0, ANH_TUAN_TOI_DA).map((a) => a.id); n.daGoiY = true; }
  } catch (e) { anhTuan = []; bao('Chưa tải được ảnh: ' + e.message); }
  if (location.hash.startsWith('#tuan-')) ve(luoiAnh());
}

// Báo cáo tuần trên link chủ nhà.
function khoiTuanChuNha(dsTuan) {
  if (!dsTuan.length) return '';
  const mot = (x, mo) => {
    const nd = x.tomTat || {};
    return `<details class="card" ${mo ? 'open' : ''} data-tuan="${esc(x.id)}"><summary><b>Tuần ${ddmm(x.tuNgay)}–${ddmm(x.denNgay)}</b></summary>
      <p>Thực tế <b>${nd.pctThucTe}%</b> · kế hoạch ${nd.pctKeHoach}% · dự kiến xong ${ddmm(nd.ketThuc || '')}</p>
      ${(nd.xong || []).length ? `<p><b>Xong trong tuần:</b> ${nd.xong.map(esc).join(', ')}</p>` : ''}
      ${(nd.tuanSau || []).length ? `<p><b>Tuần sau:</b> ${nd.tuanSau.map((t) => esc(t.hangMuc)).join(', ')}</p>` : ''}
      ${nd.vuongMac ? `<div class="note"><b>Cần anh/chị:</b><br>${nd.vuongMac.split('\n').filter(Boolean).map(esc).join('<br>')}</div>` : ''}
      ${(x.dsAnh || []).length ? `<div class="luoi-anh">${x.dsAnh.map((id) => `<img data-anh-cn="${esc(id)}" alt="Ảnh công trình">`).join('')}</div>` : ''}</details>`;
  };
  return `<h3>Báo cáo tuần</h3>${dsTuan.map((x, i) => mot(x, i === 0)).join('')}`;
}

function taiAnhChuNha(maLink, api) {
  const nap = (det) => det.querySelectorAll('img[data-anh-cn]:not([src])').forEach(async (im) => {
    const id = im.dataset.anhCn;
    im.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
    try {
      if (api) { const a = await anhChuNha(api, maLink, id); im.src = `data:${a.loai};base64,${a.base64}`; }
      else if (thuAnhTuan.get(id)) im.src = 'data:image/jpeg;base64,' + thuAnhTuan.get(id);
    } catch { im.alt = 'Chưa tải được ảnh'; }
    im.onclick = () => { const d = $('#sheet'); d.innerHTML = `<img src="${im.src}" style="width:100%;border-radius:8px"><div class="actions"><button id="dong">Đóng</button></div>`; d.showModal(); $('#dong', d).onclick = () => d.close(); };
  });
  $('#view').querySelectorAll('details[data-tuan]').forEach((det) => { if (det.open) nap(det); det.addEventListener('toggle', () => { if (det.open) nap(det); }); });
}

// ---------- Khởi động ----------
// ---------- Bàn giao – bảo hành ----------
const TAG_BG = { NHAP: 'SAP', CHO_KHACH: 'SAP', DONG_Y: 'XONG' };
const TAG_BH = { MOI: 'TRE', DANG: 'DANG', XONG: 'XONG', KHONG: 'SAP' };
const ctCua = (ma) => db.congTrinh.find((c) => c.ma === ma);
const khachCuaCT = (ct) => (db.khach || []).find((k) => k.ma === ct.maKhach);

function theBH(p, hn, ct = null) {
  const qua = quaHanBH(p, hn);
  const mo = p.trangThai === 'MOI' || p.trangThai === 'DANG';
  const vp = laVanPhong();
  const con = vp ? conThuBH(db, p) : 0;
  return `<div class="card"><div class="row"><span class="name">${esc(p.ma)} · ${esc(p.moTa)}</span><span class="tag ${qua ? 'TRE' : TAG_BH[p.trangThai]}">${qua ? `Quá hạn ${diffDays(p.han, hn)} ngày` : mo ? `${p.khan ? 'KHẨN · ' : ''}${p.trangThai === 'DANG' ? 'Đang làm · ' : ''}hạn ${ddmm(p.han)}` : TT_BH[p.trangThai]}</span></div>
    <div class="muted">${ct ? esc(ct.ma) + ' · ' : ''}${p.viTri ? esc(p.viTri) + ' · ' : ''}${p.nhom ? esc(p.nhom) + ' · ' : ''}báo ${ddmm(p.ngayBao)} (${esc(tenNguoi(p.nguoiBao))}) · giao <b>${esc(p.giaoCho)}</b> · ${p.trongHan ? 'trong hạn bảo hành' : '<b>hết hạn bảo hành</b>'}${p.coPhi ? (vp ? ` · tính phí ${Number(p.phi) ? tien(p.phi) : '(chưa nhập số tiền)'}` : ' · có tính phí') : ''}${p.soAnh ? ` · ${p.soAnh} ảnh lúc báo` : ''}</div>
    ${p.ketQua ? `<div class="muted">${p.trangThai === 'XONG' ? 'Đã xử lý ' + ddmm(p.ngayXong) : p.trangThai === 'KHONG' ? 'Lý do' : 'Ghi chú'}: ${esc(p.ketQua)}</div>` : ''}
    <div class="actions">
      ${mo ? `<button data-bh-sua="${esc(p.id)}">Sửa</button><button data-bh-zalo="${esc(p.id)}">Gửi Zalo</button>${p.trangThai === 'MOI' ? `<button data-bh-nhan="${esc(p.id)}">Nhận xử lý</button>` : ''}<button class="btn-chinh" data-bh-xong="${esc(p.id)}">Xong (chụp ảnh)</button>` : ''}
      ${(p.soAnh || p.soAnhXong) && vp && daKetNoi() ? `<button data-bh-anh="${esc(p.id)}">Xem ảnh</button>` : ''}
      ${con > 0 && p.trangThai === 'XONG' ? `<button class="btn-chinh" data-bh-thu="${esc(p.id)}">Ghi thu ${tienGon(con)}</button>` : ''}
    </div></div>`;
}

function ganNutBH(el) {
  const tim = (id) => (db.baoHanh || []).find((x) => x.id === id);
  el.querySelectorAll('[data-bh-moi]').forEach((b) => { b.onclick = () => moPhieuBH(ctCua(b.dataset.bhMoi)); });
  el.querySelectorAll('[data-bh-sua]').forEach((b) => { b.onclick = () => { const p = tim(b.dataset.bhSua); moPhieuBH(ctCua(p.maCongTrinh), p); }; });
  el.querySelectorAll('[data-bh-zalo]').forEach((b) => { b.onclick = () => { const p = tim(b.dataset.bhZalo); chiaSe(tinGiaoBH(p, ctCua(p.maCongTrinh))); }; });
  el.querySelectorAll('[data-bh-nhan]').forEach((b) => { b.onclick = () => { nhanXuLy(db, tim(b.dataset.bhNhan), vaiTro); luu(); bao('Đã nhận xử lý'); route(); }; });
  el.querySelectorAll('[data-bh-xong]').forEach((b) => { b.onclick = () => moXongBH(tim(b.dataset.bhXong)); });
  el.querySelectorAll('[data-bh-anh]').forEach((b) => { b.onclick = () => moAnhBH(tim(b.dataset.bhAnh)); });
  el.querySelectorAll('[data-bh-thu]').forEach((b) => {
    b.onclick = () => { const p = tim(b.dataset.bhThu); moGhiKhoan({ loai: 'THU', ma: p.maCongTrinh, hangMuc: 'Thu bảo hành', thamChieu: p.id, soTien: conThuBH(db, p), noiDung: `${p.ma} ${p.moTa}` }); };
  });
  el.querySelectorAll('[data-bh-goi]').forEach((b) => {
    b.onclick = () => {
      const [ma, den] = b.dataset.bhGoi.split('|');
      const ct = ctCua(ma), bg = bgCua(db, ma);
      const d = $('#sheet');
      if (d.open) d.close();
      d.innerHTML = `<h2>Đã gọi khách</h2><p>${esc(ct.ten)} · hết bảo hành ${fmtNgay(den)}</p>
        <label class="f">Khách nói gì, hẹn kiểm tra ngày nào</label><div class="mic"><textarea id="gc" placeholder="Vd: nhà ổn, hẹn thứ 7 qua kiểm tra lần cuối"></textarea><button id="noi">🎤</button></div>
        <p class="muted">Lần chăm sóc tháng 12 trong sổ khách được đánh dấu làm luôn.</p>
        <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
      d.showModal();
      $('#noi', d).onclick = () => noiThanhChu($('#gc', d));
      $('#huy', d).onclick = () => d.close();
      $('#ok', d).onclick = () => { daNhacHetHan(db, ct, bg, den, $('#gc', d).value.trim(), vaiTro, homNay()); luu(); d.close(); bao('Đã lưu'); route(); };
    };
  });
}

// Ghi / sửa 1 lỗi bảo hành. Văn phòng chọn tính phí; giám sát không thấy tiền.
function moPhieuBH(ct, cu = null) {
  const d = $('#sheet');
  if (d.open) d.close();
  const vp = laVanPhong();
  const bg = bgCua(db, ct.ma);
  const hn = homNay();
  const nhomDs = bg ? (bg.hangMucBH || []).map((h) => h.nhom) : nhomChinh(ct);
  const giaoDs = [...new Set([GIAM_SAT, ...ct.viec.map((v) => v.nhaThau).filter(Boolean), ...dsThau(db).map((t) => t.ten)])];
  const p0 = cu || { moTa: '', viTri: '', nhom: '', khan: false, giaoCho: '', han: '', coPhi: false, phi: 0, ngayBao: hn };
  let tuKhan = !cu, tuGiao = !cu, tuHan = !cu;
  d.innerHTML = `<h2>${cu ? 'Sửa ' + esc(cu.ma) : 'Ghi lỗi bảo hành'}</h2>
    <p class="muted">${esc(ct.ma)} · ${esc(ct.ten)}${bg ? '' : ' · <b>chưa lập biên bản bàn giao</b>, tính theo bảo hành mặc định 12 tháng'}</p>
    <label class="f">Hạng mục</label><select id="nhom"><option value="">Không rõ / khác</option>${nhomDs.map((n) => `<option ${n === p0.nhom ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select>
    <label class="f">Lỗi gì</label><div class="mic"><textarea id="moTa" placeholder="Vd: chân tường WC tầng 2 bị thấm, bong sơn">${esc(p0.moTa)}</textarea><button id="noi">🎤</button></div>
    <label class="f">Vị trí</label><input id="viTri" value="${esc(p0.viTri)}" placeholder="Vd: WC tầng 2">
    <label class="cham-dong"><input type="checkbox" id="khan" ${p0.khan ? 'checked' : ''}> <span>Khẩn (rò nước, chập điện…): xử lý trong 24 giờ</span></label>
    <div class="hai-cot"><div><label class="f">Giao cho</label><input id="giao" list="dsGiao" value="${esc(p0.giaoCho)}"><datalist id="dsGiao">${giaoDs.map((t) => `<option value="${esc(t)}">`).join('')}</datalist></div>
      <div><label class="f">Hạn xử lý</label><input id="han" type="date" value="${esc(p0.han)}"></div></div>
    <p id="hanBH" class="muted"></p>
    ${vp ? `<label class="cham-dong"><input type="checkbox" id="coPhi" ${p0.coPhi ? 'checked' : ''}> <span>Tính phí (hết hạn bảo hành, hoặc lỗi phát sinh ngoài bảo hành)</span></label>
      <div id="phiO"><label class="f">Số tiền</label><input id="phi" inputmode="decimal" value="${p0.phi ? esc(p0.phi) : ''}" placeholder="Vd: 1,5tr"><p id="phiChu" class="muted"></p></div>` : ''}
    ${cu ? '' : `<label class="btn" style="display:block;text-align:center;margin-top:12px">📷 Ảnh lỗi (nên có)<input id="anh" type="file" accept="image/*" multiple hidden></label><p id="soAnh" class="muted"></p>`}
    <div class="actions">${cu && vp ? '<button id="khong">Không xử lý</button>' : ''}<button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu</button></div>`;
  d.showModal();
  const capNhat = () => {
    const nhom = $('#nhom', d).value;
    if (tuKhan) $('#khan', d).checked = laKhan($('#moTa', d).value);
    if (tuGiao) $('#giao', d).value = goiYGiao(ct, nhom);
    if (tuHan) $('#han', d).value = hanXuLy(p0.ngayBao, $('#khan', d).checked);
    const th = trongHan(bg, nhom, p0.ngayBao);
    const den = bg ? (nhom && (bg.hangMucBH || []).some((h) => h.nhom === nhom) ? hanBaoHanh(bg, nhom) : hetBaoHanh(bg)) : '';
    $('#hanBH', d).innerHTML = bg ? (th ? `Trong hạn bảo hành${den ? ' (đến ' + fmtNgay(den) + ')' : ''}: không tính tiền.` : `<b>Hết hạn bảo hành</b>${den ? ' (' + fmtNgay(den) + ')' : nhom ? ' (hạng mục không bảo hành)' : ''}.`) : '';
    if (vp) {
      if (!cu && !$('#coPhi', d).dataset.da) $('#coPhi', d).checked = !th;
      $('#phiO', d).hidden = !$('#coPhi', d).checked;
      const n = docTien($('#phi', d).value);
      $('#phiChu', d).textContent = Number.isFinite(n) ? `= ${tien(n)}` : $('#phi', d).value ? 'Chưa đọc được số tiền' : '';
    }
  };
  capNhat();
  $('#noi', d).onclick = () => noiThanhChu($('#moTa', d));
  $('#moTa', d).oninput = capNhat;
  $('#nhom', d).onchange = capNhat;
  $('#khan', d).onchange = () => { tuKhan = false; capNhat(); };
  $('#giao', d).oninput = () => { tuGiao = false; };
  $('#han', d).oninput = () => { tuHan = false; };
  if (vp) { $('#coPhi', d).onchange = () => { $('#coPhi', d).dataset.da = '1'; capNhat(); }; $('#phi', d).oninput = capNhat; }
  if (!cu) $('#anh', d).onchange = () => { const k = $('#anh', d).files.length; $('#soAnh', d).textContent = k ? `${k} ảnh` : ''; };
  $('#huy', d).onclick = () => d.close();
  if ($('#khong', d)) {
    $('#khong', d).onclick = () => {
      const nut = $('#khong', d);
      if (nut.dataset.chac !== '1') {
        nut.dataset.chac = '1'; nut.textContent = 'Bấm lần nữa: không xử lý';
        nut.insertAdjacentHTML('beforebegin', '<input id="lyDo" placeholder="Lý do (vd: khách tự sửa, ngoài phạm vi KAS thi công)" style="flex-basis:100%">');
        return;
      }
      khongXuLy(db, cu, $('#lyDo', d).value.trim(), vaiTro); luu(); d.close(); bao('Đã ghi không xử lý'); route();
    };
  }
  $('#ok', d).onclick = async () => {
    const moTa = $('#moTa', d).value.trim();
    if (!moTa) return bao('Ghi giúp lỗi gì');
    const nhom = $('#nhom', d).value;
    const du = { moTa, viTri: $('#viTri', d).value.trim(), nhom, khan: $('#khan', d).checked, giaoCho: $('#giao', d).value.trim() || GIAM_SAT, han: $('#han', d).value || hanXuLy(p0.ngayBao, $('#khan', d).checked) };
    if (vp) {
      const n = docTien($('#phi', d).value);
      du.coPhi = $('#coPhi', d).checked;
      du.phi = du.coPhi && Number.isFinite(n) ? n : 0;
    }
    if (cu) {
      suaBH(db, cu, { ...du, trongHan: trongHan(bg, nhom, cu.ngayBao) });
      luu(); d.close(); bao('Đã lưu'); route();
      return;
    }
    const files = [...$('#anh', d).files];
    const p = baoLoi(db, ct, { ...du, ngay: hn, soAnh: files.length }, vaiTro);
    if (vp) suaBH(db, p, { coPhi: du.coPhi, phi: du.phi, han: du.han, giaoCho: du.giaoCho });
    else suaBH(db, p, { han: du.han, giaoCho: du.giaoCho });
    d.close();
    luu();
    if (files.length) await guiAnhHienTruong(files, ct.ma, p.id);
    bao(`Đã ghi ${p.ma}, giao ${p.giaoCho}`);
    route();
  };
}

function moXongBH(p) {
  const d = $('#sheet');
  if (d.open) d.close();
  d.innerHTML = `<h2>Xong ${esc(p.ma)}</h2><p>${esc(p.moTa)}</p>
    <label class="f">Đã làm gì</label><div class="mic"><textarea id="kq" placeholder="Vd: cắt chân tường, chống thấm lại, sơn hoàn trả"></textarea><button id="noi">🎤</button></div>
    <label class="btn" style="display:block;text-align:center;margin-top:12px">📷 Chụp ảnh sau khi sửa (bắt buộc)<input id="anh" type="file" accept="image/*" capture="environment" multiple hidden></label>
    <p id="soAnh" class="muted"></p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Lưu: đã xong</button></div>`;
  d.showModal();
  $('#noi', d).onclick = () => noiThanhChu($('#kq', d));
  $('#anh', d).onchange = () => { const k = $('#anh', d).files.length; $('#soAnh', d).textContent = k ? `${k} ảnh` : ''; };
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = async () => {
    const files = [...$('#anh', d).files];
    if (!files.length && daKetNoi()) return bao('Cần ít nhất 1 ảnh sau khi sửa');
    xongBH(db, p, { ngay: homNay(), ketQua: $('#kq', d).value.trim(), soAnh: files.length }, vaiTro);
    d.close();
    luu();
    if (files.length) await guiAnhHienTruong(files, p.maCongTrinh, p.id);
    bao(`${p.ma} đã xong`); route();
  };
}

async function moAnhBH(p) {
  const d = $('#sheet');
  if (d.open) d.close();
  d.innerHTML = `<h2>Ảnh ${esc(p.ma)}</h2><div id="ds"><p class="muted">Đang tải…</p></div><div class="actions"><button id="dong">Đóng</button></div>`;
  d.showModal();
  $('#dong', d).onclick = () => d.close();
  try {
    const ds = (await goi('anhThu', { ma: p.maCongTrinh, viec: p.id })).filter((a) => a.thu);
    $('#ds', d).innerHTML = ds.length ? `<div class="luoi-anh">${ds.map((a) => `<img src="data:image/jpeg;base64,${a.thu}" alt="">`).join('')}</div><p class="muted">Ảnh gốc nằm trong thư mục Drive của công trình.</p>`
      : '<p class="muted">Chưa có ảnh trên Drive (ảnh có thể còn chờ gửi từ điện thoại).</p>';
  } catch (e) { $('#ds', d).innerHTML = `<p class="muted">Chưa tải được ảnh: ${esc(e.message)}</p>`; }
}

// Trang công trình: biên bản, phiếu bảo hành, lối vào quyết toán.
function khoiBanGiao(ct) {
  const bg = bgCua(db, ct.ma);
  const hn = homNay();
  const ds = bhCuaCongTrinh(db, ct.ma);
  const mo = ds.filter((p) => p.trangThai === 'MOI' || p.trangThai === 'DANG');
  const dong = ds.filter((p) => !mo.includes(p));
  const th = tongHop(ct, hn);
  if (!bg && !ds.length && th.pctThucTe < 70) return `<h3>Bàn giao, bảo hành</h3><p class="muted">Gần xong (từ 70%) thì lập biên bản bàn giao ở đây.</p><div class="actions"><a class="btn" href="#bg-${esc(ct.ma)}" style="text-align:center">Lập biên bản bàn giao</a></div>`;
  return `<h3>Bàn giao, bảo hành</h3>
    ${bg ? `<a class="card" href="#bg-${esc(ct.ma)}"><div class="row"><span class="name">Biên bản bàn giao ${fmtNgay(bg.ngay)}</span><span class="tag ${TAG_BG[bg.trangThai]}">${TT_BG[bg.trangThai]}</span></div>
      <div class="muted">Bảo hành đến ${mocHetHan(bg).map((m) => `${fmtNgay(m.den)} (${m.nhom.length} hạng mục)`).join(' · ') || '—'}${bg.thanhLy ? ' · đã thanh lý ' + ddmm(bg.thanhLy) : ''}</div>
      ${bg.trangThai === 'NHAP' && bg.khachYKien ? `<div class="muted">Chủ nhà cần trao đổi: ${esc(bg.khachYKien)}</div>` : ''}</a>`
    : `<p class="muted">Chưa lập biên bản bàn giao.</p>`}
    <div class="actions">${bg ? '' : `<a class="btn" href="#bg-${esc(ct.ma)}" style="text-align:center">Lập biên bản bàn giao</a>`}<button data-bh-moi="${esc(ct.ma)}">+ Ghi lỗi bảo hành</button>
      ${laVanPhong() && bg ? `<a class="btn" href="#thanh-ly-${esc(ct.ma)}" style="text-align:center">Quyết toán, thanh lý</a>` : ''}</div>
    ${mo.map((p) => theBH(p, hn)).join('')}
    ${dong.length ? `<details class="cham-ds"><summary>Phiếu bảo hành đã đóng (${dong.length})</summary>${dong.map((p) => theBH(p, hn)).join('')}</details>` : ''}`;
}

// Hôm nay: lỗi bảo hành cần xử lý; văn phòng thêm sắp hết bảo hành, biên bản chờ khách, thu phí, thanh lý.
function baoHanhHomNay(hn) {
  const vp = laVanPhong();
  if (vp) {
    // Biên bản giám sát lập: văn phòng mở app thì hồ sơ khách tự bắt đầu lịch chăm sóc.
    let doi = false;
    for (const bg of db.banGiao || []) { const ct = ctCua(bg.maCongTrinh); if (ct && bg.ngay && !bg.xoa && batDauChamSoc(db, ct, bg, vaiTro, hn)) doi = true; }
    if (doi) luu();
  }
  const x = viecBHHomNay(db, hn, vp);
  let h = '';
  if (x.mo.length) h += `<h3>Bảo hành cần xử lý (${x.mo.length})</h3>${x.mo.map((p) => theBH(p, hn, ctCua(p.maCongTrinh))).join('')}`;
  if (x.sapHet.length) {
    h += `<h3>Sắp hết bảo hành</h3>${x.sapHet.map((s) => `<div class="card"><div class="row"><span class="name">${esc(s.ct.ma)} · ${esc(s.ct.ten)}</span><span class="tag SAP">Hết ${ddmm(s.den)} · còn ${s.con} ngày</span></div>
      <div class="muted">${s.nhom.map(esc).join(', ')}. Gọi khách hỏi thăm, hẹn kiểm tra lần cuối trước khi hết bảo hành (gộp lần chăm sóc tháng 12).</div>
      <div class="actions"><button class="btn-chinh" data-bh-goi="${esc(s.ct.ma)}|${esc(s.den)}">Đã gọi khách</button></div></div>`).join('')}`;
  }
  if (x.choKhach.length) {
    h += `<h3>Biên bản chờ chủ nhà xác nhận</h3>${x.choKhach.map((b) => `<a class="card" href="#bg-${esc(b.maCongTrinh)}"><div class="row"><span class="name">${esc(b.maCongTrinh)} · bàn giao ${ddmm(b.ngay)}</span><span class="tag TRE">Gửi ${ddmm(String(b.guiLuc).slice(0, 10))}</span></div>
      <div class="muted">Nhắc chủ nhà bấm "Đồng ý bàn giao" trên link, hoặc ký bản in.</div></a>`).join('')}`;
  }
  if (x.thuPhi.length) h += `<h3>Phí bảo hành chưa thu</h3>${x.thuPhi.map((p) => theBH(p, hn, ctCua(p.maCongTrinh))).join('')}`;
  if (x.thanhLy.length) {
    h += `<h3>Quyết toán, thanh lý</h3>${x.thanhLy.map((b) => {
      const ct = ctCua(b.maCongTrinh);
      const kq = tongKet(db, ct, hn);
      return `<a class="card" href="#thanh-ly-${esc(ct.ma)}"><div class="row"><span class="name">${esc(ct.ma)} · ${esc(ct.ten)}</span><span class="tag SAP">Bàn giao ${ddmm(b.ngay)}</span></div>
        <div class="muted">Còn phải thu ${tien(kq.tong.conLai)}${kq.canhBao.length ? ` · ${kq.canhBao.length} việc cần xử lý trước` : ' · đủ điều kiện thanh lý'}</div></a>`;
    }).join('')}`;
  }
  return h;
}

// Lập, sửa biên bản bàn giao (giám sát và văn phòng). Không có tiền.
function manBanGiao(ma) {
  const ct = ctCua(ma);
  if (!ct) return manDanhSach();
  datTab('cong-trinh', 'Bàn giao ' + ct.ma);
  const hn = homNay();
  const v = $('#view');
  const bg = bgCua(db, ma);
  if (!bg) {
    v.innerHTML = `<h2>Lập biên bản bàn giao</h2><p>${esc(ct.ten)}</p>
      <p class="muted">App lấy sẵn hạng mục theo kế hoạch (bảo hành 12 tháng, sửa riêng từng hạng mục được), danh mục chìa khoá, giấy tờ mẫu, và tồn tại còn mở từ nghiệm thu.</p>
      <label class="f">Ngày bàn giao</label><input id="ngay" type="date" value="${hn}">
      <div class="actions"><a class="btn" href="#ct-${esc(ma)}" style="text-align:center">Quay lại</a><button id="tao" class="btn-chinh">Lập biên bản</button></div>`;
    $('#tao').onclick = () => {
      const b = taoBienBan(db, ct, $('#ngay').value || hn, vaiTro);
      if (laVanPhong() && batDauChamSoc(db, ct, b, vaiTro, hn)) bao('Đã tạo lịch chăm sóc 1, 3, 6, 12 tháng trong sổ khách');
      luu(); manBanGiao(ma);
    };
    return;
  }
  const nhap = JSON.parse(JSON.stringify(bg));
  const tt = tonTaiMo(db, hn, ma);
  const docForm = () => {
    nhap.ngay = $('#ngay').value || nhap.ngay;
    v.querySelectorAll('[data-hm]').forEach((o) => { nhap.hangMucBH[+o.dataset.hm].thang = Math.max(0, Number(o.value) || 0); });
    v.querySelectorAll('[data-tb]').forEach((o) => { const [i, k] = o.dataset.tb.split('|'); nhap.thietBi[+i][k] = k === 'thang' ? Math.max(0, Number(o.value) || 0) : o.value.trim(); });
    v.querySelectorAll('[data-gn]').forEach((o) => { const [i, k] = o.dataset.gn.split('|'); nhap.giaoNhan[+i][k] = k === 'da' ? o.checked : o.value.trim(); });
    nhap.ghiChu = $('#gc').value.trim();
  };
  const luuNhap = () => {
    docForm();
    nhap.thietBi = nhap.thietBi.filter((t) => t.ten);
    nhap.giaoNhan = nhap.giaoNhan.filter((g) => g.ten);
    suaBienBan(db, bg, { ngay: nhap.ngay, hangMucBH: nhap.hangMucBH, thietBi: nhap.thietBi, giaoNhan: nhap.giaoNhan, ghiChu: nhap.ghiChu });
    if (laVanPhong()) batDauChamSoc(db, ct, bg, vaiTro, hn);
    luu();
  };
  const o = (i, k, ph, cls = '') => `<input data-tb="${i}|${k}" value="${esc(nhap.thietBi[i][k] ?? '')}" placeholder="${ph}" ${cls}>`;
  const ve = () => {
    v.innerHTML = `<h2>Biên bản bàn giao</h2>
      <p class="muted">${esc(ct.ma)} · ${esc(ct.ten)} · <span class="tag ${TAG_BG[bg.trangThai]}">${TT_BG[bg.trangThai]}</span>${bg.khachLuc && bg.trangThai === 'DONG_Y' ? ` ${QUA_BG[bg.khachQua] || ''} ${ddmm(String(bg.khachLuc).slice(0, 10))}` : ''}</p>
      ${bg.trangThai === 'NHAP' && bg.khachYKien ? `<p class="note">Chủ nhà cần trao đổi: ${esc(bg.khachYKien)}</p>` : ''}
      ${bg.trangThai === 'DONG_Y' ? '<p class="note">Chủ nhà đã xác nhận. Sửa nội dung thì bấm "Gửi chủ nhà xác nhận" lại.</p>' : ''}
      <label class="f">Ngày bàn giao</label><input id="ngay" type="date" value="${esc(nhap.ngay)}">
      <h3>Bảo hành theo hạng mục</h3><p class="muted">Mặc định 12 tháng. Hạng mục chính sửa riêng (vd chống thấm 60 tháng). Ghi 0 nếu không bảo hành.</p>
      ${nhap.hangMucBH.map((h, i) => `<div class="cham-dong" style="align-items:center"><span style="flex:1">${esc(h.nhom)}</span><input data-hm="${i}" type="number" inputmode="numeric" min="0" value="${esc(h.thang)}" style="width:76px"> <span class="muted" style="width:92px">tháng${hanBaoHanh(nhap, h.nhom) ? ', đến ' + ddmm(hanBaoHanh(nhap, h.nhom)) + '/' + hanBaoHanh(nhap, h.nhom).slice(2, 4) : ''}</span></div>`).join('')}
      <div class="actions"><input id="hmMoi" placeholder="Thêm hạng mục bảo hành"><button id="themHM">Thêm</button></div>
      <h3>Thiết bị (bảo hành theo nhà sản xuất)</h3>
      ${nhap.thietBi.map((t, i) => `<div class="card">${o(i, 'ten', 'Tên thiết bị (vd bình nóng lạnh)')}
        <div class="hai-cot">${o(i, 'hang', 'Hãng')}${o(i, 'model', 'Model')}</div>
        <div class="hai-cot">${o(i, 'viTri', 'Vị trí (vd WC1)')}<input data-tb="${i}|thang" type="number" inputmode="numeric" min="0" value="${esc(t.thang || '')}" placeholder="BH hãng (tháng)"></div>
        <div class="actions"><button data-xoa-tb="${i}">Xoá</button></div></div>`).join('') || '<p class="muted">Chưa có thiết bị.</p>'}
      <div class="actions"><button id="themTB">+ Thêm thiết bị</button></div>
      <h3>Chìa khoá, giấy tờ, sách hướng dẫn</h3>
      ${nhap.giaoNhan.map((g, i) => `<div class="cham-dong" style="align-items:center"><input type="checkbox" data-gn="${i}|da" ${g.da ? 'checked' : ''}><input data-gn="${i}|ten" value="${esc(g.ten)}" style="flex:1"><input data-gn="${i}|soLuong" value="${esc(g.soLuong)}" placeholder="SL" style="width:64px"></div>`).join('')}
      <p class="muted">Tick những thứ đã giao. Xoá chữ ở ô tên để bỏ dòng.</p>
      <div class="actions"><button id="themGN">+ Thêm dòng</button></div>
      <h3>Tồn tại còn lại (${tt.length})</h3>
      ${tt.map(({ v: x, t }) => `<p class="muted">• ${esc(t.noiDung)}${x ? ' (' + esc(x.hangMuc) + ')' : ''} · hạn sửa ${ddmm(t.hanSua)}${t.hanSua < hn ? ' <span class="tre">quá hạn</span>' : ''}</p>`).join('') || '<p class="muted">Không còn tồn tại nào từ nghiệm thu.</p>'}
      <input id="ttMoi" placeholder="Thêm tồn tại khi bàn giao (vd xước cánh tủ bếp)" style="margin-top:8px"><div class="actions"><input id="ttHan" type="date" value="${addDaysUI(hn, HAN_SUA_MAC_DINH)}" title="Hạn sửa"><button id="themTT">Thêm tồn tại</button></div>
      <p class="muted">Đánh dấu đã sửa ở mục Nghiệm thu trong trang công trình.</p>
      <h3>Ghi chú</h3><div class="mic"><textarea id="gc" placeholder="Vd: chủ nhà nhận nhà, đồng hồ điện 01234, nước 0567">${esc(nhap.ghiChu)}</textarea><button id="noi">🎤</button></div>
      <h3>Ảnh bàn giao</h3><p class="muted">${bg.soAnh ? bg.soAnh + ' ảnh đã chụp, lưu trong thư mục Drive công trình.' : 'Chưa có ảnh.'}</p>
      <label class="btn" style="display:block;text-align:center">📷 Chụp ảnh bàn giao<input id="anh" type="file" accept="image/*" capture="environment" multiple hidden></label>
      <div class="actions"><button id="luu" class="btn-chinh">Lưu</button><a class="btn" id="inBB" href="#bg-in-${esc(ma)}" style="text-align:center">Bản in để ký</a></div>
      <div class="actions"><button id="gui">${bg.guiLuc ? 'Gửi lại chủ nhà xác nhận' : 'Gửi chủ nhà xác nhận'}</button>${bg.trangThai !== 'DONG_Y' ? '<button id="kyGiay">Chủ nhà đã ký giấy</button>' : ''}</div>
      <div class="actions"><a class="btn" href="#ct-${esc(ma)}" style="text-align:center">Về công trình</a></div>`;
    $('#noi').onclick = () => noiThanhChu($('#gc'));
    $('#ngay').onchange = () => { docForm(); ve(); };
    v.querySelectorAll('[data-hm]').forEach((x) => { x.onchange = () => { docForm(); ve(); }; });
    $('#themHM').onclick = () => { docForm(); const t = $('#hmMoi').value.trim(); if (!t) return; nhap.hangMucBH.push({ nhom: t, thang: BH_MAC_DINH }); ve(); };
    $('#themTB').onclick = () => { docForm(); nhap.thietBi.push({ ten: '', hang: '', model: '', viTri: '', thang: '' }); ve(); };
    v.querySelectorAll('[data-xoa-tb]').forEach((b) => { b.onclick = () => { docForm(); nhap.thietBi.splice(+b.dataset.xoaTb, 1); ve(); }; });
    $('#themGN').onclick = () => { docForm(); nhap.giaoNhan.push({ ten: '', soLuong: '', da: false }); ve(); };
    $('#themTT').onclick = () => {
      const t = $('#ttMoi').value.trim();
      if (!t) return;
      luuNhap();
      nghiemThu(db, ct, 'BAN_GIAO', { ngay: hn, muc: [], tonTaiThem: [t], soAnh: 0, hanSua: $('#ttHan').value || addDaysUI(hn, HAN_SUA_MAC_DINH) }, vaiTro);
      luu(); bao('Đã thêm tồn tại'); manBanGiao(ma);
    };
    $('#anh').onchange = async (e) => {
      const files = [...e.target.files];
      if (!files.length) return;
      luuNhap();
      suaBienBan(db, bg, { soAnh: (Number(bg.soAnh) || 0) + files.length });
      luu();
      await guiAnhHienTruong(files, ct.ma, 'BAN_GIAO');
      manBanGiao(ma);
    };
    $('#luu').onclick = () => { luuNhap(); bao('Đã lưu biên bản'); manBanGiao(ma); };
    $('#inBB').onclick = () => { luuNhap(); };
    $('#gui').onclick = () => {
      luuNhap();
      guiChuNha(db, ct, bg, hn, vaiTro);
      luu();
      chiaSe(tinGuiBienBan(ct, linkChuNhaCua(ct)));
      manBanGiao(ma);
    };
    if ($('#kyGiay')) {
      $('#kyGiay').onclick = (e) => {
        const b = e.currentTarget;
        if (b.dataset.chac !== '1') { b.dataset.chac = '1'; b.textContent = 'Bấm lần nữa: chủ nhà đã ký bản in'; return; }
        luuNhap();
        if (!bg.guiLuc) guiChuNha(db, ct, bg, hn, vaiTro); // chụp danh sách tồn tại vào biên bản
        khachXacNhan(db, bg, { dongY: true, qua: 'GIAY' }, vaiTro);
        luu(); bao('Đã ghi chủ nhà ký biên bản'); manBanGiao(ma);
      };
    }
  };
  ve();
}

// Bản in biên bản bàn giao để ký giấy.
function manInBienBan(ma) {
  const ct = ctCua(ma);
  const bg = ct && bgCua(db, ma);
  if (!bg) return manBanGiao(ma);
  datTab('cong-trinh', 'Biên bản bàn giao');
  const kh = khachCuaCT(ct);
  const hds = hdCuaCongTrinh(db, ma).filter((h) => h.trangThai !== 'DUNG' && h.dang !== 'TK');
  const tonTai = bg.guiLuc ? bg.tonTai || [] : tonTaiMo(db, homNay(), ma).map(({ v, t }) => ({ noiDung: t.noiDung, hangMuc: v ? v.hangMuc : '', hanSua: t.hanSua }));
  const gio = bg.khachLuc ? new Date(bg.khachLuc).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  let so = 0;
  const muc = (t) => `<h3>${++so}. ${t}</h3>`;
  $('#view').innerHTML = `<div class="giay">
    <p class="giay-dau"><b>CÔNG TY TNHH KAS VIỆT NAM · KAS HOUZING</b></p>
    <h2>BIÊN BẢN BÀN GIAO CÔNG TRÌNH</h2>
    <p>Công trình: <b>${esc(ct.ten)}</b> (mã ${esc(ct.ma)})${kh && kh.diaChi ? '<br>Địa chỉ: ' + esc(kh.diaChi) : ''}</p>
    ${hds.length ? `<p>Theo hợp đồng số: ${hds.map((h) => `<b>${esc(h.soHD)}</b> ký ngày ${fmtNgay(h.ngayKy)}`).join('; ')}</p>` : ''}
    <p>Chủ nhà: ${esc(kh ? kh.ten : ct.chuNha || '………………………………')}${kh && kh.sdt ? ' · ĐT ' + esc(kh.sdt) : ''}</p>
    <p>Ngày bàn giao: <b>${fmtNgay(bg.ngay)}</b></p>
    ${muc('Hạng mục bàn giao và thời hạn bảo hành thi công')}
    <table><tr><th>Hạng mục</th><th>Bảo hành</th><th>Đến ngày</th></tr>
      ${(bg.hangMucBH || []).map((h) => `<tr><td>${esc(h.nhom)}</td><td>${Number(h.thang) ? h.thang + ' tháng' : 'Không bảo hành'}</td><td>${fmtNgay(hanBaoHanh(bg, h.nhom)) === '……/……/……' ? '' : fmtNgay(hanBaoHanh(bg, h.nhom))}</td></tr>`).join('')}</table>
    ${(bg.thietBi || []).length ? `${muc('Thiết bị (bảo hành theo chính sách nhà sản xuất)')}
    <table><tr><th>Thiết bị</th><th>Hãng, model</th><th>Vị trí</th><th>BH hãng đến</th></tr>
      ${bg.thietBi.map((t) => `<tr><td>${esc(t.ten)}</td><td>${esc([t.hang, t.model].filter(Boolean).join(' '))}</td><td>${esc(t.viTri)}</td><td>${hanThietBi(bg, t) ? fmtNgay(hanThietBi(bg, t)) : ''}</td></tr>`).join('')}</table>` : ''}
    ${muc('Chìa khoá, giấy tờ, sách hướng dẫn đã giao')}
    <table><tr><th>Nội dung</th><th>Số lượng</th><th>Đã giao</th></tr>
      ${(bg.giaoNhan || []).map((g) => `<tr><td>${esc(g.ten)}</td><td>${esc(g.soLuong)}</td><td>${g.da ? '✓' : ''}</td></tr>`).join('')}</table>
    ${muc('Tồn tại còn lại, KAS sửa theo hạn')}
    ${tonTai.length ? `<table><tr><th>Nội dung</th><th>Hạn sửa</th></tr>${tonTai.map((t) => `<tr><td>${esc(t.noiDung)}${t.hangMuc ? ' (' + esc(t.hangMuc) + ')' : ''}</td><td>${fmtNgay(t.hanSua)}</td></tr>`).join('')}</table>` : '<p>Không còn tồn tại.</p>'}
    ${bg.ghiChu ? `${muc('Ghi chú')}<p>${esc(bg.ghiChu)}</p>` : ''}
    <p>KAS Houzing bảo hành phần thi công theo thời hạn trên, tính từ ngày bàn giao. Thiết bị bảo hành theo chính sách của nhà sản xuất, KAS hỗ trợ liên hệ hãng. Bảo hành không áp dụng cho hư hỏng do sử dụng sai hướng dẫn, thiên tai, hoặc do bên khác tự ý sửa chữa, cải tạo.</p>
    <p>Khi cần bảo hành, chủ nhà báo qua link theo dõi công trình KAS đã gửi, hoặc gọi KAS. Lỗi khẩn (rò nước, chập điện) KAS xử lý trong 24 giờ, lỗi khác trong 3 ngày.</p>
    ${bg.soAnh ? `<p>Kèm ${bg.soAnh} ảnh hiện trạng lúc bàn giao, lưu trong hồ sơ công trình.</p>` : ''}
    ${bg.trangThai === 'DONG_Y' && bg.khachQua === 'LINK' ? `<p>Chủ nhà đã bấm xác nhận bàn giao trên link lúc ${esc(gio)}.</p>` : ''}
    <div class="ky"><div><b>ĐẠI DIỆN CHỦ NHÀ</b><br><i>(Ký, ghi rõ họ tên)</i></div><div><b>ĐẠI DIỆN KAS HOUZING</b><br><i>(Ký, ghi rõ họ tên)</i></div></div>
  </div>
  <div class="actions khong-in"><button id="in" class="btn-chinh">In / lưu PDF</button><a class="btn" href="#bg-${esc(ma)}" style="text-align:center">Quay lại</a></div>`;
  $('#in').onclick = () => window.print();
}

// Tổng kết nghiệm thu + phát sinh → thanh toán cuối cùng → thanh lý (văn phòng).
function manThanhLy(ma) {
  const ct = ctCua(ma);
  if (!ct) return manDanhSach();
  datTab('cong-trinh', 'Quyết toán ' + ct.ma);
  const hn = homNay();
  const bg = bgCua(db, ma);
  const kq = tongKet(db, ct, hn);
  const kh = khachCuaCT(ct);
  const tk = (db.caiDat && db.caiDat.taiKhoan) || '';
  const conHD = hdCuaCongTrinh(db, ma).some((h) => h.trangThai === 'HIEU_LUC');
  const nt = kq.nghiemThu, ps = kq.phatSinh;
  $('#view').innerHTML = `<div class="khong-in">
    <h2>Quyết toán, thanh lý</h2>
    <p class="muted">${esc(ct.ma)} · ${esc(ct.ten)} · ${bg ? 'bàn giao ' + fmtNgay(bg.ngay) + ' · ' + TT_BG[bg.trangThai].toLowerCase() : '<b>chưa lập biên bản bàn giao</b>'}${bg && bg.thanhLy ? ' · đã thanh lý ' + fmtNgay(bg.thanhLy) : ''}</p>
    ${kq.canhBao.length ? `<div class="note"><b>Nên xử lý trước khi thanh lý:</b><br>${kq.canhBao.map(esc).join('<br>')}</div>` : '<p class="note">Nghiệm thu và phát sinh đã chốt hết, đủ điều kiện thanh lý.</p>'}
    <div class="so-lieu"><div><span>Tổng quyết toán</span><b>${tienGon(kq.tong.phaiThu)}</b></div><div><span>Đã thu</span><b>${tienGon(kq.tong.daThu)}</b></div><div><span>Còn phải thu</span><b class="${kq.tong.conLai > 0 ? 'tre' : ''}">${tienGon(kq.tong.conLai)}</b></div></div>
    <h3>Nghiệm thu</h3>
    <p>${nt.tong} việc thầu đã xong: ${nt.dat} đạt · ${nt.tonTai} còn tồn tại · ${nt.chua} chưa nghiệm thu${nt.chuaXong.length ? ` · ${nt.chuaXong.length} việc chưa báo 100%` : ''}</p>
    ${nt.dsTonTai.map(({ v, t }) => `<p class="muted">• ${esc(t.noiDung)}${v ? ' (' + esc(v.hangMuc) + ')' : ''} · hạn ${ddmm(t.hanSua)}</p>`).join('')}
    ${nt.chuaXong.length ? `<details class="cham-ds"><summary>Việc chưa báo 100% (${nt.chuaXong.length})</summary>${nt.chuaXong.map((x) => `<p class="muted">• ${esc(x.hangMuc)} · ${x.phanTram}%</p>`).join('')}</details>` : ''}
    <h3>Phát sinh</h3>
    ${ps.duyet.length ? `<div class="wrap"><table><tr><th>Mã</th><th>Nội dung</th><th class="so">Giá</th><th class="so">Đã thu</th></tr>
      ${ps.duyet.map((p) => `<tr><td>${esc(p.ma)}</td><td>${esc(p.moTa)}${p.daLam ? '' : ' <span class="tre">chưa báo làm xong</span>'}</td><td class="so">${tien(p.giaBan)}</td><td class="so">${tien(daThuPS(db, p))}</td></tr>`).join('')}
      <tr><th colspan="2">Cộng phát sinh</th><th class="so">${tien(ps.giaBan)}</th><th class="so">${tien(ps.daThu)}</th></tr></table></div>` : '<p class="muted">Không có phát sinh được duyệt.</p>'}
    ${ps.treo.length ? `<p class="muted">Chưa chốt: ${ps.treo.map((p) => esc(p.ma + ' ' + p.moTa)).join('; ')}</p>` : ''}
    ${ps.khong.length ? `<p class="muted">Khách không làm: ${ps.khong.map((p) => esc(p.ma + ' ' + p.moTa)).join('; ')}</p>` : ''}
    <h3>Hợp đồng</h3>
    ${kq.hd.length ? `<div class="wrap"><table><tr><th>Hợp đồng</th><th class="so">Giá trị ký</th><th class="so">Phụ lục</th><th class="so">Trừ phí TK</th><th class="so">Quyết toán</th><th class="so">Đã thu</th><th class="so">Còn lại</th></tr>
      ${kq.hd.map((x) => `<tr><td><a href="#${esc(x.hd.ma)}">${esc(x.hd.soHD)}</a><br><span class="muted">${esc(x.ten)} · ${TT_HD[x.hd.trangThai]}</span></td><td class="so">${tien(x.giaTriKy)}</td><td class="so">${tien(x.phuLuc)}</td><td class="so">${x.truTK ? '−' + tien(x.truTK) : ''}</td><td class="so">${tien(x.phaiThu)}</td><td class="so">${tien(x.daThu)}</td><td class="so">${tien(x.conLai)}</td></tr>`).join('')}</table></div>` : '<p class="muted">Công trình chưa gắn hợp đồng nào.</p>'}
    <p class="muted">Bản in bên dưới là biên bản quyết toán và thanh lý hợp đồng để hai bên ký.</p>
  </div>
  <div class="giay">
    <p class="giay-dau"><b>CÔNG TY TNHH KAS VIỆT NAM · KAS HOUZING</b></p>
    <h2>BIÊN BẢN QUYẾT TOÁN VÀ THANH LÝ HỢP ĐỒNG</h2>
    <p>Công trình: <b>${esc(ct.ten)}</b> (mã ${esc(ct.ma)})</p>
    <p>Chủ nhà: ${esc(kh ? kh.ten : ct.chuNha || '………………………………')}</p>
    <p>Căn cứ: ${kq.hd.map((x) => `hợp đồng số <b>${esc(x.hd.soHD)}</b> ký ngày ${fmtNgay(x.hd.ngayKy)}`).join('; ') || '………………'}${bg ? `; biên bản bàn giao ngày ${fmtNgay(bg.ngay)}` : ''}${ps.duyet.length ? '; các phát sinh chủ nhà đã đồng ý' : ''}.</p>
    <table><tr><th>Nội dung</th><th class="so">Số tiền (đ)</th></tr>
      ${kq.hd.map((x) => `<tr><td>Hợp đồng ${esc(x.hd.soHD)}: giá trị ký ${tien(x.giaTriKy)}${x.phuLuc ? `, phụ lục ${x.phuLuc > 0 ? '+' : ''}${tien(x.phuLuc)}` : ''}${x.truTK ? `, khấu trừ phí thiết kế −${tien(x.truTK)}` : ''}</td><td class="so">${tien(x.phaiThu)}</td></tr>`).join('')}
      ${ps.duyet.map((p) => `<tr><td>Phát sinh ${esc(p.ma)}: ${esc(p.moTa)}</td><td class="so">${tien(p.giaBan)}</td></tr>`).join('')}
      <tr><th>Tổng giá trị quyết toán</th><th class="so">${tien(kq.tong.phaiThu)}</th></tr>
      <tr><td>Chủ nhà đã thanh toán</td><td class="so">${tien(kq.tong.daThu)}</td></tr>
      <tr><th>Còn phải thanh toán</th><th class="so">${tien(kq.tong.conLai)}</th></tr></table>
    ${kq.tong.conLai > 0 && tk ? `<p>Thông tin chuyển khoản: ${esc(tk).replace(/\n/g, '<br>')}</p>` : ''}
    <p>${kq.tong.conLai > 0 ? 'Chủ nhà thanh toán số tiền còn lại nêu trên. Sau khi thanh toán đủ, hai' : 'Hai'} bên thống nhất thanh lý các hợp đồng trên. Nghĩa vụ bảo hành của KAS Houzing theo biên bản bàn giao vẫn giữ nguyên đến hết thời hạn bảo hành.</p>
    <div class="ky"><div><b>ĐẠI DIỆN CHỦ NHÀ</b><br><i>(Ký, ghi rõ họ tên)</i></div><div><b>ĐẠI DIỆN KAS HOUZING</b><br><i>(Ký, ghi rõ họ tên)</i></div></div>
  </div>
  <div class="actions khong-in"><button id="in">In / lưu PDF</button><button id="zalo">Gửi Zalo đề nghị thanh toán cuối</button></div>
  <div class="actions khong-in">${conHD ? `<button id="xong" class="btn-chinh">Thanh lý xong</button>` : '<p class="muted">Các hợp đồng đã hoàn thành.</p>'}<a class="btn" href="#ct-${esc(ma)}" style="text-align:center">Về công trình</a></div>`;
  $('#in').onclick = () => window.print();
  $('#zalo').onclick = () => chiaSe(tinThanhToanCuoi(ct, kq, tk));
  const nut = $('#xong');
  if (nut) {
    nut.onclick = () => {
      if (nut.dataset.chac !== '1') {
        nut.dataset.chac = '1';
        nut.textContent = kq.tong.conLai > 0 ? `Còn ${tienGon(kq.tong.conLai)} chưa thu. Bấm lần nữa để vẫn thanh lý` : kq.canhBao.length ? 'Còn việc chưa xử lý. Bấm lần nữa để vẫn thanh lý' : 'Bấm lần nữa để thanh lý';
        return;
      }
      thanhLy(db, ct, bg, hn, vaiTro);
      luu(); bao('Đã thanh lý. Công trình rời bảng tổng, bảo hành vẫn theo dõi'); manThanhLy(ma);
    };
  }
}

// Link chủ nhà: biên bản bàn giao, hạn bảo hành, phiếu bảo hành và nút báo lỗi.
function khoiBanGiaoChuNha(bg, dsBH) {
  if (!bg) return '';
  const nhan = { CHO_KHACH: 'Chờ anh/chị xác nhận', DONG_Y: 'Đã xác nhận', NHAP: 'KAS đang chỉnh lại' }[bg.trangThai];
  const ttBH = { MOI: 'KAS đã nhận', DANG: 'Đang xử lý', XONG: 'Đã xử lý xong', KHONG: 'Không thuộc bảo hành' };
  return `<h3>Bàn giao, bảo hành</h3>
    <div class="card"><div class="row"><span class="name">Biên bản bàn giao ${fmtNgay(bg.ngay)}</span><span class="tag ${TAG_BG[bg.trangThai]}">${nhan}</span></div>
      <table><tr><th>Hạng mục</th><th>Bảo hành đến</th></tr>${(bg.hangMucBH || []).map((h) => `<tr><td>${esc(h.nhom)}</td><td>${hanBaoHanh(bg, h.nhom) ? fmtNgay(hanBaoHanh(bg, h.nhom)) : 'Không bảo hành'}</td></tr>`).join('')}</table>
      ${(bg.thietBi || []).length ? `<p class="muted"><b>Thiết bị</b> (bảo hành theo hãng):<br>${bg.thietBi.map((t) => `${esc(t.ten)}${t.hang || t.model ? ' · ' + esc([t.hang, t.model].filter(Boolean).join(' ')) : ''}${hanThietBi(bg, t) ? ' · đến ' + fmtNgay(hanThietBi(bg, t)) : ''}`).join('<br>')}</p>` : ''}
      ${(bg.giaoNhan || []).some((g) => g.da) ? `<p class="muted"><b>Đã giao:</b> ${bg.giaoNhan.filter((g) => g.da).map((g) => esc(g.ten) + (g.soLuong ? ' (' + esc(g.soLuong) + ')' : '')).join(', ')}</p>` : ''}
      ${(bg.tonTai || []).length ? `<p class="muted"><b>KAS sửa nốt:</b><br>${bg.tonTai.map((t) => `${esc(t.noiDung)} · trước ${ddmm(t.hanSua)}`).join('<br>')}</p>` : ''}
      ${bg.trangThai === 'CHO_KHACH' ? `<div class="actions"><button data-bg-sua="1">Cần trao đổi thêm</button><button data-bg-ok="1" class="btn-chinh">Đồng ý bàn giao</button></div>` : ''}
    </div>
    <div class="actions"><button id="baoLoiBH" class="btn-chinh">Báo lỗi cần bảo hành</button></div>
    ${dsBH.map((p) => `<div class="card"><div class="row"><span class="name">${esc(p.ma)} · ${esc(p.moTa)}</span><span class="tag ${TAG_BH[p.trangThai]}">${ttBH[p.trangThai]}</span></div>
      <div class="muted">Báo ${ddmm(p.ngayBao)}${p.trangThai === 'MOI' || p.trangThai === 'DANG' ? ` · KAS xử lý trước ${ddmm(p.han)}` : ''}${p.ngayXong ? ' · xong ' + ddmm(p.ngayXong) : ''} · ${p.coPhi ? 'có tính phí' + (Number(p.phi) ? ' ' + tien(p.phi) : '') : 'trong bảo hành, không tính phí'}</div>
      ${p.ketQua ? `<div class="muted">${esc(p.ketQua)}</div>` : ''}</div>`).join('')}`;
}

function moBaoLoiChuNha(ct, bg, maLink, api) {
  const d = $('#sheet');
  if (d.open) d.close();
  const id = 'BH-' + taoMa() + taoMa();
  d.innerHTML = `<h2>Báo lỗi cần bảo hành</h2>
    <label class="f">Hạng mục</label><select id="nhom"><option value="">Không rõ / khác</option>${(bg.hangMucBH || []).map((h) => `<option>${esc(h.nhom)}</option>`).join('')}</select>
    <label class="f">Lỗi gì</label><div class="mic"><textarea id="moTa" placeholder="Vd: chân tường WC tầng 2 bị thấm, bong sơn"></textarea><button id="noi">🎤</button></div>
    <label class="f">Vị trí</label><input id="viTri" placeholder="Vd: WC tầng 2">
    <label class="cham-dong"><input type="checkbox" id="khan"> <span>Khẩn: rò nước, chập điện, nguy hiểm</span></label>
    <label class="btn" style="display:block;text-align:center;margin-top:12px">📷 Ảnh lỗi (tối đa 3)<input id="anh" type="file" accept="image/*" multiple hidden></label>
    <p id="soAnh" class="muted"></p>
    <div class="actions"><button id="huy">Huỷ</button><button id="ok" class="btn-chinh">Gửi KAS</button></div>`;
  d.showModal();
  let tuKhan = true;
  $('#noi', d).onclick = () => noiThanhChu($('#moTa', d));
  $('#moTa', d).oninput = () => { if (tuKhan) $('#khan', d).checked = laKhan($('#moTa', d).value); };
  $('#khan', d).onchange = () => { tuKhan = false; };
  $('#anh', d).onchange = () => { const k = $('#anh', d).files.length; $('#soAnh', d).textContent = k > 3 ? 'Chỉ gửi 3 ảnh đầu' : k ? `${k} ảnh` : ''; };
  $('#huy', d).onclick = () => d.close();
  $('#ok', d).onclick = async () => {
    const moTa = $('#moTa', d).value.trim();
    if (!moTa) return bao('Anh/chị ghi giúp lỗi gì');
    const nut = $('#ok', d);
    nut.disabled = true; nut.textContent = 'Đang gửi…';
    const du = { moTa, viTri: $('#viTri', d).value.trim(), nhom: $('#nhom', d).value, khan: $('#khan', d).checked };
    try {
      const files = [...$('#anh', d).files].slice(0, 3);
      if (api) {
        const anh = [];
        for (const f of files) anh.push(await nenAnh(f, 1280, 0.7));
        const p = await chuNhaBaoLoi(api, { maLink, id, ...du, anh });
        d.close();
        bao(`KAS đã nhận ${p.ma}, sẽ xử lý trước ${ddmm(p.han)}`, 4000);
      } else {
        const p = baoLoi(db, ct, { ...du, ngay: homNay(), soAnh: files.length }, 'CHU_NHA');
        luu();
        d.close();
        bao(`KAS đã nhận ${p.ma}, sẽ xử lý trước ${ddmm(p.han)}`, 4000);
      }
      manChuNha(maLink, api);
    } catch (e) { nut.disabled = false; nut.textContent = 'Gửi lại'; bao('Chưa gửi được: ' + e.message); }
  };
}

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
  // Màn Hôm nay tự vẽ lại khi tới mốc nhắc báo cáo (16h, 17h, 17h30) và trưa thứ 7.
  let mocCu = mocNhacHienTai();
  setInterval(() => {
    const moc = mocNhacHienTai();
    if (moc === mocCu) return;
    mocCu = moc;
    if (['', '#', '#hom-nay'].includes(location.hash) && !$('#sheet').open && !dangGo()) route();
  }, 60000);
  route();
  capNhatTrangThai();
  chayDongBo();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
}
main();
