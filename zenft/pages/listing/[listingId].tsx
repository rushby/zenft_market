import {useContract, useUser} from "@thirdweb-dev/react";
import { AuctionListing, DirectListing, ListingType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Listing.module.css";
import Header from "../../components/header";

type Listing = AuctionListing | DirectListing;

const ListingPage = () => {
    const router = useRouter();
    const listingId = router.query.listingId as string;
    const [listing, setListing] = useState<Listing | null>(null);
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const { isLoggedIn } = useUser();

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

    const createBidOrOffer = async () => {
        try {
            //
        } catch (error) {
            console.error(error);
        }
    };

    const buyNft = async (listingId: string, quantityDesired: number) => {
        if (!isLoggedIn) {
            alert("Please log in to buy this NFT.");
            return;
        }

        try {
            // Buy the NFT
            await contract?.buyoutListing(listingId, quantityDesired);

            // Display success message
            alert("NFT bought successfully!");
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    return (

        <div>
            <Header/>
            {listing ? (
                <div>
                    <h1 className={styles["listing-page-h1"]}>{listing.asset.name}</h1>
                    <div className={styles["listing-container-large"]}>
                        <img src={listing.asset.image ?? "default-image-url"} alt={String(listing.asset.name) ?? "default-image-alt"} />
                        <h2>{listing.asset.name}</h2>
                        <table className={styles["listing-details"]}>
                            <tbody>
                            <tr>
                                <td>Price:</td>
                                <td>{listing.buyoutCurrencyValuePerToken.displayValue}{" "}{listing.buyoutCurrencyValuePerToken.symbol}</td>
                            </tr>
                            <tr>
                                <td>Asset Description:</td>
                                <td>{listing.asset.description}</td>
                            </tr>
                            <tr>
                                <td>Seller Address:</td>
                                <td>{listing.sellerAddress}</td>
                            </tr>
                            <tr>
                                <td>Listing Type:</td>
                                <td>{listing.type === ListingType.Direct ? "Direct Listing" : "Auction Listing"}</td>
                            </tr>
                            </tbody>
                        </table>
                        <p>

                        </p>
                        <button
                            className={styles["listing-buy-button-large"]}
                            onClick={() => {
                                if (listing.type === ListingType.Direct) {
                                    buyNft(listing.id, 1);
                                } else {
                                    createBidOrOffer();
                                }
                            }}
                        >
                            {listing.type === ListingType.Direct ? "Buy Now" : "Bid Now"}
                        </button>
                    </div>
                </div>
            ) : (
                <p>Loading listing...</p>
            )}
        </div>
    );
};

export default ListingPage;