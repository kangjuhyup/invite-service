import express from 'express';

const app = express();
const PORT = 5001;

app.use(express.static('./dist'));

app.get('*', (req, res) => {
  res.sendFile('./dist/index.html');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
