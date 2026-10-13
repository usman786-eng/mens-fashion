import {
  Scene,
  PerspectiveCamera,
  Vector2,
  Vector3,
  Color,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  TextureLoader,
  ClampToEdgeWrapping,
  MathUtils,
  WebGLRenderer,
  Timer,
  type Texture,
} from 'three';
import { heroProducts as L } from '../data';

// ---- shaders (exact port; bodies spliced byte-identical from the original bundle) ----
const lf = `
  uniform float uPaint;
  uniform float uTime;
  uniform vec2 uRes;

  float paintEdge(float x) {
    float amp = 0.075 * sin(3.14159265 * clamp(uPaint, 0.0, 1.0));
    float wave =
        sin(x * 4.2 + uTime * 0.9) * 0.45 +
        sin(x * 9.7 - uTime * 1.3) * 0.25 +
        sin(x * 21.0 + uTime * 2.1) * 0.10 +
        // a few slow "drip" bulges that lead the stroke
        pow(max(0.0, sin(x * 2.3 - 0.6)), 8.0) * 0.9;
    return uPaint * 1.25 - 0.12 + wave * amp;
  }

  // 1.0 where the paint has covered this fragment, plus the distance above the edge
  vec2 paintAt(vec2 fragCoord) {
    vec2 s = fragCoord / uRes;
    float x = s.x * (uRes.x / uRes.y);
    float edge = paintEdge(x);
    float d = edge - s.y;
    float aa = 1.5 / uRes.y;
    return vec2(smoothstep(-aa, aa, d), d);
  }
`;

const uf = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy * 2.0, 0.999, 1.0);
  }
