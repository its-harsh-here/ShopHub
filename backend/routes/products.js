const router = require("express").Router();
const auth = require("../middleware/auth");
const db = require("../db");

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM Product");
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ADD product (admin)
router.post("/", auth, async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const [result] = await db.query(
      "INSERT INTO Product (name, description, price, quantity) VALUES (?, ?, ?, ?)",
      [name, description, price, quantity]
    );
    const [newProduct] = await db.query("SELECT * FROM Product WHERE id = ?", [result.insertId]);
    res.json(newProduct[0]);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// UPDATE product
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    await db.query(
      "UPDATE Product SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?",
      [name, description, price, quantity, req.params.id]
    );
    const [updated] = await db.query("SELECT * FROM Product WHERE id = ?", [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE product
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM Product WHERE id = ?", [req.params.id]);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// PURCHASE product (public)
router.patch("/:id/purchase", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT quantity FROM Product WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ msg: "Product not found" });
    
    if (rows[0].quantity > 0) {
      await db.query("UPDATE Product SET quantity = quantity - 1 WHERE id = ?", [req.params.id]);
      const [updated] = await db.query("SELECT * FROM Product WHERE id = ?", [req.params.id]);
      return res.json(updated[0]);
    } else {
      return res.status(400).json({ msg: "Out of stock" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
