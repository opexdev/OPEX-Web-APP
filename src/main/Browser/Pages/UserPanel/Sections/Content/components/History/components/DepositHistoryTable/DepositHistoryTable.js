import React from 'react';
import classes from './DepositHistoryTable.module.css'
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import Date from "../../../../../../../../../../components/Date/Date";
import moment from "moment-jalaali";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../../../utils/utils";
import i18n from "i18next";

const DepositHistoryTable = ({txs, offset}) => {

    const {t} = useTranslation();

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)


    let head = (
        <div className="row text-gray px-2 py-2" style={{backgroundColor:"var(--tableHeader)"}}>
            <span className="width-9 flex jc-start ai-center">{t("date")}</span>
            <span className="width-9 flex  jc-start ai-center">{t("time")}</span>
            <span className="width-12 flex jc-start ai-center">{t("history.currency")}</span>
            <span className="width-10 flex jc-start ai-center">{t("DepositWithdraw.network")}</span>
            <span className="width-12 flex jc-start ai-center">{t("history.amount")}</span>
            <span className="width-10 flex jc-start ai-center">{t("history.status")}</span>
            <span className="width-39 flex jc-start ai-center">{t("history.transactionRef")}</span>
            <span className="width-9 flex jc-end ai-center">{t("history.type")}</span>
        </div>
    );
    let body = (
        <>
            {txs.map((tr, index) => {
                return (
                    <div className={`column ${classes.striped}`} key={index}>

                        <div className={`${classes.row} row rounded-5 border-bottom px-2 py-2`} key={index}>
                            <span className="width-9 row jc-start ai-center">
                                <Date date={tr.createDate}/>
                            </span>
                            <span className="width-9 row jc-start ai-center">
                                {moment.utc(tr.createDate).local().format("HH:mm:ss")}
                            </span>

                            <span className="width-12 row jc-start ai-center">
                                {getCurrencyNameOrAlias(currencies[tr.currency], language)}
                            </span>

                            <span className="width-10 row jc-start ai-center">
                                {tr.network ?? "- - -"}
                            </span>

                            <span className="width-12 row jc-start ai-center text-green">
                                {new BN(tr?.amount).decimalPlaces(currencies[tr.currency].precision).toFormat()}
                            </span>

                            <span className="width-10 row jc-start ai-center">
                                {t("depositStatus." + tr.status )}
                            </span>
                            <span className="width-39 row jc-start ai-center fs-0-9">
                                {tr?.transactionRef ?? "- - -"}
                            </span>
                            <span className="width-9 row jc-end ai-center">
                                {tr.type}
                            </span>
                        </div>
                    </div>
                )
            })}
        </>
    );

    return (
        <>
            {head}
            {body}
        </>
    );
};

export default DepositHistoryTable;
