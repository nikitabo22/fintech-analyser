module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
 
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) {}
  }
 
  const company = body && body.company;
  if (!company) return res.status(400).json({ error: 'No company name' });
 
  const prompt = `You are a senior fintech analyst. Analyze "${company}" and return ONLY a valid JSON object with no markdown, no backticks, no extra text. Use exactly this structure:
{"name":"Official company name","founded":"Year","hq":"City, Country","category":"Fintech category","summary":"2-3 sentence overview max 65 words","business_model":"How they make money max 50 words","market_position":"Competitive standing max 45 words","key_risks":"Main risks max 40 words","regulatory":"Regulatory status max 35 words","tags":["tag1","tag2","tag3","tag4"],"ratings":{"innovation":85,"market_strength":70,"regulatory_compliance":80,"growth_potential":75},"overall_score":78,"outlook":"Bullish","competitors":[{"name":"Competitor 1","note":"One sentence why they compete"},{"name":"Competitor 2","note":"One sentence why they compete"},{"name":"Competitor 3","note":"One sentence why they compete"}],"ipo_readiness":{"score":65,"label":"Pre-IPO","note":"One sentence explanation max 25 words"},"invest_verdict":{"score":72,"label":"Buy","reason":"One sentence rationale max 30 words","disclaimer":"AI opinion only. Not financial advice."},"market_size":"e.g. $500B global neobanking market by 2030","key_people":[{"name":"Person name","role":"CEO"},{"name":"Person name","role":"Founder"}]}
 
Rules: outlook must be Bullish, Neutral, or Cautious. ipo_readiness.label must be one of: Already Public, IPO Ready, Pre-IPO, Early Stage, Not Applicable. invest_verdict.label must be one of: Strong Buy, Buy, Hold, Avoid. All rating values integers 0-100. Return ONLY the JSON.`;
 
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
};
