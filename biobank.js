// ==========================================================================
// APEX BIO BANK - STANDALONE CONTROLLER
// 10 Unit Folders -> Essay Points, Mind Maps, Short Notes, MCQs
// Fetches live blur state & items from /api/biobank
// ==========================================================================

let activeBioBankUnit = null;
let activeBioBankFilter = 'all';
let serverBioBankState = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchBioBankDataAndRender();
});

let activeBioBankFolder = null;

async function fetchBioBankDataAndRender() {
  try {
    const res = await fetch('/api/biobank');
    const json = await res.json();
    if (json.success && json.bioBank) {
      serverBioBankState = json.bioBank;
      // Merge any new units, folders, or items from server into BIO_BANK_DATA if present
      if (Array.isArray(serverBioBankState.units) && serverBioBankState.units.length > 0) {
        serverBioBankState.units.forEach(srvUnit => {
          const localUnit = BIO_BANK_DATA.find(u => u.id === srvUnit.id);
          if (localUnit) {
            if (srvUnit.categories) localUnit.categories = srvUnit.categories;
            localUnit.folders = srvUnit.folders || [];
            localUnit.items = srvUnit.items || [];
          }
        });
      }
    }
  } catch (err) {
    console.warn('Could not fetch server biobank state, using local fallback:', err);
  }

  renderBioBankStandalone();
}

