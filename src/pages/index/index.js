import "./index.scss";
const Vue = process.env.NODE_ENV == 'development' ?
            require('@/lib/vue'):
            require('@/lib/vue.min');

const echarts = require('echarts');

const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

/* const fetch = file  =>{
    const promise =  new Promise(function(resolve, reject){
        $.get(`./assets/db/${file}.json`,function(res){
            resolve(res);
        });
    });
    return promise;        
}
async function get(file = 'time') {
    let res = await fetch(file);
} */
//const getData = time => require(`@/assets/db/groupability-${time}.json`);

const getData = (()=>{
    const timeData = {};
    return file=>{
        if(timeData[file])
            return timeData[file];
        let data;
        $.ajax({
            url: `./assets/db/${file}.json`,
            cache: false,
            async: false,
            success: function(res){
                data = res;
                timeData[file] = res;
            },
            error:function(res){
                data = false;
            }
        });
        return data;
    }
})();

const timeList = getData('time');

const getGroupKeys = (function(){
    return ['商业化产品开发组','搜索组','服务器一组','服务器二组','服务器三组','服务器四组','服务器五组'];
    /* let data = getData('groupability-'+timeList[0]);
    return Object.keys(data); */
})();


const getGroupability = timeList=>{
    let temp = [];
    let currentIndex = [];
    timeList.forEach((item,index)=>{
        if(getData('groupability-'+item) === false){
            currentIndex.push(index);
        }else{
            temp.push({
                time:item,
                data:getData('groupability-'+item)
            });
        }
    });
    for(let i = 0,l = currentIndex.length;i<l;i++){
        timeList.splice(currentIndex[i], 1);
    }
    return temp;
};


const options = {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: []
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis:  [
        {
            type: 'value',
            name: '数值',
            axisLabel: {
                formatter: '{value}'
            }
        },
        {
            type: 'value',
            name: '百分比',
            axisLabel: {
                formatter: '{value} %'
            }
        }
    ],
    xAxis: {
        type: 'category',
        data: [...timeList]
    },
    series: []
};

const setSeriesItem = (name,data=[],color)=>{
    return {
        name: name,
        type: 'bar',
        stack: '总量',
        label: {
            normal: {
                show: true,
                position: 'inside'
            }
        },
        itemStyle:{
            color:color
        }, 
        data: data
    }
}
//不需要  具备 不具备
const typeList = ['具备','不具备','不需要'];

const architectureKey = [
    {
        key:'withoutsinglepoint',
        value:'无单点'
    },{
        key:'circuitbreaker',
        value:'熔断能力'
    },{
        key:'demotion',
        value:'降级能力'
    },{
        key:'flowlimitation',
        value:'限流能力'
    },{
        key:'planforaccident',
        value:'预案'
    },{
        key:'recoverfromnothing',
        value:'从零恢复'
    },{
        key:'readwriteseparation',
        value:'读写分离'
    },{
        key:'dynastaticseparation',
        value:'动静分离'
    },{
        key:'bdatasepfromandata',
        value:'业务数据和大数据分离'
    },{
        key:'autoexpansion',
        value:'弹性伸缩'
    },{
        key:'checkalive',
        value:'check.do接口检测'
    },{
        key:'monitoring',
        value:'监控能力'
    },{
        key:'multiinstaninacity',
        value:'同城多活'
    },{
        key:'multiinstanindiffcity',
        value:'异地多活'
    },{
        key:'dubborpc',
        value:'dubbo化'
    },{
        key:'datausingvarapi',
        value:'业务和数据分离'
    }
]

