const bcrypt = require('bcrypt')

const userDB = {
  users: require('../model/users.json'),
  setUsers: (data)=> this.users = data
}

const handleLogin = async (req, res)=>{
    const {username, pwd} = req.body
    if (!username || !pwd) return res.status(400).json({"message": `Username and password are required`})

    const foundUser = userDB.users.find((user) => user.username === username)
    if(!foundUser) return req.sendStatus(401)

    const passMatch = await bcrypt.compare(pwd, foundUser.password )
    if (passMatch){
      res.json({"success" : `User ${username} is logged in!`})
    }else{
      res.status(401).json({'message' : 'Password do not match'})
    }
    
}

module.exports = {handleLogin}