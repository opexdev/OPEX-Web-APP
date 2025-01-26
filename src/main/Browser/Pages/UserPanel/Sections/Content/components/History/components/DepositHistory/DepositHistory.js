import React, {useEffect, useRef, useState} from 'react';
import {Trans, useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {useGetDepositHistory} from "../../../../../../../../../../queries";
import moment from "moment-jalaali";
import Loading from "../../../../../../../../../../components/Loading/Loading";
import Error from "../../../../../../../../../../components/Error/Error";
import Date from "../../../../../../../../../../components/Date/Date";
import TextInput from "../../../../../../../../../../components/TextInput/TextInput";
import classes from "./DepositHistory.module.css";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import i18n from "i18next";
import ToggleSwitch from "../../../../../../../../../../components/ToggleSwitch/ToggleSwitch";
import Button from "../../../../../../../../../../components/Button/Button";
import DepositHistoryTable from "../DepositHistoryTable/DepositHistoryTable";
import {getCurrencyNameOrAlias} from "../../../../../../../../../../utils/utils";


const DepositHistory = () => {

    const {t} = useTranslation();
    const coins = useSelector((state) => state.exchange.assets)

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)


    const [query, setQuery] = useState({
        "currency": null, // optional
        "category": null, // optional [DEPOSIT, FEE, TRADE, WITHDRAW, ORDER_CANCEL, ORDER_CREATE, ORDER_FINALIZED]
        "startTime": null,
        "endTime": null,
        "ascendingByTime": false,
        "limit": 10,
        "offset": 0,
    });

    const {data, isLoading, error, refetch} = useGetDepositHistory(query);

    const pagination = {
        page: (query.offset / query.limit) + 1,
        isLastPage: data?.length < query.limit
    }

    const isFirst = useRef(true);

    useEffect(() => {
        if (!isFirst.current) scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [data]);

    const categories = ['DEPOSIT', 'FEE', 'TRADE', 'WITHDRAW', 'ORDER_CANCEL', 'ORDER_CREATE', 'ORDER_FINALIZED'];

    const currenciesOptions = [{value: null, label: t('all')}]
    const categoryOptions = [{value: null, label: t('all')}]

    const size = [10, 20, 30, 40, 50]

    categories.forEach((o) => {
        categoryOptions.push({value: o, label: t('TransactionCategory.' + o)})
    })



    Object.keys(currencies).forEach((o) => {
        currenciesOptions.push({value: o, label: getCurrencyNameOrAlias(currencies[o], language)})
    })


    const scrollRef = useRef(null);


    const pageSizeHandler = (e) => {
        setQuery({
            ...query,
            limit: e.value,
            offset: 0
        })
    }

    const firstPage = () => {
        setQuery({
            ...query,
            offset: 0
        })
    }
    const nextPage = () => {
        isFirst.current = false;
        setQuery({
            ...query,
            offset: query.offset + query.limit
        })
    }
    const prevPage = () => {
        setQuery({
            ...query,
            offset: query.offset - query.limit
        })
    }
    const startDateHandler = (dateRange) => {
        const start = dateRange[0]  ? moment.unix(dateRange[0].toUnix()).startOf("day").valueOf() : null;
        const end = dateRange[1]  ? moment.unix(dateRange[1].toUnix()).endOf("day").valueOf() : null;
        setQuery({
            ...query,
            startTime: start,
            endTime: end
        })
    }


    const content = () => {
        if (isLoading) return <div style={{height: "40vh"}}><Loading/></div>
        if (error) return <div style={{height: "40vh"}}><Error/></div>
        if (data?.length === 0) return <div style={{height: "40vh"}} className={`flex jc-center ai-center`}>{t("noTx")}</div>
        else return <>
            <DepositHistoryTable txs={data} offset={query?.offset} />
        </>
    }

    const periodTextHandler = () => {
        if (query?.startTime && query?.endTime) return <>
            <span className={`mx-05`}>{t("from")}</span>
            <span><Date date={query?.startTime}/></span>
            <span className={`mx-05`}>{t("until")}</span>
            <span><Date date={query?.endTime}/></span>
        </>
        if (query?.startTime) return <>
            <span className={`mx-05`}>{t("from")}</span>
            <span><Date date={query?.startTime}/></span>
            <span className={`mx-05`}>{t("until")}</span>
            <span><Date date={moment().endOf("day").valueOf()}/></span>
        </>
    }


    return (
        <div className={`width-100 column my-3`} ref={scrollRef}>

            <div className={`width-100 row jc-between ai-center`}>
                <TextInput
                    select={true}
                    placeholder={t('history.currency')}
                    options={currenciesOptions}
                    lead={t('history.currency')}
                    type="select"
                    value={{
                        value: query?.currency,
                        label:  query?.currency ? getCurrencyNameOrAlias(currencies[query?.currency], language) : t('all'),
                    }}
                    onchange={(e) => setQuery({...query, currency: e.value, offset:0})}
                    customClass={`width-20 ${classes.thisInput}`}
                />
                <TextInput
                    select={true}
                    placeholder={t('history.size')}
                    options={size?.map(s => {
                        return {label: s, value: s}
                    })}
                    lead={t('history.size')}
                    type="select"
                    value={{
                        value: query?.limit,
                        label: query?.limit,
                    }}
                    onchange={pageSizeHandler}
                    customClass={`width-20 ${classes.thisInput}`}
                />
                <TextInput
                    datePicker={true}
                    //placeholder={t('history.size')}
                    //numberOfMonths={2}
                    plugins={[
                        <DatePanel />
                    ]}
                    lead={t('history.period')}
                    type="input"
                    onChange={startDateHandler}
                    /*value={[query.startTime, query.endTime]}*/
                    value={[query.startTime, query.endTime]}
                    dateSeparator={" " + t('to') + " "}
                    range
                    hideOnScroll
                    dataPanelPosition="Bottom"
                    position={`${i18n.language === "fa" ? "bottom-left" : "bottom-right" }`}
                    customClass={`width-20 ${classes.thisInput} ${classes.datePicker} `}
                />
                <div className={`width-15 row jc-end ai-center fs-0-8`}>
                    <span className={`fs-0-8 ml-1`}>{t("history.ascendingByTime")}</span>
                    <ToggleSwitch

                        onchange={ () => setQuery(prevState => {return {
                            ...prevState,
                            ascendingByTime: !prevState.ascendingByTime
                        }}) }
                        checked={!query?.ascendingByTime}/>
                </div>
            </div>

            <div className={`card-bg card-border width-100 my-4`} >
                <div className={`card-header-bg row jc-between ai-center px-2 py-5`}>
                    <div className={`row jc-center ai-center`}>
                        <h3 className={``}>{t("history.depositHistory")}</h3>
                        <div className={`row mx-1 text-gray`}>
                            {periodTextHandler()}
                        </div>
                        { data?.length !== 0 && <span className={`fs-0-9 flx jc-center ai-center text-gray`}>
                            <Trans
                                i18nKey="history.page"
                                values={{
                                    page: (query?.offset / query?.limit) + 1,
                                }}
                            />
                        </span>}
                    </div>

                    <div className={`row jc-start ai-center `}>
                        <Button
                            buttonClass={`${classes.thisButton} px-2`}
                            buttonTitle={t('first')}
                            disabled={pagination.page === 1}
                            type="button"
                            onClick={firstPage}
                        />
                        <Button
                            buttonClass={`${classes.thisButton} px-2 mx-2`}
                            buttonTitle={t('prev')}
                            disabled={pagination.page === 1}
                            type="button"
                            onClick={prevPage}
                        />
                        <Button
                            buttonClass={`${classes.thisButton} px-2`}
                            buttonTitle={t('next')}
                            disabled={pagination.isLastPage}
                            type="button"
                            onClick={nextPage}
                        />
                    </div>

                </div>
                <div>
                    {content()}
                </div>
                <div className={`row jc-start ai-center width-100 mb-5 width-100 border card-bg px-2 py-3 rounded-8`}>
                    <Button
                        buttonClass={`${classes.thisButton} px-2`}
                        buttonTitle={t('first')}
                        disabled={pagination.page === 1}
                        type="button"
                        onClick={firstPage}
                    />
                    <Button
                        buttonClass={`${classes.thisButton} px-2 mx-2`}
                        buttonTitle={t('prev')}
                        disabled={pagination.page === 1}
                        type="button"
                        onClick={prevPage}
                    />
                    <Button
                        buttonClass={`${classes.thisButton} px-2`}
                        buttonTitle={t('next')}
                        disabled={pagination.isLastPage}
                        type="button"
                        onClick={nextPage}
                    />
                </div>

            </div>

        </div>
    );
};

export default DepositHistory;
