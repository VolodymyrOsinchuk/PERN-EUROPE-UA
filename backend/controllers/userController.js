const { User } = require("../models/user");
const { Adv } = require("../models/adv");
const { Category } = require("../models/category");
const path = require('path');
const fs = require('fs');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ["password"] },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ msg: "User non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber, country, state, location, about } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User non trouvée" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.country = country || user.country;
    user.state = state || user.state;
    user.location = location || user.location;
    user.about = about || user.about; // Assuming 'about' field exists in the User model

    await user.save();

    const updatedUser = await User.findByPk(id, { attributes: { exclude: ["password"] } });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete old profile picture if it exists and is not the default
    if (user.profilePicture && user.profilePicture !== '/uploads/profile/default.png') {
      const oldImagePath = path.join(__dirname, '..', 'public', user.profilePicture);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old profile picture:', err);
      });
    }

    const profilePictureUrl = `/uploads/profile/${req.file.filename}`;
    user.profilePicture = profilePictureUrl;
    await user.save();

    res.status(200).json({ profilePicture: profilePictureUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ msg: 'Please provide old password and new password' });
  }

  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isPasswordCorrect = await user.validatePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    user.password = newPassword; // The pre-save hook will hash this
    await user.save();

    res.status(200).json({ msg: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).send("User deleted");
    } else {
      res.status(404).json({ msg: "User non trouvée" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.count();
    const adCount = await Adv.count();
    const categoryCount = await Category.count();

    res.status(200).json({
      users: userCount,
      ads: adCount,
      categories: categoryCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
