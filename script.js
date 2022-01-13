const URL="https://api.open-meteo.com/v1/forecast?latitude=28.6353&longitude=77.2250";

let request = new XMLHttpRequest();
let params = "&hourly=temperature_2m,weathercode&current_weather=true";

/* weather codes in api->

0	Clear sky
1, 2, 3	Mainly clear, partly cloudy, and overcast
45, 48	Fog and depositing rime fog
51, 53, 55	Drizzle: Light, moderate, and dense intensity
56, 57	Freezing Drizzle: Light and dense intensity
61, 63, 65	Rain: Slight, moderate and heavy intensity
66, 67	Freezing Rain: Light and heavy intensity
71, 73, 75	Snow fall: Slight, moderate, and heavy intensity
77	Snow grains
80, 81, 82	Rain showers: Slight, moderate, and violent
85, 86  Snow showers slight and heavy
95 *	Thunderstorm: Slight or moderate
96, 99 *	Thunderstorm with slight and heavy hail
 *) Thunderstorm forecast with hail is only available in Central Europe

*/
const weather_codes=[];
weather_codes[0]="Clear sky";
weather_codes[1]=weather_codes[2]=weather_codes[3]="Mainly clear, partly cloudy, and overcast";
weather_codes[45]=weather_codes[48]="Fog and depositing rime fog";
weather_codes[51]=weather_codes[53]=weather_codes[55]="Drizzle: Light, moderate, and dense intensity";
weather_codes[56]=weather_codes[57]="Freezing Drizzle: Light and dense intensity";
weather_codes[61]=weather_codes[63]=weather_codes[65]="Rain: Slight, moderate and heavy intensity";
weather_codes[66]=weather_codes[67]="Freezing Rain: Light and heavy intensity";
weather_codes[71]=weather_codes[73]=weather_codes[75]="Snow fall: Slight, moderate, and heavy intensity";
weather_codes[77]="Snow grains";
weather_codes[80]=weather_codes[81]=weather_codes[82]="Rain showers: Slight, moderate, and violent";
weather_codes[85]=weather_codes[86]="Snow showers slight and heavy";
weather_codes[95]="Thunderstorm: Slight or moderate";
weather_codes[96]=weather_codes[99]="Thunderstorm with slight and heavy hail";

//setting current date in date selector button (dropdown)
document.getElementById("menu-button").innerHTML=`${(new Date()).toString().slice(0,15)}
<svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
    fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd" />
</svg>`;

//date_from_today is basically a integer from todays date for
//e.g. if it is 0 then today if 1 then today +1 day that is tomorrow
//if it is 4 then it means today +4 i.e. fifth day 
//this parameter is used for displaying the data in the horizontal slider according to day cauz api fetches data of all 7 days from now
//i.e. 24*7=168 values hourly data
function apiCall(date_from_today) {
  if(date_from_today===undefined) date_from_today=0;//by default consider today
  request.open('GET', URL+params, true);
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) {
      // console.log(data);
      // logging(data);

      //current temp and weather
      let cur_temp=data.current_weather.temperature;
      let cur_temp_status=data.current_weather.weathercode;
      let cur_temp_status_str="";
      weather_codes.forEach((value,index) => {
        if(index===cur_temp_status) {
          cur_temp_status_str=value;
        }
      });
      
      document.getElementById("cur_temp").innerHTML=cur_temp+" <span>&deg;C</span>";
      document.getElementById("cur_temp_status").innerHTML=cur_temp_status_str;

      //hourly temp and weather
      let hourly_temp_status=data.hourly.weathercode;
      let hourly_temp=data.hourly.temperature_2m;
      let hourly_time=data.hourly.time;
      let html_str="";
      // hourly_temp.forEach((value,index) => {
        for(let index=24*(date_from_today);index<24*(date_from_today+1);index++) {  
          let value=hourly_temp[index];

          let set_hourly_time=hourly_time[index];
          let date=new Date(set_hourly_time);
          set_hourly_time=date.toLocaleString().slice(11);
          // console.log(date);
          let set_hourly_temp=value;
          
          let set_hourly_weather_code=hourly_temp_status[index];
          let hourly_temp_status_str="";
          weather_codes.forEach((value,index) => {
            if(index===set_hourly_weather_code) {
            hourly_temp_status_str=value;
            }
          });
          //setting html see snippet from html
          let concat_str=`<div class="w-1/6 shadow-xl bg-slate-500/20"><div class="px-6 py-4"><div class="font-semibold text-xl mb-2 text-center">${set_hourly_time}</div><div class="flex justify-center"><span class="font-semibold text-lg text-red-800">${set_hourly_temp} &deg;C</span></div><p class="text-gray-700 text-base mt-2 text-center">${hourly_temp_status_str}</p></div></div>`;
          // html_str.concat(concat_str);
          html_str+=concat_str;
          document.getElementById("hourly_data").innerHTML=html_str;
          html_str=document.getElementById("hourly_data").innerHTML;

        }
      // });

    } else {
      console.log('error');
    }
  }
  request.send();
}
//IIFE=immediately invoked function expression
(apiCall())();

//logs data fetched in console just for testing api
// function logging(data) {
//     let hourly_temp=data.hourly.temperature_2m;
//     let hourly_time=data.hourly.time;
//     hourly_temp.forEach((value,index) => {
//         console.log((`time: ${hourly_time[index]} -> temp: `+value+" C"));
//     });
// }

function collapse() {
  let but=document.getElementById("collapsable-dropdown");
  let drop_bool=but.classList[12];
  //12th class is invisible/visible i.e. for visibility
  if(drop_bool==="invisible") {
    but.classList.replace("invisible","visible");
  }else {
    but.classList.replace("visible","invisible");
  }

  let date_today=new Date();
  but.innerHTML="";
  for(let i=0;i<=6;i++) {
    let display_date=new Date();
    display_date.setDate(date_today.getDate()+i);
    but.innerHTML+=`<div class="py-1 id="indi_date${i}" role="none"><a href="#" class="text-gray-700 block px-4 py-2 text-sm hover:shadow-lg hover:bg-slate-500/20 dropdown-list" onclick="selectDate()">${display_date.toString().slice(0,15)}</a></div>`;
  }
}

// document.getElementById("menu-button").addEventListener('blur',() => {
//   (function () {
//     let but=document.getElementById("collapsable-dropdown");
//     let drop_bool=but.classList[12];
//     if(drop_bool==="invisible") {
//       but.classList.replace("invisible","invisible");
//     }else {
//       but.classList.replace("visible","invisible");
//     }
//   })();
// },true);

//dropdown select functioning
function selectDate() {
  //get correct selector in dropdown
  window.onclick = function(event){
    let get_class=document.getElementsByClassName("dropdown-list");
    for(let i=0;i<get_class.length;i++) {
      if (get_class[i].contains(event.target)){
        document.getElementById("menu-button").innerHTML=`${event.target.innerHTML}
        <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
            fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
        </svg>`;

        //api call
        apiCall(i);
      } 
    }
   };
   
  //close dropdown
  let but=document.getElementById("collapsable-dropdown");
    let drop_bool=but.classList[12];
    //12th class is invisible/visible i.e. for visibility
    if(drop_bool==="invisible") {
      but.classList.replace("invisible","visible");
    }else {
      but.classList.replace("visible","invisible");
    }
}