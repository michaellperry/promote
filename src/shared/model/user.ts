import { Jinaga as j, AuthorizationRules } from "jinaga";

export class User {
    static Type = 'Jinaga.User';
    type = User.Type;

    constructor(
        public publicKey: string
    ) { }
}

export class UserName {
    static Type = 'MyApplication.User.Name';
    type = UserName.Type;

    constructor(
        public user: User,
        public value: string,
        public prior: UserName[]
    ) { }

    static user(n: UserName) {
        (<any>n).has('user');
        return j.match(n.user);
    }

    static forUser(u: User) {
        return j.match(<UserName>{
            type: UserName.Type,
            user: u
        }).suchThat(UserName.isCurrent);
    }

    static isCurrent(n: UserName) {
        return j.notExists(<UserName>{
            type: UserName.Type,
            prior: [n]
        });
    }
}

export function authorizeUser(a: AuthorizationRules) {
    return (a
        .any(User.Type)
        .type(UserName.Type, j.for(UserName.user))
    );
}