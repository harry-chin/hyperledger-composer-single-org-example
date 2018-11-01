node setup-data.js

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "$class": "model.CreateStorage",
   "component": {
     "$class": "model.CAStorage",
     "id": "Test",
     "items": [],
     "owner": "resource:model.Company#9-mile"
   },
   "eventData": {
     "location": "Aus",
     "id": "Test"
   }
 }' 'http://localhost:3000/api/CreateStorage'

echo ''
echo ''
echo ''

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "$class": "model.StoreItems",
   "items": [
     "resource:model.Container#container-1",
     "resource:model.Container#container-2"
   ],
   "caStorage": "resource:model.CAStorage#Test",
   "eventData": {
     "location": "Aus",
     "id": "Test1"
   }
 }' 'http://localhost:3000/api/StoreItems'

echo ''
echo ''
echo ''

 curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "$class": "model.UnstoreItems",
   "items": [
     "resource:model.Container#container-1",
     "resource:model.Container#container-2"
   ],
   "caStorage": "resource:model.CAStorage#Test",
   "eventData": {
     "$class": "model.EventData",
     "location": "Aus",
     "id": "Test2"
   }
 }' 'http://localhost:3000/api/UnstoreItems'

echo ''
echo ''
echo ''

./view-logs.sh &

