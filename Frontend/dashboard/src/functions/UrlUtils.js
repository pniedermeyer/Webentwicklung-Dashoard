export function getBaseUrl(withTrailingSlash = false) {
    let url = window.location.toString()
    let baseUrl = url
    let hashLocation = baseUrl.indexOf('#');
    if (hashLocation<= 0) {
        hashLocation = baseUrl.length
    }

    baseUrl = baseUrl.slice(0, hashLocation)

    if (!withTrailingSlash && baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, baseUrl.length - 1)
    }

    if (withTrailingSlash && !baseUrl.endsWith('/')) {
        baseUrl = baseUrl + '/'
    }

    return baseUrl
}
