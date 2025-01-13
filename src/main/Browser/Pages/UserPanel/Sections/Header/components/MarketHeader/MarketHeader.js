import React, {useEffect, useState} from "react";
import classes from "./MarketHeader.module.css";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import Icon from "../../../../../../../../components/Icon/Icon";
import Popup from "../../../../../../../../components/Popup/Popup";
import {useGetUserAccount} from "../../../../../../../../queries/hooks/useGetUserAccount";
import {useGetLastPrices} from "../../../../../../../../queries/hooks/useGetLastPrices";
import i18n from "i18next";


const MarketHeader = () => {
    const {t} = useTranslation();

    const activePair = useSelector((state) => state.exchange.activePair)
    const {data: lastPrices} = useGetLastPrices()
    const {data: userAccount} = useGetUserAccount()

    const base = userAccount?.wallets[activePair.baseAsset]?.free || 0
    const quote = userAccount?.wallets[activePair.quoteAsset]?.free || 0

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const [showPopUp, setShowPopUp] = useState(false);
    const [showPopUpAsset, setShowPopUpAsset] = useState(null);

    const ClickHandler = (currency) => {
        if (currency === showPopUpAsset || !showPopUpAsset) {
            setShowPopUp(true)
        }
        setShowPopUpAsset(currency)
    }

    useEffect(() => {
        setShowPopUp(false)
        setShowPopUpAsset(null)
    }, [activePair]);

    const closePopup = () => {
        setShowPopUp(false)
        setShowPopUpAsset(null)
    }

    return (
        <>
            <div className={`col-25 column ai-start`}>
                <h2 className="mb-05">{getCurrencyNameOrAlias(currencies[activePair?.baseAsset], language)}/{getCurrencyNameOrAlias(currencies[activePair?.quoteAsset], language)}</h2>
                <p className={`mt-05`}>{t("header.lastPrice")}:{" "}<span/>{" "}{new BN(lastPrices[activePair.symbol] || 0).decimalPlaces(currencies[activePair?.quoteAsset]?.precision ?? 0).toFormat() +" "+ getCurrencyNameOrAlias(currencies[activePair?.quoteAsset], language)}</p>
            </div>
            <div className={`col-50 column ai-center`}>
                <p className="mb-05">{t("header.availableBalance")}</p>
                <div className={`width-100 row ai-center ${classes.inventory} mt-05`}>
                    <div className="col-50 flex ai-center jc-end">
                        <Icon iconName="icon-plus-circle fs-03 flex" customClass={`cursor-pointer ${classes.iconBG}`} onClick={()=>ClickHandler(activePair.baseAsset)}/>
                        {/*<span>{ new BN (base).decimalPlaces(activePair.baseAssetPrecision).toFormat()}</span>*/}
                        <span>{ new BN (base).decimalPlaces(currencies[activePair?.baseAsset]?.precision ?? 0).toFormat()}</span>
                        <span>{getCurrencyNameOrAlias(currencies[activePair?.baseAsset], language)}</span>
                    </div>
                    <div className="col-50 flex ai-center  jc-start">
                        <span>{ new BN(quote).decimalPlaces(currencies[activePair?.quoteAsset]?.precision ?? 0).toFormat()}</span>
                        <span>{getCurrencyNameOrAlias(currencies[activePair?.quoteAsset], language)}</span>
                        <Icon iconName="icon-plus-circle fs-03 flex" customClass={`cursor-pointer ${classes.iconBG}`} onClick={()=>ClickHandler(activePair.quoteAsset)}/>
                    </div>
                </div>
            </div>
            {showPopUp ? <Popup currency={showPopUpAsset} closePopup={closePopup}/> : ""}
        </>
    );
};

export default MarketHeader;