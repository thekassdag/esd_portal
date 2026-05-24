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

class OnboardingConversation {
    private conversation: Conversation;
    private ctx: Context;

    constructor(conversation: Conversation, ctx: Context) {
        this.conversation = conversation;
        this.ctx = ctx;
    }

    private async askForFullName(): Promise<string> {
        const msg = await this.ctx.reply('[1]: What is your full name?');
        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const name = update.message.text?.trim();
            if (name.split(' ').length >= 2 && name.length >= 2 && name.length <= 50) {
                return name;
            }
            await this.ctx.reply(
                'Please provide your full name (first and last name) with at least 2 characters and at most 50 characters\n\n(Type /exit to exit the conversation)',
                { reply_parameters: { message_id: msg.message_id } }
            );
        }
    }

    private async askForHeadline(): Promise<string> {
        const msg = await this.ctx.reply('[2]: What is your headline?\n\n(Type /exit to exit the conversation)');
        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const headline = update.message.text?.trim();
            if (headline && headline.length >= 2 && headline.length <= 50) {
                return headline;
            }
            await this.ctx.reply(
                'Please provide your headline with at least 2 characters and at most 50 characters\n\n(Type /exit to exit the conversation)',
                { reply_parameters: { message_id: msg.message_id } }
            );
        }
    }

    private async askIsStudent(): Promise<boolean> {
        const kdbMarkup = new InlineKeyboard();
        kdbMarkup.text('Student', 'edu_status:student');
        kdbMarkup.text('Local Resident', 'edu_status:local_resident');

        const msg = await this.ctx.reply(
            '[3]: Are you Student on one of East side Universities or East Side Local Resident?',
            { reply_markup: kdbMarkup }
        );

        while (true) {
            const update = await this.conversation.waitForCallbackQuery(/edu_status:.*/, {
                otherwise: ctx => ctx.reply('Please select an option\n\n(Type /exit to exit the conversation)', { reply_parameters: { message_id: msg.message_id } })
            });
            await update.answerCallbackQuery();
            await update.deleteMessage();

            const choice = update.callbackQuery.data.split(':')[1];
            if (choice === 'student') return true;
            if (choice === 'local_resident') return false;
        }
    }

    private async askForUniversity(): Promise<string | null> {
        const universityList = await db
            .select()
            .from(universities)
            .orderBy(asc(universities.name))
            .limit(50);

        if (!universityList.length) {
            await this.ctx.reply('Sorry, no universities are available in the system right now.');
            return null;
        }

        const uniSelectMarkup = new InlineKeyboard();
        for (const uni of universityList) {
            uniSelectMarkup.text(uni.name, `selected_uni:${uni.shortName}`).row();
        }

        const msg = await this.ctx.reply('🎓 Select your university:', { reply_markup: uniSelectMarkup });

        while (true) {
            const update = await this.conversation.waitForCallbackQuery(/selected_uni:.*/, {
                otherwise: ctx => ctx.reply('Please select an option\n\n(Type /exit to exit the conversation)', { reply_parameters: { message_id: msg.message_id } })
            });
            await update.answerCallbackQuery();
            await update.deleteMessage();
            return update.callbackQuery.data.split(':')[1];
        }
    }

    private async askForDepartment(): Promise<string | null> {
        const departmentList = await db
            .select()
            .from(departments)
            .orderBy(asc(departments.name))
            .limit(50);

        if (!departmentList.length) {
            await this.ctx.reply('Sorry, no departments are available in the system right now.');
            return null;
        }

        const kdbMarkup = new InlineKeyboard();
        for (const dept of departmentList) {
            kdbMarkup.text(dept.name, `selected_dept:${dept.id}`).row();
        }

        while (true) {
            const msg = await this.ctx.reply('Please select your department:', { reply_markup: kdbMarkup });

            const update = await this.conversation.waitForCallbackQuery(/selected_dept:.*/, {
                otherwise: ctx => ctx.reply('Please select an option\n\n(Type /exit to exit the conversation)', { reply_parameters: { message_id: msg.message_id } })
            });
            await update.answerCallbackQuery();
            await update.deleteMessage();
            return update.callbackQuery.data.split(':')[1];
        }
    }

    private async askForGraduationYear(): Promise<number | null> {
        await this.ctx.reply('What is your graduation year? Please type a year like 2025.');

        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const answer = update.message.text?.trim();
            const year = answer ? Number(answer) : NaN;
            if (!Number.isNaN(year) && year >= 1900 && year <= 2100) {
                return year;
            }
            await this.ctx.reply('Please type a valid graduation year, for example 2025\n\n(Type /exit to exit the conversation)');
        }
    }

    private async askForProfileImage(): Promise<string | null | undefined> {
        while (true) {
            await this.ctx.reply(
                'Please send your profile photo\n\n(Type /skip to skip this step)'
            );

            const update = await this.conversation.waitFor(['message:text', 'message:photo']);
            if ('photo' in update.message && update.message.photo?.length) {
                return update.message.photo.at(-1)?.file_id;
            }

            if (update.message.text?.trim() === '/skip') {
                return null;
            }
        }
    }

    private async askForBio(): Promise<string | null> {
        await this.ctx.reply('Please write a short bio about yourself.');

        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const bio = update.message.text?.trim();
            if (!bio || bio.length < 10 || bio.length > 500) {
                await this.ctx.reply(
                    'Please write a short bio about yourself (at least 10 characters and at most 500 characters)\n\n(Type /exit to exit the conversation)'
                );
                continue;
            }
            return bio;
        }
    }

    async run(): Promise<void> {
        let universityId,departmentId,graduationYear;
        const fullName = await this.askForFullName();
        const headline = await this.askForHeadline();
        const isStudent = await this.askIsStudent();

        if (isStudent) {
            universityId = await this.askForUniversity();
            departmentId = await this.askForDepartment();
            graduationYear = await this.askForGraduationYear();
        }

        const bio = await this.askForBio();
        const profileImageId = await this.askForProfileImage();

        await db.insert(users).values({
            fullName,
            telegramId: this.ctx.from?.id.toString(),
            headline,
            bio,
            universityId,
            departmentId,
            graduationYear,
            profileImageId,
            isActive: true
        });

        await this.ctx.reply('Thank you! Your registration is complete. You can now use /profile, /services, and /link.');
    }
}

// Entry point — same signature grammY expects for conversations
async function onboarding(conversation: Conversation, ctx: Context) {
    await new OnboardingConversation(conversation, ctx).run();
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
        const proileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/talents/${user!.id}`;

        const label = user?.isActive ? '🔒 Make Profile Private' : '🌐 Make Profile Public';
        range.webApp("🔗 Open Profile", proileUrl).row()
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
