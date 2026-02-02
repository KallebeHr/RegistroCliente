<template>
  <section class="how" id="como-funciona" ref="root">
    <!-- BG leve -->
    <div class="bg" aria-hidden="true">
      <div class="bg__grid"></div>
      <div class="bg__glow bg__glow--a"></div>
      <div class="bg__glow bg__glow--b"></div>
      <div class="bg__noise"></div>
    </div>

    <div class="wrap">
      <!-- Header -->
      <div class="kicker" ref="kicker">
        <span class="kicker__dot" aria-hidden="true"></span>
        Processo simples • Sem enrolação • Modelo rápido
      </div>

      <header class="head">
        <h2 class="title" ref="title">
          Como funciona na prática —
          <span class="accent">do seu logo</span> até o site no ar.
        </h2>

        <p class="subtitle" ref="subtitle">
          Você não precisa adivinhar o que mandar. Eu te guio, monto um exemplo com sua identidade
          e a gente ajusta rápido até ficar com cara de escritório de verdade.
        </p>
      </header>

      <!-- Steps -->
      <div class="grid" ref="grid">
        <article class="step" v-for="(s, i) in steps" :key="s.t" :data-i="i">
          <div class="step__top">
            <div class="num">
              <span class="num__glow" aria-hidden="true"></span>
              {{ String(i + 1).padStart(2, "0") }}
            </div>

            <div class="tag">
              <i :class="s.icon"></i>
              {{ s.tag }}
            </div>
          </div>

          <h3 class="step__title">{{ s.t }}</h3>
          <p class="step__desc">{{ s.d }}</p>

          <div class="step__chips">
            <span class="chip" v-for="c in s.chips" :key="c">
              <span class="chip__dot" aria-hidden="true"></span>
              {{ c }}
            </span>
          </div>

          <div class="step__action">
            <button
              v-if="i === 0"
              class="btn ghost"
              type="button"
               @click="goForm"
            >
              Quero enviar minhas infos <span aria-hidden="true">→</span>
            </button>

            <button
              v-else-if="i === 1"
              class="btn ghost"
              type="button"
              @click="openTip('prazo')"
            >
              O que influencia o prazo? <span aria-hidden="true">→</span>
            </button>

            <button
              v-else-if="i === 2"
              class="btn ghost"
              type="button"
              @click="openTip('ajustes')"
            >
              Quais ajustes são comuns? <span aria-hidden="true">→</span>
            </button>

            <button
              v-else
              class="btn ghost"
              type="button"
              @click="openTip('publicacao')"
            >
              Domínio ou subdomínio? <span aria-hidden="true">→</span>
            </button>
          </div>
        </article>
      </div>

      <!-- Bottom CTA -->
      <div class="cta" ref="cta">
        <div class="cta__left">
          <div class="cta__title">Quer um exemplo com seu nome, cores e logo?</div>
          <div class="cta__sub">
            Você vê como ficaria antes de decidir. Sem compromisso — só demonstração.
          </div>
        </div>

        <div class="cta__right">
          <button class="btn primary" ref="ctaPrimary" type="button" @click="goForm">
            Solicitar Exemplo
            <span class="arrow" aria-hidden="true">→</span>
            <span class="shine" aria-hidden="true"></span>
          </button>

<button
  class="btn secondary"
  type="button"
  @click="goWhats"
>
  Falar no WhatsApp
  <span class="chev" aria-hidden="true"></span>
