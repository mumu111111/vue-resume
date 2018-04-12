Vue.component('app-aside',{
    props: ['logoutVisible'],
    template:`
    <aside>
    <div class="upper">
        <ul class="actions">
            <li><button class="button" @click="$emit('clicksave')">保存</button></li>
            <li><button class="button" @click="$emit('onshare')">分享</button></li>
            <li><button class="button" @click="$emit('print')">打印</button></li>
        </ul>
    </div>
    <div class="down">
        <button class="button" @click="$emit('onlogout')" v-show="logoutVisible">登出</button>
    </div>
</aside> 
    `
})