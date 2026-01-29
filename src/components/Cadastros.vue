<template>
  <section class="intake" id="form-clientes" ref="root" aria-label="Formulário para novos clientes">
    <!-- BG -->
    <div class="bg" aria-hidden="true">
      <div class="bg__grid"></div>
      <div class="bg__glow"></div>
      <div class="bg__noise"></div>
      <div class="bg__cursor"></div>
    </div>

    <!-- HERO / TOPO -->
    <div class="hero__container">
      <div class="center">
        <div class="logo-wrap" ref="logoWrap" @mousemove="onTilt" @mouseleave="resetTilt">
          <div class="logo-ring" aria-hidden="true"></div>
          <img class="logo" src="/Logo/LogoPNG.png" alt="Logo do escritório" />
          <div class="logo-shine" aria-hidden="true"></div>
        </div>

        <div class="heroText">
          <p class="kicker">Onboarding • Novos clientes</p>
          <h1 class="title">Briefing do site (Advocacia)</h1>
          <p class="subtitle">
            Responda com atenção. Isso acelera o orçamento, evita retrabalho e deixa o site pronto para captar clientes.
          </p>

          <div class="progressWrap" aria-label="Progresso do preenchimento">
            <div class="progressMeta">
              <span class="pmLeft">Progresso</span>
              <span class="pmRight">{{ progressPct }}%</span>
            </div>
            <div
              class="progressBar"
              role="progressbar"
              :aria-valuenow="progressPct"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div class="progressFill" :style="{ width: progressPct + '%' }"></div>
            </div>
            <p class="progressHint">{{ progressHint }}</p>
          </div>

          <div class="heroTips" aria-label="Dicas rápidas">
            <span class="tipPill">✅ Seja específico (ex: “execução rural / leilão”)</span>
            <span class="tipPill">📍 Informe cidade alvo (SEO local)</span>
            <span class="tipPill">🔒 Sem promessas de resultado (OAB)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FORM -->
    <div class="container">
      <form class="card" @submit.prevent="submit" novalidate>
        <div class="cardHead">
          <div>
            <div class="cardTitle">Cadastro do cliente</div>
            <div class="cardHint">Campos específicos para site de advocacia com captação e conformidade.</div>
          </div>

          <div class="pill">
            <i class="mdi mdi-shield-check-outline" aria-hidden="true"></i>
            <span>Seguro, objetivo e conforme OAB</span>
          </div>
        </div>

        <!-- BLOCO 1 -->
        <div class="block">
          <div class="blockHead">
            <span class="blockDot" aria-hidden="true"></span>
            <div class="blockTitle">Perfil</div>
            <div class="blockSub">Quem está se cadastrando e como você atende</div>
          </div>

          <div class="grid">
            <!-- 1 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">1) Você é *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="chips" role="group" aria-label="Tipo de perfil">
                <button class="chip" :class="{ on: f.tipo === 'Advogado(a)' }" type="button" @click="f.tipo = 'Advogado(a)'; tick()">
                  <i class="mdi mdi-account-tie" aria-hidden="true"></i>
                  Advogado(a)
                </button>

                <button class="chip" :class="{ on: f.tipo === 'Escritório/Advocacia' }" type="button" @click="f.tipo = 'Escritório/Advocacia'; tick()">
                  <i class="mdi mdi-office-building" aria-hidden="true"></i>
                  Escritório/Advocacia
                </button>

                <button class="chip" :class="{ on: f.tipo === 'Outro' }" type="button" @click="f.tipo = 'Outro'; tick()">
                  <i class="mdi mdi-account" aria-hidden="true"></i>
                  Outro
                </button>
              </div>

              <p v-if="errors.tipo" class="err">{{ errors.tipo }}</p>
            </div>

            <!-- 2 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">2) Nome completo *</span>
                <span class="req">obrigatório</span>
              </div>
              <input class="inp" v-model.trim="f.nome" placeholder="Ex: Dr. Kallebe Max" @blur="tick" />
              <p v-if="errors.nome" class="err">{{ errors.nome }}</p>
            </label>

            <!-- 3 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">3) Nome do escritório/marca *</span>
                <span class="req">obrigatório</span>
              </div>
              <input class="inp" v-model.trim="f.marca" placeholder="Ex: Max Advocacia" @blur="tick" />
              <p v-if="errors.marca" class="err">{{ errors.marca }}</p>
            </label>

            <!-- 4 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">4) WhatsApp *</span>
                <span class="req">obrigatório</span>
              </div>
              <input class="inp" v-model.trim="f.whats" placeholder="(xx) xxxxx-xxxx" inputmode="tel" @blur="tick" />
              <p v-if="errors.whats" class="err">{{ errors.whats }}</p>
            </label>

            <!-- 5 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">5) E-mail *</span>
                <span class="req">obrigatório</span>
              </div>
              <input class="inp" type="email" v-model.trim="f.email" placeholder="seuemail@dominio.com" @blur="tick" />
              <p v-if="errors.email" class="err">{{ errors.email }}</p>
            </label>

            <!-- 6 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">6) Cidade/UF</span>
                <span class="opt">opcional</span>
              </div>
              <input class="inp" v-model.trim="f.cidade" placeholder="Ex: Fortaleza/CE" @blur="tick" />
            </label>

            <!-- 7 -->
            <div class="field">
              <div class="labRow">
                <span class="lab">7) Atendimento</span>
                <span class="opt">opcional</span>
              </div>

              <div class="seg" role="group" aria-label="Tipo de atendimento">
                <button class="segBtn" :class="{ on: f.atendimento === 'Online' }" type="button" @click="f.atendimento='Online'; tick()">Online</button>
                <button class="segBtn" :class="{ on: f.atendimento === 'Presencial' }" type="button" @click="f.atendimento='Presencial'; tick()">Presencial</button>
                <button class="segBtn" :class="{ on: f.atendimento === 'Híbrido' }" type="button" @click="f.atendimento='Híbrido'; tick()">Híbrido</button>
              </div>
            </div>

            <!-- ✅ NOVO 7.1 -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">7.1) Horário de atendimento</span>
                <span class="opt">opcional</span>
              </div>
              <input class="inp" v-model.trim="f.horario" placeholder="Ex: Seg–Sex 08h às 18h" @blur="tick" />
            </label>
          </div>
        </div>

        <!-- BLOCO 2 -->
        <div class="block">
          <div class="blockHead">
            <span class="blockDot" aria-hidden="true"></span>
            <div class="blockTitle">Atuação</div>
            <div class="blockSub">Áreas, público, posicionamento e o que mais vende</div>
          </div>

          <div class="grid">
            <!-- 8 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">8) Áreas de atuação (marque várias) *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="chipGrid" role="group" aria-label="Áreas de atuação">
                <button
                  v-for="a in areas"
                  :key="a"
                  type="button"
                  class="chip"
                  :class="{ on: f.areas.includes(a) }"
                  @click="toggleArr(f.areas, a); tick()"
                >
                  <i class="mdi" :class="areaIcon(a)" aria-hidden="true"></i>
                  {{ a }}
                </button>
              </div>

              <p v-if="errors.areas" class="err">{{ errors.areas }}</p>
              <p class="help">Dica: 3–5 áreas é o ideal para um site mais direto e com melhor conversão.</p>
            </div>

            <!-- 9 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">9) Público principal *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="radios" role="radiogroup" aria-label="Público principal">
                <label class="radio"><input type="radio" name="publico" value="Pessoa física" v-model="f.publico" @change="tick" /><span>Pessoa física</span></label>
                <label class="radio"><input type="radio" name="publico" value="Empresas" v-model="f.publico" @change="tick" /><span>Empresas</span></label>
                <label class="radio"><input type="radio" name="publico" value="Agro / Rural" v-model="f.publico" @change="tick" /><span>Agro / Rural</span></label>
                <label class="radio"><input type="radio" name="publico" value="Misto" v-model="f.publico" @change="tick" /><span>Misto</span></label>
              </div>

              <p v-if="errors.publico" class="err">{{ errors.publico }}</p>
            </div>

            <!-- 10 -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">10) Diferenciais (1–3 frases) *</span>
                <span class="req">obrigatório</span>
              </div>
              <textarea
                class="inp ta"
                rows="3"
                v-model.trim="f.diferenciais"
                placeholder="Ex: comunicação clara, atendimento rápido, experiência em execução/agronegócio..."
                @blur="tick"
              />
              <p v-if="errors.diferenciais" class="err">{{ errors.diferenciais }}</p>
              <p class="help">Dica: pense no que um cliente diria: “Escolhi por…”</p>
            </label>

            <!-- ✅ NOVO 10.1 -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">10.1) Top 3 serviços que você mais quer vender *</span>
                <span class="req">obrigatório</span>
              </div>
              <textarea
                class="inp ta"
                rows="3"
                v-model.trim="f.topServicos"
                placeholder="Ex: 1) Defesa em execução rural (suspensão de leilão)  2) Revisão de crédito rural  3) Negociação de dívidas"
                @blur="tick"
              />
              <p v-if="errors.topServicos" class="err">{{ errors.topServicos }}</p>
              <p class="help">Isso vira CTA e páginas que mais convertem (principalmente no agro).</p>
            </label>

            <!-- ✅ NOVO 10.2 -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">10.2) Cidade(s) alvo do SEO local *</span>
                <span class="req">obrigatório</span>
              </div>
              <input
                class="inp"
                v-model.trim="f.seoCidades"
                placeholder="Ex: Pedro II/PI, Teresina/PI, Parnaíba/PI"
                @blur="tick"
              />
              <p v-if="errors.seoCidades" class="err">{{ errors.seoCidades }}</p>
              <p class="help">Dica: SEO local é o que mais traz lead orgânico pra advocacia.</p>
            </label>
          </div>
        </div>

        <!-- BLOCO 3 (SITE) -->
        <div class="block">
          <div class="blockHead">
            <span class="blockDot" aria-hidden="true"></span>
            <div class="blockTitle">Site</div>
            <div class="blockSub">Estrutura, páginas e recursos (captação real)</div>
          </div>

          <div class="grid">
            <!-- 11 -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">11) Objetivo do site *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="selectWrap">
                <select class="inp select" v-model="f.objetivo" @change="tick">
                  <option value="" disabled>Selecione</option>
                  <option>Gerar leads (WhatsApp e formulário)</option>
                  <option>Autoridade (posicionamento e confiança)</option>
                  <option>Apresentar serviços / escritório</option>
                  <option>Captação de contatos (newsletter)</option>
                  <option>Outro</option>
                </select>
                <i class="mdi mdi-chevron-down che" aria-hidden="true"></i>
              </div>

              <p v-if="errors.objetivo" class="err">{{ errors.objetivo }}</p>
            </label>

            <!-- 12 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">12) Quantas páginas? *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="selectWrap">
                <select class="inp select" v-model="f.paginas" @change="tick">
                  <option value="" disabled>Selecione</option>
                  <option>Única (Landing Page)</option>
                  <option>2 a 4 páginas</option>
                  <option>5 a 8 páginas</option>
                  <option>Mais de 8 páginas</option>
                </select>
                <i class="mdi mdi-chevron-down che" aria-hidden="true"></i>
              </div>

              <p v-if="errors.paginas" class="err">{{ errors.paginas }}</p>
            </label>

            <!-- 13 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">13) Tom do design *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="selectWrap">
                <select class="inp select" v-model="f.tom" @change="tick">
                  <option value="" disabled>Selecione</option>
                  <option>Premium / Luxo</option>
                  <option>Minimalista</option>
                  <option>Institucional</option>
                  <option>Moderno / Tech</option>
                  <option>Clássico</option>
                </select>
                <i class="mdi mdi-chevron-down che" aria-hidden="true"></i>
              </div>

              <p v-if="errors.tom" class="err">{{ errors.tom }}</p>
            </label>

            <!-- 14 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">14) Estrutura desejada (páginas) *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="chipGrid" role="group" aria-label="Estrutura de páginas">
                <button
                  v-for="p in pageBlocks"
                  :key="p"
                  type="button"
                  class="chip"
                  :class="{ on: f.estrutura.includes(p) }"
                  @click="toggleArr(f.estrutura, p); tick()"
                >
                  <i class="mdi" :class="pageIcon(p)" aria-hidden="true"></i>
                  {{ p }}
                </button>
              </div>

              <p v-if="errors.estrutura" class="err">{{ errors.estrutura }}</p>
              <p class="help">Dica: “Home + Áreas + Sobre + Contato” já converte MUITO bem.</p>
            </div>

            <!-- 15 -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">15) CTA principal do site *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="selectWrap">
                <select class="inp select" v-model="f.cta" @change="tick">
                  <option value="" disabled>Selecione</option>
                  <option>WhatsApp (conversa imediata)</option>
                  <option>Formulário (lead qualificado)</option>
                  <option>Agendamento (calendário/horários)</option>
                  <option>Ligação (clique para ligar)</option>
                  <option>Direcionar para Instagram</option>
                </select>
                <i class="mdi mdi-chevron-down che" aria-hidden="true"></i>
              </div>

              <p v-if="errors.cta" class="err">{{ errors.cta }}</p>
            </label>

            <!-- 16 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">16) Funcionalidades desejadas *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="chipGrid" role="group" aria-label="Funcionalidades">
                <button
                  v-for="x in features"
                  :key="x"
                  type="button"
                  class="chip"
                  :class="{ on: f.features.includes(x) }"
                  @click="toggleArr(f.features, x); tick()"
                >
                  <i class="mdi" :class="featureIcon(x)" aria-hidden="true"></i>
                  {{ x }}
                </button>
              </div>

              <p v-if="errors.features" class="err">{{ errors.features }}</p>
            </div>

            <!-- ✅ NOVO 16.1 - prova social -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">16.1) Prova social (se tiver) — links/prints *</span>
                <span class="opt">opcional</span>
              </div>
              <textarea
                class="inp ta"
                rows="3"
                v-model.trim="f.provaSocial"
                placeholder="Ex: link do Google, print de feedback, depoimentos, matérias..."
                @blur="tick"
              />
            </label>

            <!-- 17 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">17) Integrações e rastreamento *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="chipGrid" role="group" aria-label="Integrações">
                <button class="chip" type="button" :class="{ on: f.integracoes.includes('Google Analytics') }" @click="toggleArr(f.integracoes, 'Google Analytics'); tick()">
                  <i class="mdi mdi-chart-line" aria-hidden="true"></i> Google Analytics
                </button>
                <button class="chip" type="button" :class="{ on: f.integracoes.includes('Google Tag Manager') }" @click="toggleArr(f.integracoes, 'Google Tag Manager'); tick()">
                  <i class="mdi mdi-tag-multiple" aria-hidden="true"></i> Tag Manager
                </button>
                <button class="chip" type="button" :class="{ on: f.integracoes.includes('Meta Pixel') }" @click="toggleArr(f.integracoes, 'Meta Pixel'); tick()">
                  <i class="mdi mdi-facebook" aria-hidden="true"></i> Meta Pixel
                </button>
                <button class="chip" type="button" :class="{ on: f.integracoes.includes('Sem rastreamento') }" @click="toggleArr(f.integracoes, 'Sem rastreamento'); tick()">
                  <i class="mdi mdi-eye-off-outline" aria-hidden="true"></i> Sem rastreamento
                </button>
              </div>

              <p v-if="errors.integracoes" class="err">{{ errors.integracoes }}</p>
              <p class="help">Se faz tráfego pago, Pixel/Tag Manager é essencial.</p>
            </div>

            <!-- ✅ NOVO 17.1 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">17.1) Tráfego pago (Meta/Google) *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="seg" role="group" aria-label="Tráfego pago">
                <button class="segBtn" :class="{ on: f.trafego === 'Sim' }" type="button" @click="f.trafego='Sim'; tick()">Sim</button>
                <button class="segBtn" :class="{ on: f.trafego === 'Não' }" type="button" @click="f.trafego='Não'; f.verba=''; tick()">Não</button>
                <button class="segBtn" :class="{ on: f.trafego === 'Pretendo' }" type="button" @click="f.trafego='Pretendo'; tick()">Pretendo</button>
              </div>

              <p v-if="errors.trafego" class="err">{{ errors.trafego }}</p>

              <div class="reveal" :class="{ on: f.trafego === 'Sim' || f.trafego === 'Pretendo' }">
                <label class="field field--full">
                  <span class="lab">Verba média mensal (aprox.) *</span>
                  <input class="inp" v-model.trim="f.verba" placeholder="Ex: R$ 500 / R$ 1.500 / R$ 3.000" @blur="tick" />
                  <p v-if="errors.verba" class="err">{{ errors.verba }}</p>
                </label>
              </div>
            </div>

            <!-- 18 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">18) Tem site de referência? *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="seg" role="group" aria-label="Tem referência">
                <button class="segBtn" :class="{ on: f.temRef === 'Sim' }" type="button" @click="f.temRef='Sim'; tick()">Sim</button>
                <button class="segBtn" :class="{ on: f.temRef === 'Não' }" type="button" @click="f.temRef='Não'; f.refLink=''; tick()">Não</button>
              </div>

              <div class="reveal" :class="{ on: f.temRef === 'Sim' }">
                <label class="field field--full">
                  <span class="lab">Se sim, cole o link *</span>
                  <input class="inp" v-model.trim="f.refLink" placeholder="https://..." @blur="tick" />
                </label>
              </div>

              <p v-if="errors.temRef" class="err">{{ errors.temRef }}</p>
              <p class="help">Referências ajudam a acertar “o estilo” de primeira.</p>
            </div>

            <!-- 19 -->
            <div class="field">
              <div class="labRow">
                <span class="lab">19) Já tem domínio? *</span>
                <span class="req">obrigatório</span>
              </div>
              <div class="seg" role="group" aria-label="Já tem domínio">
                <button class="segBtn" :class="{ on: f.dominio === 'Sim' }" type="button" @click="f.dominio='Sim'; tick()">Sim</button>
                <button class="segBtn" :class="{ on: f.dominio === 'Não' }" type="button" @click="f.dominio='Não'; tick()">Não</button>
                <button class="segBtn" :class="{ on: f.dominio === 'Não sei' }" type="button" @click="f.dominio='Não sei'; tick()">Não sei</button>
              </div>
              <p v-if="errors.dominio" class="err">{{ errors.dominio }}</p>
            </div>

            <!-- 20 -->
            <label class="field">
              <div class="labRow">
                <span class="lab">20) Prazo ideal *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="selectWrap">
                <select class="inp select" v-model="f.prazo" @change="tick">
                  <option value="" disabled>Selecione</option>
                  <option>Urgente (até 1 dia)</option>
                  <option>Até 3 dias</option>
                  <option>Até 4 dias</option>
                  <option>Sem pressa</option>
                </select>
                <i class="mdi mdi-chevron-down che" aria-hidden="true"></i>
              </div>

              <p v-if="errors.prazo" class="err">{{ errors.prazo }}</p>
            </label>

            <!-- 21 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">21) Localização do escritório (e unidades) *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="gridLoc">
                <label class="field">
                  <span class="lab">Cidade/UF principal *</span>
                  <input class="inp" v-model.trim="f.localPrincipal" placeholder="Ex: Pedro II/PI" @blur="tick" />
                  <p v-if="errors.localPrincipal" class="err">{{ errors.localPrincipal }}</p>
                </label>

                <div class="field">
                  <span class="lab">Tem mais de uma unidade? *</span>
                  <div class="seg" role="group" aria-label="Mais de uma unidade">
                    <button class="segBtn" :class="{ on: f.multiUnidade === 'Sim' }" type="button" @click="f.multiUnidade='Sim'; tick()">Sim</button>
                    <button class="segBtn" :class="{ on: f.multiUnidade === 'Não' }" type="button" @click="f.multiUnidade='Não'; f.outrasUnidades=''; tick()">Não</button>
                  </div>
                  <p v-if="errors.multiUnidade" class="err">{{ errors.multiUnidade }}</p>
                </div>

                <div class="reveal field--full" :class="{ on: f.multiUnidade === 'Sim' }">
                  <label class="field field--full">
                    <span class="lab">Se sim, quais e onde? (liste) *</span>
                    <textarea
                      class="inp ta"
                      rows="3"
                      v-model.trim="f.outrasUnidades"
                      placeholder="Ex: 1) Teresina/PI (sede) • 2) Parnaíba/PI (filial) • 3) Online (todo Brasil)"
                      @blur="tick"
                    />
                    <p v-if="errors.outrasUnidades" class="err">{{ errors.outrasUnidades }}</p>
                    <p class="help">Isso define mapa, SEO local e páginas por unidade.</p>
                  </label>
                </div>
              </div>
            </div>

            <!-- 22 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">22) Conformidade (OAB/LGPD) *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="checkRow">
                <label class="check">
                  <input type="checkbox" v-model="f.oab" @change="tick" />
                  <span>Manter linguagem institucional (sem promessas de resultado) e evitar termos proibidos.</span>
                </label>
                <label class="check">
                  <input type="checkbox" v-model="f.lgpd" @change="tick" />
                  <span>Incluir aviso de privacidade e consentimento básico (LGPD) no formulário.</span>
                </label>
              </div>

              <p v-if="errors.conformidade" class="err">{{ errors.conformidade }}</p>
              <p class="help">Isso protege o escritório e evita dor de cabeça.</p>
            </div>
          </div>
        </div>

        <!-- ✅ BLOCO 3.5 (DOCUMENTOS E PERFIL) -->
        <div class="block">
          <div class="blockHead">
            <span class="blockDot" aria-hidden="true"></span>
            <div class="blockTitle">Documentos e perfil</div>
            <div class="blockSub">OAB, redes, Google e materiais que aceleram o projeto</div>
          </div>

          <div class="grid">
            <label class="field">
              <div class="labRow">
                <span class="lab">23) OAB/UF (ex: 12345/PI) *</span>
                <span class="req">obrigatório</span>
              </div>
              <input class="inp" v-model.trim="f.oabUf" placeholder="Ex: 12345/PI" @blur="tick" />
              <p v-if="errors.oabUf" class="err">{{ errors.oabUf }}</p>
            </label>

            <label class="field">
              <div class="labRow">
                <span class="lab">24) Instagram (link)</span>
                <span class="opt">opcional</span>
              </div>
              <input class="inp" v-model.trim="f.instagram" placeholder="https://instagram.com/..." @blur="tick" />
            </label>

            <label class="field">
              <div class="labRow">
                <span class="lab">25) Já tem site atual?</span>
                <span class="opt">opcional</span>
              </div>
              <input class="inp" v-model.trim="f.siteAtual" placeholder="https://..." @blur="tick" />
            </label>

            <label class="field">
              <div class="labRow">
                <span class="lab">26) Google Meu Negócio (link)</span>
                <span class="opt">opcional</span>
              </div>
              <input class="inp" v-model.trim="f.gmb" placeholder="https://g.page/..." @blur="tick" />
            </label>

            <label class="field field--full">
              <div class="labRow">
                <span class="lab">27) Endereço completo (como deve aparecer no site)</span>
                <span class="opt">opcional</span>
              </div>
              <textarea
                class="inp ta"
                rows="2"
                v-model.trim="f.enderecoCompleto"
                placeholder="Ex: Av. X, 123, Centro, Pedro II/PI • CEP 00000-000"
                @blur="tick"
              />
            </label>
          </div>
        </div>

        <!-- BLOCO 4 -->
        <div class="block">
          <div class="blockHead">
            <span class="blockDot" aria-hidden="true"></span>
            <div class="blockTitle">Conteúdo</div>
            <div class="blockSub">Textos, fotos e identidade</div>
          </div>

          <div class="grid">
            <!-- 28 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">28) Você já tem logo / identidade visual? *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="chipGrid" role="group" aria-label="Identidade visual">
                <button class="chip" :class="{ on: f.identidade === 'Sim (logo + cores)' }" type="button" @click="f.identidade='Sim (logo + cores)'; tick()">
                  <i class="mdi mdi-palette" aria-hidden="true"></i> Sim (logo + cores)
                </button>
                <button class="chip" :class="{ on: f.identidade === 'Tenho só logo' }" type="button" @click="f.identidade='Tenho só logo'; tick()">
                  <i class="mdi mdi-file-image" aria-hidden="true"></i> Tenho só logo
                </button>
                <button class="chip" :class="{ on: f.identidade === 'Não tenho' }" type="button" @click="f.identidade='Não tenho'; tick()">
                  <i class="mdi mdi-alert-circle-outline" aria-hidden="true"></i> Não tenho
                </button>
              </div>

              <p v-if="errors.identidade" class="err">{{ errors.identidade }}</p>
            </div>

            <!-- 29 -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">29) Você já tem conteúdos? (marque) *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="chipGrid" role="group" aria-label="Conteúdos disponíveis">
                <button class="chip" :class="{ on: f.conteudo.includes('Fotos profissionais') }" type="button" @click="toggleArr(f.conteudo, 'Fotos profissionais'); tick()">
                  <i class="mdi mdi-camera" aria-hidden="true"></i> Fotos profissionais
                </button>
                <button class="chip" :class="{ on: f.conteudo.includes('Logo em PNG') }" type="button" @click="toggleArr(f.conteudo, 'Logo em PNG'); tick()">
                  <i class="mdi mdi-file-image" aria-hidden="true"></i> Logo em PNG
                </button>
                <button class="chip" :class="{ on: f.conteudo.includes('Textos prontos') }" type="button" @click="toggleArr(f.conteudo, 'Textos prontos'); tick()">
                  <i class="mdi mdi-text-box" aria-hidden="true"></i> Textos prontos
                </button>
                <button class="chip" :class="{ on: f.conteudo.includes('Não tenho nada ainda') }" type="button" @click="toggleArr(f.conteudo, 'Não tenho nada ainda'); tick()">
                  <i class="mdi mdi-progress-question" aria-hidden="true"></i> Não tenho nada ainda
                </button>
              </div>

              <p v-if="errors.conteudo" class="err">{{ errors.conteudo }}</p>
            </div>

            <!-- 30 -->
            <label class="field field--full">
              <div class="labRow">
                <span class="lab">30) Observações finais *</span>
                <span class="req">obrigatório</span>
              </div>
              <textarea
                class="inp ta"
                rows="4"
                v-model.trim="f.obs"
                placeholder="Ex: foco em confiança, captação, linguagem institucional, estilo premium..."
                @blur="tick"
              />
              <p v-if="errors.obs" class="err">{{ errors.obs }}</p>
            </label>

            <!-- ✅ NOVO 30.1 (LGPD) -->
            <div class="field field--full">
              <div class="labRow">
                <span class="lab">30.1) Consentimento *</span>
                <span class="req">obrigatório</span>
              </div>

              <div class="checkRow">
                <label class="check">
                  <input type="checkbox" v-model="f.consent" @change="tick" />
                  <span>
                    Autorizo o contato por WhatsApp/E-mail e concordo com o uso dos dados apenas para fins de atendimento e orçamento.
                  </span>
                </label>
              </div>

              <p v-if="errors.consent" class="err">{{ errors.consent }}</p>
            </div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="actions">
          <button class="btn primary" type="submit" :disabled="isSending" :class="{ disabled: isSending }">
            <span v-if="!isSending">Enviar cadastro <span class="arrow">→</span></span>
            <span v-else>Enviando...</span>
          </button>

          <button class="btn ghost" type="button" @click="copyJson">
            Copiar respostas
            <i class="mdi mdi-content-copy" aria-hidden="true"></i>
          </button>
        </div>

        <div class="hint">
          ✅ Ao enviar, você pode salvar no banco, encaminhar no WhatsApp, ou usar isso para montar proposta e estrutura do site.
        </div>
      </form>

      <!-- Snack -->
      <div class="snack" :class="{ on: snack.on }" role="status" aria-live="polite">
        <i class="mdi" :class="snack.icon" aria-hidden="true"></i>
        <span>{{ snack.text }}</span>
      </div>
    </div>

    <a class="toTop" @click="goToIndex" href="#inicio">Voltar para a página inicial</a>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const router = useRouter();
