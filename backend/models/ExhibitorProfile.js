import mongoose from "mongoose";

const exhibitorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    documents: {
      type: [String],
      default: [],
    },

    productShowcase: {
      type: [
        {
          name: {
            type: String,
            default: "",
          },

          image: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ExhibitorProfile",
  exhibitorProfileSchema
);