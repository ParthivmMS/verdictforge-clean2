import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPINFRA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI. Return exactly two sections:

Legal Summary:
<short legal summary for lawyers>

Plain English Summary:
<simple version for non-lawyers>

Don't add any other words or introductions. Just return these two sections with headings.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    // [DEBUG]
    console.log('[DEBUG] DeepInfra GPT-4 Response:', content);

    // Try extracting both parts
    const match = content.match(/Legal Summary[:\-]?\s*([\s\S]+?)\s*Plain English Summary[:\-]?\s*([\s\S]+)/i);
    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });

  } catch (err) {
    console.error('[ERROR] API failed:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
