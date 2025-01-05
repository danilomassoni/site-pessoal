let periodoConfig = {
    bimestral: { total: 4, nome: "Bimestre" },
    trimestral: { total: 3, nome: "Trimestre" },
    quadrimestral: { total: 3, nome: "Quadrimestre" },
    semestral: { total: 2, nome: "Semestre" }
};

function mostrarProximaEtapa(stepId) {
    if (stepId === 'step2') {
        const tipoPeriodo = document.getElementById('tipoPeriodo').value;
        if (!tipoPeriodo) return;

        const periodoAtualSelect = document.getElementById('periodoAtual');
        periodoAtualSelect.innerHTML = '<option value="">Selecione...</option>';
        
        const totalPeriodos = periodoConfig[tipoPeriodo].total;
        const nomePeriodo = periodoConfig[tipoPeriodo].nome;
        
        for (let i = 1; i <= totalPeriodos; i++) {
            periodoAtualSelect.innerHTML += `<option value="${i}">${i}º ${nomePeriodo}</option>`;
        }
    } else if (stepId === 'step3') {
        const periodoAtual = parseInt(document.getElementById('periodoAtual').value);
        if (!periodoAtual) return;

        const notasContainer = document.getElementById('notas-container');
        notasContainer.innerHTML = '';

        // Criar container para notas e frequências
        for (let i = 1; i <= periodoAtual; i++) {
            const periodoDiv = document.createElement('div');
            periodoDiv.className = 'periodo-input';
            
            // Input para nota
            const notaDiv = document.createElement('div');
            notaDiv.className = 'nota-input';
            
            const notaLabel = document.createElement('label');
            notaLabel.textContent = `Nota do ${i}º fechamento:`;
            
            const notaInput = document.createElement('input');
            notaInput.type = 'number';
            notaInput.id = `nota${i}`;
            notaInput.placeholder = `Nota ${i}`;
            notaInput.min = '0';
            notaInput.max = '10';
            notaInput.step = '0.1';

            notaDiv.appendChild(notaLabel);
            notaDiv.appendChild(notaInput);
            
            // Input para frequência
            const freqDiv = document.createElement('div');
            freqDiv.className = 'freq-input';
            
            const freqLabel = document.createElement('label');
            freqLabel.textContent = `Frequência do ${i}º fechamento (%):`;
            
            const freqInput = document.createElement('input');
            freqInput.type = 'number';
            freqInput.id = `freq${i}`;
            freqInput.placeholder = 'Frequência (%)';
            freqInput.min = '0';
            freqInput.max = '100';

            freqDiv.appendChild(freqLabel);
            freqDiv.appendChild(freqInput);

            periodoDiv.appendChild(notaDiv);
            periodoDiv.appendChild(freqDiv);
            notasContainer.appendChild(periodoDiv);
        }
    }

    document.querySelectorAll('.input-step').forEach(step => step.classList.add('hidden'));
    document.getElementById(stepId).classList.remove('hidden');
}

function calcular() {
    const tipoPeriodo = document.getElementById('tipoPeriodo').value;
    const periodoAtual = parseInt(document.getElementById('periodoAtual').value);

    // Coletar notas e frequências
    let somaNotas = 0;
    let somaFrequencia = 0;
    let notasValidas = 0;
    
    for (let i = 1; i <= periodoAtual; i++) {
        const nota = parseFloat(document.getElementById(`nota${i}`).value);
        const freq = parseFloat(document.getElementById(`freq${i}`).value);
        
        if (!isNaN(nota) && !isNaN(freq)) {
            somaNotas += nota;
            somaFrequencia += freq;
            notasValidas++;
        }
    }

    if (notasValidas !== periodoAtual) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    const mediaAtual = somaNotas / notasValidas;
    const frequenciaMedia = somaFrequencia / notasValidas;
    const totalPeriodos = periodoConfig[tipoPeriodo].total;
    const periodosRestantes = totalPeriodos - periodoAtual;
    
    // Cálculos
    const notaMinimaNecessaria = calcularNotaNecessaria(somaNotas, periodosRestantes, 5, totalPeriodos);
    const notaIdealNecessaria = calcularNotaNecessaria(somaNotas, periodosRestantes, 7, totalPeriodos);
    const frequenciaNecessaria = calcularFrequenciaNecessaria(somaFrequencia, periodoAtual, periodosRestantes);

    // Gerar relatório
    let mensagem = `<h3>Relatório de Desempenho</h3>`;
    mensagem += `<p>Média atual: ${mediaAtual.toFixed(1)}</p>`;
    mensagem += `<p>Frequência média atual: ${frequenciaMedia.toFixed(1)}%</p>`;
    mensagem += `<div class="previsao-container">`;
    
    if (periodosRestantes > 0) {
        mensagem += `<h4>Para os próximos ${periodosRestantes} ${periodosRestantes === 1 ? 'fechamento' : 'fechamentos'}:</h4>`;
        
        // Notas necessárias
        mensagem += `<div class="nota-necessaria">`;
        mensagem += `<p>Para aprovação (média 5.0):<br><strong>${notaMinimaNecessaria.toFixed(1)}</strong> em cada fechamento</p>`;
        mensagem += `</div>`;
        mensagem += `<div class="nota-ideal">`;
        mensagem += `<p>Para média ideal (7.0):<br><strong>${notaIdealNecessaria.toFixed(1)}</strong> em cada fechamento</p>`;
        mensagem += `</div>`;

        // Frequência necessária
        mensagem += `<div class="frequencia-necessaria">`;
        if (frequenciaMedia < 75) {
            mensagem += `<p>Para atingir 75% de frequência:<br><strong>${frequenciaNecessaria.toFixed(1)}%</strong> de presença em cada fechamento restante</p>`;
            if (frequenciaNecessaria > 100) {
                mensagem += `<p class="alerta">Atenção: Não é possível atingir a frequência mínima necessária!</p>`;
            }
        } else {
            mensagem += `<p>Frequência atual já atende o mínimo necessário (75%)</p>`;
        }
        mensagem += `</div>`;
    } else {
        mensagem += `<p>Este é seu último fechamento.</p>`;
        mensagem += `<p>Média final: ${mediaAtual.toFixed(1)}</p>`;
        mensagem += `<p>Frequência final: ${frequenciaMedia.toFixed(1)}%</p>`;
    }
    
    // Status
    const aprovadoNota = mediaAtual >= 5;
    const aprovadoFrequencia = frequenciaMedia >= 75;
    
    mensagem += `<div class="status ${(aprovadoNota && aprovadoFrequencia) ? 'aprovado' : 'atencao'}">`;
    if (aprovadoNota && aprovadoFrequencia) {
        if (mediaAtual >= 7) {
            mensagem += `<p>Situação atual: Aprovado com ótimo desempenho!</p>`;
        } else {
            mensagem += `<p>Situação atual: Aprovado, mas pode melhorar.</p>`;
        }
    } else {
        if (!aprovadoNota && !aprovadoFrequencia) {
            mensagem += `<p>Atenção! Necessário melhorar nota e frequência.</p>`;
        } else if (!aprovadoNota) {
            mensagem += `<p>Atenção! Necessário melhorar as notas.</p>`;
        } else {
            mensagem += `<p>Atenção! Necessário melhorar a frequência.</p>`;
        }
    }
    mensagem += `</div></div>`;

    document.getElementById('resultado').innerHTML = mensagem;
    document.getElementById('resultado').classList.remove('hidden');
    
    atualizarGraficos(mediaAtual, notaMinimaNecessaria, notaIdealNecessaria, frequenciaMedia, frequenciaNecessaria);
}

