import { baseApiUrl, logout } from "../actions";
import { SAML_LOGOUT_PATH } from "../constants";
import GetIconComponent from "./icons"
import React from "react";
import { clearLocalStorage } from "./useLocalStorage";

export const ensureArray = (maybeArray) => {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  } else if (maybeArray !== null && maybeArray !== undefined) {
    return [maybeArray];
  } else {
    return [];
  }
};

export function getMenuText(text, intl) {
  if (React.isValidElement(text)) {
    return text;
  }
  if (text) {
    const [module, ...rest] = text.split('.');
    const message = rest.join('.').trim() || text;
    const fallback = intl.formatMessage({ module: module, id: message, defaultMessage: text });
    return intl.formatMessage({ id: text, defaultMessage: fallback });
  }
}

export function GetRightsFromId(conf, routes, id) {
  return conf || routes[id]?.rights;
}

export function GetTextFromId(conf, routes, id) {
  return conf || routes[id]?.text;
}

export function GetRouteFromId(conf, routes, id) {
  return conf || routes[id]?.path;
}

export function GetIconFromId(conf, routes, id) {
  return conf || routes[id]?.icon;
}

export function prepareMenuEntries(rights, intl, entries, routes) {
  const rightsSet = new Set(rights.map(r => String(r)))

  // Filter entries by rights and convert icon strings to components
  const filteredEntries = entries
    .filter((entry) => {
      const routeRef = entry.route || entry.id;
      const entryRights = GetRightsFromId(entry.rights, routes, routeRef );
      return (routeRef !== undefined) && (!entryRights || entryRights.some(er => rightsSet.has(String(er))));
    })
    .map((entry) => ({
      ...entry,
      icon: GetIconComponent(GetIconFromId(entry.icon, routes, entry.route || entry.id)),
      text: getMenuText(GetTextFromId(entry.text, routes, entry.route || entry.id), intl),
      route: "/" + GetRouteFromId(entry.route, routes, entry.id)
    }));

  // Sort by position (default 99 if missing; stable for duplicates)
  filteredEntries.sort((a, b) => (a.position || 99) - (b.position || 99));

  return filteredEntries;
}


export const prepareForComparison = (stateRole, propsRole, roleRights) => {
  const tempStateRole = { ...stateRole };
  delete tempStateRole.roleRights;

  const tempPropsRole = { ...propsRole, isSystem: !!propsRole?.isSystem };

  const tempRoleRights = roleRights?.map((right) => right?.rightId);

  return {
    stateRole: tempStateRole,
    propsRole: tempPropsRole,
    convertedRoleRights: tempRoleRights || [],
  };
};

export function getTimeDifferenceInDays(_firstDate, _secondDate) {
  let firstDate = new Date(_firstDate);
  let secondDate = new Date(_secondDate);
  const timeDelta = firstDate.getTime() - secondDate.getTime();
  const timeInDays = Math.ceil(timeDelta / (1000 * 60 * 60 * 24));

  return timeInDays;
}

export function getTimeDifferenceInDaysFromToday(dateToCheck) {
  const currentDate = new Date();
  return getTimeDifferenceInDays(dateToCheck, currentDate);
}

export const onLogout = async (dispatch) => {
  clearLocalStorage();
  await dispatch(logout());
};

export const redirectToSamlLogout = (e) => {
  e.preventDefault();
  clearLocalStorage();
  const redirectToURL = new URL(`${window.location.origin}${baseApiUrl}${SAML_LOGOUT_PATH}`);

  window.location.href = redirectToURL.href;
};

export const getLanguageNameByCode = (languages, languageCode) => {
  return languages.find((language) => language.code === languageCode)?.name;
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

export function menuEntryMatchesLocationPath(entry) {
  const pathname = location.pathname
  return (
    pathname === `/front${entry.route}`
    || pathname.startsWith(`/front${entry.route}/`)
  )
}
