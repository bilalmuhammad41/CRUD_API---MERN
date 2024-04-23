const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next)=>{
  const authHeader = req.headers['authorization']
  console.log(authHeader)
  if(!authHeader) return res.sendStatus(401) //Unauthorized
  const token = authHeader.split(' ')[1]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) =>{
      if (err) return res.sendStatus(403) //invalidToken
      req.username = decoded.username
      next()
    }
  )

}


module.exports = verifyJWT