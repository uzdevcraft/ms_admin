export const APP_NAME = 'ZARO';
export const APP_TAGLINE = 'Admin panel';

export const common = {
  cancel: 'Bekor qilish',
  create: 'Yaratish',
  save: 'Saqlash',
  delete: "O'chirish",
  edit: 'Tahrirlash',
  actions: 'Amallar',
  active: 'Faol',
  inactive: 'Nofaol',
  somethingWentWrong: 'Xatolik yuz berdi',
  signIn: 'Kirish',
  username: 'Username',
  password: 'Parol',
  usernamePlaceholder: 'Foydalanuvchi nomingiz',
  passwordPlaceholder: 'Parolingiz',
  logout: 'Chiqish',
  expandSidebar: 'Yon panelni kengaytirish',
  collapseSidebar: "Yon panelni yig'ish",
  switchToLight: "Yorug' rejimga o'tish",
  switchToDark: "Qorong'u rejimga o'tish",
  updateStatus: 'Holatni yangilash',
  filter: 'Filtrlash',
  clear: 'Tozalash',
  uncategorized: "Bo'limlarsiz",
  dash: '—',
  id: 'ID'
} as const;

export const nav = {
  dashboard: 'Asosiy',
  products: 'Mahsulotlar',
  categories: "Bo'limlar",
  orders: 'Buyurtmalar',
  users: 'Mijozlar',
  userTesting: 'Foydalanuvchi testi'
} as const;

export const orderStatus = {
  pending: 'Kutilmoqda',
  paid: "To'langan",
  processing: 'Jarayonda',
  shipped: 'Yuborilgan',
  delivered: 'Yetkazilgan',
  cancelled: 'Bekor qilingan'
} as const;

export const login = {
  title: 'Boshqaruv paneliga kirish',
  success: 'Muvaffaqiyatli kirdingiz',
  invalidCredentials: "Noto'g'ri foydalanuvchi nomi yoki parol. Faqat admin hisoblar kirishi mumkin.",
  missingAdminId: 'VITE_ADMIN_ID .env faylida sozlanmagan. Serverni qayta ishga tushiring.',
  missingApiUrl: 'VITE_API_BASE_URL .env faylida sozlanmagan. Serverni qayta ishga tushiring.',
  apiError: 'API orqali token olish muvaffaqiyatsiz. Internet aloqasini va .env sozlamalarini tekshiring.'
} as const;

export const dashboard = {
  welcome: (name: string) => `${name} ga xush kelibsiz`,
  overview: 'Analitika — buyurtmalar, daromad, katalog holati va bozor faolligini kuzating.',
  customers: 'Mijozlar',
  products: 'Mahsulotlar',
  categories: "Bo'limlar",
  orders: 'Buyurtmalar',
  activeProducts: 'Faol mahsulotlar',
  totalRevenue: 'Umumiy daromad',
  averageOrder: "O'rtacha buyurtma",
  ordersRevenue: 'Buyurtmalar va daromad',
  ordersRevenueDesc: "So'nggi 14 kunlik kunlik buyurtmalar va daromad",
  ordersLegend: 'Buyurtmalar',
  revenueLegend: 'Daromad (UZS)',
  orderStatus: 'Buyurtma holati',
  orderStatusDesc: "Bajarish holati bo'yicha buyurtmalar taqsimoti",
  ordersCount: (count: number) => `${count}\nBuyurtma`,
  noOrders: "Hali buyurtmalar yo'q",
  productsByCategory: "Bo'lim bo'yicha mahsulotlar",
  productsByCategoryDesc: "Bo'zor bo'limlari bo'yicha katalog taqsimoti",
  productsLegend: 'Mahsulotlar',
  noProducts: "Hali mahsulotlar yo'q",
  ordersByStatus: "Holat bo'yicha buyurtmalar",
  ordersByStatusDesc: "Buyurtma hayotiy tsikli bosqichlari bo'yicha solishtirish",
  recentOrders: "So'nggi buyurtmalar",
  recentOrdersDesc: 'Eng yangi marketplace buyurtmalari',
  viewAllOrders: "Barchasini ko'rish"
} as const;

