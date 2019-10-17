var path = require('path'),
    sidebar = require('../helpers/sidebar'),
    formidable = require('formidable');


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

        form.on('fileBegin', function (name, file) {
            var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
            for (var i = 0; i < 6; i += 1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            };
            let ext = path.extname(file.name).toLowerCase();
            file.path = __dirname + '\\upload\\'+ imgUrl+ ext; 

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