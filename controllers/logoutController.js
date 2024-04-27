const User = require('../model/user.model')

const logoutHandler = async (req, res)=>{
  const cookies = req.cookies
  if(!cookies?.jwt) return res.sendStatus(204)

  const refreshToken = cookies.jwt
  const foundUser = await User.findOne({refreshToken})

  if(!foundUser){
    res.clearCookie('jwt', {httpOnly: true})
    return res.sendStatus(204)
  }

  //Delete from DB
  foundUser.refreshToken = ''
  const result = await foundUser.save()

  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true,})
  return res.sendStatus(204)
}


module.exports = {logoutHandler}