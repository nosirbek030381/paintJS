// GLOBAL VARIABLE
const canvas = document.querySelector('canvas'),
	toolBtns = document.querySelectorAll('.tool'),
	fillColor = document.querySelector('#fill-color'),
	sizeSlider = document.querySelector('#size-slider'),
	colorBtns = document.querySelectorAll('.colors .option'),
	colorPicker = document.querySelector('#color-picker'),
	clearCanvas = document.querySelector('.clear-canvas'),
	saveCanvas = document.querySelector('.save-img')



// VARIABLE WIDTH DEFUALT VALUE
let ctx = canvas.getContext('2d'),
	isDrawing = false,
	brushWidth = 5,
	selectedTool = 'brush',
	selectedColor = '#000',
	prevMouseX,
	prevMouseY,
	snapshot

// set background color
function setCanvasBackground() {
	ctx.fillStyle = "#fff"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = selectedColor
}

// SET CANVAS WIDTH AND HEIGHT
window.addEventListener('load', (e)=> {
	canvas.width = canvas.offsetWidth
	canvas.height = canvas.offsetHeight
	setCanvasBackground()
})

// START DRAWING
const startDraw = (e) =>{
	isDrawing = true
	prevMouseX = e.offsetX
	prevMouseY = e.offsetY
	ctx.beginPath()
	ctx.lineWidth = brushWidth
	ctx.strokeStyle =selectedColor
	ctx.fillStyle = selectedColor
	snapshot = ctx.getImageData(0,0 , canvas.width, canvas.height)
	console.log(snapshot)
}


// DRAW RECTANGLE 
const drawRectangle = (e) => {
	!fillColor.checked ? 
	ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
	:ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

// DRAWINGCIRCLE
const drawCircle = (e) =>{
	ctx.beginPath()
	const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) + Math.pow(prevMouseY - e.offsetY, 2)
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2*Math.PI)
	fillColor.checked ? ctx.fill() :	ctx.stroke()
}

// DRAWTRIAGLE
const drawTriangle = (e) =>{
	ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY)
	ctx.lineTo(e.offsetX, e.offsetY)
	ctx.lineTo(prevMouseX *2 - e.offsetX, e.offsetY)
	ctx.closePath()
	fillColor.checked ? ctx.fill() :	ctx.stroke()
	ctx.stroke()
}

// DRAWING
const drawing = (e) =>{
	if(!isDrawing) return
	ctx.putImageData(snapshot , 0, 0)

	switch (selectedTool) {
		case 'brush':
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			break;
		case 'rectangle':
			drawRectangle(e)
			break;
		
		case 'circle':
			drawCircle(e)
			break	
		
		case 'triangle':
			drawTriangle(e)
			break	

		case 'eraser':
			ctx.strokeStyle = "#fff"
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			break	
	
		default:
			break;
	}
}


// TOOLS BUTTON
toolBtns.forEach(btn =>{
	btn.addEventListener('click', (e) =>{
		document.querySelector('.options .active').classList.remove('active')
		btn.classList.add('active')
		selectedTool = btn.id
		console.log(`Selected tool ${selectedTool}`)
	})
})

// COLOR PICKER
colorBtns.forEach(color => {
	color.addEventListener('click', (e) =>{
		document.querySelector('.colors .selected').classList.remove('selected')
		color.classList.add('selected')
		const bgColor = window.getComputedStyle(color).getPropertyValue('background-color')
		selectedColor = bgColor
		console.log(bgColor)
	})
})

// COLOR PICKER

colorPicker.addEventListener('change', ()=>{
	colorPicker.parentElement.style.background = colorPicker.value
	colorPicker.parentElement.click()
})

// CHANGE BRUSH WIDTH
sizeSlider.addEventListener('change', () => brushWidth = sizeSlider.value)

// CLEAR CANVAS BUTTON
clearCanvas.addEventListener("click", () =>{
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	setCanvasBackground()
})

// LIKE IMG
saveCanvas.addEventListener("click", () => {
	const link = document.createElement('a')
	link.download = `nosirbek+paint${Date.now()}.jpg`
	link.href = canvas.toDataURL()
	link.click()
})

// STOP DRAWING
const stopDraw = (e) => {
	isDrawing = false;
}


// CANVAS ADDEVENTLISTENER
canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDraw)
