/*
 * Decode base64 value, returns string
 * @Params: string
 */
export function encodeValue(value) {
    if (!value) {
      return null;
    }
  
    const valueToString = value.toString();
  
    const buff = Buffer.from(valueToString, 'ascii');
    return buff.toString('base64');
  }
  
  /*
   * Encode string, returns base64 value
   * @Params: string
   */
  export function decodeValue(value) {
    if (!value) {
      return null;
    }
  
    const valueToString = value.toString();
  
    const buff = Buffer.from(valueToString, 'base64');
    return buff.toString('ascii');
  }