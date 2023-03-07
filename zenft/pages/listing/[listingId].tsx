import {useContract, useUser, useBuyNow, Web3Button, BuyNowParams} from "@thirdweb-dev/react";
import { AuctionListing, DirectListing, ListingType } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Listing.module.css";
import Header from "../../components/header";
import Breadcrumbs from "../../components/breadcrumbs";
import SignIn from "../../components/SignIn";
import {Typography} from "@mui/material";

type Listing = AuctionListing | DirectListing;

const ListingPage = () => {
    const router = useRouter();
    const listingId = router.query.listingId as string;
    const [listing, setListing] = useState<Listing | null>(null);
    const contractAddress = "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6";
    const { contract } = useContract(
        contractAddress,
        "marketplace"
    );
    const { isLoggedIn } = useUser();
    const { mutateAsync: buyNow, isLoading, error } = useBuyNow(contract);
    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Listings", path: "/listings" }
    ];

    useEffect(() => {
        async function fetchListing() {
            const activeListings = await contract?.getActiveListings();
            const matchingListing = activeListings?.find(
                (listing) => listing.id === listingId
            );

            if (matchingListing) {
                setListing(matchingListing);
            }
        }
        fetchListing();
    }, [contract, listingId]);


    return (
        <div>
            <Header />
            <Breadcrumbs crumbs={breadcrumbs} />
            {listing ? (
                <div>
                    <h1 className={styles["listing-page-h1"]}>{listing.asset.name}</h1>
                    <div className={styles["listing-container-large"]}>
                        <img
                            src={listing.asset.image ?? "default-image-url"}
                            alt={String(listing.asset.name) ?? "default-image-alt"}
                        />
                        <h2>{listing.asset.name}</h2>
                        <table className={styles["listing-details"]}>
                            <tbody>
                            <tr>
                                <td>Price:</td>
                                <td>
                                    {listing.buyoutCurrencyValuePerToken.displayValue}{" "}
                                    {listing.buyoutCurrencyValuePerToken.symbol}
                                </td>
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
                                <td>
                                    {listing.type === ListingType.Direct
                                        ? "Direct Listing"
                                        : "Auction Listing"}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        {isLoggedIn ? (
                            <div>
                                <Web3Button
                                    contractAddress={contractAddress}
                                    action={() =>
                                        buyNow({
                                            id: listingId, // ID of the listing to buy
                                            type: ListingType.Direct, // Direct (0) or Auction (1)
                                            buyAmount: 1, // Amount to buy
                                            buyForWallet: undefined, // Wallet to buy for, defaults to current wallet
                                        })
                                    }
                                >
                                    Buy Now
                                </Web3Button>
                            </div>) : (
                            <div className={styles["listing-signin-container"]}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Typography variant="h6" style={{ color: "orangered", margin: "0 0 20px" }}>
                                        Must be signed in to buy...
                                    </Typography>
                                    <SignIn />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p>Loading listing...</p>
            )}
        </div>
    );
};

export default ListingPage;