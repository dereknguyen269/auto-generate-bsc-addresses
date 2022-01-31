const { crypto } = require("@binance-chain/javascript-sdk")
const Web3 = require('web3');
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
const fs = require('fs');

function generateAddresses(maxQuantity = 1, res) {
  var i = 1
  var text = 'STT,Address\n'
  var backup = 'address,private_key\n'
  while (i <= maxQuantity) {
    var entropy = crypto.generatePrivateKey()
    // console.log('entropy', entropy)
    var result = web3.eth.accounts.create([entropy]);
    // console.log(result)
    var address = result['address']
    var privateKey = result['privateKey']
    text += i + ',' + address + '\n'
    backup += address + ',' + privateKey + '\n'
    i++
  }

  // fs.writeFile('addresses.csv', text, err => {
  //   if (err) {
  //     console.error(err)
  //     return
  //   }
  // })
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)]
  var tmpFilePath = 'tmp/' + randomCharacter + '_' + Date.now() + '.csv'
  fs.writeFile(tmpFilePath, backup, err => {
    if (err) {
      console.error(err)
      return
    } else {
      var file = __dirname + '/' + tmpFilePath
      res.download(file); // Set disposition and send it.
      // Remove tmp file after 5 seconds
      setTimeout(function(){
        fs.rmSync(file, {
          force: true,
        }); 
     }, 5000);//wait 5 seconds
    }
  })
  return tmpFilePath
}

const express = require('express')
const app = express()
const PORT = process.env.PORT || 5001;
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'pug')

app.get('/', function (req, res) {
  res.render('index', { title: 'Auto generate BSC Addresses Tool' })
})

app.post('/', function (req, res) {
  var quantity = parseInt(req.body.quantity)
  generateAddresses(quantity, res)
})

app.listen(PORT, () => {
  console.log(`App runing...${PORT}`)
})
