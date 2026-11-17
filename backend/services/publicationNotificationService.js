// backend/services/publicationNotificationService.js
const { Notification } = require("../models/notification");

const PUBLICATION_NOTIFICATION_TYPES = {
  published: "publication_published",
  needsChanges: "publication_needs_changes",
};

// Не сповіщаємо, якщо автор і є тим, хто діє (наприклад, адмін сам створив статтю).
async function notifyPublicationAuthor({
  pub,
  type,
  actorId,
  reason = null,
  transaction,
}) {
  if (!pub.userId || pub.userId === actorId) return;

  const message =
    type === PUBLICATION_NOTIFICATION_TYPES.published
      ? `Вашу публікацію «${pub.title}» опубліковано.`
      : `Публікацію «${pub.title}» повернуто на доопрацювання. Причина: ${reason}`;

  await Notification.create(
    { userId: pub.userId, publicationId: pub.id, type, message },
    { transaction },
  );
}

module.exports = { PUBLICATION_NOTIFICATION_TYPES, notifyPublicationAuthor };
