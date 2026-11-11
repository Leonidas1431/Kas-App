// Ảnh hiện trường: nén trên máy (cạnh dài 1600px), xếp hàng trong IndexedDB, có mạng thì gửi lên Drive.
// Mất sóng vẫn chụp được; ảnh nằm chờ trên máy đến khi gửi xong.
const TEN_DB = 'kas-anh';

function mo() {
  return new Promise((ok, loi) => {
    const r = indexedDB.open(TEN_DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('cho', { keyPath: 'id' });
    r.onsuccess = () => ok(r.result);
    r.onerror = () => loi(r.error);
  });
}

function giaoDich(che, fn) {
  return mo().then((db) => new Promise((ok, loi) => {
    const tx = db.transaction('cho', che);
    const kq = fn(tx.objectStore('cho'));
    tx.oncomplete = () => ok(kq && 'result' in kq ? kq.result : undefined);
    tx.onerror = () => loi(tx.error);
  }));
}

export async function nenAnh(file, canh = 1600, chatLuong = 0.75) {
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const tl = Math.min(1, canh / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * tl);
  c.height = Math.round(bmp.height * tl);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', chatLuong).split(',')[1];
}

const hai = (n) => String(n).padStart(2, '0');

// Tên file: MaDA_YYYYMMDD_HHmm_MaViec_01.jpg (giờ trên điện thoại)
export function tenAnh(ma, viec, luc, stt) {
  const d = luc;
  return `${ma}_${d.getFullYear()}${hai(d.getMonth() + 1)}${hai(d.getDate())}_${hai(d.getHours())}${hai(d.getMinutes())}_${viec}_${hai(stt)}.jpg`;
}

export async function xepAnh(files, ma, viec) {
  const luc = new Date();
  const ds = [];
  let stt = 1;
  for (const f of files) {
    const base64 = await nenAnh(f);
    ds.push({ id: crypto.randomUUID(), ma, viec, tenFile: tenAnh(ma, viec, luc, stt++), base64 });
  }
  await giaoDich('readwrite', (s) => ds.forEach((a) => s.put(a)));
  return ds.length;
}

export function demCho() {
  return giaoDich('readonly', (s) => s.count()).catch(() => 0);
}

let dangGui = null;

// Gửi lần lượt từng ảnh; ảnh nào gửi xong mới xoá khỏi máy.
export function guiAnhCho(goi, baoTienDo) {
  if (dangGui) return dangGui;
  dangGui = (async () => {
    let da = 0;
    try {
      const ds = await giaoDich('readonly', (s) => s.getAll());
      for (const a of ds) {
        if (!navigator.onLine) break;
        await goi('guiAnh', a);
        await giaoDich('readwrite', (s) => s.delete(a.id));
        da++;
        baoTienDo && baoTienDo(da, ds.length);
      }
    } finally {
      dangGui = null;
    }
    return da;
  })();
  return dangGui;
}
