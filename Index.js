let fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const CLIENT_ID = '';
const CLIENT_SECRET = '';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04iAkMr_9PXVPCgYIARAAGAQSNwF-L9Irmah8gEbC_xOgDYCtOS7QNK2NOU55PP3q5G-GVUj33b7sSZNt8ruQvnxE2eIeJajI6cc';
const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const path = require('path');
const {Telegraf, Markup, Types} = require('telegraf');
const sender = require('telegraf-sender');

const  {URL}  = require('url')
const {oauth2} = require("googleapis/build/src/apis/oauth2");
const {file} = require("googleapis/build/src/apis/file");
const stream = require("stream");

const bot = new Telegraf('5426099853:AAELnixQGwFZKKZAcZTkl2ZACEOmz2eOafw');
bot.use(sender)

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



bot.hears('map', (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, 'https://www.google.com/maps/place/%D0%A3%D0%B6%D0%B3%D0%BE%D1%80%D0%BE%D0%B4,+%D0%97%D0%B0%D0%BA%D0%B0%D1%80%D0%BF%D0%B0%D1%82%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C/@48.6193605,22.2095979,12z/data=!3m1!4b1!4m5!3m4!1s0x473919b944b6e3d9:0xda6ae0130042a3c!8m2!3d48.6208!4d22.287883')
})




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
        name:`<b>Слава Україні! </b> (500гр) (40см) `,
        description: '- Тісто \n - Томатний соус \n - Шинка \n ' ,
        urlImage: '',
        price: 10,
        amount: 1,

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

let sessionsUserData = [];

sessionsUserData.compareChatId = function (chat_id){

    return  sessionsUserData.findIndex(obj => obj.chat_id === chat_id)
}
sessionsUserData.getCheck = function (chat_id) {
    let check = randomValueOfPreCheckOut();

        sessionsUserData[sessionsUserData.compareChatId(chat_id)].check = check;
        return sessionsUserData[sessionsUserData.compareChatId(chat_id)].check

}
sessionsUserData.payCheck = function (chat_id, ctx) {

    if (sessionsUserData[sessionsUserData.compareChatId(chat_id)].checkInvoiceCondition === true && sessionsUserData[sessionsUserData.compareChatId(chat_id)].pizzaBasket.length !== 0 )  {

        ctx.replyWithInvoice(getInvoice(chat_id))
        sessionsUserData[sessionsUserData.compareChatId(chat_id)].checkInvoiceCondition = false;

    }
    else if (sessionsUserData[sessionsUserData.compareChatId(chat_id)].checkInvoiceCondition === false ){
        ctx.reply('У вас уже є замовлення в черзі на оплату')

    }
    else if (sessionsUserData[sessionsUserData.compareChatId(chat_id)].pizzaBasket.length === 0) {
        ctx.reply('Кошик порожній :(')
    }
}
function sessionsUser(chat_id) {

    let session = {
        chat_id:chat_id,
        pizzaBasket:[],
        checkInvoiceCondition: true,
        close: function () {
            sessionsUserData.splice(sessionsUserData.compareChatId(this.chat_id), 1);
        },
        saleForClient: function () {
            let SaleMission = 10;


            sessionsUserData[sessionsUserData.compareChatId(this.chat_id)].saleObj++;
          return  bot.telegram.sendMessage(this.chat_id,
               `До Вашої знижки залишилося ${SaleMission - 
               sessionsUserData[sessionsUserData.compareChatId(this.chat_id)].saleObj} піц :)`)

        },
        createSale: function () {
            if(sessionsUserData[sessionsUserData.compareChatId(this.chat_id)].saleObj === undefined) {
                sessionsUserData[sessionsUserData.compareChatId(this.chat_id)].saleObj = 0;
            }
        }

    }

    if(sessionsUserData.length === 0){
        sessionsUserData.push(Object.assign({}, session))

    }
    if (!(sessionsUserData.some(obj => obj.chat_id === chat_id)))
    {
        sessionsUserData.push(Object.assign({}, session));
    }


    console.log('Користувачі')
    sessionsUserData.forEach(obj => console.log(obj.chat_id))

}



