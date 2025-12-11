import { app } from './app';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Todo API server is running on http://localhost:${PORT}`);
});
