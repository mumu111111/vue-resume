window.SignUp= {
    data(){
        return {
            signUp:{
                email: '',
                password: ''
            }
        }
    },
    template: `
        <div  class="signUp" v-cloak>
            <form class="form" @submit.prevent="onSignUp">
                <h2>注册</h2>
                <button type="button" @click="signUpVisible = false">关闭</button>
                <div class="row">
                    <label>邮箱</label>
                    <input type="text" v-model="signUp.email">
                </div>
                <div class="row">
                    <label>密码</label>
                    <input type="password" v-model="signUp.password">
                </div>
                <div class="actions">
                    <button type="submit">提交</button>
                    <router-link to="/login">登录</router-link>
                </div>
            </form>
        </div>
    `,
    methods:{
        onSignUp(e){
            const user = new AV.User() //创建用户
            user.setUsername(this.signUp.email)
            user.setPassword(this.signUp.password)
            user.setEmail(this.signUp.email)
            user.signUp().then((user)=>{
                alert('注册成功')
                user= user.toJSON()
                this.currentUser.objectId= user.objectId
                this.currentUser.email= user.email
                this.signUpVisible= false
            },(error)=>{
                alert(error.rawMessage)//返回错误描述
            })
        },
        onClickLogin(e){
            this.$emit('goToLogin')
        }
    }
}
Vue.component('signUp', window.SignUp)