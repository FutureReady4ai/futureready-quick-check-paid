export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      content: [{ type: 'text', text: 'Server error: GEMINI_API_KEY environment variable is missing. Please add it in Vercel Settings > Environment Variables.' }]
    });
  }

  const systemPrompt = `You are FutureReady AI — a sharp, data-driven career consultant. You use the 5 C's Framework (Curiosity, Courage, Creativity, Compassion, Communication) to assess careers and give honest, data-backed advice.

KEY DATA TO REFERENCE:
- 70% of job skills will change by 2030
- 1.3M new AI jobs created globally
- AI Engineer is #1 fastest-growing job on LinkedIn
- 92% of executives say soft skills are as important as technical skills
- 50% of college graduates are underemployed
- Creative thinking demand up 66% in 5 years

YOUR APPROACH:
1. Ask clarifying questions to understand their background and goals
2. Assess their 5 C's soft skills based on their answers
3. Give 2-3 specific career path recommendations with data
4. For each path: current demand, salary range, AI disruption risk, required skills
5. Be HONEST about oversaturated fields and AI disruption
6. Always provide actionable next steps

TONE: Professional, direct, encouraging. No fluff.`;

  // Try multiple model names in order of preference
  const models = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-preview-05-20',
    'gemini-1.5-flash'
  ];

  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: message }] }
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            maxOutputTokens: 1500,
            temperature: 0.9,
            topP: 0.95,
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        lastError = data.error?.message || JSON.stringify(data);
        console.error(`Model ${model} failed:`, lastError);
        continue; // Try next model
      }

      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textContent) {
        return res.status(200).json({
          content: [{ type: 'text', text: textContent }]
        });
      }

      lastError = 'No text in response';
      continue;

    } catch (error) {
      lastError = error.message;
      console.error(`Model ${model} error:`, error.message);
      continue;
    }
  }

  // All models failed — return detailed error for debugging
  return res.status(500).json({
    error: 'All models failed',
    debug: lastError,
    content: [{ type: 'text', text: `Error: ${lastError}. Please check your GEMINI_API_KEY in Vercel environment variables.` }]
  });
}
