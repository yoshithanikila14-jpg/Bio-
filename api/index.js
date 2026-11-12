let handleRequest = null;

try {
  handleRequest = require('../server.js');
} catch (e) {
  console.error('Initial load of server.js in api/index.js error:', e);
}

module.exports = async (req, res) => {
  try {
    if (!handleRequest) {
      handleRequest = require('../server.js');
    }
    await handleRequest(req, res);
  } catch (err) {
    console.error('Vercel API error:', err);
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }
};