function goToIndex() {
  router.push("/");
}

/* refs */
const root = ref(null);
const logoWrap = ref(null);

const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const isTouch =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/* opções */
const areas = [
  "Agro / Rural",
  "Cível",
  "Trabalhista",
  "Família",
  "Criminal",
  "Previdenciário",
  "Empresarial",
  "Consumidor",
  "Imobiliário",
  "Tributário",
  "Outros"
];

const features = [
  "Botão fixo WhatsApp",
  "Formulário (captar lead)",
  "Depoimentos (prova social)",
  "FAQ (dúvidas)",
  "Mapa/rota",
  "Planos/Orçamento",
  "Blog/Artigos",
  "Acessibilidade",
  "SEO básico"
];

const pageBlocks = [
  "Início (Home)",
  "Sobre",
  "Áreas de atuação",
  "Equipe",
  "Contato",
  "Blog / Artigos",
  "Depoimentos",
  "Perguntas (FAQ)",
  "Política de Privacidade",
  "Termos de uso"
];

/* form */
const f = reactive({
  tipo: "",
  nome: "",
  marca: "",
  whats: "",
  email: "",
  cidade: "",
  atendimento: "Híbrido",
  horario: "",

  areas: [],
  publico: "",
  diferenciais: "",
  topServicos: "",
  seoCidades: "",

  objetivo: "",
  paginas: "",
  tom: "",
  estrutura: [],
  cta: "",
  features: [],
  integracoes: [],
  trafego: "",
  verba: "",
  temRef: "",
  refLink: "",
  dominio: "",
  prazo: "",

  localPrincipal: "",
  multiUnidade: "",
  outrasUnidades: "",

  oab: false,
  lgpd: false,

  // docs/perfil
  oabUf: "",
  instagram: "",
  siteAtual: "",
  gmb: "",
  enderecoCompleto: "",

  identidade: "",
  conteudo: [],
  provaSocial: "",
  obs: "",
  consent: false
});

