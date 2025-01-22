import React, {Fragment, useEffect, useState} from "react";
import moment from "moment-jalaali";
import classes from "../../MyOrders.module.css";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import Loading from "../../../../../../../../../../../../components/Loading/Loading";
import ScrollBar from "../../../../../../../../../../../../components/ScrollBar";
import Icon from "../../../../../../../../../../../../components/Icon/Icon";
import {useMyOrderHistory} from "../../../../../../../../../../../../queries";
import Error from "../../../../../../../../../../../../components/Error/Error";
import Date from "../../../../../../../../../../../../components/Date/Date";
import i18n from "i18next";
import {BN} from "../../../../../../../../../../../../utils/utils";

const OrdersHistory = () => {
    const {t} = useTranslation();
    const [openOrder, setOpenOrder] = useState(null)

    const activePair = useSelector((state) => state.exchange.activePair)
    const lastTransaction = useSelector((state) => state.auth.lastTransaction);

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const {data, isLoading, error, refetch} = useMyOrderHistory(activePair.symbol)

    useEffect(() => {
        refetch()
    }, [lastTransaction])

    if (error) return <Error/>

    if (isLoading)  return <Loading/>

    if (data.length === 0) return <div className={`height-100 flex jc-center ai-center`}>{t("noData")}</div>

    return (
        <ScrollBar>
            <table className="text-center double-striped fs-0-9" cellSpacing="0" cellPadding="0">
                <thead className="th-border-y">
                <tr>
                    <th className={`pr-05`}>{t("date")}</th>
                    <th>{t("time")}</th>
                    <th>
                        {t("volume")} <span className={`fs-0-7`}>({activePair.baseAsset})</span>
                    </th>
                    <th>
                        {t("pricePerUnit")} <span className={`fs-0-7`}>({activePair.quoteAsset})</span>
                    </th>
                    <th>{t("totalPrice")}</th>
                    <th>{t("status")}</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {data.map((tr, index) => (
                    <Fragment key={index}>
                        <tr className={tr.side === "BUY" ? "text-green" : "text-red"}>
                            <td className={`pr-05`}><Date date={tr.time}/></td>
                            <td>{moment(tr.time).format("HH:mm:ss")}</td>


                            <td>{new BN(tr.origQty).decimalPlaces(currencies[activePair.baseAsset].precision).toFormat()}</td>

                            <td>{new BN(tr.price).decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</td>

                            <td>{new BN(tr.origQty).multipliedBy(tr.price).decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</td>

                            <td>{t("orderStatus." + tr.status)}</td>

                            {openOrder === index ? (
                                <td className={`width-7`} onClick={() => setOpenOrder(null)}>
                                    <Icon
                                        iconName="icon-up-open text-blue fs-0-7"
                                        customClass={`${classes.iconBG} cursor-pointer`}
                                    />
                                </td>
                            ) : (
                                <td className={`width-7`} onClick={() => setOpenOrder(index)}>
                                    <Icon
                                        iconName="icon-down-open text-blue fs-0-7"
                                        customClass={`${classes.iconBG} cursor-pointer`}
                                    />
                                </td>
                            )}
                        </tr>
                        <tr style={{
                            display: openOrder === index ? "revert" : "none",
                        }}>
                            <td colSpan="8" className={`pb-1 px-1 fs-0-8`}>
                                <div
                                    className="row jc-between ai-center"
                                    style={{width: "100%", textAlign: "start"}}>
                                    <p className="width-47 row jc-between">
                                        {t("myOrders.orderId")} : <span>{tr.orderId}</span>
                                    </p>
                                    <p className="width-47 row jc-between">
                                        {t("orderType")} :{" "}
                                        <span>
                                            {t(tr.side.toLowerCase()) + " " + t("orderTypes." + tr.type)}
                                        </span>
                                    </p>
                                </div>
                                <div className="row  jc-between ai-center fs-0-7"
                                     style={{width: "100%", textAlign: "start"}}>
                                    <p className="width-47 row jc-between">
                                        {t("myOrders.startOrderTime")} :{" "}
                                        <span className={`direction-ltr`}>
                                            <Date date={tr.updateTime}/>-{moment(tr.updateTime).format("HH:mm:ss")}
                                        </span>
                                    </p>
                                    <p className="width-47 row jc-between">
                                        {t("myOrders.stopOrderTime")} :{" "}
                                        <span className={`direction-ltr`}>
                                            <Date date={tr.time}/>-{moment(tr.time).format("HH:mm:ss")}
                                        </span>
                                    </p>
                                </div>
                                {/*<div className="row jc-between ai-center" style={{width: "100%", textAlign: "start"}}>
                                    <p className="col-46 row jc-between">
                                        {t("myOrders.stoppedPrice")} :{" "}
                                        <span>{tr.price}</span>
                                    </p>
                                </div>*/}
                            </td>
                        </tr>
                    </Fragment>
                ))}
                </tbody>
            </table>
        </ScrollBar>
    )
}

export default OrdersHistory;