import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  client_url: process.env.CLIENT_SITE_URL,
  server_url: process.env.SERVER_SITE_URL,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  accessToken: process.env.ACCESS_TOKEN,
  saltRounds: process.env.SALTROUNDS,
  development: process.env.DEVELOPMENT,
  mailPassword: process.env.MAIL_PASS,
  mailName: process.env.MAIL_NAME,
  resetToken: process.env.RESET_TOKEN,
};
