# Jogo da Velha (Tic Tac Toe)

## Descrição

O Jogo da Velha é um jogo clássico para dois jogadores, onde os participantes alternam marcando espaços em uma grade 3x3 com 'X' ou 'O'. O jogador que conseguir colocar três de suas marcações em uma linha horizontal, vertical ou diagonal ganha o jogo. Este projeto implementa o Jogo da Velha usando HTML5 Canvas para renderizar o tabuleiro do jogo e cria um servidor REST com Express.js para possibilitar a criação de salas de jogos que utilizam Socket.IO para a comunicação em tempo real.

## Imagens

 ![Tela inicial](/assets/image.png)
 ![Tela do tabuleiro](/assets/image-1.png)
 ![Tela 404](/assets/image-2.png)

## Recursos

- Interface de usuário simples e intuitiva.
- Jogabilidade para dois jogadores: Os jogadores alternam clicando em células vazias para colocar suas marcações ('X' ou 'O').
- Indicação clara do status do jogo: O jogo notifica os jogadores de quem é a vez e exibe uma mensagem quando alguém ganha ou o jogo termina em empate.
- Criação dinâmica de salas de jogos: Utilizando Express.js, os jogadores podem criar novas salas para jogar contra outros jogadores.
- Comunicação em tempo real: O Socket.IO é utilizado para permitir a comunicação em tempo real entre os jogadores dentro das salas de jogo.

## Tecnologias Utilizadas

- HTML5: Utilizado para estruturar a interface do jogo e incluir o elemento Canvas para desenhar.
- CSS: Estilização da interface do jogo.
- JavaScript: Implementação da lógica do jogo e interações.
- TypeScript: Utilizado para escrever o código do lado do servidor.
- Canvas: Renderização do tabuleiro e dos símbolos do jogo.
- Express.js: Framework web para criar o servidor REST que gerencia as salas de jogo.
- Socket.IO: Biblioteca JavaScript para comunicação em tempo real entre o servidor e os clientes.

## Como Começar

### Pré-requisitos

- Node.js instalado em seu sistema.

### Instalação

1. Clone o repositório:

    ```sh
    git clone https://github.com/Bruno-Brandao-Silva/tic-tac-toe.git
    ```

2. Navegue até o diretório do projeto:

    ```sh
    cd tic-tac-toe
    ```

3. Instale as dependências:

    ```sh
    npm i
    ```

4. Inicie o servidor:

    ```sh
    npm run dev
    ```

5. Abra o navegador e acesse `http://localhost:3000` para jogar o Jogo da Velha.

## Uso

1. Abra o navegador e acesse `http://localhost:3000`.
2. Crie uma nova sala de jogo ou entre em uma sala existente.
3. Comece a jogar contra outro jogador em tempo real!
4. Divirta-se jogando!

Se você quiser testar o jogo sozinho, abra dois navegadores da web diferentes (por exemplo, Google Chrome e Mozilla Firefox) e acesse `http://localhost:3000` em ambos os navegadores.
