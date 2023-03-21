class Store {
    constructor(config) {
        this.config = JSON.parse(config);
    }

    get = (key) => this.config[key];
    set = (key, value) => {
        this.config[key] = value;
        localStorage.saveSettings = JSON.stringify(this.config);
    }
}

if (!localStorage.saveSettings) localStorage.saveSettings = JSON.stringify({
    HideHands: true,
    HideADS: true,
    ToggleWeapon: true,
    DisableLight: false,
    BetterUI: false
})
var setting_array = ['HideHands', 'HideADS', 'ToggleWeapon', 'DisableLight', 'BetterUI']

const settings = new Store(localStorage.saveSettings);

    new MutationObserver(mutationRecords => {
        try {
            mutationRecords.forEach(record => {
                record.addedNodes.forEach(el => {
                    if (el.id == "ClientContent") {
                        var tabCont = document.querySelector("#content > div > div.tab-content");

                        let settingHTML = document.createElement('div')
                        settingHTML.id = 'Vengeance';
                        settingHTML.innerHTML = `
                        <style>
                        #Vengeance {
                            padding-top: 100px;
                        }
                        .settingCont {
                            font-size: 1.5rem;
                            padding-top: 2rem;
                            width: 100%;
                        }
                        .settingToggle {
                            width: 1.2rem;
                            height: 1.2rem;
                            position: absolute;
                            right: 10rem;
                        }
                        </style>                               
                        <label for="Settings" class="title active" style="font-size: 2rem !important;">InGame Settings</label>
                        <br/><br/>
                        <div class="settingCont">
                            Hide Hands
                            <input type="checkbox" class="settingToggle" id="HideHands">
                        </div>
                        <div class="settingCont">
                            Hide Weapon On ADS
                            <input type="checkbox" class="settingToggle" id="HideADS">
                        </div>
                        <div class="settingCont">
                            Toggle weapon model with backquote key (\`)
                            <input type="checkbox" class="settingToggle" id="ToggleWeapon">
                        </div>
                        <div class="settingCont">
                            Disable Map Lighting
                            <input type="checkbox" class="settingToggle" id="DisableLight">
                        </div>
                        <div class="settingCont">
                            Better Ingame UI
                            <input type="checkbox" class="settingToggle" id="BetterUI">
                        </div>
                        `

                        tabCont.appendChild(settingHTML)

                        tabCont.onclick = (e) => {
                            if (e.target.classList.contains("settingToggle")) {
                                settings.set(e.target.id, e.target.checked)
                            }
                        }
                    
                        setting_array.forEach(name => {
                            document.getElementById(name).checked = settings.get(name)
                        });
                        
                    }
                })
            })
        } catch (error) {
            console.log(error)
        }
    }).observe(document, { childList: true, subtree: true });
    
document.addEventListener("DOMContentLoaded", () => {
    window.pc.app.once('start', () => {

    })
    pc.app.on('Player:Focused', function (state) {
        try {
            if (state) {
                if (settings.get('HideADS')) {
                    pc.app.scene.layers.getLayerByName('NonFOV').enabled = false;
                    let crosshair = pc.app.root.findByName('Crosshair');
                    crosshair.enabled = true;
                }
            } else {
                if (settings.get('HideHands')) {
                    pc.app.root.findByName('Player').findByName('ArmLeft').enabled = false;
                    pc.app.root.findByName('Player').findByName('ArmRight').enabled = false;
                }
                pc.app.scene.layers.getLayerByName('NonFOV').enabled = true;
                if (settings.get('BetterUI')) {
                    pc.app.root.findByName('Overlay').findByName("Hitmarker").enabled = false;
                    pc.app.root.findByName('Overlay').findByName('Leaderboard').enabled = false;
                    pc.app.root.findByName('Overlay').findByName("Weapons").enabled = false;
                    pc.app.root.findByName('Overlay').findByName('Stats').setLocalPosition(600, -700, 0)
                }
            }   
        } catch (error) {
            console.log(error)
        }
    });

    pc.app.on("Map:Loaded", () => {

        if (settings.get('DisableLight')) {
            pc.app.root.findByName('MapHolder').findByName('Light').light.color = {r: 0, g: 0, b: 0, a: 1};
        } else {
            pc.app.root.findByName('MapHolder').findByName('Light').light.color = {r: 1, g: 1, b: 1, a: 1};
        }
    })

    if (settings.get('ToggleWeapon')) {
        document.addEventListener('keydown', (e) => {
            if (e.code == 'Backquote') {
                try {
                    pc.app.root.findByName('Weapon').enabled = !pc.app.root.findByName('Weapon').enabled;
                } catch (error) {
                    console.log('not in a game')
                }
            }
        })
    }
})

// pc.app.root.findByName('Player').script.player.onCharacterSkinSet
window._pc = false;
Object.defineProperty(window, "pc", {
    set(value) {
        if (!window.pc) {
            window._pc = value;
        }
    },
    get() {
        return (window._pc);
    }
});
