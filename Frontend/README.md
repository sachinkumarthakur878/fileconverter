# CompressIO — Frontend

Modern React frontend for CompressIO — a professional file conversion and compression platform.

## Tech Stack
- **React 18** + React Router v6
- **SCSS** — 4-Layer Architecture (Tokens → Reset → Components → Layout → Pages)
- **Axios** — API communication with JWT interceptor
- **react-dropzone** — drag-and-drop file uploads
- **react-hot-toast** — toast notifications
- **lucide-react** — icons
- **Vite** — build tool

## 4-Layer SCSS Architecture
```
src/styles/
├── base/
│   ├── _tokens.scss     # Layer 1: CSS custom properties (dark/light theme)
│   └── _reset.scss      # Layer 1: CSS reset + keyframes
├── components/
│   ├── _components.scss # Layer 2: Reusable UI (buttons, inputs, cards, badges…)
│   └── _layout.scss     # Layer 3: Structural (sidebar, header, grid…)
├── pages/
│   └── _pages.scss      # Layer 4: Page/feature specific
└── index.scss           # Entry — imports all layers in order
```

## Pages
| Route        | Description                               | Auth |
|--------------|-------------------------------------------|------|
| `/`          | Landing page                              | No   |
| `/login`     | Sign in                                   | No   |
| `/register`  | Create account                            | No   |
| `/dashboard` | Stats + recent files + quick actions      | Yes  |
| `/convert`   | Convert files (to PDF or to Word)         | Yes  |
| `/compress`  | Compress files with quality slider        | Yes  |
| `/my-files`  | Full file list with search & filter       | Yes  |
| `/upload`    | Multi-file upload queue                   | Yes  |

## Supported Conversions
| Input  | Output | Engine               |
|--------|--------|----------------------|
| `.txt` | `.pdf` | pdf-lib              |
| `.txt` | `.docx`| docx                 |
| `.docx`| `.pdf` | mammoth + pdf-lib    |
| `.doc` | `.pdf` | mammoth + pdf-lib    |
| `.pdf` | `.docx`| **pdf-parse** + docx |

## Supported Compressions
| Format      | Method                        |
|-------------|-------------------------------|
| `.pdf`      | pdf-lib object stream re-save |
| `.jpg/.jpeg`| sharp MozJPEG re-encode       |
| `.png`      | sharp adaptive filtering      |
| `.webp`     | sharp quality re-encode       |
| `.txt`      | whitespace normalisation      |

## Getting Started
```bash
npm install
cp .env.example .env          # set VITE_API_URL=http://localhost:5000
npm run dev                   # http://localhost:3000
```
