import type { AppProps, AppInitialProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps & AppInitialProps) {
    return (
        <ThirdwebProvider
            activeChain={{
                chainId: 1662,
                rpc: ["https://yuma-testnet.horizenlabs.io/ethv1"],
                nativeCurrency: {
                    decimals: 18,
                    name: "ZEN",
                    symbol: "ZEN",
                },
                shortName: "Yuma Testnet",
                slug: "yuma-testnet",
                testnet: true,
                chain: "Horizen",
                name: "Horizen Yuma Testnet"
            }}
        >
            <Component {...pageProps} />
        </ThirdwebProvider>
    );
}

export default MyApp;