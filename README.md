# Secret Santa - Christmas Badge Generator 🎄

A festive web application for generating Christmas badges with AI. Perfect for Secret Santa events!

## Features

- 🎅 Generate Christmas-themed badges with AI
- 🎮 Mini-game while waiting for badge generation
- 📸 Upload your photo and transform into Christmas characters
- 🗑️ Manage and delete your generated badges
- 🎨 Beautiful Christmas-themed UI

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

The backend server runs on `http://localhost:5000` and handles:
- Badge generation via n8n webhook
- Badge storage in `./badges/` directory
- Badge retrieval and deletion

## Frontend

The frontend runs on `http://localhost:5173` (default Vite port) and provides:
- User interface for badge generation
- Badge gallery
- Mini-game during generation

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
