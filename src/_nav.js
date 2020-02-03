export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    }, {
      title: true,
      name: '',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    }, {
      name: 'Pengguna',
      url: '/pengguna',
      icon: 'fas fa-user',
    }, {
      name: 'Customer',
      url: '/customer',
      icon: 'fas fa-hand-holding-heart',
    }, {
      name: 'Prospect',
      url: '/prospect',
      icon: 'fas fa-shopping-basket',
      children: [
        {
          name: 'Motor',
          url: '/prospect/motor',
        }, {
          name: 'Suku Cadang',
          url: '/prospect/suku_cadang',
        }, {
          name: 'Aksesoris',
          url: '/prospect/aksesoris',
        }, {
          name: 'Booking Service',
          url: '/prospect/booking_service',
        }
      ],
    }, {
      name: 'Produk',
      url: '/produk',
      icon: 'cui-dollar',
      children: [
        {
          name: 'Motor',
          url: '/produk/motor',
          children: [
            {
              name: '- Detail',
              url: '/produk/motor/detail',
            }, {
              name: '- Harga',
              url: '/produk/motor/harga',
            }, {
              name: '- Spesifikasi',
              url: '/produk/motor/spesifikasi',
            }, {
              name: '- Teknologi',
              url: '/produk/motor/teknologi',
            }, {
              name: '- Brosur',
              url: '/produk/motor/brosur',
            },
          ]
        }, {
          name: 'Suku Cadang',
          url: '/produk/suku_cadang',
        }, {
          name: 'Aksesoris',
          url: '/produk/aksesoris',
        }, {
          name: 'Service',
          url: '/produk/service',
        }
      ],
    }, {
      name: 'Lokasi',
      url: '/lokasi',
      icon: 'fas fa-map-marker-alt',
      children: [
        {
          name: 'Dealer',
          url: '/lokasi/dealer',
        }, {
          name: 'AHASS',
          url: '/lokasi/ahass',
        }
      ],
    }, {
      name: 'Promo',
      url: '/promo',
      icon: 'fas fa-tag',
      children: [
        {
          name: 'Motor',
          url: '/promo/motor',
        }, {
          name: 'Service',
          url: '/promo/service',
        }
      ]
    }, {
      name: 'Solution Center',
      url: '/solution_center',
      icon: 'fas fa-lightbulb',
      children: [
        {
          name: 'Technical Solution',
          url: '/solution_center/technical_solution'
        }
      ]
    }, {
      name: 'Lainnya',
      url: '/lainnya',
      icon: 'fas fa-angle-double-right',
      children: [
        {
          name: 'Event',
          url: '/lainnya/event',
        }, {
          name: 'Komunitas',
          url: '/lainnya/komunitas',
        }, {
          name: 'Membership',
          url: '/lainnya/membership',
        }, {
          name: 'Chat History',
          url: '/lainnya/chat_history',
        },
      ]
    }

  ],
};
