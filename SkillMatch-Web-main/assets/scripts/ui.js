/**
 * ui.js — Módulo de interface de usuário
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsabilidade: toda a manipulação do DOM, feedback visual, validação do
 * formulário e renderização dinâmica dos resultados.
 *
 * Conceitos utilizados:
 *   - querySelector / getElementById
 *   - createElement, appendChild, classList
 *   - addEventListener, preventDefault
 *   - Condicional: if/else, ternário
 *   - Arrow functions e funções normais
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Referências centralizadas do DOM ────────────────────────────────────────
/**
 * Objeto com todas as referências aos elementos do DOM.
 * Centralizar evita querySelector() espalhado pelo código.
 *
 * @type {Object.<string, HTMLElement|null>}
 */
export const el = {
  // Formulário
  form:           document.getElementById('form-candidato'),
  inputNome:      document.getElementById('input-nome'),
  inputArea:      document.getElementById('input-area'),
  inputHabs:      document.getElementById('input-habilidades'),
  inputExp:       document.getElementById('input-experiencia'),
  btnAnalisar:    document.getElementById('btn-analisar'),

  // Erros inline
  erroNome:       document.getElementById('erro-nome'),
  erroArea:       document.getElementById('erro-area'),
  erroHabs:       document.getElementById('erro-habilidades'),
  erroExp:        document.getElementById('erro-experiencia'),

  // Seções de resultados
  secVagas:          document.getElementById('vagas'),
  secMelhorVaga:     document.getElementById('melhor-vaga'),
  secRecomendacao:   document.getElementById('recomendacao'),

  // Containers de resultados
  listaVagas:           document.getElementById('lista-vagas'),
  melhorVagaContainer:  document.getElementById('melhor-vaga-container'),
  listaRecomendacoes:   document.getElementById('lista-recomendacoes'),

  // Estados
  vagasLoading:  document.getElementById('vagas-loading'),
  vagasErro:     document.getElementById('vagas-erro'),
  vagasErroMsg:  document.getElementById('vagas-erro-msg'),
  vagasVazio:    document.getElementById('vagas-vazio'),
  vagasResumo:   document.getElementById('vagas-resumo'),

  // Footer
  footerAno: document.getElementById('footer-ano'),
};

// ─── Atualizar ano no footer ──────────────────────────────────────────────────
/**
 * Atualiza dinamicamente o ano exibido no footer.
 */
export const atualizarAnoFooter = () => {
  if (el.footerAno) {
    el.footerAno.textContent = new Date().getFullYear();
  }
};

// ─── Validação do formulário ──────────────────────────────────────────────────

/**
 * Exibe uma mensagem de erro em um campo do formulário.
 *
 * @param {HTMLInputElement} input   - Campo com erro.
 * @param {HTMLElement}      erroEl  - Elemento onde exibir o texto de erro.
 * @param {string}           msg     - Mensagem de erro.
 */
export function exibirErro(input, erroEl, msg) {
  if (input)  input.classList.add('invalido');
  if (erroEl) erroEl.textContent = msg;
}

/**
 * Remove o estado de erro de um campo.
 *
 * @param {HTMLInputElement} input   - Campo a limpar.
 * @param {HTMLElement}      erroEl  - Elemento de erro a limpar.
 */
export function limparErro(input, erroEl) {
  if (input)  input.classList.remove('invalido');
  if (erroEl) erroEl.textContent = '';
}

/** Remove todos os erros do formulário. */
export function limparTodosErros() {
  limparErro(el.inputNome, el.erroNome);
  limparErro(el.inputArea, el.erroArea);
  limparErro(el.inputHabs, el.erroHabs);
  limparErro(el.inputExp,  el.erroExp);
}

/**
 * Valida todos os campos obrigatórios e exibe erros inline.
 *
 * @param {string} nome - Valor do campo nome.
 * @param {string} area - Valor do campo área.
 * @param {string} habs - Valor do campo habilidades.
 * @param {string} exp  - Valor do campo experiência.
 * @returns {boolean} true se válido, false se há erros.
 */
