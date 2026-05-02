/* ============================================================
   LOADER.JS - Carregador universal de pàgines
   No tocar — funciona igual per a tots els projectes
   Depèn de: config.js (ha de carregar-se abans)
   ============================================================ */

(function() {
    if (typeof CONFIG === 'undefined') return;

    // 1. SEGURETAT
    if (CONFIG.SITIOS_SEGUROS.length > 0) {
        const esSitioSeguro = CONFIG.SITIOS_SEGUROS.some(s => 
            window.location.hostname.includes(s));
        if (!esSitioSeguro) {
            document.documentElement.innerHTML = "";
            if (CONFIG.URL_OFICIAL) window.location.href = CONFIG.URL_OFICIAL;
            return;
        }
    }

    const now = new Date().getTime();
    const base = CONFIG.BASE_URL;

    // 2. CSS
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = base + "estils.css?v=" + now;
    document.head.appendChild(css);

    // 3. SCRIPTS
    const moduls = window.MODULS || [];
    moduls.forEach(file => {
        const s = document.createElement("script");
        s.src = base + file + "?v=" + now;
        s.async = false;
        document.head.appendChild(s);
    });

    // 4. QUITAR VELO
// 4. QUITAR VELO
if (document.readyState === 'complete') {
    document.body.style.opacity = "1";
} else {
    window.addEventListener('load', () => {
        document.body.style.opacity = "1";
    });
}

})();