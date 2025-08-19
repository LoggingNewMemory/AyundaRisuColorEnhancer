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
    document.getElementById("moduleOnButton").addEventListener("click", async () => {
        try {
            const { errno, stdout, stderr } = await executeCommand("sh /data/adb/modules/AyundaRusdi/AyundaRisu/ModuleOn.sh");
            if (errno === 0) {
                console.log("Module enabled:", stdout);
                ksu.toast("Module enabled successfully!");
            } else {
                console.error("Module enable failed:", stderr);
                ksu.toast("Failed to enable module: " + stderr);
            }
        } catch (error) {
            console.error("Error:", error);
            ksu.toast("Error: " + error.message);
        }
    });

    document.getElementById("moduleOffButton").addEventListener("click", async () => {
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