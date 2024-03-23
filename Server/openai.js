const { Configuration, OpenAIApi } = require("openai");

// Initialize OpenAI with API Key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function analyzeCheatingConversation(textMessage) {
  const prompt = `Given the following conversation thread amongst students, check whether there may be cheating involved. Your decision does not need to be perfect and no one will be held accountable whether you are correct or incorrect. Try to minimize false positives as much as possible. With this in mind, output a single number in the range of 0-10, indicating how confident you are that the student (or students) at hand are engaged in academic cheating, with 0 indicating no cheating and 10 indicating absolute certainty of illegal academic conduct. This marks the end of the conversation thread. Remember that your output should be a single integer number as it will be parsed by a tool and it must be consistent.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4", // Specify the GPT-4 model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt + textMessage },
      ],
    });

    // Assuming the response contains a completion in the format we expect
    // Extracting the integer value from the completion
    const messageContents = response.data.choices[0]?.message?.content || "";
    // Use regex or string processing to extract the number from `messageContents`
    // For simplicity, here's a direct return, adjust based on actual response format
    return messageContents.trim();
  } catch (error) {
    console.error(`Error: ${error}`);
    return null;
  }
}

module.exports = {
  analyzeCheatingConversation,
};