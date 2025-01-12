import React from "react";
import ScrollBar from "../../../../../../../../../../components/ScrollBar";
import MarketPairCard from "../MarketPairCard/MarketPairCard";

const MarketCard = ({type, ...props}) => {

    return (
        <div style={{height: "100%"}}>
            <ScrollBar>

                {
                    Object.keys(props?.pairs)

                        .map((pair) => <MarketPairCard {...props} pair={props?.pairs[pair]} key={pair.symbol}/>)
                }

            </ScrollBar>
        </div>
    );
};

export default MarketCard;
