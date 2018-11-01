#!/bin/sh

cd ..
# Set the current directory as the project dir
PROJECTDIR=$(pwd) 
FABRICDIR=$PROJECTDIR/fabric-dev-servers

#Stop Fabric
cd $FABRICDIR
./stopFabric.sh
./teardownFabric.sh
kill -9 $(lsof -t -i:3000)

#Kill Docker Images and Delete
docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)

#Restart Fabric
./createPeerAdminCard.sh
./startFabric.sh

#Generate New Binary and Install
mkdir -p $PROJECTDIR/bin
cd $PROJECTDIR/bin
composer archive create -t dir -n ../

cd $PROJECTDIR
VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
echo "==============================="
echo "Version: " $VERSION
echo "==============================="

composer network install --card PeerAdmin@hlfv1 --archiveFile bin/$1@$VERSION.bna
composer network start --networkName $1 --networkVersion $VERSION --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card delete --card admin@$1
composer card import --file networkadmin.card

run docker logs -f dev-peer0.org1.example.com-$1-$VERSION 2>&1 | grep -a CustomLog

composer-rest-server -c admin@$1 -n never -a false -w true -t false &
