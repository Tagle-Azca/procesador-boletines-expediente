// Servicio para leer y actualizar boletines en DynamoDB
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { REGION, TABLE_NAME } = require('../config');

const client = new DynamoDBClient({ region: REGION });
const dynamo = DynamoDBDocumentClient.from(client);

// Obtiene un boletín por su ID
async function obtenerBoletin(id) {
  const res = await dynamo.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  }));
  return res.Item || null;
}

// Marca el boletín como leído
async function marcarLeido(id) {
  await dynamo.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'SET leido = :val, leidoEn = :fecha',
    ExpressionAttributeValues: {
      ':val': true,
      ':fecha': new Date().toISOString(),
    },
  }));
}

module.exports = { obtenerBoletin, marcarLeido };
