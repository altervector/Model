/* ============================================================
   LOADER.JS - Carregador universal de pàgines
   Depèn de: config.js (ha de carregar-se abans)
   Uso: definir window.MODULS abans de carregar aquest script
   ============================================================ */

(function() {
    if (typeof CONFIG === 'undefined') return;

    // 1. SEGURETAT
    const esSitioSeguro = CONFIG.SITIOS_SEGUROS.some(s => window.location.hostname.includes(s));
    if (!esSitioSeguro) {
        document.documentElement.innerHTML = "";
        window.location.href = CONFIG.URL_OFICIAL;
        return;
    }

    const now = new Date().getTime();
    const repoBase = CONFIG.REPO_URL;

    // 2. CSS
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = repoBase + "estils.css?v=" + now;
    document.head.appendChild(css);

    // 3. FAVICON
    const favicon = document.createElement("link");
    favicon.rel = "icon";
    favicon.href = repoBase + "Icon/logonou.ico";
    document.head.appendChild(favicon);

    // 4. SCRIPTS (els que cada pàgina defineix a window.MODULS)
    const moduls = window.MODULS || [];
    moduls.forEach(file => {
        const s = document.createElement("script");
        s.src = repoBase + file + "?v=" + now;
        s.async = false;
        document.head.appendChild(s);
    });

    // 5. QUITAR VELO
    window.addEventListener('load', () => {
        document.body.style.opacity = "1";
    });

})();