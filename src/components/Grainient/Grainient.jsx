import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./Grainient.css";

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec2 uMouse;
uniform vec2 uMouseVel;
uniform float uMouseInfluence;
uniform float uMouseWarp;
uniform float uScroll;
uniform vec3 uTargetColor;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);} 
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}

// --- Original composition: weighted sum of colored gaussian blobs ---------
void blob(inout vec3 acc,inout float total,vec2 p,vec2 c,vec2 r,vec3 col,float amp){
  vec2 d=(p-c)/r;
  float w=amp*exp(-dot(d,d));
  acc+=col*w;
  total+=w;
}
// Slow Lissajous orbit — each color region drifts on its own path
vec2 orb(float t,float s,float ph,vec2 r){
  return vec2(sin(t*s+ph),cos(t*s*0.83+ph*1.4))*r;
}
vec3 gradientField(vec2 p,float t){
  vec3 acc=vec3(0.859,0.765,0.918)*0.30; // lavender base (weak, fallback only)
  float total=0.30;
  // cream S-band (left edge -> center top)
  blob(acc,total,p,vec2(-0.02,0.50)+orb(t,0.11,0.0,vec2(0.050,0.030)),vec2(0.30,0.16),vec3(0.973,0.910,0.792),2.80);
  blob(acc,total,p,vec2( 0.44,0.40)+orb(t,0.09,2.1,vec2(0.060,0.040)),vec2(0.26,0.13),vec3(0.973,0.910,0.792),2.60);
  blob(acc,total,p,vec2( 0.58,0.26)+orb(t,0.13,4.0,vec2(0.050,0.030)),vec2(0.24,0.12),vec3(0.976,0.918,0.808),2.00);
  // hot orange wave (elongated crest + core + right arm)
  blob(acc,total,p,vec2( 0.66,0.45)+orb(t,0.10,1.0,vec2(0.070,0.045)),vec2(0.28,0.16),vec3(1.000,0.369,0.000),2.60);
  blob(acc,total,p,vec2( 1.05,0.52)+orb(t,0.08,3.0,vec2(0.080,0.050)),vec2(0.38,0.26),vec3(1.000,0.361,0.000),2.80);
  blob(acc,total,p,vec2( 1.38,0.52)+orb(t,0.12,5.1,vec2(0.060,0.040)),vec2(0.28,0.24),vec3(1.000,0.435,0.118),1.80);
  blob(acc,total,p,vec2( 1.12,0.70)+orb(t,0.14,2.6,vec2(0.050,0.035)),vec2(0.22,0.14),vec3(1.000,0.478,0.188),1.50);
  // top band
  blob(acc,total,p,vec2( 0.00,-0.05)+orb(t,0.09,0.7,vec2(0.060,0.030)),vec2(0.30,0.20),vec3(0.973,0.282,0.059),2.20); // top-left orange-red
  blob(acc,total,p,vec2( 0.85,0.02)+orb(t,0.11,3.8,vec2(0.080,0.030)),vec2(0.45,0.18),vec3(1.000,0.352,0.016),2.00); // top-center orange
  // lavender patches
  blob(acc,total,p,vec2( 1.66,0.14)+orb(t,0.10,1.9,vec2(0.060,0.050)),vec2(0.34,0.34),vec3(0.851,0.706,0.965),2.40); // top-right
  blob(acc,total,p,vec2( 0.08,0.32)+orb(t,0.13,4.4,vec2(0.040,0.030)),vec2(0.16,0.16),vec3(0.835,0.655,0.925),2.40); // left
  blob(acc,total,p,vec2( 0.98,0.82)+orb(t,0.09,2.8,vec2(0.070,0.045)),vec2(0.28,0.20),vec3(0.812,0.682,0.941),2.40); // bottom-mid-right pool
  blob(acc,total,p,vec2( 0.08,0.78)+orb(t,0.12,5.6,vec2(0.040,0.030)),vec2(0.18,0.14),vec3(0.847,0.698,0.910),2.00); // bottom-left
  blob(acc,total,p,vec2(-0.05,1.02)+orb(t,0.10,0.3,vec2(0.050,0.020)),vec2(0.26,0.16),vec3(0.961,0.882,0.761),1.80); // bottom-left corner cream
  // bottom patches
  blob(acc,total,p,vec2( 0.50,0.88)+orb(t,0.11,3.3,vec2(0.060,0.040)),vec2(0.22,0.16),vec3(1.000,0.379,0.027),2.00); // bottom-left orange
  blob(acc,total,p,vec2( 1.55,0.85)+orb(t,0.08,4.8,vec2(0.060,0.040)),vec2(0.32,0.22),vec3(0.965,0.851,0.682),2.00); // cream bottom-right
  // pink accents
  blob(acc,total,p,vec2( 0.26,0.64)+orb(t,0.14,1.4,vec2(0.040,0.030)),vec2(0.14,0.12),vec3(0.933,0.549,0.706),1.20);
  blob(acc,total,p,vec2( 0.80,0.95)+orb(t,0.12,5.9,vec2(0.050,0.025)),vec2(0.18,0.12),vec3(0.906,0.561,0.690),1.20);
  blob(acc,total,p,vec2( 0.88,0.68)+orb(t,0.13,2.2,vec2(0.040,0.030)),vec2(0.16,0.12),vec3(0.925,0.604,0.643),0.90); // salmon mid
  return acc/total;
}