export function validarFormulario(nome, area, habs, exp) {
  limparTodosErros();
  let valido = true;

  if (!nome.trim()) {
    exibirErro(el.inputNome, el.erroNome, 'O nome é obrigatório.');
    valido = false;
  }

  if (!area.trim()) {
    exibirErro(el.inputArea, el.erroArea, 'A área de interesse é obrigatória.');
    valido = false;
  }

  if (!habs.trim()) {
    exibirErro(el.inputHabs, el.erroHabs, 'Informe pelo menos uma habilidade.');
    valido = false;
  }

  const expNum = Number(exp);
  if (exp.trim() === '' || isNaN(expNum) || expNum < 0) {
    exibirErro(el.inputExp, el.erroExp, 'Informe um número válido de meses (mínimo 0).');
    valido = false;
  }

  return valido;
}

// ─── Preencher formulário (a partir do localStorage) ─────────────────────────
/**
 * Preenche os campos do formulário com os dados de um candidato salvo.
 *
 * @param {import('./dados.js').Candidato} candidato
 */
export function preencherFormulario(candidato) {
  if (!candidato) return;

  if (el.inputNome) el.inputNome.value = candidato.nome;
  if (el.inputArea) el.inputArea.value = candidato.area;
  if (el.inputHabs) el.inputHabs.value = candidato.habilidades.join(', ');
  if (el.inputExp)  el.inputExp.value  = candidato.experienciaMeses;

  console.info('[ui] Formulário preenchido com dados do localStorage.');
}

// ─── Controle de visibilidade das seções ─────────────────────────────────────
/**
 * Exibe ou oculta uma seção de resultados.
 *
 * @param {HTMLElement} secao   - A seção a controlar.
 * @param {boolean}     visivel - true para exibir, false para ocultar.
 */
export function toggleSecao(secao, visivel) {
  if (!secao) return;
  if (visivel) {
    secao.removeAttribute('hidden');
  } else {
    secao.setAttribute('hidden', '');
  }
}

// ─── Estados de loading / erro / vazio ───────────────────────────────────────
/**
 * Exibe o estado de carregamento na seção de vagas.
 * @param {boolean} mostrar
 */
export const mostrarLoading = (mostrar) => {
  if (el.vagasLoading) {
    mostrar
      ? el.vagasLoading.removeAttribute('hidden')
      : el.vagasLoading.setAttribute('hidden', '');
  }
};

/**
 * Exibe o estado de erro na seção de vagas.
 * @param {boolean} mostrar
 * @param {string}  [msg=''] - Mensagem de erro opcional.
 */
export const mostrarErroVagas = (mostrar, msg = '') => {
  if (el.vagasErro) {
    mostrar
      ? el.vagasErro.removeAttribute('hidden')
      : el.vagasErro.setAttribute('hidden', '');
  }
  if (el.vagasErroMsg && msg) el.vagasErroMsg.textContent = msg;
};

/**
 * Exibe o estado vazio na seção de vagas.
 * @param {boolean} mostrar
 */
export const mostrarVazio = (mostrar) => {
  if (el.vagasVazio) {
    mostrar
      ? el.vagasVazio.removeAttribute('hidden')
      : el.vagasVazio.setAttribute('hidden', '');
  }
};

/** Oculta todos os estados especiais das vagas. */
export const ocultarEstados = () => {
  mostrarLoading(false);
  mostrarErroVagas(false);
  mostrarVazio(false);
};

// ─── Renderizar lista de vagas ────────────────────────────────────────────────
/**
 * Renderiza os cartões de vagas no container correspondente.
 * Cada cartão é criado dinamicamente com createElement e appendChild.
 *
 * @param {import('./motor.js').ResultadoVaga[]} resultados
 */
export function renderizarVagas(resultados) {
  const lista = el.listaVagas;
  if (!lista) return;

  // Limpa o conteúdo anterior
  lista.innerHTML = '';
  ocultarEstados();

  if (resultados.length === 0) {
    mostrarVazio(true);
    return;
  }

  // Atualiza o resumo
  if (el.vagasResumo) {
    el.vagasResumo.textContent = `${resultados.length} vaga${resultados.length > 1 ? 's' : ''} encontrada${resultados.length > 1 ? 's' : ''}`;
  }

  // Cria cada cartão com delay escalonado para animação
  resultados.forEach((resultado, indice) => {
    const card = criarCardVaga(resultado, false);
    lista.appendChild(card);

    // Ativa a animação de entrada com delay escalonado
    setTimeout(() => {
      card.classList.add('visivel');
    }, indice * 80);
  });

  toggleSecao(el.secVagas, true);
}

