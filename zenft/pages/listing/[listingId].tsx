import {
    useContract,
    useNetwork,
    useNetworkMismatch,
} from "@thirdweb-dev/react";
import {
    AuctionListing,
    DirectListing,
    ListingType,
} from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import { NextPage } from "next";

type Listing = AuctionListing | DirectListing;

const ListingsPage: NextPage = () => {
    const networkMismatch = useNetworkMismatch();
    const [, switchNetwork] = useNetwork();

    const {contract} = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getListings() {
            try {
                setLoading(true);

                if (networkMismatch) {
                    switchNetwork && switchNetwork(1662);
                    return;
                }

                const activeListings = await contract?.getActiveListings();

                setListings(activeListings || []);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }

        getListings();
    }, [contract, networkMismatch, switchNetwork]);

    const createBidOrOffer = async (listingId: string, type: ListingType) => {
        try {
            // Ensure user is on the correct network
            if (networkMismatch) {
                switchNetwork && switchNetwork(1662);
                return;
            }

            // If the listing type is a direct listing, then we can create an offer.
            if (type === ListingType.Direct) {
                await contract?.direct.makeOffer(
                    listingId, // The listingId of the listing we want to make an offer for
                    1, // Quantity = 1
                    "0x1234567890123456789012345678901234567890", // Wrapped Ether address on Goerli
                    "1000000000000000000" // The offer amount the user entered
                );
            }

            // If the listing type is an auction listing, then we can create a bid.
            if (type === ListingType.Auction) {
                await contract?.auction.makeBid(listingId, "1000000000000000000");
            }

            alert(`${type === ListingType.Auction ? "Bid" : "Offer"} created successfully!`);
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    const buyNft = async (listingId: string) => {
        try {
            // Ensure user is on the correct network
            if (networkMismatch) {
                switchNetwork && switchNetwork(1662);
                return;
            }

            // Simple one-liner for buying the NFT
            await contract?.buyoutListing(listingId, 1);
            alert("NFT bought successfully!");
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    return (
        <div>
            <h1>Listings</h1>

            {loading && <p>Loading...</p>}

            {!loading && listings?.length === 0 && (
                <p>No listings found</p>
            )}

            {!loading && listings?.length > 0 && (
                <div>
                    {listings.map((listing: any) => (
                        <div key={listing.listingId}>
                            <img src={listing.asset.image}/>
                            <h2>{listing.asset.name}</h2>
                            <p>{listing.asset.description}</p>
                            <p>{listing.sellerAddress}</p>
                            <p>
                                {listing.type === ListingType.Direct
                                    ? "Direct Listing"
                                    : "Auction Listing"}
                            </p>
                            <p>
                                {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                                {listing.buyoutCurrencyValuePerToken.symbol}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ListingsPage;
