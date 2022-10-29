;/ConnectButton/
// use import first
// implementing ConnectButton in the export is done like this <ConnectButton/>
;/----Adding a nav bar/
// Nav Tag defines as a NAV bar: similar to a div, its just another tag
;/---Links/ // we can actually make links in NEXT JS using "NEXT JS LINK" tag <next/link>
// Link allows us to connect to different links or URLs in our application:
// it requires importing
// Lets say we want to go back to homepage we used 2 tags:
//   1/ Link tag
//   2/ <a> tag makes some named variable clickable
//NOw we can easily click this "NFT Marketplace" and return back to homepage of NFT Marketplace
;/Tailwind styling/ // added styling to create a Heading> h1
// edited the tag "nav" with some styling and creating a border, positioning the items to the other side
// edited <div> tag to adjust the position of the titles
// edited <a> tag to add spacing between the two titles
// edited the ConnectButton tag in the end to add "moralisAuth" turning this into false to that it doesnt try to connect to a moralis database
import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-centre">
            <h1 className="bg-blue-400 text-white py-4 px-10 font-bold text-3xl rounded m1-auto">
                NFT Marketplace
            </h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6 text-blue-500 font-bold text-2xl">Home</a>
                </Link>

                <Link href="/sell-nft">
                    <a className="mr-4 p-6 text-blue-500 font-bold text-2xl">Sell NFT</a>
                </Link>

                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
