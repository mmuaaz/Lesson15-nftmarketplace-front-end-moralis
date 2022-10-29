import Image from "next/image"
import styles from "../styles/Home.module.css"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "../components/NFTBox"

export default function Home() {
    ;/ ============OBJECTIVES/
    // copied from README.md
    //   i. Show Recently Listed NFTs
    //the SC suggest the listed NFT are mapped to all addresses on the planet but we cant loop through all of the addresses
    // ======-We can create an array
    // we cant create array for everything i.e., if we want to gather all the NFTs a user owns or if the array becomes very GAS expensive
    // this item listed event is stored in a data structure that is on chain but just SC can access it however guess what cant access it, off-chain
    // services can access these events;  so what we do in this case, is we will index the events off-chain and then read from our database
    // setup a server to listen for those events to be fired and we will add them to a database to query
    // every single time an item is listed we are going to index it in a database for ourself, and then we are going to call
    // our centalized database to start and we're gonna call database to do that, is it not centralized????
    // Refer to notes for indexing to a server

    // we will read from a database that has all the mapping in an easier to read data structure/

    // fetching data from ActiveItem table of our database in MOralis server
    const { isWeb3Enabled } = useMoralis()
    const {
        data: listedNfts /**renaming "data" */,
        isFetching: fetchingListedNfts /**renaming "data" */,
    } = useMoralisQuery(
        //takes two params; 1.TableName, 2.Function for the query
        "ActiveItem",
        (query) => query.limit(10).descending("tokenId") //if we want to do different pages we can add ".skip(page)"
    ) // ok so we saying here that grab the data of and save it to "listedNfts", grab first 10 in descending order
    console.log(listedNfts)
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 text-blue-400 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.map((nft) => {
                            /*".map" loops through and runs some function on all listedNFTs*/
                            console.log(nft.attributes) // so its running an anonymous function, that takes an nft as an inpurt pararm
                            const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                                nft.attributes // extracting 4 things from nft.attributes

                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
