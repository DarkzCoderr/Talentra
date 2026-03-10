const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyAaBX8V1cgESwTwnDgw6vjAaNjbp_2SFOc');

async function checkModels() {
    try {
        // Instead of instantiating a model, we can try to fetch the models list via REST, 
        // or just try common model names.
        const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.0-pro'];

        for (const m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("hello");
                console.log(`✅ ${m} works!`);
            } catch (e) {
                if (e.message.includes('Quota')) {
                    console.log(`❌ ${m} failed due to QUOTA`);
                } else if (e.message.includes('not found')) {
                    console.log(`❌ ${m} not found`);
                } else {
                    console.log(`❌ ${m} failed: ${e.message.slice(0, 100)}`);
                }
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

checkModels();
