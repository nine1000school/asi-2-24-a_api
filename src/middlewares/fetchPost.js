import { findPostById } from "../db/posts.js"

const fetchPost = async (req, res, next) => {
  const postId = Number.parseInt(req.params.postId, 10)
  const post = await findPostById(postId)

  if (req.ctx.util.handleNotFound(post)) {
    return
  }

  req.ctx.post = post

  next()
}

export default fetchPost
