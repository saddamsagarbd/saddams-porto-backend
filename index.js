import express from 'express';
import cors from 'cors';
import serverless from "serverless-http";
import dotenv from 'dotenv';

dotenv.config();

// 2. Critical check — stop everything if key is missing
if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing in .env file!');
    process.exit(1); // Stop the server completely
}

const app = express();

// Middleware
// app.use(cors());
app.use(express.json());
app.use(cors({
    origin: ['https://www.gowithsagar.xyz', 'http://localhost:3000'],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));

// Routes
import emailRouter from './routes/email.js'
app.use('/api/email', emailRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export const handler = serverless(app);