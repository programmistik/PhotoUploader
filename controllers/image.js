var path = require('path'),
    sidebar = require('../helpers/sidebar'),
    formidable = require('formidable');

let mongo = require('mongodb');
let MClient = mongo.MongoClient;
let url = 'mongodb://localhost:27017';
let dbName = 'PhotoUploader';
let client = new MClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

var fname, fpath, ftitle, fdesc;
let ok = false;

module.exports = {

    index: function (req, res) {

        var viewModel = {
            image: {
                uniqueId: 1,
                title: 'Sample Image 1',
                description: 'This is a sample.',
                filename: 'sample1.jpg',
                views: 0,
                likes: 0,
                timestamp: Date.now()
            },
            comments: [
                {
                    image_id: 1,
                    email: 'test@testing.com',
                    name: 'Test Tester',
                    gravatar: 'http://lorempixel.com/75/75/animals/1',
                    comment: 'This is a test comment...',
                    timestamp: Date.now()
                }, {
                    image_id: 1,
                    email: 'test@testing.com',
                    name: 'Test Tester',
                    gravatar: 'http://lorempixel.com/75/75/animals/2',
                    comment: 'Another followup comment!',
                    timestamp: Date.now()
                }
            ]
        };

        sidebar(viewModel, function (viewModel) {
            res.render('image', viewModel);
        });
    },
    create: function (req, res) {

        var form = new formidable.IncomingForm();

        form.parse(req);

        form.on('field', function (name, field) {
            if (name === 'title') {
                ftitle = field;
                console.log(field);
                
            }
            if (name === 'description') {
                fdesc = field;
                console.log(field);
            }
        })

        form.on('fileBegin', function (title, file) {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
            for (var i = 0; i < 6; i += 1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            };
            var ext = path.extname(file.name).toLowerCase();
            file.path = __dirname + '\\upload\\' + imgUrl + ext;
            fname = imgUrl;
            fpath = file.path;
            addToDb();
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
        });

       

    },
        like: function (req, res) {

            res.json({ likes: 1 });

        },
        comment: function (req, res) {
            res.send('The image:comment POST controller');
        }
    };

    function addToDb(){
        client.connect(async (err, res) => {

            if (err) {
                throw new Error(err);
            }

            let db = client.db(dbName);
            let coll = db.collection('photos');

            // create
            let doc = {
                title: ftitle,
                description: fdesc,
                filename: fname,
                filepath: fpath,
                views: 0,
                likes: 0,
                timestamp: Date.now()
            }

            let response = await coll.insertOne(doc);
            console.log(response);
        });
    }