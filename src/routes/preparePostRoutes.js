import PostModel from "../db/models/PostModel.js"
import fetchPost from "../middlewares/fetchPost.js"

const preparePostRoutes = (app) => {
  // CREATE
  app.post("/posts", async (req, res) => {
    const { title, content, tags, publishedAt } = req.body
    const post = await new PostModel({
      title,
      content,
      tags,
      publishedAt: publishedAt || new Date().toISOString(),
    }).save()

    res.send({ result: post })
  })

  // READ collection
  app.get("/posts", async (req, res) => {
    const posts = await PostModel.find()

    res.send({ result: posts })
  })

  // READ single
  app.get("/posts/:postId", fetchPost, async (req, res) => {
    res.send({ result: req.ctx.post })
  })

  // UPDATE
  app.patch("/posts/:postId", fetchPost, async (req, res) => {
    const postId = Number.parseInt(req.params.postId, 10)
    const { title, content, tags, publishedAt } = req.body
    const { post } = req.ctx

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
  app.delete("/posts/:postId", fetchPost, async (req, res) => {
    const postId = Number.parseInt(req.params.postId, 10)
    const { post } = req.ctx

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
