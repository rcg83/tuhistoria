import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    location: { type: String, default: "" }
  },
  {
    timestamps: true
    // Propiedad que genera un createdAt y updatedAt en el esquema.
  }
);

export default mongoose.model("Profile", profileSchema);