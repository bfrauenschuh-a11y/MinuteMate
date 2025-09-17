const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Replace <db_password> with your actual password
const mongoURI = 'mongodb+srv://bfrauenschuh_db_user:<db_password>@minutemate.pkk3g7t.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/action-items', actionItemsRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));