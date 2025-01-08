class ConfrontoAnalyzer {
    constructor() {
        this.maxResults = 10;
    }

    getResults(teamId) {
        const form = document.querySelector(`#${teamId} .results-form`);
        const results = [];
        
        form.querySelectorAll('.results-row').forEach(row => {
            const result = row.querySelector('.result-select').value;
            if (result) {
                results.push({
                    opponent: row.querySelector('.opponent-input').value,
                    result: result,
                    golsPro: parseInt(row.querySelector('.gols-pro').value) || 0,
                    golsContra: parseInt(row.querySelector('.gols-contra').value) || 0,
                    opponentPosition: parseInt(row.querySelector('.opponent-position').value) || 0,
                    mando: row.querySelector('.mando-select').value
                });
            }
        });
        
        return results.reverse();
    }

    calculateTeamScore(results, currentPosition, totalTeams, isMandante) {
        const positionScore = totalTeams ? (totalTeams - currentPosition + 1) / totalTeams : 0.5;
        const mandoBonus = isMandante ? 1.2 : 1.0; // 20% de bônus jogando em casa
        
        // Penalidade por desfalques
        const desfalques = parseInt(document.getElementById(`team${results === this.getResults('teamA') ? 'A' : 'B'}Desfalques`).value) || 0;
        const desfalquesPenalty = Math.max(0.6, 1 - (desfalques * 0.1)); // Cada desfalque reduz 10% do score, mínimo de 60%
        
        return results.reduce((score, result, index) => {
            const weight = (10 - index) / 10;
            
            let points = 0;
            switch(result.result) {
                case 'V': 
                    points = 3;
                    if (result.mando === 'fora') points *= 1.3;
                    break;
                case 'E': 
                    points = 1;
                    if (result.mando === 'fora') points *= 1.2;
                    break;
                default: points = 0;
            }
            
            const saldoGols = result.golsPro - result.golsContra;
            const golsBonus = saldoGols * 0.2;
            const golsProBonus = result.golsPro * 0.1;
            const opponentPositionBonus = this.calculateOpponentPositionBonus(
                result.opponentPosition,
                totalTeams
            );
            
            return score + ((points + golsBonus + golsProBonus + opponentPositionBonus) * weight * positionScore);
        }, 0) * mandoBonus * desfalquesPenalty; // Aplicar bônus de mando e penalidade de desfalques
    }

    calculateOpponentPositionBonus(opponentPosition, totalTeams) {
        if (!opponentPosition || !totalTeams) return 0;
        
        // Quanto melhor a posição do adversário, maior o bônus
        const normalizedPosition = (totalTeams - opponentPosition + 1) / totalTeams;
        return normalizedPosition * 0.5; // Máximo de 0.5 pontos de bônus
    }

    calculateProbabilities() {
        const teamAPosition = parseInt(document.querySelector('#teamA .position-input').value) || 0;
        const teamBPosition = parseInt(document.querySelector('#teamB .position-input').value) || 0;
        const totalTeams = parseInt(document.querySelector('#teamA .total-teams').value) || 20;
        
        const teamAMando = document.querySelector('#teamAMando').value;
        const teamBMando = document.querySelector('#teamBMando').value;

        const teamAResults = this.getResults('teamA');
        const teamBResults = this.getResults('teamB');
        
        const teamAScore = this.calculateTeamScore(teamAResults, teamAPosition, totalTeams, teamAMando === 'casa');
        const teamBScore = this.calculateTeamScore(teamBResults, teamBPosition, totalTeams, teamBMando === 'casa');
        
        // Calcular probabilidade de empate baseada na proximidade dos scores
        const scoreDifference = Math.abs(teamAScore - teamBScore);
        const maxScore = Math.max(teamAScore, teamBScore, 1); // Evitar divisão por zero
        const drawProbability = Math.max(0, 30 - (scoreDifference / maxScore * 30));
        
        // Ajustar as probabilidades de vitória considerando o empate
        const remainingProb = 100 - drawProbability;
        const total = teamAScore + teamBScore;
        
        if (total === 0) {
            this.updateAllProbabilities(33.33, 33.33, 33.33);
            return;
        }

        const teamAProb = (teamAScore / total) * remainingProb;
        const teamBProb = (teamBScore / total) * remainingProb;

        this.updateAllProbabilities(teamAProb, teamBProb, drawProbability);
        this.updateTeamNames();
        this.displayWeightInfo();
    }

    updateAllProbabilities(teamAProb, teamBProb, drawProb) {
        this.updateProbabilityDisplay('teamA', teamAProb);
        this.updateProbabilityDisplay('teamB', teamBProb);
        this.updateProbabilityDisplay('draw', drawProb);
    }

    updateProbabilityDisplay(team, probability) {
        const fill = document.getElementById(`${team}Probability`);
        const percentage = document.getElementById(`${team}Percentage`);
        
        if (fill && percentage) {
            fill.style.width = `${probability}%`;
            percentage.textContent = `${Math.round(probability)}%`;
        }
    }

    displayWeightInfo() {
        const infoDiv = document.getElementById('weightInfo') || this.createWeightInfoDiv();
        
        infoDiv.innerHTML = `
            <h4>Peso dos Resultados</h4>
            <p>Resultados mais recentes têm maior influência no cálculo:</p>
            <ul>
                ${Array.from({length: 10}, (_, i) => {
                    const weight = ((10 - i) / 10) * 100;
                    return `<li>${i + 1}º resultado: ${weight.toFixed(1)}% do peso total</li>`;
                }).join('')}
            </ul>
            <h4>Bônus e Penalidades</h4>
            <ul>
                <li>Vitória: 3 pontos</li>
                <li>Empate: 1 ponto</li>
                <li>Cada gol de saldo: +0.2 pontos</li>
                <li>Cada gol marcado: +0.1 ponto</li>
                <li>Posição na tabela: até 100% de bônus</li>
                <li>Posição do adversário: até 50% de bônus</li>
                <li>Jogando em casa: +20% no score total</li>
                <li>Vitória fora: +30% nos pontos</li>
                <li>Empate fora: +20% nos pontos</li>
                <li>Cada desfalque: -10% no score total</li>
            </ul>
        `;
    }

    createWeightInfoDiv() {
        const infoDiv = document.createElement('div');
        infoDiv.id = 'weightInfo';
        infoDiv.className = 'weight-info';
        
        const container = document.querySelector('.analysis-container');
        container.appendChild(infoDiv);
        
        return infoDiv;
    }

    updateTeamNames() {
        const teamAName = document.getElementById('teamAName').value || 'Time A';
        const teamBName = document.getElementById('teamBName').value || 'Time B';
        
        document.getElementById('teamANameDisplay').textContent = teamAName;
        document.getElementById('teamBNameDisplay').textContent = teamBName;
    }
}

