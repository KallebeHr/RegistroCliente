<template>
  <section class="hero" id="inicio" ref="root">
    <!-- background layers -->
    <div class="bg" aria-hidden="true">
      <div class="bg__grid"></div>
      <div class="bg__glow bg__glow--a"></div>
      <div class="bg__glow bg__glow--b"></div>
      <div class="bg__noise"></div>

      <div class="bg__particles" aria-hidden="true">
        <span v-for="n in 18" :key="n" class="p"></span>
      </div>
      <div class="bg__cursor" aria-hidden="true"></div>
    </div>

    <div class="hero__container">
      <div class="center">
        <div class="logo-wrap" ref="logoWrap" @mousemove="onTilt" @mouseleave="resetTilt">
          <div class="logo-ring" aria-hidden="true"></div>
          <img class="logo" src="/Logo/LogoPNG.png" alt="Logo do escritório" ref="logoEl" />
          <div class="logo-shine" aria-hidden="true"></div>
        </div>

        <div class="copy" ref="copy">
          <p class="kicker" ref="kicker">
            MaxSistemas • Presença Digital Jurídica • Acessibilidade & Performance
          </p>

          <h1 class="title" ref="title">
            Transforme sua presença online em
            <span class="title__accent">credibilidade</span>
            e atraia contatos qualificados.
          </h1>

          <p class="subtitle" ref="subtitle">
            Landing page para advocacia com estrutura clara, acessível e pronta para conversão:
            formulário estratégico, botões de WhatsApp e apresentação institucional.
          </p>

          <div class="cta-row" ref="ctaRow">
            <button class="cta primary" ref="ctaPrimary" type="button" @click="goForm">
              Solicitar avaliação do site
              <span class="arrow" aria-hidden="true">→</span>
              <span class="shine" aria-hidden="true"></span>
            </button>

            <div class="drop">
              <button
                class="cta secondary"
                ref="dropRef"
                type="button"
                @click="toggleDrop"
                :aria-expanded="dropOpen ? 'true' : 'false'"
                aria-haspopup="true"
              >
                Perguntas frequentes
                <span class="chev" aria-hidden="true"></span>
              </button>

              <div
                v-show="dropOpen"
                class="panel"
                ref="panelRef"
                role="menu"
                @keydown.esc="closeDrop"
              >
                <button class="panel__item" role="menuitem" @click="pickFAQ(0)">
                  Em quanto tempo fica pronto?
                  <span class="muted">• geralmente 24–72h, conforme conteúdo e identidade visual</span>
                </button>

                <button class="panel__item" role="menuitem" @click="pickFAQ(1)">
                  Tem botão direto para WhatsApp?
                  <span class="muted">• sim, com mensagem pré-configurada e rastreio</span>
                </button>

                <button class="panel__item" role="menuitem" @click="pickFAQ(2)">
                  Preciso ter domínio?
                  <span class="muted">• se não tiver, você pode usar subdomínio e migrar depois</span>
                </button>

                <div class="panel__divider"></div>

                <button class="panel__cta" role="menuitem" @click="scrollTo('#contato')">
                  Quer um modelo para seu escritório?
                  <span class="spark" aria-hidden="true"></span>
                </button>
              </div>
            </div>
          </div>

          <div class="trust" ref="trust">
            <span class="trust__pill">⚖️ Tom institucional</span>
            <span class="trust__pill">🔒 Boas práticas & LGPD</span>
            <span class="trust__pill">⚡ Carregamento rápido</span>
            <span class="trust__pill">♿ Acessível</span>
          </div>

          <p class="disclaimer">
            *Conteúdo informativo. Sem promessas de resultado. Layout conforme diretrizes do escritório.
          </p>
        </div>

        <!-- scroll hint -->
        <div class="scroll-hint" ref="scrollHint" aria-hidden="true">
          <span class="scroll-hint__line"></span>
          <span class="scroll-hint__text">role</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// GSAP
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Motion One
import { animate } from "@motionone/dom";

// Floating UI
import { computePosition, offset, flip, shift, autoUpdate } from "@floating-ui/dom";

gsap.registerPlugin(ScrollTrigger);

// ===== Refs =====
const root = ref(null);

