//in our index.js we have componenets like price, nftaddress, tokenId, etc so we are gonna have to pass them all to NFTBox componenet
//tokens have their tokenURI which points the image URL of what the actual token looks like
// 1. we want to call that token URI    2. call the image URI to show the image
//so we will wait those two API requests to get the actual image, and we are gonna save that image as a state variable on this component here
// we are gonna work with useState to keep track of that imageURI
import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"

// Patrick just used this and not tell us how the code is making any sense
const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
    )
}
export default function NFTBox({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
}) /*our component take a props input params; we would need to input here like props.tokenId*/ {
    const { isWeb3Enabled, account } = useMoralis()

    const [imageURI, setImageURI] = useState("")
    // we are going to work with useWeb3Contract because we want to call tokenURI
    // useWeb3Contract needs some params; first we need to grab the abi of the nFT, coz we need to call tokenURI, for that abi we need to update our front-end
    // in our "nftMarketplace repo" we are going to update the script "update front end"
    const [showModal, setShowModal] = useState(false) //so that it doesnt popup right away by default
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    // calling the buyItem function on the NftMarketplace SC
    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    //lets create a function we are gonan call it updateUI, we are going to update UI and grab this tokenUI and the image URI
    async function updateUI() {
        const tokenURI = await getTokenURI() //this way we are gonna grab the tokenURI in the console,
        console.log(`The TokenURI is ${tokenURI}`)
        //the tokenURI is in IPFS, so for the users, its not suitable as not everybody have IPFS installed and all browser support IPFS
        //to get around this issue we need to convert the tokenURI to its https version by cheating a little bit:
        //using IPFS Gateway: a server that will return IPFS file from a normal URL; this will allows us to call normal Https calls
        if (tokenURI) {
            //in order to call tokenURI to get that image:
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json() //"fetch" keyword is doing the same thing as pasting the IPFS URL into the browser and getting this JSON response
            const imageURI = tokenURIResponse.image // grabbing the image tag of the tokenURI response
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
            // We could render the Image on our sever, and just call our sever.
            // For testnets & mainnet -> use moralis server hooks
            // Have the world adopt IPFS
            // Build our own IPFS gateway
        }
    }
    //to make sure that updateUI is called we are going to use, "useEffect"
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled]) // now we should be reading the tokenURI from the BC
    //we are not gonna set the imageURI because we are gonna get the imageURI from the tokenURI
    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    //1. Image is the next/image components used for rendering images
    //2. card is the tool from web3uiKit to enhance the looks of our NFT
    //3. We also want to show the owner of the NFT
    // {formattedSellerAddress}
    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: handleBuyItemSuccess,
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }
    return (
        <div>
            <div>
                {imageURI ? (
                    <div>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    )
}
