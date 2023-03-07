import {
    useAddress,
    useLogin,
    useLogout,
    useMetamask,
    useUser,
} from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import styles from "../styles/Header.module.css";

const SignIn = () => {
    const address = useAddress();
    const connect = useMetamask();
    const { login } = useLogin();
    const { logout } = useLogout();
    const { user, isLoggedIn } = useUser();
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState("");
    const [buttonState, setButtonState] = useState("normal");
    const [currentAccount, setCurrentAccount] = useState("");

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

    useEffect(() => {
        const handleAccountsChanged = () => {
            if (window.ethereum) {
                (window as any).ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
                    if (accounts.length === 0) {
                        setCurrentAccount("");
                        logout();
                    } else if (accounts[0] !== currentAccount) {
                        setCurrentAccount(accounts[0]);
                        logout();
                    }
                });
            }
        };

        if (window.ethereum) {
            window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setCurrentAccount(accounts[0]);
                }
            });
            (window as any).ethereum.on("accountsChanged", handleAccountsChanged);
        }

        return () => {
            if (window.ethereum) {
                (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
            }
        };
    }, [currentAccount]);

    return (
        <>
            {isLoggedIn && (
                <>
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
        </>
    );
};

export default SignIn;
