import { Schema } from "mongoose";
import { User } from "../../interfaces";

const reqString = { type: String, required: true };

const Statistics = {
  exp: { type: Number, default: 0 },
  time: {
    voice: { type: Number, default: 0 }
  },
  games: {
    won: {
      skill: { type: Number, default: 0 },
      skins: { type: Number, default: 0 }
    }
  }
}

const ExtendedStatistics = {
  level: { type: Number, default: 0 },
  commands: { type: Number, default: 0 },
  ...Statistics
};

const userSchema = new Schema<User>({
  userId: reqString,
  tag: reqString,
  avatarUrl: reqString,
  followers: { type: [String], default: [] },
  activity: {
    voice: { type: Object, default: null }
  },
  stats: ExtendedStatistics,
  day: Statistics,
  week: Statistics,
  month: Statistics,
}, {
  timestamps: true
});

export default userSchema;