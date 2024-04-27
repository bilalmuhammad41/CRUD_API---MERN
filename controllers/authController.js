const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/user.model')

const handleLogin = async (req, res)=>{
    const {username, pwd} = req.body
    if (!username || !pwd) return res.status(400).json({"message": `Username and password are required`})

    const foundUser = await User.findOne({username}).exec();
    
    if(!foundUser) return res.sendStatus(401)
    
    const passMatch = await bcrypt.compare(pwd, foundUser.password )
    if (passMatch){
      const roles = Object.values(foundUser.roles)
      const accessToken = jwt.sign(
        {
          "UserInfo" : {
            "username" : foundUser.username,
            "roles" : roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '60s'}
      )
      
      const refreshToken = jwt.sign(
        {"username" : foundUser.username},
        
        process.env.REFRESH_TOKEN_SECRET,
        {"expiresIn": '1d'}
      )
      
      foundUser.refreshToken = refreshToken
      const result = await foundUser.save()
      console.log(result)

      res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
      res.json({accessToken})
    }else{
      res.status(401).json({'message' : 'Password do not match'})
    }
    
}

module.exports = {handleLogin}