import express from "express"
import read from "./src/db/read.js"
import write from "./src/db/write.js"

const app = express()

app.use(express.json())

// CREATE
app.post("/todos", async (req, res) => {
  const { description } = req.body

  if (!description) {
    res.status(400).send({ error: "Missing description." })

    return
  }

  const db = await read()
  const lastId = db.lastId + 1
  const todo = {
    id: lastId,
    description,
    done: false,
  }

  await write(db, {
    lastId,
    todos: {
      [lastId]: todo,
    },
  })

  res.status(201).send({ reslut: todo })
})

// READ collection
app.get("/todos", async (req, res) => {
  const { todos } = await read()

  res.send({ result: Object.values(todos) })
})

// READ single
app.get("/todos/:todoId", async (req, res) => {
  const todoId = Number.parseInt(req.params.todoId, 10)
  const db = await read()
  const todo = db.todos[todoId]

  if (!todo) {
    res.status(404).send({ error: "Not found" })

    return
  }

  res.send({ result: todo })
})

// UPDATE
app.patch("/todos/:todoId", async (req, res) => {
  const todoId = Number.parseInt(req.params.todoId, 10)
  const { description, done } = req.body
  const db = await read()
  const {
    todos: { [todoId]: todo },
  } = db

  if (!todo) {
    res.status(404).send({ error: "Not found" })

    return
  }

  const updatedTodo = {
    ...todo,
    description: description ?? todo.description,
    done: done ?? todo.done,
  }

  await write(db, {
    todos: {
      [todoId]: updatedTodo,
    },
  })

  res.send({ result: updatedTodo })
})

// DELETE
app.delete("/todos/:todoId", async (req, res) => {
  const todoId = Number.parseInt(req.params.todoId, 10)
  const db = await read()
  const {
    todos: { [todoId]: todo },
  } = db

  if (!todo) {
    res.status(404).send({ error: "Not found" })

    return
  }

  await write(db, {
    todos: {
      [todoId]: undefined,
    },
  })

  res.send({ result: todo })
})

app.listen(4000, () => console.log("Listening on :4000"))
