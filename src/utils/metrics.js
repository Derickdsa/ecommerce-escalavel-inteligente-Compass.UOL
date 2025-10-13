const AWS = require("aws-sdk");
const cloudwatch = new AWS.CloudWatch({ region: process.env.AWS_REGION });

function publishMetric(metricName, value, unit, dimensions = []) {
  const params = {
    MetricData: [
      {
        MetricName: metricName, // Ex: 'LoginAttempts', 'RecommendationLatency'
        Dimensions: dimensions, // Ex: [{ Name: 'Service', Value: 'User-Service' }]
        Timestamp: new Date(),
        Unit: unit, // Ex: 'Count', 'Milliseconds'
        Value: value,
      },
    ],
    Namespace: "EcommercePlatform/Backend", // Agrupamento de todas as métricas do projeto
  };

  // Envia os dados para o CloudWatch (async)
  cloudwatch.putMetricData(params, (err, data) => {
    if (err) console.error("Erro ao enviar métrica para CloudWatch:", err);
  });
}

module.exports = { publishMetric };
