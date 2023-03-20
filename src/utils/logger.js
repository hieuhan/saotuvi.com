const { createLogger, format, transports } = require('winston');
module.exports = (path) => createLogger({
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.align(),
        format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
    ),
    transports: [
        new transports.File({
            filename: `${path}info.log`,//'src/admin/logs/info.log',
            level: 'info',
            format: format.combine(
                format.printf((i) =>
                    i.level === 'info' ? `${i.level}: ${i.timestamp} ${i.message}` : ''
                )
            ),
        }),
        new transports.File({
            filename: `${path}error.log`,//'src/admin/logs/error.log',
            level: 'error',
        }),
    ],
})