const axios = require('axios');

async function testPollinations() {
    try {
        const response = await axios.post('https://text.pollinations.ai/openai', {
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Return ONLY valid JSON.' },
                { role: 'user', content: 'Pick 3 random career IDs from this list: ["dev", "designer", "pm", "qa"]. Return format: {"picks": ["id1"]}' }
            ],
            response_format: { type: "json_object" },
            model: 'openai'
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log("Response:", response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testPollinations();
