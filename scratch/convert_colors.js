class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toString() {
    return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

class Solver {
  constructor(target) {
    this.target = target;
    this.targetHSL = this.rgbToHsl(target.r, target.g, target.b);
  }

  solve() {
    let best = [50, 50, 100, 0, 100, 100]; // invert, sepia, saturate, hue-rotate, brightness, contrast
    let bestLoss = 1e9;

    // A simple hill climbing with adaptive step size
    let step = 20;
    while (step > 0.01) {
      let improved = false;
      for (let i = 0; i < 100; i++) {
        let candidate = best.map((v, idx) => {
          let nv = v + (Math.random() - 0.5) * step;
          if (idx === 0) return clamp(nv, 0, 100); // invert
          if (idx === 1) return clamp(nv, 0, 100); // sepia
          if (idx === 2) return clamp(nv, 0, 1000); // saturate
          if (idx === 3) return nv; // hue-rotate (can wrap around or be anything)
          if (idx === 4) return clamp(nv, 0, 200); // brightness
          if (idx === 5) return clamp(nv, 0, 200); // contrast
          return nv;
        });

        let loss = this.evaluate(candidate);
        if (loss < bestLoss) {
          best = candidate;
          bestLoss = loss;
          improved = true;
        }
      }
      if (!improved) {
        step *= 0.8;
      }
    }

    return {
      values: best,
      loss: bestLoss,
      filter: this.css(best)
    };
  }

  evaluate(filters) {
    // Start with black color (0,0,0)
    let r = 0, g = 0, b = 0;

    // Apply invert
    let inv = filters[0] / 100;
    r = Math.abs(inv * 255 - r);
    g = Math.abs(inv * 255 - g);
    b = Math.abs(inv * 255 - b);

    // Apply sepia
    let sep = filters[1] / 100;
    let r1 = (1 - 0.607 * sep) * r + 0.769 * sep * g + 0.189 * sep * b;
    let g1 = 0.349 * sep * r + (1 - 0.314 * sep) * g + 0.168 * sep * b;
    let b1 = 0.272 * sep * r + 0.534 * sep * g + (1 - 0.869 * sep) * b;
    r = clamp(r1, 0, 255);
    g = clamp(g1, 0, 255);
    b = clamp(b1, 0, 255);

    // Apply saturate
    let sat = filters[2] / 100;
    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = clamp(luma + (r - luma) * sat, 0, 255);
    g = clamp(luma + (g - luma) * sat, 0, 255);
    b = clamp(luma + (b - luma) * sat, 0, 255);

    // Apply hue-rotate
    let hue = (filters[3] / 180) * Math.PI;
    let sin = Math.sin(hue);
    let cos = Math.cos(hue);
    let r2 = (0.213 + cos * 0.787 - sin * 0.213) * r +
             (0.715 - cos * 0.715 - sin * 0.715) * g +
             (0.072 - cos * 0.072 + sin * 0.928) * b;
    let g2 = (0.213 - cos * 0.213 + sin * 0.143) * r +
             (0.715 + cos * 0.285 + sin * 0.140) * g +
             (0.072 - cos * 0.072 - sin * 0.283) * b;
    let b2 = (0.213 - cos * 0.213 - sin * 0.787) * r +
             (0.715 - cos * 0.715 + sin * 0.715) * g +
             (0.072 + cos * 0.928 + sin * 0.072) * b;
    r = clamp(r2, 0, 255);
    g = clamp(g2, 0, 255);
    b = clamp(b2, 0, 255);

    // Apply brightness
    let bri = filters[4] / 100;
    r = clamp(r * bri, 0, 255);
    g = clamp(g * bri, 0, 255);
    b = clamp(b * bri, 0, 255);

    // Apply contrast
    let con = filters[5] / 100;
    r = clamp((r - 127.5) * con + 127.5, 0, 255);
    g = clamp((g - 127.5) * con + 127.5, 0, 255);
    b = clamp((b - 127.5) * con + 127.5, 0, 255);

    const hsl = this.rgbToHsl(r, g, b);
    return (
      Math.abs(r - this.target.r) +
      Math.abs(g - this.target.g) +
      Math.abs(b - this.target.b) +
      Math.abs(hsl.h - this.targetHSL.h) +
      Math.abs(hsl.s - this.targetHSL.s) +
      Math.abs(hsl.l - this.targetHSL.l)
    );
  }

  css(filters) {
    const fmt = (idx, multiplier = 1) => Math.round(filters[idx] * multiplier);
    return `invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%)`;
  }

  rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }
}

const target = new Color(127, 150, 43); // #7f962b
const solver = new Solver(target);
const res = solver.solve();
console.log("Filter solver results:");
console.log("Filter css:", res.filter);
console.log("Loss:", res.loss);
