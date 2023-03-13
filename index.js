import express from "express"

const app = express()

app.get("/hello", (req, res) => {
  res.send({ message: "Hello" })
})

app.get("/goodbye", (req, res) => {
  res.send("Goodbye~!")
})

app.post("/", (req, res) => {
  res.send("You did a POST request.")
})

app.delete("/", (req, res) => {
  res.send("You did a DELETE request.")
})

// 404
app.use("/", (req, res) => {
  res.status(404).send("You did a request with an unhandled method.")
})

app.listen(4000, () => console.log("Listening on :4000"))
