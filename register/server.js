const express = require("express");
const {pool} = require("./dbConfig");
const bcrypt = require("bcrypt");
const session =require("express-session");
const flash = require("express-flash");
const passport =require("passport");
require("dotenv").config();
const app =express();
 
const PORT = process.env.PORT || 4000;

const initializePassport = require('./passportConfig');

initializePassport(passport);
 
app.set("view engine","ejs")
app.use(express.urlencoded({extended: false}))
 
app.use(session({
    secret: "secret",

    resave :false,

    saveUninitialized :false
})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


app.get("/",(req,res) => {
 res.render("index");
});
 
app.get('/users/register', (req,res) => {
 res.render("register");
});
 
app.get('/users/login', (req,res) => {
 res.render("login");
});
 
app.get('/users/dashboard', (req,res) => {
 res.render("dashboard",{user : req.fname});
});
app.get('/users/logout', (req,res) => {
  req.logOut();
  req.flash("sucess_msg", "You Have Logged Out");
  res.redirect("/users/login");
});
 
app.post("/users/register", async (req,res) => {
 let {fname,lname,email,mobileno,password,cpwd}= req.body;
 
 console.log({
 fname,
 lname,
 email,
 mobileno,
 password,
 cpwd
 });
 let errors =[];
 
 if(!fname || !email || !mobileno || !password || !cpwd )
 {
 errors.push({message : "Please enter all feilds"})
 }
 if (mobileno.length < 10 || mobileno.length > 10) {
    errors.push({ message: "Mobileno must be  10 digits long" });
  }

 if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

 if(password != cpwd)
 {
 errors.push({message : "Passwords do not match"});
 }
 if(errors.length > 0) {
 res.render("register", {errors});
 }  else {

  let hashedPassword = await bcrypt.hash(password,10);
  console.log(hashedPassword);

  pool.query(
    `SELECT * FROM users
    WHERE email = $1`,[email],
    (err,results) => {
      if(err) {
        throw err;
      }
      console.log(results.rows);

      if (results.rows.length > 0) {
        errors.push({ message:"Email Already Registered"});
        res.render("register", { errors});
      }else{
        pool.query( `INSERT INTO users (fname, lname, email, mobileno, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, password`,[fname,lname,email,mobileno,password],
        (err,results) =>{
          if(err) {
            throw err;
          }
          console.log(results.rows);
          req.flash("success_msg","You Are Now Registered. Please Log In");
          res.redirect('/users/login');
        })
      }
    }
  )
 }
});

app.post("/users/login",passport.authenticate( "local", {
  successRedirect:"/users/dashboard",
  failureRedirect:"/users/login",
  failureFlash:true
})
);

app.listen(PORT, () => {
 console.log(`server running on port ${PORT}`);
});