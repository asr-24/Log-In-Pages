//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.connect("mongodb://localhost:27017/ns_lab3", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("index");
});

app.get("/signup", function(req, res) {
    res.render("signup.ejs", {
        username_placeholder: "",
        password_message: "Generate Password?"
    });
});

var username = "";
var password = "";

app.post("/login", function(req, res) {
    username = req.body.username;
    password = req.body.password;

    const newuser = new User({
    username: username,
    password: password
  });
  newuser.save();

  res.render("signupResult", {
      id: "green",
      message: "Logged in Successfully!"
  });

});


function generateRandomString(n) {
    let randomString = '';
    let characters = '!@#$%^&*()-_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for ( let i = 0; i < n; i++ ) {
      randomString += characters.charAt(Math.floor(Math.random()*characters.length));
   }
   return randomString;
}


app.get("/generate-password", function(req, res) {
    res.render("signup.ejs", {
        username_placeholder: "Re-enter your Username / Email",
        password_message: "Generated password: " + generateRandomString(8)

    });
});



app.post("/login2", function(req, res) {
    // res.send("yo");
    let username = req.body.username;
    let password = req.body.password;

    // res.send(password);

    User.find({username: username}, function(err, user) {
        if (err) {
            res.render("index");
        } else {
            if (user[0] == null) {
                res.render("signupResult", {
                    id: "red",
                    message: "Log in failed - username invalid!"
                });
            } else if (user[0].password == password) {
                res.render("signupResult", {
                    id: "green",
                    message: "Logged in Successfully!"
                });
            } else {
                res.render("signupResult", {
                    id: "red",
                    message: "Log in failed - password incorrect!"
                });
            }
            // if (password == user.password) {
            //     res.send("workingn");
            // } else {
            //     res.send("not working");
            // }
        }
    })


});


app.listen(6969, function() {
  console.log("Server started on port 6969");
});
