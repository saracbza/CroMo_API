var admin = require("firebase-admin")
const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
export default admin
