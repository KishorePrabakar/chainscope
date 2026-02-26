// Known exchange addresses (hardcoded for now)
const KNOWN_EXCHANGES = {
  ethereum: [
    '0xf977814e90da44bfa03b6295a0616a897441acec', // Binance
    '0x28c6c06298d514db089934071355e5743bf21d60', // Binance 2
    '0x21a31ee1afc51d94c2efccaa2092ad1028285549', // Binance 3
    '0x46340b20830761efd32832a74d7169b29feb9758', // Coinbase
    '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'  // Binance 4
  ],
  bitcoin: [
    '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',  // Binance
    '3Cbq7aT1tY8kMxWLbitaG7yT6bPbKChq64', // Coinbase
    'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97' // Binance
  ]
};

// Categorize an address based on its data
function categorize(addressData) {
  const { address, chain, balance, total_transactions, last_seen } = addressData;
  
  // Rule 1: Check if it's a known exchange
  if (KNOWN_EXCHANGES[chain] && KNOWN_EXCHANGES[chain].includes(address.toLowerCase())) {
    return {
      category: 'exchange',
      confidence_score: 1.0,
      reason: 'Matches known exchange address'
    };
  }

  // Rule 2: Check if whale (high balance)
  const whaleThreshold = chain === 'ethereum' ? 1000 : 100;
  if (balance >= whaleThreshold) {
    return {
      category: 'whale',
      confidence_score: 0.95,
      reason: `Balance exceeds ${whaleThreshold} ${chain === 'ethereum' ? 'ETH' : 'BTC'}`
    };
  }

  // Rule 3: Check if dormant (no activity in 2+ years)
  if (last_seen) {
    const lastSeenDate = new Date(last_seen);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    
    if (lastSeenDate < twoYearsAgo) {
      return {
        category: 'dormant',
        confidence_score: 0.9,
        reason: 'No activity in over 2 years'
      };
    }
  }

  // Rule 4: Check activity level
  if (total_transactions > 100) {
    return {
      category: 'active',
      confidence_score: 0.7,
      reason: 'High transaction count indicates active use'
    };
  }

  if (total_transactions > 0 && total_transactions <= 10) {
    return {
      category: 'low_activity',
      confidence_score: 0.6,
      reason: 'Very few transactions'
    };
  }

  // Default: unknown
  return {
    category: 'unknown',
    confidence_score: 0.3,
    reason: 'Insufficient data for categorization'
  };
}

module.exports = { categorize, KNOWN_EXCHANGES };