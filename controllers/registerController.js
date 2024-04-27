const bcrypt = require('bcrypt')
const User = require('../model/user.model')

const handleNewUser = async (req, res)=>{
  const {username, pwd} = req.body

  if (!username || !pwd) res.status(400).json({"message": "Username and password are required."})

  const duplicate = await User.findOne({usermame: username}).exec()
  console.log(duplicate)
  if (duplicate) return res.sendStatus(409) //Conflict

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10)
    
    const result = await User.create({
      "username" : username,
      "password" : hashedPwd
    })

    console.log(result)

    res.status(201).json({"success": `New user ${username} created!`})
  } catch (error) {
    res.status(500).json({"message": error.message})
  }
}

module.exports = {handleNewUser}