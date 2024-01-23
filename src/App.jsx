import { useState } from 'react'
import './App.css'
import DescriptionToTags from './sections/DescriptionToTags'
import ObjectDetection from './sections/ObjectDetection'
import * as tf from '@tensorflow/tfjs'
import "@tensorflow/tfjs-backend-webgl"
import { useEffect } from 'react'
import SpeechToJson from './sections/SpeechToJson'

function App() {

  const [tabState, setTabState] = useState("od")
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [modelLoadingPercent, setModelLoadingPercent] = useState(0.0)
  const [model, setModel] = useState(null)

  const loadModel = async () => {
    setIsModelLoading(true)
    try {
      const model = await tf.loadGraphModel('/model/model.json', {
        onProgress: (loadingFractions) => {
          setModelLoadingPercent(loadingFractions)
        }
      })
      const dummyInput = tf.ones(model.inputs[0].shape);
      const warmupResult = await model.executeAsync(dummyInput);
      tf.dispose(warmupResult)
      tf.dispose(dummyInput)
      setModel(model)
      setIsModelLoading(false)
    }
    catch (error) {
      console.log(error)
      setIsModelLoading(false)
    }
  }

  useEffect(
    () => {
      loadModel()
    }, []
  )

  return (
    <>
      {
        isModelLoading ?
          <div className='min-h-screen flex items-center justify-center'>
            <h2 className='mt-4 text-3xl font-bold text-accent'>Loading Model: {(modelLoadingPercent * 100).toFixed(2)}%</h2>
          </div>
          :
          <>
            <div className='mt-12 w-full flex items-center justify-center'>
              <div className="tabs tabs-boxed">
                <a className={`tab ${tabState == "od" && "tab-active"}`} onClick={() => { setTabState("od") }}>Object Detection</a>
                <a className={`tab ${tabState == "dtt" && "tab-active"}`} onClick={() => { setTabState("dtt") }}>Description to Tags</a>
                <a className={`tab ${tabState == "stj" && "tab-active"}`} onClick={() => { setTabState("stj") }}>Speech to Text</a>
              </div>
            </div>
            <div>
              {tabState == "od" && <ObjectDetection model={model} />}
              {tabState == "dtt" && <DescriptionToTags />}
              {tabState == "stj" && <SpeechToJson />}
            </div>
          </>
      }

    </>
  )
}

export default App


