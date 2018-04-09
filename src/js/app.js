let app= new Vue({
    el: '#app',
    data:{
        editingName: false,
        loginVisible: false,
        signUpVisible:false,
        resume:{
            name: '姓名',
            gender: '女',
            birthday: '1994年4月',
            jobTitle: '前端工程师',
            phone: '13266666666',
            email: 'example@example.com'
        },
        login:{
            email: '',
            password: ''
        },
        signUp:{
            email: '',
            password: ''
        }
    
    },
    methods: {
        onEdit(key,value){//修改的value放到resume中
            this.resume[key] = value
        },
        onLogin(e){
            AV.User.logIn(this.login.email,this.login.password)
            .then(function(user){
                console.log(user)
            }, function(error){
                if(error.code=== 211){
                    alert('邮箱不存在')
                }else if(error.code=== 210){
                    alert('邮箱或密码不匹配')
                }
            })
        },
        onSignUp(e){
            const user = new AV.User()
            user.setUsername(this.signUp.email)
            user.setPassword(this.signUp.password)
            user.setEmail(this.signUp.email)
            user.signUp().then(function (user){
                console.log(user)
            }, function(error){
            })
        },
        onClickSave(){
            let currentUser = AV.User.current()
            if(!currentUser){
                this.loginVisible= true
            }else{
                this.saveResume()
            }
        },
        onLogOut(){
            AV.User.logOut()
            alert('注销成功')
            window.location.reload()
        },
        saveResume(){
            let {id}= AV.User.current()
            let user= AV.Object.createWithoutData('User', id)
            user.set('resume', this.resume)
            user.save()
        },

    }
})