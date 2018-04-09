let app= new Vue({
    el: '#app',
    data:{
        editingName: false,
        resume:{
            name: '姓名',
            gender: '女',
            birthday: '1994年4月',
            jobTitle: '前端工程师',
            phone: '13266666666',
            email: 'example@example.com'
        }
    },
    methods: {
        onEdit(key,value){//修改的value放到resume中
            this.resume[key] = value
        },
        onClickSave(){
            let currentUser = AV.User.current()
            if(!currentUser){
                this.showLogin()
            }else{
                this.saveResume()
            }
        },
        showLogin(){

        },
        saveResume(){

        }       
    }
})