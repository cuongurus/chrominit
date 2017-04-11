exports.manifest = function (name) {
    return {
        "name": name,
        "description": name,
        "version": "1.0.0",
        "manifest_version": 2,
        "app": {
            "background": {
                "scripts": ["background.js"]
            }
        },
        "permissions": [],
        "icons": {}
    }
}

exports.script = function (window) {
    return "var screenWidth = screen.availWidth;\n" +
        "var screenHeight = screen.availHeight;\n" +
        "var width = " + window.width + ";\n" +
        "var height = " + window.height + ";\n\n" +
        "function launch() {\n" +
        "\tchrome.app.window.create('" + window.name + "', {\n" +
        "\t\t'outerBounds': {\n" +
        "\t\t\t'width': width,\n" +
        "\t\t\t'height': height,\n" +
        "\t\t\tleft: Math.round((screenWidth - width) / 2),\n" +
        "\t\t\ttop: Math.round((screenHeight - height) / 2),\n" +
        "\t\t}\n" +
        "\t});\n" +
        "};\n\n" +
        "chrome.app.runtime.onLaunched.addListener(launch);\n"
}

exports.window = function (name) {
    return "<!DOCTYPE html>\n" +
        "<html>\n" +
        "\t<head>\n" +
        "\t\t<title>" + name + "</title>\n" +
        "\t</head>\n" +
        "\t<body>\n" +
        "\t</body>\n" +
        "</html>\n"
}