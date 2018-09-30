<template>
    <div>
        <a href="http://www.liuhaihua.cn/archives/115548.html">Decorators in ES7</a><br>
        <a href="https://github.com/rccoder/blog/issues/23#issue-208381273">https://github.com/rccoder/blog/issues/23#issue-208381273</a>
        <br>
        {{test}}
    </div>
</template>
<style lang="scss">
.test{
    width: 6px;
    height: 6px;
    background-color: #fff;
    &:before{
        color:red;
    }
}
</style>
<script>

export default {
    data() {
        return {
            test:'test11'
        }
    },
    computed:{
        
    },
    methods: {

    }
}
</script>

