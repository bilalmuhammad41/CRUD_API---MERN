const userDB = {
  users: require('../model/users.json')
}
const fsPromise = require('fs').promises
const path = require('path')

const logoutHandler = async (req, res)=>{
  const cookies = req.cookies
  if(!cookies?.jwt) return res.sendStatus(204)

  const refreshToken = cookies.jwt
  const foundUser = userDB.users.find((user) => user.refreshToken === refreshToken)

  if(!foundUser){
    res.clearCookie('jwt', {httpOnly: true})
    return res.sendStatus(204)
  }

  //Delete from DB
  const otherUsers = userDB.users.filter((user) => user.refreshToken !== refreshToken)
  const currentUser = {...foundUser, refreshToken: ''}
  userDB.users = [...otherUsers, currentUser]
  await fsPromise.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))
  
  res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true,})
  return res.sendStatus(204)
}


module.exports = {logoutHandler}