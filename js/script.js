document.addEventListener('DOMContentLoaded', () => {
  
  const originalTextContent = {};
  const originalPlaceholders = {};
  
  document.querySelectorAll('[data-trans]').forEach(el => {
    originalTextContent[el.getAttribute('data-trans')] = el.innerHTML;
  });
  document.querySelectorAll('[data-trans-placeholder]').forEach(el => {
    originalPlaceholders[el.getAttribute('data-trans-placeholder')] = el.placeholder;
  });

  let soundEnabled = false;
  let activeDrawColor = '#FF007F'; 
  let isDrawing = false;

  
  const hamburger = document.getElementById('nav-hamburger');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  function toggleMobileMenu(forceClose = false) {
    const isOpen = hamburger.classList.contains('open');
    if (forceClose || isOpen) {
      hamburger.classList.remove('open');
      mobileDrawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    } else {
      hamburger.classList.add('open');
      mobileDrawer.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', () => toggleMobileMenu());

    
    mobileDrawer.querySelectorAll('.mobile-nav-menu a').forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(true));
    });

    
    const mobileButtonMap = {
      'demo-toggle-mobile': 'demo-toggle',
      'lang-toggle-mobile': 'lang-toggle',
      'shuffle-btn-mobile': 'shuffle-btn',
      'sound-toggle-mobile': 'sound-toggle',
      'music-toggle-mobile': 'music-toggle',
    };

    Object.entries(mobileButtonMap).forEach(([mobileId, desktopId]) => {
      const mobileBtn = document.getElementById(mobileId);
      const desktopBtn = document.getElementById(desktopId);
      if (mobileBtn && desktopBtn) {
        mobileBtn.addEventListener('click', () => {
          desktopBtn.click();
          
          setTimeout(() => {
            mobileBtn.textContent = desktopBtn.textContent;
            mobileBtn.className = desktopBtn.className;
            mobileBtn.style.cssText = 'font-size: 0.8rem; width: 100%;';
          }, 50);
        });
      }
    });
  }
  
  
  function playSound(type) {
    if (!soundEnabled) return;
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      const now = audioCtx.currentTime;
      
      if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.05);
        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(450, now + 0.08);
        osc.frequency.setValueAtTime(600, now + 0.16);
        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'clear') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      console.warn("Audio Context not allowed or supported on this browser.");
    }
  }

  const soundToggle = document.getElementById('sound-toggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.textContent = currentLang === 'en'
        ? (soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off')
        : (soundEnabled ? '🔊 Suara: Aktif' : '🔇 Suara: Mati');
      soundToggle.classList.toggle('bg-green', soundEnabled);
      soundToggle.classList.toggle('bg-white', !soundEnabled);
      
      if (soundEnabled) {
        setTimeout(() => playSound('success'), 50);
      }
    });
  }

  const musicToggle = document.getElementById('music-toggle');
  let musicAudio = new Audio('https://www.image2url.com/r2/default/audio/1779271457477-053dfbcc-80fb-4bb5-bd76-ebab09f3fb14.mp3');
  musicAudio.loop = true;
  let musicEnabled = false;

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      musicEnabled = !musicEnabled;
      if (musicEnabled) {
        musicAudio.play().catch(e => {
          console.warn("Music playback blocked by browser autocomplete/interaction policy.", e);
          musicEnabled = false;
          updateMusicButtonState();
        });
      } else {
        musicAudio.pause();
      }
      updateMusicButtonState();
    });
  }

  function updateMusicButtonState() {
    if (!musicToggle) return;
    musicToggle.textContent = currentLang === 'en'
      ? (musicEnabled ? '🎵 Music: On' : '🎵 Music: Off')
      : (musicEnabled ? '🎵 Musik: Aktif' : '🎵 Musik: Mati');
    musicToggle.classList.toggle('bg-green', musicEnabled);
    musicToggle.classList.toggle('bg-white', !musicEnabled);
  }

  document.querySelectorAll('.neo-btn, .nav-logo, .timeline-tab-btn, .pixel-color-btn').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('click'));
  });

  const colorPaletteClasses = ['bg-yellow', 'bg-green', 'bg-pink', 'bg-cyan', 'bg-orange', 'bg-purple', 'bg-white'];
  
  function shuffleColors() {
    playSound('success');
    
    const cards = document.querySelectorAll('.neo-card, .timeline-card, .project-card, .featured-card, .about-stat-item, .contact-social-card');
    
    cards.forEach(card => {

      colorPaletteClasses.forEach(cls => card.classList.remove(cls));
      
      card.classList.remove('bg-blue');
      
      const randomCls = colorPaletteClasses[Math.floor(Math.random() * colorPaletteClasses.length)];
      card.classList.add(randomCls);
    });
  }

  const shuffleBtn = document.getElementById('shuffle-btn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', shuffleColors);
  }

  function makeDraggable(element) {
    const header = element.querySelector('.window-header');
    if (!header) return;

    header.classList.add('draggable');

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    header.onmousedown = dragMouseDown;
    header.ontouchstart = dragTouchStart;

    function dragMouseDown(e) {
      e = e || window.event;

      if (e.target.classList.contains('window-dot')) return;
      e.preventDefault();
      
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      
      bringToFront(element);
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
      element.style.position = 'fixed';
    }

    function dragTouchStart(e) {
      if (e.target.classList.contains('window-dot')) return;
      
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      
      document.ontouchend = closeDragElement;
      document.ontouchmove = elementTouchDrag;
      
      bringToFront(element);
    }

    function elementTouchDrag(e) {
      pos1 = pos3 - e.touches[0].clientX;
      pos2 = pos4 - e.touches[0].clientY;
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
      
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
      element.style.position = 'fixed';
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
      document.ontouchend = null;
      document.ontouchmove = null;
    }
  }

  let topZIndex = 10;
  function bringToFront(element) {
    topZIndex++;
    element.style.zIndex = topZIndex;
  }

  document.querySelectorAll('.neo-window').forEach(win => {
    makeDraggable(win);
    win.addEventListener('mousedown', () => bringToFront(win));
  });

  document.querySelectorAll('.window-dot.dot-close').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const windowEl = e.target.closest('.neo-window');
      if (windowEl) {
        playSound('clear');
        windowEl.style.display = 'none';
        
        if (windowEl.id === 'terminal-window') {
          console.log("Terminal closed. You can restore windows by reloading page.");
        }
      }
    });
  });

  const terminalLinesContainer = document.getElementById('terminal-lines');
  const terminalInput = document.getElementById('terminal-command-input');
  const terminalPromptText = document.getElementById('terminal-prompt-path');

  const BIO_COMMANDS_EN = {
    "about me": "User: Rafi Rahmadani Zain<br>Role: Web Developer & Informatics Student<br>Major: Informatics Engineering<br>Status: Learning, coding, & solving bugs daily.",
    skills: "Frontend: HTML5, CSS3, JavaScript (ES6+), ReactJS, Bootstrap, TailwindCSS, Flutter<br>Backend: Node.js, Python<br>Tools: Git, GitHub, Vite, VS Code, Android Studio",
    education: "UPI YPTK Padang<br>Focusing on Software Development and Information Systems.",
    hobbies: "Code commit, Coffee consumption, Reading docs, Gaming, Synth tinkering.",
    contact: "Instagram: @_iamrapii<br>GitHub: github.com/Rapiiwe<br>Email: rafirahmadanizain@gmail.com",
    help: "Available commands: <strong>about me</strong>, <strong>skills</strong>, <strong>education</strong>, <strong>hobbies</strong>, <strong>contact</strong>, <strong>clear</strong>, <strong>help</strong>",
    clear: ""
  };

  const BIO_COMMANDS_ID = {
    "about me": "Pengguna: Rafi Rahmadani Zain<br>Peran: Pengembang Web & Mahasiswa Informatika<br>Jurusan: Teknik Informatika<br>Status: Belajar, ngoding, & memecahkan bug setiap hari.",
    skills: "Frontend: HTML5, CSS3, JavaScript (ES6+), ReactJS, Bootstrap, TailwindCSS, Flutter<br>Backend: Node.js, Python<br>Alat: Git, GitHub, Vite, VS Code, Android Studio",
    education: "UPI YPTK Padang<br>Fokus pada Pengembangan Perangkat Lunak dan Sistem Informasi.",
    hobbies: "Menulis kode, minum kopi, membaca dokumentasi, bermain game, utak-atik sintesis suara.",
    contact: "Instagram: @_iamrapii<br>GitHub: github.com/Rapiiwe<br>Email: rafirahmadanizain@gmail.com",
    help: "Perintah tersedia: <strong>about me</strong>, <strong>skills</strong>, <strong>education</strong>, <strong>hobbies</strong>, <strong>contact</strong>, <strong>clear</strong>, <strong>help</strong>",
    clear: ""
  };

  let BIO_COMMANDS = BIO_COMMANDS_ID;

  function appendTerminalLine(text, isInput = false, customPrompt = "guest@rafi-pc:~$ ") {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (isInput) {
      line.innerHTML = `<span class="terminal-prompt">${customPrompt}</span><span>${text}</span>`;
    } else {
      line.innerHTML = text;
    }
    
    terminalLinesContainer.appendChild(line);
    
    const body = terminalLinesContainer.closest('.window-body');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  const welcomeSequence = [
    { cmd: 'help', delay: 1000 },
  ];

  function runSimulatedSequence(index) {
    if (index >= welcomeSequence.length) {
    
      if (terminalInput) terminalInput.disabled = false;
      return;
    }

    const item = welcomeSequence[index];
    setTimeout(() => {
    
      appendTerminalLine(item.cmd, true);
      
    
      setTimeout(() => {
        const reply = BIO_COMMANDS[item.cmd];
        appendTerminalLine(reply);
        playSound('click');
        runSimulatedSequence(index + 1);
      }, 500);
    }, item.delay);
  }

  if (terminalInput) {
    terminalInput.disabled = true;
    runSimulatedSequence(0);
    
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const fullCmd = terminalInput.value.trim();
        const cmd = fullCmd.toLowerCase();
        
        appendTerminalLine(fullCmd, true);
        terminalInput.value = '';
        playSound('click');
        
        if (cmd === '') return;
        
        if (cmd === 'clear') {
          terminalLinesContainer.innerHTML = '';
          return;
        }
        
        if (BIO_COMMANDS.hasOwnProperty(cmd)) {
          appendTerminalLine(BIO_COMMANDS[cmd]);
        } else {
          appendTerminalLine(`Command not found: "${fullCmd}". Type 'help' for commands.`);
        }
      }
    });
  }

  function updateTimeWidgets() {
    const localTimeEl = document.getElementById('local-time');
    if (localTimeEl) {
      
      const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      localTimeEl.textContent = formatter.format(new Date()) + " WIB";
    }
  }
  setInterval(updateTimeWidgets, 1000);
  updateTimeWidgets();

  const timelineTabs = document.querySelectorAll('.timeline-tab-btn');
  timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      timelineTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetPaneId = tab.dataset.target;
      document.querySelectorAll('.timeline-pane').forEach(pane => {
        pane.classList.remove('active');
      });
      
      const activePane = document.getElementById(targetPaneId);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  const LANG_COLORS = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    React: '#61dafb',
    Java: '#b07219',
    'C++': '#f34b7d',
    PHP: '#4f5d95',
    Dart: '#00B4AB',
    Kotlin: '#A97BFF',
    Swift: '#F05138',
    Go: '#00ADD8',
    Rust: '#dea584'
  };

  let allRepos = [];
  let selectedLanguageFilter = 'All';
  let searchQuery = '';

  const projectsGrid = document.getElementById('projects-grid');
  const searchInput = document.getElementById('github-search');
  const languagePills = document.getElementById('github-lang-pills');
  const repoCountEl = document.getElementById('repo-count');

  function renderRepos() {
    if (!projectsGrid) return;
    
    const filteredRepos = allRepos.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLang = selectedLanguageFilter === 'All' || repo.language === selectedLanguageFilter;
      return matchesSearch && matchesLang;
    });

    if (filteredRepos.length === 0) {
      projectsGrid.innerHTML = `
        <div class="neo-card bg-white" style="grid-column: 1/-1; text-align: center; padding: 3rem;">
          <p style="font-family: var(--font-mono); font-weight: bold;">❌ No repositories found matching the criteria.</p>
        </div>`;
      return;
    }

    projectsGrid.innerHTML = filteredRepos.map((repo, idx) => {
      const lang = repo.language || 'Code';
      const dotColor = LANG_COLORS[lang] || '#000000';
      const desc = repo.description || 'No repository description available. Tap to view source code.';
      const stars = repo.stargazers_count;
      const updated = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const bgColors = ['bg-yellow', 'bg-green', 'bg-pink', 'bg-cyan', 'bg-orange', 'bg-purple', 'bg-white'];
      const currentBg = bgColors[idx % bgColors.length];

      return `
        <div class="project-card ${currentBg}">
          <div>
            <div class="project-lang">
              <span class="lang-dot" style="background-color: ${dotColor}"></span>
              <span>${lang}</span>
            </div>
            <h3 class="project-name">${repo.name}</h3>
            <p class="project-desc">${desc.length > 110 ? desc.slice(0, 110) + '...' : desc}</p>
          </div>
          <div class="project-meta">
            <span class="project-stars">★ ${stars}</span>
            <span>Update: ${updated}</span>
            <a href="${repo.html_url}" target="_blank" class="project-link">Source →</a>
          </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.project-card, .project-link').forEach(el => {
      el.addEventListener('mouseenter', () => playSound('hover'));
      el.addEventListener('click', () => playSound('click'));
    });
  }

  function renderLanguageFilters() {
    if (!languagePills) return;
    
    const languages = new Set();
    allRepos.forEach(repo => {
      if (repo.language) languages.add(repo.language);
    });

    const langArray = ['All', ...Array.from(languages)];

    languagePills.innerHTML = langArray.map(lang => {
      const isActive = lang === selectedLanguageFilter ? 'active' : '';
      return `<button class="github-lang-btn ${isActive}" data-lang="${lang}">${lang}</button>`;
    }).join('');

    document.querySelectorAll('.github-lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedLanguageFilter = e.target.dataset.lang;
        
        document.querySelectorAll('.github-lang-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        playSound('click');
        renderRepos();
      });
      btn.addEventListener('mouseenter', () => playSound('hover'));
    });
  }

  async function fetchGitHubRepos() {
    try {
      const res = await fetch('https://api.github.com/users/Rapiiwe/repos?sort=updated&per_page=25');
      if (!res.ok) throw new Error("API rate limits or account not found.");
      
      const repos = await res.json();
      
      allRepos = repos.filter(repo => !repo.fork && !repo.private);

      allRepos.forEach(repo => {
        if (repo.name === 'Bio') {
          repo.language = 'Dart';
        }
      });
      
      if (repoCountEl) {
        repoCountEl.textContent = allRepos.length;
      }
      
      renderLanguageFilters();
      renderRepos();
      
    } catch (err) {
      console.warn("Using fallback static repositories due to GitHub API error:", err);
      
      allRepos = [
        {
          name: "Manajemen_kuliah",
          language: "PHP",
          description: "Sistem manajemen data perkuliahan mahasiswa.",
          stargazers_count: 0,
          updated_at: "2026-05-20T04:21:54Z",
          html_url: "https://github.com/Rapiiwe/Manajemen_kuliah"
        },
        {
          name: "inventory_baju",
          language: "PHP",
          description: "Aplikasi Inventory Baju untuk manajemen stok pakaian.",
          stargazers_count: 0,
          updated_at: "2026-05-19T19:43:23Z",
          html_url: "https://github.com/Rapiiwe/inventory_baju"
        },
        {
          name: "Project_Game_py",
          language: "Python",
          description: "Space War game built in Python using Pygame library.",
          stargazers_count: 0,
          updated_at: "2026-05-19T19:01:39Z",
          html_url: "https://github.com/Rapiiwe/Project_Game_py"
        },
        {
          name: "Bio",
          language: "Dart",
          description: "Aplikasi Biodata Mahasiswa menggunakan Flutter.",
          stargazers_count: 0,
          updated_at: "2026-05-14T19:44:22Z",
          html_url: "https://github.com/Rapiiwe/Bio"
        }
      ];

      if (repoCountEl) {
        repoCountEl.textContent = allRepos.length;
      }

      renderLanguageFilters();
      renderRepos();
    }
  }

  if (projectsGrid) {
    fetchGitHubRepos();

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderRepos();
      });
    }
  }

  const certCards = document.querySelectorAll('.cert-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.cert-img');
      const title = card.querySelector('.cert-title').textContent;
      const issuer = card.querySelector('.cert-issuer').textContent;
      
      if (lightbox && lightboxImg && lightboxCaption && img) {
        lightboxImg.src = img.src;
        lightboxCaption.innerHTML = `<strong>${title}</strong> &middot; ${issuer}`;
        lightbox.classList.add('active');
        playSound('success');
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      playSound('clear');
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        playSound('clear');
      }
    });
  }

  const printCVBtn = document.getElementById('print-cv-btn');
  if (printCVBtn) {
    printCVBtn.addEventListener('click', () => {
      playSound('success');
      window.print();
    });
  }

  const pixelGrid = document.getElementById('pixel-grid');
  const pixelClearBtn = document.getElementById('pixel-clear-btn');
  const pixelDownloadBtn = document.getElementById('pixel-download-btn');
  const colorBtns = document.querySelectorAll('.pixel-color-btn');

  if (pixelGrid) {
    for (let i = 0; i < 256; i++) { 
      const cell = document.createElement('div');
      cell.className = 'pixel-cell';
      
      
      cell.addEventListener('mousedown', (e) => {
        isDrawing = true;
        cell.style.backgroundColor = activeDrawColor;
        playSound('hover');
      });

      cell.addEventListener('mouseenter', () => {
        if (isDrawing) {
          cell.style.backgroundColor = activeDrawColor;
        }
      });

      pixelGrid.appendChild(cell);
    }

    
    document.addEventListener('mouseup', () => {
      isDrawing = false;
    });

    
    pixelGrid.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target && target.classList.contains('pixel-cell')) {
        target.style.backgroundColor = activeDrawColor;
      }
    }, { passive: false });
  }

  
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDrawColor = btn.dataset.color;
    });
  });

  
  if (pixelClearBtn) {
    pixelClearBtn.addEventListener('click', () => {
      playSound('clear');
      document.querySelectorAll('.pixel-cell').forEach(cell => {
        cell.style.backgroundColor = '#FFFFFF';
      });
    });
  }

  
  if (pixelDownloadBtn && pixelGrid) {
    pixelDownloadBtn.addEventListener('click', () => {
      playSound('success');
      
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 16;
      exportCanvas.height = 16;
      const ctx = exportCanvas.getContext('2d');
      
      const cells = pixelGrid.querySelectorAll('.pixel-cell');
      
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          const idx = y * 16 + x;
          const color = window.getComputedStyle(cells[idx]).backgroundColor;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      
      const link = document.createElement('a');
      link.download = 'pixel-art-rafi-portfolio.png';
      
      const upscaleCanvas = document.createElement('canvas');
      upscaleCanvas.width = 256;
      upscaleCanvas.height = 256;
      const uCtx = upscaleCanvas.getContext('2d');
      uCtx.imageSmoothingEnabled = false; 
      uCtx.drawImage(exportCanvas, 0, 0, 16, 16, 0, 0, 256, 256);
      
      link.href = upscaleCanvas.toDataURL();
      link.click();
    });
  }

  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      
      if (!name || !email || !message) {
        if (formError) {
          formError.textContent = "⚠️ Please fill in all fields before submitting!";
          formError.style.display = 'block';
          if (formSuccess) formSuccess.style.display = 'none';
        }
        playSound('clear');
        return;
      }
      
      playSound('success');
      if (formSuccess) {
        formSuccess.innerHTML = "🎉 Message Sent Successfully! (Simulated submission - Rafi will receive this message soon.)";
        formSuccess.style.display = 'block';
        if (formError) formError.style.display = 'none';
      }
      
      
      contactForm.reset();
    });

    
    contactForm.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('input', () => {
        if (formError) formError.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'none';
      });
    });
  }

  let currentLang = 'id';

  const TRANSLATIONS = {
    en: {
      "nav-about": "About",
      "nav-skills": "Skills",
      "nav-timeline": "Timeline",
      "nav-projects": "Projects",
      "nav-certificates": "Certificates",
      "nav-cv": "Resume",
      "nav-draw": "Draw",
      "nav-contact": "Contact",
      "hero-welcome": "✦ RAPII — hello, friends!",
      "hero-desc": "Learning code, one commit at a time. Informatics Engineering student building retro & modern web experiences.",
      "hero-btn-projects": "View Projects ↓",
      "hero-btn-contact": "Get In Touch ✉",
      "hero-btn-sandbox": "Play Sandbox 🎮",
      "about-stat-local": "Local Time:",
      "about-stat-status-label": "Status:",
      "about-stat-status-val": "🟢 Active Coding",
      "about-stat-major": "Major:",
      "about-stat-major-val": "Informatics Eng.",
      "about-title": "About me",
      "about-p1": "Hello! I'm Rafi, an Informatics Engineering student who is deeply passionate about web development. I love diving into software architecture, creating interactive user interfaces, and turning complex logic into clean, functional code.",
      "about-p2": "For me, coding isn't just about passing college exams; it's a creative outlet. From debugging tricky runtime errors to designing responsive layouts, I enjoy every step of the development cycle. I spend my time exploring modern frontend frameworks and building interactive web experiences.",
      "about-p3": "I'm always excited to learn new frameworks, collaborate on open-source projects, and build software that solves real-world problems. Let's connect and write some code!",
      "about-stat-repos": "Github Repos",
      "about-stat-active": "Active Since",
      "about-stat-bloopers": "Bloopers to Fix",
      "skills-title": "My Arsenal",
      "skills-frontend": "Frontend Stack",
      "skills-backend": "Backend Stack",
      "skills-tools": "Developer Utilities",
      "journey-title": "My Journey",
      "journey-tab-edu": "Education",
      "journey-tab-exp": "Experience",
      "projects-title": "What I've Built",
      "projects-curated": "Curated Projects",
      "projects-dynamic": "Dynamic GitHub Panel",
      "projects-search-placeholder": "🔍 Search repository names...",
      "certs-title": "Certificates",
      "certs-coming-soon": "Certificates Coming Soon",
      "certs-desc": "Currently preparing for certifications in Flutter Mobile Development, Database Administration, and Advanced Frontend Engineering.",
      "certs-stay-tuned": "Stay Tuned!",
      "cv-title": "My Resume",
      "cv-subtitle": "Web Developer & Informatics Student",
      "cv-contact-major": "Informatics Engineering",
      "cv-core-title": "Core Competencies",
      "cv-projects-title": "Projects History",
      "cv-print-btn": "🖨 Print / Export PDF Resume",
      "draw-title": "Pixel Canvas Sandbox",
      "draw-desc": "🎨 <strong>Instructions:</strong> Click and drag across the canvas cells to draw pixel art. Choose different colors from the picker panel. Toggle sound on in the nav bar for 8-bit draw noises!",
      "draw-btn-clear": "🧹 Reset Grid",
      "draw-btn-download": "💾 Download Art (.png)",
      "contact-title": "Let's Connect",
      "contact-subtitle": "Feel free to reach out for project collaboration, job inquiries, or just to say hello! I'm always open to talking tech.",
      "contact-label-name": "Full Name / Organization",
      "contact-label-email": "Email Address",
      "contact-label-msg": "Message Content",
      "contact-btn-submit": "🚀 Dispatch Message",
      "experience-coming-soon": "Experience Coming Soon",
      "experience-desc": "Currently focusing on academic coursework at UPI YPTK Padang and building solid open-source projects. Open for internship and junior developer opportunities.",
      "edu1-role": "Informatics Engineering Student",
      "edu1-org": "UPI YPTK Padang",
      "edu1-desc": "Currently pursuing academic studies in computer science and software development.",
      "edu1-li1": "Core coursework: Algorithms, Data Structures, Relational Databases, Web Programming.",
      "edu1-li2": "Active member of local student developer groups and coding clubs.",
      "edu2-role": "Self-Taught Programmer",
      "edu2-org": "Independent Learning",
      "edu2-desc": "Supplementing formal academic learning with industry certification paths.",
      "edu2-li1": "Learning from various sources including YouTube, TikTok, and blog posts.",
      "edu2-li2": "Focusing on Python, HTML, CSS, responsive layouts, and responsive design systems.",

      
      "fp1-name": "Portfolio",
      "fp1-desc": "A premium developer portfolio designed. Features a draggable terminal system, real-time clock widgets, sound board integrations, and printable stylesheets.",
      "fp2-name": "Neo Draw Canvas",
      "fp2-desc": "An interactive retro pixel board widget embedded in a web canvas container. Allows pixel grids to be painted with colors, cleared, and exported directly to PNG files. Includes retro Audio synthesizer sounds.",
      "fp-btn-source": "Source Code",
      "fp-btn-demo": "Live Demo",
      "fp2-btn-run": "Run Canvas",

      
      "cv-edu1-role": "Bachelor of Informatics Engineering",
      "cv-edu1-date": "2024 - Present",
      "cv-edu1-desc": "Focused on algorithmic fundamentals, software engineering, and database systems. Active participant in student programming associations.",
      "cv-skill-dev": "Development",
      "cv-skill-tools": "Tools",
      "cv-skill-soft": "Soft Skills",
      "cv-skill-soft-list": "Problem Solving, Rapid Self-Learning, Critical Reasoning, Team Collaboration",
      "cv-proj1-role": "Personal Portfolio Web Environment",
      "cv-proj1-desc": "Designed and built an interactive portfolio featuring retro OS panels, Web Audio synthesizers, and pixel board drawing systems.",
      "cv-proj2-role": "Independent Project Development",
      "cv-proj2-date": "2024 - 2025",
      "cv-proj2-desc": "Built multiple personal open-source projects hosted on GitHub, improving proficiency in Python, HTML, and CSS."
    },
    id: {
      "nav-about": "Tentang",
      "nav-skills": "Keahlian",
      "nav-timeline": "Perjalanan",
      "nav-projects": "Proyek",
      "nav-certificates": "Sertifikat",
      "nav-cv": "Resume",
      "nav-draw": "Gambar",
      "nav-contact": "Kontak",
      "hero-welcome": "✦ RAPII — halo, friends!",
      "hero-desc": "Belajar ngoding, commit demi commit. Mahasiswa Teknik Informatika yang suka membangun antarmuka web yang interaktif, modern, dan retro.",
      "hero-btn-projects": "Lihat Proyek ↓",
      "hero-btn-contact": "Hubungi Saya ✉",
      "hero-btn-sandbox": "Main Sandbox 🎮",
      "about-stat-local": "Waktu Lokal:",
      "about-stat-status-label": "Status:",
      "about-stat-status-val": "🟢 Aktif Ngoding",
      "about-stat-major": "Jurusan:",
      "about-stat-major-val": "Teknik Informatika",
      "about-title": "Tentang Saya",
      "about-p1": "Halo! Saya Rafi, seorang mahasiswa Teknik Informatika yang punya passion besar di dunia web development. Saya suka mengulik arsitektur perangkat lunak, mendesain antarmuka interaktif, dan menerjemahkan logika rumit menjadi baris kode yang bersih dan fungsional.",
      "about-p2": "Bagi saya, pemrograman itu seperti memecahkan teka-teki yang seru—setiap bug adalah tantangan menarik untuk belajar hal baru. Di luar jam kuliah, saya aktif mengeksplorasi framework modern dan membangun proyek-proyek web yang interaktif.",
      "about-p3": "Saya selalu antusias untuk mempelajari teknologi baru, berkolaborasi dalam proyek open-source, dan menciptakan solusi digital yang bermanfaat. Let's connect dan mari ngoding bareng!",
      "about-stat-repos": "Repositori Github",
      "about-stat-active": "Aktif Sejak",
      "about-stat-bloopers": "Bug untuk Diperbaiki",
      "skills-title": "Gudang Senjata",
      "skills-frontend": "Teknologi Frontend",
      "skills-backend": "Teknologi Backend",
      "skills-tools": "Alat Pengembang",
      "journey-title": "Perjalanan Saya",
      "journey-tab-edu": "Pendidikan",
      "journey-tab-exp": "Pengalaman",
      "projects-title": "Yang Saya Bangun",
      "projects-curated": "Proyek Pilihan",
      "projects-dynamic": "Panel Dinamis GitHub",
      "projects-search-placeholder": "🔍 Cari nama repositori...",
      "certs-title": "Sertifikat",
      "certs-coming-soon": "Sertifikat Segera Hadir",
      "certs-desc": "Saat ini sedang mempersiapkan sertifikasi untuk Pengembangan Mobile Flutter, Administrasi Database, dan Rekayasa Frontend Tingkat Lanjut.",
      "certs-stay-tuned": "Pantau Terus!",
      "cv-title": "Daftar Riwayat Hidup",
      "cv-subtitle": "Pengembang Web & Mahasiswa Informatika",
      "cv-contact-major": "Teknik Informatika",
      "cv-core-title": "Keahlian Utama",
      "cv-projects-title": "Riwayat Proyek",
      "cv-print-btn": "🖨 Cetak / Ekspor PDF Resume",
      "draw-title": "Wadah Gambar Piksel",
      "draw-desc": "🎨 <strong>Instruksi:</strong> Klik dan seret di sepanjang kotak untuk menggambar piksel. Pilih warna yang berbeda di panel pilihan. Nyalakan suara di nav bar untuk efek suara 8-bit retro!",
      "draw-btn-clear": "🧹 Reset Papan",
      "draw-btn-download": "💾 Unduh Gambar (.png)",
      "contact-title": "Mari Terhubung",
      "contact-subtitle": "Jangan ragu untuk menghubungi saya untuk kolaborasi proyek, peluang kerja, atau sekadar menyapa! Saya selalu terbuka untuk berdiskusi tentang teknologi.",
      "contact-label-name": "Nama Lengkap / Perusahaan",
      "contact-label-email": "Alamat Email Anda",
      "contact-label-msg": "Isi Pesan Anda",
      "contact-btn-submit": "🚀 Kirim Pesan",
      "experience-coming-soon": "Pengalaman Segera Hadir",
      "experience-desc": "Saat ini fokus pada perkuliahan di UPI YPTK Padang dan membangun proyek open-source yang solid. Terbuka untuk magang dan peluang pengembang pemula.",
      "edu1-role": "Mahasiswa Teknik Informatika",
      "edu1-org": "UPI YPTK Padang",
      "edu1-desc": "Saat ini menempuh studi di bidang ilmu komputer dan pengembangan perangkat lunak.",
      "edu1-li1": "Mata kuliah inti: Algoritma, Struktur Data, Basis Data Relasional, Pemrograman Web.",
      "edu1-li2": "Anggota aktif komunitas mahasiswa developer dan klub coding lokal.",
      "edu2-role": "Programmer Otodidak",
      "edu2-org": "Belajar Mandiri",
      "edu2-desc": "Melengkapi pembelajaran akademis formal dengan jalur sertifikasi industri.",
      "edu2-li1": "Belajar dari berbagai sumber, mulai dari YouTube, TikTok, dan blog.",
      "edu2-li2": "Berfokus pada Python, HTML, CSS, tata letak responsif, dan sistem desain responsif.",

      
      "fp1-name": "Portfolio",
      "fp1-desc": "Portofolio developer premium yang dirancang dengan sistem terminal yang bisa diseret, widget jam real-time, integrasi papan suara, dan stylesheet yang bisa dicetak.",
      "fp2-name": "Neo Draw Canvas",
      "fp2-desc": "Widget papan piksel retro interaktif yang tertanam dalam container canvas web. Memungkinkan grid piksel diwarnai, dihapus, dan diekspor langsung ke file PNG. Dilengkapi suara synthesizer Audio retro.",
      "fp-btn-source": "Kode Sumber",
      "fp-btn-demo": "Demo Langsung",
      "fp2-btn-run": "Jalankan Canvas",

      
      "cv-edu1-role": "Sarjana Teknik Informatika",
      "cv-edu1-date": "2024 - Sekarang",
      "cv-edu1-desc": "Berfokus pada dasar-dasar algoritma, rekayasa perangkat lunak, dan sistem basis data. Peserta aktif asosiasi pemrograman mahasiswa.",
      "cv-skill-dev": "Pengembangan",
      "cv-skill-tools": "Alat",
      "cv-skill-soft": "Soft Skills",
      "cv-skill-soft-list": "Pemecahan Masalah, Belajar Mandiri Cepat, Penalaran Kritis, Kolaborasi Tim",
      "cv-proj1-role": "Lingkungan Web Portofolio Pribadi",
      "cv-proj1-desc": "Merancang dan membangun portofolio interaktif dengan panel OS retro, synthesizer Web Audio, dan sistem gambar papan piksel.",
      "cv-proj2-role": "Pengembangan Proyek Mandiri",
      "cv-proj2-date": "2024 - 2025",
      "cv-proj2-desc": "Membangun beberapa proyek open-source pribadi yang dihosting di GitHub, meningkatkan kemampuan dalam Python, HTML, CSS."
    }
  };

  function updateLanguage(lang) {
    currentLang = lang;
    BIO_COMMANDS = currentLang === 'en' ? BIO_COMMANDS_EN : BIO_COMMANDS_ID;
    
    
    document.querySelectorAll('[data-trans]').forEach(el => {
      const key = el.getAttribute('data-trans');
      if (currentLang === 'id') {
        if (originalTextContent[key] !== undefined) {
          el.innerHTML = originalTextContent[key];
        }
      } else {
        if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
          el.innerHTML = TRANSLATIONS[currentLang][key];
        }
      }
    });

    
    document.querySelectorAll('[data-trans-placeholder]').forEach(el => {
      const key = el.getAttribute('data-trans-placeholder');
      if (currentLang === 'id') {
        if (originalPlaceholders[key] !== undefined) {
          el.placeholder = originalPlaceholders[key];
        }
      } else {
        if (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) {
          el.placeholder = TRANSLATIONS[currentLang][key];
        }
      }
    });

    
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
      langToggle.textContent = currentLang === 'en' ? '🇮🇩 Bahasa' : '🇬🇧 English';
    }

    
    if (soundToggle) {
      soundToggle.textContent = currentLang === 'en'
        ? (soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off')
        : (soundEnabled ? '🔊 Suara: Aktif' : '🔇 Suara: Mati');
    }

    
    if (typeof updateMusicButtonState === 'function') {
      updateMusicButtonState();
    }
  }

  const langToggleBtn = document.getElementById('lang-toggle');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      playSound('click');
      const nextLang = currentLang === 'en' ? 'id' : 'en';
      updateLanguage(nextLang);
    });
  }

  
  let demoActive = false;
  let demoTimeoutIds = [];

  function createDemoBanner() {
    let banner = document.getElementById('demo-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'demo-banner';
      banner.className = 'demo-banner';
      banner.innerHTML = `
        <div class="demo-banner-text">
          <div class="demo-banner-pulse"></div>
          <span>🎮 AUTO-DEMO ACTIVE... Watching Portfolio Run!</span>
        </div>
        <button id="demo-stop-btn" class="neo-btn btn-secondary" style="padding: 0.3rem 0.8rem; font-size: 0.75rem;">Stop Demo</button>
      `;
      document.body.appendChild(banner);
      
      document.getElementById('demo-stop-btn').addEventListener('click', stopDemo);
    }
    return banner;
  }

  function startDemo() {
    if (demoActive) return;
    demoActive = true;

    
    toggleMobileMenu(true);
    
    if (!soundEnabled) {
      const soundBtn = document.getElementById('sound-toggle');
      if (soundBtn) soundBtn.click();
    }

    const banner = createDemoBanner();
    banner.classList.add('active');
    
    const steps = [
      
      {
        delay: 500,
        action: () => {
          const terminal = document.getElementById('terminal-window');
          if (terminal) {
            terminal.scrollIntoView({ behavior: 'smooth', block: 'center' });
            terminal.classList.add('demo-highlight');
          }
        }
      },
      
      {
        delay: 2000,
        action: () => {
          const terminal = document.getElementById('terminal-window');
          if (terminal) terminal.classList.remove('demo-highlight');
          autoTypeTerminalCommand('About me');
        }
      },
      
      {
        delay: 4500,
        action: () => {
          autoTypeTerminalCommand('skills');
        }
      },
      
      {
        delay: 7500,
        action: () => {
          const skillsSection = document.getElementById('skills');
          if (skillsSection) {
            skillsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            skillsSection.classList.add('demo-highlight');
          }
          shuffleColors();
        }
      },
      
      {
        delay: 9000,
        action: () => {
          const skillsSection = document.getElementById('skills');
          if (skillsSection) skillsSection.classList.remove('demo-highlight');
          shuffleColors();
        }
      },
      
      {
        delay: 10500,
        action: () => {
          const pixelSection = document.getElementById('pixel-drawer');
          if (pixelSection) {
            pixelSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            pixelSection.classList.add('demo-highlight');
          }
        }
      },
      
      {
        delay: 12000,
        action: () => {
          const pixelSection = document.getElementById('pixel-drawer');
          if (pixelSection) pixelSection.classList.remove('demo-highlight');
          
          const clearBtn = document.getElementById('pixel-clear-btn');
          if (clearBtn) clearBtn.click();
          
          
          
          
          const rCoords = [
            
            2*16+3, 2*16+4,  2*16+9, 2*16+10,
            
            3*16+2, 3*16+3, 3*16+4, 3*16+5,  3*16+8, 3*16+9, 3*16+10, 3*16+11,
            
            4*16+2, 4*16+3, 4*16+4, 4*16+5, 4*16+6, 4*16+7, 4*16+8, 4*16+9, 4*16+10, 4*16+11,
            
            5*16+3, 5*16+4, 5*16+5, 5*16+6, 5*16+7, 5*16+8, 5*16+9, 5*16+10,
            
            6*16+4, 6*16+5, 6*16+6, 6*16+7, 6*16+8, 6*16+9,
            
            7*16+5, 7*16+6, 7*16+7, 7*16+8,
            
            8*16+6, 8*16+7,
            
            9*16+7
          ];
          
          const cells = document.querySelectorAll('.pixel-cell');
          rCoords.forEach((coordIndex, idx) => {
            const id = setTimeout(() => {
              if (!demoActive) return;
              if (cells[coordIndex]) {
                cells[coordIndex].style.backgroundColor = activeDrawColor;
                playSound('hover');
              }
            }, idx * 100);
            demoTimeoutIds.push(id);
          });
        }
      },
      
      {
        delay: 16500,
        action: () => {
          stopDemo();
          const hero = document.getElementById('hero');
          if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    ];

    steps.forEach(step => {
      const id = setTimeout(() => {
        if (demoActive) step.action();
      }, step.delay);
      demoTimeoutIds.push(id);
    });
  }

  function autoTypeTerminalCommand(cmd) {
    if (!terminalInput) return;
    terminalInput.focus();
    let index = 0;
    terminalInput.value = '';
    
    function typeChar() {
      if (!demoActive) return;
      if (index < cmd.length) {
        terminalInput.value += cmd[index];
        index++;
        playSound('hover');
        const id = setTimeout(typeChar, 100);
        demoTimeoutIds.push(id);
      } else {
        const id = setTimeout(() => {
          if (!demoActive) return;
          const enterEvent = new KeyboardEvent('keydown', {
            bubbles: true, cancelable: true, key: 'Enter', code: 'Enter'
          });
          terminalInput.dispatchEvent(enterEvent);
          playSound('click');
        }, 300);
        demoTimeoutIds.push(id);
      }
    }
    typeChar();
  }

  function stopDemo() {
    demoActive = false;
    demoTimeoutIds.forEach(id => clearTimeout(id));
    demoTimeoutIds = [];
    
    const banner = document.getElementById('demo-banner');
    if (banner) banner.classList.remove('active');
    
    document.querySelectorAll('.demo-highlight').forEach(el => {
      el.classList.remove('demo-highlight');
    });
  }

  const demoToggleBtn = document.getElementById('demo-toggle');
  if (demoToggleBtn) {
    demoToggleBtn.addEventListener('click', () => {
      playSound('success');
      startDemo();
    });
  }

  
  
  

  
  const createParticle = (x, y) => {
    const particle = document.createElement('div');
    particle.className = 'gesture-particle';
    
    const colors = ['var(--neo-pink)', 'var(--neo-cyan)', 'var(--neo-yellow)', 'var(--neo-green)', 'var(--neo-orange)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 15 + 10; 
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x - size/2}px`;
    particle.style.top = `${y - size/2}px`;
    particle.style.backgroundColor = randomColor;
    
    const shapes = ['50%', '0%', 'polygon(50% 0%, 0% 100%, 100% 100%)'];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    if (randomShape.startsWith('polygon')) {
      particle.style.clipPath = randomShape;
    } else {
      particle.style.borderRadius = randomShape;
    }
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 700);
  };

  let lastMove = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastMove > 50) { 
      createParticle(e.pageX, e.pageY);
      lastMove = now;
    }
  });

  window.addEventListener('touchmove', (e) => {
    const now = Date.now();
    if (now - lastMove > 50 && e.touches.length > 0) {
      createParticle(e.touches[0].pageX, e.touches[0].pageY);
      lastMove = now;
    }
  }, { passive: true });

  window.addEventListener('click', (e) => {
    if (
      e.target.closest('#pixel-grid') || 
      e.target.closest('button') || 
      e.target.closest('a') || 
      e.target.closest('input') || 
      e.target.closest('textarea')
    ) return;
    
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 40 + 10;
        const x = e.pageX + Math.cos(angle) * distance;
        const y = e.pageY + Math.sin(angle) * distance;
        createParticle(x, y);
      }, i * 20);
    }
  });

  
  const revealElements = document.querySelectorAll('.neo-card, .timeline-card, .featured-card, .neo-window, .section-header');
  revealElements.forEach(el => el.classList.add('reveal-init'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
