const mongoose = require('mongoose');
const sauceValidation = require('../middleware/sauceValidation'); // Call the validation middleware for the sauces

const sauceSchema = mongoose.Schema({  // Generate a mongoose schema for our sauces 
    userId: { type: String, required: true },
    name: { type: String, required: true, validate : sauceValidation.nameValidator }, // cf ../middleware/sauceValidation.js
    manufacturer: { type: String, required: true, validate : sauceValidation.manufacturerValidator }, // cf ../middleware/sauceValidation.js
    description: { type: String, required: true, validate : sauceValidation.descriptionValidator }, // cf ../middleware/sauceValidation.js
    mainPepper: { type: String, required: true, validate : sauceValidation.pepperValidator }, // cf ../middleware/sauceValidation.js
    imageUrl: { type: String, required: true }, 
    heat: { type: Number, required: true, default : 0 },
    likes: { type: Number, required: false, default : 0 },
    dislikes: { type: Number, required: false, default : 0 },
    usersLiked: [{ type: String, required: false, default : [] }],
    usersDisliked: [{ type: String, required: false, default : [] }],
  });

module.exports = mongoose.model('Sauce', sauceSchema);