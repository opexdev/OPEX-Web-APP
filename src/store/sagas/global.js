import {call, delay, put} from "redux-saga/effects";
import * as actions from "../actions/index";
import jwtDecode from "jwt-decode";
import axios from "axios";
import i18n from "i18next";
import {defaultConfigs} from "../../setup/configs/configs";


export function* setThemeSaga(action) {
    try {
        yield put(actions.setTheme(action.theme));
        yield call([localStorage, 'setItem'], "theme", action.theme)
        if (action.isLogin) {
            yield call(axios.post, '/config/user/v1', {
                theme: action.theme
            })
        }
    } catch (e) {
        console.log(e)
    }
}

export function* setActivePair(action) {
    yield call([localStorage, 'setItem'], "activePair", action.pair.symbol)
    yield call([localStorage, 'setItem'], "activeMarketTab", action.activeTab)
    yield put(actions.setActivePair(action.pair));
}

export function* setIPGLock(action) {
    yield call([localStorage, 'setItem'], "lockTime", action.lockTime)
    yield put(actions.setIPG(action.lockTime));
}

export function* setVerifyEmailLock(action) {
    yield call([localStorage, 'setItem'], "verifyEmailLockTime", action.verifyEmailLockTime)
    yield put(actions.setVerifyEmailLock(action.verifyEmailLockTime));
}

export function* getExchangeLastPrice() {
    const newPrices = {}
    try {
        const {data} = yield call(axios.get, `/api/v3/ticker/price`)
        for (const price of data) {
            newPrices[price.symbol] = price.price
        }
        yield put(actions.setLastPrice(newPrices));
    } catch (e) {
        console.log(e)
    }
}

function* getExchangeInfo() {

    for (let i = 0; i < 10; i++) {
        try {
            const {data} = yield call(axios.get, '/api/v3/exchangeInfo')

            return data
        } catch (err) {
            if (i < 2) {
                yield delay(1000)
                continue
            }
        }

        throw new Error('getExchangeInfo failed!')
    }
}
function* fetchCurrencies() {
    for (let i = 0; i < 10; i++) {
        try {
            const response = yield call(axios.get, '/wallet/currency');
            const { currencies } = response.data;
            return currencies;
        } catch (err) {
            if (i < 9) {
                yield delay(1000);
            } else {
                throw new Error('Failed to fetch currencies after 10 attempts.');
            }
        }
    }
}

