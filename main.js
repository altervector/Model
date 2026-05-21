/* ============================================================
   MAIN.JS - Contingut principal de la pàgina
   Depèn de: config.js
   Edita aquí el contingut de cada projecte
   ============================================================ */

(function() {

    const inicialitzar = () => {

        /* ─── 1. NAVBAR ─────────────────────────────────────────── */
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = `
                <nav class="navbar">
                    <div class="navbar-logo">
                        <img src="${CONFIG.BASE_URL}${CONFIG.LOGO}" alt="${CONFIG.NOM}">
                    </div> 
                       <button class="navbar-hamburguesa">☰</button>
                    
                    <ul class="navbar-menu">
                        <li><a href="#menus">Menús</a></li>
                        <li><a href="javascript:void(0)" onclick="obrirModalCarta()">Carta</a></li>
                        <li><a href="javascript:void(0)" onclick="obrirModalVins()">Vins i Caves</a></li>
                        <li><a href="#reserves">Reservas</a></li>
                    </ul>
                </nav>
            `;
        }
const btnHamburguesa = document.querySelector('.navbar-hamburguesa');
const menu = document.querySelector('.navbar-menu');

btnHamburguesa.addEventListener('click', () => {
    menu.classList.toggle('obert');
});

menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        menu.classList.remove('obert');
    });
});

// ─── LONG PRESS AL LOGO (1,5 segons → login) ─────────
const logo = document.querySelector('.navbar-logo img');
let timerLogo;

const iniciarPress = (e) => {
    e.preventDefault();
    timerLogo = setTimeout(() => {
        window.obrirModalLogin();
    }, 1500);
};

const aturarPress = () => clearTimeout(timerLogo);

logo.addEventListener('mousedown',   iniciarPress);
logo.addEventListener('mouseup',     aturarPress);
logo.addEventListener('mouseleave',  aturarPress);
logo.addEventListener('touchstart',  iniciarPress, { passive: false });
logo.addEventListener('touchend',    aturarPress);
logo.addEventListener('contextmenu', (e) => e.preventDefault());

       /* ─── 2. HERO ───────────────────────────────────────────── */
        const hero = document.getElementById('hero');
        if (hero) {
            hero.innerHTML = `
                <section class="hero">
                    <img class="hero-imatge" src="${CONFIG.BASE_URL}${CONFIG.BLOC_HERO}"
                        alt="${CONFIG.NOM}">
                    <div class="hero-overlay"></div>
                    <div class="hero-contingut">
                        <h1 class="hero-titol">${CONFIG.NOM}</h1>
                        <p class="hero-slogan">${CONFIG.SLOGAN}</p>
                        <a href="#qui-som" class="hero-boto">Descúbrenos</a>
                    </div>
                </section>
            `;
        }

        /* ─── 3. SECCIONS ───────────────────────────────────────── */
        const seccions = document.getElementById('seccions');
        if (seccions) {
            seccions.innerHTML = `

                <section class="seccio" id="menus">
                    <h2 class="seccio-titol">La nostra Carta</h2>
                    <div class="menus-grid">

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalPlats()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.BASE_URL}${CONFIG.BLOC1}"
                                        alt="Plats"
                                        onerror="this.src='${CONFIG.BASE_URL}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>Platos de la Casa</h3>
                                    <p>Nuestro platos principales. Cocina Colombiana y Española.</p>
                                </div>
                            </a>
                        </div>

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalTapas()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.BASE_URL}i${CONFIG.BLOC2}"
                                        alt="Tapes"
                                        onerror="this.src='${CONFIG.BASE_URL}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>Tapas</h3>
                                    <p>Una selección de tapas para compartir.</p>
                                </div>
                            </a>
                        </div>

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalPostres()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.BASE_URL}${CONFIG.BLOC3}"
                                        alt="Postres"
                                        onerror="this.src='${CONFIG.BASE_URL}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>Postres</h3>
                                    <p>La mejor manera de terminar una buena comida.</p>
                                </div>
                            </a>
                        </div>

                        <div class="menu-bloc">
                            <a href="javascript:void(0)" onclick="obrirModalBegudes()">
                                <div class="menu-bloc-imatge">
                                    <img src="${CONFIG.BASE_URL}${CONFIG.BLOC4}"
                                        alt="Begudes"
                                        onerror="this.src='${CONFIG.BASE_URL}${CONFIG.BLOC_HERO}'">
                                </div>
                                <div class="menu-bloc-text">
                                    <h3>Bebidas</h3>
                                    <p>Vinos, Cavas, refrescos y mucho más.</p>
                                </div>
                            </a>
                        </div>

                    </div>
                </section>

                <hr class="separador">

                <section class="seccio" id="qui-som">
                    <h2 class="seccio-titol">Quienes somos...</h2>
                    <p class="seccio-text">
                        Escribe aquí la descripción del negocio. Quienes sois,
                        què ofreceis, cual  és la vostra filosofia.
                    </p>
                </section>

                <hr class="separador">

                <section class="seccio" id="horaris">
                    <h2 class="seccio-titol">Horarios</h2>
                    <p class="seccio-text">Dilluns a divendres: 13:00 – 15:30h</p>
                    <p class="seccio-text">Divendres i dissabte nit: 20:45 – 23:30h</p>
                    <p class="seccio-text">Diumenge: Tancat</p>
                </section>

                <hr class="separador">

                <section class="seccio" id="reserves">
                    <h2 class="seccio-titol">Haz tu Reserva</h2>
                    <p class="seccio-text">
                        <a href="tel:${CONFIG.TELEFON}">📞 ${CONFIG.TELEFON}</a>
                    </p>
                    <p class="seccio-text">
                        <a href="mailto:${CONFIG.EMAIL}">✉️ ${CONFIG.EMAIL}</a>
                    </p>
                </section>
            `;
        }

        /* ─── 4. FOOTER ─────────────────────────────────────────── */
        const footer = document.getElementById('footer');
        if (footer) {
            footer.innerHTML = `
                <footer class="footer">
                    <p class="footer-nom">${CONFIG.NOM}</p>
                    <p>${CONFIG.ADRECA}</p>
                    <p><a href="tel:${CONFIG.TELEFON}">${CONFIG.TELEFON}</a></p>
                    <a href="mailto:${CONFIG.EMAIL}">✉️ ${CONFIG.EMAIL}</a>
                    <p>
                        <a href="${CONFIG.INSTAGRAM}" target="_blank">Instagram</a>
                        &nbsp;·&nbsp;
                        <a href="${CONFIG.FACEBOOK}" target="_blank">Facebook</a>
                    </p>
                    <p class="footer-poweredby">
                        Powered by <a href="https://www.altervector.com" target="_blank">AlterVector</a>
                    </p>
                </footer>
            `;
        }

        /* ─── 5. NAVBAR SCROLL ───────────────────────────────────── */
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.navbar');
            if (nav) {
                nav.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
    // ─── BLOQUEJAR MENÚ CONTEXTUAL ───────────────────────
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    }; // fi inicialitzar

    if (document.readyState === "complete" || document.readyState === "interactive") {
        inicialitzar();
    } else {
        document.addEventListener("DOMContentLoaded", inicialitzar);
    }

})();