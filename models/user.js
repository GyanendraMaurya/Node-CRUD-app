const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    
        first_name : {
        },
        last_name : {
        },
        email : {
        },
        password : {
                
        }
    
});

module.exports = mongoose.model('user', userSchema);