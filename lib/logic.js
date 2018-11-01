/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {itrazo.TradeCommodity} trade
 * @transaction
 */
async function tradeCommodity(trade) {
    trade.commodity.owner = trade.newOwner;
    let assetRegistry = await getAssetRegistry('itrazo.Commodity');

    // emit a notification that a trade has occurred
    let tradeNotification = getFactory().newEvent('itrazo', 'TradeNotification');
    tradeNotification.commodity = trade.commodity;
    emit(tradeNotification);

    // persist the state of the commodity
    await assetRegistry.update(trade.commodity);
}

/**
 * Remove all high volume commodities
 * @param {itrazo.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction
 */

async function removeHighQuantityCommodities(remove) {
     let assetRegistry = await getAssetRegistry('itrazo.Commodity');
     let results = await query('selectCommoditiesWithHighQuantity');

     for (let n = 0; n < results.length; n++) {
         let commodity = results[n];

         // emit a notification that a trade was removed
         let removeNotification = getFactory().newEvent('itrazo', 'RemoveNotification');
         removeNotification.commodity = commodity;
         emit(removeNotification);

         await assetRegistry.remove(commodity);
     }
 }
