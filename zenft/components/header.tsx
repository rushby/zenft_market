import { useAddress, useUser } from "@thirdweb-dev/react";
import styles from "../styles/Header.module.css";
import SignIn from "./SignIn";

const Header = () => {
    const address = useAddress();
    const { isLoggedIn } = useUser();

    return (
        <div className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.logo}>ZENFT</h1>
            </div>
            <div className={styles.right}>
                {isLoggedIn && (
                    <>
                        <pre className={styles.text}>Connected Wallet: {address}</pre>
                    </>
                )}
                <SignIn />
            </div>
        </div>
    );
};

export default Header;
