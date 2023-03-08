import React, { createContext, useContext, useState, useEffect } from "react";
import { useContract, useActiveListings } from "@thirdweb-dev/react";
import { AuctionListing, DirectListing } from '@thirdweb-dev/sdk';

type ListingsContextType = {
    listings: (AuctionListing | DirectListing)[];
    loadingListings: boolean;
}

export const ListingsContext = createContext<ListingsContextType>({
    listings: [],
    loadingListings: true
});

type ListingsProviderProps = {
    children: React.ReactNode;
}

export const ListingsProvider = ({ children }: ListingsProviderProps) => {
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );

    const [listings, setListings] = useState<(AuctionListing | DirectListing)[]>([]);
    const [loadingListings, setLoadingListings] = useState(true);

    const { data: activeListings, isLoading: loadingActiveListings } = useActiveListings(contract);

    const fetchListings = async () => {
        const { data } = await useActiveListings(contract);
        if (data) {
            setListings(data);
        }
    };

    useEffect(() => {
        if (activeListings) {
            setListings(activeListings);
            setLoadingListings(false);
        }
    }, [activeListings]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchListings();
        }, 60000);  // Update listings every 60s

        return () => clearInterval(intervalId);
    }, [fetchListings]);



    return (
        <ListingsContext.Provider value={{ listings, loadingListings }}>
            {children}
        </ListingsContext.Provider>
    );
};

export const useListings = () => useContext(ListingsContext);
