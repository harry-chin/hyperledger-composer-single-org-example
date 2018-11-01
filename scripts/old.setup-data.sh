#!/bin/bash

#
# Copyright (C) 2018 BlockBit Technology Solutions. All Rights Reserved.
#




echo ''

#Create companies
COMPANYNAMES=("Stewart_Dairylands" "Fonterra" "BLU_Logistics" "Woolworths")
INDUSTRYTYPES=("AGRICULTURE" "AGRICULTURE" "LOGISTICS" "RETAILER")
for i in {1..4}
do
var=$[i-1]
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "$class": "model.Company",
   "industryType": "'${INDUSTRYTYPES[$var]}'",
   "address": "123 Test St",
   "id": "'$i'",
   "name": "'${COMPANYNAMES[$var]}'"
 }' 'http://localhost:3000/api/Company'
 echo ''
 echo ''
 done

echo ''
echo ''
echo '#############################################'
echo ''
echo ''

#Generate Products
for i in {1..4}
do
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "$class": "model.CreateProduct",
   "product": {
     "$class": "model.Product",
     "productType": "DAIRY",
     "value": 6.99,
     "productName": "Milk",
     "productBrand": "Stewarts Dairylands",
     "id": "'$i'"
   },
   "eventData": {
     "$class": "model.EventData",
     "eventId": "PRODUCT_CREATED'$i'",
     "eventType": "PRODUCT_CREATED",
     "entity": "resource:model.Product#'$i'",
     "actor": "resource:model.Company#1",
     "summary": "Testing data",
     "location": "Manawatu, NZ"
   }
 }' 'http://localhost:3000/api/CreateProduct'
 echo ''
 echo ''
done

echo ''
echo ''
echo '#############################################'
echo ''
echo ''

for i in {1..2}
do
#Create Containers
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "$class": "model.CreateContainer",
  "container": {
    "$class": "model.Container",
    "containerType": "CARTON",
    "packagingMaterialType": "CARDBOARD",
    "id": "'$i'"
  },
  "eventData": {
    "$class": "model.EventData",
    "eventId": "CreatedContainerEvent'$i'",
    "eventType": "CONTAINER_CREATED",
    "entity": "resource:model.Container#'$i'",
    "actor": "resource:model.Actor#2",
    "summary": "string",
    "location": "string"
  }
}' 'http://localhost:3000/api/CreateContainer'
echo ''
echo ''
done

echo ''
echo ''
echo '#############################################'
echo ''
echo ''

#Fill Containers
for i in {1..2}
do
c1=$[i*2-1]
c2=$[i*2]
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
   "$class": "model.AddItems",
   "items": [
     "resource:model.Product#'$c1'","resource:model.Product#'$c2'"
   ],
   "container": "resource:model.Container#'$i'",
   "eventData": {
     "$class": "model.EventData",
     "eventId": "FilledContainer'$i'",
     "eventType": "ADD_ITEMS_TO_CONTAINER",
     "entity": "resource:model.Container#'$i'",
     "actor": "resource:model.Actor#2",
     "summary": "string",
     "location": "string"
   }
 }' 'http://localhost:3000/api/AddItems'
 echo ''
 echo ''
 done