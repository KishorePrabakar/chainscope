const axios = require('axios');

async function getEthereumData(address) {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const baseUrl = 'https://api.etherscan.io/api';

  try {
    // Get balance
    const balanceResponse = await axios.get(baseUrl, {
      params: {
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
        apikey: apiKey
      }
    });

    // Get transaction count
    const txResponse = await axios.get(baseUrl, {
      params: {
        module: 'proxy',
        action: 'eth_getTransactionCount',
        address,
        tag: 'latest',
        apikey: apiKey
      }
    });

    const balance = parseFloat(balanceResponse.data.result) / 1e18;
    const txCount = parseInt(txResponse.data.result, 16);

    return {
      address,
      chain: 'ethereum',
      balance,
      total_transactions: txCount
    };

  } catch (error) {
    console.error("Etherscan API error:", error.message);
    throw error;
  }
}

module.exports = { getEthereumData };