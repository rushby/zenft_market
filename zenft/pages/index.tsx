import { NextPage } from "next";
import Header from "../components/header";
import NftActions from "../components/nftActions";

const Home: NextPage = () => {
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
