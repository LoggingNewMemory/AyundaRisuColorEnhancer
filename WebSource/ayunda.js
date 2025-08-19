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

    // Update display when slider value changes
    slider.addEventListener("input", () => {
        sliderValueDisplay.textContent = slider.value;
    });

    moduleOnButton.addEventListener("click", async () => {
        try {
            const sliderValue = slider.value;
            
            // Step 1: Create a command to overwrite ModuleOn.sh with the new value.
            // Note the use of single quotes to prevent shell expansion issues.
            const saveCommand = `echo 'service call SurfaceFlinger 1022 f ${sliderValue}' > /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh`;

            const saveResult = await executeCommand(saveCommand);

            if (saveResult.errno !== 0) {
                console.error("Failed to save setting:", saveResult.stderr);
                ksu.toast("Error saving setting: " + saveResult.stderr);
                return; // Stop if we can't save the file
            }

            console.log("Setting saved to ModuleOn.sh successfully!");
            ksu.toast("Setting saved!");

            // Step 2: Execute the script to apply the new setting immediately.
            const applyResult = await executeCommand("sh /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh");
            
            if (applyResult.errno === 0) {
                console.log("Module enabled with value:", sliderValue);
                ksu.toast(`Module enabled with value: ${sliderValue}`);
            } else {
                console.error("Module enable failed:", applyResult.stderr);
                ksu.toast("Failed to apply setting: " + applyResult.stderr);
            }
        } catch (error) {
            console.error("Error:", error);
            ksu.toast("Error: " + error.message);
        }
    });

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