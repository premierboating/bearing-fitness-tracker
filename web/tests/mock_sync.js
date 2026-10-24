// Minimal stand-in for Supabase auth + REST, enough to test Bearing's sync: signup, password login, refresh, recover, upsert and select.
// Access tokens expire after TOKEN_SECS so the refresh path gets exercised.
const http = require('http');
const TOKEN_SECS = +(process.env.TOKEN_SECS || 2);
const users = {}, sessions = {}, refreshes = {}, rows = {}; let seq = 0;
const uuid = () => 'u' + (++seq) + '-' + Math.random().toString(36).slice(2, 10);
const session = u => { const access = 'a' + Math.random().toString(36).slice(2), refresh = 'r' + Math.random().toString(36).slice(2); sessions[access] = {uid: u.id, exp: Date.now() + TOKEN_SECS * 1000}; refreshes[refresh] = u.id; return {access_token: access, refresh_token: refresh, expires_in: TOKEN_SECS, token_type: 'bearer', user: {id: u.id, email: u.email}}; };
const log = [];
http.createServer((req, res) => {
  const cors = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS'};
  if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
  let body = ''; req.on('data', c => body += c); req.on('end', () => {
    const url = new URL(req.url, 'http://x'), send = (code, obj) => { res.writeHead(code, Object.assign({'Content-Type': 'application/json'}, cors)); res.end(obj === undefined ? '' : JSON.stringify(obj)); };
    let j = {}; try { j = body ? JSON.parse(body) : {}; } catch (e) {}
    log.push(req.method + ' ' + url.pathname + url.search);
    if (req.headers.apikey !== 'test-anon-key') return send(401, {message: 'No API key'});
    const bearer = (req.headers.authorization || '').replace('Bearer ', ''), sess = sessions[bearer];
    const authed = sess && sess.exp > Date.now() ? sess.uid : null;
    if (url.pathname === '/auth/v1/signup') { if (!j.email || !j.password) return send(400, {msg: 'missing'}); if (Object.values(users).some(u => u.email === j.email)) return send(422, {msg: 'User already registered'}); const u = {id: uuid(), email: j.email, pw: j.password}; users[u.id] = u; return send(200, session(u)); }
    if (url.pathname === '/auth/v1/token') {
      if (url.searchParams.get('grant_type') === 'password') { const u = Object.values(users).find(x => x.email === j.email && x.pw === j.password); if (!u) return send(400, {error_description: 'Invalid login credentials'}); return send(200, session(u)); }
      if (url.searchParams.get('grant_type') === 'refresh_token') { const uid = refreshes[j.refresh_token]; if (!uid) return send(400, {error_description: 'Invalid Refresh Token'}); delete refreshes[j.refresh_token]; return send(200, session(users[uid])); }
      return send(400, {error: 'bad grant'});
    }
    if (url.pathname === '/auth/v1/recover') return send(200, {});
    if (url.pathname === '/auth/v1/logout') return send(204);
    if (url.pathname === '/auth/v1/user') { if (!authed) return send(401, {msg: 'expired'}); if (req.method === 'PUT') { users[authed].pw = j.password; return send(200, {id: authed}); } return send(200, {id: authed, email: users[authed].email}); }
    if (url.pathname === '/rest/v1/bearing_state') {
      if (!authed) return send(401, {message: 'JWT expired'});
      if (req.method === 'GET') { const f = url.searchParams.get('user_id') || ''; const uid = f.replace('eq.', ''); if (uid !== authed) return send(200, []); const r = rows[uid]; return send(200, r ? [{doc: r.doc, rev: r.rev}] : []); }
      if (req.method === 'POST') { const arr = Array.isArray(j) ? j : [j]; for (const r of arr) { if (r.user_id !== authed) return send(403, {message: 'row violates row-level security'}); rows[authed] = {doc: r.doc, rev: r.rev, updated_at: r.updated_at}; } return send(201); }
    }
    if (url.pathname === '/rest/v1/rpc/delete_user') { if (!authed) return send(401, {message: 'JWT expired'}); delete rows[authed]; delete users[authed]; return send(204); }
    if (url.pathname === '/__state') return send(200, {users: Object.values(users).map(u => u.email), rows: Object.keys(rows).map(k => ({uid: k, rev: rows[k].rev, workouts: (rows[k].doc.workouts || []).length, routines: (rows[k].doc.routines || []).length, deleted: rows[k].doc.deleted})), log: log.slice(-12)});
    send(404, {message: 'not found ' + url.pathname});
  });
}).listen(8787, () => console.log('mock account service on 8787'));
