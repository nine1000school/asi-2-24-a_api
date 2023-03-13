import read from "../db/read.js"
import write from "../db/write.js"

const preparePostRoutes = (app) => {
  // CREATE
  app.post("/posts", async (req, res) => {
    const { title, content, tags, publishedAt } = req.body
    const {
      posts: { lastId },
    } = await read()

    const id = lastId + 1
    const post = {
      id,
      title,
      content,
      tags,
      publishedAt: publishedAt || new Date().toISOString(),
    }

    await write({
      posts: {
        lastId: id,
        rows: {
          [id]: post,
        },
      },
    })

    res.send({ result: post })
  })

  // READ collection
  app.get("/posts", async (req, res) => {
    const {
      posts: { rows },
    } = await read()
    const posts = Object.values(rows)

    res.send({ result: posts })
  })

  // READ single
  app.get("/posts/:postId", async (req, res) => {
    const postId = Number.parseInt(req.params.postId, 10)
    const {
      posts: {
        rows: { [postId]: post },
      },
    } = await read()

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    res.send({ result: post })
  })

  // UPDATE
  app.patch("/posts/:postId", async (req, res) => {
    const postId = Number.parseInt(req.params.postId, 10)
    const { title, content, tags, publishedAt } = req.body
    const {
      posts: {
        rows: { [postId]: post },
      },
    } = await read()

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    const updatedPost = {
      ...post,
      title: title ?? post.title,
      content: content ?? post.content,
      tags: tags ?? post.tags,
      publishedAt: publishedAt ?? post.publishedAt,
    }

    await write({
      posts: {
        rows: {
          [postId]: updatedPost,
        },
      },
    })

    res.send({ result: updatedPost })
  })

  // DELETE
  app.delete("/posts/:postId", async (req, res) => {
    const postId = Number.parseInt(req.params.postId, 10)
    const {
      posts: {
        rows: { [postId]: post },
      },
    } = await read()

    if (!post) {
      res.status(404).send({ error: "Not found" })

      return
    }

    await write({
      posts: {
        rows: {
          [postId]: undefined,
        },
      },
    })

    res.send({ result: post })
  })
}

export default preparePostRoutes
