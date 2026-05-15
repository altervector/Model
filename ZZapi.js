/* ============================================================
   API.JS - Connector amb el Worker de NewProject
   Depèn de: config.js
   ============================================================ */

const API = {
    async llegir(tipus = "") {
        try {
            const parametre = tipus ? `?tipus=${encodeURIComponent(tipus)}` : "";
            const url = `${CONFIG.BASE_WORKER}${parametre}`;

            const resposta = await fetch(url);

            if (!resposta.ok) {
                throw new Error(`Error API: ${resposta.status}`);
            }

            return await resposta.json();
        } catch (error) {
            console.error("Error al mòdul API:", error);
            return null;
        }
    }
};
