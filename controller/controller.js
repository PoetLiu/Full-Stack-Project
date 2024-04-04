import User from "../models/user_model.js";
import Appointment from "../models/appointment_model.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

class Controller {
    static home_get = (req, res) => {
        res.send(`
            <h1>Welcome to Home Page</h1>
        `);
    };

    static getUserById = async (id) => {
        return User.findById(id).populate("appointment");
    }

    static g_get = async (req, res) => {
        try {
            const user = await this.getUserById(req.session.userId);
            console.log(user);
            if (user) {
                if (user.licenseNumber === 'DEFAULT') {
                    req.session.msg = `Dear ${user.username}, please provide details.`;
                    res.redirect("/g2");
                } else {
                    res.render("g.ejs", { msg: this.getMsgOnce(req), user: user });
                }
            } else {
                req.session.msg = `Unknow userId: ${req.session.userId}.`;
                res.redirect("/login")
            }
        } catch (err) {
            console.log(`User Not Featched from db due to the error below\n${err}`);
            res.send(err);
        }
    };

    static g2_get = async (req, res) => {
        try {
            const user = await this.getUserById(req.session.userId);
            console.log(user);
            if (user) {
                const msg = this.getMsgOnce(req);
                if (user.licenseNumber === 'DEFAULT') {
                    // if user infos are 'DEFAULT', display an empty page.
                    res.render("g2.ejs", { msg: msg, user: { userType: user.userType } });
                } else {
                    res.render("g2.ejs", { msg: msg, user: user });
                }
            } else {
                req.session.msg = `Unknow userId: ${req.session.userId}.`;
                res.redirect("/login")
            }
        } catch (err) {
            console.log(`User Not Featched from db due to the error below\n${err}`);
            res.send(err);
        }
    };

    static g_post = async (req, res) => {
        const data = req.body;
        console.log(data);
        const errors = this.validate(req);
        if (errors) {
            req.session.msg = `Validate failed, errors: \n${errors}`;
            res.redirect("/g")
            return;
        }

        try {
            const user = await User.findByIdAndUpdate(
                req.session.userId,
                {
                    carDetails: {
                        make: data.make,
                        model: data.model,
                        year: data.year,
                        platno: data.platno,
                    }
                }, {
                new: true
            });
            console.log(user);
            req.session.msg = `Your Car Details Updated Successfully!`;
            res.redirect("/g")
        } catch (err) {
            console.log(`User not updated to MongoDB, due to err: \n${err}`);
            res.send(err);
        }
    };

    static g2_post = async (req, res) => {
        try {
            const data = req.body;
            console.log(data);
            const errors = this.validate(req);
            if (errors) {
                req.session.msg = `Validate failed, errors: \n${errors}`;
                res.redirect("/g2")
                return;
            }

            let appointment = await Appointment.findById(data.appointmentId);
            if (!appointment || !appointment.isTimeSlotAvailable) {
                req.session.msg = `Your appointment doesn't exist or not available.`;
                res.redirect("/g2");
                return;
            }
            appointment = await Appointment.findByIdAndUpdate(data.appointmentId,
                { isTimeSlotAvailable: false }
            );
            console.log(appointment);

            const hashedLicenseNumber = await bcrypt.hash(data.licenseNumber, 10);
            const user = await User.findByIdAndUpdate(req.session.userId, {
                firstName: data.firstName,
                lastName: data.lastName,
                age: data.age,
                licenseNumber: hashedLicenseNumber,
                appointment: data.appointmentId,
                carDetails: {
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    platno: data.platno,
                }
            });

            console.log(user);
            req.session.msg = `Your G2 Test Booked Successfully!`;
            res.redirect("/g2")
        } catch (err) {
            console.log(`User not saved to MongoDB, due to err: \n${err}`);
            res.send(err);
        }
    };

    static validate = (req) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msg = errors.formatWith(error => error.msg).array();
            console.log(msg);
            return msg;
        } else {
            return;
        }
    }

    static dashboard_get = (req, res) => {
        res.render(`dashboard.ejs`, {
            msg: this.getMsgOnce(req),
            userType: req.session.userType
        });
    };

    static getMsgOnce = (req) => {
        const msg = req.session.msg;
        delete req.session.msg;
        return msg;
    }

    static login_get = (req, res) => {
        res.render(`login.ejs`, { msg: this.getMsgOnce(req), userType: req.session.userType });
    };

    static login_post = async (req, res) => {
        try {
            const form = req.body;
            console.log(form);

            let user = await User.findOne({
                username: form.username
            })
            if (!user) {
                req.session.msg = `Dear ${form.username}, your account does not exist, please signup first.`;
                res.redirect("/signup");
                return;
            }

            const matched = await bcrypt.compare(form.password, user.password);
            if (matched) {
                req.session.userId = user._id;
                req.session.userType = user.userType;
                req.session.msg = `Dear ${form.username}, login successfull.`;
                res.redirect("/dashboard");
            } else {
                req.session.msg = `Dear ${form.username}, the password isn't correct.`;
                res.redirect("/login");
            }

        } catch (error) {
            res.send(error);
            console.log(error);
        }
    }

    static signup_get = (req, res) => {
        res.render(`signup.ejs`, { userType: req.session.userType, msg: this.getMsgOnce(req) });
    };

    static signup_post = async (req, res) => {
        try {
            const data = req.body;
            console.log(data);

            if (data.password !== data.confirmPassword) {
                req.session.msg = `The passwords you entered doesn't match.`;
                res.redirect("/signup")
                return;
            }

            let user = await User.findOne({
                username: data.username
            })
            if (user) {
                req.session.msg = `The username ${user.username} already existed, please login`;
                res.redirect("/login")
                return;
            }

            const hashedPwd = await bcrypt.hash(data.password, 10);
            const newUser = new User({
                username: data.username,
                password: hashedPwd,
                userType: data.userType
            });

            const userSaved = await newUser.save();
            console.log(userSaved);
            req.session.msg = `Dear ${userSaved.username}, your account signup successfully.`;
            res.redirect("/login");
        } catch (err) {
            console.log(`User not saved to MongoDB, due to err: \n${err}`);
            res.send(err);
        }
    };

    static logout_post = (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                throw err;
            } else {
                res.redirect("/dashboard");
            }
        })
    };

    static appointment_get = (req, res) => {
        res.render(`appointment.ejs`, { userType: req.session.userType, msg: this.getMsgOnce(req) });
    };

    static appointment_query_get = async (req, res) => {
        const date = req.query.date;
        const appointments = await Appointment.find({
            date: date,
        })
        res.json(appointments);
    };

    static appointment_post = async (req, res) => {
        try {
            const form = req.body;
            console.log(form);

            const existedAppointment = await Appointment.findOne({
                date: form.date,
                time: form.time
            })
            if (existedAppointment) {
                req.session.msg = `Your appointment slot exists already.`;
                res.redirect("/appointment");
                return;
            }

            const appointment = new Appointment({
                date: form.date,
                time: form.time
            });

            const appointmentSaved = await appointment.save();
            console.log(appointmentSaved);
            req.session.msg = `Your appointment slot created successfully.`;
            res.redirect("/appointment");
        } catch (error) {
            res.send(error);
            console.log(error);
        }
    };
}

export default Controller;