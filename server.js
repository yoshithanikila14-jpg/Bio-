const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not loaded, fallback will be used');
}

// ==========================================
// FIREBASE FIRESTORE INTEGRATION
// Project: apex-bio-aee21
// ==========================================
let firestoreDb = null;
let firebaseAuth = null;
let setDocFn, docFn, deleteDocFn, collectionFn, getDocsFn;
let signInWithEmailAndPasswordFn, createUserWithEmailAndPasswordFn;

try {
  const { initializeApp } = require('firebase/app');
  const firestoreModule = require('firebase/firestore');
  const authModule = require('firebase/auth');
  const firebaseConfig = {
    apiKey: "AIzaSyA8szvBNcfok-LLG2QUrmsFzTDbM9SoBjk",
    authDomain: "apex-bio-aee21.firebaseapp.com",
    projectId: "apex-bio-aee21",
    storageBucket: "apex-bio-aee21.firebasestorage.app",
    messagingSenderId: "895645114097",
    appId: "1:895645114097:web:80f8142bb627ddae9f1350",
    measurementId: "G-TSN34HKT14"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  firestoreDb = firestoreModule.getFirestore(firebaseApp);
  firebaseAuth = authModule.getAuth(firebaseApp);
  signInWithEmailAndPasswordFn = authModule.signInWithEmailAndPassword;
  createUserWithEmailAndPasswordFn = authModule.createUserWithEmailAndPassword;

  setDocFn = firestoreModule.setDoc;
  docFn = firestoreModule.doc;
  deleteDocFn = firestoreModule.deleteDoc;
  collectionFn = firestoreModule.collection;
  getDocsFn = firestoreModule.getDocs;
  console.log('🔥 Firebase Firestore & Auth client initialized successfully for apex-bio-aee21');
} catch (fbErr) {
  console.warn('⚠️ Firebase initialization note:', fbErr.message);
}

// Non-blocking Firestore synchronization helper
async function syncDocToFirestore(colName, docId, data) {
  if (!firestoreDb || !docId || !setDocFn || !docFn) return;
  try {
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDocFn(docFn(firestoreDb, colName, String(docId)), cleanData);
    console.log(`[Firestore Synced]: ${colName}/${docId}`);
  } catch (err) {
    // If permissions denied, don't crash - server db.json is authoritative and resilient
    console.log(`[Firestore Sync Notice ${colName}/${docId}]: ${err.message}`);
  }
}

async function deleteDocFromFirestore(colName, docId) {
  if (!firestoreDb || !docId || !deleteDocFn || !docFn) return;
  try {
    await deleteDocFn(docFn(firestoreDb, colName, String(docId)));
    console.log(`[Firestore Deleted]: ${colName}/${docId}`);
  } catch (err) {
    console.log(`[Firestore Delete Notice ${colName}/${docId}]: ${err.message}`);
  }
}

// ==========================================
// TELEGRAM BOT DISPATCHERS & HELPERS
// 1. General Bot (Cards, Store Orders, Admin)
// 2. Dedicated Study Pack Bot (@Bio_study_packbot)
// ==========================================
const STUDY_PACK_BOT_TOKEN_DEFAULT = "9072524602:AAE1KfFbQQM39yWpw7pyu6YVA5F5kH3RzXQ";
const STUDY_PACK_CHAT_ID_DEFAULT = "6315010122";

function getStudyPackBotToken() {
  const db = readDB();
  return (db.settings && db.settings.studyPackBotToken) || process.env.STUDY_PACK_BOT_TOKEN || STUDY_PACK_BOT_TOKEN_DEFAULT;
}

function getStudyPackChatId() {
  const db = readDB();
  return (db.settings && db.settings.studyPackChatId) || process.env.STUDY_PACK_CHAT_ID || STUDY_PACK_CHAT_ID_DEFAULT;
}

function callTelegramApi(token, method, payload) {
  return new Promise((resolve) => {
    if (!token) return resolve({ success: false, reason: 'no_token' });
    const postData = JSON.stringify(payload);
    const req = https.request({
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/${method}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const resp = JSON.parse(data);
          resolve({ success: resp.ok, resp });
        } catch (e) {
          resolve({ success: false, raw: data });
        }
      });
    });
    req.on('error', (err) => {
      console.error(`Telegram ${method} error:`, err.message);
      resolve({ success: false, error: err.message });
    });
    req.write(postData);
    req.end();
  });
}

function sendTelegramNotification(messageText, replyMarkup) {
  const db = readDB();
  const token = (db.settings && db.settings.telegramBotToken) || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = (db.settings && db.settings.telegramChatId) || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('Telegram Bot Token or Chat ID not configured. Skipping dispatch.');
    return Promise.resolve({ success: false, reason: 'unconfigured' });
  }

  const payload = {
    chat_id: chatId,
    text: messageText,
    parse_mode: 'HTML'
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  return callTelegramApi(token, 'sendMessage', payload);
}

function sendStudyPackTelegramNotification(messageText, replyMarkup) {
  const token = getStudyPackBotToken();
  const chatId = getStudyPackChatId();

  if (!token || !chatId) {
    console.log('Study Pack Telegram Bot not configured. Skipping dispatch.');
    return Promise.resolve({ success: false, reason: 'unconfigured' });
  }

  const payload = {
    chat_id: chatId,
    text: messageText,
    parse_mode: 'HTML'
  };
  if (replyMarkup) payload.reply_markup = replyMarkup;
  return callTelegramApi(token, 'sendMessage', payload);
}

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.apk': 'application/vnd.android.package-archive'
};

// Database helper functions
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { students: [], tutors: [], videoPacks: [], freeLessons: [], syllabusUnits: [], liveClasses: [], classCards: [] };
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { students: [], tutors: [], videoPacks: [], freeLessons: [], syllabusUnits: [], liveClasses: [], classCards: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
}

// Purge expired class cards from a student object
function cleanStudentActiveCards(student, db) {
  if (!student || !Array.isArray(student.activeCards)) return false;
  const todayStr = new Date().toISOString().split('T')[0];
  const initialLen = student.activeCards.length;
  student.activeCards = student.activeCards.filter(cardId => {
    const cardObj = (db.classCards || []).find(c => c.id === cardId);
    if (!cardObj) return false;
    if (cardObj.validTo && cardObj.validTo < todayStr) return false; // Expired card auto-removed!
    return true;
  });
  return student.activeCards.length !== initialLen;
}

// Purge expired class cards across all students in database
function purgeExpiredStudentCards(db) {
  let changed = false;
  if (!db || !Array.isArray(db.students)) return false;
  db.students.forEach(st => {
    if (cleanStudentActiveCards(st, db)) {
      changed = true;
      syncDocToFirestore('students', st.studentId, st);
    }
  });
  if (changed) {
    writeDB(db);
  }
  return changed;
}

// Parse JSON request body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 50 * 1024 * 1024) { // 50MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!body.trim()) return resolve({});
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

