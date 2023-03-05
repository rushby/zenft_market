import Link from 'next/link';
import styles from '../styles/Breadcrumbs.module.css';

type Crumb = {
    label: string;
    href: string;
};

type Props = {
    crumbs: Crumb[];
};

const Breadcrumbs = ({ crumbs }: Props) => {
    return (
        <nav className={styles.breadcrumbs}>
            <ul>
                {crumbs.map((crumb, index) => (
                    <li key={index}>
                        <Link href={crumb.href}>
                            <a>{crumb.label}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Breadcrumbs;
