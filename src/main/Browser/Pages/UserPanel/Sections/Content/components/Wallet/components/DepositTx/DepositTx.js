import React from 'react';
import classes from './DepositTx.module.css';
import {Link, useParams} from "react-router-dom";
import {Trans, useTranslation} from "react-i18next";
import {useGetDepositHistory} from "../../../../../../../../../../queries";
import Loading from "../../../../../../../../../../components/Loading/Loading";
import Error from "../../../../../../../../../../components/Error/Error";
import DepositTxTable from "../DepositTxTable/DepositTxTable";
import * as Routes from "../../../../../../../../Routes/routes";
import Icon from "../../../../../../../../../../components/Icon/Icon";
import i18n from "i18next";
import {useSelector} from "react-redux";
import {getCurrencyNameOrAlias} from "../../../../../../../../../../utils/utils";

const DepositTx = () => {

    const {id} = useParams();
    const {t} = useTranslation();

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const query = {
        "currency": id, // optional
        "category": null, // optional [DEPOSIT, FEE, TRADE, WITHDRAW, ORDER_CANCEL, ORDER_CREATE, ORDER_FINALIZED]
        "startTime": null,
        "endTime": null,
        "ascendingByTime": false,
        "limit": 10,
        "offset": 0,
    }

    const {data, isLoading, error, refetch} = useGetDepositHistory(query);


    const content = () => {
        if (isLoading) return <div style={{height: "40vh"}}><Loading/></div>
        if (error) return <div style={{height: "40vh"}}><Error/></div>
        if (data?.length === 0) return <div style={{height: "40vh"}} className={`flex jc-center ai-center`}>{t("noTx")}</div>
        else return <>
            <DepositTxTable txs={data}/>
        </>
    }

    return (
        <div className={`width-49 card-bg card-border column ${classes.container}`}>
            <div className="flex jc-between card-header-bg py-2 px-1">
                <h4>
                    <Trans
                        i18nKey="DepositTx.title"
                        values={{
                            currency: getCurrencyNameOrAlias(currencies[id], language),
                        }}
                    />
                </h4>
                <Link to={Routes.Deposit} className={`row jc-center ai-center cursor-pointer hover-text fs-0-7`}>
                    <span className={`ml-05`}>{t("DepositTx.showAll")}</span>
                    <Icon
                        iconName={`${i18n.language !== "fa" ? 'icon-right-open-1' : 'icon-left-open-1'} fs-01 flex`}
                        className={`mr-05`}/>
                </Link>
            </div>
            {content()}
        </div>
    );
};

export default DepositTx;
