import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  localApi:process.env.LOCAL_API,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  accessToken: process.env.ACCESS_TOKEN,
  saltRounds: process.env.SALTROUNDS,
  development: process.env.DEVELOPMENT,
  mailPassword: process.env.MAIL_PASS,
  mailName: process.env.MAIL_NAME,
  resetToken: process.env.RESET_TOKEN,
  privetFolderToken: process.env.PRIVET_FOLDER_TOKEN,
  cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
