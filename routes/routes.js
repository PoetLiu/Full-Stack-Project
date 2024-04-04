import Controller from "../controller/controller.js";
import express from "express";
import {body, validationResult} from "express-validator";

const userDetailsValidator = [
    body('firstName', 'The minium firstName make length is 1 characters').isLength({min: 1}),
    body('lastName', 'The minimum lastName length is 1 characters').isLength({min: 1}),
    body('age', 'Age must be Alphanumeric').isAlphanumeric(),
    body('licenseNumber', 'The minimun platno length is 17 characters').isLength({min: 17}), 
    body('appointmentId', 'The Date and Time for appointment are required').notEmpty(), 
]

const carDetailsValidator = [
    body('make', 'The minimum make length is 4 characters').isLength({min: 4}),
    body('model', 'The minimum model length is 4 characters').isLength({min: 4}),
    body('year', 'Year must be Alphanumeric').isAlphanumeric(),
    body('platno', 'The minimun platno length is 6 characters').isLength({min: 6}),
];
const router = express.Router();

router.get("/", Controller.home_get);

router.get("/g", Controller.g_get);
router.post("/g", carDetailsValidator, Controller.g_post);

router.get("/g2", Controller.g2_get);
router.post("/g2", userDetailsValidator, carDetailsValidator, Controller.g2_post);


router.get("/dashboard", Controller.dashboard_get);

router.get("/login", Controller.login_get);
router.post("/login", Controller.login_post);

router.post("/logout", Controller.logout_post);

router.get("/signup", Controller.signup_get);
router.post("/signup", Controller.signup_post);


router.get("/appointment", Controller.appointment_get);
router.get("/appointment_query", Controller.appointment_query_get);
router.post("/appointment", Controller.appointment_post);

export default router;