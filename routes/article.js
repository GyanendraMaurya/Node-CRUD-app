const express = require('express');
const router = express.Router();


let Article = require('../models/article');

router.get('/add', function(req,res){
    if(req.session.userData){

        res.render('articleAdd',{
            title : "Add Article",
            authorName : req.session.userData.first_name +" "+req.session.userData.last_name,
        });
    }
    else{
        req.flash('warning','You must be logged In');
        res.redirect('/user/login');
    }
});
    

router.post('/add', function(req,res){
   
   if(req.session.userData){
        let article = new Article();
        article.title = req.body.title;
        article.body = req.body.body;
        article.author_id = req.session.userData._id;
        article.author_name = req.session.userData.first_name +" "+ req.session.userData.last_name;

        article.save(function(err){
            if(err){
                console.log('------ERROR------');
                console.log(err);
            }
            else{
                req.flash('success', 'Article added');
                res.redirect('/');
            }
        });
    }
    else{
        req.flash('danger','You must be logged In');
        res.redirect('/user/login');
    }
});

router.get('/articles', function(req,res){
    Article.find({}, function(err, article){
        res.render('articles', {
            title : "Articles",
            article : article, 
        });
    });
});

router.get('/:id', function(req,res){
    let id = req.params.id;
    Article.findOne({_id: id}, function(err, result){
        if(err){
            res.redirect('/article/articles');
        }
        else if(result){
            res.render('articleView',{
                title : result.title,
                article : result,
            });
        }
        else{
            req.flash('danger', 'Article does not exist');
            res.redirect('/article/articles');
        }
    });
});

router.get('/edit/:id', function(req,res){
    if(req.session.userData){
        let id = req.params.id;
        Article.findOne({_id:id},function(err, result){
            if(err){
                res.redirect('article/articles');
            }
            else if(result){
                if(req.session.userData._id == result.author_id){
                    res.render('editArticle',{
                        title : 'edit',
                        article: result,
                        authorName : req.session.userData.first_name +" "+req.session.userData.last_name,
                    });
                }
            }
            else{
                req.flash('danger','Invalid Edit Request');
                res.redirect('/article/articles');
            }
        });   
    }
    else{
        req.flash('danger','Invalid Edit Request');
        res.redirect('/article/articles');
    }
 
});

router.post('/edit/:id', function(req,res){
    if(req.session.userData){
        let id = req.params.id;
        Article.findOne({_id:id},function(err, result){
            if(err){
                res.redirect('article/articles');
            }
            else if(result){
                if(req.session.userData._id == result.author_id){
                    let article = {};
                    article.title = req.body.title;
                    article.body = req.body.body;

                    let query = {_id :req.params.id}
                    Article.updateOne(query, article, function(err){
                        if(err){
                            console.log("update eroorrrrrrrrrrrrrrrrrr");
                        }
                        else{
                            req.flash('success', 'Article Updated Successfully');
                            res.redirect('/article/articles');
                        }
                    });

                }
            }
        });
    }
});

router.delete('/delete/:id',function(req,res){
    let articleId = req.params.id;
    Article.findOne({_id:articleId}, function(err,result){
        if(err){
            
            res.redirect('article/articles');
        }
        else if(result){
            
            if(req.session.userData._id == result.author_id){
                Article.deleteOne({_id: articleId}, function(err){
                    if(err){
                        req.flash('danger','Error! cannot delete the article');
                    }
                    else{
                        req.flash('success', 'Artical deleted Successfully');
                        res.send('success');
                    }
                });
            }
            else{
                req.flash('danger', 'Error deleting article');
            }
        }
    });
});

module.exports = router;