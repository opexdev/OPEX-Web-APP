import React, {useEffect, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import classes from "../../Order.module.css";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-hot-toast";
import {BN, getCurrencyNameOrAlias, parsePriceString} from "../../../../../../../../../../../../utils/utils";
import NumberInput from "../../../../../../../../../../../../components/NumberInput/NumberInput";
import Button from "../../../../../../../../../../../../components/Button/Button";
import {setLastTransaction} from "../../../../../../../../../../../../store/actions/auth";
import {images} from "../../../../../../../../../../../../assets/images";
import {useGetUserAccount} from "../../../../../../../../../../../../queries/hooks/useGetUserAccount";
import {createOrder} from "js-api-client";
import i18n from "i18next";

const SellOrder = () => {

    const {t} = useTranslation();
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false)

    const tradeFee = useSelector((state) => state.auth.tradeFee)
    const isLogin = useSelector((state) => state.auth.isLogin)
    const activePair = useSelector((state) => state.exchange.activePair)
    const bestSellPrice = useSelector((state) => state.exchange.activePairOrders.bestSellPrice)
    const selectedSellOrder = useSelector((state) => state.exchange.activePairOrders.selectedSellOrder)

    const {data: userAccount} = useGetUserAccount()
    const base = userAccount?.wallets[activePair.baseAsset]?.free || 0;

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const [alert, setAlert] = useState({
        reqAmount: null,
        submit: false,
    });

    const [order, setOrder] = useState({
        tradeFee: new BN(0),
        stopLimit: false,
        stopMarket: false,
        stopPrice: new BN(0),
        reqAmount: new BN(0),
        pricePerUnit: new BN(0),
        totalPrice: new BN(0),
    });

    useEffect(() => {
        if (alert.submit) {
            setAlert({
                ...alert, submit: false
            })
        }
    }, [order])

    useEffect(() => {
        setOrder({
            tradeFee: new BN(0),
            stopLimit: false,
            stopMarket: false,
            stopPrice: new BN(0),
            reqAmount: new BN(0),
            pricePerUnit: new BN(0),
            totalPrice: new BN(0),
        })
        setAlert({
            submit: false,
            reqAmount: null,
            totalPrice: null,
        })
    }, [activePair])
    const isAllowed = ({floatValue}) => {
        return floatValue < 10 ** 12;
    }

    const currencyValidator = (key, val, rule) => {
        if (!val.isZero() && val.isLessThan(rule.min)) {
            return setAlert({
                ...alert,
                [key]: (
                    <Trans
                        i18nKey="orders.minOrder"
                        values={{
                            min: currencies[rule].min.toString(),
                            currency: getCurrencyNameOrAlias(currencies[rule], language),
                        }}
                    />
                ),
            });
        }
        if (!val.mod(currencies?.[rule]?.step).isZero()) {
            return setAlert({
                ...alert,
                [key]: (<Trans
                    i18nKey="orders.divisibility"
                    values={{mod: currencies?.[rule]?.step.toString()}}
                />)
            })
        }
        return setAlert({...alert, [key]: null});
    };

    const sellPriceHandler = (value, key) => {
        value = parsePriceString(value);
        switch (key) {
            case "reqAmount":
                const reqAmount = new BN(value);
                currencyValidator("reqAmount", reqAmount, activePair.baseAsset);
                setOrder({
                    ...order,
                    reqAmount,
                    totalPrice: reqAmount.multipliedBy(order.pricePerUnit).decimalPlaces(currencies[activePair.quoteAsset].precision),
                    tradeFee: reqAmount.multipliedBy(order.pricePerUnit).multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
                });
                break;
            case "pricePerUnit":
                const pricePerUnit = new BN(value);
                setOrder({
                    ...order,
                    pricePerUnit: pricePerUnit,
                    totalPrice: pricePerUnit.multipliedBy(order.reqAmount).decimalPlaces(currencies[activePair.quoteAsset].precision),
                    tradeFee: pricePerUnit.multipliedBy(order.reqAmount).multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.quoteAsset].precision),
                });
                break;
            case "totalPrice":
                const totalPrice = new BN(value);
                const req = totalPrice.dividedBy(order.pricePerUnit).decimalPlaces(currencies[activePair.baseAsset].precision);
                setOrder({
                    ...order,
                    reqAmount: req.isFinite() ? req : new BN(0),
                    totalPrice,
                    tradeFee: req.isFinite() ? totalPrice.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.quoteAsset].precision) : new BN(0),
                });
                currencyValidator("reqAmount", req, activePair.baseAsset);
                break;
            default:
        }
    };

    useEffect(() => {
        setOrder((prevState) => ({
            ...order,
            tradeFee: prevState.totalPrice.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
        }));
    }, [tradeFee]);

    useEffect(() => {
        sellPriceHandler(
            bestSellPrice.toString(),
            "pricePerUnit",
        );
    }, [order.stopMarket]);

    useEffect(() => {
        const reqAmount = new BN(selectedSellOrder.amount);
        const pricePerUnit = new BN(selectedSellOrder.pricePerUnit);
        setOrder({
            ...order,
            reqAmount,
            pricePerUnit: pricePerUnit,
            totalPrice: reqAmount.multipliedBy(pricePerUnit).decimalPlaces(currencies[activePair.quoteAsset].precision),
            tradeFee: reqAmount.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
        });
        currencyValidator("reqAmount", reqAmount, activePair.baseAsset);
    }, [selectedSellOrder]);

    const fillSellByWallet = () => {
        if (order.pricePerUnit.isEqualTo(0) && bestSellPrice === 0) return toast.error(t("orders.hasNoOffer"));
        if (order.pricePerUnit.isEqualTo(0)) {
            const reqAmount = new BN(base).decimalPlaces(currencies[activePair.baseAsset].precision);
            const pricePerUnit = new BN(bestSellPrice);
            setOrder({
                ...order,
                reqAmount: reqAmount,
                pricePerUnit: pricePerUnit,
                totalPrice: reqAmount.multipliedBy(pricePerUnit).decimalPlaces(currencies[activePair.quoteAsset].precision),
                tradeFee: reqAmount.multipliedBy(pricePerUnit).multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
            });
        } else {
            sellPriceHandler(
                base.toString(),
                "reqAmount",
            );
        }
    };

    const fillSellByBestPrice = () => {
        sellPriceHandler(
            bestSellPrice.toString(),
            "pricePerUnit",
        );
    };

    useEffect(() => {
        if (order.reqAmount.isGreaterThan(base)) {
            return setAlert({
                ...alert,
                reqAmount: t('orders.notEnoughBalance')
            })
        }
        if (alert.reqAmount === t('orders.notEnoughBalance')) {
            return setAlert({
                ...alert,
                reqAmount: null
            })
        }
    }, [order.reqAmount]);

    const submit = () => {
        if (!isLogin) return false

        if (isLoading) return false

        setIsLoading(true)
        createOrder(activePair.symbol, "SELL", order)
            .then((res) => {
                setOrder({
                    tradeFee: new BN(0),
                    stopLimit: false,
                    stopMarket: false,
                    stopPrice: new BN(0),
                    reqAmount: new BN(0),
                    pricePerUnit: new BN(0),
                    totalPrice: new BN(0),
                })
                toast.success(<Trans
                    i18nKey="orders.success"
                    values={{
                        base: getCurrencyNameOrAlias(currencies[activePair.baseAsset], language),
                        quote: getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language),
                        type: t("sell"),
                        reqAmount: order.reqAmount,
                        pricePerUnit: order.pricePerUnit,
                    }}
                />);
                dispatch(setLastTransaction(res.data.transactTime))
            }).catch(() => {
            toast.error(t("orders.error"));
            setAlert({
                ...alert, submit: true
            })
        }).finally(() => {
            setIsLoading(false)
        })

    }
    const submitButtonTextHandler = () => {
        if (isLoading) return <img className={`${classes.thisLoading}`} src={images.linearLoading} alt="linearLoading"/>

        if (isLogin) return t("sell")

        return t("pleaseLogin")
    }

    return (
        <div className={`column jc-between ${classes.content}`}>
            <div className="column jc-center">
                <p onClick={() => fillSellByWallet()}>{t("orders.availableAmount")}:{" "}
                    <span
                        className="cursor-pointer">{new BN(base).toFormat()}{" "}{getCurrencyNameOrAlias(currencies[activePair.baseAsset], language)}</span>
                </p>
                <p onClick={() => fillSellByBestPrice()}>
                    {t("orders.bestOffer")}:{" "}
                    <span className="cursor-pointer">
                        {new BN(bestSellPrice).toFormat()}{" "}{getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
                    </span>
                </p>
            </div>
            {/*
            <div className="row ai-center">
                <span className="pl-05">{t("orders.stopLimit")}</span>
                <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={order.stopLimit}
                    onChange={(e) => setOrder({...order, stopLimit: e.target.checked})}
                />
            </div>
            {order.stopLimit ? (
                <NumberInput
                    lead={t("orders.stopPrice")}
                    after={t("currency." + props.activePair.baseAsset)}
                    value={order.stopPrice}
                    maxDecimal={props.activePair.baseAssetPrecision}
                    onchange={(value) =>
                        setOrder({...order, stopPrice: value.floatValue})
                    }
                />
            ) : (
                ""
            )}*/}

            <NumberInput
                lead={t("orders.amount")}
                after={getCurrencyNameOrAlias(currencies[activePair.baseAsset], language)}
                value={order.reqAmount.toFormat()}
                maxDecimal={currencies[activePair.baseAsset].precision}
                onchange={(e) => sellPriceHandler(e.target.value, "reqAmount")}
                alert={alert.reqAmount}
                isAllowed={isAllowed}
            />

            {order.stopMarket ? (
                <NumberInput
                    customClass={classes.stopMarket}
                    lead={t("orders.pricePerUnit")}
                    prefix="~"
                    after={getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
                    value={order.pricePerUnit.toFormat()}
                    maxDecimal={currencies[activePair.quoteAsset].precision}
                    onchange={(e) => sellPriceHandler(e.target.value, "pricePerUnit")}
                    isAllowed={isAllowed}
                />
            ) : (
                <NumberInput
                    lead={t("orders.pricePerUnit")}
                    after={getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
                    value={order.pricePerUnit.toFormat()}
                    maxDecimal={currencies[activePair.quoteAsset].precision}
                    onchange={(e) => sellPriceHandler(e.target.value, "pricePerUnit")}
                    isAllowed={isAllowed}
                />
            )}

            <div className="row ai-center">
                <span className="pl-05">{t("orders.marketSellPrice")}</span>
                <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={order.stopMarket}
                    onChange={(e) => setOrder({...order, stopMarket: e.target.checked})}
                />
            </div>

            <NumberInput
                lead={t("orders.totalPrice")}
                value={order.totalPrice.toFormat()}
                maxDecimal={currencies[activePair.quoteAsset].precision}
                after={getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
                onchange={(e) => sellPriceHandler(e.target.value, "totalPrice")}
                alert={alert.totalPrice}
                isAllowed={isAllowed}
            />

            <div className="column jc-center">
                <p>
                    {t("orders.tradeFee")}:{" "}
                    {order.tradeFee.toFormat()}{" "}
                    {getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
                </p>
                <p>
                    {t("orders.getAmount")}:{" "}
                    {order.totalPrice.minus(order.tradeFee).decimalPlaces(currencies[activePair.quoteAsset].precision).toFormat()}{" "}
                    {getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
                </p>
            </div>
            <Button
                buttonClass={`${classes.thisButton} ${classes.sellOrder} ${isLoading ? "cursor-not-allowed" : "cursor-pointer"} flex jc-center ai-center`}
                type="submit"
                onClick={submit}
                disabled={alert.reqAmount || order.reqAmount.isZero() || order.pricePerUnit.isZero() || !isLogin}
                buttonTitle={submitButtonTextHandler()}
            />
        </div>
    );
};

export default SellOrder;
