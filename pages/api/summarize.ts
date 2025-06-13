// File: pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Summaries = {
  legal: string;
  plain: string;
  raw?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Summaries | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const deepinfraRes = await fetch(
      'https://api.deepinfra.com/v1/text/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mixtral-large-incite',  // free Mixtral model
          messages: [
            {
              role: 'system',
              content: `You are a legal AI trained to summarize Indian court judgments. Reply with *only*:

Legal Summary: <your professional summary for lawyers>

Plain English Summary: <your simplified summary for non-lawyers>

Do not add anything else.`,
            },
            { role: 'user', content: text },
          ],
        }),
      }
    );

    const result = await deepinfraRes.json();
    const content = result.choices?.[0]?.message?.content?.trim() || '';

    console.log('[DEBUG] DeepInfra Response:', content);

    // Flatten and regex-extract both parts
    const match = content.match(/Legal Summary:\s*([\s\S]*?)Plain English Summary:\s*([\s\S]*)/i);

const legal = match?.[1]?.trim() || content || 'N/A';
const plain = match?.[2]?.trim() || 'N/A';

return res.status(200).json({ legal, plain, raw: content });

    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