export function* loadConfig(action) {

    yield put(actions.setLoading(true))
    yield put(actions.setError(false))

    let appTheme;

    const pairs = [];
    const assets = [];
    const wallets = {};
    const tradeFee = {};
    const lastPrice = {};

    try {
        const {
            data: {
                defaultTheme,
                language,
                ...configs
            }
        } = yield call(axios.get, '/config/web/v1')

        yield put(actions.setExchangeConfigs(configs));
        i18n.changeLanguage(language)
        appTheme = defaultTheme;

    } catch (e) {
        i18n.changeLanguage(defaultConfigs?.defaultLanguage)
        appTheme = defaultConfigs?.defaultTheme;
        yield put(actions.setExchangeConfigs(defaultConfigs));
    }

    try {

        const exchangeInfo = yield call(getExchangeInfo);

        const currencies = yield call(fetchCurrencies);


        /*const currenciesMap = currencies.reduce((acc, currency) => {
            acc[currency.symbol] = currency;
            return acc;
        }, {});*/

        const currenciesMap = currencies.reduce((acc, currency) => {
            const precisionValue = currency.precision.toString();
            const decimalPlaces = precisionValue.includes('.')
                ? precisionValue.split('.')[1].length
                : 0;
            acc[currency.symbol] = {
                ...currency,
                precision: decimalPlaces,
            };
            return acc;
        }, {});

        yield put(actions.getCurrencies(currenciesMap));

        const pairsList = exchangeInfo.symbols;
        const pairsListMap = pairsList.reduce((acc, pair) => {
            /*acc[pair.symbol] = pair;*/
            const key = `${pair.baseAsset}_${pair.quoteAsset}`;
            acc[key] = {
                symbol: pair.symbol,
                baseAsset: pair.baseAsset,
                quoteAsset: pair.quoteAsset,
                orderTypes: pair.orderTypes,
            };
            return acc;
        }, {});
        yield put(actions.getPairs(pairsListMap));

        const fees = exchangeInfo.fees;
        const feesMap = fees.reduce((acc, fee) => {
            acc[fee.pair] = fee;
           /* acc[pair.symbol] = {
                symbol: pair.symbol,
                baseAsset: pair.baseAsset,
                quoteAsset: pair.quoteAsset,
                orderTypes: pair.orderTypes,
            };*/
            return acc;
        }, {});
        yield put(actions.getFees(feesMap));

        const localTheme = yield call([localStorage, 'getItem'], 'theme')
        if (localTheme) appTheme = localTheme;

        const symbols = exchangeInfo.symbols
        for (const symbol of symbols) {
            if (symbol.symbol.toUpperCase().includes("NLN")) continue
            if (!assets.includes(symbol.baseAsset)) {
                assets.push(symbol.baseAsset)
                wallets[symbol.baseAsset] = {free: 0.0, locked: 0.0, withdraw: 0.0}
                tradeFee[symbol.baseAsset] = 0.01
            }
            if (!assets.includes(symbol.quoteAsset)) {
                assets.push(symbol.quoteAsset)
                wallets[symbol.quoteAsset] = {free: 0.0, locked: 0.0, withdraw: 0.0}
                tradeFee[symbol.quoteAsset] = 0.01
            }
            if (!pairs.includes(symbol.symbol)) pairs.push(symbol.symbol)

            symbol.baseRange = assetsScope[symbol.baseAsset] ?? {min: 0.000001, step: 0.000001}
            symbol.quoteRange = assetsScope[symbol.quoteAsset] ?? {min: 0.000001, step: 0.000001}

            symbol.name = symbol.baseAsset + "/" + symbol.quoteAsset
            lastPrice[symbol.symbol] = 0
        }
        yield put(actions.setExchange({pairs, assets, symbols, lastPrice}));
        /*yield put(actions.getCurrencies({currencies}));*/
        yield put(actions.setUserAccountInfo({wallets, tradeFee}));

        const activePair = yield call([localStorage, 'getItem'], 'activePair')
        const lastActivePair = symbols.find(symbol => symbol.symbol === activePair)
        yield put(actions.setActivePair(lastActivePair || symbols[0]));

    } catch (e) {
        yield put(actions.setError(true))
        return yield put(actions.setLoading(false));
    }

    if (action.token) {
        yield put(actions.setUserTokens({refreshToken: null, accessToken: action.token}));
        yield call([localStorage, 'removeItem'], "refreshToken")
        const jwt = jwtDecode(action.token)
        yield put(actions.setUserInfo(jwt));
        yield put(actions.setKYCStatusInitiate());
        return yield put(actions.setLoading(false));
    }

    const lockTime = yield call([localStorage, 'getItem'], 'lockTime')
    if (lockTime) yield put(actions.setIPG(lockTime));

    const verifyEmailLockTime = yield call([localStorage, 'getItem'], 'verifyEmailLockTime')
    if (verifyEmailLockTime) yield put(actions.setVerifyEmailLock(verifyEmailLockTime));

    const refreshToken = localStorage.getItem("refreshToken")
    if (refreshToken) {
        const params = new URLSearchParams();
        params.append('client_id', window.env.REACT_APP_CLIENT_ID);
        params.append('client_secret', window.env.REACT_APP_CLIENT_SECRET);
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refreshToken);
        try {
            const {data: {access_token}} = yield call(axios.post, '/auth/realms/opex/protocol/openid-connect/token', params)
            const {
                data: {
                    theme: userTheme,
                    language,
                    ...userConfigs
                }
            } = yield call(axios.get, '/config/user/v1', {headers: {Authorization: `Bearer ${access_token}`}})
            i18n.changeLanguage(language)
            yield put(actions.setUserConfig(userConfigs));
            if (userTheme) appTheme = userTheme
            const jwt = jwtDecode(access_token)
            yield call([localStorage, 'setItem'], "refreshToken", refreshToken)
            yield put(actions.setUserTokens({refreshToken, accessToken: access_token}));
            yield put(actions.setUserInfo(jwt));
            yield put(actions.setKYCStatusInitiate());
        } catch (e) {
            yield put(actions.setLogoutInitiate());
        }

    }
    yield put(actions.setTheme(appTheme));
    yield put(actions.setLoading(false));
}

const assetsScope = {
    TBTC: {min: 0.000001, step: 0.000001},
    BTC: {min: 0.000001, step: 0.000001},
    TETH: {min: 0.000001, step: 0.000001},
    ETH: {min: 0.000001, step: 0.000001},
    TBNB: {min: 0.0001, step: 0.0001},
    BNB: {min: 0.0001, step: 0.0001},
    USDT: {min: 0.01, step: 0.01},
    IRT: {min: 50000, step: 1000},
    TRX: {min: 0.000001, step: 0.000001},
    SOL: {min: 0.00001, step: 0.00001},
    TON: {min: 0.0001, step: 0.0001},
    DOGE: {min: 0.0001, step: 0.0001},
}