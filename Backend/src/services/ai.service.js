import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage,SystemMessage,AIMessage,tool,createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";
const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    temperature: 0
});

const searchInternetTool = tool(
    searchInternet,
    {
        name: "search_internet",
        description: "Use this tool to get the latest information from the internet.",
        schema: z.object({
            query: z.string().describe("The search query to look up on the internet.")
        })
    }
);

const agent = createAgent({
    model: mistralModel,
    tools: [searchInternetTool],
})

export async function generateResponse(messages , isStream = false){
    const formattedMessages = messages.map(msg =>{
        if(msg.role === "user"){
            return new HumanMessage(msg.content);
        }else if(msg.role === "ai"){
            return new AIMessage(msg.content);
        }
    })
    if(isStream){
        return await agent.stream({
            messages: formattedMessages,
        })
    }else{
        const response = await agent.invoke({ 
            messages: formattedMessages,
        });
        return response.messages[response.messages.length - 1].text;
    }
}

export async function generateChatTitle(message){
    const response = await mistralModel.invoke([
        new SystemMessage(`
            You are an AI assistant that generates short, clear, and meaningful titles for chat conversations.

            The user will provide the first message of a conversation. Based on that, generate a concise title (2-5 words) that captures the main topic or intent.

            Guidelines:
            - Keep it brief (strictly 2-5 words)
            - Focus on the core subject or goal
            - Avoid filler words (e.g., "help with", "question about")
            - Use simple, natural language
            - Do not include punctuation unless necessary

            Only return the title, nothing else.

            User message: "${message}"
        `),
        new HumanMessage(`Generate a title for the above conversation starter based on the following first message: ${message}`)
    ]);
    return response.text;
}