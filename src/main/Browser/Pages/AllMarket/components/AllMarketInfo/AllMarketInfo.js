import React, {useEffect, useState} from 'react';
import classes from './AllMarketInfo.module.css'
import Icon from "../../../../../../components/Icon/Icon";
import AllMarketInfoCard from "./components/AllMarketInfoCard/AllMarketInfoCard";
import AllMarketInfoTable from "./components/AllMarketInfoTable/AllMarketInfoTable";
import {useGetQuoteCurrencies, useOverview} from "../../../../../../queries";
import {useDispatch, useSelector} from "react-redux";
import Loading from "../../../../../../components/Loading/Loading";
import Error from "../../../../../../components/Error/Error";
import {setMarketInterval} from "../../../../../../store/actions";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import {getCurrencyNameOrAlias} from "../../../../../../utils/utils";

const AllMarketInfo = () => {

    const {t} = useTranslation();
    const dispatch = useDispatch();

    const [card, setCard] = useState(false)
    const [activeCurrency, setActiveCurrency] = useState("")

    const interval = useSelector((state) => state.global.marketInterval)
    const quote = activeCurrency === "" ? null : activeCurrency

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

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
                <AllMarketInfoCard data={overview} activeCurrency={activeCurrency}/>
                :
                <AllMarketInfoTable data={overview} activeCurrency={activeCurrency}/>
            }
        </>
    }

    return (
        <div className={`${classes.container} card-bg card-border width-90 my-4`}>
            <div className={`${classes.header} card-header-bg row jc-between ai-center px-2 py-2`}>
                <div className={`row jc-center ai-center`}>
                    <Icon iconName={`${card ? 'icon-row' : 'icon-grid'} fs-02 flex cursor-pointer hover-text`} customClass={`ml-05`} onClick={()=>setCard(prevState => !prevState)}/>
                    <h1 className={`mr-05 ml-025 cursor-pointer hover-text`}  onClick={()=>setActiveCurrency("")}>{t("market.title")}</h1>
                    <div className={`row jc-center ai-center fs-0-8 mr-1`}>
                        {quoteCurrencies?.map((currency) =>
                            <span className={`px-2 py-1 rounded-5 cursor-pointer hover-text ${classes.title} ${activeCurrency === currency && classes.active}`} onClick={() => setActiveCurrency(currency)} key={currency}>{getCurrencyNameOrAlias(currencies[currency], language)}</span>
                        )}
                    </div>
                </div>
                <div className={`row jc-center ai-center mr-1 fs-0-8`}>
                    <span className={`px-1 py-1 rounded-5 cursor-pointer hover-text ${interval === "24h" && classes.active}`} onClick={()=>dispatch(setMarketInterval("24h"))}>{t("marketInterval.24h")}</span>
                    <span className={`px-1 py-1 rounded-5 cursor-pointer hover-text ${interval === "7d" && classes.active}`} onClick={()=>dispatch(setMarketInterval("7d"))}>{t("marketInterval.7d")}</span>
                    <span className={`px-1 py-1 rounded-5 cursor-pointer hover-text ${interval === "1M" && classes.active}`} onClick={()=>dispatch(setMarketInterval("1M"))}>{t("marketInterval.1M")}</span>
                </div>
            </div>
            <div className={`${classes.content}`}>
                {content()}
            </div>
        </div>
    );
};

export default AllMarketInfo;