/* errors */
const errors = reactive({
  tipo: "",
  nome: "",
  marca: "",
  whats: "",
  email: "",
  areas: "",
  publico: "",
  diferenciais: "",
  topServicos: "",
  seoCidades: "",
  objetivo: "",
  paginas: "",
  tom: "",
  estrutura: "",
  cta: "",
  features: "",
  integracoes: "",
  trafego: "",
  verba: "",
  temRef: "",
  dominio: "",
  prazo: "",

  localPrincipal: "",
  multiUnidade: "",
  outrasUnidades: "",

  conformidade: "",
  oabUf: "",
  identidade: "",
  conteudo: "",
  obs: "",
  consent: ""
});

/* helpers */
function toggleArr(arr, val) {
  const i = arr.indexOf(val);
  if (i >= 0) arr.splice(i, 1);
  else arr.push(val);
}

function areaIcon(a) {
  if (a.includes("Agro")) return "mdi-tractor";
  if (a === "Criminal") return "mdi-gavel";
  if (a === "Família") return "mdi-account-group";
  if (a === "Trabalhista") return "mdi-briefcase";
  if (a === "Tributário") return "mdi-cash";
  if (a === "Empresarial") return "mdi-domain";
  if (a === "Imobiliário") return "mdi-home-city";
  if (a === "Consumidor") return "mdi-cart";
  return "mdi-scale-balance";
}
function featureIcon(x) {
  if (x.includes("WhatsApp")) return "mdi-whatsapp";
  if (x.includes("Formulário")) return "mdi-form-select";
  if (x.includes("Depoimentos")) return "mdi-star";
  if (x.includes("FAQ")) return "mdi-help-circle";
  if (x.includes("Mapa")) return "mdi-map-marker";
  if (x.includes("Planos")) return "mdi-crown";
  if (x.includes("Blog")) return "mdi-post-outline";
  if (x.includes("Acess")) return "mdi-wheelchair-accessibility";
  if (x.includes("SEO")) return "mdi-magnify";
  return "mdi-check";
}
function pageIcon(p) {
  if (p.includes("Início")) return "mdi-home-variant-outline";
  if (p === "Sobre") return "mdi-account-details-outline";
  if (p.includes("Áreas")) return "mdi-scale-balance";
  if (p === "Equipe") return "mdi-account-group-outline";
  if (p === "Contato") return "mdi-phone-outline";
  if (p.includes("Blog")) return "mdi-post-outline";
  if (p.includes("Depoimentos")) return "mdi-star-outline";
  if (p.includes("FAQ")) return "mdi-help-circle-outline";
  if (p.includes("Política")) return "mdi-shield-lock-outline";
  if (p.includes("Termos")) return "mdi-file-document-outline";
  return "mdi-check";
}

