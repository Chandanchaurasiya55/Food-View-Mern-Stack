const ImageKit = require("imagekit");

let imagekit = null;
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
} else {
    console.warn('ImageKit not configured: IMAGEKIT_PUBLIC_KEY/PRIVATE_KEY/URL_ENDPOINT missing. uploadFile will throw if called.');
}

async function uploadFile(file, fileName) {
    if (!imagekit) {
        throw new Error('ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT');
    }

    const result = await imagekit.upload({
        file: file, // required
        fileName: fileName, // required
    })

    return result; // Return the URL of the uploaded file
}

module.exports = {
    uploadFile
}