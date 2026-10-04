/* ===========================================================
   data.js — Site Data & Content Configuration
   Uses 100% local high-resolution realistic image assets.
   =========================================================== */

const COMPANY = {
  name: "Kerala PG",
  short: "KP",
  logo: "assets/logo.png",
  tagline: "Rooms in Kerala that feel like home",
  intro: "Managed PG homes across Kerala with clean rooms, regular meals, and direct support for everyday living.",
  about: "Kerala PG manages well-kept homes across Kerala with a practical, no-fuss approach. Our team handles room upkeep, daily meals, utilities, and maintenance so residents can settle in without the usual hassle.",
  phone: "+91 89378 51156",
  whatsapp: "918937851156",
  email: "stay@sainivaspg.in",
  office: "Ernakulam, Kerala",
  hours: "9:00 AM to 9:00 PM, all days",
  since: "2018",
  heroBg: "assets/room-hero.png"
};

/* Facilities with local photos */
const FACILITIES = [
  { icon: "wifi", photo: "assets/fac-wifi.jpg", title: "High-Speed Wi-Fi", text: "100 Mbps fibre internet with automatic backup lines on every floor." },
  { icon: "food", photo: "assets/fac-food.jpg", title: "Home-Style Meals", text: "Fresh breakfast and dinner prepared daily in our hygienic in-house kitchen." },
  { icon: "power", photo: "assets/fac-power.jpg", title: "24/7 Power Backup", text: "Inverter and generator support so lighting, fans and Wi-Fi never go off." },
  { icon: "clean", photo: "assets/fac-clean.jpg", title: "Daily Housekeeping", text: "Rooms swept, mopped, and bathrooms disinfected daily by full-time staff." },
  { icon: "water", photo: "assets/fac-water.jpg", title: "24-Hour Hot Water", text: "Dedicated geysers and solar water heating running round the clock." },
  { icon: "wash", photo: "assets/fac-wash.jpg", title: "Washing & Laundry", text: "Automatic washing machines available on every floor, free for all residents." },
  { icon: "shield", photo: "assets/fac-shield.jpg", title: "CCTV & Security", text: "24/7 CCTV surveillance in common areas with resident biometric access." },
  { icon: "bed", photo: "assets/fac-bed.jpg", title: "Furnished Rooms", text: "Comfortable bed, orthopaedic mattress, wooden wardrobe, desk & chair." }
];

/* Managed PG Properties */
const PGS = [
  {
    name: "Kerala PG | Kakkanad, Kochi",
    audience: "Boys",
    area: "Kakkanad, Kochi",
    address: "Kakkanad, Kochi, Kerala",
    landmark: "Near IT hubs and local transit access",
    rent: 8500,
    deposit: 15000,
    sharing: "2 & 3 sharing",
    food: "Veg + non-veg",
    notice: "1 month",
    vacancy: 6,
    photos: [
      "assets/room2.jpg",
      "assets/room1.jpg",
      "assets/food1.jpg"
    ],
    amenities: ["AC rooms", "Lift", "Balcony", "Two-wheeler parking", "Common TV", "Gym next door"],
    mapLink: "https://maps.google.com/?q=Kakkanad+Kochi+Kerala"
  },
  {
    name: "Kerala PG | Kazhakkoottam, Thiruvananthapuram",
    audience: "Girls",
    area: "Kazhakkoottam, Thiruvananthapuram",
    address: "Kazhakkoottam, Thiruvananthapuram, Kerala",
    landmark: "Close to daily essentials and city transit",
    rent: 10000,
    deposit: 20000,
    sharing: "Single & 2 sharing",
    food: "Pure veg",
    notice: "1 month",
    vacancy: 2,
    photos: [
      "assets/room1.jpg",
      "assets/room3.jpg",
      "assets/building1.jpg"
    ],
    amenities: ["Attached bathroom", "Lift", "Lady warden", "Study room", "Parking", "Fridge access"],
    mapLink: "https://maps.google.com/?q=Kazhakkoottam+Thiruvananthapuram+Kerala"
  },
  {
    name: "Kerala PG | West Hill, Kozhikode",
    audience: "Boys & Girls",
    area: "West Hill, Kozhikode",
    address: "West Hill, Kozhikode, Kerala",
    landmark: "Convenient access to colleges and city routes",
    rent: 7000,
    deposit: 12000,
    sharing: "3 & 4 sharing",
    food: "Veg + non-veg",
    notice: "15 days",
    vacancy: 0,
    photos: [
      "assets/room3.jpg",
      "assets/room4.jpg",
      "assets/building2.jpg"
    ],
    amenities: ["Shuttle to tech park", "Common TV", "Parking", "Reading room"],
    mapLink: "https://maps.google.com/?q=West+Hill+Kozhikode+Kerala"
  },
  {
    name: "Kerala PG | Punkunnam, Thrissur",
    audience: "Boys",
    area: "Punkunnam, Thrissur",
    address: "Punkunnam, Thrissur, Kerala",
    landmark: "Connected to city markets and major roads",
    rent: 7500,
    deposit: 13000,
    sharing: "2 & 3 sharing",
    food: "Veg + non-veg",
    notice: "1 month",
    vacancy: 4,
    photos: [
      "assets/room4.jpg",
      "assets/food2.jpg",
      "assets/building1.jpg"
    ],
    amenities: ["AC rooms", "Lift", "Parking", "Terrace", "Water purifier"],
    mapLink: "https://maps.google.com/?q=Punkunnam+Thrissur+Kerala"
  }
];

/* Life Here Photo Gallery items */
const LIFE_GALLERY = [
  { src: "assets/room-hero.png", title: "Modern Furnished Bedrooms", cat: "Bedrooms", desc: "Spacious rooms with study desk, wardrobe & comfy bed" },
  { src: "assets/food1.jpg", title: "Fresh Home-Cooked Thali", cat: "Dining", desc: "Nutritious North & South Indian meals served twice daily" },
  { src: "assets/building1.jpg", title: "Managed Property Exteriors", cat: "Properties", desc: "Clean multi-storey buildings with 24/7 security & lift access" },
  { src: "assets/food2.jpg", title: "Hygienic Dining Space", cat: "Dining", desc: "Clean common dining hall cleaned after every meal" },
  { src: "assets/room2.jpg", title: "Bright Well-Lit Rooms", cat: "Bedrooms", desc: "Natural sunlight, ventilation & private storage lockers" },
  { src: "assets/building2.jpg", title: "Kerala PG Locations", cat: "Properties", desc: "Well-connected homes in Kerala's growing residential hubs" }
];
