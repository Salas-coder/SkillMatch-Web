const normalizar = (str) => str.toLowerCase().trim();

class ComparadorHabilidades {
  constructor(candidato) {
    this.candidato = candidato;
    this.habilidadesCandidato = (candidato?.habilidades || []).map((hab) => normalizar(hab));
  }

  calcularCompatibilidade(vaga) {
    const requisitos = (vaga?.requisitos || []).map((req) => normalizar(req));
    const encontradas = requisitos.filter((req) => this.habilidadesCandidato.includes(req));
    const faltantes = requisitos.filter((req) => !this.habilidadesCandidato.includes(req));

    const totalAcertos = encontradas.reduce((acc) => acc + 1, 0);
    const porcentagem =
      requisitos.length > 0
        ? Math.round((totalAcertos / requisitos.length) * 100)
        : 0;

    return { porcentagem, encontradas, faltantes };
  }
}

class MotorSkillMatch extends ComparadorHabilidades {
  constructor(candidato) {
    super(candidato);
  }

  analisarVaga(vaga) {
    const { porcentagem, encontradas, faltantes } = this.calcularCompatibilidade(vaga);
    const classificacao = obterClassificacao(porcentagem);

    return {
      vaga,
      porcentagem,
      classificacao,
      encontradas,
      faltantes,
    };
  }

  recomendarHabilidades(vaga) {
    const { faltantes } = this.calcularCompatibilidade(vaga);
    return faltantes.filter((hab) => !this.habilidadesCandidato.includes(normalizar(hab)));
  }
}

export function calcularCompatibilidade(candidato, vaga) {
  const comparador = new MotorSkillMatch(candidato);
  return comparador.calcularCompatibilidade(vaga);
}

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

export function classificarVagas(candidato, vagas) {
  const motor = new MotorSkillMatch(candidato);
  const resultados = vagas.map((vaga) => motor.analisarVaga(vaga));

  return resultados.sort((a, b) => b.porcentagem - a.porcentagem);
}

export function encontrarMelhorVaga(resultados) {
  if (resultados.length === 0) return null;

  return resultados.reduce((melhor, atual) =>
    atual.porcentagem > melhor.porcentagem ? atual : melhor
  );
}

export function obterRecomendacoes(candidato, melhorVaga) {
  if (!melhorVaga || melhorVaga.faltantes.length === 0) return [];

  const motor = new MotorSkillMatch(candidato);
  const recomendacoes = motor.recomendarHabilidades(melhorVaga.vaga);
  const semDuplicatas = [...recomendacoes.reduce((set, hab) => {
    set.add(normalizar(hab));
    return set;
  }, new Set())];

  return semDuplicatas;
}

export const temTodasHabilidades = (candidato, vaga) => {
  const habsCandidato = candidato.habilidades.map(normalizar);
  return vaga.requisitos.every((req) => habsCandidato.includes(normalizar(req)));
};
