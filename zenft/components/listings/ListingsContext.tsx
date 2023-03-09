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
        if (contract) {
            const data = await contract.getActiveListings();
            if (data) {
                setListings(data);
                localStorage.setItem('listings', JSON.stringify(data));
            }
        }
    };

    //Updates the listings data when the activeListings value changes.
    //This ensures that the component is updated with the latest listings data whenever it becomes available.
    useEffect(() => {
        if (activeListings) {
            setListings(activeListings);
            setLoadingListings(false);
            localStorage.setItem('listings', JSON.stringify(activeListings));
        }
    }, [activeListings]);

    //Updates the listings data every 60 seconds using the fetchListings function.
    //This ensures that the listings data is updated periodically, even if no new listings become available.
    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchListings();
        }, 60000);  // Update listings every 60s

        return () => clearInterval(intervalId);
    }, [fetchListings]);

    //Reads the listings data from local storage when the component mounts.
    // This ensures that the component always has access to the most recent listings data, even after a browser refresh.
    useEffect(() => {
        const storedListings = localStorage.getItem('listings');
        if (storedListings) {
            setListings(JSON.parse(storedListings));
            setLoadingListings(false);
        }
    }, []);


    return (
        <ListingsContext.Provider value={{ listings, loadingListings }}>
            {children}
        </ListingsContext.Provider>
    );
};

export const useListings = () => useContext(ListingsContext);
