import {
    MediaRenderer,
    useAccount,
    useActiveListings,
    useAddress,
    useContract, useLogin, useLogout,
    useMetamask,
    useUser
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/Listing.module.css";
import { ListingType } from "@thirdweb-dev/sdk";
import {NextPage} from "next";
import {useState} from "react";

const Home: NextPage = () => {
    const router = useRouter();
    const [{ data: accountData }] = useAccount();
    const { contract } = useContract("0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6", "marketplace");
    const { data: listings, isLoading: loadingListings } = useActiveListings(contract);
    const address = useAddress();
    const connect = useMetamask();
    const { login } = useLogin();
    const { logout } = useLogout();
    const { user, isLoggedIn } = useUser();
    const [secret, setSecret] = useState();

    const getSecret = async () => {
        const res = await fetch("/api/secret");
        const data = await res.json();
        setSecret(data.message);
    };

    return (
        <div>
            <div>
                {isLoggedIn ? (
                    <button onClick={() => logout()}>Logout</button>
                ) : address ? (
                    <button onClick={() => login()}>Login</button>
                ) : (
                    <button onClick={() => connect()}>Connect</button>
                )}
                <button onClick={getSecret}>Get Secret</button>

                <pre>Connected Wallet: {address}</pre>
                <pre>User: {JSON.stringify(user, undefined, 2) || "N/A"}</pre>
                <pre>Secret: {secret || "N/A"}</pre>
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