export const products = {
  title: 'Mahsulotlar',
  description: 'Xorijdan olib kelinadigan va yetkaziladigan mahsulotlarni boshqaring',
  add: "Mahsulot qo'shish",
  product: 'Mahsulot',
  category: "Bo'lim",
  price: 'Narx',
  discount: 'Chegirma',
  stock: 'Miqdor',
  status: 'Status',
  deleteTitle: "Mahsulotni o'chirish",
  deleteMessage: (name: string) => `<strong>${name}</strong> ni o'chirasizmi? Bu amalni ortga qaytarib bo'lmaydi.`,
  deleted: "Mahsulot o'chirildi",
  createSuccess: 'Mahsulot yaratildi',
  updateSuccess: 'Mahsulot yangilandi',
  addModal: "Mahsulot qo'shish",
  editModal: 'Mahsulotni tahrirlash'
} as const;

export const categories = {
  title: "Bo'limlar",
  description: "Xorijiy mahsulotlarni ko'rish uchun bo'limlarga ajrating",
  add: "Bo'lim qo'shish",
  category: "Bo'lim",
  sortOrder: 'Index',
  status: 'Status',
  created: 'Yaratilgan',
  deleteTitle: "Bo'limni o'chirish",
  deleteMessage: (name: string) =>
    `<strong>${name}</strong> ni o'chirasizmi? Bu bo'limdagi mahsulotlar o'z holida qoladi.`,
  deleted: "Bo'lim o'chirildi",
  createSuccess: "Bo'lim yaratildi",
  updateSuccess: "Bo'lim yangilandi",
  addModal: "Bo'lim qo'shish",
  editModal: "Bo'limni tahrirlash"
} as const;

export const orders = {
  title: 'Buyurtmalar',
  description: "Buyurtma holatini ko'ring va yangilang. Mijozlar buyurtmalarni foydalanuvchi ilovasi orqali beradi.",
  orderNumber: 'ID',
  customer: 'Mijoz',
  items: 'Mahsulotlar',
  total: 'Jami',
  status: 'Status',
  delivery: 'Yetkazib berish',
  date: 'Sana',
  createModal: 'Buyurtma yaratish',
  updateStatusModal: 'Buyurtma holatini yangilash',
  allStatuses: 'Barcha statuslar',
  orderSummary: (id: number, name: string) => `Buyurtma <strong>#${id}</strong> — ${name}`,
  totalAmount: (amount: string) => `Jami: ${amount}`,
  created: 'Buyurtma yaratildi',
  statusUpdated: 'Buyurtma holati yangilandi',
  deleteTitle: "Buyurtmani o'chirish",
  deleted: "Buyurtma o'chirildi",
  open: 'Ochish',
  back: 'Orqaga',
  single: (id: number) => `Buyurtma #${id}`,
  singleDescription: "Buyurtma tarkibi, mijoz va to'lov ma'lumotlari",
  notFound: 'Buyurtma topilmadi',
  orderInfo: "Buyurtma ma'lumotlari",
  customerId: 'Mijoz ID',
  comment: 'Izoh',
  image: 'Rasm',
  product: 'Mahsulot',
  quantity: 'Miqdor',
  price: 'Narx',
  itemTotal: 'Summa',
  paymentInfo: "To'lov ma'lumotlari",
  noPayment: "To'lov ma'lumotlari yo'q",
  merchantTransId: 'Tranzaksiya ID',
  paymentAmount: "To'lov summasi",
  paymentUrl: "To'lov havolasi",
  openPaymentUrl: "To'lov sahifasini ochish",
  receipt: 'Chek rasmi',
  noReceipt: 'Chek rasmi yuklanmagan',
  noItems: "Buyurtmada mahsulotlar yo'q"
} as const;

export const paymentStatus = {
  WAITING: 'Kutilmoqda',
  PREPARED: 'Tayyorlangan',
  PAID: "To'langan",
  CANCELLED: 'Bekor qilingan',
  FAILED: 'Muvaffaqiyatsiz'
} as const;

