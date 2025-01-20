import React from "react";
import Overview from "./components/Overview/Overview";
import Order from "./components/Order/Order";
import OrderBook from "./components/OrderBook/OrderBook";
import MyOrders from "./components/MyOrders/MyOrders";
import LastTrades from "./components/LastTrades/LastTrades";
import TradingView from "./components/TradingView/TradingView";

const Market = () => {
    return (
        <>
            <div className="row px-1 py-1">
                <div className="column col-38 pl-05">
                    <Overview/>
                    <Order/>
                </div>
                <div className="column col-62 pr-05">
                    <TradingView/>
                    <OrderBook/>
                </div>
            </div>
            <div className="row px-1 mb-3">
                <div className="column col-55 pl-05">
                    {/*<MyOrders/>*/}
                </div>
                <div className="column col-45 pr-05">
                    {/*<LastTrades/>*/}
                </div>
            </div>
        </>
    );
};

export default Market;
