(function() {
    const inicialitzarEnllacos = () => {
        // 1. PINTAMOS EL HTML PRIMERO
        const enllacosHTML = `
            <div class="bloc-enllacos">
                <p>
                    <a href="javascript:void(0)" 
                       onclick="window.open('https://res.cloudinary.com/deopqx65a/raw/upload/Carta_OleyAji.pdf?v=' + Date.now(), '_blank')" 
                       class="boto-pdf">
                        <img src="${CONFIG.REPO_URL}Icon/Icopdf.png" alt="Pdf" class="icona-app">Descarrèga la Carta al complet (PDF)
                    </a>
                </p>
                <p><a href="https://www.instagram.com/oleyajivilafranca" target="_blank"><img src="${CONFIG.REPO_URL}Icon/Icoinsta.png" alt="Instagram" class="icona-app">Instagram: @oleyajivilafranca</a></p>
                <p><a href="tel:9344008645"><img src="${CONFIG.REPO_URL}Icon/Icophone.png" alt="Reserves" class="icona-app">Reservas</a></p>
                <p><a href="mailto:oleyaji@altervector.com"> <img src="${CONFIG.REPO_URL}Icon/Icomail.png" alt="e-mail" class="icona-app">Envia un correu</a></p>
            </div>
            <hr class="separador-hr">
            <hr class="separador-hr">
            <footer style="text-align: center; padding: 40px 20px; font-family: 'Segoe UI', Roboto, sans-serif;">
                <a href="https://www.altervector.com" target="_blank" style="text-decoration: none; color: #999; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">
                Powered by <span style="color: #129dfc; font-weight: bold; border-bottom: 1px solid #129dfc;">AlterVector</span>
                </a>
            </footer>
        `;

        const contenidor = document.getElementById("bloc-enllacos-dinamic");
        if (contenidor) {
            contenidor.innerHTML = enllacosHTML;
        }

        // 2. LÓGICA DE EDICIO
        if (CONFIG.ES_ADMIN) {
            const pdfIcon = document.querySelector('.boto-pdf');
            if (pdfIcon) {
                // Anul·lem el onclick de l'HTML perquè no s'obri el PDF en mode EDICIO
                pdfIcon.onclick = null; 
                pdfIcon.style.border = "4px dashed #f6bc51";
                
                // Treiem l'async d'aquí per evitar el bloqueig del navegador
                pdfIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'application/pdf';
                    
                    // L'async el posem aquí, on realment es fa la feina de pujada
                    input.onchange = async (event) => {
                        const file = event.target.files[0]; 
                        if (!file) return;
                        
                        // SPINNER
                        const loader = document.createElement('div');
                        loader.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; font-family:sans-serif;";
                        loader.innerHTML = `<div style="border: 4px solid rgba(255,255,255,0.3); border-radius: 50%; border-top: 4px solid #f6bc51; width: 45px; height: 45px; animation: spin 1s linear infinite;"></div><p style="margin-top:20px; font-weight:bold; letter-spacing:1px;">PUJANT CARTA...</p><style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>`;
                        document.body.appendChild(loader);

                       // Dentro de la lógica de edición
                        // 1. Pedimos la firma y el timestamp al Worker (Caja fuerte)
                        const respFirma = await fetch("https://oleyaji.altervector.workers.dev/sign-cloudinary");
                        const { signature, timestamp } = await respFirma.json();

                        // 2. Usamos el nombre del cloud desde tu CONFIG
                        const cloudName = CONFIG.CLOUDI_NAME;

                        // FORMDATA
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('public_id', 'Carta_OleyAji');
                        formData.append('upload_preset', 'preset_pdf_fijo'); 
                        formData.append('timestamp', timestamp);
                        formData.append('api_key', '786648346725765'); 
                        formData.append('signature', signature);

                        // ENVÍO
                        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
                            method: 'POST',
                            body: formData
                        })
                        .then(r => r.json())
                        .then(data => {
                            if (document.body.contains(loader)) document.body.removeChild(loader);
                            if(data.secure_url) {
                                mostrarAvis("✅ Carta actualitzada!")
                                location.reload();
                            } else {
                                mostrarAvis("❌ Error de pujada.", 'error')
                            }
                        })
                        .catch(err => {
                            if (document.body.contains(loader)) document.body.removeChild(loader);
                            mostrarAvis("❌ Error de connexió.", 'error')
                        });
                    };
                    
                    // Ara el click funcionarà perquè no hi ha cap await previ
                    input.click();
                });
            }
        }
    };

    // Aplicar la mateixa protecció de ReadyState
    if (document.readyState === "complete" || document.readyState === "interactive") {
        inicialitzarEnllacos();
    } else {
        document.addEventListener("DOMContentLoaded", inicialitzarEnllacos);
    }
})();