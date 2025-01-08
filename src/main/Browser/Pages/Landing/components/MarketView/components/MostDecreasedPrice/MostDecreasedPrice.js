import React from 'react';
import classes from "../../MarketView.module.css";
import i18n from "i18next";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const MostDecreasedPrice = ({mostDecreasedPrice}) => {

    const {t} = useTranslation();
    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    return (
        <div className={`column border-bottom  my-3`}>
            <span className={`${classes.title} text-orange`}>{t("MarketView.mostDecreased")}</span>
            <div className={`row jc-between ai-center`}>
                <div className={`row jc-center ai-center`}>
                    <img
                        className="img-md-plus ml-05"
                        src={currencies[mostDecreasedPrice.pairInfo.baseAsset]?.icon}
                        alt={mostDecreasedPrice.pairInfo.baseAsset}
                        title={mostDecreasedPrice.pairInfo.baseAsset}
                    />
                    <span className={`mr-05`}>{getCurrencyNameOrAlias(currencies[mostDecreasedPrice.pairInfo.baseAsset], language)}</span>
                </div>
                <div className={`column ai-end`}>
                    <div className={`${i18n.language !== "fa" ? 'row-reverse' : 'row'}`}>
                        <span className={`fs-0-6 ${i18n.language !== "fa" ? 'mr-05' : 'ml-05'}`}>{mostDecreasedPrice.pairInfo.quoteAsset}</span>
                        <span>{new BN(mostDecreasedPrice?.lastPrice).decimalPlaces(currencies[mostDecreasedPrice.pairInfo.quoteAsset]?.precision ?? 0).toFormat()}</span>
                    </div>
                    <span className={`${mostDecreasedPrice?.priceChangePercent > 0 ? "text-green" : mostDecreasedPrice?.priceChangePercent < 0 ? "text-red" : ""} direction-ltr`}>{mostDecreasedPrice?.priceChangePercent === 0 ? "0 %" : `${new BN(mostDecreasedPrice?.priceChangePercent).toFormat(2)} %`}</span>
                </div>
            </div>
        </div>

    );
};

export default MostDecreasedPrice;
