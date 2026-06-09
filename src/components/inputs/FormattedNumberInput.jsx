import React, { Component } from "react";
import { styled } from "@mui/material/styles";
import TextInput from "./TextInput";
import { injectIntl } from "react-intl";
import { formatMessage, formatMessageWithValues } from "../../helpers/i18n";
import withModulesManager from "../../helpers/modules";

const StyledFormattedNumberInput = styled("div")(({ theme }) => ({}));

class FormattedNumberInput extends Component {
  constructor(props) {
    super(props);

    this.pricesAreDecimal = props.modulesManager.getConf("fe-core", "pricesAreDecimal", true);

    this.state = {
      isEdited: false,
      rawValue: props.value != null ? this.formatNumber(props.value) : "",
    };
  }

  componentDidUpdate(prevProps) {
    // Si la valeur du serveur change et que l’utilisateur n’édite pas, on reformate
    if (prevProps.value !== this.props.value && !this.state.isEdited) {
      this.setState({
        rawValue: this.props.value != null ? this.formatNumber(this.props.value) : "",
      });
    }
  }

  formatNumber = (value) => {
    if (value == null || isNaN(value)) return "";
    const { thousandSeparator, numberOfDecimals = 2, pricesAreDecimal = this.pricesAreDecimal } = this.props;
    return new Intl.NumberFormat(thousandSeparator, {
      minimumFractionDigits: pricesAreDecimal ? numberOfDecimals : 0,
      maximumFractionDigits: pricesAreDecimal ? numberOfDecimals : 0,
    }).format(value);
  };

  handleKeyPress = (event) => {
    const { allowDecimals = true } = this.props;
    if (event.key === "." && !allowDecimals) {
      event.preventDefault();
    }
  };  

  handleChange = (val) => {
    const raw = val;
    this.setState({ rawValue: raw });

    const normalized = raw.replace(/\s/g, "").replace(",", ".");
    const value = parseFloat(normalized);
    this.props.onChange(isNaN(value) ? undefined : value);
  };

  formatInput = (value, displayZero, displayNa, decimal) => {
    if (!value) {
      if (displayNa && !this.state.isEdited) {
        return formatMessage(this.props.intl, this.props.module, "core.NumberInput.notApplicable");
      }
      return displayZero && value === 0 ? "0" : "";
    }

    const numericValue = Number(value);

    if (isNaN(numericValue)) return "";

    if (decimal) {
      const { numberOfDecimals = 2 } = this.props;
      if (typeof value === "string" && value.includes(".") && value.split(".")[1].length > numberOfDecimals) {
        return parseFloat(value).toFixed(numberOfDecimals);
      }
      return value;
    }

    return parseFloat(value);
  };

  handleNaBlur = () => {
    if ((isNaN(this.props.value) || this.props.value === "") && this.state.isEdited) {
      this.props.onChange(undefined);
    }
    this.setState({ isEdited: false });
  };


  handleBlur = () => {
    const { intl, displayNa } = this.props;
    const { rawValue } = this.state;

    this.setState({ isEdited: false });

    if ((rawValue === "" || isNaN(Number(rawValue))) && displayNa) {
      this.setState({
        rawValue: formatMessage(intl, this.props.module, "core.NumberInput.notApplicable"),
      });
      return;
    }

    const number = parseFloat(rawValue.replace(/\s/g, "").replace(",", "."));
    if (isNaN(number)) {
      this.setState({ rawValue: "" });
      return;
    }

    this.setState({ rawValue: this.formatNumber(number) });
  };

  handleFocus = () => {
    this.setState({ isEdited: true });
  };

  render() {
    const {
      intl,
      module = "core",
      min = null,
      max = null,
      value,
      error,
      thousandSeparator,
      numberOfDecimals,
      pricesAreDecimal,
      displayZero = false,
      displayNa = false,
      allowDecimals = this.pricesAreDecimal,
      ...others
    } = this.props;

    let inputProps = {
      ...this.props.inputProps,
      type: "text",
      onKeyPress: this.handleKeyPress,
    };

    let err = error;

    const numericValue = parseFloat(this.state.rawValue.replace(/\s/g, "").replace(",", "."));
    if (min != null && numericValue < min) {
      err = formatMessageWithValues(intl, module, "validation.minValue", { value: numericValue, min });
    }
    if (max != null && numericValue > max) {
      err = formatMessageWithValues(intl, module, "validation.maxValue", { value: numericValue, max });
    }

    return (
      <StyledFormattedNumberInput>
        <TextInput
          {...others}
          module={module}
          value={this.state.rawValue}
          error={err}
          inputProps={inputProps}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
        />
      </StyledFormattedNumberInput>
    );
  }
}

export { StyledFormattedNumberInput };
export default withModulesManager(injectIntl(FormattedNumberInput));
