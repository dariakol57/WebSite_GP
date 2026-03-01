// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
    // --- Dynamic UI Injection ---
    let appRoot = document.getElementById('app-root');
    let oldContainer = document.querySelector('.container');

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
                        <div id="sidebar-friends-list">Loading...</div>
                    </div>
                    <div class="sidebar-section">
                        <h3>Сохраненные</h3>
                        <div id="sidebar-saved-list">Loading...</div>
                    </div>
                    <div id="sidebar-requests-container" class="sidebar-section" style="display:none;">
                        <h3>Заявки в друзья</h3>
                        <div id="sidebar-requests-list">Loading...</div>
                    </div>
                </div>
            </div>
            <div id="sidebar-overlay" class="sidebar-overlay"></div>

            <div class="container">
                <header class="glass-panel profile-header" style="position: relative;">
                    <button id="open-sidebar-btn" class="icon-btn" style="position: absolute; top: 20px; left: 20px; font-size: 1.5rem;">&#9776;</button>
                    <div class="profile-photo-wrapper">
                        <img id="profile-photo" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400" alt="Profile Photo">
                    </div>
                    <div class="profile-info" style="display: flex; flex-direction: column; justify-content: center;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                            <h1 class="profile-name" id="page-title" contenteditable="true" spellcheck="false" style="margin: 0;">Loading...</h1>
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
                            Loading description...
                        </div>
                    </div>
                </header>

                <div class="top-controls" style="flex-wrap: wrap; gap: 10px;">
                    <div id="owner-controls" style="display: flex; gap: 10px; flex-wrap: wrap; display: none;">
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
                    </div>
                </div>

                <div id="main-container" class="sections-container">
                    <!-- Sections and persons will be loaded here -->
                </div>
            </div>
        `;
    }

    const container = document.getElementById('main-container');
    const peopleContainer = document.getElementById('main-container');
    const saveBtn = document.getElementById('save-btn');
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

    // --- Data Fetching & Auth ---

    const { data: { user } } = await supabase.auth.getUser();

    let currentUsername = null;
    let currentUserProfileObj = null;

    if (user) {
        const { data: myProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (myProfile) {
            currentUsername = myProfile.username;
            currentUserProfileObj = myProfile;
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    let pageOwnerId = urlParams.get('user') || currentUsername;

    if (!pageOwnerId) {
        // Not logged in and no user requested
        window.location.href = 'index.html';
        return;
    }

    const { data: targetProfile, error: profileError } = await supabase.from('profiles').select('*').eq('username', pageOwnerId).single();

    if (profileError || !targetProfile) {
        alert("User profile not found.");
        if (currentUsername) {
            window.location.href = 'profile.html?user=' + currentUsername;
        } else {
            window.location.href = 'index.html';
        }
        return;
    }

    const isOwner = Boolean(currentUsername) && currentUsername === pageOwnerId;

    let pageData = {
        title: targetProfile.first_name ? `${targetProfile.first_name} ${targetProfile.last_name || ''}`.trim() : targetProfile.username,
        about: targetProfile.about || 'Кто я?',
        photo: targetProfile.photo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
        sections: [],
        sectionVisibility: {},
        ownerId: targetProfile.username,
        id: targetProfile.id
    };

    let sectionsById = {};

    // Fetch sections
    const { data: sectionsData } = await supabase.from('sections').select('*').eq('profile_id', targetProfile.id).order('created_at', { ascending: true });

    if (sectionsData && sectionsData.length > 0) {
        sectionsData.forEach(s => {
            pageData.sections.push(s.name);
            pageData.sectionVisibility[s.name] = s.visibility;
            sectionsById[s.name] = s.id;
        });
    } else {
        pageData.sections = ['Альбом замечательных людей'];
        pageData.sectionVisibility['Альбом замечательных людей'] = 'public';
        if (isOwner) {
            const { data: newSec } = await supabase.from('sections').insert({
                profile_id: targetProfile.id,
                name: 'Альбом замечательных людей',
                visibility: 'public'
            }).select().single();
            if (newSec) sectionsById[newSec.name] = newSec.id;
        }
    }

    // Fetch Cards
    const { data: cardsData } = await supabase.from('cards').select('*').eq('profile_id', targetProfile.id).order('visibility'); // fallback ordering if needed
    // Ideally we order by some order index, but for simplicity let's just use what we get.

    let peopleData = [];
    if (cardsData) {
        peopleData = cardsData.map(c => {
            let sectionName = 'Альбом замечательных людей';
            const matchedSec = sectionsData?.find(s => s.id === c.section_id);
            if (matchedSec) sectionName = matchedSec.name;

            return {
                id: c.id,
                name: c.name,
                story: c.story,
                photo: c.photo_url,
                section: sectionName,
                visibility: c.visibility || 'public'
            };
        });
    }

    // Social Data Setup
    let isFriend = false;
    let isSavedByMe = false;

    if (currentUsername) {
        // check friendship
        const { data: friendship1 } = await supabase.from('friends').select('*')
            .eq('requester_id', currentUserProfileObj.id)
            .eq('target_id', targetProfile.id).single();
        const { data: friendship2 } = await supabase.from('friends').select('*')
            .eq('requester_id', targetProfile.id)
            .eq('target_id', currentUserProfileObj.id).single();

        let friendship = friendship1 || friendship2;
        if (friendship) {
            if (friendship.status === 'accepted') isFriend = true;
            if (friendship.status === 'pending' && friendship.requester_id === currentUserProfileObj.id) {
                isSavedByMe = true;
            }
        }
    }

    // Apply saved data
    titleEl.innerHTML = pageData.title;
    aboutEl.innerHTML = pageData.about;
    if (pageData.photo) profilePhotoEl.src = pageData.photo;

    // Visibility Check
    function canView(visibility) {
        if (isOwner) return true;
        if (visibility === 'owner') return false;
        if (visibility === 'friends' && !isFriend) return false;
        return true;
    }

    function canViewSection(sectionName) {
        const secVis = pageData.sectionVisibility[sectionName] || 'public';
        return canView(secVis);
    }

    // Role-based UI setup
    if (!isOwner) {
        document.getElementById('owner-controls').style.display = 'none';
        titleEl.contentEditable = "false";
        aboutEl.contentEditable = "false";
        profilePhotoEl.style.cursor = "default";
        profilePhotoEl.title = "";

        if (currentUsername && currentUsername !== pageOwnerId) {
            const addFriendBtn = document.getElementById('add-friend-btn');
            if (addFriendBtn) {
                addFriendBtn.style.display = 'inline-flex';

                if (isFriend) {
                    addFriendBtn.innerText = 'Friends';
                    addFriendBtn.disabled = true;
                    addFriendBtn.style.opacity = '0.5';
                    addFriendBtn.style.cursor = 'default';
                } else if (isSavedByMe) {
                    addFriendBtn.innerText = 'Request Sent';
                    addFriendBtn.disabled = true;
                    addFriendBtn.style.opacity = '0.5';
                    addFriendBtn.style.cursor = 'default';
                } else {
                    addFriendBtn.innerText = 'Add Friend';
                    addFriendBtn.onclick = async () => {
                        addFriendBtn.disabled = true;
                        addFriendBtn.innerText = 'Sending...';
                        await supabase.from('friends').insert({
                            requester_id: currentUserProfileObj.id,
                            target_id: targetProfile.id,
                            status: 'pending'
                        });
                        alert('Friend request sent!');
                        location.reload();
                    };
                }
            }
        }
    } else {
        document.getElementById('owner-controls').style.display = 'flex';

        if (addGlobalPersonBtn) {
            addGlobalPersonBtn.onclick = async () => {
                let defaultSec = pageData.sections.length > 0 ? pageData.sections[0] : 'Альбом замечательных людей';
                const sectionId = sectionsById[defaultSec];

                const { data: newCard } = await supabase.from('cards').insert({
                    profile_id: targetProfile.id,
                    section_name: defaultSec,
                    name: '',
                    story: '',
                    photo_url: '',
                    visibility: 'public'
                }).select().single();

                if (newCard) {
                    peopleData.unshift({ id: newCard.id, name: '', story: '', photo: '', section: defaultSec, visibility: 'public' });
                    renderAll();
                }
            };
        }

        if (addSectionBtn) {
            addSectionBtn.onclick = async () => {
                const presets = ['музыканты', 'знакомые', 'любимчики', 'учителя'];
                let name = prompt(`Enter section name or choose from: ${presets.join(', ')}`);
                if (name !== null) {
                    name = name.trim();
                    if (name && !pageData.sections.includes(name)) {
                        let vis = prompt('Set visibility for this section: "public", "friends", or "owner" (default is public)', 'public');
                        if (vis) vis = vis.trim().toLowerCase();
                        if (!['public', 'friends', 'owner'].includes(vis)) vis = 'public';

                        const { data: newSec } = await supabase.from('sections').insert({
                            profile_id: targetProfile.id,
                            name: name,
                            visibility: vis
                        }).select().single();

                        if (newSec) {
                            pageData.sections.push(name);
                            pageData.sectionVisibility[name] = vis;
                            sectionsById[name] = newSec.id;
                            renderAll();
                        }
                    } else if (pageData.sections.includes(name)) {
                        alert('A section with this name already exists.');
                    }
                }
            };
        }

        // Auto-save debouncing for title and about
        let saveTimeout;
        const debouncedSave = () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveAll, 1000);
        };

        titleEl.addEventListener('input', debouncedSave);
        aboutEl.addEventListener('input', debouncedSave);

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
            reader.onload = async () => {
                profilePhotoEl.src = reader.result;
                pageData.photo = reader.result;
                profileImgInput.value = '';
                await saveAll();
            };
            reader.readAsDataURL(file);
        });

        if (saveBtn) saveBtn.addEventListener('click', saveAll);
    }

    // Search logic
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.onclick = () => {
            const val = document.getElementById('search-input').value.trim();
            if (val) {
                window.location.href = 'profile.html?user=' + encodeURIComponent(val);
            }
        };
    }

    async function saveAll() {
        if (!isOwner) return;

        if (saveBtn) {
            saveBtn.innerHTML = 'Saving...';
            saveBtn.disabled = true;
        }

        pageData.title = titleEl.innerHTML;
        pageData.about = aboutEl.innerHTML;
        pageData.photo = profilePhotoEl.src;

        await supabase.from('profiles').update({
            about: pageData.about,
            photo_url: pageData.photo
        }).eq('id', targetProfile.id);

        for (let i = 0; i < peopleData.length; i++) {
            const p = peopleData[i];
            const secId = sectionsById[p.section];
            if (p.id) {
                await supabase.from('cards').update({
                    name: p.name,
                    story: p.story,
                    photo_url: p.photo,
                    section_id: secId,
                    visibility: p.visibility
                }).eq('id', p.id);
            }
        }

        if (saveBtn) {
            const originalText = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <polyline points="17 21 17 13 7 13 7 21" />
                                <polyline points="7 3 7 8 15 8" />
                            </svg>
                            Save
                        `;
            saveBtn.innerHTML = `✅ Saved!`;
            saveBtn.disabled = false;
            setTimeout(() => saveBtn.innerHTML = originalText, 1500);
        }
    }

    function resizeTextarea(el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }

    function renderAll() {
        peopleContainer.innerHTML = '';

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
                    sel.addEventListener('change', async (e) => {
                        const newVal = e.target.value;
                        pageData.sectionVisibility[section] = newVal;
                        await supabase.from('sections').update({ visibility: newVal }).eq('id', sectionsById[section]);
                    });
                }
                const addP = secHeader.querySelector('.add-person-btn');
                if (addP) {
                    addP.addEventListener('click', async () => {
                        const { data: newCard } = await supabase.from('cards').insert({
                            profile_id: targetProfile.id,
                            section_name: section,
                            name: '',
                            story: '',
                            photo_url: '',
                            visibility: 'public'
                        }).select().single();

                        if (newCard) {
                            peopleData.unshift({ id: newCard.id, name: '', story: '', photo: '', section: section, visibility: 'public' });
                            renderAll();
                        }
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

            let cardSaveTimeout;
            const debouncedCardSave = () => {
                clearTimeout(cardSaveTimeout);
                cardSaveTimeout = setTimeout(saveAll, 1000);
            };

            fileInput.addEventListener('change', () => {
                const file = fileInput.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    img.src = reader.result;
                    peopleData[index].photo = reader.result;
                    fileInput.value = '';
                    saveAll(); // immediate save for image
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

            nameInput.addEventListener('input', () => {
                peopleData[index].name = nameInput.value;
                debouncedCardSave();
            });
            storyInput.addEventListener('input', () => {
                peopleData[index].story = storyInput.value;
                if (card.classList.contains('expanded')) resizeTextarea(storyInput);
                debouncedCardSave();
            });

            visSelect.addEventListener('change', (e) => {
                peopleData[index].visibility = e.target.value;
                saveAll();
            });

            card.querySelectorAll('.icon-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    if (action === 'delete') {
                        if (confirm('Delete this person?')) {
                            // delete from DB
                            if (peopleData[index].id) {
                                await supabase.from('cards').delete().eq('id', peopleData[index].id);
                            }
                            peopleData.splice(index, 1);
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

    async function renderSidebar() {
        const friendsList = document.getElementById('sidebar-friends-list');
        const savedList = document.getElementById('sidebar-saved-list');
        const reqsList = document.getElementById('sidebar-requests-list');
        const reqsContainer = document.getElementById('sidebar-requests-container');

        if (!friendsList || !savedList || !reqsList) return;
        if (!currentUsername || !currentUserProfileObj) {
            friendsList.innerHTML = '<div style="color:var(--text-secondary); padding: 10px;">Please login</div>';
            savedList.innerHTML = '<div style="color:var(--text-secondary); padding: 10px;">Please login</div>';
            return;
        }

        friendsList.innerHTML = 'Loading...';
        savedList.innerHTML = 'Loading...';

        // Fetch accepted friends
        const { data: friends1 } = await supabase.from('friends').select('profiles!friends_user_id_2_fkey(username, first_name)').eq('user_id_1', currentUserProfileObj.id).eq('status', 'accepted');
        const { data: friends2 } = await supabase.from('friends').select('profiles!friends_user_id_1_fkey(username, first_name)').eq('user_id_2', currentUserProfileObj.id).eq('status', 'accepted');

        let myFriends = [
            ...(friends1?.map(f => f.profiles.username) || []),
            ...(friends2?.map(f => f.profiles.username) || [])
        ];

        // Fetch sent requests
        const { data: sentReqs } = await supabase.from('friends').select('profiles!friends_target_id_fkey(username)').eq('requester_id', currentUserProfileObj.id).eq('status', 'pending');
        let mySaved = sentReqs?.map(req => req.profiles.username) || [];

        // Fetch received requests
        const { data: receivedReqs } = await supabase.from('friends').select('profiles!friends_requester_id_fkey(username)').eq('target_id', currentUserProfileObj.id).eq('status', 'pending');
        let myReqs = receivedReqs?.map(req => req.profiles.username) || [];

        // Render Friends
        friendsList.innerHTML = myFriends.map(f => `
            <div class="sidebar-item">
                <span class="sidebar-item-name" onclick="window.location.href='profile.html?user=${f}'">${f.replace(/_/g, ' ')}</span>
            </div>
        `).join('') || '<div style="color:var(--text-secondary); padding: 10px;">No friends yet</div>';

        // Render Saved
        savedList.innerHTML = mySaved.map(s => `
            <div class="sidebar-item">
                <span class="sidebar-item-name" onclick="window.location.href='profile.html?user=${s}'">${s.replace(/_/g, ' ')}</span>
            </div>
        `).join('') || '<div style="color:var(--text-secondary); padding: 10px;">No saved users</div>';

        // Render Requests
        if (myReqs.length > 0) {
            reqsContainer.style.display = 'block';
            reqsList.innerHTML = myReqs.map(r => `
                <div class="sidebar-item">
                    <span class="sidebar-item-name" onclick="window.location.href='profile.html?user=${r}'">${r.replace(/_/g, ' ')}</span>
                    <button class="btn btn-primary" style="padding: 2px 8px; font-size: 0.8rem;" onclick="acceptRequest('${r}')">Accept</button>
                </div>
            `).join('');
        } else {
            reqsContainer.style.display = 'none';
        }
    }

    window.acceptRequest = async function (requesterUsername) {
        if (!currentUsername || !currentUserProfileObj) return;

        // Find the request and update its status
        const { data: requesterProfile } = await supabase.from('profiles').select('id').eq('username', requesterUsername).single();

        if (requesterProfile) {
            await supabase.from('friends').update({ status: 'accepted' })
                .eq('requester_id', requesterProfile.id)
                .eq('target_id', currentUserProfileObj.id);

            alert('Friend request accepted!');
            renderSidebar();
            if (pageOwnerId === requesterUsername) {
                location.reload();
            }
        }
    };

    renderAll();
});
