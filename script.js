async function buscarResultadoMegaSena() {
    try {
        // Agora buscamos um arquivo local (que será gerado no pipeline)
        const response = await fetch('./resultado.json');
        
        if (!response.ok) {
            throw new Error('Arquivo de resultado não encontrado.');
        }

        const data = await response.json();
        
        const infoElement = document.getElementById('concurso-info');
        infoElement.textContent = `Concurso: ${data.numero} | Data: ${data.dataApuracao}`;

        const numerosContainer = document.getElementById('numeros');
        numerosContainer.innerHTML = ''; 

        data.listaDezenas.forEach(numero => {
            const bola = document.createElement('div');
            bola.className = 'bola';
            bola.textContent = numero;
            numerosContainer.appendChild(bola);
        });

    } catch (error) {
        document.getElementById('concurso-info').textContent = 'Erro ao carregar os dados estáticos.';
        console.error("Erro:", error);
    }
}

buscarResultadoMegaSena();