`;

const df = `
  ${lf}
  uniform vec3 uInk;
  uniform vec3 uPaper;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

  void main() {
    vec2 pa = paintAt(gl_FragCoord.xy);
    // soft shading just under the wet edge gives the stroke some body
    float rim = exp(-pa.y * 70.0) * 0.07 * pa.x;
    vec3 paper = uPaper - rim;
    vec3 col = mix(uInk, paper, pa.x);
    // faint film grain on the dark side
    col += (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.025 * (1.0 - pa.x);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const ff = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const pf = 0.72;
const mf = 0.94;
const hf = (1024 / 1536) * mf;

const gf = `
  ${lf}
  uniform sampler2D uMap;
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uPaper;
  uniform float uAspect;
  uniform float uBlur;
  uniform float uOpacity;
  varying vec2 vUv;

  const float PA = ${pf.toFixed(4)};
  const vec2 IMG = vec2(${hf.toFixed(4)}, ${mf.toFixed(4)});

  float sdRound(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  vec4 person(vec2 l) {
    vec2 iuv = vec2(l.x / IMG.x + 0.5, (l.y + 0.5 - 0.015) / IMG.y);
    vec2 inside = step(vec2(0.0), iuv) * step(iuv, vec2(1.0));
    return texture2D(uMap, iuv) * inside.x * inside.y;
  }

  vec4 personBlurred(vec2 l) {
    if (uBlur < 0.0005) return person(l);
    vec4 acc = vec4(0.0);
    float total = 0.0;
    for (int i = 0; i < 24; i++) {
      float fi = float(i);
      float r = sqrt((fi + 0.5) / 24.0);
      float a = fi * 2.39996323;
      vec2 o = vec2(cos(a), sin(a)) * r * uBlur;
      float w = 1.0 - r * 0.5;
      vec4 s = person(l + o);
      acc += vec4(s.rgb * s.a, s.a) * w;
      total += w;
    }
    acc /= total;
    return vec4(acc.rgb / max(acc.a, 1e-4), acc.a);
  }

  void main() {
    vec2 l = (vUv - 0.5) * vec2(PA, 1.0);
    vec2 pa = paintAt(gl_FragCoord.xy);
    float painted = pa.x;

    float d = sdRound(l, vec2(uAspect * 0.5, 0.5), 0.055);
    // derive AA width from a smooth varying; fwidth(d) spikes on the abs() kink
    float aa = length(vec2(dFdx(l.y), dFdy(l.y))) * 1.5;
    float cardMask = 1.0 - smoothstep(-aa, aa, d);

    // studio backdrop: vertical gradient with a soft light behind the model
    vec3 bg = mix(uBottom, uTop, smoothstep(0.0, 1.0, vUv.y));
    bg += 0.07 * exp(-dot(l - vec2(0.0, 0.08), l - vec2(0.0, 0.08)) * 9.0);
    bg -= 0.05 * smoothstep(0.2, 0.5, abs(l.x) / max(uAspect, 0.01));
    float bgA = cardMask * (1.0 - painted);
    bg = mix(bg, uPaper, painted);

    vec4 p = personBlurred(l);
    p.a *= mix(cardMask, 1.0, painted);

    float outA = p.a + bgA * (1.0 - p.a);
    vec3 rgb = (p.rgb * p.a + bg * bgA * (1.0 - p.a)) / max(outA, 1e-4);
    gl_FragColor = vec4(rgb, outA * uOpacity);
  }
`;

// ---- constants & helpers (exact port) ----
const _f = '#0b0b0b';
const vf = '#f7f7f5';
export const yf = L.length;
export const pe = L.length * 3;
export const bf = (e: number): number => Math.min(1, Math.max(0, e));
export const xf = (e: number, t: number, n: number): number => bf((e - t) / (n - t));
export const Sf = (e: number, t: number, n: number): number => e + (t - e) * n;
export const Cf = (e: number): number =>
  e < 0.5 ? 4 * e * e * e : 1 - (-2 * e + 2) ** 3 / 2;
export const wf = (e: number): number => 1 - (1 - e) ** 3;
export const Tf = (e: number, t: number): number => (((e + t / 2) % t) + t) % t - t / 2;
export const Ef = (e: number[], t: number): number => {
  const n = t + 2;
  if (n <= 0) return e[0] + (e[0] - e[1]) * -n;
  if (n >= 4) return e[4] + (e[4] - e[3]) * (n - 4);
  const r = Math.floor(n);
  return Sf(e[r], e[Math.min(r + 1, 4)], n - r);
};
export const Df = 0.028;
export const Of = {
  x: [-0.575, -0.315, 0, 0.315, 0.575],
  y: [-0.06, -0.09, -0.17, -0.09, -0.06],
  h: [0.43, 0.5, 0.52, 0.5, 0.43],
  rot: [0.44, 0.3, 0, -0.3, -0.44],
  aspect: [0.56, 0.52, 0.64, 0.52, 0.56],
};
export const kf = {
  x: [-0.57, -0.315, 0, 0.315, 0.57],
  y: [0.1, 0.06, -0.01, 0.06, 0.1],
  h: [0.43, 0.49, 0.5, 0.49, 0.43],
};
export const Af = {
  x: [-0.58, -0.32, 0, 0.32, 0.58],
  y: [0.17, 0.14, 0.1, 0.14, 0.17],
  h: [0.4, 0.44, 0.53, 0.44, 0.4],
  z: [-0.04, -0.02, 0.14, -0.02, -0.04],
  blur: [1, 1, 0, 1, 1],
};

export interface HeroFrame {
  progress: number;
  intro: number;
  paint: number;
  shop: number;
  offset: number;
  width: number;
  height: number;
}

interface HeroCard {
  mesh: Mesh;
  mat: ShaderMaterial;
  product: (typeof L)[number];
}

export class HeroEngine {
  renderer: WebGLRenderer;
  scene = new Scene();
  camera = new PerspectiveCamera(30, 1, 1, 10000);
  cards: HeroCard[] = [];
  shared = {
    uPaint: { value: 0 },
    uTime: { value: 0 },
    uRes: { value: new Vector2(1, 1) },
    uPaper: { value: new Color(vf) },
  };
  width = 1;
  height = 1;
  raf = 0;
  timer = new Timer();
  started = -1;
  progress = 0;
  offset = 2;
  targetOffset = 2;
  mouse = new Vector2();
  mouseSmooth = new Vector2();
  aX = [...Of.x];
  layoutKey = '';
  onFrame?: (f: HeroFrame) => void;
  track: HTMLElement | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const bg = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        vertexShader: uf,
        fragmentShader: df,
        uniforms: { ...this.shared, uInk: { value: new Color(_f) } },
        depthTest: false,
        depthWrite: false,
      }),
    );
    bg.frustumCulled = false;
    bg.renderOrder = -1;
    this.scene.add(bg);
    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onPointer);
    this.resize();
  }

  async load(): Promise<void> {
    const loader = new TextureLoader();
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    const textures = await Promise.all(L.map((p) => loader.loadAsync(p.image)));
    textures.forEach((tex, n) => {
      tex.anisotropy = maxAniso;
      tex.wrapS = ClampToEdgeWrapping;
      tex.wrapT = ClampToEdgeWrapping;
      const product = L[n];
      const mat = new ShaderMaterial({
        vertexShader: ff,
        fragmentShader: gf,
        uniforms: {
          ...this.shared,
          uMap: { value: tex },
          uTop: { value: new Color(product.top) },
          uBottom: { value: new Color(product.bottom) },
          uAspect: { value: 0.6 },
          uBlur: { value: 0 },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const mesh = new Mesh(new PlaneGeometry(1, 1), mat);
      this.scene.add(mesh);
      this.cards.push({ mesh, mat, product });
    });
    this.renderer.compile(this.scene, this.camera);
    textures.forEach((tex) => this.renderer.initTexture(tex));
  }

  start(): void {
    this.timer.update();
    this.started = this.timer.getElapsed();
    this.loop();
  }

  step(e: number): void {
    this.targetOffset += e;
  }

  get target(): number {
    return this.targetOffset;
  }

  onPointer = (e: PointerEvent): void => {
    this.mouse.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1,
    );
  };

  resize = (): void => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setSize(this.width, this.height, false);
    const pr = this.renderer.getPixelRatio();
    this.shared.uRes.value.set(this.width * pr, this.height * pr);
    this.camera.aspect = this.width / this.height;
    this.camera.position.z =
      this.height / 2 / Math.tan(MathUtils.degToRad(this.camera.fov / 2));
    this.camera.updateProjectionMatrix();
  };

  solveLayout(e: number): void {
    const t = this.camera.clone();
    t.position.set(0, 0, this.camera.position.z);
    t.lookAt(0, 0, 0);
    t.updateMatrixWorld();
    const n = new Vector3();
    const r = (r: number, i: number, a: number): number => {
      const o = ((Of.h[r] * Of.aspect[r] * e) / 2);
      const s = Of.rot[r];
      n.set(i * e + a * o * Math.cos(s), Of.y[r] * e, -a * o * Math.sin(s)).project(t);
      return (n.x * this.width) / 2;
    };
    const i = Df * e;
    for (const e of [1, -1]) {
      let t = r(2, 0, e);
      for (const n of [2 + e, 2 + 2 * e]) {
        const a = t + e * i;
        let o = -2;
        let s = 2;
        for (let t = 0; t < 40; t++) {
          const t = (o + s) / 2;
          if (r(n, t, -e) < a) o = t;
          else s = t;
        }
        this.aX[n] = (o + s) / 2;
        t = r(n, this.aX[n], e);
      }
    }
  }

  loop = (e?: number): void => {
    this.raf = requestAnimationFrame(this.loop);
    this.timer.update(e);
    const t = Math.min(this.timer.getDelta(), 1 / 20);
    const n = this.timer.getElapsed();
    const r = n - this.started;
    this.shared.uTime.value = n;
    let i = 0;
    let a = true;
    if (this.track) {
      const e = this.track.getBoundingClientRect();
      const t = e.height - window.innerHeight;
      i = t > 0 ? bf(-e.top / t) : 0;
      a = e.bottom > 0;
    }
    this.progress += (i - this.progress) * (1 - Math.exp(-t * 10));
    this.offset += (this.targetOffset - this.offset) * (1 - Math.exp(-t * 5.5));
    const o = this.progress;
    const s = wf(xf(r, 0.9, 2.3));
    const c = Cf(xf(o, 0.02, 0.15));
    const l = Cf(xf(o, 0.15, 0.28));
    const u = xf(o, 0.34, 0.6);
    const d = Cf(xf(o, 0.34, 0.56));
    const f = Cf(xf(o, 0.66, 0.86));
    this.shared.uPaint.value = u;
    if (f === 0) {
      const e = this.targetOffset + Tf(2 - this.targetOffset, yf);
      if (e !== this.targetOffset) this.targetOffset = Math.round(e);
    }
    const p = this.width;
    const m = this.height;
    const h = p < m ? Math.min(p, m * 0.62) : Math.min(p / 1.2, m);
    const g = `${p}x${m}`;
    if (g !== this.layoutKey) {
      this.layoutKey = g;
      this.solveLayout(h);
    }
    this.mouseSmooth.lerp(this.mouse, 1 - Math.exp(-t * 3));
    this.camera.position.x = this.mouseSmooth.x * 18;
    this.camera.position.y = -this.mouseSmooth.y * 10;
    this.camera.lookAt(0, 0, 0);
    for (let e = 0; e < this.cards.length; e++) {
      const { mesh: t, mat: r } = this.cards[e];
      let i = Tf(e - this.offset, yf);
      const a = Math.abs(i);
      const o = a < 0.5 ? 1 : a < 1.5 ? c : l;
      let u = Sf(this.aX[2], Ef(this.aX, i), o);
      let p = Sf(Of.y[2], Ef(Of.y, i), o);
      let m = Sf(Of.h[2] * 0.94, Ef(Of.h, i), o);
      let g = Sf(0, Ef(Of.rot, i), o);
      let _ = Sf(-0.03 * a, 0, o);
      const v = Sf(Of.aspect[2], Ef(Of.aspect, i), o);
      u = Sf(u, Ef(kf.x, i), d);
      p = Sf(p, Ef(kf.y, i), d);
      m = Sf(m, Ef(kf.h, i), d);
      g = Sf(g, 0, d);
      u = Sf(u, Ef(Af.x, i), f);
      p = Sf(p, Ef(Af.y, i), f);
      m = Sf(m, Ef(Af.h, i), f);
      _ = Sf(_, Ef(Af.z, a > 2 ? 2 : i), f);
      const y = bf(Ef(Af.blur, Math.max(-2, Math.min(2, i)))) * f;
      p += Math.sin(n * 0.9 + e * 1.7) * 0.004 * d;
      let b = a < 0.5 ? 1 : Math.min(1, o * 25);
      b *= 1 - xf(a, 2.05, 2.5);
      let x = 0;
      if (a < 0.5) {
        p -= (1 - s) * 0.95;
        m *= 0.88 + 0.12 * s;
        x = (1 - s) * -0.35;
        b *= xf(s, 0, 0.25);
      } else {
        b *= s;
      }
      t.position.set(u * h, p * h, _ * h);
      t.rotation.set(x, g, 0);
      t.scale.set(m * h * pf, m * h, 1);
      t.renderOrder = 100 - Math.round(a * 10);
      r.uniforms.uAspect.value = v;
      r.uniforms.uBlur.value = y * 0.02;
      r.uniforms.uOpacity.value = b;
    }
    if (a) {
      this.renderer.render(this.scene, this.camera);
      this.onFrame?.({
        progress: o,
        intro: s,
        paint: u,
        shop: f,
        offset: this.offset,
        width: p,
        height: m,
      });
    }
  };

  dispose(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointer);
    this.scene.traverse((e) => {
      if (e instanceof Mesh) {
        e.geometry.dispose();
        const mat = e.material as ShaderMaterial;
        (mat.uniforms.uMap?.value as Texture | undefined)?.dispose();
        mat.dispose();
      }
    });
    this.timer.dispose();
    this.renderer.dispose();
  }
}
