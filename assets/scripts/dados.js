/**
 * dados.js — Módulo de dados
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsabilidade: carregar vagas via fetch e persistir/recuperar o candidato
 * com localStorage. Exporta tipos, dados e funções de acesso a dados.
 *
 * Conceitos utilizados:
 *   - async/await, try/catch, fetch
 *   - localStorage, JSON.stringify(), JSON.parse()
 *   - Arrow functions, funções normais
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Chave usada para persistir o candidato no localStorage. */
const CHAVE_CANDIDATO = 'skillmatch_candidato';

/** Caminho para o arquivo JSON de vagas. */
const CAMINHO_VAGAS = './assets/dados/vagas.json';

// ─── Typedef: Candidato ───────────────────────────────────────────────────────
/**
 * @typedef {Object} Candidato
 * @property {string}   nome             - Nome completo do candidato.
 * @property {string}   area             - Área de interesse profissional.
 * @property {string[]} habilidades      - Array de habilidades técnicas (lowercase, sem espaços extras).
 * @property {number}   experienciaMeses - Meses de experiência profissional.
 */

// ─── Typedef: Vaga ───────────────────────────────────────────────────────────
/**
 * @typedef {Object} Vaga
 * @property {number}   id         - Identificador único.
 * @property {string}   empresa    - Nome da empresa.
 * @property {string}   cargo      - Nome do cargo.
 * @property {string}   modalidade - Modalidade de trabalho (Remoto / Híbrido / Presencial).
 * @property {string}   salario    - Faixa salarial (ex: "R$ 2.800").
 * @property {string[]} requisitos - Habilidades técnicas exigidas (lowercase).
 * @property {string}   descricao  - Descrição resumida da vaga.
 */

// ─── Carregar vagas ───────────────────────────────────────────────────────────
/**
 * Carrega o listado de vagas a partir do arquivo JSON local.
 * Utiliza fetch + async/await + try/catch.
 *
 * @returns {Promise<Vaga[]>} Array de vagas ou array vazio em caso de erro.
 */
export async function carregarVagas() {
  try {
    const resposta = await fetch(CAMINHO_VAGAS);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}: não foi possível carregar vagas.`);
    }

    /** @type {Vaga[]} */
    const vagas = await resposta.json();
    console.info(`[dados] ${vagas.length} vagas carregadas com sucesso.`);
    return vagas;

  } catch (erro) {
    console.error('[dados] Erro ao carregar vagas:', erro.message);
    // Propaga o erro para que main.js possa exibir o estado de erro na UI
    throw erro;
  }
}

// ─── Persistência com localStorage ───────────────────────────────────────────

/**
 * Salva o objeto candidato no localStorage usando JSON.stringify().
 *
 * @param {Candidato} candidato - Objeto candidato a persistir.
 * @returns {boolean} true se salvou com sucesso, false em caso de erro.
 */
export function salvarCandidato(candidato) {
  try {
    const json = JSON.stringify(candidato);
    localStorage.setItem(CHAVE_CANDIDATO, json);
    console.info('[dados] Candidato salvo no localStorage:', candidato.nome);
    return true;
  } catch (erro) {
    console.error('[dados] Erro ao salvar candidato:', erro.message);
    return false;
  }
}

/**
 * Recupera o candidato salvo no localStorage usando JSON.parse().
 *
 * @returns {Candidato|null} Candidato recuperado ou null se não existir.
 */
export function recuperarCandidato() {
  try {
    const raw = localStorage.getItem(CHAVE_CANDIDATO);
    if (!raw) return null;

    /** @type {Candidato} */
    const candidato = JSON.parse(raw);
    console.info('[dados] Candidato recuperado do localStorage:', candidato.nome);
    return candidato;
  } catch (erro) {
    console.error('[dados] Erro ao recuperar candidato:', erro.message);
    return null;
  }
}

/**
 * Remove o candidato salvo do localStorage.
 */
export const limparCandidatoPersistido = () => {
  localStorage.removeItem(CHAVE_CANDIDATO);
  console.info('[dados] Candidato removido do localStorage.');
};
