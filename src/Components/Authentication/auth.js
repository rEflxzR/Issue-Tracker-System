const axios = require("axios")

const UserAuthentication = {
    async isLoggedIn() {
        const url = `http://${window.location.hostname}:3000/cookie-session`
        const result = await axios.get(url, {withCredentials: true})
        if(result.data=="Success") {
            console.log("Return True")
            return true
        }
        console.log("Return False")
        return false
    }
}

export default UserAuthentication