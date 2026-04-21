const REGION = process.env.AWS_REGION || 'us-east-1';
const EXPEDIENTE = '739678';

module.exports = {
  PORT: process.env.PORT || 3000,
  REGION,
  TABLE_NAME: `boletines-${EXPEDIENTE}`,
};
