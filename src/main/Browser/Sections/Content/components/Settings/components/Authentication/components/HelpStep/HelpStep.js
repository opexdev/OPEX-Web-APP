import React, {useState, useEffect} from "react";
import classes from "./HelpStep.module.css";
import {useTranslation} from "react-i18next";
import Button from "../../../../../../../../../../components/Button/Button";

const HelpStep = (props) => {
  const {t} = useTranslation();

  return (
    <div
      className={`container card-background card-border column ${classes.container}`}>
      <div
        className={`column border-bottom jc-center card-header-bg px-1 py-1 ${classes.header}`}>
        <div className="row jc-start ">
          <h3>{t("HelpStep.title")}</h3>
        </div>
      </div>
      <div className={`container column jc-between px-1 py-2 ${classes.content}`}>
        <span>به منظور استفاده از تمامی خدمات این صرافی و فعال شدن امکان برداشت دارایی‌ها، باید احراز هویت شوید. فرایند احراز هویت ساده و آنلاین است. در مراحل بعد از شما درخواست خواهد شد تا اطلاعات فردی خود را در فرم مربوطه وارد کرده و تصاویر پرتره، کارت ملی و رضایت‌نامه استفاده از خدمات را ارسال بفرمایید.</span>
        <div className="row jc-end">
          <Button
              buttonClass={classes.thisButton}
              onClick={props.nextStep}
              buttonTitle={t("nextStep")}
          />
        </div>
      </div>
    </div>
  );
};

export default HelpStep;
