import { Bot, Context, InlineKeyboard, session, SessionFlavor } from 'grammy';
import {
  type ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import { NextRequest, NextResponse } from 'next/server';
import { onboarding, getUserByTelegramId, serviceMenu, linkSocialAccount, profileVisibilityMenu, handleProjectSubmission, handleProjectReview } from './handlers';
import { EDC_LINKS } from '@/lib/constants';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;

// Define your session data shape
interface SessionData {
  stage?: 'projectSubmiton' | null;
  data: {
    projectSubmitedMediaMsg?: {
      mediaGroupId?: string,
      caption: string;
      msgIds: number[]
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
  const user = await getUserByTelegramId(ctx.from?.id.toString() || '');
  const isRegistered = user && user.fullName && user.universityId && user.departmentId && user.graduationYear && user.profileImageId;
  if (['/profile', '/services', '/link'].includes(ctx.message?.text || '')) {
    if (!isRegistered) {
      return ctx.reply('Please register first to use this bot. Use /register to get started');
    }
  }
  await next();
});

// /start
bot.command('start', (ctx) => ctx.reply('Welcome! The bot is now running.'));


//register conversation
bot.use(createConversation(onboarding));
bot.command('register', async (ctx) => await ctx.conversation.enter('onboarding'));


// /services
bot.use(serviceMenu());
bot.command("services", async (ctx) => {
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


// submit projects
// /project 
// they send us media group with caption or forward to us
// and we will foraward to our group with [[accept], [reject]] inline buttons
// bot.use(createConversation(handleProjectSubmission));
bot.command('submit', async (ctx) => {
  ctx.session.stage = "projectSubmiton";
  await ctx.reply(
    `📎 *Share Your Project*\n\nSend or forward a message containing:\n- 🖼 A photo or 🎥 a video (or both)\n- 📝 A short caption describing your project\n\n_Keep the caption brief and to the point._`,
    { parse_mode: 'Markdown' }
  );
});

bot.callbackQuery(/^pro_review:(.+)$/, (ctx) => handleProjectReview(ctx));


// handle the noop callback so it doesn't hang
bot.callbackQuery('noop', async (ctx) => {
  await ctx.answerCallbackQuery(); // silent, does nothing
});


const mediaGroupTimers = new Map<string, NodeJS.Timeout>();
bot.on('message', async (ctx) => {
  const session = ctx.session;
  if (session.stage === "projectSubmiton") {
    const isMedia = ctx.message.photo || ctx.message.video;
    if (!isMedia) {
      ctx.reply("Please send a photo or video");
      return;
    };

    const newId = ctx.message.message_id;
    const groupId = ctx.message.media_group_id;

    if (groupId) {
      const timerKey = `${ctx.chat.id}:${groupId}`;
      // Accumulate IDs
      if (!session.data.projectSubmitedMediaMsg) {
        session.data.projectSubmitedMediaMsg = {
          caption: ctx.message.caption || "",
          mediaGroupId: groupId,
          msgIds: [],
        };
      }
      session.data.projectSubmitedMediaMsg.msgIds = [
        ...session.data.projectSubmitedMediaMsg.msgIds,
        newId
      ];

      // Debounce — clear previous timer and wait for silence
      if (mediaGroupTimers.has(timerKey)) {
        clearTimeout(mediaGroupTimers.get(timerKey)!);
      }

      mediaGroupTimers.set(timerKey, setTimeout(async () => {
        mediaGroupTimers.delete(timerKey);
        if (!session.data.projectSubmitedMediaMsg?.caption) {
          ctx.reply("Please only send the photo or video with a caption");
          return;
        }

        const { caption, msgIds } = session.data.projectSubmitedMediaMsg || { caption: "", msgIds: [] };
        session.stage = null;
        session.data = {};
        await handleProjectSubmission(ctx, msgIds, caption);
      }, 500));

    } else {
      if (!ctx.message.caption) {
        ctx.reply("Please only send the photo or video with a caption");
        return;
      }
      // Single media
      session.stage = null;
      session.data = {};
      await handleProjectSubmission(ctx, [newId], ctx.message.caption);
    }
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