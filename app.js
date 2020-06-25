const express = require("express");
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);
const app = express();
const bodyParser = require("body-parser");
const exphbs    = require("express-handlebars");

//Handlebars middleware
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set Static folder
app.use(express.static(`${__dirname}/public`));

//Index Route
app.get("/", (req, res)=>{
    res.render("index" , {
        stripePublishableKey: keys.stripePublishableKey
    });
});

//charge route
app.post("/charge", (req, res)=>{
    const amount = 2500;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    }).then(customer=> stripe.charges.create({
        amount: amount,
        description: "Web development Ebook",
        currency: "usd",
        customer: customer.id
    })).then(charge=> res.render("success"));



})


const port = process.env.PORT || 5200;


app.listen(port, ()=>{
    console.log(`we are sunning on Port ${port}`);
});