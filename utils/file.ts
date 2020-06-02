const fetch = require('node-fetch')
const FormData = require('form-data')

export class File {
    static async kawaiiUpload(img) {
        const form = new FormData();
        form.append("uploadFile", img, "test.png")

        const data = await fetch("https://kawaii.sh/api/files/upload", {
            method: "POST", body: form,
            headers: {
                "token": process.env.kawaiitoken
            }
        }).then(res => res.json());

        if (!data.url) {
            throw data;
        }

        return data.url;
    }
}