const logoWrap = ref(null);
const logoEl = ref(null);

const copy = ref(null);
const kicker = ref(null);
const title = ref(null);
const subtitle = ref(null);
const ctaRow = ref(null);
const ctaPrimary = ref(null);
const trust = ref(null);
const scrollHint = ref(null);

const dropRef = ref(null);
const panelRef = ref(null);

const dropOpen = ref(false);
let cleanupFloating = null;

const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

function goForm() {
  router.push("/Formulario");
}

// ===== Helpers =====
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// FAQs
const faqs = [
  { q: "Em quanto tempo fica pronto?", a: "Geralmente 24–72h, conforme conteúdo, revisão e identidade visual." },
  { q: "Tem botão direto para WhatsApp?", a: "Sim. Botões com mensagem pronta e envio direto configurado." },
  { q: "Preciso ter domínio?", a: "Não. Você pode iniciar com subdomínio e migrar quando quiser." }
];

function pickFAQ(idx) {
  closeDrop();
  animate(title.value, { transform: ["scale(1)", "scale(1.01)", "scale(1)"] }, { duration: 0.25 });
  console.log("FAQ:", faqs[idx]);
}

// Dropdown
function toggleDrop() {
  dropOpen.value = !dropOpen.value;
  nextTick(() => {
    if (dropOpen.value) {
      positionPanel();
      animateOpenPanel();
    }
  });
}

function closeDrop() {
  dropOpen.value = false;
}

function positionPanel() {
  if (!dropRef.value || !panelRef.value) return;

  cleanupFloating?.();
  cleanupFloating = autoUpdate(dropRef.value, panelRef.value, async () => {
    const { x, y } = await computePosition(dropRef.value, panelRef.value, {
      placement: "bottom-start",
      middleware: [offset(10), flip(), shift({ padding: 12 })]
    });
    Object.assign(panelRef.value.style, {
      left: `${x}px`,
      top: `${y}px`
    });
  });
}

function animateOpenPanel() {
  if (!panelRef.value) return;
  animate(
    panelRef.value,
    { opacity: [0, 1], transform: ["translateY(-8px) scale(0.985)", "translateY(0px) scale(1)"] },
    { duration: 0.16 }
  );
}

// ===== Tilt na logo =====
function onTilt(e) {
  if (prefersReduced) return;
  const el = logoWrap.value;
  if (!el) return;

  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;

  const rotY = (px - 0.5) * 10;
  const rotX = (0.5 - py) * 10;

  el.style.setProperty("--rx", `${rotX}deg`);
  el.style.setProperty("--ry", `${rotY}deg`);
}

function resetTilt() {
  const el = logoWrap.value;
  if (!el) return;
  el.style.setProperty("--rx", `0deg`);
  el.style.setProperty("--ry", `0deg`);
}

// ===== Click fora do dropdown =====
function onDocClick(ev) {
  if (!dropOpen.value) return;
  const t = ev.target;
  if (!t) return;

  const inButton = dropRef.value?.contains(t);
  const inPanel = panelRef.value?.contains(t);
  if (!inButton && !inPanel) closeDrop();
}

