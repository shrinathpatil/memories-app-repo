import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    creatorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    creator: {
      type: String,
    },
    tags: {
      type: [String],
    },
    selectedFile: {
      type: String,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Post", PostSchema);
