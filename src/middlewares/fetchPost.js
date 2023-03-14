import read from "../db/read.js"

const fetchPost = async (req, res, next) => {
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

  req.ctx.post = post

  next()
}

export default fetchPost
