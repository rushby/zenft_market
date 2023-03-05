import React from "react";
import styles from "../styles/NftActions.module.css";
import { useRouter } from "next/router";
import Listings from "./listings";

const NftActions = () => {
    const router = useRouter();

    const handleSellButtonClick = () => {
        router.push("/create");
    };

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <div className={styles.sell}>
                    <div className={styles["sell-label"]}>
                        <h3>SELL</h3>
                    </div>
                    <button className={styles.button} onClick={handleSellButtonClick}>Sell NFT</button>
                </div>
                <div className={styles.mint}>
                    <div className={styles["mint-label"]}>
                        <h3>MINT</h3>
                    </div>
                    <button className={styles.button}>Mint NFT</button>
                </div>
            </div>
            <div>
                <Listings/>
            </div>
        </div>

    );
};

export default NftActions;
