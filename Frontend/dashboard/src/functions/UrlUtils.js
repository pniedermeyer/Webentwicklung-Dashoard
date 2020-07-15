export function getBaseUrl(withTrailingSlash = false) {
    let url = window.location.toString()

    console.log(window.location.host+" || "+window.location.hostname+" || "+window.location.port + "||" + ((window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") && window.location.port === "8888"))
    // Overwrite the port for local dev env to match the actual backend port
    // TODO: Make somehow configurable
    if ((window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") && window.location.port === "8888") {
        url = url.replace(":"+window.location.port, ":3001")
    }

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
