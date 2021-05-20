const { Mongoose } = require("mongoose");
const bcrypt = require('bcrypt');


const UserSchema = new Mongoose.Schema({
    id: {type: ObjectId, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String}
});

UserSchema.pre('save', function(next){
    if(this.isModified('password') || this.isNew){
        const document = this;

        bcrypt.hash(document.password, 10, (err, hash) => {
            if(err){
                next(err);
            }else{
                document.password = hash;
                next();
            }
        })
    }else{
        next();
    }
});

UserSchema.methods.isCorrectPassword = function(password, callback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);