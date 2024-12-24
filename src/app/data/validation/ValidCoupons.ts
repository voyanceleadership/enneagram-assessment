const validCoupons = [
  {
    code: 'FREEACCESS',
    uses: 10,                     // Number of uses remaining
    discount: 100,                // Discount percentage
    expires: '2024-12-31',        // Expiration date (YYYY-MM-DD)
    active: true                  // Coupon status
  },
  {
    code: 'DISCOUNT50',
    uses: 50,
    discount: 50,
    expires: '2025-06-30',
    active: true
  },
  {
    code: 'WELCOME10',
    uses: 100,
    discount: 10,
    expires: '2024-10-01',
    active: true
  },
  {
    code: 'EXPIRED10',
    uses: 5,
    discount: 10,
    expires: '2023-12-01',        // Already expired coupon
    active: true
  },
  {
    code: 'INACTIVE25',
    uses: 20,
    discount: 25,
    expires: '2025-01-01',
    active: false                 // Inactive coupon
  }
];

export default validCoupons;