<template>
  <transition name="pl-fade">
    <div v-if="visible" class="pl-law" role="status" aria-live="polite" aria-label="Carregando">
      <!-- fundo suave -->
      <div class="bg" aria-hidden="true">
        <div class="bg-gradient"></div>
        <div class="bg-lines"></div>
      </div>

      <!-- ícones flutuando -->
      <div class="floaters" aria-hidden="true">
        <i class="mdi mdi-scale-balance f f1"></i>
        <i class="mdi mdi-gavel f f2"></i>
        <i class="mdi mdi-book-open-variant f f3"></i>
        <i class="mdi mdi-shield-account f f4"></i>
        <i class="mdi mdi-briefcase-outline f f5"></i>
        <i class="mdi mdi-bank-outline f f6"></i>
      </div>

      <!-- conteúdo central -->
      <div class="card">
        <div class="logo-shell" aria-hidden="true">
          <div class="halo"></div>
          <div class="ring"></div>

          <img class="logo" src="/Logo/LogoPNG.png" alt="Logo do escritório" />
        </div>

        <div class="meta">
          <p class="title">Carregando seu ambiente</p>
          <p class="subtitle">
            Preparando acesso, conteúdo e elementos de acessibilidade.
          </p>
        </div>

        <div class="progress" aria-hidden="true">
          <span class="bar" :style="{ width: progress + '%' }"></span>
        </div>

        <div class="foot">
          <span class="chip">
            <span class="dot"></span>
            {{ statusLabel }}
          </span>

          <span class="pct">{{ progress }}%</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "PreLoaderLawMinimal",
  props: {
    minDuration: { type: Number, default: 800 },  // evita “piscar”
    hardTimeout: { type: Number, default: 6500 }, // não prende caso algo dê ruim
  },
  data() {
    return {
      visible: true,
      progress: 0,
      phase: 0,
      _t0: 0,
      _raf: null,
      _hard: null,
      _phaseTimer: null,
    };
  },
  computed: {
    statusLabel() {
      return ["Verificando", "Organizando", "Finalizando", "Pronto"][this.phase];
    },
  },
  mounted() {
    // trava scroll enquanto carrega
    document.documentElement.classList.add("pl-lock");
    document.body.classList.add("pl-lock");

    this._t0 = performance.now();

    // progresso fake bem “real”
    const tick = () => {
      const p = this.progress;
      let inc = 0;

      if (p < 50) inc = 1.25;
      else if (p < 80) inc = 0.75;
      else if (p < 92) inc = 0.35;
      else if (p < 97) inc = 0.18;
      else inc = 0.06;

      // micro variação elegante
      inc += (Math.sin(performance.now() / 360) + 1) * 0.03;

      this.progress = Math.min(99, Math.round(p + inc));
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);

    // muda status de forma sutil
    this._phaseTimer = setInterval(() => {
      this.phase = Math.min(3, this.phase + 1);
    }, 900);

    // encerra no load
    window.addEventListener("load", this.finish, { once: true });

    // fallback hard
    this._hard = setTimeout(this.finish, this.hardTimeout);
  },
  beforeUnmount() {
    window.removeEventListener("load", this.finish);
    cancelAnimationFrame(this._raf);
    clearTimeout(this._hard);
    clearInterval(this._phaseTimer);
  },
  methods: {
    finish() {
      this.progress = 100;

      const elapsed = performance.now() - this._t0;
      const remaining = Math.max(0, this.minDuration - elapsed);

      setTimeout(() => {
        this.visible = false;

        document.documentElement.classList.remove("pl-lock");
        document.body.classList.remove("pl-lock");

        this.$emit("done");
      }, remaining);
    },
  },
};
</script>
<style scoped>
/* trava scroll */
:global(html.pl-lock),
:global(body.pl-lock) {
  overflow: hidden !important;
}

.pl-law {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  place-items: center;
  background: #0b1020;
  color: rgba(255, 255, 255, 0.92);
  isolation: isolate;
}

