const express = require('express');
const { PORT } = require('./src/config');
const boletinesRouter = require('./src/routes/boletines');

const app = express();
app.use(express.json());

app.use('/boletines', boletinesRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Mostrador de boletines corriendo en puerto ${PORT}`);
});
