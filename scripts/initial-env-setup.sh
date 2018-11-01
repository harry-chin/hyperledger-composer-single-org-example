#Fabric Dev Servers
mkdir -a ~/fabric-dev-servers
cd ~/fabric-dev-servers
curl -O "https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz"
tar -xvf fabric-dev-servers.tar.gz
cd ~/fabric-tools
sudo ./downloadFabric.sh
#Composer PreReqs
curl -O "https://hyperledger.github.io/composer/latest/prereqs-ubuntu.sh"
chmod u+x prereqs-ubuntu.sh
sudo ./prereqs-ubuntu.sh
#Install composer
sudo npm install -g composer-cli
sudo npm install -g composer-rest-server
sudo npm install -g generator-hyperledger-composer
sudo npm install -g yo
sudo npm install -g composer-playground