</button>
        </div>

        <div class="cta__meta">
          <span class="meta">
            <i class="mdi mdi-timer-sand"></i> 24–72h (média)
          </span>
          <span class="meta">
            <i class="mdi mdi-lock-outline"></i> Boas práticas + LGPD
          </span>
          <span class="meta">
            <i class="mdi mdi-wheelchair-accessibility"></i> Inclusão digital
          </span>
          <span class="meta">
            <i class="mdi mdi-speedometer"></i> Performance
          </span>
        </div>
      </div>
    </div>

    <!-- Tip modal (leve) -->
    <teleport to="body">
      <div v-if="tipOpen" class="modal" role="dialog" aria-modal="true" aria-label="Dica rápida" @keydown.esc="closeTip">
        <div class="modal__overlay" @click="closeTip"></div>

        <div class="modal__panel" ref="tipPanel" tabindex="-1">
          <div class="modal__top">
            <div class="modal__tag">
              <span class="dot" aria-hidden="true"></span>
              Dica rápida • Processo
            </div>

            <button class="modal__close" type="button" @click="closeTip" aria-label="Fechar">
              <i class="mdi mdi-close"></i>
            </button>
          </div>

          <h3 class="modal__title">{{ tipTitle }}</h3>
          <p class="modal__text">{{ tipText }}</p>

          <div class="modal__cta">
            <button class="btn primary" type="button" @click="goForm">
              Solicitar Exemplo
              <span class="arrow" aria-hidden="true">→</span>
              <span class="shine" aria-hidden="true"></span>
            </button>

            <button class="btn secondary" type="button" @click="closeTip">
              Entendi
              <span class="chev" aria-hidden="true"></span>
            </button>
          </div>

          <p class="modal__fine">
            *Conteúdo informativo. Sem promessas de resultado.
          </p>
        </div>
      </div>
    </teleport>
  </section>
</template>
<script setup>
import { onBeforeUnmount, onMounted, ref, computed, nextTick, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { animate } from "@motionone/dom";

const router = useRouter();

const root = ref(null);
const kicker = ref(null);
const title = ref(null);
const subtitle = ref(null);
const grid = ref(null);
const cta = ref(null);
const ctaPrimary = ref(null);

const tipOpen = ref(false);
const tipKey = ref("prazo");
const tipPanel = ref(null);

const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const steps = [
  {
    tag: "Identidade",
    icon: "mdi mdi-palette-outline",
    t: "Você manda logo, cores e Instagram",
    d: "Me envie o Instagram do escritório (ou referências), sua logo e as cores que você gosta. Se não tiver cores, eu sugiro uma paleta com cara de advocacia.",
    chips: ["Instagram", "Logo", "Cores", "Referências"]
  },
  {
    tag: "Exemplo",
    icon: "mdi mdi-rocket-launch-outline",
    t: "Eu crio o exemplo em 24–72h",
    d: "Eu monto uma versão demonstrativa com estrutura institucional, CTA e inclusão digital. Você vê no navegador como vai ficar antes de decidir qualquer coisa.",
    chips: ["Estrutura", "CTA", "Acessibilidade", "Responsivo"]
  },
  {
    tag: "Refino",
    icon: "mdi mdi-tune-vertical-variant",
    t: "Ajustes rápidos",
    d: "A gente ajusta textos, seções, cores e detalhes visuais até ficar “cara de escritório”. Sem enrolação: ajustes curtos e objetivos.",
    chips: ["Textos", "Seções", "Visual", "Clareza"]
  },
  {
    tag: "Publicação",
    icon: "mdi mdi-cloud-upload-outline",
    t: "Publicação (domínio ou subdomínio)",
    d: "Publico no seu domínio (se já tiver) ou em subdomínio. Se quiser, depois migramos pro domínio definitivo sem perder o trabalho.",
    chips: ["Domínio", "Subdomínio", "Deploy", "Migração"]
  }
];

function goForm() {
  router.push("/Formulario");
}

function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ====== Tips (conteúdo leve e direto) ====== */
const tipsMap = {
  prazo: {
    t: "O que influencia o prazo (24–72h)?",
    d: "Normalmente depende de 3 coisas: (1) se você já tem logo e referências, (2) se os textos estão prontos ou precisam de ajuste, e (3) quantidade de seções/páginas. O exemplo sai rápido; o refinamento depende do retorno."
  },
  ajustes: {
    t: "Quais ajustes são mais comuns?",
    d: "Texto mais institucional, destaque de áreas de atuação, reorganizar seções, reforçar CTA, melhorar contraste/legibilidade e alinhar identidade visual com o padrão do escritório."
  },
  publicacao: {
    t: "Domínio ou subdomínio: qual é melhor?",
    d: "Se você já tem domínio, ótimo: publicamos nele. Se não tiver, começamos com subdomínio (rápido e sem travar o projeto). Depois, quando comprar domínio, migramos sem dor."
  }
};

const tipTitle = computed(() => tipsMap[tipKey.value]?.t ?? "");
const tipText = computed(() => tipsMap[tipKey.value]?.d ?? "");

function openTip(key) {
  tipKey.value = key;
  tipOpen.value = true;

  nextTick(() => {
    tipPanel.value?.focus?.();
    if (!prefersReduced && tipPanel.value) {
      animate(
        tipPanel.value,
        { opacity: [0, 1], transform: ["translateY(10px) scale(0.99)", "translateY(0px) scale(1)"] },
        { duration: 0.16 }
      );
    }
  });
}
function goWhats() {
  const msg = encodeURIComponent("Olá, vim através do site");
  const phone = "5586981426485"; 
  window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
}

function closeTip() {
  tipOpen.value = false;
}

/* ====== body lock ====== */
function lockBody(locked) {
  const cls = "body-lock";
  document.documentElement.classList.toggle(cls, locked);
  document.body.classList.toggle(cls, locked);
}

watchEffect(() => lockBody(tipOpen.value));

/* ====== reveal leve (IntersectionObserver) ====== */
let io;
function setupReveal() {
  if (prefersReduced) return;

  const stepEls = Array.from(root.value?.querySelectorAll(".step") ?? []);
  const targets = [kicker.value, title.value, subtitle.value, ...stepEls, cta.value].filter(Boolean);

  targets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.filter = "blur(6px)";
    el.style.willChange = "transform, opacity, filter";
  });

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (!ent.isIntersecting) return;
        animate(
          ent.target,
          { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0px)"], filter: ["blur(6px)", "blur(0px)"] },
          { duration: 0.35 }
        );
        io.unobserve(ent.target);
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => io.observe(el));
}

