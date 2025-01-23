<script src="//apps.asenax.com/documenter/documenter.js?disable-html=true"></script>
<meta charset="utf8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<header body-class="hide-menu hide-header theme-light" style="display:none;">
  <a href="../" icon-button="" documenter-icon-arrow-left=""></a>
  <div title="">✏️ Topluyo Karalama</div>
  <div class="space"></div>
  <input placeholder="Search...">
  <a href="#">Api</a>
  <a href="#">App</a>
  <button icon-button="" documenter-icon-more=""></button>
  <style>

    *{
      box-sizing:border-box;
    }

    body{
      --primary:#4CAF50;
      cursor:default;
      user-select:none;
    }
    
    [users] div{
      order:var(--order);
    }
  </style>
</header>


<div users flex-y style="position:absolute;left:0;top:0;width:30%;height:100%;background:#4CAF50;color:white;"></div>

<div drawing style="position:absolute;right:0;top:0;width:70%;height:80%;background:#EEE;padding:1em;touch-action:none;" flex-cx>
  <svg id="notepad" viewBox="0 0 1000 1000" style="aspect-ratio:1;background: white;border-radius: 1em;max-width: 100%;max-height: 100%;"></svg>
</div>

<div drawing style="position:absolute;right:0;bottom:0;width:70%;height:20%;background:#EEE" flex-y>
  <input id="guess" type="text" style="width:100%;font-size:8.8vh;height:100%;" value="">
  <button id="guess_button" style="position: absolute;right: 0;top: 50%;transform: translate(0px, -50%);">
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
  </button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.3/socket.io.js" crossorigin="anonymous"></script>
<script src="https://topluyo.com/web-connect.js?v=<?php random_int(10000000,999999999) ?>"></script>  
<script>


//! Çizim yapılıyorsa ve basılı tutmaya devam ederse diğerleri ile paylaşabilir!
//+ Kalan süre eklenmeli
//- sol tarafta yavaş bir animasyonla kaç sn kaldığı eklenebilir
//- pass geçme eklenebilir
//- doğru bilmede ses çalma



</script>
<script src="game.js?v=<?= random_int(100000000,999999999) ?>"></script>