function inputUpdateGraphType(shouldUpdate) {
    input = document.getElementsByName("graphType");
    selectedInput = null;
    input.forEach(element => {
        if (element.checked == true) selectedInput = element;
    });
    inputGraphType = selectedInput.id;
    if (shouldUpdate) update()
}

function inputUpdateLinearParameters(shouldUpdate) {
    m = document.getElementById("linearM").value;
    b = document.getElementById("linearB").value;
    linearM = m;
    linearB = b;
    if (shouldUpdate) update()
}

function inputUpdateExponentialParameters(shouldUpdate) {
    a = document.getElementById("exponentialA").value;
    d = document.getElementById("exponentialD").value;
    p = document.getElementById("exponentialP").value;
    e = document.getElementById("exponentialE").value;
    exponentialA = a;
    exponentialD = d;
    exponentialP = p;
    exponentialE = e;
    if (shouldUpdate) update()
}

function update() {
    inputUpdateGraphType(false)
    inputUpdateLinearParameters(false)
    inputUpdateExponentialParameters(false)
    changeInput()
    outputFormula()
    updateGraph()
}

function changeInput() {
    document.getElementById("linearInput").hidden = true;
    document.getElementById("exponentialInput").hidden = true;
    document.getElementById(inputGraphType + "Input").hidden = false;
}

function outputFormula() {
    if (inputGraphType == "linear") {
        if (linearM == 1 || linearM == undefined) outM = "";
        else if (linearM == -1) outM = "-";
        else outM = linearM.toString();

        if (linearB == 0 || linearB == undefined) outB = "";
        else if (linearB > 0) outB = " + " + linearB.toString();
        else outB = " - " + Math.abs(linearB);

        document.getElementById("linearInputFormulaOutput").innerHTML =
        "<p>f(x) = " + outM + "x" + outB + "</p>";
    }

    if(inputGraphType == "exponential") {
        if (exponentialD == 0 || exponentialD == undefined) {
            if (exponentialA == 1 || exponentialA == undefined) outA = "";
            else outA = exponentialA.toString();
            outFirstPart = outA + "x"
        } else{
            if (exponentialA == 1 || exponentialA == undefined) outA = "";
            else outA = exponentialA.toString();
            if (exponentialD > 0) outFirstPart = outA + "( x - " + exponentialD.toString() + ")";
            else outFirstPart = outA + "( x + " + Math.abs(exponentialD).toString() + ")";
        }
        if (exponentialP == 1) outMiddle = "";
        else if (exponentialP == undefined) outMiddle = "<sup>2</sup>";
        else outMiddle = "<sup>" + exponentialP.toString() + "</sup>"


        if (exponentialE == 0 || exponentialE == undefined) outEnd = "";
        else if (exponentialE > 0) outEnd = " + " + exponentialE.toString();
        else outEnd = " - " + Math.abs(exponentialE);

        document.getElementById("exponentialInputFormulaOutput").innerHTML =
        "<p> f(x) = " + outFirstPart + outMiddle + outEnd + "</p>"
    }
}

function updateGraph() {
    {
        userSize = document.getElementById("canvasSize").value;  // get data
        document.getElementById("displaySize").innerHTML = userSize

        scaleX = Math.round(document.getElementById("scaleX").value**2)
        document.getElementById("displayScaleX").innerHTML = scaleX

        scaleY = Math.round(document.getElementById("scaleY").value**2)
        document.getElementById("displayScaleY").innerHTML = scaleY
    }

    {
        if (window.innerHeight < window.innerWidth) {  //change size
            canvas.width = (window.innerHeight / userSize);
            canvas.height = (window.innerHeight / userSize);
        }
        else {
            canvas.width = (window.innerWidth / userSize);
            canvas.height = (window.innerWidth / userSize);
        }
    }

    {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(canvas.width / 2, 0)
        ctx.lineTo(canvas.width / 2, canvas.height)
        ctx.moveTo(0,canvas.height / 2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.strokeStyle = "#000000";
        ctx.stroke()
    }

    {
        ctx.strokeStyle = "#80808080";
        ctx.fillStyle = "#000000";
        ctx.font = '16px serif';
        ctx.textAlign = "center"
        for (i in [...Array(scaleX * 2 +1).keys()]) {
            ctx.beginPath()
            // canvas.height/2 -10
            ctx.moveTo(calcPosX(i - scaleX), canvas.height * 0.05)
            ctx.lineTo(calcPosX(i - scaleX), canvas.height * 0.95)
            ctx.fillText((i - scaleX).toString(), calcPosX(i - scaleX), canvas.height / 2 + 15)
            ctx.stroke()
        }
        for (i in [...Array(scaleY * 2 +1).keys()]) {
            ctx.beginPath()

            ctx.moveTo(canvas.width * 0.05, calcPosY(i - scaleY))
            ctx.lineTo(canvas.width * 0.95, calcPosY(i - scaleY))
            ctx.fillText((i - scaleY).toString(), canvas.width / 2 + 10, calcPosY(i - scaleY))
            ctx.stroke()
        }
    }

    if (inputGraphType == "linear") drawLinearGraph(); else drawExponentialCurve();
}

function calcPosX(x) {
    return calculatePosition(x,0)[0];
}

function calcPosY(y) {
    return calculatePosition(0,y)[1];
}

function calculatePosition(x, y)  {

    middle = [canvas.width/2, canvas.height/2];

    scaleMultiplyX = middle[0] / scaleX * 0.9;
    scaleMultiplyY = middle[1] / scaleY * 0.9;

    returnX = x * scaleMultiplyX + middle[0];
    returnY = -1 * y * scaleMultiplyY + middle[1];

    return [returnX, returnY];
}

function drawExponentialCurve() {
    ctx.beginPath()
    ctx.strokeStyle = "#f00"
    x = (1 - middle[0]) / scaleMultiplyX
    y = exponentialA*Math.pow(x - exponentialD, exponentialP) + parseFloat(exponentialE)
    coordY = calcPosY(y)
    ctx.moveTo(1, coordY)
    for (i in [...Array(canvas.width).keys()]) {
        x = (i - middle[0]) / scaleMultiplyX
        y = (exponentialA*Math.pow(x - exponentialD, exponentialP)) + parseFloat(exponentialE)
        coordY = calcPosY(y)
        ctx.lineTo(i, coordY)
    }
    ctx.stroke()
}

function drawLinearGraph() {
    ctx.beginPath()
    ctx.strokeStyle = "#f00"
    x = (1 - middle[0]) / scaleMultiplyX
    y =  linearM*x + parseFloat(linearB)
    coordY = calcPosY(y)
    ctx.moveTo(1, coordY)
    for (i in [...Array(canvas.width).keys()]) {
        x = (i - middle[0]) / scaleMultiplyX
        y = linearM*x + parseFloat(linearB)
        coordY = calcPosY(y)
        ctx.lineTo(i, coordY)
    }
    ctx.stroke()
}

const canvas = document.getElementById("graph");
const ctx = canvas.getContext("2d");

//scale vareables
userSize = 2;
scaleX = 9;
scaleY = 9;
scaleMultiplyX = null;
scaleMultiplyY = null;

//linear or exponential
var inputGraphType = null;

//Linear vareables
var linearM = null;
var linearB = null;

//exponential vareables
var exponentialA = null;
var exponentialD = null;
var exponentialP = null;
var exponentialE = null;

update()