// ─── Renderizar melhor vaga ───────────────────────────────────────────────────
/**
 * Renderiza a melhor vaga com estilo destacado no container correspondente.
 *
 * @param {import('./motor.js').ResultadoVaga | null} melhorVaga
 */
export function renderizarMelhorVaga(melhorVaga) {
  const container = el.melhorVagaContainer;
  if (!container || !melhorVaga) return;

  container.innerHTML = '';

  // Faixa de destaque
  const faixa = document.createElement('div');
  faixa.classList.add('melhor-vaga-faixa', 'animar-entrada');
  faixa.textContent = '🏆 Melhor compatibilidade para você';
  container.appendChild(faixa);

  // Card com classe especial de destaque
  const card = criarCardVaga(melhorVaga, true);
  // Torna visível imediatamente (sem delay)
  card.classList.add('visivel');
  container.appendChild(card);

  toggleSecao(el.secMelhorVaga, true);

  // Scroll suave até a seção
  setTimeout(() => {
    el.secMelhorVaga?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

// ─── Renderizar recomendações de estudo ──────────────────────────────────────
/**
 * Renderiza os pills de habilidades a estudar na seção de recomendação.
 *
 * @param {string[]}                                habilidades
 * @param {import('./motor.js').ResultadoVaga|null} melhorVaga
 */
export function renderizarRecomendacoes(habilidades, melhorVaga) {
  const container = el.listaRecomendacoes;
  if (!container) return;

  container.innerHTML = '';

  // Texto introdutório
  const intro = document.createElement('div');
  intro.classList.add('recomendacao-intro', 'animar-entrada');
  if (melhorVaga) {
    intro.innerHTML = `Para aumentar sua compatibilidade com a vaga <strong>${melhorVaga.vaga.cargo}</strong> na <strong>${melhorVaga.vaga.empresa}</strong> (${melhorVaga.porcentagem}%), você deve estudar:`;
  } else {
    intro.textContent = 'Você já possui todas as habilidades exigidas! Continue aprimorando seu perfil.';
  }
  container.appendChild(intro);

  if (habilidades.length === 0) {
    // Sem habilidades faltantes
    const semRec = document.createElement('div');
    semRec.classList.add('sem-recomendacoes', 'animar-entrada', 'delay-1');
    semRec.innerHTML = '🎉 Parabéns! Você possui todas as habilidades exigidas pela melhor vaga.';
    container.appendChild(semRec);
  } else {
    // Lista de pills
    const lista = document.createElement('div');
    lista.classList.add('recomendacoes-lista');
    lista.setAttribute('role', 'list');

    habilidades.forEach((hab, indice) => {
      const pill = document.createElement('span');
      pill.classList.add('skill-pill');
      pill.setAttribute('role', 'listitem');
      pill.setAttribute('aria-label', `Habilidade a estudar: ${hab}`);

      const ico = document.createElement('span');
      ico.classList.add('skill-pill__ico');
      ico.setAttribute('aria-hidden', 'true');
      ico.textContent = '📖';

      const texto = document.createElement('span');
      texto.textContent = hab.charAt(0).toUpperCase() + hab.slice(1);

      pill.appendChild(ico);
      pill.appendChild(texto);
      lista.appendChild(pill);

      // Animação escalonada
      setTimeout(() => {
        pill.classList.add('visivel');
      }, indice * 60 + 100);
    });

    container.appendChild(lista);
  }

  toggleSecao(el.secRecomendacao, true);
}

// ─── Criar cartão de vaga (função interna) ────────────────────────────────────
/**
 * Retorna um logotipo SVG estilizado e exclusivo com base no nome da empresa.
 *
 * @param {string} empresa - Nome da empresa.
 * @returns {string} Código SVG interno da empresa.
 */
function obterLogoSVG(empresa) {
  const norm = empresa.toLowerCase();
  
  if (norm.includes('techcorp')) {
    // Hexágono tecnológico (TechCorp)
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-logo svg-logo--blue" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
      </svg>`;
  }
  if (norm.includes('inovasoft')) {
    // Foguete / Infinito dinâmico (InovaSoft)
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-logo svg-logo--purple" aria-hidden="true">
        <path d="M4.5 16.5c-1.5-1.25-2.5-3-2.5-4.5 0-3 2.5-5.5 5.5-5.5 2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 5.5 2.5 5.5 5.5 0 1.5-1 3.25-2.5 4.5"></path>
        <path d="M12 7v10"></path>
      </svg>`;
  }
  if (norm.includes('inclusify')) {
    // Escudo com checkmark (Inclusify)
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-logo svg-logo--green" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
      </svg>`;
  }
  if (norm.includes('speedbuild')) {
    // Raio (SpeedBuild)
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-logo svg-logo--orange" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>`;
  }
  if (norm.includes('shopsmart')) {
    // Sacola de compras inteligente (ShopSmart)
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-logo svg-logo--pink" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>`;
  }
  
  // Genérico: Maleta
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="svg-logo svg-logo--cyan" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>`;
}

/**
 * Cria e retorna um elemento HTMLArticleElement representando uma vaga.
 * Utiliza: createElement, appendChild, classList, setAttribute.
 *
 * @param {import('./motor.js').ResultadoVaga} resultado
 * @param {boolean}                            destaque - true para card de melhor vaga.
 * @returns {HTMLElement}
 */
function criarCardVaga(resultado, destaque) {
  const { vaga, porcentagem, classificacao, encontradas, faltantes } = resultado;

  // ── Elemento raiz do card ──
  const card = document.createElement('article');
  card.classList.add('card-vaga');
  if (destaque) card.classList.add('card-vaga--destaque');
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `Vaga: ${vaga.cargo} na ${vaga.empresa}`);

  // ── Cabeçalho: logo, info, badge ──
  const cabecalho = document.createElement('div');
  cabecalho.classList.add('card-vaga__cabecalho');

  const logo = document.createElement('div');
  logo.classList.add('card-vaga__logo-empresa');
  logo.setAttribute('aria-hidden', 'true');
  logo.innerHTML = obterLogoSVG(vaga.empresa);

  const info = document.createElement('div');
  info.classList.add('card-vaga__info');

  const cargo = document.createElement('h3');
  cargo.classList.add('card-vaga__cargo');
  cargo.textContent = vaga.cargo;

  const empresa = document.createElement('span');
  empresa.classList.add('card-vaga__empresa');
  empresa.textContent = vaga.empresa;

  info.appendChild(cargo);
  info.appendChild(empresa);

  // Badge de classificação
  const badge = document.createElement('span');
  const classesBadge = {
    Alta:  'badge-classificacao--alta',
    Média: 'badge-classificacao--media',
    Baixa: 'badge-classificacao--baixa',
  };
  badge.classList.add('badge-classificacao', classesBadge[classificacao] || 'badge-classificacao--baixa');
  badge.setAttribute('aria-label', `Classificação: ${classificacao}`);
  badge.textContent = classificacao;

  cabecalho.appendChild(logo);
  cabecalho.appendChild(info);
  cabecalho.appendChild(badge);

  // ── Barra de compatibilidade ──
  const compatDiv = document.createElement('div');
  compatDiv.classList.add('card-vaga__compat');

  const compatInfo = document.createElement('div');
  compatInfo.classList.add('card-vaga__compat-info');

  const compatLabel = document.createElement('span');
  compatLabel.classList.add('card-vaga__compat-label');
  compatLabel.textContent = 'Compatibilidade';

  const compatPct = document.createElement('span');
  compatPct.classList.add('card-vaga__compat-pct');
  compatPct.textContent = `${porcentagem}%`;
  compatPct.setAttribute('aria-label', `${porcentagem} por cento de compatibilidade`);

  compatInfo.appendChild(compatLabel);
  compatInfo.appendChild(compatPct);

  const barra = document.createElement('div');
  barra.classList.add('barra-progresso');
  barra.setAttribute('role', 'progressbar');
  barra.setAttribute('aria-valuenow', porcentagem);
  barra.setAttribute('aria-valuemin', '0');
  barra.setAttribute('aria-valuemax', '100');
  barra.setAttribute('aria-label', `${porcentagem}% de compatibilidade`);

  const barraFill = document.createElement('div');
  const classesBarra = {
    Alta:  'barra-progresso__fill--alta',
    Média: 'barra-progresso__fill--media',
    Baixa: 'barra-progresso__fill--baixa',
  };
  barraFill.classList.add('barra-progresso__fill', classesBarra[classificacao] || 'barra-progresso__fill--baixa');
  // Anima a barra após um pequeno delay
  setTimeout(() => { barraFill.style.width = `${porcentagem}%`; }, 200);

  barra.appendChild(barraFill);
  compatDiv.appendChild(compatInfo);
  compatDiv.appendChild(barra);

  // ── Habilidades encontradas e faltantes ──
  const habsDiv = document.createElement('div');
  habsDiv.classList.add('card-vaga__habilidades');

  if (encontradas.length > 0) {
    const grupoEnc = _criarGrupoHabilidades(
      'Você tem:',
      encontradas,
      'tag--encontrada'
    );
    habsDiv.appendChild(grupoEnc);
  }

  if (faltantes.length > 0) {
    const grupoFal = _criarGrupoHabilidades(
      'Faltam:',
      faltantes,
      'tag--faltante'
    );
    habsDiv.appendChild(grupoFal);
  }

  // ── Meta: modalidade + salário ──
  const meta = document.createElement('div');
  meta.classList.add('card-vaga__meta');

  const metaMod = document.createElement('span');
  metaMod.classList.add('card-vaga__meta-item');
  metaMod.innerHTML = `<span aria-hidden="true">💼</span> ${vaga.modalidade}`;

  const metaSal = document.createElement('span');
  metaSal.classList.add('card-vaga__meta-item');
  metaSal.innerHTML = `<span aria-hidden="true">💰</span> ${vaga.salario}`;

  meta.appendChild(metaMod);
  meta.appendChild(metaSal);

  // ── Monta o card ──
  card.appendChild(cabecalho);
  card.appendChild(compatDiv);
  card.appendChild(habsDiv);
  card.appendChild(meta);

  return card;
}

// ─── Auxiliar: criar grupo de habilidades ────────────────────────────────────
/**
 * Cria um grupo de tags de habilidades com label.
 *
 * @param {string}   label    - Texto do grupo (ex: "Você tem:").
 * @param {string[]} itens    - Lista de habilidades.
 * @param {string}   cssClass - Classe CSS da tag (ex: "tag--encontrada").
 * @returns {HTMLElement}
 */
function _criarGrupoHabilidades(label, itens, cssClass) {
  const grupo = document.createElement('div');
  grupo.classList.add('card-vaga__hab-grupo');

  const labelEl = document.createElement('span');
  labelEl.classList.add('card-vaga__hab-label');
  labelEl.textContent = label;
  grupo.appendChild(labelEl);

  itens.forEach((hab) => {
    const tag = document.createElement('span');
    tag.classList.add('tag', cssClass);
    // Capitaliza a primeira letra
    tag.textContent = hab.charAt(0).toUpperCase() + hab.slice(1);
    grupo.appendChild(tag);
  });

  return grupo;
}

// ─── Controle do botão analisar ──────────────────────────────────────────────
/**
 * Altera o estado visual do botão "Analisar Perfil".
 * @param {boolean} carregando
 */
export function setBtnCarregando(carregando) {
  if (!el.btnAnalisar) return;
  if (carregando) {
    el.btnAnalisar.disabled = true;
    el.btnAnalisar.setAttribute('aria-disabled', 'true');
    el.btnAnalisar.innerHTML = '<span class="btn__ico" aria-hidden="true">⏳</span> Analisando...';
  } else {
    el.btnAnalisar.disabled = false;
    el.btnAnalisar.removeAttribute('aria-disabled');
    el.btnAnalisar.innerHTML = '<span class="btn__ico" aria-hidden="true">🔍</span> Analisar Perfil';
  }
}
