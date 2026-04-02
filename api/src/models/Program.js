const mongoose = require("mongoose");

const ProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    year: { type: Number, required: false, min: 1990, max: 2100 },
    description: { type: String, required: false, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

ProgramSchema.index({ year: -1, createdAt: -1 });

const Program = mongoose.models.Program || mongoose.model("Program", ProgramSchema);

module.exports = { Program };

