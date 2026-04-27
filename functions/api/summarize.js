// Cloudflare Pages Function — POST /api/summarize
// Proxies to OpenAI ChatGPT to summarize interview experiences.
// Environment variable OPENAI_API_KEY must be set in Cloudflare Pages dashboard.

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

    const apiKey = context.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const systemPrompt = `You are a helpful assistant that summarizes interview experiences for university students. 
Given an interview experience, produce a concise, structured summary with these sections:
- **Overview**: 1-2 sentence high-level summary
- **Key Questions**: Bullet list of main questions asked (max 5)
- **Tips & Takeaways**: Bullet list of actionable advice (max 4)
- **Verdict**: One sentence on what to expect

Keep it concise, friendly, and useful. Use markdown formatting. Do not add any preamble.`;

    const userPrompt = `Summarize this interview experience at ${companyName || 'a company'} for the role of ${role || 'Software Engineer'}:

${content.slice(0, 4000)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 600,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI API error:', errText);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable.' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || 'Could not generate summary.';

    return new Response(
      JSON.stringify({ summary }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
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
