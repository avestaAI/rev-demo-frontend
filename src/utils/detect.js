import preprocess from "./preprocess"
import drawBoxes from "./drawBoxes"
import * as tf from '@tensorflow/tfjs'

const detect = async (model, imageRef, canvasRef, setTags) => {
    setTags([])
    const [_, modelWidth, modelHeight] = model.inputs[0].shape

    tf.engine().startScope()
    const [modelInputImage, xRatio, yRatio] = preprocess(modelWidth, modelHeight, imageRef)
    const [raw_boxes, raw_scores, raw_classes] = await model.executeAsync(modelInputImage)
    const boxes = raw_boxes.dataSync();
    const scores = raw_scores.dataSync();
    const classes = raw_classes.dataSync();
    drawBoxes(canvasRef, boxes, scores, classes, xRatio, yRatio, setTags)
    tf.engine().endScope()
}

export default detect