# Ghost Maze Game

## Sobre o Projeto

Este é um jogo de labirinto 2D onde você controla um fantasma estilo Pac-Man através de um labirinto gerado proceduralmente. O objetivo é encontrar a garota antes que o tempo acabe.

Este projeto foi criado como um experimento para testar os limites da inteligência artificial generativa na criação de jogos. Todo o código foi desenvolvido com a assistência do Claude (Anthropic) através do editor Cursor.

## Tecnologias Utilizadas

- **Three.js**: Biblioteca JavaScript para criação de gráficos 3D/2D no navegador
- **Vite**: Ferramenta de build rápida para desenvolvimento web moderno
- **Claude 3.5 Sonnet**: Modelo de IA da Anthropic utilizado para gerar e refinar o código
- **Cursor**: Editor de código potencializado por IA

## Características do Jogo

- Labirinto 2D gerado proceduralmente
- Fantasma inspirado nos fantasmas do Pac-Man (versão branca)
- Personagem feminina com animações de aceno quando o fantasma se aproxima
- Sistema de pontuação e níveis com dificuldade progressiva
- Tempo limitado para encontrar a saída
- Controles responsivos (WASD ou setas direcionais)
- Suporte para dispositivos móveis com controles de toque

## Processo de Desenvolvimento

Este jogo foi desenvolvido como um experimento para explorar como a IA generativa pode auxiliar no desenvolvimento de jogos. O processo envolveu:

1. Especificação inicial do conceito do jogo
2. Geração iterativa de código com Claude via Cursor
3. Testes e refinamentos baseados em feedback
4. Ajustes manuais quando necessário

A maior parte do código, incluindo a lógica do jogo, geração de labirinto, animações e renderização, foi criada com sugestões da IA, demonstrando o potencial dessas ferramentas para acelerar o desenvolvimento de jogos.

## Como Jogar

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Inicie o servidor de desenvolvimento com `npm run dev`
4. Abra o navegador em `http://localhost:3000`

### Controles:
- **WASD** ou **Setas Direcionais**: Movimentar o fantasma
- Em dispositivos móveis: Use os botões de direção na tela

## Limitações e Aprendizados

Este projeto demonstra tanto o potencial quanto as limitações atuais da IA generativa no desenvolvimento de jogos:

- A IA é excelente em gerar código estruturado e modular
- Consegue implementar padrões comuns de desenvolvimento de jogos
- Tem dificuldades com questões específicas de renderização e casos de borda
- Requer orientação humana para decisões de design e correção de bugs complexos

## Próximos Passos

- Adicionar mais recursos visuais e sonoros
- Implementar sistema de recordes
- Adicionar diferentes tipos de labirintos e obstáculos
- Melhorar a jogabilidade em dispositivos móveis

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Agradecimentos

- Three.js pela excelente biblioteca de gráficos
- Anthropic pelo modelo Claude
- Equipe do Cursor pelo editor potencializado por IA 