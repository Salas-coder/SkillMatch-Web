/**
 * main.js — Ponto de entrada da aplicação SkillMatch Web
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsabilidade: inicializar a aplicação, registrar event listeners e
 * coordenar os módulos dados.js, motor.js e ui.js.
 *
 * Conceitos utilizados:
 *   - import / export (módulos ES)
 *   - addEventListener, preventDefault
 *   - async / await, try / catch
 *   - Objetos, Arrow functions
 *   - localStorage (via dados.js)
 *   - Manipulação do DOM (via ui.js)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Importações de módulos ───────────────────────────────────────────────────
import {
  carregarVagas,
  salvarCandidato,
  recuperarCandidato,
} from './dados.js';

import {
  classificarVagas,
  encontrarMelhorVaga,
  obterRecomendacoes,
} from './motor.js';

import {
  el,
  atualizarAnoFooter,
  validarFormulario,
  preencherFormulario,
  renderizarVagas,
  renderizarMelhorVaga,
  renderizarRecomendacoes,
  mostrarLoading,
  mostrarErroVagas,
  toggleSecao,
  setBtnCarregando,
  initScrollReveal,
} from './ui.js';

// ─── Inicialização da aplicação ───────────────────────────────────────────────
/**
 * Função principal — inicializa a aplicação assim que o módulo carrega.
 * Os módulos ES garantem que o DOM já está disponível (comportamento defer).
 */
const inicializarApp = () => {
  console.info('[main] SkillMatch Web iniciado. ✅');

  // 1. Atualiza o ano no footer
  atualizarAnoFooter();

  // 2. Recupera candidato salvo e preenche o formulário automaticamente
  const candidatoSalvo = recuperarCandidato();
  if (candidatoSalvo) {
    preencherFormulario(candidatoSalvo);
    console.info('[main] Perfil restaurado do localStorage.');
  }

  // 3. Inicializa scroll reveal animations
  initScrollReveal();

  // 4. Registra o evento de submit do formulário
  registrarFormulario();

  // 5. Registra o botão "Tentar novamente" do estado de erro
  registrarBtnTentarNovamente();
};

// ─── Registro do formulário ───────────────────────────────────────────────────
/**
 * Registra o evento submit no formulário do candidato.
 */
const registrarFormulario = () => {
  if (!el.form) {
    console.warn('[main] Formulário #form-candidato não encontrado no DOM.');
    return;
  }

  el.form.addEventListener('submit', manejarSubmit);
  console.info('[main] Evento de submit registrado no formulário.');
};

// ─── Botão "Tentar novamente" ─────────────────────────────────────────────────
/**
 * Permite ao usuário tentar carregar as vagas novamente após um erro.
 */
const registrarBtnTentarNovamente = () => {
  const btn = document.getElementById('btn-tentar-novamente');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Re-submete o formulário se os dados ainda estiverem preenchidos
    if (el.form) {
      el.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });
};

// ─── Manejador do submit ──────────────────────────────────────────────────────
/**
 * Callback do evento submit. Captura os dados, valida e dispara o análise.
 *
 * @param {SubmitEvent} evento
 */
async function manejarSubmit(evento) {
  // Previne o comportamento padrão do formulário (recarregar a página)
  evento.preventDefault();

  // Lê os valores dos campos
  const nome = el.inputNome?.value ?? '';
  const area = el.inputArea?.value ?? '';
  const habs = el.inputHabs?.value ?? '';
  const exp  = el.inputExp?.value  ?? '';

  // Valida os campos obrigatórios
  const valido = validarFormulario(nome, area, habs, exp);
  if (!valido) {
    console.warn('[main] Formulário inválido. Análise cancelada.');
    return;
  }

  // Constrói o objeto candidato
  const candidato = construirCandidato(nome, area, habs, exp);

  // Exibe no console para verificação (requisito da Etapa 1 mantido)
  console.group('[main] Objeto candidato criado:');
  console.log(candidato);
  console.groupEnd();

  // Salva no localStorage
  salvarCandidato(candidato);

  // Executa o análise completo
  await analisarPerfil(candidato);
}