/* ====== magnetic leve no CTA principal (desktop) ====== */
const isTouch =
  typeof window !== "undefined" &&
  (matchMedia?.("(pointer: coarse)")?.matches || "ontouchstart" in window);

let magCleanup = () => {};
function setupMagnetic(el, strength = 18) {
  if (!el || prefersReduced || isTouch) return () => {};

  let raf = 0;
  let tx = 0;
  let ty = 0;

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    tx = x / strength;
    ty = y / strength;

    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  };

  const onLeave = () => {
    cancelAnimationFrame(raf);
    el.style.transform = `translate3d(0,0,0)`;
  };

  el.addEventListener("mousemove", onMove, { passive: true });
  el.addEventListener("mouseleave", onLeave);

  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener("mousemove", onMove);
    el.removeEventListener("mouseleave", onLeave);
  };
}

function onKeydownGlobal(e) {
  if (e.key === "Escape" && tipOpen.value) closeTip();
}

onMounted(() => {
  setupReveal();
  magCleanup = setupMagnetic(ctaPrimary.value, 16);
  document.addEventListener("keydown", onKeydownGlobal);
});

onBeforeUnmount(() => {
  io?.disconnect?.();
  magCleanup?.();
  document.removeEventListener("keydown", onKeydownGlobal);
});
</script>
<style scoped>
/* ============ SECTION BASE ============ */
.how{
  position:relative;
  padding:86px 0 78px;
  overflow:hidden;
  background:radial-gradient(1200px 700px at 50% 12%, #0b0f18, #07080b 55%, #06070a);
  color:rgba(255,255,255,.92);
}

.wrap{
  width:100%;
  max-width:1180px;
  margin:0 auto;
  padding:0 18px;
  position:relative;
  z-index:2;
}

/* ============ BG (leve) ============ */
.bg{ position:absolute; inset:0; pointer-events:none; }
.bg__grid{
  position:absolute;
  inset:-35%;
  background:
    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size:40px 40px;
  opacity:.12;
  transform:rotate(10deg);
  mask-image:radial-gradient(circle at 50% 35%, #000, rgba(0,0,0,.12) 58%, transparent 75%);
}
.bg__glow{
  position:absolute;
  border-radius:999px;
  filter:blur(52px);
  opacity:.42;
}
.bg__glow--a{
  width:520px; height:520px;
  left:50%; top:6%;
  transform:translateX(-70%);
  background:radial-gradient(circle at 30% 35%, rgba(255,255,255,.13), transparent 62%);
}
.bg__glow--b{
  width:640px; height:640px;
  left:50%; top:46%;
  transform:translateX(-25%);
  background:radial-gradient(circle at 55% 45%, rgba(255,255,255,.10), transparent 64%);
}
.bg__noise{
  position:absolute; inset:0;
  opacity:.05;
  mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
}

/* ============ HEADER ============ */
.kicker{
  margin:0 auto 18px;
  display:inline-flex;
  gap:10px;
  align-items:center;
  padding:9px 12px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.035);
  color:rgba(255,255,255,.82);
  font-size:12px;
  letter-spacing:.35px;
}
.kicker__dot{
  width:8px;height:8px;border-radius:999px;
  background:rgba(255,255,255,.78);
  box-shadow:0 0 12px rgba(255,255,255,.16);
}
.head{
  text-align:center;
  max-width:980px;
  margin:0 auto 26px;
}
.title{
  margin:0;
  font-size:clamp(26px, 4vw, 52px);
  line-height:1.06;
  letter-spacing:-.6px;
}
.accent{
  background:linear-gradient(90deg, rgba(255,255,255,.98), rgba(255,255,255,.62));
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  text-shadow:0 10px 28px rgba(0,0,0,.5);
}
.subtitle{
  margin:14px auto 0;
  max-width:780px;
  font-size:clamp(14px, 1.35vw, 18px);
  line-height:1.58;
  color:rgba(255,255,255,.72);
}

/* ============ STEPS GRID ============ */
.grid{
  display:grid;
  grid-template-columns:repeat(12, 1fr);
  gap:14px;
  align-items:stretch;
}

.step{
  grid-column:span 6;
  position:relative;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.04);
  box-shadow:0 18px 64px rgba(0,0,0,.50);
  overflow:hidden;
  padding:16px;
}
.step::before{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius:24px;
  background:radial-gradient(circle at 30% 30%, rgba(255,255,255,.10), transparent 58%);
  opacity:.32;
  pointer-events:none;
}

