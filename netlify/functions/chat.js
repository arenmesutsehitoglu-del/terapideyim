exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  try {
    const { messages } = JSON.parse(event.body);
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        messages: [
          { role: 'system', content: 'Sen bir psikoloji kliniğinin yapay zeka destekli bilgilendirme asistanısın. Türkçe konuşuyorsun. Empatik, nazik ve destekleyici ol. Teşhis koyma. Kısa yanıtlar ver (2-4 cümle).' },
          ...messages
        ]
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || 'Üzgünüm, yanıt veremiyorum.';
    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