// ===== Magnetic hover =====
function magnetic(el, strength = 16) {
  if (!el || prefersReduced) return () => {};

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x / strength, y: y / strength, duration: 0.25, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.35, ease: "power3.out" });
  };

  el.addEventListener("mousemove", onMove);
  el.addEventListener("mouseleave", onLeave);

  return () => {
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

// ===== Split words =====
function splitWords(el) {
  if (!el) return [];
  const text = el.textContent.trim();
  const words = text.split(" ");

  el.innerHTML = words
    .map((w) => `<span class="w">${w}</span>`)
    .join(" ");

  return Array.from(el.querySelectorAll(".w"));
}

// ===== Particles =====
function setupParticles() {
  const wrap = root.value?.querySelector(".bg__particles");
  if (!wrap) return;

  const dots = wrap.querySelectorAll(".p");
  dots.forEach((d) => {
    const s = gsap.utils.random(2, 5);
    gsap.set(d, {
      xPercent: -50,
      yPercent: -50,
      left: gsap.utils.random(6, 94) + "%",
      top: gsap.utils.random(12, 94) + "%",
      width: s,
      height: s,
      opacity: gsap.utils.random(0.06, 0.18),
      filter: `blur(${gsap.utils.random(0.3, 1.1)}px)`
    });

    if (!prefersReduced) {
      gsap.to(d, {
        y: `+=${gsap.utils.random(-18, 18)}`,
        x: `+=${gsap.utils.random(-18, 18)}`,
        opacity: gsap.utils.random(0.05, 0.20),
        duration: gsap.utils.random(3.2, 5.8),
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  });
}

// ===== Cursor glow =====
function setupCursorGlow() {
  const glow = root.value?.querySelector(".bg__cursor");
  if (!glow || prefersReduced) return () => {};

  const move = (e) => {
    const r = root.value.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    glow.style.setProperty("--cx", `${x}px`);
    glow.style.setProperty("--cy", `${y}px`);
  };

  root.value.addEventListener("mousemove", move);
  return () => root.value?.removeEventListener("mousemove", move);
}

// ===== GSAP =====
let ctx;
let cleanupMagnetic = () => {};
let cleanupGlow = () => {};

onMounted(() => {
  document.addEventListener("click", onDocClick);

  // Preparar split words
  const titleWords = splitWords(title.value);
  const subtitleWords = splitWords(subtitle.value);

  if (!prefersReduced) {
    gsap.set([...titleWords, ...subtitleWords], { opacity: 0, y: 10, filter: "blur(6px)" });
  }

  setupParticles();
  cleanupGlow = setupCursorGlow();
  cleanupMagnetic = magnetic(ctaPrimary.value, 16);

  ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      logoWrap.value,
      { opacity: 0, y: 14, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8 }
    )
      .fromTo(
        kicker.value,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45 },
        "-=0.35"
      )
      .fromTo(title.value, { opacity: 1 }, { opacity: 1, duration: 0.01 })
      .fromTo(subtitle.value, { opacity: 1 }, { opacity: 1, duration: 0.01 }, "-=0.2")
      .fromTo(
        ctaRow.value,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.45 },
        "-=0.2"
      )
      .fromTo(
        trust.value,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.18"
      )
      .fromTo(
        scrollHint.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
        "-=0.1"
      )
      // REVEAL por palavras
      .to(
        titleWords,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.03 },
        "-=0.85"
      )
      .to(
        subtitleWords,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4, stagger: 0.015 },
        "-=0.65"
      );

    // breathing logo
    if (!prefersReduced) {
      gsap.to(logoWrap.value, {
        y: -6,
        duration: 3.0,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }

    // orbita e pulse
    if (!prefersReduced) {
      const ring = root.value?.querySelector(".logo-ring");
      const shine = root.value?.querySelector(".logo-shine");
      if (ring) gsap.to(ring, { rotate: 360, duration: 22, ease: "none", repeat: -1 });
      if (shine) gsap.to(shine, { opacity: 0.18, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    }

    // Parallax background com var
    ScrollTrigger.create({
      trigger: root.value,
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        root.value?.style.setProperty("--bgShift", `${self.progress * 56}px`);
      }
    });

    // Blur/scale no bg ao scroll
    const bg = root.value?.querySelector(".bg");
    if (bg) {
      gsap.to(bg, {
        scrollTrigger: { trigger: root.value, start: "top top", end: "bottom top", scrub: 1 },
        filter: "blur(6px)",
        scale: 1.04,
        ease: "none"
      });
    }

    // saída elegante ao scroll
    gsap.to(copy.value, {
      scrollTrigger: { trigger: root.value, start: "top top", end: "bottom top", scrub: 1 },
      y: 28,
      opacity: 0.40,
      scale: 0.985,
      transformOrigin: "center",
      ease: "none"
    });
  }, root.value);

  // Motion One hover suave nos botões
  if (!prefersReduced) {
    const btns = [ctaPrimary.value, dropRef.value].filter(Boolean);
    btns.forEach((b) => {
      b.addEventListener("mouseenter", () => {
        animate(b, { transform: ["translateY(0px)", "translateY(-2px)"] }, { duration: 0.14 });
      });
      b.addEventListener("mouseleave", () => {
        animate(b, { transform: ["translateY(-2px)", "translateY(0px)"] }, { duration: 0.14 });
      });
    });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocClick);
  cleanupFloating?.();
  cleanupMagnetic?.();
  cleanupGlow?.();
  ctx?.revert();
});
</script>

