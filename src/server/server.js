const express = require("express");
const connectDB = require("../../config/db.js");

const app = express();

//Connect to MongoDB
connectDB();

//Middleware
app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/items", require("./routes/api/items"));

let PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server Started on ${PORT}`));
