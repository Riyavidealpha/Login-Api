require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');



const sequelize = require('./config/database');
const Auth = require('./model/auth');


const saltrounds = 10;
const app = express();


sequelize.sync();

app.use(express.json());

app.use(cors());



function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, 'process.env.SECRET', (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}



// salt rounds bcrypt
bcrypt.genSalt(saltrounds,)

// post method

app.post('/auth', async (req, res) => {
    const { fullname, username, password } = req.body;

    try {
        // Hash the password
        bcrypt.genSalt(saltrounds, async (err, salt) => {
            if (err) {
                console.error('Error generating salt:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            bcrypt.hash(password, salt, async (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }

                try {
                    // Create the user in the database
                    const auth = await Auth.create({
                        fullname: fullname,
                        username: username,
                        password: hashedPassword,
                        // role: role

                    });

                    console.log('New auth created:', auth);

                    // Generate a JWT token
                    const token = jwt.sign({ username: username }, 'process.env.SECRET');

                    const decoded = jwt.verify(token, 'process.env.SECRET');

                    console.log('Decoded Token:', decoded);

                    // Respond with success message and token
                    res.status(201).json({ message: 'User Created Successfully', token: token });
                } catch (err) {
                    console.error('Error creating auth:', err);
                    res.status(500).json({ message: 'Internal server error' });
                }
            });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});




app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed successfully' });
});


app.get('/heartbeat', (req, res) => {
    res.json({ message: 'Server is alive', timestamp: new Date() });
});
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




// Login part 


app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    try {
        // Find the user in the database
        const user = await Auth.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Compare the provided password with the hashed password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate a token
        const token = jwt.sign({ username: username }, 'process.env.SECRET');

        // Send the token in the response headers
        res.setHeader('Authorization', `Bearer ${token}`);
        const decoded = jwt.verify(token, 'process.env.SECRET');

        console.log('Decoded Token:', decoded);

        return res.status(200).json({ message: 'Login successful', token: token });



    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// home page


app.get('/home', authenticateToken, async (req, res) => {
    try {
        const user = await Auth.findOne({ where: { username: req.user.username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Welcome to the home page', user: user });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// to get all the users 

app.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await Auth.findAll();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});