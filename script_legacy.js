document.addEventListener('DOMContentLoaded', () => {
    // --- Dynamic UI Injection ---
    let appRoot = document.getElementById('app-root');
    let oldContainer = document.querySelector('.container');

    // If an old hardcoded container exists (from previous exports), replace it.
    if (oldContainer && !appRoot) {
        appRoot = document.createElement('div');
        appRoot.id = 'app-root';
        oldContainer.parentNode.insertBefore(appRoot, oldContainer);
        oldContainer.remove();
    }

    if (appRoot) {
        appRoot.innerHTML = `
            <!-- Sidebar -->
            <div id="sidebar" class="sidebar">
                <div class="sidebar-header">
                    <h2>Меню</h2>
                    <button id="close-sidebar-btn" class="icon-btn">&times;</button>
                </div>
                <div class="sidebar-content">
                    <div class="sidebar-section">
                        <h3>Мои друзья</h3>
                        <div id="sidebar-friends-list"></div>
                    </div>
                    <div class="sidebar-section">
                        <h3>Сохраненные</h3>
                        <div id="sidebar-saved-list"></div>
                    </div>
                    <div id="sidebar-requests-container" class="sidebar-section" style="display:none;">
                        <h3>Заявки в друзья</h3>
                        <div id="sidebar-requests-list"></div>
                    </div>
                </div>
            </div>
            <!-- Overlay -->
            <div id="sidebar-overlay" class="sidebar-overlay"></div>

            <div class="container">
                <header class="glass-panel profile-header" style="position: relative;">
                    <button id="open-sidebar-btn" class="icon-btn" style="position: absolute; top: 20px; left: 20px; font-size: 1.5rem;">&#9776;</button>
                    <div class="profile-photo-wrapper">
                        <img id="profile-photo" src="https://i.postimg.cc/vH77856W/20260222-171840.jpg" alt="Profile Photo">
                    </div>
                    <div class="profile-info" style="display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                            <h1 class="profile-name" id="page-title" contenteditable="true" spellcheck="false" style="margin: 0;">Your Name</h1>
                            <div id="viewer-controls" style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end;">
                                <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
                                    <input type="text" id="search-input" placeholder="Имя (e.g. Da_Ko)"
                                        style="padding: 8px 12px; border-radius: 6px; background: rgba(0,0,0,0.5); color: white; border: 1px solid rgba(255,255,255,0.2); outline: none; width: 150px;">
                                    <button id="search-btn" class="btn btn-secondary">Search</button>
                                </div>
                                <button id="add-friend-btn" class="btn btn-primary" style="display: none; width: 100%;">Add Friend</button>
                            </div>
                        </div>
                        <div class="profile-about" id="page-about" contenteditable="true" spellcheck="false" style="margin-top: 15px;">
                            Who am I? <br>
                            What is important to me?
                        </div>
                    </div>
                </header>

                <div class="top-controls" style="flex-wrap: wrap; gap: 10px;">
                    <div id="owner-controls" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <button id="add-global-person-btn" class="btn btn-primary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add Person
                        </button>
                        <button id="add-section-btn" class="btn btn-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add Section
                        </button>
                        <button id="save-btn" class="btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            Save
                        </button>
                        <button id="export-btn" class="btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2-2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Export Album
                        </button>
                    </div>
                </div>

                <div id="main-container" class="sections-container">
                    <!-- Sections and persons will be loaded here -->
                </div>
            </div>
        `;
    }
    // ----------------------------

    // Now safely select these elements because they were just injected (or exist in Users/index.html or template.html)
    const container = document.getElementById('main-container') || document.querySelector('.container'); // Fallback for very old setups
    const peopleContainer = document.getElementById('main-container') || document.getElementById('people-container');
    const saveBtn = document.getElementById('save-btn');
    const exportBtn = document.getElementById('export-btn');
    const addSectionBtn = document.getElementById('add-section-btn');
    const addGlobalPersonBtn = document.getElementById('add-global-person-btn');

    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (openSidebarBtn && sidebar && sidebarOverlay) {
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('show');
            renderSidebar();
        });

        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
        });
    }

    const titleEl = document.getElementById('page-title');
    const aboutEl = document.getElementById('page-about');
    const profilePhotoEl = document.getElementById('profile-photo');

    const icons = {
        up: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`,
        down: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`,
        trash: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        image: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
        link: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
        plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
    };

    let pageData = JSON.parse(localStorage.getItem('antisite_pageData')) || {
        title: titleEl.innerHTML,
        about: aboutEl.innerHTML,
        photo: profilePhotoEl.src,
        ownerId: '',
        sections: ['Альбом замечательных людей'],
        friends: []
    };

    let peopleData = JSON.parse(localStorage.getItem('antisite_peopleData')) || [];

    // Optional Export script handling
    const exportDataScript = document.getElementById('export-data-script');
    if (exportDataScript && exportDataScript.dataset.page) {
        try {
            pageData = JSON.parse(exportDataScript.dataset.page);
            peopleData = JSON.parse(exportDataScript.dataset.people);
        } catch (e) { }
    }

    if (!pageData.sections || pageData.sections.length === 0) {
        pageData.sections = ['Альбом замечательных людей'];
    } else if (pageData.sections.includes('')) {
        // Migrate legacy empty sections to default name
        pageData.sections = pageData.sections.map(s => s === '' ? 'Альбом замечательных людей' : s);

        // Migrate section visibility if any
        if (pageData.sectionVisibility && pageData.sectionVisibility[''] !== undefined) {
            pageData.sectionVisibility['Альбом замечательных людей'] = pageData.sectionVisibility[''];
            delete pageData.sectionVisibility[''];
        }

        // Deduplicate sections after migration
        pageData.sections = [...new Set(pageData.sections)];
    }

    // Always ensure people in legacy empty sections are reassigned
    peopleData.forEach(p => {
        if (!p.section || p.section === '') {
            p.section = 'Альбом замечательных людей';
        }
    });

    if (!pageData.friends) pageData.friends = [];

    const inUsersFolder = window.location.pathname.includes('/Users/');
    function getPageUrl(username) {
        const clean = username.replace(/\s+/g, '_');
        return (inUsersFolder ? '' : 'Users/') + clean + '_antisite.html';
    }

    // Apply saved data
    titleEl.innerHTML = pageData.title;
    aboutEl.innerHTML = pageData.about;
    if (pageData.photo) profilePhotoEl.src = pageData.photo;

    const currentUser = localStorage.getItem('antisite_currentUser');

    let pageOwnerId = pageData.ownerId;
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop();
    if (filename && filename.includes('_antisite.html')) {
        const urlOwner = decodeURIComponent(filename.replace('_antisite.html', ''));
        if (urlOwner) {
            pageOwnerId = urlOwner;
        }
    }

    if (pageOwnerId && pageData.ownerId && pageOwnerId !== pageData.ownerId) {
        pageData.title = pageOwnerId.replace(/_/g, ' ');
        pageData.about = "No description";
        pageData.photo = "https://i.postimg.cc/vH77856W/20260222-171840.jpg";
        pageData.sections = ['Альбом замечательных людей'];
        pageData.ownerId = pageOwnerId;
        pageData.friends = [];
        peopleData = [];
    }

    const isOwner = Boolean(currentUser) && currentUser === pageOwnerId;
    let currentUserFriends = JSON.parse(localStorage.getItem('antisite_friends_' + currentUser)) || [];
    const isFriend = currentUserFriends.includes(pageOwnerId) || (pageData.friends && pageData.friends.includes(currentUser));

    // Visibility Check
    function canView(visibility) {
        if (isOwner) return true;
        if (visibility === 'owner') return false;
        if (visibility === 'friends' && !isFriend) return false;
        return true;
    }

    function canViewSection(sectionName) {
        const secVis = pageData.sectionVisibility || {};
        return canView(secVis[sectionName] || 'public');
    }

    // Role-based UI setup
    if (!isOwner) {
        if (document.getElementById('owner-controls')) document.getElementById('owner-controls').style.display = 'none';
        titleEl.contentEditable = "false";
        aboutEl.contentEditable = "false";
        profilePhotoEl.style.cursor = "default";
        profilePhotoEl.title = "";

        if (currentUser && currentUser !== pageOwnerId) {
            const addFriendBtn = document.getElementById('add-friend-btn');
            if (addFriendBtn) {
                let savedList = JSON.parse(localStorage.getItem('antisite_saved_' + currentUser)) || [];
                let isSaved = savedList.includes(pageOwnerId);

                addFriendBtn.style.display = 'inline-flex';

                if (isFriend) {
                    addFriendBtn.innerText = 'Friends';
                    addFriendBtn.disabled = true;
                    addFriendBtn.style.opacity = '0.5';
                    addFriendBtn.style.cursor = 'default';
                } else if (isSaved) {
                    addFriendBtn.innerText = 'Saved (Req Sent)';
                    addFriendBtn.disabled = true;
                    addFriendBtn.style.opacity = '0.5';
                    addFriendBtn.style.cursor = 'default';
                } else {
                    addFriendBtn.innerText = 'Add Friend';
                    addFriendBtn.onclick = () => {
                        // Add to my saved list
                        savedList.push(pageOwnerId);
                        localStorage.setItem('antisite_saved_' + currentUser, JSON.stringify(savedList));

                        // Send request to target
                        let targetReqs = JSON.parse(localStorage.getItem('antisite_requests_' + pageOwnerId)) || [];
                        if (!targetReqs.includes(currentUser)) {
                            targetReqs.push(currentUser);
                            localStorage.setItem('antisite_requests_' + pageOwnerId, JSON.stringify(targetReqs));
                        }

                        alert('Friend request sent and user saved!');
                        location.reload();
                    };
                }
            }
        }
    } else {
        if (addGlobalPersonBtn) {
            addGlobalPersonBtn.onclick = () => {
                let defaultSec = 'Альбом замечательных людей';
                if (!pageData.sections.includes(defaultSec)) {
                    defaultSec = pageData.sections.length > 0 ? pageData.sections[0] : 'Альбом замечательных людей';
                    if (!pageData.sections.includes(defaultSec)) {
                        pageData.sections.unshift(defaultSec);
                    }
                }
                const section = defaultSec;
                peopleData.unshift({ name: '', story: '', photo: '', section: section, visibility: 'public' });
                saveAll();
                renderAll();
            };
        }

        if (addSectionBtn) {
            addSectionBtn.onclick = () => {
                const presets = ['музыканты', 'знакомые', 'любимчики', 'учителя'];
                let name = prompt(`Enter section name or choose from: ${presets.join(', ')}`);
                if (name !== null) {
                    name = name.trim();
                    if (name && !pageData.sections.includes(name)) {
                        let vis = prompt('Set visibility for this section: "public", "friends", or "owner" (default is public)', 'public');
                        if (vis) vis = vis.trim().toLowerCase();
                        if (!['public', 'friends', 'owner'].includes(vis)) vis = 'public';

                        pageData.sections.push(name);
                        if (!pageData.sectionVisibility) pageData.sectionVisibility = {};
                        pageData.sectionVisibility[name] = vis;

                        saveAll();
                        renderAll();
                    } else if (pageData.sections.includes(name)) {
                        alert('A section with this name already exists.');
                    }
                }
            };
        }
    }

    // Search logic
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.onclick = () => {
            const val = document.getElementById('search-input').value.trim();
            if (val) {
                window.location.href = getPageUrl(val);
            }
        };
    }

    if (isOwner) {
        titleEl.addEventListener('input', saveAll);
        aboutEl.addEventListener('input', saveAll);

        const profileImgInput = document.createElement('input');
        profileImgInput.type = 'file';
        profileImgInput.accept = 'image/*';
        profileImgInput.style.display = 'none';
        document.body.appendChild(profileImgInput);

        profilePhotoEl.style.cursor = 'pointer';
        profilePhotoEl.title = "Click to change profile picture";
        profilePhotoEl.addEventListener('click', () => profileImgInput.click());

        profileImgInput.addEventListener('change', () => {
            const file = profileImgInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                profilePhotoEl.src = reader.result;
                saveAll();
                profileImgInput.value = '';
            };
            reader.readAsDataURL(file);
        });

        if (saveBtn) saveBtn.addEventListener('click', saveAll);
        if (exportBtn) exportBtn.addEventListener('click', exportAlbum);
    }

    function saveAll() {
        if (!isOwner) return;

        pageData.title = titleEl.innerHTML;
        pageData.about = aboutEl.innerHTML;
        pageData.photo = profilePhotoEl.src;

        localStorage.setItem('antisite_pageData', JSON.stringify(pageData));
        localStorage.setItem('antisite_peopleData', JSON.stringify(peopleData));

        if (saveBtn && isOwner) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = `✅ Saved!`;
            setTimeout(() => saveBtn.innerHTML = originalText, 1500);
        }
    }

    function resizeTextarea(el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }

    function renderAll() {
        peopleContainer.innerHTML = '';
        if (!pageData.sectionVisibility) pageData.sectionVisibility = {};

        pageData.sections.forEach(section => {
            if (!canViewSection(section)) return;

            const sectionEl = document.createElement('div');
            sectionEl.className = 'section-container';
            sectionEl.style.width = '100%';
            sectionEl.style.marginBottom = '30px';

            const headerHTML = section ? `
                <div style="width: 100%; border-bottom: 2px solid rgba(255,255,255,0.2); margin-bottom: 10px; padding-bottom: 5px;">
                    <h2 class="section-title" style="margin: 0;">${section}</h2>
                </div>
            ` : '';

            let visSelectHTML = '';
            if (isOwner) {
                const curVis = pageData.sectionVisibility[section] || 'public';
                visSelectHTML = `
                    <select class="sec-vis-select" data-section="${section}" style="margin-left:auto; background:rgba(0,0,0,0.5); color:white; border:none; padding:5px; border-radius:5px;">
                        <option value="public" ${curVis === 'public' ? 'selected' : ''}>Public</option>
                        <option value="friends" ${curVis === 'friends' ? 'selected' : ''}>Friends Only</option>
                        <option value="owner" ${curVis === 'owner' ? 'selected' : ''}>Owner Only</option>
                    </select>
                 `;
            }

            let addBtnHTML = isOwner ? `
                <button class="btn btn-primary add-person-btn" data-section="${section}" style="padding: 5px 10px; font-size: 0.9rem; margin-left: ${section ? '10px' : '0'};">
                    ${icons.plus} ${section ? 'Add Person' : 'Add Person'}
                </button>
            ` : '';

            const secHeader = document.createElement('div');
            secHeader.style.display = 'flex';
            secHeader.style.flexDirection = 'column';
            secHeader.style.marginBottom = '15px';

            const controlsRow = document.createElement('div');
            controlsRow.style.display = 'flex';
            controlsRow.style.alignItems = 'center';
            controlsRow.style.width = '100%';
            controlsRow.innerHTML = `${addBtnHTML} ${visSelectHTML}`;

            secHeader.innerHTML = headerHTML;
            if (isOwner) secHeader.appendChild(controlsRow);

            if (isOwner) {
                const sel = secHeader.querySelector('.sec-vis-select');
                if (sel) {
                    sel.addEventListener('change', (e) => {
                        pageData.sectionVisibility[section] = e.target.value;
                        saveAll();
                    });
                }
                const addP = secHeader.querySelector('.add-person-btn');
                if (addP) {
                    addP.addEventListener('click', () => {
                        peopleData.unshift({ name: '', story: '', photo: '', section: section, visibility: 'public' });
                        saveAll();
                        renderAll();
                    });
                }
            }

            sectionEl.appendChild(secHeader);

            const grid = document.createElement('div');
            grid.className = 'people-grid';
            grid.style.width = '100%';

            peopleData.forEach((person, index) => {
                const pSec = person.section || '';
                if (pSec === section && canView(person.visibility || 'public')) {
                    createPersonCard(person, index, grid);
                }
            });

            sectionEl.appendChild(grid);
            peopleContainer.appendChild(sectionEl);
        });
    }

    function createPersonCard(person, index, container) {
        const card = document.createElement('div');
        card.className = 'glass-panel person-card';
        const fileInputId = `file-upload-${index}`;

        const isOwnerControls = isOwner ? `
            <div class="card-controls" style="display:flex; align-items:center; width:100%; margin-top:10px; gap:8px;">
                <select class="item-vis-select" style="height:36px; flex-grow:1; background:rgba(0,0,0,0.5); color:white; border:1px solid rgba(255,255,255,0.08); padding:0 10px; border-radius:8px; font-size:0.9rem; outline:none;">
                    <option value="public" ${person.visibility === 'public' ? 'selected' : ''}>Public</option>
                    <option value="friends" ${person.visibility === 'friends' ? 'selected' : ''}>Friends Only</option>
                    <option value="owner" ${person.visibility === 'owner' ? 'selected' : ''}>Owner Only</option>
                </select>
                <button class="icon-btn" data-action="up" title="Move Up">${icons.up}</button>
                <button class="icon-btn" data-action="down" title="Move Down">${icons.down}</button>
                <button class="icon-btn delete" data-action="delete" title="Delete">${icons.trash}</button>
            </div>
        ` : '';

        const photoControls = isOwner ? `
            <label class="person-photo-upload" for="${fileInputId}" title="Change Photo">
                ${icons.image}
            </label>
            <button class="person-photo-url" title="Photo from URL">
                ${icons.link}
            </button>
            <input type="file" id="${fileInputId}" accept="image/*">
        ` : '';

        card.innerHTML = `
            <div class="person-photo-container">
                <img src="${person.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}" alt="Person">
                ${photoControls}
            </div>
            
            <div class="person-info">
                <input type="text" placeholder="Legendary Name" value="${(person.name || '').replace(/"/g, '&quot;')}" ${isOwner ? '' : 'readonly'}>
                <textarea placeholder="Why is this person's story great?" ${isOwner ? '' : 'readonly'}>${(person.story || '')}</textarea>
                ${isOwnerControls}
            </div>
        `;

        if (isOwner) {
            const img = card.querySelector('img');
            const fileInput = card.querySelector('input[type="file"]');
            const urlBtn = card.querySelector('.person-photo-url');
            const nameInput = card.querySelector('input[type="text"]');
            const storyInput = card.querySelector('textarea');
            const visSelect = card.querySelector('.item-vis-select');

            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    img.src = reader.result;
                    peopleData[index].photo = reader.result;
                    fileInput.value = '';
                    saveAll();
                };
                reader.readAsDataURL(file);
            });

            urlBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const url = prompt("Enter image URL:");
                if (url && url.trim() !== '') {
                    img.src = url.trim();
                    peopleData[index].photo = url.trim();
                    saveAll();
                }
            });

            nameInput.addEventListener('input', () => { peopleData[index].name = nameInput.value; });
            storyInput.addEventListener('input', () => {
                peopleData[index].story = storyInput.value;
                if (card.classList.contains('expanded')) resizeTextarea(storyInput);
            });

            visSelect.addEventListener('change', (e) => {
                peopleData[index].visibility = e.target.value;
                saveAll();
            });

            card.querySelectorAll('.icon-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    if (action === 'delete') {
                        if (confirm('Delete this person?')) {
                            peopleData.splice(index, 1);
                            saveAll();
                            renderAll();
                        }
                    }
                    if (action === 'up' && index > 0) {
                        [peopleData[index - 1], peopleData[index]] = [peopleData[index], peopleData[index - 1]];
                        saveAll();
                        renderAll();
                    }
                    if (action === 'down' && index < peopleData.length - 1) {
                        [peopleData[index + 1], peopleData[index]] = [peopleData[index], peopleData[index + 1]];
                        saveAll();
                        renderAll();
                    }
                });
            });
        }

        const storyInput = card.querySelector('textarea');
        card.addEventListener('click', (e) => {
            if (e.target.closest('button') || e.target.closest('.person-photo-upload') || e.target.closest('input[type="file"]') || e.target.closest('select')) {
                return;
            }

            if (!card.classList.contains('expanded')) {
                document.querySelectorAll('.person-card.expanded').forEach(c => {
                    if (c !== card) {
                        c.classList.remove('expanded');
                        const ta = c.querySelector('textarea');
                        if (ta) ta.style.height = '';
                    }
                });
                card.classList.add('expanded');
                resizeTextarea(storyInput);
                setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
            } else {
                if (!e.target.closest('input') && !e.target.closest('textarea')) {
                    card.classList.remove('expanded');
                    storyInput.style.height = '';
                }
            }
        });

        container.appendChild(card);
    }

    function renderSidebar() {
        const friendsList = document.getElementById('sidebar-friends-list');
        const savedList = document.getElementById('sidebar-saved-list');
        const reqsList = document.getElementById('sidebar-requests-list');
        const reqsContainer = document.getElementById('sidebar-requests-container');

        if (!friendsList || !savedList || !reqsList) return;
        if (!currentUser) return; // Must be logged in to have a sidebar

        const myFriends = JSON.parse(localStorage.getItem('antisite_friends_' + currentUser)) || [];
        const mySaved = JSON.parse(localStorage.getItem('antisite_saved_' + currentUser)) || [];
        const myReqs = JSON.parse(localStorage.getItem('antisite_requests_' + currentUser)) || [];

        // Render Friends
        friendsList.innerHTML = myFriends.map(f => `
            <div class="sidebar-item">
                <span class="sidebar-item-name" onclick="window.location.href='${f}_antisite.html'">${f.replace(/_/g, ' ')}</span>
            </div>
        `).join('') || '<div style="color:var(--text-secondary); padding: 10px;">No friends yet</div>';

        // Render Saved
        savedList.innerHTML = mySaved.map(s => `
            <div class="sidebar-item">
                <span class="sidebar-item-name" onclick="window.location.href='${s}_antisite.html'">${s.replace(/_/g, ' ')}</span>
            </div>
        `).join('') || '<div style="color:var(--text-secondary); padding: 10px;">No saved users</div>';

        // Render Requests
        if (myReqs.length > 0) {
            reqsContainer.style.display = 'block';
            reqsList.innerHTML = myReqs.map(r => `
                <div class="sidebar-item">
                    <span class="sidebar-item-name" onclick="window.location.href='${r}_antisite.html'">${r.replace(/_/g, ' ')}</span>
                    <button class="btn btn-primary" style="padding: 2px 8px; font-size: 0.8rem;" onclick="acceptRequest('${r}')">Accept</button>
                </div>
            `).join('');
        } else {
            reqsContainer.style.display = 'none';
        }
    }

    window.acceptRequest = function (requester) {
        if (!currentUser) return;
        // Add to friends
        let myFriends = JSON.parse(localStorage.getItem('antisite_friends_' + currentUser)) || [];
        if (!myFriends.includes(requester)) myFriends.push(requester);
        localStorage.setItem('antisite_friends_' + currentUser, JSON.stringify(myFriends));

        // Add me to requester's friends
        let theirFriends = JSON.parse(localStorage.getItem('antisite_friends_' + requester)) || [];
        if (!theirFriends.includes(currentUser)) theirFriends.push(currentUser);
        localStorage.setItem('antisite_friends_' + requester, JSON.stringify(theirFriends));

        // Remove from pending
        let myReqs = JSON.parse(localStorage.getItem('antisite_requests_' + currentUser)) || [];
        myReqs = myReqs.filter(r => r !== requester);
        localStorage.setItem('antisite_requests_' + currentUser, JSON.stringify(myReqs));

        alert('Friend request accepted!');
        renderSidebar();
        location.reload();
    };

    function exportAlbum() {
        saveAll();
        const titleText = titleEl.innerText || 'Modern_Album';

        const exportHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>\${titleText}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <div id="app-root"></div>

    <!-- Inject data directly for the standalone file -->
    <script id="export-data-script" type="application/json" data-page='\${JSON.stringify(pageData).replace(/'/g, "&apos;")}' data-people='\${JSON.stringify(peopleData).replace(/'/g, "&apos;")}'></script>
    <script src="../script.js"></script>
</body>
</html>`;

        const blob = new Blob([exportHTML], { type: 'text/html' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${titleText.replace(/\s+/g, '_')}_antisite.html`;
        a.click();
    }

    renderAll();
});
