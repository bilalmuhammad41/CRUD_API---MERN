const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const userDB = {
  users: require('../model/users.json'),
  setUsers : (data)=> this.users = data
}

const handleRefreshToken = (req,res)=>{
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(401)
  console.log(cookies.jwt)

  const refreshToken = cookies.jwt
  const foundUser = userDB.users.find((user)=> user.refreshToken === refreshToken)
  console.log(userDB.users)
  if(!foundUser) return res.sendStatus(403)

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded)=>{
      if (err ||foundUser.username !== decoded.username) return res.sendStatus(403)
      const accessToken = jwt.sign(
        {"username": decoded.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '60s'}
      );
      res.json({accessToken})
    }
  )
}

module.exports = {handleRefreshToken}