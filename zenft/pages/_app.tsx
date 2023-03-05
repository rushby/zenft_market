import type { AppProps, AppInitialProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps: {  ...pageProps } }: AppProps & AppInitialProps) {
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
            authConfig={{
                // This domain should match the backend
                domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
                // Pass the URL of the auth endpoints
                authUrl: "/api/auth",
            }}
        >

            <Component {...pageProps} />
        </ThirdwebProvider>
    );
}

export default MyApp;