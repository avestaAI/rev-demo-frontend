
const ImageButton = ({ setTagsState, canvasRef, imageRef, imagePath, onClick }) => {

    const clearCanvas = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    const handleDemoImage = (id) => {
        setTagsState([])
        clearCanvas()
        imageRef.current.src = imagePath
        imageRef.current.style.display = "block"
    }

    return (
        <div>
            <button
                style={{ backgroundImage: `url(${imagePath})` }}
                onClick={handleDemoImage}
                className='w-20 h-20 bg-white rounded-md bg-cover'>
            </button>
        </div>
    )
}

export default ImageButton