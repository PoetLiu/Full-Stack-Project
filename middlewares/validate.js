const publicPaths = ["dashboard", "login", "signup"];
const validPaths = {
    "Driver": ["g2", "g", "logout", "appointment_query","checkg2result","checkgresult"],
    "Admin": ["appointment", "logout", "appointment_query", "candidate", "candidate_query"],
    "Examiner": ["examiner", "logout", "examiner_get", "driver_appointed", "mark"]
}

const Authenticator = (req, res, next) => {
    const path = req.path.replace('/', '');
    console.log(path);
    if (publicPaths.includes(path)) {
        next();
        return;
    }

    const paths = validPaths[req.session.userType] || [];
    if (paths.includes(path)) {
        next();
    } else {
        res.redirect("/dashboard");
    }
}

export default Authenticator;