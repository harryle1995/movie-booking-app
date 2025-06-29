// Import the 'pg' module and 'dotenv' for environment variables
import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

// Destructure Pool constructor from the pg package
const { Pool } = pkg;

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Works for both local and Render
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Export the pool instance to reuse across the backend (routes, services, etc.)
export default pool;
