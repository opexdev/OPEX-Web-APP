import React from "react";
import classes from "./LastTradesTable.module.css";
import {useTranslation} from "react-i18next";
import moment from "moment-jalaali";
import {connect, useSelector} from "react-redux";
import ScrollBar from "../../../../../../../../../../../../components/ScrollBar";
import {BN} from "../../../../../../../../../../../../utils/utils";
import Date from "../../../../../../../../../../../../components/Date/Date";
import i18n from "i18next";

const LastTradesTable = (props) => {
    const {t} = useTranslation();
    const {activePair, data} = props


    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    return (
        <div className={`column width-100 ${classes.container}`}>
            <ScrollBar>
                <table className="text-center" cellSpacing="0" cellPadding="0">
                    <thead>
                    <tr>
                        <th>{t("date")}</th>
                        <th>{t("time")}</th>
                        <th>
                            {t("volume")} <span className={`fs-0-7`}>({activePair.baseAsset})</span>
                        </th>
                        <th>
                            {t("price")} <span className={`fs-0-7`}>({activePair.quoteAsset})</span>
                        </th>
                        <th>{t("totalPrice")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((tr, index) => {
                        const pricePerUnit = new BN(tr.price)
                        const amount = new BN(tr.qty)
                        const totalPrice = pricePerUnit.multipliedBy(amount)

                        return (
                            <tr key={index} style={{color: tr.isBuyerMaker === true ? "var(--green)" : "var(--red)",}}>
                                <td><Date date={tr.time}/></td>
                                <td>{moment(tr.time).format("HH:mm:ss")}</td>
                                <td>{amount.decimalPlaces(currencies[activePair.baseAsset].precision).toFormat()}</td>
                                <td>{pricePerUnit.decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</td>
                                <td>{totalPrice.decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </ScrollBar>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        activePair: state.exchange.activePair,
    };
};

export default connect(mapStateToProps, null)(LastTradesTable);
