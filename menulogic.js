/* ============================================================
   MENULOGIC.JS - Modal tipus full de paper per als menús
   Depèn de: config.js, api.js
   ============================================================ */

(function() {

    // ─── ESTRUCTURA DEL MODAL MENÚ ───────────────────────────
    if (!document.getElementById('modal-menu')) {
        document.body.insertAdjacentHTML('beforeend', `
<div id="modal-menu" style="display:none; position:fixed; top:0; left:0; 
    width:100%; height:100%; background:rgba(0,0,0,0.2); z-index:9999;
    align-items:flex-start; justify-content:center; padding:40px 20px;
    overflow-y:auto;">
    <div id="modal-menu-paper" style="
        background: #e9e2d5;
        width: 100%;
        max-width: 550px;
        border-radius: 0;
        padding: 50px 45px;
        box-shadow: -1px 2px 8px rgba(0, 0, 0, 0.8);
        font-family: Georgia, serif;
        position: relative;">
                    <button onclick="tancarModalMenu()" style="position:absolute; 
                        top:12px; right:16px; background:none; border:none; 
                        font-size:20px; cursor:pointer; color:#aaa; 
                        font-family:sans-serif;">✕</button>
                    <div id="modal-menu-contingut"></div>
                </div>
            </div>
        `);
    }

    // ─── ESTRUCTURA DEL MODAL LOGIN ──────────────────────────
    if (!document.getElementById('modal-login')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="modal-login" style="display:none; position:fixed; top:0; left:0;
                width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999;
                align-items:center; justify-content:center;">
                <div style="
                    background: #1a1a2e;
                    border: 1px solid #c8973a;
                    padding: 40px 30px;
                    width: 90%;
                    max-width: 320px;
                    text-align: center;
                    font-family: 'Segoe UI', sans-serif;">
                    <p style="color:#c8973a; letter-spacing:2px; text-transform:uppercase;
                        font-size:12px; margin-bottom:20px;">Accés restringit</p>
                    <input id="login-input" type="text" placeholder="Contrasenya"
                        autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                        style="width:100%; padding:10px; background:#0d0d1a; border:1px solid #444;
                        color:#eee; font-size:14px; outline:none; margin-bottom:12px;
                        text-align:center; letter-spacing:2px;
                        -webkit-text-security: disc;">
                    <button id="login-boto"
                        style="width:100%; padding:10px; background:#2c3e35; color:#c8973a;
                        border:1px solid #c8973a; font-size:13px; letter-spacing:1px;
                        cursor:pointer; text-transform:uppercase;">
                        Entrar
                    </button>
                    <p id="login-error" style="color:#e74c3c; font-size:12px;
                        margin-top:12px; min-height:18px;"></p>
                    <button onclick="tancarModalLogin()"
                        style="margin-top:16px; background:none; border:none;
                        color:#555; font-size:12px; cursor:pointer; letter-spacing:1px;">
                        Cancel·lar
                    </button>
                </div>
            </div>
        `);
    }

    // ─── CARREGAR DADES EN OBRIR LA PÀGINA ──────────────────
    API.carregarTot();

    // ─── TANCAR MODAL MENÚ ───────────────────────────────────
    window.tancarModalMenu = function() {
        document.getElementById('modal-menu').style.display = 'none';
    };

    // ─── OBRIR / TANCAR MODAL LOGIN ──────────────────────────
    window.obrirModalLogin = function() {
        if (sessionStorage.getItem('admin_clau')) {
            window.location.href = 'admin.html';
            return;
        }
        const modal = document.getElementById('modal-login');
        const input = document.getElementById('login-input');
        const error = document.getElementById('login-error');
        error.textContent = '';
        input.value = '';
        modal.style.display = 'flex';
        setTimeout(() => input.focus(), 100);
    };

    window.tancarModalLogin = function() {
        document.getElementById('modal-login').style.display = 'none';
    };

    // ─── LÒGICA LOGIN ────────────────────────────────────────
    const fer_login = async () => {
        const input = document.getElementById('login-input');
        const error = document.getElementById('login-error');
        const clau = input.value.trim();
        if (!clau) return;

        error.textContent = '⏳ Verificant...';

        try {
            const res = await fetch(`${CONFIG.BASE_WORKER}/login?p=${encodeURIComponent(clau)}`);
            if (res.ok && (await res.text()) === 'OK') {
                sessionStorage.setItem('admin_clau', clau);
                tancarModalLogin();
                window.location.href = 'admin.html';
            } else {
                error.textContent = '❌ Clau incorrecta';
                input.value = '';
                input.focus();
            }
        } catch (e) {
            error.textContent = '❌ Error de connexió';
        }
    };

    document.getElementById('login-boto').addEventListener('click', fer_login);
    document.getElementById('login-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fer_login();
    });

    // ─── PINTAR CATÀLEG (Imatge + Nom + Descripció + Preu) ───
    // Estil galeria de l'Olé y Ají — un plat per fila amb foto
    const pintarCataleg = function(registres, titol) {
        const baseCloudy = `https://res.cloudinary.com/${CONFIG.CLOUDI_NAME}/image/upload/f_auto,q_auto/`;
        const fotoDefault = `${CONFIG.BASE_URL}Icon/Default.png`;

        let html = `
            <div style="text-align:center; margin-bottom:30px; 
                border-bottom:1px solid #c8b99a; padding-bottom:20px;">
                <h2 style="font-size:1.4rem; color:#2c3e35; letter-spacing:3px; 
                    text-transform:uppercase; margin:0; font-weight:normal;">
                    ${titol}
                </h2>
                <p style="color:#aaa; font-size:11px; margin-top:8px; 
                    font-family:sans-serif; letter-spacing:1px;">
                    ${CONFIG.NOM}
                </p>
            </div>
        `;

        registres.forEach(r => {
            const f = r.fields;
            let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
            const imgPath = foto ? `${baseCloudy}${foto}` : fotoDefault;

            html += `
                <div style="display:flex; align-items:center; gap:16px; 
                    margin-bottom:20px; padding-bottom:20px; 
                    border-bottom:1px solid #ddd3be;">
                    <img src="${imgPath}" 
                        alt="${f.Nom || 'Plat'}" 
                        onerror="this.src='${fotoDefault}'"
                        style="width:90px; height:90px; object-fit:cover; 
                            flex-shrink:0; border-radius:4px;">
                    <div style="flex:1;">
                        <p style="font-size:1rem; color:#2a2a2a; font-weight:bold; 
                            margin:0 0 4px 0; font-family:sans-serif;">
                            ${f.Nom || ''}
                        </p>
                        ${f.Descripcio ? `
                        <p style="font-size:0.82rem; color:#666; margin:0 0 6px 0; 
                            font-family:sans-serif; line-height:1.4;">
                            ${f.Descripcio}
                        </p>` : ''}
                        ${f.Preu ? `
                        <p style="font-size:0.95rem; color:#2c3e35; font-weight:bold; 
                            margin:0; font-family:sans-serif;">
                            ${f.Preu} €
                        </p>` : ''}
                    </div>
                </div>
            `;
        });

        return html;
    };

    // ─── OBRIR MODAL ─────────────────────────────────────────
    const obrirModal = async function(categoria, titol) {
        const modal = document.getElementById('modal-menu');
        const contingut = document.getElementById('modal-menu-contingut');

        contingut.innerHTML = `
            <div style="text-align:center; padding:40px;">
                <div style="width:32px; height:32px; border:3px solid #ddd;
                    border-top-color:#c8973a; border-radius:50%;
                    animation:gir 0.8s linear infinite; margin:0 auto;">
                </div>
            </div>`;
        modal.style.display = 'flex';

        const totes = await API.carregarTot();
        if (!totes) {
            contingut.innerHTML = `
                <p style="text-align:center; color:#999; font-family:sans-serif;">
                    No hi ha dades disponibles.
                </p>`;
            return;
        }

        const registres = API.filtrar(categoria);
        if (!registres || registres.length === 0) {
            contingut.innerHTML = `
                <p style="text-align:center; color:#999; font-family:sans-serif;">
                    No hi ha dades disponibles.
                </p>`;
            return;
        }

        contingut.innerHTML = pintarCataleg(registres, titol);
    };

    // ─── FUNCIONS PÚBLIQUES ───────────────────────────────────
    window.obrirModalPlats   = () => obrirModal('Plats',   'Platos de la Casa');
    window.obrirModalTapas   = () => obrirModal('Tapas',   'Nuestras Tapas');
    window.obrirModalPostres = () => obrirModal('Postres', 'Nuestros Postres');
    window.obrirModalBegudes = () => obrirModal('Begudes', 'Bebidas');

})();