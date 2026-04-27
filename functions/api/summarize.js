// Cloudflare Pages Function — POST /api/summarize
// Proxies to Google Gemini API to summarize interview experiences.
// Environment variable GEMINI_API_KEY must be set in Cloudflare Pages dashboard.

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const { content, companyName, role } = await context.request.json();

    if (!content || content.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: 'Content too short to summarize.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured. Add GEMINI_API_KEY in Cloudflare Pages settings.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const prompt = `You are a helpful assistant that summarizes interview experiences for university students.

Summarize this interview experience at ${companyName || 'a company'} for the role of ${role || 'Software Engineer'}.

Produce a concise, structured summary with these sections:
- **Overview**: 1-2 sentence high-level summary
- **Key Questions**: Bullet list of main questions asked (max 5)
- **Tips & Takeaways**: Bullet list of actionable advice (max 4)
- **Verdict**: One sentence on what to expect

Keep it concise, friendly, and useful. Use markdown formatting. Do not add any preamble.

Interview Experience:
${content.slice(0, 4000)}`;

    // Try multiple model variants for reliability
    const models = [
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
    ];

    let lastError = null;

    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 700,
              temperature: 0.5,
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            ],
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`Gemini ${model} error:`, errText);
          lastError = errText;
          continue; // Try next model
        }

        const data = await response.json();
        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!summary) {
          lastError = 'Empty response from model';
          continue;
        }

        return new Response(
          JSON.stringify({ summary, model }),
          { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      } catch (modelErr) {
        console.error(`Gemini ${model} exception:`, modelErr);
        lastError = modelErr.message;
        continue;
      }
    }

    // All models failed
    return new Response(
      JSON.stringify({ error: `AI service unavailable. ${lastError || ''}`.trim() }),
      { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err) {
    console.error('Summarize function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
