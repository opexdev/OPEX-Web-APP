import React from 'react';
import classes from "../../MarketView.module.css";
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
        <div className={`column border-bottom`}>
            <span className={`${classes.title} text-orange`}>{t("MarketView.mostIncreased")}</span>
            <div className={`row jc-between ai-center`}>
                <div className={`row jc-center ai-center`}>
                    <img
                        className="img-md-plus ml-05"
                        src={currencies[mostIncreasedPrice.pairInfo.baseAsset]?.icon}
                        alt={mostIncreasedPrice.pairInfo.baseAsset}
                        title={mostIncreasedPrice.pairInfo.baseAsset}
                    />
                    <span className={`mr-05`}>{getCurrencyNameOrAlias(currencies[mostIncreasedPrice.pairInfo.baseAsset], language)}</span>
                </div>
                <div className={`column ai-end`}>
                    <div className={`${i18n.language !== "fa" ? 'row-reverse' : 'row'}`}>
                        <span className={`fs-0-6 ${i18n.language !== "fa" ? 'mr-05' : 'ml-05'}`}>{mostIncreasedPrice.pairInfo.quoteAsset}</span>
                        <span>{new BN(mostIncreasedPrice?.lastPrice).decimalPlaces(currencies[mostIncreasedPrice.pairInfo.quoteAsset]?.precision ?? 0).toFormat()}</span>
                    </div>
                    <span className={`${mostIncreasedPrice?.priceChangePercent > 0 ? "text-green" : mostIncreasedPrice?.priceChangePercent < 0 ? "text-red" : ""} direction-ltr`}>{mostIncreasedPrice?.priceChangePercent === 0 ? "0 %" : `${new BN(mostIncreasedPrice?.priceChangePercent).toFormat(2)} %`}</span>
                </div>
            </div>
        </div>
    );
};

export default MostIncreasedPrice;
