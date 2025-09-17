const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const actionItemsRoutes = require('./routes/actionItems');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/action-items', actionItemsRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));