// --- Section texture field: light/shadow contrast that reads on any pastel ----
// Colours range from bright highlights to warm mid-tones so shape is always
// visible, regardless of which section background (cream/orange/rose) is active.
vec3 sectionField(vec2 p,float t){
  vec3 acc=vec3(0.0);
  float total=0.0;
  // bright cream highlight
  blob(acc,total,p,vec2(0.30,0.40)+orb(t,0.06,0.0,vec2(0.18,0.12)),vec2(0.60,0.45),vec3(1.00,0.96,0.88),2.5);
  // deeper warm shadow
  blob(acc,total,p,vec2(0.70,0.35)+orb(t,0.05,2.5,vec2(0.16,0.11)),vec2(0.55,0.40),vec3(0.92,0.75,0.58),2.2);
  // pale lavender highlight
  blob(acc,total,p,vec2(0.45,0.65)+orb(t,0.07,4.0,vec2(0.14,0.10)),vec2(0.50,0.38),vec3(0.96,0.88,0.96),2.0);
  // peach shadow
  blob(acc,total,p,vec2(0.55,0.20)+orb(t,0.05,1.2,vec2(0.15,0.10)),vec2(0.48,0.36),vec3(0.98,0.78,0.62),1.8);
  // cream highlight
  blob(acc,total,p,vec2(0.25,0.75)+orb(t,0.06,3.8,vec2(0.13,0.09)),vec2(0.52,0.40),vec3(1.00,0.95,0.85),1.9);
  // top-left drift: warm peach
  blob(acc,total,p,vec2(0.15,0.18)+orb(t,0.05,5.5,vec2(0.12,0.08)),vec2(0.45,0.35),vec3(1.00,0.85,0.68),2.0);
  // top-left drift: pale lavender
  blob(acc,total,p,vec2(0.22,0.28)+orb(t,0.04,0.8,vec2(0.10,0.07)),vec2(0.48,0.38),vec3(0.94,0.86,0.95),1.7);
  // soft rose blob — drawn directly in mainImage as additive glow
  // (removed from sectionField to avoid dilution among other blobs)
  return acc/max(total,0.001);
}
// ---------------------------------------------------------------------------

void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  // Cursor coupling: the waves lean toward the pointer (positional warp),
  // and moving the cursor stirs them locally (damped velocity, gaussian falloff).
  vec2 dm=(uv-(uMouse*0.5+0.5))*vec2(ratio,1.0);
  float focus=exp(-dot(dm,dm)/0.18);
  tuv+=uMouse*focus*uMouseWarp;
  tuv+=uMouseVel*focus*uMouseInfluence;

  // Sample the original composition, cover-fitted to the screen
  vec2 suv=tuv*max(uZoom,0.001)+0.5;
  float compAspect=1.6748; // matches the 2400x1433 artwork
  vec2 fit=(ratio>compAspect)?vec2(1.0,compAspect/ratio):vec2(ratio/compAspect,1.0);
  vec2 cuv=(suv-0.5)*fit+0.5;
  vec2 p=vec2(cuv.x,1.0-cuv.y)*vec2(compAspect,1.0);
  // Scroll drift: the whole field travels as the page scrolls
  p+=vec2(uScroll*0.15,uScroll*0.45);
  vec3 col=gradientField(p,t*3.0);
  // Settle: hero artwork -> section background tone + visible blob texture
  float settle=smoothstep(0.2,0.80,uScroll);
  vec3 sectionRaw=sectionField(uv,t*1.6);
  // Tint the textured field toward the section's base colour so each
  // section (cream / orange / rose) has its own overall hue while
  // keeping the light/shadow shapes readable.
  vec3 sectionCol=mix(sectionRaw,uTargetColor,0.42);
  col=mix(col,sectionCol,settle);

  // --- Standalone cursor-follow soft-rose glow (only in sections) ---
  if(settle>0.01){
    vec2 mouseUV=uMouse*0.5+0.5;
    // aspect-correct Gaussian falloff around the cursor
    vec2 cd=(uv-mouseUV)/vec2(0.1,0.1*ratio);
    float glow=exp(-dot(cd,cd));
    // shift section colour toward a pale rose-lilac (no additive clipping)
    vec3 roseLilac=vec3(1.00,0.72,0.88);
    col=mix(col,roseLilac,0.45*glow*settle);
  }
  // ------------------------------------------------------------------

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);} 
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

// Keep renderer/program alive across re-renders so Effect 2 can update
// uniforms without ever rebuilding the WebGL context.
const ctxMap = new WeakMap();

const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));

