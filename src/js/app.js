let app= new Vue({
    el: '#app',
    data:{
        editingName: false,
        loginVisible: false,
        signUpVisible:false,
        shareVisible: false,
        currentUser:{
            objectId: undefined,
            email: '',
            fuck: 'fuck'
        },
        previewUser:{//预览用户
            objectId: undefined
        },
        previewResume:{},
        resume:{
            name: '姓名',
            gender: '女',
            birthday: '1994年4月',
            jobTitle: '前端工程师',
            phone: '13266666666',
            email: 'example@example.com',
            skills: [
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
                {name: '请填写技能名称', description: '请填写技能描述'},
            ],
            projects: [
                {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键词', description: '请详细描述'},
                {name: '请填写项目名称', link: 'http://...', keywords: '请填写关键词', description: '请详细描述'}
            ]
        },

        login:{
            email: '',
            password: ''
        },
        signUp:{
            email: '',
            password: ''
        },
        shareLink: '不知道',
        mode: 'edit' //preview
    },
    computed:{
        displayResume(){
            return this.mode==='preview'? this.previewResume : this.resume  
        }
    },
    watch:{
        'currentUser.objectId': function(newValue, oldValue){
            if(newValue){
                this.getResume(this.currentUser)
            }
        }
    },
    methods: {
        onEdit(key,value){//修改的value放到resume中
            //key  =  skills[${index}].name = name值（字符串），并不是name
            let regex= /\[(\d+)\]/g 
            key = key.replace(regex, (match, number) => `.${number}`)
            console.log(key)
            //key = skills.0.name
           let  keys= key.split('.') //[skills, 0, name]

            console.log(keys)
            let result= this.resume
            for(let i=0; i< keys.length; i++){
                if(i=== keys.length-1){ //一般最后一个i的value就是key
                    result[keys[i]]= value //为value找到对应的key
                }else{
                    result= result[keys[i]]
                }
            }
        },
        hasLogin(){
            return !!this.currentUser.objectId
        },
        onLogin(e){
            AV.User.logIn(this.login.email,this.login.password)
            .then((user)=>{
                user= user.toJSON()//序列化user
                this.currentUser.objectId= user.objectId//将数据库user的属性传给本地的currentUser中
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
                alert(error.rawMessage)//返回错误描述
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
        getResume(user){//通过id获取用户保存过的resume数据
            var query= new AV.Query('User')
            return query.get(user.objectId)
                .then((user)=>{
                    let resume= user.toJSON().resume
                    // this.resume= resume
                    // Object.assign(this.resume, resume)
                    return resume  //return ,自己处理resume
                    
                }, (error)=>{
                })
        },
        addSkill(){
            this.resume.skills.push({name:'请填写技能名称',description:'请填写技能描述'})
        },
        removeSkill(index){
            this.resume.skills.splice(index, 1)//删除第index个
        },
        addProject(){
            this.resume.projects.push({name: '请填写项目名称', link: 'http://...', keywords: '请填写关键词', description: '请详细描述'})
        },
        removeProject(index){
            this.resume.projects.splice(index, 1)
        }
        
    }
})
//获取当前用户
let currentUser= AV.User.current()
if(currentUser){
    app.currentUser= currentUser.toJSON()
    app.shareLink= location.origin + location.pathname + '?user_Id='+ app.currentUser.objectId
    app.getResume(app.currentUser).then(resume=>{
        app.resume= resume
    }) 
}
//判断当前是预览用户还是 当前用户
//如果是预览用户 用户id找地址中的user_id, 在寻找数据库中的resume
//file:///F:/1.1-web/vue-resume/src/index.html?user_Id=5acb7cb117d009006197896c
let search = location.search
console.log(search)

let regex = /user_Id=([^&]+)/
let matches = search.match(regex)
console.log(matches)
let userId
if(matches){
    userId= matches[1]
    app.mode= 'preview'
    app.getResume({objectId: userId}).then(resume=>{
        app.previewResume= resume
    })
}







