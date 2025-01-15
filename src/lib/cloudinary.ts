import { v2 as cloudinary } from 'cloudinary';

if (!process.env.CLOUDINARY_URL) {
  throw new Error('Please add your CLOUDINARY_URL to .env.local');
}

cloudinary.config({
  secure: true
});

export default cloudinary; 