import React from "react";
import {
    useContract
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useAccount, useUser } from "@thirdweb-dev/react"; // import useUser hook
import Header from "../components/header";
import Breadcrumbs from "../components/breadcrumbs";
import styles from "../styles/Listing.module.css";
import {DirectListing} from "../components/forms/DirectListing";
import {FormInputDropdown} from "../components/forms/FormInputDropdown";
import {ListingType} from "../components/forms/ListingType";

const Create = () => {
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const [account] = useAccount();
    const { address: accountAddress } = account?.data || {};
    const { user, isLoggedIn } = useUser(); // get the logged-in status from the useUser hook
    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Sell", path: "/create" }
    ];

    const createAuctionListing = async (
        contractAddress: string,
        tokenId: string,
        price: string
    ) => {
        try {
            return await contract?.auction.createListing({
                assetContractAddress: contractAddress,
                buyoutPricePerToken: price,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                reservePricePerToken: 0,
                startTimestamp: new Date(),
                tokenId: parseInt(tokenId),
            });
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            <div className={styles.header}>
                <Header />
                <Breadcrumbs crumbs={breadcrumbs} />
            </div>
            <>
                <ListingType/>
            </>
            <div>
                <DirectListing isLoggedIn={isLoggedIn} />
            </div>
        </div>
    );
}

export default Create;
