import React, {useState} from "react";
import classes from "./MarketSubMenu.module.css";
import MarketCard from "./components/MarketCard/MarketCard";
import {useTranslation} from "react-i18next";
import Icon from "../../../../../../../../components/Icon/Icon";
import AccordionBox from "../../../../../../../../components/AccordionBox/AccordionBox";
import {useDispatch, useSelector} from "react-redux";
import {setFavPairInitiate} from "../../../../../../../../store/actions";

const MarketSubMenu = () => {

    const {t} = useTranslation();
    const [activeTab] = useState(JSON.parse(localStorage.getItem("activeMarketTab")) || 1);
    const symbols = useSelector((state) => state.exchange.symbols)

    console.log("symbols", symbols)

    const pairsList = useSelector((state) => state.exchange.pairsList)
    console.log("pairsList from redux", pairsList)

    const fav = useSelector((state) => state.auth.favoritePairs)
    const dispatch = useDispatch();
    console.log("fav", fav)

    const addToFav = (selected) => {
        if (fav.includes(selected)) {
            const newFav = fav.filter((item) => item !== selected);
            dispatch(setFavPairInitiate(newFav))
        } else {
            dispatch(setFavPairInitiate([...fav, selected]))
        }
    };

    const data = [
        {
            title: <Icon iconName="icon-star-1 fs-01"/>,
            body: (
                <MarketCard
                    id="0"
                    type="fav"
                    pairs={Object.values(pairsList).filter(pair => fav.includes(pair.symbol))}
                    favPair={fav}
                    addFav={(selected) => addToFav(selected)}
                />

            ),
        },
        {
            title: t("all"),
            body: (
                <MarketCard
                    id="1"
                    type="all"
                    pairs={pairsList}
                    favPair={fav}
                    addFav={(selected) => addToFav(selected)}
                />
            ),
        },
        {
            id: 2,
            title: t("currency.BTC"),
            body: (
                <MarketCard
                    id="2"
                    type="BTC"
                    favPair={fav}
                    pairs={Object.values(pairsList).filter(pair => pair.baseAsset === "BTC" || pair.quoteAsset === "BTC")}
                    addFav={(selected) => addToFav(selected)}
                />
            ),
        },
        {
            id: 3,
            title: t("currency.USDT"),
            body: (
                <MarketCard
                    id="3"
                    type="USDT"
                    favPair={fav}
                    pairs={Object.values(pairsList).filter(pair => pair.baseAsset === "USDT" || pair.quoteAsset === "USDT")}
                    addFav={(selected) => addToFav(selected)}
                />
            ),
        },
    ];

    return (
        <div className={`width-100 card-bg ${classes.container}`}>
            <AccordionBox
                title={t("market.title")}
                style={classes}
                ItemsBorderTop="true"
                content={data}
                titleClassName={classes.TitleFontSize}
                headerClassName={classes.listBorder}
                headerListClassName={classes.UlMaxWidth}
                safari={classes.safariFlexSize}
                activeTab={activeTab}
            />
        </div>
    );
};

export default MarketSubMenu;