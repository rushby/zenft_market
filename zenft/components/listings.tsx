import {useRouter} from "next/router";
import styles from "../styles/Listing.module.css";
import React from "react";
import Link from "next/link";
import {MediaRenderer, useActiveListings, useContract} from "@thirdweb-dev/react";
import {ListingType} from "@thirdweb-dev/sdk";
import NftActions from "./nftActions";


const Listings = () => {
    const router = useRouter();
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const { data: listings, isLoading: loadingListings } = useActiveListings(
        contract
    );

    return (
        <div>
            <h2 className={styles["listing-title"]}>BUY</h2>
            {loadingListings ? (
                <div>Loading listings...</div>
            ) : (
                <div>
                    {listings?.length === 0 ? (
                        <div>No listings available</div>
                    ) : (
                        listings?.map((listing) => (
                            <div
                                key={listing.id}
                                onClick={() => router.push({
                                        pathname: `/listing/${listing.id}`
                                    }
                                )}
                                className={styles["listing-container"]}
                            >
                                <Link href={`/listing/${listing.id}`} passHref>
                                    <div>
                                        <MediaRenderer src={listing.asset.image} />
                                        <h2 className={styles["listing-name"]}>{listing.asset.name}</h2>
                                        <p className={styles["listing-price"]}>
                                            <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                                            {listing.buyoutCurrencyValuePerToken.symbol}
                                        </p>
                                        <Link href={`/listing/${listing.id}`} passHref>
                                            <button className={styles["listing-buy-button"]}>
                                                {listing.type === ListingType.Direct ? "Buy Now" : "Bid Now"}
                                            </button>
                                        </Link>
                                    </div>
                                </Link>
                            </div>
                        ))
                    )}

                </div>
            )}
        </div>
    );
}

export default Listings;