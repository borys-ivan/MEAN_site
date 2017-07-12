var express = require('express');
//var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
//----------------------------------
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/podcasts';
var ObjectId = require('mongodb').ObjectID;
//-----------------------------------
var multer = require('multer');

var dateFormat = require('dateformat');
var bodyParser = require('body-parser');
app.use(bodyParser());
//--------------------------------------
//app.use(session({secret: 'borys'}));
//app.use(bodyParser());
//--------------------------------------


var request = require('request');

var path = require('path');
var router = express.Router();



//app.use('/js', express.static(__dirname + 'assets/js'));
//app.use('/dist', express.static(__dirname + '/../dist'));
//app.use('/css', express.static(__dirname + 'assets/css'));
//app.use('/page', express.static(__dirname + '/page'));

//app.all('/*', function(req, res, next) {
// Just send the index.html for other files to support HTML5Mode
//    res.sendFile('index.html', { root: __dirname + "/public" });
//});


////////////////////
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Headers', 'Authorization, Lang');
    next();
})
//app.get('/track', function(req, res) {
//    res.sendFile(path.join(__dirname + '/test/page/track.html'));
//});

app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/page/admin.html'));
});
///////////////////////////////////////////////////////////////////
app.use('/', express.static(__dirname + '/public'));
//app.use(express.static(__dirname + "/test"));


app.get('/podcasts', function (req, res) {
    console.log('111I received a GET request1111')

//-------------------------------------------------------
//var url = 'mongodb://localhost:27017/contactlist';
// Use connect method to connect to the server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

//--------------------------------------------------------

        // Get the documents collection
        var collection = db.collection('podcasts');
        // Find some documents
        collection.find({}).sort({"_id":-1}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.json(docs);

        });
    });
});
/////////////// Insert some
app.post('/podcasts', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var collection = db.collection('podcasts');


        console.log(req.body);
        collection.insert([req.body], function (err, doc) {
            res.json(doc);

            db.close();
        });

    });

});
//////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////
app.delete('/podcasts/:id', function (req, res) {

//-------------------------------------------------------
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
//------------------------------------------------------
        var collection = db.collection('podcasts');
//-------------------------------------------------------
        var id = req.params.id;
        console.log(id);

        collection.deleteOne({_id: ObjectId(id)}, function (err, doc) {
            console.log(doc);
            res.json(doc);
        });
    });
});
/////////////////////////////////////////////////////////////////////////

app.get('/podcasts/:id', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
//------------------------------------------------------
        var collection = db.collection('podcasts');
//-------------------------------------------------------
        var id = req.params.id;
        console.log(id);

        collection.findOne({_id: ObjectId(id)}, function (err, doc) {
            console.log(doc);
            res.json(doc);
        });
    });
});
///////////////////////////////////////////////////////////////////////
app.put('/podcasts/:id', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
//------------------------------------------------------
        var collection = db.collection('podcasts');
        //------------------------------------------------------------
        var id = req.params.id;
        console.log(req.body.name);
        collection.findAndModify({_id: ObjectId(id)},
            [['_id', 'asc']],
            {$set: {topic: req.body.topic, description: req.body.description, date: req.body.date}},
            {new: true},
            function (err, doc) {
                res.json(doc);
            }
        );
    });
});

/////////////////////////////////////////////////////////////////////


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        //var datetimestamp = Date.now();
        //var datetimestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        // var datetimestamp = dateFormat(result.request_date, "yyyy-mm-dd h:MM:ss");

       // cb(null, file.fieldname + '-' + datetimestamp + file.originalname)

        //session.name_audio = file.originalname;

        //console.log(session.name_audio);
        cb(null,file.originalname)

    }
});
var upload = multer({ //multer settings
    storage: storage
}).single('file');
/** API path that will upload the files */
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.json({error_code: 1, err_desc: err});
            return;
        }
        res.json({error_code: 0, err_desc: null});
    })
});

//----------------------------------

/*db.contactlist.find(function (err, docs) {
 console.log(docs);
 res.json(docs);
 });*/
//----------------------------------


//});


app.listen(3000);
console.log("Server running on port 3000");


