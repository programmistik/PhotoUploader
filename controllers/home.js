let mongo = require('mongodb');
let MClient = mongo.MongoClient;
let url = 'mongodb://localhost:27017';
let dbName = 'PhotoUploader';
let client  = new MClient(url, { useUnifiedTopology: true , useNewUrlParser: true });

var sidebar = require('../helpers/sidebar');
ImageModel = require('../models').Image;

module.exports = {
    index: function (req, res) {

        var viewModel = [];
        client.connect(async (err, resp) => {

            if(err) 
            {
                throw new Error(err);
            }  
            
            let db = client.db(dbName);
            let coll = db.collection('photos')
            .find().limit(5).toArray(function(err, result) {
                if (err) throw err;
                viewModel = result;
                console.log(result);
                sidebar(viewModel, function(viewModel) {
                    res.render('index', viewModel);
                    });
                //db.close();
              });
        });      
        

       
        
    }
};