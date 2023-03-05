import { NextPage } from "next";
import Header from "../components/header";
import NftActions from "../components/nftActions";
import Breadcrumbs from "../components/breadcrumbs";

const Home: NextPage = () => {
    const breadcrumbs = [{ label: "Home", href: "/" }];

    return (
        <div>
            <Header />

            <div>
                <NftActions />
            </div>
        </div>
    );
};

export default Home;