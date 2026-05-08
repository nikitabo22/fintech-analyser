export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { company } = req.body;
  if (!company) return res.status(400).json({ error: 'Company name required' });

  const prompt = `You are a senior fintech analyst. Analyze "${company}" and return ONLY a valid JSON object with no markdown, no backticks, no extra text. Use exactly this structure:
{"name":"Official company name","founded":"Year","hq":"City, Country","category":"Fintech category","summary":"2-3 sentence overview max 65 words","business_model":"How they make money max 50 words","market_position":"Competitive standing max 45 words","key_risks":"Main risks max 40 words","regulatory":"Regulatory status max 35 words","tags":["tag1","tag2","tag3","tag4"],"ratings":{"innovation":85,"market_strength":70,"regulatory_compliance":80,"growth_potential":75},"overall_score":78,"outlook":"Bullish"}
outlook must be exactly Bullish, Neutral, or Cautious. All rating values integers 0-100. Return ONLY the JSON.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
