curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
     "$class": "itrazo.Trader",  
     "tradeId": "TRADER1",  
     "firstName": "Jenny",  
     "lastName": "Jones"  
   }' 'http://localhost:3000/api/Trader'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '  {  
     "$class": "itrazo.Trader",  
     "tradeId": "TRADER2", 
     "firstName": "Jack", 
     "lastName": "Sock" 
   }' 'http://localhost:3000/api/Trader'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d ' { 
     "$class": "itrazo.Trader", 
     "tradeId": "TRADER3", 
     "firstName": "Rainer",  
     "lastName": "Valens"  
   }' 'http://localhost:3000/api/Trader'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d ' { 
     "$class": "itrazo.Commodity", 
     "tradingSymbol": "EMA", 
     "description": "Corn",  
     "mainExchange": "EURONEXT", 
     "quantity": 10, 
     "owner": "resource:itrazo.Trader#TRADER1" 
   }' 'http://localhost:3000/api/Commodity'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '  { 
     "$class": "itrazo.Commodity", 
     "tradingSymbol": "CC", 
     "description": "Cocoa",  
     "mainExchange": "ICE", 
     "quantity": 80, 
     "owner": "resource:itrazo.Trader#TRADER2" 
   }' 'http://localhost:3000/api/Commodity'

