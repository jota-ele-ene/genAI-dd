// netlify/functions/ask-bot.js
import { askBot } from '../../src/askBotCore.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const question = body.question;

    const data = await askBot(question, {
      apiUrl: process.env.GENBOX_API_URL,
      apiKey: process.env.GENBOX_API_KEY,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err);
    const status = err.message.includes('Falta el parámetro') ? 400 : 500;
    return {
      statusCode: status,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
