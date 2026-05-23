const CONFIG = {


   // 1. NEGOCI
    NOM:            "Nom",
    LOGO:           "Icon/logotrans.png",
    SLOGAN:         "El teu eslògan aquí",
    TELEFON:        "+34 000 000 000",
    EMAIL:          "mail@altervector.com",
    ADRECA:         "Carrer, número, població",
    INSTAGRAM:      "https://www.instagram.com/",
    FACEBOOK:       "https://www.facebook.com/",
    EMAIL_SUPORT:   "suport@altervector.com",


    // 2. RUTES
    REPO_URL:       "https://altervector.github.io/disseny_simple/",
    BASE_URL:       "./",
    BASE_WORKER:    "https://oleyaji.altervector.workers.dev",
    URL_OFICIAL:    "https://disseny_simple.altervector.com",


    // 3. SEGURETAT (Tu lista exacta del index)
    SITIOS_SEGUROS:  ["altervector.com", "pages.dev", "altervector.github.io", "localhost", "127.0.0.1"],
 

    // 4. CLOUDINARY
    CLOUDI_NAME: "deopqx65a",
    PDF_ID: "productos/Carta_OleyAji",
    PDF_URL: "https://res.cloudinary.com/deopqx65a/image/upload/productos/Carta_OleyAji.pdf",

    // 5. MODO EDICIO (El único punto de verdad)
    ES_ADMIN: sessionStorage.getItem('adminMode') === 'true'
};
if (CONFIG.ES_ADMIN) {
    window.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('admin-mode-active');
    });
}
