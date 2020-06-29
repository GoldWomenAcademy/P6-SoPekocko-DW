const bcryptjs = require('bcryptjs'); // We need this plugin to hash passwords
const jwt = require('jsonwebtoken'); // This plugin is used to secure connections via unique tokens
const mailValidator = require('email-validator'); // Little email validation plugin that acts as a regex
const passwordValidator = require('password-validator'); // Little password validation plugin that we configure later on

const User = require('../models/user');  // We call the user model 

var schema = new passwordValidator(); // And here we declare our password validation in the form of a schema

schema
.is().min(8)  // Minimum 8 characters long
.is().max(30) // Maximum 30 characters long
.has().not().spaces();  // Password cannot have spaces

exports.signup = (req, res, next) => {  // Function that allows users to register an account
    if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {  // We check email && password validity
        throw { error: "Merci de bien vouloir entrer une adresse email et un mot de passe valide !" }  // Fails if invalid
    } else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) {  // If both are valid
    bcryptjs.hash(req.body.password, 10)  // We hash and salt the password
        .then(hash => {  // We then create an object containing the user information
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()  // And we push this information to the DB
                .then(() => res.status(201).json({ message: 'User created !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error: 'Votre mot de passe doit faire entre 8 et 30 caractères et ne peut pas contenir un espace' }));
    }
};

exports.login = (req, res, next) => {  // Function that allows users to log into the application
    User.findOne({ email: req.body.email })  // We check the email input and compare it to our DB collection
        .then(user => {
            if (!user) {  // If the email isn't found, we throw an error
                return res.status(401).json({ error: 'User not found !'})
            }
            bcryptjs.compare(req.body.password, user.password)  // If the email exists, we first compare the password in the DB to the one that was input
                .then(valid => {
                    if (!valid) { // If the passwords don't match, error !
                        return res.status(401).json({ error: 'Wrong Password !'})
                    }
                    res.status(200).json({   // However if the passwords match, the user is logged in
                        userId: user._id,
                        token: jwt.sign(  // And a 24 hour token is generated, which will be compared throughout the connection
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
};

// We then export these 2 functions to ../routes/user.js