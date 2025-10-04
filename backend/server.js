// start server
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})