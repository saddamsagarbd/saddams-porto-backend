import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import serverless from "serverless-http";
import emailRouter from './routes/email.js';

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://www.gowithsagar.xyz'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use('/api/email', emailRouter);

// Test route
app.get('/api', (req, res) => {
    res.json({ message: 'API is working' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ 
            error: 'CORS Error',
            message: 'Origin not allowed' 
        });
    }
    
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

export default serverless(app);