import { db } from './drizzle';
import * as schema from './schema';

async function resetDatabase() {
  console.log('🗑️ reset database');

  // delete all tables
  await db.delete(schema.activityLogs);
  await db.delete(schema.invitations);
  await db.delete(schema.billingKeys);
  await db.delete(schema.teamMembers);
  await db.delete(schema.session);
  await db.delete(schema.teams);
  await db.delete(schema.users);
  await db.delete(schema.prices);
  await db.delete(schema.products);
  await db.delete(schema.subscriptions);
  
  console.log('✅ complete reset database');
  process.exit(0);
}

resetDatabase().catch((error) => {
  console.error('❌ reset database error:', error);
  process.exit(1);
}); 