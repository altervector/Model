/* ============================================================
   MENULOGIC.JS - Modal tipus full de paper per als menús
   Depèn de: config.js, api.js
   ============================================================ */

(function() {

    // ─── ESTRUCTURA DEL MODAL ────────────────────────────────
    if (!document.getElementById('modal-menu')) {
        document.body.insertAdjacentHTML('beforeend', `
<div id="modal-menu" style="display:none; position:fixed; top:0; left:0; 
    width:100%; height:100%; background:rgba(0,0,0,0.75); z-index:9999;
    align-items:flex-start; justify-content:center; padding:40px 20px;
    overflow-y:auto;">
    <div id="modal-menu-paper" style="
        background: #f5f0e8;
        width: 100%;
        max-width: 550px;
        border-radius: 0;
        padding: 50px 45px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4), 
                    4px 4px 0px rgba(0,0,0,0.05),
                    -2px 0px 8px rgba(0,0,0,0.08);
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

    // ─── TANCAR MODAL ────────────────────────────────────────
    window.tancarModalMenu = function() {
        document.getElementById('modal-menu').style.display = 'none';
    };

    // ─── PINTAR MENÚ (Primer/Segon/Postre + Peu) ─────────────
    const pintarMenu = function(registres, titol) {
        const grups = {};
        const peus = [];

        registres.forEach(r => {
            const seccio = Array.isArray(r.fields.Seccio) ? r.fields.Seccio[0] : (r.fields.Seccio || 'Altres');
            if (seccio === 'Peu') {
                peus.push(r.fields);
            } else {
                if (!grups[seccio]) grups[seccio] = [];
                grups[seccio].push(r.fields);
            }
        });

        const ordreSeccions = ['Entrant', 'Primer', 'Segon', 'Postres'];
        const seccionsOrdenades = ordreSeccions.filter(s => grups[s]);

        let html = `
            <div style="text-align:center; margin-bottom:30px; 
                border-bottom: 1px solid #c8b99a; padding-bottom:20px;">
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

        seccionsOrdenades.forEach(seccio => {
            html += `
                <div style="margin-bottom:22px;">
                    <h3 style="font-size:0.75rem; letter-spacing:3px; 
                        text-transform:uppercase; color:#c8973a; 
                        border-bottom:1px solid #ddd3be; padding-bottom:6px; 
                        margin-bottom:12px; font-family:sans-serif; font-weight:normal; text-align:center;">
                        ${seccio}
                    </h3>
            `;

            grups[seccio].forEach(plat => {
                html += `
                    <p style="margin:0 0 8px 0; font-size:0.95rem; color:#2a2a2a; 
                        line-height:1.4; text-align:center;">
                        ${plat.Nom || ''}
                    </p>
                `;
            });

            html += `</div>`;
        });

        // Peu de pàgina — tots els registres Peu
        if (peus.length > 0) {
            html += `
                <div style="margin-top:30px; padding-top:20px; 
                    border-top:1px solid #c8b99a; text-align:center;">
            `;
            peus.forEach(p => {
                html += `
                    <p style="font-size:0.85rem; color:#555; font-family:sans-serif; 
                        line-height:1.8; margin:0 0 6px 0;">
                        ${p.Nom || ''}
                    </p>
                    ${p.Preu ? `
                    <p style="font-size:1.3rem; color:#2c3e35; font-weight:bold; 
                        margin:0 0 10px 0; letter-spacing:1px;">
                        ${p.Preu} €
                        <span style="font-size:0.75rem; color:#999; font-weight:normal; 
                            font-family:sans-serif;">(IVA inclòs)</span>
                    </p>` : ''}
                `;
            });
            html += `</div>`;
        }

        return html;
    };

    // ─── PINTAR CARTA (Nom + Preu per plat + Peu) ────────────
    const pintarCarta = function(registres, titol) {
        const grups = {};
        const peus = [];

        registres.forEach(r => {
            const seccio = Array.isArray(r.fields.Seccio) ? r.fields.Seccio[0] : (r.fields.Seccio || 'Altres');
            if (seccio === 'Peu') {
                peus.push(r.fields);
            } else {
                if (!grups[seccio]) grups[seccio] = [];
                grups[seccio].push(r.fields);
            }
        });

        const ordreSeccions = ['Entrant', 'Primer', 'Segon', 'Postres', 'Vins'];
        const seccionsOrdenades = ordreSeccions.filter(s => grups[s]);

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

        seccionsOrdenades.forEach(seccio => {
            html += `
                <div style="margin-bottom:22px;">
                    <h3 style="font-size:0.75rem; letter-spacing:3px; 
                        text-transform:uppercase; color:#c8973a; 
                        border-bottom:1px solid #ddd3be; padding-bottom:6px; 
                        margin-bottom:12px; font-family:sans-serif; font-weight:normal;">
                        ${seccio}
                    </h3>
            `;

            grups[seccio].forEach(plat => {
                html += `
                    <div style="display:flex; justify-content:space-between; 
                        align-items:baseline; margin-bottom:10px;">
                        <span style="font-size:0.95rem; color:#2a2a2a;">
                            ${plat.Nom || ''}
                        </span>
                        ${plat.Preu ? `
                        <span style="font-size:0.9rem; color:#2c3e35; font-weight:bold; 
                            margin-left:15px; white-space:nowrap; font-family:sans-serif;">
                            ${plat.Preu} €
                        </span>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        });

        // Peu de pàgina — tots els registres Peu
        if (peus.length > 0) {
            html += `
                <div style="margin-top:30px; padding-top:20px; 
                    border-top:1px solid #c8b99a; text-align:center;">
            `;
            peus.forEach(p => {
                html += `
                    <p style="font-size:0.85rem; color:#555; font-family:sans-serif; 
                        line-height:1.8; margin:0 0 6px 0;">
                        ${p.Nom || ''}
                    </p>
                `;
            });
            html += `</div>`;
        }

        return html;
    };

    // ─── OBRIR MODAL ─────────────────────────────────────────
    const obrirModal = async function(tipus, titol, esCarta = false) {
        const modal = document.getElementById('modal-menu');
        const contingut = document.getElementById('modal-menu-contingut');

        contingut.innerHTML = `
            <p style="text-align:center; color:#999; font-family:sans-serif; 
                font-size:14px;">Carregant...</p>`;
        modal.style.display = 'flex';

        const registres = await API.llegir(tipus);
        if (!registres || registres.length === 0) {
            contingut.innerHTML = `
                <p style="text-align:center; color:#999; font-family:sans-serif;">
                    No hi ha dades disponibles.
                </p>`;
            return;
        }

        contingut.innerHTML = esCarta 
            ? pintarCarta(registres, titol)
            : pintarMenu(registres, titol);
    };

    // ─── FUNCIONS PÚBLIQUES ───────────────────────────────────
    window.obrirModalMenuDiari = () => obrirModal('Menu_Diari', 'Menú Diari');
    window.obrirModalMenuCDS   = () => obrirModal('Menu_CDS',   'Menú Cap de Setmana');
    window.obrirModalMenuGrups = () => obrirModal('Menu_Grups', 'Menú de Grups');
    window.obrirModalCarta     = () => obrirModal('Carta',      'La Nostra Carta',     true);
    window.obrirModalVins      = () => obrirModal('Vins',       'Vins i Caves',        true);

})();