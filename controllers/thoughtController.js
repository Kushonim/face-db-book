const { User, Thought } = require("../models");

module.exports = {
  async getAllThoughts(req, res) {
    try {
      const result = await Thought.find({});
      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async getThoughtById(req, res) {
    try {
      const result = await Thought.findOne({ _id: req.params.thoughtId });
      if (!result) {
        return res.status(404).json({ message: "There is no thought with that ID" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async addThought(req, res) {
    try {
      const result = await Thought.create(req.body);

      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: result._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "There is no user with that ID" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async updateThought(req, res) {
    try {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Failed to update thought" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async deleteThought(req, res) {
    try {
      const result = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!result) {
        return res.status(404).json({ message: "Failed to delete thought" });
      }

      res.json("Thought deleted!");
    } catch {
      res.status(500).json("failed");
    }
  },

  async addReaction(req, res) {
    try {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true, runValidators: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Failed to add reaction" });
      }

      res.json(result);
    } catch {
      res.status(500).json("failed");
    }
  },

  async deleteReaction(req, res) {
    try {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { new: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Failed to delete reaction" });
      }

      res.json(result);
    } catch (err) {
      res.status(500).json("failed");
    }
  },
};
