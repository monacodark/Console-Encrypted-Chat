const { serverPort } = require('../config')
const Controller = require('./modules/Controller')
const io = require('socket.io').listen(serverPort)

console.log('Сервер запущен, теперь можно запускать клиенты')

io.sockets.on('connection', (socket) => {
    const controller = new Controller(socket)


    socket.on('message', (payloadStr) => {
        const payload = JSON.parse(payloadStr)
        const { command, data } = payload

        switch (command) {
            // Авторизовался пользователь
            case 'auth_user':
                controller.authUser(data)
                break;
            // Отправлено публичное сообщение
            case 'send_message_public':
                controller.sendMessagePublic(data)
                break
            // Отправлено приватное сообщение
            case 'send_message_private':
                controller.sendMessagePrivate(data)
                break
            default:
                console.log('Unknown command', payload)
                break;
        }
    })

    socket.on('disconnect', (data) => {
        controller.userLeftChat(data)
    })
})
