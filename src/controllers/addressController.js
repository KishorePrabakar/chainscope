const db = require('../database');

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

  // For now, just store with mock data - we'll add real analysis later
  const mockData = {
    balance: 0,
    total_transactions: 0,
    category: 'unknown',
    confidence_score: 0
  };

  const sql = `
    INSERT INTO addresses (address, chain, balance, total_transactions, category, confidence_score)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [address, chain, mockData.balance, mockData.total_transactions, mockData.category, mockData.confidence_score], function(err) {
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
      ...mockData,
      message: 'Address submitted successfully'
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

//curl -X POST http://localhost:3000/api/address -H "Content-Type: application/json" -d "{\"address\":\"0x123abc\",\"chain\":\"ethereum\"}"