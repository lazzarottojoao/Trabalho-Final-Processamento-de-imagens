function somarImagens(img1, img2) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((val, i) => Math.min(255, val + img2[y][x][i]))
        )
    );
}

function subtrairImagens(img1, img2) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((val, i) => Math.max(0, val - img2[y][x][i]))
        )
    );
}

function diferencaImagens(img1, img2) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((val, i) => Math.abs(val - img2[y][x][i]))
        )
    );
}

function aumentarBrilho(img, valor) {
    return img.map(linha =>
        linha.map(pixel =>
            pixel.map((val, i) => i < 3 ? Math.min(255, val + valor) : val)
        )
    );
}

function diminuirBrilho(img, valor) {
    return img.map(linha =>
        linha.map(pixel =>
            pixel.map((val, i) => i < 3 ? Math.max(0, val - valor) : val)
        )
    );
}

function ajustarContrasteMultiplicar(img, fator) {
    return img.map(linha =>
        linha.map(pixel =>
            pixel.map((val, i) => i < 3 ? Math.min(255, Math.max(0, val * fator)) : val)
        )
    );
}

function ajustarContrasteDividir(img, fator) {
    return img.map(linha =>
        linha.map(pixel =>
            pixel.map((val, i) => i < 3 ? Math.min(255, Math.max(0, val / fator)) : val)
        )
    );
}

function converterParaEscalaCinza(img) {
    return img.map(linha =>
        linha.map(([r, g, b]) => {
            const media = Math.round((r + g + b) / 3);
            return [media, media, media, 255];
        })
    );
}

function inverterHorizontal(img) {
    return img.map(linha => [...linha].reverse());
}

function inverterVertical(img) {
    return [...img].reverse();
}

function girar90Graus(img) {
    const altura = img.length;
    const largura = img[0].length;
    const novaImagem = Array.from({ length: largura }, () => Array(altura));

    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            novaImagem[x][altura - y - 1] = img[y][x];
        }
    }
    return novaImagem;
}

function Negativo(img) {
    return img.map(linha =>
        linha.map(pixel =>
            pixel.map((val, i) => i < 3 ? 255 - val : val)
        )
    );
}

function combinacaoLinearBlending(img1, img2, alpha) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((val, i) => Math.round(val * alpha + img2[y][x][i] * (1 - alpha)))
        )
    );
}

function combinacaoLinearMedia(img1, img2) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) =>
            pixel.map((val, i) => Math.round((val + img2[y][x][i]) / 2))
        )
    );
}

function binarizarImagem(img, limiar) {
    return img.map(linha =>
        linha.map(([r, g, b]) => {
            const media = Math.round((r + g + b) / 3);
            const bin = media >= limiar ? 255 : 0;
            return [bin, bin, bin, 255];
        })
    );
}
