# CompressIO — Backend

Node.js/Express REST API for CompressIO.

## Stack
- **Express 5** + **Mongoose** (MongoDB)
- **multer** — file uploads (50MB limit)
- **pdf-lib** — PDF creation & compression
- **mammoth** — DOCX text extraction
- **pdf-parse** — PDF text extraction for Word conversion
- **docx** — Word document generation
- **sharp** — image compression
- **bcryptjs** + **jsonwebtoken** — auth

## Endpoints

### Auth
| Method | Route                | Body                        |
|--------|----------------------|-----------------------------|
| POST   | /api/auth/register   | { name, email, password }   |
| POST   | /api/auth/login      | { email, password }         |

### Files (all require `Authorization: Bearer <token>`)
| Method | Route               | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | /api/file/upload    | Upload file (multipart)              |
| POST   | /api/file/to-pdf    | Convert .txt/.docx/.doc → PDF        |
| POST   | /api/file/to-word   | Convert .txt/.pdf → DOCX             |
| POST   | /api/file/compress  | Compress file (+ `quality` 0.1–1.0)  |
| GET    | /api/file/my-files  | List user's files                    |
| DELETE | /api/file/:id       | Delete a file                        |

## Setup
```bash
npm install
# create .env:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/compressio
# JWT_SECRET=your_secret_key
npm run dev
```
