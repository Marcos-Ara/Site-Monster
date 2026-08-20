# Kingdom Rush — Mapa + Editor

Projeto com duas páginas HTML e um único servidor Node.js:

- `/` → mapa público.
- `/editor` → editor.

## Como funciona

1. Abra `/editor`.
2. Clique no ponto do mapa onde deseja a bandeira.
3. Digite o nome da fase.
4. Cole o link do YouTube.
5. Escolha a imagem da bandeira (opcional).
6. Clique em **Salvar bandeira**.

A fase é salva em `data/phases.json` pelo Node.js. O servidor envia as alterações por **Server-Sent Events (SSE)**, então o mapa público recebe criação, edição e exclusão sem precisar recarregar a página.

No mapa público, passar o mouse sobre uma bandeira abre o vídeo do YouTube em um pop-up. Clicar na bandeira abre o vídeo em nova aba.

## Bandeiras personalizadas

O editor aceita PNG, JPG/JPEG, WEBP e GIF com até 2 MB. O arquivo é enviado para `public/assets/flags/` e o caminho é salvo junto com a fase.

## Persistência

A versão de teste/hospedagem deste ZIP **não depende de PostgreSQL**. Isso elimina o erro 500 que acontecia quando o PostgreSQL não estava instalado ou ligado.

Em uma hospedagem Node/VPS com armazenamento persistente, os dados continuam em `data/phases.json` e as imagens em `public/assets/flags/`.

## Rodar no Windows / PowerShell

Na pasta do projeto:

```powershell
npm.cmd install
node server.js
```

Depois abra:

- `http://localhost:3000/`
- `http://localhost:3000/editor`

## Docker

```bash
docker compose up -d --build
```

O compose monta a pasta `data` e as imagens das bandeiras para que as alterações não sumam quando o container for recriado.

## Estrutura

```text
kingdom-rush-mapa-editor/
├── public/
│   ├── index.html
│   ├── editor.html
│   ├── css/site.css
│   ├── js/viewer.js
│   ├── js/editor.js
│   └── assets/
│       ├── maps/kingdom-rush-map.png
│       └── flags/flag-default.svg
├── data/phases.json
├── server.js
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```
