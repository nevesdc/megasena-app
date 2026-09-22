async function buscarResultadoMegaSena() {
    try {
        // Simula o tempo de resposta de uma API (1 segundo)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados simulados para focar no fluxo DevOps
        const data = {
            concurso: 2780,
            data: "22/09/2026",
            dezenas: ["04", "12", "23", "34", "45", "56"]
        };
        
        const infoElement = document.getElementById('concurso-info');
        infoElement.textContent = `Concurso: ${data.concurso} | Data: ${data.data}`;

        const numerosContainer = document.getElementById('numeros');
        numerosContainer.innerHTML = ''; 

        data.dezenas.forEach(numero => {
            const bola = document.createElement('div');
            bola.className = 'bola';
            bola.textContent = numero;
            numerosContainer.appendChild(bola);
        });

    } catch (error) {
        document.getElementById('concurso-info').textContent = 'Erro ao carregar os dados.';
        console.error("Erro:", error);
    }
}

buscarResultadoMegaSena();