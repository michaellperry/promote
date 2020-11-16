import { AuthorizationRules, ensure, Jinaga as j } from "jinaga";
import { User } from "./user";

export class Domain {
    static Type = 'MyApplication.Domain';
    type = Domain.Type;

    constructor(
        public identifier: string
    ) { }
}

export class Visit {
    static Type = 'MyApplication.Visit';
    type = Visit.Type;

    constructor(
        public domain: Domain,
        public user: User,
        public time: Date | string
    ) { }

    static inDomain(d: Domain) {
        return j.match(<Visit>{
            type: Visit.Type,
            domain: d
        });
    }

    static user(v: Visit) {
        ensure(v).has("user");
        return j.match(v.user);
    }
}

export function authorizeVisit(a: AuthorizationRules) {
    return (a
        .any(Domain.Type)
        .type(Visit.Type, j.for(Visit.user))
    );
}