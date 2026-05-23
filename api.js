// api.js - Mòdul de connexió amb el Worker (Búnker)
const API = {
    async llegir(categoria = "") {
        try {
            // Si passes una categoria, la posem com a paràmetre ?categoria=Vins
            const parametre = categoria ? `?categoria=${encodeURIComponent(categoria)}` : "";
            const url = `${CONFIG.BASE_WORKER}${parametre}`;
            
            const resposta = await fetch(url);
            
            if (!resposta.ok) {
                throw new Error(`Error API: ${resposta.status}`);
            }
            
            return await resposta.json();
        } catch (error) {
            console.error("Error al mòdul API:", error);
            return null; // Retornem null per saber que ha fallat
        }
    }
};