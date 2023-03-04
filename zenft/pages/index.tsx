import {
    ConnectWallet,
    MediaRenderer,
    useAccount,
    useActiveListings,
    useContract,
    useNetwork,
    useNetworkMismatch,
} from "@thirdweb-dev/react";
import {useRouter} from "next/router";
import Link from "next/link";
import styles from "../styles/Listing.module.css";
import {ListingType} from "@thirdweb-dev/sdk";

const Home = () => {
    const router = useRouter();
    const [{ data: accountData }, connect] = useAccount();
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const { data: listings, isLoading: loadingListings } = useActiveListings(
        contract
    );
    const networkMismatch = useNetworkMismatch();
    const [, switchNetwork] = useNetwork();

    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-100">
                {accountData ? (
                    <p>Connected with {accountData.address}</p>
                ) : (
                    <ConnectWallet accentColor="#f213a4" colorMode="dark" />
                )}
                {networkMismatch && (
                    <button onClick={() => switchNetwork && switchNetwork(1662)}>
                        Switch to Goerli Network
                    </button>
                )}
            </div>
            <div>
                {loadingListings ? (
                    <div>Loading listings...</div>
                ) : (
                    <div>
                        {listings?.length === 0 ? (
                            <div>No listings available</div>
                        ) : (
                            listings?.map((listing) => (
                                <div
                                    key={listing.id}
                                    onClick={() => router.push({
                                            pathname: `/listing/${listing.id}`,
                                        query: {
                                            accountData: JSON.stringify(accountData),
                                        },
                                        }
                                    )}
                                    className={styles["listing-container"]}
                                >
                                    <Link href={`/listing/${listing.id}`} passHref>
                                        <div>
                                            <MediaRenderer src={listing.asset.image} />
                                            <h2 className={styles["listing-name"]}>{listing.asset.name}</h2>
                                            <p className={styles["listing-price"]}>
                                                <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                                                {listing.buyoutCurrencyValuePerToken.symbol}
                                            </p>
                                            <Link href={`/listing/${listing.id}`} passHref>
                                                <button className={styles["listing-buy-button"]}>
                                                    {listing.type === ListingType.Direct ? "Buy Now" : "Bid Now"}
                                                </button>
                                            </Link>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