/* fundo minimal com textura */
.bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(900px 500px at 50% 40%, rgba(98, 160, 255, 0.12), transparent 60%),
    radial-gradient(1000px 800px at 20% 70%, rgba(150, 110, 255, 0.10), transparent 60%),
    linear-gradient(180deg, #0b1020 0%, #070a14 100%);
}

.bg-lines {
  position: absolute;
  inset: -40%;
  background-image:
    linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  transform: rotate(12deg);
  opacity: 0.06;
}

/* card central premium */
.card {
  width: min(520px, 92vw);
  border-radius: 22px;
  padding: 26px 22px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 70px rgba(0,0,0,0.55);
  backdrop-filter: blur(10px);
  display: grid;
  justify-items: center;
  gap: 14px;
}

/* logo + halo */
.logo-shell {
  width: 118px;
  height: 118px;
  position: relative;
  display: grid;
  place-items: center;
}

.halo {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 50%, rgba(98, 160, 255, 0.18), transparent 70%);
  filter: blur(1px);
}

.ring {
  position: absolute;
  inset: -10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  border-top-color: rgba(98,160,255,0.55);
  border-right-color: rgba(150,110,255,0.35);
  animation: ring 2.2s linear infinite;
  opacity: 0.85;
}

@keyframes ring {
  to { transform: rotate(360deg); }
}

.logo {
  width: 92px;
  height: 92px;
  object-fit: contain;
  animation: logoSpin 4.6s linear infinite;
  filter:
    drop-shadow(0 10px 16px rgba(0,0,0,0.55))
    drop-shadow(0 0 18px rgba(98,160,255,0.18));
}

@keyframes logoSpin {
  to { transform: rotate(360deg); }
}

/* textos */
.meta {
  text-align: center;
  display: grid;
  gap: 6px;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.35;
  color: rgba(255,255,255,0.70);
}

/* barra fina */
.progress {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
}

.bar {
  display: block;
  height: 100%;
  width: 0%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(98,160,255,0.95), rgba(150,110,255,0.90));
  box-shadow: 0 0 18px rgba(98,160,255,0.18);
  transition: width 260ms ease;
}

/* rodapé */
.foot {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pct {
  font-size: 12px;
  font-weight: 800;
  color: rgba(255,255,255,0.85);
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.20);
  font-size: 12px;
  font-weight: 800;
  color: rgba(98,160,255,0.92);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(98,160,255,0.92);
  box-shadow: 0 0 14px rgba(98,160,255,0.18);
  animation: dot 1.1s ease-in-out infinite;
}

@keyframes dot {
  50% { transform: scale(1.35); opacity: 0.7; }
}

/* ícones flutuando (bem discretos) */
.floaters {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.22;
  filter: blur(0.2px);
}

.f {
  position: absolute;
  font-size: 26px;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 0 20px rgba(98,160,255,0.10);
  animation: float 5.6s ease-in-out infinite;
}

.f1 { top: 14%; left: 12%; animation-delay: -0.3s; font-size: 28px; }
.f2 { top: 22%; right: 14%; animation-delay: -1.2s; }
.f3 { bottom: 18%; left: 16%; animation-delay: -2.1s; font-size: 24px; }
.f4 { bottom: 22%; right: 18%; animation-delay: -0.8s; font-size: 26px; }
.f5 { top: 58%; left: 8%; animation-delay: -1.8s; font-size: 22px; }
.f6 { top: 62%; right: 9%; animation-delay: -2.6s; font-size: 22px; opacity: 0.18; }

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.18; }
  50% { transform: translateY(-14px) translateX(8px); opacity: 0.32; }
}

/* transição */
.pl-fade-enter-active,
.pl-fade-leave-active {
  transition: opacity 380ms ease, transform 380ms ease;
}
.pl-fade-enter-from,
.pl-fade-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.99);
}

/* mobile */
@media (max-width: 420px) {
  .card {
    padding: 22px 16px 18px;
    border-radius: 18px;
  }
  .logo-shell {
    width: 108px;
    height: 108px;
  }
  .logo {
    width: 86px;
    height: 86px;
  }
  .f { font-size: 22px; }
}
</style>
