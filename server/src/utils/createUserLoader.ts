import DataLoader from "dataloader";
import { User } from "../entities/User";

// keys -> [1, 7, 2]
// returns user for reach key [{id: 1, username: 'Kamil'}, {}, {}]

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userId) => userIdToUser[userId]);
  });
