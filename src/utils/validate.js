export function checkTel(value) {
    return /^[1][3,4,5,7,8][0-9]{9}$/.test(value)
}