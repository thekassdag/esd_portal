import { Context, InlineKeyboard } from 'grammy';
import {
    type Conversation, ConversationFlavor
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
        let universityId, departmentId, graduationYear;
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

// ─────────────────────────────────────────────
// Edit Profile
// ─────────────────────────────────────────────

class EditProfileConversation {
    private conversation: Conversation;
    private ctx: Context;
    private user: Awaited<ReturnType<typeof getUserByTelegramId>>;

    constructor(conversation: Conversation, ctx: Context, user: Awaited<ReturnType<typeof getUserByTelegramId>>) {
        this.conversation = conversation;
        this.ctx = ctx;
        this.user = user;
    }

    private async askWhatToEdit(): Promise<string | null> {
        const kbd = new InlineKeyboard()
            .text('📝 Full Name', 'edit_field:fullName').row()
            .text('💬 Headline', 'edit_field:headline').row()
            .text('📖 Bio', 'edit_field:bio').row()
            .text('🖼️ Profile Photo', 'edit_field:photo').row()
            .text('🎓 Academic Info', 'edit_field:academic').row()
            .text('❌ Done', 'edit_field:done').row();

        const msg = await this.ctx.reply('What would you like to edit?', { reply_markup: kbd });

        const update = await this.conversation.waitForCallbackQuery(/edit_field:.*/, {
            otherwise: ctx => ctx.reply('Please select a field to edit', { reply_parameters: { message_id: msg.message_id } })
        });
        await update.answerCallbackQuery();
        await update.deleteMessage();
        return update.callbackQuery.data.split(':')[1];
    }

    private async editFullName(): Promise<string> {
        const msg = await this.ctx.reply(
            `Current name: *${this.user!.fullName}*\n\nEnter your new full name:`,
            { parse_mode: 'Markdown' }
        );
        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const name = update.message.text?.trim();
            if (name.split(' ').length >= 2 && name.length >= 2 && name.length <= 50) return name;
            await this.ctx.reply('Please provide first and last name, 2–50 characters.', {
                reply_parameters: { message_id: msg.message_id }
            });
        }
    }

    private async editHeadline(): Promise<string> {
        const msg = await this.ctx.reply(
            `Current headline: *${this.user!.headline}*\n\nEnter your new headline:`,
            { parse_mode: 'Markdown' }
        );
        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const headline = update.message.text?.trim();
            if (headline && headline.length >= 2 && headline.length <= 50) return headline;
            await this.ctx.reply('Please provide a headline, 2–50 characters.', {
                reply_parameters: { message_id: msg.message_id }
            });
        }
    }

    private async editBio(): Promise<string> {
        await this.ctx.reply(`Current bio:\n${this.user!.bio}\n\nEnter your new bio:`);
        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const bio = update.message.text?.trim();
            if (bio && bio.length >= 10 && bio.length <= 500) return bio;
            await this.ctx.reply('Bio must be 10–500 characters.');
        }
    }

    private async editPhoto(): Promise<string | null> {
        await this.ctx.reply('Send your new profile photo, or type /skip to keep the current one.');
        while (true) {
            const update = await this.conversation.waitFor(['message:text', 'message:photo']);
            if ('photo' in update.message && update.message.photo?.length) {
                return update.message.photo.at(-1)?.file_id ?? null;
            }
            if (update.message.text?.trim() === '/skip') return null;
        }
    }

    private async editUniversity(): Promise<string | null> {
        const universityList = await db.select().from(universities).orderBy(asc(universities.name)).limit(50);
        if (!universityList.length) {
            await this.ctx.reply('No universities available.');
            return null;
        }
        const kbd = new InlineKeyboard();
        for (const uni of universityList) {
            kbd.text(uni.name, `selected_uni:${uni.id}`).row();
        }
        const msg = await this.ctx.reply('🎓 Select your new university:', { reply_markup: kbd });
        const update = await this.conversation.waitForCallbackQuery(/selected_uni:.*/, {
            otherwise: ctx => ctx.reply('Please select a university', { reply_parameters: { message_id: msg.message_id } })
        });
        await update.answerCallbackQuery();
        await update.deleteMessage();
        return update.callbackQuery.data.split(':')[1];
    }

    private async editDepartment(): Promise<string | null> {
        const departmentList = await db.select().from(departments).orderBy(asc(departments.name)).limit(50);
        if (!departmentList.length) {
            await this.ctx.reply('No departments available.');
            return null;
        }
        const kbd = new InlineKeyboard();
        for (const dept of departmentList) {
            kbd.text(dept.name, `selected_dept:${dept.id}`).row();
        }
        const msg = await this.ctx.reply('Select your new department:', { reply_markup: kbd });
        const update = await this.conversation.waitForCallbackQuery(/selected_dept:.*/, {
            otherwise: ctx => ctx.reply('Please select a department', { reply_parameters: { message_id: msg.message_id } })
        });
        await update.answerCallbackQuery();
        await update.deleteMessage();
        return update.callbackQuery.data.split(':')[1];
    }

    private async editGraduationYear(): Promise<number | null> {
        await this.ctx.reply(`Current graduation year: ${this.user!.graduationYear}\n\nEnter your new graduation year:`);
        while (true) {
            const update = await this.conversation.waitFor('message:text');
            const year = Number(update.message.text?.trim());
            if (!Number.isNaN(year) && year >= 1900 && year <= 2100) return year;
            await this.ctx.reply('Please enter a valid year, e.g. 2025.');
        }
    }

    private async editAcademicInfo(): Promise<{ universityId: string; departmentId: string; graduationYear: number } | null> {
        await this.ctx.reply('📚 Let\'s update your academic info. All three fields (university, department, graduation year) must be filled.');

        const universityId = await this.editUniversity();
        if (!universityId) return null;

        const departmentId = await this.editDepartment();
        if (!departmentId) return null;

        const graduationYear = await this.editGraduationYear();
        if (!graduationYear) return null;

        return { universityId, departmentId, graduationYear };
    }

    async run(): Promise<void> {
        if (!this.user) {
            await this.ctx.reply('You are not registered yet. Use /start to register.');
            return;
        }

        while (true) {
            const field = await this.askWhatToEdit();
            if (!field || field === 'done') break;

            const updates: Partial<typeof users.$inferInsert> = {};

            switch (field) {
                case 'fullName':
                    updates.fullName = await this.editFullName();
                    break;
                case 'headline':
                    updates.headline = await this.editHeadline();
                    break;
                case 'bio':
                    updates.bio = await this.editBio();
                    break;
                case 'photo': {
                    const newPhoto = await this.editPhoto();
                    if (newPhoto) updates.profileImageId = newPhoto;
                    break;
                }
                case 'academic': {
                    const academic = await this.editAcademicInfo();
                    if (academic) {
                        updates.universityId = academic.universityId;
                        updates.departmentId = academic.departmentId;
                        updates.graduationYear = academic.graduationYear;
                    }
                    break;
                }
            }

            if (Object.keys(updates).length) {
                await db.update(users)
                    .set(updates)
                    .where(eq(users.telegramId, this.ctx.from!.id.toString()));
                this.user = { ...this.user!, ...updates };
                await this.ctx.reply('✅ Updated! Want to edit anything else?');
            }
        }

        await this.ctx.reply('✅ Profile update complete!');
    }
}

