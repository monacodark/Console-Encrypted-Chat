const { serverDomain, serverPort } = require('../config')
const controller = require('./modules/controller')

const io = require('socket.io-client')
const socket = io.connect(`http://${serverDomain}:${serverPort}`, { reconnect: true })

socket.on('connect', () => {
    controller.initClient(socket)
})

socket.on('message', (payload) => {
    const { command, data } = payload

    switch (command) {
        // Получена информация о комнате
        case 'init_chat':
            controller.initChat(data)
            break
        // Зашел новый пользователь
        case 'new_user_add_to_chat':
            controller.newUserAddedToChat(data)
            break;
        // Получено публичное сообщение
        case 'received_message_public':
            controller.receivedMessagePublic(data)
            break
        // Получено приватное сообщение
        case 'received_message_private':
            controller.receivedMessagePrivate(data)
            break
        // Пользователь покинул чат
        case 'user_left_chat':
            controller.userLeftChat(data)
            break
        default:
            console.log('Unknown command', payload)
            break;
    }
})