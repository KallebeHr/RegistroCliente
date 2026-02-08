<template>
  <div class="wa-wrap">
    <!-- FAB -->
    <v-tooltip location="left" text="Falar no WhatsApp">
      <template #activator="{ props }">
        <button
          class="wa-fab"
          v-bind="props"
          type="button"
          @click="open"
          aria-label="Abrir contato no WhatsApp"
        >
          <span class="wa-fab__pulse" aria-hidden="true"></span>
          <i class="mdi mdi-whatsapp wa-fab__icon" aria-hidden="true"></i>
        </button>
      </template>
    </v-tooltip>

    <!-- Dialog -->
    <v-dialog
      v-model="isOpen"
      max-width="520"
      persistent
      scrollable
      transition="dialog-bottom-transition"
      @keydown.esc="close"
    >
      <v-card class="wa-card" rounded="xl">
        <!-- Header -->
        <div class="wa-head">
          <div class="wa-head__left">
            <div class="wa-kicker">
              <i class="mdi mdi-whatsapp wa-kicker__icon" aria-hidden="true"></i>
              Atendimento rápido • WhatsApp
            </div>

            <h3 class="wa-title">Vamos conversar</h3>
            <p class="wa-sub">
              Me diga seu nome e uma mensagem. Eu já abro o WhatsApp com tudo pronto.
            </p>
          </div>

          <button class="wa-close" type="button" @click="close" aria-label="Fechar">
            <i class="mdi mdi-close" aria-hidden="true"></i>
          </button>
        </div>

        <v-divider />

        <!-- Content -->
        <v-card-text class="wa-body">
          <v-form ref="formRef" @submit.prevent="send" class="wa-form">
            <div class="wa-grid">
              <v-text-field
                v-model.trim="form.name"
                label="Seu nome"
                variant="outlined"
                density="comfortable"
                :rules="rules.name"
                autocomplete="name"
                prepend-inner-icon="mdi-account"
                clearable
                @blur="persistDraft"
              />

              <v-text-field
                v-model="form.phone"
                label="Seu WhatsApp (opcional)"
                hint="Ex: (85) 9xxxx-xxxx"
                persistent-hint
                variant="outlined"
                density="comfortable"
                :rules="rules.phone"
                autocomplete="tel"
                prepend-inner-icon="mdi-phone"
                clearable
                inputmode="tel"
                @input="onPhoneInput"
                @blur="persistDraft"
              />
            </div>

            <v-textarea
              v-model="form.message"
              label="Mensagem"
              variant="outlined"
              density="comfortable"
              auto-grow
              rows="4"
              :counter="MAX"
              :rules="rules.message"
              prepend-inner-icon="mdi-message-text"
              @blur="persistDraft"
            />

            <!-- Quick chips -->
            <div class="wa-chips">
              <div class="wa-chips__label">Sugestões rápidas:</div>
              <div class="wa-chips__list">
                <button class="wa-chip" type="button" @click="appendMsg('Quero um site acessível (leitor de tela + Libras).')">
                  Site acessível
                </button>
                <button class="wa-chip" type="button" @click="appendMsg('Pode me mostrar um exemplo rápido com meu nome e cores?')">
                  Ver exemplo
                </button>
                <button class="wa-chip" type="button" @click="appendMsg('Qual o valor e prazo pra entregar?')">
                  Valor e prazo
                </button>
                <button class="wa-chip" type="button" @click="appendMsg('Quero melhorar meu Instagram com carrosséis padronizados.')">
                  Carrosséis
                </button>
              </div>
            </div>

            <!-- Preview -->
            <div class="wa-preview" aria-live="polite">
              <div class="wa-preview__top">
                <span class="wa-preview__title">Prévia</span>
                <span class="wa-preview__count">
                  {{ remaining }} restantes
                </span>
              </div>

              <div class="wa-preview__bubble">
                <div class="wa-preview__line"><strong>Nome:</strong> {{ previewName }}</div>
                <div class="wa-preview__line" v-if="cleanPhone"><strong>Contato:</strong> {{ prettyPhone }}</div>
                <div class="wa-preview__msg">{{ previewMsg }}</div>
              </div>

              <div class="wa-preview__tip">
                <i class="mdi mdi-lock-outline" aria-hidden="true"></i>
                Você não envia nada por aqui — apenas abre seu WhatsApp com a mensagem pronta.
              </div>
            </div>

            <v-divider class="my-4" />

            <!-- Actions -->
            <div class="wa-actions">
              <v-btn
                variant="text"
                class="wa-btn"
                @click="reset"
              >
                Limpar
              </v-btn>

              <div class="wa-actions__right">
                <v-btn
                  variant="outlined"
                  class="wa-btn"
                  @click="close"
                >
                  Fechar
                </v-btn>

                <v-btn
                  type="submit"
                  color="green"
                  class="wa-btn wa-btn--primary"
                  :loading="sending"
                  :disabled="!canSend"
                >
                  Abrir WhatsApp
                  <i class="mdi mdi-arrow-top-right wa-btn__icon" aria-hidden="true"></i>
                </v-btn>
              </div>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, computed, watch, nextTick } from "vue";

