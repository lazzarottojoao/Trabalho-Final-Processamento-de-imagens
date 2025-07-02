const tela = document.getElementById('tela');
const ctx = tela.getContext('2d');

const tela2 = document.getElementById('tela2');
const ctx2 = tela2.getContext('2d');

let matrizImagem1, matrizImagem2;
let dimensoesImagem1, dimensoesImagem2;

let blobImagemResultado = null;
let blobImagemResultado2 = null;

let matrizAtual = null;

let imagemBinarizada1 = null;
let imagemBinarizada2 = null;

const sliderSigma = document.getElementById('entradaSigma');

const ctxHistogramaOriginal = document.getElementById('canvasHistogramaOriginal').getContext('2d');
const ctxHistogramaEqualizado = document.getElementById('canvasHistogramaEqualizado').getContext('2d');
let chartHistogramaOriginal = null;
let chartHistogramaEqualizado = null;

document.getElementById('entradaImagem1').addEventListener('change', (evento) => carregarImagem(evento, 1));
document.getElementById('entradaImagem2').addEventListener('change', (evento) => carregarImagem(evento, 2));

document.getElementById('entradaAlpha').addEventListener('input', function() {
    document.getElementById('valorAlpha').textContent = this.value;
});

function aplicarOperacao(operacao) {
    if (!matrizImagem1 && !matrizImagem2) {
        alert("Por favor, carregue pelo menos uma imagem.");
        return;
    }
    
    let dadosImagemResultado;
    let dadosImagemResultado2;

    let valorBrilho = parseInt(document.getElementById('entradaBrilho').value);
    let valorContraste = parseInt(document.getElementById('entradaContraste').value);
    let valorDivisao = parseInt(document.getElementById('entradaDivisao').value);
    let valorAlpha = parseFloat(document.getElementById('entradaAlpha').value);
    let valorLimiar = parseInt(document.getElementById('entradaLimiar').value);
    let tamanhoKernel = parseInt(document.getElementById('tamanhoKernel').value);

    if (valorBrilho < 0) valorBrilho = 0;
    if (valorBrilho > 255) valorBrilho = 255;

    if (valorContraste < 1) valorContraste = 1;
    if (valorContraste > 5) valorContraste = 5;

    if (valorDivisao < 1) valorDivisao = 1;
    if (valorDivisao > 5) valorDivisao = 5;

    if (valorAlpha < 0) valorAlpha = 0;
    if (valorAlpha > 1) valorAlpha = 1;

    if (valorLimiar < 0) valorLimiar = 0;
    if (valorLimiar > 255) valorLimiar = 255;

    const matrizFonte = matrizAtual || matrizImagem1 || matrizImagem2;
    const matrizFonte2 = matrizImagem1 || matrizImagem2;

    switch (operacao) {
        case 'somar':
            if (!matrizImagem2) {
                alert("Por favor, carregue a segunda imagem para esta operação.");
                return;
            }
            dadosImagemResultado = somarImagens(matrizFonte, matrizImagem2);
            break;
        case 'subtrair':
            if (!matrizImagem2) {
                alert("Por favor, carregue a segunda imagem para esta operação.");
                return;
            }
            dadosImagemResultado = subtrairImagens(matrizFonte, matrizImagem2);
            break;
        case 'diferenca':
            if (!matrizImagem2) {
                alert("Por favor, carregue a segunda imagem para esta operação.");
                return;
            }
            dadosImagemResultado = diferencaImagens(matrizFonte, matrizImagem2);
            break;
        case 'aumentarBrilho':
            dadosImagemResultado = aumentarBrilho(matrizFonte, valorBrilho);
            break;
        case 'diminuirBrilho':
            dadosImagemResultado = diminuirBrilho(matrizFonte, valorBrilho);
            break;
        case 'aumentarContraste':
            dadosImagemResultado = ajustarContrasteMultiplicar(matrizFonte, valorContraste);
            break;
        case 'diminuirContraste':
            dadosImagemResultado = ajustarContrasteMultiplicar(matrizFonte, 1 / valorContraste);
            break;
        case 'aumentarContrasteDiv':
            dadosImagemResultado = ajustarContrasteDividir(matrizFonte, 1 / valorDivisao);
            break;
        case 'diminuirContrasteDiv':
            dadosImagemResultado = ajustarContrasteDividir(matrizFonte, valorDivisao);
            break;
        case 'escalaCinza':
            dadosImagemResultado = converterParaEscalaCinza(matrizFonte);
            break;
        case 'inverterHorizontal':
            dadosImagemResultado = inverterHorizontal(matrizFonte);
            break;
        case 'inverterVertical':
            dadosImagemResultado = inverterVertical(matrizFonte);
            break;
        case 'girar90':
            dadosImagemResultado = girar90Graus(matrizFonte);
            break;
        case 'blending':
            if (!matrizImagem2) {
                alert("Por favor, carregue a segunda imagem para esta operação.");
                return;
            }
            dadosImagemResultado = combinacaoLinearBlending(matrizFonte, matrizImagem2, valorAlpha);
            break;
        case 'media':
            if (!matrizImagem2) {
                alert("Por favor, carregue a segunda imagem para esta operação.");
                return;
            }
            dadosImagemResultado = combinacaoLinearMedia(matrizFonte, matrizImagem2);
            break;
        case 'AND':
            if (!imagemBinarizada1) imagemBinarizada1 = binarizarImagem(matrizImagem1, valorLimiar);
            if (!imagemBinarizada2) imagemBinarizada2 = binarizarImagem(matrizImagem2, valorLimiar);
            dadosImagemResultado = operacaoAND(imagemBinarizada1, imagemBinarizada2);
            break;
        case 'OR':
            if (!imagemBinarizada1) imagemBinarizada1 = binarizarImagem(matrizImagem1, valorLimiar);
            if (!imagemBinarizada2) imagemBinarizada2 = binarizarImagem(matrizImagem2, valorLimiar);
            dadosImagemResultado = operacaoOR(imagemBinarizada1, imagemBinarizada2);
            break;
        case 'XOR':
            if (!imagemBinarizada1) imagemBinarizada1 = binarizarImagem(matrizImagem1, valorLimiar);
            if (!imagemBinarizada2) imagemBinarizada2 = binarizarImagem(matrizImagem2, valorLimiar);
            dadosImagemResultado = operacaoXOR(imagemBinarizada1, imagemBinarizada2);
            break;
        case 'NOT':
            if (!imagemBinarizada1) imagemBinarizada1 = binarizarImagem(matrizFonte, valorLimiar);
            dadosImagemResultado = operacaoNOT(imagemBinarizada1);
            break;
        case 'equalizarHistograma':
            const imagemCinza = verificarSeCinza(matrizFonte) ? matrizFonte : converterParaEscalaCinza(matrizFonte);
            const histogramaOriginal = calcularHistograma(imagemCinza);
            atualizarGraficoHistograma(histogramaOriginal, true);
            dadosImagemResultado = equalizarHistograma(imagemCinza);
            break;
        case 'negativo':
            dadosImagemResultado = Negativo(matrizFonte);
            break;
        case 'Limiar':
            dadosImagemResultado = binarizarImagem(matrizFonte, valorLimiar);
            break;
        case 'filtroMax':
            dadosImagemResultado = filtroMax(matrizFonte, tamanhoKernel);
            break;
        case 'filtroMin':
            dadosImagemResultado = filtroMin(matrizFonte, tamanhoKernel);
            break;
        case 'filtroMean':
            dadosImagemResultado = filtroMean(matrizFonte, tamanhoKernel);
            break;
        case 'filtroMediana':
            dadosImagemResultado = filtroMediana(matrizFonte, tamanhoKernel);
            break;
        case 'filtroOrdem':
            const ordem = parseInt(document.getElementById('entradaOrdem').value);
            dadosImagemResultado = filtroOrdem(matrizFonte, tamanhoKernel, ordem);
            break;
        case 'filtroSuavizacao':
            dadosImagemResultado = filtroSuavizacao(matrizFonte, tamanhoKernel, valorLimiar);
            break;
        case 'filtroGaussiano':
            const sigma = parseFloat(sliderSigma.value);
            dadosImagemResultado = filtroGaussiano(matrizFonte, tamanhoKernel, sigma);
            break;
        case 'prewitt':
            dadosImagemResultado = filtroPrewitt(matrizFonte, tamanhoKernel);
            break;
        case 'sobel':
            dadosImagemResultado = filtroSobel(matrizFonte, tamanhoKernel);
            break;
        case 'laplaciano':
            dadosImagemResultado = filtroLaplaciano(matrizFonte, tamanhoKernel);
            break;
        case 'erosao':
            dadosImagemResultado = erosao(matrizFonte, tamanhoKernel);
            break;
        case 'dilatacao':
            dadosImagemResultado = dilatacao(matrizFonte, tamanhoKernel);
            break;
        case 'abertura':
            dadosImagemResultado = abertura(matrizFonte, tamanhoKernel);
            break;
        case 'fechamento':
            dadosImagemResultado = fechamento(matrizFonte, tamanhoKernel);
            break;
        case 'contorno':
            dadosImagemResultado = contorno(matrizFonte, tamanhoKernel);
            break;
        default:
            return;
    }

    switch (operacao) {
        case 'somar':
            if (!matrizImagem2) return;
            dadosImagemResultado2 = somarImagens(matrizFonte2, matrizImagem2);
            break;
        case 'subtrair':
            if (!matrizImagem2) return;
            dadosImagemResultado2 = subtrairImagens(matrizFonte2, matrizImagem2);
            break;
        case 'diferenca':
            if (!matrizImagem2) return;
            dadosImagemResultado2 = diferencaImagens(matrizFonte2, matrizImagem2);
            break;
        case 'aumentarBrilho':
            dadosImagemResultado2 = aumentarBrilho(matrizFonte2, valorBrilho);
            break;
        case 'diminuirBrilho':
            dadosImagemResultado2 = diminuirBrilho(matrizFonte2, valorBrilho);
            break;
        case 'aumentarContraste':
            dadosImagemResultado2 = ajustarContrasteMultiplicar(matrizFonte2, valorContraste);
            break;
        case 'diminuirContrasteDiv':
            dadosImagemResultado2 = ajustarContrasteDividir(matrizFonte2, valorDivisao);
            break;
        case 'escalaCinza':
            dadosImagemResultado2 = converterParaEscalaCinza(matrizFonte2);
            break;
        case 'inverterHorizontal':
            dadosImagemResultado2 = inverterHorizontal(matrizFonte2);
            break;
        case 'inverterVertical':
            dadosImagemResultado2 = inverterVertical(matrizFonte2);
            break;
        case 'girar90':
            dadosImagemResultado2 = girar90Graus(matrizFonte2);
            break;
        case 'blending':
            if (!matrizImagem2) return;
            dadosImagemResultado2 = combinacaoLinearBlending(matrizFonte2, matrizImagem2, valorAlpha);
            break;
        case 'media':
            if (!matrizImagem2) return;
            dadosImagemResultado2 = combinacaoLinearMedia(matrizFonte2, matrizImagem2);
            break;
        case 'binarizar':
            dadosImagemResultado2 = binarizarImagem(matrizFonte2, valorLimiar);
            if (matrizFonte2 === matrizImagem1) {
                imagemBinarizada1 = dadosImagemResultado2;
            } else if (matrizFonte2 === matrizImagem2) {
                imagemBinarizada2 = dadosImagemResultado2;
            }
            break;
        case 'AND':
            if (!verificarImagensBinarizadas()) return;
            dadosImagemResultado2 = operacaoAND(imagemBinarizada1 || binarizarImagem(matrizImagem1, valorLimiar), 
                                            imagemBinarizada2 || binarizarImagem(matrizImagem2, valorLimiar));
            break;
        case 'OR':
            if (!verificarImagensBinarizadas()) return;
            dadosImagemResultado2 = operacaoOR(imagemBinarizada1 || binarizarImagem(matrizImagem1, valorLimiar), 
                                            imagemBinarizada2 || binarizarImagem(matrizImagem2, valorLimiar));
            break;
        case 'XOR':
            if (!verificarImagensBinarizadas()) return;
            dadosImagemResultado2 = operacaoXOR(imagemBinarizada1 || binarizarImagem(matrizImagem1, valorLimiar), 
                                            imagemBinarizada2 || binarizarImagem(matrizImagem2, valorLimiar));
            break;
        case 'NOT':
            dadosImagemResultado2 = operacaoNOT(imagemBinarizada1 || binarizarImagem(matrizFonte2, valorLimiar));
            break;
        case 'equalizarHistograma':
            const imagemCinza2 = verificarSeCinza(matrizFonte2) ? matrizFonte2 : converterParaEscalaCinza(matrizFonte2);
            const histogramaOriginal2 = calcularHistograma(imagemCinza2);
            atualizarGraficoHistograma(histogramaOriginal2, true);
            dadosImagemResultado2 = equalizarHistograma(imagemCinza2);
            break;
        case 'negativo':
            dadosImagemResultado2 = Negativo(matrizFonte2);
            break;
        case 'Limiar':
            dadosImagemResultado2 = binarizarImagem(matrizFonte2, valorLimiar);
            break;
        case 'filtroMax':
            dadosImagemResultado2 = filtroMax(matrizFonte2, tamanhoKernel);
            break;
        case 'filtroMin':
            dadosImagemResultado2 = filtroMin(matrizFonte2, tamanhoKernel);
            break;
        case 'filtroMean':
            dadosImagemResultado2 = filtroMean(matrizFonte2, tamanhoKernel);
            break;
        case 'filtroMediana':
            dadosImagemResultado2 = filtroMediana(matrizFonte2, tamanhoKernel);
            break;
        case 'filtroOrdem':
            const ordem = parseInt(document.getElementById('entradaOrdem').value);
            dadosImagemResultado2 = filtroOrdem(matrizFonte2, tamanhoKernel, ordem);
            break;
        case 'filtroSuavizacao':
            dadosImagemResultado2 = filtroSuavizacao(matrizFonte2, tamanhoKernel, valorLimiar);
            break;
        case 'filtroGaussiano':
            const sigma = parseFloat(sliderSigma.value);
            dadosImagemResultado2 = filtroGaussiano(matrizFonte2, tamanhoKernel, sigma);
            break;
        case 'prewitt':
            dadosImagemResultado2 = filtroPrewitt(matrizFonte2, tamanhoKernel);
            break;
        case 'sobel':
            dadosImagemResultado2 = filtroSobel(matrizFonte2, tamanhoKernel);
            break;
        case 'laplaciano':
            dadosImagemResultado2 = filtroLaplaciano(matrizFonte2, tamanhoKernel);
            break;
        case 'erosao':
            dadosImagemResultado2 = erosao(matrizFonte2, tamanhoKernel);
            break;
        case 'dilatacao':
            dadosImagemResultado2 = dilatacao(matrizFonte2, tamanhoKernel);
            break;
        case 'abertura':
            dadosImagemResultado2 = abertura(matrizFonte2, tamanhoKernel);
            break;
        case 'fechamento':
            dadosImagemResultado2 = fechamento(matrizFonte2, tamanhoKernel);
            break;
        case 'contorno':
            dadosImagemResultado2 = contorno(matrizFonte2, tamanhoKernel);
            break;
        default:
            return;
    }

    matrizAtual = dadosImagemResultado;

    exibirResultado(dadosImagemResultado);
    document.getElementById('botaoDownload').disabled = false;

    exibirResultado2(dadosImagemResultado2);
    document.getElementById('botaoDownload2').disabled = false;
}
