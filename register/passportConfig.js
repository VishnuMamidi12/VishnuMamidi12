const LocalStrategy =require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initilize(passport) {
    const autheticateUser = (email,password,done) =>{
        pool.query(`SELECT * FROM users WHERE email=$1`,[email],(err,results) => {
            if(err) {
                throw err;
            }

            console.log(results.rows);

            if (results.rows.length > 0) {
              
            const user = results.rows [0];

                bcrypt.compare(password,user.password, (err, isMatch) =>{
                    if(err) {
                        console.log(err);
                    
                    } if(isMatch) {
                        return done(null, user);
                    }
                     else{
                        return done(null,false, {message : "Password Is Not Correct"});
                    }
                })
            }else {
                return done(null, false, {message: "email is not registered"});
            }
        }
        );
    };

    passport.use(
        new LocalStrategy(
            {
                usernameField : "email",
                passwordField : "password"
            },
            autheticateUser
        )
    );
    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser((user, done) => {
        pool.query(
            `SELECT * FROM users WHERE id=$1`,[id],(err, results) => {
                if(err) {
                    throw err;
                }
              //  console.log(`ID is ${results.rows[0].id}`)
                return done(null,results.rows[0]);
            })
    })
}

module.exports=initilize;