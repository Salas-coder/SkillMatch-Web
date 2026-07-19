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
  initCarousel,
} from './ui.js';

const inicializarApp = () => {
  console.info('[main] SkillMatch Web iniciado.');

  atualizarAnoFooter();

  const candidatoSalvo = recuperarCandidato();
  if (candidatoSalvo) {
    preencherFormulario(candidatoSalvo);
  }

  initScrollReveal();
  initCarousel();
  registrarFormulario();
  registrarBtnTentarNovamente();
};

const registrarFormulario = () => {
  if (!el.form) {
    console.warn('[main] Formulário não encontrado.');
    return;
  }
  el.form.addEventListener('submit', manejarSubmit);
};

const registrarBtnTentarNovamente = () => {
  const btn = document.getElementById('btn-tentar-novamente');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (el.form) {
      el.form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });
};

async function manejarSubmit(evento) {
  evento.preventDefault();

  const nome = el.inputNome?.value ?? '';
  const area = el.inputArea?.value ?? '';
  const habs = el.inputHabs?.value ?? '';
  const exp  = el.inputExp?.value  ?? '';

  if (!validarFormulario(nome, area, habs, exp)) return;

  const candidato = construirCandidato(nome, area, habs, exp);

  console.group('[main] Objeto candidato criado:');
  console.log(candidato);
  console.groupEnd();

  salvarCandidato(candidato);
  await analisarPerfil(candidato);
}

function construirCandidato(nome, area, habs, exp) {
  const habilidades = habs
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter((h) => h.length > 0);

  return {
    nome: nome.trim(),
    area: area.trim(),
    habilidades,
    experienciaMeses: Number(exp),
  };
}

async function analisarPerfil(candidato) {
  console.info(`[main] Iniciando análise para: ${candidato.nome}`);

  toggleSecao(el.secVagas, true);
  mostrarLoading(true);
  setBtnCarregando(true);

  try {
    const vagas = await carregarVagas();
    const vagasClassificadas = classificarVagas(candidato, vagas);
    const melhorVaga = encontrarMelhorVaga(vagasClassificadas);
    const recomendacoes = obterRecomendacoes(candidato, melhorVaga);

    console.group('[main] Resultado da análise:');
    console.log('Vagas classificadas:', vagasClassificadas);
    console.log('Melhor vaga:', melhorVaga);
    console.log('Recomendações:', recomendacoes);
    console.groupEnd();

    renderizarVagas(vagasClassificadas);

    if (melhorVaga) {
      renderizarMelhorVaga(melhorVaga);
    }

    renderizarRecomendacoes(recomendacoes, melhorVaga);

    setTimeout(() => {
      el.secVagas?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

  } catch (erro) {
    console.error('[main] Erro durante a análise:', erro.message);
    mostrarLoading(false);
    mostrarErroVagas(true, `Não foi possível carregar as vagas: ${erro.message}`);
  } finally {
    mostrarLoading(false);
    setBtnCarregando(false);
  }
}

inicializarApp();