// ─── Construção do objeto candidato ──────────────────────────────────────────
/**
 * Normaliza os dados do formulário e retorna o objeto candidato.
 *
 * As habilidades são convertidas de string para array:
 *   "HTML, CSS, JS" → ["html", "css", "js"]
 *
 * @param {string} nome - Nome completo.
 * @param {string} area - Área de interesse.
 * @param {string} habs - Habilidades separadas por vírgula.
 * @param {string} exp  - Meses de experiência (string).
 * @returns {import('./dados.js').Candidato}
 */
function construirCandidato(nome, area, habs, exp) {
  // Converte habilidades: split + map + filter — três métodos de array
  const habilidades = habs
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter((h) => h.length > 0);

  return {
    nome:             nome.trim(),
    area:             area.trim(),
    habilidades,
    experienciaMeses: Number(exp),
  };
}

// ─── Análise do perfil ────────────────────────────────────────────────────────
/**
 * Orquestra todo o fluxo de análise:
 * 1. Carrega vagas (fetch)
 * 2. Classifica as vagas por compatibilidade
 * 3. Encontra a melhor vaga
 * 4. Gera recomendações de estudo
 * 5. Renderiza todos os resultados na UI
 *
 * @param {import('./dados.js').Candidato} candidato
 */
async function analisarPerfil(candidato) {
  console.info(`[main] Iniciando análise para: ${candidato.nome}`);

  // Exibe a seção de vagas e o estado de carregamento
  toggleSecao(el.secVagas, true);
  mostrarLoading(true);
  setBtnCarregando(true);

  try {
    // 1. Carrega as vagas via fetch (dados.js)
    const vagas = await carregarVagas();

    // 2. Classifica todas as vagas por compatibilidade (motor.js)
    //    Usa: map, filter, reduce, sort (internamente em motor.js)
    const vagasClassificadas = classificarVagas(candidato, vagas);

    // 3. Encontra a melhor vaga (motor.js)
    //    Usa: reduce internamente em motor.js
    const melhorVaga = encontrarMelhorVaga(vagasClassificadas);

    // 4. Gera as recomendações com base na melhor vaga (motor.js)
    //    Usa: filter, Set, reduce internamente em motor.js
    const recomendacoes = obterRecomendacoes(candidato, melhorVaga);

    // Exibe os resultados no console para verificação
    console.group('[main] Resultado da análise:');
    console.log('Vagas classificadas:', vagasClassificadas);
    console.log('Melhor vaga:', melhorVaga);
    console.log('Recomendações:', recomendacoes);
    console.groupEnd();

    // 5. Renderiza as vagas (ui.js)
    renderizarVagas(vagasClassificadas);

    // 6. Renderiza a melhor vaga (ui.js)
    if (melhorVaga) {
      renderizarMelhorVaga(melhorVaga);
    }

    // 7. Renderiza as recomendações de estudo (ui.js)
    renderizarRecomendacoes(recomendacoes, melhorVaga);

    // Scroll suave até a seção de vagas
    setTimeout(() => {
      el.secVagas?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

  } catch (erro) {
    // Trata erros de fetch ou processamento
    console.error('[main] Erro durante a análise:', erro.message);
    mostrarLoading(false);
    mostrarErroVagas(true, `Não foi possível carregar as vagas: ${erro.message}`);
  } finally {
    // Sempre remove o estado de carregamento e reabilita o botão
    mostrarLoading(false);
    setBtnCarregando(false);
  }
}

// ─── Arranque ─────────────────────────────────────────────────────────────────
// Os módulos ES são executados após o parsing do HTML (equivalente a defer),
// portanto o DOM está disponível quando este código é executado.
inicializarApp();
