$(document).ready(function(){
$('#football').hide();
$('#arrow').hide();
// time for the game;
var timecnt;
var min=2;
var sec=60;

 // .................replasinf the player name from default name to what they enter....................
               $("#p1").text(localStorage.getItem('t1'));
                $("#p2").text(localStorage.getItem('t2'));

//......................displaying and hiding the score card on tuser click.........................
$("#b1").click(function(){
     $("#t1").fadeToggle(1000);
});
//.........................impelementing the concept of object in javascript through jquery for storing the player name and scores..........................
var scoreboard={
               player1_name:"",
               score1:0,
               player2_name:"",
               score2:0
};
//................for keeping the track of the goalkeepers movement direction.................
var gkt;
var gkt2;
var turn=Math.ceil(Math.random()*2);

//.....................for which team will start the game.................................
if(turn==1)
{
   $("#football").css({"top": "365px","left": "88px"});
}
else if(turn==2)
{
    $("#football").css({"top": "365px","left": "1447px"});
}

$('#goalkeeper').on('animationiteration',function(){gkt=100;setTimeout(function(){gkt=-100;},2000);});
$('#goalkeeper2').on('animationiteration',function(){gkt2=-100;setTimeout(function(){gkt2=100;},2000);});

//........for crating the player............

var pc=1;
var gs=$("#aud")[0]; // selecting the audio for ball sttope dby goalkeeper;
var gss=$("#aud1")[0];  //selecting the audio for the faul from html page;
var gsss=$("#aud1")[0]; //  selecting the audio for playing ongoal;
//var gssss=$("#aud2")[0]; //  selecting the audio for playing onwin;
var kick=$("#aud3")[0];   //  selecting the kicking sound for shoot;
var countdown=$("#aud4")[0]; // for countin gthe last 10 second of the game
var begin=$("#aud5")[0];  // sound for playing in the starting of the game
// .....................for creating the player on clicking..........................
 
$(document.body).click(function(event)
{
    if(!$(event.target).is("#b1"))
{
   $("#t1").hide();
  let distance=0;
  let player=$("#player").children();
if(pc==16)
{
   begin.onended=function(){$('#football').show();$('#arrow').show();updateArrowPosition();}
   begin.play();
   
   timecnt=setInterval(function(){
                                               let [newmin,newsec]=tchange(min,sec);
     //  console.log('mim = '+min+' sec = '+sec);
                                               min=newmin;  sec=newsec;},1000);  // function for the time for football default value is 3 min;
}
if(pc>16)
{
gss.play();
alert("you can only select the 8 player. no more players can be selected now");
$(document.body).off('click');
}
else if(pc%2!=0)
{
   let flag1=0;
   //  console.log(player[0].offsetLeft);
    // console.log(player);
    for(let i=0;i<player.length;i++)
     {  
	distance=Math.sqrt(Math.pow(event.clientX - player[i].offsetLeft, 2) + Math.pow(event.clientY - player[i].offsetTop, 2));
         // console.log(distance);
         if(distance<=60)
         {
              flag1=1;
              break;
           }
     }
  //creating the new circle element
if(flag1==0)
{
   let $circle=$('<div id="circle"></div>');

  //setting the circle where ever user click on the screen

  $circle.css({top: event.clientY,left: event.clientX});
 
  //append the circle in the body where click has occured

  $('#player').append($circle);
   pc+=1;
}
else
{
    gss.play();
   alert("please don't place your player on other player");
}
}

//...............................blue team.................
else if(pc%2==0)
{
let flag2=0;

    let player=$("#player").children();
//     console.log(player[0].offsetLeft);
  //   console.log(player);
    for(i=0;i<player.length;i++)
     {  
	distance=Math.sqrt(Math.pow(event.clientX - player[i].offsetLeft, 2) + Math.pow(event.clientY - player[i].offsetTop, 2));
    //      console.log(distance);
         if(distance<=60)
         {
              flag2=1;
              break;
           }
    }
if(flag2==0)
{
 //creating the new circle element

  let $circle2=$('<div id="circle2"></div>');

  //setting the circle where ever user click on the screen

  $circle2.css({top: event.clientY,left: event.clientX});

 //append the circle in the body where double click has occured

  $('#player').append($circle2);
pc+=1;
}
else
{
  gss.play();
  alert("you cannot place the player on another");
}
}
}
});

//.............for movement of the goalkeepr....................

// ...................arrow positioning respect to the ball......................

 var ball = $('#football');
    var arrow = $('#arrow');

   
    function updateArrowPosition() 
     {
      var ballX = ball.offset().left + ball.width() / 2;
      var ballY = ball.offset().top + ball.height() / 2;

      document.documentElement.style.setProperty('--arrow-top', ballY - arrow.height() + 'px');
      document.documentElement.style.setProperty('--arrow-left', ballX - arrow.width() / 2 + 'px');
    }
updateArrowPosition();		

//............................ball movement..................................

var ballMoving = false;
// console.log(ballMoving);
$(document).keypress(function (event) {
        if (event.which === 13 && !ballMoving) {
           $("#t1").fadeOut(1000);
           kick.play();
            moveBall();
        }
    });

 function moveBall() {
        ballMoving = true;
        let arrowRotation = getArrowRotation();
        let distance = 500; // this is distance for ball to travel in which ever direction arrow is pointing
        
        let pX = distance * Math.cos(arrowRotation);
        let pY = distance * Math.sin(arrowRotation);

               //console.log("pY = " + pY);
           // console.log("pX = " + pX);

        pX=ball_boundary_for_x(pX);
        pY=ball_boundary_for_y(pY);

        let shivam=ball_player(pX,pY); // TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT

      if(shivam[0]!=pX || shivam[1]!=pY)
        {
          pX=shivam[0];
          pY=shivam[1];
          $('#football').animate({
              left : + pX + 'px',
               top : + pY + 'px'
             }, 900, function() {
                ballMoving = false;
               updateArrowPosition();
              $("#arrow").show();
// ......................calling the function for placing the ball after it is catch by the goalkeeper..............................................
               GoalkeeperCaugthTheBall();
            });
         }  
      else
         {
          $('#football').animate({
            left : '+=' + pX + 'px',
            top : '+=' + pY + 'px'
        }, 1400, function() {

          //..........................checking if it is a goal or not and if it is than updating the object name scoreboard data members score1 and score2.......................................

         if(($('#football').offset().top>=248)&&($('#football').offset().top<=470)&&(($('#football').offset().left>=1500)||($('#football').offset().left<=10)))
            {
			 if($('#football').offset().left>=1500)
                            {
                            scoreboard.score1=scoreboard.score1+1;
                              $("#t1").fadeIn(500);
                            $("#s1").text('0'+scoreboard.score1);
                             gsss.play();
                             $("#football").animate({
         		      "left" : "1447px",
            		      "top" : "365px"
             		    }, 1400,function(){
                             updateArrowPosition();
                             $("#arrow").show();
                              $("#t1").fadeOut(500);
                         });
                       turn=2;
                      }
                    else
                         {
                            scoreboard.score2=scoreboard.score2+1;
                               $("#t1").fadeIn(500);
			    $("#s2").text('0'+scoreboard.score2);
                              gsss.play();
                              $("#football").animate({
                               "left" : "88px",
                              "top" : "365px"
                             }, 1400,function(){
                             updateArrowPosition();
                             $("#arrow").show();
                               $("#t1").fadeOut(500);
                            });
                           turn=1;
                        }
                  ballMoving = false;
              if(scoreboard.score1==5 || scoreboard.score2==5)
               {
                     // gssss.play();
                       // after some one this will exicuted and get to new page;
                       //win();
                }
               // console.log(scoreboard);
             }
        else
        {
           // console.log('ball top = '+$('#football').offset().top+' ball left = '+$('#football').offset().left);
            if(turn==1)
          {
             gss.play();
            $("#football").animate({
            "left" : "1447px",
            "top" : "365px"
             }, 1400,function(){
                             updateArrowPosition();
                             $("#arrow").show();
              });
            turn=2;
          }
         else if(turn=2)
         {
            gss.play();
           $("#football").animate({
            "left" : "88px",
            "top" : "365px"
             }, 1400,function(){
                        updateArrowPosition();
                         $("#arrow").show();
              });
            turn=1;
          }
          ballMoving = false;
         }
        });
     }
    }

// function to get arrow rotaion using the trignometry

    function getArrowRotation()
      {
         let arrow = $('#arrow');
         let matrix = arrow.css('transform').split('matrix(')[1].split(')')[0].split(',');
      //console.log("matrix = " + matrix);
         let angle = Math.atan2(matrix[1], matrix[0]);
 
        $("#arrow").hide();
         return angle+5;
      }

   function ball_boundary_for_x(pX)
      {
            let temp=$("#football");
           let tempX=temp.offset().left;
           let temppX=tempX+pX;
   
           //console.log("tempX = " + tempX);
         
           if(temppX >=1510)
             {
                 return (1510-tempX);
              }
          else if(temppX<=0)
           {
                   return 0-tempX;
           }
   
      return pX;
  }

      function ball_boundary_for_y(pY)
      {
            let temp=$("#football");
           let tempY=temp.offset().top;
           let temppY=tempY+pY;
          
           if(temppY >= 688)
             {
                     return 688-tempY;
              }
         else if(temppY <= 12.5)
         {
                  return 12.5-tempY;
          }
        return pY;
    }

   function ball_player(pX,pY)
      {

       // in case of same LEFT or x-axis.......................

            let p=$("#player").children();
           let aX=Math.floor($("#football").offset().left);
           let aY=Math.floor($("#football").offset().top);
           let bX=Math.floor(aX+pX);
           let bY=Math.floor(aY+pY);
	
              let i;
              let myarx=[];
              let myary=[];
              let myarx1=[];
              let myary1=[];

           for(i=0;i<p.length;i++)
             {      
// ....................................for vertical ball_player stoping.............................................................

                if(((Math.floor(p[i].offsetLeft)<=aX && (Math.floor(p[i].offsetLeft)+30)>=aX) || aX<=Math.floor(p[i].offsetLeft) && (aX+30>=Math.floor(p[i].offsetLeft))) && ((bX<=aX && (bX+30)>=aX)) || (aX<=bX &&  (aX+30)>=bX))
               {
                    // console.log("hello shivam");
                  if(aY<bY)
                    {
                       if(Math.floor(p[i].offsetTop)>aY && Math.floor(p[i].offsetTop)<bY)
                         {
                                 myarx.push(p[i].offsetLeft);
                                 myary.push(p[i].offsetTop);
                          }
                    }
                 else if(aY>bY)
                   {
                       if(Math.floor(p[i].offsetTop)<aY && Math.floor(p[i].offsetTop)>bY)
                         {
                                 myarx.push(p[i].offsetLeft);
                                 myary.push(p[i].offsetTop);
                          }
                   }
                }
// ..........................................for horizontal ball_player stoping..........................................................

              if(((Math.floor(p[i].offsetTop)<=aY && (Math.floor(p[i].offsetTop)+30)>=aY) || aY<=Math.floor(p[i].offsetTop) && (aY+30>=Math.floor(p[i].offsetTop))) && ((bY<=aY && (bY+30)>=aY)) || (aY<=bY &&  (aY+30)>=bY))
               {
                     //console.log("hello shivam1");
                  if(aX<bX)
                    {
                       if(Math.floor(p[i].offsetLeft)>aX && Math.floor(p[i].offsetLeft)<bX)
                         {
                                 myarx1.push(p[i].offsetLeft);
                                 myary1.push(p[i].offsetTop);
                          }
                    }
                 else if(aX>bX)
                   {
                       if(Math.floor(p[i].offsetLeft)<aX && Math.floor(p[i].offsetLeft)>bX)
                         {
                                 myarx1.push(p[i].offsetLeft);
                                 myary1.push(p[i].offsetTop);
                          }
                   }
                }
              }

// ......................................return of the vertical player cordinate.........................................

      if((aY<bY)&&(myarx.length!=0)&&(myary.length!=0))
         {
              myarx.sort(function(a,b){return a-b;});
              myary.sort(function(a,b){return a-b;});
              return [myarx[1],myary[1]];
        }
     else if((aY>bY)&&(myarx.length!=0)&&(myary.length!=0))
         {
              myarx.sort(function(a,b){return a-b;});
              myary.sort(function(a,b){return a-b;});
              return [myarx[myarx.length-1],myary[myary.length-1]];
        }

//..................................return of the horizontal player cordinates...........................................

      if((aX<bX)&&(myarx1.length!=0)&&(myary1.length!=0))
         {
              myarx1.sort(function(a,b){return a-b;});
              myary1.sort(function(a,b){return a-b;});
              return [myarx1[1],myary1[1]];
        }
     else if((aX>bX)&&(myarx1.length!=0)&&(myary1.length!=0))
         {
              myarx1.sort(function(a,b){return a-b;});
              myary1.sort(function(a,b){return a-b;});
              return [myarx1[myarx1.length-1],myary1[myary1.length-1]];
        }

//........................................................... ball stoping for random player................................................................... 

let myarxy=[];
let tolerance = 27;
let tolerance2 = 35;
let disAP;
let dis;
//......................using the ration concept for the ball stoping...........................

  for(i=0;i<p.length;i++)
   {
   // console.log(p);
      if((p[i].offsetLeft != aX+13) && (p[i].offsetTop != aY+13))
   {
      	// calculated the distanc between A and B
	let disAB = Math.sqrt(Math.pow(bX - aX, 2) + Math.pow(bY - aY, 2));

	// calculate the distance between A and P
	disAP = Math.sqrt(Math.pow(p[i].offsetLeft - aX, 2) + Math.pow(p[i].offsetTop - aY, 2));

	// calculate the ratio proportion of the distance from A to P to the total distance from A to B
	let ratio = disAP/disAB;

	// calculate the coordinates of the parametrics point
	let paraX=aX+ratio*(bX-aX);
	let paraY=aY+ratio*(bY-aY);

	// calculating the distances between the parametric point and P

	dis = Math.floor(Math.sqrt(Math.pow(paraX - p[i].offsetLeft, 2) + Math.pow(paraY - p[i].offsetTop, 2)));
	if(dis<=tolerance && dis>0)
	   {
              // console.log("pX = "+p[i].offsetLeft+" pY = "+p[i].offsetTop+" aX = "+aX+" aY = "+aY);
	     myarxy.push([p[i].offsetLeft, p[i].offsetTop],disAP);
	   }
      }
   }
if(myarxy.length!=0)
{
  let tempdis;
if(myarxy.length>1)
   {
      tempdis=myarxy[0][2];
     for(i=1;i<myarxy.length;i++)
        {
            if(myarxy[i][2]<tempdis)
              {
                    tempdis=myarxy[i][2];
               }
        }
     for(i=0;i<myarxy.length;i++)
       {
           if(myarxy[i][2]==tempdis)
             {
                  return [myarxy[i][0],myarxy[i][1]];
            }
       }
    }
   else
   {
      return [myarxy[0][0].myarxy[0][1]];
   }
}

// ...........................................function to check if ball is caught by goal keeper..................................

  let gk=[[$('#goalkeeper').offset().left,$('#goalkeeper').offset().top],[$('#goalkeeper2').offset().left,$('#goalkeeper2').offset().top]];
   let mygkarr=[];
//console.log(gk);
//console.log(gk[0][1]);

 for(i=0;i<2;i++)
   {
      if((gk[i][0] != aX+13) && (gk[i][1] != aY+13))
   {
      	// calculated the distanc between A and B
	let disAB = Math.sqrt(Math.pow(bX - aX, 2) + Math.pow(bY - aY, 2));

	// calculate the distance between A and P
       if(i==0)
        {
	     disAP = Math.sqrt(Math.pow(gk[i][0] - aX, 2) + Math.pow((gk[i][1]+gkt) - aY, 2));
         }
        else
         {
	     disAP = Math.sqrt(Math.pow(gk[i][0] - aX, 2) + Math.pow((gk[i][1]+gkt2) - aY, 2));
          }

	// calculate the ratio proportion of the distance from A to P to the total distance from A to B
	let ratio = disAP/disAB;

	// calculate the coordinates of the parametrics point
	let paraX=aX+ratio*(bX-aX);
	let paraY=aY+ratio*(bY-aY);

	// calculating the distances between the parametric point and P
        if(i==0)
       {
	  dis = Math.floor(Math.sqrt(Math.pow(paraX - gk[i][0], 2) + Math.pow(paraY - (gk[i][1]+gkt), 2)));
            if(dis<=tolerance2 && dis>0)
	   {
            mygkarr.push([gk[i][0], gk[i][1]+gkt]);
	   }
        }
	else
       {
	  dis = Math.floor(Math.sqrt(Math.pow(paraX - gk[i][0], 2) + Math.pow(paraY - (gk[i][1]+gkt2), 2)));
	if(dis<=tolerance2 && dis>0)
	   {
             mygkarr.push([gk[i][0], gk[i][1]+gkt2]);
	   }
        }
      }
   }
if(mygkarr.length != 0)
{
       //console.log("you are caught");
        //console.log(mygkarr);
        //console.log(gk);
       if(mygkarr[0][0]==gk[0][0])
        {
          return [mygkarr[0][0]+30,mygkarr[0][1]];
         }
      else
        {
            console.log("ksdhdk");
           return [mygkarr[0][0]-10,mygkarr[0][1]];
         } 
}
   return [pX,pY];
 }

// ....................................function to set the ball if itis caught by goalkeeper........................................

 function GoalkeeperCaugthTheBall()
{
     //console.log("left  =  "+$('#football').offset().left);
     //console.log("top  =  "+$('#football').offset().top);
    if((($('#football').offset().left==1462.5) || ($('#football').offset().left==40.5)) && (($('#football').offset().top>=275) && ($('#football').offset().top<=452)))
    {
               if($('#football').offset().left==1462.5)
                 {
                     //console.log("right");
                       ballMoving=true;
                       $("#arrow").hide();
                        gs.play();
                       $('#football').animate({
                        left : "1447px",
                        top : "365px"
                      }, 900, function() {
                      ballMoving = false;
                      updateArrowPosition();
                      $("#arrow").show();
                   });
                  }
               else
                   {
                      // console.log("left");
                       ballMoving=true;
                       $("#arrow").hide();
                         gs.play();
                       $('#football').animate({
                        left : "88px",
                        top : "365px"
                      }, 900, function() {
                      ballMoving = false;
                      updateArrowPosition();
                      $("#arrow").show();
                     });
                   }
            }
       }

function tchange(min,sec)
{
   if(sec==1 && min!=0)
   {
           sec=60;
           min=--min;
    }
    let i=min;
    j=--sec;
  if(j>9)
   {
      $("#time").text('0'+i+':'+j);
   }
else
   {
      $("#time").text('0'+i+':0'+j);
    }
 if(min==0 && sec==0)
{
  console.log("you time is up my time is now");
   $("#time").text("00:00");
   clearInterval(timecnt);
  win();
}
else if(min==0 && sec==11)
{
   countdown.play();
}
return [i,j];
}
function win()
{
   localStorage.setItem('score1',scoreboard.score1);
   localStorage.setItem('score2',scoreboard.score2);
   window.location.href="winner.html";
}
});