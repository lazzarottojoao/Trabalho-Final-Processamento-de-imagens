function verificarImagemBinaria(img) {
    for (let y = 0; y < img.length; y++) {
        for (let x = 0; x < img[0].length; x++) {
            const valor = img[y][x][0];
            if (valor !== 0 && valor !== 255) {
                return false;
            }
        }
    }
    return true;
}

function garantirImagemBinaria(img, limiar = 127) {
    if (verificarImagemBinaria(img)) {
        return img;
    }
    return binarizarImagem(img, limiar);
}

function criarElementoEstruturante(tamanho, forma = 'quadrado') {
    const elemento = [];
    const centro = Math.floor(tamanho / 2);
    
    for (let y = 0; y < tamanho; y++) {
        elemento[y] = [];
        for (let x = 0; x < tamanho; x++) {
            switch (forma) {
                case 'quadrado':
                    elemento[y][x] = 1;
                    break;
                case 'cruz':
                    elemento[y][x] = (y === centro || x === centro) ? 1 : 0;
                    break;
                case 'circulo':
                    const distancia = Math.sqrt((x - centro) ** 2 + (y - centro) ** 2);
                    elemento[y][x] = distancia <= centro ? 1 : 0;
                    break;
                default:
                    elemento[y][x] = 1;
            }
        }
    }
    return elemento;
}

function erosao(img, kernelSize = 3, forma = 'quadrado') {
    const imgBinaria = garantirImagemBinaria(img, 127);
    const elemento = criarElementoEstruturante(kernelSize, forma);
    const offset = Math.floor(kernelSize / 2);
    
    return imgBinaria.map((linha, y) =>
        linha.map((pixel, x) => {
            let todosBrancos = true;
            
            for (let ky = 0; ky < kernelSize; ky++) {
                for (let kx = 0; kx < kernelSize; kx++) {
                    if (elemento[ky][kx] === 1) {
                        const ny = y + ky - offset;
                        const nx = x + kx - offset;
                        
                        if (ny < 0 || ny >= img.length || nx < 0 || nx >= img[0].length) {
                            todosBrancos = false;
                            break;
                        }
                        
                        if (imgBinaria[ny][nx][0] === 0) {
                            todosBrancos = false;
                            break;
                        }
                    }
                }
                if (!todosBrancos) break;
            }
            
            const resultado = todosBrancos ? 255 : 0;
            return [resultado, resultado, resultado, 255];
        })
    );
}

function dilatacao(img, kernelSize = 3, forma = 'quadrado') {
    const imgBinaria = garantirImagemBinaria(img, 127);
    const elemento = criarElementoEstruturante(kernelSize, forma);
    const offset = Math.floor(kernelSize / 2);
    
    return imgBinaria.map((linha, y) =>
        linha.map((pixel, x) => {
            let temBranco = false;
            
            for (let ky = 0; ky < kernelSize; ky++) {
                for (let kx = 0; kx < kernelSize; kx++) {
                    if (elemento[ky][kx] === 1) {
                        const ny = y + ky - offset;
                        const nx = x + kx - offset;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            if (imgBinaria[ny][nx][0] === 255) {
                                temBranco = true;
                                break;
                            }
                        }
                    }
                }
                if (temBranco) break;
            }
            
            const resultado = temBranco ? 255 : 0;
            return [resultado, resultado, resultado, 255];
        })
    );
}

function abertura(img, kernelSize = 3, forma = 'quadrado') {
    const imagemErodida = erosao(img, kernelSize, forma);
    return dilatacao(imagemErodida, kernelSize, forma);
}

function fechamento(img, kernelSize = 3, forma = 'quadrado') {
    const imagemDilatada = dilatacao(img, kernelSize, forma);
    return erosao(imagemDilatada, kernelSize, forma);
}

function contorno(img, kernelSize = 3, forma = 'quadrado') {
    const imgBinaria = garantirImagemBinaria(img, 127);
    const imagemErodida = erosao(imgBinaria, kernelSize, forma);
    
    return imgBinaria.map((linha, y) =>
        linha.map((pixel, x) => {
            const pixelOriginal = imgBinaria[y][x][0];
            const pixelErodido = imagemErodida[y][x][0];
            const resultado = pixelOriginal - pixelErodido;
            return [resultado, resultado, resultado, 255];
        })
    );
}

function contorno(img, kernelSize = 3, forma = 'quadrado') {
    const imgBinaria = garantirImagemBinaria(img, 127);
    const imagemDilatada = dilatacao(imgBinaria, kernelSize, forma);
    const imagemErodida = erosao(imgBinaria, kernelSize, forma);
    
    return imagemDilatada.map((linha, y) =>
        linha.map((pixel, x) => {
            const pixelDilatado = imagemDilatada[y][x][0];
            const pixelErodido = imagemErodida[y][x][0];
            const resultado = pixelDilatado - pixelErodido;
            return [resultado, resultado, resultado, 255];
        })
    );
}
