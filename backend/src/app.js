// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();
// Configure CORS to allow requests from the frontend (localhost during development and deployed origin in production)
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_ORIGIN || 'https://food-view-mern-stack-62tn.onrender.com'
    // FRONTEND_ORIGIN env var can be set to your deployed frontend URL if different
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin like mobile apps, curl, or some dev tools
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
