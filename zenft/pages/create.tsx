import React, { useState } from "react";
import {
    useContract,
    useNetworkMismatch,
    useNetwork,
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useAccount } from "@thirdweb-dev/react";

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
        <form onSubmit={(e) => handleCreateListing(e)}>
            <div>
                {/* Form Section */}
                <div>
                    <h1>Upload your NFT to the marketplace:</h1>

                    {/* Toggle between direct listing and auction listing */}
                    <div>
                        <input
                            type="radio"
                            name="listingType"
                            id="directListing"
                            value="directListing"
                            checked={listingType === "directListing"}
                            onChange={() => setListingType("directListing")}
                        />
                        <label htmlFor="directListing">Direct Listing</label>
                        <input
                            type="radio"
                            name="listingType"
                            id="auctionListing"
                            value="auctionListing"
                            checked={listingType === "auctionListing"}
                            onChange={() => setListingType("auctionListing")}
                        />
                        <label htmlFor="auctionListing">Auction Listing</label>
                    </div>
                    <div>
                        {listingType === "directListing" && <p>Selected listing type: Direct Listing</p>}
                        {listingType === "auctionListing" && <p>Selected listing type: Auction Listing</p>}
                    </div>

                    {/* NFT Contract Address Field */}
                    <input
                        type="text"
                        name="contractAddress"
                        placeholder="NFT Contract Address"
                        required
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                    />

                    {/* NFT Token ID Field */}
                    <input
                        type="text"
                        name="tokenId"
                        placeholder="NFT Token ID"
                        required
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                    />

                    {/* Sale Price For Listing Field */}
                    <input
                        type="text"
                        name="price"
                        placeholder="Sale Price"
                        required
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    {/* Display error message if a required field has not been filled */}
                    {networkMismatch && (
                        <p>Please switch to the correct network in your wallet</p>
                    )}
                    {!networkMismatch &&
                        (!account || !accountAddress) && (
                            <p>Please connect your wallet</p>
                        )}
                    {networkMismatch ||
                        (!account || !accountAddress ||
                            !contractAddress ||
                            !tokenId ||
                            !price) && (
                            <p>Please fill in all required fields</p>
                        )
                    }

                    <button type="submit">Create Listing</button>
                </div>
            </div>
        </form>
    );
}

export default Create;