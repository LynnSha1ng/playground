import{d as $,w as N,r as D,o as a,c as e,a as t,F as h,b,t as l,u as i,e as C,f as c,g,h as r,_ as E,i as m,S,j as F,T as H}from"./index-p7jT9YNK.js";import{f as Q}from"./index-B19YhazB.js";const R="/playground/images/avatar.jpg",T={class:"side-info"},A={class:"info-card --blogger"},I={class:"post-stats"},L={class:"stat-label"},O={class:"stat-total"},q={key:0,class:"info-card"},z={key:0,class:"categories"},G={class:"category-label"},J={class:"category-total"},K=["onClick"],P={key:1,class:"info-card"},U={key:0,class:"tags"},W={class:"tag-label"},X={class:"tag-total"},Y=["onClick"],Z=$({__name:"SideCard",async setup(M){let d,f;const v={post:"文章",cate:"分类",tag:"标签"},{total:u,cate:y,tag:k}=([d,f]=N(()=>Q()),d=await d,f(),d),w=(_,s)=>{let p,o;if(_){const n=Object.entries(_);p=n.slice(0,s),o=n.length>s}return{shownData:p,hasMore:o}},{shownData:V,hasMore:j}=w(y,5),{shownData:x,hasMore:B}=w(k,75);return(_,s)=>{const p=D("router-link");return a(),e("aside",T,[t("div",A,[s[0]||(s[0]=t("img",{class:"avatar",src:R,alt:"头像"},null,-1)),s[1]||(s[1]=t("h3",{class:"blogger-name"},"临郢夏望",-1)),s[2]||(s[2]=t("span",{class:"bio"},"谦逊对待未知",-1)),t("ul",I,[(a(),e(h,null,b(v,(o,n)=>t("li",{class:"stat-item",key:`stat-item-${n}`},[t("span",L,l(o),1),t("span",O,l(i(u)?i(u)[n]:"*"),1)])),64))]),s[3]||(s[3]=C('<ul class="contacts" data-v-31b77533><li class="contact-icon iconfont icon-QQ" data-v-31b77533></li><li class="contact-icon iconfont icon-mail" data-v-31b77533></li><li class="contact-icon iconfont icon-github" data-v-31b77533></li><li class="contact-icon iconfont icon-tuite" data-v-31b77533></li></ul>',1))]),_.$route.name!=="categories"?(a(),e("div",q,[s[5]||(s[5]=t("h3",null,[t("i",{class:"title-icon iconfont icon-wenjianjia"}),t("span",{class:"card-title"},"分类")],-1)),i(y)?(a(),e("ul",z,[(a(!0),e(h,null,b(i(V),([o,n])=>(a(),e("li",{class:"category-item",key:`cate-item-${o}`},[t("span",G,l(o),1),t("span",J,"（"+l(n)+"）",1)]))),128)),s[4]||(s[4]=t("li",{class:"category-item"},[t("span",{class:"category-label"},"测试超级长的分类名字"),t("span",{class:"category-total"},"（10）")],-1))])):c("",!0),g(p,{custom:"",to:{name:"categories"}},{default:r(({navigate:o})=>[i(j)?(a(),e("span",{key:0,class:"has-more",onClick:o,role:"link"},"查看更多",8,K)):c("",!0)]),_:1})])):c("",!0),_.$route.name!=="tags"?(a(),e("div",P,[s[6]||(s[6]=t("h3",null,[t("i",{class:"title-icon iconfont icon-24gf-tags2"}),t("span",{class:"card-title"},"标签")],-1)),i(k)?(a(),e("ul",U,[(a(!0),e(h,null,b(i(x),([o,n])=>(a(),e("li",{class:"tag-item",key:`tag-item-${o}`},[t("span",W,l(o),1),t("sup",X,l(n),1)]))),128))])):c("",!0),g(p,{custom:"",to:{name:"tags"}},{default:r(({navigate:o})=>[i(B)?(a(),e("span",{key:0,class:"has-more",onClick:o,role:"link"},"查看更多",8,Y)):c("",!0)]),_:1})])):c("",!0),s[7]||(s[7]=C('<div class="info-card" data-v-31b77533><h3 data-v-31b77533><i class="title-icon iconfont icon-youlian-f" data-v-31b77533></i><span class="card-title" data-v-31b77533>友链</span></h3></div><div class="info-card" data-v-31b77533><h3 data-v-31b77533><i class="title-icon iconfont icon-caidan" data-v-31b77533></i><span class="card-title" data-v-31b77533>标题</span></h3></div>',2))])}}}),tt=E(Z,[["__scopeId","data-v-31b77533"]]),st={class:"blog-content"},et=$({__name:"index",setup(M){return(d,f)=>{const v=D("RouterView");return a(),e("main",st,[g(v,{class:"content-wrapper"},{default:r(({Component:u})=>[u?(a(),m(H,{key:0,mode:"out-in"},{default:r(()=>[(a(),m(S,null,{default:r(()=>[(a(),m(F(u)))]),_:2},1024))]),_:2},1024)):c("",!0)]),_:1}),(a(),m(S,null,{default:r(()=>[g(tt)]),_:1}))])}}});export{et as default};
