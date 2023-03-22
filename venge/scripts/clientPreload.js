const { ipcRenderer, clipboard } = require('electron');
const Store = require('electron-store');
const settings = new Store();
const fs = require('fs');
const path = require('path');

const settingsData = Object.create(null)
settingsData.official_settings = ["uncapFPS", "low-latency", "exp-flag", "Fullscreen", "gpu-rasterization"]
//Settings vars
settingsData.uncapFPS = settings.get("uncapFPS")
settingsData.lowLatency = settings.get("low-latency")
settingsData.expFlag = settings.get("exp-flag")
settingsData.gpu_ras = settings.get("gpu-rasterization")
settingsData.fullscreen_mode = settings.get('Fullscreen')

console.log("test with github")
if (process.platform === 'win32') {
    const documents = ipcRenderer.sendSync('docs');
    const scriptFolder = documents + "\\Venge-Client\\scripts";

    if (!fs.existsSync(scriptFolder)) {
        fs.mkdirSync(scriptFolder, { recursive: true });
    }
    try {
        fs.readdirSync(scriptFolder).filter(file => path.extname(file).toLowerCase() === '.js').forEach(filename => {
            try {
                require(`${scriptFolder}/${filename}`);
            } catch (e) {
                console.error("an error occurred while executing userscript: " + filename + " error: " + e);
            }
        });
    } catch (e) {
        console.error("an error occurred while loading userscripts: " + e);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MutationObserver(mutationRecords => {
        try {
            mutationRecords.forEach(record => {
                record.addedNodes.forEach(el => {
                    if (el.id == "menu" || el.id == "play-section") {
                        if (!document.getElementById("closeClient")) {
                            let menuCont = document.querySelector("#menu-items")
                            let closeClient = document.createElement("li")
                            closeClient.id = "closeClient";
                            closeClient.innerHTML = `<i aria-hidden="true" class="fa fa-times"></i>`
                            menuCont.appendChild(closeClient)
                            closeClient.onclick = () => {
                                ipcRenderer.send("exit")
                            }
                            console.log(closeClient)
                        }
                        if (!document.getElementById("ClientSocialBtn")) {
                            let menuCont = document.querySelector("#menu-items")
                            let socialBtn = document.createElement("li")
                            socialBtn.id = "ClientSocialBtn";
                            socialBtn.innerHTML = `<img src="/files/assets/31216147/1/Crown-Icon.png"> SOCIAL`
                            menuCont.insertBefore(socialBtn, menuCont.children[2])
                            socialBtn.onclick = () => {
                                window.location.href = "https://social.venge.io/"
                                alert('Press F4 to return back to venge!')
                            }
                            console.log(socialBtn)
                        }
                        if (!document.getElementById("JoinBtn")) {
                            let joinLink = document.createElement("div")
                            joinLink.innerHTML = `
                            <button class="invite-button" style="background:linear-gradient(to bottom, rgb(255,165,0), rgb(190,123,0)); border-left: solid 8px rgb(170,110,0)" id="JoinBtn">
                                <i aria-hidden="true" class="fa fa-link">
                            </i> Join Link</button>
                            `
                            let contDiv = document.querySelector("#play-section > div.content-wrapper")
                            contDiv.insertBefore(joinLink, contDiv.children[0])
                            joinLink.onclick = () => {
                                if (clipboard.readText().includes("venge.io")) {
                                    window.location.href = clipboard.readText()
                                } else {
                                    alert('No valid link found on clipboard')
                                }
                            }
                            document.querySelector("#play-section > div.content-wrapper").appendChild(document.querySelector("#play-section > div.content-wrapper > div.options"))
                        }
                    }
                    if (el.id == "settings") {
                        if (!document.getElementById("clientSettings")) {
                            let tabs = document.querySelector("#content > div > div.tabs")
                            let clientSettings = document.createElement("li")
                            clientSettings.className = '';
                            clientSettings.id = "clientSettings"
                            clientSettings.innerHTML = `Client Settings`
                            tabs.appendChild(clientSettings)
                            let settingHTML, tabCont;
                            clientSettings.onclick = () => {
                                clientSettings.className = 'active';
                                tabCont = document.querySelector("#content > div > div.tab-content")
                                settingHTML = document.createElement("div")
                                settingHTML.id = 'ClientContent';
                                settingHTML.innerHTML = `
                                <style>
                                    .settingCont {
                                        font-size: 1.5rem;
                                        padding-top: 2rem;
                                        width: 100%;
                                    }
                                    .settingToggle {
                                        width: 1.2rem;
                                        height: 1.2rem;
                                        position: fixed;
                                        right: 10rem;
                                    }
                                </style>                               
                                <label for="Settings" class="title active" style="font-size: 2rem !important;">Performance Settings</label>
                                <br/><br/>
                                <div class="settingCont">
                                    Unlimited FPS
                                    <input type="checkbox" class="settingToggle" id="uncapFPS">
                                </div>
                                <div class="settingCont">
                                    Fullscreen Mode
                                    <input type="checkbox" class="settingToggle" id="Fullscreen">
                                </div>
                                <div class="settingCont">
                                    GPU Rasterization
                                    <input type="checkbox" class="settingToggle" id="gpu-rasterization">
                                </div>
                                <div class="settingCont">
                                    Experimental Flags
                                    <input type="checkbox" class="settingToggle" id="exp-flag">
                                </div>
                                <div class="settingCont">
                                    Low Latency
                                    <input type="checkbox" class="settingToggle" id="low-latency">
                                </div>
                                `
                                tabCont.innerHTML = '';
                                tabCont.appendChild(settingHTML)


                                tabCont.onclick = (e) => {
                                    if (e.target.classList.contains("settingToggle")) {
                                        if (e.target.id == "uncapFPS") {
                                            settingsData.uncapFPS = e.target.checked;
                                            settings.set('uncapFPS', settingsData.uncapFPS)
                                        }
                                        if (e.target.id == "low-latency") {
                                            settingsData.lowLatency = e.target.checked;
                                            settings.set('low-latency', settingsData.lowLatency)
                                        }
                                        if (e.target.id == "exp-flag") {
                                            settingsData.expFlag = e.target.checked;
                                            settings.set('exp-flag', settingsData.expFlag)
                                        }
                                        if (e.target.id == "gpu-rasterization") {
                                            settingsData.gpu_ras = e.target.checked;
                                            settings.set('gpu-rasterization', settingsData.gpu_ras)
                                        }
                                        if (e.target.id == "Fullscreen") {
                                            settingsData.fullscreen_mode = e.target.checked;
                                            settings.set('Fullscreen', settingsData.fullscreen_mode)
                                        }
                                    }
                                }

                                settingsData.official_settings.forEach(name => {
                                    document.getElementById(name).checked = settings.get(name)
                                });
                                for (i = 0; i < tabs.children.length; i++) {
                                    if (tabs.children[i].className == 'active' && tabs.children[i].id != 'clientSettings') {
                                        tabs.children[i].className = '';
                                    }
                                }
                            }
                        }
                    }

                })
            })
        } catch (error) {

        }
    }).observe(document, { childList: true, subtree: true });
})
