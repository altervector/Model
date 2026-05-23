(function() {
    // 1. TÍTOL, FAVICON I META
    document.title = "Olé y Ají - Restaurant i Tapes";

    // Ara aquesta constant no xocarà amb les dels altres scripts
    const repoBase = CONFIG.REPO_URL;
    const logotipo = CONFIG.LOGO;

    let favicon = document.querySelector("link[rel*='icon']");
    if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    favicon.href = repoBase + logotipo;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", "Donde Colombia y España se unen en sabor.");

    // 2. FUNCIÓ DE CÀRREGA
    const inicialitzarCapcalera = () => {
        const headerHTML = `
            <div class="capcalera-principal">
                <div class="contenidor-logo">
                    <img src="${repoBase}${logotipo}" alt="Disponible" class="logo">
                </div>
                <div class="text-capcalera">
                    <p>
                        <em>🇨🇴 Donde Colombia y España
                        <span class="subtitol-capcalera"> se unen en sabor 🇪🇸</span></em>
                    </p>
                </div>
            </div>
            <hr class="separador-hr">
            <hr class="separador-hr">
        `;

        const el = document.getElementById("capcalera-dinamica");
        if (!el) return;
        el.innerHTML = headerHTML;

        const logo = el.querySelector('.logo');
        let timerLogo;

        if (logo) {
            const esAdmin = CONFIG.ES_ADMIN;

            if (esAdmin) {
                // --- 1. ESTEM EN MODE EDICIO ---
                logo.style.filter = "brightness(0) saturate(100%) invert(15%) sepia(98%) saturate(3019%) hue-rotate(202deg)"; 
                document.documentElement.style.setProperty('background-color', 'var(--bg-htmledit)', 'important');
                logo.style.cursor = "pointer"; // Hi posem la maneta per indicar que es pot clicar
                
                // Un simple clic ens treu de l'EDICIO
                logo.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm("Vols sortir del mode administrador?")) {
                        sessionStorage.removeItem('adminMode'); // Esborrem l'estat
                        location.reload(); // Recarreguem la web normal
                    }
                });

            } else {
                // --- 2. ESTEM EN MODE CLIENT NORMAL ---
                // Activem el teu truc dels 2 segons per entrar
             const login = (e) => {
                    if (e) e.preventDefault(); 
                    timerLogo = setTimeout(async () => { // Afegim async aquí
                        const clau = prompt("Clau:");
                        if (!clau) return;

                        try {
                            const respuesta = await fetch(`/saludo?p=${clau}`);
                            const resultado = await respuesta.text();

                            if (resultado === "OK") {
                                sessionStorage.setItem('adminMode', 'true');
                                location.reload();
                            } else {
                                mostrarAvis("❌ Clau incorrecta", 'error')
                            }
                        } catch (error) {
                            mostrarAvis("❌ Error de connexió", 'error')
                        }
                    }, 1500); 
                };

                const stop = () => clearTimeout(timerLogo);
                
                logo.addEventListener('mousedown', login);
                logo.addEventListener('mouseup', stop);
                logo.addEventListener('mouseleave', stop);
                logo.addEventListener('touchstart', login, { passive: false });
                logo.addEventListener('touchend', stop);
                logo.addEventListener('contextmenu', (e) => e.preventDefault()); 
            }
        }
    };

    // 3. PROTECTOR D'EXECUCIÓ
    if (document.readyState === "complete" || document.readyState === "interactive") {
        inicialitzarCapcalera();
    } else {
        document.addEventListener("DOMContentLoaded", inicialitzarCapcalera);
    }
})();