import "dotenv/config"

const config = {
  port: process.env.PORT,
  db: {
    uri: process.env.DB_URI,
  },
}

export default config
