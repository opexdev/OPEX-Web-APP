import React from 'react';
import {images} from "../../../../../../../../assets/images";
import i18n from "i18next";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const MostIncreasedPrice = ({mostIncreasedPrice}) => {

    const {t} = useTranslation();
    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    return (
        <>
            <img  src={currencies[mostIncreasedPrice?.pairInfo?.baseAsset]?.icon}
                  alt={mostIncreasedPrice?.pairInfo?.baseAsset}
                  title={mostIncreasedPrice?.pairInfo?.baseAsset}
                  className={`img-md-plus`}/>
            <span>{getCurrencyNameOrAlias(currencies[mostIncreasedPrice?.pairInfo?.baseAsset], language)}</span>
            <div className={`${i18n.language !== "fa" ? 'row-reverse' : 'row'} jc-center ai-center width-100`}>
                <span className={`${i18n.language !== "fa" ? 'mr-025' : 'ml-025'} fs-0-6`}>{mostIncreasedPrice?.pairInfo?.quoteAsset}</span>
                <span className={`${i18n.language !== "fa" ? 'mL-025' : 'mr-025'} fs-01`}>{new BN(mostIncreasedPrice?.lastPrice).decimalPlaces(currencies[mostIncreasedPrice.pairInfo.quoteAsset]?.precision ?? 0).toFormat()}</span>
            </div>
            <div className={`row jc-center ai-center width-100`}>
                <span className={`${mostIncreasedPrice?.priceChangePercent > 0 ? "text-green" : mostIncreasedPrice?.priceChangePercent < 0 ? "text-red" : ""} direction-ltr`}>{mostIncreasedPrice?.priceChangePercent === 0 ? "0 %" : `${new BN(mostIncreasedPrice?.priceChangePercent).toFormat(2)} %`}</span>
            </div>
        </>
    );
};

export default MostIncreasedPrice;