/* progress */
const requiredKeys = [
  "tipo","nome","marca","whats","email",
  "areas","publico","diferenciais","topServicos","seoCidades",
  "objetivo","paginas","tom","estrutura","cta","features","integracoes",
  "trafego","temRef","dominio","prazo",
  "localPrincipal","multiUnidade",
  "oabUf",
  "identidade","conteudo","obs",
  "consent"
];

const progressPct = computed(() => {
  let done = 0;

  for (const k of requiredKeys) {
    const v = f[k];
    const ok = Array.isArray(v) ? v.length > 0 : String(v || "").trim().length > 0;
    if (ok) done++;
  }

  // conformidade (2 checks)
  if (f.oab) done += 1;
  if (f.lgpd) done += 1;

  // unidades extras
  const extraUnitsNeeded = f.multiUnidade === "Sim";
  if (extraUnitsNeeded) {
    if (String(f.outrasUnidades || "").trim().length > 0) done += 1;
  }

  // verba se trafego sim/pretendo
  const needsVerba = f.trafego === "Sim" || f.trafego === "Pretendo";
  if (needsVerba) {
    if (String(f.verba || "").trim().length > 0) done += 1;
  }

  const base =
    requiredKeys.length +
    2 + // oab + lgpd
    (extraUnitsNeeded ? 1 : 0) +
    (needsVerba ? 1 : 0);

  return Math.min(100, Math.round((done / base) * 100));
});

