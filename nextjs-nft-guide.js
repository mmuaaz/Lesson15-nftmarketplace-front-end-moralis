;/=========FRONT_END/
// Difference between moralis "front-end" and "The-Graph Indexer" is that in moralis front-end sections, we are gonna use a moralis server while in The graph section we wont;
// MORALIS servers are centralized while THE GRAPH servers are decentralized

// but we will use moralis package in both of the sections
// RUN COMM: yarn run dev                                  | always used to check and run the web page on the local host
;/================================Writing Code for Moralis NextJS code for Front-end/
// RUN COMM: yarn create next-app .
// the above commands takes some time to gather all the packages
// delete estlint
;/_app.js is the starting point and the mother of all the front-end project as usual/
;/1/ // creating "components" folder> header.js
;/------------Adding the "Connet" button/
// we are not gonna create a manual header like we did last time, as it was for practice and it was a hard way for we are gonna implement that "web3iuikit" again
// RUN COMM: yarn add web3uikit moralis react-moralis
;/++++++ RUN COMM: yarn add moralis-v1/ // this command is to go back to a previous version of moralis because newer version is giving error
;/========= Tailwind======/ // usually we do that styling the last but here we had done this early
// use commands shown at https://tailwindcss.com/docs/guides/nextjs
// RUNNING COMM: yarn add --dev tailwindcss postcss autoprefixer
// RUN COMM: yarn tailwindcss init -p
//  after installing these dependencies we should be seeing some new files added to the project
//  grab "tailwind-config.js" from the website above where the code is posted, just copy the file and paste it in this project
//  grab "globals.css" code from the website
;/tailwind/ // once tailwind is configured; we can use some tailwind styling
;/CHANGING index.js/ // index.js needs to have some code thats specific to what we wanna achieve from this project; so we have moved <head> tag code to app.js for that purpose
;/-----------Getting Listing for our Marketplace website / // we have faced a problem regarding this; refer to notes in index.js for this
// we dont want to change our SC code just for this front-end website
// this item listed event is stored in a data structure that is on chain but just SC can access it however guess what cant access it, off-chain services can access these events
//  so what we do in this case, is we will index the events off-chain and then read from our database
// setup a server to listen for those events to be fired and we will add them to a database to query
;/=====The GRAPH/
// its a protocol that indexes events off chain and sticks them into the GRAPH PROTOCOL, it does this in a decentralized manner
;/ MORALIS does this in a centralized manner/
// MOralis is what we are gonna use for speed and a lot of functionality that comes with it for our local developments; MOralis does a lot of things
;/==============MORALIS/
// Moralis is a managed back-end for crypto which you can connect your front-end; You can connect it to nodeJS
//  what we have been using is the Moralis Packages and tools, however, it also comes optionally with a server back end to give your web3 apps more functionality
;/MORALIS INTRO IN DEPTS/ //@25:12:35
// MOralis provides a single workflow; If you have a single workflow for doing things and in web3 it really means you to have a on chain SC,but at the same time you need to
// connect it to your back-end, as if something happens on-chain, you need to monitor that, you can create web-hooks, push notifications, run custom code, run calculations,
// save something on the database; then when you are connected to your back-end and you have everything that you wanna do to know whats going with your SC on chain, you need to
// change the UI in your front-end, when something happens on-chain
;/1. Moralis Identity/ // Login users across diff chains and wallets with one line of code. It helps you manage cross-chain identities and user sessions
// Moralis allows us to have web sessions and User profile with which your users have connected, these identities are manageable; a user profile can have many diff wallets across
// diff wallets connected to it; all the real-time txs are synced from that user; Moralis allows the user to establish a secure web session between a front-end(can be anything like
//  a game or website), MOralis also provide web session management; in case like you have your own back-end and you have moralis session identity management > you can invalidate
// websessions , you can log-in users and all of this with one line of code
;/2. Moralis Real-Time/ // you can run custom code when a user does a tx, and do a web hook or email or push notification when some user interacts with a SC, or a SC emits an "event"
;/3. Moralis SDKs/ // whether you're building a website, or a game; an extensive SDK setup is available that allows us to connect to Moralis
;/4. Moralis APIs/
;/=====================================================MORALIS DOCS FOR EVENTS/ //https://v1docs.moralis.io/moralis-dapp/automatic-transaction-sync/smart-contract-events
;/Why do we need to sync and watch smart contract events?/
// in the git repo of Moralis React-moralis/useweb3contract you can see the "_app.js" code at the top  where in the <MoralisProvider> it needs appId and serverURL to connect to the server that we have created in MORALIS
// this way it can connect to our local hardhat node and listen for events  like "Itemlisted"
;/Moralis server/ //https://nextjs.org/docs/basic-features/environment-variables
// when you create a server in Moralis website you wanna change the "initializedOnMount" to add "appId" and "serverURL"
// add these details as the environement Variable in ".env" file while NextJS comes with built-in support for these environment variables
;/in order for our files to look for and read for environment variables / //we need to prefix those variables with "NEXT_PUBLIC_" , our "_app.js" file will look for these variable
// and stick them in the "_app.js" file
;/==============Connecting back-end to Server/
// Go to directory Lesson15-NftMarketPlace then RUN COMM: yarn hardhat node         |  if you are in the correct directory, then 2 SC, "NftMarketplace" and "BasicNft" should run with the local node
// go to your server app in moralis > servers > (tab) Networks > Eth LocalDevChain > Settings > Devchain Proxy Server
// This "Dev Chain Proxy Server" is how we are gonna tell moralis to listen for the events on our local node
;/FRP/
// frp is a small network utility that allows us feed data from the local machine into a remote server
;/Downloading FRP/ //https://v1docs.moralis.io/moralis-dapp/web3/setting-up-ganache
;/Guide to run the commands correctly/
//Step 1: Download the windows frp version titled "[frp_0.44.0_windows_amd64.zip]"
// Step 2: Replace the frpc.ini contents with the ones provided by your moralis server
// Step 3: Now, cd into the frp directory
// cd frp
// before executing the actual file we have to provide it permissions to since you might be seeing
// frpc permission denied
// so to do that, we can write
// chmod +x frpc.exe
// Finally, once the execution permission is provided, we can run the file by typing
// ./frpc.exe -c frpc.ini
;/MOralis CLI/
// RUN COMM:yarn global add moralis-admin-cli
//  RUN COMM: moralis-admin-cli
// we are gonna run this moralis admin cli version of this FRC -c command:
// https://v1docs.moralis.io/moralis-dapp/tools/moralis-admin-cli
// THe ".env" file method is given in the above website
//  also we created a script in the "package.json" for "moralis:sync" which is not working at the moment
;/How do we tell our Moralis Server to listen for Events/
// We do it by using two ways:      1. UI       2. Using scripts to auto listen for the events
;/We choose to do this programmatically/
//creating file: "addEvent.js"
;/using SDKs to connect with NodeJS/ //https://v1docs.moralis.io/moralis-dapp/connect-the-sdk
// Connecting with NodeJSl since we are gonna run a little Moralis script,
;/Listening for the events/ // following the docs section of Moralis located at https://v1docs.moralis.io/moralis-dapp/connect-the-sdk/connect-using-node#add-new-event-sync-from-code
;/Reset Local Chain/ // this option is located in the network tab of the Moralis UI for situation like you have killed your hardhat node and then restarted it, the server will stop
// listening for the events now, as it is assuming the last chain is still running; in that case you have to press "reset local chain" to get back to listening events
//if in the mean time that you had killed the node and then there were some events then chances are the Moralis server wont listen for those events and you might lose those events
;/What if someone Buys an NFT, the event itemListed will still be in our server/ //we can get around this problem by choosing one of the two ways:
// introducing
;/Moralis Cloud Functions/ //https://v1docs.moralis.io/moralis-dapp/cloud-code/cloud-functions
// allow us to add anything we want to do from our MOralis server; These are function/scripts run on the server, whenever we want them to
