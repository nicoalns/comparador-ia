"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LLMComparator() {
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(false);
	const [responses, setResponses] = useState<Record<string, string>>({});

	const handleCompare = async () => {
		if (!prompt.trim()) return;
		setLoading(true);
		setResponses({});

		try {
			const [openAIRes, geminiRes] = await Promise.all([
				fetch("/api/openai", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ prompt }),
				}).then((res) => res.json()),

				fetch("/api/claude", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ prompt }),
				}).then((res) => res.json()),

				fetch("/api/gemini", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ prompt }),
				}).then((res) => res.json()),
			]);

			setResponses({
				"OpenAI GPT-4": openAIRes.response || "❌ Error: " + JSON.stringify(openAIRes),
				"Google Gemini": geminiRes.response || "❌ Error: " + JSON.stringify(geminiRes),
			});
		} catch (error) {
			console.error("Error comparando modelos:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold">Comparador de IAs</h1>
			<p className="text-muted-foreground">Ingresá un enunciado y compará cómo responden distintos modelos de IA.</p>

			<Textarea
				placeholder="Escribí el prompt a comparar"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
				className="min-h-[100px]"
			/>

			<Button onClick={handleCompare} disabled={loading || !prompt.trim()}>
				{loading ? "Comparando..." : "Comparar"}
			</Button>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{Object.entries(responses).map(([model, response]) => (
					<Card key={model}>
						<CardContent className="space-y-2 p-4">
							<h2 className="text-lg font-semibold">{model}</h2>
							<p className="whitespace-pre-wrap text-sm text-muted-foreground">{response}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}