import React, { useEffect, useState } from "react";
import { useOwnedNFTs, useContract, useAddress } from "@thirdweb-dev/react";

interface ContractOwnedNFTsProps {
    nftContract: string;
}

interface ContractOwnedNFTsData {
    data: any;
    error?: Error;
}

export const ContractOwnedNFTs = ({ nftContract }: ContractOwnedNFTsProps): ContractOwnedNFTsData => {
    const { contract } = useContract(nftContract);
    const address = useAddress();
    const { data: ownedNFTs, isLoading, error } = useOwnedNFTs(contract, address);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);
    const [err, setErr] = useState<Error | undefined>(undefined);

    useEffect(() => {
        if (isLoading) {
            setLoading(true);
        } else if (error) {
            setErr(error as Error); // Explicitly cast error to Error type
            setLoading(false);
        } else {
            setData(ownedNFTs);
            setLoading(false);
        }
    }, [isLoading, ownedNFTs, error]);

    if (loading) {
        return { data: null };
    }

    if (err) {
        return { data: null, error: err };
    }

    return { data };
};

export const doesTokenExist = (tokenId: string, nftContract: string): boolean => {
    const { data } = ContractOwnedNFTs({ nftContract });

    if (!data) {
        return false;
    }

    return data.some((nft: any) => nft.tokenId === tokenId);
};
