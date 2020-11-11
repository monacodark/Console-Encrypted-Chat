const NodeRSA = require('node-rsa')
const store = require('./store')
const display = require('./display')

const controller = {
    socket: null,
    initClient(socket) {
        this.socket = socket

        // Получаем логин текущего пользователя из инпута в консоль
        display.initClient((nickname) => {
            nickname = `${nickname}_${getId()}`
            display.yourAuth(nickname)

            // Формируем публичный и приватные ключи
            const key = new NodeRSA({ b: 1024 })

            store.setCurrentUser({
                nickname,
                key
            })

            // Уведомляем сервер о своей авторизации
            socket.emit('message', JSON.stringify({
                command: 'auth_user',
                data: {
                    nickname,
                    publicKey: key.exportKey('public')
                }
            }))
        })
    },
    initChat(data) {
        // Записываем текущий список пользователей
        store.setUserList(data)
        
        const userList = store.getUserNicknames()
        display.initChat(userList)

        // Начинаем чат
        startChat.call(this)
    },
    newUserAddedToChat(data) {
        // Если не авторизованы, то скипаем
        if (!store.getCurrentUser()) return
        
        store.addUserInUserList(data)
        display.addUserInChat(data)
    },
    receivedMessagePublic(data) {
        if (!store.getCurrentUser()) return

        display.messagePublic(data)
    },
    receivedMessagePrivate(data) {
        if (!store.getCurrentUser()) return
        
        // Расшифровываем полученное сообщение
        const { key } = store.getCurrentUser()
        data.message = key.decrypt(data.message, 'utf8')

        display.messagePrivate(data)
    },
    userLeftChat(data) {
        // Если не авторизованы, то скипаем
        if (!store.getCurrentUser()) return

        store.removeUserFromUserList(data.nickname)
        display.userLeftChat(data.nickname)
    }
}

function startChat() {
    display.inputUserName((nicknameTo) => {
        const userNotFound = nicknameTo.length !== 0 && !store.checkUser(nicknameTo)
            
        if (userNotFound) {
            display.userNotFound(nicknameTo)
            startChat.call(this)
        }

        display.inputMessage((message) => {
            const userFrom = store.getCurrentUser()
            
            if (nicknameTo) {
                // Шифруем сообщение перед отправкой
                const { publicKey } = store.getUserByNickname(nicknameTo)
                const userKey = new NodeRSA(publicKey)
                
                this.socket.emit('message', JSON.stringify({
                    command: 'send_message_private',
                    data: {
                        nicknameTo,
                        nicknameFrom: userFrom.nickname,
                        message: userKey.encrypt(message, 'base64')
                    }
                }))
                display.sendMessagePrivate(nicknameTo, message)
            }
            else {
                this.socket.emit('message', JSON.stringify({
                    command: 'send_message_public',
                    data: {
                        nicknameFrom: userFrom.nickname,
                        message
                    }
                }))
                display.sendMessagePublic(message)
            }

            startChat.call(this)
        })
    })
}

function getId() {
    const min = 111
    const max = 999

    return Math.floor(Math.random() * (max - min) + min);
}

module.exports = controller
