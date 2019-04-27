const mongoose = require("mongoose");

let articleSchema = mongoose.Schema({
        title : {},
        body : {},
        author_id :{},
        author_name : {},
    
});

module.exports = mongoose.model('articles', articleSchema);