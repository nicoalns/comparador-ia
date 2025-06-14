export default async function handler(req, res) {
	const { prompt } = req.body;
	const apiKey = process.env.CLAUDE_API_KEY;

	try {
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
		console.log("Claude response:", data);

		if (data.content && data.content[0]?.text) {
			return res.status(200).json({ response: data.content[0].text });
		} else {
			return res.status(200).json({ response: `Error: ${JSON.stringify(data)}` });
		}
	} catch (err) {
		console.error("Claude error:", err);
		return res.status(500).json({ response: "Error en el servidor de Claude" });
	}
}
