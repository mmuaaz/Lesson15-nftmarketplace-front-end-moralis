//initializedOnMount=false means we are not using moralis server
// Header import is done from the script Header.js that we wrote
// Header is implemented in this project like this <Header/>
;/placed <head> tag code/ // so we placed a <head> tag syntax from index.js to here so that it doesnt matter what page we are on the head stays the same
//now we can see we are going to NFT Marketplace no matter what page we are on because we are defining it on the "app" level
;/Moralis server/ // when you create a server in Moralis website you wanna change the "initializedOnMount" to add "appId" and "serverURL"
// add these details as the environement Variable in ".env" file while NextJS comes with built-in support for these environment variables
import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
const APP_ID = process.env.NEXT_PUBLIC_APP_ID
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

console.log(`Look here!! ${process.env.NEXT_PUBLIC_SERVER_URL}`)

function MyApp({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Nft Marketplace by "MMuaaz"</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}

export default MyApp
