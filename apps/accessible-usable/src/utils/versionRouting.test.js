import {
  FLOW_SUFFIXES,
  applyFlowSuffix,
  getFlowSuffixFromPath,
  normalizeAppPath,
  resolveFlowHomePath
} from './versionRouting';

describe('versionRouting', () => {
  test('detecta flujos desde path', () => {
    expect(getFlowSuffixFromPath('/home')).toBe(FLOW_SUFFIXES.accessible);
    expect(getFlowSuffixFromPath('/home-no-usable')).toBe(FLOW_SUFFIXES['no-usable']);
    expect(getFlowSuffixFromPath('/home-no-accesible')).toBe(FLOW_SUFFIXES['no-accesible']);
  });

  test('aplica sufijo al primer segmento', () => {
    expect(applyFlowSuffix('/home', FLOW_SUFFIXES.accessible)).toBe('/home');
    expect(applyFlowSuffix('/home', FLOW_SUFFIXES['no-usable'])).toBe('/home-no-usable');
    expect(applyFlowSuffix('/decks/123', FLOW_SUFFIXES['no-accesible'])).toBe('/decks-no-accesible/123');
  });

  test('normaliza path eliminando sufijo', () => {
    expect(normalizeAppPath('/home')).toBe('/home');
    expect(normalizeAppPath('/home-no-usable')).toBe('/home');
    expect(normalizeAppPath('/decks-no-accesible/99')).toBe('/decks/99');
  });

  test('resuelve home por flujo', () => {
    expect(resolveFlowHomePath(FLOW_SUFFIXES.accessible)).toBe('/home');
    expect(resolveFlowHomePath(FLOW_SUFFIXES['no-usable'])).toBe('/home-no-usable');
    expect(resolveFlowHomePath(FLOW_SUFFIXES['no-accesible'])).toBe('/home-no-accesible');
  });
});