.step__top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
}

.num{
  position:relative;
  font-weight:950;
  letter-spacing:.6px;
  font-size:12px;
  padding:8px 10px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(0,0,0,.22);
  color:rgba(255,255,255,.88);
  overflow:hidden;
}
.num__glow{
  position:absolute;
  inset:-55%;
  background:conic-gradient(from 180deg, transparent, rgba(255,255,255,.18), transparent);
  animation:spin 7s linear infinite;
  opacity:.5;
}

.tag{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.035);
  color:rgba(255,255,255,.84);
  font-size:12px;
}
.tag i{ opacity:.92; }

.step__title{
  margin:14px 0 6px;
  font-size:16px;
  letter-spacing:-.2px;
  color:rgba(255,255,255,.92);
}
.step__desc{
  margin:0;
  font-size:13px;
  line-height:1.6;
  color:rgba(255,255,255,.74);
}

.step__chips{
  margin-top:12px;
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.chip{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.78);
  font-size:12px;
}
.chip__dot{
  width:7px;height:7px;border-radius:999px;
  background:rgba(255,255,255,.72);
  box-shadow:0 0 10px rgba(255,255,255,.14);
}

.step__action{
  margin-top:12px;
  display:flex;
  justify-content:flex-start;
}

/* ============ CTA STRIP ============ */
.cta{
  margin-top:14px;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.03);
  padding:14px;
  box-shadow:0 18px 64px rgba(0,0,0,.45);
  display:grid;
  gap:12px;
}

.cta__title{
  font-size:14px;
  font-weight:950;
  color:rgba(255,255,255,.92);
}
.cta__sub{
  margin-top:2px;
  font-size:12px;
  color:rgba(255,255,255,.70);
}

