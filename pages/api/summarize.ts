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
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          messages: [
            {
              role: 'system',
content: `You are a legal AI summarizer. Given a court judgment, reply ONLY in the following format:

Legal Summary:
<professional legal summary>

Plain English Summary:
<simple explanation for non-lawyers>

Do not include greetings, introductions, or anything else before or after these headings. Just reply in that exact format.`,
            },
            { role: 'user', content: text },
          ],
        }),
      }
    );

    const result = await deepinfraRes.json();
    const content = result.choices?.[0]?.message?.content?.trim() || '';

    console.log('[DEBUG] DeepInfra Response:', content);

    // ✅ Clean multiline regex
    const match = content.match(
      /Legal Summary:\s*([\s\S]*?)Plain English Summary:\s*([\s\S]*)/i
    );

    const legal = match?.[1]?.trim() || content || 'N/A';
    const plain = match?.[2]?.trim() || 'N/A';

    return res.status(200).json({ legal, plain, raw: content });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
