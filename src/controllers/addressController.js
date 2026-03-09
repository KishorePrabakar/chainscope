const db = require('../database');
const { categorizeAddress } = require('../utils/categorizer');
const { getEthAddressData } = require('../utils/etherscan');
const { getBtcAddressData } = require('../utils/blockchain');

// POST /api/address - submit address for analysis
exports.submitAddress = async (req, res) => {
  const { address, chain } = req.body;

  if (!address || !chain) {
    return res.status(400).json({ error: 'Address and chain are required' });
  }

  if (chain !== 'ethereum' && chain !== 'bitcoin') {
    return res.status(400).json({ error: 'Chain must be ethereum or bitcoin' });
  }

  let fetchedData;
  try {
    if (chain === 'ethereum') {
      const data = await getEthAddressData(address);
      fetchedData = {
        address,
        chain,
        balance: data.balance,
        total_transactions: data.transactions.length,
        first_seen: null,
        last_seen: data.last_seen ? new Date(data.last_seen * 1000).toISOString() : null
      };
    } else {
      const data = await getBtcAddressData(address);
      fetchedData = {
        address,
        chain,
        balance: data.balance,
        total_transactions: data.total_tx_count,
        first_seen: null,
        last_seen: data.last_seen ? new Date(data.last_seen * 1000).toISOString() : null
      };
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch blockchain data: ' + err.message });
  }

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

// DELETE /api/address/:id
exports.deleteAddress = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM addresses WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Address not found' });
    }
    res.json({ message: 'Address deleted successfully' });
  });
};