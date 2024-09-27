import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { z } from "zod";
import "dotenv/config";

export async function callAgent(client: MongoClient, query: string, thread_id: string) {
    // Define the MongoDB database and collection
    const dbName = "hr_database";
    const db = client.db(dbName);
    const collection = db.collection("employees");

    const GraphState = Annotation.Root({
        messages: Annotation<BaseMessage[]>({
            reducer: (x, y) => x.concat(y),
        }),
    });

    const employeeLookupTool = tool(
        async ({ query, n = 10 }) => {
            console.log("Employee lookup tool called");

            const dbConfig = {
                collection: collection,
                indexName: "vector_index",
                textKey: "embedding_text",
                embeddingKey: "embedding",
            };
            const vectorStore = new MongoDBAtlasVectorSearch(
                new OpenAIEmbeddings(),
                dbConfig
            );

            const result = await vectorStore.similaritySearchWithScore(query, n);
            return JSON.stringify(result);
        },
        {
            name: "employee_lookup",
            description: "Gathers employee details from the HR database",
            schema: z.object({
                query: z.string().describe("The search query"),
                n: z.number().optional().default(10).describe("Number of results to return"),
            }),
        }
    )

    const tools = [employeeLookupTool];

    // We can extract the state typing via `GraphState.State`
    const toolNode = new ToolNode<typeof GraphState.State>(tools);

    const model = new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0,
    }).bindTools(tools);
}