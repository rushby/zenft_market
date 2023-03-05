// components/breadcrumbs.tsx

import Link from "next/link";
import styles from "../styles/Breadcrumbs.module.css";

type Crumb = {
    label: string;
    path: string;
};

type Props = {
    crumbs: Crumb[];
};

const Breadcrumbs = ({ crumbs }: Props) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className={styles.breadcrumbs}>
                {crumbs.map((crumb, index) => (
                    <li key={crumb.path}>
                        {index === crumbs.length - 1 ? (
                            <span className={styles.current}>{crumb.label}</span>
                        ) : (
                            <Link href={crumb.path} passHref>
                                <span className={styles.link}>{crumb.label}</span>
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
