function verificarSeCinza(imagem) {
    for (let y = 0; y < imagem.length; y++) {
        for (let x = 0; x < imagem[0].length; x++) {
            const [r, g, b] = imagem[y][x];
            if (r !== g || g !== b) {
                return false;
            }
        }
    }
    return true;
}

function mostrarHistograma() {
    const matrizFonte = matrizAtual || matrizImagem1;
    if (!matrizFonte) {
        alert("Por favor, carregue uma imagem primeiro.");
        return;
    }

    const imagemCinza = verificarSeCinza(matrizFonte) ? matrizFonte : converterParaEscalaCinza(matrizFonte);
    
    const histograma = calcularHistograma(imagemCinza);
    
    atualizarGraficoHistograma(histograma, true);
    
    if (chartHistogramaEqualizado) {
        chartHistogramaEqualizado.destroy();
        chartHistogramaEqualizado = null;
    }
}

function calcularHistograma(imagem) {
    const histograma = Array(256).fill(0);
    
    for (let y = 0; y < imagem.length; y++) {
        for (let x = 0; x < imagem[0].length; x++) {
            const nivelCinza = imagem[y][x][0];
            histograma[nivelCinza]++;
        }
    }
    
    return histograma;
}

function atualizarGraficoHistograma(histograma, isOriginal = true) {
    const labels = Array.from({ length: 256 }, (_, i) => i);
    const dados = {
        labels: labels,
        datasets: [{
            label: isOriginal ? 'Histograma Original' : 'Histograma Equalizado',
            data: histograma,
            backgroundColor: isOriginal ? 'rgba(54, 162, 235, 0.5)' : 'rgba(75, 192, 192, 0.5)',
            borderColor: isOriginal ? 'rgba(54, 162, 235, 1)' : 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
    
    const opcoes = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: isOriginal ? 'Histograma Original' : 'Histograma Equalizado'
            },
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        return 'Nível de Cinza: ' + tooltipItems[0].label;
                    },
                    label: function(context) {
                        return 'Frequência: ' + context.raw;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Frequência'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Nível de Cinza'
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 8
                }
            }
        }
    };
    
    if (isOriginal) {
        if (chartHistogramaOriginal) {
            chartHistogramaOriginal.destroy();
        }
        chartHistogramaOriginal = new Chart(ctxHistogramaOriginal, {
            type: 'bar',
            data: dados,
            options: opcoes
        });
    } else {
        if (chartHistogramaEqualizado) {
            chartHistogramaEqualizado.destroy();
        }
        chartHistogramaEqualizado = new Chart(ctxHistogramaEqualizado, {
            type: 'bar',
            data: dados,
            options: opcoes
        });
    }
}

function equalizarHistograma(imagem) {
    const histograma = calcularHistograma(imagem);
    const totalPixels = imagem.length * imagem[0].length;
    const probabilidade = histograma.map(freq => freq / totalPixels);

    const cdf = [];
    let acumulado = 0;
    for (let i = 0; i < 256; i++) {
        acumulado += probabilidade[i];
        cdf[i] = Math.round(acumulado * 255);
    }

    const novaImagem = imagem.map(linha => 
        linha.map(pixel => {
            const novoValor = cdf[pixel[0]];
            return [novoValor, novoValor, novoValor, 255];
        })
    );

    const histogramaNovo = calcularHistograma(novaImagem);
    atualizarGraficoHistograma(histogramaNovo, false);

    return novaImagem;
}