const progressHint = computed(() => {
  const p = progressPct.value;
  if (p < 30) return "Começou bem. Vamos deixar isso bem completo.";
  if (p < 70) return "Boa. Já dá pra montar um orçamento bem certeiro.";
  if (p < 100) return "Quase lá. Só ajustar os últimos pontos.";
  return "Perfeito. Cadastro completo ✅";
});

/* snack */
const snack = ref({ on: false, text: "", icon: "mdi-check-circle" });
let snackTimer = null;
function showSnack(text, icon = "mdi-check-circle") {
  snack.value.text = text;
  snack.value.icon = icon;
  snack.value.on = true;
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => (snack.value.on = false), 1700);
}

/* validation */
function validate() {
  for (const k of Object.keys(errors)) errors[k] = "";

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
  const digits = (v) => String(v || "").replace(/\D/g, "");
  const okPhone = (v) => digits(v).length >= 10;

  if (!f.tipo) errors.tipo = "Escolha uma opção.";
  if (!String(f.nome).trim()) errors.nome = "Preencha o nome.";
  if (!String(f.marca).trim()) errors.marca = "Preencha a marca/escritório.";
  if (!okPhone(f.whats)) errors.whats = "Digite um WhatsApp válido.";
  if (!isEmail(f.email)) errors.email = "Digite um e-mail válido.";

  if (!f.areas.length) errors.areas = "Marque pelo menos 1 área.";
  if (!f.publico) errors.publico = "Escolha o público principal.";
  if (!String(f.diferenciais).trim()) errors.diferenciais = "Descreva seus diferenciais.";
  if (!String(f.topServicos).trim()) errors.topServicos = "Liste 3 serviços principais.";
  if (!String(f.seoCidades).trim()) errors.seoCidades = "Informe a(s) cidade(s) alvo do SEO.";

  if (!f.objetivo) errors.objetivo = "Selecione o objetivo do site.";
  if (!f.paginas) errors.paginas = "Selecione a quantidade de páginas.";
  if (!f.tom) errors.tom = "Selecione o tom do design.";
  if (!f.estrutura.length) errors.estrutura = "Marque pelo menos 1 página.";
  if (!f.cta) errors.cta = "Selecione o CTA principal.";
  if (!f.features.length) errors.features = "Marque pelo menos 1 funcionalidade.";
  if (!f.integracoes.length) errors.integracoes = "Marque pelo menos 1 opção.";

  if (!f.trafego) errors.trafego = "Selecione uma opção.";
  const needsVerba = f.trafego === "Sim" || f.trafego === "Pretendo";
  if (needsVerba && !String(f.verba).trim()) errors.verba = "Informe a verba média (aprox.).";

  if (!f.temRef) errors.temRef = "Selecione Sim ou Não.";
  if (f.temRef === "Sim" && !String(f.refLink).trim()) errors.temRef = "Cole o link de referência.";
  if (!f.dominio) errors.dominio = "Selecione uma opção.";
  if (!f.prazo) errors.prazo = "Selecione o prazo.";

  if (!String(f.localPrincipal).trim()) errors.localPrincipal = "Informe a cidade/UF principal.";
  if (!f.multiUnidade) errors.multiUnidade = "Selecione Sim ou Não.";
  if (f.multiUnidade === "Sim" && !String(f.outrasUnidades).trim()) {
    errors.outrasUnidades = "Liste as unidades (cidade/UF) ou como atende em cada local.";
  }

  if (!f.oab || !f.lgpd) errors.conformidade = "Marque as duas opções (OAB e LGPD).";

  if (!String(f.oabUf).trim()) errors.oabUf = "Informe a OAB/UF.";

  if (!f.identidade) errors.identidade = "Selecione uma opção.";
  if (!f.conteudo.length) errors.conteudo = "Marque pelo menos 1.";
  if (!String(f.obs).trim()) errors.obs = "Escreva uma observação final.";

  if (!f.consent) errors.consent = "Você precisa autorizar o contato (consentimento).";

  return !Object.values(errors).some(Boolean);
}

