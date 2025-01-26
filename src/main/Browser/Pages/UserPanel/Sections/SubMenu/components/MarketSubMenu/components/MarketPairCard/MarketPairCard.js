import React from "react";
import classes from "./MarketCard.module.css";
import {useDispatch, useSelector} from "react-redux";
import {images} from "../../../../../../../../../../assets/images";
import Icon from "../../../../../../../../../../components/Icon/Icon";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../../../utils/utils";
import {setActivePairInitiate} from "../../../../../../../../../../store/actions";
import {useGetLastPrices} from "../../../../../../../../../../queries/hooks/useGetLastPrices";
import i18n from "i18next";

const MarketPairCard = ({id, pair, favPair, addFav}) => {
    const activePair = useSelector((state) => state.exchange.activePair.symbol)
    const {data: prices} = useGetLastPrices()

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    console.log("pair", pair)
    console.log("activePair in submenu", activePair)

    const dispatch = useDispatch();
    /*const changeActivePair = () =>{
        if (activePair !== pair.symbol) dispatch(setActivePairInitiate(pair, id))
    }*/

    const changeActivePair = () => {
        const pairSymbolFormatted = `${pair.baseAsset}_${pair.quoteAsset}`;
        if (activePair !== pairSymbolFormatted) {
            dispatch(setActivePairInitiate(`${pair.baseAsset}_${pair.quoteAsset}`, id));
        }
    };

    return (
        <div onClick={changeActivePair}
             className={`width-100 row jc-between ai-center px-1 py-05 cursor-pointer double-striped border-bottom ${classes.container} ${activePair === pair.symbol ? classes.selected : ""} `}>
            <div className={` row jc-between ai-center ${classes.marketCardImage}`}>
                <img
                    className="img-md flex"
                    src={currencies[pair?.baseAsset]?.icon}
                    alt={pair?.symbol}
                    title={pair?.symbol}
                />
            </div>
            <div className={`row jc-between ai-center ${classes.marketCardContent}`}>
                <div className={`row`}>
                    <Icon iconName={`${favPair.includes(pair?.symbol) ? "icon-star-filled" : "icon-star"} text-color`} customClass={` ml-05`} onClick={(e) => {e.stopPropagation();addFav(pair?.symbol);}}/>
                    <span className={``}>{pair?.baseAsset + " / " + pair?.quoteAsset }</span>
                </div>
                <div className={`${language !== "fa" ? 'row-reverse' : 'row'} jc-center`}>
                    <span>{new BN(prices[pair?.symbol] || 0).decimalPlaces(currencies[pair?.quoteAsset]?.precision ?? 0).toFormat()}</span>
                </div>
            </div>
        </div>
    );
};

export default MarketPairCard;