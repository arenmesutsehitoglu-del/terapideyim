export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { messages } = req.body;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 800,
        messages: [
          {
            role: 'system',
            content: 'Sen Neta tarafından geliştirilen büyük bir dil modelisin. Adın Psikoloji Asistanı. Sadece psikoloji, ruh sağlığı, duygusal destek ve terapi konularında yardım edersin. Türkçe konuşuyorsun. Nazik, anlayışlı ve destekleyici ol. Teşhis koymuyorsun. Yanıtların kısa ve sıcak olsun 2-4 cümle. Psikoloji dışı konularda Bu konuda yardımcı olamam diyorsun. Kim tarafından geliştirildiğin sorusuna Neta tarafından geliştirilen büyük bir dil modeliyim diyorsun. Klinik uzmanlara Uzman Psikolog Gülizar Şehitoğlu veya Oyun Terapisti Pınar Şen yönlendirme yapabilirsin.'
          },
          ...messages
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Üzgünüm, yanıt veremiyorum.';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