.cta__right{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
}

.cta__meta{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
}
.meta{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.78);
  font-size:12px;
}

/* ============ BUTTONS ============ */
.btn{
  position:relative;
  border:1px solid rgba(255,255,255,.12);
  border-radius:16px;
  padding:12px 14px;
  cursor:pointer;
  color:rgba(255,255,255,.90);
  background:rgba(255,255,255,.04);
  transition:background 160ms ease, border-color 160ms ease, transform 160ms ease;
  overflow:hidden;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  will-change:transform;
}
.btn.primary{
  background:linear-gradient(135deg, rgba(255,255,255,.92), rgba(255,255,255,.72));
  color:rgba(8,10,14,.96);
  border-color:rgba(255,255,255,.18);
  font-weight:950;
  letter-spacing:.2px;
  box-shadow:0 14px 42px rgba(0,0,0,.45);
}
.btn.primary::before{
  content:"";
  position:absolute;
  inset:-2px;
  border-radius:18px;
  background:radial-gradient(circle at 30% 30%, rgba(255,255,255,.22), transparent 58%);
  opacity:.28;
  pointer-events:none;
}
.btn.secondary:hover{ background:rgba(255,255,255,.06); }
.btn.ghost{
  padding:10px 12px;
  border-radius:14px;
  background:transparent;
  text-decoration:underline;
  text-underline-offset:4px;
  opacity:.92;
}
.btn.ghost:hover{ opacity:1; }

.arrow{ font-weight:950; }
.shine{
  position:absolute;
  inset:-55%;
  background:conic-gradient(from 180deg, transparent, rgba(255,255,255,.24), transparent);
  animation:spin 6.4s linear infinite;
  opacity:.45;
}
.chev{
  display:inline-block;
  width:10px; height:10px;
  border-right:2px solid rgba(255,255,255,.70);
  border-bottom:2px solid rgba(255,255,255,.70);
  transform:rotate(45deg) translateY(-1px);
}

/* ============ MODAL (leve) ============ */
.modal{
  position:fixed;
  inset:0;
  z-index:999;
  display:grid;
  place-items:center;
  padding:18px;
}
.modal__overlay{
  position:absolute;
  inset:0;
  background:rgba(0,0,0,.62);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.modal__panel{
  position:relative;
  width:min(780px, calc(100vw - 24px));
  max-height:min(78vh, 720px);
  overflow:auto;
  border-radius:22px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(10,12,16,.94);
  box-shadow:0 18px 70px rgba(0,0,0,.70);
  padding:14px;
  z-index:2;
  outline:none;
}
.modal__top{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
}
.modal__tag{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:8px 10px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.82);
  font-size:12px;
}
.modal__tag .dot{
  width:8px;height:8px;border-radius:999px;
  background:rgba(255,255,255,.8);
  box-shadow:0 0 12px rgba(255,255,255,.16);
}
.modal__close{
  width:42px;height:42px;border-radius:14px;
  border:1px solid rgba(255,255,255,.10);
  background:rgba(255,255,255,.03);
  color:rgba(255,255,255,.92);
  cursor:pointer;
}
.modal__title{
  margin:12px 0 6px;
  font-size:18px;
  letter-spacing:-.2px;
}
.modal__text{
  margin:0 0 12px;
  color:rgba(255,255,255,.74);
  font-size:13px;
  line-height:1.6;
}
.modal__cta{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-top:8px;
}
.modal__fine{
  margin:10px 0 0;
  font-size:11px;
  color:rgba(255,255,255,.55);
}

/* body lock */
:global(html.body-lock),
:global(body.body-lock){ overflow:hidden; }

/* anim */
@keyframes spin { to { transform: rotate(360deg); } }

/* responsive */
@media (max-width: 980px){
  .step{ grid-column: span 12; }
}
@media (max-width: 520px){
  .how{ padding:72px 0 62px; }
  .btn{ width:100%; }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce){
  *{ animation:none !important; transition:none !important; }
}
</style>
