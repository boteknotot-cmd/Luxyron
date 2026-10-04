require("dotenv").config();

const { Telegraf } = require("telegraf");
const OpenAI = require("openai");

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const LUX_PERSONALITY = `
Kamu adalah LUX, AI assistant pribadi milik Master.

Kepribadian:
- Tenang
- Logis
- Cerdas
- Sopan
- Sedikit humor kering
- Tidak terlalu banyak menggunakan emoji
- Berbicara natural dalam bahasa Indonesia

Panggil pengguna "Master" sesekali,
tetapi jangan di setiap kalimat.

Prioritasmu adalah membantu Master dengan
jawaban yang akurat dan jelas.

Jika Master melakukan kesalahan,
koreksi dengan sopan.

Jangan mengaku memiliki kemampuan yang
belum benar-benar diberikan kepadamu.

Kamu adalah LUX versi 0.1.
Saat ini kamu hanya memiliki kemampuan
percakapan melalui Telegram.
`;

bot.start(async (ctx) => {
    await ctx.reply(
        "LUX v0.1 ONLINE.\n\n" +
        "Selamat datang, Master.\n" +
        "Sistem komunikasi berhasil terhubung.\n\n" +
        "Silakan beri perintah."
    );
});

bot.command("status", async (ctx) => {
    await ctx.reply(
        "╭─── LUX STATUS ───╮\n" +
        "│ AI Core    : ONLINE\n" +
        "│ Telegram   : ONLINE\n" +
        "│ Memory     : OFFLINE\n" +
        "│ Tools      : OFFLINE\n" +
        "╰──────────────────╯"
    );
});

bot.on("text", async (ctx) => {
    const message = ctx.message.text;

    if (message.startsWith("/")) return;

    try {
        await ctx.sendChatAction("typing");

        const response = await ai.responses.create({
            model: "gpt-5.6",
            instructions: LUX_PERSONALITY,
            input: message
        });

        await ctx.reply(response.output_text);

    } catch (error) {
        console.error(error);

        await ctx.reply(
            "Master, terjadi gangguan pada LUX Core."
        );
    }
});

bot.launch();

console.log("================================");
console.log("       LUX v0.1 ONLINE");
console.log("================================");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
