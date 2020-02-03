import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
// Prospect
const ProspectMotor = React.lazy(() => import('./views/Menu/Prospect/Motor'));
const ProspectSukuCadang = React.lazy(() => import('./views/Menu/Prospect/SukuCadang'));
const ProspectAksesoris = React.lazy(() => import('./views/Menu/Prospect/Aksesoris'));
const ProspectBookingService = React.lazy(() => import('./views/Menu/Prospect/BookingService'));
// Produk
const ProdukMotorDetail = React.lazy(() => import('./views/Menu/Produk/Motor/Detail'));
const ProdukMotorHarga = React.lazy(() => import('./views/Menu/Produk/Motor/Harga'));
const ProdukMotorSpesifikasi = React.lazy(() => import('./views/Menu/Produk/Motor/Spesifikasi'));
const ProdukMotorTeknologi = React.lazy(() => import('./views/Menu/Produk/Motor/Teknologi'));
const ProdukMotorBrosur = React.lazy(() => import('./views/Menu/Produk/Motor/Brosur'));

const ProdukSukuCadang = React.lazy(() => import('./views/Menu/Produk/SukuCadang'));
const ProdukAksesoris = React.lazy(() => import('./views/Menu/Produk/Aksesoris'));
const ProdukService = React.lazy(() => import('./views/Menu/Produk/Service'));
// Lokasi
const LokasiDealer = React.lazy(() => import('./views/Menu/Lokasi/Dealer'));
const LokasiAhass = React.lazy(() => import('./views/Menu/Lokasi/Ahass'));

const PromoMotor= React.lazy(() => import('./views/Menu/Promo/Motor'));
const PromoService= React.lazy(() => import('./views/Menu/Promo/Service'));
// const Brosur = React.lazy(() => import('./views/Menu/Brosur'));
const SolutionCenter = React.lazy(() => import('./views/Menu/SolutionCenter'));

const LainnyaEvent = React.lazy(() => import('./views/Menu/Lainnya/Event'));
const LainnyaKomunitas = React.lazy(() => import('./views/Menu/Lainnya/Komunitas'));
const LainnyaMembership = React.lazy(() => import('./views/Menu/Lainnya/Membership'));
const LainnyaChatHistory = React.lazy(() => import('./views/Menu/Lainnya/ChatHistory'));

const Pengguna = React.lazy(() => import('./views/Menu/Pengguna'));
const Customer = React.lazy(() => import('./views/Menu/Customer'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/pengguna', name: 'Pengguna', component: Pengguna },
  { path: '/customer', name: 'Customer', component: Customer },
  
  // Proespect
  { path: '/prospect', exact: true, name: 'Prospect', component: ProspectMotor },
  { path: '/prospect/motor', name: 'Motor', component: ProspectMotor },
  { path: '/prospect/suku_cadang', name: 'Suku Cadang', component: ProspectSukuCadang },
  { path: '/prospect/aksesoris', name: 'Aksesoris', component: ProspectAksesoris },
  { path: '/prospect/booking_service', name: 'Booking Service', component: ProspectBookingService },
  
  // Produk
  { path: '/produk', exact: true, name: 'Produk', component: ProdukMotorDetail },
  // Produk Motor
  { path: '/produk/motor', exact: true, name: 'Motor', component: ProdukMotorDetail },
  { path: '/produk/motor/detail', name: 'Detail', component: ProdukMotorDetail },
  { path: '/produk/motor/harga', name: 'Harga', component: ProdukMotorHarga },
  { path: '/produk/motor/spesifikasi', name: 'Spesifikasi', component: ProdukMotorSpesifikasi },
  { path: '/produk/motor/teknologi', name: 'Teknologi', component: ProdukMotorTeknologi },
  { path: '/produk/motor/brosur', name: 'Brosur', component: ProdukMotorBrosur },

  { path: '/produk/suku_cadang', name: 'Suku Cadang', component: ProdukSukuCadang },
  { path: '/produk/aksesoris', name: 'Aksesoris', component: ProdukAksesoris },
  { path: '/produk/service', name: 'Service', component: ProdukService },
  
  // Lokasi
  { path: '/lokasi', exact: true, name: 'Lokasi', component: LokasiDealer },
  { path: '/lokasi/dealer', name: 'Dealer', component: LokasiDealer },
  { path: '/lokasi/ahass', name: 'AHASS', component: LokasiAhass },

  // Promo
  { path: '/promo', exact: true, name: 'Promo', component: PromoMotor },
  { path: '/promo/motor', name: 'Motor', component: PromoMotor },
  { path: '/promo/service', name: 'Service', component: PromoService },
  
  // { path: '/brosur', name: 'Brosur', component: Brosur },
  { path: '/solution_center', name: 'Solution Center', component: SolutionCenter },

  // Lainnya
  { path: '/lainnya', exact: true, name: 'Lainnya', component: LainnyaEvent },
  { path: '/lainnya/event', name: 'Event', component: LainnyaEvent },
  { path: '/lainnya/komunitas', name: 'Komunitas', component: LainnyaKomunitas },
  { path: '/lainnya/membership', name: 'Membership', component: LainnyaMembership },
  { path: '/lainnya/chat_history', name: 'Chat History', component: LainnyaChatHistory },
];

export default routes;
