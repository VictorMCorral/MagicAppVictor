import { getFlowSuffixFromPath, FLOW_SUFFIXES } from './versionRouting';

export const FLOW_MODES = {
  ACCESSIBLE: 'accessible',
  NO_ACCESSIBLE: 'no-accesible',
  NO_USABLE: 'no-usable'
};

export const getFlowModeFromPath = (pathname = '') => {
  const suffix = getFlowSuffixFromPath(pathname);
  if (suffix === FLOW_SUFFIXES['no-accesible']) return FLOW_MODES.NO_ACCESSIBLE;
  if (suffix === FLOW_SUFFIXES['no-usable']) return FLOW_MODES.NO_USABLE;
  return FLOW_MODES.ACCESSIBLE;
};

export const isNoAccessibleFlow = (pathname = '') => getFlowModeFromPath(pathname) === FLOW_MODES.NO_ACCESSIBLE;

export const isNoUsableFlow = (pathname = '') => getFlowModeFromPath(pathname) === FLOW_MODES.NO_USABLE;
