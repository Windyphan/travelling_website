// Cloudflare D1 Database Connection
const getDB = (env) => {
  if (!env.DB) {
    throw new Error('Database binding not found. Make sure D1 database is properly configured.');
  }
  return env.DB;
};

// Helper function to execute queries with error handling
const executeQuery = async (db, query, params = []) => {
  try {
    const result = await db.prepare(query).bind(...params).run();
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
};

// Helper function to get single record
const getRecord = async (db, query, params = []) => {
  try {
    const result = await db.prepare(query).bind(...params).first();
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
};

// Helper function to get multiple records
const getRecords = async (db, query, params = []) => {
  try {
    const result = await db.prepare(query).bind(...params).all();
    return result.results || [];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database operation failed: ${error.message}`);
  }
};

module.exports = {
  getDB,
  executeQuery,
  getRecord,
  getRecords,
};
