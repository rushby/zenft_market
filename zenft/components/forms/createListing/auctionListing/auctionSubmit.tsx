import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { handleError } from "../handleError";
import { IFormInput } from "./types";

export const handleAuctionSubmit = async (
    data: IFormInput,
    createAuctionListing: any,
    setErrorMessage: any,
    setButtonState: any,
    setButtonText: any
) => {
    try {
        const requestData = {
            assetContractAddress: data.contractAddress,
            tokenId: data.tokenId,
            minimumBidAmount: 0,
            reservePricePerToken: data.reservePricePerToken,
            buyoutPricePerToken: data.buyoutPricePerToken,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            quantity: 1,
            startTimestamp: new Date(0),
            listingDurationInSeconds: Number(data.duration) * 24 * 60 * 60,
            bidBufferBps: 100, // Bids must be 1% higher than current bid
            timeBufferInSeconds: 300, // Extend auction by 5mins after receiving a bid
        };

        await createAuctionListing(requestData);

        setErrorMessage("");
        setButtonState("success");
        setButtonText("Success");
        setTimeout(() => {
            setButtonState("normal");
            setButtonText("Create Auction");
        }, 5000);

        return;
    } catch (error: any) {
        console.error(error);
        handleError(error, setButtonState, setButtonText, setErrorMessage);
    }
};