const axios = require("axios");

async function geminiAPI(prompt) {
    try {
        const response = await axios.get(`${global.NashBot.ENDPOINT}gemini?prompt=${encodeURIComponent(prompt)}`);
        return response.data.response || "Unexpected API response format.";
    } catch (error) {
        return "Failed to fetch data. Please try again later.";
    }
}

module.exports = {
    name: "gemini",
    description: "Interact with the Gemini API",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["gemini"],
    execute: async (telegramBot, msg) => {
        const chatId = msg.chat.id;
        const prompt = msg.text.split(' ').slice(1).join(' ');

        if (!prompt) {
            return telegramBot.sendMessage(chatId, "Please enter a prompt.");
        }

        telegramBot.sendMessage(chatId, "Processing your request...").then(async (info) => {
            try {
                const response = await geminiAPI(prompt);
                telegramBot.editMessageText(
                    `[Gemini]\n\n${response}`,
                    { chat_id: chatId, message_id: info.message_id }
                );
            } catch (error) {
                telegramBot.sendMessage(chatId, "Error processing your request: " + error.message);
            }
        }).catch(err => {
            console.error("Error sending message:", err.message);
        });
    },
};
