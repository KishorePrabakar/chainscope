const { getEthAddressData } = require('./src/utils/etherscan');

const testAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';

getEthAddressData(testAddress)
    .then(data => {
        console.log('--- Test Results ---');
        console.log(`Balance: ${data.balance} ETH`);
        console.log(`Last Activity: ${new Date(data.last_seen * 1000).toLocaleString()}`);
    })
    .catch(err => console.error(err));