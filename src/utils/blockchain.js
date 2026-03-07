const axios = require('axios');

const getBtcAddressData = async (address) => {
  try {
    const BASE_URL = 'https://blockchain.info';
    
    // Fetch address data
    const response = await axios.get(`${BASE_URL}/rawaddr/${address}`, {
      params: { limit: 10 }
    });
    
    const data = response.data;
    
    return {
      balance: data.final_balance / 1e8, // Satoshi to BTC
      transactions: data.txs || [],
      total_tx_count: data.n_tx,
      last_seen: data.txs && data.txs.length > 0 
        ? data.txs[0].time 
        : null
    };
    
  } catch (error) {
    console.error("Bitcoin Fetcher Error:", error.message);
    throw error;
  }
};

module.exports = { getBtcAddressData };