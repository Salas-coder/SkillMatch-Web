export const el = {
  form:           document.getElementById('form-candidato'),
  inputNome:      document.getElementById('input-nome'),
  inputArea:      document.getElementById('input-area'),
  inputHabs:      document.getElementById('input-habilidades'),
  inputExp:       document.getElementById('input-experiencia'),
  btnAnalisar:    document.getElementById('btn-analisar'),
  erroNome:       document.getElementById('erro-nome'),
  erroArea:       document.getElementById('erro-area'),
  erroHabs:       document.getElementById('erro-habilidades'),
  erroExp:        document.getElementById('erro-experiencia'),
  secVagas:          document.getElementById('vagas'),
  secMelhorVaga:     document.getElementById('melhor-vaga'),
  secRecomendacao:   document.getElementById('recomendacao'),
  listaVagas:           document.getElementById('lista-vagas'),
  melhorVagaContainer:  document.getElementById('melhor-vaga-container'),
  listaRecomendacoes:   document.getElementById('lista-recomendacoes'),
  vagasLoading:  document.getElementById('vagas-loading'),
  vagasErro:     document.getElementById('vagas-erro'),
  vagasErroMsg:  document.getElementById('vagas-erro-msg'),
  vagasVazio:    document.getElementById('vagas-vazio'),
  vagasResumo:   document.getElementById('vagas-resumo'),
  footerAno: document.getElementById('footer-ano'),
};

export const atualizarAnoFooter = () => {
  if (el.footerAno) {
    el.footerAno.textContent = new Date().getFullYear();
  }
};

export function exibirErro(input, erroEl, msg) {
  if (input)  input.classList.add('invalido');
  if (erroEl) erroEl.textContent = msg;
}

export function limparErro(input, erroEl) {
  if (input)  input.classList.remove('invalido');
  if (erroEl) erroEl.textContent = '';
}

export function limparTodosErros() {
  limparErro(el.inputNome, el.erroNome);
  limparErro(el.inputArea, el.erroArea);
  limparErro(el.inputHabs, el.erroHabs);
  limparErro(el.inputExp,  el.erroExp);
}

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

export function preencherFormulario(candidato) {
  if (!candidato) return;

  if (el.inputNome) el.inputNome.value = candidato.nome;
  if (el.inputArea) el.inputArea.value = candidato.area;
  if (el.inputHabs) el.inputHabs.value = candidato.habilidades.join(', ');
  if (el.inputExp)  el.inputExp.value  = candidato.experienciaMeses;

  console.info('[ui] Formulário preenchido com dados do localStorage.');
}

export function toggleSecao(secao, visivel) {
  if (!secao) return;
  if (visivel) {
    secao.removeAttribute('hidden');
  } else {
    secao.setAttribute('hidden', '');
  }
}

export const mostrarLoading = (mostrar) => {
  if (el.vagasLoading) {
    mostrar
      ? el.vagasLoading.removeAttribute('hidden')
      : el.vagasLoading.setAttribute('hidden', '');
  }
};

export const mostrarErroVagas = (mostrar, msg = '') => {
  if (el.vagasErro) {
    mostrar
      ? el.vagasErro.removeAttribute('hidden')
      : el.vagasErro.setAttribute('hidden', '');
  }
  if (el.vagasErroMsg && msg) el.vagasErroMsg.textContent = msg;
};

export const mostrarVazio = (mostrar) => {
  if (el.vagasVazio) {
    mostrar
      ? el.vagasVazio.removeAttribute('hidden')
      : el.vagasVazio.setAttribute('hidden', '');
  }
};

export const ocultarEstados = () => {
  mostrarLoading(false);
  mostrarErroVagas(false);
  mostrarVazio(false);
};

export function renderizarVagas(resultados) {
  const lista = el.listaVagas;
  if (!lista) return;

  lista.innerHTML = '';
  ocultarEstados();

  if (resultados.length === 0) {
    mostrarVazio(true);
    return;
  }

  if (el.vagasResumo) {
    el.vagasResumo.textContent = `${resultados.length} vaga${resultados.length > 1 ? 's' : ''} encontrada${resultados.length > 1 ? 's' : ''}`;
  }

  resultados.forEach((resultado, indice) => {
    const card = criarCardVaga(resultado, false);
    lista.appendChild(card);

    setTimeout(() => {
      card.classList.add('visivel');
    }, indice * 80);
  });

  toggleSecao(el.secVagas, true);
}

