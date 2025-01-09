import React, {useEffect, useState} from 'react';
import classes from './MarketInfo.module.css'
import Icon from "../../../../../../components/Icon/Icon";
import MarketInfoTable from "./components/MarketInfoTable/MarketInfoTable";
import MarketInfoCard from "./components/MarketInfoCard/MarketInfoCard";
import * as Routes from "../../../../Routes/routes";
import {Link} from "react-router-dom";
import {useGetQuoteCurrencies, useOverview} from "../../../../../../queries";
import Loading from "../../../../../../components/Loading/Loading";
import Error from "../../../../../../components/Error/Error";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import {useSelector} from "react-redux";
import {getCurrencyNameOrAlias} from "../../../../../../utils/utils";

const MarketInfo = () => {

    const {t} = useTranslation();

    const [card, setCard] = useState(false)

    const [activeCurrency, setActiveCurrency] = useState("");

    const interval = "24h"



    const quote = activeCurrency === "" ? null : activeCurrency

    const currencies = useSelector((state) => state.exchange.currencies)
    const language = i18n.language

    const {data: overview, isLoading, error} = useOverview(null, interval, quote)
    const {data: quoteCurrencies, isLoading:quoteCurrenciesIsLoading, error:quoteCurrenciesError} = useGetQuoteCurrencies()


    useEffect(() => {
        if (quoteCurrencies?.length > 0) {
            setActiveCurrency(quoteCurrencies[0]);
        }
    }, [quoteCurrencies]);


    const content = () => {
        if (isLoading || quoteCurrenciesIsLoading) return <div style={{height: "40vh"}}><Loading/></div>
        if (error || quoteCurrenciesError) return <div style={{height: "40vh"}}><Error/></div>
        else return <>
            {card ?
                <MarketInfoCard data={overview.slice(0, 5)} activeCurrency={activeCurrency}/>
                :
                <MarketInfoTable data={overview.slice(0, 5)} activeCurrency={activeCurrency}/>
            }
        </>
    }


    return (
        <div className={`${classes.container} card-bg card-border width-90 my-4`}>
            <div className={`${classes.header} card-header-bg row jc-between ai-center px-2 py-2`}>
                <div className={`row jc-center ai-center`}>
                    <Icon iconName={`${card ? 'icon-row' : 'icon-grid'} fs-02 flex cursor-pointer hover-text`}
                          customClass={`ml-05`}
                          onClick={() => setCard(prevState => !prevState)}/>
                    <div className={`row jc-center ai-baseline mr-05 ml-1 cursor-pointer hover-text`} onClick={()=>setActiveCurrency("")}>
                        <h2 className={`ml-025`}>{t("market.title")}</h2>
                        <span className={`fs-0-8 mr-025`}>( {t("marketInterval." + interval)} )</span>
                    </div>
                    <div className={`row jc-center ai-center mr-1 fs-0-8`}>
                        {quoteCurrencies?.map((currency) =>
                            <span className={`px-2 py-1 rounded-5 cursor-pointer hover-text ${classes.title} ${activeCurrency === currency && classes.active}`} onClick={() => setActiveCurrency(currency)} key={currency}>
                                {getCurrencyNameOrAlias(currencies[currency], language)}
                                {/*{t("currency." + currency)}*/}
                            </span>
                        )}
                    </div>
                </div>
                <Link to={Routes.AllMarket} className={`row jc-center ai-center cursor-pointer hover-text`}>
                    <span className={`ml-05`}>{t("MarketInfo.viewAllMarket")}</span>
                    <Icon
                        iconName={`${i18n.language !== "fa" ? 'icon-right-open-1' : 'icon-left-open-1'} fs-01 flex`}
                        className={`mr-05`}/>
                </Link>
            </div>
            <div className={`${classes.content}`}>
                {content()}
            </div>
        </div>
    );
};

export default MarketInfo;
