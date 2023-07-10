const User = require("../models/Habit");
const Habit = require("../models/Habit");
const { StatusCodes } = require("http-status-codes");

const createHabit = async (req, res) => {
  // userId comes from authentication middleware
  try {
    req.body.createdBy = req.user.userId;
    // console.log(req.body)
    const habit = await Habit.create(req.body);
    res.status(StatusCodes.CREATED).json(habit);
  } catch (error) {
    res.send(error);
  }
};

const getAllHabits = async (req, res) => {
  const { habitStatus } = req.query;
  if (habitStatus === "all") {
    try {
      const habits = await Habit.find({
        createdBy: req.user.userId,
      }).sort("createdAt");
      return res
        .status(StatusCodes.OK)
        .json({ habits, count: habits.length, name: req.user.name });
    } catch (error) {
      res.send(error);
    }
  }

  try {
    const habits = await Habit.find({
      createdBy: req.user.userId,
      status: habitStatus,
    }).sort("createdAt");
    return res
      .status(StatusCodes.OK)
      .json({ habits, count: habits.length, name: req.user.name });
  } catch (error) {
    res.send(error);
  }
};

const getHabit = async (req, res) => {
  try {
    const { id: habitID } = req.params;
    const habit = await Habit.findOne({
      _id: habitID,
      createdBy: req.user.userId,
    });

    if (!habit) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No habit found with ID: ${habitID}` });
    }
    res.status(StatusCodes.OK).json({ habit, ID: habitID });
  } catch (error) {
    res.send(error);
  }
};

const updateHabit = async (req, res) => {
  try {
    const { id: habitId } = req.params;
    const habit = await Habit.findOneAndUpdate(
      { _id: habitId, createdBy: req.user.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!habit) {
      return req
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No habit found with ID: ${habitId}` });
    }
    res.status(StatusCodes.OK).json({ habit, ID: habitId });
  } catch (error) {
    res.send(error);
  }
};

const deleteHabit = async (req, res) => {
  try {
    const { id: habitId } = req.params;
    const habit = await Habit.findOneAndDelete({
      _id: habitId,
      createdBy: req.user.userId,
    });
    if (!habit) {
     return res
        .status(StatusCodes.NOT_FOUND)
        .json(`No habit found with ID: ${habitId}`);
    }
    res.status(StatusCodes.OK).send()
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  createHabit,
  getAllHabits,
  getHabit,
  updateHabit,
  deleteHabit,
};
