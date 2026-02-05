// src/askBotCore.js
import fetch from 'node-fetch';  // o global fetch si tu Node lo soporta

export async function askBot(question, { apiUrl, apiKey }) {
  if (!question || !question.trim()) {
    throw new Error('Falta el parámetro question');
  }

  const requestBody = {
    chat_session_id: '00000000-0000-0000-0000-000000000000',
    extra_headers: [
      {
        key: 'Authorization',
        value: 'Bearer token_value',
      },
    ],
    messages: [
      {
        type: 'text',
        text: question,
      },
    ],
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  if (!response.ok) {
    const msg = data?.error || `${response.status} ${response.statusText}`;
    throw new Error(msg);
  }

  return data;
}


