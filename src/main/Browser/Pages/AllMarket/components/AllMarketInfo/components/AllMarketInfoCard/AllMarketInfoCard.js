import React, {useState} from 'react';
import classes from './AllMarketInfoCard.module.css'
import {useTranslation} from "react-i18next";
import {images} from "../../../../../../../../assets/images";
import Button from "../../../../../../../../components/Button/Button";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import {setActivePairInitiate} from "../../../../../../../../store/actions";
import {Panel} from "../../../../../../Routes/routes";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import i18n from "i18next";

const AllMarketInfoCard = ({data, activeCurrency}) => {


    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)
    const allExchangeSymbols = useSelector((state) => state.exchange.symbols)

    const [showButton, setShowButton] = useState(null)

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

    const MouseEnterEventHandler = (index) => {
        setShowButton(index)
    }
    const MouseLeaveEventHandler = () => {
        setShowButton(null)
    }

    const navigateToPanel = (symbol) => {
        const selectedPair = allExchangeSymbols.find( s => s.symbol === symbol)
        dispatch(setActivePairInitiate(selectedPair, 0))
        navigate(Panel)
    }


    return (
        <div className={`${classes.container} my-1 px-1`}>

            {data.map((tr, index) => {
                return (
                    <div key={index} className={`${classes.item} card-border card-bg column cursor-pointer`} style={backgroundBar(tr.priceChangePercent.toString())}
                         onMouseEnter={()=>MouseEnterEventHandler(index)} onMouseLeave={MouseLeaveEventHandler}>
                        <div className={`column jc-between ai-center pt-2 pb-3`} style={{height:"80%"}}>
                            <div className={`column jc-start ai-start width-100 px-1`}>
                                <div className={`row jc-center ai-center`}>
                                    <img src={currencies[tr?.base]?.icon} alt={tr?.base}
                                          title={tr?.base} className={`img-md-plus ml-05`}/>

                                    <span className={`fs-01`}>{activeCurrency ?
                                        <>
                                            {getCurrencyNameOrAlias(currencies[tr?.base], language)}
                                            <span className={`text-gray fs-0-8 mr-05`}>{tr?.base}</span>
                                        </>
                                        : tr?.base + " / " + tr?.quote}</span>
                                </div>
                                <div className={`flex jc-end ai-center fs-0-6`}>
                                    <span className={`flex ${i18n.language !== "fa" ? 'jc-start' : 'jc-end'} ai-center ${tr.priceChangePercent > 0 ? "text-green" : tr.priceChangePercent < 0 ? "text-red" : ""} direction-ltr`}>{tr.priceChangePercent === 0 ? "0 %" : `${new BN(tr.priceChangePercent).toFormat(2)} %`}</span>
                                </div>
                            </div>
                            <div className={`column px-1 width-100 fs-0-7`}>
                                <div className={`row jc-between ai-center`}>
                                    <span className={``}>{t("MarketInfo.lastPrice")}:</span>
                                    <span className={`${tr.priceChangePercent > 0 ? "text-green" : "text-red"} fs-01`}>{new BN(tr.lastPrice).toFormat()} <span className={`fs-0-7 mr-025`}>{tr?.quote}</span></span>
                                </div>
                                <div className={`row jc-between ai-center`}>
                                    <span className={`text-gray`}>{t("MarketInfo.lowPrice")}:</span>
                                    <span>{new BN(tr.lowPrice).decimalPlaces(currencies[tr?.quote]?.precision ?? 0).toFormat()} <span className={`fs-0-7 mr-05`}>{tr?.quote}</span></span>
                                </div>
                                <div className={`row jc-between ai-center`}>
                                    <span className={`text-gray`}>{t("MarketInfo.highPrice")}:</span>
                                    <span>{new BN(tr.highPrice).decimalPlaces(currencies[tr?.quote]?.precision ?? 0).toFormat()} <span className={`fs-0-7 mr-05`}>{tr?.quote}</span></span>
                                </div>
                                <div className={`row jc-between ai-center`}>
                                    <span className={`text-gray`}>{t("MarketInfo.volume")}:</span>
                                    <span>{new BN(tr.volume).decimalPlaces(currencies[tr?.base]?.precision ?? 0).toFormat()} <span className={`fs-0-7 mr-05`}>{tr?.base}</span></span>
                                </div>
                            </div>
                        </div>
                        <div className={`flex jc-center ai-center`} style={{height:"20%"}}>
                            { showButton === index ?
                                <div className={`row jc-between width-90`}>
                                    <Button
                                        buttonClass={`${classes.thisButton} mx-05`}
                                        type="button"
                                        // onClick={() => navigate("/", { replace: true })}
                                        buttonTitle={t("MarketInfo.details")}
                                    />
                                    <Button
                                        buttonClass={`${classes.thisButton} mx-05`}
                                        type="button"
                                        onClick={() => navigateToPanel(tr.symbol)}
                                        buttonTitle={t("MarketInfo.trade")}
                                    />
                                </div>
                                :
                                <div className={`column jc-center ai-center position-relative`}>
                                    <img
                                        className={`img-lg-2 mb-05 ${classes.filter}`}
                                        src={images.chart}
                                        alt={""}
                                        title={""}
                                    />
                                    <span className={`fs-0-6 position-absolute`} style={{left:`${i18n.language !== "fa" ? "20%" : "40%"}`}}>{t("comingSoon")}</span>
                                </div>
                            }
                        </div>
                    </div>
                )
            })}

        </div>
    );
};

export default AllMarketInfoCard;
