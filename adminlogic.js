/* ============================================================
   ADMINLOGIC.JS - Panel d'administració de NewProject
   Depèn de: config.js, api.js
   ============================================================ */

(function() {

    // ─── ESTILS ──────────────────────────────────────────────
    const estils = document.createElement('style');
    estils.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background: #1a1a2e;
            color: #eee;
            font-family: 'Segoe UI', sans-serif;
            font-size: 13px;
            padding: 0;
            overflow-x: hidden;
        }

        /* ── BARRA FIXA ── */
        #admin-barra {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
            background: #2c3e35;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            height: 44px;
            border-bottom: 2px solid #c8973a;
        }

        #admin-barra h3 {
            font-size: 1rem;
            color: #c8973a;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        #admin-estat {
            font-size: 12px;
            font-weight: bold;
            color: #c8973a;
            letter-spacing: 1px;
            min-width: 150px;
            text-align: center;
        }

        #btn-guardar-ultim {
            background: transparent;
            color: #c8973a;
            border: 1px solid #c8973a;
            padding: 6px 16px;
            cursor: pointer;
            font-size: 12px;
            letter-spacing: 1px;
        }

        #btn-guardar-ultim:hover {
            background: #c8973a;
            color: #1a1a2e;
        }

        /* ── CAPÇALERA COLUMNES FIXA ── */
        #admin-cols {
            position: fixed;
            top: 44px;
            left: 0;
            right: 0;
            z-index: 99;
            background: #16213e;
            display: grid;
            grid-template-columns: 60px 1fr 70px 60px 60px 60px 110px 60px 60px;
            padding: 6px 20px;
            border-bottom: 1px solid #c8973a;
            font-size: 10px;
            color: #c8973a;
            text-transform: uppercase;
            letter-spacing: 1px;
            min-width: 700px;
        }

        #admin-cols span {
            text-align: center;
        }

        #admin-cols span:nth-child(2) {
            text-align: left;
        }

        /* ── TAULA ── */
        #admin-contingut {
            margin-top: 88px;
            padding: 10px 20px 40px 20px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 700px;
        }

        td {
            padding: 6px 8px;
            border-bottom: 1px solid #2a2a3e;
            text-align: center;
            white-space: nowrap;
        }

        td:nth-child(2) {
            text-align: left;
        }

        tbody tr:hover {
            background: #22223a;
        }

        tbody tr.guardant {
            background: #1e3a1e;
        }

        tbody tr.fila-nova {
            background: #1a2a1a;
        }

        input[type="text"],
        input[type="number"],
        select {
            background: transparent;
            border: none;
            color: #eee;
            font-size: 13px;
            width: 100%;
            outline: none;
            padding: 2px 4px;
            text-align: inherit;
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus {
            background: #2a2a4a;
            border-bottom: 1px solid #c8973a;
        }

        input[type="number"] {
            text-align: center;
        }

        input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #c8973a;
        }

        .col-vis  { width: 60px; }
        .col-nom  { min-width: 120px; }
        .col-preu { width: 70px; }
        .col-check { width: 60px; }
        .col-seccio { width: 110px; }
    `;
    document.head.appendChild(estils);

    // ─── VARIABLES ───────────────────────────────────────────
    let registres = [];
    let ultimCanvi = null; // { id, dades }

    // ─── GUARDAR FILA ────────────────────────────────────────
    const guardarFila = async (id, dades) => {
        const estat = document.getElementById('admin-estat');
        const fila = document.querySelector(`tr[data-id="${id}"]`);
        if (fila) fila.classList.add('guardant');
        estat.textContent = '⏳ Guardant...';
        ultimCanvi = { id, dades };

        try {
            const res = await fetch(CONFIG.BASE_WORKER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...dades })
            });

            if (res.ok) {
                estat.textContent = '✅ Guardat';
                setTimeout(() => estat.textContent = '', 2000);
            } else {
                estat.textContent = '❌ Error al guardar';
            }
        } catch (e) {
            estat.textContent = '❌ Error de connexió';
        }

        if (fila) fila.classList.remove('guardant');
    };

    // ─── CREAR FILA ──────────────────────────────────────────
    const crearFila = (r, esNova = false) => {
        const f = r.fields || {};
        const id = r.id || null;

        const getSeccio = (s) => Array.isArray(s) ? s[0] : (s || 'Entrants');

        const fila = document.createElement('tr');
        if (id) fila.setAttribute('data-id', id);
        if (esNova) fila.classList.add('fila-nova');

        const seccions = ['Entrants', 'Primer', 'Segon', 'Postres', 'Vins', 'Peu'];

        const onBlurText = (camp, el) => {
            el.addEventListener('blur', () => {
                if (id) guardarFila(id, { [camp]: el.value });
            });
        };

        const onBlurNum = (camp, el) => {
            el.addEventListener('blur', () => {
                if (id) guardarFila(id, { [camp]: parseFloat(el.value) || 0 });
            });
        };

        const onChangeCheck = (camp, el) => {
            el.addEventListener('change', () => {
                if (id) guardarFila(id, { [camp]: el.checked });
            });
        };

        const onChangeSel = (camp, el) => {
            el.addEventListener('change', () => {
                if (id) guardarFila(id, { [camp]: [el.value] });
            });
        };

        const mkCheck = (camp, val) => {
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = val === true;
            onChangeCheck(camp, cb);
            const td = document.createElement('td');
            td.className = 'col-check';
            td.appendChild(cb);
            return td;
        };

        // Visible
        const tdVis = mkCheck('Visible', f.Visible);
        tdVis.className = 'col-vis';

        // Nom
        const inputNom = document.createElement('input');
        inputNom.type = 'text';
        inputNom.value = f.Nom || '';
        inputNom.placeholder = 'Nom del plat...';
        if (esNova) {
            // En fila nova, guardar tot el registre en perdre el focus del nom
            inputNom.addEventListener('blur', async () => {
                if (!inputNom.value.trim()) return;
                const estat = document.getElementById('admin-estat');
                estat.textContent = '⏳ Creant plat...';
                try {
                    const res = await fetch(CONFIG.BASE_WORKER, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            Nom: inputNom.value.trim(),
                            Preu: 0,
                            Seccio: ['Entrants'],
                            Visible: false
                        })
                    });
                    if (res.ok) {
                        estat.textContent = '✅ Plat creat — recarregant...';
                        setTimeout(() => location.reload(), 1000);
                    } else {
                        estat.textContent = '❌ Error al crear';
                    }
                } catch (e) {
                    estat.textContent = '❌ Error de connexió';
                }
            });
        } else {
            onBlurText('Nom', inputNom);
        }
        const tdNom = document.createElement('td');
        tdNom.className = 'col-nom';
        tdNom.appendChild(inputNom);

        // Preu
        const inputPreu = document.createElement('input');
        inputPreu.type = 'number';
        inputPreu.step = '0.01';
        inputPreu.value = f.Preu || 0;
        onBlurNum('Preu', inputPreu);
        const tdPreu = document.createElement('td');
        tdPreu.className = 'col-preu';
        tdPreu.appendChild(inputPreu);

        // Seccio
        const sel = document.createElement('select');
        seccions.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            if (getSeccio(f.Seccio) === s) opt.selected = true;
            sel.appendChild(opt);
        });
        onChangeSel('Seccio', sel);
        const tdSeccio = document.createElement('td');
        tdSeccio.className = 'col-seccio';
        tdSeccio.appendChild(sel);

        // Ordre columnes: Visible, Nom, Preu, Diari, CDS, Grups, Seccio, Carta, Vins
        fila.appendChild(tdVis);
        fila.appendChild(tdNom);
        fila.appendChild(tdPreu);
        fila.appendChild(mkCheck('Menu_Diari', f.Menu_Diari));
        fila.appendChild(mkCheck('Menu_CDS', f.Menu_CDS));
        fila.appendChild(mkCheck('Menu_Grups', f.Menu_Grups));
        fila.appendChild(tdSeccio);
        fila.appendChild(mkCheck('Carta', f.Carta));
        fila.appendChild(mkCheck('Vins', f.Vins));

        return fila;
    };

    // ─── INICIALITZAR ────────────────────────────────────────
    const inicialitzar = async () => {
        const panel = document.getElementById('admin-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div id="admin-barra">
                <h3>⚙️ ${CONFIG.NOM}</h3>
                <div id="admin-estat"></div>
                <button id="btn-guardar-ultim">💾 Guardar últim</button>
            </div>
            <div id="admin-cols">
                <span>Vis.</span>
                <span>Nom</span>
                <span>Preu</span>
                <span>Diari</span>
                <span>CDS</span>
                <span>Grups</span>
                <span>Secció</span>
                <span>Carta</span>
                <span>Vins</span>
            </div>
            <div id="admin-contingut">
                <table>
                    <tbody id="admin-tbody"></tbody>
                </table>
            </div>
        `;

        // Botó guardar últim canvi
        document.getElementById('btn-guardar-ultim').addEventListener('click', async () => {
            if (ultimCanvi) {
                await guardarFila(ultimCanvi.id, ultimCanvi.dades);
            }
        });

        // Carreguem registres
        const res = await fetch(CONFIG.BASE_WORKER);
        const data = await res.json();
        registres = data;

        const tbody = document.getElementById('admin-tbody');
        registres.forEach(r => tbody.appendChild(crearFila(r)));

        // Fila nova en blanc al final
        tbody.appendChild(crearFila({ fields: {}, id: null }, true));

        document.body.style.opacity = '1';
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        inicialitzar();
    } else {
        document.addEventListener('DOMContentLoaded', inicialitzar);
    }

})();