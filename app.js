const express = require("express");
const app = express();
const path = require("path");
const url = require('url');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const expressValidator = require('express-validator');

mongoose.connect('mongodb://localhost/myappdb',{useNewUrlParser: true});
let db = mongoose.connection;

db.once('open', function(){
    console.log('Connected to mongoDb');
})
db.on('error',function(err){
    console.log(err);
});

let User = require('./models/user');



app.listen(3000, function(err){
    
});


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(expressValidator());

//set static path
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

app.use(function(req, res, next){
    res.locals.userData = req.session.userData || null;
    next();
});

app.use(require('connect-flash')());



app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Load view Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');



app.get('/', function(req, res){
    User.find({}, function(err, user){
        res.render('index', {
            title : "Registered User",
            user : user,
            
        });
    });
    
});

// user links redirect
let user = require('./routes/user');
app.use('/user', user);

let article = require('./routes/article');
app.use('/article', article);





