// You dont need to import "moralis" here because this code will be synced to the server and there, the moralis is auto imported
// we can do many things with "afterSave"------=>it means anytime something gets saved on a table that we specify to do something

Moralis.Cloud.afterSave("ItemListed", async (request) => {
    // "afterSave" keyword means that anytime something gets saved on a table that we specify, we'll do something; so this function is > anytime an item is listed we want to add it to our Active Item list
    // request comes with this flag called "confirmed"
    //"request as a parameter to async function just supplied to it here because anytime an itemListed event is being called a request is made"

    ;/every request is triggered twice: once it triggers a save, once again on confirmed/
    // an item is listed a request for save is triggered; then it is confirmed
    // we only want to update ACTIVE ITEM when the tx is actually confirmed

    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger() // we can actually write logs in the Moralis server database
    logger.info("Looking for confirmed TX...")
    // so we only want to count this item listed event; interactive items in our ACTIVE ITEMS list when "confirmed is true"
    // we should update our scripts to add one block confirmations on top of our local Hardhat BC so that these can be changed to confirmed
    if (confirmed) {
        logger.info("Found item!")
        const ActiveItem = Moralis.Object.extend("ActiveItem") //so We are creating an Active Item table if it doesnt exist; if it does then we grab it
        // all of these request with events come with an address

        // In case of listing update, search for already listed ActiveItem and delete
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("seller", request.object.get("seller"))
        logger.info(`Marketplace | Query: ${query}`)
        const alreadyListedItem = await query.first()
        console.log(`alreadyListedItem ${JSON.stringify(alreadyListedItem)}`)
        if (alreadyListedItem) {
            logger.info(`Deleting already listed Item${request.object.get("objectid")}`)
            await alreadyListedItem.destroy()
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get("address")} since the listing is being updated. `
            )
        }
        // Add new ActiveItem
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address")) // so we are creating a column in the ActiveItem table
        //all of these requests from events come with the address which for us is going to be the marketplace address
        activeItem.set("nftAddress", request.object.get("nftAddress")) //adding a column for nftAddress, all these events which are listing here comes
        //with all the parameters so we are asking for the nftAddress
        activeItem.set("price", request.object.get("price"))
        activeItem.set("tokenId", request.object.get("tokenId"))
        activeItem.set("seller", request.object.get("seller"))
        logger.info(
            `Adding Address: ${request.object.get("address")} TokenId: ${request.object.get(
                "tokenId"
            )}`
        )
        logger.info("Saving...")
        await activeItem.save()
        //Now we have a cloud function thats going to create a new entry in a new table called Active Item anytime item listed happens So after item
        //is called the trigger for our cloud function and there are a whole bunch of different triggers for different moralis cloud functions can be found in moralis docs
    }
})
// Deleting entry from ActiveItems when an NFT is bought
Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem) //query is used here to find the ActiveItem listing for the canceled item
        query.equalTo("marketplaceAddress", request.object.get("address")) //we are looking for the marketplace address that is same as the itemCanceled
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId")) // itemCanceled event in the SC of NftMarketplace returns 3 things, we just dont need seller address
        logger.info(`Marketplace | Query: ${query}`)
        // we are going to find the first active item in the database that has the same marketplace address, NFT address, and tokenId that just got cancelled
        const canceledItem = await query.first() // We are going to find the first active item in the database that has the same marketplace address, tokenId,and nft address
        //that got cancelled
        logger.info(`Marketplace | CanceledItem: ${/*JSON.stringify*/ canceledItem}`)
        if (canceledItem) {
            logger.info(
                `Deleting ${request.object.get("tokenId")} at address ${request.object.get(
                    "address"
                )}since it was canceled`
            )
            await canceledItem.destroy() //removing the cancelled item
            // logger.info(
            //     `Deleted item with tokenId ${request.object.get(
            //         "tokenId"
            //     )} at address ${request.object.get("address")} since it was canceled. `
            // )
        } else {
            logger.info(
                `No item canceled with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found.`
            )
        }
    }
})
// Deleting entry from ActiveItems when an NFT is bought
Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    logger.info(`Marketplace | Object: ${request.object}`)
    if (confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem")
        const query = new Moralis.Query(ActiveItem)
        query.equalTo("marketplaceAddress", request.object.get("address"))
        query.equalTo("nftAddress", request.object.get("nftAddress"))
        query.equalTo("tokenId", request.object.get("tokenId"))
        // Once again we dont need the buyer address
        logger.info(`Marketplace | Query: ${query}`)
        const boughtItem = await query.first()
        // logger.info(`Marketplace | boughtItem: ${JSON.stringify(boughtItem)}`)
        if (boughtItem) {
            logger.info(`Deleting boughtItem ${request.object.get("objectId")}`)
            await boughtItem.destroy() // deleting bought item
            logger.info(
                `Deleted item with tokenId ${request.object.get(
                    "tokenId"
                )} at address ${request.object.get(
                    "address"
                )} from ActiveItem table since it was bought.`
            )
        } else {
            logger.info(
                `No item bought with address: ${request.object.get(
                    "address"
                )} and tokenId: ${request.object.get("tokenId")} found`
            )
        }
    }
})
