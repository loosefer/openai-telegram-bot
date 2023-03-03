import { writeFileSync, readFileSync } from 'fs';

export const base64ToPNG = (data: string, filename: string) => {
    data = data.replace(/^data:image\/png;base64,/, '');

    const path = `./images/${filename}`;
    writeFileSync(path, data, 'base64');

    return path;
}

export const saveToPng = (images: Array<{ b64_json: string }>, filename: string) => {
    images.forEach(({ b64_json }, i) => {
        const file = `${filename}${i + 1}.png`;
        console.log('file', file);
        return base64ToPNG(b64_json, file);
    })
};
