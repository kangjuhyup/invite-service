import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5001;

// `__dirname` 구현
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일에 prefix 추가 (e.g., `/page`)
app.use('/page', express.static(path.join(__dirname, 'dist')));

// 모든 라우트에 prefix 추가
app.get('/page/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/page`);
});
