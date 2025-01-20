import React, {useEffect, useState} from "react";
import classes from "./OrderBookTable.module.css";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import {useDispatch, useSelector} from "react-redux";
import {BN} from "../../../../../../../../../../../../utils/utils";
import ScrollBar from "../../../../../../../../../../../../components/ScrollBar";
import {
    setBestBuyPrice,
    setBestSellPrice,
    setBuyOrder,
    setSellOrder
} from "../../../../../../../../../../../../store/actions";

const OrderBookTable = ({data, type}) => {
    const {t} = useTranslation();
    const [selected, setSelected] = useState({buy: -1, sell: -1});
    const activePair = useSelector((state) => state.exchange.activePair)
    const dispatch = useDispatch();

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    let header;

    let totalAmount = data.reduce((total, asks) => parseFloat(asks[1]) + total, 0);
    let avg = {pricePerUnit: new BN(0), amount: new BN(0), total: new BN(0)};
    let start = "right";
    let end = "left";

    if (i18n.language !== "fa") {
        start = "left";
        end = "right";
    }

    if (type === "buy") {
        header = (
            <div className="row jc-between">
                <span className="width-30">{t("pricePerUnit")}</span>
                <span className="width-30">{t("volume")}</span>
                <span className="width-40">{t("totalPrice")}</span>
            </div>
        );
    } else {
        header = (
            <div className="row jc-between">
                <span className="width-40">{t("totalPrice")}</span>
                <span className="width-30">{t("volume")}</span>
                <span className="width-30">{t("pricePerUnit")}</span>
            </div>
        );
    }
    useEffect(() => {
        if (data.length > 0) {
            totalAmount = data.reduce((total, asks) => parseFloat(asks[1]) + total, 0);
            type === "buy"
                ? dispatch(setBestSellPrice(data[0][0]))
                : dispatch(setBestBuyPrice(data[0][0]));
        }
    }, [data]);

    const backgroundBar = (percent) => {
        if (type === "buy") {
            return {
                background: `linear-gradient(to ${end}, var(--greenAlpha) ${percent}%, transparent ${percent}%) no-repeat`,
            };
        }
        return {
            background: `linear-gradient(to ${start}, var(--redAlpha) ${percent}%, transparent ${percent}%) no-repeat`,
        };
    }

    const toolTipHandler = (average, index) => {
        return `<div class="column jc-between col-100">
      <div class="row jc-between col-100">
        <span class="pl-05">${t("averagePrice")}:</span>
        <span>${average.pricePerUnit.dividedBy(index + 1).decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</span>
      </div>
      <div class="row jc-between col-100">
        <span class="pl-05">${t("totalVolume",)}:</span>
        <span>${average.amount.decimalPlaces(currencies[activePair.baseAsset].precision).toFormat()}</span>
      </div>
      <div class="row jc-between col-100">
        <span class="pl-05">${t("totalPrice")}:</span>
        <span>${average.total.decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</span>
      </div>
    </div>`
    }

    return (
        <div className={`column width-100 ${classes.container}`}>
            <ScrollBar>
                <div className="text-center">
                    <div className={` ${classes.thead} `}>{header}</div>
                    <div className={` ${classes.tbody} `}>
                        {data.map((tr, index) => {
                            const pricePerUnit = new BN(tr[0])
                            const amount = new BN(tr[1])
                            const percent = amount.multipliedBy(100).dividedBy(totalAmount)
                            const totalPrice = pricePerUnit.multipliedBy(amount)

                            avg = {
                                pricePerUnit: pricePerUnit.plus(avg.pricePerUnit),
                                amount: amount.plus(avg.amount),
                                total: totalPrice.plus(avg.total)
                            }
                            return type === "buy" ? (
                                <div
                                    key={index}
                                    style={backgroundBar(percent.toString())}
                                    onMouseEnter={() => setSelected({...selected, sell: index})}
                                    onMouseLeave={() => setSelected({...selected, sell: -1})}
                                    data-tooltip-id="opex-tooltip"
                                    className={`${selected.sell >= index ? `${classes.selected}` : ""} cursor-pointer row jc-between ${classes.tbodyRow}`}
                                    data-tooltip-place="bottom"
                                    data-tooltip-float={true}
                                    data-tooltip-html={toolTipHandler(avg, index)}
                                    data-amount={avg.amount.toString()}
                                    onClick={(e) => dispatch(setSellOrder({
                                        pricePerUnit: pricePerUnit.decimalPlaces(currencies[activePair.quoteAsset].precision).toString(),
                                        amount: parseFloat(e.currentTarget.getAttribute("data-amount")),
                                    }))}>
                                    <span
                                        className="width-30">{pricePerUnit.decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</span>
                                    <span
                                        className="width-30">{amount.decimalPlaces(currencies[activePair.baseAsset].precision).toFormat()}</span>
                                    <span
                                        className="width-40">{totalPrice.decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</span>
                                </div>
                            ) : (
                                <div
                                    key={index}
                                    style={backgroundBar(percent.toString())}
                                    onMouseEnter={() => setSelected({...selected, buy: index})}
                                    onMouseLeave={() => setSelected({...selected, buy: -1})}
                                    data-tooltip-id="opex-tooltip"
                                    className={`${selected.buy >= index ? `${classes.selected}` : ""} cursor-pointer row jc-between ${classes.tbodyRow}`}
                                    data-tooltip-place="bottom"
                                    data-tooltip-float={true}
                                    data-tooltip-html={toolTipHandler(avg, index)}
                                    data-amount={avg.amount.toString()}
                                    onClick={(e) =>
                                        dispatch(setBuyOrder({
                                            pricePerUnit: parseFloat(pricePerUnit.decimalPlaces(currencies[activePair.quoteAsset].precision).toString()),
                                            amount: parseFloat(e.currentTarget.getAttribute("data-amount")),
                                        }))
                                    }>
                                    <span
                                        className="width-40">{totalPrice.decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</span>
                                    <span
                                        className="width-30">{amount.decimalPlaces(currencies[activePair.baseAsset].precision).toFormat()}</span>
                                    <span
                                        className="width-30">{pricePerUnit.decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </ScrollBar>
        </div>
    );
};

export default OrderBookTable;
