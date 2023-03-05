import React from "react";
import styles from "../styles/NftActions.module.css";
import { useRouter } from "next/router";

const NftActions = () => {
    const router = useRouter();

    const handleSellButtonClick = () => {
        router.push("/create");
    };

    return (
        <div className={styles.actions}>
            <div className={styles.sell}>
                <button className={styles.button} onClick={handleSellButtonClick}>Sell NFT</button>
                <p className={styles.text}>Click to sell your NFT</p>
            </div>
            <div className={styles.mint}>
                <button className={styles.button}>Mint NFT</button>
                <p className={styles.text}>Click to mint a new NFT</p>
            </div>
        </div>
    );
};

export default NftActions;