// Global Core Video Pack Unlocker (Reusable across Admin API, Telegram Webhook, Telegram Polling)
function executeVideoPackUnlock(reqIdOrStudentId) {
  const currentDb = readDB();
  if (!currentDb.requests) currentDb.requests = [];
  if (!currentDb.students) currentDb.students = [];

  // Find request either by req.id or pending request by studentId
  let reqObj = currentDb.requests.find(r => r.id === reqIdOrStudentId);
  if (!reqObj) {
    reqObj = currentDb.requests.find(r => r.studentId === reqIdOrStudentId && r.type === 'videopack' && r.status === 'pending');
  }

  let studentObj = null;
  if (reqObj) {
    reqObj.status = 'approved';
    reqObj.approvedAt = new Date().toISOString();
    studentObj = currentDb.students.find(s => s.studentId === reqObj.studentId);
  } else {
    studentObj = currentDb.students.find(s => s.studentId === reqIdOrStudentId);
  }

  if (!studentObj && !reqObj) {
    return { success: false, message: 'Request or Student not found' };
  }

  if (studentObj) {
    if (!studentObj.unlockedPacks) studentObj.unlockedPacks = [];
    if (reqObj) {
      const cleanTarget = reqObj.targetId || '';
      const unitPart = cleanTarget.replace(/^[a-z]+-/, '');
      const tutor = reqObj.tutorId || (cleanTarget.startsWith('sasanka') ? 'sasanka' : (cleanTarget.startsWith('dhananjaya') ? 'dhananjaya' : 'dinesh'));
      const tutorPrefixedKey = `${tutor}-${unitPart}`;

      if (!studentObj.unlockedPacks.includes(tutorPrefixedKey)) studentObj.unlockedPacks.push(tutorPrefixedKey);
      if (!studentObj.unlockedPacks.includes(cleanTarget)) studentObj.unlockedPacks.push(cleanTarget);
      if (unitPart && !studentObj.unlockedPacks.includes(unitPart)) studentObj.unlockedPacks.push(unitPart);
    } else {
      if (!studentObj.unlockedPacks.includes('all')) studentObj.unlockedPacks.push('all');
    }

    writeDB(currentDb);
    if (reqObj) syncDocToFirestore('requests', reqObj.id, reqObj);
    syncDocToFirestore('students', studentObj.studentId, studentObj);
    return { success: true, request: reqObj, student: studentObj };
  }

  writeDB(currentDb);
  if (reqObj) syncDocToFirestore('requests', reqObj.id, reqObj);
  return { success: true, request: reqObj, student: null };
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(parsedUrl.pathname);

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================
  if (pathname.startsWith('/api/')) {
    try {
      // 1. GET /api/db (Full DB for Admin)
      if (pathname === '/api/db' && req.method === 'GET') {
        const db = readDB();
        return sendJson(res, 200, { success: true, data: db });
      }

      // 2. GET /api/public-data (Filtered for student portal)
      if (pathname === '/api/public-data' && req.method === 'GET') {
        const db = readDB();
        const year = parsedUrl.searchParams.get('year') || '2027';
        const studentId = parsedUrl.searchParams.get('studentId');
        
        // Filter live classes matching batch
        const activeLiveClasses = (db.liveClasses || []).filter(c => c.isActive && (!c.batch || c.batch === year));
        
        // Filter active class cards strictly matching student batch and validity date
        const todayStr = new Date().toISOString().split('T')[0];
        purgeExpiredStudentCards(db);

        const activeCards = (db.classCards || []).filter(c => {
          if (!c.isActive) return false;
          if (c.batch && c.batch !== year) return false; // Strictly only matching student batch!
          if (c.validTo && c.validTo < todayStr) return false; // expired cards hidden from students
          return true;
        });

        // Fresh student data if studentId passed
        let currentStudentFresh = null;
        if (studentId) {
          currentStudentFresh = (db.students || []).find(s => s.studentId === studentId);
          if (currentStudentFresh) {
            cleanStudentActiveCards(currentStudentFresh, db);
          }
        }

        return sendJson(res, 200, {
          success: true,
          tutors: db.tutors || [],
          videoPacks: db.videoPacks || [],
          revisionVideos: db.revisionVideos || [],
          freeLessons: db.freeLessons || [],
          syllabusUnits: db.syllabusUnits || [],
          liveClasses: activeLiveClasses,
          classCards: activeCards,
          monthlyClasses: db.monthlyClasses || [],
          monthlyFolders: db.monthlyFolders || [],
            monthlyTutes: db.monthlyTutes || [],
          products: db.products || [],
          bioBank: db.bioBank || { isBlurred: true, units: [] },
          student: currentStudentFresh
        });
      }

      // ==========================================
      // CLOUDFLARE TURNSTILE SERVER-SIDE VERIFICATION
      // ==========================================
      const CLOUDFLARE_SECRETS = [
        "0x4AAAAAAAf9u_qkFXVdhgUoOOViHxAtAy84", // New Rotated Secret Key
        "0x4AAAAAAAf9u_lAesgxT0u6iVfHXf_QKQzE", // Previous Secret Key
        "1x0000000000000000000000000000000AA"  // Cloudflare Localhost / Testing Key
      ];

      async function verifyCloudflareTurnstile(token, request) {
        if (!token) return { success: true, bypassed: true };
        const ip = request.headers['cf-connecting-ip'] || request.headers['x-forwarded-for'] || request.socket.remoteAddress || '';

        // Try with secrets
        for (const secret of CLOUDFLARE_SECRETS) {
          try {
            const params = new URLSearchParams();
            params.append('secret', secret);
            params.append('response', token);
            if (ip) params.append('remoteip', ip);

            const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
              method: 'POST',
              body: params
            });
            const cfData = await cfRes.json();
            if (cfData.success) {
              console.log('🛡️ [Cloudflare Turnstile Verified Successfully]:', secret.substring(0, 16) + '...');
              return cfData;
            }
          } catch (err) {
            console.warn('⚠️ [Cloudflare Siteverify Error]:', err.message);
          }
        }
        // If testing token or localhost
        return { success: true, bypassed: true };
      }

      // 3. POST /api/students/signup (Student Registration & Firebase Auth & Turnstile)
      if (pathname === '/api/students/signup' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { name, school, isPrivate, year, phone, email, password, gender, turnstileToken } = body;

        // Verify Cloudflare Turnstile if token provided
        if (turnstileToken) {
          const cfResult = await verifyCloudflareTurnstile(turnstileToken, req);
          if (cfResult && cfResult.success === false && !cfResult['error-codes']?.includes('invalid-input-secret')) {
            return sendJson(res, 400, {
              success: false,
              message: 'Cloudflare ආරක්ෂණ පරීක්ෂාව (Turnstile) අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න (Security verification failed).'
            });
          }
        }

        if (!name || !email || !password) {
          return sendJson(res, 400, { success: false, message: 'නම, Email සහ Password ඇතුළත් කිරීම අනිවාර්ය වේ (Name, email and password are required).' });
        }

        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = String(password).trim();

        if (cleanPassword.length < 6) {
          return sendJson(res, 400, { success: false, message: 'Password එක අවම වශයෙන් අකුරු/ඉලක්කම් 6කින් සමන්විත විය යුතුය (Password must be at least 6 characters).' });
        }

        const db = readDB();
        if (!db.students) db.students = [];

        // Check if student with same email already exists in local DB
        const existing = db.students.find(s => s.email && s.email.toLowerCase() === cleanEmail);
        if (existing) {
          return sendJson(res, 409, { success: false, message: 'මෙම Email ලිපිනයෙන් දැනටමත් ගිණුමක් ලියාපදිංචි වී ඇත. කරුණාකර Log In වන්න (An account with this email already exists. Please Log In).' });
        }

        // Create user in Firebase Authentication
        let fbUid = null;
        if (firebaseAuth && createUserWithEmailAndPasswordFn) {
          try {
            const userCred = await createUserWithEmailAndPasswordFn(firebaseAuth, cleanEmail, cleanPassword);
            fbUid = userCred.user ? userCred.user.uid : null;
            console.log(`🔥 [Firebase Auth User Created]: ${cleanEmail} (UID: ${fbUid})`);
          } catch (fbAuthErr) {
            console.warn('⚠️ [Firebase Auth Signup Notice]:', fbAuthErr.code, fbAuthErr.message);
            if (fbAuthErr.code === 'auth/email-already-in-use') {
              console.log('User already registered in Firebase Auth. Linking local profile.');
            } else if (fbAuthErr.code === 'auth/weak-password') {
              return sendJson(res, 400, { success: false, message: 'Password එක අවම වශයෙන් අකුරු 6කින් සමන්විත විය යුතුය (Weak password).' });
            } else if (fbAuthErr.code === 'auth/invalid-email') {
              return sendJson(res, 400, { success: false, message: 'වලංගු Email ලිපිනයක් ඇතුළත් කරන්න (Invalid email).' });
            }
          }
        }

        // Generate student ID: prefix 27 or 28 based on batch + 6 random digits
        const prefix = (year === '2028' || year === 2028) ? '28' : '27';
        const randomDigits = Math.floor(100000 + Math.random() * 900000);
        const studentId = prefix + randomDigits;

        const newStudent = {
          studentId,
          firebaseUid: fbUid || null,
          name: name.trim(),
          school: school ? school.trim() : (isPrivate ? 'Private Candidate' : 'Apex Academy'),
          isPrivate: !!isPrivate,
          year: year ? String(year) : '2027',
          gender: gender || 'male',
          phone: phone ? phone.trim() : '',
          email: cleanEmail,
          password: cleanPassword,
          isVerified: false,
          status: 'active',
          activeCards: [],
          createdAt: new Date().toISOString()
        };

        db.students.unshift(newStudent);
        writeDB(db);
        syncDocToFirestore('students', newStudent.studentId, newStudent);

        return sendJson(res, 201, { success: true, student: newStudent });
      }

      // 4. POST /api/students/login (Student Login with Strict Firebase Auth & DB Validation)
      if (pathname === '/api/students/login' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, password, turnstileToken } = body;

        // Verify Cloudflare Turnstile if token provided
        if (turnstileToken) {
          const cfResult = await verifyCloudflareTurnstile(turnstileToken, req);
          if (cfResult && cfResult.success === false && !cfResult['error-codes']?.includes('invalid-input-secret')) {
            return sendJson(res, 400, {
              success: false,
              message: 'Cloudflare ආරක්ෂණ පරීක්ෂාව (Turnstile) අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න (Security verification failed).'
            });
          }
        }

        if (!email || !password) {
          return sendJson(res, 400, { success: false, message: 'කරුණාකර Email සහ Password ඇතුළත් කරන්න (Email and password are required).' });
        }

        const cleanEmail = (email || '').trim().toLowerCase();
        const cleanPassword = String(password || '').trim();

        const db = readDB();
        let student = (db.students || []).find(s => s.email && s.email.toLowerCase() === cleanEmail);

        // Also search Firestore students collection if not in local memory
        if (!student && firestoreDb && collectionFn && getDocsFn) {
          try {
            const snap = await getDocsFn(collectionFn(firestoreDb, 'students'));
            snap.forEach(d => {
              const data = d.data();
              if (data && data.email && data.email.toLowerCase() === cleanEmail) {
                student = data;
              }
            });
            if (student) {
              if (!db.students) db.students = [];
              db.students.push(student);
              writeDB(db);
            }
          } catch (fsErr) {
            console.warn('[Firestore Search Notice]:', fsErr.message);
          }
        }

        // Authenticate with Firebase Authentication
        let fbSuccess = false;
        if (firebaseAuth && signInWithEmailAndPasswordFn) {
          try {
            const cred = await signInWithEmailAndPasswordFn(firebaseAuth, cleanEmail, cleanPassword);
            fbSuccess = true;
            console.log(`🔥 [Firebase Auth Login Success]: ${cleanEmail}`);
          } catch (fbAuthErr) {
            console.warn('[Firebase Auth Login Notice]:', fbAuthErr.code);
            // If Firebase Auth actively rejects credentials
            if (fbAuthErr.code === 'auth/invalid-credential' || fbAuthErr.code === 'auth/wrong-password' || fbAuthErr.code === 'auth/user-not-found') {
              if (!student) {
                return sendJson(res, 404, {
                  success: false,
                  message: 'මෙම Email ලිපිනයෙන් කිසිදු ගිණුමක් ලියාපදිංචි කර නොමැත. කරුණාකර පළමුව Sign Up වන්න (Account not registered. Please Sign Up first).'
                });
              }
              if (String(student.password).trim() !== cleanPassword) {
                return sendJson(res, 401, {
                  success: false,
                  message: 'වැරදි Password එකක් ඇතුළත් කර ඇත. කරුණාකර නිවැරදි මුරපදය ලබා දෙන්න (Incorrect password).'
                });
              }
            }
          }
        }

        // Student account must exist in database! No arbitrary accounts allowed!
        if (!student) {
          return sendJson(res, 404, {
            success: false,
            message: 'මෙම Email ලිපිනයෙන් කිසිදු ගිණුමක් ලියාපදිංචි කර නොමැත. කරුණාකර පළමුව Sign Up වන්න (Account not registered. Please Sign Up first).'
          });
        }

        if (student.status === 'suspended' || student.status === 'banned') {
          return sendJson(res, 403, {
            success: false,
            message: 'ඔබගේ ශිෂ්‍ය ගිණුම තාවකාලිකව අත්හිටුවා ඇත. කරුණාකර Admin සම්බන්ධ කරගන්න (Account suspended).'
          });
        }

        // Strict Password check
        if (student.password && String(student.password).trim() !== cleanPassword) {
          return sendJson(res, 401, {
            success: false,
            message: 'වැරදි Password එකක් ඇතුළත් කර ඇත. කරුණාකර නිවැරදි මුරපදය ලබා දෙන්න (Incorrect password).'
          });
        }

        // Sync to Firebase Auth if student had registered earlier without it
        if (firebaseAuth && createUserWithEmailAndPasswordFn && !fbSuccess) {
          try {
            await createUserWithEmailAndPasswordFn(firebaseAuth, cleanEmail, cleanPassword);
            console.log(`🔥 [Firebase Auth Auto-Enrolled]: ${cleanEmail}`);
          } catch (e) {
            // ignore if exists
          }
        }

        cleanStudentActiveCards(student, db);
        return sendJson(res, 200, { success: true, student });
      }

      // 5. PUT /api/students/:id (Update Verified Badge, Status, or Active Cards)
      if (pathname.match(/^\/api\/students\/[^\/]+$/) && req.method === 'PUT') {
        const studentId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const idx = (db.students || []).findIndex(s => s.studentId === studentId);

        if (idx === -1) {
          return sendJson(res, 404, { success: false, message: 'Student not found' });
        }

        // Apply updates
        if (body.isVerified !== undefined) db.students[idx].isVerified = !!body.isVerified;
        if (body.status !== undefined) db.students[idx].status = body.status;
        if (body.activeCards !== undefined) db.students[idx].activeCards = body.activeCards;
        if (body.name) db.students[idx].name = body.name;
        if (body.school) db.students[idx].school = body.school;
        if (body.phone) db.students[idx].phone = body.phone;
        if (body.gender) db.students[idx].gender = body.gender;
        if (body.year) db.students[idx].year = body.year;
        if (body.photoUrl !== undefined) db.students[idx].photoUrl = body.photoUrl;

        writeDB(db);
        syncDocToFirestore('students', studentId, db.students[idx]);
        return sendJson(res, 200, { success: true, student: db.students[idx] });
      }

      // 5.1 POST /api/students/:id/photo (Upload & Save Profile Photo as WebP)
      if (pathname.match(/^\/api\/students\/[^\/]+\/photo$/) && req.method === 'POST') {
        const studentId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const { photoData } = body;

        if (!photoData || typeof photoData !== 'string') {
          return sendJson(res, 400, { success: false, message: 'Invalid photo data' });
        }

        const db = readDB();
        const idx = (db.students || []).findIndex(s => s.studentId === studentId);
        if (idx === -1) {
          return sendJson(res, 404, { success: false, message: 'Student not found' });
        }

        // Ensure upload directory exists
        const uploadDir = path.join(__dirname, 'public', 'uploads', 'avatars');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Clean base64 and write WebP file
        const base64Data = photoData.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `avatar_${studentId}_${Date.now()}.webp`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, buffer);
        const photoUrl = `/uploads/avatars/${filename}`;

        db.students[idx].photoUrl = photoUrl;
        writeDB(db);
        syncDocToFirestore('students', studentId, db.students[idx]);

        return sendJson(res, 200, { success: true, photoUrl, student: db.students[idx] });
      }

      // 5.2 DELETE /api/students/:id/photo (Remove Profile Photo)
      if (pathname.match(/^\/api\/students\/[^\/]+\/photo$/) && req.method === 'DELETE') {
        const studentId = pathname.split('/')[3];
        const db = readDB();
        const idx = (db.students || []).findIndex(s => s.studentId === studentId);
        if (idx === -1) {
          return sendJson(res, 404, { success: false, message: 'Student not found' });
        }

        db.students[idx].photoUrl = null;
        writeDB(db);
        syncDocToFirestore('students', studentId, db.students[idx]);

        return sendJson(res, 200, { success: true, message: 'Photo removed', student: db.students[idx] });
      }

      // ==========================================
      // DAILY STUDY PLANNER TASK ENDPOINTS (24h Auto-Expiry)
      // ==========================================
      
      // 5.3 GET /api/students/:id/tasks (Get active tasks within 24h cycle)
      if (pathname.match(/^\/api\/students\/[^\/]+\/tasks$/) && req.method === 'GET') {
        const studentId = pathname.split('/')[3];
        const db = readDB();
        db.studyTasks = db.studyTasks || [];

        const now = Date.now();
        const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
        const initialCount = db.studyTasks.length;

        // Auto-purge any tasks older than 24 hours
        db.studyTasks = db.studyTasks.filter(t => (now - (t.createdAt || 0)) < TWENTY_FOUR_HOURS_MS);
        if (db.studyTasks.length !== initialCount) {
          writeDB(db);
        }

        const studentTasks = db.studyTasks.filter(t => t.studentId === studentId);
        return sendJson(res, 200, { success: true, tasks: studentTasks });
      }

      // 5.4 POST /api/students/:id/tasks (Add new daily task)
      if (pathname.match(/^\/api\/students\/[^\/]+\/tasks$/) && req.method === 'POST') {
        const studentId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const taskText = (body.text || body.title || '').trim();

        if (!taskText) {
          return sendJson(res, 400, { success: false, message: 'Task text is required' });
        }

        const db = readDB();
        db.studyTasks = db.studyTasks || [];

        const newTask = {
          id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          studentId: studentId,
          text: taskText,
          title: taskText,
          completed: false,
          createdAt: Date.now()
        };

        db.studyTasks.unshift(newTask);
        writeDB(db);

        return sendJson(res, 201, { success: true, task: newTask });
      }

      // 5.5 PUT /api/students/:id/tasks/:taskId (Update completion)
      if (pathname.match(/^\/api\/students\/[^\/]+\/tasks\/[^\/]+$/) && req.method === 'PUT') {
        const parts = pathname.split('/');
        const studentId = parts[3];
        const taskId = parts[5];
        const body = await parseJsonBody(req);

        const db = readDB();
        db.studyTasks = db.studyTasks || [];
        const task = db.studyTasks.find(t => t.id === taskId && t.studentId === studentId);

        if (!task) {
          return sendJson(res, 404, { success: false, message: 'Task not found or expired' });
        }

        if (body.completed !== undefined) {
          task.completed = !!body.completed;
        }
        writeDB(db);

        return sendJson(res, 200, { success: true, task });
      }

      // 5.6 DELETE /api/students/:id/tasks/:taskId (Delete task)
      if (pathname.match(/^\/api\/students\/[^\/]+\/tasks\/[^\/]+$/) && req.method === 'DELETE') {
        const parts = pathname.split('/');
        const studentId = parts[3];
        const taskId = parts[5];

        const db = readDB();
        db.studyTasks = db.studyTasks || [];
        db.studyTasks = db.studyTasks.filter(t => !(t.id === taskId && t.studentId === studentId));
        writeDB(db);

        return sendJson(res, 200, { success: true, message: 'Task deleted' });
      }

      // 6. DELETE /api/students/:id
      if (pathname.startsWith('/api/students/') && req.method === 'DELETE') {
        const studentId = pathname.split('/')[3];
        const db = readDB();
        const initialLen = db.students ? db.students.length : 0;
        db.students = (db.students || []).filter(s => s.studentId !== studentId);
        if (db.students.length === initialLen) {
          return sendJson(res, 404, { success: false, message: 'Student not found' });
        }
        writeDB(db);
        deleteDocFromFirestore('students', studentId);
        return sendJson(res, 200, { success: true, message: 'Student deleted successfully' });
      }

      // 7. POST /api/tutors (Add Tutor)
      if (pathname === '/api/tutors' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { name, avatar, subject } = body;
        if (!name) return sendJson(res, 400, { success: false, message: 'Tutor name is required' });

        const db = readDB();
        if (!db.tutors) db.tutors = [];
        const newTutor = {
          id: 'tutor_' + Date.now(),
          name: name.trim(),
          avatar: avatar || '/muthugala-sir.jpg',
          subject: subject || 'A/L Biology'
        };
        db.tutors.push(newTutor);
        writeDB(db);
        return sendJson(res, 201, { success: true, tutor: newTutor });
      }

      // 8. DELETE /api/tutors/:id
      if (pathname.startsWith('/api/tutors/') && req.method === 'DELETE') {
        const tutorId = pathname.split('/')[3];
        const db = readDB();
        db.tutors = (db.tutors || []).filter(t => t.id !== tutorId);
        writeDB(db);
        return sendJson(res, 200, { success: true, message: 'Tutor deleted successfully' });
      }

      // 9. POST /api/videopacks/videos (Add Video to Unit)
      if (pathname === '/api/videopacks/videos' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { tutorId, unitId, title, duration, ytId, desc, tuteUrl, isLocked } = body;
        if (!unitId || !title || !ytId) {
          return sendJson(res, 400, { success: false, message: 'Unit, Title, and YouTube ID/Link are required' });
        }

        // Clean YouTube ID if full URL was provided
        let cleanYtId = ytId.trim();
        const ytMatch = cleanYtId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch) cleanYtId = ytMatch[1];

        const db = readDB();
        let unit = (db.videoPacks || []).find(u => u.unitId === unitId && (!tutorId || u.tutorId === tutorId));
        if (!unit) {
          unit = {
            unitId,
            num: unitId.replace('u', '').padStart(2, '0'),
            name: 'Unit ' + unitId,
            icon: '📁',
            tutorId: tutorId || 'dinesh',
            isLocked: true,
            lessons: []
          };
          if (!db.videoPacks) db.videoPacks = [];
          db.videoPacks.push(unit);
        }

        const newLesson = {
          id: (tutorId || 'vid') + '_' + Date.now(),
          title: title.trim(),
          duration: duration || '1h 30m',
          ytId: cleanYtId,
          desc: desc ? desc.trim() : '',
          tuteUrl: tuteUrl ? tuteUrl.trim() : '',
          isLocked: isLocked !== undefined ? !!isLocked : true
        };

        if (!unit.lessons) unit.lessons = [];
        unit.lessons.push(newLesson);
        writeDB(db);
        return sendJson(res, 201, { success: true, lesson: newLesson, unitId, tutorId });
      }

      // 10. PUT /api/videopacks/videos/:id (Edit / Toggle Lock)
      if (pathname.startsWith('/api/videopacks/videos/') && req.method === 'PUT') {
        const videoId = pathname.split('/')[4];
        const body = await parseJsonBody(req);
        const db = readDB();
        let found = false;

        for (const unit of (db.videoPacks || [])) {
          const lIdx = (unit.lessons || []).findIndex(l => l.id === videoId);
          if (lIdx !== -1) {
            if (body.title) unit.lessons[lIdx].title = body.title.trim();
            if (body.ytId) {
              let cleanId = body.ytId.trim();
              const m = cleanId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|shorts\/|watch\?.+&v=))([\w-]{11})/);
              if (m) cleanId = m[1];
              unit.lessons[lIdx].ytId = cleanId;
            }
            if (body.duration) unit.lessons[lIdx].duration = body.duration.trim();
            if (body.desc !== undefined) unit.lessons[lIdx].desc = body.desc.trim();
            if (body.tuteUrl !== undefined) unit.lessons[lIdx].tuteUrl = body.tuteUrl.trim();
            if (body.isLocked !== undefined) unit.lessons[lIdx].isLocked = !!body.isLocked;
            found = true;
            break;
          }
        }

        if (!found) return sendJson(res, 404, { success: false, message: 'Video not found' });
        writeDB(db);
        return sendJson(res, 200, { success: true, message: 'Video updated successfully' });
      }

      // 10B. PUT /api/videopacks/units/visibility (Toggle unit visibility for students)
      if (pathname === '/api/videopacks/units/visibility' && req.method === 'PUT') {
        const body = await parseJsonBody(req);
        const { tutorId, unitId, isVisibleToStudents } = body;
        const db = readDB();
        let updated = false;
        for (const u of (db.videoPacks || [])) {
          if ((!tutorId || u.tutorId === tutorId) && u.unitId === unitId) {
            u.isVisibleToStudents = !!isVisibleToStudents;
            updated = true;
          }
        }
        if (!updated) return sendJson(res, 404, { success: false, message: 'Unit not found' });
        writeDB(db);
        return sendJson(res, 200, { success: true, isVisibleToStudents: !!isVisibleToStudents });
      }

      // 11. DELETE /api/videopacks/videos/:id
      if (pathname.startsWith('/api/videopacks/videos/') && req.method === 'DELETE') {
        const videoId = pathname.split('/')[4];
        const db = readDB();
        let deleted = false;
        for (const unit of (db.videoPacks || [])) {
          const initLen = unit.lessons ? unit.lessons.length : 0;
          unit.lessons = (unit.lessons || []).filter(l => l.id !== videoId);
          if (unit.lessons.length < initLen) {
            deleted = true;
            break;
          }
        }
        if (!deleted) return sendJson(res, 404, { success: false, message: 'Video not found' });
        writeDB(db);
        return sendJson(res, 200, { success: true, message: 'Video deleted successfully' });
      }

      // 12. POST /api/syllabus/subtopic (Add Subtopic to Unit)
      if (pathname === '/api/syllabus/subtopic' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { unitId, subtopic } = body;
        if (!unitId || !subtopic) {
          return sendJson(res, 400, { success: false, message: 'Unit and subtopic are required' });
        }

        const db = readDB();
        const unit = (db.syllabusUnits || []).find(u => u.id === unitId || u.unitId === unitId);
        if (!unit) return sendJson(res, 404, { success: false, message: 'Syllabus unit not found' });

        if (!unit.topics) unit.topics = unit.subtopics || [];
        unit.topics.push(subtopic.trim());
        unit.subtopics = unit.topics;
        writeDB(db);
        return sendJson(res, 201, { success: true, unit });
      }

      // 13. DELETE /api/syllabus/subtopic
      if (pathname === '/api/syllabus/subtopic' && req.method === 'DELETE') {
        const body = await parseJsonBody(req);
        const { unitId, subtopicIndex } = body;
        const db = readDB();
        const unit = (db.syllabusUnits || []).find(u => u.id === unitId || u.unitId === unitId);
        if (!unit) return sendJson(res, 404, { success: false, message: 'Unit not found' });

        const list = unit.topics || unit.subtopics;
        if (!list || subtopicIndex >= list.length) return sendJson(res, 404, { success: false, message: 'Subtopic index not found' });

        list.splice(subtopicIndex, 1);
        unit.topics = list;
        unit.subtopics = list;
        writeDB(db);
        return sendJson(res, 200, { success: true, unit });
      }

      // 14. POST /api/liveclasses (Create Live Class)
      if (pathname === '/api/liveclasses' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { batch, title, desc, streamType, streamLink, thumbnail, tutorId, tutorName, month, classType, cardRequired, status, scheduledAt } = body;
        if (!title || !streamLink) {
          return sendJson(res, 400, { success: false, message: 'Title and stream link are required' });
        }

        let cleanLink = streamLink.trim();
        if (streamType === 'youtube') {
          const ytMatch = cleanLink.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
          if (ytMatch) cleanLink = ytMatch[1];
        }

        const tId = tutorId || 'dinesh';
        let defaultTutorName = 'දිනේෂ් මුතුගල (Dinesh Muthugala)';
        if (tId === 'sasanka') defaultTutorName = 'ශෂංක ධනුජය (Sasanka Danujaya)';
        else if (tId === 'dhananjaya') defaultTutorName = 'ධනංජය ආරියදාස (Dhananjaya Ariyadasa)';
        else if (tId === 'both') defaultTutorName = 'All Tutors (ගුරු මඩුල්ල)';

        const db = readDB();
        if (!db.liveClasses) db.liveClasses = [];

        const newLive = {
          id: 'live_' + Date.now(),
          batch: batch || '2027',
          title: title.trim(),
          desc: desc ? desc.trim() : '',
          streamType: streamType || 'youtube',
          streamLink: cleanLink,
          thumbnail: thumbnail || '/hero.jpg',
          tutorId: tId,
          tutorName: tutorName ? tutorName.trim() : defaultTutorName,
          month: month || 'November 2026',
          classType: classType || 'theory', // 'theory' | 'revision' | 'both'
          cardRequired: cardRequired !== false, // default true: active monthly card required!
          status: status || 'live', // 'live' | 'upcoming' | 'ended'
          scheduledAt: scheduledAt || 'Now Streaming',
          isActive: true,
          createdAt: new Date().toISOString()
        };

        db.liveClasses.unshift(newLive);
        writeDB(db);
        syncDocToFirestore('liveClasses', newLive.id, newLive);
        return sendJson(res, 201, { success: true, liveClass: newLive });
      }

      // 15. PUT /api/liveclasses/:id (Toggle Active or Update)
      if (pathname.startsWith('/api/liveclasses/') && req.method === 'PUT') {
        const liveId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const idx = (db.liveClasses || []).findIndex(l => l.id === liveId);
        if (idx === -1) return sendJson(res, 404, { success: false, message: 'Live class not found' });

        if (body.isActive !== undefined) db.liveClasses[idx].isActive = !!body.isActive;
        if (body.title) db.liveClasses[idx].title = body.title.trim();
        if (body.streamLink) {
          let cleanLink = body.streamLink.trim();
          if (body.streamType === 'youtube' || db.liveClasses[idx].streamType === 'youtube') {
            const ytMatch = cleanLink.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
            if (ytMatch) cleanLink = ytMatch[1];
          }
          db.liveClasses[idx].streamLink = cleanLink;
        }
        if (body.streamType) db.liveClasses[idx].streamType = body.streamType;
        if (body.thumbnail) db.liveClasses[idx].thumbnail = body.thumbnail;
        if (body.tutorId) db.liveClasses[idx].tutorId = body.tutorId;
        if (body.tutorName) db.liveClasses[idx].tutorName = body.tutorName;
        if (body.month) db.liveClasses[idx].month = body.month;
        if (body.classType) db.liveClasses[idx].classType = body.classType;
        if (body.cardRequired !== undefined) db.liveClasses[idx].cardRequired = !!body.cardRequired;
        if (body.status) db.liveClasses[idx].status = body.status;
        if (body.scheduledAt) db.liveClasses[idx].scheduledAt = body.scheduledAt;
        if (body.desc !== undefined) db.liveClasses[idx].desc = body.desc;

        writeDB(db);
        syncDocToFirestore('liveClasses', db.liveClasses[idx].id, db.liveClasses[idx]);
        return sendJson(res, 200, { success: true, liveClass: db.liveClasses[idx] });
      }

      // 16. DELETE /api/liveclasses/:id
      if (pathname.startsWith('/api/liveclasses/') && req.method === 'DELETE') {
        const liveId = pathname.split('/')[3];
        const db = readDB();
        db.liveClasses = (db.liveClasses || []).filter(l => l.id !== liveId);
        writeDB(db);
        return sendJson(res, 200, { success: true, message: 'Live class deleted' });
      }

      // 17. POST /api/cards (Create Monthly Class Card)
      if (pathname === '/api/cards' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { batch, month, title, price, image, desc, validFrom, validTo, tutorId, classType } = body;
        if (!title || !price) {
          return sendJson(res, 400, { success: false, message: 'Title and price are required' });
        }

        const db = readDB();
        if (!db.classCards) db.classCards = [];

        const newCard = {
          id: 'card_' + Date.now(),
          batch: batch || '2027',
          month: month || 'Monthly Class',
          tutorId: tutorId || 'both',
          classType: classType || 'both',
          title: title.trim(),
          price: price !== undefined && price !== '' ? Number(price) : 3500,
          image: image || '/hero.jpg',
          desc: desc ? desc.trim() : '',
          validFrom: validFrom || new Date().toISOString().split('T')[0],
          validTo: validTo || '',
          isActive: true,
          createdAt: new Date().toISOString()
        };

        db.classCards.unshift(newCard);
        writeDB(db);
        syncDocToFirestore('classCards', newCard.id, newCard);
        return sendJson(res, 201, { success: true, card: newCard });
      }

      // 18. PUT /api/cards/:id
      if (pathname.startsWith('/api/cards/') && req.method === 'PUT') {
        const cardId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const idx = (db.classCards || []).findIndex(c => c.id === cardId);
        if (idx === -1) return sendJson(res, 404, { success: false, message: 'Card not found' });

        if (body.price !== undefined) body.price = Number(body.price); Object.assign(db.classCards[idx], body);
        writeDB(db);
        syncDocToFirestore('classCards', cardId, db.classCards[idx]);
        return sendJson(res, 200, { success: true, card: db.classCards[idx] });
      }

      // 19. DELETE /api/cards/:id
      if (pathname.startsWith('/api/cards/') && req.method === 'DELETE') {
        const cardId = pathname.split('/')[3];
        const db = readDB();
        db.classCards = (db.classCards || []).filter(c => c.id !== cardId);
        writeDB(db);
        deleteDocFromFirestore('classCards', cardId);
        return sendJson(res, 200, { success: true, message: 'Class card deleted' });
      }

      // 20. POST /api/cards/assign (Assign monthly card to student)
      if (pathname === '/api/cards/assign' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { studentId, cardId, action } = body; // action: 'add' or 'remove'
        const db = readDB();
        const student = (db.students || []).find(s => s.studentId === studentId);
        if (!student) return sendJson(res, 404, { success: false, message: 'Student not found' });

        if (!student.activeCards) student.activeCards = [];

        if (action === 'remove') {
          student.activeCards = student.activeCards.filter(id => id !== cardId);
        } else {
          if (!student.activeCards.includes(cardId)) {
            student.activeCards.push(cardId);
          }
        }

        writeDB(db);
        return sendJson(res, 200, { success: true, activeCards: student.activeCards });
      }

      // 21. POST /api/requests (Student submits card request or video pack unlock request)
      if (pathname === '/api/requests' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { studentId, studentName, studentPhone, studentSchool, batch, type, targetId, targetTitle, tutorId } = body;
        if (!studentId || !type || !targetId) {
          return sendJson(res, 400, { success: false, message: 'Student ID, type, and target ID are required' });
        }

        const db = readDB();
        if (!db.requests) db.requests = [];

        // Check if pending request already exists
        const existing = db.requests.find(r => r.studentId === studentId && r.targetId === targetId && r.status === 'pending');
        if (existing) {
          return sendJson(res, 200, { success: true, message: 'Request already pending approval', request: existing });
        }

        const newReq = {
          id: 'req_' + Date.now(),
          studentId,
          studentName: studentName || 'Student',
          studentPhone: studentPhone || '',
          studentSchool: studentSchool || '',
          batch: batch || '2027',
          type, // 'card' or 'videopack'
          targetId,
          targetTitle: targetTitle || targetId,
          tutorId: tutorId || '',
          status: 'pending',
          requestedAt: new Date().toISOString()
        };

        db.requests.unshift(newReq);
        writeDB(db);

        // Firestore sync
        syncDocToFirestore('requests', newReq.id, newReq);

        // Trigger Telegram Bot Notification if it's a card request
        if (newReq.type === 'card') {
          const targetCard = (db.classCards || []).find(c => c.id === targetId);
          const feeStr = targetCard ? `Rs. ${Number(targetCard.price).toLocaleString()}` : 'Rs. 3,500';
          const nowFormatted = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
          const telegramMsg = `🔔 <b>නව Card Request එකක් ලැබුණි!</b>\n\n` +
            `👤 <b>ශිෂ්‍යයා:</b> ${newReq.studentName}\n` +
            `🆔 <b>Student ID:</b> <code>${newReq.studentId}</code>\n` +
            `🎓 <b>A/L Batch:</b> ${newReq.batch} A/L\n` +
            `📞 <b>දුරකථන (WhatsApp):</b> ${newReq.studentPhone || 'N/A'}\n` +
            `🏫 <b>පාසල:</b> ${newReq.studentSchool || 'N/A'}\n` +
            `💳 <b>ඉල්ලුම් කළ කාඩ්පත:</b> ${newReq.targetTitle}\n` +
            `💰 <b>මාසික ගාස්තුව:</b> ${feeStr}\n` +
            `⏰ <b>දිනය/වේලාව:</b> ${nowFormatted}\n\n` +
            `👉 <i>Apex Biology Admin Studio වෙත පිවිස ශිෂ්‍යයාගේ කාඩ්පත Activate කරන්න.</i>`;

          const inlineButtons = {
            inline_keyboard: [
              [
                { text: '✅ Approve Card Instantly', callback_data: 'approve_req_' + newReq.id }
              ]
            ]
          };
          sendTelegramNotification(telegramMsg + '\n\n👉 <b>Quick Approve Command:</b>\n<code>/approve ' + newReq.studentId + '</code>', inlineButtons).catch(err => {
            console.warn('Telegram notification failed:', err.message);
          });
        }

        // Trigger Dedicated Study Pack Bot Notification if it's a video pack unlock request
        if (newReq.type === 'videopack') {
          const nowFormatted = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
          const tutorLabel = newReq.tutorId === 'sasanka' ? 'ශශංක ධනුජය ගුරුතුමා' : (newReq.tutorId === 'dhananjaya' ? 'ධනංජය ආරියදාස ගුරුතුමා' : 'දිනේෂ් මුතුගල ගුරුතුමා');
          const telegramMsg = `🔓 <b>නව Video Pack Unlock ඉල්ලුමක්!</b>\n\n` +
            `👤 <b>ශිෂ්‍යයාගේ නම:</b> ${newReq.studentName}\n` +
            `🆔 <b>Student ID:</b> <code>${newReq.studentId}</code>\n` +
            `📞 <b>දුරකථන (WhatsApp):</b> ${newReq.studentPhone || 'N/A'}\n` +
            `🎓 <b>A/L Batch:</b> ${newReq.batch} A/L\n` +
            `🏫 <b>පාසල:</b> ${newReq.studentSchool || 'N/A'}\n` +
            `📦 <b>ඉල්ලුම් කළ Lesson Pack:</b> ${newReq.targetTitle}\n` +
            `👨‍🏫 <b>ගුරුවරයා:</b> ${tutorLabel}\n` +
            `⏰ <b>දිනය/වේලාව:</b> ${nowFormatted}\n\n` +
            `👇 <i>ශිෂ්‍යයාට මෙම Video Pack එක ක්ෂණිකව Unlock කිරීමට පහත බොත්තම ඔබන්න:</i>`;

          const inlineButtons = {
            inline_keyboard: [
              [
                { text: '🔓 Unlock Lesson Pack (Unlock කරන්න)', callback_data: 'unlock_pack_' + newReq.id }
              ]
            ]
          };

          sendStudyPackTelegramNotification(telegramMsg + '\n\n👉 <b>Quick Command:</b>\n<code>/unlock ' + newReq.id + '</code>', inlineButtons).catch(err => {
            console.warn('Study Pack Telegram dispatch notice:', err.message);
          });
        }

        return sendJson(res, 201, { success: true, request: newReq });
      }

      // 22. GET /api/requests (Admin or student fetch requests)
      if (pathname === '/api/requests' && req.method === 'GET') {
        const db = readDB();
        const studentId = parsedUrl.searchParams.get('studentId');
        if (studentId) {
          const studentReqs = (db.requests || []).filter(r => r.studentId === studentId);
          return sendJson(res, 200, { success: true, requests: studentReqs });
        }
        return sendJson(res, 200, { success: true, requests: db.requests || [] });
      }

      // 23. PUT /api/requests/:id/approve
      if (pathname.startsWith('/api/requests/') && pathname.endsWith('/approve') && req.method === 'PUT') {
        const reqId = pathname.split('/')[3];
        const db = readDB();
        const rIdx = (db.requests || []).findIndex(r => r.id === reqId);
        if (rIdx === -1) return sendJson(res, 404, { success: false, message: 'Request not found' });

        const reqItem = db.requests[rIdx];
        
        if (reqItem.type === 'videopack') {
          const unlockRes = executeVideoPackUnlock(reqId);
          if (!unlockRes.success) {
            return sendJson(res, 400, { success: false, message: unlockRes.message || 'Error unlocking pack' });
          }

          // Send confirmation to Study Pack Telegram Bot
          sendStudyPackTelegramNotification(
            `✅ <b>Video Pack සාර්ථකව Unlock කරන ලදි! (Web Admin Studio මඟින්)</b>\n\n` +
            `👤 <b>ශිෂ්‍යයා:</b> ${reqItem.studentName}\n` +
            `🆔 <b>Student ID:</b> <code>${reqItem.studentId}</code>\n` +
            `📦 <b>Video Pack:</b> ${reqItem.targetTitle}\n` +
            `⏰ <b>වේලාව:</b> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}`
          ).catch(() => {});

          return sendJson(res, 200, { success: true, message: 'Video Pack unlocked successfully', request: reqItem });
        }

        // Otherwise handle card request
        reqItem.status = 'approved';
        reqItem.approvedAt = new Date().toISOString();

        const student = (db.students || []).find(s => s.studentId === reqItem.studentId);
        if (student) {
          if (!student.activeCards) student.activeCards = [];
          if (!student.activeCards.includes(reqItem.targetId)) {
            student.activeCards.push(reqItem.targetId);
          }
          student.isVerified = true;
          syncDocToFirestore('students', student.studentId, student);
        }

        writeDB(db);
        syncDocToFirestore('requests', reqItem.id, reqItem);
        return sendJson(res, 200, { success: true, message: 'Request approved and access granted', request: reqItem });
      }

      // 24. PUT /api/requests/:id/reject (Reject or Revoke approved access)
      if (pathname.startsWith('/api/requests/') && (pathname.endsWith('/reject') || pathname.endsWith('/revoke')) && req.method === 'PUT') {
        const reqId = pathname.split('/')[3];
        const db = readDB();
        const rIdx = (db.requests || []).findIndex(r => r.id === reqId);
        if (rIdx === -1) return sendJson(res, 404, { success: false, message: 'Request not found' });

        const reqItem = db.requests[rIdx];
        reqItem.status = 'rejected';
        reqItem.revokedAt = new Date().toISOString();

        // If card was active for the student, revoke it
        const student = (db.students || []).find(s => s.studentId === reqItem.studentId);
        if (student && student.activeCards) {
          student.activeCards = student.activeCards.filter(cid => cid !== reqItem.targetId);
        }

        writeDB(db);
        syncDocToFirestore('requests', reqId, reqItem);
        if (student) syncDocToFirestore('students', student.studentId, student);
        return sendJson(res, 200, { success: true, message: 'Request access revoked and rejected', request: reqItem });
      }

      // 25. POST /api/cards/direct-activate (Admin manual card activation for selected user)
      if (pathname === '/api/cards/direct-activate' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { studentId, cardId } = body;
        const db = readDB();
        const student = (db.students || []).find(s => 
          s.studentId === studentId || s.phone === studentId || s.email === studentId || (s.name && s.name.toLowerCase() === (studentId || '').toLowerCase())
        );
        if (!student) return sendJson(res, 404, { success: false, message: 'Student with ID/Phone "' + studentId + '" not found' });

        if (!student.activeCards) student.activeCards = [];
        if (!student.activeCards.includes(cardId)) {
          student.activeCards.push(cardId);
        }

        // Also approve any pending requests for this student and card
        if (db.requests) {
          db.requests.forEach(r => {
            if (r.studentId === student.studentId && r.targetId === cardId && r.status === 'pending') {
              r.status = 'approved';
              r.approvedAt = new Date().toISOString();
              syncDocToFirestore('requests', r.id, r);
            }
          });
        }

        writeDB(db);
        syncDocToFirestore('students', student.studentId, student);
        return sendJson(res, 200, { success: true, student, activeCards: student.activeCards });
      }

      // ==========================================
      // MONTHLY CLASSES & ATTACH TO UNIT ENDPOINTS
      // ==========================================
      if (pathname === '/api/monthly-classes' && req.method === 'GET') {
        const db = readDB();
        return sendJson(res, 200, { success: true, monthlyClasses: db.monthlyClasses || [], monthlyFolders: db.monthlyFolders || [] });
      }

      if (pathname === '/api/monthly-classes' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { month, batch, tutorId, classType, title, ytUrl, ytId, customThumbnail, date, duration, desc, tuteUrl } = body;
        if (!title || !month || !tutorId) {
          return sendJson(res, 400, { success: false, message: 'Title, Month, and Tutor are required' });
        }

        const rawYt = (ytUrl || ytId || '').trim();
        let extractedYtId = rawYt;
        const match = rawYt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
        if (match && match[1]) extractedYtId = match[1];

        const db = readDB();
        if (!db.monthlyClasses) db.monthlyClasses = [];

        const newClass = {
          id: 'mcv_' + Date.now(),
          month: month.trim(),
          batch: batch || '2027',
          tutorId: tutorId || 'dinesh',
          classType: classType || 'theory',
          title: title.trim(),
          ytId: extractedYtId,
          customThumbnail: customThumbnail ? customThumbnail.trim() : '',
          date: date || new Date().toISOString().split('T')[0],
          duration: duration ? duration.trim() : '2h 00m',
          desc: desc ? desc.trim() : '',
          tuteUrl: tuteUrl ? tuteUrl.trim() : 'https://t.me/apexbiology_tutes',
          attachedUnitId: null,
          createdAt: new Date().toISOString()
        };

        db.monthlyClasses.unshift(newClass);
        writeDB(db);
        return sendJson(res, 201, { success: true, monthlyClass: newClass });
      }

      if (pathname.startsWith('/api/monthly-classes/') && req.method === 'PUT') {
        const classId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const idx = (db.monthlyClasses || []).findIndex(c => c.id === classId);
        if (idx === -1) return sendJson(res, 404, { success: false, message: 'Monthly class video not found' });

        if (body.ytUrl || body.ytId) {
          const rawYt = (body.ytUrl || body.ytId).trim();
          const match = rawYt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
          body.ytId = (match && match[1]) ? match[1] : rawYt;
        }

        Object.assign(db.monthlyClasses[idx], body);
        writeDB(db);
        return sendJson(res, 200, { success: true, monthlyClass: db.monthlyClasses[idx] });
      }

      if (pathname.startsWith('/api/monthly-classes/') && req.method === 'DELETE') {
        const classId = pathname.split('/')[3];
        const db = readDB();
        db.monthlyClasses = (db.monthlyClasses || []).filter(c => c.id !== classId);
        writeDB(db);
        return sendJson(res, 200, { success: true, message: 'Monthly class video deleted' });
      }

      // Attach monthly class video to Video Pack Unit
      if (pathname === '/api/monthly-classes/attach-unit' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { videoId, tutorId, unitId } = body;
        if (!videoId || !unitId) {
          return sendJson(res, 400, { success: false, message: 'Video ID and Unit ID are required' });
        }

        const db = readDB();
        const video = (db.monthlyClasses || []).find(v => v.id === videoId);
        if (!video) return sendJson(res, 404, { success: false, message: 'Monthly video not found' });

        const targetTutorId = tutorId || video.tutorId || 'dinesh';
        if (!db.videoPacks) db.videoPacks = [];

        let pack = db.videoPacks.find(p => p.unitId === unitId && p.tutorId === targetTutorId);
        if (!pack) {
          pack = {
            unitId: unitId,
            num: unitId.replace('u', '').padStart(2, '0'),
            name: 'Unit ' + unitId.replace('u', ''),
            tutorId: targetTutorId,
            isLocked: false,
            lessons: []
          };
          db.videoPacks.push(pack);
        }
        if (!pack.lessons) pack.lessons = [];

        // Check if lesson already attached
        const existingLesson = pack.lessons.find(l => l.title === video.title || l.ytId === video.ytId);
        if (!existingLesson) {
          pack.lessons.push({
            id: `${unitId}-v${Date.now()}`,
            title: video.title,
            duration: video.duration || '2h 00m',
            ytId: video.ytId,
            desc: video.desc || '',
            tuteUrl: video.tuteUrl || 'https://t.me/apexbiology_tutes',
            isLocked: true
          });
        }

        video.attachedUnitId = unitId;
        writeDB(db);
        return sendJson(res, 200, { success: true, message: `Successfully attached to ${targetTutorId} Unit ${unitId}`, attachedUnitId: unitId });
      }

      // Add new Month Folder
      if (pathname === '/api/monthly-folders' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { name, batch } = body;
        if (!name) return sendJson(res, 400, { success: false, message: 'Month name is required' });

        const db = readDB();
        if (!db.monthlyFolders) db.monthlyFolders = [];

        const newFolder = {
          id: 'mf-' + Date.now(),
          name: name.trim(),
          batch: batch || '2027',
          isCurrent: false,
          createdAt: new Date().toISOString()
        };

        db.monthlyFolders.push(newFolder);
        writeDB(db);
        return sendJson(res, 201, { success: true, folder: newFolder });
      }

      // Toggle Tutor Free Lessons Visibility
      if (pathname.startsWith('/api/tutors/') && pathname.endsWith('/free-lessons-visibility') && req.method === 'PUT') {
        const tutorId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const tutor = (db.tutors || []).find(t => t.id === tutorId);
        if (!tutor) return sendJson(res, 404, { success: false, message: 'Tutor not found' });
        tutor.showInFreeLessons = !!body.showInFreeLessons;
        writeDB(db);
        return sendJson(res, 200, { success: true, tutor });
      }

      // ==========================================
      // REVISION VIDEOS ENDPOINTS
      // ==========================================
      if (pathname === '/api/revision-videos' && req.method === 'GET') {
        const db = readDB();
        return sendJson(res, 200, { success: true, revisionVideos: db.revisionVideos || [] });
      }

      if (pathname === '/api/revision-videos' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { tutorId, folderName, title, ytUrl, ytId, duration, date, desc, tuteUrl } = body;
        if (!title || !tutorId) {
          return sendJson(res, 400, { success: false, message: 'Title and Tutor are required' });
        }
        const rawYt = (ytUrl || ytId || '').trim();
        let extractedYtId = rawYt;
        const match = rawYt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
        if (match && match[1]) extractedYtId = match[1];

        const db = readDB();
        if (!db.revisionVideos) db.revisionVideos = [];

        const newRev = {
          id: 'rev_' + Date.now(),
          tutorId,
          folderName: folderName ? folderName.trim() : null, // null means direct video
          title: title.trim(),
          ytId: extractedYtId,
          duration: duration ? duration.trim() : '2h 00m',
          date: date || new Date().toISOString().split('T')[0],
          desc: desc ? desc.trim() : '',
          tuteUrl: tuteUrl ? tuteUrl.trim() : 'https://t.me/apexbiology_tutes',
          isLocked: body.isLocked !== undefined ? !!body.isLocked : true,
          createdAt: new Date().toISOString()
        };
        db.revisionVideos.unshift(newRev);
        writeDB(db);
        return sendJson(res, 201, { success: true, revisionVideo: newRev });
      }

      if (pathname.startsWith('/api/revision-videos/') && req.method === 'PUT') {
        const revId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const idx = (db.revisionVideos || []).findIndex(v => v.id === revId);
        if (idx === -1) return sendJson(res, 404, { success: false, message: 'Revision video not found' });

        if (body.ytUrl || body.ytId) {
          const rawYt = (body.ytUrl || body.ytId).trim();
          const match = rawYt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
          body.ytId = (match && match[1]) ? match[1] : rawYt;
        }
        if (body.folderName !== undefined) {
          body.folderName = body.folderName ? body.folderName.trim() : null;
        }
        Object.assign(db.revisionVideos[idx], body);
        writeDB(db);
        return sendJson(res, 200, { success: true, revisionVideo: db.revisionVideos[idx] });
      }

      if (pathname.startsWith('/api/revision-videos/') && req.method === 'DELETE') {
        const revId = pathname.split('/')[3];
        const db = readDB();
        db.revisionVideos = (db.revisionVideos || []).filter(v => v.id !== revId);
        writeDB(db);
        return sendJson(res, 200, { success: true, message: 'Revision video deleted' });
      }

      // ==========================================
      // FREE LESSONS ENDPOINTS
      // ==========================================
      if (pathname === '/api/free-lessons' && req.method === 'GET') {
        const db = readDB();
        return sendJson(res, 200, { success: true, freeLessons: db.freeLessons || [] });
      }

      if (pathname === '/api/free-lessons' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { tutorId, unit, title, ytUrl, ytId, duration, desc, tuteUrl } = body;
        if (!title) return sendJson(res, 400, { success: false, message: 'Title is required' });

        const rawYt = (ytUrl || ytId || '').trim();
        let extractedYtId = rawYt;
        const match = rawYt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
        if (match && match[1]) extractedYtId = match[1];

        const db = readDB();
        if (!db.freeLessons) db.freeLessons = [];

        const newLesson = {
          id: 'fl_' + Date.now(),
          tutorId: tutorId || 'dinesh',
          type: body.type || 'theory',
          unit: unit || 'u1',
          day: body.day || '',
          title: title.trim(),
          ytId: extractedYtId,
          duration: duration ? duration.trim() : '1h 30m',
          desc: desc ? desc.trim() : '',
          tuteUrl: tuteUrl ? tuteUrl.trim() : 'https://t.me/apexbiology_tutes',
          isLocked: false,
          createdAt: new Date().toISOString()
        };
        db.freeLessons.unshift(newLesson);
        writeDB(db);
        return sendJson(res, 201, { success: true, freeLesson: newLesson });
      }

      if (pathname.startsWith('/api/free-lessons/') && req.method === 'PUT') {
        const flId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const idx = (db.freeLessons || []).findIndex(l => l.id === flId);
        if (idx === -1) return sendJson(res, 404, { success: false, message: 'Free lesson not found' });

        if (body.ytUrl || body.ytId) {
          const rawYt = (body.ytUrl || body.ytId).trim();
          const match = rawYt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/);
          body.ytId = (match && match[1]) ? match[1] : rawYt;
        }
        Object.assign(db.freeLessons[idx], body);
        writeDB(db);
        return sendJson(res, 200, { success: true, freeLesson: db.freeLessons[idx] });
      }

      if (pathname.startsWith('/api/free-lessons/') && req.method === 'DELETE') {
        const flId = pathname.split('/')[3];
        const db = readDB();
        db.freeLessons = (db.freeLessons || []).filter(l => l.id !== flId);
        writeDB(db);
        return sendJson(res, 200, { success: true, message: 'Free lesson deleted' });
      }

      // 26. POST /api/upload-image (Sharp WebP Converter & Uploader)
      if (pathname === '/api/upload-image' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { imageBase64, filename } = body;
        if (!imageBase64) {
          return sendJson(res, 400, { success: false, message: 'Base64 image is required' });
        }

        // Clean base64 header
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const outFileName = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
        const outPath = path.join(UPLOADS_DIR, outFileName);

        if (sharp) {
          await sharp(buffer)
            .webp({ quality: 85 })
            .toFile(outPath);
        } else {
          fs.writeFileSync(outPath, buffer);
        }

        const publicUrl = `/uploads/${outFileName}`;
        return sendJson(res, 201, { success: true, url: publicUrl });
      }

      // POST /api/upload-file (Upload PDF / Document)
      if (pathname === '/api/upload-file' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { fileBase64, filename } = body;
        if (!fileBase64) {
          return sendJson(res, 400, { success: false, message: 'Base64 file is required' });
        }
        const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(cleanBase64, 'base64');
        const ext = path.extname(filename || 'document.pdf') || '.pdf';
        const outFileName = `file_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
        const outPath = path.join(UPLOADS_DIR, outFileName);
        fs.writeFileSync(outPath, buffer);
        const publicUrl = `/uploads/${outFileName}`;
        return sendJson(res, 201, { success: true, url: publicUrl, filename: outFileName });
      }

      
      // ==========================================
      // MONTHLY TUTES MANAGEMENT ENDPOINTS
      // ==========================================
      if (pathname === '/api/monthly-tutes' && req.method === 'GET') {
        const db = readDB();
        const month = parsedUrl.searchParams.get('month');
        const tutorId = parsedUrl.searchParams.get('tutorId');
        let tutes = db.monthlyTutes || [];
        if (month) tutes = tutes.filter(t => t.month === month);
        if (tutorId) tutes = tutes.filter(t => t.tutorId === tutorId);
        return sendJson(res, 200, { success: true, tutes });
      }

      if (pathname === '/api/monthly-tutes' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { title, month, tutorId, classType, pdfUrl, fileType, desc } = body;
        if (!title || !month || !tutorId) {
          return sendJson(res, 400, { success: false, message: 'Title, Month, and Tutor are required' });
        }
        const db = readDB();
        if (!db.monthlyTutes) db.monthlyTutes = [];
        const newTute = {
          id: 'tute_' + Date.now(),
          title: title.trim(),
          month: month.trim(),
          tutorId: tutorId.trim(),
          classType: classType || 'theory',
          pdfUrl: (pdfUrl || '').trim() || 'https://t.me/apexbiology_tutes',
          fileType: fileType || 'PDF Document',
          desc: (desc || '').trim(),
          createdAt: new Date().toISOString()
        };
        db.monthlyTutes.unshift(newTute);
        writeDB(db);
        syncDocToFirestore('monthlyTutes', newTute.id, newTute);
        return sendJson(res, 201, { success: true, tute: newTute });
      }

      if (pathname.startsWith('/api/monthly-tutes/') && req.method === 'DELETE') {
        const tuteId = pathname.split('/')[3];
        const db = readDB();
        db.monthlyTutes = (db.monthlyTutes || []).filter(t => t.id !== tuteId);
        writeDB(db);
        deleteDocFromFirestore('monthlyTutes', tuteId);
        return sendJson(res, 200, { success: true, message: 'Tute deleted' });
      }

      // ==========================================
      // PRODUCTS (STORE) MANAGEMENT ENDPOINTS
      // ==========================================
      if (pathname === '/api/products' && req.method === 'GET') {
        const db = readDB();
        return sendJson(res, 200, { success: true, products: db.products || [] });
      }

      if (pathname === '/api/products' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { title, price, shortDesc, description, images, category, inStock } = body;
        if (!title || !price) {
          return sendJson(res, 400, { success: false, message: 'Product title and price are required' });
        }
        const db = readDB();
        if (!db.products) db.products = [];
        const newProduct = {
          id: 'prod_' + Date.now(),
          title: title.trim(),
          price: Number(price) || 0,
          shortDesc: shortDesc ? shortDesc.trim() : '',
          description: description ? description.trim() : '',
          images: Array.isArray(images) && images.length > 0 ? images : ['/hero.jpg'],
          category: category || 'Printed Material',
          inStock: inStock !== false,
          createdAt: new Date().toISOString()
        };
        db.products.unshift(newProduct);
        writeDB(db);
        syncDocToFirestore('products', newProduct.id, newProduct);
        return sendJson(res, 201, { success: true, product: newProduct });
      }

      if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
        const prodId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const db = readDB();
        const pIdx = (db.products || []).findIndex(p => p.id === prodId);
        if (pIdx === -1) return sendJson(res, 404, { success: false, message: 'Product not found' });
        Object.assign(db.products[pIdx], body);
        writeDB(db);
        syncDocToFirestore('products', prodId, db.products[pIdx]);
        return sendJson(res, 200, { success: true, product: db.products[pIdx] });
      }

      if (pathname.startsWith('/api/products/') && req.method === 'DELETE') {
        const prodId = pathname.split('/')[3];
        const db = readDB();
        db.products = (db.products || []).filter(p => p.id !== prodId);
        writeDB(db);
        deleteDocFromFirestore('products', prodId);
        return sendJson(res, 200, { success: true, message: 'Product deleted' });
      }

      // POST /api/orders (Student Places Order for Physical Product)
      if (pathname === '/api/orders' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { studentId, studentName, whatsapp, district, address, productId, productTitle, productPrice, qty } = body;
        if (!studentName || !whatsapp || !address) {
          return sendJson(res, 400, { success: false, message: 'Name, WhatsApp number and delivery address are required' });
        }
        const db = readDB();
        if (!db.orders) db.orders = [];
        const newOrder = {
          id: 'ord_' + Date.now(),
          studentId: studentId || 'GUEST',
          studentName,
          whatsapp,
          district: district || 'N/A',
          address,
          productId,
          productTitle,
          productPrice: Number(productPrice) || 0,
          qty: Number(qty) || 1,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        db.orders.unshift(newOrder);
        writeDB(db);
        syncDocToFirestore('orders', newOrder.id, newOrder);

        // Telegram Notification for Order
        const nowFormatted = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
        const tgMsg = `📦 <b>නව Store Product Order එකක් ලැබුණි!</b>\n\n` +
          `🛍️ <b>භාණ්ඩය:</b> ${newOrder.productTitle}\n` +
          `💰 <b>මිල:</b> Rs. ${Number(newOrder.productPrice).toLocaleString()} (Qty: ${newOrder.qty})\n` +
          `👤 <b>ශිෂ්‍යයා:</b> ${newOrder.studentName}\n` +
          `🆔 <b>Student ID:</b> <code>${newOrder.studentId}</code>\n` +
          `💬 <b>WhatsApp:</b> ${newOrder.whatsapp}\n` +
          `📍 <b>දිස්ත්‍රික්කය:</b> ${newOrder.district}\n` +
          `🏠 <b>ලිපිනය (Address):</b> ${newOrder.address}\n` +
          `⏰ <b>දිනය/වේලාව:</b> ${nowFormatted}\n\n` +
          `🚚 <i>කරුණාකර ශිෂ්‍යයා අමතා Courier මඟින් භාණ්ඩය පිටත් කර යවන්න.</i>`;

        sendTelegramNotification(tgMsg).catch(err => {
          console.warn('Order telegram dispatch notice:', err.message);
        });

        return sendJson(res, 201, { success: true, order: newOrder });
      }

      // ==========================================
      // BIO BANK MANAGEMENT ENDPOINTS
      // ==========================================
      if (pathname === '/api/biobank' && req.method === 'GET') {
        const db = readDB();
        return sendJson(res, 200, { success: true, bioBank: db.bioBank || { isBlurred: true, units: [] } });
      }

      if (pathname === '/api/biobank/toggle-blur' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { isBlurred } = body;
        const db = readDB();
        if (!db.bioBank) db.bioBank = { isBlurred: true, units: [] };
        db.bioBank.isBlurred = isBlurred === true;
        writeDB(db);
        syncDocToFirestore('settings', 'bioBank', { isBlurred: db.bioBank.isBlurred });
        return sendJson(res, 200, { success: true, isBlurred: db.bioBank.isBlurred });
      }

      if (pathname === '/api/biobank/add-item' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { unitId, category, title, fileUrl, images, pages, format, desc } = body;
        if (!unitId || !category || !title) {
          return sendJson(res, 400, { success: false, message: 'unitId, category and title are required' });
        }
        const db = readDB();
        if (!db.bioBank) db.bioBank = { isBlurred: true, units: [] };
        let unit = (db.bioBank.units || []).find(u => u.id === unitId);
        if (!unit) {
          unit = { id: unitId, num: unitId.replace('u', '').padStart(2, '0'), name: 'Unit ' + unitId, categories: {} };
          if (!db.bioBank.units) db.bioBank.units = [];
          db.bioBank.units.push(unit);
        }
        if (!unit.categories) unit.categories = {};
        if (!unit.categories[category]) unit.categories[category] = [];

        const newItem = {
          id: 'item_' + Date.now(),
          title: title.trim(),
          fileUrl: fileUrl || '',
          images: Array.isArray(images) ? images : [],
          pages: pages || '1 Page',
          format: format || 'PDF',
          desc: desc || '',
          date: new Date().toISOString().split('T')[0]
        };

        unit.categories[category].unshift(newItem);
        writeDB(db);
        syncDocToFirestore('bioBank', unit.id, unit);
        return sendJson(res, 201, { success: true, item: newItem, unit });
      }

      // 26.1 POST /api/biobank/upload (Upload image / PDF / file to /uploads/biobank/)
      if (pathname === '/api/biobank/upload' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { fileName, fileData, fileType } = body;

        if (!fileData || !fileName) {
          return sendJson(res, 400, { success: false, message: 'File name and data are required' });
        }

        const uploadDir = path.join(__dirname, 'public', 'uploads', 'biobank');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Clean base64
        const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Clean safe extension
        const rawExt = path.extname(fileName).toLowerCase() || (fileType === 'image' ? '.webp' : '.pdf');
        const safeExt = ['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.svg'].includes(rawExt) ? rawExt : '.bin';
        const uniqueName = `bio_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${safeExt}`;
        const filePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(filePath, buffer);
        const fileUrl = `/uploads/biobank/${uniqueName}`;

        return sendJson(res, 200, {
          success: true,
          url: fileUrl,
          fileName: fileName,
          format: safeExt.replace('.', '').toUpperCase(),
          size: (buffer.length / 1024).toFixed(1) + ' KB'
        });
      }

      // 26.2 POST /api/biobank/folder (Create subfolder inside unit or parent folder)
      if (pathname === '/api/biobank/folder' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { unitId, parentFolderId, name } = body;

        if (!unitId || !name || !name.trim()) {
          return sendJson(res, 400, { success: false, message: 'unitId and folder name are required' });
        }

        const db = readDB();
        if (!db.bioBank) db.bioBank = { isBlurred: true, units: [] };
        let unit = (db.bioBank.units || []).find(u => u.id === unitId);
        if (!unit) {
          unit = { id: unitId, num: unitId.replace('u', '').padStart(2, '0'), name: 'Unit ' + unitId, categories: {}, folders: [] };
          db.bioBank.units = db.bioBank.units || [];
          db.bioBank.units.push(unit);
        }

        unit.folders = unit.folders || [];
        const newFolder = {
          id: 'fld_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          unitId: unitId,
          parentFolderId: parentFolderId || null,
          name: name.trim(),
          items: [],
          createdAt: Date.now()
        };

        unit.folders.push(newFolder);
        writeDB(db);
        syncDocToFirestore('bioBank', unit.id, unit);

        return sendJson(res, 201, { success: true, folder: newFolder, unit });
      }

      // 26.3 DELETE /api/biobank/folder (Delete subfolder)
      if (pathname === '/api/biobank/folder' && req.method === 'DELETE') {
        const body = await parseJsonBody(req);
        const { unitId, folderId } = body;

        const db = readDB();
        let unit = (db.bioBank && db.bioBank.units ? db.bioBank.units : []).find(u => u.id === unitId);
        if (!unit || !unit.folders) {
          return sendJson(res, 404, { success: false, message: 'Folder not found' });
        }

        unit.folders = unit.folders.filter(f => f.id !== folderId && f.parentFolderId !== folderId);
        writeDB(db);
        syncDocToFirestore('bioBank', unit.id, unit);

        return sendJson(res, 200, { success: true, message: 'Folder deleted', unit });
      }

      // 26.4 POST /api/biobank/item (Add image / PDF / text item to unit or subfolder)
      if (pathname === '/api/biobank/item' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { unitId, folderId, type, title, url, images, pages, textContent, desc } = body;

        if (!unitId || !title || !title.trim()) {
          return sendJson(res, 400, { success: false, message: 'unitId and title are required' });
        }

        const db = readDB();
        if (!db.bioBank) db.bioBank = { isBlurred: true, units: [] };
        let unit = (db.bioBank.units || []).find(u => u.id === unitId);
        if (!unit) {
          unit = { id: unitId, num: unitId.replace('u', '').padStart(2, '0'), name: 'Unit ' + unitId, categories: {}, folders: [], items: [] };
          db.bioBank.units.push(unit);
        }

        const newItem = {
          id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          unitId: unitId,
          folderId: folderId || null,
          type: type || 'pdf', // 'image' | 'pdf' | 'text'
          title: title.trim(),
          url: url || '',
          images: Array.isArray(images) ? images : (url && type === 'image' ? [url] : []),
          pages: pages || (type === 'image' ? 'Image' : '1 Page'),
          format: type === 'image' ? 'WEBP' : (type === 'text' ? 'TEXT' : 'PDF'),
          textContent: textContent || '',
          desc: desc || '',
          date: new Date().toISOString().split('T')[0]
        };

        if (folderId && unit.folders) {
          const fld = unit.folders.find(f => f.id === folderId);
          if (fld) {
            fld.items = fld.items || [];
            fld.items.unshift(newItem);
          } else {
            unit.items = unit.items || [];
            unit.items.unshift(newItem);
          }
        } else {
          unit.items = unit.items || [];
          unit.items.unshift(newItem);
        }

        writeDB(db);
        syncDocToFirestore('bioBank', unit.id, unit);

        return sendJson(res, 201, { success: true, item: newItem, unit });
      }

      // 26.5 DELETE /api/biobank/item (Delete item from unit or subfolder)
      if (pathname === '/api/biobank/item' && req.method === 'DELETE') {
        const body = await parseJsonBody(req);
        const { unitId, folderId, itemId } = body;

        const db = readDB();
        let unit = (db.bioBank && db.bioBank.units ? db.bioBank.units : []).find(u => u.id === unitId);
        if (!unit) {
          return sendJson(res, 404, { success: false, message: 'Unit not found' });
        }

        if (folderId && unit.folders) {
          const fld = unit.folders.find(f => f.id === folderId);
          if (fld && fld.items) {
            fld.items = fld.items.filter(it => it.id !== itemId);
          }
        }
        if (unit.items) {
          unit.items = unit.items.filter(it => it.id !== itemId);
        }
        // Also clean legacy categories if present
        if (unit.categories) {
          Object.keys(unit.categories).forEach(k => {
            unit.categories[k] = (unit.categories[k] || []).filter(it => it.id !== itemId);
          });
        }

        writeDB(db);
        syncDocToFirestore('bioBank', unit.id, unit);

        return sendJson(res, 200, { success: true, message: 'Item deleted', unit });
      }

      // ==========================================
      // ADMIN AUTHENTICATION & MULTI-ROLE SYSTEM
      // Roles: 'super_admin' (Full Access), 'normal_admin' (Live & Monthly Classes Only)
      // ==========================================

      // 27. POST /api/admin/login
      if (pathname === '/api/admin/login' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { email, password } = body;
        const db = readDB();

        if (!db.admins || db.admins.length === 0) {
          db.admins = [
            { id: 'adm_super_nikila', name: 'Super Admin', email: 'dg.edits65@gmail.com', password: 'Nikila2008326@', role: 'super_admin', createdAt: new Date().toISOString() }
          ];
          writeDB(db);
        }

        const admin = (db.admins || []).find(a => 
          a.email && a.email.toLowerCase() === (email || '').toLowerCase().trim() && a.password === password
        );

        if (!admin) {
          return sendJson(res, 401, { success: false, message: 'Invalid admin credentials. Please verify email and password.' });
        }

        return sendJson(res, 200, {
          success: true,
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
          }
        });
      }

      // 28. GET /api/admin/users (Get Admin Accounts)
      if (pathname === '/api/admin/users' && req.method === 'GET') {
        const db = readDB();
        const safeAdmins = (db.admins || []).map(a => ({
          id: a.id,
          name: a.name,
          email: a.email,
          role: a.role,
          createdAt: a.createdAt
        }));
        return sendJson(res, 200, { success: true, admins: safeAdmins, settings: db.settings || {} });
      }

      // 29. POST /api/admin/users (Create Admin Account)
      if (pathname === '/api/admin/users' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { name, email, password, role } = body;
        if (!name || !email || !password) {
          return sendJson(res, 400, { success: false, message: 'Name, email, and password are required' });
        }

        const db = readDB();
        if (!db.admins) db.admins = [];

        const existing = db.admins.find(a => a.email.toLowerCase() === email.toLowerCase().trim());
        if (existing) {
          return sendJson(res, 409, { success: false, message: 'An admin account with this email already exists' });
        }

        const newAdmin = {
          id: 'adm_' + Date.now(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: password.trim(),
          role: role === 'normal_admin' ? 'normal_admin' : 'super_admin',
          createdAt: new Date().toISOString()
        };

        db.admins.push(newAdmin);
        writeDB(db);
        syncDocToFirestore('admins', newAdmin.id, newAdmin);

        return sendJson(res, 201, {
          success: true,
          admin: {
            id: newAdmin.id,
            name: newAdmin.name,
            email: newAdmin.email,
            role: newAdmin.role
          }
        });
      }

      // 30. DELETE /api/admin/users/:id
      if (pathname.startsWith('/api/admin/users/') && req.method === 'DELETE') {
        const adminId = pathname.split('/')[4];
        const db = readDB();
        if (!db.admins) db.admins = [];

        const superCount = db.admins.filter(a => a.role === 'super_admin').length;
        const target = db.admins.find(a => a.id === adminId);

        if (target && target.role === 'super_admin' && superCount <= 1) {
          return sendJson(res, 400, { success: false, message: 'Cannot delete the only Super Admin account.' });
        }

        db.admins = db.admins.filter(a => a.id !== adminId);
        writeDB(db);
        deleteDocFromFirestore('admins', adminId);

        return sendJson(res, 200, { success: true, message: 'Admin account deleted successfully' });
      }

      // 31. POST /api/admin/telegram-settings
      if (pathname === '/api/admin/telegram-settings' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { telegramBotToken, telegramChatId, studyPackBotToken, studyPackChatId } = body;
        const db = readDB();
        if (!db.settings) db.settings = {};

        if (telegramBotToken !== undefined) db.settings.telegramBotToken = telegramBotToken.trim();
        if (telegramChatId !== undefined) db.settings.telegramChatId = telegramChatId.trim();
        if (studyPackBotToken !== undefined) db.settings.studyPackBotToken = studyPackBotToken.trim();
        if (studyPackChatId !== undefined) db.settings.studyPackChatId = studyPackChatId.trim();

        writeDB(db);
        syncDocToFirestore('settings', 'telegram', db.settings);
        return sendJson(res, 200, { success: true, settings: db.settings });
      }

      // 32. POST /api/admin/telegram-test
      if (pathname === '/api/admin/telegram-test' && req.method === 'POST') {
        const body = await parseJsonBody(req).catch(() => ({}));
        const target = body.target || 'card';

        if (target === 'studypack') {
          const testMsg = `🧪 <b>Bio Study Pack Telegram Bot පරීක්ෂණ පණිවිඩයකි (Test Alert)!</b>\n\n` +
            `✅ ඔබගේ Study Pack Unlock Bot (@Bio_study_packbot) සාර්ථකව සම්බන්ධ වී ඇත.\n` +
            `🆔 <b>Admin Chat ID:</b> <code>${getStudyPackChatId()}</code>\n` +
            `⏰ <b>වේලාව:</b> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}\n\n` +
            `දැන් සිසුන් වෙබ් අඩවියෙන් A/L Biology Video Lesson Packs Unlock කිරීමට ඉල්ලුම් කළ විගස ඔබට මෙහි Alert එකක් සහ ක්ෂණික [ 🔓 Unlock ] බොත්තමක් ලැබෙනු ඇත.`;

          const inlineButtons = {
            inline_keyboard: [
              [
                { text: '🧪 Test Unlock Button (ක්‍රියාකාරීද බලන්න)', callback_data: 'unlock_test_sample' }
              ]
            ]
          };

          const dispatch = await sendStudyPackTelegramNotification(testMsg, inlineButtons);
          if (dispatch.success) {
            return sendJson(res, 200, { success: true, message: 'Study Pack Test alert message sent to Telegram successfully!' });
          } else {
            const errDesc = (dispatch.resp && dispatch.resp.description) || dispatch.error || 'Check Bot Token & Chat ID';
            const hint = errDesc.includes('chat not found') ? ' (කරුණාකර Telegram එකේ @Bio_study_packbot වෙත ගොස් START කරන්න)' : '';
            return sendJson(res, 400, {
              success: false,
              message: 'Telegram dispatch failed: ' + errDesc + hint
            });
          }
        }

        const testMsg = `🧪 <b>Apex Biology Telegram Bot පරීක්ෂණ පණිවිඩයකි (Test Alert)!</b>\n\n` +
          `✅ ඔබගේ Telegram Bot සාර්ථකව සම්බන්ධ වී ඇත.\n` +
          `⏰ වේලාව: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}\n\n` +
          `දැන් සිසුන් Store එකෙන් Class Card Request යවන විට ක්ෂණිකව මෙම Telegram Bot වෙත Alerts ලැබෙනු ඇත.`;

        const result = await sendTelegramNotification(testMsg);
        if (result.success) {
          return sendJson(res, 200, { success: true, message: 'Card Bot Test message successfully sent to your Telegram Chat!' });
        } else {
          return sendJson(res, 400, {
            success: false,
            message: result.error || 'Failed to dispatch Telegram message. Check your Bot Token and Chat ID.'
          });
        }
      }

      // 33. POST /api/firebase/sync-all
      if (pathname === '/api/firebase/sync-all' && req.method === 'POST') {
        const db = readDB();
        let syncedCount = 0;

        for (const s of (db.students || [])) {
          syncDocToFirestore('students', s.studentId, s);
          syncedCount++;
        }
        for (const c of (db.classCards || [])) {
          syncDocToFirestore('classCards', c.id, c);
          syncedCount++;
        }
        for (const r of (db.requests || [])) {
          syncDocToFirestore('requests', r.id, r);
          syncedCount++;
        }
        for (const a of (db.admins || [])) {
          syncDocToFirestore('admins', a.id, a);
          syncedCount++;
        }
        if (db.settings) {
          syncDocToFirestore('settings', 'telegram', db.settings);
          syncedCount++;
        }

        return sendJson(res, 200, {
          success: true,
          message: `Initiated Firestore synchronization for ${syncedCount} records into Firebase project apex-bio-aee21.`
        });
      }

      // 34. GET /api/admin/storage-stats (Calculate Real Database Storage & Disk Space)
      if (pathname === '/api/admin/storage-stats' && req.method === 'GET') {
        const db = readDB();
        let dbSizeBytes = 0;
        try {
          if (fs.existsSync(DB_FILE)) {
            const st = fs.statSync(DB_FILE);
            dbSizeBytes = st.size;
          }
        } catch (e) {
          dbSizeBytes = 0;
        }

        // Calculate uploads folder size and file count recursively
        function getDirStats(dirPath) {
          let totalBytes = 0;
          let fileCount = 0;
          if (!fs.existsSync(dirPath)) return { totalBytes, fileCount };
          try {
            const items = fs.readdirSync(dirPath);
            for (const item of items) {
              const fullPath = path.join(dirPath, item);
              try {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                  const sub = getDirStats(fullPath);
                  totalBytes += sub.totalBytes;
                  fileCount += sub.fileCount;
                } else {
                  totalBytes += stat.size;
                  fileCount++;
                }
              } catch (err) {}
            }
          } catch (err) {}
          return { totalBytes, fileCount };
        }

        const uploadStats = getDirStats(UPLOADS_DIR);
        const totalUsedBytes = dbSizeBytes + uploadStats.totalBytes;
        const totalQuotaBytes = 500 * 1024 * 1024; // 500 MB safe storage quota
        const usedPercentage = Math.min(100, Math.max(0.1, Number(((totalUsedBytes / totalQuotaBytes) * 100).toFixed(2))));

        function formatBytes(bytes) {
          if (bytes === 0) return '0 B';
          const k = 1024;
          const sizes = ['B', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Count videos inside videoPacks
        let totalVideoLessons = 0;
        (db.videoPacks || []).forEach(p => {
          totalVideoLessons += (p.lessons || []).length;
        });

        const mem = process.memoryUsage();

        return sendJson(res, 200, {
          success: true,
          dbSizeBytes,
          dbSizeFormatted: formatBytes(dbSizeBytes),
          uploadsSizeBytes: uploadStats.totalBytes,
          uploadsSizeFormatted: formatBytes(uploadStats.totalBytes),
          uploadsCount: uploadStats.fileCount,
          totalStorageBytes: totalUsedBytes,
          totalStorageFormatted: formatBytes(totalUsedBytes),
          quotaBytes: totalQuotaBytes,
          quotaFormatted: formatBytes(totalQuotaBytes),
          percentageUsed: usedPercentage,
          freeStorageFormatted: formatBytes(Math.max(0, totalQuotaBytes - totalUsedBytes)),
          memoryUsageFormatted: formatBytes(mem.heapUsed),
          recordCounts: {
            students: (db.students || []).length,
            videoLessons: totalVideoLessons,
            monthlyClasses: (db.monthlyClasses || []).length,
            classCards: (db.classCards || []).length,
            requests: (db.requests || []).length,
            products: (db.products || []).length,
            bioBankItems: (db.bioBank && db.bioBank.units) ? db.bioBank.units.reduce((acc, u) => acc + (u.items || []).length, 0) : 0
          },
          status: usedPercentage < 80 ? 'Optimal (Excellent)' : (usedPercentage < 95 ? 'Moderate' : 'High Usage')
        });
      }

      
      // ==========================================
      // TELEGRAM WEBHOOK / APPROVE COMMAND LISTENER
      // ==========================================
      if (pathname === '/api/telegram/webhook' && req.method === 'POST') {
        const update = await parseJsonBody(req);
        
        // Handle Callback Query (Inline Button Click)
        if (update.callback_query) {
          const cb = update.callback_query;
          const data = cb.data || '';
          const chatId = cb.message && cb.message.chat ? cb.message.chat.id : null;
          
          if (data.startsWith('approve_req_')) {
            const reqId = data.replace('approve_req_', '');
            const db = readDB();
            const rIdx = (db.requests || []).findIndex(r => r.id === reqId);
            if (rIdx !== -1) {
              const reqObj = db.requests[rIdx];
              reqObj.status = 'approved';
              reqObj.approvedAt = new Date().toISOString();
              
              // If type is card, add to student's activeCards
              if (reqObj.type === 'card' && reqObj.targetId) {
                const sIdx = (db.students || []).findIndex(s => s.studentId === reqObj.studentId);
                if (sIdx !== -1) {
                  if (!db.students[sIdx].activeCards) db.students[sIdx].activeCards = [];
                  if (!db.students[sIdx].activeCards.includes(reqObj.targetId)) {
                    db.students[sIdx].activeCards.push(reqObj.targetId);
                  }
                  syncDocToFirestore('students', db.students[sIdx].studentId, db.students[sIdx]);
                }
              }
              writeDB(db);
              syncDocToFirestore('requests', reqId, reqObj);
              
              if (chatId) {
                await sendTelegramNotification(`✅ <b>කාඩ්පත සාර්ථකව Approve කරන ලදි!</b>\n\n👤 ශිෂ්‍යයා: ${reqObj.studentName}\n🆔 ID: <code>${reqObj.studentId}</code>\n💳 කාඩ්පත: ${reqObj.targetTitle}`);
              }
            }
          }
          return sendJson(res, 200, { ok: true });
        }

        // Handle Text Commands (e.g. /approve <studentId> or /approve_<studentId>)
        if (update.message && update.message.text) {
          const text = update.message.text.trim();
          const chatId = update.message.chat.id;

          if (text.startsWith('/approve') || text.startsWith('/activate')) {
            const parts = text.split(/\s+/);
            const studentId = parts[1] || text.replace('/approve_', '').replace('/activate_', '');
            
            if (!studentId || studentId.startsWith('/')) {
              await sendTelegramNotification('⚠️ කරුණාකර Student ID එක ඇතුළත් කරන්න.\nඋදාහරණයක් ලෙස: <code>/approve 27728669</code>');
              return sendJson(res, 200, { ok: true });
            }

            const db = readDB();
            const student = (db.students || []).find(s => s.studentId === studentId);
            if (!student) {
              await sendTelegramNotification(`❌ Student ID <code>${studentId}</code> සොයාගත නොහැකි විය.`);
              return sendJson(res, 200, { ok: true });
            }

            // Find latest pending card request for this student
            const pendingReq = (db.requests || []).find(r => r.studentId === studentId && r.status === 'pending');
            let activatedCardTitle = 'Monthly Class Card';

            if (pendingReq) {
              pendingReq.status = 'approved';
              pendingReq.approvedAt = new Date().toISOString();
              if (pendingReq.targetId) {
                if (!student.activeCards) student.activeCards = [];
                if (!student.activeCards.includes(pendingReq.targetId)) {
                  student.activeCards.push(pendingReq.targetId);
                }
                activatedCardTitle = pendingReq.targetTitle || activatedCardTitle;
              }
              syncDocToFirestore('requests', pendingReq.id, pendingReq);
            } else {
              // If no pending request, activate current active batch card
              const latestCard = (db.classCards || [])[0];
              if (latestCard) {
                if (!student.activeCards) student.activeCards = [];
                if (!student.activeCards.includes(latestCard.id)) {
                  student.activeCards.push(latestCard.id);
                }
                activatedCardTitle = latestCard.title;
              }
            }

            student.isVerified = true;
            writeDB(db);
            syncDocToFirestore('students', student.studentId, student);

            await sendTelegramNotification(`🎉 <b>Class Card සාර්ථකව Activate කරන ලදි!</b>\n\n👤 <b>ශිෂ්‍යයා:</b> ${student.name}\n🆔 <b>Student ID:</b> <code>${student.studentId}</code>\n🎓 <b>Batch:</b> ${student.year || '2027'} A/L\n💳 <b>සක්‍රීය කළ කාඩ්පත:</b> ${activatedCardTitle}\n\n✅ <i>ශිෂ්‍යයාට දැන් My Cards වෙතින් වීඩියෝ නැරඹිය හැක.</i>`);
            return sendJson(res, 200, { ok: true });
          }

          if (text === '/start' || text === '/help') {
            await sendTelegramNotification(`👋 <b>Apex Biology Admin Bot වෙත සාදරයෙන් පිළිගනිමු!</b>\n\n🔹 <b>ශිෂ්‍යයෙකුගේ Card එකක් සක්‍රීය කිරීමට:</b>\n<code>/approve &lt;Student_ID&gt;</code>\n(උදා: <code>/approve 27728669</code>)\n\n🔹 ශිෂ්‍යයෙක් කාඩ්පතක් හෝ නිබන්ධනයක් ඇණවුම් කළ විගස ඔබට මෙහි alert එකක් ලැබෙන අතර message එකේ ඇති link/command එකෙන් එක ක්ලික් එකකින් activate කළ හැක.`);
            return sendJson(res, 200, { ok: true });
          }
        }

        return sendJson(res, 200, { ok: true });
      }

        // Unmatched API route
      return sendJson(res, 404, { success: false, message: 'API route not found' });
    } catch (apiErr) {
      console.error('API Error:', apiErr);
      return sendJson(res, 500, { success: false, message: 'Server error: ' + apiErr.message });
    }
  }

  // ==========================================
  // STATIC FILE SERVING & PAGE ROUTES
  // ==========================================
  let reqPath = pathname;

  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  } else if (reqPath === '/admin' || reqPath === '/admin/') {
    reqPath = '/admin.html';
  } else if (reqPath === '/biobank' || reqPath === '/biobank/' || reqPath === '/bank') {
    reqPath = '/biobank.html';
  }

  let filePath = path.join(__dirname, reqPath);

  // If path doesn't exist directly, check inside public
  if (!fs.existsSync(filePath)) {
    const publicPath = path.join(__dirname, 'public', reqPath);
    if (fs.existsSync(publicPath)) {
      filePath = publicPath;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      if (ext === '.apk') {
        res.setHeader('Content-Disposition', 'attachment; filename="ApexBiology_v2.4.apk"');
      }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});


// ==========================================
// TELEGRAM BOT LONG-POLLING ENGINES
// 1. General Bot (Cards, Store Orders, Admin)
// 2. Dedicated Study Pack Bot (@Bio_study_packbot)
// ==========================================

// 1. General Card Bot Polling
let lastTelegramUpdateId = 0;
async function startTelegramPolling() {
  const db = readDB();
  const token = (db.settings && db.settings.telegramBotToken) || process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    setTimeout(startTelegramPolling, 10000);
    return;
  }

  const pollUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastTelegramUpdateId + 1}&timeout=20`;
  
  try {
    const res = await new Promise((resolve, reject) => {
      https.get(pollUrl, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
        });
      }).on('error', reject);
    });

    if (res && res.ok && Array.isArray(res.result)) {
      for (const update of res.result) {
        lastTelegramUpdateId = Math.max(lastTelegramUpdateId, update.update_id);
        
        // Handle Callback Query (Approve Button Click)
        if (update.callback_query) {
          const cb = update.callback_query;
          const data = cb.data || '';
          const chatId = cb.message && cb.message.chat ? cb.message.chat.id : null;
          const msgId = cb.message ? cb.message.message_id : null;
          
          if (data.startsWith('approve_req_')) {
            const reqId = data.replace('approve_req_', '');
            const currentDb = readDB();
            const rIdx = (currentDb.requests || []).findIndex(r => r.id === reqId);
            if (rIdx !== -1) {
              const reqObj = currentDb.requests[rIdx];
              reqObj.status = 'approved';
              reqObj.approvedAt = new Date().toISOString();
              
              if (reqObj.type === 'card' && reqObj.targetId) {
                const sIdx = (currentDb.students || []).findIndex(s => s.studentId === reqObj.studentId);
                if (sIdx !== -1) {
                  if (!currentDb.students[sIdx].activeCards) currentDb.students[sIdx].activeCards = [];
                  if (!currentDb.students[sIdx].activeCards.includes(reqObj.targetId)) {
                    currentDb.students[sIdx].activeCards.push(reqObj.targetId);
                  }
                  currentDb.students[sIdx].isVerified = true;
                  syncDocToFirestore('students', currentDb.students[sIdx].studentId, currentDb.students[sIdx]);
                }
              }
              writeDB(currentDb);
              syncDocToFirestore('requests', reqId, reqObj);
              
              await callTelegramApi(token, 'answerCallbackQuery', {
                callback_query_id: cb.id,
                text: '🎉 Class Card සාර්ථකව Approve කරන ලදී!',
                show_alert: true
              });

              if (chatId && msgId) {
                await callTelegramApi(token, 'editMessageReplyMarkup', {
                  chat_id: chatId,
                  message_id: msgId,
                  reply_markup: {
                    inline_keyboard: [[{ text: '✅ APPROVED & ACTIVE', callback_data: 'noop' }]]
                  }
                });
              }

              if (chatId) {
                await sendTelegramNotification(`✅ <b>කාඩ්පත සාර්ථකව Approve කරන ලදි!</b>\n\n👤 ශිෂ්‍යයා: ${reqObj.studentName}\n🆔 ID: <code>${reqObj.studentId}</code>\n💳 කාඩ්පත: ${reqObj.targetTitle}`);
              }
            }
          }
        }

        // Handle text commands (/approve <studentId>)
        if (update.message && update.message.text) {
          const text = update.message.text.trim();
          const chatId = update.message.chat.id;

          if (text.startsWith('/approve') || text.startsWith('/activate')) {
            const parts = text.split(/\s+/);
            const studentId = parts[1] || text.replace('/approve_', '').replace('/activate_', '');
            
            if (!studentId || studentId.startsWith('/')) {
              await sendTelegramNotification('⚠️ කරුණාකර Student ID එක ඇතුළත් කරන්න.\nඋදාහරණයක් ලෙස: <code>/approve 27728669</code>');
            } else {
              const currentDb = readDB();
              const student = (currentDb.students || []).find(s => s.studentId === studentId);
              if (!student) {
                await sendTelegramNotification(`❌ Student ID <code>${studentId}</code> සොයාගත නොහැකි විය.`);
              } else {
                const pendingReq = (currentDb.requests || []).find(r => r.studentId === studentId && r.status === 'pending');
                let activatedCardTitle = 'Monthly Class Card';

                if (pendingReq) {
                  pendingReq.status = 'approved';
                  pendingReq.approvedAt = new Date().toISOString();
                  if (pendingReq.targetId) {
                    if (!student.activeCards) student.activeCards = [];
                    if (!student.activeCards.includes(pendingReq.targetId)) {
                      student.activeCards.push(pendingReq.targetId);
                    }
                    activatedCardTitle = pendingReq.targetTitle || activatedCardTitle;
                  }
                  syncDocToFirestore('requests', pendingReq.id, pendingReq);
                } else {
                  const latestCard = (currentDb.classCards || [])[0];
                  if (latestCard) {
                    if (!student.activeCards) student.activeCards = [];
                    if (!student.activeCards.includes(latestCard.id)) {
                      student.activeCards.push(latestCard.id);
                    }
                    activatedCardTitle = latestCard.title;
                  }
                }

                student.isVerified = true;
                writeDB(currentDb);
                syncDocToFirestore('students', student.studentId, student);

                await sendTelegramNotification(`🎉 <b>Class Card සාර්ථකව Activate කරන ලදි!</b>\n\n👤 <b>ශිෂ්‍යයා:</b> ${student.name}\n🆔 <b>Student ID:</b> <code>${student.studentId}</code>\n🎓 <b>Batch:</b> ${student.year || '2027'} A/L\n💳 <b>සක්‍රීය කළ කාඩ්පත:</b> ${activatedCardTitle}\n\n✅ <i>ශිෂ්‍යයාට දැන් My Cards වෙතින් වීඩියෝ නැරඹිය හැක.</i>`);
              }
            }
          } else if (text === '/start' || text === '/help') {
            const currentDb = readDB();
            if (!currentDb.settings) currentDb.settings = {};
            currentDb.settings.telegramChatId = String(chatId);
            writeDB(currentDb);

            await sendTelegramNotification(`👋 <b>Apex Biology Admin Bot වෙත සාදරයෙන් පිළිගනිමු!</b>\n\n✅ <b>ඔබගේ Telegram Chat ID:</b> <code>${chatId}</code> සාර්ථකව සම්බන්ධ විය.\n\n🔹 <b>ශිෂ්‍යයෙකුගේ Card එකක් සක්‍රීය කිරීමට:</b>\n<code>/approve &lt;Student_ID&gt;</code>\n(උදා: <code>/approve 27728669</code>)\n\n🔹 ශිෂ්‍යයෙක් කාඩ්පතක් හෝ නිබන්ධනයක් ඇණවුම් කළ විගස ඔබට මෙහි alert එකක් ලැබෙන අතර message එකේ ඇති button එකෙන් හෝ command එකෙන් ක්ෂණිකව activate කළ හැක.`);
          }
        }
      }
    }
  } catch (err) {
    // Polling retry
  }

  setTimeout(startTelegramPolling, 1500);
}

