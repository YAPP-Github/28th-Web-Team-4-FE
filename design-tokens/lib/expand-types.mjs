import { expandTypesMap } from '@tokens-studio/sd-transforms';

/** typography composite만 expand (boxShadow expand 시 shadow 유틸리티 깨짐) */
export const typographyExpandTypesMap = {
  typography: expandTypesMap.typography,
};
