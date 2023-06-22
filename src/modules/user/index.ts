import mongoose, { Document } from "mongoose";
import { User, Guild } from "discord.js";
import { User as DatabaseUser } from "../../interfaces";
import userSchema from "../schemas/User";
import { ExtendedStatistics, ExtendedStatisticsPayload, Statistics } from "../../interfaces/User";
import ExtendedClient from "../../client/ExtendedClient";

const UserModel = mongoose.model("User", userSchema);

const expConstant: number = 0.3829;
const expInflationRate: number = 1;

const root = (x: number, n: number) => {
    return Math.pow(Math.E, Math.log(x) / n);
}

const expToLevel = (exp: number) => {
    return Math.floor(
        root(exp/expInflationRate, 3) * expConstant
    );
};

const levelToExp = (level: number) => {
    return Math.floor(
        Math.pow(level/expConstant, 3) * expInflationRate
    );
};

const createUser = async (user: User) => {
    const exists = await UserModel.findOne({ userId: user.id });
    if(exists) return exists;

    const newUser = new UserModel({
        userId: user.id,
        tag: user.tag,
        avatarUrl: user.displayAvatarURL({ extension: "png" })
    });

    await newUser.save();
    return newUser;
}

const deleteUser = async (user: User) => {
    const exists = await UserModel.findOne({ userId: user.id });
    if(!exists) return new Error("User not found");

    await UserModel.deleteOne({ userId: user.id });
    return true;
}

const getUser = async (user: User) => {
    const exists = await UserModel.findOne({ userId: user.id });
    if(!exists) return new Error("User not found");

    return exists;
}

const getUserRank = async (user: DatabaseUser) => {
    const exists = await UserModel.findOne({ userId: user.userId });
    if(!exists) return new Error("User not found");

    const users = await UserModel.find();
    const sorted = users.sort((a, b) => b.stats.exp - a.stats.exp);
    const rank = sorted.findIndex(u => u.userId === user.userId) + 1;

    return rank;
};

const getUsers = async () => {
    const users = await UserModel.find();
    return users;
}

const createUsers = async (guild: Guild) => {
    const members = await guild.members.fetch();
    const users = members.map(member => member.user).filter(user => !user.bot);
    const created: DatabaseUser[] = [];

    for await (const user of users) {
        const newUser = await createUser(user);
        created.push(newUser);
    }

    return created;
}

const updateUser = async (user: User) => {
    let exists = await UserModel.findOne({ userId: user.id });
    if(!exists) {
        exists = await createUser(user);
    }

    await UserModel.updateOne({ userId: user.id }, {
        tag: user.tag,
        avatarUrl: user.displayAvatarURL({ extension: "png" })
    });

    return exists;
}

const updateUserStatistics = async (client: ExtendedClient, user: User, extendedStatisticsPayLoad: ExtendedStatisticsPayload) => {
    const userSource = await updateUser(user) as DatabaseUser & Document;
    const newExtendedStatistics: ExtendedStatistics = {
        level: userSource.stats.level + (extendedStatisticsPayLoad.level || 0),
        exp: userSource.stats.exp + (extendedStatisticsPayLoad.exp || 0),
        time: {
            voice: userSource.stats.time.voice + (extendedStatisticsPayLoad.time?.voice || 0)
        },
        commands: userSource.stats.commands + (extendedStatisticsPayLoad.commands || 0),
        games: {
            won: {
                skill: userSource.stats.games.won.skill + (extendedStatisticsPayLoad.games?.won?.skill || 0),
                skins: userSource.stats.games.won.skins + (extendedStatisticsPayLoad.games?.won?.skins || 0),
            }
        }
    };
    const day: Statistics = {
        exp: userSource.day.exp + (extendedStatisticsPayLoad.exp || 0),
        time: {
            voice: userSource.day.time.voice + (extendedStatisticsPayLoad.time?.voice || 0)
        },
        games: {
            won: {
                skill: userSource.day.games.won.skill + (extendedStatisticsPayLoad.games?.won?.skill || 0),
                skins: userSource.day.games.won.skins + (extendedStatisticsPayLoad.games?.won?.skins || 0) 
            }
        }
    }
    const week: Statistics = {
        exp: userSource.week.exp + (extendedStatisticsPayLoad.exp || 0),
        time: {
            voice: userSource.week.time.voice + (extendedStatisticsPayLoad.time?.voice || 0)
        },
        games: {
            won: {
                skill: userSource.week.games.won.skill + (extendedStatisticsPayLoad.games?.won?.skill || 0),
                skins: userSource.week.games.won.skins + (extendedStatisticsPayLoad.games?.won?.skins || 0)
            }
        }
    }
    const month: Statistics = {
        exp: userSource.month.exp + (extendedStatisticsPayLoad.exp || 0),
        time: {
            voice: userSource.month.time.voice + (extendedStatisticsPayLoad.time?.voice || 0)
        },
        games: {
            won: {
                skill: userSource.month.games.won.skill + (extendedStatisticsPayLoad.games?.won?.skill || 0),
                skins: userSource.month.games.won.skins + (extendedStatisticsPayLoad.games?.won?.skins || 0)
            }
        }
    }

    userSource.stats = newExtendedStatistics;
    userSource.day = day;
    userSource.week = week;
    userSource.month = month;

    let userLeveledUpDuringUpdate: boolean = false; // Flag

    if(userSource.stats.exp >= levelToExp(userSource.stats.level + 1)) // When exceed exp needed to level up
        userLeveledUpDuringUpdate = true; // Mark flag to emit event

    userSource.stats.level = expToLevel(userSource.stats.exp); // Update level

    await userSource.save();

    if(userLeveledUpDuringUpdate) await client.emit("userLeveledUp", userSource, user); // Emitting event

    return userSource;
};

const everyUser = async (client: ExtendedClient, callback: (user: DatabaseUser & Document) => void) => {
    const users = await getUsers();
    for await (const user of users) {
        await callback(user);
    }
}

const clearTemporaryStatistics = async (client: ExtendedClient, type: string) => {
    const blankTemporaryStatistic = {
        exp: 0,
        time: {
            voice: 0,
            presence: 0
        },
        games: {
            won: {
                skill: 0,
                skins: 0
            }
        }
    };

    everyUser(client, async (sourceUser) => {
        switch(type) {
            case "day":
                sourceUser.day = blankTemporaryStatistic;
                break;
            case "week":
                sourceUser.week = blankTemporaryStatistic;
                break;
            case "month":
                sourceUser.month = blankTemporaryStatistic;
                break;
        }
        await sourceUser.save();
    });
};

export { createUser, deleteUser, getUser, getUserRank, getUsers, createUsers, updateUser, updateUserStatistics, expToLevel, levelToExp, everyUser, clearTemporaryStatistics, UserModel };