var db = require('./dbRecipes');
var util = require('./recipeUtil');
var Encoder = require('node-html-encoder').Encoder;
var dbUrl = null;


var encodeText = function(encoder, text) {
  if (text === undefined) {
    return '';
  }
  text = encoder.htmlEncode(text);
  text = text.replace(/&#13;&#10;/g, '<br/>');
  text = text.replace(/&#13;/g,'<br/>');
  text = text.replace(/&#10;/g,'<br/>');
  return text;
};


var decodeText = function(encoder, text) {
  if (text === undefined) {
    return '';
  }  
  text = encoder.htmlDecode(text);
  text = text.replace(/<br\/>/g, '\r\n')
  return text;
};


var searchText = function(text) {
  if (typeof(text) === 'string') {
    // http://stackoverflow.com/a/9364527/446681
    return text.replace(/\W/g, ' ').toLowerCase().trim();
  }
  return '';
};


var prepareForSave = function(data) {
  // encode data first
  var encoder = new Encoder('entity');
  data.name = encodeText(encoder, data.name);
  data.date = encodeText(encoder, data.date);
  data.feelings = encodeText(encoder, data.feelings);
  data.sharedWith = encodeText(encoder, data.sharedWith);
 // data.notes = encodeText(encoder, data.notes);
  
  // calculate a few fields
  data.url = util.getUrlFromName(data.name);
  data.sortName = data.name.toLowerCase();
  data.searchText = searchText(data.name) + ' ' + 
  	
    searchText(data.feelings) + ' ' ;
    //searchText(data.directions) + ' ' +
   // searchText(data.notes) + ' ';

  data.isStarred = data.isStarred === true;
  data.isShoppingList = data.isShoppingList === true;
  return data;
};


var decodeForEdit = function(data) {
  var encoder = new Encoder('entity');
  data.name = decodeText(encoder, data.name);
  data.date = decodeText(encoder, data.date);
  data.feelings = decodeText(encoder, data.feelings);
  data.sharedWith = decodeText(encoder, data.sharedWith);
 // data.notes = decodeText(encoder, data.notes);
  return data;
};


var getAll = function(cb) {
  db.setup(dbUrl);
  db.fetchAll(function(err, documents) {
    cb(err, documents);
  });
};


var getFavorites = function(cb) {
  db.setup(dbUrl);
  db.fetchFavorites(function(err, documents) {
    cb(err, documents);
  });
};


var getShopping = function(cb) {
  db.setup(dbUrl);
  db.fetchShopping(function(err, documents) {
    cb(err, documents);
  });
};


var search = function(text, cb) {
  db.setup(dbUrl);
  var cleanText = searchText(text);
  db.search(cleanText, function(err, documents) {
    cb(err, documents);
  });
};


var getOne = function(key, decode, cb) {
  db.setup(dbUrl);
  db.fetchOne(key, function(err, document) {
    if(decode) {
      document = decodeForEdit(document);
    }
    cb(err, document);
  });
};


var addNew = function(cb) {

  db.setup(dbUrl);
  db.getNewId(function(err, id) {

    if(err) return cb(err);
    
    var data = {
      key: id,
      name: 'New Event',
      date: '', 
      feelings: '',
      sharedWith: ''
    };
    data = prepareForSave(data);

    db.addOne(data, function(err, savedDoc) {
      cb(err, savedDoc);
    });

  });

};


var updateOne = function(data, cb) {

  db.setup(dbUrl);
  data = prepareForSave(data);
  db.updateOne(data, function(err, savedDoc) {
    if (err) return cb(err);
    cb(null, savedDoc);
  });

};


var starOne = function(key, starred, cb) {

  db.setup(dbUrl);
  db.starOne(key, starred, function(err) {
    if (err) return cb(err);
    cb(null);
  });

};


var addToShoppingList = function(key, cb) {
  db.setup(dbUrl);
  db.addToShoppingList(key, function(err) {
    if (err) return cb(err);
    cb(null);
  });
};


var removeFromShoppingList = function(key, cb) {
  db.setup(dbUrl);
  db.removeFromShoppingList(key, function(err) {
    if (err) return cb(err);
    cb(null);
  });
};


var touchAll = function(cb) {
  console.log("model touch all");
  getAll(function(err, docs) {

    for(i=0; i<docs.length; i++) {

      getOne(docs[i].key, true, function(err2, doc) {

        updateOne(doc, function(err3, d) {
          if(err) 
            console.log(err3);
          else
            console.log("Touched " + d.key);
        });

      });

    }

    console.log("All documents have been queued for saving");
    cb();
  });
}

var publicApi = {
  getAll: getAll,
  getFavorites: getFavorites,
  getShopping: getShopping,
  search: search,
  getOne: getOne,
  addNew: addNew,
  updateOne: updateOne,
  starOne: starOne,
  addToShoppingList: addToShoppingList,
  removeFromShoppingList: removeFromShoppingList,
  touchAll: touchAll
};


module.exports.recipes = function(dbConnString) {
  dbUrl = dbConnString;
  return publicApi;
};

