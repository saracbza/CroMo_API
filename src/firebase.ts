var admin = require("firebase-admin")
var serviceAccount = require("/home/site/wwwroot/firebaseServiceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
export default admin