<style scoped>
/* ============ HERO BASE ============ */
.hero {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(1200px 700px at 50% 12%, #0b0f18, #07080b 55%, #06070a);
  color: rgba(255,255,255,0.92);
  --bgShift: 0px;
}

.hero__container {
  width: 100%;
  max-width: 1180px;
  padding: 72px 18px 64px;
}

.center {
  display: grid;
  place-items: center;
  text-align: center;
  gap: 22px;
}

/* ============ BACKGROUND ============ */
.bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translateY(calc(var(--bgShift) * -1));
  will-change: transform, filter;
}

.bg__grid {
  position: absolute;
  inset: -35%;
  background:
    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 38px 38px;
  opacity: 0.14;
  transform: rotate(10deg);
  mask-image: radial-gradient(circle at 50% 35%, rgba(0,0,0,1), rgba(0,0,0,0.1) 58%, transparent 75%);
}

.bg__glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(64px);
  opacity: 0.45;
}

.bg__glow--a {
  width: 520px;
  height: 520px;
  left: 50%;
  top: 10%;
  transform: translateX(-68%);
  background: radial-gradient(circle at 30% 35%, rgba(255,255,255,0.14), transparent 62%);
}

.bg__glow--b {
  width: 640px;
  height: 640px;
  left: 50%;
  top: 46%;
  transform: translateX(-30%);
  background: radial-gradient(circle at 55% 45%, rgba(255,255,255,0.11), transparent 64%);
}

.bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
}

/* Particles */
.bg__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.bg__particles .p {
  position: absolute;
  border-radius: 999px;
  background: rgba(255,255,255,0.86);
  box-shadow: 0 0 18px rgba(255,255,255,0.10);
}

/* Cursor glow */
.bg__cursor {
  position: absolute;
  inset: 0;
  opacity: 0.50;
  background:
    radial-gradient(
      320px 320px at var(--cx, 50%) var(--cy, 35%),
      rgba(255,255,255,0.09),
      transparent 62%
    );
  transition: opacity 180ms ease;
}

/* ============ LOGO ============ */
.logo-wrap {
  position: relative;
  width: min(210px, 58vw);
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
  transform-style: preserve-3d;
  transform: perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  transition: transform 180ms ease;
}

.logo {
  width: 62%;
  height: auto;
  z-index: 2;
  filter: drop-shadow(0 16px 44px rgba(0,0,0,0.55));
}

.logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 26px;
  background:
    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.16), transparent 62%),
    linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03));
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow:
    0 26px 86px rgba(0,0,0,0.55),
    inset 0 0 0 1px rgba(255,255,255,0.05);
  overflow: hidden;
}

.logo-ring::after {
  content: "";
  position: absolute;
  inset: -42%;
  background: conic-gradient(from 180deg, transparent, rgba(255,255,255,0.20), transparent);
  animation: spin 6.2s linear infinite;
  opacity: 0.55;
}

.logo-shine {
  position: absolute;
  inset: 9%;
  border-radius: 20px;
  background: radial-gradient(circle at 30% 25%, rgba(255,255,255,0.12), transparent 58%);
  z-index: 1;
}

/* ============ COPY ============ */
.copy {
  max-width: 920px;
  display: grid;
  gap: 14px;
}

.kicker {
  margin: 0 auto;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.035);
  color: rgba(255,255,255,0.82);
  font-size: 12px;
  letter-spacing: 0.35px;
}

