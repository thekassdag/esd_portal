import { Context, InlineKeyboard } from 'grammy';
import {
    type Conversation,
} from '@grammyjs/conversations';
import { db } from '@/db';
import { departments, universities, users, userServices, socialLinks, userProjects } from '@/db/schema';
import { asc, eq, and } from 'drizzle-orm';
import { Menu } from '@grammyjs/menu';
import { PLATFORMS } from '@/lib/constants';


const EDC_ADMIN_GROUP_ID = process.env.EDC_ADMIN_GROUP_ID!;
const EDC_CHANNEL_USERNAME = process.env.EDC_CHANNEL_USERNAME!;
const EDC_ADMIN_GROUP_PROJECT_TOPIC_ID = parseInt(process.env.EDC_ADMIN_GROUP_PROJECT_TOPIC_ID!);


async function getUserByTelegramId(telegramId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.telegramId, telegramId),
    });
    return user;
}

async function askForFullName(conversation: Conversation, ctx: Context) {
    await ctx.reply('Welcome to registration! What is your full name?');
    const update = await conversation.waitFor('message:text');
    return update.message.text?.trim();
}

async function askForUniversity(conversation: Conversation, ctx: Context) {
    const universityList = await db.select().from(universities).orderBy(asc(universities.name)).limit(50);
    if (!universityList.length) {
        await ctx.reply('Sorry, no universities are available in the system right now.');
        return null;
    }

    const sample = universityList
        .slice(0, 15)
        .map((uni) => `- ${uni.name}${uni.shortName ? ` (${uni.shortName})` : ''}`)
        .join('\n');

    await ctx.reply(`Please type your university name. Here are some examples:\n${sample}`);

    while (true) {
        const update = await conversation.waitFor('message:text');
        const answer = update.message.text?.trim();
        if (!answer) continue;

        const matched = universityList.find(
            (uni) =>
                uni.name.toLowerCase() === answer.toLowerCase() ||
                uni.shortName?.toLowerCase() === answer.toLowerCase(),
        );

        if (matched) {
            return matched;
        }

        await ctx.reply('I could not find that university. Please type the exact university name again.');
    }
}

async function askForDepartment(conversation: Conversation, ctx: Context) {
    const departmentList = await db.select().from(departments).orderBy(asc(departments.name)).limit(50);
    if (!departmentList.length) {
        await ctx.reply('Sorry, no departments are available in the system right now.');
        return null;
    }

    const sample = departmentList
        .slice(0, 15)
        .map((dept) => `- ${dept.name}${dept.code ? ` (${dept.code})` : ''}`)
        .join('\n');

    await ctx.reply(`Please type your department name. Here are some examples:\n${sample}`);

    while (true) {
        const update = await conversation.waitFor('message:text');
        const answer = update.message.text?.trim();
        if (!answer) continue;

        const matched = departmentList.find(
            (dept) =>
                dept.name.toLowerCase() === answer.toLowerCase() ||
                dept.code?.toLowerCase() === answer.toLowerCase(),
        );

        if (matched) {
            return matched;
        }

        await ctx.reply('I could not find that department. Please type the exact department name again.');
    }
}

async function askForGraduationYear(conversation: Conversation, ctx: Context) {
    await ctx.reply('What is your graduation year? Please type a year like 2025.');

    while (true) {
        const update = await conversation.waitFor('message:text');
        const answer = update.message.text?.trim();
        const year = answer ? Number(answer) : NaN;
        if (!Number.isNaN(year) && year >= 1900 && year <= 2100) {
            return year;
        }
        await ctx.reply('Please type a valid graduation year, for example 2025.');
    }
}

async function askForProfileImage(conversation: Conversation, ctx: Context) {
    await ctx.reply('Please send your profile photo, or send a public image URL.');

    while (true) {
        const update = await conversation.waitFor(['message:text', 'message:photo']);
        if ('photo' in update.message && update.message.photo?.length) {
            return update.message.photo.at(-1)?.file_id;
        }

        const answer = update.message.text?.trim();
        if (answer && /^https?:\/\//i.test(answer)) {
            return answer;
        }

        await ctx.reply('Please send a photo or a public image URL.');
    }
}

async function askForBio(conversation: Conversation, ctx: Context) {
    await ctx.reply('Please write a short bio about yourself.');

    let update = await conversation.waitFor('message:text');
    while (!update.message.text?.trim() || update.message.text?.trim().length < 10 || update.message.text?.trim().length > 500) {
        await ctx.reply('Please write a short bio about yourself (at least 10 characters and at most 500 characters).');
        update = await conversation.waitFor('message:text');
    }

    return update.message.text?.trim();
}

