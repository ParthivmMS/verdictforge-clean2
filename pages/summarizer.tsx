// ✅ FILE: pages/api/summarize.ts import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) { if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

const { text } = req.body; if (!text || typeof text !== 'string') return res.status(400).json({ message: 'Invalid input' });

try { const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: Bearer ${process.env.OPENAI_API_KEY || ''}, 'Content-Type': 'application/json', }, body: JSON.stringify({ model: 'gpt-4o', messages: [ { role: 'system', content: You're a legal AI. Summarize Indian court judgments clearly.\n\nFormat:\n\nLegal Summary:\n<lawyer-style summary>\n\nPlain English Summary:\n<easy-to-read version> }, { role: 'user', content: text, } ] }) });

const json = await response.json();
const content = json?.choices?.[0]?.message?.content || '';
const match = content.match(/Legal Summary:\s*(.*?)\s*Plain English Summary:\s*(.*)/is);

const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

return res.status(200).json({ legal, plain });

} catch (err) { console.error(err); return res.status(500).json({ message: 'Internal Server Error' }); } }

