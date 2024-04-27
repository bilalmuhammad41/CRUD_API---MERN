const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: Number,
      default: 1002
    },
    
    Editor: {
      type: Number,
      
    },
    Admin: {
      type: Number,
      
    }
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String
})

module.exports = mongoose.model('User', userSchema)