module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }

  const company = body && body.company;
  if (!company) return res.status(400).json({ error: 'No company name' });

  const prompt = `You are a senior fintech analyst. Analyze "${company}" and return ONLY valid JSON, no markdown, no backticks:
{"name":"string","founded":"string","hq":"string","category":"string","summary":"string","business_model":"string","market_position":"string","key_risks":"string","regulatory":"string","tags":["a","b","c","d"],"ratings":{"innovation":80,"market_strength":70,"regulatory_compliance":75,"growth_potential":80},"overall_score":75,"outlook":"Bullish"}
outlook = Bullish, Neutral, or Cautious. Ratings = integers 0-100. Return ONLY JSON.`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
