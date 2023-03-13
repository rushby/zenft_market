import {NATIVE_TOKEN_ADDRESS} from "@thirdweb-dev/sdk";
import {handleError} from "../handleError";
import {IFormInput} from "./types";

export const handleDirectSubmit = async (
    data: IFormInput,
    createDirectListing: any,
    setErrorMessage: any,
    setButtonState: any,
    setButtonText: any
) => {

    try {
        const requestData = {
            assetContractAddress: data.contractAddress,
            buyoutPricePerToken: data.price,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            quantity: 1,
            startTimestamp: new Date(0),
            listingDurationInSeconds: Number(data.duration) * 60 * 60 * 24,
            tokenId: parseInt(data.tokenId)
        }


        await createDirectListing(requestData);

        setErrorMessage("");
        setButtonState("success");
        setButtonText("Success");
        setTimeout(() => {
            setButtonState("normal");
            setButtonText("Create Listing");
        }, 5000);
    } catch (error: any) {
        console.error(error);
        handleError(error, setButtonState, setButtonText, setErrorMessage);
    }
};