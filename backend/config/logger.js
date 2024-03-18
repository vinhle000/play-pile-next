const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize({ all: true}),
    winston.format.timestamp(),
    // winston.format.align(),
    winston.format.json(),
  ),
  transports:[
    new winston.transports.File({ filename: 'error.log', level: 'error'}),
    new winston.transports.File({ filename: 'combined.log'}),
  ],
});

if (process.env.NODE_ENV  !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }))
}


module.exports = logger;

