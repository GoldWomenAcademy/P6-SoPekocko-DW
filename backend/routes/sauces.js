const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // We're going to need the auth middleware 

const multer = require('../middleware/multer-config');  // Aswell as multer for the post and put routes

const sauceCtrl = require('../controllers/sauces');  // And finally all of our controllers

/* Every single route will require that the user is authenticated before the sauces are loaded */

router.get('/', auth, sauceCtrl.getAllSauces); // Main route where all the sauces are loaded
router.post('/', auth, multer, sauceCtrl.createSauce); // Sauce creation route, need multer for the images
router.get('/:id', auth, sauceCtrl.getOneSauce); // Route loaded after clicking on a sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // Route where you can modify your sauce, multer loaded if you need to replace the image
router.delete('/:id', auth, sauceCtrl.deleteSauce);  // Route where you can delete your sauce
router.post('/:id/like', auth, sauceCtrl.reactToSauce);  // Route where you can react to any of the existing sauces 

module.exports = router; // We're exporting the routes straight to our app.js file