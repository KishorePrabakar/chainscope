require('dotenv').config();
const { getEthereumData } = require('./src/utils/etherscan');

getEthereumData('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')
  .then(data => console.log("Success:", data))
  .catch(error => console.error("Error:", error.message));