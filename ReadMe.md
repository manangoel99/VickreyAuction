Vickrey Auction with a Bidding Ring
==============

To run this, you will need nodejs 10.x instructions for which are 
```
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Set up
-----------

```
sudo npm install -g truffle
```

Running
-----------

Open the truffle console using
```
truffle develop
```

To Compile and Run Migrations
```
truffle compile
truffle migrate --reset
```

To run tests
```
truffle test
```