import { exec } from 'node:child_process';
import { promises as fs } from 'node:fs';
import { promisify } from 'node:util';
import readline from 'node:readline';
import crypto from 'node:crypto';
import path from 'node:path';
const execAsync = promisify(exec);

function question(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function getPostgresURL(): Promise<string> {
  console.log('Step 1: Setting up Postgres');
  const dbChoice = await question(
    'Do you want to use a local Postgres instance with Docker (L) or a remote Postgres instance (R)? (L/R): '
  );

  if (dbChoice.toLowerCase() === 'l') {
    console.log('Setting up local Postgres instance with Docker...');
    await setupLocalPostgres();
    return 'postgres://postgres:postgres@localhost:54322/postgres';
  } else {
    console.log(
      'You can find Postgres databases at: https://vercel.com/marketplace?category=databases'
    );
    return await question('Enter your POSTGRES_URL: ');
  }
}

async function setupLocalPostgres() {
  console.log('Checking if Docker is installed...');
  try {
    await execAsync('docker --version');
    console.log('Docker is installed.');
  } catch (error) {
    console.error(
      'Docker is not installed. Please install Docker and try again.'
    );
    console.log(
      'To install Docker, visit: https://docs.docker.com/get-docker/'
    );
    process.exit(1);
  }

  console.log('Creating docker-compose.yml file...');
  const dockerComposeContent = `
services:
  postgres:
    image: postgres:16.4-alpine
    container_name: next_saas_starter_postgres
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "54322:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
`;

  await fs.writeFile(
    path.join(process.cwd(), 'docker-compose.yml'),
    dockerComposeContent
  );
  console.log('docker-compose.yml file created.');

  console.log('Starting Docker container with `docker compose up -d`...');
  try {
    await execAsync('docker compose up -d');
    console.log('Docker container started successfully.');
  } catch (error) {
    console.error(
      'Failed to start Docker container. Please check your Docker installation and try again.'
    );
    process.exit(1);
  }
}

async function getStepPaySecretKey(): Promise<string> {
  console.log('Step 2: Getting StepPay Secret Key');
  console.log(
    'You can find your StepPay Secret Key at: https://portal.steppay.kr/setting/key'
  );
  return await question('Enter your StepPay Secret Key: ');
}

async function getStepPayWebhookSecret(): Promise<string> {
  console.log('Step 3: Getting StepPay Webhook Secret');
  console.log(
    'You can find your StepPay Webhook Secret at: https://portal.steppay.kr/setting/webhook'
  );
  return await question('Enter your StepPay Webhook Secret: ');
}

function generateAuthSecret(): string {
  console.log('Step 4: Generating AUTH_SECRET...');
  return crypto.randomBytes(32).toString('hex');
}

async function writeEnvFile(envVars: Record<string, string>) {
  console.log('Step 9: Writing environment variables to .env');
  const envContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  await fs.writeFile(path.join(process.cwd(), '.env'), envContent);
  console.log('.env file created with the necessary variables.');
}

async function getGoogleClientId(): Promise<string> {
  console.log('Step 5: Getting Google Client ID');
  console.log(
    'You can find your Google Client ID at: https://console.cloud.google.com/apis/credentials'
  );
  return await question('Enter your Google Client ID: ');
}

async function getGoogleClientSecret(): Promise<string> {
  console.log('Step 6: Getting Google Client Secret');
  console.log(
    'You can find your Google Client Secret at: https://console.cloud.google.com/apis/credentials'
  );
  return await question('Enter your Google Client Secret: ');
}

async function getNaverClientId(): Promise<string> {
  console.log('Step 7: Getting Naver Client ID');
  console.log(
    'You can find your Naver Client ID at: https://developers.naver.com/'
  );
  return await question('Enter your Naver Client ID: ');
}

async function getNaverClientSecret(): Promise<string> {
  console.log('Step 8: Getting Naver Client Secret');
  console.log(
    'You can find your Naver Client Secret at: https://developers.naver.com/'
  );
  return await question('Enter your Naver Client Secret: ');
}

async function main() {
  const POSTGRES_URL = await getPostgresURL();
  const STEPPY_SECRET_KEY = await getStepPaySecretKey();
  const STEPPY_WEBHOOK_SECRET = await getStepPayWebhookSecret();
  const BASE_URL = 'http://localhost:3000';
  const AUTH_SECRET = generateAuthSecret();
  const GOOGLE_ID = await getGoogleClientId();
  const GOOGLE_SECRET = await getGoogleClientSecret();
  const NAVER_ID = await getNaverClientId();
  const NAVER_SECRET = await getNaverClientSecret();

  await writeEnvFile({
    POSTGRES_URL,
    STEPPAY_SECRET_KEY,
    STEPPAY_WEBHOOK_SECRET,
    BASE_URL,
    AUTH_SECRET,
    NEXTAUTH_SECRET: AUTH_SECRET,
    GOOGLE_ID,
    GOOGLE_SECRET,
    NAVER_ID,
    NAVER_SECRET,
  });

  console.log('🎉 Setup completed successfully!');
}

main().catch(console.error);
