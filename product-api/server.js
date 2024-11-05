const app = require('./app');
const express = require('express');
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000' })); 
app.use(express.json());


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
