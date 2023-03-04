import {
    useContract,
    useNetwork,
    useNetworkMismatch,
} from "@thirdweb-dev/react";
import {
    AuctionListing,
    ChainId,
    ListingType,
    NATIVE_TOKENS,
} from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { NextPage } from "next";

const ListingPage: NextPage = () => {
    // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
    const router = useRouter();

    // De-construct listingId out of the router.query.
    // This means that if the user visits /listing/0 then the listingId will be 0.
    // If the user visits /listing/1 then the listingId will be 1.
    // We do some weird TypeScript casting, because Next.JS thinks listingId can be an array for some reason.
    const { listingId } = router.query as { listingId: string };

    // Loading flag for the UI, so we can show a loading state while we wait for the data to load.
    const [loadingListing, setLoadingListing] = useState(true);

// Store the bid amount the user entered into the bidding textbox
    const [bidAmount, setBidAmount] = useState("");

// Storing this listing in a state variable so we can use it in the UI once it's fetched.
    const [listing, setListing] = useState();

// Initialize the marketplace contract
    const { contract } = useContract("0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6", "marketplace")

    const networkMismatch = useNetworkMismatch();
    const [, switchNetwork] = useNetwork();

    async function createBidOrOffer() {
        try {
            // Ensure user is on the correct network
            if (networkMismatch) {
                switchNetwork && switchNetwork(4);
                return;
            }

            // If the listing type is a direct listing, then we can create an offer.
            if (listing?.type === ListingType.Direct) {
                await contract?.direct.makeOffer(
                    listingId, // The listingId of the listing we want to make an offer for
                    1, // Quantity = 1
                    NATIVE_TOKENS[ChainId.Goerli].wrapped.address, // Wrapped Ether address on Goerli
                    bidAmount, // The offer amount the user entered
                );
            }

            // If the listing type is an auction listing, then we can create a bid.
            if (listing?.type === ListingType.Auction) {
                await contract?.auction.makeBid(listingId, bidAmount);
            }

            alert(
                `${
                    listing?.type === ListingType.Auction ? "Bid" : "Offer"
                } created successfully!`,
            );
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    async function buyNft() {
        try {
            // Ensure user is on the correct network
            if (networkMismatch) {
                switchNetwork && switchNetwork(4);
                return;
            }

            // Simple one-liner for buying the NFT
            await contract?.buyoutListing(listingId, 1);
            alert("NFT bought successfully!");
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }


// When the component mounts, ask the marketplace for the listing with the given listingId
// Using the listingid from the URL (via router.query)
    useEffect(() => {
        if (!listingId || !contract) {
            return;
        }
        (async () => {
            // Pass the listingId into the getListing function to get the listing with the given listingId
            const l = await contract.getListing(listingId);

            // Update state accordingly
            setLoadingListing(false);
            setListing(l);
        })();
    }, [listingId, contract]);

    if (loadingListing) {
        return <div>Loading...</div>;
    }

    if (!listing) {
        return <div>Listing not found</div>;
    }



    return (
        <div>
            <img src={listing.asset.image} />
            <h1>{listing.asset.name}</h1>
            <p>
                <b>Description:</b> {listing.asset.description}
            </p>
            <p>
                <b>Seller:</b> {listing.sellerAddress}
            </p>
            <p>
                <b>Listing Type:</b>{" "}
                {listing.type === 0 ? "Direct Listing" : "Auction Listing"}
            </p>

            <p>
                <b>Buyout Price</b> {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                {listing.buyoutCurrencyValuePerToken.symbol}
            </p>

            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Enter bid amount"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />

                    <button>Make Bid</button>
                </div>

                <button>Buy Now</button>
            </div>
        </div>
    );
};

export default ListingPage;