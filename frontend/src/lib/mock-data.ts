export const kpis = [
  {label: 'Revenue Generated', value: '₹8.42L', change: '+18.4%'},
  {label: 'Offer Views', value: '42,680', change: '+12.1%'},
  {label: 'Offer Clicks', value: '8,932', change: '+9.7%'},
  {label: 'Orders From Offers', value: '1,184', change: '+15.2%'},
  {label: 'Conversion Rate', value: '13.25%', change: '+2.8%'},
];

export const revenueSeries = [
  {day: 'Mon', revenue: 62000},
  {day: 'Tue', revenue: 81000},
  {day: 'Wed', revenue: 78000},
  {day: 'Thu', revenue: 103000},
  {day: 'Fri', revenue: 124000},
  {day: 'Sat', revenue: 156000},
  {day: 'Sun', revenue: 138000},
];

export const campaignRows = [
  {
    id: 'ganesha-shiva',
    name: 'Ganesha Dome to Shiva Dome',
    triggerProduct: 'Ganesha Dome',
    offerProduct: 'Shiva Dome',
    discount: '20%',
    views: 12640,
    clicks: 2940,
    revenue: 284500,
    status: 'Active' as const,
  },
  {
    id: 'premium-upsell',
    name: 'Premium order upsell',
    triggerProduct: 'Order > ₹2,000',
    offerProduct: 'Brass Diya Bundle',
    discount: '₹250',
    views: 9820,
    clicks: 1812,
    revenue: 211000,
    status: 'Active' as const,
  },
  {
    id: 'beauty-cross-sell',
    name: 'Glow kit cross-sell',
    triggerProduct: 'Face Serum',
    offerProduct: 'Rose Quartz Roller',
    discount: '15%',
    views: 8120,
    clicks: 1422,
    revenue: 147900,
    status: 'Paused' as const,
  },
  {
    id: 'home-decor-bundle',
    name: 'Home decor bundle checkout',
    triggerProduct: 'DecorKart products',
    offerProduct: 'Second styling item',
    discount: '15-22%',
    views: 0,
    clicks: 0,
    revenue: 0,
    status: 'Active' as const,
  },
  {
    id: 'fashion-mystery',
    name: 'Mystery accessory offer',
    triggerProduct: 'Kurta Collection',
    offerProduct: 'Mystery Accessory',
    discount: '25%',
    views: 6080,
    clicks: 1118,
    revenue: 102400,
    status: 'Draft' as const,
  },
];

export const funnelSteps = [
  {label: 'Offer views', value: 42680},
  {label: 'CTA clicks', value: 8932},
  {label: 'Product visits', value: 5120},
  {label: 'Offer purchases', value: 1184},
];

export const donutData = [
  {name: 'Spiritual', value: 38},
  {name: 'Home decor', value: 27},
  {name: 'Beauty', value: 21},
  {name: 'Fashion', value: 14},
];

export const recentCampaigns = [
  {name: 'Ganesha Dome to Shiva Dome', status: 'Active', metric: '23.3% CTR'},
  {name: 'Premium order upsell', status: 'Active', metric: '₹2.11L revenue'},
  {name: 'Glow kit cross-sell', status: 'Paused', metric: '17.5% CTR'},
];