new Vue({
    el: '#app',
    data() {
        return {
            title:'测试数据',
            timeList:timeList,
            newTimeList: timeList || [],
            mainHeight:0,

            groupValue:getGroupKeys[0] || '', //组value
            groupkey:getGroupKeys||[], //组key

            architectureValue:architectureKey[0].key || '',//架构能力value
            architectureKey:architectureKey || [], //架构能力key

            chart:null,
            seriesDatas:[],
            beginTime:'',
            endTime:'',
            beginTime$:null,
            endTime$:null,

            beginIndex:-1,
            endIndex:-1
        }
    },
    computed:{
        
    },
    watch:{
        groupValue(){
            this.initChart(options,this.newTimeList);
        },
        architectureValue(){
            this.initChart(options,this.newTimeList);
        }
    },
    created(){
        this.mainHeight = clientHeight-120;
    },
    mounted(){
        this.beginTime$ = $('#beginTime');
        this.endTime$ =  $('#endTime');

        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(this.$refs.main);
        this.initChart(options,this.newTimeList);
    },
    methods:{
        formatTime(str){
            let arr = str.split('-');
            return arr[0]+'-'+arr[1]+'-'+ arr[2];
        },
        search(){
            this.beginTime = this.beginTime$.val() || this.formatTime(timeList[0]);
            this.endTime = this.endTime$.val() || this.formatTime(timeList[timeList.length-1]); 

            let starttime = new Date(this.beginTime).getTime();
            let endtime = new Date(this.endTime).getTime();
            if(starttime > endtime){
                alert('结束时间小于开始时间');
                return;
            }

            this.beginIndex = -1;
            let flag = false;
            timeList.forEach((item,index)=>{
                let timestamp = this.formatTime(item);
                    timestamp = new Date(timestamp);
                if(!flag && starttime == timestamp.getTime() ){
                    this.beginIndex = index;
                    flag = true;
                }
                if(!flag && starttime > timestamp.getTime()){
                    this.beginIndex = index+1;
                }
            });
            if(this.beginIndex == -1){
                let starttime = new Date(this.beginTime),mintime = this.formatTime(timeList[0]),maxtime = this.formatTime(timeList[timeList.length-1]);
                if(starttime.getTime() <= new Date(mintime).getTime()){
                    this.beginIndex = 0;
                }
            }
            
            this.newTimeList = [];
            let endTimeStamp = new Date(this.endTime).getTime();
            for(let i = this.beginIndex , l = timeList.length; i < l && this.beginIndex != -1; i++){
                let arr = timeList[i].split('-');
                let timestamp = new Date(arr[0]+'-'+arr[1]+'-'+ arr[2]).getTime();
                if(endTimeStamp >= timestamp){
                    this.newTimeList.push(timeList[i]);
                }
            }

            options.xAxis.data = [...this.newTimeList];
            this.initChart(options,this.newTimeList);
        },
        initChart(options,timeList){
            // 绘制图表
            this.setOptions(options,timeList);
            this.chart.setOption(options);
        },
        setOptions(options,timeList){
            let {dataList,proportion,fullArr} = this.getData(this.groupValue,this.architectureValue,timeList);
            //console.log(fullArr);
            let xMaxList = fullArr.map(currentValue=>{
                return currentValue[currentValue.length-1];
            });
            let xMax = Math.max(...xMaxList);
            options.yAxis[0].max = parseInt(xMax) + parseInt(xMax*0.1);
            let yMax = Math.max(...proportion);
            options.yAxis[1].max = parseInt(yMax) + 1;

            let colorMap = ['rgb(26,211,177)','rgb(95,176,232)','rgb(250,111,134)'];
            let tList = ['不需要','具备','不具备'];
            let series = tList.map((item,index)=>{
                return setSeriesItem(item,dataList[item],colorMap[index]);
            });
            options.legend.data = [...tList,'百分比'];
            options.series = [...series,{
                name:'百分比',
                type:'line',
                yAxisIndex: 1,
                data:proportion,
                label:{
                    show:true,
                    formatter:'{c} %'
                }
            }];
        },
        getData(groupkey,architectureValue,timeList){
            let arr = [],
                dataList = {},
                groupabilityList = getGroupability(timeList);

            for(let i = 0,l = groupabilityList.length; i < l;i++){
                let item = groupabilityList[i].data;
                for (let key in item){
                    let o = item[key];
                    if(key == groupkey){
                        arr.push(o.map(function(currentValue){
                            return currentValue[architectureValue];
                        }));
                    }
                }
            }
            typeList.forEach((item,index)=>{
                let data =[];
                arr.forEach(function(currentValue){
                    data.push(currentValue[index+1])
                });
                dataList[item] = data;
            });
            //计算百分比
            let proportion = arr.map((item)=>{
                let n = ( (parseInt(item[1])+parseInt(item[3])) / (parseInt(item[1])+parseInt(item[2])+parseInt(item[3])) ) * 100;
                return n.toFixed(2);
            });
            return {dataList,proportion,fullArr:arr};
        }
    }
});