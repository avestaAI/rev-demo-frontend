import { useRef, useState } from 'react'
import detect from '../utils/detect'
import ImageButton from '../components/ImageButton'


const ObjectDetection = ({ model }) => {

    const [tags, setTags] = useState([])
    const canvasRef = useRef(null)
    const imageRef = useRef(null)

    const clearCanvas = () => {
        const context = canvasRef.current.getContext('2d')
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    const handleImageUpload = (e) => {
        const imageFile = e.target.files[0]
        if (imageFile) {
            clearCanvas()
            imageRef.current.src = URL.createObjectURL(imageFile)
            imageRef.current.style.display = "block"
            setTags([])
        }
    }

    const handleDownloadImage = async (e) => {
        e.preventDefault()
        const link = e.target.elements.mylink.value
        setTags([])
        clearCanvas()

        try {
            const res = await fetch(`${window.location.protocol}//${window.location.hostname}/api/fetch_image`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image_url: link })
            })

            const data = await res.json()
            imageRef.current.src = `data:image/jpeg;base64,${data.img_data}`
            imageRef.current.style.display = "block"
            // console.log(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="py-14 flex flex-col items-center justify-center">
                <div className="w-3/4">
                    <h1 className='text-3xl font-extrabold'>Object Detection App</h1>

                </div>
                <div className='w-4/5 max-md:flex-col max-md:justify-center max-md:items-center flex items-start justify-between p-10'>

                    <div className='w-4/6 flex flex-col justify-center items-center'>
                        <div className="content relative">
                            <img className='hidden' src="#" alt="Image" ref={imageRef} />
                            <canvas className='absolute top-0 right-0 w-full h-full' width="640" height="640" ref={canvasRef} />
                        </div>
                        <h2 className='self-start font-bold text-xl mt-10'>Demo images</h2>
                        <div className='flex items-center justify-between w-full mt-4 flex-wrap'>
                            {
                                [...Array(8)].map((e, i) => <ImageButton setTagsState={setTags} canvasRef={canvasRef} imageRef={imageRef} key={i + 1} imagePath={`/demo_images/demo_image_${i + 1}.jpg`} />)
                            }
                        </div>
                        <h2 className='my-4'>or</h2>
                        <form onSubmit={handleDownloadImage} className='flex w-full'>
                            <input
                                type="text"
                                placeholder="Paste your image link here"
                                className="input input-bordered input-primary w-2/3"
                                name='mylink'
                                required
                            />
                            <button type='submit' className='btn btn-neutral w-1/3 ml-4'>Upload</button>
                        </form>
                        <h2 className='my-4'>or</h2>
                        <input className='file-input file-input-bordered w-full' type='file' accept='image/*' onChange={handleImageUpload} />
                    </div>

                    <div className='flex ml-10 w-2/6 flex-col items-start justify-center'>
                        <div className='w-full'>
                            <h1 className='text-2xl font-bold'>Extracted Tags:</h1>
                            <div className='flex w-full items-center justify-start mt-2 flex-wrap'>
                                {
                                    tags.map((tag, index) => <p className={`mt-2 px-3 py-1 ${index != 0 && "ml-2"} rounded-md text-black font-bold`} key={index} style={{ "backgroundColor": `${tag.tagColor}` }}>{tag.tagName} | {tag.tagConf}%</p>)
                                }
                            </div>
                        </div>
                        <h1>{tags.length == 0 && <p>No Tags found!</p>}</h1>
                        <button
                            className='btn btn-primary w-full mt-8'
                            onClick={() => { detect(model, imageRef, canvasRef, setTags) }}
                        >Detect
                        </button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ObjectDetection