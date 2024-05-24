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

if (process.env.NODE_ENV  !== 'prod') {
  logger.add(new winston.transports.Console({
    format: winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  }))
}


module.exports = logger;

