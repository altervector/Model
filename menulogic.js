/* ============================================================
   MENULOGIC.JS - Modal tipus full de paper per als menús
   Depèn de: config.js, api.js
   ============================================================ */

(function() {

    // ─── ESTRUCTURA DEL MODAL ────────────────────────────────
    if (!document.getElementById('modal-menu')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="modal-menu" style="display:none; position:fixed; top:0; left:0; 
                width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999;
                align-items:center; justify-content:center; padding:20px;">
                <div id="modal-menu-paper" style="background:white; width:100%; 
                    max-width:600px; max-height:90vh; overflow-y:auto;
                    border-radius:4px; padding:50px 40px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 
                                0 0 0 1px rgba(0,0,0,0.05);
                    font-family: Georgia, serif; position:relative;">
                    <button onclick="tancarModalMenu()" style="position:absolute; 
                        top:15px; right:20px; background:none; border:none; 
                        font-size:24px; cursor:pointer; color:#999;">✕</button>
                    <div id="modal-menu-contingut"></div>
                </div>
            </div>
        `);
    }

    // ─── TANCAR MODAL ────────────────────────────────────────
    window.tancarModalMenu = function() {
        document.getElementById('modal-menu').style.display = 'none';
    };

    // ─── OBRIR MODAL ─────────────────────────────────────────
    const obrirModal = async function(tipus, titol) {
        const modal = document.getElementById('modal-menu');
        const contingut = document.getElementById('modal-menu-contingut');

        // Mostrem el modal amb spinner mentre carrega
        contingut.innerHTML = `
            <p style="text-align:center; color:#999; font-family:sans-serif;">
                Carregant...
            </p>`;
        modal.style.display = 'flex';

        // Llegim les dades
        const registres = await API.llegir(tipus);
        if (!registres || registres.length === 0) {
            contingut.innerHTML = `
                <p style="text-align:center; color:#999;">
                    No hi ha dades disponibles.
                </p>`;
            return;
        }

        // Agrupem per Seccio
        const grups = {};
        registres.forEach(r => {
            const seccio = r.fields.Seccio || 'Altres';
            if (!grups[seccio]) grups[seccio] = [];
            grups[seccio].push(r.fields);
        });

        // Pintem la carta
        let html = `
            <div style="text-align:center; margin-bottom:30px; border-bottom:1px solid #ddd; padding-bottom:20px;">
                <h2 style="font-size:1.6rem; color:#2c3e35; letter-spacing:2px; 
                    text-transform:uppercase; margin:0;">${titol}</h2>
                <p style="color:#999; font-size:12px; margin-top:8px; 
                    font-family:sans-serif;">${CONFIG.NOM}</p>
            </div>
        `;

        const ordreSeccions = ['Entrant', 'Primer', 'Segon', 'Postre', 'Principal', 'Altres'];
        const seccionsOrdenades = ordreSeccions.filter(s => grups[s]);

        seccionsOrdenades.forEach(seccio => {
            html += `
                <div style="margin-bottom:25px;">
                    <h3 style="font-size:0.85rem; letter-spacing:3px; text-transform:uppercase; 
                        color:#c8973a; border-bottom:1px solid #f0e6d3; padding-bottom:8px; 
                        margin-bottom:15px; font-family:sans-serif;">${seccio}</h3>
            `;

            grups[seccio].forEach(plat => {
                html += `
                    <div style="display:flex; justify-content:space-between; 
                        align-items:baseline; margin-bottom:10px;">
                        <span style="font-size:1rem; color:#1a1a1a;">${plat.Nom || ''}</span>
                        ${plat.Preu ? `<span style="font-size:0.95rem; color:#2c3e35; 
                            font-weight:bold; margin-left:10px; white-space:nowrap;">
                            ${plat.Preu} €</span>` : ''}
                    </div>
                `;
            });

            html += `</div>`;
        });

        contingut.innerHTML = html;
    };

    // ─── FUNCIONS PÚBLIQUES PER AL NAVBAR ────────────────────
    window.obrirModalMenuDiari = () => obrirModal('Menu_Diari', 'Menú Diari');
    window.obrirModalMenuCDS   = () => obrirModal('Menu_CDS',   'Menú Cap de Setmana');
    window.obrirModalMenuGrups = () => obrirModal('Menu_Grups', 'Menú de Grups');
    window.obrirModalCarta     = () => obrirModal('Carta',      'La Nostra Carta');
    window.obrirModalVins      = () => obrirModal('Vins',       'Vins i Caves');

})();