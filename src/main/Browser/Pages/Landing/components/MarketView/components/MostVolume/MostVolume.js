import React from 'react';
import classes from "../../MarketView.module.css";
import {images} from "../../../../../../../../assets/images";
import i18n from "i18next";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const MostVolume = ({mostVolume}) => {

    const {t} = useTranslation();
    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    return (
        <div className={`column`}>
            <span className={`${classes.title} text-orange`}>{t("MarketView.mostVolume")}</span>
            <div className={`row jc-between ai-center`}>
                <div className={`row jc-center ai-center`}>
                    <img
                        className="img-md-plus ml-05"
                        src={currencies[mostVolume?.pairInfo?.baseAsset]?.icon}
                        alt={mostVolume?.pairInfo?.baseAsset}
                        title={mostVolume?.pairInfo?.baseAsset}
                    />
                    <span className={`mr-05`}>{getCurrencyNameOrAlias(currencies[mostVolume?.pairInfo?.baseAsset], language)}</span>
                </div>
                <div className={`column ai-end`}>
                    <div className={`${i18n.language !== "fa" ? 'row-reverse' : 'row'}`}>
                        <span className={`fs-0-6 ${i18n.language !== "fa" ? 'mr-05' : 'ml-05'}`}>{mostVolume?.pairInfo?.baseAsset}</span>
                        <span>{new BN(mostVolume?.volume).decimalPlaces(currencies[mostVolume?.pairInfo?.baseAsset]?.precision ?? 0).toFormat()}</span>
                    </div>
                    {/*++ to do ++*/}
                    {/*<span className={`${mostVolume?.change > 0 ? "text-green" : "text-red"} direction-ltr`}>{new BN(mostVolume?.change).toFormat(2)} %</span>*/}
                </div>
            </div>
        </div>
    );
};

export default MostVolume;
