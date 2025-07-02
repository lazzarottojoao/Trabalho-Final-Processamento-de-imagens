function verificarImagensBinarizadas() {
    if (!imagemBinarizada1 || !imagemBinarizada2) {
        alert("Você precisa binarizar ambas as imagens antes de aplicar operações lógicas.");
        return false;
    }
    return true;
}

function operacaoAND(img1, img2) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) => {
            const valor = pixel[0] & img2[y][x][0];
            return [valor, valor, valor, 255];
        })
    );
}

function operacaoOR(img1, img2) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) => {
            const valor = pixel[0] | img2[y][x][0];
            return [valor, valor, valor, 255];
        })
    );
}

function operacaoXOR(img1, img2) {
    return img1.map((linha, y) =>
        linha.map((pixel, x) => {
            const valor = pixel[0] ^ img2[y][x][0];
            return [valor, valor, valor, 255];
        })
    );
}

function operacaoNOT(img) {
    return img.map(linha =>
        linha.map(pixel => {
            const valor = 255 - pixel[0];
            return [valor, valor, valor, 255];
        })
    );
}
