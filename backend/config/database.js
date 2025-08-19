// Database configuration for Cloudflare D1 accessed from Vercel

// Utility functions
const generateId = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const generateBookingNumber = () => {
  const prefix = 'BK';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// For Vercel deployment accessing Cloudflare D1
const getDB = () => {
  // In Vercel environment, we need to use Cloudflare's REST API to access D1
  if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
    return createD1RestClient();
  }

  // For local development, try to use wrangler
  if (process.env.NODE_ENV === 'development') {
    try {
      // Use local D1 database via file system (created by wrangler)
      const Database = require('better-sqlite3');
      const path = require('path');
      const dbPath = path.join(__dirname, '../../.wrangler/state/v3/d1/miniflare-D1DatabaseObject/travelling-website-db.sqlite');
      const db = new Database(dbPath);

      // Wrap to match D1 API
      return {
        prepare: (query) => ({
          bind: (...params) => ({
            all: () => {
              try {
                const stmt = db.prepare(query);
                const results = stmt.all(...params);
                return { results, success: true };
              } catch (error) {
                console.error('Query error:', error);
                return { results: [], success: false, error: error.message };
              }
            },
            first: () => {
              try {
                const stmt = db.prepare(query);
                const result = stmt.get(...params);
                return result || null;
              } catch (error) {
                console.error('Query error:', error);
                return null;
              }
            },
            run: () => {
              try {
                const stmt = db.prepare(query);
                const result = stmt.run(...params);
                return {
                  meta: {
                    last_row_id: result.lastInsertRowid,
                    changes: result.changes
                  },
                  success: true
                };
              } catch (error) {
                console.error('Query error:', error);
                return { success: false, error: error.message };
              }
            }
          })
        })
      };
    } catch (error) {
      console.error('Local D1 database connection failed:', error);
      throw new Error('Failed to connect to local D1 database');
    }
  }

  throw new Error('D1 database configuration missing');
};

// D1 REST API client for Vercel deployment
const createD1RestClient = () => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID || 'b0fd9bb8-ca9a-4ca7-a2d0-487618098a3a';
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  const baseURL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

  return {
    prepare: (query) => ({
      bind: (...params) => ({
        all: async () => {
          try {
            const response = await fetch(`${baseURL}/query`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sql: query,
                params: params
              })
            });

            if (!response.ok) {
              throw new Error(`D1 API error: ${response.statusText}`);
            }

            const data = await response.json();
            return { results: data.result[0]?.results || [], success: data.success };
          } catch (error) {
            console.error('D1 REST API error:', error);
            return { results: [], success: false, error: error.message };
          }
        },
        first: async () => {
          const result = await this.all();
          return result.results?.[0] || null;
        },
        run: async () => {
          try {
            const response = await fetch(`${baseURL}/query`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sql: query,
                params: params
              })
            });

            if (!response.ok) {
              throw new Error(`D1 API error: ${response.statusText}`);
            }

            const data = await response.json();
            return {
              meta: data.result[0]?.meta || { changes: 0, last_row_id: null },
              success: data.success
            };
          } catch (error) {
            console.error('D1 REST API error:', error);
            return { success: false, error: error.message };
          }
        }
      })
    })
  };
};

// Database helpers that work with D1
const dbHelpers = {
  // Execute a query and return results
  query: async (db, sql, params = []) => {
    try {
      const stmt = db.prepare(sql);
      const result = await stmt.bind(...params).all();
      return result.results || [];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  },

  // Insert a record
  insert: async (db, table, data) => {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map(() => '?').join(', ');
      const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

      const stmt = db.prepare(sql);
      const result = await stmt.bind(...values).run();

      return {
        success: true,
        meta: result.meta
      };
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  },

  // Update records
  update: async (db, table, data, whereClause, whereParams = []) => {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

      const stmt = db.prepare(sql);
      const result = await stmt.bind(...values, ...whereParams).run();

      return {
        success: true,
        meta: result.meta
      };
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  },

  // Delete records
  delete: async (db, table, whereClause, whereParams = []) => {
    try {
      const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
      const stmt = db.prepare(sql);
      const result = await stmt.bind(...whereParams).run();

      return {
        success: true,
        meta: result.meta
      };
    } catch (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  }
};

// Legacy functions for compatibility
const executeQuery = async (db, query, params = []) => {
  return await dbHelpers.query(db, query, params);
};

const getRecord = async (db, query, params = []) => {
  const results = await dbHelpers.query(db, query, params);
  return results.length > 0 ? results[0] : null;
};

const getRecords = async (db, query, params = []) => {
  return await dbHelpers.query(db, query, params);
};

module.exports = {
  getDB,
  dbHelpers,
  executeQuery,
  getRecord,
  getRecords,
  generateId,
  generateBookingNumber
};