function renderBioBankStandalone() {
  const container = document.getElementById('biobank-container');
  if (!container) return;

  const isBlurred = serverBioBankState ? serverBioBankState.isBlurred : true;
  let studentEmail = '';
  try {
    const saved = localStorage.getItem('apex_bio_student');
    if (saved) {
      const parsed = JSON.parse(saved);
      studentEmail = (parsed.email || '').trim().toLowerCase();
    }
  } catch (e) {}
  const isSuperUser = (studentEmail === 'dg.edits65@gmail.com');

  if (isBlurred && !isSuperUser) {
    // Coming Soon Blurred View with interactive teasers
    container.innerHTML = `
      <div style="position: relative; padding: 20px 0;">
        <!-- Coming Soon Overlay Banner -->
        <div style="position: absolute; top: 80px; left: 50%; transform: translateX(-50%); z-index: 20; background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 2px solid #10b981; border-radius: 20px; padding: 36px 48px; text-align: center; max-width: 620px; width: 92%; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <div style="width: 72px; height: 72px; background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 2rem; color: #10b981;">
            <i class="fa-solid fa-lock"></i>
          </div>
          <span style="display: inline-block; background: #f59e0b; color: #000; font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
            🚧 Launching Soon (නොබෝ දිනකින් විවෘත වේ)
          </span>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #ffffff; margin-bottom: 10px;">Apex Bio Bank Vault Under Curation</h2>
          <p style="font-size: 0.92rem; color: #94a3b8; line-height: 1.6; margin-bottom: 20px;">
            අපගේ Biology ආචාර්ය මණ්ඩලය විසින් සකස් කරන ලද සම්පූර්ණ ඒකක 10 හි Mind Maps, Essay Marking Points, රූප සටහන් සහ කෙටි සටහන් ඉක්මනින් මෙතැනින් නොමිලේ බාගත කරගත හැක.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="/" class="btn-portal-pill" style="display: inline-flex; align-items: center; gap: 8px; background: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 10px; font-weight: 700; text-decoration: none;">
              <i class="fa-solid fa-graduation-cap"></i> Return to Student Portal
            </a>
            <a href="https://t.me/apexbiology_tutes" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: #0284c7; color: #ffffff; padding: 10px 20px; border-radius: 10px; font-weight: 700; text-decoration: none;">
              <i class="fa-brands fa-telegram"></i> Telegram Tutes Channel
            </a>
          </div>
        </div>

        <!-- Blurred Background Grid -->
        <div style="filter: blur(8px) grayscale(40%); opacity: 0.55; pointer-events: none; user-select: none;">
          <div class="biobank-units-grid">
            ${BIO_BANK_DATA.map(unit => {
              const totalDocs = (unit.folders || []).length + (unit.items || []).length + 
                                unit.categories.essays.length + 
                                unit.categories.mindmaps.length + 
                                unit.categories.shortnotes.length + 
                                unit.categories.mcqs.length;
              return `
                <div class="biobank-folder-card">
                  <div class="biobank-folder-tab">Unit ${unit.num}</div>
                  <div class="biobank-folder-header">
                    <span class="biobank-folder-icon">${unit.icon}</span>
                    <span class="biobank-docs-badge">${totalDocs} Resources</span>
                  </div>
                  <h3 class="biobank-folder-title">${unit.name}</h3>
                  <span class="biobank-folder-eng">${unit.eng}</span>
                  <div class="biobank-folder-badges">
                    <span><i class="fa-solid fa-folder"></i> Folders</span>
                    <span><i class="fa-solid fa-images"></i> Diagrams</span>
                    <span><i class="fa-solid fa-file-pdf"></i> Short Notes</span>
                  </div>
                  <button class="btn-open-biobank-folder">
                    <span>Locked</span> <i class="fa-solid fa-lock"></i>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    return;
  }

  // If Not Blurred - Full Access
  if (!activeBioBankUnit) {
    // Show 10 Unit Botanical Folders
    container.innerHTML = `
      <div class="biobank-units-grid">
        ${BIO_BANK_DATA.map(unit => {
          const folderCount = (unit.folders || []).length;
          let totalDocs = (unit.items || []).length + 
                          unit.categories.essays.length + 
                          unit.categories.mindmaps.length + 
                          unit.categories.shortnotes.length + 
                          unit.categories.mcqs.length;
          (unit.folders || []).forEach(f => { totalDocs += (f.items || []).length; });

          return `
            <div class="biobank-folder-card" onclick="openBioBankUnitFolder('${unit.id}')">
              <div class="biobank-folder-tab">Unit ${unit.num}</div>
              <div class="biobank-folder-header">
                <span class="biobank-folder-icon">${unit.icon}</span>
                <span class="biobank-docs-badge">${totalDocs} Resources</span>
              </div>
              <h3 class="biobank-folder-title">${unit.name}</h3>
              <span class="biobank-folder-eng">${unit.eng}</span>
              <div class="biobank-folder-badges">
                <span><i class="fa-solid fa-folder"></i> ${folderCount} Folders</span>
                <span><i class="fa-solid fa-images"></i> Diagrams</span>
                <span><i class="fa-solid fa-file-pdf"></i> Short Notes</span>
              </div>
              <button class="btn-open-biobank-folder" onclick="event.stopPropagation(); openBioBankUnitFolder('${unit.id}')">
                <span>Explore Vault</span> <i class="fa-solid fa-folder-open"></i>
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    // Show resources inside selected unit folder
    const unit = BIO_BANK_DATA.find(u => u.id === activeBioBankUnit) || BIO_BANK_DATA[0];
    const allFolders = unit.folders || [];
    const currentFolder = activeBioBankFolder ? allFolders.find(f => f.id === activeBioBankFolder) : null;

    // Subfolders at current level
    const subfolders = allFolders.filter(f => {
      if (activeBioBankFolder) return f.parentFolderId === activeBioBankFolder;
      return !f.parentFolderId;
    });

    container.innerHTML = `
      <div class="biobank-unit-detail-view">
        <div class="biobank-detail-header" style="flex-wrap: wrap; gap: 14px;">
          <button class="btn-biobank-back" onclick="activeBioBankFolder ? closeBioBankSubfolder() : closeBioBankUnitFolder()">
            <i class="fa-solid fa-arrow-left"></i> ${activeBioBankFolder ? 'Back to Unit Root' : 'All Units Folders'}
          </button>
          <div class="biobank-unit-info">
            <span class="detail-unit-badge">Unit ${unit.num}</span>
            <h2 class="detail-unit-title">${unit.icon} ${unit.name}</h2>
            <span class="detail-unit-eng">${currentFolder ? `📁 ${currentFolder.name}` : unit.eng}</span>
          </div>
        </div>

        ${subfolders.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <h4 style="font-size: 0.95rem; font-weight: 800; color: #047857; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-folder-tree"></i> Unit Folders (${subfolders.length})
            </h4>
            <div class="biobank-subfolders-grid">
              ${subfolders.map(f => `
                <div class="biobank-subfolder-card" onclick="openBioBankSubfolder('${f.id}')">
                  <div class="subfolder-left">
                    <i class="fa-solid fa-folder" style="color: #f59e0b; font-size: 1.4rem;"></i>
                    <div>
                      <div class="subfolder-name" title="${escape(f.name)}">${f.name}</div>
                      <div class="subfolder-items-count">${(f.items || []).length} materials</div>
                    </div>
                  </div>
                  <i class="fa-solid fa-chevron-right" style="color: #94a3b8; font-size: 0.85rem;"></i>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="biobank-filter-bar">
          <span class="filter-bar-label"><i class="fa-solid fa-filter"></i> Category:</span>
          <div class="bio-chips-group">
            <button class="bio-chip ${activeBioBankFilter === 'all' ? 'active' : ''}" onclick="filterBioBankCategory('all')">
              <i class="fa-solid fa-layer-group"></i> All Materials
            </button>
            <button class="bio-chip ${activeBioBankFilter === 'essays' ? 'active' : ''}" onclick="filterBioBankCategory('essays')">
              <i class="fa-solid fa-pen-nib"></i> Essay Points (${unit.categories.essays.length})
            </button>
            <button class="bio-chip ${activeBioBankFilter === 'mindmaps' ? 'active' : ''}" onclick="filterBioBankCategory('mindmaps')">
              <i class="fa-solid fa-brain"></i> Mind Maps (${unit.categories.mindmaps.length})
            </button>
            <button class="bio-chip ${activeBioBankFilter === 'shortnotes' ? 'active' : ''}" onclick="filterBioBankCategory('shortnotes')">
              <i class="fa-solid fa-file-pdf"></i> Short Notes (${unit.categories.shortnotes.length})
            </button>
            <button class="bio-chip ${activeBioBankFilter === 'mcqs' ? 'active' : ''}" onclick="filterBioBankCategory('mcqs')">
              <i class="fa-solid fa-circle-check"></i> Target MCQs (${unit.categories.mcqs.length})
            </button>
          </div>
        </div>

        <div class="biobank-resources-grid">
          ${renderResourceCards(unit, activeBioBankFilter)}
        </div>
      </div>
    `;
  }
}

function openBioBankSubfolder(folderId) {
  activeBioBankFolder = folderId;
  renderBioBankStandalone();
  window.scrollTo({ top: 380, behavior: 'smooth' });
}

function closeBioBankSubfolder() {
  activeBioBankFolder = null;
  renderBioBankStandalone();
}

function renderResourceCards(unit, filter) {
  let cards = [];

  if (filter === 'all' || filter === 'essays') {
    unit.categories.essays.forEach(item => {
      cards.push(makeResourceCard(item, 'Essay Points', 'cat-essay', 'fa-pen-nib'));
    });
  }
  if (filter === 'all' || filter === 'mindmaps') {
    unit.categories.mindmaps.forEach(item => {
      cards.push(makeResourceCard(item, 'Mind Map', 'cat-mindmap', 'fa-brain'));
    });
  }
  if (filter === 'all' || filter === 'shortnotes') {
    unit.categories.shortnotes.forEach(item => {
      cards.push(makeResourceCard(item, 'Short Note', 'cat-shortnote', 'fa-file-lines'));
    });
  }
  if (filter === 'all' || filter === 'mcqs') {
    unit.categories.mcqs.forEach(item => {
      cards.push(makeResourceCard(item, 'Target MCQs', 'cat-mcq', 'fa-circle-check'));
    });
  }

  if (cards.length === 0) {
    return `<div style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px;">No materials currently uploaded under this category. Check back soon!</div>`;
  }

  return cards.join('');
}

