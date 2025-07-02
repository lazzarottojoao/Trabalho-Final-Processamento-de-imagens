function normalizarRGB(r, g, b) {
    return {
        r: r / 255,
        g: g / 255,
        b: b / 255
    };
}

function rgbParaHSV(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h, s, v;

    v = max;
    s = max === 0 ? 0 : diff / max;

    if (diff === 0) {
        h = 0;
    } else if (max === r) {
        h = ((g - b) / diff) % 6;
    } else if (max === g) {
        h = (b - r) / diff + 2;
    } else {
        h = (r - g) / diff + 4;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    return {
        h: h,
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

function hsvParaRGB(h, s, v) {
    h = h % 360;
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r, g, b;

    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}

function rgbParaCMYK(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, Math.max(g, b));

    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

function cmykParaRGB(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);

    return {
        r: Math.round(r),
        g: Math.round(g),
        b: Math.round(b)
    };
}

function rgbParaCinza(r, g, b) {
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}

function sincronizarInputs(sliderId, numberId) {
    const slider = document.getElementById(sliderId);
    const number = document.getElementById(numberId);
    
    slider.addEventListener('input', () => {
        number.value = slider.value;
        atualizarPreviews();
    });
    
    number.addEventListener('input', () => {
        slider.value = number.value;
        atualizarPreviews();
    });
}

sincronizarInputs('rgbR', 'rgbRNum');
sincronizarInputs('rgbG', 'rgbGNum');
sincronizarInputs('rgbB', 'rgbBNum');
sincronizarInputs('hsvH', 'hsvHNum');
sincronizarInputs('hsvS', 'hsvSNum');
sincronizarInputs('hsvV', 'hsvVNum');
sincronizarInputs('cmykC', 'cmykCNum');
sincronizarInputs('cmykM', 'cmykMNum');
sincronizarInputs('cmykY', 'cmykYNum');
sincronizarInputs('cmykK', 'cmykKNum');

function atualizarPreviews() {
    const r = parseInt(document.getElementById('rgbR').value);
    const g = parseInt(document.getElementById('rgbG').value);
    const b = parseInt(document.getElementById('rgbB').value);
    document.getElementById('rgbPreview').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    const h = parseInt(document.getElementById('hsvH').value);
    const s = parseInt(document.getElementById('hsvS').value);
    const v = parseInt(document.getElementById('hsvV').value);
    const hsvRgb = hsvParaRGB(h, s, v);
    document.getElementById('hsvPreview').style.backgroundColor = `rgb(${hsvRgb.r}, ${hsvRgb.g}, ${hsvRgb.b})`;

    const c = parseInt(document.getElementById('cmykC').value);
    const m = parseInt(document.getElementById('cmykM').value);
    const y = parseInt(document.getElementById('cmykY').value);
    const k = parseInt(document.getElementById('cmykK').value);
    const cmykRgb = cmykParaRGB(c, m, y, k);
    document.getElementById('cmykPreview').style.backgroundColor = `rgb(${cmykRgb.r}, ${cmykRgb.g}, ${cmykRgb.b})`;
}

function converterRGB() {
    const r = parseInt(document.getElementById('rgbR').value);
    const g = parseInt(document.getElementById('rgbG').value);
    const b = parseInt(document.getElementById('rgbB').value);

    const normalizado = normalizarRGB(r, g, b);
    document.getElementById('rgbNormalizado').textContent = 
        `R: ${normalizado.r.toFixed(2)}, G: ${normalizado.g.toFixed(2)}, B: ${normalizado.b.toFixed(2)}`;

    const hsv = rgbParaHSV(r, g, b);
    document.getElementById('hsvResultado').textContent = 
        `H: ${hsv.h}°, S: ${hsv.s}%, V: ${hsv.v}%`;

    const cmyk = rgbParaCMYK(r, g, b);
    document.getElementById('cmykResultado').textContent = 
        `C: ${cmyk.c}%, M: ${cmyk.m}%, Y: ${cmyk.y}%, K: ${cmyk.k}%`;

    const cinza = rgbParaCinza(r, g, b);
    document.getElementById('cinzaResultado').textContent = cinza;
}

function converterHSV() {
    const h = parseInt(document.getElementById('hsvH').value);
    const s = parseInt(document.getElementById('hsvS').value);
    const v = parseInt(document.getElementById('hsvV').value);

    const rgb = hsvParaRGB(h, s, v);
    document.getElementById('hsvParaRgbResultado').textContent = 
        `R: ${rgb.r}, G: ${rgb.g}, B: ${rgb.b}`;
}

function converterCMYK() {
    const c = parseInt(document.getElementById('cmykC').value);
    const m = parseInt(document.getElementById('cmykM').value);
    const y = parseInt(document.getElementById('cmykY').value);
    const k = parseInt(document.getElementById('cmykK').value);

    const rgb = cmykParaRGB(c, m, y, k);
    document.getElementById('cmykParaRgbResultado').textContent = 
        `R: ${rgb.r}, G: ${rgb.g}, B: ${rgb.b}`;
}

atualizarPreviews();
converterRGB();
converterHSV();
converterCMYK();
