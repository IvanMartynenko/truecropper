const BASE_CLASSNAME = "truecropper" as const;
export const CONSTANTS = {
  base: BASE_CLASSNAME,
  img: `${BASE_CLASSNAME}__image`,
  background: `${BASE_CLASSNAME}__background`,
  new: `${BASE_CLASSNAME}__new-selection`,
  selection: `${BASE_CLASSNAME}__selection`,
  handle: `${BASE_CLASSNAME}__handle`,
  hanleds: `${BASE_CLASSNAME}__handles`,
  valueX: `${BASE_CLASSNAME}X`,
  valueY: `${BASE_CLASSNAME}Y`,
  valueWidth: `${BASE_CLASSNAME}Width`,
  valueHeight: `${BASE_CLASSNAME}Height`,
  valueStatus: `${BASE_CLASSNAME}Status`,
  epsilon: 0.05,
} as const;