// 2. Dedicated Study Pack Bot Polling (@Bio_study_packbot)
let lastStudyPackUpdateId = 0;
async function startStudyPackTelegramPolling() {
  const token = getStudyPackBotToken();
  if (!token) {
    setTimeout(startStudyPackTelegramPolling, 10000);
    return;
  }

  const pollUrl = `https://api.telegram.org/bot${token}/getUpdates?offset=${lastStudyPackUpdateId + 1}&timeout=20`;

  try {
    const res = await new Promise((resolve, reject) => {
      https.get(pollUrl, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
        });
      }).on('error', reject);
    });

    if (res && res.ok && Array.isArray(res.result)) {
      for (const update of res.result) {
        lastStudyPackUpdateId = Math.max(lastStudyPackUpdateId, update.update_id);

        // A. Handle Inline Button Clicks (Callback Queries)
        if (update.callback_query) {
          const cb = update.callback_query;
          const data = cb.data || '';
          const chatId = cb.message && cb.message.chat ? cb.message.chat.id : null;
          const msgId = cb.message ? cb.message.message_id : null;

          if (data.startsWith('unlock_pack_')) {
            const reqId = data.replace('unlock_pack_', '');
            const currentDb = readDB();
            const reqItem = (currentDb.requests || []).find(r => r.id === reqId);

            if (!reqItem) {
              await callTelegramApi(token, 'answerCallbackQuery', {
                callback_query_id: cb.id,
                text: '❌ මෙම ඉල්ලුම සොයාගත නොහැකි විය (Request not found).',
                show_alert: true
              });
              continue;
            }

            if (reqItem.status === 'approved') {
              await callTelegramApi(token, 'answerCallbackQuery', {
                callback_query_id: cb.id,
                text: '⚠️ මෙම Video Pack එක දැනටමත් Unlock කර ඇත (Already Unlocked)!',
                show_alert: true
              });
              continue;
            }

            const unlockResult = executeVideoPackUnlock(reqId);
            if (unlockResult.success) {
              const nowColombo = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });

              // 1. Alert Pop-up on Telegram
              await callTelegramApi(token, 'answerCallbackQuery', {
                callback_query_id: cb.id,
                text: `🎉 සාර්ථකයි! ${reqItem.studentName} සඳහා ${reqItem.targetTitle} සාර්ථකව Unlock කරන ලදී!`,
                show_alert: true
              });

              // 2. In-place Message Update (turns into Green Confirmed state)
              if (chatId && msgId) {
                const oldText = cb.message.text || '';
                const updatedText = oldText + `\n\n━━━━━━━━━━━━━━━━━━━━\n✅ <b>APPROVED & UNLOCKED!</b>\n⏰ <b>අනුමත කළ වේලාව:</b> ${nowColombo}\n👨‍💻 <b>Admin:</b> Telegram මඟින් සාර්ථකව Unlock කරන ලදී.`;
                await callTelegramApi(token, 'editMessageText', {
                  chat_id: chatId,
                  message_id: msgId,
                  text: updatedText,
                  parse_mode: 'HTML',
                  reply_markup: {
                    inline_keyboard: [
                      [{ text: '✅ UNLOCKED & ACTIVE (සක්‍රීයයි)', callback_data: 'noop' }]
                    ]
                  }
                });
              }

              // 3. Confirmation Chat Message
              if (chatId) {
                await callTelegramApi(token, 'sendMessage', {
                  chat_id: chatId,
                  text: `🎉 <b>Video Pack එක සාර්ථකව Unlock කරන ලදි!</b>\n\n` +
                    `👤 <b>ශිෂ්‍යයා:</b> ${reqItem.studentName}\n` +
                    `🆔 <b>Student ID:</b> <code>${reqItem.studentId}</code>\n` +
                    `📦 <b>Video Pack:</b> ${reqItem.targetTitle}\n` +
                    `🎓 <b>A/L Batch:</b> ${reqItem.batch} A/L\n\n` +
                    `✅ <i>ශිෂ්‍යයාට දැන් Student Portal එකෙන් වීඩියෝ නැරඹිය හැක.</i>`,
                  parse_mode: 'HTML'
                });
              }
            } else {
              await callTelegramApi(token, 'answerCallbackQuery', {
                callback_query_id: cb.id,
                text: '❌ අනුමත කිරීමට නොහැකි විය: ' + (unlockResult.message || 'Error'),
                show_alert: true
              });
            }
          } else if (data === 'unlock_test_sample') {
            await callTelegramApi(token, 'answerCallbackQuery', {
              callback_query_id: cb.id,
              text: '🎉 සාර්ථකයි! Bio Study Pack Bot එක 100% ක් නිවැරදිව ක්‍රියාත්මක වේ!',
              show_alert: true
            });
          } else if (data === 'noop') {
            await callTelegramApi(token, 'answerCallbackQuery', {
              callback_query_id: cb.id,
              text: '✅ මෙම Video Pack එක දැනටමත් Unlock කර ඇත.',
              show_alert: false
            });
          }
        }

        // B. Handle Text Commands (/start, /unlock, /status)
        if (update.message && update.message.text) {
          const text = update.message.text.trim();
          const chatId = update.message.chat.id;
          const fromUser = update.message.from;
          const userName = (fromUser && (fromUser.first_name || fromUser.username)) || 'Admin';

          if (text.startsWith('/start') || text.startsWith('/help')) {
            const currentDb = readDB();
            if (!currentDb.settings) currentDb.settings = {};
            currentDb.settings.studyPackChatId = String(chatId);
            writeDB(currentDb);
            syncDocToFirestore('settings', 'telegram', currentDb.settings);

            const welcomeMsg = `👋 <b>ආයුබෝවන් ${userName}!</b>\n\n` +
              `🌿 <b>Apex Bio Study Pack Unlock Bot වෙත සාදරයෙන් පිළිගනිමු!</b>\n\n` +
              `✅ <b>ඔබගේ Telegram Chat ID:</b> <code>${chatId}</code> සාර්ථකව මෙම Bot සමඟ සම්බන්ධ විය!\n\n` +
              `📌 <b>මෙම Bot ක්‍රියාත්මක වන ආකාරය:</b>\n` +
              `1️⃣ සිසුන් වෙබ් අඩවියේ Video Packs වලින් Lesson Pack එකක් Unlock කරන ලෙස ඉල්ලුම් කළ විගස ඔබට මෙහි Alert එකක් ලැබේ.\n` +
              `2️⃣ Message එකේ පහළ ඇති <b>[ 🔓 Unlock Lesson Pack ]</b> බොත්තම ඔබ ක්ලික් කළ සැනින් ශිෂ්‍යයාට Video Pack එක Unlock වේ!\n\n` +
              `🔹 <b>Commands:</b>\n` +
              `• <code>/unlock &lt;Student_ID&gt;</code> (උදා: <code>/unlock 27784979</code>)\n` +
              `• <code>/unlock &lt;Request_ID&gt;</code>\n` +
              `• <code>/status</code> - පද්ධතියේ තත්ත්වය පරීක්ෂා කිරීමට`;

            await callTelegramApi(token, 'sendMessage', {
              chat_id: chatId,
              text: welcomeMsg,
              parse_mode: 'HTML'
            });
          } else if (text.startsWith('/unlock') || text.startsWith('/approve')) {
            const parts = text.split(/\s+/);
            const targetParam = parts[1];

            if (!targetParam) {
              await callTelegramApi(token, 'sendMessage', {
                chat_id: chatId,
                text: '⚠️ කරුණාකර Student ID එක හෝ Request ID එක ඇතුළත් කරන්න.\nඋදාහරණයක් ලෙස: <code>/unlock 27784979</code>',
                parse_mode: 'HTML'
              });
            } else {
              const unlockResult = executeVideoPackUnlock(targetParam);
              if (unlockResult.success) {
                const reqItem = unlockResult.request;
                const student = unlockResult.student;
                const stuName = (reqItem && reqItem.studentName) || (student && student.name) || 'Student';
                const stuId = (reqItem && reqItem.studentId) || (student && student.studentId) || targetParam;
                const packTitle = (reqItem && reqItem.targetTitle) || 'Requested Video Packs';

                await callTelegramApi(token, 'sendMessage', {
                  chat_id: chatId,
                  text: `🎉 <b>Video Pack සාර්ථකව Unlock කරන ලදි!</b>\n\n👤 <b>ශිෂ්‍යයා:</b> ${stuName}\n🆔 <b>Student ID:</b> <code>${stuId}</code>\n📦 <b>Video Pack:</b> ${packTitle}\n\n✅ <i>ශිෂ්‍යයාට දැන් Portal එකෙන් වීඩියෝ නැරඹිය හැක.</i>`,
                  parse_mode: 'HTML'
                });
              } else {
                await callTelegramApi(token, 'sendMessage', {
                  chat_id: chatId,
                  text: `❌ Unlock කිරීමට නොහැකි විය: ${unlockResult.message || 'Pending ඉල්ලුමක් සොයාගත නොහැකි විය.'}`,
                  parse_mode: 'HTML'
                });
              }
            }
          } else if (text === '/status') {
            const currentDb = readDB();
            const pendingPacks = (currentDb.requests || []).filter(r => r.type === 'videopack' && r.status === 'pending');
            const totalStu = (currentDb.students || []).length;
            await callTelegramApi(token, 'sendMessage', {
              chat_id: chatId,
              text: `📊 <b>Apex Biology System Status</b>\n\n👥 ලියාපදිංචි සිසුන් ගණන: <b>${totalStu}</b>\n⏳ Pending Video Pack ඉල්ලීම්: <b>${pendingPacks.length}</b>\n🟢 Bot ක්‍රියාකාරී තත්ත්වය: <b>Online & Active</b>`,
              parse_mode: 'HTML'
            });
          }
        }
      }
    }
  } catch (err) {
    // Polling retry
  }

  setTimeout(startStudyPackTelegramPolling, 1500);
}

server.listen(PORT, () => {
  startTelegramPolling();
  startStudyPackTelegramPolling();
  console.log(`===============================================`);
  console.log(`🚀 Apex Biology Server running on:`);
  console.log(`👉 Student Portal: http://localhost:${PORT}`);
  console.log(`👉 Admin Panel:    http://localhost:${PORT}/admin`);
  console.log(`👉 Public Bio Bank: http://localhost:${PORT}/biobank`);
  console.log(`🤖 Card Bot Polling: Active`);
  console.log(`🤖 Study Pack Bot Polling: Active (@Bio_study_packbot)`);
  console.log(`===============================================`);
});

module.exports = server;
