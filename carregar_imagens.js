function carregarImagem(evento, numeroImagem) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            if (numeroImagem === 1) {
                document.getElementById('previewImagem1').src = e.target.result;
                matrizImagem1 = extrairPixels(img);
                dimensoesImagem1 = { largura: img.width, altura: img.height };
                
                document.getElementById('botaoAumentarBrilho').disabled = false;
                document.getElementById('botaoDiminuirBrilho').disabled = false;
                document.getElementById('botaoAumentarContraste').disabled = false;
                document.getElementById('botaoDiminuirContrasteDiv').disabled = false;
                document.getElementById('botaoEscalaCinza').disabled = false;
                document.getElementById('botaoInverterHorizontal').disabled = false;
                document.getElementById('botaoInverterVertical').disabled = false;
                document.getElementById('botaoGirar90').disabled = false;
                
                document.getElementById('botaoNOT').disabled = false;
                document.getElementById('botaoMostrarHistograma').disabled = false;
                document.getElementById('botaoEqualizarHistograma').disabled = false;
                document.getElementById('botaoNegativo').disabled = false;
                document.getElementById('botaoLimiar').disabled = false;
                document.getElementById('botaoFiltroMax').disabled = false;
                document.getElementById('botaoFiltroMin').disabled = false;
                document.getElementById('botaoFiltroMean').disabled = false;
                document.getElementById('botaoFiltroMediana').disabled = false;
                document.getElementById('botaoFiltroOrdem').disabled = false;
                document.getElementById('botaoFiltroSuavizacao').disabled = false;
                document.getElementById('botaoFiltroGaussiano').disabled = false;
                document.getElementById('botaoPrewitt').disabled = false;
                document.getElementById('botaoSobel').disabled = false;
                document.getElementById('botaoLaplaciano').disabled = false;
                document.getElementById('botaoErosao').disabled = false;
                document.getElementById('botaoDilatacao').disabled = false;
                document.getElementById('botaoFechamento').disabled = false;
                document.getElementById('botaoAbertura').disabled = false;
                document.getElementById('botaoContorno').disabled = false;
            } else {
                document.getElementById('previewImagem2').src = e.target.result;
                matrizImagem2 = extrairPixels(img);
                dimensoesImagem2 = { largura: img.width, altura: img.height };

                document.getElementById('botaoAumentarBrilho').disabled = false;
                document.getElementById('botaoDiminuirBrilho').disabled = false;
                document.getElementById('botaoAumentarContraste').disabled = false;
                document.getElementById('botaoDiminuirContrasteDiv').disabled = false;
                document.getElementById('botaoEscalaCinza').disabled = false;
                document.getElementById('botaoInverterHorizontal').disabled = false;
                document.getElementById('botaoInverterVertical').disabled = false;
                document.getElementById('botaoGirar90').disabled = false;
                
                document.getElementById('botaoNOT').disabled = false;
                document.getElementById('botaoMostrarHistograma').disabled = false;
                document.getElementById('botaoEqualizarHistograma').disabled = false;
                document.getElementById('botaoNegativo').disabled = false;
                document.getElementById('botaoLimiar').disabled = false;
                document.getElementById('botaoFiltroMax').disabled = false;
                document.getElementById('botaoFiltroMin').disabled = false;
                document.getElementById('botaoFiltroMean').disabled = false;
                document.getElementById('botaoFiltroMediana').disabled = false;
                document.getElementById('botaoFiltroOrdem').disabled = false;
                document.getElementById('botaoFiltroSuavizacao').disabled = false;
                document.getElementById('botaoFiltroGaussiano').disabled = false;
                document.getElementById('botaoPrewitt').disabled = false;
                document.getElementById('botaoSobel').disabled = false;
                document.getElementById('botaoLaplaciano').disabled = false;
                document.getElementById('botaoErosao').disabled = false;
                document.getElementById('botaoDilatacao').disabled = false;
                document.getElementById('botaoFechamento').disabled = false;
                document.getElementById('botaoAbertura').disabled = false;
                document.getElementById('botaoContorno').disabled = false;
            }

            verificarDimensoesImagem();
        };
        img.src = e.target.result;
    };
    leitor.readAsDataURL(arquivo);
}

function extrairPixels(img) {
    tela.width = img.width;
    tela.height = img.height;
    ctx.drawImage(img, 0, 0);
    const dadosImagem = ctx.getImageData(0, 0, tela.width, tela.height);
    const pixels = dadosImagem.data;

    const matrizPixels = [];
    for (let y = 0; y < img.height; y++) {
        const linha = [];
        for (let x = 0; x < img.width; x++) {
            const indice = (y * img.width + x) * 4;
            const r = pixels[indice];
            const g = pixels[indice + 1];
            const b = pixels[indice + 2];
            const a = pixels[indice + 3];
            linha.push([r, g, b, a]);
        }
        matrizPixels.push(linha);
    }
    return matrizPixels;
}

function verificarDimensoesImagem() {
    if (matrizImagem1 && matrizImagem2) {
        const { largura: largura1, altura: altura1 } = dimensoesImagem1;
        const { largura: largura2, altura: altura2 } = dimensoesImagem2;

        if (largura1 !== largura2 || altura1 !== altura2) {
            document.getElementById('mensagemErro').innerText = 'As imagens possuem tamanhos diferentes! Carregue imagens com o mesmo tamanho.';
            document.getElementById('botaoSomar').disabled = true;
            document.getElementById('botaoSubtrair').disabled = true;
            document.getElementById('botaoDiferenca').disabled = true;
            document.getElementById('botaoBlending').disabled = true;
            document.getElementById('botaoMedia').disabled = true;
            document.getElementById('botaoAND').disabled = true;
            document.getElementById('botaoOR').disabled = true;
            document.getElementById('botaoXOR').disabled = true;
        } else {
            document.getElementById('mensagemErro').innerText = '';
            document.getElementById('botaoSomar').disabled = false;
            document.getElementById('botaoSubtrair').disabled = false;
            document.getElementById('botaoDiferenca').disabled = false;
            document.getElementById('botaoBlending').disabled = false;
            document.getElementById('botaoMedia').disabled = false;
            document.getElementById('botaoAND').disabled = false;
            document.getElementById('botaoOR').disabled = false;
            document.getElementById('botaoXOR').disabled = false;
        }
    }
}

function exibirResultado(matriz) {
    const altura = matriz.length;
    const largura = matriz[0].length;

    tela.width = largura;
    tela.height = altura;

    const imageData = ctx.createImageData(largura, altura);
    const data = imageData.data;

    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            const [r, g, b, a] = matriz[y][x];
            const i = (y * largura + x) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    document.getElementById('imagemResultado').src = tela.toDataURL();
    tela.toBlob(blob => blobImagemResultado = blob);
}

function exibirResultado2(matriz) {
    const altura = matriz.length;
    const largura = matriz[0].length;
    
    tela2.width = largura;
    tela2.height = altura;
    
    const imageData = ctx2.createImageData(largura, altura);
    const data = imageData.data;
    
    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            const [r, g, b, a] = matriz[y][x];
            const i = (y * largura + x) * 4;
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
        }
    }
    
    ctx2.putImageData(imageData, 0, 0);
    document.getElementById('imagemResultado2').src = tela2.toDataURL();
    tela2.toBlob(blob => blobImagemResultado2 = blob);
}

function baixarResultado() {
    if (!blobImagemResultado) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobImagemResultado);
    link.download = 'imagem_resultado.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function baixarResultado2() {
    if (!blobImagemResultado) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blobImagemResultado2);
    link.download = 'imagem_resultado2.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
