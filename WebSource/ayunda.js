let callbackId = 0;

function executeCommand(command, options = {}) {
    return new Promise((resolve) => {
        const callback = `exec_callback_${Date.now()}_${callbackId++}`;
        
        window[callback] = (errno, stdout, stderr) => {
            resolve({ errno, stdout, stderr });
            delete window[callback];
        };
        
        ksu.exec(command, JSON.stringify(options), callback);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const moduleOnButton = document.getElementById("moduleOnButton");
    const moduleOffButton = document.getElementById("moduleOffButton");
    const slider = document.getElementById("moduleValueSlider");
    const sliderValueDisplay = document.getElementById("sliderValueDisplay");

    /**
     * Reads the current value from ModuleOn.sh and updates the UI.
     */
    const loadInitialValue = async () => {
        const command = "awk '{print $NF}' /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh";
        const result = await executeCommand(command);
        const value = parseFloat(result.stdout.trim());
        
        // Set the slider's internal value (this requires a standard number with a dot)
        slider.value = value;
        
        // Set the visual display text, replacing the dot with a comma
        sliderValueDisplay.textContent = value.toFixed(1).replace('.', ',');
    };

    /**
     * Applies the current slider value to the system and saves it.
     */
    const applySetting = async () => {
        // The value written to the shell script MUST use a period, not a comma.
        const sliderValue = parseFloat(slider.value).toFixed(1); 
        const command = `echo 'service call SurfaceFlinger 1022 f ${sliderValue}' > /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh && sh /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh`;
        await executeCommand(command);
    };

    // --- Event Listeners ---

    // 1. Load the saved value when the page is ready.
    loadInitialValue();

    // 2. Update the display in real-time as the user drags the slider.
    slider.addEventListener("input", () => {
        const displayValue = parseFloat(slider.value).toFixed(1).replace('.', ',');
        sliderValueDisplay.textContent = displayValue;
    });

    // 3. Apply the setting when the user releases the slider.
    slider.addEventListener("change", applySetting);

    // 4. Also apply the setting when the "Module On" button is clicked.
    moduleOnButton.addEventListener("click", applySetting);

    // 5. Handle the "Module Off" button.
    moduleOffButton.addEventListener("click", () => {
        executeCommand("sh /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOff.sh");
    });
});