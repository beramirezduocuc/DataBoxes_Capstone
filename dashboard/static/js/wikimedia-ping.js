curl https://api.coinranking.com/v2/coins \
H x-access-token: coinrankingd36bd1d040b13258dcebca59a6ec428c217e4d0bbac4a5ae

const options = {
  headers: {
    'Content-Type': 'application/json',
    // 'x-access-token': 'your-access-token-here',
  },
};

fetch('https://api.coinranking.com/v2/coin/Qwsogvtv82FCd', options)
  .then((response) => response.json())
  .then((result) => console.log(result));