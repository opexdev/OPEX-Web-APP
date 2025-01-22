import React, {useEffect, useRef, useState} from "react";
import classes from "./Popup.module.css";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import Button from "../Button/Button";
import {Link, Navigate} from "react-router-dom";
import * as Routes from "../../main/Browser/Routes/routes";
import {Login} from "../../main/Browser/Routes/routes";
import TextInput from "../TextInput/TextInput";
import {useGetCurrencyInfo} from "../../queries";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import PopupAddress from "./PopupAddress/PopupAddress";
import i18n from "i18next";
import {getCurrencyNameOrAlias} from "../../utils/utils";

const Popup = ({currency, closePopup}) => {

    const {t} = useTranslation();

    const isLogin = useSelector((state) => state.auth.isLogin)

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const [networkName, setNetworkName] = useState({value: 0, error: []});

    const selectRef = useRef()
    const {data: currencyInfo, isLoading: CILoading, error: CIError, refetch: refetchCI} = useGetCurrencyInfo(currency)

    useEffect(() => {
        setNetworkName({value: 0, error: []})

    }, [currency]);



    useEffect(() => {
        if (currency !== "IRT") {
            refetchCI()
        }
    }, [currency]);



    const content = () => {
        if(!isLogin) return <div className={`width-100 flex jc-center ai-center height-100`}>
            <Link to={Login} className="hover-text">
                {t("pleaseLogin")}
            </Link>
        </div>

        if(CILoading) return <Loading/>
        if (CIError) return <Error/>
        if (currency === "IRT") return <Navigate to={Routes.Wallet + "/IRT"} replace />

        return <>
            <TextInput
                select={true}
                placeholder={t('DepositWithdraw.selectNetwork')}
                options={currencyInfo?.chains.map((chain, index) => {
                    return {value: index, label: `${chain.network} - ${chain.currency}`}
                })}
                lead={t('DepositWithdraw.network')}
                type="select"
                value={currencyInfo?.chains[networkName.value] && {
                    value: networkName.value,
                    label: `${currencyInfo?.chains[networkName.value].network} - ${currencyInfo?.chains[networkName.value].currency}`
                }}
                onchange={(e) => setNetworkName({value: e?.value || 0, error: []})}
                customRef={selectRef}
                alerts={networkName.error}
                customClass={`width-50 ${classes.thisInput}`}
            />
            { currencyInfo && <PopupAddress currency={currency} network={currencyInfo?.chains[networkName?.value]?.network}/>}
        </>
    }

    return (
        <div className={`width-100 column jc-between ai-center px-1 py-1 appear-animation card-border ${classes.container}`}>
            <div className={`${classes.header} width-100`}>
                <h3>{t("deposit")} <span>{getCurrencyNameOrAlias(currencies[currency], language)}</span></h3>
            </div>
            <div className={`${classes.content} width-100 column jc-center ai-center`}>
                {content()}
            </div>
            <div className={`${classes.footer} width-100 flex jc-end ai-center`}>
                {isLogin ? <Link to={Routes.Wallet + '/' + currency} className={`${classes.thisButton} ${classes.walletButton} button flex jc-center ai-center`}>
                    <span>{t("wallet.title")}</span>
                </Link> : ""}
                <Button
                    buttonClass={`${classes.thisButton} ${classes.closeButton} mr-05`}
                    onClick={closePopup}
                    buttonTitle={t("close")}
                />
            </div>
        </div>
    );
};

export default Popup;