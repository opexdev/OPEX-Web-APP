import React from 'react';
import {images} from "../../../../../../../../assets/images";
import i18n from "i18next";
import {BN, getCurrencyNameOrAlias} from "../../../../../../../../utils/utils";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

const MostVolume = ({mostVolume}) => {

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    return (
        <>
            <img src={currencies[mostVolume?.pairInfo?.baseAsset]?.icon}
                 alt={mostVolume?.pairInfo?.baseAsset}
                 title={mostVolume?.pairInfo?.baseAsset}
                 className={`img-md-plus`}/>
            <span>{getCurrencyNameOrAlias(currencies[mostVolume?.pairInfo?.baseAsset], language)}</span>
            <div className={`${i18n.language !== "fa" ? 'row-reverse' : 'row'} jc-center ai-center width-100`}>
                <span className={`${i18n.language !== "fa" ? 'mr-025' : 'ml-025'} fs-0-6`}>{mostVolume?.pairInfo?.baseAsset}</span>
                <span className={`${i18n.language !== "fa" ? 'mL-025' : 'mr-025'} fs-01`}>{new BN(mostVolume?.volume).decimalPlaces(currencies[mostVolume?.pairInfo?.baseAsset]?.precision ?? 0).toFormat()}</span>
            </div>

            {/*++ to do ++*/}

            {/*<div className={`row jc-center ai-center width-100`}>
                <span  className={`${mostVolume?.change > 0 ? "text-green" : "text-red"} direction-ltr`}>{new BN(mostVolume?.change).toFormat(2)} %</span>
            </div>*/}
        </>
    );
};

export default MostVolume;
