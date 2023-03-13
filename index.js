import express from "express"
import preparePostRoutes from "./src/routes/preparePostRoutes.js"

const app = express()

app.use(express.json())

preparePostRoutes(app)

app.listen(4000, () => console.log("Listening on :4000"))
