/* ============================================================
   ADMINLOGIC.JS - Panel d'administració de NewProject
   Depèn de: config.js, api.js
   ============================================================ */

(function() {

    // ─── ESTILS ──────────────────────────────────────────────
    const estils = document.createElement('style');
    estils.textContent = `
        * { box-sizing: border-box; margin: 0; padding: 0; }
html {
    background-image: none;
    background: #1a1a2e;
}
        body {
            background: #1a1a2e;
            color: #eee;
            font-family: 'Segoe UI', sans-serif;
            font-size: 13px;
            padding: 20px;
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 900px;
        }

        thead tr {
            background: #2c3e35;
            color: #c8973a;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 11px;
        }

        th {
            position: sticky;
            top: 0;
            z-index: 10;
            background: #2c3e35;
        }

        th, td {
            padding: 8px 10px;
            border-bottom: 1px solid #2a2a3e;
            text-align: left;
            white-space: nowrap;
        }

        tbody tr:hover {
            background: #22223a;
        }

        tbody tr.guardant {
            background: #2c3e20;
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
        }

        input[type="text"]:focus,
        input[type="number"]:focus,
        select:focus {
            background: #2a2a4a;
            border-bottom: 1px solid #c8973a;
        }

        input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            accent-color: #c8973a;
        }

        .col-nom { min-width: 160px; }
        .col-preu { width: 70px; }
        .col-check { width: 80px; text-align: center; }
        .col-seccio { width: 110px; }

        #admin-estat {
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            font-size: 16px;
            font-weight: bold;
            color: #c8973a;
            letter-spacing: 1px;
            /*background: #1a1a2e;*/
            border: 0px solid #c8973a;
            padding: 6px 16px;
            pointer-events: none;
        }
    `;
    document.head.appendChild(estils);

    // ─── VARIABLES ───────────────────────────────────────────
    let registres = [];
    let ultimCanvi = null;

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

        const getSeccio = (s) => Array.isArray(s) ? s[0] : (s || '');

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

        // Visible
        const cbVisible = document.createElement('input');
        cbVisible.type = 'checkbox';
        cbVisible.checked = f.Visible === true;
        onChangeCheck('Visible', cbVisible);
        const tdVisible = document.createElement('td');
        tdVisible.className = 'col-check';
        tdVisible.appendChild(cbVisible);

        // Nom
        const inputNom = document.createElement('input');
        inputNom.type = 'text';
        inputNom.value = f.Nom || '';
        inputNom.placeholder = esNova ? 'Escriu el nom i prem Tab...' : '';
        if (esNova) {
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

        // Menu_Diari
        const cbDiari = document.createElement('input');
        cbDiari.type = 'checkbox';
        cbDiari.checked = f.Menu_Diari === true;
        onChangeCheck('Menu_Diari', cbDiari);
        const tdDiari = document.createElement('td');
        tdDiari.className = 'col-check';
        tdDiari.appendChild(cbDiari);

        // Menu_CDS
        const cbCDS = document.createElement('input');
        cbCDS.type = 'checkbox';
        cbCDS.checked = f.Menu_CDS === true;
        onChangeCheck('Menu_CDS', cbCDS);
        const tdCDS = document.createElement('td');
        tdCDS.className = 'col-check';
        tdCDS.appendChild(cbCDS);

        // Menu_Grups
        const cbGrups = document.createElement('input');
        cbGrups.type = 'checkbox';
        cbGrups.checked = f.Menu_Grups === true;
        onChangeCheck('Menu_Grups', cbGrups);
        const tdGrups = document.createElement('td');
        tdGrups.className = 'col-check';
        tdGrups.appendChild(cbGrups);

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

        // Carta
        const cbCarta = document.createElement('input');
        cbCarta.type = 'checkbox';
        cbCarta.checked = f.Carta === true;
        onChangeCheck('Carta', cbCarta);
        const tdCarta = document.createElement('td');
        tdCarta.className = 'col-check';
        tdCarta.appendChild(cbCarta);

        // Vins
        const cbVins = document.createElement('input');
        cbVins.type = 'checkbox';
        cbVins.checked = f.Vins === true;
        onChangeCheck('Vins', cbVins);
        const tdVins = document.createElement('td');
        tdVins.className = 'col-check';
        tdVins.appendChild(cbVins);

        fila.appendChild(tdVisible);
        fila.appendChild(tdNom);
        fila.appendChild(tdPreu);
        fila.appendChild(tdDiari);
        fila.appendChild(tdCDS);
        fila.appendChild(tdGrups);
        fila.appendChild(tdSeccio);
        fila.appendChild(tdCarta);
        fila.appendChild(tdVins);

        return fila;
    };

    // ─── INICIALITZAR ────────────────────────────────────────
    const inicialitzar = async () => {

    // ─── COMPROVACIÓ D'ACCÉS ─────────────────────────────
    const clau = sessionStorage.getItem('admin_clau');
    if (!clau) { window.location.href = 'index.html'; return; }
    
    const res = await fetch(`${CONFIG.BASE_WORKER}/login?p=${encodeURIComponent(clau)}`);
    const text = await res.text();
    if (text !== 'OK') { window.location.href = 'index.html'; return; }
    // ────────────────────────────────────────────────────

        const panel = document.getElementById('admin-panel');
        if (!panel) return;

        const divEstat = document.createElement('div');
        divEstat.id = 'admin-estat';
        document.body.appendChild(divEstat);

        panel.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th class="col-check">Visible</th>
                        <th class="col-nom">Nom</th>
                        <th class="col-preu">Preu</th>
                        <th class="col-check">Diari</th>
                        <th class="col-check">CDS</th>
                        <th class="col-check">Grups</th>
                        <th class="col-seccio">Secció</th>
                        <th class="col-check">Carta</th>
                        <th class="col-check">Vins</th>
                    </tr>
                </thead>
                <tbody id="admin-tbody"></tbody>
            </table>
        `;

        const res = await fetch(CONFIG.BASE_WORKER);
        const data = await res.json();
        registres = data;

        const tbody = document.getElementById('admin-tbody');
        registres.forEach(r => tbody.appendChild(crearFila(r)));
        tbody.appendChild(crearFila({ fields: {}, id: null }, true));

        document.body.style.opacity = '1';
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        inicialitzar();
    } else {
        document.addEventListener('DOMContentLoaded', inicialitzar);
    }

})();