// Demo data for the admin dashboard

export const statsCards = [
  { label: "Items", value: 56, subtitle: "0 Newly added", icon: "package" },
  { label: "Orders", value: 38, subtitle: "0 Newly added", icon: "shopping-bag" },
  { label: "Grocery Stores", value: 15, subtitle: "0 Newly added", icon: "store" },
  { label: "Customers", value: 28, subtitle: "0 Newly added", icon: "users" },
];

export const orderStatusData = [
  { label: "Unassigned Orders", count: 19, color: "text-muted-foreground", icon: "clipboard-list" },
  { label: "Accepted By Delivery Man", count: 0, color: "text-primary", icon: "user-check" },
  { label: "Packaging", count: 6, color: "text-info", icon: "package" },
  { label: "Out For Delivery", count: 0, color: "text-warning", icon: "truck" },
  { label: "Delivered", count: 15, color: "text-success", icon: "check-circle" },
  { label: "Canceled", count: 1, color: "text-destructive", icon: "x-circle" },
  { label: "Refunded", count: 0, color: "text-warning", icon: "rotate-ccw" },
  { label: "Payment Failed", count: 1, color: "text-destructive", icon: "credit-card" },
];

export const salesChartData = [
  { month: "Jan", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Feb", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Mar", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Apr", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "May", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Jun", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Jul", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Aug", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Sep", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Oct", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Nov", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
  { month: "Dec", grossSale: 0, adminCommission: 0, deliveryCommission: 0 },
];

export const userStatsData = [
  { name: "Customer", value: 28, color: "#3b82f6" },
  { name: "Store", value: 15, color: "#22c55e" },
  { name: "Delivery man", value: 6, color: "#f59e0b" },
];

export const topSellingStores = [
  { id: 1, name: "Fresh Market", image: "🛒", sales: 156 },
  { id: 2, name: "Green Grocers", image: "🥬", sales: 142 },
  { id: 3, name: "Daily Fresh", image: "🍎", sales: 128 },
  { id: 4, name: "Super Store", image: "🏪", sales: 115 },
  { id: 5, name: "Quick Mart", image: "🛍️", sales: 98 },
  { id: 6, name: "Value Plus", image: "💎", sales: 87 },
];

export const mostPopularStores = [
  { id: 1, name: "Smart Shopping", likes: 3, image: "🛒" },
  { id: 2, name: "Fresh supermarket", likes: 1, image: "🏬" },
];

export const topSellingItems = [
  { id: 1, name: "Chicken Tender Vegan", sold: 2, image: "🍗" },
  { id: 2, name: "Lotus Biscoff Cookie...", sold: 2, image: "🍪" },
  { id: 3, name: "Fresh Watermelon", sold: 2, image: "🍉" },
  { id: 4, name: "Organic Bananas", sold: 2, image: "🍌" },
  { id: 5, name: "Fresh Green Peas", sold: 1, image: "🫛" },
  { id: 6, name: "Big Cantaloupe", sold: 1, image: "🍈" },
];

export const mostRatedItems = [
  { id: 1, name: "Chicken Tender Vegan", rating: 1, image: "🍗" },
  { id: 2, name: "Desi Cow Ghee", rating: 1, image: "🧈" },
  { id: 3, name: "Mini Pumpkins", rating: 1, image: "🎃" },
  { id: 4, name: "Lotus Biscoff Cookie...", rating: 1, image: "🍪" },
];

export const topDeliverymen = [
  { id: 1, name: "Jhon", phone: "+5**********", orders: 20, image: "👨" },
  { id: 2, name: "Lily", phone: "+5**********", orders: 7, image: "👩" },
  { id: 3, name: "Thomas", phone: "+5**********", orders: 5, image: "👨‍🦱" },
  { id: 4, name: "William", phone: "+5**********", orders: 2, image: "👴" },
  { id: 5, name: "Amelia", phone: "+1**********", orders: 1, image: "👩‍🦰" },
];

export const topCustomers = [
  { id: 1, name: "Black", phone: "**********", orders: 19, image: "👤" },
  { id: 2, name: "Marjahan", phone: "**********", orders: 10, image: "👤" },
  { id: 3, name: "MS", phone: "**********", orders: 6, image: "👤" },
  { id: 4, name: "Ellen", phone: "**********", orders: 5, image: "👤" },
  { id: 5, name: "Jerry", phone: "**********", orders: 4, image: "👤" },
  { id: 6, name: "Ashek", phone: "**********", orders: 3, image: "👤" },
];

export const sidebarMenuItems = [
  {
    section: "POS SECTION",
    items: [
      { label: "New Sale", icon: "shopping-cart", href: "#" },
    ],
  },
  {
    section: "ORDER MANAGEMENT",
    items: [
      { label: "Orders", icon: "shopping-bag", href: "#", hasSubmenu: true },
      { label: "Order Refunds", icon: "rotate-ccw", href: "#", hasSubmenu: true },
      { label: "Flash Sales", icon: "zap", href: "#" },
    ],
  },
  {
    section: "PROMOTION MANAGEMENT",
    items: [
      { label: "Campaigns", icon: "megaphone", href: "#", hasSubmenu: true },
      { label: "Banners", icon: "image", href: "#" },
      { label: "Other Banners", icon: "images", href: "#" },
      { label: "Coupons", icon: "ticket", href: "#" },
      { label: "Push Notification", icon: "bell", href: "#" },
      { label: "Advertisement", icon: "tv", href: "#", hasSubmenu: true },
    ],
  },
  {
    section: "PRODUCT MANAGEMENT",
    items: [
      { label: "Categories", icon: "folder", href: "#", hasSubmenu: true },
      { label: "Attributes", icon: "sliders", href: "#" },
      { label: "Product Setup", icon: "settings", href: "#", hasSubmenu: true },
    ],
  },
  {
    section: "STORE MANAGEMENT",
    items: [
      { label: "New Stores", icon: "store", href: "#" },
      { label: "Add Store", icon: "plus-circle", href: "#" },
      { label: "Stores List", icon: "list", href: "#" },
      { label: "Recommended Store", icon: "star", href: "#" },
      { label: "Bulk Import", icon: "upload", href: "#" },
      { label: "Bulk Export", icon: "download", href: "#" },
    ],
  },
];
