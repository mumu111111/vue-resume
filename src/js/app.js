let app= new Vue({
    el: '#app',
    data:{
        editingName: false,
        loginVisible: false,
        signUpVisible:false,
        currentUser:{
            objectId: undefined,
            email: '',
            fuck: 'fuck'
        },
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
        hasLogin(){
            return !!this.currentUser.objectId
        },
        onLogin(e){
            AV.User.logIn(this.login.email,this.login.password)
            .then((user)=>{
                // this.currentUser.id= user.id
                // this.currentUser.email= user.attributes.email
                user= user.toJSON()//对象转换为JSON
                this.currentUser.objectId= user.objectId//将数据库user的属性传给data的currentUser中
                this.currentUser.email= user.email
                this.loginVisible= false
                alert('登录成功')
            },(error)=>{
                if(error.code=== 211){
                    alert('邮箱不存在')
                }else if(error.code=== 210){
                    alert('邮箱或密码不匹配')
                }
            })
        },
        onLogOut(){
            AV.User.logOut()
            alert('注销成功')
            window.location.reload()//重新加载
        },
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
                alert(error.rawMessage)
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
        saveResume(){
            let {objectId}= AV.User.current().toJSON()
            let user= AV.Object.createWithoutData('User', objectId)
            user.set('resume', this.resume)
            user.save().then(()=>{
                alert('保存成功')
            },()=>{
                alert('保存失败')
            })
        },
        getResume(){//通过id获取对应的resume信息
            var query= new AV.Query('User')
            query.get(this.currentUser.objectId)
                .then((user)=>{
                    let resume= user.toJSON().resume
                    this.resume= resume
                }, (error)=>{
                })
        }
    }
})
//获取当前用户
let currentUser= AV.User.current()
if(currentUser){
    app.currentUser= currentUser.toJSON()
    app.getResume()
}