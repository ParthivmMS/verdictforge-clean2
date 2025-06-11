// File: pages/api/summarize.ts
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
    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI. Read the Indian court judgment text from the user and respond ONLY in this exact format:

Legal Summary: <short summary for lawyers>

Plain English Summary: <simplified explanation for common people>

NO title, NO introduction, NO bullet points. Only these two fields exactly.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();
    const aiOutput = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log("[AI OUTPUT]", aiOutput);

    // Extraction without regex for better compatibility
    const legalMatch = aiOutput.split('Plain English Summary:')[0]?.replace('Legal Summary:', '').trim();
    const plainMatch = aiOutput.split('Plain English Summary:')[1]?.trim();

    const legal = legalMatch || '[Could not extract legal summary]';
    const plain = plainMatch || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain });
  } catch (err) {
    console.error('[API ERROR]', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
