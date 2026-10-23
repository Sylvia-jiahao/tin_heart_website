const $=s=>document.querySelector(s);
const audio=$('#audio');
const tracks={opening:{title:'故事尚未翻开',src:'assets/audio/opening.wav'},waltz:{title:'纸舞女圆舞曲',src:'assets/audio/waltz.wav'},rain:{title:'雨比世界大',src:'assets/audio/rain.wav'}};
document.querySelectorAll('[data-track][data-src]').forEach(button=>{tracks[button.dataset.track]={title:button.dataset.title,src:button.dataset.src}});
const play='<svg class="icon" viewBox="0 0 32 32" aria-hidden="true"><path d="m12 7 14 9-14 9z"/></svg>';
const pause='<svg class="icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M12 7v18M22 7v18"/></svg>';
function syncPlayer(){if(!audio)return;document.querySelectorAll('.track').forEach(button=>{const active=button.dataset.track===audio.dataset.track&&!audio.paused;button.classList.toggle('is-playing',active);button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',(active?'暂停':'试听')+tracks[button.dataset.track].title);button.querySelector('.track-symbol').innerHTML=active?pause:play})}
document.querySelectorAll('.track').forEach(button=>button.addEventListener('click',async()=>{const key=button.dataset.track;$('.player').hidden=false;$('.music')?.classList.add('has-player');if(audio.dataset.track===key&&!audio.paused){audio.pause();return}if(audio.dataset.track!==key){audio.src=tracks[key].src;audio.dataset.track=key}$('#now-playing').textContent=tracks[key].title;try{await audio.play()}catch{$('#now-playing').textContent='试听无法播放，请重试或下载原声带。'}syncPlayer()}));
['play','pause','ended'].forEach(event=>audio?.addEventListener(event,syncPlayer));audio?.addEventListener('error',()=>{$('#now-playing').textContent='试听读取失败，请重试或下载原声带。';syncPlayer()});
const art=[{id:'room',title:'纸城堡',src:'assets/cover-v2.webp'},{id:'river',title:'纸船向暗处',src:'assets/journey-v2.webp'}];let artIndex=0;const dialog=$('#art-dialog');document.querySelectorAll('[data-art-src]').forEach(button=>{const item={id:button.dataset.art,title:button.dataset.artTitle,src:button.dataset.artSrc};const index=art.findIndex(a=>a.id===item.id);if(index<0)art.push(item);else art[index]=item});const artOrder=Array.from(document.querySelectorAll('[data-art-src]')).map(b=>b.dataset.art);if(artOrder.length)art.sort((a,b)=>artOrder.indexOf(a.id)-artOrder.indexOf(b.id));function showArt(index){artIndex=(index+art.length)%art.length;$('#art-title').textContent=art[artIndex].title;$('.lightbox-image').src=art[artIndex].src;$('.lightbox-image').alt=art[artIndex].title+'概念插画'}
document.querySelectorAll('.art-open').forEach(button=>button.addEventListener('click',()=>{showArt(art.findIndex(a=>a.id===button.dataset.art));dialog.showModal()}));$('.dialog-close')?.addEventListener('click',()=>dialog.close());$('.art-previous')?.addEventListener('click',()=>showArt(artIndex-1));$('.art-next')?.addEventListener('click',()=>showArt(artIndex+1));dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});dialog?.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){showArt(artIndex+1);event.preventDefault()}if(event.key==='ArrowLeft'){showArt(artIndex-1);event.preventDefault()}});
let toastTimer;function toast(message){const el=$('.download-toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),5000)}
fetch('release.json').then(response=>{if(!response.ok)throw Error();return response.json()}).then(info=>{for(const key of ['game','soundtrack']){const entry=info[key];document.querySelectorAll('[data-download="'+key+'"]').forEach(link=>{link.href=entry.url;link.download=entry.filename})}document.querySelectorAll('.game-size').forEach(el=>el.textContent=(info.game.bytes/1e6).toFixed(1)+' MB');document.querySelectorAll('.ost-size').forEach(el=>el.textContent=(info.soundtrack.bytes/1e6).toFixed(1)+' MB')}).catch(()=>toast('下载信息暂未更新，仍可直接下载。'));
document.querySelectorAll('.download-link').forEach(link=>link.addEventListener('click',()=>toast('已请求下载，请查看浏览器下载列表。')));
if($('.stage')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){requestAnimationFrame(()=>document.body.classList.add('play-opening'))}

const trailer=$('#trailer');
if(trailer){
 const start=$('.trailer-start'),status=$('.trailer-status');
 trailer.controls=false;start.hidden=false;
 start.addEventListener('click',async()=>{
  status.textContent='正在加载视频…';
  if(!trailer.getAttribute('src')||trailer.error){trailer.src=trailer.dataset.src;trailer.load()}
  trailer.controls=true;start.hidden=true;
  try{await trailer.play();status.textContent='';trailer.focus()}catch{status.textContent='视频暂时无法播放，请重试或直接打开视频。';start.hidden=false;trailer.controls=false}
 });
 trailer.addEventListener('playing',()=>{status.textContent='';start.hidden=true});
 trailer.addEventListener('waiting',()=>{status.textContent='正在加载视频…'});
 trailer.addEventListener('error',()=>{status.textContent='视频读取失败，请重试或直接打开视频。';start.hidden=false;trailer.controls=false});
 trailer.addEventListener('play',()=>audio?.pause());
 audio?.addEventListener('play',()=>trailer.pause());
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&!document.fullscreenElement)trailer.pause()},{threshold:0}).observe(trailer);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)trailer.pause()});
}
