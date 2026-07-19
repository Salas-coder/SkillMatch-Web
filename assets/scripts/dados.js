const CHAVE_CANDIDATO = 'skillmatch_candidato';
const CAMINHO_VAGAS = './assets/dados/vagas.json';

export async function carregarVagas() {
  try {
    const resposta = await fetch(CAMINHO_VAGAS);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}: não foi possível carregar vagas.`);
    }

    const vagas = await resposta.json();
    console.info(`[dados] ${vagas.length} vagas carregadas.`);
    return vagas;

  } catch (erro) {
    console.error('[dados] Erro ao carregar vagas:', erro.message);
    throw erro;
  }
}

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

export function recuperarCandidato() {
  try {
    const raw = localStorage.getItem(CHAVE_CANDIDATO);
    if (!raw) return null;

    const candidato = JSON.parse(raw);
    console.info('[dados] Candidato recuperado do localStorage:', candidato.nome);
    return candidato;
  } catch (erro) {
    console.error('[dados] Erro ao recuperar candidato:', erro.message);
    return null;
  }
}

export const limparCandidatoPersistido = () => {
  localStorage.removeItem(CHAVE_CANDIDATO);
  console.info('[dados] Candidato removido do localStorage.');
};