bot.action('btnListOfFood', (ctx) => {
    sessionsUser(ctx.chat.id);

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


                if (sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket.some(obj => obj.name === pizzaArr[i].name)) {

                    sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket.forEach(obj => {if (obj.name === pizzaArr[i].name ) {
                        obj.amount++;
                    }

                    })

                }
                else
                {
                    sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket.push(Object.assign({},pizzaArr[i]))

                }



                console.log(sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket)
                   console.log(pizzaArr)


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


bot.action('btnBasket', (ctx) => {

    if ( sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)] === undefined){
        ctx.reply('Ваш кошик пустий :(');
    }
      else {
        ctx.reply(`Замовлення №${sessionsUserData.getCheck(ctx.chat.id)} на суму: ${sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket.reduce(function (sum, current) {
                return sum + Number(current.price * current.amount)
            }, 0)} грн очікує оплати: \n ${sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket.map(obj => ` \n ${obj.name} шт: ${obj.amount}`)}`,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Оплатити/Видалити', callback_data: 'btn_pay'}]

                    ]
                }
            }
        )
    }
       console.log(sessionsUserData)
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
        start_parameter: 'unique_string',
        title: `Замовлення №${sessionsUserData[sessionsUserData.compareChatId(id)].check}` ,
        description: `Оплата послуг`,
        currency: 'UAH',
        prices: [{label: 'Invoice Title', amount: 100 * sessionsUserData[sessionsUserData.compareChatId(id)].pizzaBasket.reduce(function (sum, current){ return sum + Number(current.price * current.amount) },0)}],
        payload: {
            unique_id: `${id}_${Number(new Date())}`,
            provider_token:'632593626:TEST:sandbox_i38652068230'
        },
        reply_markup: {
            inline_keyboard:[
                [{text: `Оплатити`, pay: true }],
                [{text: `Видалити `, callback_data: 'btn_delete' }]
            ]

        }

    }
    return invoice;
}

bot.action('btn_pay',  (ctx) =>{

    sessionsUserData.payCheck(ctx.chat.id, ctx);


})

bot.action('btn_delete', (ctx) => {
    ctx.reply('Кошик очищено :)');
    sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket = [];

    sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].checkInvoiceCondition = true;

    bot.telegram.deleteMessage(ctx.from.id, ctx.update.callback_query.message.message_id )


})



bot.on('pre_checkout_query', (ctx) => {

        ctx.answerPreCheckoutQuery(true)

    }

)


bot.on('successful_payment', async (ctx, next) => {
        sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].createSale();
        sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].saleForClient();

        let textToCheck = sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket.map(obj => ` \n ${obj.name} шт: ${obj.amount} вартість: ${obj.price} грн`).toString()
        let textToCheck_ = textToCheck.split('<b>').join('').split('</b>').join('')
        let textToCheck2 = sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket.reduce(function (sum, current) {
            return sum + Number(current.price * current.amount)
        }, 0)
       await  ctx.reply('Оплата успішна, квитанцію про оплату надіслано на Вашу пошту')


        let doc = new PDFDocument();
        doc.pipe(fs.createWriteStream(`${sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].check}.pdf`))
        doc
            .font('./times-new-roman-cyr.ttf')
            .text(`Фіскальний чек № ${sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].check}`)
            .text(`Загальна вартісь: ${textToCheck2} грн`, {width: 310, align: 'center'})
            .text(textToCheck_, {width: 410, align: 'center'})
        doc.image('img.jpg', 430, 15, {fit: [100, 100], align: 'center', valign: 'center'})

        doc.end();



       setTimeout(()=> {
           ctx.replyWithDocument({
               source: `./${sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].check}.pdf`,
               filename: `квитанція №${sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].check}.pdf`
           })

       },500);

       setTimeout(() =>{
           sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].checkInvoiceCondition = true;
           sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].pizzaBasket = [];
           sessionsUserData[sessionsUserData.compareChatId(ctx.chat.id)].close();
       }, 500)






})






bot.launch()
