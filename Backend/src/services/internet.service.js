import { tavily } from "@tavily/core";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function searchInternet({query}) {
    try{
        console.log("Searching internet for query:", query);
        const res = await tvly.search(query,{
            numResults: 5,
            searchDepth: "basic",
        });
        return JSON.stringify(res.results);
    } catch (error) {
        console.error("Error searching internet:", error);
        throw error;
    }
}