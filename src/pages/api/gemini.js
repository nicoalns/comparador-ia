export default async function handler(req, res) {
	const { prompt } = req.body;
	const apiKey = process.env.GEMINI_API_KEY;

	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
				}),
			}
		);

		const data = await response.json();
		console.log("Gemini response:", data);

		if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
			return res.status(200).json({ response: data.candidates[0].content.parts[0].text });
		} else {
			return res.status(200).json({ response: `Error: ${JSON.stringify(data)}` });
		}
	} catch (err) {
		console.error("Gemini error:", err);
		return res.status(500).json({ response: "Error en el servidor de Gemini" });
	}
}
