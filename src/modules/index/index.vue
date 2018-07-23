<template>
  <div>
    <v-header></v-header>
    <img src="../../assets/images/webpack.svg"/>
    <v-link href="user.html">跳转到个人中心</v-link>
    <v-footer></v-footer>
  </div>
</template>

<script>
  import vHeader from '../../components/header'
  import vFooter from '../../components/footer'

  export default {
    components: {vHeader, vFooter},
    data() {
      return {
        msg: 'home'
      }
    },
    async created() {
      const res = await this.$http.get('/users/cen2')
      console.log(res)
    }
  }
</script>

<style lang="less">
  img{
    display: block;
    width: 150px;
    height: 150px;
    margin: 10px auto;
  }
  a{
    display: block;
    text-align: center;
  }
</style>
