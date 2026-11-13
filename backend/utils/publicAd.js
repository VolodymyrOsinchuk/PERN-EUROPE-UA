const isAdPublic = (ad) =>
  Boolean(ad) &&
  ad.moderationStatus === "approved" &&
  ad.isArchived === false &&
  ad.status === "Active";

// Приймає модель Sequelize або простий об'єкт.
// Контакти віддаються лише тоді, коли їх дозволив власник.
function toPublicAd(adv, viewer = {}) {
  const data =
    typeof adv.get === "function" ? adv.get({ plain: true }) : { ...adv };

  const isOwner = viewer.userId != null && data.userId === viewer.userId;
  const isStaff = viewer.role === "admin" || viewer.role === "moderator";
  if (isOwner || isStaff) return data;

  data.email = data.contactByEmail && data.showEmail ? data.email : null;
  data.phone = data.showPhone ? data.phone : null;
  delete data.moderationReason;
  delete data.moderatedBy;
  return data;
}

module.exports = { isAdPublic, toPublicAd };
