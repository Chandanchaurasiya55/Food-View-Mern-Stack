// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');

const app = express();

// Allow the client origin to be configured via environment (useful in production)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// If running behind a proxy (like on render/Heroku), enable trust proxy so secure cookies work
app.set('trust proxy', 1);

app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true
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
