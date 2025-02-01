import React, {useState} from 'react';
import classes from './WithdrawTxTable.module.css';
import {useTranslation} from "react-i18next";
import Date from "../../../../../../../../../../components/Date/Date";
import moment from "moment-jalaali";
import {BN} from "../../../../../../../../../../utils/utils";
import Icon from "../../../../../../../../../../components/Icon/Icon";
import Button from "../../../../../../../../../../components/Button/Button";
import {images} from "../../../../../../../../../../assets/images";
import {cancelWithdrawReq} from "js-api-client/client/withdraw";
import toast from "react-hot-toast";
import {useGetWithdrawHistory} from "../../../../../../../../../../queries";
import {useParams} from "react-router-dom";
import i18n from "i18next";
import {useSelector} from "react-redux";

const WithdrawTxTable = ({txs}) => {

    const {t} = useTranslation();

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)


    const [isOpen, setIsOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false)


    const {id} = useParams();

    const query = {
        "currency": id, // optional
        "category": null, // optional [DEPOSIT, FEE, TRADE, WITHDRAW, ORDER_CANCEL, ORDER_CREATE, ORDER_FINALIZED]
        "startTime": null,
        "endTime": null,
        "ascendingByTime": false,
        "limit": 10,
        "offset": 0,
    }

    const {refetch} = useGetWithdrawHistory(query);


    const cancelWithdrawReqButtonTextHandler = () => {
        if (isLoading) return <img className={`${classes.thisLoading}`} src={images.linearLoadingBgOrange}
                                   alt="linearLoading"/>
        return t('WithdrawTx.cancelWithdrawReq')
    }

    const cancelWithdrawReqFunc = (withdrawId) => {

        if (isLoading) return
        setIsLoading(true)

        cancelWithdrawReq(withdrawId)
            .then(() => {
                toast.success(t('WithdrawTx.cancelWithdrawReqSuccess'));
                refetch()
            })
            .catch((error) => {
                toast.error(t('error'));
            })
            .finally(() => setIsLoading(false))

    }

    let head = (
        <div className="row text-gray px-1 py-2 fs-0-9" style={{backgroundColor:"var(--tableHeader)"}}>
            <span className="width-16 flex jc-start ai-center">{t("date")}</span>
            <span className="width-16 flex jc-start ai-center">{t("time")}</span>
            <span className="width-22 flex jc-start ai-center">{t("history.network")}</span>
            <span className="width-23 flex jc-start ai-center">{t("history.amount")}</span>
            <span className="width-18 flex jc-start ai-center">{t("history.status")}</span>
            <span className="width-5 flex jc-end ai-center">{t("history.details")}</span>

        </div>
    );
    let body = (
        <>
            {txs.map((tr, index) => {
                return (
                    <div className={`column ${classes.striped} fs-0-9`} key={index}>

                        <div className={`${classes.row} row rounded-5 border-bottom px-1 py-2`} key={index} onDoubleClick={() => isOpen === index ? setIsOpen(null) : setIsOpen(index)}>
                            <span className="width-16 row jc-start ai-center">
                                <Date date={tr.createDate}/>
                            </span>
                            <span className="width-16 row jc-start ai-center">
                                {moment.utc(tr.createDate).local().format("HH:mm:ss")}
                            </span>

                            <span className="width-22 row jc-start ai-center">
                                {tr.destNetwork ?? "- - -"}
                            </span>

                            <span className="width-23 row jc-start ai-center text-red">
                                {new BN(tr?.amount).decimalPlaces(currencies[tr.currency].precision).toFormat()}
                            </span>

                            <span className="width-18 row jc-start ai-center">
                                {t("withdrawStatus." + tr.status )}
                            </span>
                            <span className="width-5 row jc-end ai-center fs-0-8" onClick={() => isOpen === index ? setIsOpen(null) : setIsOpen(index)}>
                                <Icon iconName={`${isOpen === index ? 'icon-up-open' : 'icon-down-open'}  text-blue fs-0-7 cursor-pointer`}
                                      customClass={classes.iconBG}
                                />
                            </span>
                        </div>
                        {isOpen === index && <div className={`width-100 column jc-start ai-start px-1 py-2 fs-0-9`}>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-40`}>{t("history.fee")}</span>
                                <span className={`width-60 text-end`}>
                                    {new BN(tr?.appliedFee).decimalPlaces(currencies[tr.currency].precision).toFormat()}
                                </span>
                            </div>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-40`}>{t("history.destAddress")}</span>
                                <span className={`width-60 text-end`}>
                                    {tr.destAddress}
                                </span>
                            </div>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-40`}>{t("history.withdrawId")}</span>
                                <span className={`width-60 text-end`}>
                                    {tr.withdrawId}
                                </span>
                            </div>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-40`}>{t("history.acceptDate")}</span>
                                <span className={`width-60 text-end`}>
                                    {
                                        tr.acceptDate ? <>
                                            <Date date={tr.acceptDate}/>
                                            <span className={``}> - {moment.utc(tr.acceptDate).local().format("HH:mm:ss")}</span>
                                        </> : "- - -"
                                    }
                                </span>
                            </div>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-40`}>{t("history.transactionRef")}</span>
                                <span className={`width-60 text-end break-word`}>
                                    {tr?.destTransactionRef ?? "- - -"}
                                </span>
                            </div>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-40`}>{t("history.statusReason")}</span>
                                <span className={`width-60 text-end`}>
                                    {tr?.statusReason ?? "- - -"}
                                </span>
                            </div>
                            { tr.status === "CREATED" && <div className={`row jc-center ai-center width-100 my-05`}>
                                <Button
                                    buttonClass={`${classes.thisButton} ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    buttonTitle={cancelWithdrawReqButtonTextHandler()}
                                    type="button"
                                    onClick={()=>cancelWithdrawReqFunc(tr.withdrawId)}
                                />
                            </div>}
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

export default WithdrawTxTable;
