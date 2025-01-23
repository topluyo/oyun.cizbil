
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let room  = getParameterByName("room")
let user  = getParameterByName("user")
let host  = getParameterByName("host") == "true"
let round = 30

window.user = user

webConnect = new WebConnect({
  server : "https://connect.topluyo.com/socket/room-"+room,
  name : user,
  channels: ["Message","Game"],
  config:{
    data:true,
    video:false,
    audio:false,
    videoBandwidth:100
  }
})


setInterval(e=>{

  if(webConnect.server=="https://connect.topluyo.com/socket/room-null") return;

  let users = [webConnect.me].concat(webConnect.users).map(e=>e.name)
  //! Kullanıcı Puanları Eklenecek
  
  //- kullanıcılar render
  users.map(e=>{
    let founded = $$("[user-name]").find(el=>el.getAttribute('user-name')==e)
    if(founded){

    }else{
      let el = documenter.render(`<div user-name='${e}' flex-x gap padding>
        <img src='https://api.topluyo.com/user/image/${e}' style="width:24px;height:24px;border-radius:100%">
        ${e} 
        <space></space> 
        <span point>0</span>
      </div>`)
      $("[users]").appendChild(el)
    }
  })


  if( webConnect.users.length+1 >= 2 && host ){
    StartGame()
  }


},200)


let words = "bardak,saz,şapka,otoyol,tren,köprü,kömür,ateş,balık,soba,pusula,çeşme,mızrak".split(",")
words = "bardak,saz,şapka,otoyol,tren,köprü,kömür,ateş,balık,soba,pusula,çeşme,mızrak,elma,masa,telefon,dağ,çiçek,araba,kitap,kedi,ev,güneş,saat,kuş,top,gözlük,ayakkabı,balon,sandalye,çanta,kapı,ağaç,köpek,üçgen,dondurma,karpuz,mikser,merdiven,kalem,tavşan,tuzluk,su,bardak,pencere,bilgisayar,şemsiye,pizza,çorap,yıldız,şehir,karpuz,bahçe,çikolata,ıspanak,saç,çamaşır,konserve,ayakkabı,çekiç,sandal,ayna,gemi,kitaplık,telefon,süpürge,balina,şişe,cep,kelebek,çivi,kağıt,kale,meyve,çaydanlık,yastık,televizyon,beşgen,paket,duvar,daire,tuz,süpürge,tepe,balon,eldiven,yorgan,araba,yelken,kavanoz,pasta,saat,gitar,sinek,süpürge,kavak,bardak,çakmak,şapka,tesbih,topluyo".split(",").map(e=>e.trim());
words = Array.from( new Set(words) )


game = {
  users  : {},
  order  : "",
  now    : "random-user!4#$",
  started: false,
  get myOrder(){
    return game.now==user
  }
}

//@ her yeni bağlanana host kendi hostluğunu belirtsin
if(host){

  webConnect.sendChannelGamePrototype = webConnect.sendChannelGame
  webConnect.sendChannelGame = function(data,user){
    if(user==null){
      webConnect.onChannelGame(data,webConnect.id)
      webConnect.sendChannelGamePrototype(data,user)
    }else{
      if(user==webConnect.id){
        webConnect.onChannelGame(data,webConnect.id)
      }else{
        webConnect.sendChannelGamePrototype(data,user)
      }
    }
  }

  setInterval(e=>{
    webConnect.sendChannelMessage("i-am-host")
    //@ sıranın kimde olduğu herkese gidiyor
    webConnect.sendChannelGame( JSON.stringify( {order:game.order} ));
    
    //@ sıradaki oyuncuya çizeceği kelime gidiyor
    let list = [webConnect.me].concat(webConnect.users).map(e=>e.name)
    webConnect.sendChannelGame( JSON.stringify({word:game.word}),idFromNick(game.order))
    /*
    console.log("searching",list)
    list.map(e=>{
      if(e.name==game.order){
        console.log("finded!")
        webConnect.sendChannelGame(JSON.stringify({word:game.word}),e.id)
      }
    })
    */
    //if(user==game.order) webConnect.onChannelGame(JSON.stringify({word:game.word}),"")
    //@ puanların paylaşılması
    webConnect.sendChannelGame(JSON.stringify({points:game.users}))
    //if(host) webConnect.onChannelGame(JSON.stringify({points:game.users}))

  },1000)
}
/*
webConnect.onChannelGame = function(data,user){
  if(data=="i-am-host"){
    game.host = user
  }
}
*/


function nextOrder(previous, nicks) {
  const sortedNicks = nicks.sort((a, b) => a.localeCompare(b));
  const previousIndex = sortedNicks.indexOf(previous);
  if (previousIndex !== -1 && previousIndex + 1 < sortedNicks.length) {
    return sortedNicks[previousIndex + 1];
  } else {
    return sortedNicks[0];
  }
}

function randomInArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr.splice(randomIndex,1)[0]
}

function StartGame(){
  if(game.started) return

  //@ sıra ile oynat
  
  game.started = true 
  Loop()
  setInterval(Loop,round*1000)
}

function nickFromID(id){
  let nicks  = [webConnect.me].concat(webConnect.users)
  let user = nicks.find(e=>e.id==id)
  if(user) return user.name
  return null
}

function idFromNick(nick){
  let nicks  = [webConnect.me].concat(webConnect.users)
  let user = nicks.find(e=>e.name==nick)
  if(user) return user.id
  return null
}