export function renderizarMelhorVaga(melhorVaga) {
  const container = el.melhorVagaContainer;
  if (!container || !melhorVaga) return;

  container.innerHTML = '';

  const faixa = document.createElement('div');
  faixa.classList.add('melhor-vaga-faixa', 'animar-entrada');
  faixa.textContent = '🏆 Melhor compatibilidade para você';
  container.appendChild(faixa);

  const card = criarCardVaga(melhorVaga, true);
  card.classList.add('visivel');
  container.appendChild(card);

  toggleSecao(el.secMelhorVaga, true);

  setTimeout(() => {
    el.secMelhorVaga?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 150);
}

export function renderizarRecomendacoes(habilidades, melhorVaga) {
  const container = el.listaRecomendacoes;
  if (!container) return;

  container.innerHTML = '';

  const intro = document.createElement('div');
  intro.classList.add('recomendacao-intro', 'animar-entrada');
  if (melhorVaga) {
    intro.innerHTML = `Para aumentar sua compatibilidade com a vaga <strong>${melhorVaga.vaga.cargo}</strong> na <strong>${melhorVaga.vaga.empresa}</strong> (${melhorVaga.porcentagem}%), você deve estudar:`;
  } else {
    intro.textContent = 'Você já possui todas as habilidades exigidas! Continue aprimorando seu perfil.';
  }
  container.appendChild(intro);

  if (habilidades.length === 0) {
    const semRec = document.createElement('div');
    semRec.classList.add('sem-recomendacoes', 'animar-entrada', 'delay-1');
    semRec.innerHTML = '🎉 Parabéns! Você possui todas as habilidades exigidas pela melhor vaga.';
    container.appendChild(semRec);
  } else {
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

      setTimeout(() => {
        pill.classList.add('visivel');
      }, indice * 60 + 100);
    });

    container.appendChild(lista);
  }

  toggleSecao(el.secRecomendacao, true);
}

function obterLogoSVG(empresa) {
  const norm = empresa.toLowerCase();

  if (norm.includes('techcorp')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--blue" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor" fill-opacity="0.15"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/><circle cx="12" cy="12" r="2.5" fill="currentColor" fill-opacity="0.5"/></svg>`;
  }
  if (norm.includes('inovasoft')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--purple" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity="0.08"/><path d="M9 9c1.5-2 3-3 5-3 3 0 5.5 2.5 5.5 5.5 0 1.5-1 3.25-2.5 4.5M15 15c-1.5 1.25-2.5 3-2.5 4.5 0 3-2.5 5.5-5.5 5.5C4 25 2 22.5 2 19.5c0-1.5 1-3.25 2.5-4.5"/><circle cx="9" cy="15" r="2" fill="currentColor" fill-opacity="0.4"/></svg>`;
  }
  if (norm.includes('inclusify')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--green" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fill-opacity="0.12"/><path d="m9 12 2 2 4-4" stroke-width="3"/></svg>`;
  }
  if (norm.includes('speedbuild')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--orange" aria-hidden="true"><rect x="2" y="3" width="20" height="18" rx="4" fill="currentColor" fill-opacity="0.06"/><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fill-opacity="0.2"/></svg>`;
  }
  if (norm.includes('shopsmart')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--pink" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" fill="currentColor" fill-opacity="0.08"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0" stroke-width="2.5"/></svg>`;
  }
  if (norm.includes('pixelstudio')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--purple" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" fill-opacity="0.08"/><circle cx="12" cy="12" r="3" fill="currentColor" fill-opacity="0.15"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`;
  }
  if (norm.includes('codebridge')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--blue" aria-hidden="true"><polyline points="16 18 22 12 16 6" fill="currentColor" fill-opacity="0.06"/><polyline points="8 6 2 12 8 18" fill="currentColor" fill-opacity="0.06"/><line x1="10" y1="3" x2="14" y2="21"/></svg>`;
  }
  if (norm.includes('openweb')) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--green" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.06"/><ellipse cx="12" cy="12" rx="4" ry="10" fill="currentColor" fill-opacity="0.08"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`;
  }

  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="svg-logo svg-logo--cyan" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" fill="currentColor" fill-opacity="0.06"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" fill="currentColor" fill-opacity="0.08"/></svg>`;
}