function scrollToFirstError() {
  const el = root.value?.querySelector(".err");
  el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
}

/* copiar JSON */
async function copyJson() {
  try {
    const payload = JSON.stringify(f, null, 2);
    await navigator.clipboard.writeText(payload);
    showSnack("Respostas copiadas", "mdi-check-circle");
  } catch {
    showSnack("Falha ao copiar", "mdi-alert-circle");
  }
}

/* tick */
function tick() {
  validate();
}

/* ✅ Envio para Firestore */
const isSending = ref(false);

function sanitizeFormPayload() {
  const payload = JSON.parse(JSON.stringify(f));
  payload.whats = String(payload.whats || "").trim();
  payload.email = String(payload.email || "").trim().toLowerCase();
  return payload;
}

const COLLECTION_NAME = "cadastros_clientes";

function pad2(n) { return String(n).padStart(2, "0"); }
function formatNowBR(date = new Date()) {
  const dia = pad2(date.getDate());
  const mes = pad2(date.getMonth() + 1);
  const ano = date.getFullYear();
  const hora = pad2(date.getHours());
  const min = pad2(date.getMinutes());
  const seg = pad2(date.getSeconds());
  return `${dia}/${mes}/${ano} ${hora}:${min}:${seg}`;
}

async function submit() {
  if (isSending.value) return;

  if (!validate()) {
    showSnack("Confira os campos obrigatórios", "mdi-alert-circle");
    scrollToFirstError();
    return;
  }

  isSending.value = true;
  showSnack("Enviando...", "mdi-progress-clock");

  try {
    const payload = sanitizeFormPayload();
    const now = new Date();

    await addDoc(collection(db, COLLECTION_NAME), {
      ...payload,
      createdAt: serverTimestamp(),
      createdAtBR: formatNowBR(now),
      createdAtParts: {
        dia: now.getDate(),
        mes: now.getMonth() + 1,
        ano: now.getFullYear(),
        hora: now.getHours(),
        minuto: now.getMinutes(),
        segundo: now.getSeconds(),
      },
      status: "novo",
      origin: "form-clientes",
      userAgent: navigator.userAgent || null,
    });

    showSnack("Cadastro enviado com sucesso ✅", "mdi-check-circle");
    resetForm();
  } catch (err) {
    console.error(err);
    showSnack("Falha ao enviar. Verifique as regras do Firestore.", "mdi-alert-circle");
  } finally {
    isSending.value = false;
  }
}