function makeResourceCard(item, catLabel, catClass, catIcon) {
  const downloadUrl = item.pdfUrl || item.downloadUrl || 'https://t.me/apexbiology_tutes';
  const hasImages = Array.isArray(item.images) && item.images.length > 0;
  const imageParam = hasImages ? JSON.stringify(item.images).replace(/"/g, '&quot;') : '[]';

  return `
    <div class="resource-document-card">
      <div class="resource-card-top">
        <span class="resource-cat-badge ${catClass}"><i class="fa-solid ${catIcon}"></i> ${catLabel}</span>
        <span class="resource-format-pill">${item.format || (hasImages ? 'Image Collection' : 'PDF Document')}</span>
      </div>
      <h4 class="resource-doc-title">${item.title}</h4>
      <div class="resource-doc-meta">
        <span><i class="fa-regular fa-file"></i> ${item.pages || 'High-Res'}</span>
        <span><i class="fa-solid fa-certificate"></i> ${item.date || 'NIE Standard'}</span>
      </div>
      <div class="resource-card-actions">
        ${downloadUrl ? `
          <a href="${downloadUrl}" target="_blank" class="btn-download-resource" style="text-decoration: none; text-align: center;">
            <i class="fa-solid fa-arrow-down-to-bracket"></i> Download PDF
          </a>
        ` : ''}
        ${hasImages ? `
          <button class="btn-preview-resource" onclick="openBioBankImageGallery('${escape(item.title)}', ${imageParam})">
            <i class="fa-solid fa-images"></i> View Gallery (${item.images.length})
          </button>
        ` : `
          <button class="btn-preview-resource" onclick="previewBioBankDoc('${escape(item.title)}')">
            <i class="fa-solid fa-eye"></i> Preview
          </button>
        `}
      </div>
    </div>
  `;
}

function openBioBankUnitFolder(unitId) {
  activeBioBankUnit = unitId;
  activeBioBankFilter = 'all';
  renderBioBankStandalone();
  window.scrollTo({ top: 380, behavior: 'smooth' });
}

function closeBioBankUnitFolder() {
  activeBioBankUnit = null;
  activeBioBankFilter = 'all';
  renderBioBankStandalone();
}

function filterBioBankCategory(cat) {
  activeBioBankFilter = cat;
  renderBioBankStandalone();
}

function downloadBioBankDoc(title) {
  const t = unescape(title);
  showToast(`Downloading: ${t} (Free High-Res PDF)`);
}

function previewBioBankDoc(title) {
  const t = unescape(title);
  showToast(`Opening Preview for: ${t}`);
}

function openBioBankImageGallery(title, images) {
  const t = unescape(title);
  if (!images || images.length === 0) {
    showToast('No images in collection');
    return;
  }
  const modal = document.getElementById('biobank-gallery-modal');
  const titleEl = document.getElementById('biobank-gallery-title');
  const imgEl = document.getElementById('biobank-gallery-hero-img');
  const thumbsEl = document.getElementById('biobank-gallery-thumbs');

  if (titleEl) titleEl.textContent = t;
  if (imgEl) imgEl.src = images[0];
  if (thumbsEl) {
    thumbsEl.innerHTML = images.map((imgUrl, i) => `
      <img src="${imgUrl}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover; cursor: pointer; border: 2px solid ${i === 0 ? '#10b981' : '#475569'};" onclick="document.getElementById('biobank-gallery-hero-img').src='${imgUrl}';">
    `).join('');
  }
  if (modal) modal.classList.add('active');
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-vault"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}
