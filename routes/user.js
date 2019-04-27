const express = require('express');
const router = express.Router();

let User = require('../models/user');
let Article = require('../models/article');

router.get('/login', function(req,res){
    if(req.session.userData){
        res.redirect('/');
    }
    res.render('userLogin',{
        title : "Log In"
    });
});

router.post('/login', function(req,res){
    let email = req.body.email;
    let password = req.body.password;
    let query = {email: email, password: password}

    User.findOne(query, function(err, result){
        if(err){

        }
        else if(result){
            req.session.userData = result;
            res.locals.userData = req.session.userData;
            req.flash('success', 'Login successful');
            res.redirect('/');
        }
        else{
            req.flash('danger', 'Invalid Email or Password');
            res.redirect('/user/login');
        }
    });
});

router.get('/logout', function(req,res){
    req.session.destroy(function(){
        res.locals.userData = null;
        res.redirect('/user/login');
    });
});



router.get('/register', function(req,res){
    if(req.session.userData){
        req.flash('warning','You are already Registered');
        res.redirect('/');
    }
    else{
        
        res.locals.valError = null;
        res.render('register',{
        title : 'Registration',
        });
    }   
});

router.post('/add', function(req,res){
    if(req.session.userData){
        req.flash('warning','You are already Registered');
        res.redirect('/');
    }
    else{
        console.log('aaaa-aaaa-aaaa');
        req.checkBody('firstName', 'First Name is required/Invalid First Name').notEmpty();
        req.checkBody('lastName', 'Last Name is required/Invalid Last Name').notEmpty();;
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'password is required').notEmpty();
        req.checkBody('password', 'Password doesn\'t match').equals(req.body.password2);
    
        let errors = req.validationErrors();
        if(errors){
            res.locals.valError = errors;
            console.log(errors); 
            res.render('register',{
                title : 'Registeration',
            });    
        }
        else{
    
            let userObj = new User();
            userObj.first_name = req.body.firstName;
            userObj.last_name = req.body.lastName;
            userObj.email = req.body.email;
            userObj.password = req.body.password;
        
            userObj.save(function(err){
                if(err){
                    console.log('------ERROR------');
                    console.log(err);
                }
                else{
                    req.flash('success', 'user added');
                    res.redirect('/');
                }
            });
        }      
    }
});


router.get('/update/:id', function(req,res){
    if(req.session.userData && req.session.userData._id == req.params.id){
        res.locals.valError = null;
        User.findById(req.params.id, function(err, user){
            if(err){
                alert("Invalid edit command");
                res.redirect('/');
            }
            else{
                res.render('updateUser',{
                    title : 'Update '+user.first_name,
                    user : user,
                });
            }
        });
    }
    else{
        res.redirect('/');
    }
});

router.post('/update/:id', function(req,res){

    if(req.session.userData && req.session.userData._id == req.params.id){
        req.checkBody('firstName', 'First Name is required/Invalid First Name').notEmpty();
        req.checkBody('lastName', 'Last Name is required/Invalid Last Name').notEmpty();;
        req.checkBody('email', 'Invalid Email').isEmail();
        req.checkBody('password', 'password is required').notEmpty();
        req.checkBody('password', 'Password doesn\'t match').equals(req.body.password2);
    
        let errors = req.validationErrors();
        if(errors){
            res.locals.valError = errors;
            User.findById(req.params.id, function(err, user){
                if(err){
                    alert("Invalid edit command");
                    res.redirect('/');
                }
                else{
                    res.render('updateUser',{
                        title : 'Update '+user.first_name,
                        user : user,
                    });
                }
            }); 
        }
        else{
            let userobj = {}
            userobj.first_name = req.body.firstName;
            userobj.last_name = req.body.lastName;
            userobj.email = req.body.email;
            userobj.password = req.body.password;
        
            let query = {_id :req.params.id}
        
            User.updateOne(query, userobj, function(err){
                if(err){
                    console.log('------ERROR------');
                    console.log(err);
                }
                else{
                    req.flash('success', 'User Updated Successfully');
                    res.redirect('/');
                }
            });
        }
    }
    else{
        res.redirect('/');
    }
   
});

router.delete('/delete/:id',function(req,res){
    if(req.session.userData && req.session.userData._id == req.params.id){
        let query = {_id: req.params.id}
        User.deleteOne(query,function(err){
            if(err){
                req.flash('warning', "Invalid delete request");
            }
            else{
                Article.deleteMany({author_id: req.params.id},function(err){
                    if(err){
                        alert("Error deleting articles");
                        res.redirect('/');
                    }
                    else{
                        req.session.destroy(function(){
                            res.locals.userData = null;
                            res.send('success');
                        });
                    }
                });
               
            }
        });
    }
});



module.exports = router;