export const users = {
  title: 'Mijozlar',
  description: 'Xorijdan mahsulot buyurtma qiladigan bozor mijozlarini boshqaring',
  add: "Mijoz qo'shish",
  name: 'Ism',
  email: 'Email',
  phone: 'Telefon',
  location: 'Manzil',
  joined: "Qo'shilgan",
  updated: 'Mijoz yangilandi',
  created: 'Mijoz yaratildi',
  deleted: "Mijoz o'chirildi",
  deleteTitle: "Mijozni o'chirish",
  deleteMessage: (name: string) => `<strong>${name}</strong> ni o'chirasizmi? Bu amalni ortga qaytarib bo'lmaydi.`,
  editModal: 'Mijozni tahrirlash',
  addModal: "Mijoz qo'shish"
} as const;

export const userTesting = {
  title: 'Foydalanuvchi API testi',
  description:
    "Foydalanuvchi JWT bilan mijoz endpointlarini sinab ko'ring. Faqat oddiy foydalanuvchilar buyurtma berishi mumkin.",
  userToken: 'Foydalanuvchi tokeni',
  tokenHint:
    "Mijoz tokenini joylashtiring yoki Telegram ID orqali kiring. Bu sahifadagi so'rovlar admin sessiyasidan emas, shu token orqali yuboriladi.",
  bearerToken: 'Bearer token',
  saveToken: 'Tokenni saqlash',
  clearToken: 'Tozalash',
  tokenActive: 'Token faol',
  telegramLogin: 'Yoki Telegram ID orqali kirish',
  getToken: 'Token olish',
  saveTokenFirst: 'Avval foydalanuvchi tokenini saqlang',
  tokenSaved: 'Foydalanuvchi tokeni saqlandi',
  tokenCleared: 'Foydalanuvchi tokeni tozalandi',
  pasteTokenFirst: 'Avval foydalanuvchi tokenini joylashtiring',
  invalidTelegramId: "To'g'ri Telegram ID kiriting",
  loggedIn: 'Foydalanuvchi sifatida kirdingiz',
  loginFailed: 'Kirish muvaffaqiyatsiz',
  orderPlaced: 'Buyurtma berildi',
  onlyUsersCanOrder: 'Faqat foydalanuvchilar buyurtma bera oladi',
  paymentCreated: "To'lov yaratildi",
  paymentSent: "To'lov so'rovi yuborildi",
  paymentFailed: "To'lov muvaffaqiyatsiz",
  profileFailed: "Profilni yuklab bo'lmadi",
  telegramId: 'Telegram ID',
  phone: 'Telefon',
  payment: "To'lov",
  pay: "To'lash",
  createPayment: "To'lov yaratish",
  placeOrder: 'Buyurtma berish',
  deliveryAddress: 'Yetkazib berish manzili',
  comment: 'Izoh',
  quantity: 'Miqdor',
  addItem: "Mahsulot qo'shish",
  removeItem: 'Mahsulotni olib tashlash',
  emptyState: 'Profil, mahsulotlar, buyurtmalar va buyurtma berish uchun foydalanuvchi tokenini saqlang.'
} as const;

export const forms = {
  category: "Bo'lim",
  name: 'Nomi',
  nameUz: 'Nomi (UZ)',
  nameRu: 'Nomi (RU)',
  description: 'Tavsif',
  descriptionUz: 'Tavsif (UZ)',
  descriptionRu: 'Tavsif (RU)',
  price: 'Narx',
  discountPrice: 'Chegirma narxi',
  stock: 'Ombor',
  sortOrder: 'Tartib raqami',
  imageUrl: 'Rasm',
  imagePlaceholder: 'Rasm faylini tanlang (PNG, JPEG, JPG, WEBP)',
  id: 'ID',
  activeVisible: "Faol (do'konda ko'rinadi)",
  product: 'Mahsulot',
  status: 'Holat',
  fullName: "To'liq ism",
  email: 'Email',
  phone: 'Telefon',
  country: 'Mamlakat',
  city: 'Shahar',
  slug: 'Slug',
  currency: 'Valyuta',
  originCountry: 'Kelib chiqqan mamlakat',
  originCountryPlaceholder: 'masalan, Yaponiya, Italiya',
  orderNumber: 'Buyurtma raqami',
  totalAmount: 'Umumiy summa',
  shippingCountry: 'Yetkazish mamlakat',
  shippingCity: 'Yetkazish shahri',
  shippingAddress: 'Yetkazish manzili',
  notes: 'Eslatmalar'
} as const;