.title {
  margin: 0;
  font-size: clamp(28px, 4.2vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.6px;
}

.title__accent {
  background: linear-gradient(90deg, rgba(255,255,255,0.98), rgba(255,255,255,0.62));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 10px 34px rgba(0,0,0,0.55);
}

.subtitle {
  margin: 0 auto;
  max-width: 760px;
  font-size: clamp(14px, 1.35vw, 18px);
  line-height: 1.55;
  color: rgba(255,255,255,0.72);
}

/* Split words */
.title :deep(.w),
.subtitle :deep(.w) {
  display: inline-block;
  margin-right: 0.28em;
  will-change: transform, opacity, filter;
}

/* ============ CTAs ============ */
.cta-row {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 8px;
}

.cta {
  position: relative;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 12px 14px;
  cursor: pointer;
  color: rgba(255,255,255,0.90);
  background: rgba(255,255,255,0.04);
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
  overflow: hidden;
}

.cta.primary {
  background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72));
  color: rgba(8,10,14,0.96);
  border-color: rgba(255,255,255,0.18);
  font-weight: 900;
  letter-spacing: 0.2px;
  box-shadow: 0 18px 60px rgba(0,0,0,0.45);
}

.cta.primary::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 18px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.26), transparent 58%);
  opacity: 0.35;
  pointer-events: none;
}

.cta.primary:hover {
  border-color: rgba(255,255,255,0.26);
}

.cta.secondary:hover {
  background: rgba(255,255,255,0.06);
}

.arrow {
  margin-left: 10px;
  font-weight: 900;
}

.shine {
  position: absolute;
  inset: -55%;
  background: conic-gradient(from 180deg, transparent, rgba(255,255,255,0.26), transparent);
  animation: spin 6.4s linear infinite;
  opacity: 0.50;
}

/* dropdown */
.drop {
  position: relative;
}

.chev {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 8px;
  border-right: 2px solid rgba(255,255,255,0.70);
  border-bottom: 2px solid rgba(255,255,255,0.70);
  transform: rotate(45deg) translateY(-1px);
}

.panel {
  position: fixed;
  width: min(380px, calc(100vw - 24px));
  padding: 10px;
  border-radius: 18px;
  background: rgba(10, 12, 16, 0.94);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 22px 70px rgba(0,0,0,0.62);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  transform-origin: top left;
  z-index: 50;
}

.panel__item {
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  color: rgba(255,255,255,0.90);
  padding: 12px 12px;
  border-radius: 14px;
  cursor: pointer;
}

.panel__item:hover {
  background: rgba(255,255,255,0.06);
}

.muted {
  display: block;
  margin-top: 4px;
  font-size: 11px;
  color: rgba(255,255,255,0.62);
}

.panel__divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 10px 6px;
}

.panel__cta {
  width: 100%;
  border: 0;
  cursor: pointer;
  padding: 12px 12px;
  border-radius: 16px;
  color: rgba(8,10,14,0.96);
  background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.74));
  font-weight: 900;
  position: relative;
  overflow: hidden;
}

.panel__cta .spark {
  position: absolute;
  inset: -45%;
  background: conic-gradient(from 180deg, transparent, rgba(255,255,255,0.30), transparent);
  animation: spin 6.0s linear infinite;
  opacity: 0.50;
}

/* trust */
.trust {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}

.trust__pill {
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.03);
  color: rgba(255,255,255,0.78);
}

.disclaimer {
  margin: 8px auto 0;
  max-width: 820px;
  font-size: 11px;
  line-height: 1.45;
  color: rgba(255,255,255,0.52);
}

/* scroll hint */
.scroll-hint {
  display: grid;
  gap: 8px;
  place-items: center;
  margin-top: 10px;
  opacity: 0.9;
}

.scroll-hint__line {
  width: 2px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255,255,255,0.32);
  position: relative;
  overflow: hidden;
}

.scroll-hint__line::after {
  content: "";
  position: absolute;
  left: 0;
  top: -50%;
  width: 100%;
  height: 60%;
  background: rgba(255,255,255,0.80);
  animation: drip 1.5s ease-in-out infinite;
}

.scroll-hint__text {
  font-size: 11px;
  letter-spacing: 0.35px;
  color: rgba(255,255,255,0.62);
}

/* animations */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes drip {
  0% { transform: translateY(0); opacity: 0; }
  25% { opacity: 1; }
  80% { transform: translateY(190%); opacity: 0.55; }
  100% { opacity: 0; }
}

/* responsive */
@media (max-width: 520px) {
  .hero__container { padding-top: 56px; }
  .logo-wrap { width: min(190px, 62vw); }
  .cta { width: 100%; justify-content: center; }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
  .hero { --bgShift: 0px !important; }
}
</style>
