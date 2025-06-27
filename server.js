const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express(); 

//Connect database 
connectDB();
  
app.use(express.json({ extended: false}))   

app.get('/', (req, res) => res.json({msg: 'Welcome to Local Service API...'}))

// Serve static files from the "uploads" directory
app.use('/uploads/providers', express.static(path.join(__dirname, 'uploads', 'providers')));
 
//Define Routes 
app.use('/api/auth',require('./routes/auth'));
app.use('/api/provider/services', require('./routes/service'));
app.use('/api/provider',require('./routes/provider'));
app.use('/api/customer',require('./routes/customer'));
 // Add or uncomment and modify this line    
// app.use('/api/booking',require('./routes/booking')) 
       
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));    