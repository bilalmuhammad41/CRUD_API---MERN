const fsPromises = require('fs').promises
const fs = require('fs')
const {format} = require('date-fns')
const path = require('path')
const {v4: uuid} = require('uuid')

const logEvents = async (message ,logName)=>{
  const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  console.log(logItem)
  try {
    if(!fs.existsSync(path.join(__dirname,  '..', 'logs'))){
      await fsPromises.mkdir(path.join(__dirname, 'logs'))
    }
    await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem)
  } catch (error) {
    console.log('Error: ', error)
  }
}

const logger = (req, res, next)=>{
  logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, 'regLog.txt')
  console.log(`${req.method}\t${req.url}`)
  next()
}

module.exports = {logger, logEvents}