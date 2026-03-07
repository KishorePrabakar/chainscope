const axios = require('axios');
require('dotenv').config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Etherscan V2 endpoint
const BASE_URL = 'https://api.etherscan.io/v2/api';

const getEthAddressData = async (address) => {
  try {

    // Fetch balance
    const balanceRes = await axios.get(BASE_URL, {
      params: {
        chainid: 1,
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest',
        apikey: ETHERSCAN_API_KEY
      }
    });

    if (balanceRes.data.status !== "1") {
      throw new Error(`Etherscan Balance Error: ${balanceRes.data.result}`);
    }

    // Fetch transactions
    const txListRes = await axios.get(BASE_URL, {
      params: {
        chainid: 1,
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: 10,
        sort: 'desc',
        apikey: ETHERSCAN_API_KEY
      }
    });

    const hasTransactions =
      txListRes.data.status === "1" &&
      Array.isArray(txListRes.data.result);

    const lastTx = hasTransactions
      ? txListRes.data.result[0]
      : null;

    return {
      balance: parseFloat(balanceRes.data.result) / 1e18,
      transactions: hasTransactions ? txListRes.data.result : [],
      last_seen: lastTx ? lastTx.timeStamp : null
    };

  } catch (error) {
    console.error("Fetcher Error:", error.message);
    throw error;
  }
};

module.exports = { getEthAddressData };