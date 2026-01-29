<template>
  <footer class="footer" id="footer" ref="root" aria-label="Rodapé do site">
    <!-- BG leve + ponteiro glow -->
    <div class="bg" aria-hidden="true">
      <div class="bg__grid"></div>
      <div class="bg__glow"></div>
      <div class="bg__noise"></div>
      <div class="bg__cursor"></div>
    </div>

    <div class="footer__container">
      <!-- Middle -->
      <div class="mid">
        <!-- Contact -->
        <div class="card" aria-label="Contato">
          <div class="card__title">Contato</div>

          <div class="rows">
            <!-- WhatsApp -->
            <div class="row">
              <span class="k">WhatsApp</span>

              <div class="copyLine">
                <a class="v" :href="whatsLink" target="_blank" rel="noopener noreferrer">
                  {{ phone }}
                </a>

                <button class="copyBtn" type="button" @click="copy(phone, 'whats')">
                  <i class="mdi mdi-content-copy" aria-hidden="true"></i>
                  <span>{{ copied.whats ? "Copiado" : "Copiar" }}</span>
                </button>
              </div>
            </div>

            <!-- Email -->
            <div class="row">
              <span class="k">E-mail</span>

              <div class="copyLine">
                <a class="v" :href="`mailto:${email}`">{{ email }}</a>

                <button class="copyBtn" type="button" @click="copy(email, 'email')">
                  <i class="mdi mdi-content-copy" aria-hidden="true"></i>
                  <span>{{ copied.email ? "Copiado" : "Copiar" }}</span>
                </button>
              </div>
            </div>

            <!-- Endereço -->
            <div class="row">
              <span class="k">Endereço</span>

              <div class="copyLine">
                <a class="v" :href="mapsLink" target="_blank" rel="noopener noreferrer">
                  {{ address }} • {{ city }}
                </a>

                <button class="copyBtn" type="button" @click="copy(address + ' • ' + city, 'address')">
                  <i class="mdi mdi-content-copy" aria-hidden="true"></i>
                  <span>{{ copied.address ? "Copiado" : "Copiar" }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="actions">
            <a class="btn primary" :href="whatsLink" target="_blank" rel="noopener noreferrer">
              Falar no WhatsApp <span class="arrow">→</span>
            </a>
            <a class="btn ghost" @click="goForm">Preencher Formulario.</a>
          </div>
        </div>

        <!-- Social -->
        <div class="card" aria-label="Redes sociais">
          <div class="card__title">Redes</div>
          <p class="muted">Siga para ver novidades e conteúdos úteis.</p>

          <div class="social">
            <a
              class="soc"
              href="#"
              aria-label="Instagram (indisponível)"
              @click.prevent="notifyUnavailable"
            >
              <i class="mdi mdi-instagram" aria-hidden="true"></i>
            </a>

            <a
              class="soc"
              href="#"
              aria-label="YouTube (indisponível)"
              @click.prevent="notifyUnavailable"
            >
              <i class="mdi mdi-youtube" aria-hidden="true"></i>
            </a>

            <a
              class="soc"
              href="#"
              aria-label="LinkedIn (indisponível)"
              @click.prevent="notifyUnavailable"
            >
              <i class="mdi mdi-linkedin" aria-hidden="true"></i>
            </a>
          </div>

          <div class="miniLinks">
            <a class="mini" href="#politica">Política</a>
            <span class="sep" aria-hidden="true">•</span>
            <a class="mini" href="#termos">Termos</a>
          </div>
        </div>
      </div>

      <!-- Bottom -->
      <div class="bottom" aria-label="Direitos e créditos">
        <span class="copy">© {{ year }} {{ brandName }}. Todos os direitos reservados.</span>
        <a class="toTop" href="#inicio">↑ Voltar ao topo</a>
      </div>

      <!-- ✅ Snackbar global (Copiado / Indisponível) -->
      <div class="snack" :class="{ on: snack.on }" role="status" aria-live="polite">
        <i class="mdi" :class="snack.icon" aria-hidden="true"></i>
        <span>{{ snack.text }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const root = ref(null);

const year = new Date().getFullYear();

// ✅ Troque aqui
const brandName = "Kallebe Max";
const phone = "(86) 98163-2626";
const email = "KalebeHeuler@gmail.com";
const address = "Av. Exemplo, 123 • Centro";
const city = "Pedro/PI";

// WhatsApp + Maps
const whatsNumber = "5586981632626"; // DDI+DDD+Número (somente dígitos)
const whatsText = "Olá! Vim pelo site e gostaria de atendimento do MaxSistemas.";
const whatsLink = `https://wa.me/${whatsNumber}?text=${encodeURIComponent(whatsText)}`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + " " + city)}`;

/* ✅ Feedback “Copiado” em TODOS os dados */
const copied = ref({
  whats: false,
  email: false,
  address: false
});
function goForm() {
  router.push("/Formulario");
}
/* ✅ Snack global (serve pra Copiado e Indisponível) */
const snack = ref({
  on: false,
  text: "",
  icon: "mdi-check-circle"
});

let snackTimer = null;
function showSnack(text, icon = "mdi-check-circle") {
  snack.value.text = text;
  snack.value.icon = icon;
  snack.value.on = true;

  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => {
    snack.value.on = false;
  }, 1700);
}

async function copy(text, key) {
  try {
    await navigator.clipboard.writeText(text);

    // marca “Copiado” na linha certa
    copied.value[key] = true;
    setTimeout(() => (copied.value[key] = false), 1600);

    // ✅ toast global também
    showSnack("Copiado", "mdi-check-circle");
  } catch {
    window.prompt("Copie:", text);
  }
}

/* ✅ redes sociais: sempre indisponível temporariamente */
function notifyUnavailable() {
  showSnack("Indisponível temporariamente", "mdi-alert-circle");
}

/* ponteiro glow leve (mesmo padrão do seu template) */
const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const isTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

let cleanupMove = null;

function initPointerGlow() {
  if (!root.value) return;

  root.value.style.setProperty("--px", "50%");
  root.value.style.setProperty("--py", "35%");
  root.value.style.setProperty("--pOpacity", "0");

  if (prefersReduced || isTouch) return;

  const onMove = (e) => {
    const r = root.value.getBoundingClientRect();
    root.value.style.setProperty("--px", `${e.clientX - r.left}px`);
    root.value.style.setProperty("--py", `${e.clientY - r.top}px`);
  };
  const onEnter = () => root.value.style.setProperty("--pOpacity", "1");
  const onLeave = () => root.value.style.setProperty("--pOpacity", "0");

  root.value.addEventListener("mousemove", onMove, { passive: true });
  root.value.addEventListener("mouseenter", onEnter, { passive: true });
  root.value.addEventListener("mouseleave", onLeave, { passive: true });

  cleanupMove = () => {
    root.value?.removeEventListener("mousemove", onMove);
    root.value?.removeEventListener("mouseenter", onEnter);
    root.value?.removeEventListener("mouseleave", onLeave);
  };
}

onMounted(() => initPointerGlow());
onBeforeUnmount(() => {
  cleanupMove?.();
  cleanupMove = null;
  clearTimeout(snackTimer);
});
</script>

<style scoped>
.footer {
  position: relative;
  padding: 54px 0 22px;
  overflow: hidden;
  background: #07080b;
  color: rgba(255, 255, 255, 0.92);
  --px: 50%;
  --py: 35%;
  --pOpacity: 0;
}

/* container centralizado */
.footer__container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 18px;
  display: grid;
  gap: 14px;
}

/* BG */
.bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.bg__grid {
  position: absolute;
  inset: -40%;
  background: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 34px 34px;
  opacity: 0.1;
  transform: rotate(8deg);
}
.bg__glow {
  position: absolute;
  left: 50%;
  top: 20%;
  width: 760px;
  height: 760px;
  transform: translateX(-50%);
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.35;
  background: radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.12), transparent 60%);
}
.bg__noise {
  position: absolute;
  inset: 0;
  opacity: 0.07;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
}
.bg__cursor {
  position: absolute;
  inset: 0;
  opacity: calc(var(--pOpacity) * 0.55);
  transition: opacity 180ms ease;
  background: radial-gradient(320px 320px at var(--px) var(--py), rgba(255, 255, 255, 0.09), transparent 60%),
    radial-gradient(160px 160px at var(--px) var(--py), rgba(255, 255, 255, 0.06), transparent 62%);
}

/* MID: cards centralizados e responsivos */
.mid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
}
.card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 22px;
  padding: 14px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.45);
  display: grid;
  gap: 10px;
  text-align: center;
  justify-items: center;
}
.card__title {
  font-weight: 900;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.92);
}

.rows {
  width: 100%;
  display: grid;
  gap: 10px;
}
.row {
  width: 100%;
  display: grid;
  gap: 4px;
  padding: 10px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.18);
}
.k {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.62);
}
.v {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  line-height: 1.35;
}
.v:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.copyLine {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

.copyBtn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.88);
  border-radius: 14px;
  padding: 9px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 160ms ease, background 160ms ease;
  white-space: nowrap;
  font-size: 12px;
}
.copyBtn:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}
.copyBtn i {
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}
.btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 10px 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.04);
  transition: background 160ms ease, transform 160ms ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}
.btn.primary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
  color: rgba(8, 10, 14, 0.95);
  font-weight: 900;
}
.btn.ghost {
  background: rgba(255, 255, 255, 0.02);
}
.arrow {
  font-weight: 900;
}

.muted {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.45;
}

.social {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.soc {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  transition: transform 160ms ease, background 160ms ease;
}
.soc:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateY(-1px);
}
.soc i {
  font-size: 20px;
  line-height: 1;
}

.miniLinks {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
}
.mini {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
}
.mini:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}
.sep {
  opacity: 0.7;
}

/* bottom central */
.bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.10);
  padding-top: 14px;
  display: grid;
  gap: 8px;
  justify-items: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
}
.toTop {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
}
.toTop:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ✅ Snack global (estilo premium) */
.snack {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 99999;

  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 12px 14px;
  border-radius: 16px;

  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(10, 12, 16, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.55);

  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;

  opacity: 0;
  transform: translateY(10px) scale(0.98);
  pointer-events: none;
  transition: opacity 160ms ease, transform 160ms ease;
}
.snack.on {
  opacity: 1;
  transform: translateY(0px) scale(1);
}
.snack i {
  font-size: 18px;
}

/* focus acessível */
:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.32);
  outline-offset: 3px;
  border-radius: 12px;
}

/* responsive: 2 colunas → 1 coluna */
@media (max-width: 980px) {
  .mid {
    grid-template-columns: 1fr;
  }
  .copyLine {
    grid-template-columns: 1fr;
  }
  .copyBtn {
    justify-content: center;
    width: 100%;
  }

  .snack {
    left: 16px;
    right: 16px;
    justify-content: center;
  }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
  .bg__cursor {
    display: none !important;
  }
}
</style>
