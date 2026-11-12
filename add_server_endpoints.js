const fs = require('fs');

let serverCode = fs.readFileSync('server.js', 'utf8');

// 1. Daily Study Planner Task Endpoints
const taskEndpointsTarget = `      // 6. DELETE /api/students/:id`;

const taskEndpoints = `      // ==========================================
      // DAILY STUDY PLANNER TASK ENDPOINTS (24h Auto-Expiry)
      // ==========================================
      
      // 5.3 GET /api/students/:id/tasks (Get active tasks within 24h cycle)
      if (pathname.match(/^\\/api\\/students\\/[^\\/]+\\/tasks$/) && req.method === 'GET') {
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
      if (pathname.match(/^\\/api\\/students\\/[^\\/]+\\/tasks$/) && req.method === 'POST') {
        const studentId = pathname.split('/')[3];
        const body = await parseJsonBody(req);
        const { text } = body;

        if (!text || typeof text !== 'string' || !text.trim()) {
          return sendJson(res, 400, { success: false, message: 'Task text is required' });
        }

        const db = readDB();
        db.studyTasks = db.studyTasks || [];

        const newTask = {
          id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          studentId: studentId,
          text: text.trim(),
          completed: false,
          createdAt: Date.now()
        };

        db.studyTasks.unshift(newTask);
        writeDB(db);

        return sendJson(res, 201, { success: true, task: newTask });
      }

      // 5.5 PUT /api/students/:id/tasks/:taskId (Update completion)
      if (pathname.match(/^\\/api\\/students\\/[^\\/]+\\/tasks\\/[^\\/]+$/) && req.method === 'PUT') {
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
      if (pathname.match(/^\\/api\\/students\\/[^\\/]+\\/tasks\\/[^\\/]+$/) && req.method === 'DELETE') {
        const parts = pathname.split('/');
        const studentId = parts[3];
        const taskId = parts[5];

        const db = readDB();
        db.studyTasks = db.studyTasks || [];
        db.studyTasks = db.studyTasks.filter(t => !(t.id === taskId && t.studentId === studentId));
        writeDB(db);

        return sendJson(res, 200, { success: true, message: 'Task deleted' });
      }

      // 6. DELETE /api/students/:id`;

if (serverCode.includes(taskEndpointsTarget) && !serverCode.includes('/api/students/:id/tasks')) {
  serverCode = serverCode.replace(taskEndpointsTarget, taskEndpoints);
  console.log('Added Study Planner Task Endpoints to server.js!');
}

// 2. Enhanced Bio Bank Endpoints
const bioBankEndpointsTarget = `        unit.categories[category].unshift(newItem);
        writeDB(db);
        syncDocToFirestore('bioBank', unit.id, unit);
        return sendJson(res, 201, { success: true, item: newItem, unit });
      }`;

const bioBankEndpoints = `        unit.categories[category].unshift(newItem);
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
        const uniqueName = \`bio_\${Date.now()}_\${Math.random().toString(36).substring(2, 6)}\${safeExt}\`;
        const filePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(filePath, buffer);
        const fileUrl = \`/uploads/biobank/\${uniqueName}\`;

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
      }`;

if (serverCode.includes(bioBankEndpointsTarget) && !serverCode.includes('/api/biobank/folder')) {
  serverCode = serverCode.replace(bioBankEndpointsTarget, bioBankEndpoints);
  console.log('Added enhanced Bio Bank Endpoints to server.js!');
}

fs.writeFileSync('server.js', serverCode, 'utf8');
console.log('server.js updated successfully!');

