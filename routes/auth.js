const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const FetchUser = require('../middleware/FetchUser')
const JWT_SEC_KEY = "AamirMajeedKhan@2000"
//Register a new User by POST at "api/aith/" doesn't require auth
router.post('/createUser',[
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 3 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    //Logic for Already Existing Users
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res
          .status(400)
          .json({ errors: 'Sorry! this email already exists' })
      }
      const salt =await bcrypt.genSalt(10);
      const secPass =await bcrypt.hash(req.body.password,salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      });

      const data ={
        user:{
            id:user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SEC_KEY);
    //   console.log(jwtData);
    //   res.json(user)
    res.json({"authToken":authToken})
    } catch (error) {
        console.error();
        res.status(500).send("Some error ocurred")
    }
  }
)

//Another Endpoint for Log in

router.post('/login',[
    // body('name').isLength({ min: 3 }),
    body('email','Enter a Valid Email Id').isEmail(),
    body('password','Password Cannot be Blank').exists(),
  ],async (req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    //Destructuring in JS
    const {email,password} = req.body;
    try {
        let user =await User.findOne({email});
        if(!user)
        {
           return res.status(404).json({error:"Invalid Credentials"})
        }

        const passwordCompare =await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(404).json({error:"You Have Entered Invalid Username or Password"})
        }

        const data ={
            user:{
                id:user.id
            }
          }
          const authToken = jwt.sign(data,JWT_SEC_KEY);
          res.json({authToken})

    } catch (error) {
        console.error(error.message);
        res.status(404).send("Internal Server Error")
    }
  })

  //Third Router : Retreive details of User
router.post('/getuser',FetchUser,async (req,res)=>{

    try {
      userId=req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);

} catch (error) {
      console.error(error.message);
      res.status(404).send("Internal Server Error")
    }
  })

module.exports = router
    