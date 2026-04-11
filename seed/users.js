const seedUsers = [
  {
    name: 'Ashwin Mali ',
    email: 'ashwin7781@propertypro.com',
    password: 'password123',
    role: 'agent',
    phone: '9876543210',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'Mukesh Ambani ',
    email: 'virat@propertypro.com',
    password: 'password123',
    role: 'agent',
    phone: '9876543211',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    name: 'Admin User',
    email: 'admin@propertypro.com',
    password: 'admin@123',
    role: 'admin',
    phone: '9999999999',
    avatar: 'https://randomuser.me/api/portraits/men/99.jpg',
  },
];

module.exports = { seedUsers };
