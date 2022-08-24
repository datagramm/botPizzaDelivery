const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const CLIENT_ID = '720743800227-jrsfoo5tvd74ea77tcs5t1rok4hu4f8m.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04iAkMr_9PXVPCgYIARAAGAQSNwF-L9Irmah8gEbC_xOgDYCtOS7QNK2NOU55PP3q5G-GVUj33b7sSZNt8ruQvnxE2eIeJajI6cc';



const {Telegraf, Markup} = require('telegraf');
const sender = require('telegraf-sender');

const  {URL}  = require('url')
const {oauth2} = require("googleapis/build/src/apis/oauth2");
const {file} = require("googleapis/build/src/apis/file");

const bot = new Telegraf('5426099853:AAELnixQGwFZKKZAcZTkl2ZACEOmz2eOafw');
bot.use(sender)
let  files = [];
let massiveId = [];
let checkValue = [];
let usersId = [];
let users = ['367613741', '499758301', '447306969']
let chat_id = '-1001788556343';
let shortDistanceId;
let locationPositions = [ {
    id: 0,
    name: 'Відділення №1',
    lat: 48.614089,
    long: 22.293508

},
    {   id: 1,
        name: 'Відділення №2',
        lat: 48.624160,
        long: 22.296212

    }

]


function  compareLocationPosition(arr, arg_latitude, arg_longitude) {
    let compare = [];
     let latitude_dif = [];
     let longitude_dif = [];
     let dist_dif = [];
     let res =  arr.forEach(element => compare.push(Math.abs(Number((Math.abs(element.lat) -Math.abs(arg_latitude)).toFixed(6))),
         Math.abs(Number(Math.abs(element.long) - Math.abs(arg_longitude).toFixed(6)))))
     compare.forEach(result => console.log(result))
    for (let i = 0; i < compare.length; i += 2) {
        latitude_dif.push(compare[i]);
    }
    for (let p = 1; p < compare.length; p += 2) {
        longitude_dif.push(compare[p]);
    }

    for (let t = 0; t < latitude_dif.length; t++){
        dist_dif.push( Math.abs(Number(latitude_dif[t])) + Math.abs( Number(longitude_dif[t])) )
    }
    dist_dif.forEach(result => console.log(result))

    function findIndexOfMinMax(arr) {
        let minIndex = 0;
        let maxIndex = 1;
        let min = arr[0];
        let max = arr[1];

        for (let i = 0; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i];
                minIndex = i;
            }
            if (arr[i] > max) {
                max = arr[i]
                maxIndex = i;
            }
        }
        return shortDistanceId = minIndex;
    }
    console.log(findIndexOfMinMax(dist_dif));

}

 function addNewObjectInMap(arg,arg1,arg2) {
    let i = 2;
    let newObject = {
        id: i ,
        name: arg,
        lat: arg1,
        long: arg2
    }
     locationPositions.push(newObject)
     i++;
 }



const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)



oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

function listFiles() {
    const drive = google.drive({
        version:'v3',
        auth: oauth2Client
    })
    drive.files.list({
        q: '\'1IhohQU_VjrZLOlXwrh8b2P6T1l4DBGta\' in parents',

        fields: 'nextPageToken, files(id, name)',

    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        files = res.data.files;




        if (files.length) {
            console.log('Files:');
            files.map((file) => {

                console.log(`${file.name} (${file.id})`);

            });

        } else {
            console.log('No files found.');
        }

    });

}











bot.hears('start', (ctx) => {
    setInterval(() =>  {ctx.msg.broadcast({
        users: ['367613742'],
        isCopy: false,
        message: {
            text: '',
        },
    })}, 5000)
})
bot.hears('map', (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, 'https://www.google.com/maps/place/%D0%A3%D0%B6%D0%B3%D0%BE%D1%80%D0%BE%D0%B4,+%D0%97%D0%B0%D0%BA%D0%B0%D1%80%D0%BF%D0%B0%D1%82%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C/@48.6193605,22.2095979,12z/data=!3m1!4b1!4m5!3m4!1s0x473919b944b6e3d9:0xda6ae0130042a3c!8m2!3d48.6208!4d22.287883')
})


async function step() {

    await   setInterval(() => {
        listFiles()
    }, 4000)

}

step();


