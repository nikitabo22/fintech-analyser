module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const company = (req.body && req.body.company) || '';
  if (!company) return res.status(400).json({ error: 'No company' });

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
     model: 'claude-opus-4-5',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Analyze fintech company "${company}". Return ONLY this JSON with no extra text: {"name":"string","founded":"string","hq":"string","category":"string","summary":"string","business_model":"string","market_position":"string","key_risks":"string","regulatory":"string","tags":["a","b","c","d"],"ratings":{"innovation":80,"market_strength":70,"regulatory_compliance":75,"growth_potential":80},"overall_score":75,"outlook":"Bullish"}`
      }]
    })
  });

  const data = await resp.json();
  return res.status(200).json(data);
};
