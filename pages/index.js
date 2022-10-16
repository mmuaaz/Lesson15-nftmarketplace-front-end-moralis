import Image from "next/image"
import styles from "../styles/Home.module.css"

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
    ;/ we will read from a database that has all the mapping in an easier to read data structure/
    return <div className={styles.container}>WHATTTT</div>
}
