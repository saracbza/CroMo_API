var admin = require("firebase-admin")
console.log("firebase", process.env.FIREBASE_PRIVATE_KEY)
const serviceAccount = JSON.parse(process.env.FIREBASE_PRIVATE_KEY as string)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
export default admin
