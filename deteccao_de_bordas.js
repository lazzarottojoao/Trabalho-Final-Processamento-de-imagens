function aplicarConvolucao(img, kernel) {
    const offset = Math.floor(kernel.length / 2);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let soma = 0;
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            const kernelY = ky + offset;
                            const kernelX = kx + offset;
                            soma += img[ny][nx][canal] * kernel[kernelY][kernelX];
                        }
                    }
                }
                
                return Math.max(0, Math.min(255, Math.abs(soma)));
            })
        )
    );
}

function combinarGradientes(gradX, gradY) {
    return gradX.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                const gx = gradX[y][x][canal];
                const gy = gradY[y][x][canal];
                const magnitude = Math.sqrt(gx * gx + gy * gy);
                return Math.max(0, Math.min(255, magnitude));
            })
        )
    );
}

function criarKernelPrewitt(tamanho) {
    const kernelX = [];
    const kernelY = [];
    const offset = Math.floor(tamanho / 2);
    
    for (let y = 0; y < tamanho; y++) {
        kernelX[y] = [];
        kernelY[y] = [];
        for (let x = 0; x < tamanho; x++) {
            if (x < offset) {
                kernelX[y][x] = -1;
            } else if (x > offset) {
                kernelX[y][x] = 1;
            } else {
                kernelX[y][x] = 0;
            }
            
            if (y < offset) {
                kernelY[y][x] = -1;
            } else if (y > offset) {
                kernelY[y][x] = 1;
            } else {
                kernelY[y][x] = 0;
            }
        }
    }
    
    return { kernelX, kernelY };
}

function criarKernelSobel(tamanho) {
    const kernelX = [];
    const kernelY = [];
    const offset = Math.floor(tamanho / 2);
    
    for (let y = 0; y < tamanho; y++) {
        kernelX[y] = [];
        kernelY[y] = [];
        for (let x = 0; x < tamanho; x++) {
            const distanciaY = Math.abs(y - offset);
            const peso = Math.max(1, tamanho - distanciaY * 2);
            
            if (x < offset) {
                kernelX[y][x] = -peso;
            } else if (x > offset) {
                kernelX[y][x] = peso;
            } else {
                kernelX[y][x] = 0;
            }
            
            const distanciaX = Math.abs(x - offset);
            const pesoY = Math.max(1, tamanho - distanciaX * 2);
            
            if (y < offset) {
                kernelY[y][x] = -pesoY;
            } else if (y > offset) {
                kernelY[y][x] = pesoY;
            } else {
                kernelY[y][x] = 0;
            }
        }
    }
    
    return { kernelX, kernelY };
}

function criarKernelLaplaciano(tamanho) {
    const kernel = [];
    const offset = Math.floor(tamanho / 2);
    const centro = tamanho * tamanho - 1;
    
    for (let y = 0; y < tamanho; y++) {
        kernel[y] = [];
        for (let x = 0; x < tamanho; x++) {
            if (y === offset && x === offset) {
                kernel[y][x] = centro;
            } else {
                kernel[y][x] = -1;
            }
        }
    }
    
    return kernel;
}

function filtroPrewitt(img, tamanhoKernel = 3) {
    const { kernelX, kernelY } = criarKernelPrewitt(tamanhoKernel);
    
    const gradX = aplicarConvolucao(img, kernelX);
    const gradY = aplicarConvolucao(img, kernelY);
    
    return combinarGradientes(gradX, gradY);
}

function filtroSobel(img, tamanhoKernel = 3) {
    const { kernelX, kernelY } = criarKernelSobel(tamanhoKernel);
    
    const gradX = aplicarConvolucao(img, kernelX);
    const gradY = aplicarConvolucao(img, kernelY);
    
    return combinarGradientes(gradX, gradY);
}

function filtroLaplaciano(img, tamanhoKernel = 3) {
    const kernel = criarKernelLaplaciano(tamanhoKernel);
    
    return img.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((_, canal) => {
                let soma = 0;
                const offset = Math.floor(tamanhoKernel / 2);
                
                for (let ky = -offset; ky <= offset; ky++) {
                    for (let kx = -offset; kx <= offset; kx++) {
                        const ny = y + ky;
                        const nx = x + kx;
                        
                        if (ny >= 0 && ny < img.length && nx >= 0 && nx < img[0].length) {
                            const kernelY = ky + offset;
                            const kernelX = kx + offset;
                            soma += img[ny][nx][canal] * kernel[kernelY][kernelX];
                        }
                    }
                }
                
                return Math.max(0, Math.min(255, Math.abs(soma)));
            })
        )
    );
}
