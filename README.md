# SkillMatch Web.

Plataforma de matching profissional para vagas de Front-End Júnior.

## Descrição

SkillMatch Web é uma Single Page Application desenvolvida com HTML, CSS e JavaScript puro (ES Modules). O sistema permite que um candidato cadastre seu perfil profissional e tenha sua compatibilidade calculada automaticamente com um catálogo de vagas de Front-End Júnior, utilizando a fórmula:

(Habilidades encontradas ÷ Total de requisitos) × 100

## Problema que resolve

Candidatos iniciantes em Front-End têm dificuldade em identificar quais vagas são mais compatíveis com o seu perfil e quais habilidades precisam desenvolver. O SkillMatch Web automatiza essa análise, economizando tempo e direcionando os estudos.

## Objetivo

Comparar automaticamente o perfil do candidato com as vagas disponíveis, calcular a compatibilidade, classificar os resultados e recomendar habilidades a serem estudadas.

## Funcionalidades

- Formulário completo com validação inline
- Cálculo automático de compatibilidade (0% a 100%)
- Classificação em Alta, Média ou Baixa
- Destaque visual da melhor vaga
- Recomendação personalizada de estudos
- Cartões de vagas gerados dinamicamente
- Persistência de dados com localStorage
- Design responsivo e Mobile First
- Uso de módulos ES e carrega de dados via fetch

## Tecnologias utilizadas

- HTML5 semântico
- CSS3 com Flexbox
- JavaScript ES6+ puro
- Fetch API
- LocalStorage
- Módulos ES (import/export)

## Estrutura do projeto

```text
skillmatch-web/
├── index.html
├── README.md
├── assets/
│   ├── styles/
│   │   └── index.style.css
│   ├── scripts/
│   │   ├── main.js
│   │   ├── motor.js
│   │   ├── dados.js
│   │   └── ui.js
│   ├── dados/
│   │   └── vagas.json
│   └── img/
```

## Como executar

1. Clone o repositório.
2. Acesse a pasta do projeto.
3. Abra o arquivo index.html em um navegador moderno ou utilize uma extensão como Live Server.

> A aplicação funciona com arquivos estáticos e não depende de backend.

## Possíveis melhorias futuras

- Filtros por salário, modalidade ou palavra-chave
- Ordenação por compatibilidade ou experiência
- Modo claro e escuro
- Exportação do resultado em PDF

## Git / branches

- main — versão final
- develop — integração das features
- feature/estrutura — estrutura inicial do projeto
- feature/formulario — validação e objeto candidato
- feature/motor — lógica de compatibilidade
- feature/ui — renderização da interface
- feature/persistencia — localStorage
- feature/design — estilização profissional

## 📋 Trello

O quadro Kanban utilizado para organizar o desenvolvimento do projeto pode ser acessado no link abaixo:

**🔗 Link do Trello:**  
https://trello.com/invite/b/6a5ce5c64749d9cf8a3ee48e/ATTI5f37cb4dee6e18df014fc331cfbffb175640C9DA/skill-match-web

---

## 🎥 Vídeo de Apresentação

O vídeo de apresentação do projeto está disponível no Google Drive através do link abaixo:

**🔗 Link do vídeo:**  
https://drive.google.com/file/d/10b52GLdNeSv3GbUJdjLWkXe3sRtg6eou/view?usp=sharing
