const express = require("express");
const { connectDb } = require("./db.js");
const { Program } = require("./models/Program.js");

function createApp() {
  const app = express();

  app.use(express.json({ limit: "200kb" }));

  app.get("/api/health", (req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/programs", async (req, res) => {
    try {
      await connectDb(process.env.MONGODB_URI);
      const programs = await Program.find({})
        .sort({ year: -1, createdAt: -1 })
        .limit(200)
        .lean();
      res.json({ programs });
    } catch (e) {
      res.status(500).json({
        error: e instanceof Error ? e.message : "Failed to load programs"
      });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const adminToken = process.env.ADMIN_TOKEN || "";
      const provided = String(req.header("x-admin-token") || "");
      if (adminToken && provided !== adminToken) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await connectDb(process.env.MONGODB_URI);

      const title = String(req.body?.title || "").trim();
      const description = String(req.body?.description || "").trim();
      const yearRaw = req.body?.year;
      const year = yearRaw === undefined || yearRaw === null ? undefined : Number(yearRaw);

      if (!title) return res.status(400).json({ error: "title is required" });

      const created = await Program.create({
        title,
        year: Number.isFinite(year) ? year : undefined,
        description: description || undefined
      });

      res.status(201).json({ program: created });
    } catch (e) {
      res.status(500).json({
        error: e instanceof Error ? e.message : "Failed to create program"
      });
    }
  });

  return app;
}

module.exports = { createApp };

