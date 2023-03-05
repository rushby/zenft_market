import {
    useAddress,
    useLogin,
    useLogout,
    useMetamask,
    useUser,
} from "@thirdweb-dev/react";
import { useState } from "react";
import styles from "../styles/Header.module.css";

type HeaderProps = {
    secret: string;
};

const Header = ({ secret }: HeaderProps) => {
    const address = useAddress();
    const connect = useMetamask();
    const { login } = useLogin();
    const { logout } = useLogout();
    const { user, isLoggedIn } = useUser();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnectAndSignIn = async () => {
        if (isConnecting) {
            return;
        }
        setIsConnecting(true);
        try {
            await connect().then(() => {
                console.log("Wallet connected");
            });
        } catch (error) {
            console.error(error);
        }
        setIsConnecting(false);
        setTimeout(async () => {
            await login();
        }, 1000);
    };

    return (
        <div className={styles.header}>
            <div className={styles.right}>
                {isLoggedIn && (
                    <>
                <pre className={styles.text}>
                    Connected Wallet: {address}
                </pre>
                        <button className={styles.button} onClick={() => logout()}>
                            Logout
                        </button>
                    </>
                )}
                {!isLoggedIn && (
                    <button className={styles.button} onClick={handleConnectAndSignIn}>
                        Connect and Sign In
                    </button>
                )}
            </div>
        </div>

    );
};

export default Header;
