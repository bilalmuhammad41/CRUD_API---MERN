const bcrypt = require('bcrypt')

const userDB = {
  users: require('../model/users.json'),
  setUsers: (data) => {this.users = data}
}

const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res)=>{
    const {username, pwd} = req.body
    if (!username || !pwd) return res.status(400).json({"message": `Username and password are required`})

    const foundUser = userDB.users.find((user) => user.username === username)
    
    if(!foundUser) return req.sendStatus(401)
    
    const passMatch = await bcrypt.compare(pwd, foundUser.password )
    if (passMatch){
      
      const accessToken = jwt.sign(
        {"username" : foundUser.username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '60s'}
      )
      
      const refreshToken = jwt.sign(
        {"username" : foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        {"expiresIn": '1d'}
      )
      
      const otherUsers = userDB.users.filter((user) => user.username !== foundUser.username)
      const currentUser = {...foundUser, refreshToken}
      userDB.users = [...otherUsers, currentUser]
      // console.log(userDB.users)
      

      await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))

      res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000})
      res.json({accessToken})
    }else{
      res.status(401).json({'message' : 'Password do not match'})
    }
    
}

module.exports = {handleLogin}