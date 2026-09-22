# 🍀 Resultado Mega-Sena - DevOps & CI/CD

Este projeto é um laboratório prático de cultura DevOps, focado em Integração e Entrega Contínuas (CI/CD). O objetivo é exibir o resultado do último sorteio da Mega-Sena, utilizando a API oficial da Caixa Econômica Federal, com uma arquitetura moderna, 100% automatizada e de **custo zero** (FinOps).

## 🚀 Arquitetura e Tecnologias

*   **Front-end:** HTML5, CSS3, Vanilla JavaScript.
*   **Versionamento:** Git & GitHub (Fluxo de branches `dev` e `main`).
*   **Hospedagem:** Azure Static Web Apps (Plano Gratuito).
*   **CI/CD:** GitHub Actions.
*   **Estratégia de Dados:** Static Site Generation (SSG). O pipeline busca os dados da API da Caixa no momento do *build* para evitar bloqueios de CORS e WAF (Web Application Firewall).

---

## 🛠️ Passo a Passo para Recriar o Projeto

### Passo 1: Criação do Repositório e Configuração de Branches
Por convenção, usamos a branch `main` como ambiente de produção e a branch `dev` para desenvolvimento local.

1. Crie um repositório no GitHub chamado `megasena-app` e marque a opção **"Add a README file"**.
2. No seu terminal, clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/megasena-app.git
   cd megasena-app
   ```
3. Crie e mude para a branch de desenvolvimento:
   ```bash
   git checkout -b dev
   git push -u origin dev
   ```

### Passo 2: Criação dos Arquivos Locais
Crie os três arquivos base da aplicação na raiz do seu projeto.

**1. `index.html`**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado Mega-Sena</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Mega-Sena - Versão DevOps (CI/CD)</h1>
        <h2 id="concurso-info">Carregando...</h2>
        <div id="numeros" class="numeros-container">
            <!-- Os números vão aparecer aqui -->
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

**2. `style.css`** (Com as cores oficiais da Caixa)
```css
body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
}
.container {
    background-color: #005ca9; /* Azul Caixa */
    color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    text-align: center;
}
h1 { color: white; }
#concurso-info {
    color: #e0e0e0;
    font-size: 1.2em;
    margin-bottom: 20px;
}
.numeros-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}
.bola {
    background-color: #209869; /* Verde Mega-Sena */
    color: white;
    font-size: 1.5em;
    font-weight: bold;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}
```

**3. `script.js`**
```javascript
async function buscarResultadoMegaSena() {
    try {
        // O arquivo resultado.json é gerado dinamicamente pelo pipeline (GitHub Actions)
        const response = await fetch('./resultado.json');
        
        if (!response.ok) throw new Error('Arquivo não encontrado.');

        const data = await response.json();
        
        document.getElementById('concurso-info').textContent = `Concurso: ${data.numero} | Data: ${data.dataApuracao}`;

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
```

Faça o commit e envie para a branch `dev`:
```bash
git add .
git commit -m "feat: cria estrutura inicial do app"
git push origin dev
```

### Passo 3: Provisionamento no Azure e CI/CD
1. Mescle o código da `dev` para a `main`:
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```
2. Acesse o [Portal do Azure](https://portal.azure.com).
3. Crie um recurso do tipo **Static Web Apps** (Aplicativos Web Estáticos).
4. Selecione o plano **Gratuito**.
5. Em "Detalhes da Implantação", conecte sua conta do GitHub e aponte para o repositório `megasena-app` na branch `main`.
6. Em "Predefinições de Build", escolha **Personalizado** (ou HTML) e defina o "Local do aplicativo" como `/`.
7. Clique em **Criar**. O Azure irá gerar automaticamente um arquivo YAML de configuração na sua branch `main` do GitHub.

### Passo 4: O "Pulo do Gato" - Geração de Dados Estáticos e Agendamento
Para evitar bloqueios de segurança (CORS e WAF) da Caixa, configuramos o servidor do GitHub para baixar os dados durante o *build* do site.

1. Sincronize seu ambiente local:
   ```bash
   git pull origin main
   git checkout dev
   git merge main
   ```
2. Abra o arquivo `.yml` criado na pasta `.github/workflows/`.
3. Adicione o gatilho `schedule` (cron job) para atualizar diariamente às 07:00 (horário de Brasília) e o passo de `run` com o `curl` para baixar a API antes do deploy:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main
  schedule:
    - cron: '0 10 * * *' # Executa todos os dias às 10h UTC (07h BRT)

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed') || github.event_name == 'schedule'
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
          lfs: false
          
      # Faz o download do resultado direto do servidor da Caixa e salva como um arquivo estático JSON
      - name: Baixar Resultado da Caixa
        run: curl -k -s -L --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" "https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/" > resultado.json

      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/" 
          api_location: "" 
          output_location: "." 
```

### Passo 5: Fluxo de Trabalho Padrão (Deploy)
Sempre que fizer uma alteração local, siga o fluxo abaixo para colocar em produção:

```bash
# 1. Salva na dev
git add .
git commit -m "sua mensagem descritiva"
git push origin dev

# 2. Promove para main
git checkout main
git merge dev

# 3. Dispara o CI/CD
git push origin main

# 4. Volta para desenvolvimento
git checkout dev
```

Pronto! O seu projeto rodará perfeitamente, sendo atualizado diariamente pelo próprio GitHub e hospedado de graça no Azure.