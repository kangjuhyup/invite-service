/**
 * 랜덤한 문자열을 반환한다. ( 기본 길이 10 )
 * @param length 
 * @returns string
 */
export const randomString = (length: number = 10): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
