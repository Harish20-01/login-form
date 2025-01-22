const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const port = 3000;

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

const userSchema = new mongoose.Schema({
    name: String,
    regno: String,
    email: { type: String, unique: true }
});

// MongoDB URI
const uri = "mongodb+srv://DBproject:project%4001@cluster0.5whxl.mongodb.net/?retryWrites=true&w=majority";
const db="school";
// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
     dbName:db,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout for MongoDB connection
})
.then(() => {
    //alert("Connected to MongoDB");
})
.catch((error) => {
    //alert("Error connecting to MongoDB:", error);
});

const User = mongoose.model('user', userSchema);

app.post('/submit', async (req, res) => {
   // console.log("request received", req.body);
    const { name, regno, email } = req.body;

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    if (validateEmail(email)) {
        try {
           // console.log(validateEmail);
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists" });
            }
            const user = new User({ name, regno, email });
            await user.save();
            //console.log("User saved successfully: " + name);
            res.status(200).json({ message: "User added successfully" });
        }
        catch (error) {
            //console.log(error);
            res.status(500).json({ error: "Something went wrong" });
        }
    } else {
        res.status(400).json({ error: "Invalid email ID" });
    }
});

app.listen(port, () => {
   // console.log("Server is listening on port 3000");
});
