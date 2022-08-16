import React from 'react';
import classes from './AllMarketContent.module.css'
import ScrollBar from "../../../../../../components/ScrollBar";
import Footer from "../../../UserPanel/Sections/Footer/Footer";
import Swing from "./components/Swing/Swing";
import AllMarketInfo from "./components/AllMarketInfo/AllMarketInfo";
import PriceInfo from "./components/PriceInfo/PriceInfo";
import VolumeInfo from "./components/VolumeInfo/VolumeInfo";

const AllMarketContent = () => {

    return (
        <div className={`${classes.container} container column`}>
            <ScrollBar>
                <div className={`row jc-between ai-center width-90 m-auto`} style={{height: "40vh"}}>
                    <div className={`width-35 flex `}>
                        <PriceInfo/>
                    </div>
                    <div className={`width-25 flex jc-center ai-start`}>
                        <Swing/>
                    </div>
                    <div className={`width-35 flex`}>
                        <VolumeInfo/>
                    </div>
                </div>
                <div className={`flex jc-center`} style={{height: "", backgroundColor: "var(--mainContent)"}}>
                    <AllMarketInfo/>
                </div>
                <Footer/>
            </ScrollBar>
        </div>
    );
};

export default AllMarketContent;