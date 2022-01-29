const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/admin');
module.exports = function(passport){
    passport.use('local',new LocalStrategy({usernameField: 'username'},(username,password,done) => {
        User.findOne({username:username}).then(user =>{
            if(!user){
                return done(null, false,console.log('no user'))
            }
            else{
                if( user.password === password){
                    return done(null,user);
                }
                else{
                    return done(null,false,console.log('incorrect password!'));
                }
            }
        })
    }));
    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        })
    });
};