function criarCardVaga(resultado, destaque) {
  const { vaga, porcentagem, classificacao, encontradas, faltantes } = resultado;

  const card = document.createElement('article');
  card.classList.add('card-vaga');
  if (destaque) card.classList.add('card-vaga--destaque');
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `Vaga: ${vaga.cargo} na ${vaga.empresa}`);

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

  const badge = document.createElement('span');
  const classesBadge = {
    Alta:  'badge-classificacao--alta',
    Média: 'badge-classificacao--media',
    Baixa: 'badge-classificacao--baixa',
  };
  badge.classList.add('badge-classificacao', classesBadge[classificacao] || 'badge-classificacao--baixa');
  badge.textContent = classificacao;

  cabecalho.appendChild(logo);
  cabecalho.appendChild(info);
  cabecalho.appendChild(badge);

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

  compatInfo.appendChild(compatLabel);
  compatInfo.appendChild(compatPct);

  const barra = document.createElement('div');
  barra.classList.add('barra-progresso');
  barra.setAttribute('role', 'progressbar');
  barra.setAttribute('aria-valuenow', porcentagem);
  barra.setAttribute('aria-valuemin', '0');
  barra.setAttribute('aria-valuemax', '100');

  const barraFill = document.createElement('div');
  const classesBarra = {
    Alta:  'barra-progresso__fill--alta',
    Média: 'barra-progresso__fill--media',
    Baixa: 'barra-progresso__fill--baixa',
  };
  barraFill.classList.add('barra-progresso__fill', classesBarra[classificacao] || 'barra-progresso__fill--baixa');
  setTimeout(() => { barraFill.style.width = `${porcentagem}%`; }, 200);

  barra.appendChild(barraFill);
  compatDiv.appendChild(compatInfo);
  compatDiv.appendChild(barra);

  const habsDiv = document.createElement('div');
  habsDiv.classList.add('card-vaga__habilidades');

  if (encontradas.length > 0) {
    const grupoEnc = _criarGrupoHabilidades('Você tem:', encontradas, 'tag--encontrada');
    habsDiv.appendChild(grupoEnc);
  }

  if (faltantes.length > 0) {
    const grupoFal = _criarGrupoHabilidades('Faltam:', faltantes, 'tag--faltante');
    habsDiv.appendChild(grupoFal);
  }

  const meta = document.createElement('div');
  meta.classList.add('card-vaga__meta');

  const metaMod = document.createElement('span');
  metaMod.classList.add('card-vaga__meta-item', 'card-vaga__meta-item--modalidade');
  const modalidadeIcon = vaga.modalidade === 'Remoto' ? '🌐' : vaga.modalidade === 'Híbrido' ? '🏢' : '📍';
  metaMod.innerHTML = `${modalidadeIcon} ${vaga.modalidade}`;

  const metaSal = document.createElement('span');
  metaSal.classList.add('card-vaga__meta-item', 'card-vaga__meta-item--salario');
  metaSal.innerHTML = `💰 ${vaga.salario}`;

  meta.appendChild(metaMod);
  meta.appendChild(metaSal);

  card.appendChild(cabecalho);
  card.appendChild(compatDiv);
  card.appendChild(habsDiv);
  card.appendChild(meta);

  return card;
}

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
    tag.textContent = hab.charAt(0).toUpperCase() + hab.slice(1);
    grupo.appendChild(tag);
  });

  return grupo;
}

export function setBtnCarregando(carregando) {
  if (!el.btnAnalisar) return;
  if (carregando) {
    el.btnAnalisar.disabled = true;
    el.btnAnalisar.innerHTML = '<span class="btn__ico">⏳</span> Analisando...';
  } else {
    el.btnAnalisar.disabled = false;
    el.btnAnalisar.innerHTML = '<span class="btn__ico">🔍</span> Analisar Perfil';
  }
}

export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

export function initCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !dotsContainer) return;

  const slides = track.children;
  if (slides.length === 0) return;

  let current = 0;

  const updateDots = () => {
    const dots = dotsContainer.querySelectorAll('.steps-carousel__dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('steps-carousel__dot--ativo', i === current);
    });
  };

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.classList.add('steps-carousel__dot');
    if (i === 0) dot.classList.add('steps-carousel__dot--ativo');
    dot.setAttribute('aria-label', `Ir para passo ${i + 1}`);
    dot.addEventListener('click', () => {
      current = i;
      track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      updateDots();
    });
    dotsContainer.appendChild(dot);
  }

  const prevBtn = document.querySelector('.steps-carousel__btn--prev');
  const nextBtn = document.querySelector('.steps-carousel__btn--next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (current > 0) current--;
      track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      updateDots();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (current < slides.length - 1) current++;
      track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: 'smooth' });
      updateDots();
    });
  }
}
