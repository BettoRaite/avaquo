import clsx from "clsx";
import { useState, type InputHTMLAttributes } from "react";
import type { FieldProps } from "formik";
import notVisibleIcon from "/public/icons/not-visible.svg";
import visibleIcon from "/public/icons/visible.svg";
import { useTranslation } from "react-i18next";

interface FormFieldProps extends Pick<FieldProps, "form"> {
  fieldName: string;
  labelContent: string;
  placeholder: string;
  autoComplete?: string;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

/**
 * A Formik form field component designed to accept a
 * fieldName and apply it to all necessary input props.
 * This approach helps us adhere to the DRY (Don't Repeat Yourself) principle.
 */
export function FormField({
  form: { isSubmitting, values, handleChange, handleBlur, touched, errors },
  fieldName,
  labelContent,
  placeholder,
  inputProps,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const isErrorField = errors[fieldName] && touched[fieldName];
  const isPasswordField =
    fieldName === "password" || inputProps?.type === "password";

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : inputProps?.type ?? fieldName;

  return (
    <div className="form__field">
      <label className="form__label" htmlFor={fieldName}>
        {labelContent}
      </label>
      <div className="form__input-wrapper">
        <input
          disabled={isSubmitting}
          id={inputProps?.id ?? fieldName}
          name={inputProps?.name ?? fieldName}
          type={inputType}
          autoComplete={inputProps?.autoComplete}
          placeholder={placeholder}
          value={values[fieldName]}
          onChange={handleChange}
          onBlur={handleBlur}
          className={clsx("form__input", {
            "form__input--error": isErrorField,
          })}
          aria-describedby={isErrorField ? `${fieldName}-error` : undefined}
          aria-invalid={isErrorField ? "true" : undefined}
        />
        {isPasswordField && (
          <button
            className="form__show-password-button"
            type="button"
            onClick={handleShowPasswordToggle}
            aria-label={showPassword ? t("hide_password") : t("show_password")}
          >
            <img
              src={showPassword ? notVisibleIcon : visibleIcon}
              alt={showPassword ? t("hide_password") : t("show_password")}
            />
          </button>
        )}
      </div>
      {isErrorField && (
        <span
          className="form__invalid-input-hint"
          id={`${fieldName}-error`}
          role="alert"
          aria-live="assertive"
          style={{
            maxWidth: "100%",
          }}
        >
          {errors[fieldName] as string}
        </span>
      )}
    </div>
  );
}
