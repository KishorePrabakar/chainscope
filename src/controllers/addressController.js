const db = require('../database');
const { categorizeAddress } = require('../utils/categorizer');

// POST /api/address - submit address for analysis
exports.submitAddress = (req, res) => {
  const { address, chain } = req.body;

  // Validation
  if (!address || !chain) {
    return res.status(400).json({ error: 'Address and chain are required' });
  }

  if (chain !== 'ethereum' && chain !== 'bitcoin') {
    return res.status(400).json({ error: 'Chain must be ethereum or bitcoin' });
  }

  // TODO: Call partner's API fetcher here to get real data
  // For now, mock data
  const fetchedData = {
    address,
    chain,
    balance: 1500, // Mock: this would come from Etherscan/Blockchain.info
    total_transactions: 250,
    first_seen: '2020-01-15',
    last_seen: '2024-02-20'
  };

  // Categorize using your rules engine
  const analysis = categorizeAddress(fetchedData);

  const sql = `
    INSERT INTO addresses (address, chain, balance, total_transactions, first_seen, last_seen, category, confidence_score, raw_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const rawData = JSON.stringify(fetchedData);

  db.run(sql, [
    address,
    chain,
    fetchedData.balance,
    fetchedData.total_transactions,
    fetchedData.first_seen,
    fetchedData.last_seen,
    analysis.category,
    analysis.confidence_score,
    rawData
  ], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Address already exists' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      address,
      chain,
      category: analysis.category,
      confidence_score: analysis.confidence_score,
      reasons: analysis.reasons,
      balance: fetchedData.balance,
      total_transactions: fetchedData.total_transactions,
      message: 'Address analyzed and stored successfully'
    });
  });
};

// GET /api/addresses - list all with filters
exports.listAddresses = (req, res) => {
  const { category, chain } = req.query;

  let sql = 'SELECT * FROM addresses WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (chain) {
    sql += ' AND chain = ?';
    params.push(chain);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ count: rows.length, addresses: rows });
  });
};

// GET /api/address/:id - get one address
exports.getAddress = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM addresses WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json(row);
  });
};