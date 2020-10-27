class Chart {

    constructor(canvas, ctx, obj) {
        this.canvas = canvas;

        this.ctx = ctx;

        this.coordinatesArr = [];

        this.type = obj.type;

        this.data = obj.data;
        this.title = obj.data.datasets.label;

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

        this.setEnvironmentAndPrompt();
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
        this.canvas.height = (32 * (this.countSteps + 2)) + 20;
        this.canvas.width = (this.data.labels.length * 2 * 32) + (String(this.limit).length * 7) + 6;
        if (this.type === 'graph') this.canvas.width += -80;
    }

    setGrid() {
        let limit = this.limit,
            x = (String(limit).length * 7),
            y = 32,
            count = this.data.labels.length;

        this.ctx.textAlign = "end";

        while (true) {

            this.ctx.fillText(limit, x, y);

            if (limit <= 0) break;

            y += 32;
            limit -= this.step;
        }

        x = 0;
        limit = this.limit;
        y = 32;

        while (true) {

            if (limit <= 0) break;

            this.setLine(x, y + 5, x + 4, y + 5, false);

            if (x >= this.canvas.width) {
                x = 0;
                y += 32;
                limit -= this.step;
            } else {
                x += 8;
            }

        }

        this.setLine(0, y + 5, this.canvas.width, y + 5, false);

        x = (String(limit).length * 7) + 11;
        y += 32;

        this.setLine(x, 0, x, y + 5, false);

        y = 0;
        x += 49;

        while (true) {

            if (count <= 0) break;

            this.setLine(x, y, x, y + 4, false);

            if (y >= (32 * (this.countSteps + 1))) {
                x += 64;
                y = 0;
                count--;
            } else {
                y += 8;
            }

        }


    }

    setColumn() {
        let limit = this.limit,
            x = String(limit).length * 7 + 5 + 32,
            y = 0,
            data = this.data.datasets.data,
            columnHight = 0,
            circleY = (32 * (this.countSteps + 2)) - 10,
            contentColor = this.data.datasets.contentColor;

        for (let i = 0; i < data.length; i++) {

            this.ctx.strokeStyle = `rgba(${contentColor.r}, ${contentColor.g}, ${contentColor.b}, 1)`;
            this.ctx.fillStyle = `rgba(${contentColor.r}, ${contentColor.g}, ${contentColor.b}, 0.7)`;

            y = ((this.countSteps - (data[i] * this.countSteps) / limit) * 32) + 32 + 5;

            columnHight = ((data[i] * this.countSteps) / limit) * 32;

            this.ctx.fillRect(x, y, 32, columnHight - 1);
            this.ctx.strokeRect(x, y, 32, columnHight - 1);

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
            data = this.data.datasets.data,
            labelColor = this.data.datasets.labelColor,
            contentColor = this.data.datasets.contentColor;

        this.ctx.beginPath();
        this.ctx.strokeStyle = `rgba(${contentColor.r}, ${contentColor.g}, ${contentColor.b}, 1)`;
        this.ctx.fillStyle = `rgba(${contentColor.r}, ${contentColor.g}, ${contentColor.b}, 0.5)`;

        for (let i = 0; i < data.length; i++) {

            endY = ((this.countSteps - (data[i] * this.countSteps) / limit) * 32) + 32 + 5;

            if (i === 0) {
                startY = endY;
                this.ctx.moveTo(startX, startY);
            }

            if (i !== 0) {
                this.ctx.bezierCurveTo(startX + 32, startY, startX + 32, endY, endX, endY);

                startX = endX;
                startY = endY;

                endX += 64;
            }

            this.coordinatesArr.push({
                x: startX,
                y: startY
            })

        }

        this.ctx.lineTo(startX, (32 * (this.countSteps + 1)) + 4);

        this.ctx.lineTo((String(limit).length * 7 + 5), (32 * (this.countSteps + 1)) + 4);

        this.ctx.stroke();

        this.ctx.fill();

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

    setEnvironmentAndPrompt() {
        let wrapper = document.createElement('div');

        let title = document.createElement('h2');

        title.textContent = this.title;
        title.style.textAlign = 'center';

        wrapper.id = this.canvas.id + '_wrapper';

        this.canvas.before(wrapper);

        wrapper.append(title);
        wrapper.append(this.canvas);

        wrapper.style.width = this.canvas.width + 'px';

        let prompt = document.createElement('div'),
            invisibleString = document.createElement('div'),
            labelColor = this.data.datasets.labelColor,
            labels = JSON.stringify(this.data.labels),
            coords = JSON.stringify(this.coordinatesArr),
            data = JSON.stringify(this.data.datasets.data),
            contentColor = this.data.datasets.contentColor;

        wrapper.style.position = 'relative';
        wrapper.style.zIndex = '2';

        this.canvas.style.zIndex = '2';

        invisibleString.style.display = 'none';
        invisibleString.textContent = labels + ' - ' + coords + ' - ' + data;
        invisibleString.id = this.canvas.id + '_invisibleString';

        prompt.id = this.canvas.id + '_chartPrompt'
        prompt.style.position = 'absolute';
        prompt.style.padding = '5px 10px';
        prompt.style.border = `1px solid rgba(0, 0, 0, 1)`;
        prompt.style.borderRadius = '10px';
        prompt.style.top = `0px`;
        prompt.style.left = `0px`;
        prompt.style.backgroundColor = `rgba(0, 0, 0, 0.5)`;
        prompt.style.color = '#fff';
        prompt.style.textAlign = 'center';
        prompt.style.zIndex = '3';
        prompt.style.display = 'none';
        

        this.canvas.addEventListener('mouseout', e => {
            let prompt = document.getElementById(e.target.id + '_chartPrompt');

            prompt.style.display = 'none';
        });

        this.canvas.addEventListener('mousemove', e => {

            let coordPrompt = {},
                prompt = document.getElementById(e.target.id + '_chartPrompt'),
                invisibleString = document.getElementById(e.target.id + '_invisibleString').textContent.split(' - '),
                labels = JSON.parse(invisibleString[0]),
                coordinatesArr = JSON.parse(invisibleString[1]),
                datasets = JSON.parse(invisibleString[2]),
                coordMouse = {
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop
                };

            for (let i = 0; i < coordinatesArr.length; i++) {

                coordPrompt = coordinatesArr[i];

                //console.log(coordPrompt);

                if (coordMouse.x >= coordPrompt.x - 32 && coordMouse.x <= coordPrompt.x + 32) {
                    let title = document.createTextNode(labels[i]),
                        data = document.createTextNode('axisY:' + datasets[i]);
                    prompt.innerHTML = '';
                    prompt.append(title);
                    prompt.innerHTML += '<br>';
                    prompt.append(data);
                    prompt.style.display = 'block';
                    prompt.style.top = `${coordPrompt.y}px`;
                    prompt.style.left = `${coordPrompt.x - (prompt.offsetWidth / 2)}px`;
                    prompt.style.zIndex = 3;

                }

            }

            e.preventDefault();
        });

        wrapper.append(invisibleString);
        wrapper.append(prompt);
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

        for (let i = 0; i < this.coordinatesArr.length; i++) {

            for (let key in this.coordinatesArr[i]) {
                console.log(`coordinatesArr[${i}].${key} - ` + this.coordinatesArr[i][key]);
            }

        }


    }

}

let canvas1 = document.getElementById('myChart1');
let ctx1 = canvas1.getContext('2d')

let chart1 = new Chart(canvas1, ctx1, {
    type: 'diagramm',

    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: {
            label: 'My First dataset',
            labelColor: '#FFFFCC',
            contentColor: {
                r: '255',
                g: '218',
                b: '185'
            },
            data: [24, 10, 12, 2, 23, 23, 45, 56, 5, 2, 20, 30, 25]
        }
    },
});

chart1.getAll();

let canvas2 = document.getElementById('myChart2');
let ctx2 = canvas2.getContext('2d')

let chart2 = new Chart(canvas2, ctx2, {
    type: 'graph',

    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: {
            label: 'My First dataset',
            labelColor: '#FFFFCC',
            contentColor: {
                r: '255',
                g: '218',
                b: '185'
            },
            data: [24, 10, 12, 2, 23, 23, 45, 56, 5, 2, 20, 30, 25]
        }
    },
});

chart2.getAll();