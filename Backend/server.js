const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db.js");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;




// Import the user routes
const userRoutes = require('./routes/user');
const jobRoutes = require("./routes/jobcandidate.js");
const candidateRoute = require('./routes/candidate.js');

// Mount all user routes at /api
app.use('/api', userRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/candidates',candidateRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

