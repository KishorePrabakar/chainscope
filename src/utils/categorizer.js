const KNOWN_EXCHANGES = {
  ethereum: [
    '0xf977814e90da44bfa03b6295a0616a897441acec',
    '0x28c6c06298d514db089934071355e5743bf21d60',
    '0x21a31ee1afc51d94c2efccaa2092ad1028285549',
    '0x46340b20830761efd32832a74d7169b29feb9758',
    '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'
  ],
  bitcoin: [
    '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
    '3Cbq7aT1tY8kMxWLbitaG7yT6bPbKChq64',
    'bc1qgdjqv0av3q56jvd82tkdjpy7gdp9ut8tlqmgrpmv24sq90ecnvqqjwvw97'
  ]
};

function categorizeAddress(addressData) {
  const { address, chain, balance, total_transactions, last_seen } = addressData;

  const normalizedAddress = chain === 'ethereum' ? address.toLowerCase() : address;
  if (KNOWN_EXCHANGES[chain] && KNOWN_EXCHANGES[chain].includes(normalizedAddress)) {
    return { category: 'exchange', confidence_score: 1.0, reasons: ['Matches known exchange address'] };
  }

  const whaleThreshold = chain === 'ethereum' ? 1000 : 100;
  if (balance >= whaleThreshold) {
    return { category: 'whale', confidence_score: 0.95, reasons: [`Balance exceeds ${whaleThreshold} ${chain === 'ethereum' ? 'ETH' : 'BTC'}`] };
  }

  if (last_seen) {
    const lastSeenDate = new Date(last_seen);
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    if (lastSeenDate < twoYearsAgo) {
      return { category: 'dormant', confidence_score: 0.9, reasons: ['No activity in over 2 years'] };
    }
  }

  if (total_transactions > 1000) {
    return { category: 'suspicious', confidence_score: 0.6, reasons: ['Unusually high transaction count'] };
  }

  if (total_transactions > 0) {
    return { category: 'clean', confidence_score: 0.7, reasons: ['Regular activity, no red flags'] };
  }

  return { category: 'unknown', confidence_score: 0.3, reasons: ['Insufficient data'] };
}

module.exports = { categorizeAddress, KNOWN_EXCHANGES };