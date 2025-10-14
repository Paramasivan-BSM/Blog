const path = require("path");
const Post_content = require(path.join(__dirname, "..", "model", "post.model.js"));
const User = require(path.join(__dirname, "..", "model", "auth.model.js")); // assuming user model exists

async function writePost(req, res) {
  try {
    const { title, content, authorId, image,category } = req.body;

    // ✅ 1. Validate required fields
    if (!title || !content || !authorId) {
      return res.status(400).json({
        success: false,
        msg: "Title, content, and authorId are required.",
      });
    }

    // ✅ 2. Validate author existence (optional but good practice)
    const author = await User.findById(authorId);
    if (!author) {
      return res.status(404).json({
        success: false,
        msg: "Author not found.",
      });
    }

    // ✅ 3. Create and save post
    const post = new Post_content({
      title,
      content,
      authorId,
      image, // this should be Cloudinary secure_url if you're uploading images
      category
    });

    await post.save();

    // ✅ 4. Respond with created post
    return res.status(201).json({
      success: true,
      msg: "Post created successfully!",
      post,
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error while creating post.",
    });
  }
}

module.exports = { writePost };
