import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import classes from "../../Login.module.css";
import TextInput from "../../../../../../components/TextInput/TextInput";
import LoginFormLoading from "../LoginLoading/LoginFormLoading";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Button from "../../../../../../components/Button/Button";
import jwtDecode from "jwt-decode";
import OTPForm from "../OTPForm/OTPForm";
import {browserName, deviceType, fullBrowserVersion} from "react-device-detect";
import {validateEmail} from "../../../../../../utils/utils";
import ForgetPassword from "../ForgetPassword/ForgetPassword";
import {getUserConfigsInitiate, setUserInfo, setUserTokensInitiate} from "../../../../../../store/actions";
import {useGetKycStatus} from "../../../../../../queries";
import {login, parseToken} from "js-api-client";
import Icon from "../../../../../../components/Icon/Icon";
import EmailVerification from "../EmailVerification/EmailVerification";

const LoginForm = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const verifyEmailLock = useSelector((state) => state.exchange.verifyEmailLock)

    const isDevelopment = window.env.REACT_APP_ENV === "development";
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [needOTP, setNeedOTP] = useState(undefined);
    const [forgetPassword, setForgetPassword] = useState(false);
    const [credential, setCredential] = useState({username: "", password: "", otp: ""});
    const {refetch: getKycStatus} = useGetKycStatus();

    const [verifyEmail, setVerifyEmail] = useState(false);
    const [showVerifyEmail, setShowVerifyEmail] = useState(false);
    const [disable, setDisable] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const agent = [deviceType, browserName, fullBrowserVersion]
    const clientSecret = window.env.REACT_APP_CLIENT_SECRET
    const clientId = window.env.REACT_APP_CLIENT_ID


    useEffect(() => {
        if (verifyEmailLock && new Date().getTime() < verifyEmailLock) setDisable(true)
    }, [verifyEmailLock]);

    useEffect(() => {
        setNeedOTP(undefined)
    }, [credential.username])

    useEffect(() => {
        setLoginError(false)
    }, [needOTP])

    if (forgetPassword) return <ForgetPassword returnFunc={() => setForgetPassword(false)}/>

    const submit = async (e) => {
        e.preventDefault();
        if (credential.username.length === 0 || credential.password.length === 0) {
            return setLoginError(t("login.emptyCredentialError"));
        }

        if (!validateEmail(credential.username) || credential.password.length < 4) {
            return setLoginError(t("login.inputError"));
        }

        if (needOTP && credential.otp.length < 6) {
            setLoginError(t("login.otpLength"));
            setLoading(false);
            return;
        }

        setLoading(true);
        setLoginError(false);

        login(credential, agent, clientId, clientSecret)
            .then(async (res) => {
                const userToken = parseToken(res.data);
                const jwt = jwtDecode(userToken.accessToken)
                dispatch(setUserInfo(jwt));
                dispatch(setUserTokensInitiate(userToken));
                dispatch(getUserConfigsInitiate());
                await getKycStatus()
                return navigate(from, {replace: true});
            })
            .catch((err) => {
                if (err?.response?.status === 401) {
                    setShowVerifyEmail(false)
                    return setLoginError(t("login.wrongPassword"));
                }
                if (err?.response?.status === 403) {
                    setShowVerifyEmail(false)
                    setLoginError(t("login.wrongOTP"));
                    return setNeedOTP(true)
                }
                if (err?.response?.status === 400 && err?.response?.data?.error_description === "Account is not fully set up") {
                    setShowVerifyEmail(true)
                    return setLoginError(t("login.accountNotActive"));
                }
                setShowVerifyEmail(false)
                setLoginError(t("login.loginError"));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (isLoading) return <LoginFormLoading/>

    if (verifyEmail) return <EmailVerification returnFunc={() => setVerifyEmail(false)} email={credential.username} disable={disable} returnFuncDisableFalse={() => setDisable(false)} returnFuncDisableTrue={() => setDisable(true)}/>


    const setOTPInputHandler = (val) => {
        setCredential({...credential, otp: val})
    }

    const returnToLogin = () => {
        setNeedOTP(undefined)
        setLoginError(false)
        setCredential({...credential, otp: ""})
    }



    return <form onSubmit={(e) => submit(e)} className={`column ai-center jc-between ${classes.form}`}>
        <div className={`width-100 column jc-center ai-center ${classes.formBody} py-2`}>
            {(!needOTP && isDevelopment) && <span className={`font-weight-300 fs-0-8 mb-2 hover-text cursor-pointer`} onClick={() => setCredential({username: "test1@opex.dev", password: "12345678", otp: ""})}>{t('login.forDemoLogin')}</span>}
            {needOTP ?
                <OTPForm setOTP={setOTPInputHandler} initialVal={credential.otp}/>
                :
                <>
                    <TextInput
                        lead={t('email')}
                        type="text"
                        customClass={`${classes.loginInput} mb-1 mt-2`}
                        value={credential.username}
                        onchange={(e) => setCredential({...credential, username: e.target.value})}
                    />
                    <TextInput
                        lead={t('password')}
                        customClass={` ${classes.loginInput} ${classes.passwordInput} mt-1`}
                        value={credential.password}
                        onchange={(e) => setCredential({...credential, password: e.target.value})}
                        type={isInputVisible ? "text" : "password"}
                        after={
                            <Icon
                                iconName={`${isInputVisible ? ' icon-eye-2' : 'icon-eye-off'} fs-02 flex cursor-pointer hover-text`}
                                onClick={() => setIsInputVisible(!isInputVisible)}
                            />
                        }

                    />
                </>
            }
            <div className={`column ${classes.forgetPassword}`}>
                <span className={`${classes.errorText} fs-0-8`}>{loginError}</span>


                {needOTP ?
                    <span className="cursor-pointer flex ai-center fs-0-8"
                          onClick={returnToLogin}>{t('login.back')}</span>
                    :
                    <div className="flex ai-center mt-2">

                        {
                            showVerifyEmail ?
                                <span className={`cursor-pointer fs-0-8 hover-text`} onClick={() => setVerifyEmail(true)}>{t('login.verificationEmail')}</span>
                                :
                                <span className={`cursor-pointer fs-0-8 hover-text`} onClick={() => setForgetPassword(true)}>{t('login.forgetPassword')}</span>
                        }

                    </div>
                }
            </div>
        </div>

        <div className={`width-100 flex jc-center ai-center ${classes.formFooter}`}>
            <Button
                type="submit"
                buttonClass={`${classes.thisButton} cursor-pointer`}
                buttonTitle={t('login.enter')}
            />
        </div>
    </form>
}

export default LoginForm;