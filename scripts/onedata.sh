
for ((i=2;i<=101;i++))
do
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
     "$class": "biznet.Trader",  
     "tradeId": "TRADER'$i'",  
     "firstName": "Jenny'$i'",  
     "lastName": "Jones'$i'"  
   }' 'http://localhost:3000/api/Trader'
echo ""
done
echo "Added traders"
echo "--------------------------------"

for ((i=2;i<=101;i++))
do
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d ' { 
     "$class": "biznet.Commodity", 
     "tradingSymbol": "EMA'$i'", 
     "description": "Corn'$i'",  
     "mainExchange": "EURONEXT'$i'", 
     "quantity": 10, 
     "owner": "resource:biznet.Trader#TRADER1" 
   }' 'http://localhost:3000/api/Commodity'
echo ""
done
echo "Added Commodities"
echo "--------------------------------"