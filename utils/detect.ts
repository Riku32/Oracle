const tf = require('@tensorflow/tfjs-node')
const nsfw = require('nsfwjs')

export class Detector {
    file: string
    modelURL: string
    model: any

    constructor(model: string) {
        this.modelURL = model
    }

    async init() {
        this.model = await nsfw.load(this.modelURL, { size: 299 })
        return
    }

    ready() {
        if (this.model != undefined) {
            return true
        }

        return false
    }

    async predict(pic: any) {
        const image = await tf.node.decodeImage(pic.data, 3)
        const predictions = await this.model.classify(image)
        image.dispose()

        return predictions
    }
}