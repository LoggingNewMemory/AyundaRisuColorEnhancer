let callbackId = 0;

function executeCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
        const callback = `exec_callback_${Date.now()}_${callbackId++}`;
        
        function cleanup(name) {
            delete window[name];
        }
        
        window[callback] = (errno, stdout, stderr) => {
            resolve({ errno, stdout, stderr });
            cleanup(callback);
        };
        
        try {
            ksu.exec(command, JSON.stringify(options), callback);
        } catch (error) {
            reject(error);
            cleanup(callback);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const moduleOnButton = document.getElementById("moduleOnButton");
    const moduleOffButton = document.getElementById("moduleOffButton");
    const slider = document.getElementById("moduleValueSlider");
    const sliderValueDisplay = document.getElementById("sliderValueDisplay");

    const applySetting = async () => {
        try {
            const sliderValue = slider.value;
            // Single command to save the new value AND then execute the script.
            const command = `echo 'service call SurfaceFlinger 1022 f ${sliderValue}' > /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh && sh /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh`;
            const result = await executeCommand(command);

            if (result.errno === 0) {
                console.log("Setting applied with value:", sliderValue);
            } else {
                console.error("Failed to apply setting:", result.stderr);
                ksu.toast("Failed to apply setting: " + result.stderr);
            }
        } catch (error) {
            console.error("Error:", error);
            ksu.toast("Error: " + error.message);
        }
    };

    // Updates the text display in real-time as you drag.
    slider.addEventListener("input", () => {
        sliderValueDisplay.textContent = slider.value;
    });

    // Executes the command only when you release the slider.
    slider.addEventListener("change", applySetting);

    // The button still works to apply the current setting.
    moduleOnButton.addEventListener("click", applySetting);

    moduleOffButton.addEventListener("click", async () => {
        try {
            const { errno, stdout, stderr } = await executeCommand("sh /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOff.sh");
            if (errno === 0) {
                console.log("Module disabled:", stdout);
                ksu.toast("Module disabled successfully!");
            } else {
                console.error("Module disable failed:", stderr);
                ksu.toast("Failed to disable module: " + stderr);
            }
        } catch (error) {
            console.error("Error:", error);
            ksu.toast("Error: " + error.message);
        }
    });
});