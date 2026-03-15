require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Property = require('../models/Property');
const { seedUsers } = require('./users');
const { seedProperties } = require('./properties');
const connectDB = require('../init/index');

const seed = async () => {

  try {
    await connectDB();

    console.log(' Clearing existing data...');
    await Property.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding users...');
    const createdUsers = await User.create(seedUsers);
    const agentUser = createdUsers[0];

    console.log('Seeding properties...');
    const propertiesWithOwner = seedProperties.map((p) => ({ ...p, owner: agentUser._id }));
    await Property.create(propertiesWithOwner);

    console.log('Database seeded successfully!');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Properties: ${seedProperties.length}`);
    console.log('\n Test credentials:');
    seedUsers.forEach((u) => console.log(`   ${u.email} / ${u.password} (${u.role})`));

    process.exit(0);
  } catch (err) {
    console.error(' Seed error:', err);
    process.exit(1);

    
  }
};

seed();
