window.App = {
    template: `
        <div class="wrapper">
            <app-aside v-show="mode==='edit'"  :logout-visible='hasLogin()' @clicksave="onClickSave" @onshare="onShare" @print="print" @onlogout="onLogOut"></app-aside>
            <main>
                <resume :mode="mode" :display-resume="displayResume"></resume>
            </main>
            <button class="exitPreview" @click="mode='edit'" v-if="mode==='preview'">退出预览</button>
        </div>
    `,
    data(){
        return {
            editingName: false,
            loginVisible: false,
            logoutVisible: false,
            signUpVisible:false,
            shareVisible: false,
            currentUser:{
                objectId: undefined,
                email: ''
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
            shareLink: '',
            mode: 'edit' //preview
    
            
        }
    },

    computed:{
        displayResume(){
            return this.mode==='preview'? this.previewResume : this.resume  
        }
    },

    methods:{
        
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
            this.logoutVisible= true
        },
        onShare(){
            if(this.hasLogin()){
                // this.shareVisible = true
                this.$router.push('/share')
            }else{
                alert('请先登录')
            }
        },
        onLogin(user){
            this.currentUser.objectId = user.objectId
            this.currentUser.email= user.email
            this.loginVisible = false
        },
        onLogOut(){
            AV.User.logOut()
            alert('注销成功')
            window.location.reload()//重新加载
        },
        
        onClickSave(){
            let currentUser = AV.User.current()
            if(!currentUser){
                // this.loginVisible= true
                this.$router.push('/login') //用户不存在 需要登陆后保存
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
                    return resume  //return ,自己处理resume
                    
                }, (error)=>{
                })
        },
        
        print(){
            window.print()
        }
        
    }
}

Vue.component('app', window.App)