import { db } from './drizzle';
import { users, teams, teamMembers, products, prices } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  //test user seed
  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: "owner",
      },
    ])
    .returning();

  console.log('Initial user created.');

  //test team seed
  const [team] = await db
    .insert(teams)
    .values({
      name: 'Test Team',
    })
    .returning();

  //test team member seed
  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  //test product seed
  await db.insert(products).values([{
    id: 'prod_12212058',
    name: 'Base',
    description: 'Base subscription plan',
    active: true,
  },{
    id: 'prod_12212059',
    name: 'Plus',
    description: 'Plus subscription plan',
    active: true, 
  }]);

  //test price seed
  await db.insert(prices).values([{
    id: 'price_12212058',
    productId: 'prod_12212058',
    currency: 'usd',
    unitAmount: '800',
    trialPeriodDays: 14,
    interval: 'month',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },{
    id: 'price_12212059',
    productId: 'prod_12212059',
    currency: 'usd',
    unitAmount: '1200',
    trialPeriodDays: 14,
    interval: 'month',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }]);
  
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
