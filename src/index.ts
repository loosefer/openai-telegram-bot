import { Configuration, OpenAIApi } from 'openai';
import { Telegraf } from 'telegraf';
import { CreateImageRequest } from 'openai/api';
import axios from 'axios';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const DALLE_COMMAND = '/dalle';
const CHAT_COMMAND = '/gpt';

let bot: Telegraf;
bot = new Telegraf(process.env.TELEGRAM_KEY || '');
bot.command(DALLE_COMMAND, async ctx => {
    const prompt = ctx.update.message.text.slice(CHAT_COMMAND.length + 1);

    try {
        const oairequest: CreateImageRequest = {
            prompt,
            n: 1,
            size: '256x256',
        }

        console.log('openai config request', oairequest);
        const response = await openai.createImage(oairequest);

        const replyText = `-$0.016 🔻
        ${response.data.data[0].url}
        `

        ctx.reply(replyText);
    } catch(error) {
        // @ts-ignore
        console.error(error);
    }
});

bot.command(CHAT_COMMAND, async ctx => {
    const prompt = ctx.update.message.text.slice(CHAT_COMMAND.length + 1);

    const headers = {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        'Content-Type': 'application/json'
    };

    console.log(prompt)

    const data = {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
    };

    axios.post('https://api.openai.com/v1/chat/completions', data, { headers })
        .then(response => {
            console.log(response.data)
            const msg = `${response.data.choices[0].message.content}

Usage Info:${JSON.stringify(response.data.usage)}`;
            ctx.reply(msg);
        })
        .catch(error => {
            console.error(error);
        });
});
bot.launch();

console.log('Start');
