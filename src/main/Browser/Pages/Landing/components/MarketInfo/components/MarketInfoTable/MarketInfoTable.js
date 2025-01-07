import React from 'react';
import classes from './MarketInfoTable.module.css'
import {useTranslation} from "react-i18next";
import {images} from "../../../../../../../../assets/images";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import i18n from "i18next";
import {setActivePairInitiate} from "../../../../../../../../store/actions";
import {useDispatch, useSelector} from "react-redux";
import {Panel} from "../../../../../../Routes/routes";
import {useNavigate} from "react-router-dom";

const MarketInfoTable = ({data, activeCurrency}) => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)
    const allExchangeSymbols = useSelector((state) => state.exchange.symbols)

    const navigateToPanel = (symbol) => {
        const selectedPair = allExchangeSymbols.find( s => s.symbol === symbol)
        dispatch(setActivePairInitiate(selectedPair, 0))
        navigate(Panel)
    }

    let head = (
        <div className="row text-gray px-2 py-2" style={{backgroundColor:"var(--tableHeader)"}}>
            <span className="width-30 flex jc-start ai-center">{t("MarketInfo.name")}</span>
            <span className="width-25 flex jc-start ai-center">{t("MarketInfo.lastPrice")}</span>
            <span className="width-25 flex jc-start ai-center">{t("MarketInfo.priceChange")}</span>
            <span className="width-20 flex jc-start ai-center">{t("MarketInfo.volume")}</span>
            <span className="width-25 flex jc-end ai-center">{t("MarketInfo.chart")}</span>
        </div>
    );

    let body = (
        <>
         {data.map((tr, index) => {
            return (
                <div className={`${classes.row} row fs-01 rounded-5 border-bottom cursor-pointer px-2 py-2`}  key={index} onClick={() => navigateToPanel(tr.symbol)}>
                    <span className="width-30 row jc-start ai-center">
                        <img src={currencies[tr?.base]?.icon} alt={tr?.base}
                             title={tr?.base} className={`img-lg ml-05`}/>
                        <span className={`fs-01 mr-05`}>{activeCurrency ?
                            <>
                                {getCurrencyNameOrAlias(currencies[tr?.base], language)}
                                <span className={`text-gray fs-0-8 mr-05`}>{tr?.base}</span>
                            </>
                            : tr?.base + " / " + tr?.quote}</span>
                    </span>

                    <span className={`width-25 flex jc-start ai-center ${tr.priceChangePercent > 0 ? "text-green" : "text-red"}`}>{new BN(tr.lastPrice).decimalPlaces(currencies[tr?.quote]?.precision ?? 0).toFormat()} <span className={`fs-0-7 mr-05`}>{tr?.quote}</span></span>

                    <span className={`width-25 flex ${i18n.language !== "fa" ? 'jc-start' : 'jc-end'} ai-center ${tr.priceChangePercent > 0 ? "text-green" : tr.priceChangePercent < 0 ? "text-red" : ""} direction-ltr`}>{tr.priceChangePercent === 0 ? "0 %" : `${new BN(tr.priceChangePercent).toFormat(2)} %`}</span>

                    <span className="width-20 flex jc-start ai-center">{new BN(tr.volume).decimalPlaces(currencies[tr?.base]?.precision ?? 0).toFormat()} <span className={`text-gray fs-0-8 mr-05`}>{tr?.base}</span></span>

                    <span className="width-25 flex jc-end ai-center position-relative">
                        <img
                            className={`img-lg-2 ${classes.filter}`}
                            src={images.chart}
                            alt={""}
                            title={""}
                        />
                        <span className={`fs-0-6 position-absolute`} style={{left:`${i18n.language !== "fa" ? "68%" : "13%"}`}}>{t("comingSoon")}</span>
                    </span>
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

export default MarketInfoTable;
