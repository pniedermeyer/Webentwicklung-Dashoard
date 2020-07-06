class DateUtil {

  /**
   * @returns todays date as String in Format (YYYY-MM-DD)
   */
  static getCurrentDate () {
    const date = new Date()
    return DateUtil.formatDate(date)
  }

  /**
   * @returns yesterdays date  as String in Format (YYYY-MM-DD)
   */
  static getYesterdayDate () {
    const today = new Date()
    const yesterday = new Date(today.getTime())
    yesterday.setDate(today.getDate() - 1)
    return DateUtil.formatDate(yesterday)
  }

  /**
   * Formats the given date into the format (YYYY-MM-DD)
   * 
   * @param date the date to be parsed into the format
   */
  static formatDate (date: Date) {
    let dd_num: number = date.getDate()
    let mm_num: number = date.getMonth() + 1
    const yyyy = date.getFullYear()
    let dd = dd_num < 10 ? '0' + dd_num : dd_num
    let mm = mm_num < 10 ? '0' + mm_num : mm_num
    return yyyy + '-' + mm + '-' + dd
  }

}

export default DateUtil