async function onboarding(conversation: Conversation, ctx: Context) {
    const telegramId = ctx.from?.id.toString();

    const fullName = await askForFullName(conversation, ctx);
    if (!fullName) {
        await ctx.reply('Registration cancelled because full name was not provided.');
        return;
    }

    const university = await askForUniversity(conversation, ctx);
    if (!university) return;

    const department = await askForDepartment(conversation, ctx);
    if (!department) return;

    const graduationYear = await askForGraduationYear(conversation, ctx);
    const profileImageId = await askForProfileImage(conversation, ctx);
    const bio = await askForBio(conversation, ctx);


    await db.insert(users).values({
        fullName,
        telegramId,
        bio,
        universityId: university.id,
        departmentId: department.id,
        graduationYear,
        profileImageId
    });

    await ctx.reply('Thank you! Your registration is complete. You can now use /profile, /services, and /link.');
}

async function _embadProjectCaption(caption: string, tag: string, embadingKey: string) {
    const res = await fetch(`${process.env.SUPABASE_URL}/functions/v1/embed`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.BACKEND_TO_SUPABASE_API_KEY}`
        },
        body: JSON.stringify({ caption, tag, id: embadingKey })
    });
    if (!res.ok) {
        console.log("res: ", await res.json())
        throw new Error('Failed to embed project caption');
    }
    const { id } = await res.json();
    return id;
}

async function _deleteEmbading(embeddingId: string) {
    await fetch(`${process.env.SUPABASE_URL}/functions/v1/embedding`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_ANON_KEY!,
            'Authorization': `Bearer ${process.env.BACKEND_TO_SUPABASE_API_KEY}`
        },
        body: JSON.stringify({ id: embeddingId })
    });
}

async function handleProjectSubmission(ctx: Context, msgIds: number[], caption: string, projectType: string) {
    let embadingKey;
    try {
        const firstMsg = msgIds[0];
        // make it incremantal if there are multiple messages (to prevent accepting incremtnat messages if its jumps we throw error cuz latter on its cuse error while we put firstmessag:lenght on calllback data)
        msgIds = msgIds.map((_, index) => firstMsg + index);
        embadingKey = `${EDC_ADMIN_GROUP_ID}/${EDC_ADMIN_GROUP_PROJECT_TOPIC_ID}/${firstMsg}`;
        embadingKey = await _embadProjectCaption(caption, projectType, embadingKey);

        const sent = await ctx.api.copyMessages(
            EDC_ADMIN_GROUP_ID,
            ctx.chat!.id,
            msgIds,
            { message_thread_id: EDC_ADMIN_GROUP_PROJECT_TOPIC_ID }
        );

        // userId/firstMsgId:count/action
        const reviewKbd = new InlineKeyboard()
            .text('✅ Accept', `pro_review:${ctx.from?.id}/${firstMsg}:${msgIds.length}/accept`)
            .text('❌ Reject', `pro_review:${ctx.from?.id}/${firstMsg}:${msgIds.length}/reject`);

        await ctx.api.sendMessage(EDC_ADMIN_GROUP_ID, 'Review this project:', {
            message_thread_id: 2,
            reply_markup: reviewKbd,
            reply_parameters: {
                message_id: sent[0].message_id
            }
        });

        await ctx.reply('✅ Submitted! You will be notified after review.');
        return;
    } catch (error) {
        // clear embedding if failed
        if (embadingKey) {
            await _deleteEmbading(embadingKey);
        }

        console.error('Error handling project submission:', error);
        await ctx.reply('❌ Failed to submit project. Please try again.');
    }
}

async function handleProjectReview(ctx: Context) {
    // answer immediately before doing anything else, ignore if expired
    await ctx.answerCallbackQuery().catch(() => { });
    try {



        const [, userId, firstMsgId, count, action] = ctx.match as string[];
        const msgIds = Array.from({ length: Number(count) }, (_, i) => Number(firstMsgId) + i);
        const embeddingKey = `${EDC_ADMIN_GROUP_ID}/${EDC_ADMIN_GROUP_PROJECT_TOPIC_ID}/${firstMsgId}`;



        const btnText = action === 'accept' ? '✅ Accepted' : '❌ Rejected';
        const reviewStatusMarkup = {
            reply_markup: new InlineKeyboard().text(btnText, 'noop')
        }
        if (action === 'reject') {
            // delete embedding
            await _deleteEmbading(embeddingKey);
            // notfiy user its rejected
            const msg = await ctx.api.copyMessages(userId, userId, msgIds);
            ctx.api.sendMessage(userId, '❌ Your project has been rejected,please review it and resubmit back', { reply_parameters: { message_id: msg[0].message_id } });
        } else {
            //send to channel
            const user = await getUserByTelegramId(userId);
            if (!user) {
                console.error('User not found for telegram id:', userId);
                return;
            }
            const msg = await ctx.api.copyMessages(EDC_CHANNEL_USERNAME, userId, msgIds);
            await db.insert(userProjects).values({
                userId: user.id,
                postLink: `https://t.me/${EDC_CHANNEL_USERNAME}/${msg[0].message_id}`,
                embeddingKey: embeddingKey,
                status: 'active'
            });
            const profileLink = `${process.env.NEXT_PUBLIC_APP_URL}/p/${user.id}`;
            await ctx.api.sendMessage(EDC_CHANNEL_USERNAME, `#Project Submited by: [${user.fullName}](${profileLink})`, { parse_mode: 'Markdown', reply_parameters: { message_id: msg[0].message_id } });
        }

        // for group review status
        await ctx.editMessageReplyMarkup(reviewStatusMarkup);
    } catch (error) {
        console.error('Error handling project review:', error);
    }
}

