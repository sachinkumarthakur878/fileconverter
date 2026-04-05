# FileForge — Frontend

Modern React frontend for the FileForge document conversion platform.

## Tech Stack

- **React 18** with React Router v6
- **SCSS** — 4-Layer Architecture (Tokens → Reset → Components → Pages)
- **Axios** for API communication
- **react-dropzone** for drag-and-drop file uploads
- **react-hot-toast** for notifications
- **lucide-react** for icons
- **Vite** as build tool

## Architecture

### 4-Layer SCSS Architecture

```
src/styles/
├── base/
│   ├── _tokens.scss       # Layer 1: Design tokens (CSS variables, dark/light)
│   └── _reset.scss        # Layer 1: CSS reset + global styles + keyframes
├── components/
│   ├── _components.scss   # Layer 2: Reusable UI components (buttons, inputs, cards…)
│   └── _layout.scss       # Layer 3: Structural layout (sidebar, header, grid…)
├── pages/
│   └── _pages.scss        # Layer 4: Page/feature-specific styles
└── index.scss             # Main SCSS entry — imports all layers
```

### React Layers

```
src/
├── api/           # Axios instance + all API calls (auth + file)
├── context/       # AuthContext, ThemeContext (global state)
├── hooks/         # useFiles, useConverter (business logic)
├── components/
│   ├── common/    # ProtectedRoute, Spinner, ThemeToggle
│   ├── layout/    # AppLayout, Sidebar, TopHeader
│   ├── converter/ # DropZone, FilePreviewCard, ConversionTypeSelector, ProgressBar, ConversionResult
│   └── dashboard/ # StatCard, FileRow
├── pages/         # LandingPage, LoginPage, RegisterPage, DashboardPage,
│                  # ConvertPage, MyFilesPage, UploadPage, NotFoundPage
└── utils/         # helpers.js (formatBytes, formatDate, getFileTypeInfo…)
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env: set VITE_API_URL to your backend URL (default: http://localhost:5000)

# 3. Start the backend first (from the Backend folder)
cd ../Backend
npm install
npm run dev

# 4. Start the frontend
npm run dev
# Opens at http://localhost:3000
```

## Pages

| Route         | Description                          | Auth Required |
|---------------|--------------------------------------|---------------|
| `/`           | Landing page with feature overview   | No            |
| `/login`      | Sign in                              | No            |
| `/register`   | Create account                       | No            |
| `/dashboard`  | Stats overview + recent files        | Yes           |
| `/convert`    | Convert files (to PDF or to Word)    | Yes           |
| `/my-files`   | Full file list with search & filter  | Yes           |
| `/upload`     | Multi-file upload queue              | Yes           |

## Supported Conversions

| Input  | Output | Notes                              |
|--------|--------|------------------------------------|
| `.txt` | `.pdf` | Full text-to-PDF with pagination   |
| `.txt` | `.docx`| Paragraph-by-paragraph conversion |
| `.docx`| `.pdf` | Text extracted via Mammoth.js      |
| `.doc` | `.pdf` | Same as above                      |
| `.pdf` | `.docx`| Best on text-based (non-scanned)   |

## Theme

Toggle dark/light theme via the sun/moon button in the top-right. The preference is persisted to `localStorage`.
