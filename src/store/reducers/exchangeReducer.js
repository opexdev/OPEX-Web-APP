import * as actionTypes from "../actions/actionTypes";

const initialState = {
    assets: [],
    pairs: [],
    symbols: [],
    activePair: {},
    activePairOrders: {
        bestBuyPrice: 0,
        bestSellPrice: 0,
        selectedBuyOrder: {
            pricePerUnit: 0,
            amount: 0,
        },
        selectedSellOrder: {
            pricePerUnit: 0,
            amount: 0,
        },
    },
    ipgLock: null,
    verifyEmailLock: null,
    logoUrl: "",
    title: "",
    description: "",
    defaultLanguage: "en",
    supportedLanguages: [],
    defaultTheme: "",
    supportEmail: "",
    baseCurrency: "",
    dateType: "",
    currencies: [],
    pairsList: [],
    fees: [],
};

const exchangeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_IPG:
            return {
                ...state,
                ipgLock: action.lockTime,
            };
        case actionTypes.SET_VERIFY_EMAIL_LOCK:
            return {
                ...state,
                verifyEmailLock: action.verifyEmailLockTime,
            };
        case actionTypes.SET_ACTIVE_PAIR:
            return {
                ...state,
                activePair: {
                    ...state.activePair,
                    ...action.pair,
                    name: action.pair.baseAsset + "/" + action.pair.quoteAsset
                },
                activePairOrders: {
                    ...state.activePairOrders,
                    bestBuyPrice: 0,
                    bestSellPrice: 0,
                    lastTradePrice: 0,
                },
            };
        case actionTypes.SET_BEST_BUY_PRICE:
            return {
                ...state,
                activePairOrders: {
                    ...state.activePairOrders,
                    bestBuyPrice: action.bestBuyPrice,
                },
            };
        case actionTypes.SET_BEST_SELL_PRICE:
            return {
                ...state,
                activePairOrders: {
                    ...state.activePairOrders,
                    bestSellPrice: action.bestSellPrice,
                },
            };
        case actionTypes.SET_BUY_ORDERS:
            return {
                ...state,
                activePairOrders: {
                    ...state.activePairOrders,
                    selectedBuyOrder: {
                        pricePerUnit: action.selected.pricePerUnit,
                        amount: action.selected.amount,
                    },
                },
            };
        case actionTypes.SET_SELL_ORDERS:
            return {
                ...state,
                activePairOrders: {
                    ...state.activePairOrders,
                    selectedSellOrder: {
                        pricePerUnit: action.selected.pricePerUnit,
                        amount: action.selected.amount,
                    },
                },
            };
        case actionTypes.SET_EXCHANGE:
            return {
                ...state,
                ...action.exchangeInfo
            };
        case actionTypes.SET_EXCHANGE_CONFIG:
            return {
                ...state,
                ...action.configs
            };

        case actionTypes.GET_CURRENCIES:
            return {
                ...state,
                currencies: action.currencies,
            };
        case actionTypes.GET_PAIRS:
            return {
                ...state,
                pairsList: action.pairs,
            };
        case actionTypes.GET_FEES:
            return {
                ...state,
                fees: action.fees,
            };

        default:
            return state;
    }
};

export default exchangeReducer;
