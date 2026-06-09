import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper, Switch } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";

import { useTranslations, withModulesManager, combine, PublishedComponent, useGraphqlQuery } from "@openimis/fe-core";
import { CLAIM_ADMIN_USER_TYPE, CLAIM_ADMIN_IS_SYSTEM } from "../constants";
import { toggleUserRoles, toggleSwitchButton } from "../utils";

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
  '& .title': theme.paper?.title ?? {},
  '& .item': theme.paper?.item ?? {},
}));

const ClaimAdministratorFormPanel = (props) => {
  const theme = useTheme();
  const { edited,  modulesManager, onEditedChanged, readOnly } = props;
  const { formatMessage } = useTranslations("admin.ClaimAdministratorFormPanel", modulesManager);
  const hasClaimUserType = edited.userTypes?.includes(CLAIM_ADMIN_USER_TYPE);
  const hasClaimRole = edited.roles
    ? edited.roles.filter((x) => x.isSystem === CLAIM_ADMIN_IS_SYSTEM).length !== 0
    : false;
  const [isEnabled, setIsEnabled] = useState(false);
  const {
    isLoading,
    data,
    error: graphqlError,
  } = useGraphqlQuery(
    `
    query UserRolesPicker ($system_id: Int) {
      role(systemRoleId: $system_id) {
        edges {
          node {
            id name isSystem
          }
        }
      }
    }
  `,
    { system_id: CLAIM_ADMIN_IS_SYSTEM },
  );
  const isValid = !isLoading;

  useEffect(() => {
    toggleUserRoles(
      edited, 
      data, 
      isValid, 
      isEnabled, 
      hasClaimRole, 
      onEditedChanged, 
      CLAIM_ADMIN_IS_SYSTEM);
  }, [isEnabled]);

  useEffect(() => {
    toggleSwitchButton(
      edited, 
      hasClaimRole, 
      hasClaimUserType, 
      setIsEnabled, 
      onEditedChanged, 
      CLAIM_ADMIN_USER_TYPE);
  }, [hasClaimRole]);

  return (
    <StyledPaper>
      <Grid size={{ xs: 12 }} className="title">
        <Grid className="item" container justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{formatMessage("title")}</Typography>
          {(edited || !isEnabled) && (
            <Switch
              color="secondary"
              disabled={readOnly}
              checked={isEnabled}
              onChange={() => setIsEnabled(() => !isEnabled)}
            />
          )}
        </Grid>
      </Grid>
      {isEnabled && (
        <Grid size={{ xs: 12 }}>
          <Grid container>
            <Grid size={{ xs: 4 }} className="item">
              <PublishedComponent
                pubRef="core.DatePicker"
                value={edited?.birthDate}
                module="admin"
                label="user.dob"
                readOnly={readOnly}
                maxDate={new Date()}
                onChange={(birthDate) => onEditedChanged({ ...edited, birthDate })}
              />
            </Grid>
            <Grid size={{ xs: 4 }} className="item">
              <PublishedComponent
                pubRef="location.HealthFacilityPicker"
                value={edited?.healthFacility}
                district={edited?.districts}
                required
                module="admin"
                readOnly={readOnly}
                onChange={(healthFacility) => onEditedChanged({ ...edited, healthFacility })}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </StyledPaper>
  );
};

export { StyledPaper };
export default withModulesManager(ClaimAdministratorFormPanel);

