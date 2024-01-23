import { useRef, useState } from "react"

const SpeechToJson = () => {

    const [isRecording, setIsRecording] = useState(false)
    const [transcribedText, setTranscribedText] = useState("")
    const [jsonText, setJsonText] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [transcribeResponseTime, setTranscribeResponseTime] = useState(null)
    const [LLMResponseTime, setLLMResponseTime] = useState(null)
    const mediaRecorderRef = useRef(null)

    const handleToggleRecording = () => {
        !isRecording ? startRecording() : stopRecording()
    }

    const startRecording = () => {
        setJsonText("")
        setTranscribedText("")
        setTranscribeResponseTime(null)
        setLLMResponseTime(null)
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(function (stream) {
                let chunks = []
                const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
                mediaRecorderRef.current = mediaRecorder

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data)
                    }
                }

                mediaRecorder.onstop = async () => {
                    const blob = new Blob(chunks, { type: "audio/wav" })
                    // console.log(blob)
                    chunks = []
                    const transcription = await uploadAudio(blob)
                    // console.log(transcribedText)
                    await getLLMOutput(transcription)

                }
                mediaRecorder.start()
                setIsRecording(true)
            })
            .catch(function (error) {
                console.error('Error accessing microphone:', error)
            })
    }

    const stopRecording = () => {
        const mediaRecorder = mediaRecorderRef.current
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop()
            setIsRecording(false)
            setIsProcessing(true)
        }
    }

    const uploadAudio = async (audioBlob) => {
        const start = new Date()
        console.log("uploading.....")
        const formData = new FormData()
        formData.append('audioFile', audioBlob, 'audioFile')

        try {
            const response = await fetch(`${window.location.protocol}//${window.location.hostname}/api/transcribe-audio`, {
                method: 'POST',
                body: formData,
            })
            const data = await response.json()
            const end = new Date()
            if (response.status === 200 && data.success) {
                console.log("Transcript received!")

                setTranscribedText(data.transcript)
                setTranscribeResponseTime((end - start) / 1000)
                return data.transcript
            }
            else {
                console.log(data.error)
            }
        }
        catch (e) {
            console.log("An error occurred!", e)
        }
    }

    const getLLMOutput = async (transcription) => {
        try {
            const start = new Date()
            const response = await fetch(`${window.location.protocol}//${window.location.hostname}/api/process-transcription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: transcription })
            })
            const data = await response.json()
            const end = new Date()

            if (response.status === 200 && data.success) {
                console.log("LLM output received!")
                setJsonText(JSON.stringify(data.llm_output, undefined, 4))
                setLLMResponseTime((end - start) / 1000)
                setIsProcessing(false)
            }
            else {
                console.log(data.error)
            }
        }
        catch (e) {
            console.log("An error occurred!", e)
        }
    }

    return (
        <div className="py-14 flex flex-col items-center justify-center">
            <div className="w-3/4">
                <h1 className='text-3xl font-extrabold'>Speech to Json</h1>
            </div>
            <div className='w-4/5 max-md:flex-col max-md:justify-center max-md:items-center flex items-start justify-between p-10'>
                <div className='w-2/6 flex flex-col justify-center items-center'>
                    <button className={`mt-28 custom_button h-40 w-40 rounded-full ${!isRecording ? "btn-primary" : "btn-error"}`} onClick={handleToggleRecording}>{!isRecording ? "Start Recording" : "Stop Recording"}</button>
                </div>
                <div className='flex ml-10 w-4/6 flex-col items-start justify-center'>
                    {
                        isRecording && <h1 className="text-lg text-orange-300">Recording...</h1>
                    }
                    {
                        isProcessing && <h1 className="text-lg text-blue-400">Processing...</h1>
                    }
                    {
                        transcribedText && (
                            <>
                                <h1 className="my-2">Transcribed Text:</h1>
                                <h1 className="bg-[#222931] w-full p-6">{transcribedText}</h1>
                            </>
                        )
                    }
                    {
                        transcribeResponseTime && (
                            <h1 className="my-4 text-lg rounded-md">Time taken to transcribe: <span className="text-green-500 font-bold">{transcribeResponseTime}</span></h1>
                        )
                    }
                    {
                        jsonText && (
                            <>
                                <h1 className="my-2 rounded-md">Output Json:</h1>
                                <pre className="bg-[#222931] w-full p-6 rounded-md">{jsonText}</pre>
                            </>
                        )
                    }
                    {
                        LLMResponseTime && (
                            <h1 className="my-4 text-lg rounded-md">Response Time: <span className="text-green-500 font-bold">{LLMResponseTime}</span></h1>
                        )
                    }

                    {
                        LLMResponseTime && (
                            <h1 className="my-4 text-2xl rounded-md">Total Time: <span className="text-green-500 font-bold">{parseFloat(transcribeResponseTime + LLMResponseTime).toFixed(2)}</span></h1>
                        )
                    }
                </div>
            </div>
        </div >
    )
}

export default SpeechToJson