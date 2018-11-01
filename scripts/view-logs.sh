cd ../

VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
  
  docker logs -f dev-peer0.org1.example.com-visy-$VERSION 2>&1 | grep -a CustomLog