# Superhero Comics Mate - Superhero Badge Generator 🦸

Web app per generare badge da supereroe con l’AI (n8n). Perfetta per eventi a tema supereroi!

## Features

- 🦸 Genera badge a tema supereroi con l’AI (Batman, Spider-Man, Wonder Woman, Iron Man, ecc.)
- 🎮 Mini-gioco mentre aspetti la generazione del badge
- 📸 Carica la tua foto e trasformati in supereroe
- 🗑️ Gestisci e elimina i badge generati
- 🎨 UI a tema comic/superhero

## Prerequisites

- Node.js and npm
- Python 3.x
- Flask and required Python packages (see backend requirements)

## Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd backend
pip install flask flask-cors google-genai
```

## Running the Application

### Option 1: Run separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Option 2: Run both together (requires concurrently)

First install concurrently:
```bash
npm install --save-dev concurrently
```

Then run:
```bash
npm run dev:all
```

## Backend Server

Il backend gira su `http://localhost:5000` e gestisce:
- Generazione badge tramite webhook n8n (`get-superhero-comics`)
- Salvataggio badge in `./badges/`
- Recupero e cancellazione badge

**Nota:** In n8n va configurato un workflow che espone il webhook `get-superhero-comics` e genera le immagini in stile supereroe in base al campo `type` (es. batman, superman, spider_man, iron_man, ecc.).

### Webhook n8n: test vs produzione

L’app può usare due endpoint n8n:

| Casistica | URL | Quando usarlo |
|-----------|-----|----------------|
| **Test** | `.../webhook-test/get-superhero-comics` | Sviluppo e prove (workflow in modalità test in n8n) |
| **Produzione** | `.../webhook/get-superhero-comics` | Build di produzione / evento live |

Comportamento:
- **In development** (`npm run dev`): se non imposti nulla, viene usato **webhook-test**.
- **In production** (build): viene usato **webhook**.
- Per sovrascrivere: crea un file `.env` o `.env.local` nella root del progetto con:
  ```bash
  # Per test (anche in production build)
  VITE_N8N_WEBHOOK_TYPE=webhook-test

  # Per produzione (anche in dev)
  VITE_N8N_WEBHOOK_TYPE=webhook
  ```
  Puoi copiare `.env.example` in `.env` e modificare il valore.

## Frontend

Il frontend gira su `http://localhost:5173` (Vite) e offre:
- Form per nome, email, foto e stile supereroe
- Galleria badge
- Mini-gioco durante la generazione

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```
