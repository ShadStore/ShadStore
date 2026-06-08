import express from "express";
import bcrypt from "bcryptjs";
import { db, usersTable, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = express.Router();

function requireWebsiteSession(req: any, res: any, next: any) {
  if (req.session.websiteUserId) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

router.post("/register", async (req, res) => {
  try {
    const { username, password, fullName, phone } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ error: "username, password, and fullName are required" });
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(usersTable).values({
      username,
      password: hashedPassword,
      fullName,
      phone: phone || "",
      role: "user",
      telegramId: null,
    });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }
    const results = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = results[0];
    if (!user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.websiteUserId = user.id;
    return res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

router.get("/me", requireWebsiteSession, async (req, res) => {
  try {
    const results = await db.select().from(usersTable).where(eq(usersTable.id, req.session.websiteUserId)).limit(1);
    if (results.length === 0) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: "Session invalid" });
    }
    const user = results[0];
    return res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    return res.json({ success: true });
  });
});

router.get("/maintenance-page", async (req, res) => {
  const results = await db.select().from(settingsTable).where(eq(settingsTable.key, "maintenance")).limit(1);
  const maintenance = results[0]?.value === "true";
  return res.json({ maintenance });
});

export default router;