/* reset */
function resetForm() {
  f.tipo = "";
  f.nome = "";
  f.marca = "";
  f.whats = "";
  f.email = "";
  f.cidade = "";
  f.atendimento = "Híbrido";
  f.horario = "";

  f.areas = [];
  f.publico = "";
  f.diferenciais = "";
  f.topServicos = "";
  f.seoCidades = "";

  f.objetivo = "";
  f.paginas = "";
  f.tom = "";
  f.estrutura = [];
  f.cta = "";
  f.features = [];
  f.integracoes = [];
  f.trafego = "";
  f.verba = "";
  f.temRef = "";
  f.refLink = "";
  f.dominio = "";
  f.prazo = "";

  f.localPrincipal = "";
  f.multiUnidade = "";
  f.outrasUnidades = "";

  f.oab = false;
  f.lgpd = false;

  f.oabUf = "";
  f.instagram = "";
  f.siteAtual = "";
  f.gmb = "";
  f.enderecoCompleto = "";

  f.identidade = "";
  f.conteudo = [];
  f.provaSocial = "";
  f.obs = "";
  f.consent = false;

  for (const k of Object.keys(errors)) errors[k] = "";
}

/* LOGO TILT */
function onTilt(e) {
  if (!logoWrap.value || prefersReduced || isTouch) return;
  const r = logoWrap.value.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width;
  const py = (e.clientY - r.top) / r.height;

  const ry = (px - 0.5) * 12;
  const rx = (0.5 - py) * 12;

  logoWrap.value.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
  logoWrap.value.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
}
function resetTilt() {
  if (!logoWrap.value) return;
  logoWrap.value.style.setProperty("--rx", `0deg`);
  logoWrap.value.style.setProperty("--ry", `0deg`);
}

/* BG cursor glow */
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
/* =====================
   CENTRALIZAÇÃO
   ===================== */
.intake {
  position: relative;
  padding: 70px 0 90px;
  overflow: hidden;
  background: #07080b;
  color: rgba(255, 255, 255, 0.92);
  display: flex;
  flex-direction: column;
  align-items: center;
  --px: 50%;
  --py: 35%;
  --pOpacity: 0;
}

.hero__container,
.container {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* BG */
.bg { position: absolute; inset: 0; pointer-events: none; }
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
  top: 16%;
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

/* HERO */
.hero__container { position: relative; z-index: 2; padding: 0 18px; margin-bottom: 14px; }
.center { width: 100%; max-width: 980px; display: grid; justify-items: center; text-align: center; gap: 16px; }

.heroTips {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 6px;
}
.tipPill{
  font-size: 11px;
  color: rgba(255,255,255,0.74);
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.02);
  padding: 7px 9px;
  border-radius: 999px;
}

/* pill */
.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}
.pill i { font-size: 16px; }

