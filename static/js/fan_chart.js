import axios from 'axios'



let myEcharts = echarts.init(document.querySelector('#fan_chart'))


function echarts_refresh(data_list) {
  let option = {
      title: {
        top: '100px',
        text: 'java开发工程师, 工作数量分布扇形图',
        subtext: 'Java development engineer, fan chart of work quantity distribution ',
        left: 'right'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: data_list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    myEcharts.setOption(option, true)

}



let selectArea = document.querySelector('#fan_selectArea')

let a = () => {
    axios({
        url: '/rate/fan/' + selectArea.value,
    }).then(res => {
      echarts_refresh(res.data.datalist)
    })
}

a()

selectArea.addEventListener('change',a)