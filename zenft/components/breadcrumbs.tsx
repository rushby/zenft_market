import { useRouter } from "next/router";
import styles from "../styles/Breadcrumbs.module.css";

type Crumb = {
    label: string;
    path: string;
};

type Props = {
    crumbs: Crumb[];
};

const Breadcrumbs = ({ crumbs }: Props) => {
    const router = useRouter();

    return (
        <nav aria-label="breadcrumb">
            <div className={styles.breadcrumbs}>
                {crumbs.map((crumb, index) => (
                    <span key={crumb.path}>
                        {index === crumbs.length - 1 ? (
                            <span className={`${styles.current}`}>{crumb.label}</span>
                        ) : (
                            <span
                                className={styles.link}
                                onClick={() => router.push(crumb.path)}
                            >
                                {crumb.label}
                            </span>
                        )}
                        {index < crumbs.length - 1 && <span> &gt; </span>}
                    </span>
                ))}
            </div>
        </nav>
    );
};

export default Breadcrumbs;