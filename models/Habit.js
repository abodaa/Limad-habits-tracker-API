const { date } = require("joi");
const mongoose = require("mongoose");

const HabitSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please provide title"],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ["new", "on progress", "cancelled", "achieved"],
      default: "new",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide user"],
    },
    enddate: {
      type: Date,
      require: [true, "please set end date"],
      default: Date.now,
    },
  },

  { timestamps: true }
);

const Model = mongoose.model("Habits", HabitSchema);

module.exports = Model;
