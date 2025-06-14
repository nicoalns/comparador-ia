export default async function handler(req, res) {
	const { prompt } = req.body;
	const apiKey = process.env.CLAUDE_API_KEY;

	const response = await fetch("https://api.anthropic.com/v1/messages", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-API-Key": apiKey,
			"anthropic-version": "2023-06-01",
		},
		body: JSON.stringify({
			model: "claude-3-opus-20240229",
			messages: [{ role: "user", content: prompt }],
			max_tokens: 1024,
		}),
	});

	const data = await response.json();
	const reply = data.content?.[0]?.text || "Sin respuesta";
	res.status(200).json({ response: reply });
}