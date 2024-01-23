
import * as tf from '@tensorflow/tfjs'

const preprocess = (modelWidth, modelHeight, imageRef) => {
    // console.log("Preprocessing!");
    let xRatio, yRatio

    const modelInputImage = tf.tidy(
        () => {
            const img = tf.browser.fromPixels(imageRef.current)
            const [imageHeight, imageWidth] = img.shape.slice(0, 2)
            const maxSize = Math.max(imageHeight, imageWidth)
            const img_padded = img.pad([
                [0, maxSize - imageHeight],
                [0, maxSize - imageWidth],
                [0, 0],
            ])

            xRatio = maxSize / imageWidth
            yRatio = maxSize / imageHeight

            return tf.image.resizeBilinear(img_padded, [modelWidth, modelHeight]).div(255.0).expandDims(0)
        }
    )

    return [modelInputImage, xRatio, yRatio]
}

export default preprocess