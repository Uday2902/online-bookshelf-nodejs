const express = require('express');
const jwt = require('jsonwebtoken');

const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();
    
app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'SECRET_KEY', (err, decodedToken) => {
        if (err) {
          console.error('Token verification failed:', err);
          res.status(400).json({message: "Verification failed for JWT"})
        } else {
          console.log('Decoded Token:', decodedToken);
          req.username = decodedToken.username
          next()
        }
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
