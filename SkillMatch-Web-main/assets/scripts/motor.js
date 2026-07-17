/**
 * motor.js — Motor de compatibilidade SkillMatch
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsabilidade: calcular compatibilidade, classificar vagas, encontrar a
 * melhor vaga e gerar recomendações de estudo.
 *
 * Conceitos utilizados:
 *   - Objetos e Arrays
 *   - Métodos: map, filter, reduce, find, every
 *   - Arrow functions e funções normais
 *   - Condicional: if/else, ternário, switch
 *   - Set (para deduplicar habilidades)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Typedef: ResultadoVaga ───────────────────────────────────────────────────
/**
 * @typedef {Object} ResultadoVaga
 * @property {import('./dados.js').Vaga}     vaga              - Dados da vaga.
 * @property {number}                         porcentagem       - Compatibilidade (0–100).
 * @property {string}                         classificacao     - "Alta" | "Média" | "Baixa".
 * @property {string[]}                       encontradas       - Habilidades que o candidato já tem.
 * @property {string[]}                       faltantes         - Habilidades que o candidato não tem.
 */

// ─── Normalização de string ───────────────────────────────────────────────────
/**
 * Normaliza uma string para comparação:
 * converte para minúsculas e remove espaços extras.
 *
 * @param {string} str
 * @returns {string}
 */
const normalizar = (str) => str.toLowerCase().trim();

// ─── Calcular compatibilidade ─────────────────────────────────────────────────
/**
 * Calcula o porcentagem de compatibilidade entre um candidato e uma vaga.
 *
 * Fórmula: (habilidades encontradas ÷ total de requisitos) × 100
 *
 * Utiliza: filter, map, reduce
 *
 * @param {import('./dados.js').Candidato} candidato
 * @param {import('./dados.js').Vaga}      vaga
 * @returns {{ porcentagem: number, encontradas: string[], faltantes: string[] }}
 */
export function calcularCompatibilidade(candidato, vaga) {
  // Normaliza as habilidades do candidato para comparação uniforme
  const habsCandidato = candidato.habilidades.map(normalizar);

  // Normaliza os requisitos da vaga
  const requisitos = vaga.requisitos.map(normalizar);

  // Habilidades que o candidato já possui (filter)
  const encontradas = requisitos.filter((req) => habsCandidato.includes(req));

  // Habilidades que o candidato ainda não tem (filter)
  const faltantes = requisitos.filter((req) => !habsCandidato.includes(req));

  // Calcula a porcentagem via reduce (soma de acertos / total de requisitos)
  const totalAcertos = encontradas.reduce((acc) => acc + 1, 0);
  const porcentagem =
    requisitos.length > 0
      ? Math.round((totalAcertos / requisitos.length) * 100)
      : 0;

  return { porcentagem, encontradas, faltantes };
}

// ─── Obter classificação ──────────────────────────────────────────────────────
/**
 * Retorna a classificação textual com base na porcentagem.
 *
 * Critérios:
 *   Alta  → 80–100%
 *   Média → 50–79%
 *   Baixa → 0–49%
 *
 * Utiliza: switch
 *
 * @param {number} porcentagem
 * @returns {"Alta" | "Média" | "Baixa"}
 */
export function obterClassificacao(porcentagem) {
  switch (true) {
    case porcentagem >= 80:
      return 'Alta';
    case porcentagem >= 50:
      return 'Média';
    default:
      return 'Baixa';
  }
}

// ─── Classificar vagas ────────────────────────────────────────────────────────
/**
 * Processa todas as vagas, calcula compatibilidade e retorna ordenado
 * de maior para menor porcentagem.
 *
 * Utiliza: map, sort
 *
 * @param {import('./dados.js').Candidato} candidato
 * @param {import('./dados.js').Vaga[]}    vagas
 * @returns {ResultadoVaga[]}
 */
export function classificarVagas(candidato, vagas) {
  // map: transforma cada vaga em um ResultadoVaga
  const resultados = vagas.map((vaga) => {
    const { porcentagem, encontradas, faltantes } = calcularCompatibilidade(candidato, vaga);
    const classificacao = obterClassificacao(porcentagem);

    return {
      vaga,
      porcentagem,
      classificacao,
      encontradas,
      faltantes,
    };
  });

  // sort: ordena por porcentagem decrescente
  return resultados.sort((a, b) => b.porcentagem - a.porcentagem);
}

// ─── Encontrar melhor vaga ────────────────────────────────────────────────────
/**
 * Retorna o resultado com maior porcentagem de compatibilidade.
 *
 * Utiliza: reduce
 *
 * @param {ResultadoVaga[]} resultados - Array já classificado.
 * @returns {ResultadoVaga | null}
 */
export function encontrarMelhorVaga(resultados) {
  if (resultados.length === 0) return null;

  // reduce: percorre todos e mantém o de maior porcentagem
  return resultados.reduce((melhor, atual) =>
    atual.porcentagem > melhor.porcentagem ? atual : melhor
  );
}

// ─── Obter recomendações de estudo ────────────────────────────────────────────
/**
 * Retorna as habilidades que o candidato NÃO tem, mas a melhor vaga exige.
 * Remove duplicatas usando Set.
 *
 * Utiliza: filter, reduce, Set
 *
 * @param {import('./dados.js').Candidato} candidato
 * @param {ResultadoVaga | null}           melhorVaga
 * @returns {string[]} Lista de habilidades únicas para estudar.
 */
export function obterRecomendacoes(candidato, melhorVaga) {
  if (!melhorVaga || melhorVaga.faltantes.length === 0) return [];

  // Normaliza as habilidades do candidato
  const habsCandidato = candidato.habilidades.map(normalizar);

  // filter: apenas habilidades que o candidato não tem na melhor vaga
  // Set: garante que não há duplicatas
  const unicas = melhorVaga.faltantes.filter(
    (hab) => !habsCandidato.includes(normalizar(hab))
  );

  // reduce com Set para deduplicar (demonstração do uso de reduce + Set)
  const semDuplicatas = [...unicas.reduce((set, hab) => {
    set.add(normalizar(hab));
    return set;
  }, new Set())];

  return semDuplicatas;
}

// ─── Verificar se o candidato já tem todas as habilidades ────────────────────
/**
 * Verifica se o candidato possui TODAS as habilidades de uma vaga.
 * Utiliza: every
 *
 * @param {import('./dados.js').Candidato} candidato
 * @param {import('./dados.js').Vaga}      vaga
 * @returns {boolean}
 */
export const temTodasHabilidades = (candidato, vaga) => {
  const habsCandidato = candidato.habilidades.map(normalizar);
  return vaga.requisitos.every((req) => habsCandidato.includes(normalizar(req)));
};
