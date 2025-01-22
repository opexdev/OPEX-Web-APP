import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-hot-toast";
import classes from "../../Order.module.css";
import React, {useEffect, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import {BN, getCurrencyNameOrAlias, parsePriceString} from "../../../../../../../../../../../../utils/utils";
import NumberInput from "../../../../../../../../../../../../components/NumberInput/NumberInput";
import Button from "../../../../../../../../../../../../components/Button/Button";
import {setLastTransaction} from "../../../../../../../../../../../../store/actions/auth";
import {images} from "../../../../../../../../../../../../assets/images";
import {useGetUserAccount} from "../../../../../../../../../../../../queries/hooks/useGetUserAccount";
import {createOrder} from "js-api-client";
import i18n from "i18next";

const BuyOrder = () => {

    const {t} = useTranslation();
    const dispatch = useDispatch();

    const {data: userAccount} = useGetUserAccount()
    const [isLoading, setIsLoading] = useState(false)

    const activePair = useSelector((state) => state.exchange.activePair)
    const bestBuyPrice = useSelector((state) => state.exchange.activePairOrders.bestBuyPrice)
    const selectedBuyOrder = useSelector((state) => state.exchange.activePairOrders.selectedBuyOrder)

    const language = i18n.language
    const currencies = useSelector((state) => state.exchange.currencies)

    const tradeFee = useSelector((state) => state.auth.tradeFee)
    const isLogin = useSelector((state) => state.auth.isLogin)

    const quote = userAccount?.wallets[activePair.quoteAsset]?.free || 0;

    const [alert, setAlert] = useState({
        submit: false,
        reqAmount: null,
        totalPrice: null,
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


    const currencyValidator = (key, val, rule) => {

        console.log("activePair.baseRange", activePair.baseRange)

        console.log("rule", rule)

        console.log("currencies?.[rule].step", currencies?.[rule]?.step)


        if (!val.isZero() && val.isLessThan(currencies[rule].minOrder)) {
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

    const buyPriceHandler = (value, key) => {
        value = parsePriceString(value);
        switch (key) {
            case "reqAmount":
                const reqAmount = new BN(value);
                currencyValidator("reqAmount", reqAmount, activePair.baseAsset);
                setOrder({
                    ...order,
                    reqAmount,
                    /*totalPrice: reqAmount.multipliedBy(order.pricePerUnit).decimalPlaces(activePair.quoteAssetPrecision),*/
                    totalPrice: reqAmount.multipliedBy(order.pricePerUnit).decimalPlaces(currencies[activePair.quoteAsset].precision),
                    /*tradeFee: reqAmount.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(activePair.baseAssetPrecision),*/
                    tradeFee: reqAmount.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
                });
                break;
            case "pricePerUnit":
                const pricePerUnit = new BN(value);
                setOrder({
                    ...order,
                    pricePerUnit: pricePerUnit,
                    /*totalPrice: pricePerUnit.multipliedBy(order.reqAmount).decimalPlaces(activePair.quoteAssetPrecision),*/
                    totalPrice: pricePerUnit.multipliedBy(order.reqAmount).decimalPlaces(currencies[activePair.quoteAsset].precision),
                    /*tradeFee: order.reqAmount.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(activePair.baseAssetPrecision),*/
                    tradeFee: order.reqAmount.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
                });
                break;
            case "totalPrice":
                const totalPrice = new BN(value);
                /*const req = totalPrice.dividedBy(order.pricePerUnit).decimalPlaces(activePair.baseAssetPrecision);*/
                const req = totalPrice.dividedBy(order.pricePerUnit).decimalPlaces(currencies[activePair.baseAsset].precision);
                setOrder({
                    ...order,
                    reqAmount: req.isFinite() ? req : new BN(0),
                    totalPrice,
                    /*tradeFee: req.isFinite() ? req.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(activePair.baseAssetPrecision) : new BN(0),*/
                    tradeFee: req.isFinite() ? req.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision) : new BN(0),
                });
                currencyValidator("reqAmount", req, activePair.baseAsset);
                break;
            default:
        }
    };

    useEffect(() => {
        if (order.totalPrice.isGreaterThan(quote)) {
            return setAlert({
                ...alert,
                totalPrice: t('orders.notEnoughBalance')
            })
        }
        return setAlert({
            ...alert,
            totalPrice: null
        })
    }, [order.totalPrice]);


    useEffect(() => {
        setOrder((prevState) => ({
            ...order,
            tradeFee: prevState.totalPrice.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
        }));
    }, [tradeFee]);

    useEffect(() => {
        buyPriceHandler(
            bestBuyPrice.toString(),
            "pricePerUnit",
        );
    }, [order.stopMarket]);

    useEffect(() => {
        const reqAmount = new BN(selectedBuyOrder.amount);
        const pricePerUnit = new BN(selectedBuyOrder.pricePerUnit);
        setOrder({
            ...order,
            reqAmount,
            pricePerUnit: pricePerUnit,
            totalPrice: reqAmount.multipliedBy(pricePerUnit).decimalPlaces(currencies[activePair.quoteAsset].precision),
            tradeFee: reqAmount.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
        });
        currencyValidator("reqAmount", reqAmount, activePair.baseAsset);
    }, [selectedBuyOrder]);


    const fillBuyByWallet = () => {
        if (order.pricePerUnit.isEqualTo(0) && bestBuyPrice === 0) return toast.error(t("orders.hasNoOffer"));
        if (order.pricePerUnit.isEqualTo(0)) {
            const pricePerUnit = new BN(bestBuyPrice)
            let totalPrice = new BN(quote);
            let reqAmount = totalPrice.dividedBy(pricePerUnit).decimalPlaces(currencies[activePair.baseAsset].precision)
            if (!reqAmount.mod(currencies[activePair.baseAsset].step).isZero()) {
                reqAmount = reqAmount.minus(reqAmount.mod(currencies[activePair.baseAsset].step));
                totalPrice = reqAmount.multipliedBy(pricePerUnit);
            }
            setOrder({
                ...order,
                reqAmount,
                pricePerUnit,
                totalPrice,
                tradeFee: reqAmount.multipliedBy(tradeFee[activePair.quoteAsset]).decimalPlaces(currencies[activePair.baseAsset].precision),
            });
        } else {
            let totalPrice = new BN(quote);
            let reqAmount = totalPrice.dividedBy(order.pricePerUnit).decimalPlaces(currencies[activePair.baseAsset].precision)
            if (!reqAmount.mod(currencies[activePair.baseAsset].step).isZero()) {
                reqAmount = reqAmount.minus(reqAmount.mod(currencies[activePair.baseAsset].step));
            }
            buyPriceHandler(
                reqAmount.toFormat(),
                "reqAmount",
            );
        }
    };

    const fillBuyByBestPrice = () => {
        buyPriceHandler(
            bestBuyPrice.toString(),
            "pricePerUnit",
        );
    };


    const submit = () => {
        if (!isLogin) {
            return false
        }
        if (isLoading) {
            return false
        }
        setIsLoading(true)
        createOrder(activePair.symbol, "BUY", order)
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
                        type: t("buy"),
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

        if (isLogin) return t("buy")

        return t("pleaseLogin")
    }

    const isAllowed = ({floatValue}) => {
        return floatValue < 10 ** 12;
    }


    return (
        <div className={`column jc-between ${classes.content}`}>
            <div className="column jc-between">
                <p onClick={() => {
                    fillBuyByWallet()
                }}>
                    {t("orders.availableAmount")}:{" "}
                    <span className="cursor-pointer">
              {new BN(quote).toFormat()}{" "}{getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
            </span>
                </p>
                <p onClick={() => {
                    fillBuyByBestPrice()
                }}>
                    {t("orders.bestOffer")}:{" "}
                    <span className="cursor-pointer">
                        {new BN(bestBuyPrice).toFormat()}{" "}{getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
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
                    after={t("currency." + activePair.baseAsset)}
                    value={order.stopPrice}
                    maxDecimal={activePair.baseAssetPrecision}
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
                onchange={(e) => buyPriceHandler(e.target.value, "reqAmount")}
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
                    onchange={(e) => buyPriceHandler(e.target.value, "pricePerUnit")}
                    isAllowed={isAllowed}
                />
            ) : (
                <NumberInput
                    lead={t("orders.pricePerUnit")}
                    after={getCurrencyNameOrAlias(currencies[activePair.quoteAsset], language)}
                    value={order.pricePerUnit.toFormat()}
                    maxDecimal={currencies[activePair.quoteAsset].precision}
                    onchange={(e) => buyPriceHandler(e.target.value, "pricePerUnit")}
                    isAllowed={isAllowed}
                />
            )}

            <div className="row ai-center">
                <span className="pl-05">{t("orders.marketBuyPrice")}</span>
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
                onchange={(e) => buyPriceHandler(e.target.value, "totalPrice")}
                alert={alert.totalPrice}
                isAllowed={isAllowed}
            />

            <div className="column jc-between">
                <p>
                    {t("orders.tradeFee")}:{" "}
                    {order.tradeFee.toFormat()}{" "}
                    {getCurrencyNameOrAlias(currencies[activePair.baseAsset], language)}
                </p>
                <p>
                    {t("orders.getAmount")}:{" "}
                    {order.reqAmount.minus(order.tradeFee).decimalPlaces(currencies[activePair.baseAsset].precision).toFormat()}{" "}
                    {getCurrencyNameOrAlias(currencies[activePair.baseAsset], language)}
                </p>
            </div>
            <Button
                buttonClass={`${classes.thisButton} ${classes.buyOrder} ${isLoading ? "cursor-not-allowed" : "cursor-pointer"} flex jc-center ai-center`}
                type="submit"
                onClick={submit}
                disabled={alert.reqAmount || order.reqAmount.isZero() || order.pricePerUnit.isZero() || !isLogin || alert.totalPrice}
                buttonTitle={submitButtonTextHandler()}
            />
        </div>
    );
};

export default BuyOrder;