const { Notification } = require("../models/notification");

const MESSAGES = {
  ad_pending: (title) =>
    `Ваше оголошення «${title}» надіслано на модерацію. Ми повідомимо вас про результат.`,
  ad_approved: (title) =>
    `Ваше оголошення «${title}» схвалено та опубліковано.`,
  ad_rejected: (title, reason) =>
    `Ваше оголошення «${title}» відхилено. Причина: ${reason}`,
  ad_needs_changes: (title, reason) =>
    `Ваше оголошення «${title}» повернуто на доопрацювання. Що потрібно виправити: ${reason}`,
  ad_hidden: (title) =>
    `Ваше оголошення «${title}» тимчасово приховано адміністрацією.`,
};

/**
 * Crée une notification pour un utilisateur.
 * Passer `transaction` pour qu'elle soit écrite dans la même transaction
 * que le changement de statut.
 */
async function notifyAdOwner({
  userId,
  advId,
  title,
  type,
  reason = null,
  transaction,
}) {
  const build = MESSAGES[type];
  if (!build) throw new Error(`Type de notification inconnu : ${type}`);

  return Notification.create(
    {
      userId,
      advId,
      type,
      message: build(title, reason),
    },
    { transaction },
  );
}

async function notifyNewMessage({
  userId,
  conversationId,
  senderName,
  adTitle,
  transaction,
}) {
  return Notification.create(
    {
      userId,
      conversationId,
      advId: null,
      type: "message_received",
      message: `Нове повідомлення від ${senderName} щодо оголошення «${adTitle}».`,
    },
    { transaction },
  );
}

module.exports = { notifyAdOwner, notifyNewMessage };
