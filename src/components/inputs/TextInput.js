import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { TextField } from "@mui/material"
import { formatMessage } from "../../helpers/i18n";
import { DEFAULT } from "../../constants";
import withModulesManager from "../../helpers/modules";

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.disabledVisibilityBoost = props.modulesManager.getConf(
      "fe-core",
      "Input.disabledVisibilityBoost",
      DEFAULT.DISABLED_VISIBILITY_BOOST,
    );
  }

  state = {
    value: "",
  };
  componentDidMount() {
    let value = this.props.value;
    if (!!this.props.formatInput) {
      value = this.props.formatInput(value);
    }
    if (value !== this.state.value) {
      this.setState({ value });
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.reset !== this.props.reset || prevProps.value !== this.props.value) {
      let value = this.props.value;
      if (!!this.props.formatInput) {
        value = this.props.formatInput(value);
      }
      if (value !== this.state.value) {
        this.setState({ value });
      }
    }
  }
  _onChange = (e) => {
    let { value } = e.target;
    if (this.props.formatInput) {
      value = this.props.formatInput(value);
    }
    if (value !== this.state.value) {
      this.setState({ value }, () => this.props.onChange && this.props.onChange(this.state.value));
    }
  };
  render() {
    const {
      intl,
      classes,
      module,
      label,
      readOnly = false,
      error = null,
      startAdornment = null,
      endAdornment = null,
      inputProps = {},
      formatInput = null,
      helperText,
      type,
      ...others
    } = this.props;
    return (
      <TextField
        {...others}
        sx={(theme) => ({
          label: {
            color: theme.palette.primary.main,
          },
          // Apply base styles
          "& input[type=number]": {
            "-moz-appearance": "textfield",
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
          // Conditional styles for disabled visibility boost when readOnly
          ...(this.disabledVisibilityBoost && readOnly && {
            "& .Mui-disabled": {
              color: '#5E5B50',
            },
            "& .MuiInput-underline:before": {
              borderBottom: `1px dotted #5E5B50`,
            },
            "& .MuiFormLabel-root.Mui-disabled": {
              color: "#181716",
            },
          }),
        })}
        fullWidth
        disabled={readOnly}
        label={!!label && formatMessage(intl, module, label)}
        InputProps={{ inputProps, startAdornment, endAdornment }}
        onChange={this._onChange}
        value={this.state.value}
        error={Boolean(error)}
        helperText={error ?? helperText}
        type={type}
      />
    );
  }
}

export default withModulesManager(injectIntl(TextInput));
