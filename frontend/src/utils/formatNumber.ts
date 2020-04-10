export function numberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function numberWithoutCommas(num: string): number {
  return Number(num.replace(/,/g, ""))
}
