export enum SCREENS {
  MAIN = "/main",
  LOGIN = "/login",
  REGISTER = "/register",
  PROFILE = "/profile",
}
export const emailRegexp = '^\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$';

export const DATE_CONSTRAINTS = {
  min: {year: 1900, month: 1, day: 1},
  max: {year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDay()},
}

export const FILE_TYPES: {[key: string]: boolean} = {
  'image/jpg': true,
  'image/jpeg': true,
  'image/png': true
}
