import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    // Note title
    title: {
      type: String,
      required: true,
    },

    // Main note content
    content: {
      type: String,
      required: true,
    },

    // Owner of this note
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;