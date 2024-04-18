console.log("App is starting..");

import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import router from "./routes/routes.js";
import Authenticator from "./middlewares/validate.js";
import {} from 'dotenv/config'

const session_store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: "project",
    collectionName: "sessions"
})

const app = new express();
app.use(session({
    secret: "project",
    saveUninitialized: false,
    resave: false,
    store: session_store
}));
app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

// https://stackoverflow.com/questions/15191511/disable-etag-header-in-express-node-js
app.set('etag', false);

const port = process.env.PORT || 9090;
app.listen(port, () => {
    console.log("App is listening on port " + port);
});

app.use('/', Authenticator);
app.use('/', router);
