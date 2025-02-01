import React, {useState} from 'react';
import classes from './DepositTxTable.module.css';
import {useTranslation} from "react-i18next";
import Date from "../../../../../../../../../../components/Date/Date";
import moment from "moment-jalaali";
import {BN} from "../../../../../../../../../../utils/utils";
import Icon from "../../../../../../../../../../components/Icon/Icon";
import {useSelector} from "react-redux";
import i18n from "i18next";

const DepositTxTable = ({txs}) => {

    const {t} = useTranslation();

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const [isOpen, setIsOpen] = useState(false);

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
                                {tr.network ?? "- - -"}
                            </span>

                            <span className="width-23 row jc-start ai-center text-green">
                                {new BN(tr?.amount).decimalPlaces(currencies[tr.currency].precision).toFormat()}
                            </span>

                            <span className="width-18 row jc-start ai-center">
                                {t("depositStatus." + tr.status )}
                            </span>
                            <span className="width-5 row jc-end ai-center fs-0-8" onClick={() => isOpen === index ? setIsOpen(null) : setIsOpen(index)}>
                                <Icon iconName={`${isOpen === index ? 'icon-up-open' : 'icon-down-open'}  text-blue fs-0-7 cursor-pointer`}
                                      customClass={classes.iconBG}
                                />
                            </span>
                        </div>
                        {isOpen === index && <div className={`width-100 column jc-start ai-start px-1 py-2 fs-0-9`}>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-30`}>{t("history.transactionRef")}</span>
                                <span className={`width-70 text-end break-word`}>
                                    {tr?.transactionRef ?? "- - -"}
                                </span>
                            </div>
                            <div className={`row width-100 my-05`}>
                                <span className={`width-30`}>{t("history.type")}</span>
                                <span className={`width-70 text-end`}>
                                    {tr.type}
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

export default DepositTxTable;
