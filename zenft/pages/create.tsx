import React, { useState } from "react";
import {
    useContract,
    useNetworkMismatch,
    useNetwork,
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useAccount } from "@thirdweb-dev/react";
import Header from "../components/header";
import Breadcrumbs from "../components/breadcrumbs";
import styles from "../styles/Listing.module.css";

const Create = () => {
    const router = useRouter();
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const networkMismatch = useNetworkMismatch();
    const [currentNetwork] = useNetwork();
    const [listingType, setListingType] = useState("directListing");
    const [contractAddress, setContractAddress] = useState("");
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [account] = useAccount();
    const { address: accountAddress } = account?.data || {};
    const breadcrumbs = [
        { label: "Home", path: "/" },
        { label: "Sell", path: "/create" }
    ];

    const handleCreateListing = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        try {
            const currentNetworkNumber = currentNetwork.data.chain?.id;
            if (networkMismatch || currentNetworkNumber !== 1662) {
                return alert("Please switch to the correct network in your wallet");
            }

            e.preventDefault();

            if (!contractAddress) {
                setContractAddressError("Contract address is required");
                return;
            } else {
                setContractAddressError("");
            }

            if (!tokenId) {
                setTokenIdError("Token ID is required");
                return;
            } else {
                setTokenIdError("");
            }

            if (!price) {
                setPriceError("Price is required");
                return;
            } else {
                setPriceError("");
            }

            let transactionResult = undefined;

            if (contract) {
                if (listingType === "directListing") {
                    transactionResult = await createDirectListing(
                        contractAddress,
                        tokenId,
                        price // Convert string to number
                    );
                }

                if (listingType === "auctionListing") {
                    transactionResult = await createAuctionListing(
                        contractAddress,
                        tokenId,
                        price
                    );
                }
            } else {
                console.log("Contract object is null or undefined");
            }

            if (transactionResult) {
                router.push(`/`);
            }
        } catch (error) {
            console.error(error);
        }
    };

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

    const createDirectListing = async (
        contractAddress: string,
        tokenId: string,
        price: string
    ) => {
        try {
            return await contract?.direct.createListing({
                assetContractAddress: contractAddress,
                buyoutPricePerToken: price,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                startTimestamp: new Date(0),
                tokenId: parseInt(tokenId),
            });
        } catch (error) {
            console.error(error);
        }
    };

    const [contractAddressError, setContractAddressError] = useState("");
    const [tokenIdError, setTokenIdError] = useState("");
    const [priceError, setPriceError] = useState("");

    return (
        <div>
            <div className={styles.header}>
                <Header />
                <Breadcrumbs crumbs={breadcrumbs} />
            </div>
            <div className={styles.formContainer}>
            <form onSubmit={(e) => handleCreateListing(e)} className={styles.form}>
                <h1>Sell Your NFT</h1>

                <div className={styles.fieldGroup}>
                    <div className={styles.label}>
                        <label htmlFor="listingType" className={styles.label}>Listing Type:</label>
                        <select
                            name="listingType"
                            id="listingType"
                            value={listingType}
                            onChange={(e) => setListingType(e.target.value)}
                            className={styles.dropdown}
                        >
                            <option value="directListing">Direct Listing</option>
                            <option value="auctionListing">Auction Listing</option>
                        </select>
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="contractAddress" className={styles.label}>NFT Contract Address:</label>
                    <input
                        type="text"
                        name="contractAddress"
                        id="contractAddress"
                        placeholder="Enter the contract address of your NFT"
                        required
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                        className={styles.textInput}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="tokenId" className={styles.label}>NFT Token ID:</label>
                    <input
                        type="text"
                        name="tokenId"
                        id="tokenId"
                        placeholder="Enter the token ID of your NFT"
                        required
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        className={styles.textInput}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label htmlFor="price" className={styles.label}>Sale Price:</label>
                    <input
                        type="text"
                        name="price"
                        id="price"
                        placeholder="Enter the sale price of your NFT"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={styles.textInput}
                    />
                </div>

                <div className={styles.errorGroup}>
                    {networkMismatch && (
                        <p className={styles.error}>Please switch to the correct network in your wallet</p>
                    )}
                    {!networkMismatch && (!account || !accountAddress) && (
                        <p className={styles.error}>Please connect your wallet</p>
                    )}
                    {networkMismatch || !account || !accountAddress || !contractAddress || !tokenId || !price ? (
                        <p className={styles.error}>Please fill in all required fields</p>
                    ) : null}
                </div>

                <button type="submit" className={styles.button}>Create Listing</button>
            </form>
            </div>
        </div>
    );
}

export default Create;