// backend/migrations/20261212000001-create-faq-items.js
"use strict";

const { DataTypes } = require("sequelize");

const SEED_ITEMS = [
  {
    question: "Як опублікувати оголошення?",
    answer:
      "Увійдіть в акаунт, відкрийте «Мої оголошення» та натисніть «Нове оголошення». Заповніть основну інформацію, додайте фото і надішліть оголошення на модерацію.",
    category: "Оголошення",
    sortOrder: 1,
  },
  {
    question: "Як зв’язатися з продавцем?",
    answer:
      "На детальній сторінці оголошення натисніть «Написати в чаті» або скористайтеся доступними засобами зв’язку продавця.",
    category: "Оголошення",
    sortOrder: 2,
  },
  {
    question: "Чому оголошення не видно всім?",
    answer:
      "Нові оголошення проходять модерацію. Перед публікацією перевірте текст, фотографії та наявність контактних даних.",
    category: "Оголошення",
    sortOrder: 3,
  },
  {
    question: "Як видалити оголошення?",
    answer:
      "Відкрийте «Мій профіль» → «Мої оголошення», знайдіть потрібне оголошення і натисніть «Видалити». Перед видаленням система запитає підтвердження.",
    category: "Оголошення",
    sortOrder: 4,
  },
  {
    question: "Як поскаржитися?",
    answer:
      "На детальній сторінці оголошення натисніть «Поскаржитися» та оберіть причину.",
    category: "Безпека",
    sortOrder: 5,
  },
  {
    question: "Як зберегти оголошення?",
    answer:
      "Натисніть значок закладки на картці або детальній сторінці. Сторінка «Обрані» доступна у меню профілю.",
    category: "Оголошення",
    sortOrder: 6,
  },
];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable("faq_items", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: { type: DataTypes.STRING(300), allowNull: false },
      answer: { type: DataTypes.TEXT, allowNull: false },
      category: { type: DataTypes.STRING(100), allowNull: true },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });

    await queryInterface.addIndex("faq_items", ["sortOrder"]);

    const now = new Date();
    await queryInterface.bulkInsert(
      "faq_items",
      SEED_ITEMS.map((item) => ({
        ...item,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      })),
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("faq_items");
  },
};
