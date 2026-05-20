/* ============================================================
   API.JS - Connector amb el Worker de agora
   Depèn de: config.js
   ============================================================ */

const API = {

    // ─── CÀRREGA ÚNICA DE TOTES LES DADES ───────────────────
    // Crida al Worker UNA SOLA VEGADA sense filtres.
    // Guarda el resultat a window.DADES_MENU per reutilitzar-lo.
    async carregarTot() {
        if (window.DADES_MENU) return window.DADES_MENU; // ja carregat, no torna a cridar
        try {
            const resposta = await fetch(CONFIG.BASE_WORKER);
            if (!resposta.ok) throw new Error(`Error API: ${resposta.status}`);
            window.DADES_MENU = await resposta.json();
            return window.DADES_MENU;
        } catch (error) {
            console.error("Error al mòdul API:", error);
            return null;
        }
    },

    // ─── FILTRAR LOCALMENT ───────────────────────────────────
    // Rep la categoria (ex: "Plats", "Vins") i filtra les dades
    // ja carregades a memòria basant-se en la taula d'Oleyají.

    filtrar(camp) {
    if (!window.DADES_MENU) return [];
    if (!camp) return window.DADES_MENU;
    return window.DADES_MENU.filter(r => 
        r.fields && 
        Array.isArray(r.fields.Categoria) &&
        r.fields.Categoria.includes(camp) &&
        r.fields.Visible === true
    );
    },

    // ─── COMPATIBILITAT (per si algun lloc encara crida llegir) ─
    async llegir(tipus = "") {
        await this.carregarTot();
        return tipus ? this.filtrar(tipus) : window.DADES_MENU;
    }

};