function getDifference(array1, array2){
    return array1.filter(object1 => {
        return !array2.some(object2 => {
            return object1.id === object2.id;
        })
    })

}
function broadcastQuery(arg_ctx) {
    if(!(usersId.includes(arg_ctx.chat.id))) {
        usersId.push(arg_ctx.chat.id)
        usersId.forEach(element => console.log(element));
    }
    else  {
        return null;
    }
}
let check_add = false;
let triger = false;
 let latitude;
  let longtitude;
  let nameOfObject;
let new_latitude;
let new_longitude;
bot.on('location', (ctx) => {
     if (check_add === false) {
         latitude = ctx.message.location.latitude;
         longtitude = ctx.message.location.longitude;

         compareLocationPosition(locationPositions, latitude, longtitude);
         bot.telegram.sendMessage(ctx.chat.id, `Найближче відділення поряд: \n ${locationPositions[shortDistanceId].name}`)
         bot.telegram.sendLocation(ctx.chat.id, locationPositions[shortDistanceId].lat, locationPositions[shortDistanceId].long)
     }
    if (check_add === true ) {
        new_latitude = ctx.message.location.latitude;
        new_longitude = ctx.message.location.longitude;
        addNewObjectInMap(nameOfObject,new_latitude, new_longitude);
        bot.telegram.sendMessage(ctx.chat.id, 'Локація успішно додана :)');
                console.log(check_add)
                check_add = false;


    }
} )



const inlineKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('Add location', 'add')
])
bot.hears('add', (ctx) => {
    check_add = true;
    triger = true;
     bot.telegram.sendMessage(ctx.chat.id,'Hello', inlineKeyboard )
    console.log(check_add)
    console.log(triger)
})


bot.command('start', (ctx) => {
     ctx.reply(` Привіт, ${ctx.message.chat.first_name} \n За допомогою нашого телеграм боту, ти можеш замовити доставку піцци та їжі. \n Обери необхідну опцію нижче \n Зв'яжися з нами: \n +380 95 123 45 67 \n +380 95 123 45 67 \n
 
 `,{
        reply_markup: {
            inline_keyboard: [
                [{text: 'Піцца', callback_data:'btnListOfFood'}, ],
                [{text: 'Їжа', callback_data: 'btn-food'}],
                [{text: 'Напої', callback_data: 'btn-drink'}],


            ],

        }
    })



})




  let pizzaArr = [
      {
      id: 1,
          name:`<b> Маскальска дівка </b> (500гр) (40см) `,
      description: '- Тісто \n - Томатний соус \n - Шинка \n ' ,
      urlImage: '',
      price: 10,
          amount: 1
      },
      {
          id: 2,
          name:` <b> Дуже файна піцца </b> (500гр) (40см)`,
          description: '- М`ясо куряче \n курка карі \n',
          urlImage: '',
          price: 22,
          amount: 1
      },
      {
          id: 3,
          name:` <b> Сімейна </b> (500гр) (40см)`,
          description: '- М`ясо куряче \n курка карі \n',
          urlImage: '',
          price: 15,
          amount: 1
      },

]

 let pizzaBasket = [

 ]


