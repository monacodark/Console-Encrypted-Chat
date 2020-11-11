const readline = require('readline')

const display = {
    rl: readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    lastQuestion: '',
    needRepeatQuestion: false,
    initClient(callback) {
        console.log('\nᛞ CONSOLE CHAT ᛞ\n')
        console.log('Успешно подключились к серверу\n')

        this.rl.question('Пожалуйста, представьтесь \nВаше имя: ', callback)
    },
    yourAuth(nickname) {
        console.log(`\nВы авторизовались как ${nickname}`)
    },
    initChat(userList) {
        this.rl.pause()

        if (userList.length)
            console.log(`\nВ команте находятся: ${userList.join(', ')}\n`)
        else
            console.log(`\nВы один в комнате\n`)

        this.rl.resume()
    },
    addUserInChat(user) {
        this.rl.pause()
        console.log(`\nПодключился пользователь: ${user.nickname}\n`)
        this.rl.resume()
    },
    inputUserName(callback) {
        this.lastQuestion = '\nВведите nickname пользователя (или оставьте пустым):\n'
        this.needRepeatQuestion = true
        this.rl.question(this.lastQuestion, callback)
    },
    userNotFound(nicknameTo) {
        console.log(`\nПользователь ${nicknameTo} не найден\n`)
    },
    inputMessage(callback) {
        this.lastQuestion = '\nВведите сообщение:\n'
        this.needRepeatQuestion = true
        this.rl.question(this.lastQuestion, callback)
    },
    messagePublic(data) {
        this.rl.pause()
        console.log(`\n${data.time} - Публичное сообщение от ${data.nicknameFrom}:`)
        console.log(`${data.message}\n`)
        this.rl.resume()
    },
    messagePrivate(data) {
        this.rl.pause()
        console.log(`\n${data.time} - Приватное сообщение от ${data.nicknameFrom}:`)
        console.log(`${data.message}\n`)
        this.rl.resume()
    },
    userLeftChat(nickname) {
        this.rl.pause()
        console.log(`\nПользователь ${nickname} отсоединился\n`)
        this.rl.resume()
    },
    sendMessagePrivate(nicknameTo, message) {
        const date = new Date()
        const time = `${date.getHours()}:${date.getMinutes()}`
        
        this.rl.pause()
        console.log(`\nᛞ ${time} - Вы написали приватное сообщение для ${nicknameTo}:`)
        console.log(`${message}\n`)
        this.needRepeatQuestion = false
        this.rl.resume()
    },
    sendMessagePublic(message) {
        const date = new Date()
        const time = `${date.getHours()}:${date.getMinutes()}`
        
        this.rl.pause()
        console.log(`\nᛞ ${time} - Вы написали публичное сообщение:`)
        console.log(`${message}\n`)
        this.needRepeatQuestion = false
        this.rl.resume()
    }
}

display.rl.on('resume', () => {
    if (display.needRepeatQuestion)
        console.log(display.lastQuestion)
})

module.exports = display