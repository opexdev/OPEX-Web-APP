import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Route, Routes} from "react-router-dom";
import i18n from "i18next";
import * as RoutesName from "./Routes/routes";
import {Toaster} from "react-hot-toast";
import Login from "./Pages/Login/Login";
import FullWidthLoading from "../../components/FullWidthLoading/FullWidthLoading";
import {loadConfig, setInfoMessage} from "../../store/actions";
import "./Styles/Browser.css"
import useQuery from "../../Hooks/useQuery";
import FullWidthError from "../../components/FullWidthError/FullWidthError";
import User from "./Pages/User/User";
import Landing from "./Pages/Landing/Landing";
import AllMarket from "./Pages/AllMarket/AllMarket";
import UserPanel from "./Pages/UserPanel/UserPanel";
import {Tooltip} from "react-tooltip";
import Layout from "../../components/Layout/Layout";
import AboutUs from "./Pages/Info/AboutUs/AboutUs";
import Commission from "./Pages/Info/Commission/Commission";
import TransferFees from "./Pages/Info/TransferFees/TransferFees";
import Guide from "./Pages/Info/Guide/Guide";
import Rules from "./Pages/Info/Rules/Rules";
import ContactUs from "./Pages/Info/ContactUs/ContactUs";
import EasyTrading from "./Pages/EasyTrading/EasyTrading";
import axios from "axios";

const Browser = () => {
    const query = useQuery();
    const dispatch = useDispatch();

    const theme = useSelector((state) => state.global.theme)
    const isLoading = useSelector((state) => state.global.isLoading)
    const hasError = useSelector((state) => state.global.hasError)
    const title = useSelector((state) => state.exchange.title)
    const description = useSelector((state) => state.exchange.description)

    const currencies = useSelector((state) => state.exchange.currencies)
    const pairsList = useSelector((state) => state.exchange.pairsList)
    const fees = useSelector((state) => state.exchange.fees)

    console.log("currencies from redux", currencies)
    console.log("fees from redux", fees)
    console.log("pairsList from redux", pairsList)


    theme === "DARK" ? document.body.classList.add('dark') : document.body.classList.remove('dark');

    useEffect(() => {
        const impersonate = query.get("impersonate");
        dispatch(loadConfig(impersonate))
        i18n.language !== "fa" ? document.body.classList.add('ltr') : document.body.classList.remove('ltr');
        i18n.on("languageChanged", (lng) => {
            lng !== "fa" ? document.body.classList.add('ltr') : document.body.classList.remove('ltr');
        });

        window.addEventListener('offline', () => dispatch(setInfoMessage(null, "offline")));
        window.addEventListener('online', () => dispatch(setInfoMessage(null, null)));
        return () => {
            window.removeEventListener('offline', () => dispatch(setInfoMessage(null, "offline")));
            window.removeEventListener('online', () => dispatch(setInfoMessage(null, null)));
        }
    }, []);

    useEffect(() => {
        const meta = document.getElementsByTagName('meta')
        document.title = title ? title : " ";
        meta.description.content = description ? description : " "
    }, [title, description])

    if (isLoading) return <FullWidthLoading/>

    if (hasError) return <FullWidthError/>

    return (
        <>
            <Routes>
                <Route path={RoutesName.Login} element={<Login/>}/>
                <Route path={RoutesName.User + "/*"} element={<User/>}/>
                <Route path={RoutesName.Panel + "/*"} element={<UserPanel/>}/>
                <Route element={<Layout/>}>
                    <Route path={RoutesName.Landing} element={<Landing/>}/>
                    <Route path={RoutesName.AllMarket} element={<AllMarket/>}/>
                    <Route path={RoutesName.EasyTrading} element={<EasyTrading/>}/>
                    <Route path={RoutesName.AboutUs} element={<AboutUs/>}/>
                    <Route path={RoutesName.Commission} element={<Commission/>}/>
                    <Route path={RoutesName.TransferFees} element={<TransferFees/>}/>
                    <Route path={RoutesName.Guide} element={<Guide/>}/>
                    <Route path={RoutesName.Rules} element={<Rules/>}/>
                    <Route path={RoutesName.ContactUs} element={<ContactUs/>}/>
                </Route>
            </Routes>
            <Tooltip id="opex-tooltip"/>
        </>
    );
};

export default Browser;