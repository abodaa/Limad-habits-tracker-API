const express = require("express");
const router = express.Router();
const {
  createHabit,
  getAllHabits,
  getHabit,
  updateHabit,
  deleteHabit,
} = require("../controllers/habits");

router.post("/", createHabit);
router.get("/", getAllHabits);
router.get("/:id", getHabit);
router.patch("/:id", updateHabit);
router.delete("/:id", deleteHabit);

module.exports = router;
