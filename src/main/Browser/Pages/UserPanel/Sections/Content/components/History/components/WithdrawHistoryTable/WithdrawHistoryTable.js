import React, {useState} from 'react';
import classes from './WithdrawHistoryTable.module.css'
import {useTranslation} from "react-i18next";
import Date from "../../../../../../../../../../components/Date/Date";
import moment from "moment-jalaali";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../../../utils/utils";
import Icon from "../../../../../../../../../../components/Icon/Icon";
import i18n from "i18next";
import {useSelector} from "react-redux";

const WithdrawHistoryTable = ({txs, offset}) => {

    const {t} = useTranslation();
    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)


    const [isOpen, setIsOpen] = useState(false);



    let head = (
        <div className="row text-gray px-2 py-2" style={{backgroundColor:"var(--tableHeader)"}}>
            <span className="width-6 flex jc-start ai-center">{t("date")}</span>
            <span className="width-6 flex  jc-start ai-center">{t("time")}</span>
            <span className="width-10 flex jc-start ai-center">{t("history.currency")}</span>
            <span className="width-10 flex jc-start ai-center">{t("history.network")}</span>
            <span className="width-9 flex jc-start ai-center">{t("history.amount")}</span>
            <span className="width-9 flex jc-start ai-center">{t("history.fee")}</span>
            <span className="width-9 flex jc-start ai-center">{t("history.status")}</span>
            <span className="width-29 flex jc-start ai-center">{t("history.destAddress")}</span>
            <span className="width-7 flex jc-start ai-center">{t("history.withdrawId")}</span>
            <span className="width-5 flex jc-end ai-center">{t("history.details")}</span>
        </div>
    );

    let body = (
        <>
            {txs.map((tr, index) => {
                return (
                    <div className={`column ${classes.striped}`} key={index}>
                        <div className={`${classes.row} row rounded-5 border-bottom px-2 py-2`} key={index} onDoubleClick={() => isOpen === index ? setIsOpen(null) : setIsOpen(index)}>
                            <span className="width-6 row jc-start ai-center">
                                <Date date={tr.createDate}/>
                            </span>
                            <span className="width-6 row jc-start ai-center">
                                {moment.utc(tr.createDate).local().format("HH:mm:ss")}
                            </span>

                            <span className="width-10 row jc-start ai-center">
                                {getCurrencyNameOrAlias(currencies[tr.currency], language)}
                            </span>

                            <span className="width-10 row jc-start ai-center">
                                {tr.destNetwork}
                            </span>

                            <span className="width-9 row jc-start ai-center text-red">
                                {new BN(tr?.amount).decimalPlaces(currencies[tr.currency].precision).toFormat()}
                            </span>

                            <span className="width-9 row jc-start ai-center">
                                {new BN(tr?.appliedFee).decimalPlaces(currencies[tr.currency].precision).toFormat()}
                            </span>

                            <span className="width-9 row jc-start ai-center">
                                {t("withdrawStatus." + tr.status )}
                            </span>
                            <span className="width-29 row jc-start ai-center fs-0-9">
                                {tr.destAddress}
                            </span>
                            <span className="width-7 row jc-start ai-center">
                                {tr.withdrawId}
                            </span>
                            <span className="width-5 row jc-end ai-center fs-0-8" onClick={() => isOpen === index ? setIsOpen(null) : setIsOpen(index)}>
                                <Icon iconName={`${isOpen === index ? 'icon-up-open' : 'icon-down-open'}  text-blue fs-0-7 cursor-pointer`}
                                      customClass={classes.iconBG}
                                />
                            </span>

                        </div>
                        {isOpen === index && <div className={`width-100 column jc-start ai-start px-2 py-2 fs-0-9 ${classes.rectangle}`}>
                            <div className={`row width-50 my-05`}>
                                <span className={`width-50`}>{t("history.acceptDate")}</span>
                                <span className={`width-50`}>
                                    {
                                        tr.acceptDate ? <>
                                            <Date date={tr.acceptDate}/>
                                            <span className={``}> - {moment.utc(tr.acceptDate).local().format("HH:mm:ss")}</span>
                                        </> : "- - -"
                                    }
                                </span>
                            </div>
                            <div className={`row width-50 my-05`}>
                                <span className={`width-50`}>{t("history.transactionRef")}</span>
                                <span className={`width-50`}>
                                    {tr?.destTransactionRef ?? "- - -"}
                                </span>
                            </div>
                            <div className={`row width-50 my-05`}>
                                <span className={`width-50`}>{t("history.statusReason")}</span>
                                <span className={`width-50`}>
                                    {tr?.statusReason ?? "- - -"}
                                </span>
                            </div>
                        </div>}
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

export default WithdrawHistoryTable;
