import { Bot, Context, InlineKeyboard, session, SessionFlavor } from 'grammy';
import {
  type ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import { NextRequest, NextResponse } from 'next/server';
import { onboarding, getUserByTelegramId, serviceMenu, linkSocialAccount, profileVisibilityMenu, handleProjectSubmission, handleProjectReview, editProfile } from './handlers';
import { EDC_LINKS, PROJECT_TYPES } from '@/lib/constants';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

// Define your session data shape
interface SessionData {
  stage?: 'projectSubmission_media' | 'projectSubmission_caption' | null;
  data: {
    projectSubmitedMediaMsg?: {
      mediaGroupId?: string;
      projectType?: string;
      caption?: string;
      msgIds?: number[]
    };
  }
}


type BotContext = ConversationFlavor<Context & SessionFlavor<SessionData>>;
const bot = new Bot<BotContext>(TELEGRAM_BOT_TOKEN);

bot.use(session<SessionData, BotContext>({
  initial: () => ({ stage: null, data: {} })
}));
bot.use(conversations());

//check if user is registered
bot.use(async (ctx, next) => {
  if (ctx.message?.text === '/exit') {
    ctx.session.stage = null;
    ctx.session.data = {};
    await ctx.conversation.exitAll();
    return ctx.reply('Exited current conversation/session');
  }

  const user = await getUserByTelegramId(ctx.from?.id.toString() || '');
  if (!user && ['/profile', '/service', '/link', '/submit'].includes(ctx.message?.text?.split(' ')[0] || '')) {
    return ctx.reply('Please register first to use this bot. Use /register to get started');
  }
  await next();
});

// /start
bot.command('start', (ctx) => ctx.reply(`👋 Welcome to *East Devs Community Bot!*

This bot helps you manage your profile, services, and project submissions on E-DC Community platform
https://edc.antsar.et

*Getting Started*
/register — Create your profile

*👤 Profile*
/profile — View & manage your profile
/service — Select services you offer
/link — Link a social account

*📁 Projects*
/submit — Submit a project to showcase on your profile

*🌐 Community*
/contact — Get our social media links

*❌ Other*
/exit — Exit current conversation or session
`, { parse_mode: 'Markdown' }));


//register conversation
bot.use(createConversation(onboarding));
bot.command('register', async (ctx) => await ctx.conversation.enter('onboarding'));

// edit profile conversation
bot.use(createConversation(editProfile));

// /service
bot.use(serviceMenu());
bot.command("service", async (ctx) => {
  await ctx.reply('Select your services:', { reply_markup: serviceMenu() });
});

// /link platform@username
bot.command("link", async (ctx) => linkSocialAccount(ctx));

// /profile
bot.use(profileVisibilityMenu())
bot.command("profile", async (ctx) => ctx.reply('Profile Menu:', { reply_markup: profileVisibilityMenu() }));

// /contact edc social links
bot.command("contact", async (ctx) => {
  const keyboard = new InlineKeyboard();


  for (const [platform, url] of Object.entries(EDC_LINKS)) {
    keyboard.url(platform, url).row();
  }

  await ctx.reply('🌐 *East Devs Community*\nFind us on:', {
    reply_markup: keyboard,
    parse_mode: 'Markdown',
  });
});

// /exit to exit current conv or session
bot.command('exit', async (ctx) => {
  ctx.session.stage = null;
  ctx.session.data = {};
  await ctx.conversation.exitAll();
  await ctx.reply('Exited current conversation/session');
});


// submit projects
bot.command('submit', async (ctx) => {
  const match = ctx.match
  if (!Object.keys(PROJECT_TYPES).includes(match)) {
    return ctx.reply(`
*📋 Usage:*
\`/submit <project type>\`

*Available project types:*
${Object.entries(PROJECT_TYPES).map(([type, description]) =>
      `• \`${type}\`:  _${description}_`
    ).join('\n')}
`, { parse_mode: 'Markdown' });
  }

  ctx.session.stage = "projectSubmission_media";
  ctx.session.data.projectSubmitedMediaMsg = { projectType: match };
  await ctx.reply(
    `Step 1/2: 📎 *Share Your Project Media*\n\nPlease send or forward a photo or video of your project.\n\n(Type /exit to cancel)`,
    { parse_mode: 'Markdown' }
  );
});
// handle project review
bot.callbackQuery(/^pro_review:(\d+)\/(\d+):(\d+)\/(accept|reject)$/, (ctx) => handleProjectReview(ctx));


// handle the noop callback so it doesn't hang
bot.callbackQuery('noop', async (ctx) => {
  await ctx.answerCallbackQuery(); // silent, does nothing
});


// handle media group
const mediaGroupTimers = new Map<string, NodeJS.Timeout>();
bot.on('message', async (ctx) => {
  const session = ctx.session;

  if (session.stage === "projectSubmission_media") {
    const isMedia = ctx.message.photo || ctx.message.video;
    if (!isMedia) {
      return ctx.reply("Step 1/2: Please send a photo or video of your project, or type /exit to cancel.");
    };

    const mediaCaption = ctx.message.caption;
    if (mediaCaption) {
      session.data.projectSubmitedMediaMsg = {
        ...session.data.projectSubmitedMediaMsg,
        caption: mediaCaption
      };
    }

    const newId = ctx.message.message_id;
    const groupId = ctx.message.media_group_id;

    if (groupId) {
      const prevMsgIds = session.data.projectSubmitedMediaMsg?.msgIds || [];
      session.data.projectSubmitedMediaMsg = {
        ...session.data.projectSubmitedMediaMsg,
        mediaGroupId: groupId,
        msgIds: [...prevMsgIds, newId]
      };

      const timerKey = `${ctx.chat.id}:${groupId}`;
      if (mediaGroupTimers.has(timerKey)) {
        clearTimeout(mediaGroupTimers.get(timerKey)!);
      }

      mediaGroupTimers.set(timerKey, setTimeout(async () => {
        mediaGroupTimers.delete(timerKey);
        if (!session.data.projectSubmitedMediaMsg?.caption) {
          session.stage = "projectSubmission_caption";
          return ctx.reply("Step 2/2: Great! Now please send a short caption describing your project.\n\n(Type /exit to cancel)");
        }

        const { caption = "", msgIds = [], projectType = "" } = session.data.projectSubmitedMediaMsg;
        session.stage = null;
        session.data = {};
        await handleProjectSubmission(ctx, msgIds, caption, projectType);
      }, 500));

    } else {
      session.data.projectSubmitedMediaMsg = {
        ...session.data.projectSubmitedMediaMsg,
        msgIds: [newId]
      };

      if (!mediaCaption) {
        session.stage = "projectSubmission_caption";
        return ctx.reply("Step 2/2: Great! Now please send a short caption describing your project.\n\n(Type /exit to cancel)");
      }

      const { caption = "", msgIds = [], projectType = "" } = session.data.projectSubmitedMediaMsg;
      session.stage = null;
      session.data = {};
      await handleProjectSubmission(ctx, msgIds, caption, projectType);
    }
    return;
  }

  if (session.stage === "projectSubmission_caption") {
    const caption = ctx.message.text?.trim();
    if (!caption) {
      return ctx.reply("Step 2/2: Please send a text caption for your project, or type /exit to cancel.");
    }

    const { msgIds = [], projectType = "" } = session.data.projectSubmitedMediaMsg || {};
    session.stage = null;
    session.data = {};
    await handleProjectSubmission(ctx, msgIds, caption, projectType);
    return;
  }
});

//handle the webhook response
export async function POST(req: NextRequest) {
  try {
    const update = await req.json();
    await bot.init();
    await bot.handleUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Webhook is active' });
}