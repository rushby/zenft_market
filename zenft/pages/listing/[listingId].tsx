import { useContract } from "@thirdweb-dev/react";
import { AuctionListing, DirectListing, ListingType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Listing.module.css";

type Listing = AuctionListing | DirectListing;

const ListingPage = () => {
    const router = useRouter();
    const listingId = router.query.listingId as string;
    const [listing, setListing] = useState<Listing | null>(null);
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );

    useEffect(() => {
        async function fetchListing() {
            try {
                const activeListings = await contract?.getActiveListings();
                const matchingListing = activeListings?.find(
                    (listing) => listing.id === listingId
                );

                if (matchingListing) {
                    setListing(matchingListing);
                } else {
                    throw new Error(`Listing with ID ${listingId} not found`);
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchListing();
    }, [contract, listingId]);

    const createBidOrOffer = async (type: ListingType) => {
        try {
            if (type === ListingType.Direct) {
                // Create an offer for a direct listing
            } else {
                // Create a bid for an auction listing
            }
        } catch (error) {
            console.error(error);
        }
    };

    const buyNft = async () => {
        try {
            // Buy the NFT
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {listing ? (
                <div>
                    <h1 className={styles["listing-page-h1"]}>{listing.asset.name}</h1>
                    <div className={styles["listing-container-large"]}>
                        <img src={listing.asset.image ?? "default-image-url"} alt={String(listing.asset.name) ?? "default-image-alt"} />
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
                        <button onClick={() => createBidOrOffer(listing.type)}>Bid/Buy</button>
                        <button onClick={() => buyNft()}>Buy Now</button>
                    </div>
                </div>
            ) : (
                <p>Loading listing...</p>
            )}
        </div>
    );
};

export default ListingPage;
