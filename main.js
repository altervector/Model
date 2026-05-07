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
                        <img src="${CONFIG.BASE_URL}Icon/logo.png" alt="${CONFIG.NOM}">
                    </div>
                    <ul class="navbar-menu">
                        <li><a href="#seccions">Carta</a></li>
                        <li><a href="#footer">Contacte</a></li>
                    </ul>
                </nav>
            `;
        }

        /* ─── 2. HERO ───────────────────────────────────────────── */
        const hero = document.getElementById('hero');
        if (hero) {
            hero.innerHTML = `
                <section class="hero">
                    <img class="hero-imatge" src="${CONFIG.BASE_URL}images/hero.jpg" 
                        alt="${CONFIG.NOM}">
                    <div class="hero-overlay"></div>
                    <div class="hero-contingut">
                        <h1 class="hero-titol">${CONFIG.NOM}</h1>
                        <p class="hero-slogan">${CONFIG.SLOGAN}</p>
                        <a href="#seccions" class="hero-boto">Descobreix-nos</a>
                    </div>
                </section>
            `;
        }

        /* ─── 3. SECCIONS ───────────────────────────────────────── */
        const seccions = document.getElementById('seccions');
        if (seccions) {
            seccions.innerHTML = `
                <section class="seccio" id="qui-som">
                    <h2 class="seccio-titol">Qui som</h2>
                    <p class="seccio-text">
                        Escriu aquí la descripció del negoci. Qui sou, 
                        què oferiu, quina és la vostra filosofia.
                    </p>
                </section>

                <hr class="separador">

                <section class="seccio seccio-alt" id="horaris">
                    <h2 class="seccio-titol">Horaris</h2>
                    <p class="seccio-text">Dilluns a divendres: 13:00 – 15:30h</p>
                    <p class="seccio-text">Divendres i dissabte nit: 20:45 – 23:30h</p>
                    <p class="seccio-text">Diumenge: Tancat</p>
                </section>

                <hr class="separador">

                <section class="seccio" id="contacte">
                    <h2 class="seccio-titol">Contacte</h2>
                    <p class="seccio-text">
                        <a href="tel:${CONFIG.TELEFON}">📞 ${CONFIG.TELEFON}</a>
                    </p>
                    <p class="seccio-text">
                        <a href="mailto:${CONFIG.EMAIL}">✉️ ${CONFIG.EMAIL}</a>
                    </p>
                    <p class="seccio-text">${CONFIG.ADRECA}</p>
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
                    <p>
                        <a href="${CONFIG.INSTAGRAM}" target="_blank">Instagram</a>
                        &nbsp;·&nbsp;
                        <a href="${CONFIG.FACEBOOK}" target="_blank">Facebook</a>
                    </p>
                    <p class="footer-poweredby">
                        Powered by <a href="https://altervector.com" target="_blank">AlterVector</a>
                    </p>
                </footer>
            `;
        }

        /* ─── 5. NAVBAR TRANSPARENT ─────────────────────────────── */
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.navbar');
            if (nav) {
                nav.classList.toggle('scrolled', window.scrollY > 50);
            }
        });

    }; // fi inicialitzar

    if (document.readyState === "complete" || document.readyState === "interactive") {
        inicialitzar();
    } else {
        document.addEventListener("DOMContentLoaded", inicialitzar);
    }

})();