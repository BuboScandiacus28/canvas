class Chart {

    constructor(canvas, ctx, obj) {
        this.canvas = canvas;

        this.ctx = ctx;

        this.type = obj.type;
        this.data = obj.data;
        this.title = obj.data.datasets.label;

        this.setTitle();

        this.maxData = this.data.datasets.data;

        this.power = this.setPower(10);

        this.step = this.power;

        this.limit = {
            maxData: this.maxData,
            step: this.step
        };

        this.countSteps = (this.limit / this.step);

        this.setCanvasSize();

        this.setGrid();

        if (this.type === 'graph') {
            this.setGraph();
        } else if (this.type === 'diagramm') {
            this.setColumn();
        }

        this.setLegend();
    }

    get type() {
        return this._type;
    }
    set type(type) {
        this._type = type;
    }

    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
    }

    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }

    get maxData() {
        return this._maxData;
    }
    set maxData(arrayNumbers) {
        this._maxData = Math.max.apply(null, arrayNumbers);
    }

    get limit() {
        return this._limit;
    }
    set limit(obj) {
        let limit = Math.ceil(obj.maxData / 5) * 5;
        if (obj.maxData % 5 === 0) limit += obj.step;
        this._limit = limit;
    }

    get power() {
        return this._power;
    }
    set power(power) {
        this._power = power;
    }

    get step() {
        return this._step;
    }
    set step(power) {
        this._step = 5 * Math.pow(10, power);
    }

    get countSteps() {
        return this._countSteps;
    }
    set countSteps(countSteps) {
        this._countSteps = countSteps;
    }

    setCanvasSize() {
        this.canvas.height = (32 * (this.countSteps + 2)) + 20 + (32 * this.data.labels.length) + 32;
        this.canvas.width = (this.data.labels.length * 2 * 32) + (String(this.limit).length * 7) + 5;
    }

    setGrid() {
        let limit = this.limit,
            x = String(limit).length * 7,
            y = 32;

        this.ctx.textAlign = "end";

        while (true) {

            this.ctx.fillText(limit, x, y);

            this.setLine(0, y + 5, this.canvas.width, y + 5, false);

            if (limit <= 0) break;

            y += 32;
            limit -= this.step;
        }

        x += 5;
        y += 32;

        this.setLine(x, 0, x, y + 5, false);
    }

    setLegend() {
        let x = String(this.limit).length * 7,
            y = (32 * (this.countSteps + 2)) + 32,
            data = this.data.datasets.data,
            labels = this.data.labels;

        for (let i = 0; i < labels.length; i++) {

            this.setCircle(x, y, i + 1);

            this.ctx.textAlign = "start";
            this.ctx.fillText(` — ${labels[i]} со значением: ${data[i]}`, x + 13, y + 3);

            y += 32;
        }
    }

    setColumn() {
        let limit = this.limit,
            x = String(limit).length * 7 + 5 + 32,
            y = 0,
            data = this.data.datasets.data,
            columnHight = 0,
            circleY = (32 * (this.countSteps + 2)) - 10;

        for (let i = 0; i < data.length; i++) {

            this.ctx.fillStyle = this.data.datasets.contentColor;

            y = ((this.countSteps - (data[i] * this.countSteps) / limit) * 32) + 32 + 5;

            columnHight = ((data[i] * this.countSteps) / limit) * 32;

            this.ctx.fillRect(x, y, 32, columnHight);

            this.setCircle(x + 16, circleY, i + 1);

            x += 64;
        }
    }

    setGraph() {
        let limit = this.limit,
            startX = String(limit).length * 7 + 5,
            startY = (32 * (this.countSteps + 1)) + 5,
            endX = startX + 48,
            endY = 0,
            data = this.data.datasets.data;

        for (let i = 0; i < data.length; i++) {

            endY = ((this.countSteps - (data[i] * this.countSteps) / limit) * 32) + 32 + 5;


            this.setLine(startX, startY, endX, endY);

            if (i > 0) {
                this.setCircle(startX, startY, i);
            }
            if (i === data.length - 1) {
                this.setCircle(endX, endY, i + 1);
            }

            startX = endX;
            startY = endY;

            endX += 64;
        }

    }

    setCircle(startX, startY, text) {
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(startX, startY, 10, 0, 2 * Math.PI, false);
        this.ctx.fill();

        this.ctx.fillStyle = this.data.datasets.labelColor;
        this.ctx.textAlign = "center";
        this.ctx.fillText(text, startX, startY + 3);
        this.ctx.fillStyle = "#000";
    }

    setLine(startX, startY, endX, endY, checkColor = true) {

        if (checkColor) {
            this.ctx.strokeStyle = this.data.datasets.contentColor;
        }
        
        this.ctx.beginPath();

        this.ctx.moveTo(startX, startY);

        this.ctx.lineTo(endX, endY);

        this.ctx.stroke();

        this.ctx.strokeStyle = "#000";
    }

    setPower(limit) {
        if (limit - this.maxData >= 0) {
            return -1;
        } else {
            return 1 + this.setPower(limit * 10);
        }
    }

    setTitle() {
        let title = document.createElement('h2');
        title.textContent = this.title;
        title.style.textAlign = 'center';
        this.canvas.before(title);
    }

    getAll() {
        console.log('ctx: ');
        console.log(this.ctx);

        console.log('type - ' + this.type);

        console.log('data: ');
        console.log(this.data);

        console.log('maxData - ' + this.maxData);

        console.log('limit - ' + this.limit);

        console.log('power - ' + this.power);

        console.log('step - ' + this.step);

        console.log('countSteps - ' + this.countSteps);

        console.log('title - ' + this.title);
    }

}

let canvas = document.getElementById('myChart');
let ctx = canvas.getContext('2d')
 
let chart = new Chart(canvas, ctx, {
    type: 'diagramm',

    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: {
            label: 'My First dataset',
            labelColor: '#FFFFCC',
            contentColor: '#996600',
            data: [24, 10, 12, 2, 23, 23, 45, 56, 5, 2, 20, 30, 25]
        }
    },
});

chart.getAll();