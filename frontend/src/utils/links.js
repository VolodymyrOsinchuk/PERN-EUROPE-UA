const links = [
  { text: "Огляд", path: "/dashboard", icon: "dashboard" },
  { text: "Користувачі", path: "/dashboard/users", icon: "people" },
  { text: "Категорїї", path: "/dashboard/categories", icon: "category" },
  { text: "Публікації", path: "/dashboard/posts", icon: "article" },
  { text: "Події", path: "/dashboard/events", icon: "event" },
  { text: "Налаштування", path: "/dashboard/settings", icon: "settings" },
  {
    text: "Admin",
    path: "/dashboard/admin",
    icon: "admin_panel_settings",
    role: "admin",
  },
];

export default links;
