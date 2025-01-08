import React from 'react';
import {images} from "../../../../../../../../assets/images";
import i18n from "i18next";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const MostTrades = ({mostTrades}) => {

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    return (
        <>
            <img src={currencies[mostTrades?.pairInfo?.baseAsset]?.icon}
                 alt={mostTrades?.pairInfo?.baseAsset}
                 title={mostTrades?.pairInfo?.baseAsset}
                 className={`img-md-plus`}/>
            <span>{getCurrencyNameOrAlias(currencies[mostTrades?.pairInfo?.baseAsset], language)}</span>
            <div className={`${i18n.language !== "fa" ? 'row-reverse' : 'row'} jc-center ai-center width-100`}>
                <span className={`${i18n.language !== "fa" ? 'mL-025' : 'mr-025'} fs-01`}>{new BN(mostTrades?.tradeCount).toFormat()} </span>
            </div>

        </>
    );
};

export default MostTrades;