const Grainient = ({
  timeSpeed = 0.25,
  warpStrength = 1.0,
  warpFrequency = 5.0,
  warpSpeed = 2.0,
  warpAmplitude = 50.0,
  rotationAmount = 500.0,
  noiseScale = 2.0,
  grainAmount = 0.1,
  grainScale = 2.0,
  grainAnimated = false,
  contrast = 1.5,
  gamma = 1.0,
  saturation = 1.0,
  centerX = 0.0,
  centerY = 0.0,
  zoom = 0.9,
  mouseInfluence = 0.0,
  mouseWarp = 0.0,
  scrollProgress = 0.0,
  targetColor = [0.973, 0.91, 0.792],
  className = "",
}) => {
  const containerRef = useRef(null);

  // Effect 1: build WebGL context once, pause when offscreen / tab hidden
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uTimeSpeed: { value: 0.25 },
        uWarpStrength: { value: 1.0 },
        uWarpFrequency: { value: 5.0 },
        uWarpSpeed: { value: 2.0 },
        uWarpAmplitude: { value: 50.0 },
        uRotationAmount: { value: 500.0 },
        uNoiseScale: { value: 2.0 },
        uGrainAmount: { value: 0.1 },
        uGrainScale: { value: 2.0 },
        uGrainAnimated: { value: 0.0 },
        uContrast: { value: 1.5 },
        uGamma: { value: 1.0 },
        uSaturation: { value: 1.0 },
        uCenterOffset: { value: new Float32Array([0, 0]) },
        uZoom: { value: 0.9 },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseVel: { value: new Float32Array([0, 0]) },
        uMouseInfluence: { value: 0.0 },
        uMouseWarp: { value: 0.0 },
        uScroll: { value: 0.0 },
        uTargetColor: { value: new Float32Array([0.973, 0.91, 0.792]) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctxMap.set(container, { renderer, program, mesh });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      renderer.setSize(w, h);
      const res = program.uniforms.iResolution.value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    let raf = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const t0 = performance.now();

    // Cursor state: raw target, smoothed position, damped velocity (NDC, y up)
    const mouse = { tx: 0, ty: 0, x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0 };
    const onPointerMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove);

    let lastT = t0;
    const loop = (t) => {
      const dt = Math.max((t - lastT) * 0.001, 1e-4);
      lastT = t;
      program.uniforms.iTime.value = (t - t0) * 0.001;

      // Smooth follow (~0.1 lerp at 60fps) + velocity, clamped to avoid spikes
      mouse.x = damp(mouse.x, mouse.tx, 6.3, dt);
      mouse.y = damp(mouse.y, mouse.ty, 6.3, dt);
      mouse.vx = damp(mouse.vx, (mouse.x - mouse.px) / dt, 3.0, dt);
      mouse.vy = damp(mouse.vy, (mouse.y - mouse.py) / dt, 3.0, dt);
      const speed = Math.hypot(mouse.vx, mouse.vy);
      if (speed > 5) {
        mouse.vx *= 5 / speed;
        mouse.vy *= 5 / speed;
      }
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      const uMouse = program.uniforms.uMouse.value;
      uMouse[0] = mouse.x;
      uMouse[1] = mouse.y;
      const uMouseVel = program.uniforms.uMouseVel.value;
      uMouseVel[0] = mouse.vx;
      uMouseVel[1] = mouse.vy;

      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) {
        lastT = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? tryStart() : tryStop();
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      isPageVisible = !document.hidden;
      isPageVisible ? tryStart() : tryStop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    tryStart();

    return () => {
      tryStop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      ctxMap.delete(container);
      try {
        container.removeChild(canvas);
      } catch {
        /* ignore */
      }
    };
  }, []); // renderer created once

  // Effect 2: sync props to uniforms — zero GPU cost, no teardown
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ctx = ctxMap.get(container);
    if (!ctx) return;
    const { program } = ctx;
    const u = program.uniforms;

    u.uTimeSpeed.value = timeSpeed;
    u.uWarpStrength.value = warpStrength;
    u.uWarpFrequency.value = warpFrequency;
    u.uWarpSpeed.value = warpSpeed;
    u.uWarpAmplitude.value = warpAmplitude;
    u.uRotationAmount.value = rotationAmount;
    u.uNoiseScale.value = noiseScale;
    u.uGrainAmount.value = grainAmount;
    u.uGrainScale.value = grainScale;
    u.uGrainAnimated.value = grainAnimated ? 1.0 : 0.0;
    u.uContrast.value = contrast;
    u.uGamma.value = gamma;
    u.uSaturation.value = saturation;
    u.uCenterOffset.value = new Float32Array([centerX, centerY]);
    u.uZoom.value = zoom;
    u.uMouseInfluence.value = mouseInfluence;
    u.uMouseWarp.value = mouseWarp;
    u.uScroll.value = scrollProgress;
    u.uTargetColor.value = new Float32Array(targetColor);
  }, [
    timeSpeed,
    warpStrength,
    warpFrequency,
    warpSpeed,
    warpAmplitude,
    rotationAmount,
    noiseScale,
    grainAmount,
    grainScale,
    grainAnimated,
    contrast,
    gamma,
    saturation,
    centerX,
    centerY,
    zoom,
    mouseInfluence,
    mouseWarp,
    scrollProgress,
    targetColor,
  ]);

  return (
    <div
      ref={containerRef}
      className={`grainient-container ${className}`.trim()}
    />
  );
};

export default Grainient;
