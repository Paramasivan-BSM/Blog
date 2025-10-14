const path = require("path");
const usermodel = require(path.join(__dirname, "..", "model", "auth.model.js"));
const tokenGenerator = require(path.join(__dirname,"..","utilities","tokenGenerator.js"));
const bcrypt = require("bcryptjs");


async function signUp(req, res) {
  try {

    

    let { name, email, password } = req.body ?? {};

    // Basic required-field check
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, errors: [{ field: null, msg: 'Name, email and password are required' }] });
    }

    // Normalize and sanity-check types
    email = String(email).trim().toLowerCase();
    password = String(password);

    // Email format check (simple). Use validator.isEmail in real apps for robust check.
    if (!email.includes('@')) {
      return res.status(400).json({ success: false, errors: [{ field: 'email', msg: 'Invalid email format' }] });
    }

    // Password length checks on raw password (before hashing)
    if (password.length < 6) {
      return res.status(400).json({ success: false, errors: [{ field: 'password', msg: 'Password must be at least 6 characters' }] });
    }
    if (password.length > 12) {
      return res.status(400).json({ success: false, errors: [{ field: 'password', msg: 'Password cannot exceed 12 characters' }] });
    }

    // Check duplicate email (manual friendly check)
    const exists = await usermodel.findOne({ email }).lean();
    if (exists) {
      return res.status(409).json({ success: false, errors: [{ field: 'email', msg: 'Email already registered' }] });
    }

    // Hash and save (hash is ~60 chars — do NOT apply maxlength on stored password)
    const hashedPassword = await bcrypt.hash(password, 10);
let role = "user";
  
if (req.originalUrl && req.originalUrl.includes("/")) {
  role = "admin";
}

   const user = new usermodel({ name, email, password: hashedPassword,role});
    
     
    await user.save();

    return res.status(201).json({ success: true, msg: 'User created successfully' });

  } catch (err) {
    // Handle race-condition duplicate key as fallback (11000)
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, errors: [{ field: 'email', msg: 'Email already registered' }] });
    }

    // Mongoose validation fallback (if any)
    if (err && err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => ({ field: e.path || null, msg: e.message || 'Invalid value' }));
      return res.status(400).json({ success: false, errors });
    }

    console.error('signUp error:', err);
    return res.status(500).json({ success: false, errors: [{ field: null, msg: 'Internal Server Error' }] });
  }
}



// Signin Handler



async function signIn(req, res) {
  try {
    let { email, password } = req.body ?? {};

    // basic input validation
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: "Email and password are required" });
    }

    email = String(email).trim().toLowerCase(); // normalize
    password = String(password);

    if (password.length < 6 || password.length > 12) {
      return res.status(400).json({ success: false, msg: "Password must be 6-12 characters" });
    }

    // findOne returns a single user doc or null
    const user = await usermodel.findOne({ email }).select("+password"); // if password is select:false in schema, ensure it's selected

    if (!user) {
      // Security: generic message to avoid leaking account existence
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    // compare password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      // you may implement rate-limiting or increment failed attempts here
      return res.status(401).json({ success: false, msg: "Invalid credentials" });
    }

    // generate token with minimal, non-sensitive payload
    const token = await tokenGenerator(user);

    res.cookie("token", token, {
  httpOnly: true,                 // prevents JS access (protects from XSS)
  secure: process.env.NODE_ENV === "production",  // only send cookie over HTTPS in prod
  sameSite: "lax",                // helps prevent CSRF
  maxAge: 5 * 60 * 60 * 1000      // cookie lifespan: 5 hours
});

    return res.status(200).json({ success: true, token, user });

  } catch (err) {
    console.error("signIn error:", err);
    return res.status(500).json({ success: false, msg: "Internal Server Error" });
  }
};


async function signOut(req,res) {


  try {

     res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax"
});

res.status(200).json({ success: true, msg: "Logged out successfully" });

    
  } catch (error) {

    res.status(500).json({

      success:false,
      msg:"error occured in Signout"
    })
    
  }



  
 
  
};



module.exports = { signUp,signIn,signOut };