const isOpen = ref(false);
const sending = ref(false);
const formRef = ref(null);

const MAX = 700; // menor que 1000 pra ficar mais “WhatsApp-friendly”
const STORAGE_KEY = "wa_draft_v1";

// ✅ COLOQUE AQUI O SEU NÚMERO (com DDI+DDD, só números)
const YOUR_PHONE = "5586981426485"; 

const form = ref({
  name: "",
  phone: "",
  message: "",
});

const rules = {
  name: [
    (v) => !!v || "Digite seu nome",
    (v) => (v?.trim()?.length >= 2) || "Nome muito curto",
  ],
  phone: [
    (v) => !v || isValidBRPhone(v) || "Telefone inválido",
  ],
  message: [
    (v) => !!v || "Digite uma mensagem",
    (v) => (v?.trim()?.length >= 8) || "Mensagem muito curta",
    (v) => (v?.length <= MAX) || `Máximo de ${MAX} caracteres`,
  ],
};

function open() {
  isOpen.value = true;
  nextTick(() => {
    // tenta focar no primeiro input via DOM (simples e efetivo)
    const el = document.querySelector(".wa-form input");
    el?.focus?.();
  });
}

function close() {
  isOpen.value = false;
}

function reset() {
  form.value = { name: "", phone: "", message: "" };
  localStorage.removeItem(STORAGE_KEY);
}

function persistDraft() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(form.value));
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    form.value = { ...form.value, ...data };
  } catch {
    // ignore
  }
}

// máscara simples (sem lib)
function onPhoneInput(e) {
  const v = String(e?.target?.value ?? form.value.phone ?? "");
  const digits = v.replace(/\D/g, "").slice(0, 11); // BR: 10/11
  form.value.phone = formatBRPhone(digits);
}

function isValidBRPhone(v) {
  const digits = String(v).replace(/\D/g, "");
  // aceita 10 ou 11 dígitos (DDD + número)
  return digits.length === 10 || digits.length === 11;
}

