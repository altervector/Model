/* //////////////////////////////////////////////////////////////////////////////////////////////////////-------------------- */
/* ----------------------------------- MOTOR LÒGIC (AIRTABLE + MODALS + ADMIN) --------------------------------------------- */
/* //////////////////////////////////////////////////////////////////////////////////////////////////////-------------------- */


/*/////////////////////////  1. MANTENIMENT I ACTUALITZACIÓ  ////////////////////////////////////////////////////// */


/*/////////////////////////  2. VARIABLES D'ESTAT I ESTRUCTURA MODAL  ///////////////////////////////////////////// */

let socAdmin = CONFIG.ES_ADMIN;
if (socAdmin) { 
    document.body.classList.add('admin-mode-active'); 
}

// Injecció automàtica del HTML del Modal al final del body
if (!document.getElementById('modal-detall')) {
    const modalHTML = `
        <div id="modal-detall">
            <span class="tancar-modal" onclick="tancarModal()">&times;</span>
            <div class="modal-contingut" id="contingut-dinamic-modal"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

window.tancarModal = function() {
    document.getElementById('modal-detall').style.display = 'none';
}


/*/////////////////////////  3. CÀRREGA PRINCIPAL (FETCH AIRTABLE)  /////////////////////////////////////////////// */

function inicialitzarGaleria() {
    const contenidor = document.getElementById("cosgaleria");
    const titolHTML = document.getElementById("titol-categoria");
    const params = new URLSearchParams(window.location.search);
    const catClau = params.get('Categoria'); 

    if (!catClau) return;
    
    // Preparar el títol i posar el Spinner
    if (titolHTML) {
        titolHTML.innerText = catClau;
        titolHTML.classList.add('loading'); 
    }

   const workerURL = CONFIG.BASE_WORKER;
    
    fetch(`${workerURL}?Categoria=${encodeURIComponent(catClau)}`)
    .then(response => response.json())
    .then(records => { 
        let html = '';
        
        // --- AQUÍ EL TEU CODI ADAPTAT A LES NOVES VARIABLES CONFIG ---
        const baseCloudy = `https://res.cloudinary.com/${CONFIG.CLOUDI_NAME}/image/upload/f_auto,q_auto/`;
        const fotoDefault = "${CONFIG.BASE_URL}images/Default.png";

        records.forEach(r => {
            const f = r.fields;
            let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
            const imgPath = foto ? `${baseCloudy}${foto}` : fotoDefault;
            
            const esVisible = f.Visible === true;
            if (!esVisible && !socAdmin) return; // Si no és visible i no som admin, no el pintem

            const classeExtra = esVisible ? '' : 'item-ocult';

            // Generació de cada bloc de plat
            html += `
                <div class="bloc-galeria-item ${classeExtra}" 
                    onclick="obrirModal('${r.id}', '${imgPath}', ${esVisible}, this)">
                    <img src="${imgPath}" alt="${f.Nom || 'Plat'}" onerror="this.src='${fotoDefault}'">
                    <div class="detalls-producte">
                        <h3 class="titol-item">${f.Nom || "Sense nom"}</h3>
                        <p class="desc-text">${f.Descripcio || ""}</p>
                        <span class="preu-text">${f.Preu || "0"}</span> €
                    </div>
                </div>`;
        });
  
        if (contenidor) contenidor.innerHTML = html;
        if (titolHTML) titolHTML.classList.remove('loading');
        document.body.style.opacity = "1";
    })
    .catch(err => {
        console.error("Error carregant dades:", err);
        if (titolHTML) titolHTML.innerText = "Error al carregar";
        document.body.style.opacity = "1";
    });

    // Activa el detector secreto para entrar en modo EDICIO
    if (typeof iniciarDetectorLogo === "function") iniciarDetectorLogo();

    // Botó flotant (+) per a l'EDICIO

    const btnAfegir = `
        <div id="btn-nou-plat" class="controles-admin" onclick="window.obrirModalNuevo()" 
            style="position:fixed; bottom:20px; left:50%; transform:translateX(130px); width:60px; height:60px; background:#28a745; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:35px; cursor:pointer; z-index:9999; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-family: sans-serif;">
            +
        </div>`;
    document.body.insertAdjacentHTML('beforeend', btnAfegir);


}

inicialitzarGaleria();


/*/////////////////////////  4. GESTIÓ DEL MODAL (OBRIR I PREVISUALITZAR)  //////////////////////////////////////// */

