import axios from 'axios'


let myEcharts = echarts.init(document.querySelector('#bar_chart'))
let myEcharts_fan = echarts.init(document.querySelector('#fan_chart'))


function echarts_refresh(dataAxis, data) {
    let yMax = 1000;
let dataShadow = [];
for (let i = 0; i < data.length; i++) {
  dataShadow.push(yMax);
}
let option = {
    title: {
    text: '工作数量分布柱状图',
    subtext: '工作数量分布柱状图'
    },
    xAxis: {
    data: dataAxis,
    axisLabel: {
      inside: true,
      color: '#fff'
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
    },
    yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999'
    }
    },
    dataZoom: [
    {
      type: 'inside'
    }
    ],
    series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      },
      data: data
    }
    ]
    };
    // Enable data zoom when user click bar.
    const zoomSize = 6;
    myEcharts.on('click', function (params) {
      console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
      myEcharts.dispatchAction({
        type: 'dataZoom',
        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
        endValue:
          dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
      });
    });
    myEcharts.setOption(option, true)

}

let selectArea = document.querySelector('#selectArea')

let a = () => {
    axios({
        url: '/rate/bar/' + selectArea.value,
    }).then(res => {
        echarts_refresh(res.data.xVals, res.data.yVals)
    })
}

a()

selectArea.addEventListener('change',a)