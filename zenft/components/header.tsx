import {
    useAddress,
    useLogin,
    useLogout,
    useMetamask,
    useUser,
} from "@thirdweb-dev/react";
import { useState } from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
    const address = useAddress();
    const connect = useMetamask();
    const { login } = useLogin();
    const { logout } = useLogout();
    const { user, isLoggedIn } = useUser();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState("");
    const [buttonState, setButtonState] = useState("normal");

    const handleConnectAndSignIn = async () => {
        if (isConnecting) {
            return;
        }
        setIsConnecting(true);
        try {
            await connect().then(() => {
                console.log("Wallet connected");
            });
            new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    login()
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            setButtonState("failed");
                            setTimeout(() => {
                                setButtonState("normal");
                            }, 3000); // return to normal state after 3 seconds
                        });
                }, 1000);
            });
        } catch (error) {
            setError("An error occurred while connecting to the wallet."); // set the error message
        }
        setIsConnecting(false);
    };

    const buttonText = buttonState === "failed" ? "Connect Failed" : "Connect and Sign In";

    return (
        <div className={styles.header}>
            <div className={styles.left}>
                <h1 className={styles.logo}>ZENFT</h1>
            </div>
            <div className={styles.right}>
                {isLoggedIn && (
                    <>
                        <pre className={styles.text}>Connected Wallet: {address}</pre>
                        <button className={styles.button} onClick={() => logout()}>
                            Logout
                        </button>
                    </>
                )}
                {!isLoggedIn && (
                    <div>
                        <button
                            className={`${styles.button} ${styles[buttonState]}`}
                            onClick={handleConnectAndSignIn}
                        >
                            {buttonText}
                        </button>
                        {error && <div className={styles.error}>{error}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
