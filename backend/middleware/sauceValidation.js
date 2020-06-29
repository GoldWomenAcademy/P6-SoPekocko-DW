const validate = require('mongoose-validator'); // Call the mongoose-validator plugin

exports.nameValidator = [  // Validation for the sauce name
  validate({
    validator: 'isLength',
    arguments: [3, 50],  // Name has to be between 3 and 50 characters long
    message: 'Le nom de votre Sauce doit être entre {ARGS[0]} and {ARGS[1]} caractères',
  }),
  validate({
    validator: 'matches',
    arguments: /^[a-z\d\-_\s]+$/i,  // Regex to limit the types of symbols usable for the sauce name
    message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer votre sauce",
  }),
];

exports.manufacturerValidator = [ // Validation for the sauce manufacturer
    validate({
      validator: 'isLength',
      arguments: [3, 30],  // Manufacturer has to be between 3 and 30 characters long
      message: 'Le nom du fabricant doit être entre {ARGS[0]} and {ARGS[1]} caractères',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-z\d\-_\s]+$/i, // Regex to limit the types of symbols usable for the manufacturer
      message: "Vous ne pouvez utiliser que des chiffres et des lettres pour nommer le fabricant",
    }),
  ];

  exports.descriptionValidator = [  //  Validation for the sauces' description
    validate({
      validator: 'isLength',
      arguments: [10, 100],
      message: 'Le nom du fabricant doit être entre {ARGS[0]} and {ARGS[1]} caractères',
    }),
    validate({
      validator: 'matches',
      arguments: /^[a-z\d\-_\s]+$/i, // Regex to limit the types of symbols usable for the sauce description
      message: "Vous ne pouvez utiliser que des chiffres et des lettres pour la description",
    }),
  ];

  exports.pepperValidator = [  // Validation for the main ingredient
    validate({
      validator: 'isLength',
      arguments: [2, 15],  // Has to be between 2 and 15 characters long
      message: 'Le nom du fabricant doit être entre {ARGS[0]} and {ARGS[1]} caractères',
    }),
    validate({
      validator: 'isAlphanumeric',  // Can only contain letters and numbers, no spaces or special symbols
      message: "Un seul ingrédient, en un mot s'il vous plaît",
    }),
  ];