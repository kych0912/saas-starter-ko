import { db } from './drizzle';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
  console.log('🗑️ 데이터베이스 테이블 삭제 중');

  await db.execute(sql`DROP TABLE IF EXISTS ${schema.activityLogs}`);
  await db.execute(sql`DROP TABLE IF EXISTS ${schema.invitations}`);
  await db.execute(sql`DROP TABLE IF EXISTS ${schema.teamMembers}`);
  await db.execute(sql`DROP TABLE IF EXISTS ${schema.teams}`);
  await db.execute(sql`DROP TABLE IF EXISTS ${schema.users}`);

  console.log('✅ 데이터베이스 테이블 삭제 완료');
  process.exit(0);
}

resetDatabase().catch((error) => {
  console.error('❌ 데이터베이스 테이블 삭제 오류:', error);
  process.exit(1);
}); 