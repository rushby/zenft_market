import React from "react";
import { useOwnedNFTs, useContract, useAddress } from "@thirdweb-dev/react";

const YourCollection = () => {
    const { contract } = useContract("0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6");
    const address = useAddress();
    const { data: ownedNFTs, isLoading, error } = useOwnedNFTs(contract, address);

    console.log("ownedNFTs:", ownedNFTs);
    console.log("isLoading:", isLoading);
    console.log("error:", error);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {String(error)}</div>;
    }

    return (
        <div>
            <h1>Your Collection</h1>
            {ownedNFTs?.length ? (
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ownedNFTs.map((nft) => (
                        <tr key={nft.metadata.id}>
                            <td>{nft.metadata.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <div>No NFTs owned.</div>
            )}
        </div>
    );
};

export default YourCollection;
