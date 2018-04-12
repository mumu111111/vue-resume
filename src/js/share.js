Vue.component('share',{
    props:['shareLink'],
    template: `
    <div class="share"  v-cloak>
    <button type="button" @click="$emit('close')">关闭</button>
    <h2>
        请复制下面的链接，在新窗口打开
    </h2>
    <div>
        <textarea readonly>{{shareLink}}</textarea>
    </div>
</div>
    `
})