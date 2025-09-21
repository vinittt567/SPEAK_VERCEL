import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Environment Variables Check:');
console.log('DB_PASSWORD set:', process.env.DB_PASSWORD ? 'Yes' : 'No');
console.log('DB_PASSWORD value:', process.env.DB_PASSWORD === 'your_mongodb_password_here' ? 'Still placeholder' : 'Updated');
console.log('JWT_SECRET set:', process.env.JWT_SECRET ? 'Yes' : 'No');