import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useContract,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  // Connect your marketplace smart contract here (replace this address)
  const { contract } = useContract("0x5C075ef16255BF7a7F0c49A0a2f5c2BB325cd2f6", "marketplace")

  const { data: listings, isLoading: loadingListings } =
      useActiveListings(contract);

  return (
      <div>
        {
          // If the listings are loading, show a loading message
          loadingListings ? (
              <div>Loading listings...</div>
          ) : (
              // Otherwise, show the listings
              <div>
                {listings?.map((listing) => (
                    <div
                        key={listing.id}
                        onClick={() => router.push(`/listing/${listing.id}`)}
                    >
                      <MediaRenderer src={listing.asset.image} />
                      <h2>
                        <Link href={`/listing/${listing.id}`}>
                          <a>{listing.asset.name}</a>
                        </Link>
                      </h2>

                      <p>
                        <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                        {listing.buyoutCurrencyValuePerToken.symbol}
                      </p>
                    </div>
                ))}
              </div>
          )
        }
      </div>
  );
};

export default Home;