function calcularNotaNecessaria(somaAtual, periodosRestantes, mediaDesejada, totalPeriodos) {
    if (periodosRestantes === 0) return 0;
    const notaNecessaria = (mediaDesejada * totalPeriodos - somaAtual) / periodosRestantes;
    return Math.max(0, Math.min(10, notaNecessaria));
}

function calcularFrequenciaNecessaria(somaFrequencia, periodosAtuais, periodosRestantes) {
    const totalPeriodos = periodosAtuais + periodosRestantes;
    const frequenciaMinima = 75; // 75% é o mínimo necessário
    
    const frequenciaNecessaria = ((frequenciaMinima * totalPeriodos) - somaFrequencia) / periodosRestantes;
    return Math.min(100, Math.max(0, frequenciaNecessaria));
}

function atualizarGraficos(notaAtual, notaMinima, notaIdeal, frequenciaMedia, frequenciaNecessaria) {
    // Coletar histórico de notas
    const periodoAtual = parseInt(document.getElementById('periodoAtual').value);
    const historicoNotas = [];
    const labels = [];
    
    for (let i = 1; i <= periodoAtual; i++) {
        const nota = parseFloat(document.getElementById(`nota${i}`).value);
        historicoNotas.push(nota);
        labels.push(`${i}º Fechamento`);
    }

    // Adicionar ponto futuro necessário
    if (periodoAtual < periodoConfig[document.getElementById('tipoPeriodo').value].total) {
        labels.push('Necessário');
        historicoNotas.push(null); // Ponto vazio para criar descontinuidade
        labels.push('Meta');
        historicoNotas.push(notaMinima);
    }

    // Gráfico de Notas
    const ctxNotas = document.getElementById('graficoNotas').getContext('2d');
    
    new Chart(ctxNotas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Suas Notas',
                data: historicoNotas,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Média Mínima (5.0)',
                data: Array(labels.length).fill(5),
                borderColor: 'rgba(255, 159, 64, 1)',
                borderDash: [5, 5],
                tension: 0
            }, {
                label: 'Média Ideal (7.0)',
                data: Array(labels.length).fill(7),
                borderColor: 'rgba(54, 162, 235, 1)',
                borderDash: [5, 5],
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Notas (0-10)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Histórico e Projeção de Notas',
                    padding: 20
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Nota: ${context.parsed.y?.toFixed(1) || 'N/A'}`;
                        }
                    }
                }
            }
        }
    });

    // Coletar histórico de frequências
    const historicoFreq = [];
    const labelsFreq = [];
    
    for (let i = 1; i <= periodoAtual; i++) {
        const freq = parseFloat(document.getElementById(`freq${i}`).value);
        historicoFreq.push(freq);
        labelsFreq.push(`${i}º Fechamento`);
    }

    // Adicionar ponto futuro necessário para frequência
    if (periodoAtual < periodoConfig[document.getElementById('tipoPeriodo').value].total) {
        labelsFreq.push('Necessário');
        historicoFreq.push(null);
        labelsFreq.push('Meta');
        historicoFreq.push(frequenciaNecessaria);
    }

    // Gráfico de Frequência
    const ctxFreq = document.getElementById('graficoFrequencia').getContext('2d');
    
    new Chart(ctxFreq, {
        type: 'line',
        data: {
            labels: labelsFreq,
            datasets: [{
                label: 'Sua Frequência',
                data: historicoFreq,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Frequência Mínima (75%)',
                data: Array(labelsFreq.length).fill(75),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderDash: [5, 5],
                tension: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        stepSize: 10
                    },
                    title: {
                        display: true,
                        text: 'Frequência (%)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Histórico e Projeção de Frequência',
                    padding: 20
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Frequência: ${context.parsed.y?.toFixed(1) || 'N/A'}%`;
                        }
                    }
                }
            }
        }
    });
} 