# @sheplu/eslint-config-json

> Opinionated and lightweight **ESLint config for JSON** files.
> Built to ensure consistent formatting and validation across projects.

## Features

- ✅ Preconfigured for JSON, JSONC and JSON5 files (`.json`, `.jsonc`, `json5`)
- ✅ Enforces consistent key ordering and spacing
- ✅ Prevents trailing commas and other structural mistakes
- ✅ Zero-dependency and plug-and-play setup
- ✅ Works perfectly with editors and CI pipelines

## Installation

You can install the config as a dev dependency:

```bash
npm install -D @sheplu/eslint-config-json
# or
yarn add -D @sheplu/eslint-config-json
# or
pnpm add -D @sheplu/eslint-config-json
```

## Usage

In your **`eslint.config.js`**, extend the shared config:

### Flat config (ESLint ≥ 9)

```js
import { jsonRules } from "@sheplu/eslint-config-json";
import json from "@eslint/json";

export default defineConfig([
  {
    'extends': [ jsonRules ],
    'files': [ '**/*.json' ],
    'language': 'json/json',
    'plugins': { json },
  },
]);
```

## Recommended Editor Setup

- **VS Code** with the ESLint extension enabled.
- Add this to your `.vscode/settings.json`:

  ```json
  {
    "editor.formatOnSave": true,
    "eslint.validate": ["json", "jsonc"]
  }
  ```
