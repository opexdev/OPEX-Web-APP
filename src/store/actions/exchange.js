import * as actionTypes from "./actionTypes";
import {GET_FEES} from "./actionTypes";

export const setActivePairInitiate = (pair, activeTab) => {
    return {
        type: actionTypes.SET_ACTIVE_PAIR_INITIATE,
        activeTab: activeTab,
        pair: pair,
    };
};

export const setActivePair = pair => {
    return {
        type: actionTypes.SET_ACTIVE_PAIR,
        pair: pair,
    };
};

export const setBuyOrder = selected => {
    return {
        type: actionTypes.SET_BUY_ORDERS,
        selected: selected,
    };
};
export const setSellOrder = selected => {
    return {
        type: actionTypes.SET_SELL_ORDERS,
        selected: selected,
    };
};

export const setBestSellPrice = bestBuyPrice => {
    return {
        type: actionTypes.SET_BEST_SELL_PRICE,
        bestSellPrice: bestBuyPrice,
    };
};

export const setBestBuyPrice = bestBuyPrice => {
    return {
        type: actionTypes.SET_BEST_BUY_PRICE,
        bestBuyPrice: bestBuyPrice,
    };
};
export const setLastTradePrice = lastTradePrice => {
    return {
        type: actionTypes.SET_LAST_TRADE_PRICE,
        lastTradePrice: lastTradePrice,
    };
};

export const setIPG = lockTime => {
    return {
        type: actionTypes.SET_IPG,
        lockTime,
    };
};

export const setIPGInitiate = lockTime => {
    return {
        type: actionTypes.SET_IPG_INITIATE,
        lockTime,
    };
};
export const setVerifyEmailLock = verifyEmailLockTime => {
    return {
        type: actionTypes.SET_VERIFY_EMAIL_LOCK,
        verifyEmailLockTime,
    };
};

export const setVerifyEmailLockInitiate = verifyEmailLockTime => {
    return {
        type: actionTypes.SET_VERIFY_EMAIL_LOCK_INITIATE,
        verifyEmailLockTime,
    };
};

export const setExchange = exchangeInfo => {
    return {
        type: actionTypes.SET_EXCHANGE,
        exchangeInfo,
    };
};
export const setLastPrice = lastPrice => {
    return {
        type: actionTypes.SET_LAST_PRICE,
        lastPrice,
    };
};
export const setLastPriceInitiate = () => {
    return {
        type: actionTypes.SET_LAST_PRICE_INITIATE,
    };
};
export const setExchangeConfigs = configs => {
    return {
        type: actionTypes.SET_EXCHANGE_CONFIG,
        configs: configs
    };
};

export const getCurrencies = currencies => {
    return {
        type: actionTypes.GET_CURRENCIES,
        currencies,
    };
};
export const getPairs = pairs => {
    return {
        type: actionTypes.GET_PAIRS,
        pairs,
    };
};
export const getFees = fees => {
    return {
        type: actionTypes.GET_FEES,
        fees,
    };
};