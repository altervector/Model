/* ============================================================
   GALERIA.JS - Mòdul de galeria de productes
   Depèn de: config.js, api.js
   Usa: adminlogic.js (obrirModal)
   ============================================================ */

(function() {

    function inicialitzarGaleria() {
        const contenidor = document.getElementById("cosgaleria");
        const titolHTML = document.getElementById("titol-categoria");
        const params = new URLSearchParams(window.location.search);
        const catClau = params.get('Categoria');

        if (!catClau) return;

        if (titolHTML) {
            titolHTML.innerText = catClau;
            titolHTML.classList.add('loading');
        }

        fetch(`${CONFIG.BASE_WORKER}?Categoria=${encodeURIComponent(catClau)}`)
        .then(response => response.json())
        .then(records => {
            let html = '';
            const baseCloudy = `https://res.cloudinary.com/${CONFIG.CLOUDI_NAME}/image/upload/f_auto,q_auto/`;
            const fotoDefault = `${CONFIG.REPO_URL}images/Default.png`;

            records.forEach(r => {
                const f = r.fields;
                let foto = Array.isArray(f.Foto) ? f.Foto[0] : f.Foto;
                const imgPath = foto ? `${baseCloudy}${foto}` : fotoDefault;

                const esVisible = f.Visible === true;
                if (!esVisible && !CONFIG.ES_ADMIN) return;

                const classeExtra = esVisible ? '' : 'item-ocult';

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

        // Botó flotant (+) només en mode admin
        if (CONFIG.ES_ADMIN) {
            const btnAfegir = `
                <div id="btn-nou-plat" class="controles-admin" onclick="window.obrirModalNuevo()" 
                    style="position:fixed; bottom:20px; left:50%; transform:translateX(130px); width:60px; height:60px; background:#28a745; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:35px; cursor:pointer; z-index:9999; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-family: sans-serif;">
                    +
                </div>`;
            document.body.insertAdjacentHTML('beforeend', btnAfegir);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        inicialitzarGaleria();
    } else {
        document.addEventListener("DOMContentLoaded", inicialitzarGaleria);
    }

})();