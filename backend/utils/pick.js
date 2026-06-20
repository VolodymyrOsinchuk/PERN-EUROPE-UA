// Petit utilitaire pour extraire uniquement les champs autorisés d'un objet.
function pick(obj, allowedKeys) {
  return allowedKeys.reduce((acc, key) => {
    if (obj[key] !== undefined) acc[key] = obj[key];
    return acc;
  }, {});
}

module.exports = { pick };
