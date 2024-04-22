const express = require('express')
const fsPromise = require('fs').promises
const userDB = {
  users: require('../model/users.json'),
  setUsers: (data)=> this.users = data
}

const handleNewUser = async (req, res)=>{
  const {username, pwd} = req.body

  if (!username || !pwd) res.status(400).json({"message": "Username and password are required."})

  const duplicate = userDB.users.find((user) => user.username === username)

  if (duplicate) res.sendStatus(409)

  try {
    const hashedPwd = await bcrypt.has(pwd, 10)
    userDB.users = [...userDB.users, {username, password: pwd}]
    
    await fsPromise.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))
    console.log(userDB)
    res.status(201).json({"success": `New user ${username} created!`})
  } catch (error) {
    res.status(500).json({"message": error.message})
  }
}

module.exports = {handleNewUser}