window.obrirModal = function(idAirtable, foto, esVisible, el) {
    const nom = el.querySelector('.titol-item').innerText;
    const desc = el.querySelector('.desc-text').innerText;
    const preu = el.querySelector('.preu-text').innerText;
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('Categoria') || '';

    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    if (!contingut || !modal) return;

    if (CONFIG.ES_ADMIN) {
        // --- VISTA EDICIÓ 
        
        modal.style.backgroundColor = "var(--bg-modaledit)";
        contingut.innerHTML = `
            <div style="position:relative;" id="container-foto-admin">
                <img id="preview-foto" src="${foto}" style="width:100%; height:200px; object-fit:cover; border-radius:10px 10px 0 0;">
                <label id="btn-foto-accion" for="upload-foto" style="position:absolute; bottom:10px; right:10px; background:#191970; color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px; font-family:sans-serif;">
                    📷 CANVIAR FOTO
                </label>
                <input type="file" id="upload-foto" style="display:none;" accept="image/*" 
                    onchange="window.prepararSubidaFoto(this, '${idAirtable}')">
            </div>
            <div style="padding:20px; text-align:left; display:flex; flex-direction:column; gap:10px;">
                <input type="text" id="edit-nom" value="${nom}" placeholder="Nom">
                <textarea id="edit-desc" style="width:100%; height:80px;">${desc}</textarea>
                <input type="number" id="edit-preu" value="${preu}" step="0.01">
                <div style="display:flex; align-items:center; gap:10px;">
                    <input type="checkbox" id="edit-visible" ${esVisible ? 'checked' : ''}>
                    <label>Visible a la web</label>
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <label style="font-size:12px; color:#666;">Categoria:</label>
                    <select id="edit-categoria" style="padding:8px; border:1px solid #ddd; border-radius:5px;">
                        ${["Begudes", "Tapas", "Plats", "Postres"].map(cat => 
                            `<option value="${cat}" ${cat === categoriaActual ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button onclick="tancarModal()" style="padding:8px 15px; background:#ccc; border:none; border-radius:5px; cursor:pointer;">Cancel·lar</button>
                    <button onclick="guardarCanvis('${idAirtable}')" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">GUARDAR</button>
                </div>
            </div>`;
    } else {
        // --- VISTA CLIENT (PÚBLICA) ---
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        contingut.innerHTML = `
            <img src="${foto}" alt="${nom}" style="width:100%; height:250px; object-fit:cover; border-radius:10px 10px 0 0;">
            <div style="padding:20px; text-align:left;">
                <h2 style="margin:0; color:#191970; font-size:22px;">${nom}</h2>
                <p style="color:#666; margin:15px 0; line-height:1.5; font-size:15px;">${desc}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
                    <span style="font-size:22px; font-weight:bold; color:#191970;">${preu} €</span>
                    <button onclick="tancarModal()" style="padding:8px 15px; background:#191970; color:#fff; border:none; border-radius:5px; cursor:pointer;">Tancar</button>
                </div>
            </div>`;
    }
    modal.style.display = 'flex';
};


/*/////////////////////////  5. GESTIÓ DE FOTOS (PREPARACIÓ I CLOUDINARY)  //////////////////////////////////////// */

window.prepararSubidaFoto = function(input, idAirtable) {
    if (input.files && input.files[0]) {
        const arxiu = input.files[0];
        const nomOriginal = arxiu.name; 
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById('preview-foto');
            const btnAccion = document.getElementById('btn-foto-accion');
            
            if (preview && btnAccion) {
                preview.src = e.target.result;
                btnAccion.innerHTML = "💾 CONFIRMAR I PUJAR FOTO";
                btnAccion.style.background = "#28a745"; 
                btnAccion.removeAttribute('for');
                
                btnAccion.onclick = function() {
                    window.executarSubidaFoto(idAirtable, e.target.result, nomOriginal);
                };

                if (!document.getElementById('btn-reintentar')) {
                    const btnReintentar = `
                        <label id="btn-reintentar" for="upload-foto" 
                               style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.7); color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                               🔄 CAMBIAR
                        </label>`;
                    document.getElementById('container-foto-admin').insertAdjacentHTML('beforeend', btnReintentar);
                }
            }
        };
        reader.readAsDataURL(arxiu);
    }
};

window.executarSubidaFoto = async function(idAirtable, base64, nomOriginal) {
    const btnAccion = document.getElementById('btn-foto-accion');
    btnAccion.innerHTML = "⏳ OPTIMITZANT...";
    btnAccion.style.pointerEvents = "none";
    btnAccion.style.background = "#ffc107";

    try {
        const img = new Image();
        img.src = base64;
        await img.decode();
        
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1080;

        if (width > height) {
            if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
            if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));

        btnAccion.innerHTML = "🚀 PUJANT...";
        const formData = new FormData();
        formData.append('file', blob, `${Date.now()}.jpg`);

        // --- AQUÍ APLIQUEM EL TEU PRESET DES DEL CONFIG ---
        formData.append('upload_preset', 'preset_pdf_fijo'); 

        const nomNet = nomOriginal.split('.')[0].replace(/\s+/g, '_') + "_" + Date.now();
        formData.append('public_id', nomNet); 

        // --- AQUÍ APLIQUEM EL TEU NOM DE CLOUDINARY DES DEL CONFIG ---
        const resCloudy = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDI_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        
        const dataCloudy = await resCloudy.json();

        if (dataCloudy.secure_url) {
            const nomFinal = dataCloudy.public_id + "." + dataCloudy.format;

            if (idAirtable && idAirtable !== "null") {
                // Actualització directa si el plat ja existeix
                btnAccion.innerHTML = "📝 ACTUALITZANT...";
                await fetch('https://oleyaji.altervector.workers.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: idAirtable, Foto: nomFinal })
                });
                btnAccion.innerHTML = "✅ Imatge OK";
                btnAccion.style.background = "#28a745";
                alert("Imatge actualitzada correctament!");
            } else {
                // Preparació per a plat nou
                document.getElementById('nombre-foto-nueva').value = nomFinal;
                const btnFinal = document.getElementById('btn-crear-final');
                if (btnFinal) {
                    btnFinal.disabled = false;
                    btnFinal.style.background = "#28a745";
                    btnFinal.style.cursor = "pointer";
                    btnFinal.style.opacity = "1";
                }
                document.getElementById('aviso-foto').style.display = 'none';
                if (document.getElementById('btn-reintentar')) document.getElementById('btn-reintentar').remove();
                btnAccion.innerHTML = "✅ FOTO GUARDADA";
                btnAccion.style.background = "#28a745";
            }
        }
    } catch (error) {
        console.error("Error:", error);
        btnAccion.innerHTML = "❌ ERROR";
        btnAccion.style.pointerEvents = "auto";
        btnAccion.style.background = "#dc3545";
    }
};


/*/////////////////////////  6. ACCIONS FINALS (GUARDAR I CREAR NOU)  ////////////////////////////////////////////// */

window.guardarCanvis = function(idAirtable) {
    const idReal = (idAirtable === "null" || !idAirtable) ? null : idAirtable;
    
    const dades = {
        id: idReal,
        "Nom": document.getElementById('edit-nom').value.trim(),
        "Descripcio": document.getElementById('edit-desc').value.trim(),
        "Preu": parseFloat(document.getElementById('edit-preu').value.replace(',', '.')) || 0, 
        "Visible": document.getElementById('edit-visible').checked,
        "Categoria": [document.getElementById('edit-categoria').value]
    };

    if (!idReal) {
        const fotoNova = document.getElementById('nombre-foto-nueva').value;
        if (fotoNova) dades["Foto"] = fotoNova;
    }

    if (!dades.Nom) { alert("El nom és obligatori"); return; }

    fetch('https://oleyaji.altervector.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dades)
    })
    .then(response => {
        if (response.ok) {
            alert(idReal ? "Guardat correctament!" : "Nou plat creat amb èxit!");
            tancarModal();
            location.reload(); 
        } else {
            alert("Error en l'operació.");
        }
    })
    .catch(error => console.error('Error:', error));
};

window.obrirModalNuevo = function() {
    const fotoDefault = "${CONFIG.BASE_URL}images/Default.png";
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('Categoria') || '';
    const contingut = document.getElementById('contingut-dinamic-modal');
    const modal = document.getElementById('modal-detall');
    
    if (!contingut || !modal) return;

    modal.style.backgroundColor = "rgba(40, 167, 69, 0.8)"; 
    contingut.innerHTML = `
        <div style="position:relative;" id="container-foto-admin">
            <img id="preview-foto" src="${fotoDefault}" style="width:100%; height:200px; object-fit:cover; border-radius:10px 10px 0 0;">
            <label id="btn-foto-accion" for="upload-foto" style="position:absolute; bottom:10px; right:10px; background:#191970; color:#fff; padding:5px 10px; border-radius:5px; cursor:pointer; font-size:12px;">
                📷 SELECCIONAR FOTO
            </label>
            <input type="file" id="upload-foto" style="display:none;" accept="image/*" 
                onchange="window.prepararSubidaFoto(this, null)">
        </div>
        <div style="padding:20px; text-align:left; display:flex; flex-direction:column; gap:10px;">
            <h2 style="margin:0; color:#28a745; font-size:18px;">Nuevo Plato en ${categoriaActual}</h2>
            <input type="text" id="edit-nom" placeholder="Nombre del plato">
            <textarea id="edit-desc" placeholder="Descripción" style="height:70px;"></textarea>
            <input type="number" id="edit-preu" placeholder="Precio (0.00)" step="0.01">
            <input type="hidden" id="nombre-foto-nueva" value="">
            <input type="hidden" id="edit-categoria" value="${categoriaActual}">
            <div style="display:flex; align-items:center; gap:10px;">
                <input type="checkbox" id="edit-visible" checked>
                <label>Visible en la web</label>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:10px;">
                <button onclick="tancarModal()" style="padding:10px 15px; background:#ccc; border:none; border-radius:5px;">Cancelar</button>
                <button id="btn-crear-final" disabled onclick="guardarCanvis(null)" style="padding:10px 15px; background:#888; color:#fff; border:none; border-radius:5px; opacity:0.6;">
                    CREAR PLATO
                </button>
            </div>
            <p id="aviso-foto" style="font-size:11px; color:#d9534f; margin-top:10px; font-weight:bold;">
                ⚠️ Primero debes subir la foto para poder crear el plato.
            </p>
        </div>`;
    modal.style.display = 'flex';
};

window.onload = function() { document.body.style.opacity = "1"; };