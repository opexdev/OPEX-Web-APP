import React from "react";
import classes from "../../Overview.module.css";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import Loading from "../../../../../../../../../../../../components/Loading/Loading";
import Error from "../../../../../../../../../../../../components/Error/Error";
import {useOverview} from "../../../../../../../../../../../../queries";
import i18n from "i18next";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../../../../../utils/utils";


const InformationBlock = ({period}) => {

    const {t} = useTranslation();
    const activePair = useSelector((state) => state.exchange.activePair)

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const {data, isLoading, error} = useOverview(activePair.symbol, period)

    if (isLoading) return <Loading/>
    if (error) return <Error/>

    return (<div className={`${classes.content} column jc-between px-1 py-2`}>
        <div className={`row`}>
            <p>{t("overview.change")}</p>
            <span className={`flex ${i18n.language !== "fa" ? 'jc-start' : 'jc-end'} ai-center mr-05 ${data?.priceChangePercent > 0 ? "text-green" : data?.priceChangePercent < 0 ? "text-red" : ""} direction-ltr`}>{data?.priceChangePercent === 0 ? "0 %" : `${new BN(data?.priceChangePercent).toFormat(2)} %`}</span>
        </div>
        <div className={`row`}>
            <p>{t("min")}:</p>
            <span className={`mx-05`}>{new BN(data?.lowPrice).decimalPlaces(currencies[data?.quote]?.precision ?? 0).toFormat()}</span>
            <span>{getCurrencyNameOrAlias(currencies[data?.quote], language)}</span>
        </div>
        <div className={`row`}>
            <p>{t("max")}:</p>
            <span className={`mx-05`}>{new BN(data?.highPrice).decimalPlaces(currencies[data?.quote]?.precision ?? 0).toFormat()}</span>
            <span>{getCurrencyNameOrAlias(currencies[data?.quote], language)}</span>
        </div>
        <div className={`row`}>
            <p>{t("volume")}:</p>
            <span className={`mx-05`}>{new BN(data?.volume).decimalPlaces(currencies[data?.base]?.precision ?? 0).toFormat()}</span>
            <span>{getCurrencyNameOrAlias(currencies[data?.base], language)}</span>
        </div>
    </div>)
}

export default InformationBlock;