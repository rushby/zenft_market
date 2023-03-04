import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
        activeChain={{
            // === Required information for connecting to the network === \\
            chainId: 1662, // Chain ID of the network
            // Array of RPC URLs to use
            rpc: ["https://yuma-testnet.horizenlabs.io/ethv1"],

            // === Information for adding the network to your wallet (how it will appear for first time users) === \\
            // Information about the chains native currency (i.e. the currency that is used to pay for gas)
            nativeCurrency: {
                decimals: 18,
                name: "ZEN",
                symbol: "tZEN",
            },
            shortName: "tzen", // Display value shown in the wallet UI
            slug: "zen", // Display value shown in the wallet UI
            testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
            chain: "Horizen", // Name of the network
            name: "Horizen Yuma Testnet", // Name of the network
        }}
    >
        <Component {...pageProps} />
    </ThirdwebProvider>
    );
}

export default MyApp;
