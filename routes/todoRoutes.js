const express = require("express");
const Todo = require("../models/Todo");
const protect = require("../middleware/authMiddleware");
const { validateTodo } = require("../middleware/validateMiddleware");

const router = express.Router();

router.post("/", protect, validateTodo, async (req, res) => {
  try {
    const { title, description } = req.body;

    const todo = await Todo.create({
      user: req.user._id,
      title,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully.",
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create todo.",
      error: error.message,
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get todos.",
      error: error.message,
    });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    const todo = await Todo.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        title,
        description,
        completed,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully.",
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update todo.",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete todo.",
      error: error.message,
    });
  }
});

module.exports = router;