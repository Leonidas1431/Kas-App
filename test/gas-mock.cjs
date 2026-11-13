// Giả lập tối thiểu các dịch vụ Google để chạy gas/Code.gs trong Node.
const fs = require('fs'); const vm = require('vm'); const crypto = require('crypto');

function giaLapO(x) {
  // Sheets: "'abc" lưu thành chữ "abc"; chữ trông như số thì thành số; chữ "TRUE"/"FALSE" giữ nguyên.
  if (typeof x === 'string' && x.startsWith("'")) return x.slice(1);
  if (typeof x === 'string' && x !== '' && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(x)) return Number(x);
  return x;
}

function taoMoiTruong() {
  const files = {}; const props = {}; const logs = [];
  let idSo = 0;
  const taoFolder = (ten) => {
    const f = { id: 'F' + 'x'.repeat(26) + ++idSo, ten, con: [], files: [],
      getId() { return this.id; },
      getFoldersByName(t) { const ds = this.con.filter((c) => c.ten === t); let i = 0; return { hasNext: () => i < ds.length, next: () => ds[i++] }; },
      createFolder(t) { const c = taoFolder(t); this.con.push(c); return c; },
      createFile(blob) { const id = 'FILE' + 'y'.repeat(26) + ++idSo; this.files.push({ id, ten: blob.ten, bytes: blob.bytes }); return { getId: () => id }; } };
    files[f.id] = f; return f;
  };
  const root = taoFolder('root');
  const taoSheet = (ten) => ({ ten, rows: [],
    getDataRange() { const r = this.rows; return { getValues: () => r.map((x) => [...x]) }; },
    getRange(row, col, nr, nc) { const sh = this; return {
      getValues() { return sh.rows.slice(row - 1, row - 1 + nr).map((r) => { const x = r.slice(col - 1, col - 1 + nc); while (x.length < nc) x.push(''); return x; }); },
      setValues(vals) { vals.forEach((v, i) => { sh.rows[row - 1 + i] = v.map(giaLapO); }); return this; },
      setFontWeight() { return this; } }; },
    appendRow(v) { this.rows.push(v.map(giaLapO)); },
    getLastRow() { return this.rows.length; },
    deleteRow(i) { this.rows.splice(i - 1, 1); },
    getLastColumn() { return this.rows.reduce((m, r) => Math.max(m, r.length), 0); },
    setFrozenRows() {} });
  const sheets = {};
  const ss = { id: 'SS1', getId: () => 'SS1', getUrl: () => 'https://docs/SS1', ds: [taoSheet('Sheet1')],
    getSheetByName(t) { return this.ds.find((s) => s.ten === t) || null; },
    insertSheet(t) { const s = taoSheet(t); this.ds.push(s); return s; },
    getSheets() { return this.ds; }, deleteSheet(s) { this.ds = this.ds.filter((x) => x !== s); } };
  const ctx = {
    console, JSON, Date, Math, String, Number, Object, Array, Set, Map, Error, RegExp,
    Logger: { log: (s) => logs.push(s) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] ?? null, setProperty: (k, v) => { props[k] = v; } }) },
    SpreadsheetApp: { create: () => ss, openById: (id) => (id === 'SS1' ? ss : null) },
    Session: { getEffectiveUser: () => ({ getEmail: () => 'thay@example.com' }) },
    Utilities: { getUuid: () => crypto.randomUUID(), formatDate: (d) => d.toISOString().slice(0, 10),
      base64Decode: (s) => Buffer.from(s, 'base64'), newBlob: (bytes, type, ten) => ({ bytes, type, ten }) },
    DriveApp: { getRootFolder: () => root, getFolderById: (id) => { if (!files[id]) throw new Error('No folder ' + id); return files[id]; } },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (s) => ({ s, setMimeType() { return this; } }) },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(__dirname + '/../gas/Code.gs', 'utf8'), ctx);
  const post = (khoa, action, data) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ khoa, action, data }) } }).s);
  const get = (q) => JSON.parse(ctx.doGet({ parameter: q }).s);
  return { ctx, logs, ss, root, files, taoFolder, post, get };
}
module.exports = { taoMoiTruong };
