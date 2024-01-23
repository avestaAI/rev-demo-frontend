import Colors from './Colors'
import labels from '../labels.json'

const drawBoxes = (canvasRef, boxes, scores, classes, xRatio, yRatio, setTags) => {
    const ctx = canvasRef.current.getContext("2d")
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    const colors = new Colors();

    const font = `${Math.max(
        Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
        14
    )}px Arial`
    ctx.font = font
    ctx.textBaseline = "top"

    for (let i = 0; i < scores.length; ++i) {
        // filter based on class threshold
        if (scores[i] > 0.25) {
            const label = labels[classes[i]];
            const color = colors.get(classes[i]);
            const score = (scores[i] * 100).toFixed(1);

            setTags((oldTags) => [...oldTags, { tagName: label, tagConf: score, tagColor: color }])

            let [x1, y1, x2, y2] = boxes.slice(i * 4, (i + 1) * 4)
            x1 *= canvasRef.current.width * xRatio
            x2 *= canvasRef.current.width * xRatio
            y1 *= canvasRef.current.height * yRatio
            y2 *= canvasRef.current.height * yRatio

            const width = x2 - x1;
            const height = y2 - y1;

            // draw box.
            ctx.fillStyle = Colors.hexToRgba(color, 0.08);
            ctx.fillRect(x1, y1, width, height);
            // draw border box.
            ctx.strokeStyle = color;
            ctx.lineWidth = Math.max(Math.min(ctx.canvas.width, ctx.canvas.height) / 200, 2.5);
            ctx.strokeRect(x1, y1, width, height);

            // Draw the label background.
            ctx.fillStyle = color;
            const textWidth = ctx.measureText(label + " - " + score + "%").width;
            const textHeight = parseInt(font, 10); // base 10
            const yText = y1 - (textHeight + ctx.lineWidth);
            ctx.fillRect(
                x1 - 1,
                yText < 0 ? 0 : yText, // handle overflow label box
                textWidth + ctx.lineWidth,
                textHeight + ctx.lineWidth
            );

            // Draw labels
            ctx.fillStyle = "#ffffff";
            ctx.fillText(label + " - " + score + "%", x1 - 1, yText < 0 ? 0 : yText);
        }
    }
}

export default drawBoxes