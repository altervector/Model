(function() {
    const repoBase = CONFIG.REPO_URL;

    const htmlindex = `
    <div class="bloc-imatges">
        <div class="columna-esquerra">
            <a href="principal.html?Categoria=Begudes" class="enllac-imatge-categoria"> 
                <img src="${repoBase}images/PicBloc1.webp" alt="Begudes" class="imatge-categoria">
                <span class="etiqueta-categoria">Bebidas</span>
            </a>
            <a href="principal.html?Categoria=Tapas" class="enllac-imatge-categoria">
                <img src="${repoBase}images/PicBloc2.webp" alt="Tapas" class="imatge-categoria">
                <span class="etiqueta-categoria">Tapas</span>
            </a>
        </div>
        <div class="imatge-dreta">
            <a href="principal.html?Categoria=Plats" class="enllac-imatge-categoria">
                <img src="${repoBase}images/PicBloc3.webp" alt="Platos de la Casa" class="imatge-categoria">
                <span class="etiqueta-categoria">Platos de la Casa</span>
            </a>
        </div>
    </div>
    <div class="bloc-imatge-inferior">
            <a href="principal.html?Categoria=Postres" class="enllac-imatge-categoria item-horizontal">
                <img src="${repoBase}images/PicBloc4.webp" alt="Postres" class="imatge-categoria">
                <span class="etiqueta-categoria">Postres</span>
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=OLÉ+Y+AJÍ+COMIDA+MEDITERRANEA+Y+LATINA+Vilafranca" target="_blank" class="enllac-imatge-categoria item-horizontal">
                <img src="${repoBase}images/PicBloc5.webp" alt="Donde estamos..." class="imatge-categoria">
                <span class="etiqueta-categoria" style="text-shadow: 2px 2px 4px rgba(0,0,0,1);">Donde estamos (Maps)</span>
            </a>
    </div>
    <p style="max-width:var(--amplada-mobil); width:90%; margin: 10px auto 10px auto; font-size: 14px; color:#555; text-align: center;">
        <em>Servicio a domicilio disponible <br><span style="display:block; text-align:center;">...</span></em>
    </p>
    `;

const inicialitzarIndex = async () => { 
        // 1. Intentamos leer la fecha del KV primero
        try {
            const respuesta = await fetch('/saludo'); 
            const fechaServidor = await respuesta.text();
            
            // Si todo va bien, actualizamos la fecha global
            CONFIG.DATA_CADUCITAT = new Date(fechaServidor);
            console.log("Fecha sincronizada con KV:", fechaServidor);
        } catch (error) {
            console.log("Error de conexión. Se mantiene fecha de config.js");
        }

        // 2. Ahora pintamos el contenido de la web
        const el = document.getElementById('contingut-index');
        if (el) {
            el.innerHTML = htmlindex;
        }

        if (CONFIG.ES_ADMIN) {
            document.body.classList.add('admin-mode-active');
            console.log("Mode Edició Actiu");
        }

        // BLOQUEIG PER DATA: Ara sempre s'avaluarà correctament
        if (new Date() > CONFIG.DATA_CADUCITAT) {
            const capaProhibida = document.createElement('div');
            capaProhibida.id = 'capa-bloqueig-net';
            capaProhibida.innerHTML = `
                <style>
                    #capa-bloqueig-net {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(2px);
                        -webkit-backdrop-filter: blur(2px); z-index: 100000; 
                        display: flex; align-items: center; justify-content: center; padding: 20px;
                    }
                  .caixa-neta-glass {
                        background: rgba(255, 240, 220, 0.75); backdrop-filter: blur(15px);
                        -webkit-backdrop-filter: blur(15px); padding: 50px; border-radius: 20px; text-align: center;
                        max-width: 420px; width: 100%; box-shadow: 0 15px 45px rgba(211, 84, 0, 0.15);
                        border: 1px solid rgba(211, 84, 0, 0.2); font-family: sans-serif;
                    }
                  .caixa-neta-glass h2 { color: #d35400; margin-top: 0; font-size: 1.7rem; font-weight: 800; }
                  .caixa-neta-glass p { color: #333; line-height: 1.6; font-size: 1.05rem; }
                </style>
                <div class="caixa-neta-glass">
                    <h2>Avís del Sistema</h2>
                    <p>S'ha acabat el període de prova d'aquest catàleg digital.</p>
                    <div style="margin-top: 35px;">
                        <a href="mailto:${CONFIG.EMAIL_SUPORT}" style="background: #d35400; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Renovar Servei</a>
                    </div>
                </div>
            `;
            document.body.appendChild(capaProhibida);
        }
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
        inicialitzarIndex();
    } else {
        document.addEventListener("DOMContentLoaded", inicialitzarIndex);
    }
})();
