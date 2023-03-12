import React, { useState } from "react";
import {
    useContract
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useAccount, useUser } from "@thirdweb-dev/react";
import Header from "../components/header";
import Breadcrumbs from "../components/breadcrumbs";
import styles from "../styles/Listing.module.css";
import { DirectListing } from "../components/forms/directListing/DirectListing";
import { ListingTypeDropdown } from "../components/forms/ListingTypeDropdown";
import AuctionListing from "../components/forms/auctionListing/AuctionListing";

const Create = () => {
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const [account] = useAccount();
    const { address: accountAddress } = account?.data || {};
    const { user, isLoggedIn } = useUser();

    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Sell", path: "/create" }
    ];

    const [listingType, setListingType] = useState("direct");

    const handleListingTypeChange = (value: string) => {
        setListingType(value);
    };

    return (
        <div>
            <div className={styles.header}>
                <Header />
                <Breadcrumbs crumbs={breadcrumbs} />
            </div>
            <ListingTypeDropdown onListingTypeChange={handleListingTypeChange} />
            <div>
                {listingType === "direct" ? (
                    <DirectListing isLoggedIn={isLoggedIn} />
                ) : (
                    <AuctionListing isLoggedIn={isLoggedIn} />
                )}
            </div>
        </div>
    );
}

export default Create;
