exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  try {
    const { fields } = JSON.parse(event.body);
    const res = await fetch(`https://api.airtable.com/v0/${process.env.AT_BASE}/${process.env.AT_TABLE}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.AT_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields })
    });
    const data = await res.json();
    if (!res.ok) return { statusCode: 500, headers, body: JSON.stringify({ error: data }) };
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