const analyzer = new ConfrontoAnalyzer();

function validateScoreInput(input) {
    input.value = input.value.replace(/[^0-9x]/g, '');
    
    const parts = input.value.split('x');
    if (parts.length > 2) {
        input.value = parts[0] + 'x' + parts[1];
    }
}

function addResultRow(teamId) {
    const form = document.querySelector(`#${teamId} .results-form`);
    const rows = form.querySelectorAll('.results-row');
    
    if (rows.length >= 10) {
        alert('Máximo de 10 resultados atingido');
        return;
    }
    
    const newRow = document.createElement('div');
    newRow.className = 'results-row';
    newRow.innerHTML = `
        <div class="opponent-info">
            <input type="text" 
                placeholder="Nome do Adversário" 
                class="opponent-input" 
                title="Nome do time adversário"
                onchange="calculateProbabilities()">
            <input type="number" 
                placeholder="Pos." 
                class="opponent-position" 
                min="1"
                title="Posição do adversário no momento do jogo"
                onchange="calculateProbabilities()">
        </div>
        <div class="match-result">
            <select class="mando-select" onchange="calculateProbabilities()">
                <option value="casa">Casa</option>
                <option value="fora">Fora</option>
            </select>
            <select class="result-select" onchange="handleResultChange(this)">
                <option value="">Resultado</option>
                <option value="V">Vitória</option>
                <option value="E">Empate</option>
                <option value="D">Derrota</option>
            </select>
            <div class="score-inputs">
                <div class="score-group">
                    <label>GF</label>
                    <input type="number" 
                        placeholder="0" 
                        class="gols-pro" 
                        min="0"
                        title="Gols feitos"
                        onchange="handleScoreChange(this)">
                </div>
                <span>x</span>
                <div class="score-group">
                    <label>GS</label>
                    <input type="number" 
                        placeholder="0" 
                        class="gols-contra" 
                        min="0"
                        title="Gols sofridos"
                        onchange="handleScoreChange(this)">
                </div>
            </div>
            <button onclick="clearSingleResult(this)" class="clear-single-btn" title="Limpar este resultado">
                ×
            </button>
        </div>
    `;
    
    // Adicionar classe de estilo baseada no mando inicial
    const mandoSelect = newRow.querySelector('.mando-select');
    newRow.classList.add(`result-${mandoSelect.value}`);
    
    // Atualizar estilo quando o mando mudar
    mandoSelect.addEventListener('change', function() {
        newRow.classList.remove('result-casa', 'result-fora');
        newRow.classList.add(`result-${this.value}`);
        calculateProbabilities();
    });
    
    form.appendChild(newRow);
    calculateProbabilities();
}

