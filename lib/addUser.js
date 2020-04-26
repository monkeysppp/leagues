//
// addPrompt.message = ''
// addPrompt.delimiter = ''
//
// function usage () {
//   console.log('')
//   console.log('Usage:')
//   console.log('  node addUser.js [databaseName] [databaseUser] [username]')
//   console.log('')
// }
//
// function main () {
//   if (process.argv.length < 5) {
//     console.log('Too few arguments...')
//     usage()
//     process.exit(1)
//   }
//
//   const databaseName = process.argv[2]
//   const databaseUser = process.argv[3]
//   const username = process.argv[4]
//
//   const addPromptSchema = {
//     properties: {
//       dbPwd: {
//         message: 'Enter DB password: ',
//         required: true,
//         hidden: true
//       },
//       pwd1: {
//         message: 'Enter user password: ',
//         required: true,
//         hidden: true
//       },
//       pwd2: {
//         message: 'Re-enter user password: ',
//         required: true,
//         hidden: true
//       }
//     }
//   }
//
//   addPrompt.start()
//   addPrompt.get(addPromptSchema,
//     (err, result) => {
//       if (err) {
//         console.log('Error reading passwords...')
//         process.exit(1)
//       }
//
//       if (result.pwd1 !== result.pwd2) {
//         console.log('Passwords don\'t match.')
//         process.exit(1)
//       }
//
//       var databasePwd = result.dbPwd
//       var pwd = result.pwd1
//
//       if (pwd.length < 8) {
//         console.log('Password is too short.  Password must be at least 8 characters long.')
//         process.exit(1)
//       }
//
//       userDb.setDBParameters(databaseName, databaseUser, databasePwd)
//       userDb.saltHashAndStore(username, pwd, (err) => {
//         if (err) {
//           console.log(err)
//           process.exit(1)
//         }
//
//         console.log('Password set for user ' + username)
//       })
//     }
//   )
// }
//
// main()

module.exports = {
  addUser: () => {
    console.log('go')
    return Promise.resolve()
  }
}
