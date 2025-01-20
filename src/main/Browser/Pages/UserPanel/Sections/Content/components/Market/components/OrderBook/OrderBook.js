import React, {useEffect} from "react";
import classes from "./OrderBook.module.css";
import OrderBookTable from "./components/OrderBookTable/OrderBookTable";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import Error from "../../../../../../../../../../components/Error/Error";
import Loading from "../../../../../../../../../../components/Loading/Loading";
import {useOrderBook} from "../../../../../../../../../../queries";
import i18n from "i18next";
import {getCurrencyNameOrAlias} from "../../../../../../../../../../utils/utils";


const OrderBook = () => {
    const {t} = useTranslation();
    const activePair = useSelector((state) => state.exchange.activePair)
    const {data, isLoading, error, refetch} = useOrderBook(activePair.symbol)
    const lastTransaction = useSelector((state) => state.auth.lastTransaction)

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    useEffect(() => {
        refetch()
    }, lastTransaction)

    const tableRender = () => {
        if (error) return <span className={`width-100`}><Error/></span>
        if (isLoading) return <Loading/>
        return <>
            <OrderBookTable data={data.asks}/>
            <OrderBookTable data={data.bids} type="buy"/>
        </>
    }

    return (
        <div className={`width-100 card-bg card-border my-2 column ${classes.container}`}>
            <div className={`column border-bottom jc-between header-radius card-header-bg ${classes.header}`}>
                <div className="row jc-start">
                    <h3>
                        {t("orderBook.title")} ({getCurrencyNameOrAlias(currencies[activePair.baseAsset], language)}/
                        {getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)})
                    </h3>
                </div>
                <div className="row jc-center">
                    <span className="text-red">{t("sell")}</span>
                    <span className="text-green">{t("buy")}</span>
                </div>
            </div>
            <div className={`row width-100 ${classes.content}`}>
                {tableRender()}
            </div>
        </div>
    );
};

export default OrderBook;