function formatBRPhone(d) {
  // 11 -> (DD) 9XXXX-XXXX
  // 10 -> (DD) XXXX-XXXX
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length === 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function appendMsg(text) {
  const cur = form.value.message?.trim() ?? "";
  const next = cur ? `${cur}\n${text}` : text;
  form.value.message = next.slice(0, MAX);
  persistDraft();
}

const cleanPhone = computed(() => form.value.phone.replace(/\D/g, ""));
const prettyPhone = computed(() => form.value.phone);
const previewName = computed(() => (form.value.name || "—").trim());
const previewMsg = computed(() => (form.value.message || "—").trim());

const remaining = computed(() => Math.max(0, MAX - (form.value.message?.length ?? 0)));

const canSend = computed(() =>
  form.value.name.trim().length >= 2 &&
  form.value.message.trim().length >= 8 &&
  form.value.message.length <= MAX &&
  (!form.value.phone || isValidBRPhone(form.value.phone)) &&
  !!YOUR_PHONE
);

async function send() {
  const ok = await formRef.value?.validate?.();
  if (ok?.valid === false) return;

  sending.value = true;

  try {
    // ✅ Mensagem que vai para VOCÊ
    const msg =
`Olá! Vim através do site.
Nome: ${form.value.name.trim()}
${cleanPhone.value ? `Meu WhatsApp: ${prettyPhone.value}\n` : ""}Mensagem: ${form.value.message.trim()}`.trim();

    const url = `https://wa.me/${YOUR_PHONE}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    persistDraft();
    close();
  } finally {
    sending.value = false;
  }
}

// auto-save leve
watch(
  () => form.value,
  () => persistDraft(),
  { deep: true }
);

loadDraft();
</script>
<style scoped>
.wa-wrap { position: relative; }

/* FAB */
.wa-fab{
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 62px;
  height: 62px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  z-index: 10000;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.18), transparent 35%),
              linear-gradient(135deg, #22c55e, #16a34a);
  box-shadow: 0 16px 40px rgba(0,0,0,.28);
  transition: transform .15s ease, filter .15s ease;
}
.wa-fab:hover{ transform: translateY(-2px); filter: brightness(1.04); }
.wa-fab:active{ transform: translateY(0px) scale(.98); }

.wa-fab__icon{
  color: #fff;
  font-size: 30px;
  line-height: 1;
  text-shadow: 0 6px 20px rgba(0,0,0,.25);
}
.wa-fab__pulse{
  position:absolute;
  width: 62px;
  height: 62px;
  border-radius: 999px;
  animation: pulse 1.8s ease-in-out infinite;
  background: rgba(34,197,94,.22);
}
@keyframes pulse{
  0%{ transform: scale(1); opacity: .9; }
  70%{ transform: scale(1.55); opacity: 0; }
  100%{ transform: scale(1.55); opacity: 0; }
}

/* Card */
.wa-card{
  overflow: hidden;
  background:
    radial-gradient(1000px 420px at 0% 0%, rgba(34,197,94,.14), transparent 55%),
    radial-gradient(800px 420px at 100% 0%, rgba(16,185,129,.12), transparent 50%),
    linear-gradient(180deg, #0b1220, #070b14);
  color: #e9eefc;
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 18px 60px rgba(0,0,0,.55);
}

/* Header */
.wa-head{
  padding: 18px 18px 12px;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 14px;
}
.wa-kicker{
  display:flex;
  align-items:center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: .2px;
  opacity: .9;
}
.wa-kicker__icon{ font-size: 16px; color: #34d399; }
.wa-title{
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: .2px;
}
.wa-sub{
  margin: 6px 0 0;
  font-size: 13px;
  opacity: .86;
  max-width: 420px;
}
.wa-close{
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.06);
  color: #fff;
  cursor: pointer;
  display:grid;
  place-items:center;
  transition: transform .15s ease, background .15s ease;
}
.wa-close:hover{ background: rgba(255,255,255,.10); transform: translateY(-1px); }

/* Body */
.wa-body{ padding: 16px 18px 18px; }
.wa-form{ display: grid; gap: 14px; }
.wa-grid{
  display:grid;
  gap: 12px;
  grid-template-columns: 1fr;
}
@media (min-width: 520px){
  .wa-grid{ grid-template-columns: 1fr 1fr; }
}

/* Chips */
.wa-chips{ margin-top: 2px; }
.wa-chips__label{
  font-size: 12px;
  opacity: .85;
  margin-bottom: 8px;
}
.wa-chips__list{
  display:flex;
  flex-wrap:wrap;
  gap: 8px;
}
.wa-chip{
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.06);
  color: #e9eefc;
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  transition: transform .15s ease, background .15s ease, border-color .15s ease;
}
.wa-chip:hover{
  transform: translateY(-1px);
  background: rgba(52,211,153,.10);
  border-color: rgba(52,211,153,.25);
}

/* Preview */
.wa-preview{
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(0,0,0,.18);
  border-radius: 16px;
  padding: 12px;
}
.wa-preview__top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom: 10px;
}
.wa-preview__title{
  font-size: 12px;
  opacity: .9;
  font-weight: 700;
}
.wa-preview__count{
  font-size: 12px;
  opacity: .75;
}
.wa-preview__bubble{
  border-radius: 14px;
  background: rgba(16,185,129,.10);
  border: 1px solid rgba(16,185,129,.20);
  padding: 10px 12px;
}
.wa-preview__line{
  font-size: 12px;
  opacity: .95;
}
.wa-preview__msg{
  margin-top: 8px;
  white-space: pre-wrap;
  font-size: 13px;
  line-height: 1.35;
}
.wa-preview__tip{
  display:flex;
  align-items:center;
  gap: 8px;
  margin-top: 10px;
  font-size: 12px;
  opacity: .78;
}

/* Actions */
.wa-actions{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.wa-actions__right{
  display:flex;
  align-items:center;
  gap: 10px;
}
.wa-btn{ border-radius: 14px; }
.wa-btn--primary{ font-weight: 800; }
.wa-btn__icon{ margin-left: 8px; }
</style>