function handleScoreChange(input) {
    const selectElement = input.closest('.match-result').querySelector('.result-select');
    updateResult(selectElement);
    calculateProbabilities();
}

function handleResultChange(selectElement) {
    updateResult(selectElement);
    calculateProbabilities();
}

function clearResults(teamId) {
    const form = document.querySelector(`#${teamId} .results-form`);
    const rows = form.querySelectorAll('.results-row');
    
    rows.forEach(row => {
        const resultSelect = row.querySelector('.result-select');
        const golsPro = row.querySelector('.gols-pro');
        const golsContra = row.querySelector('.gols-contra');
        const mandoSelect = row.querySelector('.mando-select');
        
        resultSelect.value = '';
        golsPro.value = '';
        golsContra.value = '';
        mandoSelect.value = 'casa';
        
        row.classList.remove('result-casa', 'result-fora');
        row.classList.add('result-casa');
    });
    
    calculateProbabilities();
}

// Adicionar botão para limpar tudo
function clearAll(teamId) {
    const form = document.querySelector(`#${teamId} .results-form`);
    form.innerHTML = '';
    addResultRow(teamId);
    calculateProbabilities();
}

function updateResult(selectElement) {
    const row = selectElement.closest('.results-row');
    const golsPro = parseInt(row.querySelector('.gols-pro').value) || 0;
    const golsContra = parseInt(row.querySelector('.gols-contra').value) || 0;
    
    if (golsPro > golsContra) {
        selectElement.value = 'V';
    } else if (golsPro < golsContra) {
        selectElement.value = 'D';
    } else if (golsPro === golsContra && (golsPro !== 0 || golsContra !== 0)) {
        selectElement.value = 'E';
    }
}

// Adicionar listeners para os campos de posição e nome
document.addEventListener('DOMContentLoaded', function() {
    window.analyzer = new ConfrontoAnalyzer();
    addResultRow('teamA');
    addResultRow('teamB');

    // Adicionar listeners para os campos de posição e nome
    ['teamA', 'teamB'].forEach(teamId => {
        const team = document.getElementById(teamId);
        const inputs = team.querySelectorAll('input[type="number"], input[type="text"]');
        inputs.forEach(input => {
            input.addEventListener('change', calculateProbabilities);
        });
    });
});

// Adicionar função global para calcular probabilidades
function calculateProbabilities() {
    if (analyzer) {
        analyzer.calculateProbabilities();
    } else {
        console.error('Analyzer não inicializado');
    }
}

// Adicionar função para limpar resultado individual
function clearSingleResult(button) {
    const row = button.closest('.results-row');
    row.remove(); // Remove a linha completamente
    calculateProbabilities();
} 