function serviceMenu() {
    const menu = new Menu<Context>('service-menu')
        .dynamic(async (ctx, range) => {
            const tgId = ctx.from?.id.toString();
            const user = await getUserByTelegramId(tgId!);

            const currentUserServices = await db.query.userServices.findMany({
                where: (tbl) => eq(tbl.userId, user!.id)
            });
            const services = await db.query.services.findMany();

            const selectedServiceIds = new Set(currentUserServices.map(us => us.serviceId));

            for (const service of services) {
                const isSelected = selectedServiceIds.has(service.id);
                const label = `${isSelected ? '✅' : ''} ${service.name}`;

                range.text(label, async (ctx) => {
                    const tgId = ctx.from?.id.toString()!;
                    const user = await getUserByTelegramId(tgId);

                    const existing = await db.query.userServices.findFirst({
                        where: (tbl) => and(
                            eq(tbl.userId, user!.id),
                            eq(tbl.serviceId, service.id)
                        )
                    });

                    if (existing) {
                        await db.delete(userServices)
                            .where(and(
                                eq(userServices.userId, user!.id),
                                eq(userServices.serviceId, service.id)
                            ));
                    } else {
                        await db.insert(userServices).values({
                            userId: user!.id,
                            serviceId: service.id,
                        });
                    }

                    ctx.menu.update();
                });

                range.row();
            }
        });

    return menu;
}

async function linkSocialAccount(ctx: Context) {
    let [platform, username] = String(ctx.match || '').split('@') || [];
    if (!platform || !username) {
        await ctx.reply('Usage: /link platform@username\nExample: /link github@johndoe');
        return;
    }

    platform = platform.toLowerCase();
    const ALLOWED_PLATFORMS = Object.keys(PLATFORMS);
    if (!ALLOWED_PLATFORMS.includes(platform as any)) {
        await ctx.reply(`Invalid platform. Please use one of: ${ALLOWED_PLATFORMS.join(', ')}`);
        return;
    }
    const tgId = ctx.from?.id.toString();
    try {
        const user = await getUserByTelegramId(tgId!);
        // add or update socail links
        await db.insert(socialLinks).values({
            userId: user!.id,
            platform,
            username
        }).onDuplicateKeyUpdate({
            set: {
                username
            },
        });
        await ctx.reply(`Linked ${platform} account: ${username}`);

    } catch (error) {
        console.error('Error linking social account:', error);
        await ctx.reply('Failed to link social account. Please try again.');
        return;
    }
}

function profileVisibilityMenu() {
    const menu = new Menu<Context>('profile-visibility-menu');
    menu.dynamic(async (ctx, range) => {
        const tgId = ctx.from?.id.toString();
        const user = await getUserByTelegramId(tgId!);
        const proileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/p/${user!.id}`;

        const label = user?.isActive ? '🔒 Make Profile Private' : '🌐 Make Profile Public';
        range.url("🔗 Open Profile", proileUrl).row();
        range.text(label, async (ctx) => {
            const tgId = ctx.from?.id.toString()!;
            const freshUser = await getUserByTelegramId(tgId); // ← re-fetch
            await db.update(users).set({
                isActive: !freshUser?.isActive
            }).where(eq(users.telegramId, tgId));
            ctx.menu.update();
        }).row();

    });
    return menu;
}


export { onboarding, getUserByTelegramId, serviceMenu, linkSocialAccount, profileVisibilityMenu, handleProjectSubmission, handleProjectReview };
