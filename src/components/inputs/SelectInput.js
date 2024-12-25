import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import _ from "lodash-uuid";
import { MenuItem, TextField, FormControl } from "@mui/material"

import FormattedMessage from "../generics/FormattedMessage";
import TextInput from "./TextInput";


class SelectInput extends Component {
  constructor(props) {
    super(props);
    // Generate the UUIDs once per component instance
    this.labelId = `${_.uuid()}-label`;
    this.selectId = `${_.uuid()}-input`;
  }

  _onChange = (e) => {
    if (this.props.value !== e.target.value) {
      this.props.onChange(JSON.parse(e.target.value));
    }
  };

  handleClear = () => {
    this.props.onChange("");
  };

  render() {
    const {
      classes,
      module,
      label,
      strLabel = null,
      withLabel = true,
      name,
      options,
      value,
      disabled = false,
      readOnly = false,
      required = false,
      placeholder,
    } = this.props;
    if (!options) return null;
    let valueStr = null;
    if (!!readOnly) {
      valueStr = options.filter((o) => JSON.stringify(o.value) === JSON.stringify(value)).map((o) => o.label);
    }
    return (
      <Fragment>
        {!readOnly && (
          <FormControl fullWidth  sx = {(theme) => ({
            label: {
              color: theme.palette.primary.main,
            }
          })}>
          <TextField 
          required={required}
          fullWidth
          readOnly={readOnly}
          value={!!value ? JSON.stringify(value) : ""}
          label = {strLabel ?? <FormattedMessage module={module} id={label} />}
          select
          inputProps={{
            name: name,
            id: this.selectId,
          }}
          onChange={this._onChange}
          disabled={disabled}
          displayEmpty
          >
           {placeholder && (
                <MenuItem disabled value="">
                  <FormattedMessage module={module} id={placeholder} />
                </MenuItem>
              )}
              {options.map((option, idx) => (
                <MenuItem key={`${module}-${name}-option-${idx}`} value={JSON.stringify(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
          </FormControl>
        )}
        {!!readOnly && (
          <TextInput
            /* //NOTE: We want to get rid of default styling (marginTop) if label is not rendered
            {...(withLabel ? { label } : null)} */
            fullWidth={true}
            module={module}
            value={valueStr}
            readOnly={true}
          />
        )}
      </Fragment>
    );
  }
}

export default injectIntl(SelectInput);
