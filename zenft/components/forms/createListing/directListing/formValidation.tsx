const validationRules = {
    contractAddress: {
        required: "Contract Address is required",
        pattern: {
            value: /^0x[a-fA-F0-9]{40}$/,
            message: "Invalid Contract Address",
        },
    },
    tokenId: {
        required: "Token Id is required",
        pattern: {
            value: /^[0-9]*$/,
            message: "Token Id must be a number",
        },
    },
    price: {
        required: "Price is required",
        pattern: {
            value: /^[0-9]+(\.[0-9]{1,18})?$/,
            message:
                "Price must be a whole number or a decimal with up to 18 decimal places",
        },
    },
    duration: {
        required: "Duration is required",
        valueAsNumber: true,
        min: {
            value: 1,
            message: "Duration must be at least 1 day",
        },
        max: {
            value: 365,
            message: "Duration cannot be more than 1 year",
        },
    },
};

export default validationRules;