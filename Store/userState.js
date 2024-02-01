import {atom} from "jotai";

export const isLogInAtom = atom(false);

export const userAtom = atom({
    userId: "1", password: "1", phoneNumber: "1",
    email: "1", address: "1", point: 1, recommendations:1,
    reusableUsed: 1, reusableReturned: 1, rating: "gold", admin: false
})

export const notification = atom(false);

export const isAdminAtom = atom(false);
