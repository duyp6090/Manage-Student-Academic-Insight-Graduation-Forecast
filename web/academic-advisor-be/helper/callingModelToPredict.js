import fs from "fs";
import path from "path";

const callingModelToPredict = async (csv) => {
    // check if data_input folder exists, if not, create it
    const folderPath = path.join(process.cwd(), "data_input");
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    const filePath = path.join(folderPath, "students_data.csv");
    fs.writeFileSync(filePath, csv); // csv is the data to be written to the file

    // check if output model folder exists, if not, create it
    const outputFolderPath = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
    }
    const outputFilePath = path.join(outputFolderPath, "predicted_classes.txt");

    // wait for file to be updated
    const timeout = 60000; // 60s timeout
    const interval = 500; // check every 0.5s
    const startTime = Date.now();

    const checkFileUpdated = () =>
        new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                if (fs.existsSync(outputFilePath)) {
                    const stats = fs.statSync(outputFilePath);
                    if (Date.now() - stats.mtimeMs < 5000) {
                        clearInterval(intervalId);
                        resolve(true);
                    }
                }
                if (Date.now() - startTime > timeout) {
                    clearInterval(intervalId);
                    reject(new Error("Timeout waiting for file update"));
                }
            }, interval);
        });

    await checkFileUpdated();

    const fileContent = fs.readFileSync(outputFilePath, "utf8");
    const resultArray = fileContent.split("\n").filter((line) => line.trim() !== "");
    const dataPredicted = resultArray.map((line) => line.trim());

    return dataPredicted;
};

export { callingModelToPredict };
