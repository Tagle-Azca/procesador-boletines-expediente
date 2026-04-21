// GET /boletines/:id?correoElectronico={correo}
const express = require('express');
const { obtenerBoletin, marcarLeido } = require('../services/dynamoService');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { correoElectronico } = req.query;

    if (!correoElectronico) {
      return res.status(400).json({ error: 'Se requiere el parámetro correoElectronico' });
    }

    const boletin = await obtenerBoletin(id);

    if (!boletin) {
      return res.status(404).json({ error: 'Boletín no encontrado' });
    }

    if (boletin.correo !== correoElectronico) {
      return res.status(403).json({ error: 'El correo no corresponde a este boletín' });
    }

    // Marcar como leído
    await marcarLeido(id);

    // Responder con HTML mostrando la imagen y el link
    return res.status(200).send(`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Boletín ${id}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #333; }
    .contenido { background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0; }
    img { max-width: 100%; border-radius: 8px; margin-top: 16px; }
    a { color: #0066cc; word-break: break-all; }
    .meta { color: #666; font-size: 0.9em; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Boletín</h1>
  <div class="contenido">
    <p>${boletin.contenido}</p>
  </div>
  <p class="meta">Destinatario: ${boletin.correo}</p>
  <p class="meta">Creado: ${boletin.creadoEn}</p>

  <h2>Archivo adjunto</h2>
  <p><a href="${boletin.imagen}" target="_blank">${boletin.imagen}</a></p>
  <img src="${boletin.imagen}" alt="Archivo del boletín" onerror="this.style.display='none'">
</body>
</html>
    `);

  } catch (err) {
    console.error('Error al obtener boletín:', err);
    return res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
  }
});

module.exports = router;
