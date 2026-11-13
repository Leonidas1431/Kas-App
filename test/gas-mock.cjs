// Giả lập tối thiểu các dịch vụ Google để chạy gas/Code.gs trong Node.
const fs = require('fs'); const vm = require('vm'); const crypto = require('crypto');

function giaLapO(x) {
  // Sheets: "'abc" lưu thành chữ "abc"; chữ trông như số thì thành số; chữ "TRUE"/"FALSE" giữ nguyên.
  if (typeof x === 'string' && x.startsWith("'")) return x.slice(1);
  if (typeof x === 'string' && x !== '' && /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(x)) return Number(x);
  return x;
}

function taoMoiTruong() {
  const files = {}; const props = {}; const logs = []; const goiRa = []; const traLoi = { fn: () => null };
  let idSo = 0;
  const taoFolder = (ten) => {
    const f = { id: 'F' + 'x'.repeat(26) + ++idSo, ten, con: [], files: [],
      getId() { return this.id; },
      getName() { return this.ten; },
      getFiles() { const ds = this.files.map((x) => files[x.id] ? taoFile(x.id) : null).filter(Boolean); let i = 0; return { hasNext: () => i < ds.length, next: () => ds[i++] }; },
      getFolders() { const ds = this.con; let i = 0; return { hasNext: () => i < ds.length, next: () => ds[i++] }; },
      getFoldersByName(t) { const ds = this.con.filter((c) => c.ten === t); let i = 0; return { hasNext: () => i < ds.length, next: () => ds[i++] }; },
      createFolder(t) { const c = taoFolder(t); this.con.push(c); return c; },
      createFile(blob) { const id = 'FILE' + 'y'.repeat(26) + ++idSo; const f = { id, ten: blob.ten, bytes: blob.bytes, mime: blob.type || 'image/jpeg' }; this.files.push(f); files[id] = f; return { getId: () => id }; } };
    files[f.id] = f; return f;
  };
  const taoBlob = (bytes, type, ten) => ({ bytes, type, ten, getBytes() { return this.bytes; }, getContentType() { return this.type || 'image/jpeg'; },
    setName(t) { this.ten = t; return this; }, setContentType(t) { this.type = t; return this; }, getDataAsString() { return Buffer.from(this.bytes).toString('utf8'); } });
  const taoFile = (id) => { const f = files[id];
    return { getId: () => id, getName: () => f.ten, getMimeType: () => f.mime || 'image/jpeg', getLastUpdated: () => new Date('2026-11-01T00:00:00Z'),
      setTrashed() { f.xoa = true; }, getBlob: () => taoBlob(f.bytes, f.mime || 'image/jpeg', f.ten), getThumbnail: () => taoBlob(f.bytes, 'image/jpeg', f.ten) }; };
  const root = taoFolder('root');
  const cache = {};
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
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] ?? null, setProperty: (k, v) => { props[k] = v; }, deleteProperty: (k) => { delete props[k]; } }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache[k] ?? null, put: (k, v) => { cache[k] = v; } }) },
    HtmlService: { createHtmlOutput: (h) => ({ s: JSON.stringify({ html: h }) }) },
    SpreadsheetApp: { create: () => ss, openById: (id) => (id === 'SS1' ? ss : null) },
    Session: { getEffectiveUser: () => ({ getEmail: () => 'thay@example.com' }) },
    Utilities: { getUuid: () => crypto.randomUUID(), formatDate: (d, tz, f) => (f && f.includes('HH') ? d.toISOString().slice(0, 16).replace('T', ' ') : d.toISOString().slice(0, 10)),
      base64Decode: (s) => Buffer.from(s, 'base64'), base64Encode: (b) => Buffer.from(b).toString('base64'), newBlob: taoBlob, sleep: () => {},
      base64EncodeWebSafe: (b) => Buffer.from(b).toString('base64url'), computeDigest: (alg, s) => [...crypto.createHash('sha256').update(s).digest()],
      DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { US_ASCII: 'ascii', UTF_8: 'utf8' } },
    DriveApp: { getRootFolder: () => root, getFolderById: (id) => { if (!files[id]) throw new Error('No folder ' + id); return files[id]; },
      getFileById: (id) => { if (!files[id]) throw new Error('No file ' + id); return taoFile(id); } },
    // Gọi ra ngoài (Claude API, Meta, WordPress): test đặt hàm traLoi(url, opt) → { ma, body }.
    UrlFetchApp: { fetch: (url, opt = {}) => { goiRa.push({ url, opt }); const r = traLoi.fn(url, opt) || { ma: 200, body: {} };
      return { getResponseCode: () => r.ma, getContentText: () => (typeof r.body === 'string' ? r.body : JSON.stringify(r.body)), getBlob: () => taoBlob(Buffer.from(r.bytes || 'anh'), 'application/octet-stream', 'x') }; } },
    ScriptApp: { getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/ABC/exec' }), getOAuthToken: () => 'tok', getProjectTriggers: () => [], deleteTrigger() {}, newTrigger: () => ({ timeBased: () => ({ everyMinutes: () => ({ create() {} }) }) }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (s) => ({ s, setMimeType() { return this; } }) },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(__dirname + '/../gas/Code.gs', 'utf8'), ctx);
  const post = (khoa, action, data) => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify({ khoa, action, data }) } }).s);
  const get = (q) => JSON.parse(ctx.doGet({ parameter: q }).s);
  return { ctx, logs, ss, root, files, taoFolder, post, get, props, goiRa, traLoi, cache };
}
module.exports = { taoMoiTruong };
