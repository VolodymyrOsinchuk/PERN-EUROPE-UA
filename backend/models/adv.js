const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { Category } = require("./category");
const { User } = require("./user");

const Adv = sequelize.define(
  "Adv",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le titre ne peut pas être vide" },
        len: [3, 255], // Longueur minimale et maximale
      },
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Le pays est requis" },
      },
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "La région/état est requise" },
      },
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "La ville est requise" },
      },
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9]{5}(-[0-9]{4})?$/, // Exemple pour code postal US
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 5000], // Longueur minimale et maximale de la description
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, // Validation de numéro de téléphone
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true, // Empêche les doublons d'email
      validate: {
        isEmail: { msg: "Format d'email invalide" },
      },
    },
    // price: {
    //   type: DataTypes.FLOAT,
    //   allowNull: false,
    //   defaultValue: 0,
    // },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: "Le prix doit être positif",
        },
        max: {
          args: [1000000], // Limite haute personnalisable
          msg: "Prix trop élevé",
        },
      },
    },

    // images: {
    //   type: DataTypes.ARRAY(DataTypes.STRING),
    //   defaultValue: [],
    // },
    photos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    amenities: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      // validate: {
      //   isArray: true,
      // },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
      validate: {
        notNull: { msg: "La catégorie est requise" },
        async validateCategoryExists(value) {
          if (value) {
            const category = await Category.findByPk(value);
            if (!category) {
              throw new Error("Catégorie inexistante");
            }
          }
        },
      },
    },
    status: {
      type: DataTypes.ENUM("Actif", "Inactif", "Vendu"),
      defaultValue: "Actif",
      validate: {
        isIn: [["Actif", "Inactif", "Vendu"]],
      },
    },
    datePosted: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
    expirationDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
        isAfter: DataTypes.NOW, // Doit être après la date actuelle
      },
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    isPromoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },

  {
    hooks: {
      beforeCreate: (adv) => {
        // Exemple de hook : définir une date d'expiration par défaut
        if (!adv.expirationDate) {
          adv.expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours par défaut
        }
      },
    },
    indexes: [
      { fields: ["email"] },
      { fields: ["categoryId"] },
      { fields: ["status"] },
    ],
    timestamps: true,
    tableName: "advs",
  }
);

// Modèle Photo
const Photo = sequelize.define(
  "Photo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    data: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      validate: {
        max: 10 * 1024 * 1024, // Limite à 10MB
      },
    },
    annonceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Adv, key: "id" },
    },
  },
  {
    tableName: "photos",
    timestamps: true,
    indexes: [{ fields: ["annonceId"] }],
  }
);

// Définir les relations
// Adv.hasMany(Photo, {
//   foreignKey: "annonceId",
//   onDelete: "CASCADE",
//   as: "photos",
// });
// Photo.belongsTo(Adv, {
//   foreignKey: "annonceId",
//   as: "advs",
//   onDelete: "CASCADE",
// });

User.hasMany(Adv, {
  foreignKey: "userId",
  as: "advs",
});

Adv.belongsTo(User, { foreignKey: "userId", as: "users" });

Adv.belongsTo(Category, { foreignKey: "categoryId", as: "categorie" });
Category.hasMany(Adv, { foreignKey: "categoryId", as: "advs" });

module.exports = { Adv };
