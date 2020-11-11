const data = {
    userList: [],
    currentUser: null,
}

const store = {
    setCurrentUser(currentUser) {
        data.currentUser = currentUser
    },
    getCurrentUser() {
        return data.currentUser
    },
    setUserList(userList) {
        data.userList = []

        userList.forEach((user) => {
            if (user.nickname != data.currentUser.nickname) {
                data.userList.push(user)
            }
        })

        return data.userList
    },
    addUserInUserList(user) {
        data.userList.push(user)
    },
    checkUser(nickname) {
        let result = false

        data.userList.forEach((user) => {
            if (user.nickname === nickname) {
                result = true
            }
        })

        return result
    },
    removeUserFromUserList(nickname) {
        let userIndex = null

        data.userList.forEach((user, index) => {
            if (user.nickname === nickname) {
                userIndex = index
            }
        })

        data.userList.splice(userIndex, 1)
    },
    getUserNicknames() {
        const result = []

        data.userList.forEach((user) => {
            if (user.nickname !== data.currentUser.nickname) {
                result.push(user.nickname)
            }
        })

        return result
    },
    getUserByNickname(nickname) {
        let result = null

        data.userList.forEach((user) => {
            if (user.nickname === nickname) {
                result = user
            }
        })

        return result
    }
}

module.exports = store
