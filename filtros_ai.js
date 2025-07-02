function filtroMax(img, kernelSize) {
    const offset = Math.floor(kernelSize / 2);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let maxVal = 0;
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            maxVal = Math.max(maxVal, img[ny][nx][canal]);
                        }
                    }
                }
                
                return maxVal;
            })
        )
    );
}

function filtroMin(img, kernelSize) {
    const offset = Math.floor(kernelSize / 2);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let minVal = 255;
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            minVal = Math.min(minVal, img[ny][nx][canal]);
                        }
                    }
                }
                
                return minVal;
            })
        )
    );
}

function filtroMean(img, kernelSize) {
    const offset = Math.floor(kernelSize / 2);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let soma = 0;
                let contador = 0;
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            soma += img[ny][nx][canal];
                            contador++;
                        }
                    }
                }
                
                return Math.round(soma / contador);
            })
        )
    );
}

function filtroMediana(img, kernelSize) {
    const offset = Math.floor(kernelSize / 2);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let valores = [];
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            valores.push(img[ny][nx][canal]);
                        }
                    }
                }
                
                valores.sort((a, b) => a - b);
                const meio = Math.floor(valores.length / 2);
                
                return valores[meio];
            })
        )
    );
}

function filtroOrdem(img, kernelSize, ordem) {
    const offset = Math.floor(kernelSize / 2);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let valores = [];
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            valores.push(img[ny][nx][canal]);
                        }
                    }
                }
                
                valores.sort((a, b) => a - b);
                
                const indice = Math.min(ordem, valores.length - 1);
                return valores[indice];
            })
        )
    );
}

function filtroSuavizacao(img, kernelSize, limiar) {
    const offset = Math.floor(kernelSize / 2);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((valorCentral, canal) => {
                let valores = [];
                let soma = 0;
                let count = 0;
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        if (ky === 0 && kx === 0) continue;
                        
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            const valorVizinho = img[ny][nx][canal];
                            valores.push(valorVizinho);
                            soma += valorVizinho;
                            count++;
                        }
                    }
                }
                
                if (count === 0) return valorCentral;
                
                const mediaVizinhanca = soma / count;
                const desvio = Math.abs(valorCentral - mediaVizinhanca);
                
                if (desvio > limiar) {
                    return Math.round(mediaVizinhanca);
                } else {
                    return valorCentral;
                }
            })
        )
    );
}

function filtroGaussiano(img, kernelSize, sigma) {
    const offset = Math.floor(kernelSize / 2);
    
    const kernel = gerarKernelGaussiano(kernelSize, sigma);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let soma = 0;
                let pesoTotal = 0;
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            const peso = kernel[ky + offset][kx + offset];
                            soma += img[ny][nx][canal] * peso;
                            pesoTotal += peso;
                        }
                    }
                }
                
                return Math.round(soma / pesoTotal);
            })
        )
    );
}

function gerarKernelGaussiano(tamanho, sigma) {
    const kernel = [];
    const offset = Math.floor(tamanho / 2);
    const sigma2 = 2 * sigma * sigma;
    const coeficiente = 1 / (Math.PI * sigma2);
    
    for (let y = -offset; y <= offset; y++) {
        const linha = [];
        for (let x = -offset; x <= offset; x++) {
            const distancia2 = x * x + y * y;
            const valor = coeficiente * Math.exp(-distancia2 / sigma2);
            linha.push(valor);
        }
        kernel.push(linha);
    }
    
    return kernel;
}
