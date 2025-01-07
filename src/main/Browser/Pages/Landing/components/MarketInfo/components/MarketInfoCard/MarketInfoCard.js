import React from 'react';
import classes from './MarketInfoCard.module.css'
import {images} from "../../../../../../../../assets/images";
import {useTranslation} from "react-i18next";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import {setActivePairInitiate} from "../../../../../../../../store/actions";
import {Panel} from "../../../../../../Routes/routes";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import i18n from "i18next";

const MarketInfoCard = ({data, activeCurrency}) => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)
    const allExchangeSymbols = useSelector((state) => state.exchange.symbols)

    const backgroundBar = (percent) => {
        if (percent > 0) {
            return {
                background: `linear-gradient(#ffffff00 0%, #ffffff00 50%,  var(--greenAlphaGradient) 100%)`,
            };
        }
        return {
            background: `linear-gradient(#ffffff00 0%,#ffffff00 50%, var(--redAlphaGradient) 100%)`,
        };
    }

    const navigateToPanel = (symbol) => {
        const selectedPair = allExchangeSymbols.find( s => s.symbol === symbol)
        dispatch(setActivePairInitiate(selectedPair, 0))
        navigate(Panel)
    }

    return (
        <div className={`${classes.container} my-3 px-1`}>
            {data.map((tr, index) => {
                return (
                    <div className={`${classes.item} card-border card-bg column jc-between ai-center py-3 cursor-pointer`} style={backgroundBar(tr.priceChangePercent.toString())} key={index} onClick={() => navigateToPanel(tr.symbol)}>
                        <div className={`row jc-center ai-center width-100`}>
                            <img src={currencies[tr?.base]?.icon} alt={tr?.base}
                                 title={tr?.base} className={`img-lg ml-05`}/>
                            <div className={`column mr-05`}>
                                <span className={`fs-01`}>{activeCurrency ?
                                    <>
                                        {getCurrencyNameOrAlias(currencies[tr?.base], language)}
                                        <span className={`text-gray fs-0-8 mr-05`}>{tr?.base}</span>
                                    </>
                                    : tr?.base + " / " + tr?.quote}</span>
                                <span className={`flex ${i18n.language !== "fa" ? 'jc-end' : 'jc-start'} ai-center ${tr.priceChangePercent > 0 ? "text-green" : tr.priceChangePercent < 0 ? "text-red" : ""} direction-ltr`}>{tr.priceChangePercent === 0 ? "0 %" : `${new BN(tr.priceChangePercent).toFormat(2)} %`}</span>

                            </div>
                        </div>
                        <span className={`${tr.priceChangePercent > 0 ? "text-green" : "text-red"} fs-02`}>{new BN(tr.lastPrice).decimalPlaces(currencies[tr?.quote]?.precision ?? 0).toFormat()} <span className={`fs-0-7 mr-05`}>{tr?.quote}</span></span>
                        <div className={`row jc-center ai-center width-100`}>
                            <span className={`text-gray ml-05`}>{t("MarketInfo.volume")}:</span>
                            <span className={`mr-05`}>{new BN(tr.volume).decimalPlaces(currencies[tr?.base]?.precision ?? 0).toFormat()} <span className={`text-gray fs-0-8 mr-05`}>{tr?.base}</span></span>
                        </div>
                        <div className={`column jc-center ai-center position-relative`}>
                            <img
                                className={`img-lg-2 mb-05 ${classes.filter}`}
                                src={images.chart}
                                alt={""}
                                title={""}
                            />
                            <span className={`fs-0-6 position-absolute`}
                                  style={{left: "35%"}}>{t("comingSoon")}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default MarketInfoCard;