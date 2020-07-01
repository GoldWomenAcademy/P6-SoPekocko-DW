const Sauce = require('../models/sauces');  // Call the sauce model
const fs = require('fs');  // Call the "file-system" plugin

exports.createSauce = (req, res, next) => {  // Function to enable sauce creation
  const sauceObject = JSON.parse(req.body.sauce);  // Grab all the information inside the sauce input fields
  delete sauceObject._id; // Remove the _id, we'll get one by default from mongoDB
  const sauce = new Sauce({  // All the input values are put into an item
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // And we add the imageUrl to the image
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Sauce saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {  // Function to load information when selecting a specific sauce
  Sauce.findOne({ 
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => { // Function to enable sauce modification
  const sauceObject = req.file ? // We grab all the information from the selected sauce
  {  
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   } : { ...req.body };
  const sauce = new Sauce({ // And then we replace the existing sauce information by whatever modifications were made
    _id: req.params.id,
    userId: req.body.userId,
    name: req.params.name,
    manufacturer: req.params.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: req.body.imageUrl,
    likes: req.body.likes,
    dislikes: req.body.dislikes,
    usersLiked: req.body.usersLiked,
    usersDisliked: req.body.usersDisliked
  });
  Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}) // This new information is then pushed to the DB
  .then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => { // Function to allow sauce deletion
  Sauce.findOne({_id: req.params.id})  // Once you've selected the sauce you want to delete
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];  // The function deletes the sauces' image from the DB
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id}).then(  // And then it deletes the information pertaining to said sauce
          () => {
            res.status(200).json({
              message: 'Sauce deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {  // Function that fetches all existing sauces from the database and shows them on the main page
  console.log("getAllSauces")
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.reactToSauce = (req, res, next) => {  // Function that allows users to like / dislike / un-like / un-dislike sauces
  Sauce.findOne({_id: req.params.id})
  .then(sauce => { 
    switch (req.body.like) {  // Use of a switch to facilitate the 4 different cases 
        case 1 : // If the user liked the sauce
            if (!sauce.usersLiked.includes(req.body.userId)) {  // And that he hasn't like the sauce yet
              Sauce.updateOne({_id: req.params.id}, {$inc: {likes: 1}, $push: {usersLiked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(201).json({ message: 'Like ajouté avec succès !' }))
              .catch((error) => {res.status(400).json({error: error});});
            } // Add a like to the sauce and push his userId into the usersLiked array
          break;
  
        case -1 :  // If the user Disliked the sauce
            if (!sauce.usersDisliked.includes(req.body.userId)) {  // And that he hasn't disliked the sauce yet
              Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: 1}, $push: {usersDisliked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(201).json({ message: 'Dislike ajouté avec succès !' }))
          .catch(error => res.status(400).json({ error }));
            }  // Add a dislike to the sauce and push his userId into the usersDisliked array
          break;
  
        case 0: // Two different options here, either remove a like or remove a dislike
            if (sauce.usersLiked.includes(req.body.userId)) { // If the users' Id is already present in usersLiked
              Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(201).json({ message: 'Like annulé avec succès !' })) // Upon clicking like, remove a like from the sauce and remove his userId from the array
              .catch(error => res.status(400).json({ error }));
            } else if (sauce.usersDisliked.includes(req.body.userId)) { // If the users' ID is already present in usersDisliked
              Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: req.body.userId}, _id: req.params.id})
              .then(() => res.status(201).json({ message: 'Dislike annulé avec succès !' })) // Do the opposite
              .catch(error => res.status(400).json({ error })); 
            }   
          break;
        
        default: // If none of the previous 4 options are true, this error message will appear
          throw { error: "Impossible de modifier vos likes, merci de bien vouloir réessayer ultérieurement" };
    }
  })
  .catch(error => res.status(400).json({ error }));
};

// All of these controllers are imported in ../routes/sauces.js