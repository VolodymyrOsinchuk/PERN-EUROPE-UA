export const MODERATION_STATUS = {
  draft: { label: "Чернетка", color: "#475569", bg: "#F1F5F9" },
  pending: { label: "На модерації", color: "#9A3412", bg: "#FFF7ED" },
  approved: { label: "Схвалено", color: "#065F46", bg: "#ECFDF5" },
  rejected: { label: "Відхилено", color: "#991B1B", bg: "#FEF2F2" },
  needs_changes: {
    label: "Потребує виправлення",
    color: "#1D4ED8",
    bg: "#EFF6FF",
  },
  hidden: { label: "Приховано", color: "#475569", bg: "#F1F5F9" },
  archived: { label: "Архівне", color: "#64748B", bg: "#F8FAFC" },
};

export const getStatusStyle = (status) =>
  MODERATION_STATUS[status] || MODERATION_STATUS.draft;
