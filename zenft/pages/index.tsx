import { NextPage } from "next";
import Header from "../components/header";
import NftActions from "../components/nftActions";
import Breadcrumbs from "../components/breadcrumbs";

const Home: NextPage = () => {
    const breadcrumbs = [{ label: "Home", path: "/" }];

    return (
        <div>
            <Header />
            <Breadcrumbs crumbs={breadcrumbs}/>
            <div>
                <NftActions />
            </div>
        </div>
    );
};

export default Home;