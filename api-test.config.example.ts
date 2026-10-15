const processENV = process.env.TEST_ENV
const env = processENV || 'dev' // manually change before test or TEST_ENV=dev npx playwrught test smokeTest.spe.ts
console.log('Test environment is ' + env)

const config = {
    apiUrl:'https://conduit-api.bondaracademy.com/api',
    userEmail:'user_email',
    userPassword:'user_password'
}

if(env === 'qa'){
    config.userEmail = ''
    config.userPassword = ''
}

export{config}