export const validation = {
  usernameRequired: 'Foydalanuvchi nomi talab qilinadi',
  passwordRequired: 'Parol talab qilinadi',
  fullNameRequired: "To'liq ism talab qilinadi",
  invalidEmail: "Noto'g'ri email",
  emailRequired: 'Email talab qilinadi',
  phoneRequired: 'Telefon talab qilinadi',
  countryRequired: 'Mamlakat talab qilinadi',
  cityRequired: 'Shahar talab qilinadi',
  nameRequired: 'Nom talab qilinadi',
  nameUzRequired: "O'zbekcha nom talab qilinadi",
  nameRuRequired: 'Ruscha nom talab qilinadi',
  slugRequired: 'Slug talab qilinadi',
  slugFormat: 'Kichik harflar, raqamlar va defis ishlating',
  descriptionRequired: 'Tavsif talab qilinadi',
  descriptionUzRequired: "O'zbekcha tavsif talab qilinadi",
  descriptionRuRequired: 'Ruscha tavsif talab qilinadi',
  pricePositive: "Narx musbat bo'lishi kerak",
  priceRequired: 'Narx talab qilinadi',
  discountPositive: "Chegirma narxi musbat bo'lishi kerak",
  discountRequired: 'Chegirma narxi talab qilinadi',
  validUrl: "To'g'ri URL bo'lishi kerak",
  imageUrlRequired: 'Rasm talab qilinadi',
  stockRequired: 'Ombor talab qilinadi',
  sortOrderRequired: 'Tartib raqami talab qilinadi',
  idRequired: 'ID talab qilinadi',
  idPositive: "ID musbat butun son bo'lishi kerak",
  categoryRequired: 'Kategoriya talab qilinadi',
  currencyRequired: 'Valyuta talab qilinadi',
  originCountryRequired: 'Kelib chiqqan mamlakat talab qilinadi',
  productRequired: 'Mahsulot talab qilinadi',
  quantityMin: "Miqdor kamida 1 bo'lishi kerak",
  quantityRequired: 'Miqdor talab qilinadi',
  addAtLeastOneItem: "Kamida bitta mahsulot qo'shing",
  deliveryAddressRequired: 'Yetkazib berish manzili talab qilinadi',
  statusRequired: 'Holat talab qilinadi',
  orderNumberRequired: 'Buyurtma raqami talab qilinadi',
  customerRequired: 'Mijoz talab qilinadi',
  customerNameRequired: 'Mijoz ismi talab qilinadi',
  totalRequired: 'Jami summa talab qilinadi',
  shippingCountryRequired: 'Yetkazish mamlakat talab qilinadi',
  shippingCityRequired: 'Yetkazish shahri talab qilinadi',
  shippingAddressRequired: 'Yetkazish manzili talab qilinadi'
} as const;

export const orderStatusOptions = [
  { value: 'PENDING', label: orderStatus.pending },
  { value: 'PAID', label: orderStatus.paid },
  { value: 'PROCESSING', label: orderStatus.processing },
  { value: 'SHIPPED', label: orderStatus.shipped },
  { value: 'DELIVERED', label: orderStatus.delivered },
  { value: 'CANCELLED', label: orderStatus.cancelled }
] as const;

export const orderStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: orderStatus.pending,
    paid: orderStatus.paid,
    processing: orderStatus.processing,
    shipped: orderStatus.shipped,
    delivered: orderStatus.delivered,
    cancelled: orderStatus.cancelled
  };
  return map[status] ?? status;
};
