export default async function handler(req, res) {
	const { prompt } = req.body;
	const apiKey = process.env.OPENAI_API_KEY;

	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: "gpt-4o",
			messages: [{ role: "user", content: prompt }],
		}),
	});

	const data = await response.json();
	const reply = data.choices?.[0]?.message?.content || "Sin respuesta";
	res.status(200).json({ response: reply });
}