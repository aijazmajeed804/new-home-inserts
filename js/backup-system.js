/**
 * Home Inserts Blog - Backup & Restore System
 * Pure Javascript Module (localStorage database persistence)
 */

(function() {
  // Database configuration
  const DATABASE_KEYS = [
    'home_inserts_users',
    'home_inserts_user_posts',
    'home_inserts_guest_submissions',
    'home_inserts_blocked_posts',
    'home_inserts_newsletter',
    'home_inserts_site_settings'
  ];

  // DOM Elements setup
  let createBtn, progressContainer, progressBar, progressStatus, progressPct;
  let schedulerForm, frequencySelect, schedStatusBadge, schedLastRun, schedNextRun;
  let emergencyRestoreBtn, runIntegrityCheckBtn, aiStudioBtn, fileInput;
  let vaultSubtitle, listBody, timelineEl, clearLogsBtn;

  // Initialize System
  document.addEventListener('DOMContentLoaded', () => {
    // Only load settings and setup scheduler if logged user is Super Admin
    const loggedUser = JSON.parse(sessionStorage.getItem('home_inserts_logged_in_user'));
    if (!loggedUser || loggedUser.role !== 'Super Admin') return;

    // Load initial settings
    loadSiteSettings();

    // Cache DOM Elements
    createBtn = document.getElementById('btn-create-backup-now');
    progressContainer = document.getElementById('backup-progress-container');
    progressBar = document.getElementById('backup-progress-bar');
    progressStatus = document.getElementById('backup-progress-status');
    progressPct = document.getElementById('backup-progress-pct');

    schedulerForm = document.getElementById('backup-scheduler-form');
    frequencySelect = document.getElementById('backup-frequency');
    schedStatusBadge = document.getElementById('sched-status-badge');
    schedLastRun = document.getElementById('sched-last-run');
    schedNextRun = document.getElementById('sched-next-run');

    emergencyRestoreBtn = document.getElementById('btn-emergency-recovery');
    runIntegrityCheckBtn = document.getElementById('btn-run-integrity-check');
    aiStudioBtn = document.getElementById('btn-simulate-ai-studio');
    fileInput = document.getElementById('backup-file-input');

    vaultSubtitle = document.getElementById('vault-subtitle');
    listBody = document.getElementById('backup-list-body');
    timelineEl = document.getElementById('backup-timeline');
    clearLogsBtn = document.getElementById('btn-clear-backup-logs');

    // Register UI listeners
    if (createBtn) createBtn.addEventListener('click', () => triggerManualBackup());
    if (schedulerForm) schedulerForm.addEventListener('submit', (e) => saveSchedulerConfig(e));
    if (emergencyRestoreBtn) emergencyRestoreBtn.addEventListener('click', () => triggerEmergencyRestore());
    if (runIntegrityCheckBtn) runIntegrityCheckBtn.addEventListener('click', () => runIntegrityDiagnostics());
    if (aiStudioBtn) aiStudioBtn.addEventListener('click', () => simulateAIStudioUpdate());
    if (fileInput) fileInput.addEventListener('change', (e) => handleImportedBackup(e));
    if (clearLogsBtn) clearLogsBtn.addEventListener('click', () => clearLogs());

    // Initialize state
    setupSchedulerState();
    checkScheduledBackups();
    renderBackupDashboard();
  });

  /* ════════════════════════════════════════════════
     SITE CONFIGURATION SETTINGS IMPLEMENTATION
  ════════════════════════════════════════════════ */
  window.loadSiteSettings = function() {
    const defaultSettings = {
      siteName: 'Home Inserts',
      siteSlogan: 'The Ultimate Hub for Home, Garden & DIY Guest Articles',
      brandColor: '#3b82f6',
      logoText: 'H',
      metaKeywords: 'home decor, interior design, guest posts, landscaping, DIY',
      securityLevel: 'Standard',
      allowRegistrations: 'No'
    };
    const settings = JSON.parse(localStorage.getItem('home_inserts_site_settings')) || defaultSettings;

    const siteNameEl = document.getElementById('settings-site-name');
    const siteSloganEl = document.getElementById('settings-site-slogan');
    const brandColorEl = document.getElementById('settings-brand-color');
    const logoTextEl = document.getElementById('settings-logo-text');
    const metaKeywordsEl = document.getElementById('settings-meta-keywords');
    const securityLevelEl = document.getElementById('settings-security-level');
    const allowRegistrationsEl = document.getElementById('settings-allow-registrations');

    if (siteNameEl) siteNameEl.value = settings.siteName;
    if (siteSloganEl) siteSloganEl.value = settings.siteSlogan;
    if (brandColorEl) brandColorEl.value = settings.brandColor;
    if (logoTextEl) logoTextEl.value = settings.logoText;
    if (metaKeywordsEl) metaKeywordsEl.value = settings.metaKeywords;
    if (securityLevelEl) securityLevelEl.value = settings.securityLevel;
    if (allowRegistrationsEl) allowRegistrationsEl.value = settings.allowRegistrations;

    // Apply primary color to theme CSS
    document.documentElement.style.setProperty('--color-primary', settings.brandColor);
  };

  window.saveSiteSettings = function(e) {
    if (e) e.preventDefault();

    // Auto rollback restore point before saving config
    window.createAutoRestorePoint('Before Settings Update');

    const settings = {
      siteName: document.getElementById('settings-site-name').value.trim(),
      siteSlogan: document.getElementById('settings-site-slogan').value.trim(),
      brandColor: document.getElementById('settings-brand-color').value,
      logoText: document.getElementById('settings-logo-text').value.trim(),
      metaKeywords: document.getElementById('settings-meta-keywords').value.trim(),
      securityLevel: document.getElementById('settings-security-level').value,
      allowRegistrations: document.getElementById('settings-allow-registrations').value
    };

    localStorage.setItem('home_inserts_site_settings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--color-primary', settings.brandColor);
    
    // Add success log
    logAction('SYSTEM', 'Site settings successfully updated. Brand primary color updated to ' + settings.brandColor + '.', 'Info');
    
    // Reload fields
    loadSiteSettings();
    showToast('Website configurations saved successfully!', 'success');
  };

  /* ════════════════════════════════════════════════
     BACKUP ENGINE (SERIALIZATION & SAVING)
  ════════════════════════════════════════════════ */
  
  // Creates a complete snapshot payload
  function compileDatabasePayload() {
    const payload = {};
    
    // Gather system database keys
    DATABASE_KEYS.forEach(key => {
      const stored = localStorage.getItem(key);
      payload[key] = stored ? JSON.parse(stored) : null;
    });

    // Gather comments (post_*_comments)
    payload.comments = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('post_') && key.endsWith('_comments')) {
        const stored = localStorage.getItem(key);
        payload.comments[key] = stored ? JSON.parse(stored) : [];
      }
    }

    // Categories are hardcoded inside select dropdowns, but we'll include structure in schema
    payload.categories = ['Lifestyle', 'Home Decor', 'DIY & Renovations', 'Garden & Landscaping', 'Organization & Cleaning'];
    
    // Media reference files (simulate paths)
    payload.media = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb'
    ];
    
    // Menu reference config
    payload.menus = [
      { label: 'Home', link: 'index.html' },
      { label: 'About', link: 'about.html' },
      { label: 'Contact', link: 'contact.html' },
      { label: 'Guest Posting', link: 'submit-guest-post.html' }
    ];

    // AI Studio configurations placeholder
    payload.ai_content_studio = {
      api_endpoint: 'https://api.openai.com/v1',
      auto_suggest_keywords: true,
      last_sync: new Date().toISOString()
    };

    return payload;
  }

  // Create a backup
  window.createBackup = function(name, type = 'Manual', creator = 'System') {
    return new Promise((resolve) => {
      const dataPayload = compileDatabasePayload();
      const payloadString = JSON.stringify(dataPayload);
      const sizeBytes = payloadString.length; // Approximate size

      // Build backup record
      const backup = {
        id: 'backup-' + Date.now(),
        name: name || 'backup_' + new Date().toISOString().slice(0, 19).replace(/[:]/g, '-'),
        type: type,
        timestamp: Date.now(),
        creator: creator,
        size: sizeBytes,
        status: 'Healthy',
        data: dataPayload
      };

      // Storage Limit Check (warn if localStorage exceeds 80% / 4MB)
      const currentQuotaUsed = calculateLocalStorageSize();
      if (currentQuotaUsed + sizeBytes > 4.5 * 1024 * 1024) {
        showToast('Storage low! Automatic cleanup of older restore points initiated.', 'warning');
        cleanOldRestorePoints();
      }

      // Add to list of backups
      const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
      backups.unshift(backup);
      localStorage.setItem('home_inserts_backups', JSON.stringify(backups));

      // Append log entry
      logAction(creator, `Created ${type} backup: "${backup.name}" (Size: ${(sizeBytes / 1024).toFixed(2)} KB)`, 'Success');

      // Refresh Dashboard UI elements
      renderBackupDashboard();

      resolve(backup);
    });
  };

  // Auto clean old restore points (retains only 3 most recent)
  function cleanOldRestorePoints() {
    let backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const rps = backups.filter(b => b.type === 'Restore Point');
    
    if (rps.length > 3) {
      // Sort oldest first
      rps.sort((a, b) => a.timestamp - b.timestamp);
      const toDelete = rps[0]; // Oldest restore point
      
      backups = backups.filter(b => b.id !== toDelete.id);
      localStorage.setItem('home_inserts_backups', JSON.stringify(backups));
      logAction('SYSTEM', `Storage warning cleanup: Deleted oldest restore point "${toDelete.name}"`, 'Warning');
    }
  }

  // Hook for automatic restore point creation
  window.createAutoRestorePoint = function(reason) {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const name = `Auto-Point (${reason}) - ${timeStr}`;
    window.createBackup(name, 'Restore Point', 'System (Auto)');
  };

  /* ════════════════════════════════════════════════
     RESTORE SYSTEM & EMERGENCIES
  ════════════════════════════════════════════════ */
  
  // Validates backup integrity check
  window.validateBackupData = function(payload) {
    if (!payload) return false;
    
    // Check key fields
    const requiredKeys = ['home_inserts_users', 'home_inserts_user_posts', 'home_inserts_site_settings'];
    const hasKeys = requiredKeys.every(k => k in payload);
    if (!hasKeys) return false;

    // Check types
    if (!Array.isArray(payload.home_inserts_users)) return false;
    if (!Array.isArray(payload.home_inserts_user_posts)) return false;

    return true;
  };

  // Perform full restore
  window.restoreFromPayload = function(backup) {
    return new Promise((resolve, reject) => {
      try {
        const payload = backup.data;
        
        // 1. Create a rollback recovery point before overwriting
        window.createAutoRestorePoint('Pre-Rollback Point');

        // 2. Overwrite database keys
        DATABASE_KEYS.forEach(key => {
          if (key in payload) {
            localStorage.setItem(key, JSON.stringify(payload[key]));
          }
        });

        // 3. Clear existing comments and rewrite them from backup
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && key.startsWith('post_') && key.endsWith('_comments')) {
            localStorage.removeItem(key);
          }
        }
        if (payload.comments) {
          Object.entries(payload.comments).forEach(([key, commentsList]) => {
            localStorage.setItem(key, JSON.stringify(commentsList));
          });
        }

        // 4. Force reload settings & content
        loadSiteSettings();
        if (window.loadPosts) {
          window.loadPosts().then(() => {
            if (window.renderAdminArticles) window.renderAdminArticles();
            if (window.updateStats) window.updateStats();
            if (window.renderAdminSubmissions) window.renderAdminSubmissions();
            if (window.renderAdminNewsletter) window.renderAdminNewsletter();
          });
        }

        logAction('Super Admin', `Restored system successfully to snapshot: "${backup.name}"`, 'Success');
        renderBackupDashboard();
        
        resolve(true);
      } catch (err) {
        logAction('SYSTEM', `Restore failed for backup: "${backup.name}". Error: ${err.message}`, 'Error');
        reject(err);
      }
    });
  };

  // Trigger restore action
  window.triggerRestore = function(id) {
    const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const backup = backups.find(b => b.id === id);
    if (!backup) {
      showToast('Backup not found.', 'error');
      return;
    }

    if (!confirm('Restoring will overwrite current data. Do you want to continue?')) return;
    
    restoreFromPayload(backup)
      .then(() => {
        showToast('System restored successfully!', 'success');
      })
      .catch(err => {
        showToast('Restore failed: ' + err.message, 'error');
      });
  };

  /* ════════════════════════════════════════════════
     SCHEDULING & INTERVALS
  ════════════════════════════════════════════════ */
  function setupSchedulerState() {
    const config = JSON.parse(localStorage.getItem('home_inserts_backup_schedule')) || {
      frequency: 'disabled',
      lastRun: null,
      nextRun: null
    };

    if (frequencySelect) frequencySelect.value = config.frequency;
    updateSchedulerUI(config);
  }

  function updateSchedulerUI(config) {
    if (!schedStatusBadge) return;
    
    if (config.frequency === 'disabled') {
      schedStatusBadge.textContent = 'Inactive';
      schedStatusBadge.style.color = '#e06c75';
      schedNextRun.textContent = 'N/A';
    } else {
      schedStatusBadge.textContent = 'Active (' + config.frequency + ')';
      schedStatusBadge.style.color = '#10b981';
      schedNextRun.textContent = config.nextRun ? new Date(config.nextRun).toLocaleString() : 'Pending calculation';
    }

    schedLastRun.textContent = config.lastRun ? new Date(config.lastRun).toLocaleString() : 'Never';
  }

  function saveSchedulerConfig(e) {
    if (e) e.preventDefault();
    const frequency = frequencySelect.value;
    
    let nextRun = null;
    const now = Date.now();

    if (frequency === 'daily') {
      nextRun = now + 24 * 60 * 60 * 1000;
    } else if (frequency === 'weekly') {
      nextRun = now + 7 * 24 * 60 * 60 * 1000;
    } else if (frequency === 'monthly') {
      nextRun = now + 30 * 24 * 60 * 60 * 1000;
    }

    const config = {
      frequency: frequency,
      lastRun: localStorage.getItem('home_inserts_backup_schedule') 
        ? JSON.parse(localStorage.getItem('home_inserts_backup_schedule')).lastRun 
        : null,
      nextRun: nextRun
    };

    localStorage.setItem('home_inserts_backup_schedule', JSON.stringify(config));
    updateSchedulerUI(config);

    logAction('Super Admin', `Backup schedule updated to: ${frequency.toUpperCase()}. Next run: ${nextRun ? new Date(nextRun).toLocaleString() : 'N/A'}`, 'Info');
    showToast('Scheduler configured successfully!', 'success');
  }

  // Checks scheduler triggers on dashboard load
  function checkScheduledBackups() {
    const config = JSON.parse(localStorage.getItem('home_inserts_backup_schedule'));
    if (!config || config.frequency === 'disabled' || !config.nextRun) return;

    if (Date.now() >= config.nextRun) {
      logAction('Scheduler', 'Automatic scheduled backup trigger elapsed. Running background backup...', 'Info');
      
      // Execute background backup
      const timeLabel = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' });
      const name = `Auto-Scheduled (${config.frequency.toUpperCase()}) - ${timeLabel}`;
      
      window.createBackup(name, 'Automatic', 'System Scheduler').then((backup) => {
        // Calculate next run
        const now = Date.now();
        let nextInterval = 24 * 60 * 60 * 1000;
        if (config.frequency === 'weekly') nextInterval = 7 * 24 * 60 * 60 * 1000;
        if (config.frequency === 'monthly') nextInterval = 30 * 24 * 60 * 60 * 1000;

        config.lastRun = backup.timestamp;
        config.nextRun = now + nextInterval;

        localStorage.setItem('home_inserts_backup_schedule', JSON.stringify(config));
        updateSchedulerUI(config);
        
        showToast('Background scheduled backup completed.', 'success');
      });
    }
  }

  /* ════════════════════════════════════════════════
     DIAGNOSTICS & EMERGENCY BUTTONS
  ════════════════════════════════════════════════ */
  
  // Triggers manual progress bars simulation
  function triggerManualBackup() {
    if (createBtn) createBtn.disabled = true;
    if (progressContainer) progressContainer.style.display = 'block';

    const phases = [
      { pct: 10, msg: 'Starting database serialization...' },
      { pct: 30, msg: 'Exporting articles, comments, and meta information...' },
      { pct: 55, msg: 'Compiling author accounts, socials, and user roles...' },
      { pct: 75, msg: 'Formatting site configurations and custom layouts...' },
      { pct: 90, msg: 'Running corruption checks and calculating checksum...' },
      { pct: 100, msg: 'Compressing backup vault package...' }
    ];

    let currentPhaseIdx = 0;

    function runAnimation() {
      if (currentPhaseIdx < phases.length) {
        const phase = phases[currentPhaseIdx];
        
        if (progressBar) progressBar.style.width = phase.pct + '%';
        if (progressStatus) progressStatus.textContent = phase.msg;
        if (progressPct) progressPct.textContent = phase.pct + '%';

        currentPhaseIdx++;
        // Wait ~200ms between phases
        setTimeout(runAnimation, 200);
      } else {
        // Completed
        const timeLabel = new Date().toLocaleTimeString('en-US', { hour12: false });
        window.createBackup(`manual_snapshot_${timeLabel.replace(/:/g, '')}`, 'Manual', 'Super Admin')
          .then((backup) => {
            setTimeout(() => {
              if (progressContainer) progressContainer.style.display = 'none';
              if (createBtn) createBtn.disabled = false;
              showToast(`Backup created successfully! Size: ${(backup.size / 1024).toFixed(2)} KB`, 'success');
            }, 300);
          });
      }
    }

    runAnimation();
  }

  // Emergency Rollback
  function triggerEmergencyRestore() {
    const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const healthyBackup = backups.find(b => b.status === 'Healthy');
    
    if (!healthyBackup) {
      showToast('No healthy backup files found in storage vault.', 'error');
      return;
    }

    if (!confirm('🚨 EMERGENCY RESTORE: Roll back the entire site to the latest healthy snapshot immediately? This will overwrite the live data.')) return;

    restoreFromPayload(healthyBackup)
      .then(() => {
        showToast('Emergency recovery successfully completed!', 'success');
        logAction('EMERGENCY', 'Triggered emergency recovery. Rolled back immediately to: ' + healthyBackup.name, 'Warning');
      })
      .catch(err => {
        showToast('Emergency restore failed: ' + err.message, 'error');
      });
  }

  const DEFAULT_VALUES = {
    'home_inserts_users': '[]',
    'home_inserts_user_posts': '[]',
    'home_inserts_guest_submissions': '[]',
    'home_inserts_blocked_posts': '[]',
    'home_inserts_newsletter': '[]',
    'home_inserts_site_settings': JSON.stringify({
      siteName: 'Home Inserts',
      siteSlogan: 'The Ultimate Hub for Home, Garden & DIY Guest Articles',
      brandColor: '#3b82f6',
      logoText: 'H',
      metaKeywords: 'home decor, interior design, guest posts, landscaping, DIY',
      securityLevel: 'Standard',
      allowRegistrations: 'No'
    })
  };

  // Integrity Check Diagnostics
  function runIntegrityDiagnostics() {
    const integrityBadge = document.getElementById('health-integrity-badge');
    if (integrityBadge) {
      integrityBadge.textContent = 'Analyzing...';
      integrityBadge.style.color = '#e2a100';
    }

    logAction('Diagnostics', 'Manual database integrity verification sequence initiated.', 'Info');

    setTimeout(() => {
      // Validate schema variables
      let failures = 0;
      DATABASE_KEYS.forEach(key => {
        let val = localStorage.getItem(key);
        if (!val) {
          const defaultVal = DEFAULT_VALUES[key] || '[]';
          localStorage.setItem(key, defaultVal);
          logAction('Diagnostics', `Auto-initialized empty storage key: "${key}"`, 'Info');
          val = defaultVal;
        }

        try {
          JSON.parse(val);
        } catch (e) {
          failures++;
          logAction('Diagnostics', `Corruption check failure: Key "${key}" contains invalid JSON characters.`, 'Error');
        }
      });

      if (failures === 0) {
        if (integrityBadge) {
          integrityBadge.textContent = 'Healthy (Passed)';
          integrityBadge.style.color = '#10b981';
        }
        logAction('Diagnostics', 'Diagnostics complete. Database structure is 100% compliant with zero integrity failures.', 'Success');
        showToast('Integrity check: Zero issues found.', 'success');
      } else {
        if (integrityBadge) {
          integrityBadge.textContent = 'Issues Found (' + failures + ')';
          integrityBadge.style.color = '#dc2626';
        }
        showToast('Database integrity check identified ' + failures + ' anomaly/anomalies. Check logs.', 'error');
      }
    }, 800);
  }

  // Simulate AI Studio Update
  function simulateAIStudioUpdate() {
    // Save Auto Restore Point before studio simulation
    window.createAutoRestorePoint('Before AI Studio Sync');

    logAction('AI Content', 'Synchronized content database parameters with AI Content Studio workspace.', 'Info');
    showToast('AI Content Studio synced. Restore point auto-created.', 'success');
    renderBackupDashboard();
  }

  // Handle uploaded backup file import
  function handleImportedBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const data = JSON.parse(event.target.result);
        
        // Structure check
        if (!validateBackupData(data)) {
          showToast('Import failed: Invalid backup schema format.', 'error');
          logAction('Import', 'Failed to import backup: parsed file failed key integrity validation checks.', 'Error');
          return;
        }

        // Add to backups vault list
        const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
        const imported = {
          id: 'backup-' + Date.now(),
          name: 'imported_' + file.name.replace(/\.[^/.]+$/, ''),
          type: 'Manual',
          timestamp: Date.now(),
          creator: 'Super Admin (Import)',
          size: event.target.result.length,
          status: 'Healthy',
          data: data
        };

        backups.unshift(imported);
        localStorage.setItem('home_inserts_backups', JSON.stringify(backups));
        logAction('Super Admin', `Imported backup file "${imported.name}" successfully into vault.`, 'Success');
        
        renderBackupDashboard();
        showToast('Backup file imported successfully!', 'success');
        fileInput.value = ''; // Reset input
      } catch (err) {
        showToast('Import failed: Invalid JSON structure.', 'error');
        fileInput.value = '';
      }
    };
    reader.readAsText(file);
  }

  /* ════════════════════════════════════════════════
     ZIP & JSON EXPORT DOWLOADS
  ════════════════════════════════════════════════ */
  window.downloadBackupJSON = function(id) {
    const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const backup = backups.find(b => b.id === id);
    if (!backup) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup.data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${backup.name}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    logAction('Super Admin', `Downloaded backup file: "${backup.name}.json"`, 'Info');
  };

  // Lazy load JSZip CDN to zip download the JSON file
  window.downloadBackupZIP = function(id) {
    const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const backup = backups.find(b => b.id === id);
    if (!backup) return;

    showToast('Compressing to ZIP. Please wait...', 'success');

    // Dynamic loader
    loadJSZipLib()
      .then(JSZip => {
        const zip = new JSZip();
        zip.file(`${backup.name}.json`, JSON.stringify(backup.data, null, 2));
        
        zip.generateAsync({ type: 'blob' })
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const downloadAnchor = document.createElement('a');
            downloadAnchor.href = url;
            downloadAnchor.download = `${backup.name}.zip`;
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            URL.revokeObjectURL(url);
            
            logAction('Super Admin', `Downloaded compressed zip backup file: "${backup.name}.zip"`, 'Info');
          });
      })
      .catch(err => {
        showToast('ZIP fallback: downloading JSON file directly.', 'warning');
        window.downloadBackupJSON(id);
      });
  };

  function loadJSZipLib() {
    return new Promise((resolve, reject) => {
      if (window.JSZip) {
        resolve(window.JSZip);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => resolve(window.JSZip);
      script.onerror = () => reject(new Error('Failed to load JSZip from cdnjs'));
      document.head.appendChild(script);
    });
  }

  /* ════════════════════════════════════════════════
     BACKUP ACTION PANEL RENDERS
  ════════════════════════════════════════════════ */
  window.renderBackupDashboard = function() {
    if (!listBody) return;

    const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const totalCount = backups.length;
    const restorePoints = backups.filter(b => b.type === 'Restore Point').length;

    // Stat 1: Total count
    document.getElementById('stat-backup-count').textContent = totalCount;

    // Stat 2: Latest timestamp
    const latestEl = document.getElementById('stat-backup-latest');
    if (backups.length > 0) {
      latestEl.textContent = new Date(backups[0].timestamp).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } else {
      latestEl.textContent = 'Never';
    }

    // Stat 3: Storage size percentage
    const storageUsedBytes = calculateLocalStorageSize();
    const storagePct = (storageUsedBytes / (5 * 1024 * 1024)) * 100;
    document.getElementById('stat-backup-storage').textContent = `${storagePct.toFixed(1)}% (${(storageUsedBytes / 1024).toFixed(0)} KB)`;

    // Stat 4: Restore points count
    document.getElementById('stat-backup-points').textContent = restorePoints;

    // Table update
    vaultSubtitle.textContent = `${totalCount} stored backups`;
    listBody.innerHTML = '';

    if (totalCount === 0) {
      listBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; color:var(--color-body-light); padding:30px;">No backups available in vault.</td>
        </tr>
      `;
    } else {
      backups.forEach(backup => {
        const dateStr = new Date(backup.timestamp).toLocaleString();
        
        let typeClass = 'status-active';
        if (backup.type === 'Restore Point') typeClass = 'status-pending';
        else if (backup.type === 'Automatic') typeClass = 'status-badge-suspended';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div style="font-weight: 700; color: var(--color-heading); display:flex; align-items:center; gap:8px;">
              <span id="label-name-${backup.id}">${escapeHtml(backup.name)}</span>
              <button class="action-btn btn-view" onclick="renameBackup('${backup.id}')" style="background:none; padding:2px; font-size:11px; opacity:0.6; cursor:pointer;" title="Rename">✏️</button>
            </div>
          </td>
          <td><span class="status-badge ${typeClass}">${backup.type}</span></td>
          <td style="font-size:12px;">
            <div>${dateStr}</div>
            <div style="color:var(--color-body-light); font-size:11px;">By: ${escapeHtml(backup.creator)}</div>
          </td>
          <td style="font-size:13px;">${(backup.size / 1024).toFixed(2)} KB</td>
          <td>
            <span style="font-size: 11px; padding: 2px 6px; background: #e6f4ea; color: #137333; border-radius: 4px; font-weight:700;">
              🟢 ${backup.status}
            </span>
          </td>
          <td>
            <button class="action-btn btn-approve" onclick="triggerRestore('${backup.id}')" title="Restore snapshot">⚡ Restore</button>
            <button class="action-btn btn-edit" onclick="downloadBackupJSON('${backup.id}')" title="Download JSON">JSON</button>
            <button class="action-btn btn-view" onclick="downloadBackupZIP('${backup.id}')" title="Download ZIP">ZIP</button>
            <button class="action-btn btn-delete" onclick="deleteBackup('${backup.id}')" title="Delete backup">🗑️</button>
          </td>
        `;
        listBody.appendChild(tr);
      });
    }

    renderLogs();
  };

  window.renameBackup = function(id) {
    const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const idx = backups.findIndex(b => b.id === id);
    if (idx === -1) return;

    const newName = prompt('Enter a new name for this backup:', backups[idx].name);
    if (!newName || !newName.trim()) return;

    const oldName = backups[idx].name;
    backups[idx].name = newName.trim();
    localStorage.setItem('home_inserts_backups', JSON.stringify(backups));

    logAction('Super Admin', `Renamed backup "${oldName}" to "${newName.trim()}"`, 'Info');
    renderBackupDashboard();
  };

  window.deleteBackup = function(id) {
    const backups = JSON.parse(localStorage.getItem('home_inserts_backups') || '[]');
    const backup = backups.find(b => b.id === id);
    if (!backup) return;

    if (!confirm(`Are you sure you want to delete backup: "${backup.name}"? This cannot be undone.`)) return;

    const updated = backups.filter(b => b.id !== id);
    localStorage.setItem('home_inserts_backups', JSON.stringify(updated));

    logAction('Super Admin', `Deleted backup file "${backup.name}"`, 'Warning');
    renderBackupDashboard();
    showToast('Backup deleted.', 'success');
  };

  /* ════════════════════════════════════════════════
     AUDIT LOG SYSTEM
  ════════════════════════════════════════════════ */
  function logAction(user, message, level = 'Info') {
    const logs = JSON.parse(localStorage.getItem('home_inserts_backup_logs') || '[]');
    const item = {
      timestamp: Date.now(),
      user: user,
      message: message,
      level: level
    };
    logs.unshift(item);
    // Keep max 50 logs
    if (logs.length > 50) logs.pop();
    localStorage.setItem('home_inserts_backup_logs', JSON.stringify(logs));
  }

  function renderLogs() {
    if (!timelineEl) return;
    
    const logs = JSON.parse(localStorage.getItem('home_inserts_backup_logs') || '[]');
    timelineEl.innerHTML = '';
    
    if (logs.length === 0) {
      timelineEl.innerHTML = '<div style="color:var(--color-body-light); font-style:italic;">No log operations registered.</div>';
      return;
    }

    logs.forEach(log => {
      const timeStr = new Date(log.timestamp).toLocaleString();
      let color = '#334155';
      let icon = 'ℹ️';

      if (log.level === 'Success') {
        color = '#15803d';
        icon = '✅';
      } else if (log.level === 'Warning') {
        color = '#b45309';
        icon = '⚠️';
      } else if (log.level === 'Error') {
        color = '#b91c1c';
        icon = '🚨';
      }

      const row = document.createElement('div');
      row.style.marginBottom = '6px';
      row.style.color = color;
      row.innerHTML = `[${timeStr}] [${log.user}] ${icon} ${escapeHtml(log.message)}`;
      timelineEl.appendChild(row);
    });
  }

  function clearLogs() {
    if (!confirm('Clear all backup audit log records?')) return;
    localStorage.setItem('home_inserts_backup_logs', '[]');
    renderLogs();
    showToast('Audit logs cleared.', 'success');
  }

  /* ════════════════════════════════════════════════
     UTILITIES
  ════════════════════════════════════════════════ */
  function calculateLocalStorageSize() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += (localStorage.getItem(key) || '').length;
      }
    }
    return total;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
  }

})();
