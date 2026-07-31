const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { exec } = require("child_process");
const util = require("util");

const execPromise = util.promisify(exec);
const tempDir = path.resolve(__dirname, "../../../temp");

const withTimeout = (promise, timeoutMs, message) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), timeoutMs);
        }),
    ]);
};

const cleanupStaleTempFiles = async () => {
    try {
        const entries = await fs.readdir(tempDir);
        await Promise.all(
            entries
                .filter((entry) => entry.endsWith(".js"))
                .map((entry) => fs.unlink(path.join(tempDir, entry)).catch((error) => {
                    if (error.code !== "ENOENT") {
                        console.error("Failed to delete stale temp file:", error.message);
                    }
                }))
        );
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error("Failed to read temp directory:", error.message);
        }
    }
};

const runEslint = async (code) => {
    const filePath = path.join(tempDir, `${crypto.randomUUID()}.js`);

    try {
        await fs.mkdir(tempDir, { recursive: true });
        await cleanupStaleTempFiles();
        await fs.writeFile(filePath, code);

        const { stdout } = await withTimeout(
            execPromise(`npx eslint "${filePath}" --format json`),
            15000,
            "ESLint timed out"
        );

        const result = JSON.parse(stdout);
        const messages = result[0]?.messages || [];

        return messages.map((eachMessage) => ({
            line_number: eachMessage.line,
            message: eachMessage.message,
        }));
    } catch (error) {
        if (error && error.code === 1 && error.stdout) {
            try {
                const result = JSON.parse(error.stdout);
                const messages = result[0]?.messages || [];
                return messages.map((eachMessage) => ({
                    line_number: eachMessage.line,
                    message: eachMessage.message,
                }));
            } catch (parseError) {
                return [];
            }
        }

        return [];
    } finally {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            if (error.code !== "ENOENT") {
                console.error("Failed to delete temp file:", error.message);
            }
        }
    }
};


module.exports = {
    runEslint
}