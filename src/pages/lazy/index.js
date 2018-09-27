import "./index.scss";
const Vue = process.env.NODE_ENV == 'development' ?
            require('@/lib/vue'):
            require('@/lib/vue.min');


//生成一些测试数据
const genImgListData = () =>{
    let images = [
        'http://img10.360buyimg.com/img/s600x600_jfs/t3586/215/2086933702/144606/c5885c8b/583e2f08N13aa7762.png',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3643/111/394078676/159202/a59f6b72/5809b3ccN41e5e01f.jpg',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3388/167/1949827805/115796/6ad813/583660fbNe5c34eae.jpg',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3163/281/5203602423/192427/db09be58/5865cb7eN808cc6f4.png',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3634/225/410542226/185677/c17f0ecf/5809b073N364fe77e.jpg',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3808/206/329427377/119593/a8cf7470/580df323Nb641ab96.jpg',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3805/133/325945617/116002/e90e0bdf/580df2b5Ncb04c5ac.jpg',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3046/316/3037048447/184004/706c779e/57eb584fN4f8b6502.jpg',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3580/212/1841964843/369414/e78739fb/58351586Ne20ac82a.jpg',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3274/70/4925773051/133266/fae6e84/585c9890Na19001c8.png',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3157/27/5204515328/123020/5f061d81/5865cbcaNfdf0557f.png',
        'http://img10.360buyimg.com/img/s600x600_jfs/t3265/341/5152556931/143928/bdf279a4/5865cb96Nff26fc5d.png'
    ]
    images = images.concat(images.slice(0, 4))
    return images.map(item => {
        return {
            url: item,
            loaded: false
        }
    })
}

new Vue({
    el: '#app',
    data() {
        return {
            imgList: genImgListData()
        }
    },
    computed:{
        
    },
    watch:{
       
    },
    created(){
        
    },
    mounted(){
        this.checkImgs();
        setTimeout(() => {
            window.addEventListener("scroll",function(e){
                this.checkImgs();
            }.bind(this));
        }, 2000);
    },  
    methods:{
        checkImgs() {
            const imgs = document.querySelectorAll('.my-photo');
            Array.from(imgs).forEach(el => {
              if (this.isInSight(el)) {
                this.loadImg(el);
              }
            })
        },
        isInSight(el) {
            const bound = el.getBoundingClientRect();
            const clientHeight = window.innerHeight;
            //如果只考虑向下滚动加载
            //const clientWidth = window.innerWeight;
            return bound.top <= clientHeight + 100;
        },
        loadImg(el) {
            if (!el.src) {
              const source = el.dataset.src;
              el.src = source;
            }
        }
    } 
})            