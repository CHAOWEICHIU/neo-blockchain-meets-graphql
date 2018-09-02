const env = {
  production: {
    CLIENT_HOST: 'http://localhost:3000',
    NODE_ENV: 'production',
    SERVER_PORT: '3000',
  },
  development: {
    CLIENT_HOST: 'http://localhost:3000',
    NODE_ENV: 'development',
    SERVER_PORT: '3333',
  },
}
module.exports = env
