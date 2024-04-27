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
      default: 1001
    },
    Admin: {
      type: Number,
      default: 1000
    }
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String
})

module.exports = mongoose.model('User', userSchema)