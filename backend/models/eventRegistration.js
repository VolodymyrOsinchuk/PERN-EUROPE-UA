const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Event } = require("./event");
const { User } = require("./user");

const EventRegistration = sequelize.define(
  "EventRegistration",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    tableName: "event_registrations",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["eventId", "userId"],
        name: "unique_event_user_registration",
      },
    ],
  },
);

EventRegistration.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
  onDelete: "CASCADE",
});
EventRegistration.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});
Event.hasMany(EventRegistration, {
  foreignKey: "eventId",
  as: "registrations",
});
User.hasMany(EventRegistration, {
  foreignKey: "userId",
  as: "eventRegistrations",
});

module.exports = { EventRegistration };
