console.log("App is starting..");

import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import router from "./routes/routes.js";
import Authenticator from "./middlewares/validate.js";

const uri = "mongodb+srv://albertliumr:TO5ZyE9PjM9yIxYx@cluster0.idyc212.mongodb.net/assignment3?retryWrites=true&w=majority";
const session_store = MongoStore.create({
    mongoUrl: uri,
    dbName: "assignment4",
    collectionName: "sessions"
})

const app = new express();
app.use(session({
    secret: "assignment3",
    saveUninitialized: false,
    resave: false,
    store: session_store
}));
app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

// https://stackoverflow.com/questions/15191511/disable-etag-header-in-express-node-js
app.set('etag', false);

const port = 9090;
app.listen(port, () => {
    console.log("App is listening on port " + port);
});

app.use('/', Authenticator);
app.use('/', router);