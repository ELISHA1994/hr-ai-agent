import { MongoClient } from "mongodb";
import express, { Express, Request, Response } from "express";
import 'dotenv/config';
import {callAgent} from "./agent";

const app: Express = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_ATLAS_URI as string);

async function startServer() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get('/', (req: Request, res: Response) => {
            res.send('LangGraph Agent Server');
        });

        app.post('/chat', async (req: Request, res: Response) => {
            const initialMessage = req.body.message;
            const threadId = Date.now().toString();
            try {
                const response = await callAgent(client, initialMessage, threadId);
                res.json({ threadId, response });
            } catch (error) {
                console.error('Error starting conversation:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.post('/chat/:threadId', async (req: Request, res: Response) => {
            const { threadId } = req.params;
            const { message } = req.body;
            try {
                const response = await callAgent(client, message, threadId);
                res.json({ response });
            } catch (error) {
                console.error('Error in chat:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

startServer();