import {
    MediaRenderer,
    useActiveListings,
    useContract,
    useAccount,
    useNetworkMismatch,
    useNetwork,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";

const Home = () => {
    const router = useRouter();
    const [{ data: accountData }, connect] = useAccount();
    const { contract } = useContract(
        "0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6",
        "marketplace"
    );
    const { data: listings, isLoading: loadingListings } =
        useActiveListings(contract);
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
                    <button onClick={() => switchNetwork && switchNetwork(4)}>
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
                                    onClick={() => router.push(`/listing/${listing.id}`)}
                                >
                                    <Link href={`/listing/${listing.id}`} passHref>
                                        <div>
                                            <MediaRenderer src={listing.asset.image} />
                                            <h2>{listing.asset.name}</h2>
                                            <p>
                                                <b>
                                                    {listing.buyoutCurrencyValuePerToken.displayValue}
                                                </b>{" "}
                                                {listing.buyoutCurrencyValuePerToken.symbol}
                                            </p>
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