bot.action('btnListOfFood', (ctx) => {


    for (let i = 0; i <pizzaArr.length; i++) {
        bot.telegram.sendPhoto(ctx.chat.id,  'https://roll-club.kh.ua/wp-content/uploads/2021/06/pizza.jpg',
            {
                caption: `\u{1F355} ${pizzaArr[i].name} \n ${pizzaArr[i].description} \n \u{1F4B8} ${pizzaArr[i].price} грн `,

                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Замовити', callback_data:`btn-${i}`}, ]

                    ]
                }
            }
            )
        bot.action(`btn-${i}`, (ctx) => {

            bot.telegram.sendMessage(ctx.chat.id, `Ваше замовлення: \n ${pizzaArr[i].name} \n   успішно додане до кошику :)`,{
                parse_mode: 'HTML',
                reply_markup: {

                    inline_keyboard: [
                        [{text:'Перейти до кошику', callback_data:'btnBasket'}],
                        [{text:'Повернутися до меню', callback_data:'btnMenu'}]
                    ],

                }

            })


              if (pizzaBasket.some(obj => obj.name === pizzaArr[i].name)) {

               pizzaBasket.map(obj => {if (obj.name === pizzaArr[i].name) {
                   obj.amount++
               }

               })

              }
               else pizzaBasket.push(pizzaArr[i])
               console.log(pizzaBasket)



            }
        )

    }
})
bot.action(`btnMenu`, (ctx) => {
    ctx.reply(` Привіт, ${ctx.chat.first_name} \n За допомогою нашого телеграм боту, ти можеш замовити доставку піцци та їжі. \n Обери необхідну опцію нижче \n Зв'яжися з нами: \n +380 95 123 45 67 \n +380 95 123 45 67 \n
 
 `,{
        reply_markup: {
            inline_keyboard: [
                [{text: 'Піцца', callback_data:'btnListOfFood'}, ],
                [{text: 'Їжа', callback_data: 'btn-food'}],
                [{text: 'Напої', callback_data: 'btn-drink'}],


            ],

        }
    })

})
function randomValueOfPreCheckOut() {
    let arrayOfValue = [];
    let min = Math.ceil(0);
    let max = Math.floor(10);
    for (let i = 0; i < 1; i++) {

        let value = Math.floor(Math.random() * (max - 1)) + 1;
        arrayOfValue.push(value)
    }
    for (let i = 1; i < 10; i++) {

        let value = Math.floor(Math.random() * (max - min)) + min;
        arrayOfValue.push(value)
    }


    let result =   arrayOfValue.join('');
    console.log(result)
      return Number(result);

}
randomValueOfPreCheckOut();
bot.action('btnBasket', (ctx) => {

    ctx.reply(`Замовлення №${randomValueOfPreCheckOut()} на суму: ${ pizzaBasket.reduce(function (sum, current){ return sum + Number(current.price * current.amount) },0)} грн очікує оплати: \n ${pizzaBasket.map(obj => ` \n ${obj.name} шт: ${obj.amount}` )}`,
        {
            parse_mode: 'HTML'
        }
        )

})


bot.action('add', (ctx) => {
    bot.telegram.sendMessage(ctx.chat.id, `Додайте назву відділеня`)

        bot.on('text', (ctx) => {
            if(triger === true) {
                nameOfObject = ctx.message.text;
                console.log(nameOfObject)
                bot.telegram.sendMessage(ctx.chat.id, 'Надішліть геопозицію доданого відділення')
                triger = false;
            }
        })


})


const getInvoice = (id) => {
    const invoice = {

        chat_id: id,
        provider_token: '632593626:TEST:sandbox_i38652068230',
        start_parameter: 'get_access',
        title: `${pizzaBasket.map(obj =>  obj.name.split('<b>').join('').split('</b>').join(''))}` ,
        description: `${pizzaBasket.map(obj => obj.description)}`,
        currency: 'UAH',
        prices: [{label: 'Invoice Title', amount: 100 * pizzaBasket.reduce(function (sum, current){ return sum + Number(current.price * current.amount) },0)}],
        payload: {
            unique_id: `${id}_${Number(new Date())}`,
            provider_token:'632593626:TEST:sandbox_i38652068230'
        }
    }
    return invoice;
}

bot.hears('pay', (ctx) =>{ return ctx.replyWithInvoice(getInvoice(ctx.from.id))

})
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))

bot.on('successful_payment', async (ctx, next) => {
     await  ctx.reply('SuccessfulPayment')
})



bot.command('download', (ctx) =>
    {
         setInterval(   () => {

             broadcastQuery(ctx);

            checkValue = [
                ...getDifference(files, massiveId)
            ]


            if (!(checkValue.length)) {
                return  massiveId = Object.assign([], files);



            } else {

                // checkValue = files.filter(file => !massiveId.includes(file.id));
                //checkValue_ = checkValue.filter(file => !massiveId.includes(file.id) )
                // console.log(checkValue_.length)
                checkValue = [
                    ...getDifference(files, massiveId)
                ]
                console.log(checkValue.length)
                for (let p = 0; p < usersId.length; p++) {
                    for (let i = 0; i < checkValue.length; i++) {


                        bot.telegram.sendDocument(usersId[p], `https://docs.google.com/uc?export=download&id=${checkValue[i].id}`);


                    }
                }
                massiveId = Object.assign([], files);
            }
        }, 2000)



    }



)


bot.launch()


