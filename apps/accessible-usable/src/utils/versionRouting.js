export const FLOW_SUFFIXES = {
  accessible: '',
  'no-usable': '-no-usable',
  'no-accesible': '-no-accesible'
};

export const FLOW_OPTIONS = [
  { id: 'accessible', suffix: FLOW_SUFFIXES.accessible, label: 'Accesible y Usable' },
  { id: 'no-accesible', suffix: FLOW_SUFFIXES['no-accesible'], label: 'No Accesible' },
  { id: 'no-usable', suffix: FLOW_SUFFIXES['no-usable'], label: 'No Usable' }
];

const SUFFIXES_BY_LENGTH = Object.values(FLOW_SUFFIXES)
  .filter(Boolean)
  .sort((first, second) => second.length - first.length);

const ensurePath = (path) => {
  if (!path) return '/home';
  return path.startsWith('/') ? path : `/${path}`;
};

export const getFlowSuffixFromPath = (pathname = '') => {
  const normalizedPath = ensurePath(pathname);
  const firstSegment = normalizedPath.split('/').filter(Boolean)[0] || '';

  for (const suffix of SUFFIXES_BY_LENGTH) {
    if (firstSegment.endsWith(suffix)) {
      return suffix;
    }
  }

  return FLOW_SUFFIXES.accessible;
};

export const applyFlowSuffix = (basePath, flowSuffix = FLOW_SUFFIXES.accessible) => {
  const normalizedPath = ensurePath(basePath);
  const suffix = flowSuffix || FLOW_SUFFIXES.accessible;

  if (!suffix) {
    return normalizedPath;
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  if (!segments.length) {
    return '/home';
  }

  const [firstSegment, ...restSegments] = segments;
  return `/${firstSegment}${suffix}${restSegments.length ? `/${restSegments.join('/')}` : ''}`;
};

export const normalizeAppPath = (pathname = '') => {
  const normalizedPath = ensurePath(pathname);
  if (normalizedPath === '/') {
    return '/home';
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  if (!segments.length) {
    return '/home';
  }

  const suffix = getFlowSuffixFromPath(normalizedPath);
  const [firstSegment, ...restSegments] = segments;

  const normalizedFirstSegment = suffix && firstSegment.endsWith(suffix)
    ? firstSegment.slice(0, firstSegment.length - suffix.length)
    : firstSegment;

  return `/${normalizedFirstSegment}${restSegments.length ? `/${restSegments.join('/')}` : ''}`;
};

export const resolveFlowHomePath = (flowSuffix = FLOW_SUFFIXES.accessible) =>
  applyFlowSuffix('/home', flowSuffix);

export const resolveFlowPath = (basePath, pathname = '') => {
  const suffix = getFlowSuffixFromPath(pathname);
  return applyFlowSuffix(basePath, suffix);
};
