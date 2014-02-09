var model = require('../models/recipeModel');
var logger = require('log-hanging-fruit').defaultLogger;


var _notFound = function(req, res, key) {
  logger.warn('Recipe not found. Key [' + key + ']');
  res.status(404).send({message: 'Recipe not found' });
};


var _error = function(req, res, title, err) {
  logger.error(title + ' ' + err);
  res.status(500).send({message: title, details: err});
};


var _recipesToJson = function(documents) {
  var recipes = [];
  var i, recipe, doc; 
  for(i=0; i<documents.length; i++) {
    doc = documents[i];
    recipe = {
      name: doc.name,
      date: doc.date,
      key: doc.key,
      url: doc.url,
      isStarred: doc.isStarred,
      isShoppingList: doc.isShoppingList
    }
    recipes.push(recipe);
  }
  return recipes;
}


var allRecipes = function(req, res) {

  logger.info('recipeRoutes.allRecipes');

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.getAll(function(err, documents){

    if(err) {
      return _error(req, res, "Cannot retrieve all recipes", err);
    }

    var recipes = _recipesToJson(documents);
    res.send(recipes);
  });

};


var favorites = function(req, res) {

  logger.info('recipeRoutes.favorites');

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.getFavorites(function(err, documents){

    if(err) {
      return _error(req, res, "Cannot retrieve favorite recipes", err);
    }

    var recipes = _recipesToJson(documents);
    res.send(recipes);
  });

};


var shopping = function(req, res) {

  logger.info('recipeRoutes.shopping');

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.getShopping(function(err, documents){

    if(err) {
      return _error(req, res, "Cannot retrieve shopping list", err);
    }

    var recipes = _recipesToJson(documents);
    res.send(recipes);
  });

};


var search = function(req, res) {

  var text = req.query.text;
  if((typeof(text) != 'string') || (text === 'undefined')) {
    logger.info('recipeRoutes.search (no text specified)');
    return res.send([]);
  }

  if(text.trim().length === 0) {
    logger.info('recipeRoutes.search (empty text specified)');
    return res.send([]);
  }

  logger.info('recipeRoutes.search (' + text + ')');

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.search(text, function(err, documents){

    if(err) {
      return _error(req, res, "Error searching", err);
    }

    var recipes = _recipesToJson(documents);
    res.send(recipes);
  });

};

var scrapBook = function(res) {

	  logger.info('recipeRoutes.scrapBook');

	  
	    res.send(recipes);
	  
	};



var view = function(req, res) {

  var key = parseInt(req.params.key)
  var url = req.params.url;
  var decode = req.query.decode === "true";
  var m = model.recipes(req.app.settings.config.dbUrl);

  logger.info('recipeRoutes.oneData (' + key + ', ' + url + ')');
  m.getOne(key, decode, function(err, doc){

    if(err) {
      return _error(req, res, 'Error fetching recipe [' + key + ']', err);
    }

    if(doc === null) {
      return _notFound(req, res, key);
    }

    var recipe = {
      name: doc.name,
      date: doc.date,
      key: doc.key,
      url: doc.url,
      ingredients: doc.ingredients,
      directions: doc.directions,
      notes: doc.notes,
      isStarred: doc.isStarred,
      isShoppingList: doc.isShoppingList
    }

    res.send(recipe);
  });

};


var starOne = function(req, res) {
  logger.info('recipeRoutes.starOne');
  _starOne(req, res, true);
};


var unstarOne = function(req, res) {
  logger.info('recipeRoutes.unstarOne');
  _starOne(req, res, false);
};


var _starOne = function(req, res, star) {
  var key = parseInt(req.params.key)
  var url = req.params.url;
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.starOne(key, star, function(err) {
    if(err) {
      return _error(req, res, 'Could not star/unstar key: ' + key, err);
    }
    res.send({starred: star});
  });
}


var shop = function(req, res) {

  logger.info('recipeRoutes.shop');
  
  var key = parseInt(req.params.key)
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.addToShoppingList(key, function(err) {
    if(err) {
      return _error(req, res, 'Could not update key: ' + key, err);
    }
    res.send({shop: true});
  });

};


var noShop = function(req, res) {

  logger.info('recipeRoutes.noShop');

  var key = parseInt(req.params.key)
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.removeFromShoppingList(key, function(err) {
    if(err) {
      return _error(req, res, 'Could not update key: ' + key, err);
    }
    res.send({shop: false});
  });

};


var save = function(req, res) {

  var key = parseInt(req.params.key);
  logger.info('saving ' + key);

  var data = {
    key: key,
    name: req.body.name,
    date: req.body.date,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    notes: req.body.notes
  };

  if(data.name === '') {
    return _error(req, res, 'Recipe name cannot be empty', 'key: ' + key);
  }

  var m = model.recipes(req.app.settings.config.dbUrl);
  m.updateOne(data, function(err, updatedDoc) {

    if(err) {
      return _error(req, res, 'Error updating recipe', err);
    }

    logger.info('saved');
    res.send(updatedDoc);

  });

};


// var touchAll = function(req, res) {
//   logger.info('recipeRoutes.touchAll');
//   var m = model.recipes(req.app.settings.config.dbUrl);
//   m.touchAll(function(err) {
//     res.send({done: 1});
//   });
// }


var addNew = function(req, res) {
  
  logger.info('recipeRoutes.addNew');
  var m = model.recipes(req.app.settings.config.dbUrl);
  m.addNew(function(err, newDoc) {

    if(err) {
      return _error(req, res, 'Error saving new recipe', err);
    }

    logger.info('Saved new recipe. Key: ' + newDoc.key);
    res.send(newDoc);

  });

};


module.exports = {
  allRecipes: allRecipes, 
  favorites: favorites,
  shopping: shopping, 
  search: search,
  view: view,
  save: save,
  scrapBook: scrapBook,
  star: starOne,
  unstar: unstarOne,
  shop: shop,
  noShop: noShop,
  addNew: addNew
  //, 
  //touchAll: touchAll
}