// Entry point
async function editProfile(conversation: Conversation, ctx: Context) {
    const user = await getUserByTelegramId(ctx.from!.id.toString());
    await new EditProfileConversation(conversation, ctx, user).run();
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

        await ctx.api.sendMessage(EDC_ADMIN_GROUP_ID, `Review this #${projectType} project:`, {
            message_thread_id: EDC_ADMIN_GROUP_PROJECT_TOPIC_ID,
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
        const msg = ctx.callbackQuery?.message;
        const tagEntity = msg?.entities?.find((entity) => entity.type === 'hashtag');
        if(!tagEntity) return;
        const tag = msg?.text?.slice(tagEntity.offset+1, tagEntity.offset + tagEntity.length);
        if(!tag) return;

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
                postLink: `/${EDC_CHANNEL_USERNAME.replace("@","")}/${msg[0].message_id}`,
                embeddingKey,
                tag,
                status: 'active'
            });
            const profileLink = `${process.env.NEXT_PUBLIC_APP_URL}/talents/${user.id}`;
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
        await ctx.reply('Usage: /link platform@username\nExample: /link github@johndoe\nAvailable platforms: ' + Object.keys(PLATFORMS).join(', '));
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
    const menu = new Menu<ConversationFlavor<Context>>('profile-visibility-menu');
    menu.dynamic(async (ctx: Context, range) => {
        const tgId = ctx.from?.id.toString();
        const user = await getUserByTelegramId(tgId!);
        const proileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/talents/${user!.id}`;

        const label = user?.isActive ? '🔒 Make Profile Private' : '🌐 Make Profile Public';
        range.webApp("🔗 Open Profile", proileUrl).row()
        range.text("✏️ Edit Profile", async (ctx) => {
            await ctx.conversation.enter('editProfile');
        }).row()
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


export { onboarding, getUserByTelegramId, serviceMenu, linkSocialAccount, profileVisibilityMenu, handleProjectSubmission, handleProjectReview, editProfile };