/* LOGO */
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
.logo { width: 62%; height: auto; z-index: 2; filter: drop-shadow(0 16px 44px rgba(0, 0, 0, 0.55)); }
.logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.18), transparent 60%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
}
.logo-ring::after {
  content: "";
  position: absolute;
  inset: -40%;
  background: conic-gradient(from 180deg, transparent, rgba(255, 255, 255, 0.24), transparent);
  animation: spin 4.8s linear infinite;
  opacity: 0.65;
}
.logo-shine {
  position: absolute;
  inset: 8%;
  border-radius: 22px;
  background: radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.14), transparent 55%);
  z-index: 1;
}
@keyframes spin { to { transform: rotate(360deg); } }

.heroText { display: grid; gap: 10px; }
.kicker {
  margin: 0 auto;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
  letter-spacing: 0.3px;
}
.title { margin: 0; font-size: clamp(24px, 3.6vw, 44px); line-height: 1.08; letter-spacing: -0.5px; }
.subtitle { margin: 0 auto; max-width: 820px; font-size: clamp(14px, 1.25vw, 18px); line-height: 1.5; color: rgba(255, 255, 255, 0.72); }

/* progress */
.progressWrap {
  width: min(760px, 100%);
  margin: 0 auto;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.progressMeta { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; color: rgba(255, 255, 255, 0.74); }
.progressBar {
  margin-top: 8px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.22);
  overflow: hidden;
}
.progressFill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0.92));
  background-size: 200% 100%;
  animation: shimmer 3.2s linear infinite;
}
@keyframes shimmer { to { background-position: 200% 50%; } }
.progressHint { margin: 8px 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.62); }

/* FORM */
.container { position: relative; z-index: 2; padding: 0 18px; }
.card {
  width: 100%;
  max-width: 980px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 22px;
  padding: 14px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.45);
  display: grid;
  gap: 14px;
}

.cardHead {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 10px;
}
.cardTitle { font-weight: 900; letter-spacing: -0.2px; }
.cardHint { font-size: 12px; color: rgba(255, 255, 255, 0.62); }

.block {
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.18);
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 10px;
}
.blockHead { display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: start; }
.blockDot {
  width: 10px; height: 10px; border-radius: 999px;
  background: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.14);
  margin-top: 4px;
}
.blockTitle { font-weight: 900; }
.blockSub { grid-column: 2; font-size: 12px; color: rgba(255, 255, 255, 0.62); margin-top: 2px; }

.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.field { display: grid; gap: 6px; }
.field--full { grid-column: 1 / -1; }

.labRow { display: flex; gap: 10px; align-items: center; justify-content: space-between; }
.lab { font-size: 12px; color: rgba(255, 255, 255, 0.72); }
.req, .opt {
  font-size: 10px;
  padding: 6px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.70);
}
.opt { border-color: rgba(255, 255, 255, 0.08); background: rgba(0, 0, 0, 0.18); color: rgba(255, 255, 255, 0.58); }

.inp {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.24);
  color: rgba(255, 255, 255, 0.92);
  padding: 11px 12px;
  outline: none;
}
.inp:focus { border-color: rgba(255, 255, 255, 0.22); box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.06); }
.ta { resize: vertical; }

.err { margin: 0; font-size: 12px; color: rgba(255, 140, 140, 0.95); }
.help { margin: 0; font-size: 12px; color: rgba(255, 255, 255, 0.62); }

.chips, .chipGrid { display: flex; flex-wrap: wrap; gap: 8px; }
.chipGrid { padding: 10px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.10); background: rgba(0, 0, 0, 0.18); }
.chip {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.88);
  border-radius: 999px;
  padding: 9px 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
  font-size: 12px;
}
.chip i { font-size: 18px; }
.chip:hover { background: rgba(255, 255, 255, 0.06); transform: translateY(-1px); }
.chip.on { background: rgba(255, 255, 255, 0.10); border-color: rgba(255, 255, 255, 0.22); }

.seg {
  display: inline-flex;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}
.segBtn {
  padding: 10px 12px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, 0.86);
  cursor: pointer;
}
.segBtn.on { background: rgba(255, 255, 255, 0.10); }

.radios { display: flex; gap: 10px; flex-wrap: wrap; }
.radio {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 12px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.86);
}
.radio input { accent-color: #fff; }

.selectWrap { position: relative; }
.select { appearance: none; -webkit-appearance: none; -moz-appearance: none; padding-right: 40px; }
.che { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); opacity: 0.75; pointer-events: none; }
select option { background: #0b0c10; color: rgba(255, 255, 255, 0.92); }

.reveal { display: grid; gap: 10px; max-height: 0; overflow: hidden; opacity: 0; transition: max-height 220ms ease, opacity 220ms ease; }
.reveal.on { max-height: 260px; opacity: 1; }

.checkRow {
  display: grid;
  gap: 10px;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(0, 0, 0, 0.18);
}
.check {
  display: inline-flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.86);
}
.check input { margin-top: 3px; accent-color: #fff; }

.actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 10px 12px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.04);
  transition: background 160ms ease, transform 160ms ease, opacity 160ms ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn:hover { background: rgba(255, 255, 255, 0.06); transform: translateY(-1px); }
.btn.primary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
  color: rgba(8, 10, 14, 0.95);
  font-weight: 900;
}
.btn.ghost { background: rgba(255, 255, 255, 0.02); }
.btn.disabled { opacity: 0.7; pointer-events: none; }
.arrow { font-weight: 900; }
.hint { font-size: 12px; color: rgba(255, 255, 255, 0.62); }

.gridLoc { width: 100%; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }

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
.snack.on { opacity: 1; transform: translateY(0px) scale(1); }
.snack i { font-size: 18px; }

.toTop { margin-top: 18px; color: rgba(255, 255, 255, 0.78); text-decoration: none; cursor: pointer; }
.toTop:hover { text-decoration: underline; text-underline-offset: 3px; }

@media (max-width: 980px) {
  .grid { grid-template-columns: 1fr; }
  .gridLoc { grid-template-columns: 1fr; }
  .actions { justify-content: center; }
  .btn { width: 100%; justify-content: center; }
  .snack { left: 16px; right: 16px; justify-content: center; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
  .bg__cursor { display: none !important; }
}
</style>
