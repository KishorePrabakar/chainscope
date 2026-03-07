const { getEthAddressData } = require('../utils/etherscan');
const { getBtcAddressData } = require('../utils/blockchain');

const analyzeLive = async (req, res) => {
  const { address } = req.params;
  
  try {
    let data;
    
    // Detect chain based on address format
    if (address.startsWith('0x') && address.length === 42) {
      // Ethereum address
      const ethData = await getEthAddressData(address);
      data = {
        address: address,
        chain: 'ethereum',
        balance: ethData.balance,
        total_transactions: ethData.transactions.length,
        last_seen: ethData.last_seen,
        raw_data: JSON.stringify(ethData)
      };
    } 
    else if (address.length >= 26 && address.length <= 35) {
      // Bitcoin address
      const btcData = await getBtcAddressData(address);
      data = {
        address: address,
        chain: 'bitcoin',
        balance: btcData.balance,
        total_transactions: btcData.total_tx_count,
        last_seen: btcData.last_seen,
        raw_data: JSON.stringify(btcData)
      };
    }
    else {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid address format. Must be Ethereum (0x...) or Bitcoin address.' 
      });
    }
    
    res.json({
      success: true,
      data: data,
      message: 'Live analysis completed (not stored in database)'
    });
    
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

module.exports = { analyzeLive };