function Loop(){
  if(game.started==false) return
  //@ sıra ile devam
  let nicks  = [webConnect.me].concat(webConnect.users).map(e=>e.name)
  
  if(game.order==""){
    game.order = nicks.sort((a,b)=>a.localeCompare(b))[0]
  }else{
    game.order = nextOrder(game.order,nicks)
  }
  game.now = game.order

  //@ sıradaki oyuncuya host kelimeyi söylesin
  webConnect.sendChannelGame(JSON.stringify({"clear_screen":"true"}))
  //webConnect.onChannelGame(JSON.stringify({"clear_screen":"true"}))
  game.word = randomInArray(words)
  Object.values(game.users).map(u=> u.success=false )
  //@ 30 saniyelik çizim süresi başlasın

  //@ bilenler success 

  //@ sonraki kişiye sıra geçsin,
}

function setPoint(user,nick,delta,success){
  if(game.users[nick]==null){
    game.users[nick] = {
      nick : nick,
      point: delta,
      success: success
    }
  }else{
    if(game.users[nick].success!=true){
      game.users[nick].point += delta
      game.users[nick].success = success 
    }
  }
}

webConnect.onChannelGame = function(d,user){
  let data = JSON.parse(d)
  //console.log(data)
  if(data.order){
    $$("[user-name]").map(e=>e.style.background=null) 
    $("[user-name='"+data.order+"']").style.background = "#FFF4";
    game.now = data.order
  }

  if(data.word){
    $("#guess").value=data.word
  }

  if(data["new-path"]){
    $("#notepad").innerHTML += data["new-path"]
  }
  if(data["clear_screen"]){
    $("#notepad").innerHTML = ""
    $("#guess").value=""
  }

  if(data["success"]){
    $("#guess").style.color="green"
    setTimeout(e=>$("#guess").style.color=null, 2500)
  }
  if(data["fail"]){
    $("#guess").style.color="red"
    setTimeout(e=>$("#guess").style.color=null, 1000)
  }
  
  let nick = nickFromID(user)
  if(data["guess"] && host){
    let guess = data.guess.trim()
    let deltaPoint = -1;
    let success = false
    if(game.word==guess){
      deltaPoint=10;
      success=true
    }
    setPoint(user,nick,deltaPoint,success)
    if(success){
      let orderId = idFromNick(game.order)
      setPoint(orderId,game.order,deltaPoint,success)
      webConnect.sendChannelGame(JSON.stringify({"success":"success"}),user)
      if(host && nick==window.user){
        //webConnect.onChannelGame(JSON.stringify({"success":"success"}))
      }
    }else{
      webConnect.sendChannelGame(JSON.stringify({"fail":"fail"}),user)
      if(host && nick==window.user){
        //webConnect.onChannelGame(JSON.stringify({"fail":"fail"}))
      }
    }
  }

  if(data.points){
    Object.values(data.points).map(e=>{
      console.log(e)
      let el = $("[user-name='"+e.nick+"'] [point]")
      if(el) {
        el.innerHTML = e.point
      }
      let usr = $("[user-name='"+e.nick+"']")
      if(usr){
        usr.style.setProperty("--order",-parseInt(e.point))
      }
    })
  }
}

documenter.on("click","#guess_button",function(){
  if(!game.myOrder){
    webConnect.sendChannelGame(JSON.stringify({guess:$("#guess").value}),game.host)
    /*
    if(host){
      webConnect.onChannelGame(JSON.stringify({guess:$("#guess").value}),webConnect.id)
    }else{
      webConnect.sendChannelGame(JSON.stringify({guess:$("#guess").value}),game.host)
    }
    */
  }
})


documenter.on("keydown","#guess",function(e){
  if(e.keyCode==13) $("#guess_button").click()
})



document.addEventListener('contextmenu', event => event.preventDefault());



  const svg = $("#notepad")
  let svgRect = svg.getBoundingClientRect(); // To get the size of the SVG on the page
  let isDrawing = false;
  let currentPath = null;

  documenter.on("resize",e=>{
    svgRect = svg.getBoundingClientRect(); // To get the size of the SVG on the page
  })

  window.addEventListener("resize",()=>{
    svgRect = svg.getBoundingClientRect(); // To get the size of the SVG on the page
  })

  // Function to map the pointer coordinates to the SVG viewBox coordinates
  function getSVGCoordinates(event) {
    
    const svgX = (event.clientX - svgRect.left) / svgRect.width * 1000; // Mapping to 0-100 range
    const svgY = (event.clientY - svgRect.top) / svgRect.height * 1000; // Mapping to 0-100 range
    return { x: svgX, y: svgY };
  

    return {
      x: 1000 * event.clientX / svg.clientWidth,
      y: 1000 * event.clientY / svg.clientHeight,
    }
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    const ctm = svg.getScreenCTM();
    return svgPoint.matrixTransform(ctm.inverse());
  }

  svg.addEventListener('pointerdown', (event) => {

    if(!game.myOrder) return
    //console.log("pointerdown")
    isDrawing = true;
    const svgCoords = getSVGCoordinates(event);
    const startX = svgCoords.x;
    const startY = svgCoords.y;
    
    currentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    currentPath.setAttribute("d", `M${startX},${startY}`);
    currentPath.setAttribute("stroke", "black");
    currentPath.setAttribute("stroke-width", 10);
    currentPath.setAttribute("fill", "transparent");
    svg.appendChild(currentPath);
  });

  svg.addEventListener('pointermove', (event) => {
    //console.log("pointermove")
    if (!isDrawing) return;

    const svgCoords = getSVGCoordinates(event);
    const x = parseInt(svgCoords.x);
    const y = parseInt(svgCoords.y);
    const currentD = currentPath.getAttribute("d");
    currentPath.setAttribute("d", `${currentD} L${x},${y}`);
  });

  svg.addEventListener('pointerup', () => {
    //console.log("pointerup")
    isDrawing = false;
    if(game.myOrder){
      webConnect.sendChannelGame(JSON.stringify({
        "new-path":currentPath.outerHTML
      }))
    }
  });
