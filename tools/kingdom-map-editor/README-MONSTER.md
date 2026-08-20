# Editor local do mapa Kingdom Rush

O site público do Monster é estático e funciona no GitHub Pages. O editor fica em `tools/kingdom-map-editor` e roda localmente com Node.js; ele não é executado pelo GitHub Pages.

## Editor

Dentro desta pasta:

```powershell
npm.cmd install
node server.js
```

Depois abra:

```text
http://localhost:3000/editor
```

A rota `/` também redireciona para `/editor`, então ela não quebra mesmo sem `public/index.html`.

## Publicar as alterações do mapa

Depois de criar/editar/excluir fases:

```powershell
node sync-to-pages.js
```

Isso atualiza:

- `assets/map-data/phases.json`
- `assets/kingdom-map/flags/`

Depois:

```powershell
git add .
git commit -m "Atualiza mapa Kingdom Rush"
git push
```

O workflow `.github/workflows/pages.yml` publica o conteúdo do repositório no GitHub Pages.

## Estrutura

- `index.html` permanece na raiz.
- As outras páginas HTML ficam em `html/`.
- CSS, JavaScript e assets continuam na raiz.
- O editor é isolado em `tools/kingdom-map-editor/`.
