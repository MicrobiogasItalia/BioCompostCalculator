// script.js

async function calcola() {
    // 1) Apro subito una finestra vuota (_blank) nel contesto del click
    const nuovaScheda = window.open("", "_blank");
    if (!nuovaScheda) {
        alert("Safari ha bloccato la popup — per favore consenti i pop-up per questo sito.");
        return;
    }

    try {
        // 2) Carico i dati JSON
        const response = await fetch('./data/biocompost_dati_completi.json');
        if (!response.ok) {
            throw new Error(`Errore caricamento JSON: ${response.statusText}`);
        }
        const datiMacchine = await response.json();

        // 3) Definisco le taglie disponibili
        const macchine = [
            { taglia: "BCM-5", capacita: 5 },
            { taglia: "BCM-15", capacita: 15 },
            { taglia: "BCM-25", capacita: 25 },
            { taglia: "BCM-50", capacita: 50 },
            { taglia: "BCM-100", capacita: 100 },
            { taglia: "BCM-200", capacita: 200 },
            { taglia: "BCM-300", capacita: 300 },
            { taglia: "BCM-500", capacita: 500 },
            { taglia: "BCM-1000", capacita: 1000 },
            { taglia: "BCM-2000", capacita: 2000 },
            { taglia: "BCM-3000", capacita: 3000 },
            { taglia: "BCM-5000", capacita: 5000 },
            { taglia: "BCM-10000", capacita: 10000 }
        ];

        // 4) Leggo input e calcolo kg/giorno
        const tonnellate = parseFloat(document.getElementById('tonnellate').value);
        if (isNaN(tonnellate) || tonnellate <= 0) {
            alert("Inserisci un valore valido.");
            nuovaScheda.close();
            return;
        }
        const kgGiorno = (tonnellate * 1000) / 365;

        // 5) Scelgo la macchina più adatta
        let macchinaConsigliata = macchine.find(m => kgGiorno <= m.capacita);
        if (!macchinaConsigliata) {
            macchinaConsigliata = macchine[macchine.length - 1];
        }

        // 6) Preparo l’HTML dei dati tecnici
        const datiTecnici = datiMacchine[macchinaConsigliata.taglia];
        if (!datiTecnici) {
            alert("Dati tecnici non trovati per questa macchina.");
            nuovaScheda.close();
            return;
        }

        let tabellaHtml = '<tr><th>Caratteristica</th><th>Valore</th></tr>';
        for (const [categoria, valore] of Object.entries(datiTecnici)) {
            tabellaHtml += `<tr><td>${categoria}</td><td>${valore}</td></tr>`;
        }
        tabellaHtml += '<tr><td colspan="2"><em>Agevolazioni fiscali e finanziamenti disponibili</em></td></tr>';

        // 7) Scrivo il contenuto nella finestra già aperta
        nuovaScheda.document.write(`
            <!DOCTYPE html>
            <html lang="it">
            <head>
                <meta charset="UTF-8">
                <title>Dettagli ${macchinaConsigliata.taglia}</title>
                <style>
                    body { font-family: Arial; padding: 20px; position: relative; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                    th { background-color: #f0f0f0; }
                    .logo, .machine-img { max-width: 200px; height: auto; margin-bottom: 15px; display: block; }
                    .btn-email {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background-color: #4caf50;
                        color: white;
                        padding: 25px 40px;
                        border-radius: 10px;
                        text-decoration: none;
                        font-weight: bold;
                        font-size: 24px;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                        transition: background-color 0.3s, transform 0.2s;
                    }
                    .btn-email:hover {
                        background-color: #45a049;
                        transform: scale(1.05);
                    }
                </style>
            </head>
            <body>
                <img src="./img/logo.png" alt="Logo BioCompostMachine" class="logo">
                <img src="./img/machine.png" alt="Illustrazione macchina ${macchinaConsigliata.taglia}" class="machine-img">
                <a class="btn-email" href="mailto:l.boiardi@microbiogasitalia.it,info@microbiogasitalia.it?subject=Interesse per ${macchinaConsigliata.taglia}&body=Sono interessato alla macchina ${macchinaConsigliata.taglia}. Contattatemi per maggiori informazioni.">
                    Sono Interessato
                </a>
                <h1>Macchina Consigliata: ${macchinaConsigliata.taglia}</h1>
                <table>
                    ${tabellaHtml}
                </table>
            </body>
            </html>
        `);
        nuovaScheda.document.close();

    } catch (error) {
        // In caso di errore chiudo la finestra e mostro alert
        nuovaScheda.close();
        alert("Errore: " + error.message);
        console.error(error);
    }
}
